import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { badRequest, fail, forbidden, notFound, ok, unauthorized } from '@/lib/api-helpers'
import { isAttemptExpired, loadAttempt, scoreAndSubmitAttempt } from '@/lib/attempt-service'
import { z } from 'zod'

const bodySchema = z.object({
  questionId: z.string().min(1),
  selectedAnswer: z.string().max(64).nullable().optional(),
  markedForReview: z.boolean().optional(),
  visited: z.boolean().optional(),
  // clamped server-side to [0,120]; zod only enforces the numeric type
  timeDeltaSeconds: z.number().finite().optional(),
})

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()

  const body = await bodySchema.safeParse(await req.json().catch(() => null))
  if (!body.success) return badRequest('Invalid answer payload')
  const { questionId, selectedAnswer, markedForReview, visited, timeDeltaSeconds } = body.data

  const attempt = await loadAttempt(id)
  if (!attempt) return notFound('Attempt')
  if (attempt.userId !== user.id) return forbidden()

  if (attempt.status !== 'IN_PROGRESS') {
    return fail(410, 'This attempt has already been submitted and can no longer be modified')
  }
  if (isAttemptExpired(attempt)) {
    await scoreAndSubmitAttempt(attempt.id, true)
    return fail(410, 'Time is up — your attempt was auto-submitted')
  }

  const mq = attempt.mock.questions.find(q => q.questionId === questionId)
  if (!mq) return badRequest('Question does not belong to this attempt')

  let answer: string | null | undefined = selectedAnswer
  if (typeof answer === 'string') {
    answer = answer.trim()
    if (answer === '') answer = null
    else if (mq.question.section === 'A') {
      if (!['A', 'B', 'C', 'D'].includes(answer)) return badRequest('MCQ answer must be one of A, B, C, D')
    } else if (!/^-?\d{1,9}(\.\d{1,6})?$/.test(answer)) {
      return badRequest('Numerical answer must be a number')
    }
  }
  const delta = timeDeltaSeconds != null ? Math.min(120, Math.max(0, Math.round(timeDeltaSeconds))) : 0

  const existing = attempt.answers.find(a => a.questionId === questionId)
  const data: Record<string, unknown> = {}
  if (answer !== undefined) data.selectedAnswer = answer
  if (markedForReview !== undefined) data.markedForReview = markedForReview
  if (visited !== undefined) data.visited = visited
  if (delta > 0) data.timeSpentSeconds = (existing?.timeSpentSeconds ?? 0) + delta
  if ((visited === true || answer != null) && !existing?.firstVisitedAt) data.firstVisitedAt = new Date()

  if (existing) {
    if (Object.keys(data).length > 0) {
      await db.attemptAnswer.update({ where: { id: existing.id }, data })
    }
  } else {
    await db.attemptAnswer.create({
      data: {
        attemptId: attempt.id,
        questionId,
        selectedAnswer: answer ?? null,
        markedForReview: markedForReview ?? false,
        visited: visited ?? false,
        timeSpentSeconds: delta,
        firstVisitedAt: new Date(),
      },
    })
  }

  const remainingSeconds = Math.max(0, Math.floor((attempt.deadlineAt.getTime() - Date.now()) / 1000))
  return ok({ ok: true, remainingSeconds })
}
