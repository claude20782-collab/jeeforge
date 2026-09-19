import { db } from '../src/lib/db'
async function main(){
  const m1 = await db.mock.findUnique({ where: { mockNumber: 1 }, include: { questions: { include: { question: { select: { subject:true, section:true, diagram:true } } } } } })
  if (!m1) { console.log('NO MOCK 1'); return }
  const bySubj: Record<string, number> = {}
  let diagrams = 0
  for (const mq of m1.questions) { const q = mq.question; bySubj[q.subject] = (bySubj[q.subject]||0)+1; if (q.diagram) diagrams++ }
  console.log('RESULT: total', m1.questions.length, 'bySubj:', JSON.stringify(bySubj), 'diagrams:', diagrams)
}
main().finally(()=>db.$disconnect())
