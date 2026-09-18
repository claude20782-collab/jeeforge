'use client'
// ============================================================================
// Chat socket singleton — agent F (T5-d).
// Connects to the chat service (:3003) through the sandbox gateway:
//   io("/?XTransformPort=3003", { auth: { token } })
// (production overrides with NEXT_PUBLIC_CHAT_URL absolute URL).
// The token is the `accessToken` JWT returned by login/register/me and held in
// the zustand store (see src/lib/store.ts getAccessToken).
//
// Responsibilities:
//  - one module-level socket per auth token; recreated when the token changes
//    (re-login), torn down on logout
//  - reconnect with the freshest token (reconnect_attempt re-reads the store)
//  - global `notification:new` fan-out: bumpUnread(1) + sonner toast for
//    DMs/mentions + TanStack Query invalidation for live views
//  - tiny pub/sub so React hooks can bind/unbind safely across reconnects
// ============================================================================
import { useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { useAppStore, getAccessToken } from '@/lib/store'
import type { NotificationDTO } from '@/lib/types'

const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL || '/?XTransformPort=3003'

export type ChatStatus = 'idle' | 'connecting' | 'connected' | 'disconnected'

let socket: Socket | null = null
let socketToken: string | null = null
let status: ChatStatus = 'idle'

const statusListeners = new Set<(s: ChatStatus) => void>()
const socketListeners = new Set<(s: Socket | null) => void>()

function setStatus(next: ChatStatus) {
  if (status === next) return
  status = next
  statusListeners.forEach((l) => l(next))
}

function notifySocketListeners() {
  socketListeners.forEach((l) => l(socket))
}

function handleGlobalNotification(n: NotificationDTO) {
  const store = useAppStore.getState()
  store.bumpUnread(1)
  if (n.type === 'DIRECT_MESSAGE' || n.type === 'MENTION') {
    toast(n.title, { description: n.body ?? undefined, duration: 5000 })
  }
}

function createSocket(token: string): Socket {
  const s = io(CHAT_URL, {
    auth: { token },
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  })
  s.on('connect', () => setStatus('connected'))
  s.on('disconnect', () => setStatus(socket ? 'connecting' : 'idle'))
  s.on('connect_error', () => {
    // reconnection is automatic — surface a "Connecting…" chip in the UI
    setStatus('connecting')
  })
  // token refresh: pick up the newest accessToken before every retry
  s.io.on('reconnect_attempt', () => {
    const fresh = getAccessToken()
    if (fresh && fresh !== socketToken) {
      socketToken = fresh
      s.auth = { ...(s.auth as Record<string, unknown>), token: fresh }
    }
  })
  s.on('notification:new', handleGlobalNotification)
  return s
}

/** Current singleton (creates it if a token is available). Null when logged out. */
export function getChatSocket(): Socket | null {
  if (typeof window === 'undefined') return null
  const token = getAccessToken()
  if (!token) {
    if (socket) {
      socket.disconnect()
      socket = null
      socketToken = null
      setStatus('idle')
      notifySocketListeners()
    }
    return null
  }
  if (socket && socketToken === token) return socket
  if (socket) socket.disconnect()
  socket = createSocket(token)
  socketToken = token
  setStatus('connecting')
  notifySocketListeners()
  return socket
}

/** Fire-and-forget emit — only when the socket is live. Returns false → caller uses REST fallback. */
export function emitSocket(event: string, ...args: unknown[]): boolean {
  const s = socket
  if (!s || !s.connected) return false
  s.emit(event, ...args)
  return true
}

/** Emit with ack — resolves with the server ack payload, or null when offline/timed out. */
export function emitSocketAck<T = { ok: boolean; message?: unknown; error?: string }>(
  event: string,
  ...args: unknown[]
): Promise<T | null> {
  return new Promise((resolve) => {
    const s = socket
    if (!s || !s.connected) return resolve(null)
    const timer = setTimeout(() => resolve(null), 10000)
    s.emit(event, ...args, (ack: T) => {
      clearTimeout(timer)
      resolve(ack)
    })
  })
}

/** Subscribe to socket-instance replacement (create/destroy). Returns unsubscribe. */
export function watchSocket(listener: (s: Socket | null) => void): () => void {
  socketListeners.add(listener)
  listener(socket)
  return () => socketListeners.delete(listener)
}

// ---------------------------------------------------------------------------
// React hooks
// ---------------------------------------------------------------------------

/** Live connection status for the "Connecting…" chip. */
export function useChatStatus(): ChatStatus {
  const [st, setSt] = useState<ChatStatus>(status)
  useEffect(() => {
    statusListeners.add(setSt)
    // make sure a socket exists while chat views are mounted
    getChatSocket()
    return () => { statusListeners.delete(setSt) }
  }, [])
  return st
}

/**
 * Subscribe to a server event for the lifetime of the component.
 * The handler ref is kept fresh; binding survives socket reconnects and
 * re-binds automatically if the socket instance is replaced (token change).
 */
export function useSocketEvent<E = unknown>(
  event: string,
  handler: (payload: E) => void,
): void {
  const handlerRef = useRef(handler)
  useEffect(() => { handlerRef.current = handler }) // keep fresh without re-binding
  useEffect(() => {
    const receive = (...args: unknown[]) => {
      handlerRef.current((args.length <= 1 ? args[0] : args) as E)
    }
    let bound: Socket | null = null
    const bind = (s: Socket | null) => {
      if (bound === s) return
      if (bound) bound.off(event, receive)
      bound = s
      if (s) s.on(event, receive)
    }
    bind(getChatSocket())
    const unwatch = watchSocket(bind)
    return () => {
      bind(null)
      unwatch()
    }
  }, [event])
}

// ---------------------------------------------------------------------------
// Auto-boot: connect as soon as an accessToken appears in the store (and tear
// down on logout). Runs once per browser session; every chat view imports this
// module, so mounting any of them activates real-time app-wide.
// ---------------------------------------------------------------------------
let booted = false
export function bootChat() {
  if (booted || typeof window === 'undefined') return
  booted = true
  const apply = (token: string | null) => {
    if (token) getChatSocket()
    else if (socket) {
      socket.disconnect()
      socket = null
      socketToken = null
      setStatus('idle')
      notifySocketListeners()
    }
  }
  apply(useAppStore.getState().accessToken)
  useAppStore.subscribe((state) => {
    if (state.accessToken !== socketToken && (state.accessToken || socket)) apply(state.accessToken)
  })
}
bootChat()
