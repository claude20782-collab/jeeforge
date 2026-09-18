import { cookies } from 'next/headers'
import { getSessionUser, SESSION_COOKIE } from '@/lib/auth'
import { ok } from '@/lib/api-helpers'
import { toPublicUser } from '@/lib/attempt-service'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return ok({ user: null })
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? null
  return ok({ user: toPublicUser(user, true), accessToken: token })
}
