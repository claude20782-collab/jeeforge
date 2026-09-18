'use client'
// ============================================================================
// AnalysisView — #/analysis/:attemptId — deep performance analytics.
// (a) time analysis: speed buckets + per-question time chart
// (b) chapter table (sortable)  (c) topic table  (d) difficulty chart+table
// (e) subject radar + table     (f) mistake review + potential score
// ============================================================================
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { Link } from '@/lib/router'
import {
  AVOIDABLE_TAGS, DIFFICULTY_LABEL, MISTAKE_TAG_LABEL, SUBJECT_LABEL,
  type AnalysisFull, type Difficulty, type MistakeTag, type Subject,
} from '@/lib/types'
import { fmtDuration, fmtNumber, fmtPercent } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  ArrowUpDown, BarChart3, BookOpen, CheckCircle2, ChevronDown, ChevronUp, Clock,
  FlaskConical, Hash, Layers, Lightbulb, Radar as RadarIcon, Sigma, Tag, TrendingUp, XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DifficultyChip, ErrorPanel, PageShell, SubjectBadge, useAnalysisQuery, getChartColors,
  useResultQuery, ViewSkeleton, statusColor, type ChartColors,
} from './shared'

const DIFF_ORDER: Difficulty[] = ['EASY', 'MODERATE', 'HARD', 'VERY_HARD']

export function AnalysisView({ attemptId }: { attemptId: string }) {
  const analysisQ = useAnalysisQuery(attemptId)
  const resultQ = useResultQuery(attemptId) // per-question time/status + order mapping
  const colors = getChartColors()

  if (analysisQ.isLoading || resultQ.isLoading) {
    return <PageShell><ViewSkeleton tiles={8} rows={4} /></PageShell>
  }
  if (analysisQ.isError || !analysisQ.data) {
    return (
      <PageShell>
        <ErrorPanel
          message={analysisQ.error instanceof Error ? analysisQ.error.message : 'Failed to load analysis'}
          onRetry={() => analysisQ.refetch()}
        />
      </PageShell>
    )
  }
  const a = analysisQ.data
  const result = resultQ.data ?? null

  return (
    <PageShell>
      <div className="mb-6">
        <Link to={`/result/${attemptId}`} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
          ← Back to result
        </Link>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
          Detailed Analysis — <span className="gold-gradient-text">{result ? result.mock.title : 'your attempt'}</span>
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Score {a.potentialScore.current}{result ? ` / ${result.maxScore}` : ''} · every metric below is computed from your actual responses.
        </p>
      </div>

      <div className="space-y-10">
        <FadeIn><TimeSection analysis={a} result={result} colors={colors} attemptId={attemptId} /></FadeIn>
        <FadeIn><AggSection id="chapters" icon={BookOpen} title="Chapter analysis" description="Strengths and leaks chapter by chapter — click a column to sort." rows={a.chapters} colors={colors} /></FadeIn>
        <FadeIn><AggSection id="topics" icon={Layers} title="Topic analysis" description="Finer-grained performance per topic." rows={a.topics} colors={colors} topic /></FadeIn>
        <FadeIn><DifficultySection analysis={a} colors={colors} /></FadeIn>
        <FadeIn><SubjectSection analysis={a} colors={colors} /></FadeIn>
        <FadeIn><MistakeSection analysis={a} result={result} attemptId={attemptId} /></FadeIn>
      </div>
    </PageShell>
  )
}

function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.section>
  )
}

function SectionHead({ icon: Icon, title, description }: {
  icon: React.ComponentType<{ className?: string }>; title: string; description?: string
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

// ============================ (a) TIME ANALYSIS ============================

function TimeSection({ analysis, result, colors, attemptId }: {
  analysis: AnalysisFull; result: ReturnType<typeof useResultQuery>['data']; colors: ChartColors; attemptId: string
}) {
  const orderOf = useMemo(() => {
    const m = new Map<string, { order: number; subject: Subject }>()
    for (const q of result?.questions ?? []) m.set(q.questionId, { order: q.order, subject: q.subject })
    return m
  }, [result])

  const bucketDefs = [
    { key: 'correctFast', label: 'Correct & fast', hint: '≤ 45 s', tone: 'emerald' as const, icon: CheckCircle2 },
    { key: 'correctSlow', label: 'Correct but slow', hint: '≥ 120 s', tone: 'gold' as const, icon: Clock },
    { key: 'wrongFast', label: 'Wrong & rushed', hint: '≤ 45 s', tone: 'red' as const, icon: XCircle },
    { key: 'wrongSlow', label: 'Wrong & slow', hint: '≥ 120 s', tone: 'red' as const, icon: Clock },
    { key: 'unattempted', label: 'Unattempted', hint: 'never answered', tone: 'zinc' as const, icon: Sigma },
    { key: 'over2min', label: 'Over 2 min', hint: 'time sink', tone: 'gold' as const, icon: Clock },
    { key: 'over3min', label: 'Over 3 min', hint: 'serious time sink', tone: 'orange' as const, icon: Clock },
    { key: 'over5min', label: 'Over 5 min', hint: 'alarmingly long', tone: 'red' as const, icon: Clock },
  ]

  const chartData = useMemo(() => {
    if (!result) return []
    return [...result.questions]
      .sort((x, y) => x.order - y.order)
      .map((q) => ({ order: q.order, time: q.timeSpentSeconds, status: q.status, subject: q.subject }))
  }, [result])

  const interval = chartData.length > 14 ? Math.ceil(chartData.length / 15) : 0

  return (
    <div>
      <SectionHead icon={Clock} title="Time analysis" description="How you split your 3 hours — quick wins, time sinks and abandoned questions." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {bucketDefs.map((b) => {
          const ids = analysis.timeBuckets[b.key as keyof AnalysisFull['timeBuckets']]
          const orders = ids.map((id) => orderOf.get(id)?.order).filter((o): o is number => o != null).sort((x, y) => x - y)
          return (
            <div key={b.key} className="rounded-xl border bg-card p-4" title={orders.length ? `Questions: ${orders.map((o) => `Q${o}`).join(', ')}` : undefined}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{b.label}</span>
                <b.icon className={cn(
                  'h-4 w-4',
                  b.tone === 'emerald' && 'text-emerald-400', b.tone === 'gold' && 'text-gold',
                  b.tone === 'red' && 'text-red-400', b.tone === 'orange' && 'text-orange-400',
                  b.tone === 'zinc' && 'text-zinc-400',
                )} />
              </div>
              <div className="mt-1.5 text-2xl font-bold leading-none">{ids.length}</div>
              <div className="mt-1.5 truncate text-[11px] text-muted-foreground">
                {b.hint}{orders.length > 0 && <span aria-hidden> · {orders.slice(0, 4).map((o) => `Q${o}`).join(', ')}{orders.length > 4 ? ` +${orders.length - 4}` : ''}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {chartData.length > 0 && (
        <div className="mt-4 rounded-xl border bg-card p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Time spent per question</h3>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: colors.emerald }} /> Correct</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: colors.red }} /> Wrong</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: colors.muted }} /> Unattempted</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -14 }}>
                <CartesianGrid stroke={colors.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="order" interval={interval} tick={{ fill: colors.muted, fontSize: 11 }} tickLine={false} axisLine={{ stroke: colors.border }} />
                <YAxis tick={{ fill: colors.muted, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => formatSecsShort(v)} />
                <Tooltip
                  cursor={{ fill: 'rgba(128,128,128,0.08)' }}
                  content={<TimeChartTip />}
                />
                <Bar dataKey="time" radius={[3, 3, 0, 0]}>
                  {chartData.map((d) => (
                    <Cell key={d.order} fill={statusColor(d.status, colors)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Hover a bar for details. Review questions over 3 minutes in the{' '}
            <Link to={`/solutions/${attemptId}`} className="text-gold underline underline-offset-2">solutions</Link>.
          </p>
        </div>
      )}
    </div>
  )
}

function formatSecsShort(s: number): string {
  if (s >= 120) return `${Math.round(s / 60)}m`
  return `${s}s`
}

type TipItem = { payload?: Record<string, unknown> }
function TimeChartTip({ active, payload }: { active?: boolean; payload?: TipItem[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as { order: number; time: number; status: string; subject: Subject }
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="font-semibold">Q{d.order} · {SUBJECT_LABEL[d.subject]}</div>
      <div className="mt-0.5 text-muted-foreground">Time: <span className="font-medium text-foreground">{fmtDuration(d.time)}</span></div>
      <div className="mt-0.5 text-muted-foreground">Outcome: <span className={cn('font-medium', d.status === 'CORRECT' ? 'text-emerald-400' : d.status === 'WRONG' ? 'text-red-400' : 'text-muted-foreground')}>{d.status.toLowerCase()}</span></div>
    </div>
  )
}

// ====================== (b/c) CHAPTER + TOPIC TABLES ======================

interface AggRow {
  name: string
  subject: Subject
  attempted: number
  correct: number
  incorrect: number
  unattempted: number
  accuracy: number | null
  avgTimeSeconds: number
  score: number
}
type SortKey = keyof AggRow
type SortDir = 'asc' | 'desc'

function AggSection({ id, icon, title, description, rows, colors, topic }: {
  id: string; icon: React.ComponentType<{ className?: string }>; title: string; description: string
  rows: AggRow[]; colors: ChartColors; topic?: boolean
}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'score', dir: 'desc' })
  const [subjectFilter, setSubjectFilter] = useState<'ALL' | Subject>('ALL')

  const subjects = useMemo(
    () => [...new Set(rows.map((r) => r.subject))],
    [rows],
  )

  const visible = useMemo(
    () => subjectFilter === 'ALL' ? rows : rows.filter((r) => r.subject === subjectFilter),
    [rows, subjectFilter],
  )

  const sorted = useMemo(() => {
    const list = [...visible]
    list.sort((x, y) => {
      const vx = x[sort.key]; const vy = y[sort.key]
      let cmp: number
      if (typeof vx === 'string' || typeof vy === 'string') cmp = String(vx).localeCompare(String(vy))
      else if (typeof vx === 'number' || typeof vy === 'number') cmp = (Number(vx) || 0) - (Number(vy) || 0)
      else cmp = 0
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return list
  }, [visible, sort])

  function toggle(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }))
  }

  if (rows.length === 0) {
    return (
      <div id={id}>
        <SectionHead icon={icon} title={title} description={description} />
        <div className="rounded-xl border border-dashed bg-card/50 p-8 text-center text-sm text-muted-foreground">
          No {topic ? 'topics' : 'chapters'} were covered by this attempt.
        </div>
      </div>
    )
  }

  return (
    <div id={id}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <SectionHead icon={icon} title={title} description={description} />
        {subjects.length > 1 && (
          <div className="flex shrink-0 items-center gap-2 pb-0.5">
            <span className="text-xs text-muted-foreground" id={`${id}-subject-label`}>Subject</span>
            <Select value={subjectFilter} onValueChange={(v) => setSubjectFilter(v as 'ALL' | Subject)}>
              <SelectTrigger className="h-8 w-40" aria-labelledby={`${id}-subject-label`} size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All ({rows.length})</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>{SUBJECT_LABEL[s]} ({rows.filter((r) => r.subject === s).length})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <SortableHead onSort={() => toggle('subject')} active={sort.key === 'subject'} dir={sort.dir}>Subject</SortableHead>
              <SortableHead onSort={() => toggle('name')} active={sort.key === 'name'} dir={sort.dir} left>{topic ? 'Topic' : 'Chapter'}</SortableHead>
              <SortableHead onSort={() => toggle('attempted')} active={sort.key === 'attempted'} dir={sort.dir} right>Att.</SortableHead>
              <SortableHead onSort={() => toggle('correct')} active={sort.key === 'correct'} dir={sort.dir} right>Correct</SortableHead>
              <SortableHead onSort={() => toggle('incorrect')} active={sort.key === 'incorrect'} dir={sort.dir} right>Wrong</SortableHead>
              <SortableHead onSort={() => toggle('unattempted')} active={sort.key === 'unattempted'} dir={sort.dir} right>Skip</SortableHead>
              <SortableHead onSort={() => toggle('accuracy')} active={sort.key === 'accuracy'} dir={sort.dir}>Accuracy</SortableHead>
              <SortableHead onSort={() => toggle('avgTimeSeconds')} active={sort.key === 'avgTimeSeconds'} dir={sort.dir} right>Avg time</SortableHead>
              <SortableHead onSort={() => toggle('score')} active={sort.key === 'score'} dir={sort.dir} right>Score</SortableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => (
              <TableRow key={`${r.subject}-${r.name}`}>
                <TableCell><SubjectBadge subject={r.subject} /></TableCell>
                <TableCell className="max-w-44 truncate font-medium" title={r.name}>{r.name}</TableCell>
                <TableCell className="text-right tabular-nums">{r.attempted}</TableCell>
                <TableCell className="text-right tabular-nums text-emerald-400">{r.correct}</TableCell>
                <TableCell className="text-right tabular-nums text-red-400">{r.incorrect}</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">{r.unattempted}</TableCell>
                <TableCell>
                  <AccuracyBar value={r.accuracy} colors={colors} />
                </TableCell>
                <TableCell className="text-right tabular-nums">{r.attempted > 0 ? fmtDuration(r.avgTimeSeconds) : '—'}</TableCell>
                <TableCell className={cn('text-right font-bold tabular-nums', r.score > 0 ? 'text-emerald-400' : r.score < 0 ? 'text-red-400' : 'text-muted-foreground')}>
                  {r.score > 0 ? `+${r.score}` : r.score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function SortableHead({ onSort, active, dir, children, left, right }: {
  onSort: () => void; active: boolean; dir: SortDir; children: React.ReactNode; left?: boolean; right?: boolean
}) {
  return (
    <TableHead aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={cn(left && 'text-left', right && 'text-right')}>
      <button
        type="button"
        onClick={onSort}
        className={cn('inline-flex items-center gap-1 rounded px-1 py-0.5 text-xs font-medium uppercase tracking-wide transition hover:text-foreground', active ? 'text-gold' : 'text-muted-foreground')}
      >
        {children}
        {active
          ? (dir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)
          : <ArrowUpDown className="h-3 w-3 opacity-40" />}
      </button>
    </TableHead>
  )
}

function AccuracyBar({ value, colors }: { value: number | null; colors: ChartColors }) {
  const v = value ?? 0
  const fill = v >= 70 ? colors.emerald : v >= 40 ? colors.gold : colors.red
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, v)}%`, background: fill }} />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">{fmtPercent(value, 0)}</span>
    </div>
  )
}

// ====================== (d) DIFFICULTY ANALYSIS ======================

function DifficultySection({ analysis, colors }: { analysis: AnalysisFull; colors: ChartColors }) {
  const byKey = new Map(analysis.difficulty.map((d) => [d.difficulty, d]))
  const rows = DIFF_ORDER.map((d) => byKey.get(d)).filter((d): d is AnalysisFull['difficulty'][number] => d != null)
  const chartData = rows.map((d) => ({
    difficulty: DIFFICULTY_LABEL[d.difficulty],
    Attempted: d.attempted,
    Correct: d.correct,
    Incorrect: d.incorrect,
  }))

  return (
    <div>
      <SectionHead icon={BarChart3} title="Difficulty analysis" description="Where the paper punished you — and where it rewarded accuracy." />
      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card/50 p-8 text-center text-sm text-muted-foreground">No difficulty data.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barGap={2}>
                  <CartesianGrid stroke={colors.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="difficulty" tick={{ fill: colors.muted, fontSize: 11 }} tickLine={false} axisLine={{ stroke: colors.border }} />
                  <YAxis allowDecimals={false} tick={{ fill: colors.muted, fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(128,128,128,0.08)' }} content={<DifficultyChartTip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: colors.muted }} iconType="circle" iconSize={8} />
                  <Bar dataKey="Attempted" fill={colors.muted} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Correct" fill={colors.emerald} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Incorrect" fill={colors.red} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Att.</TableHead>
                  <TableHead className="text-right">Correct</TableHead>
                  <TableHead className="text-right">Wrong</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((d) => (
                  <TableRow key={d.difficulty}>
                    <TableCell><DifficultyChip difficulty={d.difficulty} /></TableCell>
                    <TableCell className="text-right tabular-nums">{d.attempted}</TableCell>
                    <TableCell className="text-right tabular-nums text-emerald-400">{d.correct}</TableCell>
                    <TableCell className="text-right tabular-nums text-red-400">{d.incorrect}</TableCell>
                    <TableCell><AccuracyBar value={d.accuracy} colors={colors} /></TableCell>
                    <TableCell className={cn('text-right font-bold tabular-nums', d.score > 0 ? 'text-emerald-400' : d.score < 0 ? 'text-red-400' : 'text-muted-foreground')}>
                      {d.score > 0 ? `+${d.score}` : d.score}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

function DifficultyChartTip({ active, payload, label }: { active?: boolean; payload?: TipItem[]; label?: string | number }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="font-semibold">{label}</div>
      {payload.map((p) => {
        const d = p.payload as Record<string, number | string>
        return (
          <div key={String(p.payload)} className="mt-0.5 text-muted-foreground">
            Attempted: <span className="font-medium text-foreground">{d.Attempted}</span> · Correct: <span className="font-medium text-emerald-400">{d.Correct}</span> · Incorrect: <span className="font-medium text-red-400">{d.Incorrect}</span>
          </div>
        )
      })}
    </div>
  )
}

// ====================== (e) SUBJECT COMPARISON ======================

function SubjectSection({ analysis, colors }: { analysis: AnalysisFull; colors: ChartColors }) {
  const radarData = analysis.subjects.map((s) => {
    const totalQ = s.correct + s.wrong + s.unattempted
    return {
      subject: s.subject === 'PHYSICS' ? 'Physics' : s.subject === 'CHEMISTRY' ? 'Chemistry' : 'Maths',
      'Accuracy %': s.accuracy ?? 0,
      'Score %': totalQ > 0 ? Math.round((s.score / (totalQ * 4)) * 1000) / 10 : 0,
      'Attempt %': s.attemptRate,
    }
  })

  return (
    <div>
      <SectionHead icon={RadarIcon} title="Subject comparison" description="Score, accuracy and attempt rate (each as a % of that subject's maximum) side by side." />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke={colors.border} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: colors.muted, fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: colors.muted, fontSize: 10 }} axisLine={false} tickCount={5} />
                <Radar name="Accuracy %" dataKey="Accuracy %" stroke={colors.gold} fill={colors.gold} fillOpacity={0.25} strokeWidth={2} />
                <Radar name="Score %" dataKey="Score %" stroke={colors.emerald} fill={colors.emerald} fillOpacity={0.18} strokeWidth={2} />
                <Radar name="Attempt %" dataKey="Attempt %" stroke={colors.violet} fill={colors.violet} fillOpacity={0.12} strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: 12, color: colors.muted }} iconType="circle" iconSize={8} />
                <Tooltip content={<SubjectRadarTip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Correct</TableHead>
                <TableHead className="text-right">Wrong</TableHead>
                <TableHead className="text-right">Skipped</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead className="text-right">Attempt rate</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis.subjects.map((s) => {
                const totalQ = s.correct + s.wrong + s.unattempted
                return (
                  <TableRow key={s.subject}>
                    <TableCell><SubjectBadge subject={s.subject} /></TableCell>
                    <TableCell className="text-right font-bold tabular-nums">{s.score}<span className="font-normal text-muted-foreground"> /{totalQ * 4}</span></TableCell>
                    <TableCell className="text-right tabular-nums text-emerald-400">{s.correct}</TableCell>
                    <TableCell className="text-right tabular-nums text-red-400">{s.wrong}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{s.unattempted}</TableCell>
                    <TableCell><AccuracyBar value={s.accuracy} colors={colors} /></TableCell>
                    <TableCell className="text-right tabular-nums">{fmtPercent(s.attemptRate, 0)}</TableCell>
                    <TableCell className="text-right tabular-nums">{s.timeSpentSeconds > 0 ? fmtDuration(s.timeSpentSeconds) : '—'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

function SubjectRadarTip({ active, payload, label }: { active?: boolean; payload?: TipItem[]; label?: string | number }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload as Record<string, number | string>
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="font-semibold">{label}</div>
      <div className="mt-0.5 text-muted-foreground">Score: <span className="font-medium text-foreground">{fmtNumber(d['Score %'] as number, 1)}%</span></div>
      <div className="mt-0.5 text-muted-foreground">Accuracy: <span className="font-medium text-foreground">{fmtNumber(d['Accuracy %'] as number, 1)}%</span></div>
      <div className="mt-0.5 text-muted-foreground">Attempt rate: <span className="font-medium text-foreground">{fmtNumber(d['Attempt %'] as number, 1)}%</span></div>
    </div>
  )
}

// ====================== (f) MISTAKE REVIEW ======================

function MistakeSection({ analysis, result, attemptId }: {
  analysis: AnalysisFull; result: ReturnType<typeof useResultQuery>['data']; attemptId: string
}) {
  const { current, potential, avoidableMistakes } = analysis.potentialScore
  const questionMeta = useMemo(() => {
    const m = new Map<string, { order: number; subject: Subject; status: string }>()
    for (const q of result?.questions ?? []) m.set(q.questionId, { order: q.order, subject: q.subject, status: q.status })
    return m
  }, [result])

  // analysis.mistakes covers every question — the review list is wrong + unattempted only
  const mistakes = useMemo(
    () => [...analysis.mistakes]
      .filter((m) => {
        const meta = questionMeta.get(m.questionId)
        return meta == null || meta.status !== 'CORRECT'
      })
      .sort((a, b) => a.order - b.order),
    [analysis.mistakes, questionMeta],
  )
  const tagged = mistakes.filter((m) => m.tag != null)
  const untagged = mistakes.length - tagged.length

  return (
    <div>
      <SectionHead icon={Lightbulb} title="Mistake review" description="Every wrong or skipped question, with an inline tag so you know exactly what to fix." />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* potential score card */}
        <div className="card-glow flex flex-col justify-center rounded-xl border bg-card p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Potential score</div>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-4xl font-black leading-none">{current}</span>
            <span className="pb-0.5 text-xl text-muted-foreground">→</span>
            <span className="text-4xl font-black leading-none text-gold">{potential}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            <strong className="text-foreground">{avoidableMistakes} avoidable {avoidableMistakes === 1 ? 'mistake' : 'mistakes'}</strong>{' '}
            costing you <strong className="text-foreground">{potential - current} marks</strong>.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Counts only wrong questions you self-tagged as avoidable (formula error, calculation error, silly mistake, misread question) at +5 marks each.
            {avoidableMistakes === 0 && ' Tag your mistakes below to see this grow.'}
          </p>
        </div>

        {/* inline-tagging list of every missed question */}
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Wrong &amp; skipped questions ({mistakes.length})</h3>
            {untagged > 0 && (
              <span className="text-xs text-muted-foreground">{untagged} untagged</span>
            )}
          </div>
          {mistakes.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              A clean sheet — nothing wrong, nothing skipped. Outstanding!
            </div>
          ) : (
            <ul className="max-h-96 divide-y overflow-y-auto">
              {mistakes.map((m) => (
                <MistakeRow
                  key={m.questionId}
                  mistake={m}
                  meta={questionMeta.get(m.questionId) ?? null}
                  attemptId={attemptId}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl border bg-card/60 p-4 text-xs text-muted-foreground">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <p>
          Concept gaps, time pressure and guesses are <em>not</em> counted as avoidable — they need study and strategy, not just care.
          Use the <TrendingUp className="inline h-3.5 w-3.5 text-gold" /> progress page to track whether your avoidable-mistake count shrinks over the series.
        </p>
      </div>
    </div>
  )
}

function MistakeRow({ mistake, meta, attemptId }: {
  mistake: AnalysisFull['mistakes'][number]
  meta: { order: number; subject: Subject; status: string } | null
  attemptId: string
}) {
  const qc = useQueryClient()
  const [tag, setTag] = useState<MistakeTag | null>(mistake.tag)
  const [saving, setSaving] = useState(false)

  useEffect(() => setTag(mistake.tag), [mistake.tag])

  const save = async (next: MistakeTag | null) => {
    const prev = tag
    setTag(next) // optimistic
    setSaving(true)
    try {
      await api.post(`/attempts/${attemptId}/mistake-tag`, { questionId: mistake.questionId, tag: next })
      qc.setQueryData<AnalysisFull>(['attempt', attemptId, 'analysis'], (old) => old && ({
        ...old,
        mistakes: old.mistakes.map((m) => (m.questionId === mistake.questionId ? { ...m, tag: next } : m)),
        potentialScore: {
 ...old.potentialScore,
          // recompute optimistically: avoidable tags on wrong questions at +5 each
          potential: old.potentialScore.potential + ((next != null && AVOIDABLE_TAGS.includes(next) ? 5 : 0) - (prev != null && AVOIDABLE_TAGS.includes(prev) ? 5 : 0)),
          avoidableMistakes: old.potentialScore.avoidableMistakes + ((next != null && AVOIDABLE_TAGS.includes(next) ? 1 : 0) - (prev != null && AVOIDABLE_TAGS.includes(prev) ? 1 : 0)),
        },
      }))
      void qc.invalidateQueries({ queryKey: ['attempt', attemptId, 'solutions'] })
      toast.success(next ? `Q${mistake.order} tagged as ${MISTAKE_TAG_LABEL[next]}` : `Q${mistake.order} tag cleared`)
    } catch (e) {
      setTag(prev) // rollback
      toast.error(e instanceof Error ? e.message : 'Failed to save tag')
    } finally {
      setSaving(false)
    }
  }

  const avoidable = tag != null && AVOIDABLE_TAGS.includes(tag)
  return (
    <li className="flex flex-wrap items-center gap-3 px-4 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-xs font-bold text-gold">
        <Hash className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <Link to={`/solutions/${attemptId}?q=${mistake.order}`} className="text-sm font-semibold hover:text-gold">
          Question {mistake.order}
        </Link>
        <div className="text-xs text-muted-foreground">
          {meta ? SUBJECT_LABEL[meta.subject] : 'Unknown subject'} · {meta?.status === 'UNATTEMPTED' ? 'left unattempted' : 'answered incorrectly'}
        </div>
      </div>
      <Select
        value={tag ?? 'NONE'}
        onValueChange={(v) => save(v === 'NONE' ? null : v as MistakeTag)}
        disabled={saving}
      >
        <SelectTrigger className="h-8 w-48" aria-label={`Mistake tag for question ${mistake.order}`} size="sm">
          <SelectValue placeholder="Tag this mistake" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NONE">No tag</SelectItem>
          {(Object.keys(MISTAKE_TAG_LABEL) as MistakeTag[]).map((t) => (
            <SelectItem key={t} value={t}>
              {MISTAKE_TAG_LABEL[t]}{AVOIDABLE_TAGS.includes(t) ? ' · avoidable' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {tag && (
        <Badge variant="outline" className={cn(
          'shrink-0',
          avoidable ? 'border-red-400/40 bg-red-500/10 text-red-300' : 'border-border bg-muted/50 text-muted-foreground',
        )}>
          <Tag className="mr-1 h-3 w-3" /> {MISTAKE_TAG_LABEL[tag]}
        </Badge>
      )}
    </li>
  )
}
