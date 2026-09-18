import { db } from '@/lib/db'
import { createSession, hashPassword, registerSchema } from '@/lib/auth'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { badRequest, fail, ok, parseBody } from '@/lib/api-helpers'
import { toPublicUser } from '@/lib/attempt-service'

export async function POST(req: Request) {
  const ip = clientIp(req)
  const rl = rateLimit(`register:${ip}`, 10, 60 * 60 * 1000)
  if (!rl.ok) return fail(429, `Too many registrations from this network. Retry in ${rl.retryAfterSec}s`)

  const body = await parseBody(req, registerSchema)
  if (!body) return badRequest('Invalid registration details. Username: 3-20 chars (a-z, 0-9, _), password: min 8 chars.')

  const [emailTaken, usernameTaken] = await Promise.all([
    db.user.findUnique({ where: { email: body.email } }),
    db.user.findUnique({ where: { username: body.username } }),
  ])
  if (emailTaken) return fail(409, 'An account with this email already exists')
  if (usernameTaken) return fail(409, 'This username is already taken')

  const user = await db.user.create({
    data: {
      email: body.email,
      username: body.username,
      passwordHash: await hashPassword(body.password),
      displayName: body.displayName ?? null,
    },
  })
  const { token } = await createSession(user.id, req.headers.get('user-agent'), ip)
  return ok({ user: toPublicUser(user), accessToken: token }, { status: 201 })
}
