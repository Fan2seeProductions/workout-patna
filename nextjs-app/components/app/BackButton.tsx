// Reusable back button. Uses browser history when available, falls back to a
// specified href when the user landed directly on the page. Matches the
// existing app's circular icon-button style (used on /app/coach, /app/messages,
// /app/notifications, etc).
'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BackIcon } from './icons'

interface Props {
  /** Where to go if there's no history to go back to. Defaults to /app/home. */
  fallbackHref?: string
  /** Optional accessible label override. Defaults to "Back". */
  label?: string
  /** Force a Link (no router.back()). Useful when you always want a fixed destination. */
  forceFallback?: boolean
  /** Extra classes appended to the default style. */
  className?: string
}

const DEFAULT_CLASS =
  'h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85 hover:bg-white/[0.08] transition'

export function BackButton({
  fallbackHref = '/app/home',
  label = 'Back',
  forceFallback = false,
  className = '',
}: Props) {
  const router = useRouter()

  if (forceFallback) {
    return (
      <Link
        href={fallbackHref}
        aria-label={label}
        className={`${DEFAULT_CLASS} ${className}`}
      >
        <BackIcon width={18} height={18} />
      </Link>
    )
  }

  function go() {
    // If the user came from another page in this app, history.length > 1.
    // Otherwise, send them to the fallback (often /app/home).
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <button
      type="button"
      onClick={go}
      aria-label={label}
      className={`${DEFAULT_CLASS} ${className}`}
    >
      <BackIcon width={18} height={18} />
    </button>
  )
}
