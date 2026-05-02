// OAuth callback. Supabase redirects users here after Google sign-in
// with a one-time `code` query param. We exchange the code for a session
// (which sets the auth cookies on our domain) then redirect to the app.
import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/app/home'

  // Use the host the user came in on so cookies stick to the right domain
  // (workoutpartna.com vs workout-patna.vercel.app vs localhost).
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : url.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    // Surface the error so the user gets a meaningful message
    return NextResponse.redirect(
      `${origin}/app/signin?error=${encodeURIComponent(error.message)}`,
    )
  }

  return NextResponse.redirect(`${origin}/app/signin?error=missing_code`)
}
