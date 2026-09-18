import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { badRequest, fail, forbidden, notFound, ok, parseBody } from '@/lib/api-helpers'
import { adminQuestionDtos, logModeration } from '@/lib/attempt-service'
import { z } from 'zod'

const attachSchema = z.object({
  questionId: z.string().min(1),
  order: z.number().int().min(1).max(75),
})

function subjectForSlot(order: number): string {
  if (order <= 25) return 'PHYSICS'
  if (order <= 50) return 'CHEMISTRY'
  return 'MATHEMATICS'
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const mock = await db.mock.findUnique({ where: { id } })
  if (!mock) return notFound('Mock')
  const questions = await db.mockQuestion.findMany({
    where: { mockId: mock.id },
    include: { question: { include: { chapter: true, topic: true } } },
    orderBy: { order: 'asc' },
  })
  return ok({ questions: await adminQuestionDtos(questions.map(q => q.question)) })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const body = await parseBody(req, attachSchema)
  if (!body) return badRequest('Invalid payload (questionId, order 1-75 required)')

  const mock = await db.mock.findUnique({ where: { id } })
  if (!mock) return notFound('Mock')
  if (mock.status === 'PUBLISHED') return fail(403, 'Cannot modify questions of a published mock — unpublish first')

  const question = await db.question.findUnique({ where: { id: body.questionId } })
  if (!question) return notFound('Question')
  const expectedSubject = subjectForSlot(body.order)
  if (question.subject !== expectedSubject) {
    return badRequest(`Slot ${body.order} must be a ${expectedSubject.toLowerCase()} question`)
  }

  const [slotTaken, alreadyAttached] = await Promise.all([
    db.mockQuestion.findUnique({ where: { mockId_order: { mockId: mock.id, order: body.order } } }),
    db.mockQuestion.findUnique({ where: { mockId_questionId: { mockId: mock.id, questionId: question.id } } }),
  ])
  if (alreadyAttached) return fail(409, 'Question already attached to this mock')
  if (slotTaken) return fail(409, `Slot ${body.order} is already occupied by another question`)

  await db.$transaction([
    db.mockQuestion.create({ data: { mockId: mock.id, questionId: question.id, order: body.order } }),
    db.mock.update({ where: { id: mock.id }, data: { questionCount: { increment: 1 } } }),
  ])
  await logModeration(admin.id, 'ATTACH_QUESTION', 'Mock', mock.id, `Question ${question.id} attached to slot ${body.order} (${expectedSubject})`)
  return ok({ ok: true })
}
