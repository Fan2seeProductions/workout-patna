// Public marketing-site navigation. Sits on every non-app page.
// Coach-first nav: B2B (apartments) and trainers links are intentionally
// dropped — those pages still resolve by URL but aren't surfaced here.
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '../app/Logo'

// "How it works" lives inside /about, so we link there once as "How it
// works" (the more product-relevant label) rather than listing both.
const links = [
  { href: '/about',   label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/safety',  label: 'Safety' },
]

export function PublicNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0d0d0d]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="WorkoutPartna home">
          <Logo size={32} withWordmark />
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[14px] font-semibold text-white/60 hover:text-white transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/app/signin"
            className="px-3 py-2 text-[13px] font-semibold text-white/60 hover:text-white transition"
          >
            Sign in
          </Link>
          <Link
            href="/app/signup"
            className="px-4 py-2 rounded-full brand-gradient text-white text-[13px] font-bold shadow-glow"
          >
            Try free for 14 days
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className="md:hidden h-9 w-9 rounded-lg flex items-center justify-center text-white/70"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/[0.07] bg-[#0d0d0d]">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-[15px] font-semibold text-white/70"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href="/app/signin"
                onClick={() => setOpen(false)}
                className="h-11 rounded-full border border-white/15 flex items-center justify-center text-[14px] font-semibold text-white/70"
              >
                Sign in
              </Link>
              <Link
                href="/app/signup"
                onClick={() => setOpen(false)}
                className="h-11 rounded-full brand-gradient flex items-center justify-center text-[14px] font-bold text-white"
              >
                Try free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
