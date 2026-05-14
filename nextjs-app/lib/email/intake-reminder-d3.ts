// Day-3 intake reminder — sent to members who either:
//   A) Started the intake but never accepted the disclaimer (90% done), OR
//   B) Haven't touched it at all (second gentle push)
// Different subject lines are used per group so the message feels personal.

const FROM = process.env.EMAIL_FROM ?? 'WorkoutPartna <noreply@fan2seeproductions.com>'

const htmlStarted = (firstName: string) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

        <tr>
          <td style="background:linear-gradient(135deg,#b91010,#dc1616);padding:20px 24px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">WorkoutPartna</p>
            <h1 style="margin:4px 0 0;font-size:20px;font-weight:900;color:#fff;">You were SO close 👀</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 24px;">
            <p style="margin:0 0 16px;font-size:15px;color:#111827;">Hey ${firstName}!</p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              You started your <strong>AI Coach intake</strong> but stopped right before the finish line —
              just one checkbox left. Literally 10 seconds and your personalized daily workouts start
              dropping every morning.
            </p>

            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr>
                <td style="background:#dc1616;border-radius:8px;">
                  <a href="https://workoutpartna.com/app/coach/intake"
                     style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;">
                    Finish My Intake →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
              Your answers are saved — you just need to scroll to the last step and accept the
              health acknowledgment. That's it.
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

const htmlNotStarted = (firstName: string) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

        <tr>
          <td style="background:linear-gradient(135deg,#b91010,#dc1616);padding:20px 24px;">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">WorkoutPartna</p>
            <h1 style="margin:4px 0 0;font-size:20px;font-weight:900;color:#fff;">Your AI Coach is still waiting 🏋️</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 24px;">
            <p style="margin:0 0 16px;font-size:15px;color:#111827;">Hey ${firstName}!</p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
              Just a quick check-in — your <strong>AI Coach intake</strong> is still waiting on you.
              It takes about 3 minutes and after that your personalized workout lands in the app
              every single morning. No guessing, no googling, just open and train.
            </p>

            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr>
                <td style="background:#dc1616;border-radius:8px;">
                  <a href="https://workoutpartna.com/app/coach/intake"
                     style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;">
                    Start My Intake →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#6b7280;">
              Takes 3 minutes. Your plan starts the next morning.
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

export async function sendIntakeReminderD3Email(opts: {
  toEmail: string
  firstName: string | null
  hasStarted: boolean   // true = has intake row but no disclaimer; false = never touched it
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const name = opts.firstName ?? 'there'
  const subject = opts.hasStarted
    ? `You were SO close — one checkbox left 👀`
    : `Still thinking? Your AI Coach is waiting 🏋️`

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [opts.toEmail],
        subject,
        html: opts.hasStarted ? htmlStarted(name) : htmlNotStarted(name),
        text: opts.hasStarted
          ? `Hey ${name}! You started your intake but stopped right before the finish line — just one checkbox left.\n\nhttps://workoutpartna.com/app/coach/intake`
          : `Hey ${name}! Your AI Coach intake is still waiting. Takes 3 minutes.\n\nhttps://workoutpartna.com/app/coach/intake`,
      }),
    })
  } catch {
    // best-effort
  }
}
