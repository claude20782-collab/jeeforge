'use client'
// Chat message content — PLAIN TEXT only (contract: never render user chat as
// markdown/HTML; React escaping + whitespace-pre-wrap is the sanitization).
// @mentions are highlighted; deleted messages render as the moderator notice.
import { cn } from '@/lib/utils'

const MENTION_SPLIT = /(@[a-z0-9_]{3,20})/gi
const IS_MENTION = /^@[a-z0-9_]{3,20}$/i

export function MessageContent({ content, deleted, className }: {
  content: string
  deleted?: boolean
  className?: string
}) {
  if (deleted) {
    return <p className={cn('text-sm italic text-muted-foreground/60', className)}>message removed by moderator</p>
  }
  const parts = content.split(MENTION_SPLIT)
  return (
    <p className={cn('whitespace-pre-wrap break-words text-sm leading-relaxed', className)}>
      {parts.map((part, i) =>
        IS_MENTION.test(part) ? (
          <span key={i} className="font-semibold text-gold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  )
}
