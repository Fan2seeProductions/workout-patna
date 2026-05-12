// Admin notification emails — sent to the WorkoutPartna owner/team
// whenever a notable event happens (new signup, etc.).

const FROM = process.env.EMAIL_FROM ?? 'WorkoutPartna <noreply@fan2seeproductions.com>'

function adminRecipients(): string[] {
  const raw = process.env.LEAD_EMAIL ?? 'sales@fan2seeproductions.com'
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}

// ── New signup notification ────────────────────────────────────────────────

const signupHtml = (opts: {
  name: string
  email: string
  provider: string
  profileUrl: string
  totalUsers: number
}) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

        <tr>
          <td style="background:linear-gradient(135deg,#b91010,#dc1616);padding:20px 24px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">WorkoutPartna</p>
            <h1 style="margin:4px 0 0;font-size:20px;font-weight:900;color:#fff;">🎉 New Member Joined!</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
              <tr>
                <td style="padding:16px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 0;font-size:13px;color:#6b7280;width:80px;">Name</td>
                      <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;">${opts.name}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-size:13px;color:#6b7280;">Email</td>
                      <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;">${opts.email}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-size:13px;color:#6b7280;">Signed up</td>
                      <td style="padding:6px 0;font-size:13px;font-weight:700;color:#111827;">${opts.provider === 'google' ? '🔵 Google' : '📧 Email / Password'}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-size:13px;color:#6b7280;">Total users</td>
                      <td style="padding:6px 0;font-size:13px;font-weight:700;color:#dc1616;">${opts.totalUsers} members</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table cellpadding="0" cellspacing="0" style="margin:20px auto 0;">
              <tr>
                <td style="background:#dc1616;border-radius:8px;">
                  <a href="${opts.profileUrl}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#fff;text-decoration:none;">View Profile →</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px 20px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9ca3af;">WorkoutPartna · workoutpartna.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

export async function sendAdminSignupNotification(opts: {
  name: string
  email: string
  userId: string
  provider: string
  totalUsers?: number
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const to = adminRecipients()
  if (!to.length) return

  const profileUrl = `https://workoutpartna.com/app/profile/${opts.userId}`
  const totalUsers = opts.totalUsers ?? 0

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to,
        subject: `🎉 New member: ${opts.name || opts.email} joined WorkoutPartna`,
        html: signupHtml({ ...opts, profileUrl, totalUsers }),
        text: `New WorkoutPartna member!\n\nName: ${opts.name}\nEmail: ${opts.email}\nMethod: ${opts.provider}\nTotal users: ${totalUsers}\n\nView profile: ${profileUrl}`,
      }),
    })
  } catch {
    // best-effort
  }
}
