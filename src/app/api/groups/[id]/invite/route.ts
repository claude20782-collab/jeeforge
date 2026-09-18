import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { badRequest, fail, notFound, ok, unauthorized } from '@/lib/api-helpers'
import { createNotifications } from '@/lib/attempt-service'
import { z } from 'zod'

const schema = z.object({ username: z.string().trim().toLowerCase().min(3).max(20) })

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()

  const body = await schema.safeParse(await req.json().catch(() => null))
  if (!body.success) return badRequest('Invalid username')

  const group = await db.group.findUnique({ where: { id } })
  if (!group) return notFound('Group')
  if (!group.isPrivate) return badRequest('Group is public — users can join directly')

  const myMembership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId: group.id, userId: user.id } },
  })
  if (!myMembership || !['OWNER', 'MODERATOR'].includes(myMembership.role)) {
    return fail(403, 'Only the group owner or moderators can invite members')
  }

  const target = await db.user.findUnique({ where: { username: body.data.username } })
  if (!target) return notFound('User')

  const existing = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId: group.id, userId: target.id } },
  })
  if (!existing) {
    await db.groupMember.create({ data: { groupId: group.id, userId: target.id, role: 'MEMBER' } })
    await createNotifications([{
      userId: target.id,
      type: 'GROUP_ACTIVITY',
      title: `You were invited to "${group.name}"`,
      body: `${user.displayName ?? user.username} added you to the private group "${group.name}".`,
      link: `#/group/${group.id}`,
      actorId: user.id,
      groupId: group.id,
    }])
  }
  return ok({ ok: true })
}
