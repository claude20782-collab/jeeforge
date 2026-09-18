import { db } from '@/lib/db'
import { changePasswordSchema, createSession, hashPassword, requireUser, revokeAllUserSessions, verifyPassword } from '@/lib/auth'
import { badRequest, fail, ok, parseBody, unauthorized } from '@/lib/api-helpers'
import { clientIp } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const user = await requireUser()
  if (!user) return unauthorized()
  const body = await parseBody(req, changePasswordSchema)
  if (!body) return badRequest('Invalid request — new password must be at least 8 characters')
  if (!(await verifyPassword(body.currentPassword, user.passwordHash))) {
    return fail(400, 'Current password is incorrect')
  }
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(body.newPassword) } })
  // revoke every session, then re-issue one for the current client
  await revokeAllUserSessions(user.id)
  await createSession(user.id, req.headers.get('user-agent'), clientIp(req))
  return ok({ ok: true })
}
