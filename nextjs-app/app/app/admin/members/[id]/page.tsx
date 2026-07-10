// /app/admin/members/[id] — full member detail for the WorkoutPartna owner.
// Shows profile info + AI coach intake form answers side-by-side.
// Only accessible to accounts in the ADMIN_EMAILS env var.
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ShieldCheck, Globe, Mail, Brain } from 'lucide-react'
import { createClient } from '../../../../../lib/supabase/server'
import { createAdminClient } from '../../../../../lib/supabase/admin'

export const metadata = { title: 'Member Detail · Admin', robots: { index: false, follow: false } }

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'sales@fan2seeproductions.com,dwilliams@fan2seeproductions.com')
  .split(',').map(e => e.trim().toLowerCase())

function fmt(iso: string | null | undefined) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtHeight(inches: number | null | undefined) {
  if (!inches) return '—'
  const ft = Math.floor(inches / 12)
  const i = inches % 12
  return `${ft}'${i}"`
}

function tag(v: string | null | undefined, fallback = '—') {
  return v ?? fallback
}

function arrayTag(v: string[] | null | undefined) {
  if (!v || v.length === 0) return '—'
  return v.join(', ')
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-[var(--color-primary)]">{icon}</span>}
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/50">{title}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-[12px] text-white/40 shrink-0 w-[130px]">{label}</p>
      <p className={`text-[13px] font-semibold text-right flex-1 ${highlight ? 'text-[var(--color-primary)]' : 'text-white'}`}>
        {value || '—'}
      </p>
    </div>
  )
}

export default async function AdminMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // User session ONLY for the admin gate. Member data is read with the
  // service-role client — another member's rows are hidden by RLS otherwise,
  // and admin_get_auth_users is REVOKE'd from authenticated.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')
  if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')) redirect('/app/home')

  const admin = createAdminClient()
  if (!admin) redirect('/app/home')

  // Fetch profile
  const { data: profile } = await admin
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!profile) redirect('/app/admin/members')

  // Fetch auth user info
  const { data: authUsers } = await admin
    .rpc('admin_get_auth_users')
    .select('*')

  const authUser = (authUsers as Array<{ id: string; email: string; provider: string; last_sign_in_at: string | null; created_at: string }> | null)
    ?.find(u => u.id === id)

  // Fetch AI coach intake
  const { data: intake } = await admin
    .from('ai_coach_intake')
    .select('*')
    .eq('user_id', id)
    .maybeSingle()

  const isGoogle = authUser?.provider === 'google'
  const initial = (profile.display_name ?? '?')[0]?.toUpperCase()

  return (
    <main className="mx-auto max-w-2xl px-4 pt-5 pb-24" style={{ background: '#0d0d0d', minHeight: '100dvh' }}>

      {/* Header */}
      <header className="flex items-center gap-3 mb-6">
        <Link
          href="/app/admin/members"
          className="h-9 w-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/[0.08] transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] mb-0.5">Admin · Members</p>
          <h1 className="text-[20px] font-extrabold tracking-tight text-white truncate">{profile.display_name ?? 'No name'}</h1>
        </div>
      </header>

      {/* Profile card */}
      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 mb-4 flex gap-4">
        <div className="shrink-0 h-16 w-16 rounded-full overflow-hidden bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-extrabold text-[22px]">
          {profile.photo_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
            : initial}
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-[17px] text-white">{profile.display_name ?? 'No name'}</p>
            {profile.is_premium && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300">PRO</span>
            )}
            {isGoogle
              ? <Globe className="w-3.5 h-3.5 text-blue-400" />
              : <Mail className="w-3.5 h-3.5 text-white/30" />}
            {profile.email_verified_at && (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>
          <p className="text-[13px] text-white/50">{authUser?.email ?? '—'}</p>
          <p className="text-[12px] text-white/30">Joined {fmt(authUser?.created_at ?? profile.created_at)}</p>
          {authUser?.last_sign_in_at && (
            <p className="text-[12px] text-white/30">Last seen {fmt(authUser.last_sign_in_at)}</p>
          )}
        </div>
      </div>

      {/* Profile basics */}
      <div className="mb-4">
        <Section title="Profile">
          <Row label="Bio" value={profile.bio ?? '—'} />
          <Row label="Gym" value={profile.gym_id ?? '—'} />
          <Row label="Goals" value={arrayTag(profile.goals)} />
          <Row label="Training styles" value={arrayTag(profile.styles)} />
          <Row label="Schedule days" value={arrayTag(profile.schedule_days)} />
          <Row label="Schedule times" value={arrayTag(profile.schedule_times)} />
          <Row label="Fitness level" value={tag(profile.fitness_level)} />
          <Row label="Vibe" value={tag(profile.vibe)} />
          <Row label="Email verified" value={profile.email_verified_at ? `✓ ${fmt(profile.email_verified_at)}` : '✗ Not verified'} highlight={!profile.email_verified_at} />
        </Section>
      </div>

      {/* Intake form answers */}
      {intake ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-2">
            <Brain className="w-4 h-4 text-[var(--color-primary)]" />
            <p className="text-[13px] font-bold text-white">AI Coach Intake</p>
            <span className="text-[11px] text-white/40 ml-1">submitted {fmt(intake.created_at)}</span>
          </div>

          <Section title="About you — Demographics & Safety">
            <Row label="Age" value={intake.age ?? '—'} />
            <Row label="Sex" value={tag(intake.sex)} />
            <Row label="Height" value={fmtHeight(intake.height_inches)} />
            <Row label="Weight" value={intake.weight_lbs ? `${intake.weight_lbs} lbs` : '—'} />
            <Row label="Body fat %" value={intake.body_fat_pct ? `${intake.body_fat_pct}%` : '—'} />
            <Row label="Medical conditions" value={arrayTag(intake.medical_conditions)} />
            <Row label="Medications" value={tag(intake.medications)} />
            <Row label="Pregnancy status" value={tag(intake.pregnancy_status)} />
          </Section>

          <Section title="Training history">
            <Row label="Years training" value={intake.training_years ?? '—'} />
            <Row label="Bench PR" value={intake.pr_bench_lbs ? `${intake.pr_bench_lbs} lbs` : '—'} />
            <Row label="Squat PR" value={intake.pr_squat_lbs ? `${intake.pr_squat_lbs} lbs` : '—'} />
            <Row label="Deadlift PR" value={intake.pr_deadlift_lbs ? `${intake.pr_deadlift_lbs} lbs` : '—'} />
            <Row label="Mile time PR" value={tag(intake.pr_mile_time)} />
            <Row label="Sleep (avg/night)" value={intake.sleep_hours_avg ? `${intake.sleep_hours_avg}h` : '—'} />
            <Row label="Stress level" value={tag(intake.stress_level)} />
            <Row label="Occupation activity" value={tag(intake.occupation_activity)} />
          </Section>

          <Section title="Goals & equipment">
            <Row label="Goals" value={arrayTag(intake.goals)} />
            <Row label="Fitness level" value={tag(intake.fitness_level)} />
            <Row label="Days / week" value={intake.days_per_week ?? '—'} />
            <Row label="Minutes / session" value={intake.workout_minutes ? `${intake.workout_minutes}m` : '—'} />
            <Row label="Equipment" value={arrayTag(intake.equipment)} />
            <Row label="Target areas" value={arrayTag(intake.target_areas)} />
            <Row label="Goal target" value={tag(intake.goal_target)} />
            <Row label="Target date" value={intake.goal_target_date ? fmt(intake.goal_target_date) : '—'} />
          </Section>

          <Section title="Style & preferences">
            <Row label="Training style" value={tag(intake.training_style)} />
            <Row label="Coaching tone" value={tag(intake.coaching_tone)} />
            <Row label="Cardio preference" value={arrayTag(intake.cardio_preference)} />
            <Row label="Delivery time" value={tag(intake.delivery_time)} />
            <Row label="Injuries / limits" value={tag(intake.injuries)} />
            <Row label="Liked exercises" value={tag(intake.liked_exercises)} />
            <Row label="Disliked exercises" value={tag(intake.disliked_exercises)} />
            <Row label="Mobility issues" value={tag(intake.mobility_issues)} />
          </Section>

          <Section title="Delivery & consent">
            <Row label="Phone" value={intake.phone_number ?? '—'} />
            <Row label="SMS opt-in" value={intake.sms_opt_in ? `✓ Yes (${fmt(intake.sms_opt_in_at)})` : '✗ No'} highlight={!intake.sms_opt_in} />
            {intake.sms_opted_out_at && (
              <Row label="SMS opted out" value={fmt(intake.sms_opted_out_at)} highlight />
            )}
            <Row label="Coaching paused" value={intake.paused ? '⏸ Yes' : 'No'} highlight={intake.paused} />
            <Row label="Disclaimer accepted" value={intake.disclaimer_accepted ? `✓ v${intake.disclaimer_version} on ${fmt(intake.disclaimer_accepted_at)}` : '✗ Not accepted'} />
          </Section>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 text-center">
          <Brain className="w-8 h-8 text-white/20 mx-auto mb-2" />
          <p className="text-[14px] font-semibold text-white/40">No intake form submitted yet</p>
          <p className="text-[12px] text-white/25 mt-1">This member hasn't completed the AI Coach intake.</p>
        </div>
      )}
    </main>
  )
}
