import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { badRequest, forbidden, notFound, ok, parseBody } from '@/lib/api-helpers'
import { createNotifications, logModeration } from '@/lib/attempt-service'
import { z } from 'zod'

const schema = z.object({
  resolution: z.enum(['RESOLVED', 'DISMISSED']),
  note: z.string().trim().max(500).optional(),
})

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const body = await parseBody(req, schema)
  if (!body) return badRequest('Invalid resolution payload')

  const report = await db.report.findUnique({ where: { id } })
  if (!report) return notFound('Report')
  if (report.status !== 'OPEN') return badRequest('Report is already resolved')

  await db.report.update({
    where: { id: report.id },
    data: {
      status: body.resolution,
      resolvedBy: admin.id,
      resolvedAt: new Date(),
      resolutionNote: body.note ?? null,
    },
  })
  await logModeration(
    admin.id,
    body.resolution === 'RESOLVED' ? 'RESOLVE_REPORT' : 'DISMISS_REPORT',
    'Report',
    report.id,
    body.note ?? null,
  )
  await createNotifications([{
    userId: report.reporterId,
    type: 'REPORT_STATUS',
    title: `Your report was ${body.resolution === 'RESOLVED' ? 'resolved' : 'dismissed'}`,
    body: body.note ?? null,
    link: null,
    actorId: admin.id,
  }])
  return ok({ ok: true })
}
