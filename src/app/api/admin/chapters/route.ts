import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { forbidden, ok } from '@/lib/api-helpers'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return forbidden()
  const chapters = await db.chapter.findMany({
    include: { topics: { orderBy: { order: 'asc' } } },
    orderBy: [{ subject: 'asc' }, { order: 'asc' }],
  })
  return ok({
    chapters: chapters.map(c => ({
      id: c.id,
      subject: c.subject,
      slug: c.slug,
      name: c.name,
      topics: c.topics.map(t => ({ id: t.id, slug: t.slug, name: t.name })),
    })),
  })
}
