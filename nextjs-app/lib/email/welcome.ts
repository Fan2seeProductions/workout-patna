// Welcome email sent once, via Resend, after a user confirms their email.
// Triggered from /auth/callback. Idempotent — checks profiles.welcomed_at
// before sending.

// Default uses fan2seeproductions.com because that's our currently Resend-verified
// domain. Display name is "WorkoutPartna" so users see the brand they signed up for.
// To send from @workoutpartna.com directly, verify that domain in Resend (requires
// DNS records at Name.com or migrating that domain to Cloudflare too).
const FROM = process.env.WELCOME_EMAIL_FROM ?? 'WorkoutPartna <noreply@fan2seeproductions.com>'

const SUBJECT = "Welcome to Workout Partna 💪 Let's find your Partna"

const html = (firstName: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Workout Partna</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0d0d;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

          <tr>
            <td style="padding:36px 36px 8px 36px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg,#b91010 0%,#dc1616 100%);width:56px;height:56px;border-radius:14px;text-align:center;vertical-align:middle;color:#ffffff;font-weight:900;font-size:22px;letter-spacing:-0.5px;">WP</td>
                </tr>
              </table>
              <p style="margin:14px 0 0 0;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#dc1616;">Workout Partna</p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 36px 8px 36px;">
              <h1 style="margin:0;font-size:30px;font-weight:900;color:#ffffff;line-height:1.15;letter-spacing:-0.5px;">
                Welcome${firstName ? `, ${firstName}` : ''}.<br>
                <span style="background:linear-gradient(135deg,#dc1616 0%,#ff4444 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;">Your Partna is waiting.</span>
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 36px 24px 36px;">
              <p style="margin:0;font-size:15px;line-height:1.65;color:rgba(255,255,255,0.75);">
                You're in. No more skipped workouts, no more "I'll go tomorrow." Workout Partna matches you with people at <strong style="color:#ffffff;">your exact gym</strong> who train when you train, push the way you push, and actually show up.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 36px 28px 36px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg,#b91010 0%,#dc1616 100%);border-radius:9999px;box-shadow:0 8px 24px -6px rgba(220,22,22,0.5);">
                    <a href="https://workoutpartna.com/app/onboarding" target="_blank" style="display:inline-block;padding:16px 40px;font-size:16px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:9999px;">Find My Partna →</a>
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
            <td style="padding:24px 36px 8px 36px;">
              <p style="margin:0;font-size:13px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.5);">3 minutes to set up</p>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 36px 24px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:top;width:36px;">
                          <div style="width:28px;height:28px;border-radius:8px;background-color:rgba(220,22,22,0.15);border:1px solid rgba(220,22,22,0.4);text-align:center;line-height:28px;font-size:13px;font-weight:900;color:#dc1616;">1</div>
                        </td>
                        <td style="vertical-align:top;padding-left:12px;">
                          <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;line-height:1.4;">Pick your gym</p>
                          <p style="margin:2px 0 0 0;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.5;">Search your gym, apartment fitness center, or community space.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:top;width:36px;">
                          <div style="width:28px;height:28px;border-radius:8px;background-color:rgba(220,22,22,0.15);border:1px solid rgba(220,22,22,0.4);text-align:center;line-height:28px;font-size:13px;font-weight:900;color:#dc1616;">2</div>
                        </td>
                        <td style="vertical-align:top;padding-left:12px;">
                          <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;line-height:1.4;">Tell us your goals & schedule</p>
                          <p style="margin:2px 0 0 0;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.5;">Strength, weight loss, endurance — and when you actually train.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:top;width:36px;">
                          <div style="width:28px;height:28px;border-radius:8px;background-color:rgba(220,22,22,0.15);border:1px solid rgba(220,22,22,0.4);text-align:center;line-height:28px;font-size:13px;font-weight:900;color:#dc1616;">3</div>
                        </td>
                        <td style="vertical-align:top;padding-left:12px;">
                          <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;line-height:1.4;">Match & message</p>
                          <p style="margin:2px 0 0 0;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.5;">Browse Partnas at your gym, send a request, lock in your next session.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 36px 24px 36px;">
              <div style="background:linear-gradient(135deg,rgba(220,22,22,0.12) 0%,rgba(220,22,22,0.04) 100%);border:1px solid rgba(220,22,22,0.25);border-radius:14px;padding:18px 20px;">
                <p style="margin:0 0 4px 0;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#dc1616;">🎁 Bonus</p>
                <p style="margin:0;font-size:14px;line-height:1.55;color:#ffffff;">
                  Try the AI Daily Coach <strong>free for ~30 days</strong> with code <span style="background-color:rgba(255,255,255,0.1);padding:2px 8px;border-radius:6px;font-family:'SF Mono',Monaco,Menlo,monospace;font-weight:700;letter-spacing:1px;">PARTNA14</span> at checkout. Personalized workouts, every morning.
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 36px 32px 36px;text-align:center;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(255,255,255,0.4);">
                Questions? Reply to this email — a real person reads every one.
              </p>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;margin-top:18px;">
          <tr>
            <td style="padding:0 36px;text-align:center;">
              <p style="margin:0;font-size:11px;line-height:1.7;color:rgba(255,255,255,0.35);">
                © Workout Partna · Built for Houston · <a href="https://workoutpartna.com" style="color:rgba(255,255,255,0.5);text-decoration:none;">workoutpartna.com</a><br>
                You're receiving this because you signed up for an account.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`

const text = (firstName: string) => `Welcome${firstName ? `, ${firstName}` : ''} to Workout Partna.

Your Partna is waiting.

Workout Partna matches you with people at your exact gym who train when you train.

Get started in 3 minutes:
  1. Pick your gym
  2. Tell us your goals & schedule
  3. Match & message your Partna

Start here: https://workoutpartna.com/app/onboarding

🎁 Bonus: Try the AI Daily Coach free for ~30 days. Use code PARTNA14 at checkout.

Questions? Reply to this email — a real person reads every one.

—
© Workout Partna · workoutpartna.com`

/**
 * Send the branded welcome email via Resend. No-ops if RESEND_API_KEY is unset
 * (so local dev doesn't fail signup). Never throws — caller's flow continues
 * regardless of email-delivery state.
 */
export async function sendWelcomeEmail(opts: {
  toEmail: string
  firstName?: string | null
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
        html: html(first),
        text: text(first),
      }),
    })
  } catch {
    // best-effort — don't fail signup on a flaky network call
  }
}
