'use client'
// Shared chat UI primitives — agent F (T5-d): connection chip, day divider,
// unread separator, typing indicator, message row (hover actions, reply quote,
// read receipts), composer with mention autocomplete + Enter/Shift+Enter.
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { useChatStatus } from '@/components/chat/socket'
import { MessageContent } from '@/components/chat/message-content'
import { Avatar } from '@/components/app/avatar'
import { Button } from '@/components/ui/button'
import { Check, CheckCheck, Copy, CornerUpLeft, Flag, Loader2, Send, WifiOff } from 'lucide-react'
import type { ChatMessageDTO } from '@/lib/types'

// ---------------------------------------------------------------------------
export function ConnectionChip({ className }: { className?: string }) {
  const status = useChatStatus()
  if (status === 'connected') return null
  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground',
        className,
      )}
    >
      <WifiOff className="h-3 w-3 animate-pulse" aria-hidden />
      Connecting…
    </span>
  )
}

export function DayDivider({ label }: { label: string }) {
  return (
    <div className="my-3 flex items-center gap-3" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-border/70" />
      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="h-px flex-1 bg-border/70" />
    </div>
  )
}

export function UnreadSeparator() {
  return (
    <div className="my-3 flex items-center gap-3" role="separator" aria-label="New messages">
      <span className="h-px flex-1 bg-primary/50" />
      <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">New messages</span>
      <span className="h-px flex-1 bg-primary/50" />
    </div>
  )
}

export function TypingRow({ names }: { names: string[] }) {
  if (names.length === 0) return null
  const label = names.length === 1
    ? `${names[0]} is typing`
    : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : `${names.length} people are typing`
  return (
    <div className="flex items-center gap-1.5 px-1 py-1.5 text-xs text-muted-foreground" aria-live="polite">
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/70" style={{ animationDelay: `${i * 140}ms` }} />
        ))}
      </span>
      {label}…
    </div>
  )
}

export function OnlineDot({ online, className }: { online: boolean; className?: string }) {
  return (
    <span
      aria-label={online ? 'online' : 'offline'}
      title={online ? 'Online' : 'Offline'}
      className={cn('inline-block h-2.5 w-2.5 shrink-0 rounded-full border-2 border-background', online ? 'bg-emerald-500' : 'bg-muted-foreground/40', className)}
    />
  )
}

export function ReadTicks({ read }: { read: boolean }) {
  return read ? (
    <CheckCheck className="h-3.5 w-3.5 text-emerald-500" aria-label="Read" />
  ) : (
    <Check className="h-3.5 w-3.5 text-muted-foreground" aria-label="Sent" />
  )
}

// ---------------------------------------------------------------------------
export interface MessageRowProps {
  message: ChatMessageDTO
  mine: boolean
  showHeader: boolean
  /** DM only: render ✓/✓✓ on own messages */
  readReceipt?: boolean
  onReply?: (m: ChatMessageDTO) => void
  onReport?: (m: ChatMessageDTO) => void
}

export function MessageRow({ message, mine, showHeader, readReceipt, onReply, onReport }: MessageRowProps) {
  const senderName = message.sender.displayName || message.sender.username
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Could not copy')
    }
  }
  return (
    <div className={cn('group flex w-full gap-2', mine ? 'flex-row-reverse' : 'flex-row')}>
      <div className="w-8 shrink-0 self-end">
        {showHeader && !mine && (
          <Avatar username={message.sender.username} displayName={message.sender.displayName} avatarUrl={message.sender.avatarUrl} size={32} />
        )}
      </div>
      <div className={cn('flex min-w-0 max-w-[85%] flex-col gap-0.5 sm:max-w-[75%]', mine ? 'items-end' : 'items-start')}>
        {showHeader && (
          <div className={cn('flex items-baseline gap-2 px-1', mine && 'flex-row-reverse')}>
            <span className={cn('text-xs font-semibold', mine ? 'text-primary' : 'text-foreground/90')}>
              {mine ? 'You' : senderName}
            </span>
            <span className="text-[10px] text-muted-foreground">@{message.sender.username}</span>
          </div>
        )}
        <div className={cn('flex items-end gap-1', mine ? 'flex-row-reverse' : 'flex-row')}>
          <div
            className={cn(
              'rounded-2xl border px-3 py-2 shadow-sm',
              mine
                ? 'rounded-br-md border-primary/30 bg-primary/15'
                : 'rounded-bl-md border-border bg-card',
              message.deleted && 'border-dashed bg-muted/40',
            )}
          >
            {message.replyTo && (
              <div className={cn('mb-1.5 max-w-full overflow-hidden rounded-lg border-l-2 bg-background/60 py-1 pl-2 pr-2', mine ? 'border-primary/60' : 'border-border')}>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  <CornerUpLeft className="mr-1 inline h-3 w-3" aria-hidden />{message.replyTo.sender}
                </p>
                <p className="truncate text-xs text-muted-foreground/80">{message.replyTo.content}</p>
              </div>
            )}
            <MessageContent content={message.content} deleted={message.deleted} />
            <div className={cn('mt-0.5 flex items-center gap-1', mine ? 'justify-end' : 'justify-start')}>
              {mine && readReceipt && !message.deleted && <ReadTicks read={!!message.readAt} />}
              <span className="text-[10px] leading-none text-muted-foreground/70">
                {new Date(message.createdAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true })}
              </span>
            </div>
          </div>
          {!message.deleted && (
            <div className={cn(
              'flex shrink-0 items-center gap-0.5 pb-0.5 transition-opacity',
              'opacity-50 focus-within:opacity-100 md:opacity-0 md:group-hover:opacity-100',
            )}>
              {onReply && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" aria-label="Reply" onClick={() => onReply(message)}>
                  <CornerUpLeft className="h-3.5 w-3.5" aria-hidden />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" aria-label="Copy text" onClick={copy}>
                <Copy className="h-3.5 w-3.5" aria-hidden />
              </Button>
              {onReport && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" aria-label="Report message" onClick={() => onReport(message)}>
                  <Flag className="h-3.5 w-3.5" aria-hidden />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
export interface ChatInputProps {
  /** Send handler — resolve `true` when the message went through; `false` (or
   *  a throw) restores the draft in the composer so nothing typed is lost. */
  onSend: (content: string, replyToId: string | null) => boolean | void | Promise<boolean | void>
  replyTo: { id: string; sender: string; content: string } | null
  onCancelReply: () => void
  onTyping: () => void
  /** group members for @mention autocomplete (null disables — DMs) */
  members?: { username: string; displayName: string | null; avatarUrl: string | null }[] | null
  disabled?: boolean
  disabledHint?: string
  placeholder?: string
}

const MENTION_AT_CARET = /(?:^|[^a-z0-9_])@([a-z0-9_]*)$/i

export function ChatInput({
  onSend, replyTo, onCancelReply, onTyping, members, disabled, disabledHint, placeholder,
}: ChatInputProps) {
  const [value, setValue] = useState('')
  const [mention, setMention] = useState<{ start: number; query: string } | null>(null)
  const [mentionIdx, setMentionIdx] = useState(0)
  const [sending, setSending] = useState(false)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const myUsername = useAppStore((s) => s.user?.username)

  const candidates = useMemo(() => {
    if (!mention || !members || members.length === 0) return []
    const q = mention.query.toLowerCase()
    return members
      .filter((m) => m.username !== myUsername && m.username.toLowerCase().startsWith(q))
      .slice(0, 6)
  }, [mention, members, myUsername])

  useEffect(() => {
    // reset highlight index only when the mention context actually changes
    const t = setTimeout(() => setMentionIdx(0), 0)
    return () => clearTimeout(t)
  }, [mention?.query, mention?.start])

  const autoResize = () => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }

  const updateMention = (text: string, caret: number) => {
    const m = MENTION_AT_CARET.exec(text.slice(0, caret))
    if (m) setMention({ start: caret - m[1].length - 1, query: m[1] })
    else setMention(null)
  }

  const insertMention = (username: string) => {
    const el = taRef.current
    const caret = el?.selectionStart ?? value.length
    if (!mention) return
    const before = value.slice(0, mention.start)
    const after = value.slice(caret)
    const next = `${before}@${username} ${after}`
    setValue(next)
    setMention(null)
    const pos = before.length + username.length + 2
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(pos, pos)
      autoResize()
    })
  }

  const send = async () => {
    const content = value.trim()
    if (!content || sending) return
    setSending(true)
    setValue('')
    setMention(null)
    requestAnimationFrame(autoResize)
    let ok = true
    try {
      ok = (await onSend(content, replyTo?.id ?? null)) !== false
    } catch {
      ok = false
    }
    if (!ok) {
      // send failed — restore the draft so the user doesn't lose their text
      setValue(content)
      requestAnimationFrame(autoResize)
    }
    setSending(false)
    taRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mention && candidates.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setMentionIdx((i) => (i + 1) % candidates.length); return }
      if (e.key === 'ArrowUp') { e.preventDefault(); setMentionIdx((i) => (i - 1 + candidates.length) % candidates.length); return }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); insertMention(candidates[mentionIdx].username); return }
      if (e.key === 'Escape') { e.preventDefault(); setMention(null); return }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  return (
    <div className="relative">
      {mention && candidates.length > 0 && (
        <div
          role="listbox"
          aria-label="Mention a member"
          className="absolute bottom-full left-0 z-20 mb-2 w-60 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
        >
          {candidates.map((m, i) => (
            <button
              key={m.username}
              role="option"
              aria-selected={i === mentionIdx}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); insertMention(m.username) }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                i === mentionIdx ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60',
              )}
            >
              <Avatar username={m.username} displayName={m.displayName} avatarUrl={m.avatarUrl} size={22} />
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium">{m.displayName || m.username}</span>
                <span className="ml-1 text-xs text-muted-foreground">@{m.username}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {replyTo && (
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2">
          <CornerUpLeft className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-primary">Replying to {replyTo.sender}</p>
            <p className="truncate text-xs text-muted-foreground">{replyTo.content}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Cancel reply" onClick={() => { onCancelReply(); taRef.current?.focus() }}>
            ✕
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:border-primary/40">
        <textarea
          ref={taRef}
          value={value}
          rows={1}
          disabled={disabled}
          placeholder={disabled ? (disabledHint ?? 'Unavailable') : (placeholder ?? 'Write a message…')}
          aria-label="Message"
          className="max-h-[140px] min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed"
          onChange={(e) => {
            setValue(e.target.value.slice(0, 2000))
            autoResize()
            updateMention(e.target.value, e.target.selectionStart ?? e.target.value.length)
            onTyping()
          }}
          onKeyDown={handleKeyDown}
        />
        <Button
          size="icon"
          className="h-10 w-10 shrink-0 rounded-xl"
          aria-label="Send message"
          disabled={disabled || !value.trim() || sending}
          onClick={() => void send()}
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
        </Button>
      </div>
      <p className="mt-1 px-1 text-[10px] text-muted-foreground/60">
        Enter to send · Shift+Enter for a new line{members ? ' · @ to mention' : ''}
      </p>
    </div>
  )
}
