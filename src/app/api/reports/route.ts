import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { badRequest, fail, notFound, ok, unauthorized } from '@/lib/api-helpers'
import { z } from 'zod'

const schema = z.object({
  targetType: z.enum(['USER', 'GROUP_MESSAGE', 'DIRECT_MESSAGE', 'GROUP']),
  targetUserId: z.string().optional(),
  // T5-d addition (frontend agent F): USER reports may identify the target by
  // username — no public endpoint exposes other users' ids (PublicProfile has
  // none), and private profiles 403 on lookup. Additive; targetUserId still works.
  targetUsername: z.string().trim().toLowerCase().min(3).max(20).optional(),
  targetMessageId: z.string().optional(),
  targetGroupId: z.string().optional(),
  reason: z.enum(['SPAM', 'ABUSE', 'HARASSMENT', 'CHEATING', 'INAPPROPRIATE', 'OTHER']),
  details: z.string().trim().max(2000).optional(),
})

export async function POST(req: Request) {
  const user = await requireUser()
  if (!user) return unauthorized()
  const rl = rateLimit(`report:${user.id}:${clientIp(req)}`, 10, 60 * 60 * 1000)
  if (!rl.ok) return fail(429, `Too many reports. Retry in ${rl.retryAfterSec}s`)

  const body = await schema.safeParse(await req.json().catch(() => null))
  if (!body.success) return badRequest('Invalid report payload')
  const { targetType, targetUserId, targetUsername, targetMessageId, targetGroupId, reason, details } = body.data

  if (targetType === 'USER' && !targetUserId && !targetUsername) {
    return badRequest('targetUserId or targetUsername is required for user reports')
  }
  if (targetType === 'GROUP' && !targetGroupId) return badRequest('targetGroupId is required for group reports')
  if ((targetType === 'GROUP_MESSAGE' || targetType === 'DIRECT_MESSAGE') && !targetMessageId) {
    return badRequest('targetMessageId is required for message reports')
  }

  let resolvedTargetUserId = targetUserId
  if (targetType === 'USER') {
    if (!resolvedTargetUserId && targetUsername) {
      const byName = await db.user.findUnique({ where: { username: targetUsername } })
      if (!byName) return notFound('Reported user')
      resolvedTargetUserId = byName.id
    }
    if (resolvedTargetUserId) {
      const t = await db.user.findUnique({ where: { id: resolvedTargetUserId } })
      if (!t) return notFound('Reported user')
    }
  } else if (targetType === 'GROUP' && targetGroupId) {
    const t = await db.group.findUnique({ where: { id: targetGroupId } })
    if (!t) return notFound('Reported group')
  } else if (targetMessageId) {
    const t = targetType === 'GROUP_MESSAGE'
      ? await db.groupMessage.findUnique({ where: { id: targetMessageId } })
      : await db.directMessage.findUnique({ where: { id: targetMessageId } })
    if (!t) return notFound('Reported message')
  }

  await db.report.create({
    data: {
      reporterId: user.id,
      targetType,
      targetUserId: resolvedTargetUserId ?? null,
      targetMessageId: targetMessageId ?? null,
      targetGroupId: targetGroupId ?? null,
      reason,
      details: details ?? null,
    },
  })
  return ok({ ok: true }, { status: 201 })
}
