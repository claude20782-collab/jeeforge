import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { fail, ok } from '@/lib/api-helpers'
import { istMonthStart, istWeekStart } from '@/lib/scoring'
import { round2 } from '@/lib/attempt-service'
import type { LeaderboardEntry, LeaderboardResponse } from '@/lib/types'
import type { Attempt, Mock, User as PUser } from '@prisma/client'

type Row = {
  user: PUser
  score: number
  accuracy: number | null
  attempts: number
  timeUsedSeconds: number | null
  submittedAt: Date | null
}

function cmp(a: Row, b: Row): number {
  if (b.score !== a.score) return b.score - a.score
  const accA = a.accuracy ?? -1
  const accB = b.accuracy ?? -1
  if (accB !== accA) return accB - accA
  if (a.attempts !== b.attempts) return a.attempts - b.attempts
  const sa = a.submittedAt?.getTime() ?? Number.MAX_SAFE_INTEGER
  const sb = b.submittedAt?.getTime() ?? Number.MAX_SAFE_INTEGER
  if (sa !== sb) return sa - sb
  return a.user.username.localeCompare(b.user.username)
}

function toEntry(row: Row, rank: number): LeaderboardEntry {
  return {
    rank,
    username: row.user.username,
    displayName: row.user.displayName,
    avatarUrl: row.user.avatarUrl,
    score: row.score,
    accuracy: row.accuracy,
    attempts: row.attempts,
    timeUsedSeconds: row.timeUsedSeconds,
    submittedAt: row.submittedAt ? row.submittedAt.toISOString() : null,
  }
}

function bestOf(list: Attempt[]): Attempt {
  return [...list].sort((x, y) => {
    if ((y.score ?? 0) !== (x.score ?? 0)) return (y.score ?? 0) - (x.score ?? 0)
    return (x.submittedAt?.getTime() ?? 0) - (y.submittedAt?.getTime() ?? 0)
  })[0]
}

function aggregateRows(attempts: Attempt[], users: Map<string, PUser>, mode: 'best' | 'total' | 'average'): Row[] {
  const byUser = new Map<string, Attempt[]>()
  for (const a of attempts) {
    const list = byUser.get(a.userId) ?? []
    list.push(a)
    byUser.set(a.userId, list)
  }
  const rows: Row[] = []
  for (const [userId, list] of byUser) {
    const user = users.get(userId)
    if (!user) continue
    if (mode === 'best') {
      const best = bestOf(list)
      rows.push({
        user,
        score: best.score ?? 0,
        accuracy: best.accuracy ?? null,
        attempts: list.length,
        timeUsedSeconds: best.timeUsedSeconds ?? null,
        submittedAt: best.submittedAt,
      })
    } else {
      const totalScore = list.reduce((s, a) => s + (a.score ?? 0), 0)
      const correct = list.reduce((s, a) => s + (a.correctCount ?? 0), 0)
      const wrong = list.reduce((s, a) => s + (a.wrongCount ?? 0), 0)
      const avgTime = list.reduce((s, a) => s + (a.timeUsedSeconds ?? 0), 0) / list.length
      rows.push({
        user,
        score: mode === 'total' ? totalScore : round2(totalScore / list.length),
        accuracy: correct + wrong > 0 ? round2((correct / (correct + wrong)) * 100) : null,
        attempts: list.length,
        timeUsedSeconds: Math.round(avgTime),
        submittedAt: null,
      })
    }
  }
  return rows
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const scopeParam = url.searchParams.get('scope') ?? 'current'
  const scopes = ['current', 'weekly', 'monthly', 'overall', 'allmock'] as const
  const scope = (scopes as readonly string[]).includes(scopeParam) ? (scopeParam as (typeof scopes)[number]) : null
  if (!scope) return fail(400, 'Invalid scope')
  const viewer = await getSessionUser()
  const now = new Date()

  let mockNumber: number | null = null
  let attempts: Attempt[] = []
  let mode: 'best' | 'total' | 'average' = 'best'

  if (scope === 'current') {
    const mockIdParam = url.searchParams.get('mockId')
    let mock: Mock | null = null
    if (mockIdParam) {
      mock = (await db.mock.findUnique({ where: { id: mockIdParam } }))
        ?? (/^\d+$/.test(mockIdParam) ? await db.mock.findUnique({ where: { mockNumber: Number(mockIdParam) } }) : null)
      if (!mock) return fail(404, 'Mock not found')
    } else {
      mock = await db.mock.findFirst({
        where: { status: 'PUBLISHED', scheduledAt: { lte: now } },
        orderBy: { mockNumber: 'desc' },
      })
    }
    if (mock) {
      mockNumber = mock.mockNumber
      attempts = await db.attempt.findMany({ where: { mockId: mock.id, status: 'SUBMITTED' } })
    }
  } else if (scope === 'weekly' || scope === 'monthly') {
    const since = scope === 'weekly' ? istWeekStart(now) : istMonthStart(now)
    attempts = await db.attempt.findMany({ where: { status: 'SUBMITTED', submittedAt: { gte: since } } })
  } else {
    attempts = await db.attempt.findMany({ where: { status: 'SUBMITTED' } })
    mode = scope === 'overall' ? 'total' : 'average'
  }

  const userIds = [...new Set(attempts.map(a => a.userId))]
  const users = new Map<string, PUser>((await db.user.findMany({ where: { id: { in: userIds } } })).map(u => [u.id, u]))

  const allRows = aggregateRows(attempts, users, mode)
  // leaderboardVisible=false → excluded from public entries; own standing still returned to self
  const visibleRows = allRows.filter(r => r.user.leaderboardVisible).sort(cmp)
  const entries = visibleRows.slice(0, 100).map((r, i) => toEntry(r, i + 1))

  let me: LeaderboardResponse['me'] = { rank: null, entry: null }
  if (viewer) {
    const myRow = allRows.find(r => r.user.id === viewer.id)
    if (myRow) {
      const idx = visibleRows.findIndex(r => r.user.id === viewer.id)
      const rankNum = viewer.leaderboardVisible && idx >= 0 ? idx + 1 : null
      me = { rank: rankNum, entry: toEntry(myRow, rankNum ?? 0) }
    }
  }

  const response: LeaderboardResponse = {
    scope,
    mockNumber,
    updatedAt: now.toISOString(),
    entries,
    me,
  }
  return ok(response)
}
