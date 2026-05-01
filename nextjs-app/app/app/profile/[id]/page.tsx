// Profile Detail. Shows real Supabase profile when id is a UUID,
// falls back to hardcoded demo data when id is a slug (marcus, jasmine, etc).
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import {
  BackIcon, MoreIcon, VerifiedIcon, MapPinIcon,
  ChatIcon, CheckIcon,
} from '../../../../components/app/icons'
import { matchPhotos, profileHero } from '../../../../lib/photos'
import { ConnectButton } from '../../../../components/app/ConnectButton'
import { createClient } from '../../../../lib/supabase/server'
import { matchScore } from '../../../../lib/matching'

export const metadata: Metadata = {
  title: 'Profile',
  robots: { index: false, follow: false },
}

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const demoProfiles = {
  marcus: {
    name: 'Marcus Johnson', age: 28, score: 93, photo: profileHero.marcus, location: '1.3km away',
    title: 'Strength Training, 4x/week', place: 'Gym, Available Evenings',
    bio: "Love hitting PRs and helping others do the same. Let's push each other.",
    goals: ['Build Muscle','Get Stronger','Stay Consistent'],
    activeDays: [true,true,true,true,true,false,false], scheduleNote: 'Evenings after 6 PM',
  },
  jasmine: {
    name: 'Jasmine Patel', age: 27, score: 92, photo: matchPhotos.jasmine, location: '1.5km away',
    title: 'Yoga & Cardio, 5x/week', place: 'Studio + Outdoor, Mornings',
    bio: 'Looking for a yoga partner who shows up at 6am. Coffee after.',
    goals: ['Flexibility','Mindfulness','Endurance'],
    activeDays: [true,true,true,true,true,true,false], scheduleNote: 'Mornings 6 to 8 AM',
  },
  priya: {
    name: 'Priya Sharma', age: 26, score: 90, photo: matchPhotos.priya, location: '1.2km away',
    title: 'HIIT & Yoga, 4x/week', place: 'Boutique Studio, Mornings',
    bio: 'High intensity then a long stretch. Looking for someone with the same energy.',
    goals: ['Lose Weight','Endurance','Mobility'],
    activeDays: [true,false,true,false,true,true,false], scheduleNote: 'Mornings 7 AM',
  },
  ethan: {
    name: 'Ethan Miller', age: 31, score: 88, photo: matchPhotos.ethan, location: '1.3km away',
    title: 'Run Club, HIIT, Weekends', place: 'Outdoor + Gym',
    bio: 'Training for a half marathon. Always down to run.',
    goals: ['Endurance','Speed','Mileage'],
    activeDays: [false,true,false,true,false,true,true], scheduleNote: 'Weekends, sometimes Tue/Thu',
  },
  david: {
    name: 'David Lee', age: 29, score: 86, photo: matchPhotos.david, location: '2.1km away',
    title: 'Boxing, 3x/week', place: 'Boxing Gym, Evenings',
    bio: 'Sparring partner welcome. Light contact, big learning.',
    goals: ['Conditioning','Footwork','Power'],
    activeDays: [true,false,true,false,true,false,false], scheduleNote: 'Evenings 7 PM',
  },
} as const

const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)

export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Demo profile path (kept so the demo links from the home carousel still work)
  if (!isUUID(id)) {
    const p = demoProfiles[id as keyof typeof demoProfiles]
    if (!p) notFound()
    return renderProfile({
      id,
      name: p.name,
      firstName: p.name.split(' ')[0],
      age: p.age,
      score: p.score,
      photo: p.photo,
      location: p.location,
      title: p.title,
      place: p.place,
      bio: p.bio,
      goals: p.goals as readonly string[],
      activeDays: p.activeDays as readonly boolean[],
      scheduleNote: p.scheduleNote,
      isReal: false,
    })
  }

  // Real profile path
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const [{ data: them }, { data: me }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).maybeSingle(),
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
  ])

  if (!them) notFound()

  const score = me ? matchScore(me, them) : 70
  const dayLookup = new Set((them.schedule_days ?? []) as string[])
  const activeDays = DAYS.map(d => dayLookup.has(d))
  const goals = (them.goals ?? []).slice(0, 3)
  const styles = (them.styles ?? [])
  const titleParts = [styles.join(' · '), (them.schedule_times ?? []).join(' / ')].filter(Boolean)

  return renderProfile({
    id: them.id,
    name: them.display_name ?? 'Member',
    firstName: (them.display_name ?? 'Member').split(' ')[0],
    age: them.age,
    score,
    photo: them.photo_url || matchPhotos.marcus,
    location: them.primary_location || 'Nearby',
    title: titleParts.join(', ') || 'New WorkoutPartna member',
    place: them.fitness_level ? `${them.fitness_level} level` : '',
    bio: them.bio || 'No bio yet.',
    goals,
    activeDays,
    scheduleNote: (them.schedule_times ?? []).join(', ') || 'Schedule not set yet',
    isReal: true,
  })
}

type Args = {
  id: string
  name: string
  firstName: string
  age: number | null
  score: number
  photo: string
  location: string
  title: string
  place: string
  bio: string
  goals: readonly string[]
  activeDays: readonly boolean[]
  scheduleNote: string
  isReal: boolean
}

function renderProfile(p: Args) {
  return (
    <main className="min-h-dvh">
      <div className="relative h-[58dvh] min-h-[440px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.photo} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent" />

        <header className="absolute inset-x-0 top-0 z-10 px-4 pt-3 flex items-center justify-between">
          <Link href="/app/discover" aria-label="Back" className="h-10 w-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center text-white">
            <BackIcon width={20} height={20} />
          </Link>
          <button aria-label="More" className="h-10 w-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center text-white">
            <MoreIcon width={20} height={20} />
          </button>
        </header>

        <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full bg-black/55 backdrop-blur-md px-3 py-1.5 border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-match)]" />
          <span className="text-xs font-bold text-[var(--color-match)]">{p.score}% Match</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8">
          <div className="flex items-center gap-1.5">
            <h1 className="text-[28px] font-extrabold leading-tight">
              {p.firstName}{p.age ? <>, <span className="font-medium text-white/85">{p.age}</span></> : null}
            </h1>
            <VerifiedIcon className="text-[var(--color-brand-bright)]" width={20} height={20} />
          </div>
          <div className="mt-1 flex items-center gap-3 text-[13px] text-white/75">
            <span className="inline-flex items-center gap-1">
              <MapPinIcon width={14} height={14} /> {p.location}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md px-5 -mt-2">
        <p className="text-[15px] font-semibold text-white">{p.title}</p>
        {p.place && <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">{p.place}</p>}

        <p className="mt-3 text-[14px] text-white/85 leading-relaxed">{p.bio}</p>

        {p.goals.length > 0 && (
          <Section title="Goals">
            <div className="flex flex-wrap gap-2">
              {p.goals.map(g => (
                <span key={g} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-bright)] bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/90">
                  <CheckIcon width={12} height={12} className="text-[var(--color-match)]" />
                  {g}
                </span>
              ))}
            </div>
          </Section>
        )}

        <Section title="Schedule">
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map((d, i) => (
              <div
                key={d}
                className={`h-12 rounded-xl flex flex-col items-center justify-center text-[10px] font-semibold ${
                  p.activeDays[i]
                    ? 'bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/40 text-[var(--color-brand-bright)]'
                    : 'bg-white/[0.03] border border-[var(--color-border)] text-[var(--color-text-dim)]'
                }`}
              >
                <span>{d}</span>
                {p.activeDays[i] && <CheckIcon width={11} height={11} className="mt-0.5" />}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-[var(--color-text-muted)]">{p.scheduleNote}</p>
        </Section>

        <div className="h-28" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-md px-5 py-3 flex gap-2">
          <button className="h-12 w-12 rounded-full border border-[var(--color-border-bright)] bg-white/[0.04] flex items-center justify-center text-white/85" aria-label="Message">
            <ChatIcon width={20} height={20} />
          </button>
          {p.isReal ? (
            <ConnectButton profileId={p.id} />
          ) : (
            <button disabled className="flex-1 h-12 rounded-full bg-white/[0.04] border border-[var(--color-border-bright)] text-white/60 font-semibold text-[14px]">
              Demo profile
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-[12px] uppercase font-bold tracking-wider text-[var(--color-text-muted)] mb-2.5">
        {title}
      </h2>
      {children}
    </section>
  )
}
