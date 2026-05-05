// /app/profile — display view. Mirrors the Replit Profile page.
// Editing form lives at /app/profile/edit.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Settings, Edit2, MapPin, Calendar, Dumbbell, Shield, LogOut,
} from 'lucide-react'
import { createClient } from '../../../../lib/supabase/server'
import { signOut } from '../../../../lib/actions/profile'
import { profileCompletion } from '../../../../lib/profile-completion'

export const metadata = { title: 'Profile', robots: { index: false, follow: false } }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  // Optionally resolve gym name from gym_id, so the profile never shows "Set your location"
  // when the user did pick a gym.
  let gymLabel: string | null = null
  if (profile?.gym_id) {
    const { data: g } = await supabase.from('gyms').select('name, city').eq('id', profile.gym_id).maybeSingle()
    if (g?.name) gymLabel = `${g.name}${g.city ? ` · ${g.city}` : ''}`
  }

  const completion = profileCompletion(profile ?? {})

  const name  = profile?.display_name ?? user.email?.split('@')[0] ?? 'Member'
  const age   = profile?.age
  const bio   = profile?.bio || 'No bio yet. Tap Edit Profile to add one.'
  const level = profile?.fitness_level || 'Set your level'
  const schedule = (profile?.schedule_times ?? []).join(', ') || (profile?.schedule_days ?? []).join(', ') || 'Set your schedule'
  const goals = (profile?.goals ?? []) as string[]
  const interests = (profile?.styles ?? []) as string[]
  const location = gymLabel || profile?.primary_location || 'Set your location'

  return (
    <div className="max-w-4xl mx-auto pb-24">

      {/* Cover */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/80" />
        <Link
          href="/app/profile/edit"
          aria-label="Settings"
          className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/30 transition"
        >
          <Settings className="w-5 h-5" />
        </Link>

        <div className="px-6 flex flex-col items-center -mt-12">
          <div className="relative h-24 w-24 rounded-full border-4 border-[var(--color-background)] overflow-hidden shadow-lg bg-[var(--color-muted)]">
            {profile?.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[var(--color-muted)] flex items-center justify-center text-3xl font-bold text-[var(--color-muted-foreground)]">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="mt-3 text-center space-y-1">
            <h1 className="text-2xl font-bold font-display text-[var(--color-primary)]">
              {name}{age ? `, ${age}` : ''}
            </h1>
            <p className="text-[var(--color-muted-foreground)] flex items-center justify-center text-sm font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1" /> {location}
            </p>
          </div>

          <div className="flex gap-2 mt-4">
            <Link
              href="/app/profile/edit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[var(--color-secondary)] text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Profile
            </Link>
            <button
              type="button"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-[var(--color-border)] text-[var(--color-foreground)] rounded-xl text-sm font-bold hover:bg-gray-50 transition shadow-sm"
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-8 space-y-6">
        {/* Profile completion meter */}
        {completion.pct < 100 && (
          <div className="bg-white rounded-2xl p-4 border border-[var(--color-border)] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[var(--color-foreground)]">
                Profile {completion.pct}% complete
              </p>
              <Link href="/app/profile/edit" className="text-[12px] font-bold text-[var(--color-primary)]">
                Finish →
              </Link>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
              <div
                className="h-full brand-gradient transition-[width] duration-300"
                style={{ width: `${completion.pct}%` }}
              />
            </div>
            {completion.missing.length > 0 && (
              <p className="mt-2 text-[12px] text-[var(--color-muted-foreground)]">
                Add: {completion.missing.slice(0, 3).join(', ')}
                {completion.missing.length > 3 ? ` +${completion.missing.length - 3} more` : ''}
              </p>
            )}
            {!completion.ready && (
              <p className="mt-2 text-[11.5px] text-[var(--color-muted-foreground)]">
                Complete your profile to see match scores and unlock better Partnas.
              </p>
            )}
          </div>
        )}

        {/* About */}
        <div className="bg-white rounded-2xl p-5 border border-[var(--color-border)] shadow-sm">
          <h2 className="font-bold text-lg mb-2 text-[var(--color-primary)]">About Me</h2>
          <p className="text-[var(--color-muted-foreground)] text-sm leading-relaxed">{bio}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wide">
              <Dumbbell className="w-3.5 h-3.5" />
              {level}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5" />
              {schedule}
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-[var(--color-muted-foreground)] uppercase tracking-wider ml-1">My Goals</h3>
          <div className="flex flex-wrap gap-2">
            {goals.map(goal => (
              <span key={goal} className="px-4 py-2 bg-white rounded-xl text-sm font-bold border border-[var(--color-border)] text-[var(--color-foreground)] shadow-sm">
                {goal}
              </span>
            ))}
            <Link
              href="/app/profile/edit"
              className="px-4 py-2 border-2 border-dashed border-[var(--color-border)] rounded-xl text-sm font-bold text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition"
            >
              + Add Goal
            </Link>
          </div>
        </div>

        {/* Interests */}
        {interests.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[var(--color-muted-foreground)] uppercase tracking-wider ml-1">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <span key={interest} className="px-4 py-2 bg-[var(--color-muted)]/30 rounded-xl text-sm font-medium border border-transparent text-[var(--color-muted-foreground)]">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="pt-4 space-y-3">
          <Link
            href="/privacy"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[var(--color-border)] shadow-sm hover:bg-gray-50 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-[var(--color-foreground)]">Safety &amp; Privacy</span>
            </div>
            <span className="text-[var(--color-muted-foreground)]">→</span>
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-transparent hover:bg-red-50 text-red-600 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="font-medium">Log Out</span>
              </div>
            </button>
          </form>

          <p className="text-center text-[11px] text-[var(--color-muted-foreground)] pt-2">
            Signed in as {user.email}
          </p>
        </div>
      </div>
    </div>
  )
}
