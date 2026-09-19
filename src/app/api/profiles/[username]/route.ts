import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { forbidden, notFound, ok } from '@/lib/api-helpers'
import { attemptRank, round2 } from '@/lib/attempt-service'
import { computeStreak } from '@/lib/scoring'
import type { PublicProfile } from '@/lib/types'

export async function GET(_req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const viewer = await getSessionUser()
  const user = await db.user.findUnique({ where: { username: username.toLowerCase() } })
  if (!user) return notFound('User')

  const isSelf = !!viewer && viewer.id === user.id
  if (!user.profilePublic && !isSelf) return forbidden()

  const attempts = await db.attempt.findMany({
    where: { userId: user.id, status: 'SUBMITTED' },
    include: { mock: { select: { mockNumber: true, title: true } } },
    orderBy: { submittedAt: 'desc' },
  })

  // sparse per-day activity map (any attempt event: started or submitted) for the heatmap
  // grouped by IST calendar date (UTC+5:30) — the platform's audience timezone
  const istDateKey = (d: Date) => {
    const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000)
    return `${ist.getUTCFullYear()}-${String(ist.getUTCMonth() + 1).padStart(2, '0')}-${String(ist.getUTCDate()).padStart(2, '0')}`
  }
  const activityMap = new Map<string, number>()
  for (const a of await db.attempt.findMany({
    where: { userId: user.id },
    select: { startedAt: true, submittedAt: true },
  })) {
    for (const d of [a.startedAt, a.submittedAt]) {
      if (!d) continue
      const key = istDateKey(d)
      activityMap.set(key, (activityMap.get(key) ?? 0) + 1)
    }
  }
  const activity = [...activityMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((x, y) => (x.date < y.date ? -1 : 1))

  const ranked = await Promise.all(attempts.map(async a => ({ a, ...(await attemptRank(a)) })))
  const scores = attempts.map(a => a.score ?? 0)
  const correct = attempts.reduce((s, a) => s + (a.correctCount ?? 0), 0)
  const wrong = attempts.reduce((s, a) => s + (a.wrongCount ?? 0), 0)
  const bestRank = ranked.length ? Math.min(...ranked.map(r => r.rank)) : null

  const blocked = !!viewer && !!(await db.block.findUnique({
    where: { blockerId_blockedId: { blockerId: viewer.id, blockedId: user.id } },
  }))

  const profile: PublicProfile = {
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    targetYear: user.targetYear,
    createdAt: user.createdAt.toISOString(),
    stats: {
      mocksCompleted: attempts.length,
      averageScore: attempts.length ? round2(scores.reduce((s, x) => s + x, 0) / attempts.length) : null,
      bestScore: attempts.length ? Math.max(...scores) : null,
      accuracy: correct + wrong > 0 ? round2((correct / (correct + wrong)) * 100) : null,
      streak: computeStreak(attempts.map(a => a.submittedAt ?? a.startedAt)),
      bestRank,
    },
    recentAttempts: ranked.slice(0, 10).map(r => ({
      mockNumber: r.a.mock.mockNumber,
      mockTitle: r.a.mock.title,
      score: r.a.score ?? 0,
      submittedAt: (r.a.submittedAt ?? r.a.startedAt).toISOString(),
      rank: r.rank,
    })),
    activity,
    isSelf,
    blocked,
  }
  return ok({ profile })
}
