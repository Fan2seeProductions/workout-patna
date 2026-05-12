# Fix the Google "Sign in with Google" Branding

The Google account chooser currently says:

> Choose an account
> to continue to **qpbjxetwgfcugturwnji.supabase.co**

We want it to say:

> Choose an account
> to continue to **Workout Partna**

(plus your logo, and links to your privacy policy + terms.)

This text comes from your **Google Cloud Console OAuth consent screen** —
not from Supabase code. It's a one-time 10-minute config in two dashboards.

---

## ✅ Step 1 — Find which Google project Supabase is using

Open the OAuth provider settings in Supabase:
👉 **https://supabase.com/dashboard/project/qpbjxetwgfcugturwnji/auth/providers**

Click **Google**. You'll see two fields:
- **Client ID** (looks like `1234567890-abcdef.apps.googleusercontent.com`)
- **Client Secret**

The **Client ID** belongs to a project in Google Cloud Console. Note it down.

---

## ✅ Step 2 — Open that project's OAuth consent screen

Go to:
👉 **https://console.cloud.google.com/apis/credentials/consent**

Make sure the **project picker in the top bar** is set to the project that
owns the Client ID from Step 1. (If it's wrong, click the dropdown → switch
to the right project.)

Click **EDIT APP** at the top of the consent screen page.

---

## ✅ Step 3 — Fill in branding (this is what kills the "supabase.co" text)

### App Information

| Field | Value |
|---|---|
| **App name** | `Workout Partna` ← **THIS replaces "qpbjxetwgfcugturwnji.supabase.co"** |
| User support email | `sales@fan2seeproductions.com` (or your support address) |
| **App logo** | Upload `public/brand/logo-google-256.png` (already prepared in your repo) |

> 📌 The app name field is the single most important fix. Once set, the consent
> screen will say "to continue to Workout Partna" — the URL is gone.

### App domain

| Field | Value |
|---|---|
| Application home page | `https://workoutpartna.com` |
| Application privacy policy link | `https://workoutpartna.com/privacy` |
| Application terms of service link | `https://workoutpartna.com/terms` |

### Authorized domains

Add both:
- `workoutpartna.com`
- `supabase.co` *(required because the OAuth callback URL is on this domain)*

### Developer contact

| Field | Value |
|---|---|
| Email addresses | `sales@fan2seeproductions.com` |

Click **SAVE AND CONTINUE** through Scopes (no changes needed) → Test users
(skip if your app is in production) → Summary → **BACK TO DASHBOARD**.

---

## ✅ Step 4 — Publish the app (so non-test-users can sign in)

If your consent screen is currently in **Testing** mode, only listed test
users can sign in. To allow everyone:

On the OAuth consent screen page, click **PUBLISH APP** → confirm.

> ⚠️ If your consent screen is set to **External** + **Testing**, you'll be
> asked to verify the app for sensitive scopes. For basic email + profile
> scopes (which is what Supabase auth uses), no verification is needed —
> publishing is instant.

---

## ✅ Step 5 — Test it

1. Open an incognito window.
2. Go to `https://workoutpartna.com/app/auth?mode=signin`.
3. Click **Sign in with Google**.
4. The account chooser should now show:

   > **Workout Partna**
   > Choose an account
   > to continue to **Workout Partna**
   > [your logo]

Done.

---

## Optional — kill the `qpbjxetwgfcugturwnji.supabase.co` URL entirely

The "to continue to" line is replaced by your **App name** as soon as it's
set. But if a user clicks the small "info" icon next to the app name on
Google's consent screen, they'll still see the underlying redirect URL
`https://qpbjxetwgfcugturwnji.supabase.co/auth/v1/callback`.

**To fully white-label that callback URL**, you need a Supabase Custom Domain:

1. Open: **https://supabase.com/dashboard/project/qpbjxetwgfcugturwnji/settings/general** → scroll to **Custom Domains**.
2. Add `auth.workoutpartna.com` (or `app.workoutpartna.com`).
3. Add the CNAME record at your DNS registrar pointing to the Supabase host.
4. Once verified, your auth callback becomes
   `https://auth.workoutpartna.com/auth/v1/callback`.
5. Add that new callback URL to **Google Cloud Console → Credentials →
   Your OAuth Client → Authorized redirect URIs**.
6. Update Supabase **Auth → URL Configuration** to match.

> 💰 Custom domains are a **paid feature** ($10/mo at time of writing). The
> Step 1–5 fix above is free and is the 95% improvement most users care about
> (the visible "to continue to Workout Partna" text). The custom-domain step
> is only needed if you want the underlying URL hidden too.

---

## Files referenced

- `public/brand/logo-google-256.png` — 256×256 PNG, brand-black bg with the
  Workout Partna wordmark. Upload as the **App logo** in Step 3.
- `public/brand/logo-square-1024.png` — 1024×1024 high-res version if Google
  asks for a larger upload (it usually doesn't).

---

## Common pitfalls

| Symptom | Fix |
|---|---|
| Consent screen still shows "supabase.co" after saving | Clear browser cache / try incognito; Google sometimes caches the screen for ~5 min |
| "App not verified" warning shown to users | Either keep app in Testing + add test users, or click PUBLISH APP. Basic email/profile scopes don't trigger Google's manual review. |
| Logo upload fails | Must be square, ≤1 MB, PNG/JPG. The 256×256 version we prepared is well within limits. |
| "Authorized domains" rejects supabase.co | This means you forgot to add the privacy policy + terms URLs first — Google requires those before letting you list authorized domains. Add the URLs, save, then come back to authorized domains. |
| Different Google project than expected | Step 1's Client ID tells you which project to edit. If you can't find it in your Google account, you may have created the OAuth client under a different Google login — check `aud` in the JWT or look in all your Google Cloud projects. |
