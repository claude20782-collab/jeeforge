import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { notFound, ok, unauthorized } from '@/lib/api-helpers'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()

  const group = await db.group.findUnique({ where: { id } })
  if (!group) return notFound('Group')

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId: group.id, userId: user.id } },
  })
  if (!membership) return ok({ ok: true }) // idempotent

  if (membership.role === 'OWNER') {
    const remaining = await db.groupMember.findMany({
      where: { groupId: group.id, userId: { not: user.id } },
      orderBy: [{ joinedAt: 'asc' }, { id: 'asc' }],
    })
    if (remaining.length === 0) {
      await db.group.delete({ where: { id: group.id } }) // cascades members & messages
    } else {
      await db.$transaction([
        db.groupMember.delete({ where: { id: membership.id } }),
        db.groupMember.update({ where: { id: remaining[0].id }, data: { role: 'OWNER' } }),
        db.group.update({ where: { id: group.id }, data: { ownerId: remaining[0].userId } }),
      ])
    }
  } else {
    await db.groupMember.delete({ where: { id: membership.id } })
  }
  return ok({ ok: true })
}
