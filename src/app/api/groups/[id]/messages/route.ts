import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { badRequest, fail, forbidden, notFound, ok, unauthorized } from '@/lib/api-helpers'
import {
  broadcastToRoom, createNotifications, groupMessageDto, parseMentions,
} from '@/lib/attempt-service'
import { z } from 'zod'

const postSchema = z.object({
  content: z.string().trim().min(1).max(2000),
  replyToId: z.string().min(1).optional().nullable(),
})

async function requireMembership(groupId: string, userId: string) {
  return db.groupMember.findUnique({ where: { groupId_userId: { groupId, userId } } })
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()

  const group = await db.group.findUnique({ where: { id } })
  if (!group) return notFound('Group')
  const membership = await requireMembership(group.id, user.id)
  if (!membership) return forbidden()

  const url = new URL(req.url)
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? 50) || 50))
  const beforeParam = url.searchParams.get('before')
  let before: Date | null = null
  if (beforeParam) {
    before = new Date(beforeParam)
    if (isNaN(before.getTime())) return badRequest('Invalid "before" timestamp')
  }

  const messages = await db.groupMessage.findMany({
    where: { groupId: group.id, ...(before ? { createdAt: { lt: before } } : {}) },
    include: { user: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
  })
  const hasMore = messages.length > limit
  const page = messages.slice(0, limit).reverse()

  const replyIds = [...new Set(page.filter(m => m.replyToId).map(m => m.replyToId!))]
  const replies = replyIds.length
    ? await db.groupMessage.findMany({ where: { id: { in: replyIds } }, include: { user: true } })
    : []
  const replyMap = new Map(replies.map(r => [r.id, r]))

  const dtos = page.map(m => {
    const target = m.replyToId ? replyMap.get(m.replyToId) : null
    return groupMessageDto(m, target
      ? { id: target.id, sender: target.user.username, content: (target.deletedAt ? 'message removed by moderator' : target.content).slice(0, 80) }
      : null)
  })
  return ok({ messages: dtos, hasMore })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()

  const body = await postSchema.safeParse(await req.json().catch(() => null))
  if (!body.success) return fail(400, 'Message must be 1-2000 characters')

  const group = await db.group.findUnique({ where: { id } })
  if (!group) return notFound('Group')
  const membership = await requireMembership(group.id, user.id)
  if (!membership) return forbidden()

  if (body.data.replyToId) {
    const target = await db.groupMessage.findFirst({ where: { id: body.data.replyToId, groupId: group.id } })
    if (!target) return badRequest('Reply target not found in this group')
  }

  const message = await db.groupMessage.create({
    data: {
      groupId: group.id,
      userId: user.id,
      content: body.data.content,
      replyToId: body.data.replyToId ?? null,
    },
    include: { user: true },
  })
  // sender has read their own message
  await db.groupMember.update({ where: { id: membership.id }, data: { lastReadAt: new Date() } }).catch(() => {})

  const replyTarget = message.replyToId
    ? await db.groupMessage.findUnique({ where: { id: message.replyToId }, include: { user: true } })
    : null
  const dto = groupMessageDto(message, replyTarget
    ? { id: replyTarget.id, sender: replyTarget.user.username, content: (replyTarget.deletedAt ? 'message removed by moderator' : replyTarget.content).slice(0, 80) }
    : null)

  // real-time fan-out through the chat service (fire-and-forget)
  broadcastToRoom('group:message:new', `group:${group.id}`, dto)

  // mention + group-message notifications (recipients must be ACTIVE members)
  const members = await db.groupMember.findMany({
    where: { groupId: group.id, userId: { not: user.id } },
    include: { user: { select: { id: true, username: true, status: true } } },
  })
  const memberCount = members.length + 1
  const activeMembers = members.filter(m => m.user.status === 'ACTIVE')
  const mentionedUsernames = new Set(parseMentions(body.data.content))
  const notifications: Array<Parameters<typeof createNotifications>[0][number]> = []
  const notified = new Set<string>()
  const preview = body.data.content.slice(0, 100)
  for (const m of activeMembers) {
    if (mentionedUsernames.has(m.user.username)) {
      notified.add(m.user.id)
      notifications.push({
        userId: m.user.id,
        type: 'MENTION',
        title: `${user.displayName ?? user.username} mentioned you in "${group.name}"`,
        body: preview,
        link: `#/group/${group.id}`,
        actorId: user.id,
        groupId: group.id,
      })
    }
  }
  if (memberCount <= 50) {
    for (const m of activeMembers) {
      if (m.muted || notified.has(m.user.id)) continue
      notifications.push({
        userId: m.user.id,
        type: 'GROUP_MESSAGE',
        title: `${group.name} · ${user.displayName ?? user.username}`,
        body: preview,
        link: `#/group/${group.id}`,
        actorId: user.id,
        groupId: group.id,
      })
    }
  }
  await createNotifications(notifications)

  return ok({ message: dto }, { status: 201 })
}
