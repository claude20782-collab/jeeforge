import crypto from 'crypto'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { forbidden, notFound, ok } from '@/lib/api-helpers'
import { logModeration } from '@/lib/attempt-service'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const target = await db.user.findUnique({ where: { id } })
  if (!target) return notFound('User')

  // invalidate any previous unused tokens for this user
  await db.passwordResetToken.updateMany({
    where: { userId: target.id, usedAt: null },
    data: { usedAt: new Date() },
  })

  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  await db.passwordResetToken.create({
    data: {
      userId: target.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })
  await logModeration(admin.id, 'RESET_PASSWORD', 'User', target.id, `Reset token issued for @${target.username}`)
  return ok({ token })
}
