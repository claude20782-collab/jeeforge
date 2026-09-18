'use client'
import { useEffect, useRef, useState } from 'react'
import { Clock } from 'lucide-react'
import { fmtTimer } from '@/lib/format'
import { cn } from '@/lib/utils'

/**
 * CbtTimer — fully isolated countdown so its 1s tick never re-renders the rest
 * of the CBT interface. `endAtMs` is a local (skew-corrected) timestamp of the
 * server-authoritative deadline; every PUT answer response re-syncs it.
 */
export function CbtTimer({ endAtMs, onExpire }: { endAtMs: number; onExpire: () => void }) {
  const [now, setNow] = useState(() => Date.now())
  const onExpireRef = useRef(onExpire)
  const firedRef = useRef(false)

  // keep the latest callback without re-subscribing the tick interval
  useEffect(() => { onExpireRef.current = onExpire })

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const remaining = Math.max(0, Math.round((endAtMs - now) / 1000))

  useEffect(() => {
    if (remaining <= 0) {
      if (!firedRef.current) {
        firedRef.current = true
        onExpireRef.current()
      }
    } else {
      firedRef.current = false // re-arm if a server resync pushed the deadline out
    }
  }, [remaining])

  const danger = remaining > 0 && remaining <= 5 * 60

  return (
    <div
      role="timer"
      aria-label={`Time remaining: ${fmtTimer(remaining)}`}
      aria-live="off"
      className={cn(
        'flex flex-col items-center rounded-lg border px-3 py-1 tabular-nums sm:px-4',
        danger ? 'border-destructive/60 bg-destructive/10' : 'border-border bg-background/60',
      )}
    >
      <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <Clock className="size-3" aria-hidden /> Time Left
      </span>
      <span
        data-testid="cbt-timer"
        className={cn(
          'font-mono text-lg font-bold leading-tight sm:text-2xl',
          danger ? 'timer-danger text-destructive' : 'text-foreground',
        )}
      >
        {fmtTimer(remaining)}
      </span>
    </div>
  )
}
