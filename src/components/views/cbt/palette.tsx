'use client'
import { memo } from 'react'
import type { QuestionClient, Subject } from '@/lib/types'
import { SUBJECT_LABEL } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export interface PaletteAnswer {
  selectedAnswer: string | null
  markedForReview: boolean
  visited: boolean
}

export type PaletteStatus = 'answered' | 'notAnswered' | 'notVisited' | 'marked' | 'answeredMarked'

/** JEE CBT status rules (based on SAVED answers, not unsaved drafts). */
export function statusOf(a: PaletteAnswer | undefined): PaletteStatus {
  const sel = !!a?.selectedAnswer
  const mk = !!a?.markedForReview
  if (mk) return sel ? 'answeredMarked' : 'marked'
  if (sel) return 'answered'
  return a?.visited ? 'notAnswered' : 'notVisited'
}

export const STATUS_LABEL: Record<PaletteStatus, string> = {
  answered: 'Answered',
  notAnswered: 'Not Answered',
  notVisited: 'Not Visited',
  marked: 'Marked for Review',
  answeredMarked: 'Answered & Marked for Review (will be considered for evaluation)',
}

export const STATUS_STYLE: Record<PaletteStatus, string> = {
  answered: 'bg-palette-answered text-white rounded-md',
  notAnswered: 'bg-palette-not-answered text-white rounded-md',
  notVisited: 'bg-palette-not-visited text-white/90 rounded-md',
  marked: 'bg-palette-marked text-white rounded-full',
  answeredMarked: 'bg-palette-marked text-white rounded-full',
}

export function paletteCounts(questions: QuestionClient[], answers: Record<string, PaletteAnswer>): Record<PaletteStatus, number> {
  const c: Record<PaletteStatus, number> = { answered: 0, notAnswered: 0, notVisited: 0, marked: 0, answeredMarked: 0 }
  for (const q of questions) c[statusOf(answers[q.id])]++
  return c
}

interface PaletteChipProps {
  status: PaletteStatus
  label?: string
  count?: number
  className?: string
}

/** Small legend chip that mirrors the exact button styling of each status. */
export function PaletteChip({ status, label, count, className }: PaletteChipProps) {
  return (
    <span
      aria-hidden={count != null ? undefined : true}
      className={cn('inline-flex size-5 shrink-0 items-center justify-center text-[11px] font-bold text-white', STATUS_STYLE[status], className)}
    >
      {status === 'answeredMarked' && <Check className="size-3 text-white" strokeWidth={4} />}
      {count != null && (
        <span className="sr-only">{`${label ?? STATUS_LABEL[status]}: ${count}`}</span>
      )}
    </span>
  )
}

export function PaletteLegend({ counts, className }: { counts: Record<PaletteStatus, number>; className?: string }) {
  const items: PaletteStatus[] = ['answered', 'notAnswered', 'notVisited', 'marked']
  return (
    <div className={cn('space-y-2 border-t border-border/70 pt-3', className)}>
      {items.map((s) => (
        <div key={s} className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <PaletteChip status={s} />
          <span className="flex-1">{STATUS_LABEL[s]}</span>
          <span className="font-mono font-semibold text-foreground">{counts[s]}</span>
        </div>
      ))}
      <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
        <PaletteChip status="answeredMarked" />
        <span className="flex-1">{STATUS_LABEL.answeredMarked}</span>
        <span className="font-mono font-semibold text-foreground">{counts.answeredMarked}</span>
      </div>
    </div>
  )
}

export interface PaletteProps {
  questions: QuestionClient[]
  answers: Record<string, PaletteAnswer>
  currentIndex: number
  onJump: (index: number) => void
}

/** Question palette: numbered buttons grouped by subject, JEE-standard colors. */
export const Palette = memo(function Palette({ questions, answers, currentIndex, onJump }: PaletteProps) {
  const groups: Array<{ subject: Subject; items: Array<{ q: QuestionClient; index: number }> }> = []
  questions.forEach((q, index) => {
    const g = groups[groups.length - 1]
    if (g && g.subject === q.subject) g.items.push({ q, index })
    else groups.push({ subject: q.subject, items: [{ q, index }] })
  })

  return (
    <div className="p-4">
      {groups.map((g) => (
        <section key={g.subject} aria-label={`${SUBJECT_LABEL[g.subject]} questions`} className="mb-5 last:mb-0">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {SUBJECT_LABEL[g.subject]}
            <span className="ml-1.5 font-normal normal-case">
              (Q{g.items[0].q.order}–{g.items[g.items.length - 1].q.order})
            </span>
          </h3>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(2.5rem, 1fr))' }}
          >
            {g.items.map(({ q, index }) => {
              const st = statusOf(answers[q.id])
              const isCurrent = index === currentIndex
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onJump(index)}
                  aria-label={`Go to question ${q.order} — ${STATUS_LABEL[st]}`}
                  aria-current={isCurrent ? 'true' : undefined}
                  className={cn(
                    'relative flex h-11 items-center justify-center text-sm font-semibold text-white transition-[transform,opacity] hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-9',
                    STATUS_STYLE[st],
                    isCurrent && 'z-10 scale-110 ring-2 ring-gold ring-offset-2 ring-offset-background',
                  )}
                >
                  {q.order}
                  {st === 'answeredMarked' && (
                    <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-palette-answered text-white shadow">
                      <Check className="size-2.5" strokeWidth={4} aria-hidden />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
})
