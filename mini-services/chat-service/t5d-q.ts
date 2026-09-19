import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
const m = await db.groupMessage.findFirst({ where: { content: { contains: 'pagination filler #3 ' } }, orderBy: { createdAt: 'asc' }, select: { id: true, content: true } })
if (m) { await db.groupMessage.update({ where: { id: m.id }, data: { deletedAt: new Date() } }); console.log('soft-deleted:', m.id, m.content.slice(0, 30)) }
await db.$disconnect()
