// Verification email — sent after signup so users can confirm their email address.
// Non-blocking: the user can use the app immediately, but we nudge them to verify.

const FROM = process.env.EMAIL_FROM ?? 'WorkoutPartna <noreply@fan2seeproductions.com>'
const SUBJECT = 'Verify your WorkoutPartna email'

const html = (firstName: string, verifyUrl: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0d0d;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

          <tr>
            <td style="padding:36px 36px 8px 36px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg,#b91010 0%,#dc1616 100%);width:56px;height:56px;border-radius:14px;text-align:center;vertical-align:middle;color:#ffffff;font-weight:900;font-size:22px;">WP</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 36px 8px 36px;text-align:center;">
              <div style="font-size:40px;margin-bottom:8px;">🔒</div>
              <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;line-height:1.2;">
                Verify your email${firstName ? `, ${firstName}` : ''}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 36px 28px 36px;text-align:center;">
              <p style="margin:0;font-size:15px;line-height:1.65;color:rgba(255,255,255,0.7);">
                Click the button below to confirm your email address and keep your WorkoutPartna account secure. This link expires in <strong style="color:#ffffff;">24 hours</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 36px 32px 36px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg,#b91010 0%,#dc1616 100%);border-radius:9999px;box-shadow:0 8px 24px -6px rgba(220,22,22,0.5);">
                    <a href="${verifyUrl}" target="_blank" style="display:inline-block;padding:16px 44px;font-size:16px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:9999px;">
                      ✓ Verify My Email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 36px 8px 36px;">
              <div style="height:1px;background-color:rgba(255,255,255,0.08);"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 36px 28px 36px;text-align:center;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(255,255,255,0.35);">
                Didn't create a WorkoutPartna account? Ignore this email — nothing will happen.<br><br>
                If the button above doesn't work, copy this link into your browser:<br>
                <a href="${verifyUrl}" style="color:rgba(220,22,22,0.8);word-break:break-all;">${verifyUrl}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 36px 24px 36px;text-align:center;">
              <p style="margin:0;font-size:11px;line-height:1.7;color:rgba(255,255,255,0.25);">
                © WorkoutPartna · Built for Houston · <a href="https://workoutpartna.com" style="color:rgba(255,255,255,0.35);text-decoration:none;">workoutpartna.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

const text = (firstName: string, verifyUrl: string) =>
  `Verify your WorkoutPartna email${firstName ? `, ${firstName}` : ''}.

Click the link below to confirm your email address. It expires in 24 hours.

${verifyUrl}

Didn't sign up? Ignore this email.

— WorkoutPartna · workoutpartna.com`

export async function sendVerificationEmail(opts: {
  toEmail: string
  firstName?: string | null
  verifyUrl: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || !opts.toEmail) return
  const first = (opts.firstName ?? '').trim().split(/\s+/)[0] ?? ''
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [opts.toEmail],
        subject: SUBJECT,
        html: html(first, opts.verifyUrl),
        text: text(first, opts.verifyUrl),
      }),
    })
  } catch {
    // best-effort — never block signup on email failure
  }
}
