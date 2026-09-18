import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { badRequest, forbidden, ok, unauthorized } from '@/lib/api-helpers'
import { z } from 'zod'

const schema = z.object({ muted: z.boolean() })

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()
  const body = await schema.safeParse(await req.json().catch(() => null))
  if (!body.success) return badRequest('Invalid request')

  const membership = await db.groupMember.findUnique({
    where: { groupId_userId: { groupId: id, userId: user.id } },
  })
  if (!membership) return forbidden()

  await db.groupMember.update({ where: { id: membership.id }, data: { muted: body.data.muted } })
  return ok({ ok: true })
}
