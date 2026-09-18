import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { badRequest, fail, forbidden, ok, parseBody } from '@/lib/api-helpers'
import { buildMockSummaries, logModeration } from '@/lib/attempt-service'
import type { MockValidation } from '@/lib/types'
import { z } from 'zod'

const createSchema = z.object({
  mockNumber: z.number().int().min(1).max(200),
  title: z.string().trim().min(3).max(120),
  scheduledAt: z.string().min(10).max(40),
})

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const mocks = await db.mock.findMany({ orderBy: { mockNumber: 'asc' } })
  const summaries = await buildMockSummaries(mocks, admin.id)
  const rows = await db.$queryRawUnsafe<Array<{
    mockId: string; total: bigint; physics: bigint; chemistry: bigint; maths: bigint; withDiagram: bigint
  }>>( 
    `SELECT mq.mockId, COUNT(*) as total,
            SUM(CASE WHEN q.subject = 'PHYSICS' THEN 1 ELSE 0 END) as physics,
            SUM(CASE WHEN q.subject = 'CHEMISTRY' THEN 1 ELSE 0 END) as chemistry,
            SUM(CASE WHEN q.subject = 'MATHEMATICS' THEN 1 ELSE 0 END) as maths,
            SUM(CASE WHEN q.diagram IS NOT NULL AND CAST(q.diagram AS TEXT) <> 'null' THEN 1 ELSE 0 END) as withDiagram
     FROM MockQuestion mq JOIN Question q ON q.id = mq.questionId
     GROUP BY mq.mockId`,
  )
  const countsMap = new Map(rows.map(r => [r.mockId, r] as [string, (typeof rows)[number]]))
  return ok({
    mocks: summaries.map(s => ({
      ...s,
      validation: (mocks.find(m => m.id === s.id)?.validationJson as MockValidation | null) ?? null,
      counts: {
        total: Number(countsMap.get(s.id)?.total ?? 0),
        physics: Number(countsMap.get(s.id)?.physics ?? 0),
        chemistry: Number(countsMap.get(s.id)?.chemistry ?? 0),
        maths: Number(countsMap.get(s.id)?.maths ?? 0),
        withDiagram: Number(countsMap.get(s.id)?.withDiagram ?? 0),
      },
    })),
  })
}

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const body = await parseBody(req, createSchema)
  if (!body) return badRequest('Invalid mock payload (mockNumber, title, scheduledAt required)')
  const scheduledAt = new Date(body.scheduledAt)
  if (isNaN(scheduledAt.getTime())) return badRequest('Invalid scheduledAt date')

  const existing = await db.mock.findUnique({ where: { mockNumber: body.mockNumber } })
  if (existing) return fail(409, `Mock #${body.mockNumber} already exists`)

  const mock = await db.mock.create({
    data: {
      mockNumber: body.mockNumber,
      title: body.title,
      scheduledAt,
      durationMinutes: 180,
      totalMarks: 300,
      questionCount: 0,
      status: 'DRAFT',
    },
  })
  const [summary] = await buildMockSummaries([mock], admin.id)
  await logModeration(admin.id, 'CREATE_MOCK', 'Mock', mock.id, `Mock #${mock.mockNumber} "${mock.title}" created`)
  return ok({ mock: summary }, { status: 201 })
}
