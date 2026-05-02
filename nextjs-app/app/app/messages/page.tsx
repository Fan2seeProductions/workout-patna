// /app/messages — inbox of active match conversations.
// Mirrors the Replit Messages list view (clicking a row goes to /app/messages/[id]).
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Search, MoreVertical } from 'lucide-react'
import { createClient } from '../../../lib/supabase/server'

export const metadata = { title: 'Messages', robots: { index: false, follow: false } }

type MatchRow = {
  id: string
  sender_id: string
  receiver_id: string
  status: string
  created_at: string
  updated_at: string
  sender:   { id: string; display_name: string | null; photo_url: string | null } | null
  receiver: { id: string; display_name: string | null; photo_url: string | null } | null
  messages: { body: string; sender_id: string; created_at: string; read_at: string | null }[]
}

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/auth')

  const { data } = await supabase
    .from('matches')
    .select(`
      id, sender_id, receiver_id, status, created_at, updated_at,
      sender:profiles!matches_sender_id_fkey(id, display_name, photo_url),
      receiver:profiles!matches_receiver_id_fkey(id, display_name, photo_url),
      messages(body, sender_id, created_at, read_at)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  const rows = (data ?? []) as unknown as MatchRow[]
  const active = rows.filter(r => r.status === 'active')

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24 min-h-[calc(100dvh-5rem)] flex flex-col">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-display text-[var(--color-foreground)]">Messages</h1>
        <button className="p-2 hover:bg-[var(--color-muted)] rounded-full transition">
          <MoreVertical className="w-5 h-5 text-[var(--color-muted-foreground)]" />
        </button>
      </div>

      {/* Search (visual for now) */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-muted)]/50 rounded-xl border border-transparent focus:bg-[var(--color-background)] focus:border-[var(--color-primary)]/20 outline-none transition text-sm"
        />
      </div>

      {active.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[var(--color-muted)] rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-[var(--color-muted-foreground)]" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-[var(--color-foreground)]">No Matches Yet</h3>
          <p className="text-[var(--color-muted-foreground)] text-sm mb-4">Start browsing to find your gym Partna!</p>
          <Link href="/app/browse" className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm">
            Find Partnas
          </Link>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto -mx-4 px-4 space-y-2">
          <h2 className="text-xs font-bold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2">
            Your Connections ({active.length})
          </h2>

          {active.map(m => {
            const other = m.sender_id === user.id ? m.receiver : m.sender
            const sorted = [...m.messages].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            )
            const last = sorted[0]
            const unread = sorted.some(msg => msg.sender_id !== user.id && !msg.read_at)
            const initial = (other?.display_name ?? '?')[0]?.toUpperCase()

            return (
              <Link
                key={m.id}
                href={`/app/messages/${m.id}`}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[var(--color-muted)]/50 transition cursor-pointer group"
              >
                <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20">
                  {other?.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={other.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-[var(--color-primary)]">
                      {initial}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 border-b border-[var(--color-border)]/50 pb-3 group-hover:border-transparent transition">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-bold text-sm truncate ${unread ? 'text-[var(--color-foreground)]' : 'text-[var(--color-foreground)]/85'}`}>
                      {other?.display_name ?? 'Patna'}
                    </h3>
                    <span className="text-[10px] text-[var(--color-muted-foreground)] shrink-0 ml-2">
                      {last ? timeAgo(last.created_at) : new Date(m.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${unread ? 'text-[var(--color-foreground)]/90' : 'text-[var(--color-muted-foreground)]'}`}>
                    {last
                      ? (last.sender_id === user.id ? 'You: ' : '') + last.body
                      : 'Tap to start chatting'}
                  </p>
                </div>

                {unread && <span className="shrink-0 h-2 w-2 rounded-full bg-[var(--color-secondary)]" />}
              </Link>
            )
          })}
        </div>
      )}
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
  if (d < 7) return `${d}d`
  return new Date(iso).toLocaleDateString()
}
