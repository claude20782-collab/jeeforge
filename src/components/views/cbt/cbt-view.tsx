'use client'
/**
 * CbtView — faithful JEE Main CBT test interface (route #/test/:attemptId).
 * One question per screen, NTA-style palette + statuses, server-authoritative
 * countdown (skew-corrected, resynced from every PUT response), optimistic
 * answer mutations with rollback, refresh-safe resume, auto-submit on expiry.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api, ApiError } from '@/lib/api'
import { navigate } from '@/lib/router'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import type { AttemptFull, Subject } from '@/lib/types'
import { SUBJECT_LABEL } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { CbtTimer } from './timer'
import { QuestionPane, NUMERIC_RE } from './question-pane'
import {
  Palette, PaletteLegend, paletteCounts, type PaletteAnswer, type PaletteStatus,
} from './palette'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { SubmitDialog } from './submit-dialog'
import { useMediaQuery } from './use-media-query'
import {
  AlertTriangle, BookmarkPlus, CheckCheck, ChevronLeft, ChevronRight, Eraser,
  Keyboard, LayoutGrid, ListChecks, Loader2, Save,
} from 'lucide-react'

type Phase = 'loading' | 'error' | 'active' | 'submitting'

type LocalAnswer = PaletteAnswer

const DEFAULT_ANSWER: LocalAnswer = { selectedAnswer: null, markedForReview: false, visited: false }

export function CbtView({ attemptId }: { attemptId: string }) {
  const [attempt, setAttempt] = useState<AttemptFull | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({})
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState<string | null>(null)
  const [endAtMs, setEndAtMs] = useState(0)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  // ---- refs (stable action closures; interval-safe) ----
  const questionsRef = useRef<AttemptFull['questions']>([])
  const answersRef = useRef<Record<string, LocalAnswer>>({})
  const indexRef = useRef(0)
  const draftRef = useRef<string | null>(null)
  const phaseRef = useRef<Phase>('loading')
  const submitOpenRef = useRef(false)
  const submitLockRef = useRef(false)
  const pendingTimeRef = useRef<Map<string, number>>(new Map())
  const visitedSentRef = useRef<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { submitOpenRef.current = submitOpen || helpOpen }, [submitOpen, helpOpen])

  const questions = attempt?.questions ?? []
  const total = questions.length
  const currentQ = questions[index]
  const isTablet = useMediaQuery('(min-width: 768px)')

  // ============ submit (idempotent; used by dialog, timer expiry and 410) ============
  const doSubmit = useCallback(async (reason: 'USER' | 'AUTO') => {
    if (submitLockRef.current) return
    submitLockRef.current = true
    setSubmitOpen(false)
    setPhase('submitting')
    if (reason === 'AUTO') toast.info('Time up — submitting your test')
    try {
      await api.post(`/attempts/${attemptId}/submit`, { reason })
      toast.success('Test submitted', { description: 'Redirecting to your result…' })
      navigate(`/result/${attemptId}`)
    } catch (err) {
      submitLockRef.current = false
      setPhase('active')
      toast.error('Could not submit', {
        description: err instanceof Error ? err.message : 'Please try again.',
      })
    }
  }, [attemptId])

  const handleExpire = useCallback(() => { void doSubmit('AUTO') }, [doSubmit])

  // ============ answer PUT: resyncs timer from remainingSeconds; 410 → auto-submit ============
  const putUpdate = useCallback(async (qid: string, payload: Record<string, unknown>, onFail?: () => void) => {
    try {
      const res = await api.put<{ ok: boolean; remainingSeconds: number }>(
        `/attempts/${attemptId}/answers`, { questionId: qid, ...payload },
      )
      setEndAtMs(Date.now() + res.remainingSeconds * 1000)
      return true
    } catch (err) {
      if (err instanceof ApiError && err.status === 410) {
        void doSubmit('AUTO')
        return false
      }
      onFail?.()
      toast.error('Could not save your answer', {
        description: err instanceof Error ? err.message : 'Network error — please retry.',
      })
      return false
    }
  }, [attemptId, doSubmit])

  // ============ local answer state (optimistic, sync ref) ============
  const updateAnswerLocal = useCallback((qid: string, patch: Partial<LocalAnswer>): LocalAnswer => {
    const prev = answersRef.current[qid] ?? DEFAULT_ANSWER
    const next = { ...prev, ...patch }
    const map = { ...answersRef.current, [qid]: next }
    answersRef.current = map
    setAnswers(map)
    return prev
  }, [])

  const rollbackAnswer = useCallback((qid: string, prev: LocalAnswer) => {
    const map = { ...answersRef.current, [qid]: prev }
    answersRef.current = map
    setAnswers(map)
  }, [])

  // ============ per-question time tracking (client clamp [0,120]) ============
  const takeTimeDelta = useCallback((qid: string): number | undefined => {
    const d = pendingTimeRef.current.get(qid) ?? 0
    if (d <= 0) return undefined
    pendingTimeRef.current.set(qid, 0)
    return Math.min(120, Math.max(1, Math.round(d)))
  }, [])

  useEffect(() => {
    if (phase !== 'active') return
    const t = setInterval(() => {
      const q = questionsRef.current[indexRef.current]
      if (q) pendingTimeRef.current.set(q.id, (pendingTimeRef.current.get(q.id) ?? 0) + 1)
    }, 1000)
    return () => clearInterval(t)
  }, [phase])

  /** Send accumulated time + not-yet-sent visited flag for the current question. */
  const flushCurrent = useCallback(() => {
    const cur = questionsRef.current[indexRef.current]
    if (!cur) return
    const payload: Record<string, unknown> = {}
    const delta = takeTimeDelta(cur.id)
    if (delta != null) payload.timeDeltaSeconds = delta
    if (!visitedSentRef.current.has(cur.id)) {
      visitedSentRef.current.add(cur.id)
      payload.visited = true
    }
    if (Object.keys(payload).length > 0) void putUpdate(cur.id, payload)
  }, [putUpdate, takeTimeDelta])

  // flush accumulated time when the tab is hidden / minimized
  useEffect(() => {
    const h = () => { if (document.hidden && phaseRef.current === 'active') flushCurrent() }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [flushCurrent])

  // ============ navigation ============
  const showIndex = useCallback((next: number) => {
    const qs = questionsRef.current
    if (next < 0 || next >= qs.length || next === indexRef.current) return
    indexRef.current = next
    setIndex(next)
    const d = answersRef.current[qs[next].id]?.selectedAnswer ?? null
    draftRef.current = d
    setDraft(d)
    scrollRef.current?.scrollTo({ top: 0 })
  }, [])

  const goTo = useCallback((next: number) => {
    if (next === indexRef.current) return
    flushCurrent()
    showIndex(next)
  }, [flushCurrent, showIndex])

  // ============ actions ============
  const saveAndNext = useCallback(() => {
    const qs = questionsRef.current
    const q = qs[indexRef.current]
    if (!q) return
    const answer = draftRef.current
    if (q.section === 'B' && answer != null && !NUMERIC_RE.test(answer)) {
      toast.error('Enter a valid numerical answer before saving')
      return
    }
    const saved = answersRef.current[q.id]
    const payload: Record<string, unknown> = {}
    if (answer != null && answer !== (saved?.selectedAnswer ?? null)) payload.selectedAnswer = answer
    const delta = takeTimeDelta(q.id)
    if (delta != null) payload.timeDeltaSeconds = delta
    if (!visitedSentRef.current.has(q.id)) { visitedSentRef.current.add(q.id); payload.visited = true }

    if (Object.keys(payload).length > 0) {
      const prev = updateAnswerLocal(q.id, {
        ...(payload.selectedAnswer !== undefined ? { selectedAnswer: answer } : {}),
        ...(payload.visited ? { visited: true } : {}),
      })
      void putUpdate(q.id, payload, () => rollbackAnswer(q.id, prev))
    }
    if (indexRef.current < qs.length - 1) showIndex(indexRef.current + 1)
    else toast.success(answer != null ? 'Answer saved' : 'Nothing to save')
  }, [putUpdate, rollbackAnswer, showIndex, takeTimeDelta, updateAnswerLocal])

  const markAndNext = useCallback(() => {
    const qs = questionsRef.current
    const q = qs[indexRef.current]
    if (!q) return
    const answer = draftRef.current
    const validAnswer = q.section === 'B' && answer != null && !NUMERIC_RE.test(answer) ? null : answer
    const saved = answersRef.current[q.id]
    const payload: Record<string, unknown> = { markedForReview: true }
    if (validAnswer != null && validAnswer !== (saved?.selectedAnswer ?? null)) payload.selectedAnswer = validAnswer
    const delta = takeTimeDelta(q.id)
    if (delta != null) payload.timeDeltaSeconds = delta
    if (!visitedSentRef.current.has(q.id)) { visitedSentRef.current.add(q.id); payload.visited = true }

    const prev = updateAnswerLocal(q.id, {
      markedForReview: true,
      ...(payload.selectedAnswer !== undefined ? { selectedAnswer: validAnswer } : {}),
      ...(payload.visited ? { visited: true } : {}),
    })
    void putUpdate(q.id, payload, () => rollbackAnswer(q.id, prev))
    if (indexRef.current < qs.length - 1) showIndex(indexRef.current + 1)
  }, [putUpdate, rollbackAnswer, showIndex, takeTimeDelta, updateAnswerLocal])

  const clearResponse = useCallback(() => {
    const q = questionsRef.current[indexRef.current]
    if (!q) return
    const saved = answersRef.current[q.id]
    if (draftRef.current == null && (saved?.selectedAnswer ?? null) == null) {
      toast.info('Nothing to clear on this question')
      return
    }
    const payload: Record<string, unknown> = { selectedAnswer: null }
    const delta = takeTimeDelta(q.id)
    if (delta != null) payload.timeDeltaSeconds = delta
    if (!visitedSentRef.current.has(q.id)) { visitedSentRef.current.add(q.id); payload.visited = true }

    const prev = updateAnswerLocal(q.id, {
      selectedAnswer: null,
      ...(payload.visited ? { visited: true } : {}),
    })
    draftRef.current = null
    setDraft(null)
    void putUpdate(q.id, payload, () => rollbackAnswer(q.id, prev))
  }, [putUpdate, rollbackAnswer, takeTimeDelta, updateAnswerLocal])

  const onDraftChange = useCallback((v: string | null) => {
    draftRef.current = v
    setDraft(v)
  }, [])

  // ============ load / resume ============
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.get<{ attempt: AttemptFull }>(`/attempts/${attemptId}`)
        if (cancelled) return
        const a = res.attempt
        if (a.status === 'SUBMITTED') {
          toast.info(a.autoSubmitted
            ? 'Time expired — this attempt was already submitted'
            : 'This attempt is already submitted')
          navigate(`/result/${attemptId}`)
          return
        }
        const map: Record<string, LocalAnswer> = {}
        for (const ans of a.answers) {
          map[ans.questionId] = {
            selectedAnswer: ans.selectedAnswer,
            markedForReview: ans.markedForReview,
            visited: ans.visited,
          }
          if (ans.visited) visitedSentRef.current.add(ans.questionId)
        }
        for (const q of a.questions) if (!map[q.id]) map[q.id] = { ...DEFAULT_ANSWER }

        answersRef.current = map
        questionsRef.current = a.questions
        setAnswers(map)
        setAttempt(a)

        // server-authoritative clock: skew = serverNow − Date.now()
        const skew = new Date(a.serverNow).getTime() - Date.now()
        setEndAtMs(new Date(a.deadlineAt).getTime() - skew)

        // resume at first not-yet-visited question (fresh start → Q1)
        const firstUnvisited = a.questions.findIndex(q => !map[q.id]?.visited)
        const start = firstUnvisited >= 0 ? firstUnvisited : 0
        indexRef.current = start
        setIndex(start)
        const d = map[a.questions[start]?.id ?? '']?.selectedAnswer ?? null
        draftRef.current = d
        setDraft(d)
        setPhase('active')
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError) {
          if (err.status === 404) setError('Attempt not found. It may have been removed.')
          else if (err.status === 403) setError('This attempt belongs to a different account.')
          else if (err.status === 401) setError('Please sign in to continue this test.')
          else setError(err.message)
        } else {
          setError('Could not load this attempt. Check your connection and refresh the page.')
        }
        setPhase('error')
      }
    })()
    return () => { cancelled = true }
  }, [attemptId])

  // ============ mark visited on display (optimistic local + debounced PUT) ============
  useEffect(() => {
    if (phase !== 'active') return
    const q = questionsRef.current[index]
    if (!q) return
    if (!answersRef.current[q.id]?.visited) updateAnswerLocal(q.id, { visited: true })
    if (visitedSentRef.current.has(q.id)) return
    const t = setTimeout(() => {
      visitedSentRef.current.add(q.id)
      void putUpdate(q.id, { visited: true })
    }, 700)
    return () => clearTimeout(t)
  }, [index, phase, putUpdate, updateAnswerLocal])

  // ============ keyboard shortcuts: 1–4 / A–D select MCQ option, ? = help ============
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
      if (e.key === '?') {
        if (phaseRef.current !== 'active') return
        e.preventDefault()
        setHelpOpen(o => !o)
        return
      }
      if (e.key === 'Escape') { setHelpOpen(false); return }
      if (phaseRef.current !== 'active' || submitOpenRef.current) return
      const q = questionsRef.current[indexRef.current]
      if (!q || q.section !== 'A' || !q.options) return
      const k = e.key.toUpperCase()
      let idx = -1
      if (k >= '1' && k <= '4') idx = Number(k) - 1
      else if (k.length === 1 && 'ABCD'.includes(k)) idx = 'ABCD'.indexOf(k)
      if (idx < 0 || idx >= q.options.length) return
      e.preventDefault()
      const letter = 'ABCD'[idx]
      draftRef.current = letter
      setDraft(letter)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ============ beforeunload guard while test is in progress ============
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (phaseRef.current !== 'active') return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [])

  // ============ derived ============
  // groups carry firstOrder/lastOrder = actual question.order values (NTA numbering)
  const groups = useMemo(() => {
    const gs: Array<{ subject: Subject; label: string; start: number; end: number; firstOrder: number; lastOrder: number }> = []
    questions.forEach((q, i) => {
      const last = gs[gs.length - 1]
      if (last && last.subject === q.subject) { last.end = i; last.lastOrder = q.order }
      else gs.push({ subject: q.subject, label: SUBJECT_LABEL[q.subject], start: i, end: i, firstOrder: q.order, lastOrder: q.order })
    })
    return gs
  }, [questions])

  const activeGroup = groups.find(g => index >= g.start && index <= g.end)
  const counts = useMemo(
    () => paletteCounts(questions, answers),
    [questions, answers],
  )
  const savedAnswer = currentQ ? (answers[currentQ.id]?.selectedAnswer ?? null) : null
  const dirty = draft !== savedAnswer

  // ============ render ============
  if (!attemptId) {
    return <CbtErrorCard message="No attempt specified." />
  }

  if (phase === 'loading') {
    return (
      <div className="flex h-dvh flex-col bg-background" aria-busy="true" aria-label="Loading test">
        <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
          <div className="flex-1 space-y-2"><Skeleton className="h-5 w-52" /><Skeleton className="h-3.5 w-36" /></div>
          <Skeleton className="h-14 w-24 rounded-lg" />
        </div>
        <div className="mx-auto w-full max-w-3xl flex-1 space-y-4 p-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (phase === 'error') {
    return <CbtErrorCard message={error ?? 'Something went wrong.'} />
  }

  if (!attempt || !currentQ) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center bg-background p-6">
        <div className="card-glow w-full max-w-md rounded-2xl border bg-card p-8 text-center">
          <ListChecks className="mx-auto mb-3 size-10 text-primary" aria-hidden />
          <h1 className="mb-2 text-xl font-bold">No questions in this attempt</h1>
          <p className="mb-6 text-sm text-muted-foreground">This test has no questions attached yet.</p>
          <Button onClick={() => { void doSubmit('USER') }}>Submit test</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      {/* ---------- header ---------- */}
      <header className="z-30 shrink-0 border-b bg-card/85 backdrop-blur">
        <div className="flex items-center gap-2 px-3 py-2 sm:gap-4 sm:px-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-bold sm:text-base">{attempt.mock.title}</h1>
              <span className="hidden shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline">
                Mock #{attempt.mock.mockNumber}
              </span>
            </div>
            <p className="whitespace-nowrap text-xs text-muted-foreground" data-testid="question-progress">
              Question <span className="font-semibold text-foreground">{currentQ.order}</span> of {total}
              <span className="hidden sm:inline"> · {SUBJECT_LABEL[currentQ.subject]}</span>
            </p>
          </div>
          <CbtTimer endAtMs={endAtMs} onExpire={handleExpire} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSubmitOpen(true)}
            className="shrink-0 gap-1.5 border-wrong/50 text-wrong hover:bg-wrong/10 hover:text-wrong"
            aria-label="Submit test"
          >
            <CheckCheck className="size-4" aria-hidden />
            <span className="hidden md:inline">Submit test</span>
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* ---------- main column ---------- */}
        <main className="flex min-w-0 flex-1 flex-col">
          {/* subject tabs / mobile dropdown + palette toggle */}
          <div className="z-20 shrink-0 border-b bg-card/40">
            <div className="flex items-center gap-2 px-3 py-2 sm:px-5">
              <div className="sm:hidden">
                <Select
                  value={activeGroup?.subject ?? ''}
                  onValueChange={(v) => {
                    const g = groups.find(gr => gr.subject === v)
                    if (g) goTo(g.start)
                  }}
                >
                  <SelectTrigger size="sm" className="h-9 w-44" aria-label="Subject section">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map(g => (
                      <SelectItem key={g.subject} value={g.subject}>
                        {g.label} (Q{g.firstOrder}–{g.lastOrder})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div role="tablist" aria-label="Subject sections" className="hidden gap-1 sm:flex">
                {groups.map(g => {
                  const active = g.subject === activeGroup?.subject
                  return (
                    <button
                      key={g.subject}
                      role="tab"
                      aria-selected={active}
                      onClick={() => goTo(g.start)}
                      className={cn(
                        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground',
                      )}
                    >
                      {g.label}
                      <span className={cn('ml-1.5 text-xs', active ? 'opacity-80' : 'opacity-60')}>
                        Q{g.firstOrder}–{g.lastOrder}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="ml-auto lg:hidden">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPaletteOpen(true)}
                  className="h-9 gap-2"
                  aria-label={`Open question palette — ${counts.answered + counts.answeredMarked} of ${total} answered`}
                >
                  <LayoutGrid className="size-4" aria-hidden />
                  <span className="font-mono text-xs font-bold">
                    {counts.answered + counts.answeredMarked}/{total}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* question (scrollable) */}
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="mx-auto w-full max-w-3xl px-3 py-4 sm:px-6 sm:py-6">
              <p
                role="status"
                aria-live="polite"
                className={cn(
                  'mb-2 min-h-[18px] text-xs font-medium transition-opacity',
                  dirty ? 'text-gold-soft opacity-100' : 'opacity-0',
                )}
              >
                Unsaved selection — choose “Save &amp; Next” to store it.
              </p>
              <motion.div
                key={currentQ.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <QuestionPane
                  question={currentQ}
                  draft={draft}
                  markedForReview={!!answers[currentQ.id]?.markedForReview}
                  onDraftChange={onDraftChange}
                />
              </motion.div>
              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                Marks: +{currentQ.marksCorrect} for a correct answer, {currentQ.marksWrong} for an incorrect answer.
              </p>
            </div>
          </div>

          {/* controls (always-visible bottom bar) */}
          <div
            className="shrink-0 border-t bg-card/95 px-3 pt-2.5 backdrop-blur sm:px-6"
            style={{ paddingBottom: 'calc(0.625rem + env(safe-area-inset-bottom))' }}
          >
            <div className="mx-auto max-w-3xl">
              {/* mobile: two rows, big touch targets */}
              <div className="flex flex-col gap-2 sm:hidden">
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="h-11 px-2 text-xs" disabled={index === 0} onClick={() => goTo(index - 1)} aria-label="Previous question">
                    <ChevronLeft className="size-4" aria-hidden /> Prev
                  </Button>
                  <Button variant="ghost" className="h-11 border border-border px-2 text-xs" onClick={clearResponse} data-testid="clear-response">
                    <Eraser className="size-4" aria-hidden /> Clear
                  </Button>
                  <Button variant="outline" className="h-11 px-2 text-xs" disabled={index === total - 1} onClick={() => goTo(index + 1)} aria-label="Next question">
                    Next <ChevronRight className="size-4" aria-hidden />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" className="h-12 gap-1.5 px-2 text-xs font-semibold" onClick={markAndNext} data-testid="mark-next">
                    <BookmarkPlus className="size-4 shrink-0" aria-hidden /> Mark for Review &amp; Next
                  </Button>
                  <Button className="h-12 gap-1.5 px-2 text-sm font-bold" onClick={saveAndNext} data-testid="save-next">
                    <Save className="size-4 shrink-0" aria-hidden /> Save &amp; Next
                  </Button>
                </div>
              </div>
              {/* desktop: single row */}
              <div className="hidden gap-2 sm:flex">
                <Button variant="outline" className="h-10" disabled={index === 0} onClick={() => goTo(index - 1)}>
                  <ChevronLeft className="size-4" aria-hidden /> Previous
                </Button>
                <div className="flex-1" aria-hidden />
                <Button variant="secondary" className="h-10 font-medium" onClick={markAndNext} data-testid="mark-next">
                  <BookmarkPlus className="size-4" aria-hidden /> Mark for Review &amp; Next
                </Button>
                <Button variant="ghost" className="h-10 border border-border font-medium" onClick={clearResponse} data-testid="clear-response">
                  <Eraser className="size-4" aria-hidden /> Clear Response
                </Button>
                <Button className="h-10 gap-1.5 font-bold" onClick={saveAndNext} data-testid="save-next">
                  <Save className="size-4" aria-hidden /> Save &amp; Next
                </Button>
                <Button variant="outline" className="h-10" disabled={index === total - 1} onClick={() => goTo(index + 1)}>
                  Next <ChevronRight className="size-4" aria-hidden />
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* ---------- desktop palette sidebar ---------- */}
        <aside className="hidden w-[290px] shrink-0 flex-col border-l bg-card/40 lg:flex xl:w-[320px]" aria-label="Question palette sidebar">
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <ListChecks className="size-4 text-primary" aria-hidden /> Question Palette
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSubmitOpen(true)}
              className="border-wrong/50 text-wrong hover:bg-wrong/10 hover:text-wrong"
            >
              Submit
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <Palette questions={questions} answers={answers} currentIndex={index} onJump={goTo} />
            <PaletteLegend counts={counts} className="mx-4 pb-4" />
          </div>
        </aside>
      </div>

      {/* ---------- mobile / tablet palette sheet ---------- */}
      <Sheet open={paletteOpen} onOpenChange={setPaletteOpen}>
        <SheetContent
          side={isTablet ? 'right' : 'bottom'}
          className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-sm"
        >
          <SheetHeader className="border-b pb-3">
            <SheetTitle className="flex items-center gap-2 text-base">
              <ListChecks className="size-4 text-primary" aria-hidden /> Question Palette
            </SheetTitle>
            <SheetDescription className="sr-only">Jump to any question in this test</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <Palette
              questions={questions}
              answers={answers}
              currentIndex={index}
              onJump={(i) => { setPaletteOpen(false); goTo(i) }}
            />
          </div>
          <div className="border-t p-4 pt-3">
            <PaletteLegend counts={counts} className="mb-3 border-t-0 pt-0" />
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => { setPaletteOpen(false); setSubmitOpen(true) }}
            >
              <CheckCheck className="size-4" aria-hidden /> Submit test
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ---------- submit dialog ---------- */}
      <SubmitDialog
        open={submitOpen}
        onOpenChange={setSubmitOpen}
        counts={counts as Record<PaletteStatus, number>}
        totalQuestions={total}
        submitting={phase === 'submitting'}
        onSubmit={() => { void doSubmit('USER') }}
      />

      {/* ---------- keyboard shortcuts help (? key) ---------- */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-sm rounded-xl border-border bg-card p-0">
          <DialogHeader className="border-b border-border/70 px-5 py-4">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Keyboard className="size-4 text-primary" aria-hidden /> Keyboard shortcuts
            </DialogTitle>
            <DialogDescription className="sr-only">Available keyboard shortcuts during the test</DialogDescription>
          </DialogHeader>
          <div className="px-5 py-4">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Select an option (Section A)</span>
                <span className="flex gap-1"><Kbd>1</Kbd><Kbd>2</Kbd><Kbd>3</Kbd><Kbd>4</Kbd></span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Select an option (letters)</span>
                <span className="flex gap-1"><Kbd>A</Kbd><Kbd>B</Kbd><Kbd>C</Kbd><Kbd>D</Kbd></span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Open or close this help</span>
                <Kbd>?</Kbd>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Close a dialog</span>
                <Kbd>Esc</Kbd>
              </li>
            </ul>
            <p className="mt-4 rounded-lg bg-secondary/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
              Save with <span className="font-semibold text-foreground">Save &amp; Next</span> — an option
              stays a draft until you save it. Marked questions are still evaluated.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------- submitting overlay ---------- */}
      {phase === 'submitting' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/85 backdrop-blur-sm">
          <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
          <p className="text-lg font-bold">Submitting your test…</p>
          <p className="text-sm text-muted-foreground">Scoring your answers — one moment.</p>
        </div>
      )}
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border bg-secondary px-1.5 font-mono text-xs font-semibold text-foreground shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]">{children}</kbd>
}

function CbtErrorCard({ message }: { message: string }) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-background p-6">
      <div className="card-glow w-full max-w-md rounded-2xl border bg-card p-8 text-center">
        <AlertTriangle className="mx-auto mb-3 size-10 text-wrong" aria-hidden />
        <h1 className="mb-2 text-xl font-bold">Can&apos;t open this test</h1>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => navigate('/mocks')}>Back to mocks</Button>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    </div>
  )
}
