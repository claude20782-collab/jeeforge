import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { forbidden, ok } from '@/lib/api-helpers'
import { istDayStart, round2 } from '@/lib/attempt-service'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const now = new Date()

  const [
    users, attempts, submittedAttempts, publishedMocks, draftMocks, openReports, groups, activeTodayRows,
  ] = await Promise.all([
    db.user.count(),
    db.attempt.count(),
    db.attempt.count({ where: { status: 'SUBMITTED' } }),
    db.mock.count({ where: { status: 'PUBLISHED' } }),
    db.mock.count({ where: { status: 'DRAFT' } }),
    db.report.count({ where: { status: 'OPEN' } }),
    db.group.count(),
    db.session.groupBy({ by: ['userId'], where: { lastSeenAt: { gte: istDayStart(now) } } }),
  ])

  const scoreAgg = submittedAttempts > 0
    ? await db.attempt.aggregate({ where: { status: 'SUBMITTED' }, _avg: { score: true } })
    : null

  const [recentUsers, recentAttempts, recentReports, participationRows] = await Promise.all([
    db.user.findMany({ orderBy: { createdAt: 'desc' }, take: 10, select: { id: true, username: true, email: true, displayName: true, role: true, status: true, createdAt: true } }),
    db.attempt.findMany({ where: { status: 'SUBMITTED' }, orderBy: { submittedAt: 'desc' }, take: 10, include: { user: { select: { username: true } }, mock: { select: { mockNumber: true, title: true } } } }),
    db.report.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { reporter: { select: { username: true } } } }),
    db.mock.findMany({ where: { status: 'PUBLISHED' }, orderBy: { mockNumber: 'asc' }, select: { id: true, mockNumber: true, title: true } }),
  ])

  const attemptStats = await db.attempt.groupBy({
    by: ['mockId'],
    where: { status: 'SUBMITTED' },
    _count: { _all: true },
    _avg: { score: true },
  })
  const statMap = new Map(attemptStats.map(s => [s.mockId, s]))

  return ok({
    counts: {
      users,
      activeToday: activeTodayRows.length,
      attempts,
      submittedAttempts,
      publishedMocks,
      draftMocks,
      openReports,
      groups,
    },
    avgScore: scoreAgg?._avg.score != null ? round2(scoreAgg._avg.score) : null,
    participation: participationRows.map(m => ({
      mockNumber: m.mockNumber,
      title: m.title,
      attempts: statMap.get(m.id)?._count._all ?? 0,
      avgScore: statMap.get(m.id)?._avg.score != null ? round2(statMap.get(m.id)!._avg.score!) : null,
    })),
    recentUsers: recentUsers.map(u => ({ ...u, createdAt: u.createdAt.toISOString() })),
    recentAttempts: recentAttempts.map(a => ({
      id: a.id,
      username: a.user.username,
      mockNumber: a.mock.mockNumber,
      mockTitle: a.mock.title,
      score: a.score ?? 0,
      submittedAt: (a.submittedAt ?? a.startedAt).toISOString(),
    })),
    recentReports: recentReports.map(r => ({
      id: r.id,
      reporterUsername: r.reporter.username,
      targetType: r.targetType,
      reason: r.reason,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    })),
  })
}
