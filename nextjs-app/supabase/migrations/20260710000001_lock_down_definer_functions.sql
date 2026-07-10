-- ═══════════════════════════════════════════════════════════════════════════
-- SECURITY: lock down privileged SECURITY DEFINER functions.
--
-- Postgres grants EXECUTE to PUBLIC by default on every new function. Because
-- these functions run as their owner (SECURITY DEFINER) and bypass RLS, that
-- default meant ANY caller holding the public anon key — including
-- unauthenticated visitors — could invoke them directly via PostgREST
-- (POST /rest/v1/rpc/<fn>) and:
--
--   • get_intake_members_for_cron  → dump EVERY member's full intake, incl.
--                                     phone number, medications, medical
--                                     conditions, pregnancy status, weight.
--   • admin_get_auth_users         → dump EVERY user's email + last sign-in.
--   • get_push_subscriptions_for_user → read any user's push keys.
--   • bot_send_workout /
--     bot_save_and_send_workout    → post an arbitrary message AS the coach
--                                     bot into any user's chat thread (phishing).
--
-- Fix: revoke EXECUTE from public/anon/authenticated and grant only to
-- service_role. All legitimate callers (crons, admin pages, the coach-chat
-- action, the voice webhook) now use the service-role client server-side.
--
-- start_coach_trial() is intentionally left callable by authenticated users —
-- it is self-scoped via auth.uid() and only touches the caller's own row.
-- ═══════════════════════════════════════════════════════════════════════════

revoke execute on function public.get_intake_members_for_cron(date)
  from public, anon, authenticated;
revoke execute on function public.admin_get_auth_users()
  from public, anon, authenticated;
revoke execute on function public.get_push_subscriptions_for_user(uuid)
  from public, anon, authenticated;
revoke execute on function public.bot_send_workout(uuid, text)
  from public, anon, authenticated;
revoke execute on function public.bot_save_and_send_workout(uuid, date, text, text, text, text, text, text)
  from public, anon, authenticated;

grant execute on function public.get_intake_members_for_cron(date)
  to service_role;
grant execute on function public.admin_get_auth_users()
  to service_role;
grant execute on function public.get_push_subscriptions_for_user(uuid)
  to service_role;
grant execute on function public.bot_send_workout(uuid, text)
  to service_role;
grant execute on function public.bot_save_and_send_workout(uuid, date, text, text, text, text, text, text)
  to service_role;
