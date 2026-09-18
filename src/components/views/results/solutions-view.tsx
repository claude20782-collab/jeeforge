'use client'
// ============================================================================
// SolutionsView — #/solutions/:attemptId — master-detail solutions review.
// Left: question navigation grid (status + marked-for-review colors) + filters.
// Right: question, options with answer state, mistake tagging, full solution.
// Supports ?q=<order> deep-link and ←/→ keyboard navigation.
// ============================================================================
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useHashRoute, navigate } from '@/lib/router'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  AVOIDABLE_TAGS, MISTAKE_TAG_LABEL, SUBJECT_LABEL,
  type MistakeTag, type SolutionItem, type Subject,
} from '@/lib/types'
import { fmtDuration } from '@/lib/format'
import { Markdown } from '@/components/markdown'
import { QuestionDiagram } from '@/components/diagram'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Info,
  Lightbulb, ListFilter, Tag, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DifficultyChip, ErrorPanel, PageShell, SECTION_LABEL, SourceBadge, StatusPill, SubjectBadge,
  ViewSkeleton, useResultQuery, useSolutionsQuery, type QStatus,
} from './shared'

type StatusFilter = 'ALL' | QStatus
type SubjectFilter = 'ALL' | Subject

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const

export function SolutionsView({ attemptId }: { attemptId: string }) {
  const route = useHashRoute()
  const solutionsQ = useSolutionsQuery(attemptId)
  const resultQ = useResultQuery(attemptId) // markedForReview flags for the nav grid

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('ALL')
  const [chapterFilter, setChapterFilter] = useState<string>('ALL')
  const [activeId, setActiveId] = useState<string | null>(null)

  const solutions = solutionsQ.data ?? []

  const chapters = useMemo(() => {
    const seen = new Map<string, Subject>()
    for (const s of solutions) seen.set(s.chapter, s.question.subject)
    return [...seen.entries()].map(([name, subject]) => ({ name, subject })).sort((a, b) => a.name.localeCompare(b.name))
  }, [solutions])

  const markedMap = useMemo(() => {
    const m = new Map<string, boolean>()
    for (const q of resultQ.data?.questions ?? []) m.set(q.questionId, q.markedForReview)
    return m
  }, [resultQ.data])

  const filtered = useMemo(() => solutions.filter((s) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false
    if (subjectFilter !== 'ALL' && s.question.subject !== subjectFilter) return false
    if (chapterFilter !== 'ALL' && s.chapter !== chapterFilter) return false
    return true
  }), [solutions, statusFilter, subjectFilter, chapterFilter])

  // resolve the active solution: URL deep link (?q=<order>) wins, else manual
  // selection, else first match. No effect needed — pure derivation.
  const deepLinkId = useMemo(() => {
    const q = Number(route.params.q)
    if (!Number.isFinite(q) || q <= 0) return null
    return solutions.find((s) => s.question.order === q)?.question.id ?? null
  }, [route.params.q, solutions])

  const active = useMemo(() => {
    const target = deepLinkId ?? activeId
    const found = filtered.find((s) => s.question.id === target)
    if (found) return found
    return filtered[0] ?? null
  }, [filtered, activeId, deepLinkId])

  // manual selection strips a lingering ?q= deep link from the URL so
  // prev/next/dot navigation is not pinned to the linked question
  const selectQuestion = useCallback((id: string) => {
    if (route.params.q != null) navigate(`/solutions/${attemptId}`)
    setActiveId(id)
  }, [route.params.q, attemptId])

  const step = useCallback((dir: 1 | -1) => {
    if (!active || filtered.length === 0) return
    const idx = filtered.findIndex((s) => s.question.id === active.question.id)
    const next = filtered[idx + dir]
    if (next) selectQuestion(next.question.id)
  }, [active, filtered, selectQuestion])

  // keyboard navigation (ignore when a form control has focus)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(t.tagName)) return
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  if (solutionsQ.isLoading) {
    return <PageShell wide><ViewSkeleton tiles={6} rows={5} /></PageShell>
  }
  if (solutionsQ.isError) {
    return (
      <PageShell>
        <ErrorPanel
          message={solutionsQ.error instanceof Error ? solutionsQ.error.message : 'Failed to load solutions'}
          onRetry={() => solutionsQ.refetch()}
        />
      </PageShell>
    )
  }
  if (solutions.length === 0) {
    return (
      <PageShell>
        <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
          No questions found for this attempt.
        </div>
      </PageShell>
    )
  }

  const counts = {
    all: solutions.length,
    CORRECT: solutions.filter((s) => s.status === 'CORRECT').length,
    WRONG: solutions.filter((s) => s.status === 'WRONG').length,
    UNATTEMPTED: solutions.filter((s) => s.status === 'UNATTEMPTED').length,
  }

  return (
    <PageShell wide>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Solutions — <span className="gold-gradient-text">Mock {String(resultQ.data?.mock.mockNumber ?? 1).padStart(2, '0')}</span>
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>{resultQ.data?.mock.title ?? 'Detailed solutions'}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1"><Info className="h-3.5 w-3.5" /> Solutions stay available forever</span>
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* ============ sidebar: filters + navigation grid ============ */}
        <aside className="space-y-4 rounded-xl border bg-card p-4 lg:sticky lg:top-20" aria-label="Question navigation">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ListFilter className="h-4 w-4 text-gold" /> Filters
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
            <div>
              <span className="mb-1 block text-xs text-muted-foreground" id="filter-status-label">Status</span>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-full" aria-labelledby="filter-status-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All ({counts.all})</SelectItem>
                  <SelectItem value="CORRECT">Correct ({counts.CORRECT})</SelectItem>
                  <SelectItem value="WRONG">Incorrect ({counts.WRONG})</SelectItem>
                  <SelectItem value="UNATTEMPTED">Unattempted ({counts.UNATTEMPTED})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground" id="filter-subject-label">Subject</span>
              <Select value={subjectFilter} onValueChange={(v) => setSubjectFilter(v as SubjectFilter)}>
                <SelectTrigger className="w-full" aria-labelledby="filter-subject-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All subjects</SelectItem>
                  <SelectItem value="PHYSICS">Physics</SelectItem>
                  <SelectItem value="CHEMISTRY">Chemistry</SelectItem>
                  <SelectItem value="MATHEMATICS">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground" id="filter-chapter-label">Chapter</span>
              <Select value={chapterFilter} onValueChange={setChapterFilter}>
                <SelectTrigger className="w-full" aria-labelledby="filter-chapter-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All chapters</SelectItem>
                  {chapters.map((c) => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold">Questions</span>
              <span className="text-xs text-muted-foreground">{filtered.length} shown</span>
            </div>
            <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-12 lg:grid-cols-7">
              {solutions.map((s) => (
                <NavDot
                  key={s.question.id}
                  order={s.question.order}
                  status={s.status}
                  marked={markedMap.get(s.question.id) ?? false}
                  dimmed={!filtered.some((f) => f.question.id === s.question.id)}
                  active={active?.question.id === s.question.id}
                  onSelect={() => selectQuestion(s.question.id)}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[11px] text-muted-foreground">
              <LegendDot className="bg-emerald-500/70 border-emerald-400/60" label="Correct" />
              <LegendDot className="bg-red-500/70 border-red-400/60" label="Wrong" />
              <LegendDot className="bg-muted/50 border-border" label="Skipped" />
              <LegendDot className="bg-transparent border-violet-400" label="Marked" />
            </div>
          </div>

          <p className="hidden border-t pt-3 text-[11px] text-muted-foreground lg:block">
            Tip: use the <kbd className="rounded border bg-muted px-1 font-mono">←</kbd> <kbd className="rounded border bg-muted px-1 font-mono">→</kbd> arrow keys to move between questions.
          </p>
        </aside>

        {/* ============ main panel ============ */}
        <div>
          {active ? (
            <motion.div
              key={active.question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <QuestionPanel
                item={active}
                attemptId={attemptId}
                position={filtered.findIndex((s) => s.question.id === active.question.id) + 1}
                total={filtered.length}
                onPrev={() => step(-1)}
                onNext={() => step(1)}
              />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-16 text-center">
              <ListFilter className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No questions match these filters</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => { setStatusFilter('ALL'); setSubjectFilter('ALL'); setChapterFilter('ALL') }}>
                Reset filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}

// ============ navigation dot ============

function NavDot({ order, status, marked, dimmed, active, onSelect }: {
  order: number; status: QStatus; marked: boolean; dimmed: boolean; active: boolean; onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Question ${order} — ${status === 'CORRECT' ? 'correct' : status === 'WRONG' ? 'incorrect' : 'unattempted'}${marked ? ', marked for review' : ''}`}
      aria-pressed={active}
      className={cn(
        'relative flex h-8 w-8 items-center justify-center rounded-md border text-xs font-bold transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        status === 'CORRECT' && 'border-emerald-400/60 bg-emerald-500/25 text-emerald-300',
        status === 'WRONG' && 'border-red-400/60 bg-red-500/25 text-red-300',
        status === 'UNATTEMPTED' && 'border-border bg-muted/50 text-muted-foreground',
        dimmed && 'opacity-30',
        active && 'ring-2 ring-gold ring-offset-1 ring-offset-card',
        marked && 'before:absolute before:-inset-0.5 before:rounded-md before:border-2 before:border-violet-400',
      )}
    >
      {order}
    </button>
  )
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('h-2.5 w-2.5 rounded-sm border', className)} aria-hidden /> {label}
    </span>
  )
}

// ============ question panel ============

function QuestionPanel({ item, attemptId, position, total, onPrev, onNext }: {
  item: SolutionItem
  attemptId: string
  position: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  const q = item.question
  const isCorrectAnswer = (letter: string) => item.correctAnswer === letter
  const isMyAnswer = (letter: string) => item.myAnswer === letter

  return (
    <article className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold">Question {q.order}</h2>
          <StatusPill status={item.status} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onPrev} disabled={position <= 1} aria-label="Previous question">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-14 text-center text-sm text-muted-foreground">{position} / {total}</span>
          <Button variant="outline" size="icon" onClick={onNext} disabled={position >= total} aria-label="Next question">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 sm:p-6">
        {/* badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <SubjectBadge subject={q.subject} />
          <Badge variant="outline" className="border-border bg-muted/50 text-muted-foreground">{SECTION_LABEL[q.section]}</Badge>
          <DifficultyChip difficulty={item.difficulty} />
          <SourceBadge sourceType={item.sourceType} pyqYear={item.pyqYear} pyqShift={item.pyqShift} />
          <span className={cn(
            'ml-auto inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold',
            item.status === 'CORRECT' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : item.status === 'WRONG' ? 'border-red-500/30 bg-red-500/10 text-red-300'
                : 'border-border bg-muted/50 text-muted-foreground',
          )}>
            {item.status === 'CORRECT' ? `+${q.marksCorrect}` : item.status === 'WRONG' ? `${q.marksWrong}` : '0'} marks
          </span>
        </div>

        {/* chapter / topic / time */}
        <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-gold" />
            {item.chapter} <span aria-hidden>›</span> {item.topic}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gold" />
            Your time: {item.timeSpentSeconds > 0 ? fmtDuration(item.timeSpentSeconds) : 'not visited'}
          </span>
        </div>

        {/* question text */}
        <div className="mt-4">
          <Markdown>{q.text}</Markdown>
        </div>

        {q.diagram && <QuestionDiagram spec={q.diagram} />}

        {/* options / answers */}
        {q.options ? (
          <>
            <ul className="mt-4 space-y-2" aria-label="Options">
              {q.options.map((opt, i) => {
                const letter = OPTION_LETTERS[i]
                const mine = isMyAnswer(letter)
                const correct = isCorrectAnswer(letter)
                return (
                  <li
                    key={letter}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3.5 transition',
                      mine && correct && 'border-emerald-400/60 bg-emerald-500/10',
                      mine && !correct && 'border-red-400/60 bg-red-500/10',
                      !mine && correct && 'border-emerald-400/50 bg-emerald-500/5',
                      !mine && !correct && 'border-border bg-background/30',
                    )}
                  >
                    <span className={cn(
                      'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                      mine && correct && 'border-emerald-400 bg-emerald-500/20 text-emerald-300',
                      mine && !correct && 'border-red-400 bg-red-500/20 text-red-300',
                      !mine && correct && 'border-emerald-400/60 text-emerald-300',
                      !mine && !correct && 'border-border text-muted-foreground',
                    )}>
                      {letter}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Markdown>{opt}</Markdown>
                    </div>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      {mine && (
                        <Badge variant="outline" className={cn('border-red-400/50 bg-red-500/15 text-red-300', correct && 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300')}>
                          {correct ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />} Your answer
                        </Badge>
                      )}
                      {!mine && correct && (
                        <Badge variant="outline" className="border-emerald-400/50 bg-emerald-500/15 text-emerald-300">
                          <Check className="mr-1 h-3 w-3" /> Correct answer
                        </Badge>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-2.5 text-xs text-muted-foreground" aria-live="polite">
              Your answer{' '}
              <strong className={item.status === 'CORRECT' ? 'text-emerald-400' : item.status === 'WRONG' ? 'text-red-400' : 'text-muted-foreground'}>
                {item.myAnswer ?? '—'}
              </strong>
              <span className="mx-1.5" aria-hidden>·</span>
              Correct answer <strong className="text-emerald-400">{item.correctAnswer}</strong>
            </p>
          </>
        ) : (
          <div className="mt-4 rounded-lg border bg-background/30 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Numerical answer (Section B)</div>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm">
              <span>
                Your answer:{' '}
                <strong className={item.status === 'CORRECT' ? 'text-emerald-400' : item.status === 'WRONG' ? 'text-red-400' : 'text-muted-foreground'}>
                  {item.myAnswer ?? '—'}
                </strong>
              </span>
              <span>
                Correct answer: <strong className="text-emerald-400">{item.correctAnswer}</strong>
              </span>
            </div>
          </div>
        )}

        {/* mistake tagging — only wrong / unattempted */}
        {item.status !== 'CORRECT' && (
          <MistakeTagger item={item} attemptId={attemptId} />
        )}
      </div>

      {/* solution */}
      <SolutionBlock item={item} />
    </article>
  )
}

// ============ mistake tagger ============

function MistakeTagger({ item, attemptId }: { item: SolutionItem; attemptId: string }) {
  const qc = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [tag, setTag] = useState<MistakeTag | null>(item.mistakeTag)

  // keep local state in sync when navigating between questions
  useEffect(() => setTag(item.mistakeTag), [item.question.id, item.mistakeTag])

  async function save(next: MistakeTag | null) {
    setSaving(true)
    try {
      await api.post(`/attempts/${attemptId}/mistake-tag`, { questionId: item.question.id, tag: next })
      setTag(next)
      qc.setQueryData<SolutionItem[]>(['attempt', attemptId, 'solutions'], (prev) =>
        prev?.map((s) => (s.question.id === item.question.id ? { ...s, mistakeTag: next } : s)) ?? prev)
      void qc.invalidateQueries({ queryKey: ['attempt', attemptId, 'analysis'] })
      toast.success(next ? `Tagged as ${MISTAKE_TAG_LABEL[next]}` : 'Mistake tag cleared')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save tag')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-5 rounded-lg border border-gold/25 bg-gold/5 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <div>
            <p className="text-sm font-medium">Why did you miss this one?</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tag your mistake to power the avoidable-mistakes analysis. Tags marked avoidable: formula, calculation, silly, misread.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={tag ?? 'NONE'}
            onValueChange={(v) => save(v === 'NONE' ? null : v as MistakeTag)}
            disabled={saving}
          >
            <SelectTrigger className="w-full min-w-44 sm:w-52" aria-label="Mistake tag">
              <SelectValue placeholder={saving ? 'Saving…' : 'Select a tag'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">No tag (clear)</SelectItem>
              {(Object.keys(MISTAKE_TAG_LABEL) as MistakeTag[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {MISTAKE_TAG_LABEL[t]}{AVOIDABLE_TAGS.includes(t) ? ' · avoidable' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {tag && (
            <Button variant="ghost" size="sm" onClick={() => save(null)} disabled={saving} aria-label="Clear mistake tag">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ solution block ============

function SolutionBlock({ item }: { item: SolutionItem }) {
  const [open, setOpen] = useState(true)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="overflow-hidden rounded-xl border bg-card">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-accent/50 sm:p-5">
        <span className="flex items-center gap-2.5 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
            <Lightbulb className="h-4 w-4" />
          </span>
          Solution &amp; key concept
        </span>
        <ChevronDown className={cn('h-4.5 w-4.5 shrink-0 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-4 border-t px-4 pb-5 pt-4 sm:px-5">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Step-by-step solution</h3>
            <Markdown>{item.solutionText}</Markdown>
          </div>
          {item.formulaConcept.trim() !== '' && (
            <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
              <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
                <Lightbulb className="h-3.5 w-3.5" /> Key formula / concept
              </h3>
              <Markdown>{item.formulaConcept}</Markdown>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
