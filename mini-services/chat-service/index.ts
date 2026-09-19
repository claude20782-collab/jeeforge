// ============================================================================
// chat-service — socket.io chat microservice (port process.env.PORT ?? 3003)
// Contract: /home/z/my-project/docs/CONTRACTS.md ("Chat service (agent B)") and
// src/lib/types.ts (SocketEvents, ChatMessageDTO, NotificationDTO).
//
// Client connection (browser, through the sandbox gateway):
//   io("/?XTransformPort=3003", { auth: { token } })   // default engine path /socket.io
//
// Internal HTTP API (same http server, used by the Next.js backend):
//   GET  /health
//   POST /internal/broadcast  header x-internal-key: <INTERNAL_API_KEY>
//                            body { event, room, payload }
// ============================================================================
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { Server as SocketIOServer, type Socket } from 'socket.io'
import { db, withRetry } from './lib/db'
import { authenticateSocket, cookieToken, type SocketAuthUser } from './lib/auth'
import {
  extractMentions,
  toDirectMessageDTO,
  toGroupMessageDTO,
  toNotificationDTO,
  truncate,
  type ChatMessageDTO,
  type NotificationCreateData,
  type NotificationDTO,
} from './lib/dto'
import { INTERNAL_API_KEY, PORT } from './lib/env'

const log = (...a: unknown[]) => console.log(new Date().toISOString(), ...a)
const warn = (...a: unknown[]) => console.warn(new Date().toISOString(), '[warn]', ...a)

// ---------------------------------------------------------------------------
// Multi-process SQLite hardening (root Next.js app writes the same file):
// WAL journal mode + 5s busy timeout. connection_limit=1 is set in lib/db.ts so
// these per-connection PRAGMAs cover every query; writes also use withRetry().
// ---------------------------------------------------------------------------
async function initDb(): Promise<void> {
  try {
    if ((process.env.DATABASE_URL || '').startsWith('file:')) await db.$queryRawUnsafe('PRAGMA journal_mode=WAL;')
    log('db: journal_mode=WAL ok')
  } catch (e) {
    warn('db: PRAGMA journal_mode=WAL failed (continuing):', (e as Error).message)
  }
  if ((process.env.DATABASE_URL || '').startsWith('file:')) {
    try {
      // $queryRawUnsafe, not $executeRawUnsafe: PRAGMA statements return a result row.
      await db.$queryRawUnsafe('PRAGMA busy_timeout = 5000;')
      log('db: busy_timeout=5000 ok')
    } catch (e) {
      warn('db: PRAGMA busy_timeout failed (continuing):', (e as Error).message)
    }
  }
}

// ---------------------------------------------------------------------------
// Internal HTTP API — plain node http handler registered BEFORE socket.io
// attaches. socket.io uses the DEFAULT engine path (/socket.io), so requests to
// /health and /internal/broadcast fall through to this handler. As a courtesy,
// engine.io-shaped requests on other paths (e.g. a client that set path:'/')
// are forwarded to the engine (polling handshake).
// ---------------------------------------------------------------------------
function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body)
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(text)
}

function readBody(req: IncomingMessage, limitBytes = 1_000_000): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > limitBytes) {
        reject(new Error('request body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

const httpServer = createServer((req, res) => {
  handleHttpRequest(req, res).catch((e) => {
    warn('http handler error:', (e as Error).message)
    if (!res.writableEnded) {
      try { sendJson(res, 500, { error: 'internal error' }) } catch { /* ignore */ }
    }
  })
})

async function handleHttpRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const pathname = url.pathname.replace(/\/+$/, '') || '/'

  if (pathname === '/health') {
    return sendJson(res, 200, { ok: true, now: new Date().toISOString() })
  }

  if (pathname === '/internal/broadcast') {
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'method not allowed' })
    const key = req.headers['x-internal-key']
    if (!INTERNAL_API_KEY || key !== INTERNAL_API_KEY) {
      return sendJson(res, 401, { error: 'unauthorized' })
    }
    let body: { event?: unknown; room?: unknown; payload?: unknown }
    try {
      body = JSON.parse((await readBody(req)) || '{}')
    } catch {
      return sendJson(res, 400, { error: 'invalid JSON body' })
    }
    const { event, room, payload } = body
    if (typeof event !== 'string' || !event || typeof room !== 'string' || !room) {
      return sendJson(res, 400, { error: 'event and room are required strings' })
    }
    io.to(room).emit(event, payload ?? null)
    log(`internal broadcast -> room=${room} event=${event}`)
    return sendJson(res, 200, { ok: true })
  }

  // Fallback: engine.io handshake/polling on a non-default path (e.g. client with
  // path:'/'). The websocket *upgrade* for such clients is not recovered, but
  // socket.io-client always starts with a polling handshake, so the connection
  // still succeeds and may upgrade later.
  if (url.searchParams.has('EIO') || url.searchParams.has('transport') || url.searchParams.has('sid')) {
    try {
      const engine = io.engine as unknown as { handleRequest?: (rq: IncomingMessage, rs: ServerResponse) => void }
      if (typeof engine.handleRequest === 'function') {
        warn(`engine.io fallback request on non-default path: ${req.url}`)
        engine.handleRequest(req, res)
        return
      }
    } catch (e) {
      warn('engine.io fallback failed:', (e as Error).message)
    }
  }

  return sendJson(res, 404, { error: 'not found' })
}

// ---------------------------------------------------------------------------
// socket.io server — default engine path /socket.io (matches io("/?XTransformPort=3003")
// from the browser; Caddy forwards by the XTransformPort query, preserving paths).
// ---------------------------------------------------------------------------
const io = new SocketIOServer(httpServer, {
  cors: { origin: true, credentials: true },
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6,
})

// ---------------------------------------------------------------------------
// Validation helpers (socket input is untrusted)
// ---------------------------------------------------------------------------
type Ack = (response: unknown) => void
function isAck(v: unknown): v is Ack {
  return typeof v === 'function'
}
function validId(v: unknown): string | null {
  return typeof v === 'string' && /^[A-Za-z0-9_-]{5,64}$/.test(v) ? v : null
}
function validContent(v: unknown): string | null {
  if (typeof v !== 'string') return null
  if (v.length < 1 || v.length > 2000) return null
  if (!v.trim()) return null
  return v
}

// ---------------------------------------------------------------------------
// Presence: per-group-room online usernames (username -> socket count).
// ---------------------------------------------------------------------------
const presence = new Map<string, Map<string, number>>() // groupId -> username -> count

function presenceAdd(groupId: string, username: string): boolean {
  let set = presence.get(groupId)
  if (!set) {
    set = new Map()
    presence.set(groupId, set)
  }
  const prev = set.get(username) ?? 0
  set.set(username, prev + 1)
  return prev === 0 // username newly online
}

function presenceRemove(groupId: string, username: string): boolean {
  const set = presence.get(groupId)
  if (!set) return false
  const prev = set.get(username) ?? 0
  if (prev <= 1) set.delete(username)
  else set.set(username, prev - 1)
  if (set.size === 0) presence.delete(groupId)
  return prev === 1 // username went offline
}

function emitPresence(groupId: string): void {
  const set = presence.get(groupId)
  const onlineUsernames = set ? Array.from(set.keys()).sort() : []
  io.to(`group:${groupId}`).emit('presence:update', { onlineUsernames })
}

// ---------------------------------------------------------------------------
// Typing throttle (~3s per socket per conversation/group)
// ---------------------------------------------------------------------------
const TYPING_THROTTLE_MS = 3000
function typingAllowed(socket: Socket, key: string): boolean {
  const map = (socket.data.typingLast as Map<string, number>) ?? new Map<string, number>()
  socket.data.typingLast = map
  const now = Date.now()
  const last = map.get(key) ?? 0
  if (now - last < TYPING_THROTTLE_MS) return false
  map.set(key, now)
  return true
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
async function createNotification(data: NotificationCreateData): Promise<NotificationDTO> {
  const row = await withRetry(() => db.notification.create({ data }))
  return toNotificationDTO(row)
}

/** Re-check that the user is still ACTIVE (immediate ban/suspend effect on open sockets). */
async function stillActive(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { status: true } })
  return user !== null && user.status === 'ACTIVE'
}

// ---------------------------------------------------------------------------
// Auth middleware: JWT from handshake.auth.token (cookie jee_session fallback).
// ---------------------------------------------------------------------------
io.use(async (socket, next) => {
  const token =
    (typeof socket.handshake.auth?.token === 'string' && socket.handshake.auth.token) ||
    cookieToken(socket.handshake.headers.cookie)
  const user = await authenticateSocket(token)
  if (!user) {
    warn(`handshake rejected for socket ${socket.id}`)
    return next(new Error('unauthorized: invalid or expired token'))
  }
  socket.data.user = user
  socket.data.groups = new Set<string>()
  next()
})

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------
interface HandlerCtx {
  socket: Socket
  user: SocketAuthUser
  io: SocketIOServer
}

function makeFail(ctx: HandlerCtx, scope: string) {
  return (message: string, extra?: Record<string, unknown>) => {
    warn(`${scope} rejected for ${ctx.user.username}: ${message}`)
    ctx.socket.emit('error', { scope, message, ...extra })
  }
}

async function handleGroupJoin(ctx: HandlerCtx, args: unknown[]): Promise<void> {
  const { socket, user } = ctx
  const ack = isAck(args[args.length - 1]) ? (args[args.length - 1] as Ack) : undefined
  const groupId = validId(args[0])
  if (!groupId) {
    ack?.({ ok: false, error: 'invalid groupId' })
    return makeFail(ctx, 'group:join')('invalid groupId')
  }
  const member = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: user.id } },
    include: { user: true },
  })
  if (!member) {
    ack?.({ ok: false, error: 'not a member of this group' })
    return makeFail(ctx, 'group:join')('not a member', { groupId })
  }
  if (member.user.status !== 'ACTIVE') {
    ack?.({ ok: false, error: 'account is not active' })
    socket.disconnect(true) // banned/suspended mid-session
    return
  }
  socket.join(`group:${groupId}`)
  ;(socket.data.groups as Set<string>).add(groupId)
  presenceAdd(groupId, user.username)
  emitPresence(groupId)
  log(`${user.username} joined room group:${groupId}`)
  ack?.({ ok: true })
}

async function handleGroupLeave(ctx: HandlerCtx, args: unknown[]): Promise<void> {
  const { socket, user } = ctx
  const ack = isAck(args[args.length - 1]) ? (args[args.length - 1] as Ack) : undefined
  const groupId = validId(args[0])
  if (!groupId) {
    ack?.({ ok: false, error: 'invalid groupId' })
    return
  }
  if ((socket.data.groups as Set<string>).has(groupId)) {
    socket.leave(`group:${groupId}`)
    ;(socket.data.groups as Set<string>).delete(groupId)
    presenceRemove(groupId, user.username)
    emitPresence(groupId)
    log(`${user.username} left room group:${groupId}`)
  }
  ack?.({ ok: true })
}

async function handleGroupMessage(ctx: HandlerCtx, args: unknown[]): Promise<void> {
  const { socket, user, io } = ctx
  const ack = isAck(args[args.length - 1]) ? (args[args.length - 1] as Ack) : undefined
  const fail = (message: string) => {
    if (ack) ack({ ok: false, error: message })
    else socket.emit('error', { scope: 'group:message', message })
  }
  const groupId = validId(args[0])
  const content = validContent(args[1])
  const replyToIdRaw = typeof args[2] === 'string' ? args[2] : null
  if (!groupId) return fail('invalid groupId')
  if (!content) return fail('content must be 1-2000 characters')

  const member = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: user.id } },
    include: { group: true, user: true },
  })
  if (!member) return fail('not a member of this group')
  if (member.user.status !== 'ACTIVE') {
    fail('account is not active')
    socket.disconnect(true) // banned/suspended mid-session
    return
  }

  // Optional reply — must reference a live message in the same group.
  let replyParent: { id: string; username: string; content: string } | null = null
  const replyToId = validId(replyToIdRaw)
  if (replyToId) {
    const parent = await db.groupMessage.findUnique({ where: { id: replyToId }, include: { user: true } })
    if (parent && parent.groupId === groupId && !parent.deletedAt) {
      replyParent = { id: parent.id, username: parent.user.username, content: parent.content }
    }
  }

  const created = await withRetry(() =>
    db.groupMessage.create({
      data: { groupId, userId: user.id, content, replyToId: replyParent?.id ?? null },
    }),
  )

  // sender has read their own message
  await withRetry(() =>
    db.groupMember.update({ where: { id: member.id }, data: { lastReadAt: new Date() } }),
  ).catch(() => {})

  const sender = { username: user.username, displayName: user.displayName, avatarUrl: user.avatarUrl }
  const dto: ChatMessageDTO = toGroupMessageDTO(created, sender, replyParent)
  io.to(`group:${groupId}`).emit('group:message:new', dto)

  // ---- notifications: mentions first, then GROUP_MESSAGE for small groups ----
  const mentioned = new Set(extractMentions(content, user.username))
  const members = await db.groupMember.findMany({ where: { groupId }, include: { user: true } })
  const notified = new Map<string, NotificationDTO>()

  for (const m of members) {
    if (m.userId === user.id) continue
    if (!mentioned.has(m.user.username)) continue
    const n = await createNotification({
      userId: m.userId,
      type: 'MENTION',
      title: `${user.username} mentioned you in ${member.group.name}`,
      body: truncate(content, 140),
      link: `#/group/${groupId}`,
      actorId: user.id,
      groupId,
    })
    notified.set(m.userId, n)
  }

  if (members.length <= 50) {
    for (const m of members) {
      if (m.userId === user.id || m.muted || notified.has(m.userId)) continue
      const n = await createNotification({
        userId: m.userId,
        type: 'GROUP_MESSAGE',
        title: member.group.name,
        body: truncate(`${user.username}: ${content}`, 140),
        link: `#/group/${groupId}`,
        actorId: user.id,
        groupId,
      })
      notified.set(m.userId, n)
    }
  }

  for (const [recipientId, n] of notified) {
    io.to(`user:${recipientId}`).emit('notification:new', n)
  }

  log(`group:${member.group.slug} message from ${user.username} (${notified.size} notifications)`)
  ack?.({ ok: true, message: dto })
}

async function handleGroupTyping(ctx: HandlerCtx, args: unknown[]): Promise<void> {
  const { socket, user } = ctx
  const groupId = validId(args[0])
  if (!groupId) return
  if (!typingAllowed(socket, `g:${groupId}`)) return
  const member = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId: user.id } },
  })
  if (!member) return
  socket.to(`group:${groupId}`).emit('typing', { username: user.username, groupId })
}

async function handleGroupRead(ctx: HandlerCtx, args: unknown[]): Promise<void> {
  const { socket, user } = ctx
  const ack = isAck(args[args.length - 1]) ? (args[args.length - 1] as Ack) : undefined
  const groupId = validId(args[0])
  if (!groupId) return ack?.({ ok: false, error: 'invalid groupId' })
  await withRetry(() =>
    db.groupMember.updateMany({ where: { groupId, userId: user.id }, data: { lastReadAt: new Date() } }),
  )
  ack?.({ ok: true })
}

async function handleDmSend(ctx: HandlerCtx, args: unknown[]): Promise<void> {
  const { socket, user, io } = ctx
  const ack = isAck(args[args.length - 1]) ? (args[args.length - 1] as Ack) : undefined
  const fail = (message: string) => {
    if (ack) ack({ ok: false, error: message })
    else socket.emit('error', { scope: 'dm:send', message })
  }
  const conversationId = validId(args[0])
  const content = validContent(args[1])
  if (!conversationId) return fail('invalid conversationId')
  if (!content) return fail('content must be 1-2000 characters')

  const conversation = await db.directConversation.findUnique({ where: { id: conversationId } })
  if (!conversation) return fail('conversation not found')
  const isA = conversation.userAId === user.id
  const isB = conversation.userBId === user.id
  if (!isA && !isB) return fail('not a participant in this conversation')
  const otherId = isA ? conversation.userBId : conversation.userAId

  if (!(await stillActive(user.id))) {
    fail('account is not active')
    socket.disconnect(true) // banned/suspended mid-session
    return
  }

  const block = await db.block.findFirst({
    where: {
      OR: [
        { blockerId: user.id, blockedId: otherId },
        { blockerId: otherId, blockedId: user.id },
      ],
    },
  })
  if (block) return fail('cannot send a message to this user')

  const created = await withRetry(() =>
    db.directMessage.create({ data: { conversationId, senderId: user.id, content } }),
  )
  await withRetry(() =>
    db.directConversation.update({ where: { id: conversationId }, data: { lastMessageAt: created.createdAt } }),
  )

  const sender = { username: user.username, displayName: user.displayName, avatarUrl: user.avatarUrl }
  const dto = toDirectMessageDTO(created, sender)
  io.to(`user:${conversation.userAId}`).to(`user:${conversation.userBId}`).emit('dm:message:new', dto)

  const n = await createNotification({
    userId: otherId,
    type: 'DIRECT_MESSAGE',
    title: `${user.username} sent you a message`,
    body: truncate(content, 140),
    link: `#/dm/${conversationId}`,
    actorId: user.id,
    conversationId,
  })
  io.to(`user:${otherId}`).emit('notification:new', n)

  log(`dm:${conversationId} message from ${user.username}`)
  ack?.({ ok: true, message: dto })
}

async function handleDmTyping(ctx: HandlerCtx, args: unknown[]): Promise<void> {
  const { socket, user, io } = ctx
  const conversationId = validId(args[0])
  if (!conversationId) return
  if (!typingAllowed(socket, `d:${conversationId}`)) return
  const conversation = await db.directConversation.findUnique({ where: { id: conversationId } })
  if (!conversation) return
  const isA = conversation.userAId === user.id
  const isB = conversation.userBId === user.id
  if (!isA && !isB) return
  const otherId = isA ? conversation.userBId : conversation.userAId
  io.to(`user:${otherId}`).emit('typing', { username: user.username, conversationId })
}

async function handleDmRead(ctx: HandlerCtx, args: unknown[]): Promise<void> {
  const { socket, user } = ctx
  const ack = isAck(args[args.length - 1]) ? (args[args.length - 1] as Ack) : undefined
  const conversationId = validId(args[0])
  if (!conversationId) return ack?.({ ok: false, error: 'invalid conversationId' })
  const conversation = await db.directConversation.findUnique({ where: { id: conversationId } })
  if (!conversation) return ack?.({ ok: false, error: 'conversation not found' })
  if (conversation.userAId !== user.id && conversation.userBId !== user.id) {
    return ack?.({ ok: false, error: 'not a participant in this conversation' })
  }
  await withRetry(() =>
    db.directMessage.updateMany({
      where: { conversationId, senderId: { not: user.id }, readAt: null },
      data: { readAt: new Date() },
    }),
  )
  ack?.({ ok: true })
}

// ---------------------------------------------------------------------------
// Connection lifecycle
// ---------------------------------------------------------------------------
io.on('connection', (socket) => {
  const user = socket.data.user as SocketAuthUser
  socket.join(`user:${user.id}`)
  log(`connect ${user.username} (socket ${socket.id})`)

  const ctx: HandlerCtx = { socket, user, io }

  socket.on('group:join', (...args: unknown[]) => {
    handleGroupJoin(ctx, args).catch((e) => warn('group:join error:', (e as Error).message))
  })
  socket.on('group:leave', (...args: unknown[]) => {
    handleGroupLeave(ctx, args).catch((e) => warn('group:leave error:', (e as Error).message))
  })
  socket.on('group:message', (...args: unknown[]) => {
    handleGroupMessage(ctx, args).catch((e) => warn('group:message error:', (e as Error).message))
  })
  socket.on('group:typing', (...args: unknown[]) => {
    handleGroupTyping(ctx, args).catch((e) => warn('group:typing error:', (e as Error).message))
  })
  socket.on('group:read', (...args: unknown[]) => {
    handleGroupRead(ctx, args).catch((e) => warn('group:read error:', (e as Error).message))
  })
  socket.on('dm:send', (...args: unknown[]) => {
    handleDmSend(ctx, args).catch((e) => warn('dm:send error:', (e as Error).message))
  })
  socket.on('dm:typing', (...args: unknown[]) => {
    handleDmTyping(ctx, args).catch((e) => warn('dm:typing error:', (e as Error).message))
  })
  socket.on('dm:read', (...args: unknown[]) => {
    handleDmRead(ctx, args).catch((e) => warn('dm:read error:', (e as Error).message))
  })

  socket.on('disconnect', (reason) => {
    for (const groupId of socket.data.groups as Set<string>) {
      presenceRemove(groupId, user.username)
      emitPresence(groupId)
    }
    log(`disconnect ${user.username} (${reason})`)
  })

  socket.on('error', (err) => {
    warn(`socket ${socket.id} (${user.username}) error:`, err?.message ?? err)
  })
})

io.engine.on('connection_error', (err) => {
  warn('engine connection_error:', err?.code, err?.message)
})

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
function shutdown(signal: string) {
  log(`received ${signal}, shutting down...`)
  io.close(() => {
    httpServer.close(() => {
      db.$disconnect()
        .catch(() => {})
        .finally(() => process.exit(0))
    })
  })
  // Force-exit fallback if close hangs (long-polling connections)
  setTimeout(() => process.exit(0), 5000).unref()
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('unhandledRejection', (reason) => warn('unhandledRejection:', reason))
process.on('uncaughtException', (err) => warn('uncaughtException:', err))

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function main() {
  if (!INTERNAL_API_KEY) warn('INTERNAL_API_KEY not set — /internal/broadcast will reject all calls')
  if (!process.env.JWT_SECRET) warn('JWT_SECRET not set — no socket will authenticate')
  await initDb()
  httpServer.listen(PORT, () => {
    log(`chat-service listening on :${PORT} (engine path /socket.io)`)
  })
}

main().catch((e) => {
  console.error('fatal startup error:', e)
  process.exit(1)
})
