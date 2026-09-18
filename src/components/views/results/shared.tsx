'use client'
// ============================================================================
// Shared building blocks for agent E views: result / solutions / analysis /
// progress / leaderboard. Data access hooks, themed badges, chart colors,
// stat tiles, loading + error + empty states.
// ============================================================================
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AnalysisFull, Difficulty, ResultFull, SolutionItem, SourceType, Subject } from '@/lib/types'
import { DIFFICULTY_LABEL, SUBJECT_LABEL } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Link } from '@/lib/router'
import { cn } from '@/lib/utils'

export type QStatus = 'CORRECT' | 'WRONG' | 'UNATTEMPTED'
export const SECTION_LABEL: Record<'A' | 'B', string> = { A: 'Section A · MCQ', B: 'Section B · Numerical' }

// ============ data hooks ============

export function useResultQuery(attemptId: string) {
  return useQuery({
    queryKey: ['attempt', attemptId, 'result'],
    queryFn: async (): Promise<ResultFull> => (await api.get<{ result: ResultFull }>(`/attempts/${attemptId}/result`)).result,
  })
}

export function useSolutionsQuery(attemptId: string) {
  return useQuery({
    queryKey: ['attempt', attemptId, 'solutions'],
    queryFn: async (): Promise<SolutionItem[]> => (await api.get<{ solutions: SolutionItem[] }>(`/attempts/${attemptId}/solutions`)).solutions,
  })
}

export function useAnalysisQuery(attemptId: string) {
  return useQuery({
    queryKey: ['attempt', attemptId, 'analysis'],
    queryFn: async (): Promise<AnalysisFull> => (await api.get<{ analysis: AnalysisFull }>(`/attempts/${attemptId}/analysis`)).analysis,
  })
}

// ============ chart theme (resolve CSS vars once mounted) ============

export interface ChartColors {
  gold: string; emerald: string; red: string; violet: string; teal: string; muted: string; border: string
}

const FALLBACK_COLORS: ChartColors = {
  gold: '#d9a441', emerald: '#3fae7a', red: '#d95f4a', violet: '#a86bd6', teal: '#5cb8b0',
  muted: '#8a8378', border: '#4a453c',
}

let cachedColors: ChartColors | null = null

/**
 * Resolves the themed chart CSS variables (--chart-1..5) to concrete color strings
 * for recharts. Charts only render after data loads (client-side), so this is
 * never called during SSR. Resolved once per session and cached.
 */
export function getChartColors(): ChartColors {
  if (cachedColors) return cachedColors
  if (typeof document === 'undefined') return FALLBACK_COLORS
  try {
    const cs = getComputedStyle(document.documentElement)
    const get = (name: string, fallback: string) => {
      const v = cs.getPropertyValue(name).trim()
      return v || fallback
    }
    cachedColors = {
      gold: get('--chart-1', FALLBACK_COLORS.gold),
      emerald: get('--chart-2', FALLBACK_COLORS.emerald),
      red: get('--chart-3', FALLBACK_COLORS.red),
      violet: get('--chart-4', FALLBACK_COLORS.violet),
      teal: get('--chart-5', FALLBACK_COLORS.teal),
      muted: get('--muted-foreground', FALLBACK_COLORS.muted),
      border: get('--border', FALLBACK_COLORS.border),
    }
    return cachedColors
  } catch {
    return FALLBACK_COLORS
  }
}

export function statusColor(status: QStatus, c: ChartColors): string {
  return status === 'CORRECT' ? c.emerald : status === 'WRONG' ? c.red : c.muted
}

// ============ themed badges / chips ============

export const SUBJECT_CHIP: Record<Subject, string> = {
  PHYSICS: 'border-teal-500/30 bg-teal-500/15 text-teal-300',
  CHEMISTRY: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  MATHEMATICS: 'border-violet-500/30 bg-violet-500/15 text-violet-300',
}
export const SUBJECT_DOT: Record<Subject, string> = {
  PHYSICS: '#2dd4bf', CHEMISTRY: '#34d399', MATHEMATICS: '#c084fc',
}
export const DIFFICULTY_CHIP: Record<Difficulty, string> = {
  EASY: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  MODERATE: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
  HARD: 'border-orange-500/30 bg-orange-500/15 text-orange-300',
  VERY_HARD: 'border-red-500/30 bg-red-500/15 text-red-300',
}
export const STATUS_CHIP: Record<QStatus, string> = {
  CORRECT: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  WRONG: 'border-red-500/30 bg-red-500/15 text-red-300',
  UNATTEMPTED: 'border-zinc-500/30 bg-zinc-500/15 text-zinc-400',
}
export const STATUS_LABEL: Record<QStatus, string> = {
  CORRECT: 'Correct', WRONG: 'Incorrect', UNATTEMPTED: 'Unattempted',
}

export function SubjectBadge({ subject, className }: { subject: Subject; className?: string }) {
  return (
    <Badge variant="outline" className={cn(SUBJECT_CHIP[subject], className)}>
      {SUBJECT_LABEL[subject]}
    </Badge>
  )
}

export function DifficultyChip({ difficulty, className }: { difficulty: Difficulty; className?: string }) {
  return (
    <Badge variant="outline" className={cn(DIFFICULTY_CHIP[difficulty], className)}>
      {DIFFICULTY_LABEL[difficulty]}
    </Badge>
  )
}

export function StatusPill({ status, className }: { status: QStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn(STATUS_CHIP[status], className)}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}

export function SourceBadge({ sourceType, pyqYear, pyqShift, className }: {
  sourceType: SourceType; pyqYear: number | null; pyqShift: string | null; className?: string
}) {
  if (sourceType === 'ORIGINAL') {
    return <Badge variant="outline" className={cn('border-border bg-muted/50 text-muted-foreground', className)}>Original question</Badge>
  }
  const shift = pyqShift ? ` (${pyqShift})` : ''
  const label = pyqYear ? `PYQ · JEE Main ${pyqYear}${shift}` : 'PYQ'
  return (
    <Badge variant="outline" className={cn('border-gold/30 bg-gold/10 text-gold', className)}>
      {label}
    </Badge>
  )
}

// ============ layout shells ============

export function PageShell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={cn('mx-auto w-full px-3 py-6 sm:px-4 sm:py-8', wide ? 'max-w-7xl' : 'max-w-6xl')}>
      {children}
    </div>
  )
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground">
      <ArrowLeft className="h-4 w-4" /> {label}
    </Link>
  )
}

export function ViewHeader({ title, sub, back }: { title: string; sub?: ReactNode; back?: { to: string; label: string } }) {
  return (
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {back && <BackLink to={back.to} label={back.label} />}
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {sub && <div className="mt-1 text-sm text-muted-foreground">{sub}</div>}
      </div>
    </div>
  )
}

export function SectionHeading({ icon: Icon, title, description }: {
  icon: React.ComponentType<{ className?: string }>; title: string; description?: string
}) {
  return (
    <div className="mb-3 flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

// ============ stat tile ============

type Tone = 'default' | 'gold' | 'emerald' | 'red' | 'violet'

const TONE_ICON: Record<Tone, string> = {
  default: 'border-border bg-muted/60 text-muted-foreground',
  gold: 'border-gold/30 bg-gold/10 text-gold',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  red: 'border-red-500/30 bg-red-500/10 text-red-400',
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
}
const TONE_VALUE: Record<Tone, string> = {
  default: 'text-foreground', gold: 'text-gold', emerald: 'text-emerald-400',
  red: 'text-red-400', violet: 'text-violet-400',
}

export function StatTile({ icon: Icon, label, value, hint, tone = 'default', className }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: ReactNode
  hint?: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-3.5 rounded-xl border bg-card p-4', className)}>
      <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border', TONE_ICON[tone])}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <div className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className={cn('truncate text-xl font-bold leading-tight', TONE_VALUE[tone])}>{value}</div>
        {hint != null && <div className="truncate text-xs text-muted-foreground">{hint}</div>}
      </div>
    </div>
  )
}

// ============ error / empty / loading ============

export function ErrorPanel({ message, onRetry, back }: { message: string; onRetry?: () => void; back?: { to: string; label: string } }) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center sm:p-8">
      <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-destructive" />
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-1.5 break-words text-sm text-muted-foreground">{message}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try again
          </Button>
        )}
        {back && <Button variant="ghost" asChild><Link to={back.to}>{back.label}</Link></Button>}
      </div>
    </div>
  )
}

export function EmptyPanel({ icon: Icon, title, body, children }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{body}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  )
}

export function ViewSkeleton({ tiles = 4, rows = 3 }: { tiles?: number; rows?: number }) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: tiles }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}
