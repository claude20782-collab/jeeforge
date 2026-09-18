import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { notFound, ok } from '@/lib/api-helpers'
import { buildMockSummaries } from '@/lib/attempt-service'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSessionUser()
  const mock = await db.mock.findUnique({ where: { id } })
    ?? (/^\d+$/.test(id) ? await db.mock.findUnique({ where: { mockNumber: Number(id) } }) : null)
  if (!mock) return notFound('Mock')
  const [summary] = await buildMockSummaries([mock], user?.id ?? null)
  return ok({ mock: summary })
}
