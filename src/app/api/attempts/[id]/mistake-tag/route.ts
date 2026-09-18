import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { badRequest, forbidden, notFound, ok, unauthorized } from '@/lib/api-helpers'
import { loadAttempt, maybeAutoSubmit } from '@/lib/attempt-service'
import { z } from 'zod'

const MISTAKE_TAGS = ['CONCEPT_GAP', 'FORMULA_ERROR', 'CALCULATION_ERROR', 'SILLY_MISTAKE', 'MISREAD_QUESTION', 'TIME_PRESSURE', 'GUESS', 'OTHER'] as const
const schema = z.object({
  questionId: z.string().min(1),
  tag: z.enum(MISTAKE_TAGS).nullable(),
})

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()

  const body = await schema.safeParse(await req.json().catch(() => null))
  if (!body.success) return badRequest('Invalid mistake tag')

  let attempt = await loadAttempt(id)
  if (!attempt) return notFound('Attempt')
  if (attempt.userId !== user.id) return forbidden()
  attempt = await maybeAutoSubmit(attempt)
  if (attempt.status !== 'SUBMITTED') return badRequest('Attempt has not been submitted yet')

  const ans = attempt.answers.find(a => a.questionId === body.data.questionId)
  if (!ans) return badRequest('Question does not belong to this attempt')
  // tagging only allowed for wrong / unattempted questions
  if (ans.isCorrect === true) return badRequest('Mistake tags can only be set for wrong or unattempted questions')

  await db.attemptAnswer.update({ where: { id: ans.id }, data: { mistakeTag: body.data.tag } })
  return ok({ ok: true })
}
