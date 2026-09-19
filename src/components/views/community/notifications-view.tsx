'use client'
// Notifications (#/notifications) — agent F. Day-grouped feed (Today/Yesterday/
// date) with type icons, unread highlighting, mark-read on click + navigation,
// "Mark all read", incremental client-side reveal ("Load more" — server caps
// the feed at the latest 50).
import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { navigate } from '@/lib/router'
import { useAppStore } from '@/lib/store'
import { fmtTime } from '@/lib/format'
import type { NotificationDTO } from '@/lib/types'
import { istDayKey, istDayLabel, qk } from '@/components/chat/use-chat'
import { useSocketEvent } from '@/components/chat/socket'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AtSign, Bell, BellOff, CheckCheck, Info, Megaphone, MessageCircle, ShieldAlert, Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPE_ICON = {
  GROUP_MESSAGE: Users,
  DIRECT_MESSAGE: MessageCircle,
  MENTION: AtSign,
  GROUP_ACTIVITY: Users,
  MOCK_ANNOUNCEMENT: Megaphone,
  SYSTEM: Info,
  REPORT_STATUS: ShieldAlert,
} as const

const PAGE = 15

export function NotificationsView() {
  const queryClient = useQueryClient()
  const setUnreadNotifications = useAppStore((s) => s.setUnreadNotifications)
  const bumpUnread = useAppStore((s) => s.bumpUnread)
  const [visible, setVisible] = useState(PAGE)

  const query = useQuery({
    queryKey: qk.notifications,
    queryFn: () => api.get<{ notifications: NotificationDTO[]; unreadCount: number }>('/notifications?limit=50'),
  })

  // live: new notifications land while the page is open
  useSocketEvent<NotificationDTO>('notification:new', () => {
    void queryClient.invalidateQueries({ queryKey: qk.notifications })
  })

  const notifications = query.data?.notifications ?? []

  const markRead = (ids: string[]) => {
    const now = new Date().toISOString()
    let flipped = 0
    queryClient.setQueryData<{ notifications: NotificationDTO[]; unreadCount: number }>(qk.notifications, (prev) => {
      if (!prev) return prev
      let changed = 0
      const next = prev.notifications.map((n) => {
        if (ids.includes(n.id) && !n.readAt) { changed++; return { ...n, readAt: now } }
        return n
      })
      flipped = changed
      return { notifications: next, unreadCount: Math.max(0, prev.unreadCount - changed) }
    })
    if (flipped > 0) bumpUnread(-flipped)
    api.post('/notifications/read', { ids }).catch(() => toast.error('Could not mark as read'))
  }

  const markAllRead = () => {
    queryClient.setQueryData<{ notifications: NotificationDTO[]; unreadCount: number }>(qk.notifications, (prev) => {
      if (!prev) return prev
      return {
        notifications: prev.notifications.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() })),
        unreadCount: 0,
      }
    })
    setUnreadNotifications(0)
    api.post('/notifications/read', { all: true }).catch(() => toast.error('Could not mark all as read'))
  }

  const open = (n: NotificationDTO) => {
    if (!n.readAt) markRead([n.id])
    if (n.link) navigate(n.link)
  }

  const shown = notifications.slice(0, visible)
  const unreadCount = query.data?.unreadCount ?? 0

  const groups = useMemo(() => {
    const out: { key: string; label: string; items: NotificationDTO[] }[] = []
    for (const n of shown) {
      const key = istDayKey(n.createdAt)
      const last = out[out.length - 1]
      if (last && last.key === key) last.items.push(n)
      else out.push({ key, label: istDayLabel(key, n.createdAt), items: [n] })
    }
    return out
  }, [shown])

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'You’re all caught up'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" aria-hidden /> Mark all read
          </Button>
        )}
      </header>

      {query.isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[68px] rounded-xl" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
          <BellOff className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" aria-hidden />
          <p className="font-medium">No notifications yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Mentions, group activity and mock announcements will show up here.
          </p>
        </div>
      ) : (
        <>
          {groups.map((g) => (
            <section key={g.key} aria-label={g.label} className="mb-6">
              <h2 className="mb-2.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g.label}</h2>
              <motion.ul
                className="space-y-2"
                initial="hidden" animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
              >
                {g.items.map((n) => {
                  const Icon = TYPE_ICON[n.type] ?? Bell
                  const unread = !n.readAt
                  return (
                    <motion.li key={n.id} variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}>
                      <button
                        type="button"
                        onClick={() => open(n)}
                        className={cn(
                          'flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors',
                          unread
                            ? 'border-primary/35 bg-primary/5 hover:bg-primary/10'
                            : 'border-border/70 bg-card/60 hover:bg-accent/40',
                          n.link && 'cursor-pointer',
                        )}
                        aria-label={`${unread ? 'Unread notification: ' : ''}${n.title}`}
                      >
                        <span className={cn(
                          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border',
                          unread ? 'border-primary/40 bg-primary/15 text-primary' : 'border-border bg-muted/60 text-muted-foreground',
                        )}>
                          <Icon className="h-4.5 w-4.5" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className={cn('truncate text-sm', unread ? 'font-semibold text-foreground' : 'font-medium text-foreground/85')}>
                              {n.title}
                            </span>
                            <span className="shrink-0 text-[11px] text-muted-foreground">{fmtTime(n.createdAt)}</span>
                          </span>
                          {n.body && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{n.body}</span>}
                        </span>
                        {unread && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-label="unread" />}
                      </button>
                    </motion.li>
                  )
                })}
              </motion.ul>
            </section>
          ))}

          {visible < notifications.length ? (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE)}>
                Load more
              </Button>
            </div>
          ) : notifications.length >= 50 ? (
            <p className="pt-2 text-center text-xs text-muted-foreground">
              Showing the latest 50 notifications — older entries are archived.
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
