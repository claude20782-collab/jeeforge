// Loads env for the chat service.
// Preferred source: the ROOT project .env (/home/z/my-project/.env) so secrets never
// drift between the Next.js app and this microservice. Bun only auto-loads .env from
// the CWD (the service dir has no .env), so we parse the root file manually and fill
// any MISSING process.env entries (never override real environment variables).
import { existsSync, readFileSync } from 'node:fs'

const ROOT_ENV_PATH = '/home/z/my-project/.env'

function loadRootEnv(): void {
  try {
    if (!existsSync(ROOT_ENV_PATH)) {
      console.warn('[env] root .env not found at', ROOT_ENV_PATH, '— relying on process env')
      return
    }
    const text = readFileSync(ROOT_ENV_PATH, 'utf8')
    for (const rawLine of text.split('\n')) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq <= 0) continue
      const key = line.slice(0, eq).trim()
      let val = line.slice(eq + 1).trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      if (process.env[key] === undefined || process.env[key] === '') {
        process.env[key] = val
      }
    }
  } catch (e) {
    console.warn('[env] failed to read root .env:', (e as Error).message)
  }
}

loadRootEnv()

export const DATABASE_URL =
  process.env.DATABASE_URL ?? 'file:/home/z/my-project/db/custom.db'
export const JWT_SECRET = process.env.JWT_SECRET ?? ''
export const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? ''
export const PORT = Number(process.env.PORT ?? 3003)
