import type { MockValidation } from '@/lib/types'

type DB = { // minimal prisma-like interface (avoid importing server-only db in seed script)
  mock: { findUnique: (a: unknown) => Promise<any> }
  question: { findMany: (a: unknown) => Promise<any[]>; count: (a: unknown) => Promise<number> }
}

/**
 * Strict pre-publication validation (spec §24) — standalone version for the seed script
 * (mirrors src/lib/mock-validation.ts but works with an explicit db instance).
 */
export async function validateMockSeeded(db: DB, mockId: string): Promise<MockValidation> {
  const errors: Array<{ code: string; message: string; count?: number }> = []
  const warnings: Array<{ code: string; message: string }> = []
  const now = new Date().toISOString()
  const mock = await db.mock.findUnique({
    where: { id: mockId },
    include: { questions: { include: { question: { include: { chapter: true, topic: true } } }, orderBy: { order: 'asc' } } },
  })
  if (!mock) return { passed: false, errors: [{ code: 'NOT_FOUND', message: 'Mock not found' }], warnings, checks: emptyChecks(), checkedAt: now }

  const qs: any[] = mock.questions.map((mq: any) => mq.question)
  const physics = qs.filter(q => q.subject === 'PHYSICS').length
  const chemistry = qs.filter(q => q.subject === 'CHEMISTRY').length
  const maths = qs.filter(q => q.subject === 'MATHEMATICS').length

  if (qs.length !== 75) errors.push({ code: 'COUNT', message: `Mock must contain exactly 75 questions (found ${qs.length})` })
  if (physics !== 25) errors.push({ code: 'PHYSICS_COUNT', message: `Physics must have exactly 25 questions (found ${physics})` })
  if (chemistry !== 25) errors.push({ code: 'CHEMISTRY_COUNT', message: `Chemistry must have exactly 25 questions (found ${chemistry})` })
  if (maths !== 25) errors.push({ code: 'MATHS_COUNT', message: `Mathematics must have exactly 25 questions (found ${maths})` })

  const orders = mock.questions.map((mq: any) => mq.order)
  const expected = Array.from({ length: 75 }, (_, i) => i + 1)
  if (qs.length === 75 && orders.join(',') !== expected.join(',')) {
    errors.push({ code: 'ORDER', message: 'Question order must be exactly 1..75' })
  }
  if (qs.length === 75) {
    const byOrder = (o: number) => qs[mock.questions.findIndex((mq: any) => mq.order === o)]
    for (let i = 0; i < 75; i++) {
      const want = i < 25 ? 'PHYSICS' : i < 50 ? 'CHEMISTRY' : 'MATHEMATICS'
      if (byOrder(i + 1)?.subject !== want) { errors.push({ code: 'ORDER_SUBJECT', message: `Q${i + 1} must be ${want}` }); break }
    }
  }

  let withSolution = 0, withAnswer = 0, withDiagram = 0, withChapter = 0, withTopic = 0, withDifficulty = 0
  const seen = new Map<string, number>()
  let duplicates = 0
  qs.forEach((q, idx) => {
    const label = `Q${mock.questions[idx]?.order ?? idx + 1}`
    if (q.solutionText && q.solutionText.trim().length >= 30 && !/coming soon|will be added|placeholder|todo/i.test(q.solutionText)) withSolution++
    else errors.push({ code: 'SOLUTION', message: `${label}: missing/incomplete solution` })
    let answerValid = false
    if (q.correctAnswer && q.correctAnswer.trim() !== '') {
      if (q.section === 'A') {
        if (['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
          const opts = q.options
          answerValid = Array.isArray(opts) && opts.length === 4 && opts.every((o: string) => typeof o === 'string' && o.trim() !== '')
        }
      } else {
        answerValid = /^-?\d+(\.\d+)?$/.test(q.correctAnswer.trim())
      }
    }
    if (answerValid) withAnswer++
    else errors.push({ code: 'ANSWER', message: `${label}: invalid answer/options` })
    if (q.diagram) withDiagram++
    if (q.chapterId) withChapter++
    if (q.topicId) withTopic++
    if (['EASY', 'MODERATE', 'HARD', 'VERY_HARD'].includes(q.difficulty)) withDifficulty++
    else errors.push({ code: 'DIFFICULTY', message: `${label}: missing difficulty` })
    if (seen.has(q.contentHash)) { duplicates++; errors.push({ code: 'DUPLICATES', message: `${label}: duplicate of Q${seen.get(q.contentHash)}` }) }
    else seen.set(q.contentHash, mock.questions[idx]?.order ?? idx + 1)
    if (q.sourceType === 'PYQ' && !q.pyqYear) warnings.push({ code: 'PYQ_META', message: `${label}: PYQ without year` })
  })

  if (withDiagram < 20) errors.push({ code: 'DIAGRAMS', message: `At least 20 diagram questions required (found ${withDiagram})` })
  if (mock.totalMarks !== 300) errors.push({ code: 'MARKS', message: 'Total marks must be 300' })
  if (mock.durationMinutes !== 180) errors.push({ code: 'DURATION', message: 'Duration must be 180 minutes' })

  // cross-mock duplicates
  if (qs.length > 0) {
    const dupElsewhere = await db.question.count({
      where: { contentHash: { in: qs.map(q => q.contentHash) }, id: { notIn: qs.map(q => q.id) } },
    })
    if (dupElsewhere > 0) errors.push({ code: 'CROSS_MOCK_DUP', message: `${dupElsewhere} question(s) used in another mock` })
  }

  const checks = {
    totalQuestions: qs.length, physics, chemistry, maths,
    withSolution, withAnswer, withDiagram, withChapter, withTopic, withDifficulty,
    duplicates, marksValid: mock.totalMarks === 300 && mock.durationMinutes === 180,
  }
  return { passed: errors.length === 0, errors, warnings, checks, checkedAt: now }
}

function emptyChecks() {
  return { totalQuestions: 0, physics: 0, chemistry: 0, maths: 0, withSolution: 0, withAnswer: 0, withDiagram: 0, withChapter: 0, withTopic: 0, withDifficulty: 0, duplicates: 0, marksValid: false }
}
