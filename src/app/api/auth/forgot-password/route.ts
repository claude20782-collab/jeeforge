import { clientIp, rateLimit } from '@/lib/rate-limit'
import { badRequest, fail, ok, parseBody } from '@/lib/api-helpers'
import { z } from 'zod'

const schema = z.object({ email: z.string().trim().toLowerCase().email() })

export async function POST(req: Request) {
  const rl = rateLimit(`forgot:${clientIp(req)}`, 10, 60 * 60 * 1000)
  if (!rl.ok) return fail(429, `Too many requests. Retry in ${rl.retryAfterSec}s`)
  const body = await parseBody(req, schema)
  if (!body) return badRequest('Invalid email address')
  // No user enumeration: same response whether or not the account exists.
  // Email delivery is not configured on this deployment.
  return ok({
    ok: true,
    message: 'If an account exists for this email, a password reset has been recorded. Note: automated email delivery is not configured on this deployment — please contact an administrator to reset your password.',
  })
}
