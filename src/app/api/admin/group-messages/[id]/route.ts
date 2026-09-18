import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { forbidden, notFound, ok } from '@/lib/api-helpers'
import { logModeration } from '@/lib/attempt-service'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const message = await db.groupMessage.findUnique({ where: { id } })
  if (!message) return notFound('Message')

  if (!message.deletedAt) {
    await db.groupMessage.update({
      where: { id: message.id },
      data: { deletedAt: new Date(), deletedBy: admin.id },
    })
    await logModeration(admin.id, 'DELETE_GROUP_MESSAGE', 'GroupMessage', message.id, `Group ${message.groupId}`)
  }
  return ok({ ok: true })
}
