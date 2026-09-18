# JEEForge — Deployment Guide

The platform is production-ready. Current live deployment:

| Piece | Status | Where |
|---|---|---|
| Public landing + schedule | ✅ LIVE | https://jeeforge-static.onrender.com (Render static site, auto-deploys from `main`) |
| Source code | ✅ LIVE | https://github.com/claude20782-collab/jeeforge |
| Production database | ✅ READY | Supabase Postgres (ap-southeast-1) — schema pushed, seeded, RLS-locked |
| Full interactive app (auth/CBT/solutions/analytics/community/admin) | ✅ runs in dev sandbox; Render web-service deploy is **blocked by billing** (card required on the workspace for dynamic services — static sites deploy fine) |

## One-click full deployment (when hosting is unblocked)

Everything is prepared. Two services to create on Render (or any Node host):

### 1. Web service (`jeeforge`)
- **Repo/branch**: `claude20782-collab/jeeforge` @ `main`
- **Build command**:
  ```
  npm install -g bun --silent && bun install && bunx prisma generate --schema prisma/schema.production.prisma && bunx prisma db push --schema prisma/schema.production.prisma --accept-data-loss && bun scripts/seed.ts && bun run build
  ```
  (db push + seed are idempotent; seed publishes any mock that passes validation)
- **Start command**: `bun run start`  (standalone Next server, honors `$PORT`)
- **Env vars**:
  - `DATABASE_URL` = Supabase session-pooler URL (`postgresql://postgres.<ref>:<pw>@aws-0-<region>.pooler.supabase.com:5432/postgres`)
  - `JWT_SECRET` = long random hex (32+ bytes)
  - `INTERNAL_API_KEY` = random hex (shared with chat service)
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD` = seeded admin credentials
  - `CHAT_INTERNAL_URL` = `https://<chat-service>.onrender.com` (used by API routes to broadcast to sockets)
  - `NEXT_PUBLIC_CHAT_URL` = `https://<chat-service>.onrender.com` (used by the browser for socket.io; MUST be set at build time)

### 2. Web service (`jeeforge-chat`)
- **Root directory**: `mini-services/chat-service`
- **Build command**:
  ```
  npm install -g bun --silent && bun install && bunx prisma generate --schema prisma/schema.production.prisma
  ```
- **Start command**: `bun index.ts` (honors `$PORT`)
- **Env vars**: `DATABASE_URL` (same), `JWT_SECRET` (same), `INTERNAL_API_KEY` (same), `NODE_ENV=production`

### Notes
- `prisma/schema.prisma` (SQLite) is the sandbox/dev schema; `prisma/schema.production.prisma` (Postgres) is identical models for Supabase. Raw SQL in the app is dialect-portable (`TRUE/FALSE` boolean literals).
- The chat service PRAGMAs auto-skip on Postgres; SQLite WAL + retry handle the sandbox's multi-process access.
- The production DB already has: admin user, 63 chapters/225 topics, the 40-mock schedule, and Mock 01 (75 questions + solutions) **published**. All tables have RLS enabled with no anon grants (PostgREST cannot read them).
- Re-running the seed on any deploy is safe and publishes newly completed mock banks.

## Local development
```
bun install
bun run db:push        # SQLite (sandbox)
bun scripts/seed.ts    # syllabus + 40 mocks + published banks
bun run dev            # app on :3000
cd mini-services/chat-service && bun install && bun run dev   # chat on :3003
```
