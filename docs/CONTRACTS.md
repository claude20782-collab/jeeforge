# CONTRACTS.md — Frozen API & File Ownership (v1)

Read `worklog.md` first. All agents code against `src/lib/types.ts` (frozen shapes) and this doc.

## Global rules
- Next.js 16 App Router, TypeScript strict. **No new pages** under `src/app/` except `page.tsx` (already owned by orchestrator) — all UI is the SPA at `/`.
- Backend = API routes under `src/app/api/**` only. No server actions.
- Prisma: `import { db } from '@/lib/db'`. **NEVER edit `prisma/schema.prisma`** (orchestrator-only; request changes via worklog).
- Dev server already runs on :3000 in background. NEVER start another, NEVER run `bun run build`. Run `bun run lint` before finishing.
- All responses JSON. Errors: `{ "error": "message" }` + proper status. Auth via httpOnly cookie `jee_session` (JWT; helpers in `src/lib/auth.ts`: `requireUser()`, `requireAdmin()`, `getSessionUser()`).
- Rate limit auth-sensitive endpoints with `src/lib/rate-limit.ts` (`rateLimit(key, limit, windowMs)`, `clientIp(req)`).
- Suspended/banned users: `getSessionUser()` returns null (treated as logged out). Ban/suspend takes effect immediately.
- Timezone: mocks unlock at `scheduledAt` (stored UTC = 00:00 IST of the date). Display times in IST.
- Question text/solutions are markdown with `$...$`/`$$...$$` LaTeX. Render with `src/components/markdown.tsx` (KaTeX). Sanitize: React escapes by default; do NOT use dangerouslySetInnerHTML for user content. Chat content: render as PLAIN TEXT with newlines preserved (no markdown injection).
- File ownership (do not touch other agents' files):
  - A (backend): `src/app/api/**` (except `src/app/api/health/route.ts`), `src/lib/ist.ts` if needed
  - B (chat service): `mini-services/chat-service/**` ONLY
  - C: `src/components/views/{landing,auth,dashboard,mocks}/**`, `src/components/app/**`
  - D: `src/components/views/cbt/**`
  - E: `src/components/views/results/**`
  - F: `src/components/views/community/**`, `src/components/views/profile/**`, `src/components/chat/**`
  - G: `src/components/views/admin/**`
  - Orchestrator: `src/app/page.tsx`, `src/app/layout.tsx`, `src/lib/{types,api,auth,scoring,mock-validation,api-helpers,rate-limit,store,router,format}.ts`, `src/components/{markdown.tsx, diagram/**}`, `src/content/**`, `prisma/**`, `scripts/**`

## REST endpoints (backend agent A implements; frontend agents consume)

### Auth — `/api/auth/*`
- `POST /api/auth/register` `{email, username, password, displayName?}` → `{user: PublicUser}` (sets cookie; rate limit 10/h/IP; username/email unique → 409)
- `POST /api/auth/login` `{emailOrUsername, password}` → `{user: PublicUser}` (rate limit 15/10min/IP; generic error message)
- `POST /api/auth/logout` → `{ok:true}` (revokes session)
- `GET /api/auth/me` → `{user: PublicUser|null}` (user includes email ONLY here)
- `POST /api/auth/change-password` `{currentPassword,newPassword}` → `{ok}` (revokes other sessions)
- `POST /api/auth/forgot-password` `{email}` → `{ok:true, message}` — always respond ok (no user enumeration); message explains email delivery is not configured on this deployment and to contact an admin.
- `POST /api/auth/reset-password` `{token,newPassword}` → `{ok}` (token from admin; uses PasswordResetToken hashed with sha256)

### Mocks & attempts
- `GET /api/mocks` → `{mocks: MockSummary[]}` ordered by mockNumber. `unlocked` requires status PUBLISHED and scheduledAt<=now. `participantCount` = submitted attempts. Include `myAttempt` when logged in. DRAFT mocks show title/schedule but `unlocked:false`.
- `GET /api/mocks/[id]` → `{mock: MockSummary}` (+404 if absent)
- `POST /api/mocks/[id]/attempts` → `{attempt: AttemptFull}` — requires auth; mock PUBLISHED; `scheduledAt<=now` OR role ADMIN (admin preview allowed pre-unlock); no existing attempt (409 if already submitted with existing attemptId in error data). Creates deadlineAt=now+180min. `questions`: all 75 in order WITHOUT correctAnswer/solution. Log `ip`,`userAgent`; set suspiciousFlags if user has >1 active session (`countActiveSessions`).
- `GET /api/attempts/[id]` → `{attempt: AttemptFull}` — owner only. If IN_PROGRESS and now>deadline → auto-submit first (status SUBMITTED, autoSubmitted true).
- `PUT /api/attempts/[id]/answers` `{questionId, selectedAnswer?:string|null, markedForReview?:boolean, visited?:boolean, timeDeltaSeconds?:number}` → `{ok, remainingSeconds}` — owner only; only while IN_PROGRESS and now<=deadline (else 410 + auto-submit). selectedAnswer null clears. timeDeltaSeconds clamped [0,120] per call, accumulate.
- `POST /api/attempts/[id]/submit` `{reason?:'USER'|'AUTO'}` → `{ok, resultId: attemptId}` — idempotent if already submitted. Server-side scoring: per question `checkAnswer` (lib/scoring), compute score, subject scores, counts, accuracy (correct/(correct+wrong)*100 or null), timeUsedSeconds.
- `GET /api/attempts/[id]/result` → `{result: ResultFull}` (see types; `rank` computed live: count of submitted attempts with score > mine, ties → earlier submittedAt wins; `totalParticipants`). Owner only.
- `GET /api/attempts/[id]/analysis` → `{analysis: AnalysisFull}` — timeBuckets: fast≤45s, slow≥120s (correct fast = correct & time≤45; correct slow = correct & time≥120; similarly wrong; >2/3/5min lists from timeSpentSeconds). chapters/topics/difficulty/subjects per types. `potentialScore`: current score + Σ over wrong questions where mistakeTag ∈ AVOIDABLE_TAGS of +5 each.
- `GET /api/attempts/[id]/solutions` → `{solutions: SolutionItem[]}` all 75 in order (client filters).
- `POST /api/attempts/[id]/mistake-tag` `{questionId, tag: MistakeTag|null}` → `{ok}` — only for wrong/unattempted questions of own submitted attempt.

### Leaderboard
- `GET /api/leaderboard?scope=current|weekly|monthly|overall|allmock&mockId?` → `LeaderboardResponse`
  - current: single mock (mockId or latest unlocked mock), best attempt per user, rank by score desc, accuracy desc, submittedAt asc. Excludes users with leaderboardVisible=false (if user opted out, me.rank=null).
  - weekly: submitted attempts with submittedAt in current IST week (`istWeekStart`), user's best score in window.
  - monthly: current IST month (`istMonthStart`).
  - overall (all-time): aggregate per user: total score across all attempts, accuracy overall, attempts count, avg time; rank by total score.
  - allmock: per-user: average score (min 1 attempt), accuracy, attempts.
  - Max 100 entries. Respect `leaderboardVisible=false`.

### Profile & settings
- `GET /api/profiles/[username]` → `{profile: PublicProfile}` — public unless profilePublic=false (then 403 for non-self). `stats.streak` via `computeStreak`. `blocked` = whether viewer blocked owner.
- `PUT /api/me` `{displayName?, bio?(≤500), targetYear?(2027..2030), avatarUrl?(data:image/* ≤200KB), profilePublic?, leaderboardVisible?}` → `{user: PublicUser}`

### Groups
- `GET /api/groups?filter=all|mine` → `{groups: GroupDTO[]}` — all public + own (incl. private). unreadCount = messages by others after member.lastReadAt. lastMessagePreview truncated 80 chars.
- `POST /api/groups` `{name(3-60), description?(≤300), isPrivate}` → `{group: GroupDTO}` — creator becomes OWNER. rate limit 5/h/user.
- `GET /api/groups/[id]` → `{group: GroupDTO, members: GroupMemberDTO[]}` — private groups: members only see detail.
- `POST /api/groups/[id]/join` → `{ok}` — public groups only.
- `POST /api/groups/[id]/invite` `{username}` → `{ok}` — OWNER/MODERATOR only, for private groups.
- `POST /api/groups/[id]/leave` → `{ok}` (owner leaving transfers to earliest member or deletes group if empty).
- `POST /api/groups/[id]/mute` `{muted: boolean}` → `{ok}`
- `GET /api/groups/[id]/messages?before=<ISO>&limit=50` → `{messages: ChatMessageDTO[], hasMore}` — members only; ascending; `before` cursor for older. Deleted → `deleted:true`, content "message removed by moderator".
- `POST /api/groups/[id]/messages` `{content(1..2000), replyToId?}` → `{message: ChatMessageDTO}` — members only. After persist: fire-and-forget `POST http://localhost:3003/internal/broadcast` header `x-internal-key` body `{event:'group:message:new', room:'group:'+groupId, payload: messageDTO}`; create mention notifications (@username regex) + group-message notifications (only if group ≤50 members, skip muted members).

### DMs
- `GET /api/conversations` → `{conversations: ConversationDTO[]}` ordered by lastMessageAt desc.
- `POST /api/conversations` `{username}` → `{conversation: ConversationDTO}` — 403 if blocked either way; 404 unknown; no self-DM.
- `GET /api/conversations/[id]/messages?before=&limit=50` → `{messages, hasMore}` — participants only.
- `POST /api/conversations/[id]/messages` `{content(1..2000)}` → `{message: ChatMessageDTO}` — participants; 403 if blocked; update lastMessageAt; DIRECT_MESSAGE notification for recipient; internal broadcast `dm:message:new` room `user:<recipientId>`.
- `POST /api/conversations/[id]/read` → `{ok}`.

### Notifications / blocks / reports
- `GET /api/notifications?unreadOnly=true&limit=50` → `{notifications: NotificationDTO[], unreadCount}`
- `POST /api/notifications/read` `{ids?: string[], all?: boolean}` → `{ok}`
- `GET /api/blocks` → `{blocked: [{username, since}]}`
- `POST /api/blocks` `{username}` → `{ok}` ; `DELETE /api/blocks` `{username}` → `{ok}`
- `POST /api/reports` `{targetType, targetUserId?, targetMessageId?, targetGroupId?, reason, details?}` → `{ok}` rate limit 10/h.

### Admin (role=ADMIN only — 403 otherwise; log to ModerationAction)
- `GET /api/admin/overview` → `{counts:{users,activeToday,attempts,submittedAttempts,publishedMocks,draftMocks,openReports,groups}, avgScore, participation:[{mockNumber,title,attempts,avgScore}], recentUsers:[], recentAttempts:[], recentReports:[]}`
- `GET /api/admin/mocks` → `{mocks: (MockSummary & {validation: MockValidation|null, counts:{total,physics,chemistry,maths,withDiagram}})[]}`
- `POST /api/admin/mocks` `{mockNumber, title, scheduledAt}` → `{mock}`
- `PUT /api/admin/mocks/[id]` `{title?, scheduledAt?}` → `{mock}`
- `POST /api/admin/mocks/[id]/validate` → `{validation: MockValidation}`
- `POST /api/admin/mocks/[id]/publish` → `{ok, validation}` — publish ONLY if validation passes.
- `POST /api/admin/mocks/[id]/unpublish` → `{ok}`
- `GET /api/admin/mocks/[id]/questions` → `{questions: AdminQuestionDTO[]}`
- `POST /api/admin/questions` full fields → `{question}` — validates shapes; contentHash via `contentHashOf` (409 duplicate).
- `PUT /api/admin/questions/[id]` same → `{question}` (403 if used in PUBLISHED mock)
- `DELETE /api/admin/questions/[id]` → `{ok}` (same rule)
- `POST /api/admin/mocks/[id]/questions` `{questionId, order}` → `{ok}` — slot subject mapping enforced (1-25 P, 26-50 C, 51-75 M).
- `DELETE /api/admin/mocks/[id]/questions/[questionId]` → `{ok}`
- `GET /api/admin/chapters` → `{chapters:[{id,subject,slug,name,topics:[{id,slug,name}]}]}`
- `GET /api/admin/users?q=&page=` → `{users:[{id,username,email,role,status,createdAt,lastActiveAt,attemptCount,mockCount}], total}` — NEVER passwordHash.
- `POST /api/admin/users/[id]/status` `{status, note}` → `{ok}` — revokes sessions on SUSPENDED/BANNED.
- `POST /api/admin/users/[id]/reset-password` → `{token}` — 24h PasswordResetToken (sha256-hashed). Log action.
- `GET /api/admin/reports?status=` → `{reports:[{...report, reporterUsername, targetUsername?, snippet?}]}`
- `POST /api/admin/reports/[id]/resolve` `{resolution, note}` → `{ok}` + REPORT_STATUS notification to reporter.
- `GET /api/admin/groups` → `{groups:[{...GroupDTO, messageCount}]}`
- `DELETE /api/admin/group-messages/[id]` / `DELETE /api/admin/direct-messages/[id]` → `{ok}` (soft delete + log)
- `POST /api/admin/announce` `{title, body, mockId?}` → `{ok, recipients}` — MOCK_ANNOUNCEMENT to all ACTIVE users.
- `GET /api/admin/analytics` → `{questionStats:[{id,text(120),subject,difficulty,attempts,correctRate,avgTimeSeconds,mockNumbers[]}], subjectAverages, difficultyAverages, scoreDistribution}` (questions with attempts ≥ 10)

### Health
- `GET /api/health` → `{ok:true, now}` (public)

## Chat service (agent B) — `mini-services/chat-service`
- Standalone bun project, own package.json (socket.io, @prisma/client, jose), entry `index.ts`, **port 3003 in sandbox** (`process.env.PORT ?? 3003`).
- Own `prisma/schema.prisma` = COPY of root schema (same models) pointing to the SAME SQLite file. **Do not edit root schema.** `bunx prisma generate --schema prisma/schema.prisma`.
- SQLite WAL for multi-process access: run `PRAGMA journal_mode=WAL` once on the db file (orchestrator does this; service should also set `journal_mode` via PRAGMA on init if possible — @prisma/client can't run PRAGMA; instead the service opens better-sqlite3? NO — keep it simple: orchestrator sets WAL on the db file, it persists in the file).
- Auth: `io("/?XTransformPort=3003", { auth: { token } })`; verify JWT with `JWT_SECRET` env (jose). Look up user (must be ACTIVE).
- Rooms: connect → join `user:<userId>`. `group:join(groupId)` — verify membership then join `group:<groupId>`; `group:leave(groupId)`.
- Events (see SocketEvents in types.ts):
  - `group:message(groupId, content, replyToId?)` → validate membership, content 1..2000, persist GroupMessage, emit `group:message:new` to room; sender's member.lastReadAt=now; mention notifications (@username) + group-message notifications (≤50 member groups, skip muted); emit `notification:new` to user rooms.
  - `dm:send(conversationId, content)` → verify participant + no block; persist; emit `dm:message:new` (payload includes conversationId) to both user rooms; DIRECT_MESSAGE notification to recipient.
  - `group:typing(groupId)` / `dm:typing(conversationId)` → broadcast typing (throttle ~3s).
  - `group:read(groupId)` / `dm:read(conversationId)` → update read state.
- Internal HTTP API (same port, plain node http or tiny express): `POST /internal/broadcast` header `x-internal-key` = env INTERNAL_API_KEY → `{event, room, payload}` emit. `GET /health`.
- Presence: track usernames per group room → `presence:update {onlineUsernames}`.
- package.json: `"dev": "bun --hot index.ts"`, `"start": "bun index.ts"`. Start in background: `cd mini-services/chat-service && bun install && (nohup bun run dev > service.log 2>&1 &)`.
- CORS: `cors: { origin: true, credentials: true }`.

## Frontend contracts (agents C–G)
- SPA root: `src/app/page.tsx` → `<AppRoot/>` from `src/components/app/root.tsx` (orchestrator). Views render based on hash route.
- Orchestrator provides: `src/lib/router.ts` (`useHashRoute()`, `navigate()`, `Link`), `src/lib/store.ts` (session, toasts), `src/lib/format.ts` (time/number formatting, IST), `src/components/markdown.tsx`, `src/components/diagram/index.tsx` (`<QuestionDiagram spec>`), `src/components/app/avatar.tsx`.
- Routes (file ownership):
  - `#/` landing, `#/login`, `#/signup`, `#/forgot-password`, `#/reset-password?token=` (C)
  - `#/dashboard`, `#/mocks`, `#/mock/:id` (C)
  - `#/test/:attemptId` CBT — full-screen minimal chrome (D)
  - `#/result/:attemptId`, `#/solutions/:attemptId`, `#/analysis/:attemptId`, `#/progress`, `#/leaderboard` (E)
  - `#/community`, `#/group/:id`, `#/dm`, `#/dm/:conversationId`, `#/notifications`, `#/profile/:username`, `#/settings` (F)
  - `#/admin`, `#/admin/mocks`, `#/admin/mocks/:id`, `#/admin/questions`, `#/admin/users`, `#/admin/reports`, `#/admin/community`, `#/admin/analytics` (G)
- Fetch with `api` from `src/lib/api.ts`; TanStack Query for server state; zustand for client state.
- Chat socket client util (F): `src/components/chat/socket.ts` — connects `io("/?XTransformPort=3003", { auth: { token: getJwtToken() } })`. JWT token: on login/register, backend ALSO returns `accessToken` (same JWT) in the JSON body for socket auth. (Agent A: include `accessToken` in login/register/me responses.)
- Design: shadcn components + CSS vars; dark-first; gold accent; JEE palette colors only in CBT palette/solution filters. Mobile-first; tablet-polished CBT.
- Loading/error/empty states everywhere; sonner toasts; framer-motion subtle.

## Content pipeline (orchestrator)
- `src/content/banks/mock-XX/*.ts` export `SeedQuestion[]`; `scripts/seed.ts` upserts chapters/topics/mocks/questions, attaches to slots, validates, auto-publishes ONLY when validation passes.
