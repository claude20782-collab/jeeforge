'use client'
/**
 * AppRoot — SPA shell. Renders the active hash-route view.
 * CBT route (/test/:attemptId) renders full-screen without app chrome.
 * View components are owned by agents C–G (see docs/CONTRACTS.md).
 */
import { useEffect, useState } from 'react'
import { useHashRoute, navigate, Link } from '@/lib/router'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import { Avatar } from '@/components/app/avatar'
import type { PublicUser } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  LayoutDashboard, ListChecks, Trophy, Users, Bell, Menu, Settings, LogOut, ShieldCheck, User as UserIcon, BarChart3,
} from 'lucide-react'

// ---- views (agent-owned) ----
import { LandingView } from '@/components/views/landing/landing-view'
import { LoginView } from '@/components/views/auth/login-view'
import { SignupView } from '@/components/views/auth/signup-view'
import { ForgotPasswordView } from '@/components/views/auth/forgot-password-view'
import { ResetPasswordView } from '@/components/views/auth/reset-password-view'
import { DashboardView } from '@/components/views/dashboard/dashboard-view'
import { MocksView } from '@/components/views/mocks/mocks-view'
import { MockDetailView } from '@/components/views/mocks/mock-detail-view'
import { CbtView } from '@/components/views/cbt/cbt-view'
import { ResultView } from '@/components/views/results/result-view'
import { SolutionsView } from '@/components/views/results/solutions-view'
import { AnalysisView } from '@/components/views/results/analysis-view'
import { ProgressView } from '@/components/views/results/progress-view'
import { LeaderboardView } from '@/components/views/results/leaderboard-view'
import { CommunityView } from '@/components/views/community/community-view'
import { GroupChatView } from '@/components/views/community/group-chat-view'
import { DmListView } from '@/components/views/community/dm-list-view'
import { DmChatView } from '@/components/views/community/dm-chat-view'
import { NotificationsView } from '@/components/views/community/notifications-view'
import { ProfileView } from '@/components/views/profile/profile-view'
import { SettingsView } from '@/components/views/profile/settings-view'
import { AdminView } from '@/components/views/admin/admin-view'

export function AppRoot() {
  const route = useHashRoute()
  const { user, setUser, accessToken, unreadNotifications, setUnreadNotifications, hydrationDone } = useAppStore()
  const [mounted, setMounted] = useState(false)

  // hydrate session once
  useEffect(() => {
    const m = setTimeout(() => setMounted(true), 0)
    let cancelled = false
    api.get<{ user: PublicUser | null; accessToken: string | null }>('/auth/me')
      .then((res) => {
        if (cancelled) return
        setUser(res.user ?? null, res.accessToken ?? null)
        if (res.user) {
          api.get<{ unreadCount: number }>('/notifications?unreadOnly=true&limit=1')
            .then(n => { if (!cancelled) setUnreadNotifications(n.unreadCount) }).catch(() => {})
        }
      })
      .catch(() => { if (!cancelled) setUser(null, null) })
    return () => { cancelled = true; clearTimeout(m) }
  }, [])

  const isCbt = route.path.startsWith('/test/')
  const isAdmin = route.path.startsWith('/admin')
  const isLanding = route.path === '/' || route.path === ''
  const authRoute = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(route.path)

  // avoid SSR/CSR hydration mismatch on hash routes — render shell after mount
  if (!mounted) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Loading" /></div>
  }

  if (isCbt) {
    return <CbtView attemptId={route.params.test} />
  }

  const needsAuth = !isLanding && !authRoute
  if (hydrationDone && needsAuth && !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="card-glow max-w-md rounded-2xl border bg-card p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold">Sign in required</h2>
            <p className="mb-6 text-sm text-muted-foreground">Create a free account or sign in to continue.</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => navigate('/login')} variant="outline">Log in</Button>
              <Button onClick={() => navigate('/signup')}>Sign up</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  let view: React.ReactNode
  if (isLanding || authRoute) {
    switch (route.path) {
      case '/login': view = <LoginView />; break
      case '/signup': view = <SignupView />; break
      case '/forgot-password': view = <ForgotPasswordView />; break
      case '/reset-password': view = <ResetPasswordView token={route.params.token ?? new URLSearchParams(window.location.hash.split('?')[1] || '').get('token') ?? ''} />; break
      default: view = <LandingView />
    }
    return <div className="flex min-h-screen flex-col"><main className="flex-1">{view}</main><Footer /></div>
  }

  // app shell routes
  if (route.path.startsWith('/mock/')) view = <MockDetailView mockId={route.params.mock} />
  else if (route.path.startsWith('/result/')) view = <ResultView attemptId={route.params.result} />
  else if (route.path.startsWith('/solutions/')) view = <SolutionsView attemptId={route.params.solutions} />
  else if (route.path.startsWith('/analysis/')) view = <AnalysisView attemptId={route.params.analysis} />
  else if (route.path.startsWith('/group/')) view = <GroupChatView groupId={route.params.group} />
  else if (route.path.startsWith('/dm/')) view = <DmChatView conversationId={route.params.dm} />
  else if (route.path.startsWith('/profile/')) view = <ProfileView username={route.params.profile} />
  else if (route.path.startsWith('/admin')) view = <AdminView subpath={route.path.replace(/^\/admin\/?/, '')} />
  else {
    switch (route.path) {
      case '/dashboard': view = <DashboardView />; break
      case '/mocks': view = <MocksView />; break
      case '/progress': view = <ProgressView />; break
      case '/leaderboard': view = <LeaderboardView />; break
      case '/community': view = <CommunityView />; break
      case '/dm': view = <DmListView />; break
      case '/notifications': view = <NotificationsView />; break
      case '/settings': view = <SettingsView />; break
      default: view = (
        <div className="py-24 text-center">
          <p className="text-lg font-semibold">Page not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
        </div>
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} unread={unreadNotifications} onLogout={async () => {
        await api.post('/auth/logout').catch(() => {})
        setUser(null, null)
        setUnreadNotifications(0)
        toast.success('Logged out')
        navigate('/')
      }} />
      <main className="flex-1">{view}</main>
      <Footer />
    </div>
  )
}

function AppHeader({ user, unread, onLogout }: { user: PublicUser | null; unread: number; onLogout: () => void | Promise<void> }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/mocks', label: 'Mock Tests', icon: ListChecks },
    { to: '/progress', label: 'Progress', icon: BarChart3 },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/community', label: 'Community', icon: Users },
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:px-4">
        <Link to="/" className="mr-1 flex items-center gap-2 font-bold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-black">J</span>
          <span className="hidden sm:inline">JEE<span className="gold-gradient-text">Forge</span></span>
        </Link>
        <nav className="hidden flex-1 items-center gap-1 md:flex" aria-label="Primary">
          {links.map(l => <NavLink key={l.to} to={l.to} label={l.label} icon={l.icon} />)}
          {user?.role === 'ADMIN' && <NavLink to="/admin" label="Admin" icon={ShieldCheck} />}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications (${unread} unread)`} onClick={() => navigate('/notifications')}>
            <Bell className="h-5 w-5" />
            {unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">{unread > 99 ? '99+' : unread}</span>}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 rounded-full ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
                  <Avatar username={user.username} displayName={user.displayName} avatarUrl={user.avatarUrl} size={32} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-sm font-semibold">{user.displayName || user.username}</div>
                  <div className="text-xs font-normal text-muted-foreground">@{user.username}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`/profile/${user.username}`)}><UserIcon className="mr-2 h-4 w-4" /> My profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
                {user.role === 'ADMIN' && <DropdownMenuItem onClick={() => navigate('/admin')}><ShieldCheck className="mr-2 h-4 w-4" /> Admin panel</DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log in</Button>
              <Button size="sm" onClick={() => navigate('/signup')}>Sign up</Button>
            </>
          )}
          {/* mobile nav */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-1 p-4 pt-10">
                  {links.map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/90 transition hover:bg-accent">
                      <l.icon className="h-4.5 w-4.5" /> {l.label}
                    </Link>
                  ))}
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/90 transition hover:bg-accent">
                      <ShieldCheck className="h-4.5 w-4.5" /> Admin
                    </Link>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, label, icon: Icon }: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  const route = useHashRoute()
  const active = route.path === to || route.path.startsWith(to + '/')
  return (
    <Link to={to} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'}`}>
      <Icon className="h-4 w-4" /> {label}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
        <div>
          <span className="font-semibold text-foreground/80">JEE<span className="gold-gradient-text">Forge</span></span>
          <span className="mx-1.5">·</span>
          Free JEE Main mock test series — 40 full-length CBTs, Sep–Dec 2026
        </div>
        <div className="flex items-center gap-3">
          <Link to="/mocks" className="hover:text-foreground">Schedule</Link>
          <Link to="/leaderboard" className="hover:text-foreground">Leaderboard</Link>
          <Link to="/community" className="hover:text-foreground">Community</Link>
        </div>
      </div>
    </footer>
  )
}
