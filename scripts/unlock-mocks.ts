import { db } from '../src/lib/db';
const mode = process.argv[2];
async function main() {
  if (mode === 'unlock') {
    for (const n of [2, 3]) {
      const m = await db.mock.findUnique({ where: { mockNumber: n } });
      if (m) { await db.mock.update({ where: { id: m.id }, data: { scheduledAt: new Date('2026-09-01T00:00:00Z') } }); console.log(`mock-${n} unlocked (was ${m.scheduledAt.toISOString()})`); }
    }
  } else if (mode === 'restore') {
    await db.mock.update({ where: { mockNumber: 2 }, data: { scheduledAt: new Date('2026-09-19T18:30:00Z') } });
    await db.mock.update({ where: { mockNumber: 3 }, data: { scheduledAt: new Date('2026-09-21T18:30:00Z') } });
    console.log('mock-2 → 2026-09-19T18:30Z, mock-3 → 2026-09-21T18:30Z restored');
  }
}
main().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1); });
