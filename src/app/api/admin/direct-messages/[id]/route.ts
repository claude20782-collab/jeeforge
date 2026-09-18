import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { forbidden, notFound, ok } from '@/lib/api-helpers'
import { logModeration } from '@/lib/attempt-service'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const message = await db.directMessage.findUnique({ where: { id } })
  if (!message) return notFound('Message')

  if (!message.deletedAt) {
    await db.directMessage.update({
      where: { id: message.id },
      data: { deletedAt: new Date() },
    })
    await logModeration(admin.id, 'DELETE_DIRECT_MESSAGE', 'DirectMessage', message.id, `Conversation ${message.conversationId}`)
  }
  return ok({ ok: true })
}
