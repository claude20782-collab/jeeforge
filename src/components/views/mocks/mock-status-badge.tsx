'use client'
// Status badge for a mock, shared by mocks list / mock detail / landing schedule.

import { Badge } from '@/components/ui/badge'
import { CalendarClock, CheckCircle2, Lock, PlayCircle, Radio } from 'lucide-react'
import type { MockStateKind } from './hooks'
import { cn } from '@/lib/utils'

const CONFIG: Record<MockStateKind, {
  label: string
  className: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  'live': {
    label: 'Live now',
    icon: Radio,
    className: 'border-correct/40 bg-correct/15 text-correct',
  },
  'in-progress': {
    label: 'In progress',
    icon: PlayCircle,
    className: 'border-primary/40 bg-primary/15 text-primary',
  },
  'completed': {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'border-correct/30 bg-transparent text-correct',
  },
  'locked': {
    label: 'Locked',
    icon: Lock,
    className: 'border-border bg-muted text-muted-foreground',
  },
  'scheduled': {
    label: 'Scheduled',
    icon: CalendarClock,
    className: 'border-primary/30 bg-primary/5 text-primary/90',
  },
}

export function MockStatusBadge({ kind, className, withIcon = true }: { kind: MockStateKind; className?: string; withIcon?: boolean }) {
  const cfg = CONFIG[kind]
  const Icon = cfg.icon
  return (
    <Badge variant="outline" className={cn(cfg.className, className)}>
      {withIcon && <Icon className="h-3 w-3" aria-hidden />}
      {cfg.label}
    </Badge>
  )
}
