// OAuth + email-confirm callback. Supabase redirects users here after
// Google sign-in or after they click the "Confirm" link in their email.
// We exchange the one-time code for a session (sets auth cookies on our
// domain), fire a one-time branded welcome email via Resend, then redirect
// to the app.
import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { sendWelcomeEmail } from '../../../lib/email/welcome'
import { sendAdminSignupNotification } from '../../../lib/email/admin-notify'

/**
 * Send the branded welcome email + admin notification exactly once per user,
 * gated on profiles.welcomed_at. Best-effort — never throws.
 */
async function maybeSendWelcomeEmail(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email: string | undefined,
) {
  if (!email) return
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, display_name, first_name, welcomed_at')
      .eq('id', userId)
      .maybeSingle()

    // Already welcomed — nothing to do.
    if (profile?.welcomed_at) return

    // Optimistically claim the welcome slot BEFORE sending so two simultaneous
    // callback invocations (rare) can't double-send.
    const stamp = new Date().toISOString()
    if (profile) {
      const { error } = await supabase
        .from('profiles')
        .update({ welcomed_at: stamp })
        .eq('id', userId)
        .is('welcomed_at', null)
      if (error) return // someone else got there first or RLS blocked us
    }

    const firstName =
      (profile?.first_name as string | undefined) ??
      (profile?.display_name as string | undefined)?.split(/\s+/)[0] ??
      null
    const displayName = (profile?.display_name as string | undefined) ?? firstName ?? email

    // Welcome email to the new user
    await sendWelcomeEmail({ toEmail: email, firstName })

    // Admin notification to the owner
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })

    await sendAdminSignupNotification({
      name: displayName ?? email,
      email,
      userId,
      provider: 'google',
      totalUsers: count ?? 0,
    })
  } catch {
    // Best-effort. Never block the auth redirect on email-delivery hiccups.
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  // Coach-first: post-signup/signin users land on the AI Coach paywall page,
  // which routes them to the trial CTA (or straight to today's workout if
  // they're already subscribed/trialing).
  //
  // `next` is attacker-controllable (it's a query param on a link we email),
  // so it MUST be sanitized to a same-origin path — otherwise values like
  // "@evil.com" or "//evil.com" turn "${origin}${next}" into an off-site
  // redirect (open-redirect / phishing bounce off our trusted domain).
  const rawNext = url.searchParams.get('next') ?? '/app/coach'
  const next =
    rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/app/coach'

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
      // Re-fetch the user from the new session and fire the welcome email.
      // Awaited so Vercel's serverless function doesn't get killed mid-flight,
      // but the call itself is best-effort and never throws.
      const { data: { user } } = await supabase.auth.getUser()
      if (user) await maybeSendWelcomeEmail(supabase, user.id, user.email)

      return NextResponse.redirect(`${origin}${next}`)
    }
    // Surface the error so the user gets a meaningful message
    return NextResponse.redirect(
      `${origin}/app/signin?error=${encodeURIComponent(error.message)}`,
    )
  }

  return NextResponse.redirect(`${origin}/app/signin?error=missing_code`)
}
