// Inbox: list of active match conversations with last message preview.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase/server'
import { Logo } from '../../../components/app/Logo'
import { BackIcon } from '../../../components/app/icons'

export const metadata = { title: 'Messages', robots: { index: false, follow: false } }

type MatchRow = {
  id: string
  sender_id: string
  receiver_id: string
  updated_at: string
  sender:   { id: string; display_name: string | null; photo_url: string | null } | null
  receiver: { id: string; display_name: string | null; photo_url: string | null } | null
  messages: { body: string; sender_id: string; created_at: string; read_at: string | null }[]
}

export default async function InboxPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const { data } = await supabase
    .from('matches')
    .select(`
      id, sender_id, receiver_id, updated_at,
      sender:profiles!matches_sender_id_fkey(id, display_name, photo_url),
      receiver:profiles!matches_receiver_id_fkey(id, display_name, photo_url),
      messages(body, sender_id, created_at, read_at)
    `)
    .eq('status', 'active')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  const rows = (data ?? []) as unknown as MatchRow[]

  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-20 min-h-dvh">
      <header className="flex items-center gap-3 py-3">
        <Link
          href="/app/home"
          aria-label="Back"
          className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85"
        >
          <BackIcon width={18} height={18} />
        </Link>
        <Logo size={24} withWordmark />
      </header>

      <h1 className="text-[24px] font-extrabold tracking-tight">Messages</h1>

      <div className="mt-4 space-y-2">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border-bright)] p-6 text-center text-[13px] text-[var(--color-text-muted)]">
            No conversations yet. Match with someone first.
          </div>
        ) : (
          rows.map(m => {
            const other = m.sender_id === user.id ? m.receiver : m.sender
            const sorted = [...m.messages].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            )
            const last = sorted[0]
            const unread = sorted.some(msg => msg.sender_id !== user.id && !msg.read_at)

            return (
              <Link
                key={m.id}
                href={`/app/messages/${m.id}`}
                className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--color-border)] bg-white/[0.03] hover:border-[var(--color-border-bright)] transition"
              >
                <Avatar profile={other} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[14px] truncate ${unread ? 'font-bold text-white' : 'font-semibold text-white/90'}`}>
                      {other?.display_name ?? 'Member'}
                    </p>
                    {last && (
                      <span className="shrink-0 text-[10px] text-[var(--color-text-dim)]">
                        {timeAgo(last.created_at)}
                      </span>
                    )}
                  </div>
                  <p className={`mt-0.5 text-[12.5px] truncate ${unread ? 'text-white/90' : 'text-[var(--color-text-muted)]'}`}>
                    {last
                      ? (last.sender_id === user.id ? 'You: ' : '') + last.body
                      : 'Say hi!'}
                  </p>
                </div>
                {unread && <span className="shrink-0 h-2 w-2 rounded-full bg-[var(--color-brand-bright)]" />}
              </Link>
            )
          })
        )}
      </div>
    </main>
  )
}

function Avatar({ profile }: { profile: { display_name: string | null; photo_url: string | null } | null }) {
  if (profile?.photo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={profile.photo_url} alt={profile.display_name ?? 'Member'} className="shrink-0 h-12 w-12 rounded-full object-cover" />
    )
  }
  return (
    <div className="shrink-0 h-12 w-12 rounded-full brand-gradient flex items-center justify-center text-white font-bold">
      {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime()
  const s = Math.floor(ms / 1000)
  if (s < 60) return 'now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  return `${d}d`
}
