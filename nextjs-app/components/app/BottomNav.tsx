// 5-tab bottom navigation for the main app shell.
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Tab = {
  href: string
  label: string
  icon: (active: boolean) => React.ReactNode
}

const stroke = (active: boolean) => (active ? 'currentColor' : 'currentColor')

const HomeIcon = (active: boolean) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke(active)} strokeWidth={active ? 2.4 : 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
  </svg>
)

const HeartIcon = (active: boolean) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke={stroke(active)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const SearchIcon = (active: boolean) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke(active)} strokeWidth={active ? 2.4 : 2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const TrophyIcon = (active: boolean) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={stroke(active)} strokeWidth={active ? 2.4 : 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <path d="M17 5h3a2 2 0 0 1 0 4h-3" />
    <path d="M7 5H4a2 2 0 0 0 0 4h3" />
  </svg>
)

const UserIcon = (active: boolean) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke={stroke(active)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
)

const tabs: Tab[] = [
  { href: '/app/home',       label: 'Home',       icon: HomeIcon },
  { href: '/app/matches',    label: 'Matches',    icon: HeartIcon },
  { href: '/app/discover',   label: 'Discover',   icon: SearchIcon },
  { href: '/app/challenges', label: 'Challenges', icon: TrophyIcon },
  { href: '/app/profile',    label: 'Profile',    icon: UserIcon },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {tabs.map(({ href, label, icon }) => {
          const active = pathname === href || pathname?.startsWith(href + '/')
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 transition ${
                  active
                    ? 'text-[var(--color-brand-bright)]'
                    : 'text-[var(--color-text-dim)] hover:text-[var(--color-text-muted)]'
                }`}
              >
                {icon(!!active)}
                <span className="text-[11px] font-medium leading-none">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
