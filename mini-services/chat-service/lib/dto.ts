// Maps DB rows → wire DTOs. Shapes are EXACT copies of ChatMessageDTO /
// NotificationDTO from the root project's src/lib/types.ts (frozen contract —
// do not change without orchestrator approval). Duplicated locally because this
// is a standalone bun project that must not import from the Next.js app.
import type { DirectMessage, GroupMessage, Notification, Prisma } from '@prisma/client'

type DbUser = { username: string; displayName: string | null; avatarUrl: string | null }

export interface ChatMessageDTO {
  id: string
  groupId?: string
  conversationId?: string
  sender: { username: string; displayName: string | null; avatarUrl: string | null }
  content: string
  replyTo: { id: string; sender: string; content: string } | null
  createdAt: string
  deleted: boolean
  readAt: string | null // DM only
}

export type NotificationType =
  | 'GROUP_MESSAGE'
  | 'DIRECT_MESSAGE'
  | 'MENTION'
  | 'GROUP_ACTIVITY'
  | 'MOCK_ANNOUNCEMENT'
  | 'SYSTEM'
  | 'REPORT_STATUS'

export interface NotificationDTO {
  id: string
  type: NotificationType
  title: string
  body: string | null
  link: string | null
  readAt: string | null
  createdAt: string
}

export const DELETED_MESSAGE_TEXT = 'message removed by moderator'

export function toGroupMessageDTO(
  msg: GroupMessage,
  sender: DbUser,
  replyTo: { id: string; username: string; content: string } | null,
): ChatMessageDTO {
  const deleted = msg.deletedAt !== null
  return {
    id: msg.id,
    groupId: msg.groupId,
    sender: { username: sender.username, displayName: sender.displayName, avatarUrl: sender.avatarUrl },
    content: deleted ? DELETED_MESSAGE_TEXT : msg.content,
    replyTo: replyTo ? { id: replyTo.id, sender: replyTo.username, content: replyTo.content } : null,
    createdAt: msg.createdAt.toISOString(),
    deleted,
    readAt: null,
  }
}

export function toDirectMessageDTO(msg: DirectMessage, sender: DbUser): ChatMessageDTO & { conversationId: string } {
  const deleted = msg.deletedAt !== null
  return {
    id: msg.id,
    conversationId: msg.conversationId,
    sender: { username: sender.username, displayName: sender.displayName, avatarUrl: sender.avatarUrl },
    content: deleted ? DELETED_MESSAGE_TEXT : msg.content,
    replyTo: null,
    createdAt: msg.createdAt.toISOString(),
    deleted,
    readAt: msg.readAt ? msg.readAt.toISOString() : null,
  }
}

export function toNotificationDTO(n: Notification): NotificationDTO {
  return {
    id: n.id,
    type: n.type as NotificationType,
    title: n.title,
    body: n.body,
    link: n.link,
    readAt: n.readAt ? n.readAt.toISOString() : null,
    createdAt: n.createdAt.toISOString(),
  }
}

export type NotificationCreateData = Prisma.NotificationUncheckedCreateInput

/** @username mentions: lowercase, unique, 3–20 chars of [a-z0-9_] (matches registerSchema). */
export function extractMentions(content: string, excludeUsername?: string): string[] {
  const out = new Set<string>()
  for (const m of content.matchAll(/@([a-z0-9_]{3,20})/gi)) {
    const username = m[1].toLowerCase()
    if (username !== excludeUsername) out.add(username)
  }
  return Array.from(out)
}

export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, Math.max(0, max - 1))}…` : text
}
