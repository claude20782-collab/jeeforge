'use client'
// Shared centered layout for auth views (login / signup / forgot / reset) — agent C.

import { Link } from '@/lib/router'
import { Card } from '@/components/ui/card'

export function AuthShell({
  title, description, children, footer,
}: {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="relative isolate flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full opacity-60"
          style={{ background: 'radial-gradient(closest-side, color-mix(in oklch, var(--gold) 10%, transparent), transparent)' }} />
      </div>

      <Link to="/" className="mb-6 flex items-center gap-2 font-bold tracking-tight" aria-label="Back to JEEForge home">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-base font-black text-primary-foreground">J</span>
        <span className="text-xl">JEE<span className="gold-gradient-text">Forge</span></span>
      </Link>

      <Card className="w-full max-w-md rounded-2xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {children}
      </Card>

      {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  )
}
