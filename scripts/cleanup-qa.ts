import { db } from '../src/lib/db'
async function main(){
  for (const email of ['qa_r5adm@test.local', 'qa_r5v@test.local']) {
    const u = await db.user.findUnique({ where: { email } })
    if (u) {
      const atts = await db.attempt.findMany({ where: { userId: u.id } })
      for (const a of atts) await db.attempt.delete({ where: { id: a.id } })
      await db.user.delete({ where: { id: u.id } })
      console.log('cleaned', email)
    }
  }
  console.log('final: attempts =', await db.attempt.count(), 'users =', await db.user.count())
}
main().finally(()=>db.$disconnect())
