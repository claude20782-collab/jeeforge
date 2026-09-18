import { db } from '@/lib/db'
import { createSession, loginSchema, verifyPassword } from '@/lib/auth'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { badRequest, fail, ok, parseBody } from '@/lib/api-helpers'
import { toPublicUser } from '@/lib/attempt-service'

export async function POST(req: Request) {
  const ip = clientIp(req)
  const rl = rateLimit(`login:${ip}`, 15, 10 * 60 * 1000)
  if (!rl.ok) return fail(429, `Too many login attempts. Retry in ${rl.retryAfterSec}s`)

  const body = await parseBody(req, loginSchema)
  if (!body) return badRequest('Invalid login request')

  const ident = body.emailOrUsername.toLowerCase()
  const user = await db.user.findFirst({
    where: { OR: [{ email: ident }, { username: ident }] },
  })
  if (!user || user.status !== 'ACTIVE' || !(await verifyPassword(body.password, user.passwordHash))) {
    return fail(401, 'Invalid credentials')
  }
  const { token } = await createSession(user.id, req.headers.get('user-agent'), ip)
  return ok({ user: toPublicUser(user), accessToken: token })
}
