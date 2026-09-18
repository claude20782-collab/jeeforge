'use client'
// ============================================================================
// LeaderboardView — #/leaderboard — competition standings.
// Tabs: Current Mock (with mock selector) / Weekly / Monthly / Overall / All
// Mocks. Top-3 medals, own row highlighted + pinned "your standing" card.
// ============================================================================
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { navigate } from '@/lib/router'
import { useAppStore } from '@/lib/store'
import type { LeaderboardResponse, MockSummary } from '@/lib/types'
import { fmtDuration, fmtNumber, fmtPercent, ordinal, timeAgo } from '@/lib/format'
import { Avatar } from '@/components/app/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Crown, EyeOff, Flag, Info, Medal, Pin, Trophy, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmptyPanel, ErrorPanel, PageShell, TableSkeleton } from './shared'

type Scope = LeaderboardResponse['scope']

const SCOPES: Array<{ value: Scope; label: string; description: string; scoreLabel: string }> = [
  { value: 'current', label: 'Current Mock', description: 'Best attempt per user on a single mock', scoreLabel: 'Best score' },
  { value: 'weekly', label: 'Weekly', description: 'Best score submitted this week (IST)', scoreLabel: 'Best score' },
  { value: 'monthly', label: 'Monthly', description: 'Best score submitted this month (IST)', scoreLabel: 'Best score' },
  { value: 'overall', label: 'Overall', description: 'Total score across every attempt, all-time', scoreLabel: 'Total score' },
  { value: 'allmock', label: 'All Mocks', description: 'Average score across all attempts', scoreLabel: 'Avg score' },
]

export function LeaderboardView() {
  const user = useAppStore((s) => s.user)
  const [scope, setScope] = useState<Scope>('current')
  const [mockId, setMockId] = useState<string | null>(null) // null = latest unlocked

  const mocksQ = useQuery({
    queryKey: ['mocks'],
    queryFn: async (): Promise<MockSummary[]> => (await api.get<{ mocks: MockSummary[] }>('/mocks')).mocks,
  })

  const lbQuery = useQuery({
    queryKey: ['leaderboard', scope, mockId],
    queryFn: async (): Promise<LeaderboardResponse> => {
      const qs = new URLSearchParams({ scope })
      if (scope === 'current' && mockId) qs.set('mockId', mockId)
      return api.get<LeaderboardResponse>(`/leaderboard?${qs.toString()}`)
    },
  })

  const unlockedMocks = useMemo(
    () => (mocksQ.data ?? []).filter((m) => m.unlocked),
    [mocksQ.data],
  )

  const lb = lbQuery.data
  const scopeMeta = SCOPES.find((s) => s.value === scope)!

  return (
    <PageShell>
      <div className="mb-5 flex flex-col gap-1">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight sm:text-3xl">
          <Trophy className="h-7 w-7 text-gold" /> Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground">Compete with every JEEForge aspirant — ranks update live as attempts are submitted.</p>
      </div>

      <Tabs value={scope} onValueChange={(v) => setScope(v as Scope)}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto w-max">
            {SCOPES.map((s) => (
              <TabsTrigger key={s.value} value={s.value} className="px-3.5 py-1.5">{s.label}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {scope === 'current'
              ? <span className="inline-flex items-center gap-1.5"><Flag className="h-3.5 w-3.5 text-gold" />{scopeMeta.description}{lb?.mockNumber != null ? ` — Mock ${String(lb.mockNumber).padStart(2, '0')}` : ''}</span>
              : scopeMeta.description}
          </p>
          {scope === 'current' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground" id="lb-mock-label">Mock</span>
              <Select
                value={mockId ?? (lb?.mockNumber != null ? unlockedMocks.find((m) => m.mockNumber === lb.mockNumber)?.id ?? 'latest' : 'latest')}
                onValueChange={(v) => setMockId(v === 'latest' ? null : v)}
                disabled={unlockedMocks.length === 0}
              >
                <SelectTrigger className="w-56" aria-labelledby="lb-mock-label">
                  <SelectValue placeholder={unlockedMocks.length === 0 ? 'No unlocked mocks' : 'Latest unlocked mock'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest unlocked mock</SelectItem>
                  {unlockedMocks.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      Mock {String(m.mockNumber).padStart(2, '0')} · {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="mt-4">
          {lbQuery.isLoading ? (
            <TableSkeleton rows={7} />
          ) : lbQuery.isError ? (
            <ErrorPanel
              message={lbQuery.error instanceof Error ? lbQuery.error.message : 'Failed to load leaderboard'}
              onRetry={() => lbQuery.refetch()}
            />
          ) : !lb || lb.entries.length === 0 ? (
            <EmptyPanel
              icon={Trophy}
              title={scope === 'current' && unlockedMocks.length === 0 ? 'No unlocked mocks yet' : 'No attempts yet — be the first!'}
              body={
                lb?.me.entry
                  ? 'You have an attempt here — it will appear once ranking data is available.'
                  : 'Submit a mock test and claim the top spot.'
              }
            >
              <Button onClick={() => navigate('/mocks')}>Browse mock tests</Button>
            </EmptyPanel>
          ) : (
            <LeaderboardTable lb={lb} scopeMeta={scopeMeta} myUsername={user?.username ?? null} />
          )}
        </div>
      </Tabs>
    </PageShell>
  )
}

function LeaderboardTable({ lb, scopeMeta, myUsername }: {
  lb: LeaderboardResponse
  scopeMeta: { scoreLabel: string }
  myUsername: string | null
}) {
  const inList = lb.me.entry != null && lb.entries.some((e) => e.username === lb.me.entry?.username)
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-xl border bg-card"
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Aspirant</TableHead>
              <TableHead className="text-right">{scopeMeta.scoreLabel}</TableHead>
              <TableHead className="text-right">Accuracy</TableHead>
              <TableHead className="text-right">Attempts</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="text-right">Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lb.entries.map((e) => {
              const isMe = myUsername != null && e.username === myUsername
              return (
                <TableRow
                  key={e.username}
                  className={cn('cursor-pointer', isMe && 'border-l-2 border-l-gold bg-gold/[0.07] hover:bg-gold/[0.1]')}
                  onClick={() => navigate(`/profile/${e.username}`)}
                >
                  <TableCell>
                    <RankBadge rank={e.rank} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar username={e.username} displayName={e.displayName} avatarUrl={e.avatarUrl} size={32} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-medium">{e.displayName || e.username}</span>
                          {isMe && <Badge variant="outline" className="border-gold/40 bg-gold/10 text-gold">You</Badge>}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">@{e.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold tabular-nums text-gold">{fmtNumber(e.score, 1)}</span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{fmtPercent(e.accuracy)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{e.attempts}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{e.timeUsedSeconds != null ? fmtDuration(e.timeUsedSeconds) : '—'}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{e.submittedAt ? timeAgo(e.submittedAt) : '—'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </motion.div>

      {/* my standing */}
      {lb.me.entry && !inList && lb.me.rank != null && (
        <div className="rounded-xl border border-gold/30 bg-gold/[0.06] p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Pin className="h-4 w-4 text-gold" /> Your standing
            </span>
            <span className="text-sm">
              <Badge variant="outline" className="border-gold/40 bg-gold/10 text-gold">{ordinal(lb.me.rank)}</Badge>
              <span className="ml-2 text-muted-foreground">
                Score <span className="font-semibold text-foreground">{fmtNumber(lb.me.entry.score, 1)}</span>
                <span className="mx-1.5" aria-hidden>·</span>Accuracy {fmtPercent(lb.me.entry.accuracy)}
                <span className="mx-1.5" aria-hidden>·</span>{lb.me.entry.attempts} attempt{lb.me.entry.attempts === 1 ? '' : 's'}
              </span>
            </span>
          </div>
        </div>
      )}
      {lb.me.entry && lb.me.rank == null && (
        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card/60 p-4 text-xs text-muted-foreground">
          <EyeOff className="mt-0.5 h-4 w-4 shrink-0" />
          <p>You have attempts but are hidden from the public leaderboard (leaderboard visibility is off in your settings). Your standing is visible only to you.</p>
        </div>
      )}
      {!lb.me.entry && (
        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card/60 p-4 text-xs text-muted-foreground">
          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p>You have not attempted this leaderboard yet — submit a mock test to enter the rankings.</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Ties are broken by accuracy, then earlier submission. Top 100 shown.
        </span>
        {lb.updatedAt && <span>Updated {timeAgo(lb.updatedAt)}</span>}
      </div>
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/50 bg-amber-400/15 text-amber-300" aria-label={`Rank ${rank} — gold`}>
        <Crown className="h-4 w-4" />
      </span>
    )
  }
  if (rank === 2) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300/40 bg-zinc-300/10 text-zinc-300" aria-label={`Rank ${rank} — silver`}>
        <Medal className="h-4 w-4" />
      </span>
    )
  }
  if (rank === 3) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-300" aria-label={`Rank ${rank} — bronze`}>
        <Medal className="h-4 w-4" />
      </span>
    )
  }
  return <span className="text-sm font-semibold tabular-nums text-muted-foreground">{rank}</span>
}
