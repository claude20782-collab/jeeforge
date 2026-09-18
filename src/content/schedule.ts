// The 40-mock schedule — EXACT dates as specified (do not change).
// Unlocks at 00:00 IST (18:30 UTC previous day) of each date.

export interface MockScheduleEntry { mockNumber: number; date: string } // YYYY-MM-DD (IST date)

const DATES: string[] = [
  // September 2026 (8)
  '2026-09-19', '2026-09-20', '2026-09-22', '2026-09-24',
  '2026-09-25', '2026-09-26', '2026-09-27', '2026-09-29',
  // October 2026 (11)
  '2026-10-02', '2026-10-04', '2026-10-09', '2026-10-11',
  '2026-10-16', '2026-10-18', '2026-10-23', '2026-10-24',
  '2026-10-25', '2026-10-30', '2026-10-31',
  // November 2026 (9)
  '2026-11-01', '2026-11-06', '2026-11-08', '2026-11-13',
  '2026-11-15', '2026-11-20', '2026-11-22', '2026-11-27', '2026-11-29',
  // December 2026 (12)
  '2026-12-04', '2026-12-06', '2026-12-11', '2026-12-13',
  '2026-12-18', '2026-12-20', '2026-12-24', '2026-12-25',
  '2026-12-26', '2026-12-27', '2026-12-30', '2026-12-31',
]

/** IST midnight of the given date, as UTC Date. IST = UTC+5:30 → midnight IST = 18:30 UTC previous day. */
export function istMidnightUTC(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  // midnight IST = (date at 00:00 IST) → UTC = date 18:30 of previous day
  return new Date(Date.UTC(y, m - 1, d) - 5.5 * 3600 * 1000)
}

export const MOCK_SCHEDULE: MockScheduleEntry[] = DATES.map((date, i) => ({
  mockNumber: i + 1,
  date,
}))

export function mockTitle(n: number): string {
  return `JEE Main 2027 Mock Test ${String(n).padStart(2, '0')} — Full Length`
}
