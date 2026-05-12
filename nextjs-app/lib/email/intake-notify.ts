// Sends operator-facing notifications when a user completes any intake form
// (onboarding, AI Coach intake, trainer application, partner lead,
// consultation request, etc.). Always best-effort — never throws.
//
// ─── Recipient resolution (in priority order) ───────────────────────────────
//   1. Per-category override:   process.env[`LEAD_EMAIL_${category.toUpperCase()}`]
//      e.g. LEAD_EMAIL_BOOKINGS=bookings@fan2seeproductions.com
//   2. Global override:         process.env.LEAD_EMAIL  (preferred, new)
//   3. Legacy global override:  process.env.INTAKE_NOTIFICATION_TO  (back-compat)
//   4. Default fallback:        sales@fan2seeproductions.com, info@fan2seeproductions.com
//
// All env vars accept a comma-separated list of addresses.
//
// ─── Sender ─────────────────────────────────────────────────────────────────
//   Default: "WorkoutPartna <noreply@fan2seeproductions.com>"
//     - Display name "WorkoutPartna" matches the brand users signed up for
//     - Underlying domain is fan2seeproductions.com (the Resend-verified domain)
//   Override via env var EMAIL_FROM (preferred) or PARTNER_LEAD_EMAIL_FROM
//   (legacy, kept for back-compat).

const DEFAULT_RECIPIENTS = ['sales@fan2seeproductions.com', 'info@fan2seeproductions.com']
const DEFAULT_FROM = 'WorkoutPartna <noreply@fan2seeproductions.com>'

/** Categories let each form route to a different inbox without rewriting the helper. */
export type IntakeCategory =
  | 'general'
  | 'bookings'
  | 'support'
  | 'vendors'
  | 'trainers'
  | 'partners'
  | 'consultations'
  | 'onboarding'
  | 'coach'

function parseList(raw: string | undefined): string[] | null {
  if (!raw) return null
  const list = raw.split(',').map(s => s.trim()).filter(Boolean)
  return list.length > 0 ? list : null
}

function recipients(category: IntakeCategory = 'general'): string[] {
  // 1. Per-category override (e.g. LEAD_EMAIL_BOOKINGS)
  const perCategory = parseList(process.env[`LEAD_EMAIL_${category.toUpperCase()}`])
  if (perCategory) return perCategory

  // 2. Global override (new canonical env var)
  const global = parseList(process.env.LEAD_EMAIL)
  if (global) return global

  // 3. Legacy global override (back-compat)
  const legacy = parseList(process.env.INTAKE_NOTIFICATION_TO)
  if (legacy) return legacy

  // 4. Default fallback
  return DEFAULT_RECIPIENTS
}

function fromAddress(): string {
  return process.env.EMAIL_FROM
    ?? process.env.PARTNER_LEAD_EMAIL_FROM
    ?? DEFAULT_FROM
}

export type IntakeNotification = {
  /** Short label shown in subject line — e.g. "Onboarding complete" */
  kind: string
  /** Headline name for the user — display_name, email, or "(unknown user)" */
  who: string
  /** Routes to a per-category inbox if `LEAD_EMAIL_<CATEGORY>` is set. */
  category?: IntakeCategory
  /** Optional reply-to (so operators can hit Reply directly) */
  replyTo?: string
  /** Optional link to admin/CRM page */
  adminUrl?: string
  /** Key/value detail rows shown in the email body */
  fields: Array<{ label: string; value: string | number | string[] | null | undefined }>
}

function formatValue(v: string | number | string[] | null | undefined): string {
  if (v == null) return '—'
  if (Array.isArray(v)) return v.length > 0 ? v.join(', ') : '—'
  const s = String(v).trim()
  return s.length > 0 ? s : '—'
}

function buildText(n: IntakeNotification): string {
  const lines = [
    `New ${n.kind}`,
    `User: ${n.who}`,
    '',
    ...n.fields.map(f => `${f.label}: ${formatValue(f.value)}`),
  ]
  if (n.adminUrl) lines.push('', `Review: ${n.adminUrl}`)
  return lines.join('\n')
}

function buildHtml(n: IntakeNotification): string {
  const rows = n.fields
    .map(
      f => `
        <tr>
          <td style="padding:8px 16px 8px 0;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:rgba(255,255,255,0.5);width:35%;vertical-align:top;">${escapeHtml(f.label)}</td>
          <td style="padding:8px 0;font-size:14px;color:#ffffff;line-height:1.5;">${escapeHtml(formatValue(f.value))}</td>
        </tr>
      `,
    )
    .join('')

  const cta = n.adminUrl
    ? `
      <tr>
        <td style="padding:24px 28px 0 28px;text-align:center;">
          <a href="${n.adminUrl}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#b91010 0%,#dc1616 100%);color:#ffffff;text-decoration:none;border-radius:9999px;font-weight:700;font-size:14px;">Review in admin →</a>
        </td>
      </tr>`
    : ''

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0d0d;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:14px;">
        <tr><td style="padding:24px 28px 8px 28px;">
          <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#dc1616;">Workout Partna · Internal</p>
          <h2 style="margin:8px 0 4px 0;font-size:20px;font-weight:800;color:#ffffff;line-height:1.3;">${escapeHtml(`New ${n.kind}`)}</h2>
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.7);">User: <strong style="color:#ffffff;">${escapeHtml(n.who)}</strong></p>
        </td></tr>
        <tr><td style="padding:0 28px;"><div style="height:1px;background-color:rgba(255,255,255,0.08);margin:12px 0;"></div></td></tr>
        <tr><td style="padding:8px 28px 4px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
        </td></tr>
        ${cta}
        <tr><td style="padding:24px 28px 24px 28px;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);">Sent automatically when a user completes a form on workoutpartna.com.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export type IntakeNotifyResult =
  | { ok: true; to: string[]; messageId?: string }
  | { ok: false; reason: 'no_api_key' | 'no_recipients' | 'send_failed'; error?: string }

/**
 * Send an internal-ops notification to the configured intake recipients.
 * No-ops if RESEND_API_KEY is unset. Never throws — caller's flow continues.
 *
 * Logs to console in all cases (success, missing config, send failure) so the
 * Vercel function logs always tell you what happened.
 */
export async function notifyIntake(n: IntakeNotification): Promise<IntakeNotifyResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[intake-notify] RESEND_API_KEY missing — email not sent', {
      kind: n.kind,
      category: n.category ?? 'general',
    })
    return { ok: false, reason: 'no_api_key' }
  }

  const to = recipients(n.category ?? 'general')
  if (to.length === 0) {
    console.warn('[intake-notify] No recipients resolved — email not sent', {
      kind: n.kind,
      category: n.category ?? 'general',
    })
    return { ok: false, reason: 'no_recipients' }
  }
  const subject = `[WorkoutPartna] ${n.kind} — ${n.who}`
  const from = fromAddress()

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        ...(n.replyTo ? { reply_to: n.replyTo } : {}),
        subject,
        text: buildText(n),
        html: buildHtml(n),
      }),
    })

    if (!res.ok) {
      const errBody = await res.text().catch(() => '<no body>')
      console.error('[intake-notify] Resend returned non-2xx', {
        status: res.status,
        kind: n.kind,
        category: n.category ?? 'general',
        to,
        errBody: errBody.slice(0, 300),
      })
      return { ok: false, reason: 'send_failed', error: `HTTP ${res.status}: ${errBody.slice(0, 200)}` }
    }

    const data = (await res.json().catch(() => null)) as { id?: string } | null
    console.log('[intake-notify] sent', {
      kind: n.kind,
      category: n.category ?? 'general',
      to,
      from,
      messageId: data?.id,
    })
    return { ok: true, to, messageId: data?.id }
  } catch (err) {
    // best-effort — never block the user-facing flow on a flaky email send
    console.error('[intake-notify] send threw', {
      kind: n.kind,
      category: n.category ?? 'general',
      err: (err as Error).message,
    })
    return { ok: false, reason: 'send_failed', error: (err as Error).message }
  }
}
