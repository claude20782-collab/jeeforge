import type { Subject, Difficulty, MistakeTag, AVOIDABLE_TAGS } from '@/lib/types'

export interface ScoringQuestion {
  id: string
  subject: Subject
  section: string
  correctAnswer: string
  marksCorrect: number
  marksWrong: number
  difficulty: Difficulty
}
export interface ScoringAnswer {
  questionId: string
  selectedAnswer: string | null
}

/** Normalize a numeric answer string: trim, remove trailing zeros, parse. Returns null if not numeric. */
export function parseNumeric(s: string): number | null {
  const t = s.trim()
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null
  const n = parseFloat(t)
  return Number.isFinite(n) ? n : null
}

/**
 * Check a student answer against the correct answer.
 * MCQ: exact option letter match.
 * Numerical: numeric comparison with absolute tolerance 0.01, OR exact string match
 * (authors may use expressions like "2" vs "2.00").
 */
export function checkAnswer(selected: string | null | undefined, correct: string, section: string): boolean {
  if (selected == null) return false
  const sel = selected.trim()
  if (!sel) return false
  const cor = correct.trim()
  if (sel === cor) return true
  if (section === 'B') {
    const a = parseNumeric(sel); const b = parseNumeric(cor)
    if (a != null && b != null) return Math.abs(a - b) < 0.011
  }
  return false
}

export function computeQuestionScore(selected: string | null, q: ScoringQuestion): number {
  if (selected == null || selected.trim() === '') return 0
  return checkAnswer(selected, q.correctAnswer, q.section) ? q.marksCorrect : q.marksWrong
}

export function isAvoidable(tag: MistakeTag | null | undefined): boolean {
  return !!tag && (AVOIDABLE_TAGS as string[]).includes(tag)
}

/** Streak: consecutive calendar days (IST) ending today/yesterday with >=1 submitted attempt. */
export function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0
  const istDay = (d: Date) => {
    const ms = d.getTime() + 5.5 * 3600_000
    return Math.floor(ms / 86_400_000)
  }
  const days = new Set(dates.map(istDay))
  const today = istDay(new Date())
  let start = today
  if (!days.has(today)) {
    if (days.has(today - 1)) start = today - 1
    else return 0
  }
  let streak = 0
  for (let d = start; days.has(d); d--) streak++
  return streak
}

// IST helpers (IST = UTC+5:30, no DST)
export const IST_OFFSET_MS = 5.5 * 3600_000
export function toIst(ms: number): Date { return new Date(ms + IST_OFFSET_MS) }
/** Start of the ISO week (Monday 00:00 IST) containing time t, returned as UTC Date */
export function istWeekStart(t: Date): Date {
  const ist = toIst(t.getTime())
  const day = (ist.getUTCDay() + 6) % 7 // Monday=0
  const start = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() - day)
  return new Date(start - IST_OFFSET_MS)
}
export function istMonthStart(t: Date): Date {
  const ist = toIst(t.getTime())
  const start = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), 1)
  return new Date(start - IST_OFFSET_MS)
}
