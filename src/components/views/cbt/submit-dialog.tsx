'use client'
import { useState } from 'react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PaletteLegend, type PaletteStatus } from './palette'
import { AlertTriangle, ChevronLeft, Loader2, SendHorizonal } from 'lucide-react'

export interface SubmitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  counts: Record<PaletteStatus, number>
  totalQuestions: number
  submitting: boolean
  onSubmit: () => void
}

/** Two-step NTA-style submit confirmation with a live answer summary. */
export function SubmitDialog({ open, onOpenChange, counts, totalQuestions, submitting, onSubmit }: SubmitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!submitting) onOpenChange(o) }}>
      {/* keyed inner content: remounts on every open so the flow restarts at step 1 */}
      <DialogContent className="max-w-md">
        <SubmitFlow
          key={open ? 'open' : 'closed'}
          counts={counts}
          totalQuestions={totalQuestions}
          submitting={submitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

function SubmitFlow({
  counts, totalQuestions, submitting, onCancel, onSubmit,
}: Omit<SubmitDialogProps, 'open' | 'onOpenChange'> & { onCancel: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const attempted = counts.answered + counts.answeredMarked

  return step === 1 ? (
    <>
      <DialogHeader>
        <DialogTitle>Submit this test?</DialogTitle>
        <DialogDescription>
          Here is a summary of your attempt — {totalQuestions} questions in total.
        </DialogDescription>
      </DialogHeader>
      <PaletteLegend counts={counts} />
      <p className="flex items-start gap-2 rounded-lg border border-wrong/40 bg-wrong/10 p-3 text-sm text-wrong">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          You have attempted <strong>{attempted}</strong> of {totalQuestions} questions.
          Once submitted, <strong>you cannot return to this test</strong>.
        </span>
      </p>
      <DialogFooter className="flex-row gap-2 sm:justify-end">
        <Button variant="outline" onClick={onCancel} disabled={submitting}>Keep working</Button>
        <Button variant="destructive" onClick={() => setStep(2)}>Yes, submit</Button>
      </DialogFooter>
    </>
  ) : (
    <>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This is your final confirmation. Your answers will be evaluated and scored immediately.
        </DialogDescription>
      </DialogHeader>
      <p className="flex items-start gap-2 rounded-lg border border-wrong/40 bg-wrong/10 p-3 text-sm text-wrong">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>You cannot return to this test after submitting.</span>
      </p>
      <DialogFooter className="flex-row gap-2 sm:justify-end">
        <Button variant="ghost" onClick={() => setStep(1)} disabled={submitting}>
          <ChevronLeft className="size-4" aria-hidden /> Back
        </Button>
        <Button variant="destructive" onClick={onSubmit} disabled={submitting} data-testid="submit-final">
          {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <SendHorizonal className="size-4" aria-hidden />}
          {submitting ? 'Submitting…' : 'Submit test'}
        </Button>
      </DialogFooter>
    </>
  )
}
