// Intake nudge email — sent ~24 hours after signup if the member hasn't
// completed the AI Coach intake form yet.

const FROM = process.env.EMAIL_FROM ?? 'WorkoutPartna <noreply@fan2seeproductions.com>'

const html = (firstName: string) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

        <tr>
          <td style="background:linear-gradient(135deg,#b91010,#dc1616);padding:20px 24px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">WorkoutPartna</p>
            <h1 style="margin:4px 0 0;font-size:20px;font-weight:900;color:#fff;">🏋️ Your AI Coach is ready for you</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 24px;">
            <p style="margin:0 0 16px;font-size:15px;color:#111827;">Hey ${firstName}!</p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              You signed up for WorkoutPartna — awesome! Your <strong>AI Coach</strong> is ready
              to build a personalized workout plan just for you, delivered to your phone every morning.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              All we need is a quick intake form (takes about 3 minutes) so the coach knows
              your goals, fitness level, and schedule.
            </p>

            <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
              <tr>
                <td style="background:#dc1616;border-radius:8px;">
                  <a href="https://workoutpartna.com/app/coach/intake"
                     style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;">
                    Complete My Intake →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#6b7280;">
              Already done it? Just log in and your plan will be waiting.
            </p>
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

export async function sendIntakeNudgeEmail(opts: {
  toEmail: string
  firstName: string | null
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const name = opts.firstName ?? 'there'

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
        subject: `Complete your AI Coach intake — your plan is waiting 💪`,
        html: html(name),
        text: `Hey ${name}!\n\nYou signed up for WorkoutPartna — your AI Coach is ready to build a personalized workout plan for you!\n\nAll we need is a quick intake form (takes about 3 minutes):\nhttps://workoutpartna.com/app/coach/intake\n\nWorkoutPartna · workoutpartna.com`,
      }),
    })
  } catch {
    // best-effort
  }
}
