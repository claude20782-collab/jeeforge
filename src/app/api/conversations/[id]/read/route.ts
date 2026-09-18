import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { forbidden, notFound, ok, unauthorized } from '@/lib/api-helpers'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()
  const conv = await db.directConversation.findUnique({ where: { id } })
  if (!conv) return notFound('Conversation')
  if (conv.userAId !== user.id && conv.userBId !== user.id) return forbidden()

  await db.directMessage.updateMany({
    where: { conversationId: conv.id, senderId: { not: user.id }, readAt: null },
    data: { readAt: new Date() },
  })
  return ok({ ok: true })
}
