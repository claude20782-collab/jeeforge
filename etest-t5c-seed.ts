/**
 * TEMP seed/cleanup script for agent E (T5-c) verification. DELETE AFTER USE.
 * Usage: bun etest-t5c-seed.ts seed   |   bun etest-t5c-seed.ts cleanup
 * Requires etest_rival + etest_main users to exist (registered via UI).
 */
import { PrismaClient } from '@prisma/client'
import { writeFileSync, readFileSync, existsSync } from 'fs'

const db = new PrismaClient()
const STATE = '/tmp/etest-t5c-state.json'
const HASHES = ['etest-t5c-q1', 'etest-t5c-q2', 'etest-t5c-q26', 'etest-t5c-q27', 'etest-t5c-q51', 'etest-t5c-q52']
const CHAPTER_SLUGS = ['etest-kinematics', 'etest-thermodynamics', 'etest-calculus']

const diagramSpec = {
  kind: 'graph',
  xAxis: { min: 0, max: 10, label: 't (s)' },
  yAxis: { min: 0, max: 10, label: 'v (m/s)' },
  curves: [{ type: 'line', points: [[0, 0], [10, 10]] }],
}

/** Wipe any leftovers from a previous run of this script (idempotent seed). */
async function wipeMine() {
  await db.attempt.deleteMany({ where: { user: { username: { in: ['etest_main', 'etest_rival'] } } } })
  await db.mock.deleteMany({ where: { mockNumber: 99 } })
  await db.question.deleteMany({ where: { contentHash: { in: HASHES } } })
  await db.chapter.deleteMany({ where: { slug: { in: CHAPTER_SLUGS } } })
}

async function seed() {
  const main = await db.user.findUnique({ where: { username: 'etest_main' } })
  const rival = await db.user.findUnique({ where: { username: 'etest_rival' } })
  if (!main || !rival) throw new Error('Register etest_main and etest_rival first (via UI)')
  await wipeMine()

  // ---- dedicated mock 99 (mock 1 is occupied by agent D's concurrent test) ----
  const mock = await db.mock.create({
    data: {
      mockNumber: 99,
      title: 'Etest Analytics Verification Mock',
      scheduledAt: new Date('2026-09-01T00:00:00Z'),
      durationMinutes: 180,
      totalMarks: 300,
      questionCount: 6,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  })

  // ---- chapters + topics ----
  const ch = await db.chapter.createManyAndReturn({
    data: [
      { subject: 'PHYSICS', slug: 'etest-kinematics', name: 'Etest Kinematics', order: 900 },
      { subject: 'CHEMISTRY', slug: 'etest-thermodynamics', name: 'Etest Thermodynamics', order: 901 },
      { subject: 'MATHEMATICS', slug: 'etest-calculus', name: 'Etest Calculus', order: 902 },
    ],
  })
  const chP = ch.find((c) => c.slug === 'etest-kinematics')!
  const chC = ch.find((c) => c.slug === 'etest-thermodynamics')!
  const chM = ch.find((c) => c.slug === 'etest-calculus')!
  const tp = await db.topic.createManyAndReturn({
    data: [
      { chapterId: chP.id, slug: 'etest-motion', name: 'Etest Motion', order: 900 },
      { chapterId: chC.id, slug: 'etest-first-law', name: 'Etest First Law', order: 901 },
      { chapterId: chM.id, slug: 'etest-limits-derivatives', name: 'Etest Limits & Derivatives', order: 902 },
    ],
  })
  const tpP = tp.find((t) => t.slug === 'etest-motion')!
  const tpC = tp.find((t) => t.slug === 'etest-first-law')!
  const tpM = tp.find((t) => t.slug === 'etest-limits-derivatives')!

  // ---- questions ----
  const qs = await db.question.createManyAndReturn({
    data: [
      {
        subject: 'PHYSICS', section: 'A', contentHash: 'etest-t5c-q1',
        text: 'A particle moves along a straight line with velocity $v = (3t^2 - 2t)$ m/s. The displacement of the particle (in m) in the time interval $t = 0$ s to $t = 2$ s is:',
        options: ['$4$ m', '$6$ m', '$8$ m', '$12$ m'],
        correctAnswer: 'A',
        solutionText: 'Displacement is the definite integral of velocity:\n\n$$\\Delta x = \\int_0^2 (3t^2 - 2t)\\,dt = \\left[t^3 - t^2\\right]_0^2 = (8 - 4) - 0 = 4\\ \\text{m}$$\n\nSo the particle moves **4 m** forward during the first two seconds.',
        formulaConcept: '$\\Delta x = \\int_{t_1}^{t_2} v(t)\\,dt$ — displacement is the area under the $v$–$t$ curve.',
        difficulty: 'EASY', chapterId: chP.id, topicId: tpP.id,
        sourceType: 'PYQ', pyqYear: 2023, pyqShift: '24 Jan Shift 2', isVerified: true,
      },
      {
        subject: 'PHYSICS', section: 'A', contentHash: 'etest-t5c-q2',
        text: 'The velocity–time graph of a particle moving along a straight line is shown in the figure. The magnitude of its acceleration (in m/s²) is:',
        options: ['$0.5$', '$1.5$', '$2.0$', '$1.0$'],
        correctAnswer: 'D',
        solutionText: 'For a straight-line $v$–$t$ graph, acceleration equals the slope:\n\n$$|a| = \\left|\\frac{\\Delta v}{\\Delta t}\\right| = \\frac{10 - 0}{10 - 0} = 1\\ \\text{m/s}^2$$\n\nThe motion is uniformly accelerated throughout.',
        formulaConcept: 'Slope of the $v$–$t$ graph gives acceleration: $a = \\dfrac{\\Delta v}{\\Delta t}$.',
        difficulty: 'HARD', chapterId: chP.id, topicId: tpP.id,
        sourceType: 'ORIGINAL', isVerified: true, diagram: diagramSpec,
      },
      {
        subject: 'CHEMISTRY', section: 'A', contentHash: 'etest-t5c-q26',
        text: 'A fixed amount of an ideal gas is compressed isothermally. If the pressure is doubled, the volume becomes:',
        options: ['half of the initial volume', 'double the initial volume', 'four times the initial volume', 'unchanged'],
        correctAnswer: 'A',
        solutionText: 'At constant temperature, Boyle\'s law applies:\n\n$$P_1 V_1 = P_2 V_2 \\implies 2P_1 \\cdot V_2 = P_1 V_1 \\implies V_2 = \\tfrac{1}{2}V_1$$\n\nThe volume is **halved**.',
        formulaConcept: "Boyle's law: $PV = $ constant at constant $T$.",
        difficulty: 'MODERATE', chapterId: chC.id, topicId: tpC.id,
        sourceType: 'PYQ', pyqYear: 2024, pyqShift: '27 Jan Shift 1', isVerified: true,
      },
      {
        subject: 'CHEMISTRY', section: 'B', contentHash: 'etest-t5c-q27',
        text: 'A gas absorbs $500$ J of heat from the surroundings and does $200$ J of work on the surroundings. The change in internal energy of the gas (in J) is ____.',
        options: null,
        correctAnswer: '300',
        solutionText: 'From the first law of thermodynamics:\n\n$$\\Delta U = Q - W = 500 - 200 = 300\\ \\text{J}$$\n\nHeat absorbed increases $U$; work done by the gas decreases it.',
        formulaConcept: 'First law: $\\Delta U = Q - W$, with $W$ the work done *by* the gas.',
        difficulty: 'VERY_HARD', chapterId: chC.id, topicId: tpC.id,
        sourceType: 'PYQ', pyqYear: 2022, pyqShift: '25 Jun Shift 2', isVerified: true,
      },
      {
        subject: 'MATHEMATICS', section: 'A', contentHash: 'etest-t5c-q51',
        text: 'If $f(x) = x^2 - 4x + 3$, then $f\'(1)$ equals:',
        options: ['$-1$', '$-2$', '$0$', '$2$'],
        correctAnswer: 'B',
        solutionText: 'Differentiate using the power rule:\n\n$$f\'(x) = 2x - 4 \\implies f\'(1) = 2(1) - 4 = -2$$',
        formulaConcept: 'Power rule: $\\frac{d}{dx}\\left[x^n\\right] = nx^{n-1}$.',
        difficulty: 'MODERATE', chapterId: chM.id, topicId: tpM.id,
        sourceType: 'ORIGINAL', isVerified: true,
      },
      {
        subject: 'MATHEMATICS', section: 'B', contentHash: 'etest-t5c-q52',
        text: 'Evaluate $\\lim_{x \\to 0} \\dfrac{\\sin 3x}{x}$.',
        options: null,
        correctAnswer: '3',
        solutionText: 'Rewrite so the standard limit appears:\n\n$$\\lim_{x\\to 0}\\frac{\\sin 3x}{x} = \\lim_{x\\to 0}\\frac{3\\sin 3x}{3x} = 3 \\times 1 = 3$$',
        formulaConcept: '$\\lim_{x\\to 0}\\dfrac{\\sin kx}{x} = k$.',
        difficulty: 'EASY', chapterId: chM.id, topicId: tpM.id,
        sourceType: 'ORIGINAL', isVerified: true,
      },
    ],
  })
  const byHash = new Map(qs.map((q) => [q.contentHash, q]))
  const attach = [
    { hash: 'etest-t5c-q1', order: 1 }, { hash: 'etest-t5c-q2', order: 2 },
    { hash: 'etest-t5c-q26', order: 26 }, { hash: 'etest-t5c-q27', order: 27 },
    { hash: 'etest-t5c-q51', order: 51 }, { hash: 'etest-t5c-q52', order: 52 },
  ]
  for (const a of attach) {
    await db.mockQuestion.create({ data: { mockId: mock.id, questionId: byHash.get(a.hash)!.id, order: a.order } })
  }

  // ---- attempts (SUBMITTED, server-consistent aggregates) ----
  const now = Date.now()
  const mkAnswers = (rows: Array<{ hash: string; selected: string | null; correct: boolean | null; time: number; marked?: boolean; tag?: string }>) =>
    rows.map((r) => ({
      questionId: byHash.get(r.hash)!.id,
      selectedAnswer: r.selected,
      isCorrect: r.correct,
      markedForReview: r.marked ?? false,
      visited: true,
      timeSpentSeconds: r.time,
      mistakeTag: r.tag ?? null,
    }))

  const mainAttempt = await db.attempt.create({
    data: {
      userId: main.id, mockId: mock.id, status: 'SUBMITTED',
      startedAt: new Date(now - 3 * 3600e3), deadlineAt: new Date(now - 3600e3),
      submittedAt: new Date(now - 45 * 60e3), autoSubmitted: true,
      score: 10, physicsScore: 3, chemistryScore: 8, mathsScore: -1,
      correctCount: 3, wrongCount: 2, unattemptedCount: 1, accuracy: 60, timeUsedSeconds: 610,
      answers: {
        create: mkAnswers([
          { hash: 'etest-t5c-q1', selected: 'A', correct: true, time: 30 },
          { hash: 'etest-t5c-q2', selected: 'C', correct: false, time: 320, marked: true, tag: 'CALCULATION_ERROR' },
          { hash: 'etest-t5c-q26', selected: 'A', correct: true, time: 200 },
          { hash: 'etest-t5c-q27', selected: '300', correct: true, time: 20 },
          { hash: 'etest-t5c-q51', selected: 'A', correct: false, time: 40 },
          { hash: 'etest-t5c-q52', selected: null, correct: null, time: 0, tag: 'CONCEPT_GAP' },
        ]),
      },
    },
  })
  const rivalAttempt = await db.attempt.create({
    data: {
      userId: rival.id, mockId: mock.id, status: 'SUBMITTED',
      startedAt: new Date(now - 5 * 3600e3), deadlineAt: new Date(now - 2 * 3600e3),
      submittedAt: new Date(now - 20 * 60e3), autoSubmitted: false,
      score: 3, physicsScore: 4, chemistryScore: 0, mathsScore: -1,
      correctCount: 1, wrongCount: 1, unattemptedCount: 4, accuracy: 50, timeUsedSeconds: 95,
      answers: {
        create: mkAnswers([
          { hash: 'etest-t5c-q1', selected: 'A', correct: true, time: 45 },
          { hash: 'etest-t5c-q2', selected: null, correct: null, time: 0 },
          { hash: 'etest-t5c-q26', selected: null, correct: null, time: 0 },
          { hash: 'etest-t5c-q27', selected: null, correct: null, time: 0 },
          { hash: 'etest-t5c-q51', selected: null, correct: null, time: 0 },
          { hash: 'etest-t5c-q52', selected: '2.71', correct: false, time: 50 },
        ]),
      },
    },
  })

  writeFileSync(STATE, JSON.stringify({
    mockId: mock.id, chapterIds: ch.map((c) => c.id), questionIds: qs.map((q) => q.id),
    attemptIds: [mainAttempt.id, rivalAttempt.id],
  }, null, 2))
  console.log('SEED OK — mainAttempt:', mainAttempt.id, 'rivalAttempt:', rivalAttempt.id, 'mock:', mock.id)
}

async function cleanup() {
  if (!existsSync(STATE)) throw new Error('state file missing — nothing to clean')
  const s = JSON.parse(readFileSync(STATE, 'utf8')) as {
    mockId: string; chapterIds: string[]; questionIds: string[]; attemptIds: string[]
  }
  await db.attempt.deleteMany({ where: { id: { in: s.attemptIds } } })
  await db.mock.delete({ where: { id: s.mockId } }) // cascades mockQuestions
  await db.question.deleteMany({ where: { id: { in: s.questionIds } } })
  await db.chapter.deleteMany({ where: { id: { in: s.chapterIds } } })
  const users = await db.user.deleteMany({ where: { username: { in: ['etest_main', 'etest_rival'] } } })
  console.log('CLEANUP OK — users deleted:', users.count, '— mock 99 + questions + chapters + attempts removed')
  const leftovers = await db.question.count({ where: { contentHash: { in: HASHES } } })
    + await db.chapter.count({ where: { slug: { in: CHAPTER_SLUGS } } })
    + await db.attempt.count({ where: { id: { in: s.attemptIds } } })
    + await db.mock.count({ where: { mockNumber: 99 } })
    + await db.user.count({ where: { username: { in: ['etest_main', 'etest_rival'] } } })
  console.log('leftover test rows (must be 0):', leftovers)
}

const cmd = process.argv[2]
if (cmd === 'seed') await seed().catch((e) => { console.error(e); process.exit(1) })
else if (cmd === 'cleanup') await cleanup().catch((e) => { console.error(e); process.exit(1) })
else console.log('usage: bun etest-t5c-seed.ts seed|cleanup')
await db.$disconnect()
