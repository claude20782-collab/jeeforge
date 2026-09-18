import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { badRequest, forbidden, notFound, ok, parseBody } from '@/lib/api-helpers'
import { buildMockSummaries, logModeration } from '@/lib/attempt-service'
import { z } from 'zod'

const schema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  scheduledAt: z.string().min(10).max(40).optional(),
})

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const body = await parseBody(req, schema)
  if (!body || (!body.title && !body.scheduledAt)) return badRequest('Nothing to update')

  const mock = await db.mock.findUnique({ where: { id } })
  if (!mock) return notFound('Mock')

  let scheduledAt: Date | undefined
  if (body.scheduledAt) {
    scheduledAt = new Date(body.scheduledAt)
    if (isNaN(scheduledAt.getTime())) return badRequest('Invalid scheduledAt date')
  }
  const updated = await db.mock.update({
    where: { id: mock.id },
    data: { ...(body.title ? { title: body.title } : {}), ...(scheduledAt ? { scheduledAt } : {}) },
  })
  const [summary] = await buildMockSummaries([updated], admin.id)
  await logModeration(admin.id, 'UPDATE_MOCK', 'Mock', mock.id, `Mock #${mock.mockNumber} updated${body.title ? ` (title: "${body.title}")` : ''}`)
  return ok({ mock: summary })
}
