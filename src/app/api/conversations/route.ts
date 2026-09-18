import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { badRequest, fail, notFound, ok, unauthorized } from '@/lib/api-helpers'
import { conversationDto } from '@/lib/attempt-service'
import { z } from 'zod'

const postSchema = z.object({ username: z.string().trim().toLowerCase().min(3).max(20) })

export async function GET() {
  const user = await requireUser()
  if (!user) return unauthorized()
  const conversations = await db.directConversation.findMany({
    where: { OR: [{ userAId: user.id }, { userBId: user.id }] },
    include: { userA: true, userB: true },
    orderBy: { lastMessageAt: 'desc' },
  })
  const dtos = await Promise.all(conversations.map(c => conversationDto(c, user.id)))
  return ok({ conversations: dtos })
}

export async function POST(req: Request) {
  const user = await requireUser()
  if (!user) return unauthorized()
  const body = await postSchema.safeParse(await req.json().catch(() => null))
  if (!body.success) return badRequest('Invalid username')

  const target = await db.user.findUnique({ where: { username: body.data.username } })
  if (!target) return notFound('User')
  if (target.id === user.id) return badRequest('You cannot message yourself')

  const blocked = await db.block.findFirst({
    where: {
      OR: [
        { blockerId: user.id, blockedId: target.id },
        { blockerId: target.id, blockedId: user.id },
      ],
    },
  })
  if (blocked) return fail(403, 'You cannot message this user')

  const [a, b] = [user.id, target.id].sort() // userA is lexicographically smaller
  const existing = await db.directConversation.findUnique({ where: { userAId_userBId: { userAId: a, userBId: b } } })
  const conv = existing
    ? await db.directConversation.findUniqueOrThrow({ where: { id: existing.id }, include: { userA: true, userB: true } })
    : await db.directConversation.create({ data: { userAId: a, userBId: b }, include: { userA: true, userB: true } })
  return ok({ conversation: await conversationDto(conv, user.id) }, { status: existing ? 200 : 201 })
}
