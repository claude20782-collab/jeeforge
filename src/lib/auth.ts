import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { z } from 'zod'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me')
export const SESSION_COOKIE = 'jee_session'
const SESSION_DAYS = 30

export interface SessionPayload { sub: string; sid: string; username: string; role: string }

export async function hashPassword(pw: string) { return bcrypt.hash(pw, 10) }
export async function verifyPassword(pw: string, hash: string) { return bcrypt.compare(pw, hash) }

export async function createSession(userId: string, userAgent?: string | null, ip?: string | null) {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')
  const session = await db.session.create({ data: { userId, userAgent: userAgent ?? undefined, ip: ip ?? undefined } })
  const token = await new SignJWT({ sub: user.id, sid: session.id, username: user.username, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(JWT_SECRET)
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: SESSION_DAYS * 86400,
  })
  return { token, session }
}

export async function getSessionUser() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const p = payload as unknown as SessionPayload
    const session = await db.session.findUnique({ where: { id: p.sid } })
    if (!session || session.revokedAt) return null
    const user = await db.user.findUnique({ where: { id: p.sub } })
    if (!user || user.status !== 'ACTIVE') return null
    // throttled lastSeen update
    if (Date.now() - session.lastSeenAt.getTime() > 60_000) {
      await db.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } }).catch(() => {})
    }
    return user
  } catch { return null }
}

/** Authenticated user or throws 401-shaped sentinel; use with requireUser */
export async function requireUser() {
  const user = await getSessionUser()
  if (!user) return null
  return user
}

export async function requireAdmin() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

export async function revokeSession(sessionId: string) {
  await db.session.update({ where: { id: sessionId }, data: { revokedAt: new Date() } }).catch(() => {})
}

export async function revokeAllUserSessions(userId: string) {
  await db.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })
}

export async function countActiveSessions(userId: string) {
  const cutoff = new Date(Date.now() - 10 * 60_000)
  return db.session.count({ where: { userId, revokedAt: null, lastSeenAt: { gte: cutoff } } })
}

// ============ Validation schemas ============
export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email'),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,20}$/, 'Username: 3-20 chars, lowercase letters/digits/underscore'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
  displayName: z.string().trim().min(2).max(40).optional(),
})
export const loginSchema = z.object({
  emailOrUsername: z.string().trim().min(3).max(100),
  password: z.string().min(1).max(72),
})
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(72),
})
export const usernameParamSchema = z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,20}$/)
