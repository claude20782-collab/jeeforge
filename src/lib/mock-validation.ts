import { db } from '@/lib/db'
import type { MockValidation, ValidationIssue } from '@/lib/types'
import crypto from 'crypto'

/**
 * STRICT publication validation (spec §24). A mock can be published ONLY if every check passes.
 * Any single missing solution / answer / metadata / duplicate → stays DRAFT.
 */
export async function validateMock(mockId: string): Promise<MockValidation> {
  const mock = await db.mock.findUnique({
    where: { id: mockId },
    include: { questions: { include: { question: { include: { chapter: true, topic: true } } }, orderBy: { order: 'asc' } } },
  })
  const errors: ValidationIssue[] = []
  const warnings: ValidationIssue[] = []
  const now = new Date().toISOString()

  if (!mock) {
    return { passed: false, errors: [{ code: 'NOT_FOUND', message: 'Mock not found' }], warnings, checks: emptyChecks(), checkedAt: now }
  }

  const qs = mock.questions.map(mq => mq.question)
  const physics = qs.filter(q => q.subject === 'PHYSICS').length
  const chemistry = qs.filter(q => q.subject === 'CHEMISTRY').length
  const maths = qs.filter(q => q.subject === 'MATHEMATICS').length

  if (qs.length !== 75) errors.push({ code: 'COUNT', message: `Mock must contain exactly 75 questions (found ${qs.length})` })
  if (physics !== 25) errors.push({ code: 'PHYSICS_COUNT', message: `Physics must have exactly 25 questions (found ${physics})` })
  if (chemistry !== 25) errors.push({ code: 'CHEMISTRY_COUNT', message: `Chemistry must have exactly 25 questions (found ${chemistry})` })
  if (maths !== 25) errors.push({ code: 'MATHS_COUNT', message: `Mathematics must have exactly 25 questions (found ${maths})` })

  // ordering: 1-25 physics, 26-50 chemistry, 51-75 maths
  const orders = mock.questions.map(mq => mq.order)
  const expected = Array.from({ length: 75 }, (_, i) => i + 1)
  if (qs.length === 75 && (orders.join(',') !== expected.join(','))) {
    errors.push({ code: 'ORDER', message: 'Question order slots must be 1..75 with 1-25 Physics, 26-50 Chemistry, 51-75 Mathematics' })
  }
  if (qs.length === 75) {
    const subjectBySlot = (i: number) => qs.find((_, idx) => mock.questions[idx].order === i + 1)?.subject
    for (let i = 0; i < 25; i++) if (subjectBySlot(i) !== 'PHYSICS') { errors.push({ code: 'ORDER_SUBJECT', message: `Q${i + 1} must be Physics` }); break }
    for (let i = 25; i < 50; i++) if (subjectBySlot(i) !== 'CHEMISTRY') { errors.push({ code: 'ORDER_SUBJECT', message: `Q${i + 1} must be Chemistry` }); break }
    for (let i = 50; i < 75; i++) if (subjectBySlot(i) !== 'MATHEMATICS') { errors.push({ code: 'ORDER_SUBJECT', message: `Q${i + 1} must be Mathematics` }); break }
  }

  // per-question checks
  let withSolution = 0, withAnswer = 0, withDiagram = 0, withChapter = 0, withTopic = 0, withDifficulty = 0
  const problemQs: string[] = []
  const seenHash = new Map<string, number>()
  let duplicates = 0

  qs.forEach((q, idx) => {
    const label = `Q${mock.questions[idx]?.order ?? idx + 1}`
    if (q.solutionText && q.solutionText.trim().length >= 30 && !/coming soon|will be added|placeholder|todo/i.test(q.solutionText)) withSolution++
    else problemQs.push(`${label}: missing/incomplete solution`)
    const ansOk = q.correctAnswer && q.correctAnswer.trim() !== ''
    let answerValid = false
    if (ansOk) {
      if (q.section === 'A') {
        if (['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
          const opts = q.options as string[] | null
          answerValid = !!opts && opts.length === 4 && opts.every(o => typeof o === 'string' && o.trim() !== '')
        }
      } else {
        answerValid = /^-?\d+(\.\d+)?$/.test(q.correctAnswer.trim())
      }
    }
    if (answerValid) withAnswer++
    else problemQs.push(`${label}: invalid answer/options format`)
    if (q.diagram) withDiagram++
    if (q.chapterId) withChapter++
    if (q.topicId) withTopic++
    if (q.difficulty && ['EASY', 'MODERATE', 'HARD', 'VERY_HARD'].includes(q.difficulty)) withDifficulty++
    else problemQs.push(`${label}: missing difficulty`)
    if (!q.text || q.text.trim().length < 10) problemQs.push(`${label}: question text too short`)
    if (q.sourceType === 'PYQ' && !q.pyqYear) warnings.push({ code: 'PYQ_META', message: `${label}: PYQ without year metadata` })
    if (q.sourceType === 'ORIGINAL' && !q.isVerified) warnings.push({ code: 'UNVERIFIED', message: `${label}: original question not yet verified` })
    if (seenHash.has(q.contentHash)) { duplicates++; problemQs.push(`${label}: duplicate of Q${seenHash.get(q.contentHash)}`) }
    else seenHash.set(q.contentHash, mock.questions[idx]?.order ?? idx + 1)
  })

  if (withSolution !== qs.length) errors.push({ code: 'SOLUTIONS', message: `${qs.length - withSolution} question(s) missing complete solutions`, count: qs.length - withSolution })
  if (withAnswer !== qs.length) errors.push({ code: 'ANSWERS', message: `${qs.length - withAnswer} question(s) missing valid answer`, count: qs.length - withAnswer })
  if (withChapter !== qs.length) errors.push({ code: 'CHAPTER', message: `${qs.length - withChapter} question(s) missing chapter` })
  if (withTopic !== qs.length) errors.push({ code: 'TOPIC', message: `${qs.length - withTopic} question(s) missing topic` })
  if (withDifficulty !== qs.length) errors.push({ code: 'DIFFICULTY', message: `${qs.length - withDifficulty} question(s) missing difficulty` })
  if (withDiagram < 20) errors.push({ code: 'DIAGRAMS', message: `At least 20 diagram/image questions required (found ${withDiagram})` })
  if (duplicates > 0) errors.push({ code: 'DUPLICATES', message: `${duplicates} duplicate question(s) inside mock` })
  if (mock.totalMarks !== 300) errors.push({ code: 'MARKS', message: 'Total marks must be 300' })
  if (mock.durationMinutes !== 180) errors.push({ code: 'DURATION', message: 'Duration must be 180 minutes' })

  // cross-mock duplicate check (global contentHash uniqueness is DB-enforced; also check vs other mocks)
  const hashes = qs.map(q => q.contentHash)
  if (hashes.length > 0) {
    const dupElsewhere = await db.question.count({
      where: { contentHash: { in: hashes }, id: { notIn: qs.map(q => q.id) } },
    })
    if (dupElsewhere > 0) errors.push({ code: 'CROSS_MOCK_DUP', message: `${dupElsewhere} question(s) also used in another mock` })
  }

  // every option must be unique within MCQ
  qs.forEach((q, idx) => {
    if (q.section === 'A') {
      const opts = (q.options as string[] | null) ?? []
      if (new Set(opts.map(o => o.trim())).size !== opts.length) {
        problemQs.push(`Q${mock.questions[idx]?.order}: duplicate options`)
      }
    }
  })
  if (problemQs.length > 0 && problemQs.length <= 12) {
    warnings.push({ code: 'DETAILS', message: problemQs.slice(0, 12).join(' • ') })
  } else if (problemQs.length > 12) {
    warnings.push({ code: 'DETAILS', message: `${problemQs.length} detailed issues: ${problemQs.slice(0, 6).join(' • ')} …` })
  }

  const checks = {
    totalQuestions: qs.length, physics, chemistry, maths,
    withSolution, withAnswer, withDiagram, withChapter, withTopic, withDifficulty,
    duplicates, marksValid: mock.totalMarks === 300 && mock.durationMinutes === 180,
  }
  const validation: MockValidation = { passed: errors.length === 0, errors, warnings, checks, checkedAt: now }
  await db.mock.update({ where: { id: mockId }, data: { validationJson: validation as unknown as object } })
  return validation
}

function emptyChecks() {
  return { totalQuestions: 0, physics: 0, chemistry: 0, maths: 0, withSolution: 0, withAnswer: 0, withDiagram: 0, withChapter: 0, withTopic: 0, withDifficulty: 0, duplicates: 0, marksValid: false }
}

/** Normalized hash of question text for global dedupe. */
export function contentHashOf(text: string): string {
  const norm = text.toLowerCase().replace(/\s+/g, ' ').replace(/\\left|\\right|\\,|\\!|\\;|\\quad|\\;/g, '').replace(/[.,;:?!]+$/g, '').trim()
  return crypto.createHash('sha256').update(norm).digest('hex')
}
