import { requireUser } from '@/lib/auth'
import { forbidden, notFound, ok, unauthorized } from '@/lib/api-helpers'
import { loadAttempt, scoreAndSubmitAttempt } from '@/lib/attempt-service'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()

  const attempt = await loadAttempt(id)
  if (!attempt) return notFound('Attempt')
  if (attempt.userId !== user.id) return forbidden()

  if (attempt.status === 'SUBMITTED') {
    return ok({ ok: true, resultId: attempt.id }) // idempotent
  }
  const auto = Date.now() > attempt.deadlineAt.getTime()
  const submitted = await scoreAndSubmitAttempt(attempt.id, auto)
  if (!submitted) return notFound('Attempt')
  return ok({ ok: true, resultId: attempt.id })
}
