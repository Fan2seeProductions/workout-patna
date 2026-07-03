// /app/profile — display view. Mirrors the Replit Profile page.
// Editing form lives at /app/profile/edit.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Settings, MapPin, Calendar, Dumbbell, Shield, LogOut, LayoutDashboard,
} from 'lucide-react'
import { createClient } from '../../../../lib/supabase/server'
import { signOut } from '../../../../lib/actions/profile'
import { profileCompletion } from '../../../../lib/profile-completion'
import { PremiumBadgeIf } from '../../../../components/app/PremiumBadge'
import { ProfilePrompts } from '../../../../components/app/ProfilePrompts'
import { sanitizePrompts } from '../../../../lib/profile/prompts'

export const metadata = { title: 'Profile', robots: { index: false, follow: false } }

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'sales@fan2seeproductions.com,dwilliams@fan2seeproductions.com')
  .split(',').map(e => e.trim().toLowerCase())

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  let gymLabel: string | null = null
  if (profile?.gym_id) {
    const { data: g } = await supabase.from('gyms').select('name, city').eq('id', profile.gym_id).maybeSingle()
    if (g?.name) gymLabel = `${g.name}${g.city ? ` · ${g.city}` : ''}`
  }

  const completion = profileCompletion(profile ?? {})

  const name     = profile?.display_name ?? user.email?.split('@')[0] ?? 'Member'
  const age      = profile?.age
  const bio      = profile?.bio || 'No bio yet. Tap Edit Profile to add one.'
  const level    = profile?.fitness_level || 'Set your level'
  const schedule = (profile?.schedule_times ?? []).join(', ') || (profile?.schedule_days ?? []).join(', ') || 'Set your schedule'
  const goals    = (profile?.goals ?? []) as string[]
  const interests = (profile?.styles ?? []) as string[]
  const location = gymLabel || profile?.primary_location || 'Set your location'

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0d0d0d' }}>

      {/* ── Hero ── */}
      <div className="relative">
        {profile?.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photo_url}
            alt="Profile"
            className="h-72 w-full object-cover"
          />
        ) : (
          <div className="h-72 w-full brand-gradient flex items-center justify-center">
            <span className="text-6xl font-extrabold text-white select-none">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Dark gradient overlay at bottom of hero */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent pointer-events-none" />

        {/* Settings gear — top right */}
        <Link
          href="/app/profile/edit"
          aria-label="Settings"
          className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-black/60 transition"
        >
          <Settings className="w-5 h-5" />
        </Link>

        {/* Name + age + badge overlaid at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <h1 className="text-[28px] font-extrabold font-display text-white leading-tight inline-flex flex-wrap items-center gap-2">
            {name}{age ? `, ${age}` : ''}
            <PremiumBadgeIf
              isPremium={!!profile?.is_premium}
              premiumUntil={profile?.premium_until ?? null}
              size="md"
            />
          </h1>
          <p className="text-[13px] text-white/70 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            {location}
          </p>
        </div>
      </div>

      {/* ── Edit Profile CTA ── */}
      <div className="px-5 mt-4">
        <Link
          href="/app/profile/edit"
          className="brand-gradient w-full flex items-center justify-center h-11 rounded-full font-extrabold text-[14px] text-white shadow-lg hover:opacity-90 transition"
        >
          Edit Profile
        </Link>
      </div>

      <div className="px-4 mt-6 space-y-5">

        {/* ── Profile completion card ── */}
        {completion.pct < 100 && (
          <div className="rounded-2xl p-4" style={{ background: 'rgba(220,22,22,0.06)', border: '1px solid rgba(220,22,22,0.2)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-white">
                Profile {completion.pct}% complete
              </p>
              <Link href="/app/profile/edit" className="text-[12px] font-bold text-[var(--color-primary)]">
                Finish →
              </Link>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full brand-gradient transition-[width] duration-300"
                style={{ width: `${completion.pct}%` }}
              />
            </div>
            {completion.missing.length > 0 && (
              <p className="mt-2 text-[12px] text-white/50">
                Add: {completion.missing.slice(0, 3).join(', ')}
                {completion.missing.length > 3 ? ` +${completion.missing.length - 3} more` : ''}
              </p>
            )}
            {!completion.ready && (
              <p className="mt-1.5 text-[11.5px] text-white/50">
                Complete your profile so your AI Coach can personalize your workouts better.
              </p>
            )}
          </div>
        )}

        {/* ── About / Bio card ── */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
          <h2 className="text-[11px] uppercase font-bold tracking-wider text-white/40 mb-3">About Me</h2>
          <p className="text-white/70 text-sm leading-relaxed">{bio}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {/* Fitness level pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold"
              style={{ background: 'rgba(220,22,22,0.10)', color: 'var(--color-primary)', border: '1px solid rgba(220,22,22,0.20)' }}>
              <Dumbbell className="w-3.5 h-3.5" />
              {level}
            </div>
            {/* Schedule pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold bg-white/[0.06] text-white/80 border border-white/10">
              <Calendar className="w-3.5 h-3.5" />
              {schedule}
            </div>
          </div>
        </div>

        {/* ── Goals ── */}
        <div className="space-y-2">
          <h3 className="text-[11px] uppercase font-bold tracking-wider text-white/40 ml-1">My Goals</h3>
          <div className="flex flex-wrap gap-2">
            {goals.map(goal => (
              <span
                key={goal}
                className="px-3 py-1.5 rounded-full text-[12px] font-bold"
                style={{ background: 'rgba(220,22,22,0.10)', color: 'var(--color-primary)', border: '1px solid rgba(220,22,22,0.20)' }}
              >
                {goal}
              </span>
            ))}
            <Link
              href="/app/profile/edit"
              className="px-3 py-1.5 rounded-full text-[12px] font-bold text-white/40 border border-dashed border-white/20 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition"
            >
              + Add Goal
            </Link>
          </div>
        </div>

        {/* ── Prompts (Hinge-style) ── */}
        {(() => {
          const saved = sanitizePrompts(profile?.profile_prompts)
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <h3 className="text-[11px] uppercase font-bold tracking-wider text-white/40">
                  Prompts
                </h3>
                <Link href="/app/profile/prompts" className="text-[12px] font-bold text-[var(--color-primary)]">
                  {saved.length === 0 ? 'Add prompts →' : 'Edit →'}
                </Link>
              </div>
              {saved.length > 0 ? (
                <ProfilePrompts prompts={saved} hideHeading />
              ) : (
                <Link
                  href="/app/profile/prompts"
                  className="block rounded-2xl border border-dashed border-white/20 p-5 text-center text-sm font-bold text-white/40 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition"
                >
                  + Pick up to 3 prompts to show your personality
                </Link>
              )}
            </div>
          )
        })()}

        {/* ── Interests ── */}
        {interests.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[11px] uppercase font-bold tracking-wider text-white/40 ml-1">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <span
                  key={interest}
                  className="px-3 py-1.5 text-white/60 bg-white/[0.04] border border-white/[0.08] rounded-full text-[12px]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Settings links ── */}
        <div className="pt-2 space-y-3">

          {/* Admin dashboard — only visible to admin accounts */}
          {isAdmin && (
            <Link
              href="/app/admin/members"
              className="w-full flex items-center justify-between p-4 bg-[var(--color-primary)]/[0.06] rounded-2xl border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/[0.12] transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block">Admin Dashboard</span>
                  <span className="text-[11px] text-white/40">Members · Intakes · Stats</span>
                </div>
              </div>
              <span className="text-[var(--color-primary)]">→</span>
            </Link>
          )}

          <Link
            href="/privacy"
            className="w-full flex items-center justify-between p-4 bg-white/[0.04] rounded-2xl border border-white/10 hover:bg-white/[0.06] transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/[0.06] text-white/60 rounded-lg">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-white">Safety &amp; Privacy</span>
            </div>
            <span className="text-white/50">→</span>
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-transparent hover:bg-[rgba(220,22,22,0.08)] text-[var(--color-primary)] transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/[0.06] rounded-lg">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-medium">Log Out</span>
              </div>
            </button>
          </form>

          <p className="text-center text-[11px] text-white/30 pt-2">
            Signed in as {user.email}
          </p>
        </div>
      </div>
    </div>
  )
}
