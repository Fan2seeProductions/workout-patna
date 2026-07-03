# Momentum AI — Product Strategy & Design Review
**Version 2.0 · July 2, 2026 · SCOPE APPROVED: AI coaching only — gym/partner app descoped**

---

## 0. Executive Summary

**Founder decision (July 2, 2026): this is an AI coaching site, full stop.** The gym-partner-matching product is retired. Everything in this strategy serves one product: an adaptive AI daily coach that learns from every workout.

The good news is the coach was always the revenue engine, and its stack is intact: deep intake (~40 fields), Opus-generated daily workouts with yesterday-aware adaptation, streaks, 4-channel delivery (in-app, push, SMS, voice call), a $9.99/mo Stripe subscription with 14-day trial, and a mature design system. **The pivot is mostly subtraction** — and subtraction is fast: fewer routes, fewer tabs, a simpler funnel, one clear story on the marketing site.

> **Strategic consequence of coach-only:** the social features in the original Momentum brief (friends, leaderboards, group challenges) are **out of scope**. The existing `challenges` machinery stays dormant; if retention data later argues for it, it can return as *coach-issued* challenges (you vs. your streak, not you vs. other users). Nothing social gets built or maintained now.

**Three blocking issues found during review (fix before anything else):**

1. 🔴 **The production Supabase project ("WorkoutPartna") is INACTIVE/paused.** The live app is almost certainly down right now. Nothing in this strategy matters until it's restored.
2. 🟠 **Zero product analytics.** PostHog is in the brief's stack but absent from the code. We are flying blind on conversion — every recommendation in §11 needs instrumentation to validate.
3. 🟡 **The adaptive loop is only one day deep.** Generation (Opus 4.7, cron at `api/cron/daily-workouts`) already reads yesterday's workout + feedback (too easy / just right / too hard / injured), and completion/streaks are tracked in `ai_workouts`. But memory resets daily — there is no long-term memory, no weekly review, no trend awareness. "Claude remembers everything" is the brand promise; today Claude remembers yesterday.

---

## 1. What Exists Today (Verified Inventory)

### Tech stack (from `package.json`)
Next.js 15.3.8 · React 19 · TypeScript 5.9 · Tailwind v4 · Supabase (`@supabase/ssr`) · Stripe 22 · `@anthropic-ai/sdk` 0.92 · web-push · Playwright E2E suite (accessibility, contrast, responsive, visual-regression tests already scripted).

### Routes
- **Marketing:** `/`, `/about`, `/how-it-works`, `/pricing`, `/trainers`, `/for-gyms-apartments`, `/business`, `/safety`, `/waiver`, `/privacy`, `/terms`
- **App shell** `(shell)`: `home`, `discover`, `browse`, `matches`, `workouts`, `challenges`, `gyms`, `merch`, `profile`
- **Coach:** `/app/coach` (CoachToday, CoachCheckout, intake, tabs), `/app/training-today`
- **Infra:** Stripe webhooks, Telnyx SMS, email verify, 3 Vercel crons (daily workout generation 12:00 UTC, intake nudge, intake reminders)

### Data model (26 tables referenced in code)
`profiles`, `gyms`, `matches`, `messages`, `ai_coach_intake`, `ai_workouts`, `ai_coach_subscriptions`, `training_today`, `workouts`, `workout_invites`, `challenges`, `challenge_participants`, `challenge_checkins`, `challenge_templates`, `trainers`, `trainer_applications`, `trainer_consultations`, `ratings`, `notifications`, `push_subscriptions`, `user_blocks`, `user_reports`, `merch_products`, `partner_leads`, `business_leads`, `location_admins`.

### AI engine (from `lib/ai/workout.ts`)
- Claude **Opus 4.7** (`ANTHROPIC_COACH_MODEL` env override already wired — clean upgrade path)
- `max_tokens: 1200`, structured workout output (focus/warm_up/main/finisher/notes), template fallback per training style if the API call fails, safety-flag output (`requires_human_review`) for medical concerns
- Generation prompt already includes yesterday's workout + user feedback and an optional regenerate reason ("I'm sore, upper body only")
- **Intake is already deep (~40 columns in `ai_coach_intake`):** goals, level, days/week, minutes, equipment, target areas, style, tone, delivery time, injuries, age, sex, height/weight, medical conditions, medications, pregnancy status, training years, PRs (bench/squat/deadlift), mile time, body fat %, sleep, stress, occupation activity, liked/disliked exercises, cardio preference, mobility issues, sports profile, SMS consent (with TCPA timestamp/IP), liability disclaimer
- Delivery channels: in-app, web push, SMS (Telnyx), and **voice call with TTS** (Telnyx TeXML) — a real accessibility/differentiation asset
- Feedback loop v1 exists: `ai_workouts.feedback` (too_easy/just_right/too_hard/injured), `completed_at`, DONE/SKIP/MODIFY replies, 30-day rolling streak calculation
- Free workout library (`workouts` table, `/app/workouts`) searchable by body part + level

### Monetization
Stripe: **$9.99/mo AI Coach subscription, 14-day free trial** (card upfront for new users; grandfathered no-card path in `lib/coach-trial.ts`), hardened webhook (recent commit). Merch table exists but no checkout flow.

### Design system
`DESIGN.md` is genuinely excellent — 677 lines: full token set, surface-ladder elevation, motion spec, voice & tone, forbidden patterns, accessibility rules backed by Playwright contrast audits. **Keep it. Do not replace it.** (Additions needed: §14.)

### PWA & comms
`manifest.json` + `sw.js` (installable), web-push subscriptions, Resend email (welcome, verify, intake reminders), Telnyx SMS.

### What's absent (the Momentum gap)
Desk Mode / micro-workouts · long-term coach memory (loop is only 1 day deep) · recovery score · morning briefing dashboard · progress tracking (weight/photos/measurements trending) · weekly/monthly AI reviews · wearables/HealthKit · nutrition · achievements/leaderboards (streaks exist, badges are per-challenge only) · PostHog · form analysis · offline workout caching · corporate wellness dashboard · trainer-side portal.

---

## 2. Product Strategy (coach-only)

### Positioning
**"The AI trainer that adapts to your actual life."** Not a workout library, not a logging app, not a fitness social network. The wedge is *adaptation*: office → hotel → home → gym, injured → recovered, tired → fresh — the plan changes daily because the coach remembers. One product, one subscription, one job: today's workout, made for you, delivered wherever you are (app, push, text, or a phone call that reads it to you).

### Sequenced ICP (don't serve 20 personas at once)
| Wave | Persona | Why first |
|---|---|---|
| 1 | **Desk workers / busy professionals** (Houston/Cypress corporate market) | Desk Mode is the cheapest-to-build, highest-differentiation feature |
| 2 | Busy parents & travelers | Same "no time, no equipment" engine, new contexts |
| 3 | Beginners & returners | Highest volume, need the most hand-holding — coach tone system already exists |
| 4 | Adaptive athletes (wheelchair, seniors, postpartum) | Requires medical-grade prompt care; do it right, not fast |
| 5 | Serious lifters | Progressive overload depth; corporate wellness only if B2B leads pull it |

Every persona uses the **same engine** — intake fields + prompt context change, not the product.

### Competitive frame
Whoop/Oura own recovery *measurement* but don't tell you what to do at 2pm in a hotel. Apple Fitness+ owns content but doesn't adapt. Duolingo owns habit mechanics but not fitness. **Momentum's moat is the closed adaptive loop (§3) — data no competitor has: what you actually did yesterday, how it felt, and what your life allows today.** Coach-only sharpens this: every screen, notification, and dollar serves the loop.

---

## 3. The Adaptive Loop (the core product)

This is the #1 build priority. Everything else is decoration until this loop closes.

```
 Intake ──▶ Generate (Opus, cron 12:00) ──▶ Deliver (push/SMS at delivery_time)
    ▲                                              │
    │                                              ▼
 Profile enrichment ◀── Weekly AI review ◀── COMPLETE / SKIP / MODIFY
 (progressive Qs)          (Sunday)          + 10-sec feedback:
                                             effort (1–5) · pain? · too easy/hard?
```

**What already exists:** completion + 4-value feedback on `ai_workouts`, yesterday-aware generation, streaks, DONE/SKIP/MODIFY replies. **The gap is depth, not existence.**

**Schema changes required:** extend `ai_workouts` completion with effort (1–5), pain flag, actual duration; new `user_metrics` (daily optional self-reports: weight, sleep_hrs, energy, soreness); new `coach_memory` (rolling structured summary the generator reads: PRs, streak, skipped patterns, flagged pains, last deload).

**Prompt architecture:** generator receives intake + last 7 days (not just yesterday) + `coach_memory` summary + today's context (location/equipment override). The weekly review job (new cron, Sonnet-class model) compresses history into `coach_memory` — this keeps the daily prompt small, fast, and cheap while making Claude "remember everything," not just yesterday.

**Coach messages become earned, not canned:** "You skipped legs twice" is a query over completion history, not a random nudge. Rules first, LLM-phrased.

### AI cost model (approximate, at current published pricing)
| Call | Model | Est. cost | Frequency |
|---|---|---|---|
| Daily workout | Opus tier | ~$0.03–0.05 | 1/day/active sub |
| Weekly review + memory compression | Sonnet tier | ~$0.02 | 1/wk |
| Desk-mode micro workout | Haiku tier | <$0.005 | on demand |
| Coach chat message | Sonnet tier | ~$0.01 | per message (rate-limit free tier) |

≈ **$1.20–1.80/mo per fully-active subscriber** against $9.99 revenue — healthy, and the `ANTHROPIC_COACH_MODEL` env override means model tiering is config, not code. Micro-workouts and chat should NOT use Opus.

---

## 4. Feature Roadmap (reuse-mapped, in build order)

### Phase 0 — Stabilize + Descope (days)
1. **Restore the paused Supabase project** (blocking; needs your approval — billing).
2. **Execute the descope (§4b):** remove gym-app routes and nav, simplify onboarding to coach intake only, refocus the marketing site on the coach.
3. Add **PostHog** (funnel events: signup → intake start → intake complete → trial → first workout viewed → first completion → paid).
4. Fix any post-restore breakage; run existing Playwright QA suite.

### Phase 1 — Close the loop (the product) 
4. Richer completion feedback — effort 1–5, pain flag, actual duration — added to the existing DONE/feedback flow (extends `CoachToday` hero screen and the SMS reply parser).
5. `coach_memory` + 7-day-window generation prompt (upgrade from yesterday-only).
6. Surface the existing streak as a first-class consistency score with celebration states (Duolingo mechanic; calculation already exists).
7. Weekly AI review (new cron + Resend email + in-app card) — also writes `coach_memory`.

### Phase 2 — Desk Mode + Dashboard
8. **Desk Mode**: context picker (desk / chair-only / standing / hotel / airport / bands / no-equipment) → instant micro-workout (Haiku, seconds, no cron). One new screen + one prompt variant. *This is the marketing headline feature.*
9. **Morning Briefing dashboard** replaces `home`: today's workout hero, streak, recovery/energy check-in, hydration & step goals, coach message, next achievement (wireframe §8).
10. Progress tracking: weight trend, measurements, photos (bucket + `photos.ts` helper exists), PR log.

### Phase 3 — Retention
11. Notification engine upgrade: behavioral triggers (streak-at-risk, stand-up nudge, recovery-low) on existing web-push + Telnyx rails; per-user caps + quiet hours.
12. Achievements system — coach-issued milestones only (streaks, PRs, consistency), no leaderboards, no other users. Celebration animations per DESIGN.md motion spec.
13. Monthly progress report (email + in-app) generated from `coach_memory`.

### Phase 4 — Expansion (each gated on Phase-1/2 metrics)
14. Wearables: **manual + Apple Health export first**; native HealthKit requires wrapping the PWA in Capacitor/native shell — see §12 reality check.
15. Nutrition suggestions (prompt extension) → meal planning (premium tier).
16. Form analysis (video upload + vision model) — premium, later; expensive and liability-sensitive.

**Pricing evolution:** keep $9.99 Coach as the anchor — it is now the entire business. Introduce **a $19.99 premium tier** when Phase 2 ships (nutrition, advanced analytics, voice delivery could become premium). Annual at ~2 months free.

### 4b. Descope Plan (the subtraction)

| Retire (remove routes + nav) | Keep dormant (data preserved, UI removed) | Keep & refocus |
|---|---|---|
| `/app/browse`, `/app/discover`, `/app/matches`, `/app/messages/*` (user-to-user) | `matches`, `messages`, `workout_invites`, `ratings`, `user_blocks`, `user_reports` tables | `/app/coach` + `/app/training-today` → become the app |
| `/app/gyms`, `/app/locations/*`, `/app/merch` | `gyms`, `merch_products`, `location_admins`, `challenges*` tables | Coach intake, `ai_workouts`, subscriptions, push/SMS/voice |
| `/app/trainers/*`, trainer application flow | `trainers`, `trainer_applications`, `trainer_consultations` | `/app/challenges` → retire UI now; possible coach-challenges later |
| Onboarding steps: location-type, find-location, intent | `partner_leads`, `business_leads` (B2B optionality) | Onboarding = account → coach intake Layer 1 → first workout |
| Marketing: `/trainers`, `/for-gyms-apartments`, `/business/*` | — | `/`, `/pricing`, `/how-it-works`, `/about`, legal pages — rewritten around the coach |

**Descope rules:** (1) No data deletion — tables stay, RLS stays, UI goes; reversal stays cheap. (2) 301-redirect retired marketing routes to `/` so SEO equity isn't burned. (3) Admin location tooling retires with the gyms directory. (4) The waiver/liability + safety pages stay — they protect the coaching business.

---

## 5. Deep Onboarding — Conversion Review

Good news: the brief's "incredibly thorough intake" is ~80% built — `ai_coach_intake` already has ~40 columns covering demographics, medical history, PRs, lifestyle, sports, and legal consent. **The problem is shape, not depth: it's one wall.** Every onboarding study and Duolingo's own funnel work the same way: ask the minimum to deliver the first "wow," then earn the right to ask more.

**Restructure the existing intake into three layers (near-zero schema work):**
- **Layer 1 — before first workout (≤2 min, ~10 of the existing fields):** goal → where do you work out (adds *desk/office* option) → equipment → time available → level → injuries/pain → tone. Generate the first workout **immediately on completion** (not at next cron) — the aha moment must be < 3 minutes from signup.
- **Layer 2 — first week, one question per day inside the flow (existing columns):** sleep, stress, occupation activity, exercise likes/hates, height/weight, medical restrictions, sports. Each answer visibly changes tomorrow's workout ("Got it — adding hip openers because you sit 9 hours").
- **Layer 3 — earned/contextual (mostly new fields):** progress photos, measurements, body-fat, wearable data, supplements, VO2, travel frequency — requested when a feature needs them, with the payoff stated.

This converts the already-built deep intake into a retention mechanic instead of a drop-off cliff. Keep SMS consent + liability disclaimer in Layer 1 (legal, non-negotiable).

---

## 6. UX Review of the Current App

**Strengths:** the Today hero redesign (recent commit) is the right instinct — one action per screen. Design system discipline is rare at this stage and is a genuine asset. Bottom-tab PWA shell matches one-handed mobile use.

**Issues to fix in-flow (no redesign needed):**
1. `home` vs `coach` vs `training-today` vs `workouts` — four surfaces compete for "what do I do today?" **Collapse to one Today surface** (the briefing, §8); everything else becomes a tab or card.
2. Navigation has ~9 shell destinations (browse, discover, matches, gyms, merch…). Coach-only collapses this to **3 tabs: Today · Progress · Coach (chat)** — profile/settings behind the avatar. Everything else is removed per the descope plan (§4b). Minimal navigation is in the brief and in DESIGN.md's spirit; the pivot finally makes it achievable.
3. Completion state is a dead end today — finishing a workout must celebrate (streak tick, PR confetti — the *only* sanctioned bouncy moment) then tee up tomorrow.
4. The 14-day trial exists but new users hit the card wall (`CoachCheckout`) before experiencing the product; test **value-first ordering**: intake → first workout generated instantly → card capture after the first completed workout (day 1–3). The grandfathered no-card trial path in `lib/coach-trial.ts` proves the plumbing already supports this.

---

## 7. Wireframe — Morning Briefing (Today)

```
┌─────────────────────────────┐
│ TUESDAY, JUL 2      🔥 12   │  ← streak pill (amber only if at-risk)
│                             │
│ Good morning, Marcus.       │  ← display-md Poppins
│ "Slept rough? We'll keep    │  ← coach line, from memory+metrics
│  today at 70%."             │
│                             │
│ ┌─────────────────────────┐ │
│ │ TODAY'S WORKOUT         │ │  ← full-bleed hero card (reuse
│ │ Upper Push · 40 min     │ │    training-today redesign)
│ │ Hotel-room variant ✈    │ │  ← context chip
│ │ [ Start Workout → ]     │ │  ← the ONE red CTA
│ └─────────────────────────┘ │
│                             │
│ ⚡ Energy check  ○○○●○      │  ← 5-sec input feeds recovery
│                             │
│ ┌───────┐ ┌───────┐ ┌─────┐ │
│ │ 💧 Water│ │ 👣 Steps│ │ ⚖ │ │  ← metric pills, surface-soft
│ └───────┘ └───────┘ └─────┘ │
│                             │
│ ▸ This week: 3/4 workouts  │  ← weekly goal card (coach memory)
│─────────────────────────────│
│   Today   Progress   Coach  │  ← 3-tab bottom nav
└─────────────────────────────┘
```

## Wireframe — Desk Mode picker

```
┌─────────────────────────────┐
│ ◀  DESK MODE                │
│ Where are you right now?    │
│                             │
│ [🪑 At my desk] [🧍 Standing]│  ← pill grid, wp-pill styles
│ [✈ Airport]   [🏨 Hotel]    │
│ [🎗 Bands only] [🚶 Walking] │
│                             │
│ How long do you have?       │
│   [ 5 ]  [ 10 ]  [ 15 ] min │
│                             │
│ [ Generate My Break → ]     │  ← Haiku call, <3s, no cron
└─────────────────────────────┘
```

## Wireframe — Workout complete

```
┌─────────────────────────────┐
│        ✓  DONE.             │
│   Streak: 13 days 🔥        │  ← celebration moment
│   New PR: Goblet Squat 60lb │
│                             │
│ How did that feel?          │
│  Effort   ○ ○ ● ○ ○         │
│  Any pain?   [No] [Yes…]    │  ← feeds safety flag
│  Difficulty [😴][👍][🥵]     │
│                             │
│ [ Lock It In → ]            │  ← writes workout_completions
│ "Tomorrow: legs. I saw you  │
│  skipped them last week."   │  ← memory teaser = retention hook
└─────────────────────────────┘
```

---

## 8. Architecture Review

**Verdict: sound. Extend, don't restructure.**
- App Router + server actions + Supabase RLS is the right shape; recent commits show RLS and webhook hardening maturity.
- **Generation must move to event-driven-plus-cron:** cron remains the batch default; add on-demand generation (first workout, desk mode, context change) as a server action with the existing template fallback. Consider Vercel Queues for retry semantics when volume grows.
- `lib/ai/` should grow to `workout.ts` + `micro.ts` + `review.ts` + `memory.ts` + `prompts/` — one module per loop stage, shared safety layer (the medical-flag pattern already in `workout.ts` becomes the shared gate).
- Keep model IDs in env (already done). Add per-call model tiering (§3 table).
- **Migrations discipline:** schema currently lives only in the hosted DB (no SQL files in repo). Adopt `supabase/migrations/` going forward — mandatory before Phase 1 schema work.

## 9. Scalability Review
- Daily cron generating for all subscribers is O(n) sequential Opus calls — fine to ~1k subs; beyond that, batch with concurrency + queue, stagger by `delivery_time` timezone buckets (also fixes "12:00 UTC = 6am Houston" being wrong for non-US users).
- `coach_memory` compression keeps prompt size flat as history grows — this is the key scaling decision for both cost and latency.
- Supabase Postgres 17 is nowhere near limits; add indexes on `workout_completions(user_id, created_at)` and `ai_workouts(user_id, for_date)` when created.
- Static marketing pages + PWA shell already CDN-friendly on Vercel.

## 10. Apple / HIG Compliance Review
- **Reality check the brief:** a PWA cannot access HealthKit, and "Apple compliant" App Store rules only apply if we ship a native wrapper. Path: PWA now → **Capacitor wrapper in Phase 4** for HealthKit + native push + App Store presence. Design for it now (no web-only UI patterns in core flows).
- HIG alignment is already strong (large type, one action/screen, dark-first). Gaps: respect `prefers-reduced-motion` in the motion system; safe-area insets for the bottom tab bar on notched devices; 44pt touch targets are already the button height standard — keep it.
- If/when native ships: subscriptions via App Store require IAP (30/15% cut) unless qualifying for external-purchase rules — factor into pricing before the wrapper ships.

## 11. Accessibility Review
- Existing contrast-audit + axe Playwright suites are ahead of the curve. Extend to new screens as they land (already the DESIGN.md rule).
- Additions required by Momentum's own mission (wheelchair users are a named persona): all workout content must carry **seated/standing/adaptive variants** as first-class generation parameters, not afterthoughts; celebration animations need reduced-motion fallbacks; energy/effort inputs need full keyboard + screen-reader labeling; charts (Phase 2) need data-table equivalents.

## 12. Reusable Components (build-on inventory)
Existing (coach-relevant): `AICoachPromoBanner`, `BackButton`, `wp-*` utility classes, step-progress pattern from intake, Today hero from `training-today`, `PushNotificationSetup`/`PushSubscriptionToggle`, push/SMS/voice/email senders, trial logic, safety-flag pipeline. (`PremiumBadge` and challenge cards retire with the gym app.)
New shared components needed (build once in Phase 1–2): `MetricPill`, `StreakFlame`, `EnergyDots` (5-state input), `TrendChart` (weight/strength — one chart component, many metrics), `CoachMessageCard`, `CelebrationSheet`, `ContextChip` (hotel/desk/gym variant indicator).

## 13. Design System Additions (extend DESIGN.md, never fork)
- **Data-viz tokens:** trend-positive (existing `success`), trend-negative (existing `destructive`), neutral gridline (`hairline-soft`), chart accent = white, *never* red (red stays voltage-only).
- **Recovery/energy scale:** 5-step semantic ramp (define tokens; suggest green→amber→red is *not* used literally — use white-opacity ladder + one semantic dot to stay on-brand).
- **Celebration motion:** one sanctioned exception to "never bouncy" — the completion moment, ≤600ms, reduced-motion-safe. Document it in DESIGN.md's exceptions section.
- Rename decision (§15) determines wordmark work; tokens are brand-name-agnostic.

## 14. Metrics Plan (PostHog, Phase 0)
North star: **weekly active completers** (users completing ≥2 workouts/week).
Funnel: visit → signup → intake L1 complete → first workout generated → first completion → D7 streak ≥3 → trial→paid → M1 retention.
Guardrails: generation latency, generation failure/fallback rate, cost per active user, churn reason (cancel survey).

## 15. Decisions

✅ **DECIDED (July 2, 2026): Coach-only scope.** The gym/partner-matching app is descoped per §4b. Strategy approved as "complete" by founder.

Still open:
1. **Restore the Supabase project now?** (blocking everything; billing implication)
2. **Brand:** the pivot changes this calculus — "WorkoutPartna" is literally named for the partner-matching feature that's being retired. A coach-only product argues harder for the **Momentum AI** name (or keeping the red/black system under a new wordmark; the design tokens are name-agnostic). Domain, Stripe product names, and Houston equity are the switching costs. Recommend deciding *before* the marketing-site rewrite in Phase 0 so copy is written once.
3. **Value-first funnel** (intake → instant first workout → card capture after first completion) vs current card-upfront trial — recommend value-first; approve to proceed.
4. **Pricing:** hold $9.99 anchor + add $19.99 premium tier at Phase 2?

---

## 16. Risks
| Risk | Mitigation |
|---|---|
| Supabase project paused → data loss window | Restore immediately; export backup; enable PITR |
| Medical liability (injuries, pregnancy, adaptive) | Safety-flag gate already exists — make it a hard block + disclaimer flow; Wave-4 personas get clinical prompt review |
| AI cost creep as features multiply | Model tiering table (§3) is policy: Opus only for the daily session |
| 50-field onboarding kills conversion | Progressive profiling (§5) — non-negotiable |
| Notification fatigue → uninstall | Behavioral triggers only, per-user caps, quiet hours from `delivery_time` |
| Scope: 15 feature areas in brief | Phases gated on metrics; nothing in Phase 3+ starts before weekly-active-completer target is set and measured |

---

*Scope is approved (coach-only). Implementation can begin with Phase 0 once decision #1 (Supabase restore) is confirmed; decision #2 (brand) should land before the marketing-site rewrite so copy is written once.*
