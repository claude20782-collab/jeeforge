'use client'
// ============================================================================
// ProgressView — #/progress — your journey across the mock series.
// Own profile stats + score trend + rank progression + score distribution +
// recent attempts table (joined with /api/mocks myAttempt for deep links).
// ============================================================================
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { api } from '@/lib/api'
import { Link, navigate } from '@/lib/router'
import { useAppStore } from '@/lib/store'
import type { MockSummary, PublicProfile } from '@/lib/types'
import { fmtDateTimeIST, fmtNumber, fmtPercent, ordinal } from '@/lib/format'
import { Avatar } from '@/components/app/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Award, BarChart3, ChevronRight, Crosshair, Flame, Info, ListChecks, Target, TrendingUp, Trophy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  EmptyPanel, ErrorPanel, PageShell, StatTile, TableSkeleton, ViewHeader, getChartColors,
} from './shared'

export function ProgressView() {
  const user = useAppStore((s) => s.user)
  const colors = getChartColors()

  const profileQ = useQuery({
    queryKey: ['profile', user?.username],
    enabled: !!user?.username,
    queryFn: async (): Promise<PublicProfile> => (await api.get<{ profile: PublicProfile }>(`/profiles/${user!.username}`)).profile,
  })
  const mocksQ = useQuery({
    queryKey: ['mocks'],
    queryFn: async (): Promise<MockSummary[]> => (await api.get<{ mocks: MockSummary[] }>('/mocks')).mocks,
  })

  // join recent attempts (mockNumber + score + rank) with mocks list for deep links
  const attemptIdByMock = useMemo(() => {
    const m = new Map<number, string | null>()
    for (const mock of mocksQ.data ?? []) m.set(mock.mockNumber, mock.myAttempt?.status === 'SUBMITTED' ? mock.myAttempt.id : null)
    return m
  }, [mocksQ.data])

  const attempts = useMemo(
    () => [...(profileQ.data?.recentAttempts ?? [])].sort((a, b) => a.mockNumber - b.mockNumber),
    [profileQ.data],
  )

  const histogram = useMemo(() => {
    const buckets = [
      { label: '0–49', min: 0, max: 49 }, { label: '50–99', min: 50, max: 99 },
      { label: '100–149', min: 100, max: 149 }, { label: '150–199', min: 150, max: 199 },
      { label: '200–249', min: 200, max: 249 }, { label: '250–300', min: 250, max: 300 },
    ]
    return buckets.map((b) => ({
      label: b.label,
      count: attempts.filter((a) => a.score >= b.min && a.score <= b.max).length,
    }))
  }, [attempts])

  if (!user) {
    return <PageShell><TableSkeleton rows={4} /></PageShell>
  }
  if (profileQ.isLoading) {
    return (
      <PageShell>
        <ViewHeader title="Progress" sub="Your journey across the mock series" />
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl border bg-card" />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-xl border bg-card" />
        </div>
      </PageShell>
    )
  }
  if (profileQ.isError || !profileQ.data) {
    return (
      <PageShell>
        <ErrorPanel
          message={profileQ.error instanceof Error ? profileQ.error.message : 'Failed to load profile'}
          onRetry={() => profileQ.refetch()}
        />
      </PageShell>
    )
  }
  const profile = profileQ.data
  const stats = profile.stats

  const trendData = attempts.map((a) => ({ mock: `M${a.mockNumber}`, score: a.score, rank: a.rank }))
  const hasRanks = trendData.some((d) => d.rank != null)

  return (
    <PageShell>
      <ViewHeader
        title="Progress"
        sub={(
          <span className="inline-flex items-center gap-2">
            <Avatar username={profile.username} displayName={profile.displayName} avatarUrl={profile.avatarUrl} size={22} />
            {profile.displayName || profile.username} · {stats.mocksCompleted} mock{stats.mocksCompleted === 1 ? '' : 's'} completed
          </span>
        )}
      />

      {stats.mocksCompleted === 0 ? (
        <EmptyPanel
          icon={TrendingUp}
          title="No attempts yet"
          body="Your progress charts light up as soon as you submit your first mock test. Pick one from the schedule and get started."
        >
          <Button onClick={() => navigate('/mocks')}>Browse mock tests</Button>
        </EmptyPanel>
      ) : (
        <div className="space-y-6">
          {/* stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          >
            <StatTile icon={ListChecks} label="Mocks done" value={stats.mocksCompleted} />
            <StatTile icon={Trophy} label="Best score" value={fmtNumber(stats.bestScore, 1)} tone="gold" hint="out of 300" />
            <StatTile icon={Target} label="Average" value={fmtNumber(stats.averageScore, 1)} />
            <StatTile icon={Crosshair} label="Accuracy" value={fmtPercent(stats.accuracy)} tone="emerald" />
            <StatTile icon={Flame} label="Streak" value={`${stats.streak} day${stats.streak === 1 ? '' : 's'}`} tone="red" />
            <StatTile icon={Award} label="Best rank" value={stats.bestRank != null ? ordinal(stats.bestRank) : '—'} tone="violet" />
          </motion.div>

          {/* score trend + distribution */}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.06 }}
              className="rounded-xl border bg-card p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-gold" /> Score trend</h2>
                <span className="text-xs text-muted-foreground">across {attempts.length} attempt{attempts.length === 1 ? '' : 's'}</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 6, right: 10, bottom: 0, left: -18 }}>
                    <CartesianGrid stroke={colors.border} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mock" tick={{ fill: colors.muted, fontSize: 11 }} tickLine={false} axisLine={{ stroke: colors.border }} />
                    <YAxis domain={[0, 300]} tick={{ fill: colors.muted, fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<TrendTip />} />
                    <Line
                      type="monotone" dataKey="score" name="Score" stroke={colors.gold} strokeWidth={2.5}
                      dot={{ r: 4, fill: colors.gold, strokeWidth: 0 }} activeDot={{ r: 5 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className="rounded-xl border bg-card p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold"><BarChart3 className="h-4 w-4 text-gold" /> Score distribution</h2>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogram} margin={{ top: 6, right: 4, bottom: 0, left: -22 }}>
                    <CartesianGrid stroke={colors.border} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: colors.muted, fontSize: 10 }} tickLine={false} axisLine={{ stroke: colors.border }} />
                    <YAxis allowDecimals={false} tick={{ fill: colors.muted, fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(128,128,128,0.08)' }} content={<HistogramTip />} />
                    <Bar dataKey="count" name="Mocks" fill={colors.emerald} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* rank progression */}
          {hasRanks && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
              className="rounded-xl border bg-card p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold"><Award className="h-4 w-4 text-gold" /> Rank progression</h2>
                <span className="text-xs text-muted-foreground">lower is better</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 6, right: 10, bottom: 0, left: -18 }}>
                    <CartesianGrid stroke={colors.border} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mock" tick={{ fill: colors.muted, fontSize: 11 }} tickLine={false} axisLine={{ stroke: colors.border }} />
                    <YAxis reversed allowDecimals={false} domain={[1, 'dataMax + 1']} tick={{ fill: colors.muted, fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<RankTip />} />
                    <Line
                      type="monotone" dataKey="rank" name="Rank" stroke={colors.violet} strokeWidth={2.5}
                      dot={{ r: 4, fill: colors.violet, strokeWidth: 0 }} activeDot={{ r: 5 }} connectNulls
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* recent attempts table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Recent attempts</h2>
              <span className="text-xs text-muted-foreground">latest {attempts.length}</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Mock</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Rank</TableHead>
                  <TableHead className="text-right">Submitted</TableHead>
                  <TableHead className="w-10" aria-label="Open" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map((a) => {
                  const attemptId = attemptIdByMock.get(a.mockNumber) ?? null
                  const row = (
                    <>
                      <TableCell>
                        <div className="font-medium">Mock {String(a.mockNumber).padStart(2, '0')}</div>
                        <div className="max-w-52 truncate text-xs text-muted-foreground">{a.mockTitle}</div>
                      </TableCell>
                      <TableCell className="text-right font-bold tabular-nums">
                        {a.score}<span className="font-normal text-muted-foreground"> /300</span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {a.rank != null ? <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold">{ordinal(a.rank)}</Badge> : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{fmtDateTimeIST(a.submittedAt)}</TableCell>
                      <TableCell className="text-right">
                        <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </>
                  )
                  return attemptId ? (
                    <TableRow
                      key={`${a.mockNumber}-${a.submittedAt}`}
                      className="cursor-pointer"
                      onClick={() => navigate(`/result/${attemptId}`)}
                    >
                      {row}
                    </TableRow>
                  ) : (
                    <TableRow key={`${a.mockNumber}-${a.submittedAt}`}>{row}</TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </motion.div>

          {/* honesty note */}
          <div className="flex items-start gap-2.5 rounded-xl border bg-card/60 p-4 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <p>
              These charts use your overall scores from each submitted attempt. Subject-wise and per-question breakdowns
              (accuracy, time per question, chapters, difficulty) live in each attempt&apos;s{' '}
              <span className="text-foreground">Detailed Analysis</span> page.
            </p>
          </div>
        </div>
      )}
    </PageShell>
  )
}

type TipItem = { payload?: Record<string, unknown> }

function TrendTip({ active, payload, label }: { active?: boolean; payload?: TipItem[]; label?: string | number }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as { mock: string; score: number; rank: number | null }
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="font-semibold">{label}</div>
      <div className="mt-0.5 text-muted-foreground">Score: <span className="font-semibold text-gold">{d.score} / 300</span></div>
      {d.rank != null && <div className="mt-0.5 text-muted-foreground">Rank: <span className="font-semibold text-foreground">{ordinal(d.rank)}</span></div>}
    </div>
  )
}

function RankTip({ active, payload, label }: { active?: boolean; payload?: TipItem[]; label?: string | number }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as { mock: string; score: number; rank: number | null }
  if (d.rank == null) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="font-semibold">{label}</div>
      <div className="mt-0.5 text-muted-foreground">Rank: <span className="font-semibold text-violet-400">{ordinal(d.rank)}</span></div>
      <div className="mt-0.5 text-muted-foreground">Score: <span className="font-semibold text-foreground">{d.score}</span></div>
    </div>
  )
}

function HistogramTip({ active, payload, label }: { active?: boolean; payload?: TipItem[]; label?: string | number }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as { count: number }
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="font-semibold">{label} marks</div>
      <div className="mt-0.5 text-muted-foreground">
        <span className={cn('font-semibold text-foreground', d.count === 0 && 'text-muted-foreground')}>{d.count}</span> mock{d.count === 1 ? '' : 's'}
      </div>
    </div>
  )
}
