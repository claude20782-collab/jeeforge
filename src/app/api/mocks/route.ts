import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { ok } from '@/lib/api-helpers'
import { buildMockSummaries } from '@/lib/attempt-service'

export async function GET() {
  const user = await getSessionUser()
  const mocks = await db.mock.findMany({ orderBy: { mockNumber: 'asc' } })
  const summaries = await buildMockSummaries(mocks, user?.id ?? null)
  return ok({ mocks: summaries })
}
