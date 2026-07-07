// Next.js middleware. Runs on every matched request.
// Refreshes Supabase session cookies before the page renders.
//
// NOTE: a www→apex canonical redirect was tried here and reverted — a 308
// permanent redirect can ping-pong against any stale apex→www redirect cached
// in a returning visitor's browser, producing an infinite loop. The
// apex↔www cookie split is instead handled by keeping checkout return URLs on
// the caller's own host (see api/stripe/checkout + api/merch/checkout). If a
// single canonical host is wanted later, do it at the Vercel domain level
// (set www to "Redirect to workoutpartna.com"), not in app code.
import type { NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Match every path except static assets, image optimizer, and favicon
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
