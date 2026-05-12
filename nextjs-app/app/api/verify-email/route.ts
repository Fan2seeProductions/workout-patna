// GET /api/verify-email?token=UUID&uid=USER_ID
// Validates the token and stamps email_verified_at on the profile.
// Redirects to /app/home with a success flag on success,
// or to /app/home with an error flag on failure.
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const uid   = searchParams.get('uid')

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://workoutpartna.com'

  if (!token || !uid) {
    return NextResponse.redirect(`${base}/app/home?verified=invalid`)
  }

  const supabase = await createClient()

  // Look up the profile by uid + token
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email_verified_at, email_verify_token')
    .eq('id', uid)
    .maybeSingle()

  if (!profile) {
    return NextResponse.redirect(`${base}/app/home?verified=invalid`)
  }

  // Already verified — just redirect with success
  if (profile.email_verified_at) {
    return NextResponse.redirect(`${base}/app/home?verified=already`)
  }

  // Wrong token
  if (profile.email_verify_token !== token) {
    return NextResponse.redirect(`${base}/app/home?verified=invalid`)
  }

  // Stamp verified and clear the token
  await supabase
    .from('profiles')
    .update({ email_verified_at: new Date().toISOString(), email_verify_token: null })
    .eq('id', uid)

  return NextResponse.redirect(`${base}/app/home?verified=1`)
}
