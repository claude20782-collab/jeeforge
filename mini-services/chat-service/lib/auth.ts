// JWT auth for socket handshakes.
// Mirrors the root app's src/lib/auth.ts: HS256 JWT signed with JWT_SECRET,
// payload { sub: userId, sid: sessionId, username, role }, cookie name `jee_session`.
// The socket client passes it as `io(url, { auth: { token } })`; the browser cookie
// is accepted as a fallback (same-origin requests through the gateway carry it).
import { jwtVerify } from 'jose'
import { db } from './db'
import { JWT_SECRET } from './env'

export interface SocketAuthUser {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  role: string
}

export const SESSION_COOKIE = 'jee_session'

let cachedSecret: Uint8Array | null = null
function secret(): Uint8Array {
  if (!cachedSecret) cachedSecret = new TextEncoder().encode(JWT_SECRET)
  return cachedSecret
}

/** Extract `jee_session` from a cookie header (fallback when no auth.token given). */
export function cookieToken(cookieHeader: string | string[] | undefined): string | null {
  if (!cookieHeader) return null
  const raw = Array.isArray(cookieHeader) ? cookieHeader.join('; ') : cookieHeader
  for (const part of raw.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    if (part.slice(0, idx).trim() === SESSION_COOKIE) {
      try {
        return decodeURIComponent(part.slice(idx + 1).trim())
      } catch {
        return part.slice(idx + 1).trim()
      }
    }
  }
  return null
}

/**
 * Verify the JWT and load the user. Rejects: bad/expired signature, unknown user,
 * non-ACTIVE user (banned/suspended disconnect), revoked session (when the sid
 * maps to an existing session row — best-effort check, see worklog).
 */
export async function authenticateSocket(token: string | null | undefined): Promise<SocketAuthUser | null> {
  try {
    if (!JWT_SECRET) {
      console.error('[auth] JWT_SECRET is not set — rejecting all connections')
      return null
    }
    if (!token) return null
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] })
    const sub = typeof payload.sub === 'string' ? payload.sub : null
    const sid = typeof payload.sid === 'string' ? payload.sid : null
    if (!sub) return null
    if (sid) {
      // Best-effort revocation check: reject when the session exists and is revoked.
      const session = await db.session.findUnique({ where: { id: sid } })
      if (session?.revokedAt) return null
    }
    const user = await db.user.findUnique({ where: { id: sub } })
    if (!user || user.status !== 'ACTIVE') return null
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
    }
  } catch {
    return null
  }
}
