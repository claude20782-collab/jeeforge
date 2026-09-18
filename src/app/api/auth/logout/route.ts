import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { SESSION_COOKIE } from '@/lib/auth'
import { ok } from '@/lib/api-helpers'
import { currentSessionId } from '@/lib/attempt-service'

export async function POST() {
  const sid = await currentSessionId()
  if (sid) {
    await db.session.update({ where: { id: sid }, data: { revokedAt: new Date() } }).catch(() => {})
  }
  // clear the session cookie as well
  const store = await cookies()
  store.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return ok({ ok: true })
}
