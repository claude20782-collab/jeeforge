import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { fail, notFound, ok, unauthorized } from '@/lib/api-helpers'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()
  const group = await db.group.findUnique({ where: { id } })
  if (!group) return notFound('Group')
  if (group.isPrivate) return fail(403, 'This group is private — ask the owner or a moderator for an invite')

  const existing = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId: group.id, userId: user.id } },
  })
  if (!existing) {
    await db.groupMember.create({ data: { groupId: group.id, userId: user.id, role: 'MEMBER' } })
  }
  return ok({ ok: true })
}
