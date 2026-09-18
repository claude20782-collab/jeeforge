'use client'
// Mock detail (#/mock/:id) — agent C. Header, rules (marking + palette legend),
// and the start/resume/view-result flow via POST /mocks/:id/attempts.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { Link, navigate } from '@/lib/router'
import { fmtDateIST, fmtDateTimeIST } from '@/lib/format'
import type { MockSummary } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { MockStatusBadge } from '@/components/views/mocks/mock-status-badge'
import { fmtCountdown, mockState, startAttempt, useNow } from '@/components/views/mocks/hooks'
import {
  AlertTriangle, ArrowLeft, BarChart3, BookOpen, CalendarClock, CheckCircle2, Clock3,
  FileText, Lock, PlayCircle, Radio, RefreshCw, Rocket, ShieldCheck, Target, Trophy, Users,
} from 'lucide-react'

export function MockDetailView({ mockId }: { mockId: string }) {
  const now = useNow(1000)
  const queryClient = useQueryClient()

  const mockQuery = useQuery({
    queryKey: ['mock', mockId],
    queryFn: async () => {
      const res = await api.get<{ mock: MockSummary }>(`/mocks/${mockId}`)
      return res.mock
    },
  })

  const startMutation = useMutation({
    mutationFn: () => startAttempt(mockId),
    onSuccess: (attemptId) => {
      queryClient.invalidateQueries({ queryKey: ['mocks'] })
      queryClient.invalidateQueries({ queryKey: ['mock', mockId] })
      navigate(`/test/${attemptId}`)
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(err.message)
        // 409 → already submitted (refetch reveals result link); 403 → locked/ unpublished
        if (err.status === 409 || err.status === 403) {
          queryClient.invalidateQueries({ queryKey: ['mock', mockId] })
          queryClient.invalidateQueries({ queryKey: ['mocks'] })
        }
      } else {
        toast.error('Could not start the test — please try again')
      }
    },
  })

  if (mockQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-4 h-5 w-28" />
        <Skeleton className="mb-8 h-48 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (mockQuery.isError || !mockQuery.data) {
    const status = mockQuery.error instanceof ApiError ? mockQuery.error.status : 0
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <Link to="/mocks" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden /> All mocks
        </Link>
        <Card className="rounded-2xl p-10 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
          <h1 className="mt-3 text-xl font-bold">
            {status === 404 ? 'Mock not found' : 'Couldn\'t load this mock'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {status === 404
              ? 'This mock doesn\'t exist — it may have been removed.'
              : 'Something went wrong while fetching the mock.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" onClick={() => mockQuery.refetch()}>
              <RefreshCw className="h-4 w-4" aria-hidden /> Retry
            </Button>
            <Button onClick={() => navigate('/mocks')}>Back to all mocks</Button>
          </div>
        </Card>
      </div>
    )
  }

  const mock = mockQuery.data
  const st = mockState(mock, now)
  const isActionable = st.kind === 'live' || st.kind === 'in-progress'

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <Link to="/mocks" className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden /> All mocks
      </Link>

      {/* header card */}
      <Card className="card-glow mb-6 gap-0 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-sm font-bold text-primary">
            Mock {String(mock.mockNumber).padStart(2, '0')}
          </span>
          <MockStatusBadge kind={st.kind} />
          {mock.participantCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" aria-hidden /> {mock.participantCount}{' '}
              {mock.participantCount === 1 ? 'participant' : 'participants'}
            </span>
          )}
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{mock.title}</h1>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Meta icon={CalendarClock} label="Unlocks" value={fmtDateTimeIST(mock.scheduledAt)} wide />
          <Meta icon={Clock3} label="Duration" value={`${mock.durationMinutes} min`} />
          <Meta icon={FileText} label="Questions" value={`${mock.questionCount || 75}`} />
          <Meta icon={Target} label="Max marks" value={String(mock.totalMarks)} />
          <Meta icon={BookOpen} label="Physics · Chem · Math" value="25 · 25 · 25" wide />
        </div>

        {st.kind === 'locked' && st.unlockInMs != null && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border bg-background/50 px-4 py-3.5">
            <Lock className="h-4 w-4 text-muted-foreground" aria-hidden />
            <span className="text-sm text-muted-foreground">This mock unlocks in</span>
            <span className="font-mono text-xl font-bold tabular-nums text-primary">{fmtCountdown(st.unlockInMs)}</span>
            <span className="text-sm text-muted-foreground">— at 12:00 AM IST sharp. Be first on the board.</span>
          </div>
        )}
        {st.kind === 'scheduled' && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3.5 text-sm leading-relaxed text-primary/90">
            <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Scheduled for {fmtDateTimeIST(mock.scheduledAt)}. Its 75 questions and complete
            solutions are being verified — it goes live only after every solution passes review.
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
        {/* rules card */}
        <Card className="rounded-2xl p-6">
          <h2 className="text-base font-semibold">Rules of the exam hall</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span><strong className="text-foreground">+4 for correct, −1 for incorrect.</strong> Single-correct MCQs and numerical-value questions, exactly like JEE Main.</span>
            </li>
            <li className="flex gap-2.5">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span><strong className="text-foreground">{mock.durationMinutes} minutes, server-controlled.</strong> The timer keeps running if you close the tab — you can resume until the deadline.</span>
            </li>
            <li className="flex gap-2.5">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span><strong className="text-foreground">One attempt per mock.</strong> No retakes, no pause — that's what makes the leaderboard mean something.</span>
            </li>
            <li className="flex gap-2.5">
              <Radio className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span><strong className="text-foreground">Scoring is server-side.</strong> Refreshing, going offline or tampering gains you nothing.</span>
            </li>
          </ul>

          <Separator className="my-5" />

          <h3 className="text-sm font-semibold">The question palette</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Every question tile is color-coded as you work — the same legend NTA uses:
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <PaletteLegendItem className="bg-[var(--palette-answered)]" title="Answered" desc="You picked an answer" />
            <PaletteLegendItem className="bg-[var(--palette-not-answered)]" title="Not answered" desc="Visited, but left blank" />
            <PaletteLegendItem className="bg-[var(--palette-not-visited)]" title="Not visited" desc="You haven't opened it yet" />
            <PaletteLegendItem className="bg-[var(--palette-marked)]" title="Marked for review" desc="Flag it now, decide later" />
          </div>
        </Card>

        {/* action card */}
        <Card className="h-fit rounded-2xl p-6 md:w-64">
          <h2 className="text-base font-semibold">
            {st.kind === 'completed' ? 'Your attempt' : isActionable ? 'Ready?' : 'Status'}
          </h2>

          <div className="mt-4">
            {st.kind === 'completed' && mock.myAttempt?.score != null && (
              <div className="rounded-xl border border-correct/30 bg-correct/10 p-4 text-center">
                <p className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-correct">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Submitted
                </p>
                <p className="mt-1.5 font-mono text-3xl font-bold tabular-nums">{mock.myAttempt.score}
                  <span className="text-sm font-normal text-muted-foreground"> / {mock.totalMarks}</span>
                </p>
              </div>
            )}
            {st.kind === 'in-progress' && (
              <p className="rounded-xl border border-primary/25 bg-primary/10 p-3 text-xs leading-relaxed text-primary">
                Attempt in progress — your clock is ticking. Resume before the 180-minute deadline auto-submits it.
              </p>
            )}
            {st.kind === 'live' && (
              <p className="rounded-xl border border-correct/25 bg-correct/10 p-3 text-xs leading-relaxed text-correct">
                Live now. Once you start, the {mock.durationMinutes}-minute clock starts immediately — pick a quiet 3 hours.
              </p>
            )}
            {st.kind === 'locked' && (
              <p className="rounded-xl border bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground">
                Locked until 12:00 AM IST on {fmtDateIST(mock.scheduledAt)}. The countdown above is live.
              </p>
            )}
            {st.kind === 'scheduled' && (
              <p className="rounded-xl border border-primary/25 bg-primary/5 p-3 text-xs leading-relaxed text-primary/90">
                Not published yet — solutions for all 75 questions are still being verified.
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {isActionable && (
              <Button
                size="lg" className="h-12"
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
            {st.kind === 'completed' && mock.myAttempt && (
              <>
                <Button size="lg" className="h-11" onClick={() => navigate(`/result/${mock.myAttempt!.id}`)}>
                  <BarChart3 className="h-4 w-4" aria-hidden /> View result
                </Button>
                <Button size="lg" variant="outline" className="h-11" onClick={() => navigate(`/solutions/${mock.myAttempt!.id}`)}>
                  <BookOpen className="h-4 w-4" aria-hidden /> Solutions
                </Button>
                <Button size="lg" variant="outline" className="h-11" onClick={() => navigate(`/analysis/${mock.myAttempt!.id}`)}>
                  <Trophy className="h-4 w-4" aria-hidden /> Analysis
                </Button>
              </>
            )}
            {st.kind === 'locked' && (
              <Button size="lg" className="h-12" disabled>
                <Lock className="h-4 w-4" aria-hidden /> Locked
              </Button>
            )}
            {st.kind === 'scheduled' && (
              <Button size="lg" className="h-12" disabled>
                <CalendarClock className="h-4 w-4" aria-hidden /> Not yet published
              </Button>
            )}
            <Button
              size="lg" variant={isActionable || st.kind === 'completed' ? 'ghost' : 'outline'}
              className="h-11"
              onClick={() => navigate('/leaderboard')}
            >
              <Trophy className="h-4 w-4" aria-hidden /> Leaderboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

/* --------------------------------- helpers -------------------------------- */

function Meta({ icon: Icon, label, value, wide }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div className={`rounded-lg border bg-background/40 px-3 py-2.5 ${wide ? 'col-span-2 sm:col-span-3 lg:col-span-2' : ''}`}>
      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden /> {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold" title={value}>{value}</p>
    </div>
  )
}

function PaletteLegendItem({ className, title, desc }: { className: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border bg-background/40 px-3 py-2">
      <span className={`h-6 w-6 shrink-0 rounded-md border border-border/60 ${className}`} aria-hidden />
      <span>
        <span className="block text-xs font-semibold">{title}</span>
        <span className="block text-[11px] text-muted-foreground">{desc}</span>
      </span>
    </div>
  )
}
