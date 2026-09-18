'use client'
import { create } from 'zustand'
import type { PublicUser } from '@/lib/types'

interface AppState {
  user: PublicUser | null
  accessToken: string | null // for socket auth
  unreadNotifications: number
  hydrationDone: boolean
  setUser: (user: PublicUser | null, accessToken?: string | null) => void
  setUnreadNotifications: (n: number) => void
  bumpUnread: (delta: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  accessToken: null,
  unreadNotifications: 0,
  hydrationDone: false,
  setUser: (user, accessToken) => set((s) => ({
    user,
    accessToken: accessToken !== undefined ? accessToken : s.accessToken,
    hydrationDone: true,
  })),
  setUnreadNotifications: (n) => set({ unreadNotifications: n }),
  bumpUnread: (delta) => set((s) => ({ unreadNotifications: Math.max(0, s.unreadNotifications + delta) })),
}))

export function getAccessToken(): string | null {
  return useAppStore.getState().accessToken
}
