import { db } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { badRequest, ok, unauthorized } from '@/lib/api-helpers'
import { toPublicUser } from '@/lib/attempt-service'
import { z } from 'zod'

const MAX_AVATAR_CHARS = 200_000 // ~200KB data-URL, per contract

const schema = z.object({
  displayName: z.string().trim().min(2).max(40).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  targetYear: z.int().min(2027).max(2030).nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  profilePublic: z.boolean().optional(),
  leaderboardVisible: z.boolean().optional(),
})

export async function PUT(req: Request) {
  const user = await requireUser()
  if (!user) return unauthorized()
  const body = await schema.safeParse(await req.json().catch(() => null))
  if (!body.success) return badRequest('Invalid profile settings (displayName 2-40 chars, bio ≤500, targetYear 2027-2030)')

  const data: Record<string, unknown> = {}
  if (body.data.displayName !== undefined) data.displayName = body.data.displayName
  if (body.data.bio !== undefined) data.bio = body.data.bio
  if (body.data.targetYear !== undefined) data.targetYear = body.data.targetYear
  if (body.data.profilePublic !== undefined) data.profilePublic = body.data.profilePublic
  if (body.data.leaderboardVisible !== undefined) data.leaderboardVisible = body.data.leaderboardVisible
  if (body.data.avatarUrl !== undefined) {
    const url = body.data.avatarUrl
    if (url === null || url === '') {
      data.avatarUrl = null
    } else if (!url.startsWith('data:image/')) {
      return badRequest('Avatar must be a data:image/ URL')
    } else if (url.length > MAX_AVATAR_CHARS) {
      return badRequest('Avatar image too large (max ~200KB)')
    } else {
      data.avatarUrl = url
    }
  }

  const updated = await db.user.update({ where: { id: user.id }, data })
  return ok({ user: toPublicUser(updated) })
}
