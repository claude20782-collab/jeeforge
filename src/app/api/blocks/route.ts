import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { badRequest, notFound, ok, unauthorized } from '@/lib/api-helpers'
import { z } from 'zod'

const schema = z.object({ username: z.string().trim().toLowerCase().min(3).max(20) })

export async function GET() {
  const user = await requireUser()
  if (!user) return unauthorized()
  const blocks = await db.block.findMany({
    where: { blockerId: user.id },
    include: { blocked: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return ok({ blocked: blocks.map(b => ({ username: b.blocked.username, since: b.createdAt.toISOString() })) })
}

export async function POST(req: Request) {
  const user = await requireUser()
  if (!user) return unauthorized()
  const body = await schema.safeParse(await req.json().catch(() => null))
  if (!body.success) return badRequest('Invalid username')
  const target = await db.user.findUnique({ where: { username: body.data.username } })
  if (!target) return notFound('User')
  if (target.id === user.id) return badRequest('You cannot block yourself')
  await db.block.upsert({
    where: { blockerId_blockedId: { blockerId: user.id, blockedId: target.id } },
    create: { blockerId: user.id, blockedId: target.id },
    update: {},
  })
  return ok({ ok: true })
}

export async function DELETE(req: Request) {
  const user = await requireUser()
  if (!user) return unauthorized()
  const body = await schema.safeParse(await req.json().catch(() => null))
  if (!body.success) return badRequest('Invalid username')
  const target = await db.user.findUnique({ where: { username: body.data.username } })
  if (!target) return notFound('User')
  await db.block.deleteMany({ where: { blockerId: user.id, blockedId: target.id } })
  return ok({ ok: true })
}
