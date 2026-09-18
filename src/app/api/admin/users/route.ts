import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { forbidden, ok } from '@/lib/api-helpers'

const PAGE_SIZE = 20

export async function GET(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const url = new URL(req.url)
  const q = url.searchParams.get('q')?.trim() ?? ''
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)

  const where = q
    ? { OR: [{ username: { contains: q } }, { email: { contains: q } }, { displayName: { contains: q } }] }
    : {}

  const [total, users] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      // NOTE: passwordHash is never selected or returned
      select: { id: true, username: true, email: true, displayName: true, role: true, status: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ])

  const ids = users.map(u => u.id)
  const [sessions, attemptRows] = await Promise.all([
    ids.length
      ? db.session.findMany({ where: { userId: { in: ids } }, select: { userId: true, lastSeenAt: true } })
      : Promise.resolve([] as Array<{ userId: string; lastSeenAt: Date }>),
    ids.length
      ? db.attempt.findMany({ where: { userId: { in: ids } }, select: { userId: true, mockId: true } })
      : Promise.resolve([] as Array<{ userId: string; mockId: string }>),
  ])
  const lastActive = new Map<string, Date>()
  for (const s of sessions) {
    const cur = lastActive.get(s.userId)
    if (!cur || s.lastSeenAt > cur) lastActive.set(s.userId, s.lastSeenAt)
  }
  const attemptCountMap = new Map<string, number>()
  const mockSetMap = new Map<string, Set<string>>()
  for (const a of attemptRows) {
    attemptCountMap.set(a.userId, (attemptCountMap.get(a.userId) ?? 0) + 1)
    const set = mockSetMap.get(a.userId) ?? new Set<string>()
    set.add(a.mockId)
    mockSetMap.set(a.userId, set)
  }

  return ok({
    users: users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt.toISOString(),
      lastActiveAt: (lastActive.get(u.id) ?? null)?.toISOString() ?? null,
      attemptCount: attemptCountMap.get(u.id) ?? 0,
      mockCount: mockSetMap.get(u.id)?.size ?? 0,
    })),
    total,
    page,
    pageSize: PAGE_SIZE,
  })
}
