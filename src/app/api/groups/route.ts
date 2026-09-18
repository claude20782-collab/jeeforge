import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { badRequest, fail, ok, unauthorized } from '@/lib/api-helpers'
import { buildGroupDTOs } from '@/lib/attempt-service'
import { z } from 'zod'
import crypto from 'crypto'

const createSchema = z.object({
  name: z.string().trim().min(3).max(60),
  description: z.string().trim().max(300).optional().nullable(),
  isPrivate: z.boolean(),
})

function slugify(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48)
  return base || 'group'
}

export async function GET(req: Request) {
  const user = await requireUser()
  if (!user) return unauthorized()
  const filter = new URL(req.url).searchParams.get('filter') ?? 'all'
  if (filter !== 'all' && filter !== 'mine') return badRequest('filter must be "all" or "mine"')

  const groups = await db.group.findMany({
    where: filter === 'mine'
      ? { members: { some: { userId: user.id } } }
      : { OR: [{ isPrivate: false }, { members: { some: { userId: user.id } } }] },
    include: { owner: true },
    orderBy: { createdAt: 'desc' },
  })
  const dtos = await buildGroupDTOs(groups, user.id)
  // lastMessagePreview: last NON-deleted message, truncated to 80 chars
  const previews = await Promise.all(groups.map(g =>
    db.groupMessage.findFirst({
      where: { groupId: g.id, deletedAt: null },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: { content: true },
    }),
  ))
  dtos.forEach((dto, i) => { dto.lastMessagePreview = previews[i] ? previews[i]!.content.slice(0, 80) : null })
  // order: lastMessageAt desc (nulls last), then createdAt desc
  const createdAtMap = new Map(groups.map(g => [g.id, g.createdAt.getTime()] as [string, number]))
  dtos.sort((a, b) => {
    const at = a.lastMessageAt ? Date.parse(a.lastMessageAt) : null
    const bt = b.lastMessageAt ? Date.parse(b.lastMessageAt) : null
    if (at === null && bt === null) return (createdAtMap.get(b.id) ?? 0) - (createdAtMap.get(a.id) ?? 0)
    if (at === null) return 1
    if (bt === null) return -1
    if (bt !== at) return bt - at
    return (createdAtMap.get(b.id) ?? 0) - (createdAtMap.get(a.id) ?? 0)
  })
  return ok({ groups: dtos })
}

export async function POST(req: Request) {
  const user = await requireUser()
  if (!user) return unauthorized()
  const rl = rateLimit(`group-create:${user.id}`, 5, 60 * 60 * 1000)
  if (!rl.ok) return fail(429, `Group creation limit reached. Retry in ${rl.retryAfterSec}s`)

  const body = await createSchema.safeParse(await req.json().catch(() => null))
  if (!body.success) return badRequest('Group name must be 3-60 characters')

  let slug = slugify(body.data.name)
  if (await db.group.findUnique({ where: { slug } })) {
    slug = `${slug}-${crypto.randomBytes(3).toString('hex')}`
  }
  const group = await db.group.create({
    data: {
      name: body.data.name,
      slug,
      description: body.data.description ?? null,
      isPrivate: body.data.isPrivate,
      ownerId: user.id,
      members: { create: { userId: user.id, role: 'OWNER' } },
    },
    include: { owner: true },
  })
  const [dto] = await buildGroupDTOs([group], user.id)
  return ok({ group: dto }, { status: 201 })
}
