import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { forbidden, notFound, ok } from '@/lib/api-helpers'
import { logModeration } from '@/lib/attempt-service'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const mock = await db.mock.findUnique({ where: { id } })
  if (!mock) return notFound('Mock')

  await db.mock.update({ where: { id: mock.id }, data: { status: 'DRAFT', publishedAt: null } })
  await logModeration(admin.id, 'UNPUBLISH_MOCK', 'Mock', mock.id, `Mock #${mock.mockNumber} unpublished`)
  return ok({ ok: true })
}
