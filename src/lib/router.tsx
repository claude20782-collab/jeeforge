'use client'
import { useEffect, useState, useCallback } from 'react'

export interface Route { path: string; params: Record<string, string> }

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [pathPart, queryPart] = raw.split('?')
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`
  const params: Record<string, string> = {}
  if (queryPart) {
    for (const [k, v] of new URLSearchParams(queryPart).entries()) params[k] = v
  }
  const segs = path.split('/').filter(Boolean)
  if (segs.length >= 2) params[segs[0]] = segs[1] // e.g. /mock/:id → params.mock
  return { path, params }
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? { path: '/', params: {} } : parseHash()
  )
  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function navigate(to: string) {
  const target = to.startsWith('#') ? to : `#${to.startsWith('/') ? to : `/${to}`}`
  if (window.location.hash === target) {
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    window.location.hash = target
  }
}

export function useNavigate() {
  return useCallback((to: string) => navigate(to), [])
}

export function Link({
  to, children, className, onClick, ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const href = to.startsWith('#') ? to : `#${to.startsWith('/') ? to : `/${to}`}`
  return (
    <a href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  )
}
