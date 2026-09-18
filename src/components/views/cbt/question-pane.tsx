'use client'
import { memo } from 'react'
import type { QuestionClient } from '@/lib/types'
import { Markdown } from '@/components/markdown'
import { QuestionDiagram } from '@/components/diagram'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Bookmark } from 'lucide-react'

const LETTERS = ['A', 'B', 'C', 'D'] as const

/** Same validation the backend applies to section B answers. */
export const NUMERIC_RE = /^-?\d{1,9}(\.\d{1,6})?$/

/** Memoized heavy part: markdown text + LaTeX + diagram. Never re-parses on draft changes. */
const QuestionBody = memo(function QuestionBody({ question }: { question: QuestionClient }) {
  return (
    <div className="min-w-0">
      <Markdown>{question.text}</Markdown>
      {question.diagram && <QuestionDiagram spec={question.diagram} className="max-w-full" />}
    </div>
  )
})

export interface QuestionPaneProps {
  question: QuestionClient
  draft: string | null
  markedForReview: boolean
  onDraftChange: (v: string | null) => void
}

export const QuestionPane = memo(function QuestionPane({
  question, draft, markedForReview, onDraftChange,
}: QuestionPaneProps) {
  const invalidNumeric = question.section === 'B' && draft != null && !NUMERIC_RE.test(draft)

  return (
    <article
      aria-label={`Question ${question.order}`}
      className="rounded-xl border bg-card/60 p-4 shadow-sm sm:p-6"
    >
      <header className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="text-lg font-bold sm:text-xl">Question {question.order}</h2>
        <Badge variant="secondary" className="font-medium">
          Section {question.section} · {question.section === 'A' ? 'MCQ' : 'Numerical'}
        </Badge>
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="rounded-md border border-correct/50 bg-correct/10 px-1.5 py-0.5 text-correct">
            +{question.marksCorrect}
          </span>
          <span className="rounded-md border border-wrong/50 bg-wrong/10 px-1.5 py-0.5 text-wrong">
            {question.marksWrong}
          </span>
        </span>
        {markedForReview && (
          <Badge className="gap-1 bg-palette-marked text-white hover:bg-palette-marked">
            <Bookmark className="size-3" aria-hidden /> Marked for Review
          </Badge>
        )}
      </header>

      <QuestionBody question={question} />

      {question.section === 'A' && question.options ? (
        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label={`Options for question ${question.order}`}>
          {question.options.map((opt, i) => {
            const letter = LETTERS[i]
            const selected = draft === letter
            return (
              <button
                key={letter}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onDraftChange(letter)}
                className={cn(
                  'flex min-h-[44px] w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[48px] sm:p-3.5',
                  selected
                    ? 'border-primary/70 bg-primary/10 ring-1 ring-primary/50'
                    : 'border-border bg-background/40 hover:border-muted-foreground/50 hover:bg-accent/40',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors',
                    selected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground',
                  )}
                >
                  {letter}
                </span>
                <div className="min-w-0 flex-1 text-[15px] leading-relaxed">
                  <Markdown>{opt}</Markdown>
                </div>
              </button>
            )
          })}
          <p className="hidden pt-1 text-xs text-muted-foreground lg:block">
            Tip: press <kbd className="rounded border bg-muted px-1 font-mono">1</kbd>–<kbd className="rounded border bg-muted px-1 font-mono">4</kbd> or <kbd className="rounded border bg-muted px-1 font-mono">A</kbd>–<kbd className="rounded border bg-muted px-1 font-mono">D</kbd> to select an option
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <label htmlFor="numeric-answer" className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            Answer:
            <input
              id="numeric-answer"
              data-testid="numeric-answer"
              className="numeric-answer h-11 w-40 rounded-lg border bg-background/60 px-3 font-mono text-base font-semibold shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring sm:w-48"
              style={{ appearance: 'textfield' }}
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={draft ?? ''}
              onChange={(e) => onDraftChange(e.target.value.trim() === '' ? null : e.target.value)}
              placeholder="—"
              aria-describedby="numeric-hint"
            />
          </label>
          <p
            id="numeric-hint"
            className={cn('mt-1.5 text-xs', invalidNumeric ? 'font-medium text-wrong' : 'text-muted-foreground')}
          >
            {invalidNumeric
              ? 'Enter a valid number — digits with optional decimal (e.g. 12.50)'
              : 'Type your numerical answer. Decimals are allowed.'}
          </p>
        </div>
      )}
    </article>
  )
})
