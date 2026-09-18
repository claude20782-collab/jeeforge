import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { badRequest, ok, unauthorized } from '@/lib/api-helpers'
import { z } from 'zod'

const schema = z.object({
  ids: z.array(z.string().min(1)).max(200).optional(),
  all: z.boolean().optional(),
})

export async function POST(req: Request) {
  const user = await requireUser()
  if (!user) return unauthorized()
  const body = await schema.safeParse(await req.json().catch(() => null))
  if (!body.success) return badRequest('Invalid request')
  if (body.data.all || !body.data.ids?.length) {
    await db.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } })
  } else {
    await db.notification.updateMany({
      where: { userId: user.id, id: { in: body.data.ids }, readAt: null },
      data: { readAt: new Date() },
    })
  }
  return ok({ ok: true })
}
