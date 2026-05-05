'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../lib/utils'

type NavItem = { href: string; label: string; icon: (active: boolean) => React.ReactNode }

const navItems: NavItem[] = [
  {
    href: '/app/home',
    label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    href: '/app/challenges',
    label: 'Challenges',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8M12 17v4M7 4H4a1 1 0 0 0-1 1v3a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V5a1 1 0 0 0-1-1h-3M7 4V2m10 2V2M7 4h10" />
      </svg>
    ),
  },
  {
    href: '/app/discover',
    label: 'Discover',
    icon: (_active) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    href: '/app/messages',
    label: 'Messages',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

export function Navbar({ userName, isPremium = false }: { userName?: string; isPremium?: boolean }) {
  const pathname = usePathname() ?? ''

  if (
    HIDE_ON.has(pathname) ||
    pathname.startsWith('/app/onboarding') ||
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

            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <div className="flex flex-col items-center justify-center h-full gap-1">
                  {isDiscover ? (
                    /* Center discover button — elevated pill */
                    <div className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all',
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
                          ? 'bg-[var(--color-primary)]/12 text-[var(--color-primary)]'
                          : 'text-[var(--color-muted-foreground)]'
                      )}>
                        {item.icon(active)}
                      </div>
                      <span className={cn(
                        'text-[10px] font-bold tracking-tight transition-colors',
                        active ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted-foreground)]'
                      )}>
                        {item.label}
                      </span>
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
        <Link href="/app/home" className="flex items-center gap-2 font-extrabold text-[16px] text-white">
          <div className="w-7 h-7 rounded-lg brand-gradient flex items-center justify-center text-white font-black text-[11px]">WP</div>
          WorkoutPartna
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex items-center gap-1.5 text-[13px] font-bold transition-all px-3.5 py-2 rounded-full',
                  active
                    ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                    : 'text-white/50 hover:text-white'
                )}>
                  {item.icon(active)}
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
