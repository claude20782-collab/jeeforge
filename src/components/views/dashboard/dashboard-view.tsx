'use client'
// Dashboard (#/dashboard) — agent C. Authed home: greeting, next-mock hero with live
// countdown, quick stats (real profile data), recent attempts with result links.

import { useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { Link, navigate } from '@/lib/router'
import { useAppStore } from '@/lib/store'
import { fmtDateIST, fmtNumber, ordinal, timeAgo } from '@/lib/format'
import type { MockSummary, PublicProfile } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar } from '@/components/app/avatar'
import { MockStatusBadge } from '@/components/views/mocks/mock-status-badge'
import {
  fmtCountdown, mockState, nextActionableMock, startAttempt, useInvalidateMocks, useMocksQuery, useNow,
} from '@/components/views/mocks/hooks'
import {
  CalendarClock, ChevronRight, Flame, ListChecks, Lock, PlayCircle, Radio, RefreshCw,
  Rocket, Trophy, TrendingUp,
} from 'lucide-react'

export function DashboardView() {
  const user = useAppStore(s => s.user)
  const now = useNow(1000)

  const profileQuery = useQuery({
    queryKey: ['profile', user?.username],
    queryFn: () => api.get<{ profile: PublicProfile }>(`/profiles/${user!.username}`),
    enabled: !!user,
  })
  const mocksQuery = useMocksQuery()

  const mocks = mocksQuery.data ?? []
  const nextMock = useMemo(() => (mocks.length ? nextActionableMock(mocks) : null), [mocks])

  const loading = profileQuery.isLoading || mocksQuery.isLoading
  const error = profileQuery.isError || mocksQuery.isError

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <p className="font-medium text-destructive">Couldn't load your dashboard.</p>
          <p className="mt-1 text-sm text-muted-foreground">Something went wrong while fetching your data.</p>
          <Button
            variant="outline" className="mt-4"
            onClick={() => { profileQuery.refetch(); mocksQuery.refetch() }}
          >
            <RefreshCw className="h-4 w-4" aria-hidden /> Retry
          </Button>
        </div>
      </div>
    )
  }

  const profile = profileQuery.data?.profile
  const greeting = getGreeting()
  const firstName = (user?.displayName || user?.username || 'aspirant').split(' ')[0]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* greeting */}
      <div className="mb-8 flex items-center gap-4">
        {user && (
          <Avatar username={user.username} displayName={user.displayName} avatarUrl={user.avatarUrl} size={48} />
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {greeting}, <span className="gold-gradient-text">{firstName}</span>
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}target JEE Main {user?.targetYear ?? 2027}
          </p>
        </div>
      </div>

      {/* next mock hero */}
      <section aria-label="Next mock" className="mb-8">
        {loading && !nextMock ? (
          <Skeleton className="h-52 w-full rounded-2xl" />
        ) : nextMock ? (
          <NextMockCard mock={nextMock} now={now} />
        ) : (
          <AllDoneCard />
        )}
      </section>

      {/* quick stats */}
      <section aria-label="Your stats" className="mb-8">
        {loading && !profile ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={ListChecks} label="Mocks completed"
              value={profile ? String(profile.stats.mocksCompleted) : '—'}
            />
            <StatCard
              icon={Trophy} label="Best score"
              value={profile?.stats.bestScore != null ? `${profile.stats.bestScore} / 300` : '—'}
            />
            <StatCard
              icon={TrendingUp} label="Average score"
              value={profile?.stats.averageScore != null ? `${fmtNumber(profile.stats.averageScore, 1)} / 300` : '—'}
            />
            <StatCard
              icon={Flame} label="Day streak"
              value={profile ? `${profile.stats.streak} ${profile.stats.streak === 1 ? 'day' : 'days'}` : '—'}
            />
          </div>
        )}
      </section>

      {/* recent attempts */}
      <section aria-label="Recent attempts">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">Recent attempts</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/mocks')}>
            All mocks <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
        {loading && !profile ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : !profile || profile.recentAttempts.length === 0 ? (
          <EmptyAttempts />
        ) : (
          <RecentAttempts profile={profile} mocks={mocks} />
        )}
      </section>
    </div>
  )
}

/* ------------------------------ next mock card ---------------------------- */

function NextMockCard({ mock, now }: { mock: MockSummary; now: number }) {
  const st = mockState(mock, now)
  const invalidateMocks = useInvalidateMocks()
  const startMutation = useMutation({
    mutationFn: () => startAttempt(mock.id),
    onSuccess: (attemptId) => {
      invalidateMocks()
      navigate(`/test/${attemptId}`)
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 409) {
        toast.error(err.message)
        invalidateMocks()
      } else if (err instanceof ApiError && err.status === 403) {
        toast.error(err.message)
        invalidateMocks()
      } else {
        toast.error('Could not start the test — please try again')
      }
    },
  })

  const isActionable = st.kind === 'live' || st.kind === 'in-progress'

  return (
    <Card className="card-glow gap-0 overflow-hidden rounded-2xl p-0">
      <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-sm font-bold text-primary">
              Mock {String(mock.mockNumber).padStart(2, '0')}
            </span>
            <MockStatusBadge kind={st.kind} />
            {mock.participantCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {mock.participantCount} {mock.participantCount === 1 ? 'participant' : 'participants'}
              </span>
            )}
          </div>
          <h2 className="mt-3 truncate text-xl font-bold tracking-tight sm:text-2xl">{mock.title}</h2>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <CalendarClock className="h-4 w-4" aria-hidden /> {fmtDateIST(mock.scheduledAt)}
            <span aria-hidden>·</span> 75 questions <span aria-hidden>·</span> 300 marks <span aria-hidden>·</span> 180 min
          </p>

          {st.kind === 'locked' && st.unlockInMs != null && (
            <div className="mt-4 inline-flex flex-wrap items-center gap-3 rounded-xl border bg-background/50 px-4 py-3">
              <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
              <span className="text-sm text-muted-foreground">Unlocks in</span>
              <span className="font-mono text-lg font-bold tabular-nums text-primary sm:text-xl">{fmtCountdown(st.unlockInMs)}</span>
            </div>
          )}
          {st.kind === 'scheduled' && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-primary/90">
              <CalendarClock className="h-4 w-4" aria-hidden />
              Scheduled — questions and solutions are being verified before this mock publishes.
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
          {isActionable && (
            <Button
              size="lg" className="h-12 px-6"
              disabled={startMutation.isPending}
              onClick={() => startMutation.mutate()}
            >
              {startMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden />
              ) : st.kind === 'in-progress' ? (
                <PlayCircle className="h-4 w-4" aria-hidden />
              ) : (
                <Rocket className="h-4 w-4" aria-hidden />
              )}
              {st.kind === 'in-progress' ? 'Resume test' : 'Start test'}
            </Button>
          )}
          <Button size="lg" variant="outline" className="h-12 px-6" onClick={() => navigate(`/mock/${mock.id}`)}>
            {st.kind === 'completed' ? 'View result' : 'Mock details'}
          </Button>
        </div>
      </div>

      {st.kind === 'live' && (
        <div className="flex items-center gap-2 border-t border-correct/20 bg-correct/10 px-6 py-2.5 text-sm font-medium text-correct sm:px-8">
          <Radio className="h-4 w-4 animate-pulse" aria-hidden />
          Live now — one attempt per mock, so make it count.
        </div>
      )}
      {st.kind === 'in-progress' && (
        <div className="flex items-center gap-2 border-t border-primary/20 bg-primary/10 px-6 py-2.5 text-sm font-medium text-primary sm:px-8">
          <PlayCircle className="h-4 w-4" aria-hidden />
          Your 180-minute clock is running — resume before it runs out.
        </div>
      )}
    </Card>
  )
}

function AllDoneCard() {
  return (
    <Card className="rounded-2xl p-8 text-center sm:p-10">
      <Trophy className="mx-auto h-10 w-10 text-primary" aria-hidden />
      <h2 className="mt-4 text-xl font-bold sm:text-2xl">Every available mock is done — legendary.</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        New mocks unlock at 12:00 AM IST on their scheduled dates. Till then, revisit your
        solutions and analytics, or climb the leaderboards.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={() => navigate('/mocks')}>Browse all mocks</Button>
        <Button variant="outline" onClick={() => navigate('/progress')}>View progress</Button>
      </div>
    </Card>
  )
}

/* -------------------------------- stat card ------------------------------- */

function StatCard({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <Card className="gap-0 rounded-xl p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" aria-hidden />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
    </Card>
  )
}

/* ----------------------------- recent attempts ---------------------------- */

function RecentAttempts({ profile, mocks }: { profile: PublicProfile; mocks: MockSummary[] }) {
  // recentAttempts has no attemptId — map mockNumber → my attempt id via the mocks list
  const attemptIdByNumber = new Map(
    mocks
      .filter(m => m.myAttempt?.status === 'SUBMITTED' && m.myAttempt.id)
      .map(m => [m.mockNumber, m.myAttempt!.id]),
  )
  return (
    <Card className="gap-0 overflow-hidden rounded-xl p-0">
      {profile.recentAttempts.map((a, i) => {
        const attemptId = attemptIdByNumber.get(a.mockNumber)
        const row = (
          <>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 font-mono text-xs font-bold text-primary">
              {String(a.mockNumber).padStart(2, '0')}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{a.mockTitle}</span>
              <span className="block text-xs text-muted-foreground">
                Submitted {timeAgo(a.submittedAt)}
                {a.rank != null && <> · ranked {ordinal(a.rank)}</>}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block font-mono text-sm font-bold tabular-nums">{a.score} <span className="text-xs font-normal text-muted-foreground">/ 300</span></span>
              <span className="block text-xs text-muted-foreground">score</span>
            </span>
            {attemptId && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />}
          </>
        )
        return attemptId ? (
          <Link
            key={i}
            to={`/result/${attemptId}`}
            className={`flex items-center gap-3 px-4 py-3.5 transition hover:bg-accent/40 sm:px-5 ${i > 0 ? 'border-t border-border/60' : ''}`}
          >
            {row}
          </Link>
        ) : (
          <div key={i} className={`flex items-center gap-3 px-4 py-3.5 sm:px-5 ${i > 0 ? 'border-t border-border/60' : ''}`}>
            {row}
          </div>
        )
      })}
      <Link
        to="/progress"
        className="block border-t border-border/60 px-4 py-3 text-center text-sm font-medium text-primary transition hover:bg-accent/40 sm:px-5"
      >
        See full progress history
      </Link>
    </Card>
  )
}

function EmptyAttempts() {
  return (
    <Card className="rounded-xl border-dashed p-8 text-center sm:p-10">
      <ListChecks className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
      <p className="mt-3 font-semibold">No attempts yet</p>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Your first full-length mock is the hardest and the most valuable. Start one,
        submit it, and this page fills up with scores, ranks and streaks — real ones.
      </p>
      <Button className="mt-5" onClick={() => navigate('/mocks')}>
        Take your first mock <ChevronRight className="h-4 w-4" aria-hidden />
      </Button>
    </Card>
  )
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Burning the midnight oil'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}
