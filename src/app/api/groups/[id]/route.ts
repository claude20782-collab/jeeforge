import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { forbidden, notFound, ok } from '@/lib/api-helpers'
import { buildGroupDTOs } from '@/lib/attempt-service'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const viewer = await getSessionUser()
  const group = await db.group.findUnique({ where: { id }, include: { owner: true } })
  if (!group) return notFound('Group')

  const myMembership = viewer
    ? await db.groupMember.findUnique({ where: { groupId_userId: { groupId: group.id, userId: viewer.id } } })
    : null
  if (group.isPrivate && !myMembership) return forbidden()

  const members = await db.groupMember.findMany({
    where: { groupId: group.id },
    include: { user: { select: { username: true, displayName: true, avatarUrl: true } } },
    orderBy: { joinedAt: 'asc' },
  })
  const [dto] = await buildGroupDTOs([group], viewer?.id ?? null)
  // preview from the last NON-deleted message (truncated 80 chars)
  const lastActive = await db.groupMessage.findFirst({
    where: { groupId: group.id, deletedAt: null },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: { content: true },
  })
  if (dto) dto.lastMessagePreview = lastActive ? lastActive.content.slice(0, 80) : null
  return ok({
    group: dto,
    members: members.map(m => ({
      username: m.user.username,
      displayName: m.user.displayName,
      avatarUrl: m.user.avatarUrl,
      role: m.role as 'OWNER' | 'MODERATOR' | 'MEMBER',
      joinedAt: m.joinedAt.toISOString(),
      online: false, // live presence comes from the socket service
    })),
  })
}
