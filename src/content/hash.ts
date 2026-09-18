import crypto from 'crypto'

/** Normalized hash of question text for global dedupe (must match src/lib/mock-validation.ts). */
export function contentHashOf(text: string): string {
  const norm = text.toLowerCase().replace(/\s+/g, ' ')
    .replace(/\\left|\\right|\\,|\\!|\\;|\\quad/g, '')
    .replace(/[.,;:?!]+$/g, '')
    .trim()
  return crypto.createHash('sha256').update(norm).digest('hex')
}
