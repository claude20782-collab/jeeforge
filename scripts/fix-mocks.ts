import { db } from '../src/lib/db'
async function main(){
  // 1. restore mock 3 unlock to 22 Sep 00:00 IST (R4 forgot to restore)
  await db.mock.update({ where: { mockNumber: 3 }, data: { scheduledAt: new Date('2026-09-21T18:30:00.000Z') } })
  console.log('mock3 scheduledAt restored')
  // 2. delete leftover QA users (cascades sessions/notifications; attempts need explicit delete)
  for (const email of ['qa_r5a@test.local', 'qa_r5b3@test.local']) {
    const u = await db.user.findUnique({ where: { email } })
    if (u) {
      const atts = await db.attempt.findMany({ where: { userId: u.id } })
      for (const a of atts) await db.attempt.delete({ where: { id: a.id } })
      await db.user.delete({ where: { id: u.id } })
      console.log('deleted QA user', email)
    }
  }
  // 3. unblock the owner's throwaway test attempts on mock 1 (5-ans and 3-ans quick tests)
  const m1 = await db.mock.findUnique({ where: { mockNumber: 1 } })
  for (const email of ['mayankpal.j5819@gmail.com', 'mayank665@gmail.com']) {
    const u = await db.user.findUnique({ where: { email } })
    if (u && m1) {
      const att = await db.attempt.findUnique({ where: { userId_mockId: { userId: u.id, mockId: m1.id } } })
      if (att) { await db.attempt.delete({ where: { id: att.id } }); console.log('deleted test attempt of', email, '(now can retake mock 1)') }
    }
  }
  const atts = await db.attempt.count()
  console.log('FINAL attempts count:', atts)
}
main().finally(()=>db.$disconnect())
