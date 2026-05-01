// Challenges hub. Pulls active challenges plus the user's joined ones.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { Logo } from '../../../../components/app/Logo'
import { SparkleIcon } from '../../../../components/app/icons'

export const metadata = { title: 'Challenges', robots: { index: false, follow: false } }

type Challenge = {
  id: string
  title: string
  description: string | null
  cadence: 'daily' | 'weekly' | 'monthly' | 'sponsored'
  goal: string | null
  reward: string | null
  sponsor: string | null
  participants: { count: number }[]
  joined: { user_id: string }[]
}

export default async function ChallengesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const { data } = await supabase
    .from('challenges')
    .select(`
      id, title, description, cadence, goal, reward, sponsor,
      participants:challenge_participants(count),
      joined:challenge_participants!inner(user_id)
    `, { count: 'exact' })
    .eq('active', true)
    .order('created_at', { ascending: true })

  // Re-fetch participants without inner join filter, since the inner-join
  // version only returns rows where the user joined.
  const { data: all } = await supabase
    .from('challenges')
    .select(`id, title, description, cadence, goal, reward, sponsor`)
    .eq('active', true)
    .order('created_at', { ascending: true })

  // For each challenge, get participant count and check if user joined
  const allChallenges = all ?? []
  const enriched = await Promise.all(
    allChallenges.map(async c => {
      const [{ count }, { data: mine }] = await Promise.all([
        supabase.from('challenge_participants').select('*', { count: 'exact', head: true }).eq('challenge_id', c.id),
        supabase.from('challenge_participants').select('user_id').eq('challenge_id', c.id).eq('user_id', user.id).maybeSingle(),
      ])
      return { ...c, participantCount: count ?? 0, joined: !!mine }
    }),
  )

  const myChallenges = enriched.filter(c => c.joined)
  const discover = enriched.filter(c => !c.joined)

  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-2">
      <header className="flex items-center justify-between py-3">
        <Logo size={26} withWordmark />
      </header>

      <h1 className="text-[24px] font-extrabold tracking-tight">Challenges</h1>
      <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
        Join a streak. Win badges. Stay accountable.
      </p>

      {myChallenges.length > 0 && (
        <Section label="Your active challenges">
          <div className="space-y-2.5">
            {myChallenges.map(c => (
              <ChallengeCard key={c.id} c={c} />
            ))}
          </div>
        </Section>
      )}

      <Section label={myChallenges.length > 0 ? 'Discover more' : 'Start your first challenge'}>
        <div className="space-y-2.5">
          {discover.map(c => (
            <ChallengeCard key={c.id} c={c} />
          ))}
          {discover.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[var(--color-border-bright)] p-6 text-center text-[13px] text-[var(--color-text-muted)]">
              You're in every challenge. Strong.
            </div>
          )}
        </div>
      </Section>
    </main>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2.5 text-[12px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">
        {label}
      </h2>
      {children}
    </section>
  )
}

function ChallengeCard({
  c,
}: {
  c: { id: string; title: string; description: string | null; cadence: string; goal: string | null; reward: string | null; sponsor: string | null; participantCount: number; joined: boolean }
}) {
  return (
    <Link
      href={`/app/challenges/${c.id}`}
      className="block glass-card p-4 hover:border-[var(--color-border-bright)] transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <SparkleIcon width={14} height={14} className="text-[var(--color-brand-bright)]" />
            <p className="font-bold text-[15px] truncate">{c.title}</p>
            {c.joined && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--color-match)] bg-[var(--color-match)]/15 px-1.5 py-0.5 rounded-md">
                Joined
              </span>
            )}
          </div>
          {c.description && (
            <p className="mt-1 text-[12.5px] text-[var(--color-text-muted)] line-clamp-2">
              {c.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-[10.5px] text-[var(--color-text-dim)]">
            <span className="capitalize">{c.cadence}</span>
            {c.goal && <span>· {c.goal}</span>}
            <span>· {c.participantCount} joined</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
