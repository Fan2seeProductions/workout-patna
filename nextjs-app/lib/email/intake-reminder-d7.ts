// Day-7 final intake reminder — last automated touch for members who still
// haven't completed intake after a week. Softer tone, offers help.
// After this we stop automated emails — personal outreach is more appropriate.

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
            <h1 style="margin:4px 0 0;font-size:20px;font-weight:900;color:#fff;">Last one from us 🤝</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 24px;">
            <p style="margin:0 0 16px;font-size:15px;color:#111827;">Hey ${firstName},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              We won't keep bugging you — this is our last reminder about the AI Coach intake.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              If life got in the way, no worries — the form is still there whenever you're ready.
              If something felt confusing or you hit a snag, reply to this email and we'll help you
              get through it.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              Otherwise, tap below and let's finally get your plan built. 💪
            </p>

            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr>
                <td style="background:#dc1616;border-radius:8px;">
                  <a href="https://workoutpartna.com/app/coach/intake"
                     style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;">
                    Complete My Intake →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
              After this we'll give you space — but we're always here if you need us.
              Just reply to this email or find us at workoutpartna.com.
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

export async function sendIntakeReminderD7Email(opts: {
  toEmail: string
  firstName: string | null
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const name = opts.firstName ?? 'there'

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [opts.toEmail],
        subject: `Last one from us — your AI Coach plan is still here 🤝`,
        html: html(name),
        text: `Hey ${name},\n\nThis is our last reminder about the AI Coach intake. The form is still there whenever you're ready, or reply to this email if you hit a snag.\n\nhttps://workoutpartna.com/app/coach/intake\n\nWorkoutPartna · workoutpartna.com`,
      }),
    })
  } catch {
    // best-effort
  }
}
