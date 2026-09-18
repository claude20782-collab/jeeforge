// TEMPORARY seed script for T5-b CBT frontend testing — DELETE AFTER USE.
// Seeds: 3 test chapters+topics, 6 dummy questions (2 per subject), Mock 1 PUBLISHED.
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const SOLUTION =
  'Complete step-by-step solution text for frontend CBT interface testing purposes — placeholder but longer than thirty characters.'

const diagramVt = {
  kind: 'graph',
  title: 'Velocity–time graph of a freely falling body',
  xAxis: { label: 't (s)', min: 0, max: 4, ticks: [0, 1, 2, 3, 4] },
  yAxis: { label: 'v (m/s)', min: 0, max: 40 },
  curves: [{ type: 'line', points: [[0, 0], [4, 39.2]], label: 'v = gt' }],
  showGrid: true,
} as const

const diagramEthyne = {
  kind: 'molecule',
  atoms: [
    { sym: 'H', x: 0, y: 50 },
    { sym: 'C', x: 42, y: 50 },
    { sym: 'C', x: 118, y: 50 },
    { sym: 'H', x: 160, y: 50 },
  ],
  bonds: [
    { a: 0, b: 1, order: 1 },
    { a: 1, b: 2, order: 3 },
    { a: 2, b: 3, order: 1 },
  ],
  caption: 'Ethyne (acetylene)',
} as const

const diagramCircle = {
  kind: 'geometry',
  title: 'Reference figure',
  xRange: [-1, 4] as [number, number],
  yRange: [-1, 4] as [number, number],
  square: true,
  showGrid: true,
  elements: [
    { type: 'circle', cx: 1.5, cy: 1.5, r: 1.5, label: 'C' },
    { type: 'point', x: 1.5, y: 1.5, label: 'O' },
    { type: 'segment', from: [1.5, 1.5] as [number, number], to: [3, 1.5] as [number, number], label: 'r' },
  ],
} as const

async function main() {
  // 1) chapters + topics (one per subject)
  const chapterP = await db.chapter.create({
    data: { subject: 'PHYSICS', slug: 'dtest-kinematics', name: 'DTest Kinematics', order: 999, topics: { create: { slug: 'dtest-motion', name: 'DTest Motion in a Straight Line', order: 999 } } },
    include: { topics: true },
  })
  const chapterC = await db.chapter.create({
    data: { subject: 'CHEMISTRY', slug: 'dtest-bonding', name: 'DTest Bonding', order: 999, topics: { create: { slug: 'dtest-covalent', name: 'DTest Covalent Bonding', order: 999 } } },
    include: { topics: true },
  })
  const chapterM = await db.chapter.create({
    data: { subject: 'MATHEMATICS', slug: 'dtest-sequences', name: 'DTest Sequences and Series', order: 999, topics: { create: { slug: 'dtest-ap', name: 'DTest Arithmetic Progression', order: 999 } } },
    include: { topics: true },
  })
  console.log('chapters:', chapterP.id, chapterC.id, chapterM.id)

  const mk = (data: Record<string, unknown>) => ({ marksCorrect: 4, marksWrong: -1, difficulty: 'HARD', sourceType: 'ORIGINAL', isVerified: true, formulaConcept: 'Test formula/concept', solutionText: SOLUTION, ...data })

  const qP1 = await db.question.create({ data: mk({
    subject: 'PHYSICS', section: 'A', chapterId: chapterP.id, topicId: chapterP.topics[0].id,
    text: 'A particle moves along a straight line with velocity $v = 3t^2 - 6t$ m/s, where $t$ is time in seconds. The acceleration of the particle at $t = 2$ s is:',
    options: JSON.stringify(['$0$ m/s$^2$', '$6$ m/s$^2$', '$12$ m/s$^2$', '$-6$ m/s$^2$']),
    correctAnswer: 'B', contentHash: 'dtest-hash-p1',
  }) })
  const qP2 = await db.question.create({ data: mk({
    subject: 'PHYSICS', section: 'B', chapterId: chapterP.id, topicId: chapterP.topics[0].id,
    text: 'A body is dropped from rest from a height. Taking $g = 9.8\\ \\mathrm{m/s^2}$, the distance it falls in the first $2$ seconds is ___ m (round off to one decimal place).',
    options: null, diagram: JSON.stringify(diagramVt),
    correctAnswer: '19.6', contentHash: 'dtest-hash-p2',
  }) })
  const qC1 = await db.question.create({ data: mk({
    subject: 'CHEMISTRY', section: 'A', chapterId: chapterC.id, topicId: chapterC.topics[0].id,
    text: 'The number of sigma ($\\sigma$) and pi ($\\pi$) bonds present in ethyne respectively are:',
    options: JSON.stringify(['1 and 3', '2 and 2', '3 and 2', '3 and 3']),
    diagram: JSON.stringify(diagramEthyne),
    correctAnswer: 'C', contentHash: 'dtest-hash-c1',
  }) })
  const qC2 = await db.question.create({ data: mk({
    subject: 'CHEMISTRY', section: 'A', chapterId: chapterC.id, topicId: chapterC.topics[0].id,
    text: 'The IUPAC name of the compound $\\mathrm{CH_3CH_2CH_2OH}$ is:',
    options: JSON.stringify(['Propan-1-ol', 'Propan-2-ol', 'Butan-1-ol', 'Ethanol']),
    correctAnswer: 'A', contentHash: 'dtest-hash-c2',
  }) })
  const qM1 = await db.question.create({ data: mk({
    subject: 'MATHEMATICS', section: 'A', chapterId: chapterM.id, topicId: chapterM.topics[0].id,
    text: 'If the sum of the first $n$ natural numbers is $28$, then the value of $n$ is:',
    options: JSON.stringify(['$5$', '$6$', '$7$', '$8$']),
    diagram: JSON.stringify(diagramCircle),
    correctAnswer: 'C', contentHash: 'dtest-hash-m1',
  }) })
  const qM2 = await db.question.create({ data: mk({
    subject: 'MATHEMATICS', section: 'B', chapterId: chapterM.id, topicId: chapterM.topics[0].id,
    text: 'The value of $\\pi$ rounded off to two decimal places is ___ . (Enter a decimal number.)',
    options: null,
    correctAnswer: '3.14', contentHash: 'dtest-hash-m2',
  }) })
  console.log('questions:', [qP1, qP2, qC1, qC2, qM1, qM2].map(q => q.id).join(', '))

  // 2) mock 1 (DRAFT first — like the task assumed), attach slots, then PUBLISH
  const mock = await db.mock.create({ data: {
    mockNumber: 1,
    title: 'Mock 01 — JEE Main Full Test 01 (dtest)',
    scheduledAt: new Date('2026-09-01T00:00:00Z'),
    durationMinutes: 180, totalMarks: 300, questionCount: 75, status: 'DRAFT',
  } })
  await db.mockQuestion.createMany({ data: [
    { mockId: mock.id, questionId: qP1.id, order: 1 },
    { mockId: mock.id, questionId: qP2.id, order: 2 },
    { mockId: mock.id, questionId: qC1.id, order: 26 },
    { mockId: mock.id, questionId: qC2.id, order: 27 },
    { mockId: mock.id, questionId: qM1.id, order: 51 },
    { mockId: mock.id, questionId: qM2.id, order: 52 },
  ] })
  await db.mock.update({ where: { id: mock.id }, data: { status: 'PUBLISHED', publishedAt: new Date() } })
  console.log('mock published:', mock.id)
  console.log('MOCK_ID=' + mock.id)
}

main().then(() => db.$disconnect()).catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(1) })
