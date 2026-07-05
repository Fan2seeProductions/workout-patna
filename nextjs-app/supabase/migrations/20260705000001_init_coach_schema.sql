-- ════════════════════════════════════════════════════════════════════════
-- WorkoutPartna — coach-only schema, v1 (fresh start, July 2026)
--
-- Reconstructed from code after the coach-only pivot; replaces the legacy
-- 26-table gym/partner-matching database. Every table/column/function here
-- is referenced by a live code path (see docs/MOMENTUM-AI-STRATEGY.md §4b
-- for what was retired).
--
-- Chat model: the AI coach posts into a normal chat thread. A `matches` row
-- links the member to the BOT profile (fixed uuid below), and `messages`
-- rows reference that match. This mirrors the legacy schema so the app code
-- works unchanged.
-- ════════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- The coach-bot identity. profiles.id intentionally has NO FK to auth.users
-- so this row can exist without an auth user.
-- BOT_ID = '00000000-0000-0000-0000-000000000001'

-- ── updated_at helper ────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ═══ TABLES ══════════════════════════════════════════════════════════════

create table public.profiles (
  id uuid primary key,
  display_name text,
  first_name text,
  last_name text,
  photo_url text,
  bio text,
  age integer,
  fitness_level text,
  goals text[],
  styles text[],
  schedule_days text[],
  schedule_times text[],
  vibe text,
  primary_location text,
  gym_id uuid,                       -- legacy, kept nullable for old selects
  is_premium boolean default false,
  premium_until timestamptz,
  onboarded boolean default false,
  role text,                         -- 'super_admin' for admin screens
  welcomed_at timestamptz,
  email_verified_at timestamptz,
  email_verify_token text,
  profile_prompts jsonb,
  intake_nudge_sent_at timestamptz,
  intake_reminder_d3_sent_at timestamptz,
  intake_reminder_d7_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create table public.ai_coach_intake (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  goals text[],
  fitness_level text,
  days_per_week integer,
  workout_minutes integer,
  equipment text[],
  injuries text,
  target_areas text[],
  training_style text,
  coaching_tone text,
  age integer,
  sex text,
  height_inches integer,
  weight_lbs integer,
  medical_conditions text[],
  medications text,
  pregnancy_status text,
  training_years integer,
  pr_bench_lbs integer,
  pr_squat_lbs integer,
  pr_deadlift_lbs integer,
  pr_mile_time text,
  body_fat_pct numeric,
  goal_target text,
  goal_target_date date,
  sleep_hours_avg numeric,
  stress_level text,
  occupation_activity text,
  liked_exercises text,
  disliked_exercises text,
  cardio_preference text[],
  mobility_issues text,
  plays_sports boolean,
  sports text[],
  sport_level text,
  sport_season text,
  sport_position text,
  phone_number text,
  sms_opt_in boolean default false,
  sms_opt_in_at timestamptz,
  sms_opt_in_ip text,
  sms_opt_in_version text,
  delivery_time text,
  disclaimer_accepted boolean default false,
  disclaimer_accepted_at timestamptz,
  disclaimer_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger ai_coach_intake_updated_at before update on public.ai_coach_intake
  for each row execute function public.set_updated_at();

create table public.ai_coach_subscriptions (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,                        -- trialing|active|past_due|canceled|...
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger ai_coach_subscriptions_updated_at before update on public.ai_coach_subscriptions
  for each row execute function public.set_updated_at();

create table public.ai_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  day date not null,
  focus text,
  warm_up text,
  main text,
  finisher text,
  notes text,
  feedback text,                      -- too_easy|just_right|too_hard|injured|completed|skipped
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day)
);
create index ai_workouts_user_day_idx on public.ai_workouts (user_id, day desc);
create trigger ai_workouts_updated_at before update on public.ai_workouts
  for each row execute function public.set_updated_at();

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending',   -- pending|active|declined|cancelled
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sender_id, receiver_id)
);
create trigger matches_updated_at before update on public.matches
  for each row execute function public.set_updated_at();

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index messages_match_created_idx on public.messages (match_id, created_at);
create index messages_unread_idx on public.messages (sender_id) where read_at is null;

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null,
  p256dh text,
  auth text,
  created_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  title text,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

-- Free workout library (browse-only content; seeded by admin).
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  body_part text,
  level text,
  description text,
  exercises jsonb,
  created_at timestamptz not null default now()
);

-- ═══ BOT PROFILE ═════════════════════════════════════════════════════════

insert into public.profiles (id, display_name, first_name, onboarded)
values ('00000000-0000-0000-0000-000000000001', 'WorkoutPartna Coach', 'Coach', true)
on conflict (id) do nothing;

-- ═══ AUTH TRIGGER — create a profile on signup ═══════════════════════════
-- Signup metadata carries `name` (and `age` for email signups). Google
-- OAuth users are auto-verified; email/password users verify via the app's
-- token email (profiles.email_verify_token flow).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_name text := coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name');
  v_provider text := coalesce(new.raw_app_meta_data->>'provider', 'email');
begin
  insert into public.profiles (id, display_name, first_name, last_name, age, email_verified_at)
  values (
    new.id,
    v_name,
    nullif(split_part(coalesce(v_name, ''), ' ', 1), ''),
    nullif(btrim(substr(coalesce(v_name, ''), length(split_part(coalesce(v_name, ''), ' ', 1)) + 1)), ''),
    nullif(new.raw_user_meta_data->>'age', '')::integer,
    case when v_provider <> 'email' then now() else null end
  )
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═══ RPC FUNCTIONS ═══════════════════════════════════════════════════════

-- Members due a workout today: completed intake + live subscription + no
-- workout row for p_today yet. Includes yesterday's focus/feedback for the
-- adaptation context. Called by the daily cron (route-level CRON_SECRET).
create or replace function public.get_intake_members_for_cron(p_today date)
returns table (
  user_id uuid,
  first_name text,
  display_name text,
  is_premium boolean,
  phone_number text,
  sms_opt_in boolean,
  goals text[],
  fitness_level text,
  days_per_week integer,
  workout_minutes integer,
  equipment text[],
  injuries text,
  target_areas text[],
  training_style text,
  coaching_tone text,
  age integer,
  sex text,
  height_inches integer,
  weight_lbs integer,
  medical_conditions text[],
  medications text,
  pregnancy_status text,
  training_years integer,
  pr_bench_lbs integer,
  pr_squat_lbs integer,
  pr_deadlift_lbs integer,
  pr_mile_time text,
  body_fat_pct numeric,
  goal_target text,
  goal_target_date date,
  sleep_hours_avg numeric,
  stress_level text,
  occupation_activity text,
  liked_exercises text,
  disliked_exercises text,
  cardio_preference text[],
  mobility_issues text,
  plays_sports boolean,
  sports text[],
  sport_level text,
  sport_season text,
  sport_position text,
  yesterday_focus text,
  yesterday_feedback text
)
language sql
security definer set search_path = public
as $$
  select
    i.user_id,
    p.first_name,
    p.display_name,
    coalesce(p.is_premium, false),
    i.phone_number,
    coalesce(i.sms_opt_in, false),
    i.goals, i.fitness_level, i.days_per_week, i.workout_minutes, i.equipment,
    i.injuries, i.target_areas, i.training_style, i.coaching_tone, i.age,
    i.sex, i.height_inches, i.weight_lbs, i.medical_conditions, i.medications,
    i.pregnancy_status, i.training_years, i.pr_bench_lbs, i.pr_squat_lbs,
    i.pr_deadlift_lbs, i.pr_mile_time, i.body_fat_pct, i.goal_target,
    i.goal_target_date, i.sleep_hours_avg, i.stress_level,
    i.occupation_activity, i.liked_exercises, i.disliked_exercises,
    i.cardio_preference, i.mobility_issues, i.plays_sports, i.sports,
    i.sport_level, i.sport_season, i.sport_position,
    y.focus    as yesterday_focus,
    y.feedback as yesterday_feedback
  from public.ai_coach_intake i
  join public.profiles p on p.id = i.user_id
  join public.ai_coach_subscriptions s on s.user_id = i.user_id
  left join lateral (
    select w.focus, w.feedback
    from public.ai_workouts w
    where w.user_id = i.user_id and w.day < p_today
    order by w.day desc
    limit 1
  ) y on true
  where i.disclaimer_accepted = true
    and s.status in ('trialing', 'active', 'past_due')
    and (s.current_period_end is null or s.current_period_end > now())
    and not exists (
      select 1 from public.ai_workouts w2
      where w2.user_id = i.user_id and w2.day = p_today
    )
    and i.user_id <> '00000000-0000-0000-0000-000000000001';
$$;

-- Atomic: save today's workout + ensure the coach chat thread + post the
-- chat message from the bot.
create or replace function public.bot_save_and_send_workout(
  p_user_id uuid,
  p_day date,
  p_focus text,
  p_warm_up text,
  p_main text,
  p_finisher text,
  p_notes text,
  p_chat_body text
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  bot constant uuid := '00000000-0000-0000-0000-000000000001';
  v_match_id uuid;
begin
  insert into public.ai_workouts (user_id, day, focus, warm_up, main, finisher, notes)
  values (p_user_id, p_day, p_focus, p_warm_up, p_main, p_finisher, p_notes)
  on conflict (user_id, day) do update
    set focus = excluded.focus,
        warm_up = excluded.warm_up,
        main = excluded.main,
        finisher = excluded.finisher,
        notes = excluded.notes;

  select m.id into v_match_id
  from public.matches m
  where (m.sender_id = bot and m.receiver_id = p_user_id)
     or (m.sender_id = p_user_id and m.receiver_id = bot)
  limit 1;

  if v_match_id is null then
    insert into public.matches (sender_id, receiver_id, status)
    values (bot, p_user_id, 'active')
    returning id into v_match_id;
  end if;

  insert into public.messages (match_id, sender_id, body)
  values (v_match_id, bot, p_chat_body);
end $$;

-- Post a bot message to the member's coach thread; returns the message id.
create or replace function public.bot_send_workout(p_user_id uuid, p_body text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  bot constant uuid := '00000000-0000-0000-0000-000000000001';
  v_match_id uuid;
  v_msg_id uuid;
begin
  select m.id into v_match_id
  from public.matches m
  where (m.sender_id = bot and m.receiver_id = p_user_id)
     or (m.sender_id = p_user_id and m.receiver_id = bot)
  limit 1;

  if v_match_id is null then
    insert into public.matches (sender_id, receiver_id, status)
    values (bot, p_user_id, 'active')
    returning id into v_match_id;
  end if;

  insert into public.messages (match_id, sender_id, body)
  values (v_match_id, bot, p_body)
  returning id into v_msg_id;

  return v_msg_id;
end $$;

-- All push endpoints for one member (cron delivery).
create or replace function public.get_push_subscriptions_for_user(p_user_id uuid)
returns table (endpoint text, p256dh text, auth text)
language sql
security definer set search_path = public
as $$
  select ps.endpoint, ps.p256dh, ps.auth
  from public.push_subscriptions ps
  where ps.user_id = p_user_id;
$$;

-- No-card trial grant for grandfathered members. Cutoff mirrors
-- lib/coach-trial.ts GRANDFATHER_CUTOFF (2026-06-09) — on this fresh
-- database every account is newer, so this correctly returns
-- 'card_required' and routes new members through Stripe's card-on-trial.
create or replace function public.start_coach_trial()
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_created timestamptz;
  v_status text;
begin
  if v_uid is null then
    return 'not_authenticated';
  end if;

  select u.created_at into v_created from auth.users u where u.id = v_uid;
  if v_created is null or v_created >= '2026-06-09T00:00:00Z'::timestamptz then
    return 'card_required';
  end if;

  select s.status into v_status from public.ai_coach_subscriptions s where s.user_id = v_uid;
  if v_status in ('trialing', 'active') then
    return 'already_active';
  elsif v_status is not null then
    return 'already_used';
  end if;

  insert into public.ai_coach_subscriptions (user_id, status, current_period_end)
  values (v_uid, 'trialing', now() + interval '14 days')
  on conflict (user_id) do update
    set status = 'trialing', current_period_end = now() + interval '14 days';

  return 'granted';
end $$;

-- Emails from auth.users for crons/admin (auth schema is not client-readable).
create or replace function public.admin_get_auth_users()
returns table (id uuid, email text, provider text, last_sign_in_at timestamptz, created_at timestamptz)
language sql
security definer set search_path = public
as $$
  select
    u.id,
    u.email::text,
    coalesce(u.raw_app_meta_data->>'provider', 'email'),
    u.last_sign_in_at,
    u.created_at
  from auth.users u;
$$;

-- ═══ ROW LEVEL SECURITY ══════════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.ai_coach_intake enable row level security;
alter table public.ai_coach_subscriptions enable row level security;
alter table public.ai_workouts enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.notifications enable row level security;
alter table public.workouts enable row level security;

-- profiles: read own + the bot's (chat header); write own.
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or id = '00000000-0000-0000-0000-000000000001');
create policy profiles_update on public.profiles for update
  using (id = auth.uid());
create policy profiles_insert on public.profiles for insert
  with check (id = auth.uid());

-- intake: own row only.
create policy intake_all on public.ai_coach_intake for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- subscriptions: user reads own; writes come from service role / RPCs only.
create policy subs_select on public.ai_coach_subscriptions for select
  using (user_id = auth.uid());

-- workouts: user reads + updates (feedback) own; inserts via server action.
create policy workouts_select on public.ai_workouts for select
  using (user_id = auth.uid());
create policy workouts_update on public.ai_workouts for update
  using (user_id = auth.uid());
create policy workouts_insert on public.ai_workouts for insert
  with check (user_id = auth.uid());

-- matches: members of the match only.
create policy matches_select on public.matches for select
  using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy matches_update on public.matches for update
  using (sender_id = auth.uid() or receiver_id = auth.uid());
create policy matches_insert on public.matches for insert
  with check (sender_id = auth.uid());

-- messages: only within my matches; I can only send as myself.
create policy messages_select on public.messages for select
  using (exists (
    select 1 from public.matches m
    where m.id = match_id and (m.sender_id = auth.uid() or m.receiver_id = auth.uid())
  ));
create policy messages_insert on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.matches m
      where m.id = match_id and (m.sender_id = auth.uid() or m.receiver_id = auth.uid())
    )
  );
create policy messages_update on public.messages for update
  using (exists (
    select 1 from public.matches m
    where m.id = match_id and (m.sender_id = auth.uid() or m.receiver_id = auth.uid())
  ));

-- push subscriptions & notifications: own rows only.
create policy push_all on public.push_subscriptions for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notif_select on public.notifications for select
  using (user_id = auth.uid());
create policy notif_update on public.notifications for update
  using (user_id = auth.uid());

-- workout library: readable by any signed-in member.
create policy library_select on public.workouts for select
  using (auth.role() = 'authenticated');
