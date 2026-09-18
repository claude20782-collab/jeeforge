'use client'
// Community (#/community) — agent F. Group directory: Discover / My Groups tabs,
// search, group cards (privacy badge, member count, owner, unread badge, last
// activity), Join/Open/Leave actions, Create Group dialog. Live badge refreshes
// via socket notification events.
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { navigate } from '@/lib/router'
import { timeAgo } from '@/lib/format'
import type { GroupDTO, NotificationDTO } from '@/lib/types'
import { qk } from '@/components/chat/use-chat'
import { useSocketEvent } from '@/components/chat/socket'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import {
  BellOff, Crown, Lock, LogIn, LogOut, MessageCircle, Plus, Search, Users,
} from 'lucide-react'

export function CommunityView() {
  const [tab, setTab] = useState<'all' | 'mine'>('all')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const groupsQuery = useQuery({
    queryKey: qk.groups(tab),
    queryFn: () => api.get<{ groups: GroupDTO[] }>(`/groups?filter=${tab}`),
    refetchInterval: 60_000,
  })

  // live unread badges / previews when messages land elsewhere
  useSocketEvent<NotificationDTO>('notification:new', (n) => {
    if (n?.type === 'GROUP_MESSAGE' || n?.type === 'MENTION' || n?.type === 'GROUP_ACTIVITY') {
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
    }
  })

  const joinMut = useMutation({
    mutationFn: (id: string) => api.post(`/groups/${id}/join`),
    onSuccess: () => {
      toast.success('Joined the group')
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not join'),
  })
  const leaveMut = useMutation({
    mutationFn: (id: string) => api.post(`/groups/${id}/leave`),
    onSuccess: () => {
      toast.success('Left the group')
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not leave'),
  })

  const groups = groupsQuery.data?.groups ?? []
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return groups
    return groups.filter((g) =>
      g.name.toLowerCase().includes(q)
      || (g.description ?? '').toLowerCase().includes(q)
      || g.owner.username.toLowerCase().includes(q))
  }, [groups, search])

  const loading = groupsQuery.isLoading

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Community</h1>
          <p className="mt-1 text-sm text-muted-foreground">Study groups, doubt-solving circles and peer motivation.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dm')}>
            <MessageCircle className="h-4 w-4" aria-hidden /> Messages
          </Button>
          <CreateGroupDialog />
        </div>
      </header>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'all' | 'mine')}>
          <TabsList>
            <TabsTrigger value="all">Discover</TabsTrigger>
            <TabsTrigger value="mine">My Groups</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups…"
            aria-label="Search groups"
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState tab={tab} searching={!!search.trim()} onGoDiscover={() => setTab('all')} />
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        >
          {filtered.map((g) => (
            <motion.div
              key={g.id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.25 }}
            >
              <GroupCard
                group={g}
                busy={joinMut.isPending && joinMut.variables === g.id || leaveMut.isPending && leaveMut.variables === g.id}
                onJoin={() => joinMut.mutate(g.id)}
                onLeave={() => leaveMut.mutate(g.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function GroupCard({ group, busy, onJoin, onLeave }: { group: GroupDTO; busy: boolean; onJoin: () => void; onLeave: () => void }) {
  return (
    <Card className="flex h-full flex-col p-5 transition-shadow hover:shadow-md hover:shadow-primary/5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(`/group/${group.id}`)}
          className="min-w-0 flex-1 text-left"
          aria-label={`Open ${group.name}`}
        >
          <h3 className="truncate text-base font-semibold text-foreground transition-colors hover:text-primary">{group.name}</h3>
        </button>
        <div className="flex shrink-0 items-center gap-1.5">
          {group.isPrivate && (
            <Badge variant="outline" className="gap-1 border-border text-muted-foreground">
              <Lock className="h-3 w-3" aria-hidden /> Private
            </Badge>
          )}
          {group.muted && (
            <Badge variant="outline" className="gap-1 border-border text-muted-foreground" title="Muted">
              <BellOff className="h-3 w-3" aria-hidden /> Muted
            </Badge>
          )}
          {group.unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground tabular-nums">
              {group.unreadCount > 99 ? '99+' : group.unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {group.description && (
        <p className="mb-3 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">{group.description}</p>
      )}
      {!group.description && <div className="mb-3 min-h-[2.5rem]" />}

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" aria-hidden /> {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}</span>
        <span className="inline-flex items-center gap-1"><Crown className="h-3.5 w-3.5 text-gold" aria-hidden /> @{group.owner.username}</span>
      </div>

      <div className="mt-auto border-t border-border/60 pt-3">
        {group.lastMessagePreview ? (
          <p className="mb-3 truncate text-xs text-muted-foreground/80" title={group.lastMessagePreview}>
            <span className="mr-1.5 text-muted-foreground/50">Last:</span>
            {group.lastMessagePreview}
            {group.lastMessageAt && <span className="ml-1.5 text-muted-foreground/50">· {timeAgo(group.lastMessageAt)}</span>}
          </p>
        ) : (
          <p className="mb-3 text-xs italic text-muted-foreground/60">No messages yet — say hello!</p>
        )}
        <div className="flex items-center gap-2">
          {group.joined ? (
            <>
              <Button size="sm" className="flex-1 sm:flex-none" onClick={() => navigate(`/group/${group.id}`)}>
                Open
              </Button>
              <Button size="sm" variant="outline" className="text-muted-foreground hover:text-destructive" disabled={busy} onClick={onLeave}>
                <LogOut className="h-4 w-4" aria-hidden /> Leave
              </Button>
            </>
          ) : group.isPrivate ? (
            <p className="text-xs italic text-muted-foreground">Private group — join by invitation only.</p>
          ) : (
            <Button size="sm" variant="outline" className="flex-1 sm:flex-none" disabled={busy} onClick={onJoin}>
              <LogIn className="h-4 w-4" aria-hidden /> Join
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

function EmptyState({ tab, searching, onGoDiscover }: { tab: 'all' | 'mine'; searching: boolean; onGoDiscover: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" aria-hidden />
      {searching ? (
        <>
          <p className="font-medium">No groups match your search</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different keyword — or start the group yourself.</p>
        </>
      ) : tab === 'all' ? (
        <>
          <p className="font-medium">No groups yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Be the first to create a study group for your batch.</p>
        </>
      ) : (
        <>
          <p className="font-medium">You haven&apos;t joined any groups</p>
          <p className="mt-1 text-sm text-muted-foreground">Discover active study groups and jump in.</p>
          <Button variant="outline" className="mt-4" onClick={onGoDiscover}>Browse Discover</Button>
        </>
      )}
    </div>
  )
}

function CreateGroupDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const queryClient = useQueryClient()

  const createMut = useMutation({
    mutationFn: () => api.post<{ group: GroupDTO }>('/groups', {
      name: name.trim(),
      description: description.trim() || undefined,
      isPrivate,
    }),
    onSuccess: (res) => {
      toast.success('Group created', { description: `"${res.group.name}" is ready — you are the owner.` })
      void queryClient.invalidateQueries({ queryKey: ['groups'] })
      setOpen(false)
      setName(''); setDescription(''); setIsPrivate(false)
      navigate(`/group/${res.group.id}`)
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not create the group'),
  })

  const nameValid = name.trim().length >= 3 && name.trim().length <= 60

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4" aria-hidden /> New group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a study group</DialogTitle>
          <DialogDescription>
            Groups are where your batch solves doubts together. You become the owner and can invite others.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-group-name">Name</Label>
            <Input
              id="new-group-name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 60))}
              placeholder="e.g. Physics grind — 7 AM squad"
              autoFocus
            />
            {name.length > 0 && !nameValid && (
              <p className="text-xs text-destructive">Name must be 3–60 characters.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-group-desc">Description <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea
              id="new-group-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 300))}
              placeholder="What is this group about?"
              rows={3}
            />
            <p className="text-right text-xs text-muted-foreground">{description.length}/300</p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
            <div className="pr-4">
              <Label htmlFor="new-group-private" className="cursor-pointer">Private group</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">Only invited members can see and join.</p>
            </div>
            <Switch id="new-group-private" checked={isPrivate} onCheckedChange={setIsPrivate} aria-label="Private group" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={!nameValid || createMut.isPending} onClick={() => createMut.mutate()}>
            {createMut.isPending ? 'Creating…' : 'Create group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
