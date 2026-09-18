import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { forbidden, ok } from '@/lib/api-helpers'

export async function GET(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const statusParam = new URL(req.url).searchParams.get('status')
  const where = statusParam && ['OPEN', 'RESOLVED', 'DISMISSED'].includes(statusParam)
    ? { status: statusParam }
    : {}

  const reports = await db.report.findMany({
    where,
    include: { reporter: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const [targetUsers, groupMessages, directMessages] = await Promise.all([
    db.user.findMany({
      where: { id: { in: reports.map(r => r.targetUserId).filter((x): x is string => !!x) } },
      select: { id: true, username: true },
    }),
    db.groupMessage.findMany({
      where: { id: { in: reports.map(r => r.targetMessageId).filter((x): x is string => !!x) } },
      select: { id: true, content: true },
    }),
    db.directMessage.findMany({
      where: { id: { in: reports.map(r => r.targetMessageId).filter((x): x is string => !!x) } },
      select: { id: true, content: true },
    }),
  ])
  const userMap = new Map(targetUsers.map(u => [u.id, u.username]))
  const messageMap = new Map(
    [...groupMessages, ...directMessages].map(m => [m.id, m.content.slice(0, 120)]),
  )

  return ok({
    reports: reports.map(r => ({
      id: r.id,
      reporterUsername: r.reporter.username,
      targetType: r.targetType,
      targetUserId: r.targetUserId,
      targetUsername: r.targetUserId ? (userMap.get(r.targetUserId) ?? null) : null,
      targetMessageId: r.targetMessageId,
      targetGroupId: r.targetGroupId,
      snippet: r.targetMessageId ? (messageMap.get(r.targetMessageId) ?? null) : null,
      reason: r.reason,
      details: r.details,
      status: r.status,
      resolutionNote: r.resolutionNote,
      createdAt: r.createdAt.toISOString(),
      resolvedAt: r.resolvedAt ? r.resolvedAt.toISOString() : null,
    })),
  })
}
