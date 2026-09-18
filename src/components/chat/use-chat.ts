'use client'
// ============================================================================
// Shared chat hooks + utilities — agent F (T5-d).
// Used by GroupChatView + DmChatView (and their list views) so the two chat
// surfaces stay behaviourally identical: cursor pagination, dedupe appends,
// typing indicators, scroll behaviour, unread separator math, IST day dividers.
// ============================================================================
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { IST, fmtDateIST, fmtTime } from '@/lib/format'
import { useAppStore } from '@/lib/store'
import { emitSocket, useSocketEvent } from '@/components/chat/socket'
import type { ChatMessageDTO, NotificationDTO } from '@/lib/types'

// ---------------------------------------------------------------------------
// Query keys (shared with the list views for cross-invalidation)
// ---------------------------------------------------------------------------
export const qk = {
  groups: (filter: 'all' | 'mine') => ['groups', filter] as const,
  groupDetail: (id: string) => ['group-detail', id] as const,
  groupMessages: (id: string) => ['group-messages', id] as const,
  conversations: ['conversations'] as const,
  dmMessages: (id: string) => ['dm-messages', id] as const,
  blocks: ['blocks'] as const,
  notifications: ['notifications'] as const,
}

export interface MessagePage {
  messages: ChatMessageDTO[]
  hasMore: boolean
}

function sortMessages(list: ChatMessageDTO[]): ChatMessageDTO[] {
  return [...list].sort((a, b) => {
    const t = Date.parse(a.createdAt) - Date.parse(b.createdAt)
    return t !== 0 ? t : a.id.localeCompare(b.id)
  })
}

function mergeMessages(a: ChatMessageDTO[], b: ChatMessageDTO[]): ChatMessageDTO[] {
  const byId = new Map<string, ChatMessageDTO>()
  for (const m of a) byId.set(m.id, m)
  for (const m of b) byId.set(m.id, m)
  return sortMessages([...byId.values()])
}

function mergePages(prev: MessagePage | undefined, next: MessagePage): MessagePage {
  if (!prev) return next
  return {
    messages: mergeMessages(prev.messages, next.messages),
    hasMore: prev.hasMore || next.hasMore,
  }
}

// ---------------------------------------------------------------------------
// useChatMessages — page 1 via TanStack Query (merged on refetch so history is
// never lost), "Load older" pages + real-time appends merged into the same
// cache entry. Dedupe by message id (socket ack + broadcast can double-deliver).
// ---------------------------------------------------------------------------
export function useChatMessages(opts: {
  queryKey: QueryKey
  fetchPage: (before: string | null) => Promise<MessagePage>
  enabled?: boolean
  /** optional polling (e.g. DM read-receipt refresh) */
  refetchInterval?: number
}) {
  const queryKey = opts.queryKey
  const queryClient = useQueryClient()

  const query = useQuery<MessagePage>({
    queryKey,
    queryFn: async () => {
      const fresh = await opts.fetchPage(null)
      // merge with whatever we already have (appended older pages + live msgs)
      const prev = queryClient.getQueryData<MessagePage>(queryKey)
      if (prev) return mergePages(prev, fresh)
      return fresh
    },
    enabled: opts.enabled !== false,
    // always refetch on mount: every visit needs a fresh page so the
    // unread-separator snapshot + read-marking see current server truth
    staleTime: 0,
    ...(opts.refetchInterval ? { refetchInterval: opts.refetchInterval } : {}),
  })

  const [loadingOlder, setLoadingOlder] = useState(false)
  const messages = query.data?.messages ?? []
  const hasMore = query.data?.hasMore ?? false

  const loadOlder = useCallback(async () => {
    const data = queryClient.getQueryData<MessagePage>(queryKey)
    const oldest = data?.messages[0]
    if (!oldest || loadingOlder || !data?.hasMore) return
    setLoadingOlder(true)
    try {
      const page = await opts.fetchPage(oldest.createdAt)
      queryClient.setQueryData<MessagePage>(queryKey, (prev) => ({
        ...mergePages(prev, page),
        hasMore: page.hasMore,
      }))
    } finally {
      setLoadingOlder(false)
    }
  }, [queryKey, loadingOlder, queryClient])

  /** Append a (live or just-sent) message — dedupe by id. */
  const appendMessage = useCallback((m: ChatMessageDTO) => {
    queryClient.setQueryData<MessagePage>(queryKey, (prev) => {
      if (!prev) return { messages: [m], hasMore: false }
      if (prev.messages.some((x) => x.id === m.id)) return prev
      return { messages: mergeMessages(prev.messages, [m]), hasMore: prev.hasMore }
    })
  }, [queryKey, queryClient])

  return { messages, hasMore, loadingOlder, loadOlder, appendMessage, query }
}

// ---------------------------------------------------------------------------
// Unread separator math: unreadCount counts OTHERS' messages after my
// lastReadAt → walk the tail until that many other-messages are seen; the
// message where the count is reached is the first unread one.
// ---------------------------------------------------------------------------
export function firstUnreadMessageId(
  messages: ChatMessageDTO[],
  unreadCount: number,
  myUsername: string,
): string | null {
  if (unreadCount <= 0) return null
  let seen = 0
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].sender.username === myUsername) continue
    seen++
    if (seen === unreadCount) return messages[i].id
  }
  // more unread than loaded (hasMore) → fall back to the first loaded other-message
  return messages.find((m) => m.sender.username !== myUsername)?.id ?? null
}

// ---------------------------------------------------------------------------
// IST day keys + render-list builder (day dividers, sender grouping, separator)
// ---------------------------------------------------------------------------
const istDayFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: IST, year: 'numeric', month: '2-digit', day: '2-digit',
})

export function istDayKey(iso: string): string {
  return istDayFmt.format(new Date(iso))
}

function istDayLabel(key: string, iso: string): string {
  if (key === istDayFmt.format(new Date())) return 'Today'
  const yesterday = new Date(Date.now() - 86_400_000)
  if (key === istDayFmt.format(yesterday)) return 'Yesterday'
  return fmtDateIST(iso)
}
export { istDayLabel }

const GROUP_WINDOW_MS = 5 * 60 * 1000 // consecutive same-sender within 5 min → one run

export type ChatEntry<T> =
  | { kind: 'day'; key: string; label: string }
  | { kind: 'unread' }
  | { kind: 'msg'; msg: T; showHeader: boolean; time: string }

export function buildChatEntries<T extends { id: string; sender: { username: string }; createdAt: string }>(
  messages: T[],
  firstUnreadId: string | null,
): ChatEntry<T>[] {
  const entries: ChatEntry<T>[] = []
  let prev: T | null = null
  let prevDayKey = ''
  for (const msg of messages) {
    const key = istDayKey(msg.createdAt)
    if (key !== prevDayKey) {
      entries.push({ kind: 'day', key, label: istDayLabel(key, msg.createdAt) })
      prevDayKey = key
      prev = null
    }
    if (firstUnreadId && msg.id === firstUnreadId) entries.push({ kind: 'unread' })
    const newRun = !prev
      || prev.sender.username !== msg.sender.username
      || Date.parse(msg.createdAt) - Date.parse(prev.createdAt) > GROUP_WINDOW_MS
    entries.push({ kind: 'msg', msg, showHeader: newRun, time: fmtTime(msg.createdAt) })
    prev = msg
  }
  return entries
}

// ---------------------------------------------------------------------------
// Scroll behaviour: stick to bottom while the user is parked there; show a
// "New messages" chip when new content lands above the fold.
// ---------------------------------------------------------------------------
export function useChatScroll(messages: unknown[], scrollRef: React.RefObject<HTMLDivElement | null>) {
  const [unseen, setUnseen] = useState(0)
  const stickRef = useRef(true)
  const prevLenRef = useRef(0)

  const scrollToBottom = useCallback((smooth = false) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
  }, [scrollRef])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (messages.length > prevLenRef.current) {
      if (stickRef.current) {
        requestAnimationFrame(() => scrollToBottom(prevLenRef.current > 0))
      } else {
        setUnseen((u) => u + (messages.length - Math.max(prevLenRef.current, 0)))
      }
    } else if (stickRef.current) {
      requestAnimationFrame(() => scrollToBottom(false))
    }
    prevLenRef.current = messages.length
  }, [messages, scrollToBottom, scrollRef])

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight
    const near = dist < 140
    stickRef.current = near
    if (near) setUnseen(0)
  }, [scrollRef])

  /** Run an async action (Load older) while preserving the viewport position. */
  const withPreservedScroll = useCallback(async (action: () => Promise<void>) => {
    const el = scrollRef.current
    const prevHeight = el?.scrollHeight ?? 0
    const prevTop = el?.scrollTop ?? 0
    await action()
    requestAnimationFrame(() => {
      if (!el) return
      el.scrollTop = prevTop + (el.scrollHeight - prevHeight)
    })
  }, [scrollRef])

  return { onScroll, scrollToBottom, unseen, withPreservedScroll }
}

// ---------------------------------------------------------------------------
// Typing indicator: consume `typing` events for this scope, expire after 4s.
// ---------------------------------------------------------------------------
export function useTypingIndicator(
  kind: 'group' | 'dm',
  id: string,
  myUsername: string | undefined | null,
): string[] {
  const [typing, setTyping] = useState<Record<string, number>>({})
  useSocketEvent<{ username?: string; groupId?: string; conversationId?: string }>('typing', (p) => {
    if (!p || typeof p.username !== 'string' || p.username === myUsername) return
    if (kind === 'group' && p.groupId !== id) return
    if (kind === 'dm' && p.conversationId !== id) return
    setTyping((t) => ({ ...t, [p.username as string]: Date.now() + 4000 }))
  })
  useEffect(() => {
    const iv = setInterval(() => {
      setTyping((t) => {
        const now = Date.now()
        const next: Record<string, number> = {}
        let changed = false
        for (const [u, exp] of Object.entries(t)) {
          if (exp > now) next[u] = exp
          else changed = true
        }
        return changed ? next : t
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [])
  return useMemo(() => Object.keys(typing), [typing])
}

/** Throttled typing emit (server additionally throttles at ~3s). */
export function useTypingEmit(event: 'group:typing' | 'dm:typing', id: string) {
  const lastRef = useRef(0)
  return useCallback(() => {
    const now = Date.now()
    if (now - lastRef.current < 2500) return
    lastRef.current = now
    emitSocket(event, id)
  }, [event, id])
}

// ---------------------------------------------------------------------------
// Group room membership (presence + receiving broadcasts) — joins when the
// socket is connected, re-joins after every reconnect, leaves on unmount.
// ---------------------------------------------------------------------------
export function useGroupRoom(groupId: string, active: boolean) {
  const activeRef = useRef(active)
  useEffect(() => { activeRef.current = active }, [active])
  useEffect(() => {
    if (!active) return
    const join = () => emitSocket('group:join', groupId)
    join()
    return () => emitSocket('group:leave', groupId)
  }, [groupId, active])
  // re-join after a reconnect on the same socket instance
  useSocketEvent('connect', () => {
    if (activeRef.current) emitSocket('group:join', groupId)
  })
}

// ---------------------------------------------------------------------------
// Context notification hygiene: while the user is READING a chat, the server
// still creates GROUP_MESSAGE / MENTION / DIRECT_MESSAGE notifications for it.
// Mark those read (debounced) and resync the bell badge with server truth.
// ---------------------------------------------------------------------------
export function useContextNotificationsRead() {
  const queryClient = useQueryClient()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback((link: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      timerRef.current = null
      try {
        const res = await api.get<{ notifications: NotificationDTO[]; unreadCount: number }>(
          '/notifications?limit=50',
        )
        const ids = res.notifications.filter((n) => !n.readAt && n.link === link).map((n) => n.id)
        if (ids.length) await api.post('/notifications/read', { ids })
        const sync = await api.get<{ unreadCount: number }>('/notifications?unreadOnly=true&limit=1')
        useAppStore.getState().setUnreadNotifications(sync.unreadCount)
        void queryClient.invalidateQueries({ queryKey: qk.notifications })
      } catch {
        /* non-critical */
      }
    }, 1500)
  }, [queryClient])
}
