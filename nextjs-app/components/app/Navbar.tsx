'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../lib/utils'

type NavItem = { href: string; label: string; icon: (active: boolean) => React.ReactNode }

// Coach-first nav. The social tabs (Matches, Discover, Messages) still
// work via direct URL (so existing matches/threads don't break) but
// aren't surfaced here. To bring them back, restore the old items below.
const navItems: NavItem[] = [
  {
    href: '/app/coach',
    label: 'Coach',
    icon: (active) => (
      // Brain / spark icon — matches the AI Coach paywall iconography
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.5a3 3 0 0 0-3 3v1a3 3 0 0 0 1 2.236V13a3 3 0 0 0 1 2.236V17a3 3 0 0 0 3 3h1.5a2.5 2.5 0 0 0 2.5-2.5V4.5A2.5 2.5 0 0 0 9.5 2Z" />
        <path d="M14.5 2a2.5 2.5 0 0 1 2.5 2.5v.5a3 3 0 0 1 3 3v1a3 3 0 0 1-1 2.236V13a3 3 0 0 1-1 2.236V17a3 3 0 0 1-3 3H13" />
      </svg>
    ),
  },
  {
    href: '/app/workouts',
    label: 'Library',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      </svg>
    ),
  },
  {
    href: '/app/coach/intake',
    label: 'Plan',
    icon: (active) => (
      // Settings/sliders — your training plan & preferences
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
        <circle cx="9" cy="6" r="2" fill={active ? 'currentColor' : 'var(--color-background)'} />
        <circle cx="15" cy="12" r="2" fill={active ? 'currentColor' : 'var(--color-background)'} />
        <circle cx="7" cy="18" r="2" fill={active ? 'currentColor' : 'var(--color-background)'} />
      </svg>
    ),
  },
  {
    href: '/app/profile',
    label: 'Profile',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} />
      </svg>
    ),
  },
]

const HIDE_ON = new Set([
  '/app',
  '/app/signin',
  '/app/signup',
  '/app/onboarding',
  '/auth/callback',
])

export function Navbar({
  userName,
  isPremium = false,
  unreadMessages = 0,
}: {
  userName?: string
  isPremium?: boolean
  unreadMessages?: number
}) {
  const pathname = usePathname() ?? ''

  if (
    HIDE_ON.has(pathname) ||
    pathname.startsWith('/app/onboarding') ||
    pathname.startsWith('/app/auth') ||
    pathname === '/' ||
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname === '/waiver'
  ) return null

  return (
    <>
      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0d0d0d] border-t border-[var(--color-border)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-[60px] px-2">
          {navItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            const isDiscover = item.href === '/app/discover'
            const isMessages = item.href === '/app/messages'

            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <div className="relative flex flex-col items-center justify-center h-full gap-1">
                  {isDiscover ? (
                    /* Center discover button — elevated pill */
                    <div className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-[0_0_20px_rgba(220,22,22,0.4)]',
                      active
                        ? 'brand-gradient text-white shadow-lg shadow-[var(--color-primary)]/30'
                        : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    )}>
                      {item.icon(active)}
                    </div>
                  ) : (
                    <>
                      <div className={cn(
                        'flex items-center justify-center w-10 h-8 rounded-xl transition-all',
                        active
                          ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                          : 'text-[var(--color-muted-foreground)]'
                      )}>
                        {isMessages ? (
                          <div className="relative">
                            {item.icon(active)}
                            {unreadMessages > 0 && (
                              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--color-primary)] text-white text-[8px] font-extrabold flex items-center justify-center">
                                {unreadMessages > 9 ? '9+' : unreadMessages}
                              </span>
                            )}
                          </div>
                        ) : (
                          item.icon(active)
                        )}
                      </div>
                      <span className={cn(
                        'text-[10px] font-bold tracking-tight transition-colors',
                        active ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'
                      )}>
                        {item.label}
                      </span>
                      {active && <span className="absolute bottom-1 h-1 w-4 rounded-full bg-[var(--color-primary)]" />}
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ── Desktop top nav ── */}
      <nav className="hidden md:flex fixed top-0 inset-x-0 z-50 bg-[#0d0d0d] border-b border-[var(--color-border)] px-6 h-14 items-center justify-between">
        <Link href="/app/coach" className="flex items-center gap-2 font-extrabold text-[16px] text-white">
          <div className="w-7 h-7 rounded-lg brand-gradient flex items-center justify-center text-white font-black text-[11px]">WP</div>
          WorkoutPartna
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            const isMessages = item.href === '/app/messages'
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex items-center gap-1.5 text-[13px] font-bold transition-all px-3.5 py-2 rounded-full',
                  active
                    ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                    : 'text-white/50 hover:text-white'
                )}>
                  {isMessages ? (
                    <div className="relative">
                      {item.icon(active)}
                      {unreadMessages > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--color-primary)] text-white text-[8px] font-extrabold flex items-center justify-center">
                          {unreadMessages > 9 ? '9+' : unreadMessages}
                        </span>
                      )}
                    </div>
                  ) : (
                    item.icon(active)
                  )}
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <Link href="/app/profile" className="h-8 w-8 rounded-full brand-gradient flex items-center justify-center text-white font-extrabold text-[12px]">
          {(userName?.[0] ?? '?').toUpperCase()}
        </Link>
      </nav>

      <div className="hidden md:block h-14" />
    </>
  )
}
