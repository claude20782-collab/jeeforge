'use client'
// ============================================================================
// ResultView — #/result/:attemptId — scorecard for a submitted attempt.
// Hero score + rank, stat grid, per-subject cards, action buttons. Print-friendly.
// ============================================================================
import { motion } from 'framer-motion'
import { useResultQuery, PageShell, ErrorPanel, ViewSkeleton, SubjectBadge, type QStatus } from './shared'
import { Link, navigate } from '@/lib/router'
import { fmtDateTimeIST, fmtDuration, fmtPercent } from '@/lib/format'
import { SUBJECT_LABEL } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle, ArrowLeft, Award, Ban, BarChart3, Calendar, CheckCircle2, Clock,
  MinusCircle, Percent, Printer, Target, Trophy, XCircle,
} from 'lucide-react'
import type { SubjectScore } from '@/lib/types'

export function ResultView({ attemptId }: { attemptId: string }) {
  const q = useResultQuery(attemptId)
  if (q.isLoading) {
    return <PageShell><ViewSkeleton tiles={8} rows={3} /></PageShell>
  }
  if (q.isError || !q.data) {
    return (
      <PageShell>
        <ErrorPanel
          message={q.error instanceof Error ? q.error.message : 'Failed to load result'}
          onRetry={() => q.refetch()}
          back={{ to: '/dashboard', label: 'Back to dashboard' }}
        />
      </PageShell>
    )
  }
  const r = q.data
  const pct = r.percentage
  const tone: QStatus | 'gold' = pct >= 60 ? 'CORRECT' : pct >= 35 ? 'gold' : 'WRONG'
  const toneText = tone === 'CORRECT' ? 'text-emerald-400' : tone === 'gold' ? 'text-gold' : 'text-red-400'
  const toneBar = tone === 'CORRECT' ? 'bg-emerald-500' : tone === 'gold' ? 'bg-gold' : 'bg-red-500'
  const toneGlow = tone === 'CORRECT' ? 'var(--correct)' : tone === 'gold' ? 'var(--gold)' : 'var(--wrong)'
  const verdict = pct >= 60 ? 'Excellent performance' : pct >= 35 ? 'Solid performance — room to grow' : 'Keep practising — review the solutions'

  return (
    <PageShell>
      <div className="space-y-6">
        {/* header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
              Result — <span className="gold-gradient-text">Mock {String(r.mock.mockNumber).padStart(2, '0')}</span>
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{r.mock.title}</p>
          </div>
          <Button variant="outline" className="print:hidden" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
        </div>

        {r.autoSubmitted && (
          <div role="status" className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-300 print:border-0">
            <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
            <span>This attempt was <strong>auto-submitted</strong> when the 3-hour timer ran out. Unanswered questions were scored as unattempted.</span>
          </div>
        )}

        {/* hero score card */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card-glow relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-15 blur-3xl"
            style={{ background: toneGlow }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your score</p>
              <div className="mt-2 flex items-end gap-2.5">
                <span className={cn('text-6xl font-black leading-none tracking-tight sm:text-7xl', toneText)}>{r.score}</span>
                <span className="pb-2 text-xl font-semibold text-muted-foreground sm:text-2xl">/ {r.maxScore}</span>
              </div>
              <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                <Badge className={cn('border-transparent px-2.5 py-1 text-sm font-bold', tone === 'CORRECT' ? 'bg-emerald-500/15 text-emerald-300' : tone === 'gold' ? 'bg-gold/15 text-gold' : 'bg-red-500/15 text-red-300')}>
                  {fmtPercent(pct)}
                </Badge>
                {r.rank != null && (
                  <Badge className="border-gold/40 bg-gold/10 px-2.5 py-1 text-sm font-bold text-gold">
                    <Trophy className="mr-1 h-3.5 w-3.5" /> Rank {r.rank} of {r.totalParticipants}
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">{verdict}</span>
              </div>
            </div>
            <div className="w-full shrink-0 space-y-3 sm:w-64">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Score percentage</span>
                  <span className="font-semibold text-foreground">{fmtPercent(pct)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                  <div className={cn('h-full rounded-full transition-all', toneBar)} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="rounded-lg border bg-background/40 p-2.5">
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                  <div className="text-base font-bold text-foreground">{fmtPercent(r.accuracy)}</div>
                </div>
                <div className="rounded-lg border bg-background/40 p-2.5">
                  <div className="text-xs text-muted-foreground">Attempted</div>
                  <div className="text-base font-bold text-foreground">{fmtPercent(r.attemptRate, 0)}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* stat grid */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          aria-label="Attempt statistics"
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <StatBox icon={CheckCircle2} label="Correct" value={r.correct} tone="emerald" />
          <StatBox icon={XCircle} label="Wrong" value={r.wrong} tone="red" />
          <StatBox icon={MinusCircle} label="Unattempted" value={r.unattempted} />
          <StatBox icon={Target} label="Accuracy" value={fmtPercent(r.accuracy)} />
          <StatBox icon={Percent} label="Attempt rate" value={fmtPercent(r.attemptRate, 0)} />
          <StatBox icon={Ban} label="Negative marks" value={`−${r.negativeMarks}`} tone="red" />
          <StatBox icon={Clock} label="Time used" value={fmtDuration(r.timeUsedSeconds)} />
          <StatBox icon={Calendar} label="Submitted" value={fmtDateTimeIST(r.submittedAt)} className="col-span-2 sm:col-span-1" />
        </motion.section>

        {/* subject cards */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          aria-label="Subject-wise breakdown"
          className="grid gap-3 md:grid-cols-3"
        >
          {r.subjects.map((s) => <SubjectCard key={s.subject} s={s} />)}
        </motion.section>

        {/* actions */}
        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <Button onClick={() => navigate(`/solutions/${attemptId}`)}>
            View Solutions
          </Button>
          <Button variant="outline" onClick={() => navigate(`/analysis/${attemptId}`)}>
            <BarChart3 className="mr-2 h-4 w-4" /> Detailed Analysis
          </Button>
          <Button variant="outline" onClick={() => navigate('/leaderboard')}>
            <Trophy className="mr-2 h-4 w-4" /> Leaderboard
          </Button>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </div>
    </PageShell>
  )
}

function StatBox({ icon: Icon, label, value, tone, className }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
  tone?: 'emerald' | 'red'
  className?: string
}) {
  const toneText = tone === 'emerald' ? 'text-emerald-400' : tone === 'red' ? 'text-red-400' : 'text-foreground'
  const toneIcon = tone === 'emerald' ? 'text-emerald-400' : tone === 'red' ? 'text-red-400' : 'text-muted-foreground'
  return (
    <div className={cn('rounded-xl border bg-card p-4', className)}>
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className={cn('h-3.5 w-3.5', toneIcon)} /> {label}
      </div>
      <div className={cn('mt-1.5 text-2xl font-bold leading-none', toneText)}>{value}</div>
    </div>
  )
}

function SubjectCard({ s }: { s: SubjectScore }) {
  const totalQ = s.correct + s.wrong + s.unattempted
  const max = totalQ * 4
  const rows = [
    { label: 'Correct', value: s.correct, cls: 'text-emerald-400' },
    { label: 'Wrong', value: s.wrong, cls: 'text-red-400' },
    { label: 'Skipped', value: s.unattempted, cls: 'text-zinc-400' },
  ]
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <SubjectBadge subject={s.subject} />
        <div className="text-right">
          <span className={cn('text-xl font-bold', s.score > 0 ? 'text-foreground' : 'text-muted-foreground')}>{s.score}</span>
          <span className="text-sm text-muted-foreground"> / {max}</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-lg border bg-background/40 p-2 text-center">
            <div className={cn('text-lg font-bold leading-tight', row.cls)}>{row.value}</div>
            <div className="text-[11px] text-muted-foreground">{row.label}</div>
          </div>
        ))}
      </div>
      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Accuracy</dt>
          <dd className="font-semibold">{fmtPercent(s.accuracy)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Attempt rate</dt>
          <dd className="font-semibold">{fmtPercent(s.attemptRate, 0)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Time spent</dt>
          <dd className="font-semibold">{s.timeSpentSeconds > 0 ? fmtDuration(s.timeSpentSeconds) : '—'}</dd>
        </div>
      </dl>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Award className="h-3 w-3" /> out of {totalQ} question{totalQ === 1 ? '' : 's'} in {SUBJECT_LABEL[s.subject].toLowerCase()}
      </div>
    </div>
  )
}
