// Next.js middleware. Runs on every matched request.
// 1. Canonicalizes www → apex so there is a SINGLE cookie domain. Supabase
//    auth cookies are host-only, so serving the app on both www and apex
//    splits sessions — logging in on one and landing on the other (e.g. after
//    a Stripe redirect) drops the session and bounces the user to sign-in.
// 2. Refreshes Supabase session cookies before the page renders.
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')
  if (host && host.startsWith('www.')) {
    const url = request.nextUrl.clone()
    url.host = host.slice(4) // drop "www."
    return NextResponse.redirect(url, 308)
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Match every path except static assets, image optimizer, and favicon
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
