'use client'
// Group chat (#/group/:id) — agent F. Real-time group messaging: header with
// member popover (live online dots), mute/leave/report actions, message list
// (sender grouping, reply quotes, moderator-deleted notices, unread separator,
// day dividers, Load-older pagination), composer with @mention autocomplete,
// typing indicator. Socket-first sends with REST fallback.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { api, ApiError } from '@/lib/api'
import { navigate } from '@/lib/router'
import { useAppStore } from '@/lib/store'
import type { ChatMessageDTO, GroupDTO, GroupMemberDTO } from '@/lib/types'
import {
  buildChatEntries, firstUnreadMessageId, qk, useChatMessages, useChatScroll,
  useContextNotificationsRead, useGroupRoom, useTypingEmit, useTypingIndicator,
} from '@/components/chat/use-chat'
import { emitSocket, emitSocketAck, useSocketEvent } from '@/components/chat/socket'
import { ChatInput, ConnectionChip, DayDivider, MessageRow, TypingRow, UnreadSeparator, OnlineDot } from '@/components/chat/chat-ui'
import { ReportDialog } from '@/components/chat/report-dialog'
import { Avatar } from '@/components/app/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  ArrowLeft, BellOff, BellRing, Crown, Flag, Lock, LogOut, MoreHorizontal, Shield, UserPlus, Users,
} from 'lucide-react'

export function GroupChatView({ groupId }: { groupId: string }) {
  const user = useAppStore((s) => s.user)
  const queryClient = useQueryClient()
  const markContextRead = useContextNotificationsRead()
  const groupLink = `#/group/${groupId}`

  // ---- group detail (also gates the message list: members only) ----
  const detailQuery = useQuery({
    queryKey: qk.groupDetail(groupId),
    queryFn: () => api.get<{ group: GroupDTO; members: GroupMemberDTO[] }>(`/groups/${groupId}`),
    retry: (count, err) => !(err instanceof ApiError && (err.status === 403 || err.status === 404)) && count < 2,
  })
  const group = detailQuery.data?.group
  const members = detailQuery.data?.members ?? []
  const isMember = group?.joined ?? false

  // ---- live presence ----
  const [online, setOnline] = useState<Set<string>>(() => new Set())
  useSocketEvent<{ onlineUsernames: string[] }>('presence:update', (p) => {
    setOnline(new Set(p?.onlineUsernames ?? []))
  })
  useGroupRoom(groupId, isMember)

  // ---- messages ----
  const chat = useChatMessages({
    queryKey: qk.groupMessages(groupId),
    enabled: isMember,
    fetchPage: async (before) => {
      const qs = before ? `?before=${encodeURIComponent(before)}` : ''
      return api.get<{ messages: ChatMessageDTO[]; hasMore: boolean }>(`/groups/${groupId}/messages${qs}`)
    },
  })
  const { messages, hasMore, loadingOlder, loadOlder, appendMessage } = chat

  // Unread separator — snapshotted ONCE PER VISIT from the first FRESH page +
  // fresh group detail (stale cache is skipped via dataUpdatedAt). Live
  // appends and refetches afterwards never move the divider.
  const [separatorId, setSeparatorId] = useState<string | null>(null)
  const visitedAtRef = useRef(Date.now())
  const snapshottedRef = useRef(false)
  useEffect(() => {
    visitedAtRef.current = Date.now()
    snapshottedRef.current = false
    setSeparatorId(null)
  }, [groupId])
  useEffect(() => {
    if (snapshottedRef.current || !user || !group) return
    if (!chat.query.isSuccess || !detailQuery.isSuccess) return
    if (chat.query.dataUpdatedAt < visitedAtRef.current || detailQuery.dataUpdatedAt < visitedAtRef.current) return
    snapshottedRef.current = true
    setSeparatorId(firstUnreadMessageId(messages, group.unreadCount, user.username))
  }, [user, group, messages, chat.query.isSuccess, chat.query.dataUpdatedAt, detailQuery.isSuccess, detailQuery.dataUpdatedAt])

  // ---- real-time ----
  useSocketEvent<ChatMessageDTO>('group:message:new', (m) => {
    if (!m || m.groupId !== groupId) return
    appendMessage(m)
    if (m.sender.username !== user?.username) {
      emitSocket('group:read', groupId)
      markContextRead(groupLink)
    }
  })

  // mark read on entry (badge hygiene) — ONLY after the group detail has been
  // fetched this visit: emitting group:read earlier would race the detail GET
  // and zero unreadCount before the separator snapshot is taken
  useEffect(() => {
    if (!isMember || !detailQuery.isFetchedAfterMount) return
    emitSocket('group:read', groupId)
    markContextRead(groupLink)
  }, [groupId, isMember, detailQuery.isFetchedAfterMount])

  const typingNames = useTypingIndicator('group', groupId, user?.username)
  const onTyping = useTypingEmit('group:typing', groupId)

  // ---- composer ----
  const [replyTo, setReplyTo] = useState<{ id: string; sender: string; content: string } | null>(null)
  const [reportMessage, setReportMessage] = useState<ChatMessageDTO | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const reportOpenRef = useRef(false)
  useEffect(() => { reportOpenRef.current = reportOpen }, [reportOpen])
  const openReport = (m: ChatMessageDTO) => {
    setReportMessage(m)
    setReportOpen(true)
  }

  const sendMessage = async (content: string, replyToId: string | null): Promise<boolean> => {
    const ack = await emitSocketAck<{ ok: boolean; message?: ChatMessageDTO; error?: string }>(
      'group:message', groupId, content, replyToId ?? undefined,
    )
    if (ack?.ok && ack.message) {
      appendMessage(ack.message)
      setReplyTo(null)
      return true
    }
    if (ack && !ack.ok) {
      toast.error(ack.error ?? 'Message rejected')
      return false
    }
    // socket unavailable → REST fallback (server broadcasts to other members)
    try {
      const res = await api.post<{ message: ChatMessageDTO }>(`/groups/${groupId}/messages`, {
        content, replyToId: replyToId ?? undefined,
      })
      appendMessage(res.message)
      setReplyTo(null)
      return true
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not send the message')
      return false
    }
  }

  // ---- group actions ----
  const muteMut = useMutation({
    mutationFn: (muted: boolean) => api.post(`/groups/${groupId}/mute`, { muted }),
    onSuccess: (_d, muted) => {
      toast.success(muted ? 'Group muted — no more group notifications' : 'Group unmuted')
      void queryClient.invalidateQueries({ queryKey: ['group-detail', groupId] })
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
    onError: () => toast.error('Could not update mute setting'),
  })
  const leaveMut = useMutation({
    mutationFn: () => api.post(`/groups/${groupId}/leave`),
    onSuccess: () => {
      toast.success('Left the group')
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
      navigate('/community')
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not leave'),
  })
  const joinMut = useMutation({
    mutationFn: () => api.post(`/groups/${groupId}/join`),
    onSuccess: () => {
      toast.success('Joined the group')
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
      void detailQuery.refetch()
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not join'),
  })

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const scroll = useChatScroll(messages, scrollRef)
  const entries = useMemo(() => buildChatEntries(messages, separatorId ?? null), [messages, separatorId])
  const onlineCount = useMemo(
    () => members.filter((m) => online.has(m.username)).length,
    [members, online],
  )

  // ---- states ----
  if (detailQuery.isError) {
    const err = detailQuery.error as ApiError
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          {err.status === 404 ? (
            <>
              <Lock className="h-10 w-10 text-muted-foreground/50" aria-hidden />
              <p className="font-semibold">Group not found</p>
              <p className="text-sm text-muted-foreground">This group may have been deleted.</p>
            </>
          ) : (
            <>
              <Lock className="h-10 w-10 text-muted-foreground/50" aria-hidden />
              <p className="font-semibold">This group is private</p>
              <p className="text-sm text-muted-foreground">Only members can see this group.</p>
            </>
          )}
          <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/community')}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to Community
          </Button>
        </div>
      </Shell>
    )
  }
  if (!group) {
    return (
      <Shell>
        <div className="flex items-center gap-3 border-b border-border/70 p-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-24" /></div>
        </div>
        <div className="flex-1 space-y-4 p-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 max-w-[70%] rounded-2xl" />)}
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      {/* ---------- header ---------- */}
      <header className="flex items-center gap-2 border-b border-border/70 bg-background/90 px-3 py-2.5 backdrop-blur sm:px-4">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="Back to community" onClick={() => navigate('/community')}>
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-bold sm:text-base">
            {group.isPrivate && <Lock className="mr-1 inline h-3.5 w-3.5 text-muted-foreground" aria-hidden />}
            {group.name}
          </h1>
          <p className="truncate text-xs text-muted-foreground">
            {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
            {onlineCount > 0 && <> · {onlineCount} online</>}
          </p>
        </div>
        <ConnectionChip className="mr-1 hidden sm:inline-flex" />

        {/* members popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0" aria-label={`Members (${group.memberCount})`}>
              <Users className="h-4 w-4" aria-hidden />
              <span className="ml-1 hidden sm:inline">Members</span>
              <span className="ml-1 tabular-nums">{group.memberCount}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-0">
            <p className="border-b border-border/70 px-4 py-2.5 text-sm font-semibold">Members</p>
            <ScrollArea className="max-h-72">
              <ul className="p-1.5">
                {members.map((m) => (
                  <li key={m.username}>
                    <button
                      type="button"
                      onClick={() => navigate(`/profile/${m.username}`)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-accent"
                    >
                      <span className="relative">
                        <Avatar username={m.username} displayName={m.displayName} avatarUrl={m.avatarUrl} size={32} />
                        <OnlineDot online={online.has(m.username)} className="absolute -bottom-0.5 -right-0.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{m.displayName || m.username}</span>
                        <span className="block truncate text-xs text-muted-foreground">@{m.username}</span>
                      </span>
                      {m.role !== 'MEMBER' && (
                        <Badge variant="secondary" className="gap-1 shrink-0 text-[10px]">
                          {m.role === 'OWNER' ? <Crown className="h-3 w-3 text-gold" aria-hidden /> : <Shield className="h-3 w-3" aria-hidden />}
                          {m.role === 'OWNER' ? 'Owner' : 'Mod'}
                        </Badge>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="Group options">
              <MoreHorizontal className="h-5 w-5" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Group options</DropdownMenuLabel>
            {isMember && (
              <DropdownMenuItem onClick={() => muteMut.mutate(!group.muted)}>
                {group.muted
                  ? <><BellRing className="mr-2 h-4 w-4" aria-hidden /> Unmute notifications</>
                  : <><BellOff className="mr-2 h-4 w-4" aria-hidden /> Mute notifications</>}
              </DropdownMenuItem>
            )}
            <ReportDialog
              target={{ targetType: 'GROUP', targetGroupId: groupId, what: `"${group.name}"` }}
              trigger={
                <DropdownMenuItem onSelect={(e) => { e.preventDefault() }} className="text-destructive focus:text-destructive">
                  <Flag className="mr-2 h-4 w-4" aria-hidden /> Report group
                </DropdownMenuItem>
              }
            />
            {isMember && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" aria-hidden /> Leave group
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Leave “{group.name}”?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {group.owner.username === user?.username
                        ? 'You own this group — ownership will transfer to the earliest-joined member (or the group is deleted if empty).'
                        : 'You can re-join later if the group stays public.'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => leaveMut.mutate()} className="bg-destructive text-white hover:bg-destructive/90">
                      Leave
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* ---------- messages ---------- */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={scroll.onScroll}
          className="h-full overflow-y-auto px-3 py-4 sm:px-4"
          aria-label="Group messages"
        >
          {hasMore && (
            <div className="mb-3 flex justify-center">
              <Button variant="outline" size="sm" disabled={loadingOlder} onClick={() => void scroll.withPreservedScroll(loadOlder)}>
                {loadingOlder ? 'Loading…' : 'Load older messages'}
              </Button>
            </div>
          )}

          {chat.query.isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 max-w-[70%] rounded-2xl" />)}
            </div>
          ) : !isMember ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
              <Lock className="h-10 w-10 text-muted-foreground/40" aria-hidden />
              <p className="font-medium">Join to see the conversation</p>
              <p className="text-sm text-muted-foreground">
                {group.isPrivate
                  ? 'This is a private group — members only.'
                  : 'Message history is visible to members of this group.'}
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <Users className="h-10 w-10 text-muted-foreground/40" aria-hidden />
              <p className="font-medium">No messages yet</p>
              <p className="text-sm text-muted-foreground">Be the first to say hello to the group!</p>
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
                      onReply={(m) => setReplyTo({ id: m.id, sender: m.sender.username, content: m.content })}
                      onReport={openReport}
                    />
                  </motion.div>
                )
              })}
              <TypingRow names={typingNames} />
            </div>
          )}
        </div>

        {scroll.unseen > 0 && (
          <Button
            size="sm"
            className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 shadow-lg"
            onClick={() => scroll.scrollToBottom(true)}
          >
            New messages ↓
          </Button>
        )}
      </div>

      {/* ---------- composer ---------- */}
      <div className="border-t border-border/70 bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-4">
        <div className="mx-auto max-w-3xl">
          {isMember ? (
            <ChatInput
              onSend={sendMessage}
              replyTo={replyTo}
              onCancelReply={() => setReplyTo(null)}
              onTyping={onTyping}
              members={members.map((m) => ({ username: m.username, displayName: m.displayName, avatarUrl: m.avatarUrl }))}
              placeholder={`Message ${group.name}…`}
            />
          ) : group.isPrivate ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/60 px-4 py-4 text-sm text-muted-foreground">
              <UserPlus className="h-4 w-4" aria-hidden />
              Private group — only invited members can post.
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-card/60 px-4 py-3">
              <p className="text-sm text-muted-foreground">You&apos;re previewing this group as a guest.</p>
              <Button size="sm" disabled={joinMut.isPending} onClick={() => joinMut.mutate()}>
                <UserPlus className="h-4 w-4" aria-hidden /> Join group
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* controlled report dialog for message actions */}
      {reportMessage && (
        <ReportDialog
          open={reportOpen}
          onOpenChange={(o) => {
            setReportOpen(o)
            if (!o) setTimeout(() => { if (!reportOpenRef.current) setReportMessage(null) }, 300)
          }}
          target={{ targetType: 'GROUP_MESSAGE', targetMessageId: reportMessage.id, what: 'this message' }}
        />
      )}
    </Shell>
  )
}

/** Full-height chat shell below the app header. */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-4xl flex-col overflow-hidden sm:rounded-t-2xl sm:border-x sm:border-t sm:border-border/60">
      {children}
    </div>
  )
}
