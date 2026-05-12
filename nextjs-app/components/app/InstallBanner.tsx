'use client'

// Shows an "Add to Home Screen" prompt for iOS Safari users who haven't
// installed the app yet. Triggered after QR code scans and organic visits.
// Dismissed state is stored in sessionStorage so it only shows once per visit.

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export function InstallBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show on iOS Safari when NOT already running as a PWA
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|chromium|crios/i.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)

    if (!isIOS || !isSafari || isStandalone) return
    if (sessionStorage.getItem('install-dismissed')) return

    // Short delay so it doesn't appear immediately on load
    const t = setTimeout(() => setShow(true), 2500)
    return () => clearTimeout(t)
  }, [])

  if (!show) return null

  function dismiss() {
    sessionStorage.setItem('install-dismissed', '1')
    setShow(false)
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-2xl border border-white/20 bg-[#1a1a1a] shadow-2xl px-4 py-3.5 flex gap-3 items-start">
        {/* App icon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-square-1024.png"
          alt="WorkoutPartna"
          className="h-12 w-12 rounded-xl shrink-0 border border-white/10"
        />

        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-[14px]">Add to Home Screen</p>
          <p className="text-white/60 text-[12px] leading-snug mt-0.5">
            Tap the{' '}
            <span className="inline-flex items-center gap-0.5 text-white/80">
              share icon{' '}
              {/* iOS share icon approximation */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </span>{' '}
            at the bottom of Safari, then tap{' '}
            <span className="font-semibold text-white">"Add to Home Screen"</span>
          </p>
        </div>

        <button
          onClick={dismiss}
          className="shrink-0 text-white/40 hover:text-white/70 mt-0.5"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Downward arrow pointing to bottom bar */}
      <div className="flex justify-center mt-2">
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/20" />
      </div>
    </div>
  )
}
