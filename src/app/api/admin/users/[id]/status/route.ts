import { db } from '@/lib/db'
import { requireAdmin, revokeAllUserSessions } from '@/lib/auth'
import { badRequest, fail, forbidden, notFound, ok, parseBody } from '@/lib/api-helpers'
import { logModeration } from '@/lib/attempt-service'
import { z } from 'zod'

const schema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
  note: z.string().trim().max(500).optional(),
})

const ACTION_BY_STATUS: Record<string, string> = {
  SUSPENDED: 'SUSPEND_USER',
  BANNED: 'BAN_USER',
  ACTIVE: 'RESTORE_USER',
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const body = await parseBody(req, schema)
  if (!body) return badRequest('Invalid status payload')

  const target = await db.user.findUnique({ where: { id } })
  if (!target) return notFound('User')
  if (target.id === admin.id) return badRequest('You cannot change your own status')
  if (target.role === 'ADMIN' && body.status !== 'ACTIVE') {
    return fail(403, 'Admin accounts cannot be suspended or banned from here')
  }

  await db.user.update({ where: { id: target.id }, data: { status: body.status } })
  if (body.status !== 'ACTIVE') {
    await revokeAllUserSessions(target.id)
  }
  await logModeration(admin.id, ACTION_BY_STATUS[body.status], 'User', target.id, body.note ?? null)
  return ok({ ok: true })
}
