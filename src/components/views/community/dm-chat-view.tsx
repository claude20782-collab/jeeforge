'use client'
// DM chat (#/dm/:conversationId) — agent F. Private conversation with bubbles
// (mine right, gold-tinted, ✓/✓✓ read receipts), typing indicator, real-time
// messages, block/unblock with disabled composer + banner, report user.
//
// NOTE on "online" status: the REST layer reports other.online=false statically
// (no global presence channel exists — presence:update covers group rooms
// only). We derive honest presence from live signals: typing events / incoming
// messages within the last 2 minutes → "Active now", otherwise "Offline".
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { api, ApiError } from '@/lib/api'
import { navigate } from '@/lib/router'
import { useAppStore } from '@/lib/store'
import type { ChatMessageDTO, ConversationDTO } from '@/lib/types'
import {
  buildChatEntries, qk, useChatMessages, useChatScroll,
  useContextNotificationsRead, useTypingEmit, useTypingIndicator,
} from '@/components/chat/use-chat'
import { emitSocket, emitSocketAck, useSocketEvent } from '@/components/chat/socket'
import { ChatInput, ConnectionChip, DayDivider, MessageRow, TypingRow, UnreadSeparator } from '@/components/chat/chat-ui'
import { ReportDialog } from '@/components/chat/report-dialog'
import { Avatar } from '@/components/app/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Ban, Flag, MoreVertical, ShieldOff } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACTIVE_WINDOW_MS = 2 * 60 * 1000

export function DmChatView({ conversationId }: { conversationId: string }) {
  const user = useAppStore((s) => s.user)
  const queryClient = useQueryClient()
  const markContextRead = useContextNotificationsRead()
  const dmLink = `#/dm/${conversationId}`

  // ---- conversation identity (from the conversations list) ----
  const convsQuery = useQuery({
    queryKey: qk.conversations,
    queryFn: () => api.get<{ conversations: ConversationDTO[] }>('/conversations'),
    refetchInterval: 45_000,
  })
  const conversation = convsQuery.data?.conversations.find((c) => c.id === conversationId) ?? null
  const other = conversation?.other ?? null

  // ---- my blocks ----
  const blocksQuery = useQuery({
    queryKey: qk.blocks,
    queryFn: () => api.get<{ blocked: { username: string; since: string }[] }>('/blocks'),
  })
  const blockedByMe = !!(other && blocksQuery.data?.blocked.some((b) => b.username === other.username))
  const [sendBlocked, setSendBlocked] = useState(false) // 403 from server (either direction)

  // ---- messages ----
  const chat = useChatMessages({
    queryKey: qk.dmMessages(conversationId),
    enabled: !!conversation,
    fetchPage: async (before) => {
      const qs = before ? `?before=${encodeURIComponent(before)}` : ''
      return api.get<{ messages: ChatMessageDTO[]; hasMore: boolean }>(`/conversations/${conversationId}/messages${qs}`)
    },
    refetchInterval: 20_000, // read receipts / partner activity
  })
  const { messages, hasMore, loadingOlder, loadOlder, appendMessage } = chat

  // Unread separator — snapshotted ONCE PER VISIT from the first FRESH page
  // (DM messages carry readAt, so the first unread = oldest incoming message
  // the viewer hasn't read). Live appends never move the divider.
  const [separatorId, setSeparatorId] = useState<string | null>(null)
  const visitedAtRef = useRef(Date.now())
  const snapshottedRef = useRef(false)
  useEffect(() => {
    visitedAtRef.current = Date.now()
    snapshottedRef.current = false
    setSeparatorId(null)
  }, [conversationId])
  useEffect(() => {
    if (snapshottedRef.current || !user) return
    if (!chat.query.isSuccess || chat.query.dataUpdatedAt < visitedAtRef.current) return
    snapshottedRef.current = true
    const firstUnread = messages.find(
      (m) => m.sender.username !== user.username && !m.readAt && !m.deleted,
    )
    setSeparatorId(firstUnread?.id ?? null)
  }, [user, messages, chat.query.isSuccess, chat.query.dataUpdatedAt])

  // ---- derived presence ----
  const [lastActiveAt, setLastActiveAt] = useState<number | null>(null)
  const otherActive = lastActiveAt !== null && Date.now() - lastActiveAt < ACTIVE_WINDOW_MS
  // keep the activity flag fresh (re-render check every 30s)
  const [, setTick] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 30_000)
    return () => clearInterval(iv)
  }, [])

  // ---- real-time ----
  useSocketEvent<ChatMessageDTO & { conversationId: string }>('dm:message:new', (m) => {
    if (!m || m.conversationId !== conversationId) return
    appendMessage(m)
    void queryClient.invalidateQueries({ queryKey: qk.conversations })
    if (m.sender.username !== user?.username) {
      setLastActiveAt(Date.now())
      emitSocket('dm:read', conversationId)
      markContextRead(dmLink)
    }
  })
  const typingNames = useTypingIndicator('dm', conversationId, user?.username)
  useEffect(() => {
    if (typingNames.length > 0) setLastActiveAt(Date.now())
  }, [typingNames])
  const onTyping = useTypingEmit('dm:typing', conversationId)

  // mark read on entry — ONLY after a fresh messages page has landed this
  // visit (an earlier read write would set readAt and hide the separator)
  useEffect(() => {
    if (!other || !chat.query.isFetchedAfterMount) return
    markContextRead(dmLink)
    if (!emitSocket('dm:read', conversationId)) {
      api.post(`/conversations/${conversationId}/read`).catch(() => {})
    }
  }, [conversationId, !!other, chat.query.isFetchedAfterMount])

  // ---- composer ----
  // NOTE: no reply affordance in DMs — neither dm:send nor the REST endpoint
  // accepts replyToId, so a "replying to" preview would silently send without
  // the quote. Group chat supports replies end-to-end.
  const [reportMessage, setReportMessage] = useState<ChatMessageDTO | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const reportOpenRef = useRef(false)
  useEffect(() => { reportOpenRef.current = reportOpen }, [reportOpen])

  const sendMessage = async (content: string) => {
    const ack = await emitSocketAck<{ ok: boolean; message?: ChatMessageDTO; error?: string }>(
      'dm:send', conversationId, content,
    )
    if (ack?.ok && ack.message) {
      appendMessage(ack.message)
      void queryClient.invalidateQueries({ queryKey: qk.conversations })
      return
    }
    if (ack && !ack.ok) {
      if (ack.error?.includes('cannot send')) setSendBlocked(true)
      toast.error(ack.error ?? 'Message rejected')
      return
    }
    // REST fallback
    try {
      const res = await api.post<{ message: ChatMessageDTO }>(`/conversations/${conversationId}/messages`, { content })
      appendMessage(res.message)
      void queryClient.invalidateQueries({ queryKey: qk.conversations })
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) {
        setSendBlocked(true)
        toast.error('You can no longer message this user')
      } else {
        toast.error(e instanceof ApiError ? e.message : 'Could not send the message')
      }
    }
  }

  // ---- block / unblock ----
  const blockMut = useMutation({
    mutationFn: () => api.post('/blocks', { username: other!.username }),
    onSuccess: () => {
      toast.success(`Blocked @${other!.username}`, { description: 'They can no longer message you.' })
      void queryClient.invalidateQueries({ queryKey: qk.blocks })
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not block'),
  })
  const unblockMut = useMutation({
    mutationFn: () => api.del('/blocks', { username: other!.username }),
    onSuccess: () => {
      toast.success(`Unblocked @${other!.username}`)
      setSendBlocked(false)
      void queryClient.invalidateQueries({ queryKey: qk.blocks })
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not unblock'),
  })

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const scroll = useChatScroll(messages, scrollRef)
  const entries = useMemo(() => buildChatEntries(messages, separatorId ?? null), [messages, separatorId])
  const inputDisabled = blockedByMe || sendBlocked

  // ---- states ----
  if (convsQuery.isError) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="font-semibold">Couldn&apos;t load this conversation</p>
          <Button variant="outline" size="sm" onClick={() => void convsQuery.refetch()}>Retry</Button>
        </div>
      </Shell>
    )
  }
  if (!convsQuery.isLoading && !conversation) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="font-semibold">Conversation not found</p>
          <p className="text-sm text-muted-foreground">It may have been removed, or you lack access.</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/dm')}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to messages
          </Button>
        </div>
      </Shell>
    )
  }
  if (!other || !conversation) {
    return (
      <Shell>
        <div className="flex items-center gap-3 border-b border-border/70 p-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div>
        </div>
        <div className="flex-1 space-y-4 p-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 max-w-[60%] rounded-2xl" />)}
        </div>
      </Shell>
    )
  }

  const otherName = other.displayName || other.username

  return (
    <Shell>
      {/* ---------- header ---------- */}
      <header className="flex items-center gap-2.5 border-b border-border/70 bg-background/90 px-3 py-2.5 backdrop-blur sm:px-4">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="Back to messages" onClick={() => navigate('/dm')}>
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Button>
        <button
          type="button"
          onClick={() => navigate(`/profile/${other.username}`)}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1 text-left transition hover:bg-accent/50"
          aria-label={`View ${otherName}'s profile`}
        >
          <Avatar username={other.username} displayName={other.displayName} avatarUrl={other.avatarUrl} size={36} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold sm:text-base">{otherName}</span>
            <span className={cn('flex items-center gap-1.5 text-xs', otherActive ? 'text-emerald-500' : 'text-muted-foreground')}>
              <span className={cn('h-2 w-2 rounded-full', otherActive ? 'bg-emerald-500' : 'bg-muted-foreground/40')} aria-hidden />
              {otherActive ? 'Active now' : 'Offline'}
            </span>
          </span>
        </button>
        <ConnectionChip className="mr-1 hidden sm:inline-flex" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="Conversation options">
              <MoreVertical className="h-5 w-5" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Chat with @{other.username}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate(`/profile/${other.username}`)}>
              <Avatar username={other.username} displayName={other.displayName} avatarUrl={other.avatarUrl} size={16} className="mr-2" />
              View profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <ReportDialog
              target={{ targetType: 'USER', targetUsername: other.username, what: `@${other.username}` }}
              trigger={
                <DropdownMenuItem onSelect={(e) => { e.preventDefault() }} className="text-destructive focus:text-destructive">
                  <Flag className="mr-2 h-4 w-4" aria-hidden /> Report user
                </DropdownMenuItem>
              }
            />
            {!blockedByMe ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                    <Ban className="mr-2 h-4 w-4" aria-hidden /> Block user
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Block @{other.username}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will stop receiving messages from them, and neither of you can message the other until you unblock.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => blockMut.mutate()} className="bg-destructive text-white hover:bg-destructive/90">
                      Block
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <DropdownMenuItem onClick={() => unblockMut.mutate()} disabled={unblockMut.isPending}>
                <ShieldOff className="mr-2 h-4 w-4" aria-hidden /> Unblock user
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* ---------- messages ---------- */}
      <div className="relative min-h-0 flex-1">
        <div ref={scrollRef} onScroll={scroll.onScroll} className="h-full overflow-y-auto px-3 py-4 sm:px-4" aria-label="Direct messages">
          {hasMore && (
            <div className="mb-3 flex justify-center">
              <Button variant="outline" size="sm" disabled={loadingOlder} onClick={() => void scroll.withPreservedScroll(loadOlder)}>
                {loadingOlder ? 'Loading…' : 'Load older messages'}
              </Button>
            </div>
          )}

          {chat.query.isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 max-w-[60%] rounded-2xl" />)}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <Avatar username={other.username} displayName={other.displayName} avatarUrl={other.avatarUrl} size={56} />
              <p className="mt-2 font-medium">This is the start of your conversation with {otherName}</p>
              <p className="text-sm text-muted-foreground">Say hello — messages are private between you two.</p>
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-1.5">
              {entries.map((entry, i) => {
                if (entry.kind === 'day') return <DayDivider key={`day-${entry.key}-${i}`} label={entry.label} />
                if (entry.kind === 'unread') return <UnreadSeparator key={`unread-${i}`} />
                return (
                  <motion.div
                    key={entry.msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <MessageRow
                      message={entry.msg}
                      mine={entry.msg.sender.username === user?.username}
                      showHeader={entry.showHeader}
                      readReceipt
                      onReport={(m) => { setReportMessage(m); setReportOpen(true) }}
                    />
                  </motion.div>
                )
              })}
              <TypingRow names={typingNames} />
            </div>
          )}
        </div>

        {scroll.unseen > 0 && (
          <Button size="sm" className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 shadow-lg" onClick={() => scroll.scrollToBottom(true)}>
            New messages ↓
          </Button>
        )}
      </div>

      {/* ---------- composer ---------- */}
      <div className="border-t border-border/70 bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-4">
        <div className="mx-auto max-w-3xl">
          {blockedByMe ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <p className="text-sm text-amber-200">
                You blocked <span className="font-semibold">@{other.username}</span> — messaging is disabled.
              </p>
              <Button size="sm" variant="outline" disabled={unblockMut.isPending} onClick={() => unblockMut.mutate()}>
                <ShieldOff className="h-4 w-4" aria-hidden /> Unblock
              </Button>
            </div>
          ) : sendBlocked ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">
                You can no longer message <span className="font-semibold">@{other.username}</span> (blocking is in effect).
              </p>
            </div>
          ) : (
            <ChatInput
              onSend={sendMessage}
              replyTo={null}
              onCancelReply={() => {}}
              onTyping={onTyping}
              placeholder={`Message @${other.username}…`}
            />
          )}
        </div>
      </div>

      {/* controlled report dialog for message reports */}
      {reportMessage && (
        <ReportDialog
          open={reportOpen}
          onOpenChange={(o) => {
            setReportOpen(o)
            if (!o) setTimeout(() => { if (!reportOpenRef.current) setReportMessage(null) }, 300)
          }}
          target={{ targetType: 'DIRECT_MESSAGE', targetMessageId: reportMessage.id, what: 'this message' }}
        />
      )}
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-4xl flex-col overflow-hidden sm:rounded-t-2xl sm:border-x sm:border-t sm:border-border/60">
      {children}
    </div>
  )
}
