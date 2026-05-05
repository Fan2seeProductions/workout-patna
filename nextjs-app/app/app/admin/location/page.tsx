// /app/admin/location — basic dashboard for location admins.
// Shows the gyms the current user manages with engagement stats.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'

export const metadata = { title: 'Location Admin', robots: { index: false, follow: false } }

type Gym = {
  id: string
  name: string
  type: string
  city: string
  state: string
  members: number
}

export default async function LocationAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const isSuper = profile?.role === 'super_admin'

  // Pull the gyms this admin manages (or all gyms for super admins).
  let gyms: Gym[] = []
  if (isSuper) {
    const { data } = await supabase.from('gyms').select('id, name, type, city, state, members').order('name').limit(100)
    gyms = (data ?? []) as Gym[]
  } else {
    const { data: rows } = await supabase
      .from('location_admins')
      .select('gym:gyms(id, name, type, city, state, members)')
      .eq('user_id', user.id)
    gyms = (rows ?? []).map(r => r.gym).filter(Boolean) as unknown as Gym[]
  }

  if (gyms.length === 0) {
    return (
      <main className="mx-auto max-w-md px-5 pt-6 pb-20">
        <h1 className="text-[24px] font-extrabold tracking-tight">Location Admin</h1>
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border-bright)] p-7 text-center">
          <p className="text-[15px] font-bold">You don't manage any locations yet</p>
          <p className="mt-1 text-[12.5px] text-[var(--color-muted-foreground)]">
            Want to claim or partner a location? Reach out to our team.
          </p>
          <Link
            href="/for-gyms-apartments#contact"
            className="mt-4 inline-flex h-10 px-5 rounded-full brand-gradient text-white items-center font-bold text-[13px]"
          >
            Become a Partner Location
          </Link>
        </div>
      </main>
    )
  }

  // Stats per gym
  const gymIds = gyms.map(g => g.id)

  const [{ data: profilesAtGyms }, { data: trainingPosts }, { data: trainersAtGyms }] = await Promise.all([
    supabase.from('profiles').select('gym_id, created_at, onboarded').in('gym_id', gymIds),
    supabase.from('training_today').select('gym_id, status').in('gym_id', gymIds),
    supabase.from('trainers').select('gym_id, is_active').in('gym_id', gymIds).eq('is_active', true),
  ])

  function statsFor(gymId: string) {
    const since7 = Date.now() - 7 * 24 * 3600 * 1000
    const profiles = (profilesAtGyms ?? []).filter(p => p.gym_id === gymId)
    const newSignups = profiles.filter(p => p.created_at && new Date(p.created_at).getTime() >= since7).length
    const onboarded = profiles.filter(p => p.onboarded).length
    const openTraining = (trainingPosts ?? []).filter(t => t.gym_id === gymId && t.status === 'open').length
    const activeTrainers = (trainersAtGyms ?? []).filter(t => t.gym_id === gymId).length
    return {
      members: profiles.length,
      onboarded,
      newSignups,
      openTraining,
      activeTrainers,
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-20">
      <header className="flex items-center justify-between py-3">
        <Link href="/app/home" className="text-[13px] font-bold text-[var(--color-primary)]">← Back</Link>
        <span className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)]">
          {isSuper ? 'Super admin' : 'Location admin'}
        </span>
        <span className="w-10" />
      </header>

      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-extrabold tracking-tight">Your Locations</h1>
        {isSuper && (
          <Link
            href="/app/admin/trainers"
            className="text-[12.5px] font-bold text-[var(--color-primary)]"
          >
            Review trainers →
          </Link>
        )}
      </div>
      <p className="mt-1 text-[13px] text-[var(--color-muted-foreground)]">
        Track engagement, signups, and activity at each property you manage.
      </p>

      <div className="mt-6 space-y-4">
        {gyms.map(g => {
          const s = statsFor(g.id)
          return (
            <div key={g.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)]">
                    {g.type ?? 'Location'}
                  </p>
                  <h2 className="mt-0.5 font-extrabold text-[16px] text-[var(--color-foreground)]">{g.name}</h2>
                  <p className="text-[11.5px] text-[var(--color-muted-foreground)]">
                    {[g.city, g.state].filter(Boolean).join(', ')}
                  </p>
                </div>
                <Link
                  href={`/app/locations/${g.id}`}
                  className="text-[12px] font-bold text-[var(--color-primary)]"
                >
                  View hub →
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Stat label="Members"        value={s.members.toString()} />
                <Stat label="New (7d)"       value={s.newSignups.toString()} />
                <Stat label="Onboarded"      value={s.onboarded.toString()} />
                <Stat label="Training today" value={s.openTraining.toString()} />
                <Stat label="Trainers"       value={s.activeTrainers.toString()} />
                <Stat label="Verified"       value={'—'} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="h-10 rounded-full border border-[var(--color-border)] bg-white text-[12.5px] font-bold text-[var(--color-foreground)]"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  className="h-10 rounded-full brand-gradient text-white text-[12.5px] font-bold"
                >
                  Post announcement
                </button>
              </div>
              <p className="mt-2 text-[10.5px] text-[var(--color-muted-foreground)]">
                {/* TODO: wire admin actions (announcements, claim moderation, sponsor campaigns) */}
                Admin actions are placeholders. Full editor ships in the next pass.
              </p>
            </div>
          )
        })}
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-muted)]/50 p-3 text-center">
      <p className="text-[18px] font-extrabold text-[var(--color-primary)]">{value}</p>
      <p className="mt-0.5 text-[10px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)]">{label}</p>
    </div>
  )
}
