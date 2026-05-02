// Mobile bottom nav + desktop top header. Mirrors the Replit Navbar.
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home as HomeIcon, Trophy, Users, MessageCircle, User as UserIcon, Zap } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Logo } from './Logo'

type NavItem = { href: string; icon: typeof HomeIcon; label: string }

const navItems: NavItem[] = [
  { href: '/app/home',       icon: HomeIcon,      label: 'Home' },
  { href: '/app/challenges', icon: Trophy,        label: 'Challenges' },
  { href: '/app/browse',     icon: Users,         label: 'Find Patna' },
  { href: '/app/messages',   icon: MessageCircle, label: 'Messages' },
  { href: '/app/profile',    icon: UserIcon,      label: 'Profile' },
]

const HIDE_ON = new Set([
  '/app',
  '/app/signin',
  '/app/signup',
  '/app/onboarding',
  '/auth/callback',
])

export function Navbar({
  userInitial,
  userName,
  isPremium = false,
  onUpgradeClick,
}: {
  userInitial?: string
  userName?: string
  isPremium?: boolean
  onUpgradeClick?: () => void
} = {}) {
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
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[var(--color-card)] border-t border-[var(--color-border)] pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors',
                  active
                    ? 'text-[var(--color-secondary)]'
                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
                )}>
                  <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Desktop top nav */}
      <nav className="hidden md:flex fixed top-0 inset-x-0 z-50 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-6 h-16 items-center justify-between shadow-md">
        <Link href="/app/home" className="flex items-center gap-3">
          <Logo size={28} className="bg-white rounded-lg p-1" />
          <span className="font-display font-bold text-xl tracking-tight">Workout Partna</span>
        </Link>

        <div className="flex items-center gap-2">
          {navItems.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-full',
                  active
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5',
                )}>
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          {!isPremium && (
            <button
              type="button"
              onClick={onUpgradeClick}
              className="bg-[var(--color-secondary)] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:brightness-110 transition flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 fill-white" />
              Upgrade
            </button>
          )}
          <Link
            href="/app/profile"
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold relative cursor-pointer"
            title={userName ?? 'Profile'}
          >
            {(userInitial ?? userName?.[0] ?? '?').toUpperCase()}
            {isPremium && (
              <div className="absolute -bottom-1 -right-1 bg-[var(--color-secondary)] text-white text-[8px] font-bold px-1 rounded-full border border-[var(--color-primary)]">
                PRO
              </div>
            )}
          </Link>
        </div>
      </nav>

      {/* Spacer for desktop header */}
      <div className="hidden md:block h-16" />
    </>
  )
}
