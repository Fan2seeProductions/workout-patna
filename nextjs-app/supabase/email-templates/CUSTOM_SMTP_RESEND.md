# Custom SMTP via Resend — Exact Strings to Paste

Routes Supabase auth emails through your own `workoutpartna.com` domain. The
sender label changes from "Supabase Auth" to **"WorkoutPartna"** and you get
3,000 emails/month (vs Supabase's free 30/day).

---

## ✅ Step 1 — Verify your domain in Resend

1. Open **https://resend.com/domains** → click **Add Domain**
2. Enter: `workoutpartna.com`
3. Resend gives you DNS records (SPF, DKIM, optionally DMARC) — add them at
   your domain registrar (Cloudflare/Namecheap/etc.)
4. Click **Verify**. Usually takes 5–15 min for DNS to propagate.

> Already done? Skip to Step 2.

---

## ✅ Step 2 — Get your Resend SMTP credentials

1. Open **https://resend.com/settings/smtp**
2. Resend's SMTP server uses your existing **API key** as the password — no
   separate SMTP password to create. Use the same `RESEND_API_KEY` value
   that's already in your Vercel env.

If you don't have one handy, create a new one at
**https://resend.com/api-keys** (full access, restrict to "Sending access" if
preferred).

---

## ✅ Step 3 — Configure Supabase Custom SMTP

Open: **https://supabase.com/dashboard/project/ilzswzevcpgnvdsfgelu/auth/smtp**
(This is the live **dwilliams** project. The old `qpbjxetwgfcugturwnji` link
was the retired sales-account project — don't use it.)

Scroll to **SMTP Settings** → toggle **"Enable Custom SMTP"** → paste:

| Field | Value |
|---|---|
| Sender email | `noreply@workoutpartna.com` |
| Sender name | `WorkoutPartna` |
| Host | `smtp.resend.com` |
| Port number | `465` |
| Minimum interval between emails (seconds) | `1` |
| Username | `resend` |
| Password | *(your `RESEND_API_KEY` value — starts with `re_…`)* |

Click **Save**.

> **Why port 465?** It's TLS-on-connect (SMTPS), the most reliable for serverless.
> Port 587 (STARTTLS) also works if 465 is blocked anywhere.

---

## ✅ Step 4 — Test it

1. Open an incognito window → sign up with a fresh email at
   **https://workoutpartna.com/app/auth?mode=signup**
2. Check your inbox. You should now see:
   - **From:** WorkoutPartna `<noreply@workoutpartna.com>` ← (was: "Supabase Auth")
   - **Subject:** Confirm your WorkoutPartna account
   - **Body:** branded HTML you pasted earlier
3. Click the confirm link.
4. ~30 seconds later, you should receive a **second** email — the welcome
   email — also from `noreply@workoutpartna.com`.

If both arrive ✅, you're done.

---

## Bonus environment variable

The welcome-email helper (`lib/email/welcome.ts`) uses
`WELCOME_EMAIL_FROM` if set, otherwise defaults to
`WorkoutPartna <noreply@workoutpartna.com>`.

To override (for example, when testing on the staging domain):

```bash
vercel env add WELCOME_EMAIL_FROM production
# Paste: WorkoutPartna <hello@workoutpartna.com>
```

You can use the same `from` style for any future Resend transactional email.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Welcome email never arrives | `RESEND_API_KEY` not set in Vercel **Production** | `vercel env add RESEND_API_KEY production` then redeploy |
| Confirm-signup email still says "Supabase Auth" | Custom SMTP toggle off, or domain unverified in Resend | Re-check Steps 1 + 3 |
| Resend logs show 422 "domain not verified" | DNS records not propagated yet | Wait 15 min; verify with `dig TXT workoutpartna.com` |
| Welcome email sends twice | Two `/auth/callback` hits before the first wrote `welcomed_at` | The code uses `.is('welcomed_at', null)` to gate the update — the second one no-ops. If you see it anyway, check for a stuck retry in Vercel logs. |
| Branded HTML appears as raw `<table>` text | Pasted HTML into the **Subject line** instead of the body | Re-paste into the **HTML** body field (one tab over) |

---

## What's wired vs what's manual

✅ **Done in code**
- `lib/email/welcome.ts` — branded HTML + plain-text welcome email helper
- `app/auth/callback/route.ts` — fires welcome email exactly once per user
  after their first confirmed sign-in (gated on `profiles.welcomed_at`)
- DB migration — `welcomed_at` column added to `profiles`

⏳ **Manual (5 minutes in Supabase + Resend dashboards)**
- Paste the 6 auth-email HTML templates into Supabase
- Toggle Custom SMTP on with the strings above
- Verify the `workoutpartna.com` domain in Resend (if not already)
