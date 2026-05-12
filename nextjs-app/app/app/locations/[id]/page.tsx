// /app/locations/[id] — community hub for a single gym/apartment/community.
// Shows members, training today, active challenges, featured trainers.
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'

export const metadata = { title: 'Location', robots: { index: false, follow: false } }

export default async function LocationHubPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const [{ data: gym }, { data: members }, { data: training }, { data: trainers }] = await Promise.all([
    supabase.from('gyms').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('profiles')
      .select('id, display_name, photo_url, fitness_level, goals')
      .eq('gym_id', id)
      .neq('id', user.id)
      .limit(50),
    supabase
      .from('training_today')
      .select(`
        id, starts_at, workout_type, notes, status,
        user:profiles!training_today_user_id_fkey(id, display_name, photo_url)
      `)
      .eq('gym_id', id)
      .eq('status', 'open')
      .gte('starts_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
      .order('starts_at', { ascending: true })
      .limit(8),
    supabase.from('trainers')
      .select('id, name, photo_url, specialties')
      .eq('gym_id', id)
      .eq('is_active', true)
      .limit(6),
  ])

  if (!gym) notFound()

  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-2">
      {/* Header */}
      <header className="flex items-center justify-between py-3">
        <Link href="/app/discover" className="text-[13px] font-bold text-[var(--color-primary)]">
          ← Back
        </Link>
        <span className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)]">
          Community
        </span>
        <span className="w-10" />
      </header>

      {/* Hero */}
      <section className="rounded-2xl overflow-hidden bg-[var(--color-primary)] text-white">
        {gym.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gym.image} alt="" className="h-32 w-full object-cover opacity-80" />
        )}
        <div className="p-5">
          <p className="text-[11px] uppercase font-bold tracking-wider text-white/70">{gym.type ?? 'Location'}</p>
          <h1 className="mt-1 text-[24px] font-extrabold tracking-tight">{gym.name}</h1>
          <p className="mt-1 text-[12.5px] text-white/85">{[gym.city, gym.state].filter(Boolean).join(', ')}</p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[11px] font-bold">
              {(members?.length ?? 0) + 1} members
            </span>
            {gym.verified && (
              <span className="rounded-full bg-[var(--color-primary)]/30 px-2.5 py-1 text-[11px] font-bold">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Training Today */}
      <Section title="Training today" linkLabel="Post yours" linkHref="/app/training-today/new">
        {(training ?? []).length === 0 ? (
          <Empty msg="No one has posted yet. Be first." />
        ) : (
          <div className="space-y-2">
            {(training as unknown as { id: string; starts_at: string; workout_type: string | null; notes: string | null; user: { id: string; display_name: string | null; photo_url: string | null } | null }[]).map(t => {
              const time = new Date(t.starts_at).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })
              return (
                <div key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex items-start gap-3">
                  <div className="shrink-0 h-11 w-11 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-extrabold flex items-center justify-center">
                    {(t.user?.display_name ?? '?')[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[13.5px]">
                      {t.user?.display_name ?? 'A Partna'} · <span className="text-[var(--color-primary)]">{time}</span>
                    </p>
                    {t.workout_type && <p className="text-[12px] text-[var(--color-muted-foreground)]">🏋️ {t.workout_type}</p>}
                    {t.notes && <p className="mt-0.5 text-[12px] text-[var(--color-muted-foreground)] line-clamp-2">{t.notes}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Section>

      {/* Members */}
      <Section title="Active Partnas" linkLabel="See all" linkHref="/app/discover">
        {(members ?? []).length === 0 ? (
          <Empty msg="You're early. Invite your gym to grow this community." />
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {(members ?? []).slice(0, 8).map(m => (
              <Link key={m.id} href={`/app/profile/${m.id}`} className="text-center group">
                <div className="aspect-square rounded-xl overflow-hidden bg-[var(--color-muted)] group-hover:ring-2 group-hover:ring-[var(--color-primary)]/40 transition">
                  {m.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xl font-extrabold text-[var(--color-primary)]">
                      {(m.display_name ?? '?')[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-[10.5px] font-semibold truncate text-[var(--color-foreground)]">
                  {(m.display_name ?? 'Member').split(' ')[0]}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Trainers */}
      {(trainers ?? []).length > 0 && (
        <Section title="Featured trainers" linkLabel="See all" linkHref="/app/discover?tab=Trainers">
          <div className="space-y-2">
            {(trainers ?? []).map(t => (
              <Link
                key={t.id}
                href={`/app/trainers/${t.id}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
              >
                <div className="shrink-0 h-11 w-11 rounded-xl overflow-hidden bg-[var(--color-muted)]">
                  {t.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.photo_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-lg font-extrabold text-[var(--color-primary)]">
                      {t.name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[13.5px]">{t.name}</p>
                  <p className="text-[11.5px] text-[var(--color-muted-foreground)] line-clamp-1">
                    {(t.specialties ?? []).join(' · ') || 'Trainer'}
                  </p>
                </div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-primary)]">Free consult</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Invite link */}
      <Section title="Invite to this location">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-[13px] text-[var(--color-foreground)]">
            Share this link with anyone at <strong>{gym.name}</strong>:
          </p>
          <div className="mt-2.5 rounded-lg bg-[var(--color-muted)] px-3 py-2 text-[12px] font-mono text-[var(--color-muted-foreground)] truncate">
            workoutpartna.com/app/locations/{id}
          </div>
        </div>
      </Section>
    </main>
  )
}

function Section({
  title, linkLabel, linkHref, children,
}: {
  title: string
  linkLabel?: string
  linkHref?: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-6">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-[14px] font-extrabold tracking-tight text-[var(--color-foreground)]">{title}</h2>
        {linkHref && linkLabel && (
          <Link href={linkHref} className="text-[12px] font-bold text-[var(--color-primary)]">
            {linkLabel} →
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-border-bright)] p-5 text-center text-[12.5px] text-[var(--color-muted-foreground)]">
      {msg}
    </div>
  )
}
