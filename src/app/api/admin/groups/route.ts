import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { forbidden, ok } from '@/lib/api-helpers'
import { buildGroupDTOs } from '@/lib/attempt-service'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const groups = await db.group.findMany({
    include: { owner: true },
    orderBy: { createdAt: 'desc' },
  })
  const [dtos, messageCounts] = await Promise.all([
    buildGroupDTOs(groups, admin.id),
    db.groupMessage.groupBy({ by: ['groupId'], _count: { _all: true } }),
  ])
  const countMap = new Map(messageCounts.map(c => [c.groupId, c._count._all]))
  // previews from the last NON-deleted message (truncated 80 chars)
  const previews = await Promise.all(groups.map(g =>
    db.groupMessage.findFirst({
      where: { groupId: g.id, deletedAt: null },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: { content: true },
    }),
  ))
  return ok({
    groups: dtos.map((g, i) => ({
      ...g,
      lastMessagePreview: previews[i] ? previews[i]!.content.slice(0, 80) : null,
      messageCount: countMap.get(g.id) ?? 0,
    })),
  })
}
