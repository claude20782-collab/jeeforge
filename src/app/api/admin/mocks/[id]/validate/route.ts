import { requireAdmin } from '@/lib/auth'
import { forbidden, notFound, ok } from '@/lib/api-helpers'
import { validateMock } from '@/lib/mock-validation'
import { db } from '@/lib/db'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const mock = await db.mock.findUnique({ where: { id } })
  if (!mock) return notFound('Mock')
  const validation = await validateMock(mock.id)
  return ok({ validation })
}
