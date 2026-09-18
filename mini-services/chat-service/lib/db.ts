// Prisma client singleton for the chat service.
// Points at the SAME SQLite file the Next.js app uses (multi-process access, WAL mode).
//
// Multi-process SQLite notes:
// - We append `connection_limit=1` so the service holds a single pooled connection;
//   the per-connection PRAGMAs set in index.ts therefore apply to every query.
// - All message persistence goes through `withRetry` (SQLITE_BUSY / lock retries).
import { DATABASE_URL } from './env'
import { PrismaClient } from '@prisma/client'

function sqliteUrl(url: string): string {
  if (!url.startsWith('file:')) return url
  if (url.includes('connection_limit')) return url
  return url.includes('?') ? `${url}&connection_limit=1` : `${url}?connection_limit=1`
}

const globalForPrisma = globalThis as unknown as { __chatServicePrisma?: PrismaClient }

export const db: PrismaClient =
  globalForPrisma.__chatServicePrisma ??
  new PrismaClient({
    datasources: { db: { url: sqliteUrl(DATABASE_URL) } },
    log: [{ emit: 'stdout', level: 'error' }],
  })

if (!globalForPrisma.__chatServicePrisma) {
  globalForPrisma.__chatServicePrisma = db
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * Retry helper for transient SQLite contention (SQLITE_BUSY / database is locked /
 * Prisma P2024 pool timeout / P2034 lock). Non-transient errors rethrow immediately.
 */
export async function withRetry<T>(fn: () => Promise<T>, attempts = 3, baseWaitMs = 100): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      const e = err as { code?: string; message?: string }
      const transient =
        /SQLITE_BUSY|SQLITE_LOCKED|database is locked|timed out/i.test(String(e.message ?? '')) ||
        e.code === 'P2024' ||
        e.code === 'P2034'
      if (!transient) throw err
      console.warn(
        `[db] transient contention (attempt ${i + 1}/${attempts}): ${e.code ?? ''} ${e.message ?? ''}`,
      )
      await sleep(baseWaitMs * (i + 1))
    }
  }
  throw lastErr
}
