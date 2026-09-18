// Simple in-memory rate limiter (per process). Sliding window.
type Bucket = { hits: number[] }
const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now()
  let b = buckets.get(key)
  if (!b) { b = { hits: [] }; buckets.set(key, b) }
  b.hits = b.hits.filter(t => now - t < windowMs)
  if (b.hits.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - b.hits[0])) / 1000)
    return { ok: false, retryAfterSec: Math.max(1, retryAfter) }
  }
  b.hits.push(now)
  // occasional cleanup
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.hits.every(t => now - t > windowMs)) buckets.delete(k)
  }
  return { ok: true, retryAfterSec: 0 }
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  return fwd ? fwd.split(',')[0].trim() : 'unknown'
}
