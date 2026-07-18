// Route-segment error boundary. Catches uncaught render/runtime errors in any
// page (outside the root layout) and shows a branded recovery screen with a
// retry, instead of Next.js's raw default error page.
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface to logs (Vercel captures console.error server- and client-side).
    console.error('[app error boundary]', error)
  }, [error])

  return (
    <main className="min-h-dvh bg-[#0d0d0d] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div
          className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(220,22,22,0.12)', border: '1px solid rgba(220,22,22,0.4)' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff5555" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>
        <h1 className="mt-6 text-[24px] sm:text-[28px] font-extrabold tracking-tight">
          Something went wrong.
        </h1>
        <p className="mt-3 text-[15px] text-white/60 leading-relaxed">
          We hit an unexpected error. Try again — if it keeps happening, head back home and
          give it a minute.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="h-12 px-7 rounded-full text-white font-bold text-[15px] inline-flex items-center"
            style={{ background: 'linear-gradient(135deg, #b91010 0%, #dc1616 100%)' }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="h-12 px-7 rounded-full border border-white/15 bg-white/[0.04] text-white font-bold text-[15px] inline-flex items-center hover:bg-white/[0.08] transition"
          >
            Back to home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-[11px] text-white/25">Reference: {error.digest}</p>
        )}
      </div>
    </main>
  )
}
