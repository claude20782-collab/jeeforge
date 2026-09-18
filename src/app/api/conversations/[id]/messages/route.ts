import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { badRequest, fail, forbidden, notFound, ok, unauthorized } from '@/lib/api-helpers'
import { broadcastToRoom, createNotifications, dmMessageDto } from '@/lib/attempt-service'
import { z } from 'zod'

const postSchema = z.object({ content: z.string().trim().min(1).max(2000) })

async function loadConversation(id: string, userId: string) {
  const conv = await db.directConversation.findUnique({ where: { id } })
  if (!conv) return { error: notFound('Conversation') } as const
  if (conv.userAId !== userId && conv.userBId !== userId) return { error: forbidden() } as const
  return { conv } as const
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()
  const loaded = await loadConversation(id, user.id)
  if ('error' in loaded) return loaded.error

  const url = new URL(req.url)
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? 50) || 50))
  const beforeParam = url.searchParams.get('before')
  let before: Date | null = null
  if (beforeParam) {
    before = new Date(beforeParam)
    if (isNaN(before.getTime())) return badRequest('Invalid "before" timestamp')
  }

  const messages = await db.directMessage.findMany({
    where: { conversationId: loaded.conv.id, ...(before ? { createdAt: { lt: before } } : {}) },
    include: { sender: true },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: limit + 1,
  })
  const hasMore = messages.length > limit
  const dtos = messages.slice(0, limit).reverse().map(dmMessageDto)
  return ok({ messages: dtos, hasMore })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()
  const body = await postSchema.safeParse(await req.json().catch(() => null))
  if (!body.success) return fail(400, 'Message must be 1-2000 characters')

  const loaded = await loadConversation(id, user.id)
  if ('error' in loaded) return loaded.error
  const conv = loaded.conv

  const recipientId = conv.userAId === user.id ? conv.userBId : conv.userAId
  const blocked = await db.block.findFirst({
    where: { OR: [{ blockerId: user.id, blockedId: recipientId }, { blockerId: recipientId, blockedId: user.id }] },
  })
  if (blocked) return fail(403, 'You can no longer message this user')

  const message = await db.directMessage.create({
    data: { conversationId: conv.id, senderId: user.id, content: body.data.content },
    include: { sender: true },
  })
  await db.directConversation.update({ where: { id: conv.id }, data: { lastMessageAt: message.createdAt } })

  const dto = dmMessageDto(message)
  broadcastToRoom('dm:message:new', `user:${recipientId}`, dto)
  await createNotifications([{
    userId: recipientId,
    type: 'DIRECT_MESSAGE',
    title: `New message from ${user.displayName ?? user.username}`,
    body: body.data.content.slice(0, 100),
    link: `#/dm/${conv.id}`,
    actorId: user.id,
    conversationId: conv.id,
  }])
  return ok({ message: dto }, { status: 201 })
}
