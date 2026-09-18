import { requireUser } from '@/lib/auth'
import { forbidden, notFound, ok, unauthorized } from '@/lib/api-helpers'
import { buildAttemptFull, loadAttempt, maybeAutoSubmit } from '@/lib/attempt-service'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireUser()
  if (!user) return unauthorized()
  let attempt = await loadAttempt(id)
  if (!attempt) return notFound('Attempt')
  if (attempt.userId !== user.id) return forbidden()
  // server-side timer: auto-submit expired IN_PROGRESS attempts on any read
  attempt = await maybeAutoSubmit(attempt)
  return ok({ attempt: buildAttemptFull(attempt) })
}
