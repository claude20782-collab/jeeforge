'use client'
// Shared hooks + helpers for agent C's views (landing / dashboard / mocks).
// Live countdowns all use ONE ticking clock hook (useNow) so pages share a single interval.

import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { countdownParts } from '@/lib/format'
import type { MockSummary } from '@/lib/types'

/** A live "now" timestamp, updated every `intervalMs` (default 1s). */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

/** Shared TanStack query for the public mocks list (includes myAttempt when authed). */
export function useMocksQuery() {
  return useQuery({
    queryKey: ['mocks'],
    queryFn: async () => {
      const res = await api.get<{ mocks: MockSummary[] }>('/mocks')
      return res.mocks
    },
    staleTime: 10_000,
  })
}

export function useInvalidateMocks() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ['mocks'] })
}

export type MockStateKind = 'in-progress' | 'completed' | 'live' | 'locked' | 'scheduled'

export interface MockState {
  kind: MockStateKind
  /** ms until unlock (locked only), from scheduledAt vs `now` */
  unlockInMs: number | null
}

/**
 * Derive display state for a mock. Precedence:
 * myAttempt IN_PROGRESS > myAttempt SUBMITTED > DRAFT (scheduled) > unlocked (live) > locked.
 */
export function mockState(m: MockSummary, now: number): MockState {
  if (m.myAttempt?.status === 'IN_PROGRESS') return { kind: 'in-progress', unlockInMs: null }
  if (m.myAttempt?.status === 'SUBMITTED') return { kind: 'completed', unlockInMs: null }
  if (m.status === 'DRAFT') return { kind: 'scheduled', unlockInMs: null }
  if (m.unlocked) return { kind: 'live', unlockInMs: null }
  const ms = new Date(m.scheduledAt).getTime() - now
  return { kind: 'locked', unlockInMs: ms }
}

/** "12d 04:03:22" or "04:03:22" — live ticking countdown display. */
export function fmtCountdown(ms: number | null | undefined): string {
  if (ms == null) return '—'
  const { d, h, m, s } = countdownParts(ms)
  const p = (n: number) => String(n).padStart(2, '0')
  return d > 0 ? `${d}d ${p(h)}:${p(m)}:${p(s)}` : `${p(h)}:${p(m)}:${p(s)}`
}

/** Compact relative countdown: "in 12d 4h" / "in 3h 12m" / "in 45s". */
export function fmtCountdownCompact(ms: number | null | undefined): string {
  if (ms == null) return '—'
  const { d, h, m, s } = countdownParts(ms)
  if (d > 0) return `in ${d}d ${h}h`
  if (h > 0) return `in ${h}h ${m}m`
  if (m > 0) return `in ${m}m ${s}s`
  return `in ${s}s`
}

/**
 * Group mocks by IST month label, e.g. "September 2026", months ordered
 * chronologically. Same-month mocks merge even when non-adjacent in the
 * (mockNumber-ordered) API list, so out-of-order fixtures can't split a month.
 */
export function groupMocksByMonth(mocks: MockSummary[]): Array<{ label: string; mocks: MockSummary[] }> {
  const fmt = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', month: 'long', year: 'numeric' })
  const byLabel = new Map<string, { label: string; firstAt: number; mocks: MockSummary[] }>()
  for (const m of mocks) {
    const label = fmt.format(new Date(m.scheduledAt))
    const existing = byLabel.get(label)
    if (existing) existing.mocks.push(m)
    else byLabel.set(label, { label, firstAt: new Date(m.scheduledAt).getTime(), mocks: [m] })
  }
  return Array.from(byLabel.values())
    .sort((a, b) => a.firstAt - b.firstAt)
    .map(({ label, mocks }) => ({ label, mocks }))
}

/** The mock the user should act on next: resume > live-now > next to unlock. */
export function nextActionableMock(mocks: MockSummary[]): MockSummary | null {
  const inProgress = mocks.find(m => m.myAttempt?.status === 'IN_PROGRESS')
  if (inProgress) return inProgress
  const live = mocks
    .filter(m => m.unlocked && !m.myAttempt)
    .sort((a, b) => a.mockNumber - b.mockNumber)[0]
  if (live) return live
  const upcoming = mocks
    .filter(m => !m.unlocked)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0]
  return upcoming ?? null
}

/** POST /mocks/:id/attempts → navigate to the CBT. 200 resumes an IN_PROGRESS attempt. */
export async function startAttempt(mockId: string): Promise<string> {
  const res = await api.post<{ attempt: { id: string } }>(`/mocks/${mockId}/attempts`)
  return res.attempt.id
}
