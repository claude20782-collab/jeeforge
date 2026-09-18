import { requireUser } from '@/lib/auth'
import { badRequest, forbidden, notFound, ok, unauthorized } from '@/lib/api-helpers'
import { buildSolutions, loadAttempt, maybeAutoSubmit } from '@/lib/attempt-service'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()

  let attempt = await loadAttempt(id)
  if (!attempt) return notFound('Attempt')
  if (attempt.userId !== user.id) return forbidden()
  attempt = await maybeAutoSubmit(attempt)
  if (attempt.status !== 'SUBMITTED') {
    return badRequest('Attempt has not been submitted yet')
  }
  return ok({ solutions: buildSolutions(attempt) })
}
