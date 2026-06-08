// Trial eligibility rules for AI Daily Coach.
//
// Policy (as of June 2026):
//   - Members who created their account on or before GRANDFATHER_CUTOFF keep
//     the original NO-credit-card 14-day trial.
//   - Everyone who signs up after the cutoff must put a card on file up front
//     (Stripe Checkout collects it, with a 14-day free trial before the first
//     charge). This is the standard card-on-trial flow.
//
// The cutoff is overridable via the COACH_TRIAL_GRANDFATHER_CUTOFF env var
// (ISO-8601) so you can move the line without a code change. Default is the
// rollout date — anyone already in the system at rollout is grandfathered.

export const GRANDFATHER_CUTOFF =
  process.env.COACH_TRIAL_GRANDFATHER_CUTOFF ?? '2026-06-09T00:00:00Z'

/**
 * True if this account was created on/before the grandfather cutoff and is
 * therefore entitled to the no-card trial. Pass auth user's created_at.
 * Unknown/missing created_at is treated as NOT grandfathered (safer default:
 * a new account with no timestamp shouldn't get a free pass).
 */
export function isGrandfathered(userCreatedAt: string | null | undefined): boolean {
  if (!userCreatedAt) return false
  const created = new Date(userCreatedAt)
  if (Number.isNaN(created.getTime())) return false
  return created < new Date(GRANDFATHER_CUTOFF)
}
