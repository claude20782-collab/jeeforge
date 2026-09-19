import { db } from '../src/lib/db';
async function main() {
  for (const name of ['qa_r6', 'qa_m2', 'qa_m3', 'qa_r5a', 'qa_r5b3']) {
    const u = await db.user.findUnique({ where: { username: name }, include: { attempts: true } } as any);
    if (!u) { console.log(`${name}: not found`); continue; }
    for (const a of u.attempts) { await db.attemptAnswer.deleteMany({ where: { attemptId: a.id } }); await db.attempt.delete({ where: { id: a.id } }); }
    await db.session.deleteMany({ where: { userId: u.id } });
    await db.notification.deleteMany({ where: { userId: u.id } });
    await db.user.delete({ where: { id: u.id } });
    console.log(`deleted ${name} + attempts`);
  }
  console.log('users:', await db.user.count(), 'attempts:', await db.attempt.count());
}
main().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1); });
