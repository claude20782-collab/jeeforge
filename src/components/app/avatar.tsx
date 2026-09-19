'use client'
import { cn } from '@/lib/utils'

/** Initials-based generated avatar when avatarUrl is null. */
export function Avatar({ username, displayName, avatarUrl, size = 36, className }: {
  username?: string; displayName?: string | null; avatarUrl?: string | null; size?: number; className?: string
}) {
  const initials = (displayName || username || '?')
    .split(/[\s_]+/)
    .map(s => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const hue = [...(username ?? 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName || username || 'avatar'}
        width={size} height={size}
        className={cn('rounded-full object-cover', className)}
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      aria-label={`${displayName || username} avatar`}
      className={cn('flex shrink-0 select-none items-center justify-center rounded-full font-semibold', className)}
      style={{
        width: size, height: size, fontSize: size * 0.38,
        background: `linear-gradient(135deg, hsl(${hue} 45% 38%), hsl(${(hue + 40) % 360} 45% 30%))`,
        color: 'white',
      }}
    >
      {initials}
    </div>
  )
}
