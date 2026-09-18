import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { fail, forbidden, notFound, ok } from '@/lib/api-helpers'
import { logModeration } from '@/lib/attempt-service'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; questionId: string }> }) {
  const { id, questionId } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const mock = await db.mock.findUnique({ where: { id } })
  if (!mock) return notFound('Mock')
  if (mock.status === 'PUBLISHED') return fail(403, 'Cannot modify questions of a published mock — unpublish first')

  const link = await db.mockQuestion.findUnique({
    where: { mockId_questionId: { mockId: mock.id, questionId } },
  })
  if (!link) return notFound('Question in mock')

  await db.$transaction([
    db.mockQuestion.delete({ where: { id: link.id } }),
    db.mock.update({ where: { id: mock.id }, data: { questionCount: { decrement: 1 } } }),
  ])
  await logModeration(admin.id, 'DETACH_QUESTION', 'Mock', mock.id, `Question ${questionId} removed from mock #${mock.mockNumber}`)
  return ok({ ok: true })
}
