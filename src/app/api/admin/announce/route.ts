import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { badRequest, notFound, ok, parseBody, forbidden } from '@/lib/api-helpers'
import { broadcastToRoom, logModeration, notificationDto } from '@/lib/attempt-service'
import { z } from 'zod'

const schema = z.object({
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(3).max(2000),
  mockId: z.string().min(1).optional(),
})

const CHUNK_SIZE = 1000

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const body = await parseBody(req, schema)
  if (!body) return badRequest('Invalid announcement payload (title, body required)')

  let link = ''
  if (body.mockId) {
    const mock = await db.mock.findUnique({ where: { id: body.mockId } })
    if (!mock) return notFound('Mock')
    link = `#/mock/${mock.id}`
  }

  const recipients = await db.user.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true },
  })

  const startedAt = new Date()
  for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {
    const chunk = recipients.slice(i, i + CHUNK_SIZE)
    if (chunk.length === 0) continue
    await db.notification.createMany({
      data: chunk.map(r => ({
        userId: r.id,
        type: 'MOCK_ANNOUNCEMENT',
        title: body.title,
        body: body.body,
        link,
        actorId: admin.id,
        mockId: body.mockId ?? null,
      })),
    })
  }

  // live fan-out: fetch the rows we just created and push them to user rooms
  if (recipients.length > 0) {
    const created = await db.notification.findMany({
      where: {
        type: 'MOCK_ANNOUNCEMENT',
        actorId: admin.id,
        title: body.title,
        createdAt: { gte: startedAt },
      },
    })
    for (const n of created) {
      broadcastToRoom('notification:new', `user:${n.userId}`, notificationDto(n))
    }
  }

  await logModeration(admin.id, 'ANNOUNCEMENT', 'System', body.mockId ?? 'announce', `${body.title} → ${recipients.length} recipients`)
  return ok({ ok: true, recipients: recipients.length })
}
