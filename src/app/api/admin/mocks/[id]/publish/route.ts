import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { fail, forbidden, notFound, ok } from '@/lib/api-helpers'
import { logModeration } from '@/lib/attempt-service'
import { validateMock } from '@/lib/mock-validation'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const mock = await db.mock.findUnique({ where: { id } })
  if (!mock) return notFound('Mock')

  const validation = await validateMock(mock.id)
  if (!validation.passed) {
    return Response.json(
      { ok: false, error: 'Validation failed — mock not published', validation },
      { status: 400 },
    )
  }
  await db.mock.update({ where: { id: mock.id }, data: { status: 'PUBLISHED', publishedAt: new Date() } })
  await logModeration(admin.id, 'PUBLISH_MOCK', 'Mock', mock.id, `Mock #${mock.mockNumber} published`)
  return ok({ ok: true, validation })
}
