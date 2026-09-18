import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { ok, unauthorized } from '@/lib/api-helpers'
import { notificationDto } from '@/lib/attempt-service'

export async function GET(req: Request) {
  const user = await requireUser()
  if (!user) return unauthorized()
  const url = new URL(req.url)
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? 50) || 50))
  const unreadOnly = url.searchParams.get('unreadOnly') === 'true'

  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: user.id, ...(unreadOnly ? { readAt: null } : {}) },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    db.notification.count({ where: { userId: user.id, readAt: null } }),
  ])
  return ok({ notifications: notifications.map(notificationDto), unreadCount })
}
