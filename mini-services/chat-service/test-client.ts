// ============================================================================
// test-client.ts — one-shot verification for the chat service (NOT a permanent process).
// Run from the service dir:  bun test-client.ts
//
// What it does:
//  - seeds test rows directly in the shared SQLite DB (users t3testa/t3testb/t3testc,
//    a group, a DM conversation, sessions)
//  - forges JWTs with the same JWT_SECRET (jose, HS256) exactly like the root app
//  - exercises: handshake auth (valid/invalid/suspended), group join/leave presence,
//    group messages (mention + plain notifications), read state, typing throttle,
//    DMs (send/read/typing/block both directions), non-member rejection,
//    mid-session suspension disconnect, /internal/broadcast (wrong+right key)
//  - verifies persistence (messages, notifications, lastReadAt, readAt, lastMessageAt)
//  - cleans up ALL test rows and verifies the DB is left clean
// Exit code 0 = all checks passed.
// ============================================================================
import { io, type Socket } from 'socket.io-client'
import { SignJWT } from 'jose'
import { db } from './lib/db'
import { INTERNAL_API_KEY, JWT_SECRET } from './lib/env'

const BASE_URL = 'http://localhost:3003'
const USERS = { a: 't3testa', b: 't3testb', c: 't3testc' } as const

const log = (...a: unknown[]) => console.log(...a)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const results: Array<{ name: string; pass: boolean; detail: string }> = []
function check(name: string, pass: boolean, detail = ''): void {
  results.push({ name, pass, detail })
  log(`${pass ? '  ✔ PASS' : '  ✘ FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

// ---------- socket helpers ----------
function connectSocket(token: string): Socket {
  return io(BASE_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: false,
    timeout: 5000,
    forceNew: true,
  })
}

function waitConnected(sock: Socket, ms = 5000): Promise<boolean> {
  if (sock.connected) return Promise.resolve(true)
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve(false), ms)
    sock.once('connect', () => { clearTimeout(t); resolve(true) })
    sock.once('connect_error', () => { clearTimeout(t); resolve(false) })
  })
}

function nextEvent<T = any>(sock: Socket, event: string, ms = 6000, predicate?: (v: T) => boolean): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      sock.off(event, onFn as any)
      reject(new Error(`timeout waiting for "${event}"`))
    }, ms)
    const onFn = (v: T) => {
      if (predicate && !predicate(v)) return
      clearTimeout(timer)
      sock.off(event, onFn as any)
      resolve(v)
    }
    sock.on(event, onFn as any)
  })
}

function emitAck(sock: Socket, event: string, ...args: unknown[]): Promise<any> {
  return new Promise((resolve) => {
    let done = false
    const finish = (v: any) => { if (!done) { done = true; clearTimeout(t); resolve(v) } }
    const t = setTimeout(() => finish(null), 6000)
    sock.once('disconnect', () => finish(null))
    sock.emit(event, ...args, (res: any) => finish(res))
  })
}

async function signToken(payload: { sub: string; sid: string; username: string; role: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(new TextEncoder().encode(JWT_SECRET))
}

// ---------- seed / cleanup ----------
async function cleanup(): Promise<string[]> {
  const existing = await db.user.findMany({ where: { username: { in: Object.values(USERS) } } })
  const ids = existing.map((u) => u.id)
  if (ids.length) {
    // Groups owned by these users must go first (owner FK is RESTRICT).
    await db.group.deleteMany({ where: { ownerId: { in: ids } } })
    await db.user.deleteMany({ where: { id: { in: ids } } }) // cascades everything else
  }
  return ids
}

async function main(): Promise<void> {
  log('== T3 chat-service test client ==')
  log(`BASE_URL=${BASE_URL}  DB: shared SQLite  JWT_SECRET: ${JWT_SECRET ? 'loaded' : 'MISSING'}`)

  // ---- 0. cleanup leftovers from any previous run ----
  await cleanup()

  // ---- 1. seed ----
  const [ua, ub, uc] = await Promise.all([
    db.user.create({ data: { email: 't3a@test.local', username: USERS.a, passwordHash: 'test-only', displayName: 'T3 Tester A' } }),
    db.user.create({ data: { email: 't3b@test.local', username: USERS.b, passwordHash: 'test-only', displayName: 'T3 Tester B' } }),
    db.user.create({ data: { email: 't3c@test.local', username: USERS.c, passwordHash: 'test-only', status: 'SUSPENDED' } }),
  ])
  const [sessA, sessB, sessC] = await Promise.all([
    db.session.create({ data: { userId: ua.id } }),
    db.session.create({ data: { userId: ub.id } }),
    db.session.create({ data: { userId: uc.id } }),
  ])
  const group = await db.group.create({
    data: { name: 'T3 Test Group', slug: `t3-test-group-${Date.now()}`, ownerId: ua.id },
  })
  await db.groupMember.create({ data: { groupId: group.id, userId: ua.id, role: 'OWNER' } })
  await db.groupMember.create({ data: { groupId: group.id, userId: ub.id, role: 'MEMBER' } })
  const [userAId, userBId] = [ua.id, ub.id].sort() // userAId must be lexicographically smaller
  const conv = await db.directConversation.create({
    data: { userAId, userBId: userAId === ua.id ? ub.id : ua.id },
  })
  const tokenA = await signToken({ sub: ua.id, sid: sessA.id, username: ua.username, role: 'USER' })
  const tokenB = await signToken({ sub: ub.id, sid: sessB.id, username: ub.username, role: 'USER' })
  const tokenC = await signToken({ sub: uc.id, sid: sessC.id, username: uc.username, role: 'USER' })
  log(`seeded users=${[ua.username, ub.username, uc.username]} group=${group.slug} conv=${conv.id}`)

  const memberABefore = await db.groupMember.findUniqueOrThrow({
    where: { groupId_userId: { groupId: group.id, userId: ua.id } },
  })

  let socketA: Socket | null = null
  let socketB: Socket | null = null

  try {
    // ---- 2. health ----
    const health = await fetch(`${BASE_URL}/health`)
    const healthBody = await health.json()
    check('GET /health → 200 {ok:true}', health.status === 200 && healthBody.ok === true, JSON.stringify(healthBody))

    // ---- 3. invalid token rejected ----
    {
      const bad = connectSocket('not-a-jwt')
      const err = await new Promise<Error | null>((resolve) => {
        const t = setTimeout(() => resolve(null), 4000)
        bad.once('connect_error', (e) => { clearTimeout(t); resolve(e) })
      })
      check('invalid JWT → connect_error', err !== null, err ? String(err.message) : 'no error received')
      bad.close()
    }

    // ---- 4. suspended user rejected ----
    {
      const bad = connectSocket(tokenC)
      const err = await new Promise<Error | null>((resolve) => {
        const t = setTimeout(() => resolve(null), 4000)
        bad.once('connect_error', (e) => { clearTimeout(t); resolve(e) })
      })
      check('suspended user → connect_error', err !== null, err ? String(err.message) : 'no error received')
      bad.close()
    }

    // ---- 5. connect A and B ----
    socketA = connectSocket(tokenA)
    socketB = connectSocket(tokenB)
    check('user A connects', await waitConnected(socketA))
    check('user B connects', await waitConnected(socketB))

    // ---- 6. group join + presence ----
    const joinA = await emitAck(socketA, 'group:join', group.id)
    check('A group:join ack ok', joinA?.ok === true)
    const presencePromise = nextEvent<{ onlineUsernames: string[] }>(socketA, 'presence:update')
    const joinB = await emitAck(socketB, 'group:join', group.id)
    check('B group:join ack ok', joinB?.ok === true)
    const presence = await presencePromise
    check(
      'presence:update shows both users online',
      Array.isArray(presence.onlineUsernames) &&
        presence.onlineUsernames.includes(USERS.a) &&
        presence.onlineUsernames.includes(USERS.b),
      JSON.stringify(presence.onlineUsernames),
    )

    // ---- 7. mention message: broadcast + MENTION notification + persistence ----
    const mentionContent = `hey @${USERS.b} this is the T3 mention test`
    const pMsgA = nextEvent<any>(socketA, 'group:message:new')
    const pMsgB = nextEvent<any>(socketB, 'group:message:new')
    const pMentionB = nextEvent<any>(socketB, 'notification:new', 6000, (n) => n.type === 'MENTION')
    const ackMention = await emitAck(socketA, 'group:message', group.id, mentionContent)
    check('group:message ack ok + DTO shape', ackMention?.ok === true && ackMention.message?.id, 'no ack payload')
    const [msgA, msgB, notifB] = await Promise.all([pMsgA, pMsgB, pMentionB])
    check('sender received own group:message:new', msgA?.id === ackMention.message.id)
    check('other member received group:message:new', msgB?.id === ackMention.message.id)
    check(
      'group:message:new DTO matches contract',
      msgB.groupId === group.id && msgB.sender.username === USERS.a && msgB.content === mentionContent &&
        msgB.deleted === false && msgB.replyTo === null && typeof msgB.createdAt === 'string',
      JSON.stringify({ groupId: msgB.groupId, sender: msgB.sender.username }),
    )
    check(
      'B received MENTION notification:new',
      notifB?.type === 'MENTION' && notifB.link === `#/group/${group.id}` && !!notifB.id,
      JSON.stringify({ type: notifB?.type, link: notifB?.link }),
    )
    const persistedMsg = await db.groupMessage.findUnique({ where: { id: ackMention.message.id } })
    check('GroupMessage persisted', persistedMsg !== null && persistedMsg.content === mentionContent && persistedMsg.userId === ua.id)
    const memberAAfter = await db.groupMember.findUniqueOrThrow({
      where: { groupId_userId: { groupId: group.id, userId: ua.id } },
    })
    check('sender lastReadAt updated', memberAAfter.lastReadAt >= memberABefore.lastReadAt)
    const mentionRows = await db.notification.count({
      where: { userId: ub.id, type: 'MENTION', groupId: group.id },
    })
    check('MENTION notification row created', mentionRows === 1, `count=${mentionRows}`)

    // ---- 8. plain message: GROUP_MESSAGE notification for small group ----
    const plainContent = 'second message without any mention'
    const pGroupNotifB = nextEvent<any>(socketB, 'notification:new', 6000, (n) => n.type === 'GROUP_MESSAGE')
    const ackPlain = await emitAck(socketA, 'group:message', group.id, plainContent)
    const groupNotif = await pGroupNotifB
    check('plain group:message ack ok', ackPlain?.ok === true)
    check(
      'B received GROUP_MESSAGE notification:new (group ≤ 50 members)',
      groupNotif?.type === 'GROUP_MESSAGE' && groupNotif.link === `#/group/${group.id}`,
      JSON.stringify({ type: groupNotif?.type }),
    )
    const [mentionCount2, groupNotifRows] = await Promise.all([
      db.notification.count({ where: { userId: ub.id, type: 'MENTION' } }),
      db.notification.count({ where: { userId: ub.id, type: 'GROUP_MESSAGE', groupId: group.id } }),
    ])
    check('no duplicate MENTION + GROUP_MESSAGE row created', mentionCount2 === 1 && groupNotifRows === 1, `mention=${mentionCount2} group=${groupNotifRows}`)

    // ---- 9. group:read ----
    const memberBBeforeRead = await db.groupMember.findUniqueOrThrow({
      where: { groupId_userId: { groupId: group.id, userId: ub.id } },
    })
    const readAck = await emitAck(socketB, 'group:read', group.id)
    const memberBAfterRead = await db.groupMember.findUniqueOrThrow({
      where: { groupId_userId: { groupId: group.id, userId: ub.id } },
    })
    check('group:read updates lastReadAt', readAck?.ok === true && memberBAfterRead.lastReadAt > memberBBeforeRead.lastReadAt)

    // ---- 10. typing indicator + throttle ----
    const pTyping = nextEvent<any>(socketB, 'typing')
    socketA.emit('group:typing', group.id)
    const typing = await pTyping
    check('typing broadcast received', typing?.username === USERS.a && typing?.groupId === group.id, JSON.stringify(typing))
    let extraTyping = 0
    const counter = () => { extraTyping++ }
    socketB.on('typing', counter)
    socketA.emit('group:typing', group.id)
    socketA.emit('group:typing', group.id)
    await sleep(800)
    socketB.off('typing', counter)
    check('typing throttled (3s)', extraTyping === 0, `extra events=${extraTyping}`)

    // ---- 11. DM send: both rooms + DIRECT_MESSAGE notification + persistence ----
    const convBefore = await db.directConversation.findUniqueOrThrow({ where: { id: conv.id } })
    const dmContent = 'direct hello from A'
    const pDmA = nextEvent<any>(socketA, 'dm:message:new')
    const pDmB = nextEvent<any>(socketB, 'dm:message:new')
    const pDmNotifB = nextEvent<any>(socketB, 'notification:new', 6000, (n) => n.type === 'DIRECT_MESSAGE')
    const ackDm = await emitAck(socketA, 'dm:send', conv.id, dmContent)
    check('dm:send ack ok + DTO', ackDm?.ok === true && ackDm.message?.id, 'no ack payload')
    const [dmA, dmB, dmNotif] = await Promise.all([pDmA, pDmB, pDmNotifB])
    check('sender received dm:message:new', dmA?.id === ackDm.message.id)
    check('recipient received dm:message:new', dmB?.id === ackDm.message.id)
    check(
      'dm:message:new DTO carries conversationId',
      dmB.conversationId === conv.id && dmB.sender.username === USERS.a && dmB.content === dmContent,
      JSON.stringify({ conversationId: dmB.conversationId }),
    )
    check(
      'B received DIRECT_MESSAGE notification:new',
      dmNotif?.type === 'DIRECT_MESSAGE' && dmNotif.link === `#/dm/${conv.id}`,
      JSON.stringify({ type: dmNotif?.type, link: dmNotif?.link }),
    )
    const dmRow = await db.directMessage.findUnique({ where: { id: ackDm.message.id } })
    const convAfter = await db.directConversation.findUniqueOrThrow({ where: { id: conv.id } })
    check('DirectMessage persisted', dmRow !== null && dmRow.content === dmContent && dmRow.senderId === ua.id)
    check('conversation lastMessageAt updated', convAfter.lastMessageAt >= convBefore.lastMessageAt)

    // ---- 12. dm:read marks recipient copies as read ----
    const dmReadAck = await emitAck(socketB, 'dm:read', conv.id)
    const dmRowAfterRead = await db.directMessage.findUniqueOrThrow({ where: { id: ackDm.message.id } })
    check('dm:read sets readAt on sender messages', dmReadAck?.ok === true && dmRowAfterRead.readAt !== null)

    // ---- 13. dm:typing ----
    const pDmTyping = nextEvent<any>(socketA, 'typing')
    socketB.emit('dm:typing', conv.id)
    const dmTyping = await pDmTyping
    check('dm typing broadcast received', dmTyping?.username === USERS.b && dmTyping?.conversationId === conv.id, JSON.stringify(dmTyping))

    // ---- 14. block blocks DMs both directions ----
    await db.block.create({ data: { blockerId: ua.id, blockedId: ub.id } })
    const blockedA = await emitAck(socketA, 'dm:send', conv.id, 'blocked attempt A')
    const blockedB = await emitAck(socketB, 'dm:send', conv.id, 'blocked attempt B')
    check('dm:send rejected when blocked (A→B)', blockedA?.ok === false, JSON.stringify(blockedA))
    check('dm:send rejected when blocked (B→A)', blockedB?.ok === false, JSON.stringify(blockedB))
    await db.block.deleteMany({ where: { blockerId: ua.id, blockedId: ub.id } })
    const unblocked = await emitAck(socketA, 'dm:send', conv.id, 'unblocked hello')
    check('dm:send works after unblock', unblocked?.ok === true)

    // ---- 15. non-member rejection ----
    const group2 = await db.group.create({
      data: { name: 'T3 Private Group', slug: `t3-private-group-${Date.now()}`, isPrivate: true, ownerId: ub.id },
    })
    await db.groupMember.create({ data: { groupId: group2.id, userId: ub.id, role: 'OWNER' } })
    const joinNope = await emitAck(socketA, 'group:join', group2.id)
    const msgNope = await emitAck(socketA, 'group:message', group2.id, 'should be rejected')
    check('non-member group:join rejected', joinNope?.ok === false, JSON.stringify(joinNope))
    check('non-member group:message rejected', msgNope?.ok === false, JSON.stringify(msgNope))
    const group2MsgCount = await db.groupMessage.count({ where: { groupId: group2.id } })
    check('rejected group message NOT persisted', group2MsgCount === 0)

    // ---- 16. mid-session suspension disconnects ----
    await db.user.update({ where: { id: ub.id }, data: { status: 'SUSPENDED' } })
    const pPresenceA = nextEvent<any>(socketA, 'presence:update', 8000, (p) => p.onlineUsernames.length === 1)
    const pDisconnectB = nextEvent<any>(socketB, 'disconnect')
    const banAck = await emitAck(socketB, 'group:message', group.id, 'should not persist')
    const disconnected = await Promise.race([pDisconnectB.then(() => true), sleep(4000).then(() => false)])
    check('suspended user message rejected', banAck === null || banAck.ok === false, JSON.stringify(banAck))
    check('suspended user socket disconnected', disconnected === true)
    const bannedMsgCount = await db.groupMessage.count({ where: { groupId: group.id, content: 'should not persist' } })
    check('suspended user message NOT persisted', bannedMsgCount === 0)
    const presenceAfterBan = await Promise.race([pPresenceA, sleep(2000).then(() => null)])
    check(
      'presence:update reflects B offline',
      presenceAfterBan !== null && presenceAfterBan.onlineUsernames.length === 1 && presenceAfterBan.onlineUsernames[0] === USERS.a,
      JSON.stringify(presenceAfterBan?.onlineUsernames),
    )
    await db.user.update({ where: { id: ub.id }, data: { status: 'ACTIVE' } })

    // ---- 17. internal broadcast ----
    const wrongKey = await fetch(`${BASE_URL}/internal/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-internal-key': 'wrong-key' },
      body: JSON.stringify({ event: 'internal:test', room: `user:${ua.id}`, payload: { x: 1 } }),
    })
    check('broadcast with wrong key → 401', wrongKey.status === 401)
    const pInternal = nextEvent<any>(socketA, 'internal:test')
    const okBroadcast = await fetch(`${BASE_URL}/internal/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-internal-key': INTERNAL_API_KEY },
      body: JSON.stringify({ event: 'internal:test', room: `user:${ua.id}`, payload: { hello: 't3' } }),
    })
    const okBody = await okBroadcast.json()
    check('broadcast with right key → 200 {ok:true}', okBroadcast.status === 200 && okBody.ok === true)
    const internalEvent = await pInternal
    check('broadcast payload delivered to user room', internalEvent?.hello === 't3', JSON.stringify(internalEvent))
    const pGroupBroadcast = nextEvent<any>(socketA, 'internal:group-test')
    await fetch(`${BASE_URL}/internal/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-internal-key': INTERNAL_API_KEY },
      body: JSON.stringify({ event: 'internal:group-test', room: `group:${group.id}`, payload: { g: 1 } }),
    })
    const groupBroadcast = await pGroupBroadcast
    check('broadcast delivered to group room', groupBroadcast?.g === 1)

    // ---- 18. validation: bad content / bad ids ----
    const tooLong = 'x'.repeat(2001)
    const badContent = await emitAck(socketA, 'group:message', group.id, tooLong)
    const emptyContent = await emitAck(socketA, 'group:message', group.id, '')
    const badId = await emitAck(socketA, 'group:message', 'not-an-id', 'hello')
    check('2001-char message rejected', badContent?.ok === false)
    check('empty message rejected', emptyContent?.ok === false)
    check('invalid groupId rejected', badId?.ok === false)
  } finally {
    // ---- close sockets ----
    try { socketA?.close() } catch { /* ignore */ }
    try { socketB?.close() } catch { /* ignore */ }
  }

  // ---- 19. cleanup + verify ----
  await cleanup()
  const [userLeft, groupLeft, convLeft, notifLeft] = await Promise.all([
    db.user.count({ where: { username: { in: Object.values(USERS) } } }),
    db.group.count({ where: { slug: { startsWith: 't3-' } } }),
    db.directConversation.count({
      where: { OR: [{ userAId: { in: [ua.id, ub.id, uc.id] } }, { userBId: { in: [ua.id, ub.id, uc.id] } }] },
    }),
    db.notification.count({ where: { userId: { in: [ua.id, ub.id, uc.id] } } }),
  ])
  check(
    'cleanup removed all test rows',
    userLeft === 0 && groupLeft === 0 && convLeft === 0 && notifLeft === 0,
    `users=${userLeft} groups=${groupLeft} convs=${convLeft} notifs=${notifLeft}`,
  )

  // ---- summary ----
  const failed = results.filter((r) => !r.pass)
  log('\n================= T3 TEST SUMMARY =================')
  log(`total=${results.length}  passed=${results.length - failed.length}  failed=${failed.length}`)
  if (failed.length) {
    log('FAILED checks:')
    for (const f of failed) log(`  ✘ ${f.name} — ${f.detail}`)
  }
  log('===================================================')

  await db.$disconnect()
  process.exit(failed.length ? 1 : 0)
}

main().catch(async (e) => {
  console.error('test client crashed:', e)
  await cleanup().catch(() => {})
  await db.$disconnect().catch(() => {})
  process.exit(1)
})
