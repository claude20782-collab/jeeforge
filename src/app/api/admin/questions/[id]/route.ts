import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { badRequest, fail, forbidden, notFound, ok } from '@/lib/api-helpers'
import {
  adminQuestionDtos, logModeration, questionInputSchema, validateQuestionSemantics,
} from '@/lib/attempt-service'
import { contentHashOf } from '@/lib/mock-validation'

const PLACEHOLDER_SOLUTION = /coming soon|will be added|placeholder|todo/i

async function usedInPublishedMock(questionId: string) {
  const count = await db.mockQuestion.count({
    where: { questionId, mock: { status: 'PUBLISHED' } },
  })
  return count > 0
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()

  const question = await db.question.findUnique({ where: { id } })
  if (!question) return notFound('Question')
  if (await usedInPublishedMock(question.id)) {
    return fail(403, 'Question is used in a PUBLISHED mock and cannot be edited — unpublish the mock first')
  }

  const parsed = questionInputSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return badRequest('Invalid question payload')
  const input = parsed.data
  const semanticError = validateQuestionSemantics(input)
  if (semanticError) return badRequest(semanticError)
  if (PLACEHOLDER_SOLUTION.test(input.solutionText)) {
    return badRequest('Solution text must be complete — placeholder text is not allowed')
  }

  const [chapter, topic] = await Promise.all([
    db.chapter.findUnique({ where: { id: input.chapterId } }),
    db.topic.findUnique({ where: { id: input.topicId } }),
  ])
  if (!chapter) return badRequest('Chapter not found')
  if (!topic || topic.chapterId !== chapter.id) return badRequest('Topic does not belong to the given chapter')
  if (chapter.subject !== input.subject) return badRequest('Chapter subject does not match the question subject')

  const contentHash = contentHashOf(input.text)
  const duplicate = await db.question.findFirst({ where: { contentHash, id: { not: question.id } } })
  if (duplicate) return fail(409, 'Another question with identical text already exists')

  const updated = await db.question.update({
    where: { id: question.id },
    data: {
      subject: input.subject,
      section: input.section,
      text: input.text,
      options: input.options ?? Prisma.DbNull,
      correctAnswer: input.correctAnswer,
      solutionText: input.solutionText,
      formulaConcept: input.formulaConcept,
      difficulty: input.difficulty,
      chapterId: chapter.id,
      topicId: topic.id,
      sourceType: input.sourceType,
      pyqYear: input.pyqYear ?? null,
      pyqShift: input.pyqShift ?? null,
      sourceNote: input.sourceNote ?? null,
      diagram: input.diagram ?? Prisma.DbNull,
      isVerified: input.isVerified ?? question.isVerified,
      marksCorrect: input.marksCorrect ?? 4,
      marksWrong: input.marksWrong ?? -1,
      contentHash,
    },
    include: { chapter: true, topic: true },
  })
  const [dto] = await adminQuestionDtos([updated])
  await logModeration(admin.id, 'UPDATE_QUESTION', 'Question', question.id, `${input.subject} · ${input.difficulty}`)
  return ok({ question: dto })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const question = await db.question.findUnique({ where: { id } })
  if (!question) return notFound('Question')
  if (await usedInPublishedMock(question.id)) {
    return fail(403, 'Question is used in a PUBLISHED mock and cannot be deleted — unpublish the mock first')
  }
  await db.question.delete({ where: { id: question.id } }) // cascades MockQuestion links
  await logModeration(admin.id, 'DELETE_QUESTION', 'Question', question.id, `${question.subject} · ${question.difficulty}`)
  return ok({ ok: true })
}
