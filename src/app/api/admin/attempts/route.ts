import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { badRequest, forbidden, ok, parseBody } from '@/lib/api-helpers'
import { z } from 'zod'

export async function GET(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const url = new URL(req.url)
  const page = Math.max(0, Number(url.searchParams.get('page') ?? 0) || 0)
  const mockNumberRaw = url.searchParams.get('mockNumber')
  const status = url.searchParams.get('status')

  const where: { mockId?: string; status?: string } = {}
  if (mockNumberRaw && mockNumberRaw !== 'ALL') {
    const n = Number(mockNumberRaw)
    const m = await db.mock.findUnique({ where: { mockNumber: n }, select: { id: true } })
    if (m) where.mockId = m.id
  }
  if (status && status !== 'ALL') where.status = status

  const [total, attempts] = await Promise.all([
    db.attempt.count({ where }),
    db.attempt.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      skip: page * 20,
      take: 20,
      select: {
        id: true, status: true, score: true, physicsScore: true, chemistryScore: true, mathsScore: true,
        startedAt: true, submittedAt: true, autoSubmitted: true,
        user: { select: { username: true, email: true } },
        mock: { select: { mockNumber: true } },
        _count: { select: { answers: true } },
      },
    }),
  ])

  return ok({
    total,
    attempts: attempts.map(a => ({
      id: a.id,
      username: a.user.username,
      email: a.user.email,
      mockNumber: a.mock.mockNumber,
      status: a.status,
      score: a.score,
      subjectScores: a.status === 'SUBMITTED' ? [a.physicsScore, a.chemistryScore, a.mathsScore] : null,
      startedAt: a.startedAt.toISOString(),
      submittedAt: a.submittedAt?.toISOString() ?? null,
      autoSubmitted: a.autoSubmitted,
      answered: a._count.answers,
    })),
  })
}

const deleteSchema = z.object({ attemptId: z.string().min(1) })

export async function DELETE(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const body = await parseBody(req, deleteSchema)
  if (!body) return badRequest('attemptId required')

  const attempt = await db.attempt.findUnique({
    where: { id: body.attemptId },
    include: { user: { select: { username: true } }, mock: { select: { mockNumber: true } } },
  })
  if (!attempt) return badRequest('Attempt not found')

  await db.attempt.delete({ where: { id: attempt.id } })
  return ok({
    deleted: attempt.id,
    username: attempt.user.username,
    mockNumber: attempt.mock.mockNumber,
  })
}
