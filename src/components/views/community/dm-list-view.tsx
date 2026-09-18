'use client'
// Direct messages list (#/dm) — agent F. Conversation cards with read ticks,
// unread badges, live refresh via socket; "New message" dialog to start a chat
// by username.
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { api, ApiError } from '@/lib/api'
import { navigate } from '@/lib/router'
import { timeAgo } from '@/lib/format'
import type { ChatMessageDTO, ConversationDTO } from '@/lib/types'
import { qk } from '@/components/chat/use-chat'
import { useSocketEvent } from '@/components/chat/socket'
import { OnlineDot, ReadTicks } from '@/components/chat/chat-ui'
import { Avatar } from '@/components/app/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { MessageSquarePlus, MessagesSquare, Search } from 'lucide-react'

export function DmListView() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const convsQuery = useQuery({
    queryKey: qk.conversations,
    queryFn: () => api.get<{ conversations: ConversationDTO[] }>('/conversations'),
    refetchInterval: 45_000,
  })

  // live updates
  useSocketEvent<ChatMessageDTO & { conversationId: string }>('dm:message:new', (m) => {
    if (m) void queryClient.invalidateQueries({ queryKey: qk.conversations })
  })
  useSocketEvent<{ type?: string }>('notification:new', (n) => {
    if (n?.type === 'DIRECT_MESSAGE') void queryClient.invalidateQueries({ queryKey: qk.conversations })
  })

  const conversations = convsQuery.data?.conversations ?? []
  const filtered = search.trim()
    ? conversations.filter((c) => {
        const q = search.trim().toLowerCase()
        return c.other.username.includes(q) || (c.other.displayName ?? '').toLowerCase().includes(q)
      })
    : conversations

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">Private one-to-one conversations.</p>
        </div>
        <NewMessageDialog />
      </header>

      {convsQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
          <MessagesSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" aria-hidden />
          {search.trim() ? (
            <>
              <p className="font-medium">No conversations match “{search.trim()}”</p>
              <p className="mt-1 text-sm text-muted-foreground">Try another name.</p>
            </>
          ) : (
            <>
              <p className="font-medium">No conversations yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Start a private chat with a study partner by their username.</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter conversations…"
              aria-label="Filter conversations"
              className="pl-9"
            />
          </div>
          <motion.ul
            className="space-y-2.5"
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
          >
            {filtered.map((c) => (
              <motion.li key={c.id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <ConversationCard conversation={c} />
              </motion.li>
            ))}
          </motion.ul>
        </>
      )}
    </div>
  )
}

function ConversationCard({ conversation: c }: { conversation: ConversationDTO }) {
  const name = c.other.displayName || c.other.username
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Conversation with ${name}${c.unreadCount ? `, ${c.unreadCount} unread` : ''}`}
      onClick={() => navigate(`/dm/${c.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/dm/${c.id}`) } }}
      className="flex cursor-pointer items-center gap-3 p-3.5 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4"
    >
      <span className="relative shrink-0">
        <Avatar username={c.other.username} displayName={c.other.displayName} avatarUrl={c.other.avatarUrl} size={44} />
        <OnlineDot online={c.other.online} className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-semibold">{name} <span className="ml-1 font-normal text-muted-foreground">@{c.other.username}</span></p>
          {c.lastMessage && (
            <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(c.lastMessage.createdAt)}</span>
          )}
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            {c.lastMessage ? (
              <>
                {c.lastMessage.mine && <span className="shrink-0 text-muted-foreground/70">You:</span>}
                <span className="truncate">{c.lastMessage.content}</span>
                {c.lastMessage.mine && <ReadTicks read={c.lastMessage.read} />}
              </>
            ) : (
              <span className="italic text-muted-foreground/60">No messages yet — say hi!</span>
            )}
          </p>
          {c.unreadCount > 0 && (
            <Badge className="shrink-0 bg-primary text-primary-foreground tabular-nums">
              {c.unreadCount > 99 ? '99+' : c.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}

function NewMessageDialog() {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const queryClient = useQueryClient()

  const startMut = useMutation({
    mutationFn: () => api.post<{ conversation: ConversationDTO }>('/conversations', {
      username: username.trim().toLowerCase(),
    }),
    onSuccess: (res) => {
      setOpen(false)
      setUsername('')
      void queryClient.invalidateQueries({ queryKey: qk.conversations })
      navigate(`/dm/${res.conversation.id}`)
    },
    onError: (e) => {
      const msg = e instanceof ApiError ? e.message : 'Could not start the conversation'
      toast.error(msg === 'You cannot message this user' ? 'You cannot message this user (blocking is in effect)' : msg)
    },
  })

  const valid = /^[a-z0-9_]{3,20}$/.test(username.trim().toLowerCase())

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><MessageSquarePlus className="h-4 w-4" aria-hidden /> New message</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
          <DialogDescription>Start a private conversation by username.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="dm-username">Username</Label>
          <Input
            id="dm-username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20))}
            placeholder="e.g. aspirant_2027"
            autoFocus
          />
          {username.length > 0 && !valid && (
            <p className="text-xs text-destructive">Usernames are 3–20 characters (a–z, 0–9, _).</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={!valid || startMut.isPending} onClick={() => startMut.mutate()}>
            {startMut.isPending ? 'Starting…' : 'Start chat'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
