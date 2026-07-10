// Service-role Supabase client — bypasses RLS and is the ONLY role permitted
// to execute the privileged SECURITY DEFINER functions (get_intake_members_for_cron,
// admin_get_auth_users, bot_send_workout, bot_save_and_send_workout,
// get_push_subscriptions_for_user). Those functions are REVOKE'd from anon +
// authenticated (see migration 20260710000001), so they can only be reached
// through this client, server-side.
//
// NEVER import this into client components — it holds the service-role key.
// Returns null if the key isn't configured, so callers must handle that.
import { createServerClient } from '@supabase/ssr'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) return null
  return createServerClient(url, serviceRoleKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  })
}
