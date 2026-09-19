import { db } from '../src/lib/db'
async function main(){
  for (const n of [1, 2, 3]) {
    const m = await db.mock.findUnique({ where: { mockNumber: n }, include: { questions: { include: { question: { select: { section: true, correctAnswer: true } } }, orderBy: { order: 'asc' } } } })
    if (!m) continue
    const dist: Record<string, number> = {}
    for (const mq of m.questions) {
      const key = mq.question.section === 'A' ? mq.question.correctAnswer : 'NUM'
      dist[key] = (dist[key] || 0) + 1
    }
    console.log(`DB mock-${n} key distribution:`, JSON.stringify(dist))
  }
}
main().finally(()=>db.$disconnect())
