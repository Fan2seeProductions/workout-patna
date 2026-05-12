# Google OAuth Consent Screen — Paste-Ready Cheat Sheet

Open: **https://console.cloud.google.com/apis/credentials/consent**
(Make sure the project picker at the top shows the project that owns your
Supabase Google OAuth Client ID.)

Click **EDIT APP**, then paste each value below into the matching field.

---

## OAuth Consent Screen → App Information

| Field | Paste this |
|---|---|
| User Type | `External` *(if not already set)* |
| **App name** | `Workout Partna` |
| User support email | `sales@fan2seeproductions.com` |
| **App logo** | Upload `public/brand/logo-google-256.png` |

---

## OAuth Consent Screen → App domain

| Field | Paste this |
|---|---|
| Application home page | `https://workoutpartna.com` |
| Application privacy policy link | `https://workoutpartna.com/privacy` |
| Application terms of service link | `https://workoutpartna.com/terms` |

---

## OAuth Consent Screen → Authorized domains

Click **+ ADD DOMAIN** twice and paste:

```
workoutpartna.com
supabase.co
```

> The privacy + terms URLs MUST be saved before Google lets you add domains.
> Save them first, scroll down, then add domains.

---

## OAuth Consent Screen → Developer contact information

| Field | Paste this |
|---|---|
| Email addresses | `sales@fan2seeproductions.com` |

---

## OAuth Consent Screen → Scopes

Click **ADD OR REMOVE SCOPES**. Make sure **only** these three are listed
(they're added automatically by Supabase — don't add more, or you'll trigger
a manual review):

```
.../auth/userinfo.email
.../auth/userinfo.profile
openid
```

Click **UPDATE** → **SAVE AND CONTINUE**.

---

## OAuth Consent Screen → Test users

If your app is still in **Testing** publishing status, you must list every
Google account that will sign in. Add yours + any beta testers.

To skip this entirely: go back to the consent screen overview page and click
**PUBLISH APP** → confirm. With only `openid email profile` scopes, no manual
verification is required and your app immediately allows any Google user to
sign in.

---

## OAuth Consent Screen → Summary

Click **BACK TO DASHBOARD**. Done with the consent screen.

---

## Credentials → Your OAuth 2.0 Client ID

Open: **https://console.cloud.google.com/apis/credentials**

Find the **OAuth 2.0 Client ID** Supabase is using. Click its name to edit.

### Authorized JavaScript origins

```
https://workoutpartna.com
https://www.workoutpartna.com
http://localhost:3000
http://localhost:3002
```

### Authorized redirect URIs

```
https://qpbjxetwgfcugturwnji.supabase.co/auth/v1/callback
https://workoutpartna.com/auth/callback
http://localhost:3000/auth/callback
http://localhost:3002/auth/callback
```

> The `qpbjxetwgfcugturwnji.supabase.co` redirect is **required** — that's
> where Google sends the `code` param after sign-in, and Supabase exchanges
> it for a session before forwarding to your `/auth/callback` route. If you
> later set up a Supabase Custom Domain (e.g., `auth.workoutpartna.com`),
> add that hostname's `/auth/v1/callback` here too.

Click **SAVE**.

---

## After saving — quick smoke test

1. Open an incognito window.
2. Go to https://workoutpartna.com/app/auth?mode=signin
3. Click **Sign in with Google**.
4. The consent screen should now show:

   > **Workout Partna** wants to access your Google Account
   > [your WP-red logo]
   > Choose an account to continue to **Workout Partna**

5. Pick an account → you should land on `/app/home` (or `/app/onboarding` for
   a new user).
6. Check your inbox for the branded **welcome email** from
   `noreply@workoutpartna.com` (only if you've completed the Resend custom-SMTP
   setup in `CUSTOM_SMTP_RESEND.md`).

---

## If something fails

| Symptom | Fix |
|---|---|
| Still says "qpbjxetwgfcugturwnji.supabase.co" | Hard-refresh (Cmd+Shift+R) — Google caches the consent screen for ~5 min after saves. Try a different browser if it persists. |
| "redirect_uri_mismatch" error | The exact `/auth/v1/callback` URL on `supabase.co` must be in Authorized redirect URIs. Copy/paste it carefully — no trailing slash, https only. |
| "App not verified" warning | Either keep the app in Testing + add the user to Test users, or PUBLISH APP. Basic email/profile scopes don't trigger Google's manual review. |
| Logo doesn't render | Must be square, ≤1 MB, PNG or JPG. The `logo-google-256.png` file is 22 KB — well within limits. |
| "Domain ownership not verified" | Go to https://search.google.com/search-console and verify `workoutpartna.com` (TXT record at your DNS host). Then return to the consent screen and re-add the domain. |

---

## Quick reference — all the URLs you'll need

| Purpose | URL |
|---|---|
| OAuth consent screen | https://console.cloud.google.com/apis/credentials/consent |
| OAuth credentials (client ID) | https://console.cloud.google.com/apis/credentials |
| Domain verification (Google Search Console) | https://search.google.com/search-console |
| Supabase Google provider settings | https://supabase.com/dashboard/project/qpbjxetwgfcugturwnji/auth/providers |
| Supabase auth-redirect URL config | https://supabase.com/dashboard/project/qpbjxetwgfcugturwnji/auth/url-configuration |
| Test signup page | https://workoutpartna.com/app/auth?mode=signup |
| Privacy policy | https://workoutpartna.com/privacy |
| Terms of service | https://workoutpartna.com/terms |
| Logo to upload | `public/brand/logo-google-256.png` |
