#!/bin/bash
# tunnel-keepalive.sh — eternal supervisor for the public deployment
# - ensures cloudflared quick tunnel stays up (restarts if dead)
# - if tunnel URL changed on restart, re-deploys the proxy Worker with new TUNNEL_URL
# - logs to /tmp/keepalive.log | state in /tmp/tunnel-url
cd /home/z/my-project
CF_API_TOKEN=$(grep '^CF_API_TOKEN=' .env | cut -d'"' -f2)
CF_ACCOUNT_ID=$(grep '^CF_ACCOUNT_ID=' .env | cut -d'"' -f2)
KNOWN_URL=$(cat /tmp/tunnel-url 2>/dev/null || echo "")

ensure_tunnel() {
  if pgrep -f "cloudflared tunnel --url" > /dev/null; then
    # alive — check the URL it's serving
    CUR=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cf-tunnel.log 2>/dev/null | head -1)
    if [ -n "$CUR" ]; then
      if [ "$CUR" != "$KNOWN_URL" ]; then
        echo "$(date) tunnel URL changed $KNOWN_URL -> $CUR" >> /tmp/keepalive.log
        echo "$CUR" > /tmp/tunnel-url
        KNOWN_URL=$CUR
        update_worker "$CUR"
      fi
      return 0
    fi
  fi
  # dead or no URL — (re)start
  echo "$(date) (re)starting tunnel" >> /tmp/keepalive.log
  pkill -f "cloudflared tunnel --url" 2>/dev/null
  sleep 2
  rm -f /tmp/cf-tunnel.log
  nohup bin/cloudflared tunnel --url http://localhost:81 --no-autoupdate --logfile /tmp/cf-tunnel.log >/dev/null 2>&1 &
  # wait up to 120s for URL
  for i in $(seq 1 60); do
    CUR=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cf-tunnel.log 2>/dev/null | head -1)
    [ -n "$CUR" ] && break
    sleep 2
  done
  if [ -n "$CUR" ] && [ "$CUR" != "$KNOWN_URL" ]; then
    echo "$CUR" > /tmp/tunnel-url
    KNOWN_URL=$CUR
    update_worker "$CUR"
  fi
}

update_worker() {
  local U=$1
  echo "$(date) re-pointing worker to $U" >> /tmp/keepalive.log
  cat > /tmp/worker.js << 'WEOF'
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const target = env.TUNNEL_URL + url.pathname + url.search;
    return fetch(new Request(target, request));
  }
}
WEOF
  printf '{"main_module":"worker.js","compatibility_date":"2024-09-01","bindings":[{"type":"plain_text","name":"TUNNEL_URL","text":"%s"}]}' "$U" > /tmp/worker-meta.json
  curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/workers/scripts/jeeforge" \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -F "metadata=@/tmp/worker-meta.json;type=application/json" \
    -F "worker.js=@/tmp/worker.js;type=application/javascript+module" > /dev/null
  echo "$(date) worker re-deploy result=$?" >> /tmp/keepalive.log
}

# main loop — also make sure gateway-facing services are alive
while true; do
  ensure_tunnel
  # keep both app servers breathing (no-op if already up)
  curl -s -o /dev/null --max-time 5 localhost:3000/api/health || echo "$(date) WARN :3000 down" >> /tmp/keepalive.log
  curl -s -o /dev/null --max-time 5 localhost:3003/health || echo "$(date) WARN :3003 down" >> /tmp/keepalive.log
  sleep 30
done
