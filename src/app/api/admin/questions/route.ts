import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { badRequest, fail, forbidden, ok } from '@/lib/api-helpers'
import {
  adminQuestionDtos, logModeration, questionInputSchema, validateQuestionSemantics,
} from '@/lib/attempt-service'
import { contentHashOf } from '@/lib/mock-validation'

const PLACEHOLDER_SOLUTION = /coming soon|will be added|placeholder|todo/i

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return forbidden()

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
  const duplicate = await db.question.findUnique({ where: { contentHash } })
  if (duplicate) return fail(409, 'A question with identical text already exists')

  const created = await db.question.create({
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
      isVerified: input.isVerified ?? input.sourceType === 'PYQ',
      marksCorrect: input.marksCorrect ?? 4,
      marksWrong: input.marksWrong ?? -1,
      contentHash,
    },
    include: { chapter: true, topic: true },
  })
  const [dto] = await adminQuestionDtos([created])
  await logModeration(admin.id, 'CREATE_QUESTION', 'Question', created.id, `${input.subject} · ${input.difficulty} · ${input.sourceType}`)
  return ok({ question: dto }, { status: 201 })
}
