import { db } from '@/lib/db'
import { countActiveSessions, requireUser } from '@/lib/auth'
import { clientIp } from '@/lib/rate-limit'
import { fail, notFound, ok, unauthorized } from '@/lib/api-helpers'
import { buildAttemptFull, loadAttempt, maybeAutoSubmit } from '@/lib/attempt-service'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()

  const mock = await db.mock.findUnique({ where: { id } })
    ?? (/^\d+$/.test(id) ? await db.mock.findUnique({ where: { mockNumber: Number(id) } }) : null)
  if (!mock) return notFound('Mock')

  if (mock.status !== 'PUBLISHED') return fail(403, 'This mock is not published yet')
  const unlocked = mock.scheduledAt.getTime() <= Date.now()
  if (!unlocked && user.role !== 'ADMIN') {
    return fail(403, `This mock unlocks at ${mock.scheduledAt.toISOString()}`)
  }

  // One attempt per user per mock (DB-unique). IN_PROGRESS → resume it;
  // SUBMITTED (or IN_PROGRESS past deadline → auto-submitted) → 409 with attemptId.
  const existing = await db.attempt.findUnique({ where: { userId_mockId: { userId: user.id, mockId: mock.id } } })
  if (existing) {
    if (existing.status === 'SUBMITTED') {
      return Response.json(
        { error: 'You have already submitted this mock', attemptId: existing.id, status: existing.status },
        { status: 409 },
      )
    }
    const loaded = await loadAttempt(existing.id)
    if (!loaded) return notFound('Attempt')
    const fresh = await maybeAutoSubmit(loaded)
    if (fresh.status === 'SUBMITTED') {
      return Response.json(
        { error: 'Time is up — this attempt was auto-submitted', attemptId: fresh.id, status: fresh.status },
        { status: 409 },
      )
    }
    return ok({ attempt: buildAttemptFull(fresh) })
  }

  const startedAt = new Date()
  const deadlineAt = new Date(startedAt.getTime() + mock.durationMinutes * 60 * 1000)
  const activeSessions = await countActiveSessions(user.id)

  const questions = await db.mockQuestion.findMany({
    where: { mockId: mock.id },
    select: { questionId: true },
    orderBy: { order: 'asc' },
  })

  const attempt = await db.attempt.create({
    data: {
      userId: user.id,
      mockId: mock.id,
      status: 'IN_PROGRESS',
      startedAt,
      deadlineAt,
      ip: clientIp(req),
      userAgent: req.headers.get('user-agent'),
      suspiciousFlags: { multipleActiveSessions: activeSessions > 1 },
      answers: {
        create: questions.map(q => ({ questionId: q.questionId })),
      },
    },
  })
  const loaded = await loadAttempt(attempt.id)
  if (!loaded) return notFound('Attempt')
  return ok({ attempt: buildAttemptFull(loaded) }, { status: 201 })
}
