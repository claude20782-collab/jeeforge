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
    isSelf,
    blocked,
  }
  return ok({ profile })
}
