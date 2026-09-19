// T5-d: remove leftovers from the interrupted prior T5-d run (ftest_user1/2)
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
const before = {
  users: await db.user.count({ where: { username: { startsWith: 'ftest_' } } }),
  groups: await db.group.count(),
  groupMessages: await db.groupMessage.count(),
  directMessages: await db.directMessage.count(),
  conversations: await db.directConversation.count(),
  notifications: await db.notification.count(),
}
console.log('BEFORE (prior-run leftovers):', JSON.stringify(before))
// groups first (owner FK is Restrict), then users (cascades the rest)
const groups = await db.group.findMany({ select: { id: true, name: true } })
for (const g of groups) await db.group.delete({ where: { id: g.id } })
const users = await db.user.findMany({ where: { username: { startsWith: 'ftest_' } }, select: { id: true, username: true } })
console.log('deleting users:', users.map(u => u.username).join(', ') || '(none)')
for (const u of users) await db.user.delete({ where: { id: u.id } })
const after = {
  users: await db.user.count({ where: { username: { startsWith: 'ftest_' } } }),
  groups: await db.group.count(),
  groupMessages: await db.groupMessage.count(),
  directMessages: await db.directMessage.count(),
  conversations: await db.directConversation.count(),
  notifications: await db.notification.count(),
}
console.log('AFTER:', JSON.stringify(after))
const remaining = await db.user.findMany({ select: { username: true } })
console.log('remaining users:', remaining.map(u => u.username).join(', '))
await db.$disconnect()
