# Supabase Setup — fresh coach-only project (July 2026)

The legacy project (26-table gym/partner schema, Fan2seeProductions org) was
abandoned in place; the product now runs on a fresh project under the
dwilliams account with the schema in `supabase/migrations/`.

## One-time project setup

1. **Create project** (dwilliams dashboard): name `WorkoutPartna`, region
   `us-east-1`, save the DB password.
2. **Team access**: invite `sales@fan2seeproductions.com` as **Administrator**
   (create the project FIRST — the free-tier cap counts active projects per
   admin/owner person at create/restore time only).
3. **Apply migrations**: via MCP `apply_migration` or
   `supabase db push` with the CLI linked to the new project.
4. **Auth settings** (dashboard → Authentication):
   - Providers → Email → **disable "Confirm email"** — the app signs users
     in immediately after signup (AuthClient.tsx) and runs its own
     verification-email flow via `profiles.email_verify_token`.
   - URL configuration → Site URL `https://workoutpartna.com`; add redirect
     URLs for `https://workoutpartna.com/auth/callback` (+ localhost dev).
   - (If Google sign-in is wanted: configure the Google provider with OAuth
     client credentials; the profile trigger auto-verifies OAuth signups.)
   - Email templates: paste from `supabase/email-templates/` if customizing.
5. **Vercel env** (production — values from the new project's API settings):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` ← was MISSING in prod entirely; the Stripe
     webhook, merch fulfillment, and daily-motivation cron hard-require it.
6. **Redeploy** after env changes.

## Schema notes

- `profiles.id` has **no FK to auth.users** on purpose: the coach bot
  profile (`00000000-0000-0000-0000-000000000001`) has no auth user. Profile
  rows for real users are created by the `on_auth_user_created` trigger.
- Coach chat = a `matches` row (bot ↔ member) + `messages` rows. The daily
  cron writes via `bot_save_and_send_workout` (SECURITY DEFINER).
- The trial-grandfather cutoff (2026-06-09) predates this database, so
  `start_coach_trial()` always returns `card_required` here — new members
  go through Stripe card-on-trial. This is correct behavior.

## Known follow-ups (not blockers)

- **Harden cron RPCs**: `get_intake_members_for_cron` /
  `bot_save_and_send_workout` are SECURITY DEFINER and callable with the
  anon key (legacy design — the HTTP routes gate on CRON_SECRET, but the
  RPCs themselves don't). Next pass: switch cron routes to the service-role
  client and revoke anon EXECUTE on these functions.
- **Storage**: no bucket is created; profile photo upload paths in the old
  app didn't survive into live code. Add a `photos` bucket when profile
  photos return.
- Seed `workouts` (free library) content when desired — table exists, empty.
