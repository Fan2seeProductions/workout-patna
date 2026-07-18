// Last-resort boundary: catches errors thrown in the root layout itself, which
// the segment-level error.tsx can't reach. Must render its own <html>/<body>
// because it replaces the whole document. Kept minimal and self-contained (no
// shared layout, fonts, or CSS are guaranteed to be available here).
'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global error boundary]', error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0d0d',
          color: '#fff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Something went wrong.</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginTop: 12 }}>
            WorkoutPartna hit an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 28,
              height: 48,
              padding: '0 28px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              background: 'linear-gradient(135deg, #b91010 0%, #dc1616 100%)',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
