'use client'
// Mocks hub (#/mocks) — agent C. All mocks grouped by month, live status + countdowns.

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { navigate } from '@/lib/router'
import { fmtDateTimeIST, fmtNumber } from '@/lib/format'
import type { MockSummary } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MockStatusBadge } from '@/components/views/mocks/mock-status-badge'
import {
  fmtCountdown, groupMocksByMonth, mockState, useMocksQuery, useNow,
} from '@/components/views/mocks/hooks'
import {
  BarChart3, BookOpen, CalendarClock, CheckCircle2, ChevronRight, Lock, PlayCircle,
  Radio, RefreshCw, Users,
} from 'lucide-react'

export function MocksView() {
  const now = useNow(1000)
  const mocksQuery = useMocksQuery()
  const mocks = mocksQuery.data ?? []
  const groups = useMemo(() => groupMocksByMonth(mocks), [mocks])

  // default tab: month of the next mock worth acting on, else current IST month, else first
  const defaultTab = useMemo(() => {
    if (!groups.length) return ''
    const upcoming = mocks
      .filter(m => !m.myAttempt)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0]
    const anchor = upcoming ?? mocks[mocks.length - 1]
    const g = groups.find(gr => gr.mocks.some(m => m.id === anchor.id))
    return g?.label ?? groups[0].label
  }, [groups, mocks])
  const [activeTab, setActiveTab] = useState(defaultTab)
  // keep tab valid if data shifts (e.g. refetch adds a month)
  const tab = groups.some(g => g.label === (activeTab || defaultTab)) ? (activeTab || defaultTab) : (groups[0]?.label ?? '')

  const completedCount = mocks.filter(m => m.myAttempt?.status === 'SUBMITTED').length

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mock tests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            40 full-length CBTs · one unlock a day at 12:00 AM IST · one attempt per mock
            {mocks.length > 0 && completedCount > 0 && (
              <> · <span className="font-medium text-primary">{completedCount} completed</span></>
            )}
          </p>
        </div>
      </div>

      {mocksQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
        </div>
      ) : mocksQuery.isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <p className="font-medium text-destructive">Couldn't load the mocks.</p>
          <p className="mt-1 text-sm text-muted-foreground">Check your connection and try again.</p>
          <Button variant="outline" className="mt-4" onClick={() => mocksQuery.refetch()}>
            <RefreshCw className="h-4 w-4" aria-hidden /> Retry
          </Button>
        </div>
      ) : mocks.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-semibold">No mocks are scheduled yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
            The 40-mock schedule (19 Sep – 31 Dec 2026) appears here as soon as each mock's
            questions and solutions clear verification.
          </p>
        </div>
      ) : (
        <Tabs value={tab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 h-auto w-full max-w-full flex-wrap justify-start gap-1">
            {groups.map(g => (
              <TabsTrigger key={g.label} value={g.label} className="text-xs sm:text-sm">
                {g.label.replace(' 2026', " '26")}
                <span className="ml-1.5 hidden text-[10px] text-muted-foreground sm:inline">{g.mocks.length}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {groups.map(g => (
            <TabsContent key={g.label} value={g.label} className="mt-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.mocks.map(m => (
                  <MockCard key={m.id} mock={m} now={now} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}

/* -------------------------------- mock card ------------------------------- */

function MockCard({ mock, now }: { mock: MockSummary; now: number }) {
  const st = mockState(mock, now)
  const to = `/mock/${mock.id}`

  const open = () => navigate(to)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  }
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Mock ${mock.mockNumber}: ${mock.title}`}
      onClick={open}
      onKeyDown={onKeyDown}
      className={`group gap-0 cursor-pointer rounded-xl p-5 text-left outline-none transition
        focus-visible:ring-2 focus-visible:ring-ring hover:border-primary/40 hover:shadow-lg ${st.kind === 'live' ? 'border-correct/40' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-sm font-bold text-primary">Mock {String(mock.mockNumber).padStart(2, '0')}</span>
        <MockStatusBadge kind={st.kind} />
      </div>
      <h3 className="mt-2 line-clamp-1 font-semibold">{mock.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {fmtDateTimeIST(mock.scheduledAt)} · 75 Qs · 300 marks
      </p>
      {mock.participantCount > 0 && (
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" aria-hidden /> {fmtNumber(mock.participantCount, 0)}{' '}
          {mock.participantCount === 1 ? 'participant' : 'participants'}
        </p>
      )}

      {/* state-specific footer */}
      <div className="mt-4 border-t border-border/60 pt-3.5">
        {st.kind === 'completed' && mock.myAttempt?.score != null && (
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-correct">
              <CheckCircle2 className="h-4 w-4" aria-hidden /> {mock.myAttempt.score}
              <span className="text-xs font-normal text-muted-foreground">/ 300</span>
            </span>
            <span className="flex items-center gap-1" onClick={stop}>
              <Button
                variant="ghost" size="sm" className="h-8 px-2.5 text-xs"
                onClick={(e) => { stop(e); navigate(`/result/${mock.myAttempt!.id}`) }}
              >
                Result
              </Button>
              <Button
                variant="ghost" size="sm" className="h-8 px-2.5 text-xs"
                onClick={(e) => { stop(e); navigate(`/solutions/${mock.myAttempt!.id}`) }}
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden /> Solutions
              </Button>
              <Button
                variant="ghost" size="sm" className="h-8 px-2.5 text-xs"
                onClick={(e) => { stop(e); navigate(`/analysis/${mock.myAttempt!.id}`) }}
              >
                <BarChart3 className="h-3.5 w-3.5" aria-hidden /> Analysis
              </Button>
            </span>
          </div>
        )}
        {st.kind === 'in-progress' && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-primary">Clock is running</span>
            <Button
              size="sm" className="h-8"
              onClick={(e) => { stop(e); navigate(to) }}
            >
              <PlayCircle className="h-3.5 w-3.5" aria-hidden /> Resume
            </Button>
          </div>
        )}
        {st.kind === 'live' && (
          <div className="flex items-center gap-2 text-xs font-medium text-correct">
            <Radio className="h-3.5 w-3.5 animate-pulse" aria-hidden />
            Live — start when you're ready
            <ChevronRight className="ml-auto h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
          </div>
        )}
        {st.kind === 'locked' && st.unlockInMs != null && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Unlocks in
            <span className="font-mono font-semibold tabular-nums text-foreground/80">{fmtCountdown(st.unlockInMs)}</span>
          </div>
        )}
        {st.kind === 'scheduled' && (
          <div className="flex items-center gap-2 text-xs text-primary/80">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden />
            Scheduled — publishing after verification
          </div>
        )}
        {st.kind === 'completed' && mock.myAttempt?.score == null && (
          <div className="text-xs text-correct">Submitted — score pending</div>
        )}
      </div>
    </Card>
  )
}
