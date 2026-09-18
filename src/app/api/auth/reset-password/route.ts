import crypto from 'crypto'
import { db } from '@/lib/db'
import { hashPassword, revokeAllUserSessions } from '@/lib/auth'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { badRequest, fail, ok, parseBody } from '@/lib/api-helpers'
import { z } from 'zod'

const schema = z.object({
  token: z.string().min(10).max(200),
  newPassword: z.string().min(8).max(72),
})

export async function POST(req: Request) {
  const rl = rateLimit(`reset:${clientIp(req)}`, 10, 60 * 60 * 1000)
  if (!rl.ok) return fail(429, `Too many requests. Retry in ${rl.retryAfterSec}s`)
  const body = await parseBody(req, schema)
  if (!body) return badRequest('Invalid reset request')

  const tokenHash = crypto.createHash('sha256').update(body.token).digest('hex')
  const record = await db.passwordResetToken.findUnique({ where: { tokenHash }, include: { user: true } })
  if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
    return fail(400, 'Invalid or expired reset token')
  }
  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { passwordHash: await hashPassword(body.newPassword) } }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ])
  await revokeAllUserSessions(record.userId)
  return ok({ ok: true })
}
