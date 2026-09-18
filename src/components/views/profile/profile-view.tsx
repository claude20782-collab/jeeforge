'use client'
// Profile (#/profile/:username) — agent F. Public profile: identity header
// (avatar, target-year chip, joined date, bio), stat cards, recent attempts
// table. Self → Edit profile (→ settings). Others → Message / Report / Block.
// Handles 403 private profiles and the viewer-blocked notice.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { api, ApiError } from '@/lib/api'
import { navigate } from '@/lib/router'
import { fmtDateIST, fmtNumber, fmtPercent, ordinal, timeAgo } from '@/lib/format'
import type { ConversationDTO, PublicProfile } from '@/lib/types'
import { qk } from '@/components/chat/use-chat'
import { ReportDialog } from '@/components/chat/report-dialog'
import { Avatar } from '@/components/app/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Ban, CalendarDays, Flag, Flame, ListChecks, Lock, MessageCircle, ShieldOff, Target, TrendingUp, Trophy,
} from 'lucide-react'

export function ProfileView({ username }: { username: string }) {
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ['profile', username],
    queryFn: () => api.get<{ profile: PublicProfile }>(`/profiles/${encodeURIComponent(username)}`),
    retry: (count, err) => !(err instanceof ApiError && (err.status === 403 || err.status === 404)) && count < 2,
  })

  const blocksQuery = useQuery({
    queryKey: qk.blocks,
    queryFn: () => api.get<{ blocked: { username: string; since: string }[] }>('/blocks'),
  })

  const profile = profileQuery.data?.profile
  const blockedByMe = !!(profile && !profile.isSelf
    && blocksQuery.data?.blocked.some((b) => b.username === profile.username))

  const startDmMut = useMutation({
    mutationFn: () => api.post<{ conversation: ConversationDTO }>('/conversations', { username: profile!.username }),
    onSuccess: (res) => navigate(`/dm/${res.conversation.id}`),
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not open the conversation'),
  })
  const blockMut = useMutation({
    mutationFn: () => api.post('/blocks', { username: profile!.username }),
    onSuccess: () => {
      toast.success(`Blocked @${profile!.username}`)
      void queryClient.invalidateQueries({ queryKey: qk.blocks })
      void queryClient.refetchQueries({ queryKey: ['profile', username] })
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not block'),
  })
  const unblockMut = useMutation({
    mutationFn: () => api.del('/blocks', { username: profile!.username }),
    onSuccess: () => {
      toast.success(`Unblocked @${profile!.username}`)
      void queryClient.invalidateQueries({ queryKey: qk.blocks })
      void queryClient.refetchQueries({ queryKey: ['profile', username] })
    },
    onError: (e) => toast.error(e instanceof ApiError ? e.message : 'Could not unblock'),
  })

  // ---- states ----
  if (profileQuery.isError) {
    const err = profileQuery.error as ApiError
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
          {err.status === 403 ? (
            <>
              <Lock className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" aria-hidden />
              <p className="font-semibold">This profile is private</p>
              <p className="mt-1 text-sm text-muted-foreground">@{username} has chosen to keep their profile hidden.</p>
            </>
          ) : (
            <>
              <p className="font-semibold">User not found</p>
              <p className="mt-1 text-sm text-muted-foreground">No account matches “@{username}”.</p>
            </>
          )}
        </div>
      </div>
    )
  }
  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-6 h-28 rounded-2xl" />
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    )
  }

  const s = profile.stats
  const name = profile.displayName || profile.username

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      {/* ---------- identity ---------- */}
      <motion.header
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <Avatar username={profile.username} displayName={profile.displayName} avatarUrl={profile.avatarUrl} size={84} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
            {profile.targetYear && (
              <Badge variant="secondary" className="gap-1.5">
                <Target className="h-3 w-3 text-gold" aria-hidden /> JEE {profile.targetYear}
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">@{profile.username}</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden /> Joined {fmtDateIST(profile.createdAt)}
          </p>
          {profile.bio && <p className="mt-3 max-w-xl whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">{profile.bio}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          {profile.isSelf ? (
            <Button onClick={() => navigate('/settings')} variant="outline" size="sm">Edit profile</Button>
          ) : (
            <>
              <Button
                size="sm"
                disabled={blockedByMe || startDmMut.isPending}
                onClick={() => startDmMut.mutate()}
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> Message
              </Button>
              {!blockedByMe ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      <Ban className="h-4 w-4" aria-hidden /> Block
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Block @{profile.username}?</AlertDialogTitle>
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
                <Button variant="outline" size="sm" disabled={unblockMut.isPending} onClick={() => unblockMut.mutate()}>
                  <ShieldOff className="h-4 w-4" aria-hidden /> Unblock
                </Button>
              )}
              <ReportDialog
                target={{ targetType: 'USER', targetUsername: profile.username, what: `@${profile.username}` }}
                trigger={
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                    <Flag className="h-4 w-4" aria-hidden /> Report
                  </Button>
                }
              />
            </>
          )}
        </div>
      </motion.header>

      {profile.blocked && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <p className="text-sm text-amber-200">
            You&apos;ve blocked <span className="font-semibold">@{profile.username}</span>. They can&apos;t message you.
          </p>
          <Button size="sm" variant="outline" disabled={unblockMut.isPending} onClick={() => unblockMut.mutate()}>
            <ShieldOff className="h-4 w-4" aria-hidden /> Unblock
          </Button>
        </div>
      )}

      {/* ---------- stats ---------- */}
      <section aria-label="Statistics" className="mb-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard icon={ListChecks} label="Mocks" value={String(s.mocksCompleted)} />
          <StatCard icon={Trophy} label="Best score" value={s.bestScore != null ? `${s.bestScore}` : '—'} sub="/ 300" />
          <StatCard icon={TrendingUp} label="Avg score" value={s.averageScore != null ? fmtNumber(s.averageScore, 1) : '—'} sub="/ 300" />
          <StatCard icon={Target} label="Accuracy" value={fmtPercent(s.accuracy)} />
          <StatCard icon={Flame} label="Streak" value={`${s.streak} ${s.streak === 1 ? 'day' : 'days'}`} />
          <StatCard icon={Trophy} label="Best rank" value={s.bestRank != null ? ordinal(s.bestRank) : '—'} />
        </div>
      </section>

      {/* ---------- recent attempts ---------- */}
      <section aria-label="Recent attempts">
        <h2 className="mb-3 text-lg font-semibold">Recent attempts</h2>
        {profile.recentAttempts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
            <p className="font-medium">{profile.isSelf ? 'No attempts yet' : `${name} hasn't attempted a mock yet`}</p>
            {profile.isSelf && (
              <>
                <p className="mt-1 text-sm text-muted-foreground">Take your first mock to see results here.</p>
                <Button size="sm" className="mt-4" onClick={() => navigate('/mocks')}>Browse mocks</Button>
              </>
            )}
          </div>
        ) : (
          <Card className="overflow-hidden py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mock</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Rank</TableHead>
                  <TableHead className="text-right">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profile.recentAttempts.map((a, i) => (
                  <TableRow key={`${a.mockNumber}-${i}`}>
                    <TableCell className="max-w-[220px]">
                      <p className="truncate font-medium">Mock {String(a.mockNumber).padStart(2, '0')}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.mockTitle}</p>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-primary">{a.score}<span className="text-xs font-normal text-muted-foreground">/300</span></TableCell>
                    <TableCell className="text-right tabular-nums">{a.rank != null ? ordinal(a.rank) : '—'}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{timeAgo(a.submittedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub?: string
}) {
  return (
    <Card className="p-3.5">
      <div className="mb-1.5 flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-xl font-bold tabular-nums">
        {value}
        {sub && <span className="ml-1 text-xs font-normal text-muted-foreground">{sub}</span>}
      </p>
    </Card>
  )
}
