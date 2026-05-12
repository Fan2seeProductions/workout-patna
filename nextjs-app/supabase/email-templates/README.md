# Workout Partna — Supabase Auth Email Templates

Branded HTML email templates that replace Supabase's default "Supabase Auth"
emails. Black background, red brand gradient, "WP" wordmark, and the
**Workout Partna** name everywhere users will see it.

## How to apply (5-minute setup)

1. **Open the auth templates page** for your project:
   👉 https://supabase.com/dashboard/project/qpbjxetwgfcugturwnji/auth/templates

2. For each template below, click into it, paste the matching HTML from
   `supabase/email-templates/*.html`, and update the **Subject line** as listed.

3. Click **Save** after each one.

| Supabase template | File to paste | Recommended subject line |
|---|---|---|
| Confirm signup | `confirm-signup.html` | `Confirm your Workout Partna account` |
| Magic Link | `magic-link.html` | `Your Workout Partna sign-in link` |
| Reset Password | `reset-password.html` | `Reset your Workout Partna password` |
| Change Email Address | `change-email.html` | `Confirm your new email · Workout Partna` |
| Invite user | `invite-user.html` | `You're invited to Workout Partna 💪` |
| Reauthentication | `reauthentication.html` | `Verify it's you · Workout Partna` |

## Sender name (the "Supabase Auth" label)

The sender name shown in inboxes ("From: Supabase Auth") comes from the
project's SMTP settings. To change it:

👉 https://supabase.com/dashboard/project/qpbjxetwgfcugturwnji/settings/auth

Scroll to **SMTP Settings**. Two options:

### Option A — quick fix (uses Supabase's built-in mailer)
The default Supabase SMTP doesn't let you change the From: name without using
custom SMTP. The templates above will at least make the email **content**
clearly say "Workout Partna" everywhere — most users read the body, not the
sender label, especially with the WP logo at the top.

### Option B — recommended for production (custom SMTP via Resend)
You already have `RESEND_API_KEY` set in Vercel. To route Supabase auth emails
through Resend so they come from `noreply@workoutpartna.com`:

1. In Resend, verify your `workoutpartna.com` domain (Resend → Domains → Add).
2. Create a new SMTP credential in Resend (Resend → SMTP).
3. In Supabase **Authentication → SMTP Settings**, toggle **Enable Custom SMTP**:
   - Sender email: `noreply@workoutpartna.com` (or `auth@workoutpartna.com`)
   - Sender name: `Workout Partna`
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: *(the Resend SMTP password)*
4. Save. Send a test signup. The email arrives from "Workout Partna" instead of
   "Supabase Auth", with full deliverability via your own domain.

This also raises the daily send limit from Supabase's free-tier 30 emails/day
to whatever your Resend plan allows (Resend's free tier is 3,000 emails/month).

## Variables used in these templates

Supabase auth replaces these tokens at send time:
- `{{ .ConfirmationURL }}` — the magic link / confirm URL
- `{{ .Token }}` — 6-digit OTP (used in `reauthentication.html`)
- `{{ .Email }}` — the recipient's current email
- `{{ .NewEmail }}` — used in `change-email.html`
- `{{ .SiteURL }}` — your configured site URL

Don't change the variable names. Everything else is plain HTML.

## Preview locally

Open any of the `.html` files in a browser to preview. The variables will
display literally (e.g., `{{ .ConfirmationURL }}`) — that's expected; Supabase
substitutes them at send time.
