'use server'

import { randomUUID } from 'crypto'
import { createClient } from '../supabase/server'
import { sendVerificationEmail } from '../email/verify'
import { sendWelcomeEmail } from '../email/welcome'
import { sendAdminSignupNotification } from '../email/admin-notify'

function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

/**
 * Called immediately after a new email/password signup.
 * 1. Sends the branded welcome email (once, gated on welcomed_at).
 * 2. Sends an admin notification so the owner knows a new member joined.
 * 3. Generates a verification token and sends the security verification email.
 */
export async function sendEmailVerification(): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, error: 'Not signed in' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('email_verified_at, email_verify_token, display_name, first_name, welcomed_at')
      .eq('id', user.id)
      .maybeSingle()

    const firstName =
      (profile?.first_name as string | undefined) ??
      (profile?.display_name as string | undefined)?.split(/\s+/)[0] ??
      null
    const displayName = (profile?.display_name as string | undefined) ?? firstName ?? user.email ?? 'New member'

    // ── 1. Welcome email (once) ──────────────────────────────────────
    if (!profile?.welcomed_at) {
      // Claim the slot first to prevent double-sends
      await supabase
        .from('profiles')
        .update({ welcomed_at: new Date().toISOString() })
        .eq('id', user.id)
        .is('welcomed_at', null)

      await sendWelcomeEmail({ toEmail: user.email ?? '', firstName })

      // ── 2. Admin notification (only on first welcome) ──────────────
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })

      await sendAdminSignupNotification({
        name: displayName,
        email: user.email ?? '',
        userId: user.id,
        provider: 'email',
        totalUsers: count ?? 0,
      })
    }

    // ── 3. Verification email (skip if already verified) ─────────────
    if (profile?.email_verified_at) return { ok: true }

    const token = randomUUID()
    await supabase
      .from('profiles')
      .update({ email_verify_token: token })
      .eq('id', user.id)

    const verifyUrl = `${siteUrl()}/api/verify-email?token=${token}&uid=${user.id}`

    await sendVerificationEmail({
      toEmail: user.email ?? '',
      firstName,
      verifyUrl,
    })

    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
