// Matches page: incoming requests, active matches, recently connected.
// Reads real data from Supabase. Falls back to a friendly empty state.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { Logo } from '../../../../components/app/Logo'
import { MatchActions } from './MatchActions'

export const metadata = { title: 'Matches', robots: { index: false, follow: false } }

type MatchRow = {
  id: string
  status: 'pending' | 'active' | 'declined' | 'cancelled' | 'blocked'
  sender_id: string
  receiver_id: string
  created_at: string
  updated_at: string
  sender: ProfileLite | null
  receiver: ProfileLite | null
}

type ProfileLite = {
  id: string
  display_name: string | null
  photo_url: string | null
  primary_location: string | null
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab = 'incoming' } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  // Pull every match the user is part of, with both profiles joined
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      id, status, sender_id, receiver_id, created_at, updated_at,
      sender:profiles!matches_sender_id_fkey(id, display_name, photo_url, primary_location),
      receiver:profiles!matches_receiver_id_fkey(id, display_name, photo_url, primary_location)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  const rows = (matches ?? []) as unknown as MatchRow[]

  const incoming = rows.filter(m => m.status === 'pending' && m.receiver_id === user.id)
  const outgoing = rows.filter(m => m.status === 'pending' && m.sender_id === user.id)
  const active   = rows.filter(m => m.status === 'active')
  const recent   = rows
    .filter(m => m.status === 'declined' || m.status === 'cancelled')
    .slice(0, 20)

  const tabs = [
    { id: 'incoming', label: 'Requests',  count: incoming.length + outgoing.length },
    { id: 'active',   label: 'Active',    count: active.length },
    { id: 'recent',   label: 'Recent',    count: recent.length },
  ]

  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-2">
      <header className="flex items-center justify-between py-3">
        <Logo size={26} withWordmark />
      </header>

      <h1 className="text-[24px] font-extrabold tracking-tight">Matches</h1>

      {/* Tabs */}
      <div className="mt-4 flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-[var(--color-border)]">
        {tabs.map(t => {
          const isActive = tab === t.id
          return (
            <Link
              key={t.id}
              href={`/app/matches?tab=${t.id}`}
              className={`flex-1 h-9 rounded-full text-[12.5px] font-semibold inline-flex items-center justify-center gap-1.5 transition ${
                isActive
                  ? 'brand-gradient text-white shadow-[0_4px_12px_-2px_rgba(59,130,246,0.5)]'
                  : 'text-[var(--color-text-muted)] hover:text-white'
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${isActive ? 'bg-white/25' : 'bg-white/8'}`}>
                  {t.count}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Body */}
      <div className="mt-5 space-y-4">
        {tab === 'incoming' && (
          <>
            <Section label="Incoming">
              {incoming.length === 0 ? (
                <Empty text="No incoming requests yet." />
              ) : (
                incoming.map(m => (
                  <RequestCard
                    key={m.id}
                    matchId={m.id}
                    profile={m.sender}
                    direction="incoming"
                  />
                ))
              )}
            </Section>

            <Section label="Outgoing">
              {outgoing.length === 0 ? (
                <Empty text="You haven't sent any requests yet." />
              ) : (
                outgoing.map(m => (
                  <RequestCard
                    key={m.id}
                    matchId={m.id}
                    profile={m.receiver}
                    direction="outgoing"
                  />
                ))
              )}
            </Section>
          </>
        )}

        {tab === 'active' && (
          <Section label={null}>
            {active.length === 0 ? (
              <Empty text="No active matches yet. Send some requests from Discover." />
            ) : (
              active.map(m => {
                const other = m.sender_id === user.id ? m.receiver : m.sender
                return (
                  <Link
                    key={m.id}
                    href={`/app/messages/${m.id}`}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--color-border)] bg-white/[0.03] hover:border-[var(--color-border-bright)] transition"
                  >
                    <Avatar profile={other} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px] truncate">{other?.display_name ?? 'Member'}</p>
                      <p className="text-[12px] text-[var(--color-text-muted)] truncate">
                        Tap to message
                      </p>
                    </div>
                    <span className="text-[var(--color-brand-bright)] text-[13px] font-bold">→</span>
                  </Link>
                )
              })
            )}
          </Section>
        )}

        {tab === 'recent' && (
          <Section label={null}>
            {recent.length === 0 ? (
              <Empty text="Nothing recent." />
            ) : (
              recent.map(m => {
                const other = m.sender_id === user.id ? m.receiver : m.sender
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--color-border)] bg-white/[0.03]"
                  >
                    <Avatar profile={other} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px] truncate">{other?.display_name ?? 'Member'}</p>
                      <p className="text-[12px] text-[var(--color-text-muted)] capitalize">{m.status}</p>
                    </div>
                  </div>
                )
              })
            )}
          </Section>
        )}
      </div>
    </main>
  )
}

function Section({ label, children }: { label: string | null; children: React.ReactNode }) {
  return (
    <section>
      {label && (
        <h2 className="text-[12px] uppercase font-bold tracking-wider text-[var(--color-text-muted)] mb-2">
          {label}
        </h2>
      )}
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-border-bright)] p-5 text-center text-[13px] text-[var(--color-text-muted)]">
      {text}
    </div>
  )
}

function Avatar({ profile }: { profile: ProfileLite | null }) {
  if (profile?.photo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.photo_url}
        alt={profile.display_name ?? 'Member'}
        className="shrink-0 h-12 w-12 rounded-full object-cover border border-[var(--color-border)]"
      />
    )
  }
  return (
    <div className="shrink-0 h-12 w-12 rounded-full brand-gradient flex items-center justify-center text-white font-bold">
      {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

function RequestCard({
  matchId,
  profile,
  direction,
}: {
  matchId: string
  profile: ProfileLite | null
  direction: 'incoming' | 'outgoing'
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white/[0.03] p-3">
      <div className="flex items-center gap-3">
        <Avatar profile={profile} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[14px] truncate">{profile?.display_name ?? 'Member'}</p>
          <p className="text-[12px] text-[var(--color-text-muted)] truncate">
            {profile?.primary_location ?? 'WorkoutPartna member'}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <MatchActions matchId={matchId} direction={direction} />
      </div>
    </div>
  )
}
