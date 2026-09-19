#!/bin/bash
# deploy-tunnel.sh — autonomous public deployment pipeline
# Architecture: jeeforge.lege.workers.dev (Worker proxy) -> trycloudflare tunnel -> gateway :81
# Token lives in .env (gitignored). Status written to /tmp/deploy-status
set -u
cd /home/z/my-project
mkdir -p bin
STATUS=/tmp/deploy-status
echo "RUNNING $(date)" > $STATUS

# --- load secrets ---
export CF_API_TOKEN=$(grep '^CF_API_TOKEN=' .env | cut -d'"' -f2)
export CF_ACCOUNT_ID=$(grep '^CF_ACCOUNT_ID=' .env | cut -d'"' -f2)
if [ -z "$CF_API_TOKEN" ] || [ -z "$CF_ACCOUNT_ID" ]; then echo "FAILED: missing CF creds" >> $STATUS; exit 1; fi

# --- phase 1: cloudflared binary ---
if [ ! -x bin/cloudflared ]; then
  echo "PHASE1 downloading cloudflared" >> $STATUS
  curl -sL --max-time 240 -o bin/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  chmod +x bin/cloudflared
fi
bin/cloudflared --version >> $STATUS 2>&1 || { echo "FAILED: cloudflared binary" >> $STATUS; exit 1; }
echo "PHASE1 ok" >> $STATUS

# --- phase 2: start quick tunnel to gateway :81 ---
pkill -f "cloudflared tunnel --url" 2>/dev/null
sleep 1
rm -f /tmp/cf-tunnel.log
nohup bin/cloudflared tunnel --url http://localhost:81 --no-autoupdate --logfile /tmp/cf-tunnel.log >/dev/null 2>&1 &
echo "PHASE2 tunnel launched pid=$!" >> $STATUS

TUNNEL_URL=""
for i in $(seq 1 90); do
  TUNNEL_URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cf-tunnel.log 2>/dev/null | head -1)
  [ -n "$TUNNEL_URL" ] && break
  sleep 2
done
if [ -z "$TUNNEL_URL" ]; then echo "FAILED: no tunnel url after 180s" >> $STATUS; tail -5 /tmp/cf-tunnel.log >> $STATUS; exit 1; fi
echo "PHASE2 url=$TUNNEL_URL" >> $STATUS
echo "$TUNNEL_URL" > /tmp/tunnel-url

# --- phase 3: deploy proxy worker (idempotent) ---
cat > /tmp/worker.js << 'WEOF'
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const target = env.TUNNEL_URL + url.pathname + url.search;
    return fetch(new Request(target, request));
  }
}
WEOF
cat > /tmp/worker-meta.json << MEOF
{"main_module":"worker.js","compatibility_date":"2024-09-01","bindings":[{"type":"plain_text","name":"TUNNEL_URL","text":"$TUNNEL_URL"}]}
MEOF
echo "PHASE3 deploying worker" >> $STATUS
HTTP=$(curl -s -o /tmp/worker-deploy.json -w '%{http_code}' -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/workers/scripts/jeeforge" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -F "metadata=@/tmp/worker-meta.json;type=application/json" \
  -F "worker.js=@/tmp/worker.js;type=application/javascript+module")
if [ "$HTTP" != "200" ]; then echo "FAILED: worker deploy HTTP $HTTP" >> $STATUS; cat /tmp/worker-deploy.json >> $STATUS; exit 1; fi
echo "PHASE3 worker deployed" >> $STATUS

# --- phase 4: enable workers.dev subdomain route ---
HTTP=$(curl -s -o /tmp/worker-sub.json -w '%{http_code}' -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/workers/scripts/jeeforge/subdomain" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"enabled":true,"previews_enabled":false}')
echo "PHASE4 subdomain HTTP $HTTP" >> $STATUS
grep -o '"subdomain"[^,]*' /tmp/worker-sub.json >> $STATUS 2>/dev/null

# --- phase 5: verify public URL ---
sleep 5
PUB="https://jeeforge.lege.workers.dev"
for i in $(seq 1 12); do
  CODE=$(curl -s -o /tmp/pub-check.html -w '%{http_code}' --max-time 15 "$PUB")
  [ "$CODE" = "200" ] && break
  sleep 5
done
if [ "$CODE" = "200" ]; then
  echo "UP $PUB (tunnel $TUNNEL_URL)" > $STATUS
  echo "UP $PUB"
else
  echo "PARTIAL worker up but public check HTTP $CODE" >> $STATUS
fi
