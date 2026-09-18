'use client'
// Landing page (#/) — agent C. Public marketing page: hero, features, real schedule
// timeline (GET /api/mocks), how-it-works, FAQ, CTA. No fake statistics — only real API data.

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Link, navigate } from '@/lib/router'
import { useAppStore } from '@/lib/store'
import { fmtDateShort, fmtNumber } from '@/lib/format'
import type { MockSummary } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import {
  BarChart3, BookOpenCheck, CalendarClock, CheckCircle2, ChevronRight, Clock3, Flame,
  Lock, MonitorPlay, PlayCircle, Radio, ShieldCheck, Sparkles, Trophy, Users,
} from 'lucide-react'
import {
  fmtCountdown, fmtCountdownCompact, groupMocksByMonth, mockState, nextActionableMock, useNow,
} from '@/components/views/mocks/hooks'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function LandingView() {
  const user = useAppStore(s => s.user)
  const now = useNow(1000)
  const mocksQuery = useQuery({
    queryKey: ['mocks'],
    queryFn: async () => {
      const res = await api.get<{ mocks: MockSummary[] }>('/mocks')
      return res.mocks
    },
    staleTime: 10_000,
  })
  const mocks = mocksQuery.data ?? []
  const nextMock = useMemo(() => (mocks.length ? nextActionableMock(mocks) : null), [mocks])
  const totalParticipants = useMemo(
    () => mocks.reduce((sum, m) => sum + m.participantCount, 0), [mocks],
  )

  return (
    <div className="relative overflow-x-clip">
      <LandingNav authed={!!user} />

      <Hero authed={!!user} nextMock={nextMock} now={now} />
      <StatsStrip nextMock={nextMock} now={now} totalParticipants={totalParticipants} />
      <Features />
      <Schedule
        mocks={mocks}
        now={now}
        loading={mocksQuery.isLoading}
        error={mocksQuery.isError}
        onRetry={() => mocksQuery.refetch()}
      />
      <HowItWorks />
      <Faq />
      <FinalCta authed={!!user} />
    </div>
  )
}

/* ---------------------------------- nav ---------------------------------- */

function LandingNav({ authed }: { authed: boolean }) {
  const links = [
    { label: 'Features', id: 'features' },
    { label: 'Schedule', id: 'schedule' },
    { label: 'How it works', id: 'how-it-works' },
    { label: 'FAQ', id: 'faq' },
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight" aria-label="JEEForge home">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-black text-primary-foreground">J</span>
          <span className="text-lg">JEE<span className="gold-gradient-text">Forge</span></span>
        </Link>
        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Landing">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollToId(l.id)}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-accent/60 hover:text-foreground"
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {authed ? (
            <Button size="sm" onClick={() => navigate('/dashboard')}>
              Dashboard <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log in</Button>
              <Button size="sm" onClick={() => navigate('/signup')}>Sign up free</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

/* ---------------------------------- hero --------------------------------- */

function Hero({ authed, nextMock, now }: { authed: boolean; nextMock: MockSummary | null; now: number }) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* ambient gold glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[34rem] w-[52rem] -translate-x-1/2 rounded-full opacity-70"
          style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--gold) 14%, transparent), transparent)' }} />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Free forever · JEE Main 2027 · 19 Sep – 31 Dec 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
            className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Crack JEE Main 2027 with{' '}
            <span className="gold-gradient-text">40 free full-length mocks</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Exam-day realism from day one. A true NTA-style CBT engine, complete verified
            solutions for <em className="font-medium not-italic text-foreground">every</em> question,
            chapter-wise analytics and all-India leaderboards — built by people who took the exam seriously.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            {authed ? (
              <Button size="lg" className="h-12 px-7 text-base" onClick={() => navigate('/dashboard')}>
                Go to your dashboard <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="lg" className="h-12 px-7 text-base" onClick={() => navigate('/signup')}>
                Start free — no card, ever <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            <Button size="lg" variant="outline" className="h-12 px-7 text-base" onClick={() => scrollToId('schedule')}>
              <CalendarClock className="h-4 w-4" /> Explore the schedule
            </Button>
          </motion.div>

          {nextMock && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.34 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              {(() => {
                const st = mockState(nextMock, now)
                if (st.kind === 'live') {
                  return (
                    <span className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-correct/30 bg-correct/10 px-3 py-1.5 text-correct">
                      <Radio className="h-3.5 w-3.5" aria-hidden />
                      Mock {String(nextMock.mockNumber).padStart(2, '0')} is live now — {nextMock.participantCount} {nextMock.participantCount === 1 ? 'participant' : 'participants'} so far
                    </span>
                  )
                }
                if (st.kind === 'in-progress') {
                  return (
                    <span className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-primary">
                      <PlayCircle className="h-3.5 w-3.5" aria-hidden />
                      Your Mock {String(nextMock.mockNumber).padStart(2, '0')} attempt is in progress — the clock is running
                    </span>
                  )
                }
                if (st.kind === 'locked' && st.unlockInMs != null) {
                  return (
                    <span className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                      Next mock: <strong className="text-foreground">Mock {String(nextMock.mockNumber).padStart(2, '0')}</strong>
                      {' '}unlocks in <span className="font-mono font-semibold text-primary">{fmtCountdown(st.unlockInMs)}</span>
                    </span>
                  )
                }
                return null
              })()}
            </motion.div>
          )}
        </div>

        <PaletteMockup />
      </div>
    </section>
  )
}

/** Decorative CBT question-palette mockup (UI illustration — not data). */
function PaletteMockup() {
  const tiles = [
    { n: 1, cls: 'bg-[var(--palette-answered)] text-black' },
    { n: 2, cls: 'bg-[var(--palette-answered)] text-black' },
    { n: 3, cls: 'bg-[var(--palette-not-visited)] text-muted-foreground' },
    { n: 4, cls: 'bg-[var(--palette-marked)] text-black' },
    { n: 5, cls: 'bg-[var(--palette-not-answered)] text-black' },
    { n: 6, cls: 'bg-[var(--palette-answered)] text-black' },
    { n: 7, cls: 'bg-[var(--palette-not-visited)] text-muted-foreground' },
    { n: 8, cls: 'bg-[var(--palette-not-answered)] text-black' },
    { n: 9, cls: 'bg-[var(--palette-answered)] text-black' },
    { n: 10, cls: 'bg-[var(--palette-marked)] text-black' },
    { n: 11, cls: 'bg-[var(--palette-not-visited)] text-muted-foreground' },
    { n: 12, cls: 'bg-[var(--palette-answered)] text-black' },
  ]
  const legend = [
    { cls: 'bg-[var(--palette-answered)]', label: 'Answered' },
    { cls: 'bg-[var(--palette-not-answered)]', label: 'Not answered' },
    { cls: 'bg-[var(--palette-not-visited)]', label: 'Not visited' },
    { cls: 'bg-[var(--palette-marked)]', label: 'Marked for review' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mx-auto w-full max-w-sm"
      aria-hidden
    >
      <div className="card-glow rounded-2xl border bg-card/90 p-5 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold">Question Palette</p>
          <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">02:59:41</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {tiles.map(t => (
            <div key={t.n} className={`flex h-9 items-center justify-center rounded-md text-xs font-bold ${t.cls}`}>
              {t.n}
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border/70 pt-4">
          {legend.map(l => (
            <div key={l.label} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={`h-3 w-3 shrink-0 rounded-[4px] ${l.cls}`} />
              {l.label}
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
          The real NTA-style palette you'll use on test day — with mark-for-review, subject
          tabs and a server-authoritative timer.
        </p>
      </div>
    </motion.div>
  )
}

/* ------------------------------- stats strip ------------------------------ */

function StatsStrip({ nextMock, now, totalParticipants }: { nextMock: MockSummary | null; now: number; totalParticipants: number }) {
  const stats = [
    { icon: MonitorPlay, value: '40', label: 'full-length mocks' },
    { icon: BookOpenCheck, value: '75', label: 'questions per mock' },
    { icon: Trophy, value: '300', label: 'marks · 180 minutes' },
  ]
  const st = nextMock ? mockState(nextMock, now) : null
  return (
    <section className="border-y border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
              <s.icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xl font-bold leading-tight sm:text-2xl">{s.value}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </div>
          </div>
        ))}
        {st?.kind === 'locked' && st.unlockInMs != null ? (
          <div className="col-span-2 flex items-center gap-3 md:col-span-1">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
              <Clock3 className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-mono text-xl font-bold leading-tight text-primary sm:text-2xl">{fmtCountdown(st.unlockInMs)}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">until Mock {String(nextMock!.mockNumber).padStart(2, '0')} unlocks</p>
            </div>
          </div>
        ) : totalParticipants > 0 ? (
          <div className="col-span-2 flex items-center gap-3 md:col-span-1">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
              <Flame className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xl font-bold leading-tight sm:text-2xl">{fmtNumber(totalParticipants, 0)}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">mock attempts submitted</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

/* -------------------------------- features ------------------------------- */

const FEATURES = [
  {
    icon: MonitorPlay, title: 'Real CBT engine',
    body: 'The exact NTA feel — question palette, mark-for-review, subject tabs, numerical keypad and a timer the server controls. No refresh-cheating, no pause button.',
  },
  {
    icon: BookOpenCheck, title: 'Solutions for every question',
    body: 'All 75 questions ship with a complete, verified step-by-step solution and the key formula or concept. A mock only publishes after every solution passes review.',
  },
  {
    icon: BarChart3, title: 'Chapter-wise analytics',
    body: 'Accuracy and time per chapter, topic and difficulty. Tag your mistakes — concept gap, silly error, time pressure — and see the score they cost you.',
  },
  {
    icon: Trophy, title: 'All-India leaderboards',
    body: 'Live rank in every mock, plus weekly, monthly and all-time boards. Opt out any time from settings if you’d rather compete quietly.',
  },
  {
    icon: Users, title: 'Study community',
    body: 'Public and private study groups, direct messages and notifications — argue about that one physics question the right way, with real-time chat.',
  },
  {
    icon: ShieldCheck, title: 'Anti-cheat, seriously',
    body: 'Server-side scoring and timing, one attempt per mock, session monitoring and moderation tooling. The leaderboard means something here.',
  },
]

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow="Why JEEForge"
        title="Built like the real thing, not a PDF of papers"
        sub="Every detail — from the palette colors to the −1 marking — matches the actual CBT, so mock #40 feels exactly like mock #1: routine."
      />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
          >
            <Card className="h-full gap-4 rounded-xl p-6 transition-colors hover:border-primary/30">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                <f.icon className="h-5.5 w-5.5" aria-hidden />
              </span>
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* -------------------------------- schedule ------------------------------- */

function Schedule({ mocks, now, loading, error, onRetry }: {
  mocks: MockSummary[]; now: number; loading: boolean; error: boolean; onRetry: () => void
}) {
  const groups = useMemo(() => groupMocksByMonth(mocks), [mocks])
  return (
    <section id="schedule" className="border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="The schedule"
          title="40 mocks. One unlock a day. 12:00 AM IST."
          sub="A new full-length mock unlocks at midnight IST on its scheduled date and stays open — miss a day and you can always take it later. Each mock can be attempted exactly once."
        />

        {loading ? (
          <div className="mt-10 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : error ? (
          <div className="mt-10 rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
            <p className="font-medium text-destructive">Couldn't load the schedule.</p>
            <p className="mt-1 text-sm text-muted-foreground">Check your connection and try again.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>Retry</Button>
          </div>
        ) : mocks.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed p-10 text-center">
            <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="mt-3 font-semibold">The 40-mock schedule is being finalized</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Mocks appear here the moment each one's 75 questions and solutions clear
              verification. Create a free account to get the announcement the second Mock 01 publishes.
            </p>
            <Button className="mt-5" onClick={() => navigate('/signup')}>Create free account</Button>
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            {groups.map((g, gi) => (
              <motion.div
                key={g.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: gi * 0.04 }}
              >
                <div className="mb-3 flex items-baseline gap-3">
                  <h3 className="text-lg font-semibold">{g.label}</h3>
                  <span className="text-sm text-muted-foreground">
                    {g.mocks.length} {g.mocks.length === 1 ? 'mock' : 'mocks'}
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border bg-background/40">
                  {g.mocks.map((m, idx) => (
                    <ScheduleRow key={m.id} mock={m} now={now} withTopBorder={idx > 0} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {mocks.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => navigate('/mocks')}>
              Open the full mocks hub <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

function ScheduleRow({ mock, now, withTopBorder }: { mock: MockSummary; now: number; withTopBorder: boolean }) {
  const st = mockState(mock, now)
  return (
    <Link
      to={`/mock/${mock.id}`}
      className={`group flex items-center gap-3 px-4 py-3 transition hover:bg-accent/40 sm:gap-4 sm:px-5 ${withTopBorder ? 'border-t border-border/60' : ''}`}
    >
      <span className="w-14 shrink-0 text-xs font-medium text-muted-foreground sm:w-16">
        {fmtDateShort(mock.scheduledAt)}
      </span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 font-mono text-xs font-bold text-primary">
        {String(mock.mockNumber).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{mock.title}</span>
      {mock.participantCount > 0 && (
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
          {mock.participantCount} {mock.participantCount === 1 ? 'participant' : 'participants'}
        </span>
      )}
      <span className="shrink-0">
        {st.kind === 'live' && <LiveChip />}
        {st.kind === 'in-progress' && <span className="text-xs font-semibold text-primary">In progress</span>}
        {st.kind === 'completed' && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-correct">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            {mock.myAttempt?.score != null ? `${mock.myAttempt.score}/300` : 'Done'}
          </span>
        )}
        {st.kind === 'locked' && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            <span className="font-mono">{fmtCountdownCompact(st.unlockInMs)}</span>
          </span>
        )}
        {st.kind === 'scheduled' && (
          <span className="inline-flex items-center gap-1.5 text-xs text-primary/80">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden />
            Scheduled
          </span>
        )}
      </span>
    </Link>
  )
}

function LiveChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-correct/40 bg-correct/10 px-2 py-0.5 text-xs font-semibold text-correct">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-correct opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-correct" />
      </span>
      Live
    </span>
  )
}

/* ------------------------------ how it works ----------------------------- */

const STEPS = [
  {
    title: 'Create a free account',
    body: 'A username, an email, a password — done in thirty seconds. No paywall will ever appear.',
  },
  {
    title: 'Pick your mock',
    body: 'A fresh full-length mock unlocks at 12:00 AM IST on every scheduled date, from 19 September to 31 December 2026.',
  },
  {
    title: 'Sit the 180-minute CBT',
    body: '75 questions, 300 marks, +4/−1 marking. Palette, mark-for-review, subject switching — the whole exam-day muscle memory.',
  },
  {
    title: 'Review, tag, climb',
    body: 'Solutions for all 75 questions, chapter-wise analytics, mistake tags and your all-India rank — within seconds of submitting.',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow="How it works"
        title="Four steps to exam-day boredom"
        sub="The point of a mock series is that by December, the real exam feels like a Tuesday."
      />
      <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {STEPS.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative rounded-xl border bg-card/60 p-6"
          >
            <span className="gold-gradient-text font-mono text-3xl font-bold">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-3 font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

/* ----------------------------------- faq --------------------------------- */

const FAQS = [
  {
    q: 'Is JEEForge really free?',
    a: 'Yes — all 40 full-length mocks, complete solutions, analytics, leaderboards and community features are free for every aspirant. No trials, no locked features, no card required.',
  },
  {
    q: 'When does each mock unlock?',
    a: 'Every mock unlocks at 12:00 AM IST on its scheduled date (see the schedule above). Once unlocked, a mock stays open for the rest of the series, so you can take it late — but each mock can be attempted exactly once.',
  },
  {
    q: 'What is the paper pattern?',
    a: 'Each mock is a full-length JEE Main paper: 75 questions — 25 Physics, 25 Chemistry, 25 Mathematics — worth 300 marks in 180 minutes. Marking is +4 for a correct answer and −1 for an incorrect one, across single-correct MCQs and numerical-value questions.',
  },
  {
    q: 'Can I retake a mock or pause it?',
    a: 'No — one attempt per mock, and the 180-minute clock is enforced by the server, exactly like the real CBT. If you close the tab mid-test, your attempt stays live and you can resume until the deadline. This is what keeps ranks meaningful.',
  },
  {
    q: 'Are solutions really available for every question?',
    a: 'Yes. A mock publishes only after all 75 of its questions pass content verification, which includes a complete step-by-step solution and the key formula or concept for each. You can review all solutions, tag mistakes and study chapter-wise analytics right after submitting.',
  },
  {
    q: 'How are ranks and leaderboards computed?',
    a: 'Ranks are live: your rank in a mock is computed against everyone who has submitted it so far, with ties broken by earlier submission. There are also weekly, monthly and all-time leaderboards, and you can opt out of appearing on them from settings.',
  },
  {
    q: 'I forgot my password — what do I do?',
    a: 'Email delivery is not configured on this deployment, so the "forgot password" form cannot email you a reset link by itself. Contact an admin (via the community groups or a fellow aspirant who knows one) — they can issue you a secure reset link that works on the reset-password page.',
  },
]

function Faq() {
  return (
    <section id="faq" className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered honestly"
          sub="Including the ones most platforms hide in the fine print."
        />
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-[15px] font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

/* -------------------------------- final cta ------------------------------ */

function FinalCta({ authed }: { authed: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="card-glow relative isolate overflow-hidden rounded-2xl border bg-card px-6 py-12 text-center sm:px-12 sm:py-16"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-72 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--gold) 16%, transparent), transparent)' }} />
        </div>
        <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          Your exam-day advantage starts <span className="gold-gradient-text">tonight at midnight</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Mock 01 unlocks 19 September 2026, 12:00 AM IST. Every serious aspirant in the
          country can be on that first leaderboard — including you.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {authed ? (
            <Button size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/mocks')}>
              Go to your mocks <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/signup')}>
                Create your free account
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => navigate('/login')}>
                I already have one
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </section>
  )
}

/* ------------------------------ section header ---------------------------- */

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45 }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">{sub}</p>
    </motion.div>
  )
}
