// SMS utility — powered by Telnyx (api.telnyx.com).
// No SDK package needed; uses native fetch.
//
// Required env vars in Vercel → Settings → Environment Variables:
//   TELNYX_API_KEY       — from console.telnyx.com → API Keys
//   TELNYX_FROM_NUMBER   — your Telnyx number, e.g. +12815551234
//
// All calls are best-effort and never throw — a failed SMS never blocks the
// user's request.

export async function sendSms(to: string, body: string): Promise<void> {
  const apiKey = process.env.TELNYX_API_KEY
  const from   = process.env.TELNYX_FROM_NUMBER

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[sms] Telnyx env vars not set — SMS skipped')
    }
    return
  }

  try {
    const res = await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, text: body }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[sms] Telnyx error:', res.status, text)
    }
  } catch (err) {
    console.error('[sms] sendSms failed:', err)
  }
}

// ── Voice call ───────────────────────────────────────────────────────────────

/**
 * Call a member's phone and read their workout via TTS.
 * Telnyx fetches the TeXML from our /api/telnyx/voice webhook.
 *
 * Required env vars (in addition to TELNYX_API_KEY + TELNYX_FROM_NUMBER):
 *   TELNYX_CONNECTION_ID  — your TeXML App connection ID from Telnyx console
 *   NEXT_PUBLIC_SITE_URL  — your production URL, e.g. https://workoutpartna.com
 */
export async function sendVoiceWorkout(opts: {
  to: string
  userId: string
}): Promise<void> {
  const apiKey       = process.env.TELNYX_API_KEY
  const from         = process.env.TELNYX_FROM_NUMBER
  const connectionId = process.env.TELNYX_CONNECTION_ID
  const siteUrl      = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '')

  if (!apiKey || !from || !connectionId || !siteUrl) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[sms] Telnyx voice env vars not fully set — voice call skipped')
    }
    return
  }

  // Sign the uid so the TeXML webhook can't be replayed for arbitrary users
  // (the route returns the member's name + workout, so it must not be
  // fetchable by anyone who guesses a user id).
  const { createHmac } = await import('node:crypto')
  const tokenSecret = process.env.CRON_SECRET ?? apiKey
  const tok = createHmac('sha256', tokenSecret).update(opts.userId).digest('hex')
  const webhookUrl = `${siteUrl}/api/telnyx/voice?uid=${encodeURIComponent(opts.userId)}&tok=${tok}`

  try {
    const res = await fetch('https://api.telnyx.com/v2/calls', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connection_id: connectionId,
        to: opts.to,
        from,
        // TeXML mode: Telnyx fetches our webhook URL to control the call
        texml_application_id: connectionId,
        webhook_url: webhookUrl,
        webhook_url_method: 'GET',
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[voice] Telnyx call error:', res.status, text)
    }
  } catch (err) {
    console.error('[voice] sendVoiceWorkout failed:', err)
  }
}

// ── Canned messages ──────────────────────────────────────────────────────────

/**
 * Welcome text sent once when a member submits their first AI Coach intake.
 */
export function intakeWelcomeSms(opts: {
  firstName: string | null
  deliveryTime: string | null  // e.g. "07:00"
}): string {
  const name = opts.firstName?.split(' ')[0] ?? 'there'

  // Convert "07:00" → "7:00 AM"
  let timeStr = 'morning'
  if (opts.deliveryTime) {
    try {
      const [h, m] = opts.deliveryTime.split(':').map(Number)
      const ampm = h >= 12 ? 'PM' : 'AM'
      const hour12 = h % 12 || 12
      timeStr = `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
    } catch {
      // keep "morning"
    }
  }

  return (
    `Hey ${name}! 🏋️ You're all set with WorkoutPartna AI Coach.\n\n` +
    `Your personalized workout will be texted to you every day at ${timeStr}.\n\n` +
    `Reply STOP anytime to unsubscribe. Questions? Visit workoutpartna.com`
  )
}
