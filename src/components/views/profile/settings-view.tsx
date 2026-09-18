'use client'
// Settings (#/settings) — agent F. Profile editor (avatar upload with
// client-side 256px canvas resize + ≤200KB JPEG guard, displayName, bio,
// target year), privacy toggles (optimistic), change password.
import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api, ApiError } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import type { PublicUser } from '@/lib/types'
import { Avatar } from '@/components/app/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Camera, Eye, EyeOff, KeyRound, Loader2, Trash2, UserRound } from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_AVATAR_CHARS = 200_000 // ~200KB data URL (contract)
const YEARS = [2027, 2028, 2029, 2030]

/** Resize any image file to a 256×256 center-cropped JPEG data URL ≤200KB. */
async function fileToAvatarDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file (PNG or JPG).')
  if (file.size > 15 * 1024 * 1024) throw new Error('That file is too large (max 15 MB).')
  const bitmap = await createImageBitmap(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Your browser could not process the image.')
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 256, 256)
  bitmap.close?.()
  for (const quality of [0.85, 0.7, 0.5, 0.35]) {
    const dataUrl = canvas.toDataURL('image/jpeg', quality)
    if (dataUrl.length <= MAX_AVATAR_CHARS) return dataUrl
  }
  throw new Error('Image still too large after compression — try a simpler picture.')
}

export function SettingsView() {
  const user = useAppStore((s) => s.user)
  const setUser = useAppStore((s) => s.setUser)
  const queryClient = useQueryClient()

  // ---- profile form ----
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [targetYear, setTargetYear] = useState<string>(user?.targetYear ? String(user.targetYear) : '')
  const [avatarDraft, setAvatarDraft] = useState<string | null>(user?.avatarUrl ?? null)
  const avatarChanged = useRef(false)
  const [processingImage, setProcessingImage] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    // re-seed when the store user changes (e.g. after another save)
    setDisplayName(user?.displayName ?? '')
    setBio(user?.bio ?? '')
    setTargetYear(user?.targetYear ? String(user.targetYear) : '')
    setAvatarDraft(user?.avatarUrl ?? null)
    avatarChanged.current = false
  }, [user?.id])

  const nameValid = displayName.trim().length >= 2 && displayName.trim().length <= 40
  const dirty =
    displayName !== (user?.displayName ?? '')
    || bio !== (user?.bio ?? '')
    || targetYear !== (user?.targetYear ? String(user.targetYear) : '')
    || avatarChanged.current

  const pickAvatar = async (file: File | undefined) => {
    if (!file) return
    setProcessingImage(true)
    try {
      const dataUrl = await fileToAvatarDataUrl(file)
      setAvatarDraft(dataUrl)
      avatarChanged.current = true
      toast.success('Image ready — hit Save changes to apply it.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not process the image')
    } finally {
      setProcessingImage(false)
    }
  }

  const saveProfile = async () => {
    if (!user || !nameValid || savingProfile) return
    setSavingProfile(true)
    // optimistic: reflect immediately, roll back on failure
    const prevUser = user
    setUser({ ...user, displayName: displayName.trim(), bio: bio.trim() || null, targetYear: targetYear ? Number(targetYear) : null, avatarUrl: avatarDraft })
    try {
      const res = await api.put<{ user: PublicUser }>('/me', {
        displayName: displayName.trim(),
        bio: bio.trim() || null,
        targetYear: targetYear ? Number(targetYear) : null,
        ...(avatarChanged.current ? { avatarUrl: avatarDraft } : {}),
      })
      setUser(res.user)
      avatarChanged.current = false
      void queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile saved')
    } catch (e) {
      setUser(prevUser)
      toast.error(e instanceof ApiError ? e.message : 'Could not save your profile')
    } finally {
      setSavingProfile(false)
    }
  }

  // ---- privacy (optimistic switches) ----
  const setFlag = async (key: 'profilePublic' | 'leaderboardVisible', value: boolean) => {
    if (!user) return
    const prev = user
    setUser({ ...user, [key]: value })
    try {
      const res = await api.put<{ user: PublicUser }>('/me', { [key]: value })
      setUser(res.user)
    } catch (e) {
      setUser(prev)
      toast.error(e instanceof ApiError ? e.message : 'Could not update the setting')
    }
  }

  // ---- change password ----
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const newPwValid = newPw.length >= 8
  const pwMatch = newPw === confirmPw

  const changePassword = async () => {
    if (!user || !newPwValid || !pwMatch || !currentPw || savingPw) return
    setSavingPw(true)
    try {
      await api.post('/auth/change-password', { currentPassword: currentPw, newPassword: newPw })
      toast.success('Password updated', { description: 'Your other sessions were signed out.' })
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not change the password')
    } finally {
      setSavingPw(false)
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 sm:px-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your profile, privacy and account security.</p>
      </header>

      <div className="space-y-5">
        {/* ---------- profile ---------- */}
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-2.5">
            <UserRound className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="font-semibold">Profile</h2>
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="relative">
              <Avatar username={user.username} displayName={displayName || user.username} avatarUrl={avatarDraft} size={84} />
              {processingImage && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" aria-label="Processing image" />
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                id="avatar-file"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => { void pickAvatar(e.target.files?.[0]); e.target.value = '' }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={processingImage}
                onClick={() => document.getElementById('avatar-file')?.click()}
              >
                <Camera className="h-4 w-4" aria-hidden /> Upload photo
              </Button>
              {(avatarDraft || avatarChanged.current) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  disabled={processingImage}
                  onClick={() => { setAvatarDraft(null); avatarChanged.current = true }}
                >
                  <Trash2 className="h-4 w-4" aria-hidden /> Remove
                </Button>
              )}
              <p className="w-full text-xs text-muted-foreground">Square crop, resized to 256px, max 200KB (JPEG).</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-display-name">Display name</Label>
              <Input
                id="settings-display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, 40))}
                placeholder="How your name appears across JEEForge"
              />
              <div className="flex justify-between text-xs">
                {displayName.length > 0 && !nameValid
                  ? <span className="text-destructive">Name must be 2–40 characters.</span>
                  : <span className="text-muted-foreground">Shown instead of your username.</span>}
                <span className="text-muted-foreground">{displayName.length}/40</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-bio">Bio</Label>
              <Textarea
                id="settings-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 500))}
                placeholder="e.g. Dropper aiming for CSE · Physics lover"
                rows={3}
              />
              <p className="text-right text-xs text-muted-foreground">{bio.length}/500</p>
            </div>

            <div className="space-y-2">
              <Label>Target exam year</Label>
              <Select value={targetYear} onValueChange={setTargetYear}>
                <SelectTrigger className="w-full sm:w-48" aria-label="Target year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>JEE {y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Shown as a chip on your profile.</p>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => void saveProfile()} disabled={!nameValid || !dirty || savingProfile}>
                {savingProfile && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {savingProfile ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </div>
        </Card>

        {/* ---------- privacy ---------- */}
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <Eye className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="font-semibold">Privacy</h2>
          </div>
          <div className="space-y-1">
            <ToggleRow
              id="privacy-profile-public"
              title="Public profile"
              description="Anyone can view your profile page and stats. Turn off to hide it from others."
              checked={user.profilePublic}
              onChange={(v) => void setFlag('profilePublic', v)}
            />
            <ToggleRow
              id="privacy-leaderboard"
              title="Appear on leaderboards"
              description="Your rank and scores are visible in mock leaderboards. Turn off to opt out."
              checked={user.leaderboardVisible}
              onChange={(v) => void setFlag('leaderboardVisible', v)}
            />
          </div>
        </Card>

        {/* ---------- change password ---------- */}
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <KeyRound className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="font-semibold">Change password</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pw-current">Current password</Label>
              <div className="relative">
                <Input
                  id="pw-current"
                  type={showPw ? 'text' : 'password'}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pw-new">New password</Label>
                <Input
                  id="pw-new"
                  type={showPw ? 'text' : 'password'}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  autoComplete="new-password"
                />
                {newPw.length > 0 && !newPwValid && (
                  <p className="text-xs text-destructive">At least 8 characters.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pw-confirm">Confirm new password</Label>
                <Input
                  id="pw-confirm"
                  type={showPw ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  autoComplete="new-password"
                />
                {confirmPw.length > 0 && !pwMatch && (
                  <p className="text-xs text-destructive">Passwords don&apos;t match.</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => setShowPw((s) => !s)}
                aria-pressed={showPw}
              >
                {showPw ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                {showPw ? 'Hide' : 'Show'} passwords
              </Button>
              <Button
                variant="outline"
                disabled={!currentPw || !newPwValid || !pwMatch || savingPw}
                onClick={() => void changePassword()}
              >
                {savingPw && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {savingPw ? 'Updating…' : 'Update password'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function ToggleRow({ id, title, description, checked, onChange }: {
  id: string
  title: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className={cn('flex items-center justify-between gap-4 rounded-xl border border-border/70 px-4 py-3.5')}>
      <div className="min-w-0">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium">{title}</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  )
}
