// /app/messages — inbox of active match conversations.
// Mirrors the Replit Messages list view (clicking a row goes to /app/messages/[id]).
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Search, MoreVertical, ChevronLeft } from 'lucide-react'
import { createClient } from '../../../lib/supabase/server'
import { PremiumBadgeIf } from '../../../components/app/PremiumBadge'

const BOT_ID = '00000000-0000-0000-0000-000000000001'

export const metadata = { title: 'Messages', robots: { index: false, follow: false } }

type MatchRow = {
  id: string
  sender_id: string
  receiver_id: string
  status: string
  created_at: string
  updated_at: string
  sender:   { id: string; display_name: string | null; photo_url: string | null; is_premium: boolean | null; premium_until: string | null } | null
  receiver: { id: string; display_name: string | null; photo_url: string | null; is_premium: boolean | null; premium_until: string | null } | null
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
      sender:profiles!matches_sender_id_fkey(id, display_name, photo_url, is_premium, premium_until),
      receiver:profiles!matches_receiver_id_fkey(id, display_name, photo_url, is_premium, premium_until),
      messages(body, sender_id, created_at, read_at)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  const rows = (data ?? []) as unknown as MatchRow[]
  const active = rows.filter(r => r.status === 'active')

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24 min-h-[calc(100dvh-5rem)] flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/app/home"
            aria-label="Back to home"
            className="h-9 w-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/[0.08] transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold font-display text-white">Messages</h1>
        </div>
        <button className="p-2 hover:bg-white/[0.06] rounded-full transition">
          <MoreVertical className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl h-11 pl-10 pr-4 text-[14px] placeholder:text-white/30 text-white outline-none focus:border-white/20 transition"
        />
      </div>

      {active.length === 0 ? (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <div className="h-20 w-20 rounded-full bg-white/[0.04] flex items-center justify-center text-4xl">
            💬
          </div>
          <div>
            <h3 className="font-bold text-lg text-white mb-1">No messages yet</h3>
            <p className="text-white/60 text-sm">Your coach&rsquo;s messages will appear here once your AI Coach sends your first workout.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto -mx-4 px-4">
          {/* Section label */}
          <p className="text-[11px] uppercase font-bold tracking-wider text-white/40 mb-3">
            Your Connections ({active.length})
          </p>

          {/* Conversation rows */}
          <div className="flex flex-col gap-1">
            {active.map(m => {
              const other = m.sender_id === user.id ? m.receiver : m.sender
              const isBot = other?.id === BOT_ID
              const sorted = [...m.messages].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
              )
              const last = sorted[0]
              const unread = sorted.some(msg => msg.sender_id !== user.id && !msg.read_at)
              const initial = (other?.display_name ?? '?')[0]?.toUpperCase()

              // Online indicator: last message within 30 minutes (skip for bot)
              const isOnline = !isBot && last
                ? Date.now() - new Date(last.created_at).getTime() < 30 * 60 * 1000
                : false

              // Clean preview for bot workout messages
              const previewBody = last?.body
                ? (isBot && last.sender_id === BOT_ID
                    ? last.body.split('\n')[0]   // first line: "🏋️ Name, here's your workout..."
                    : (last.sender_id === user.id ? 'You: ' : '') + last.body)
                : 'Tap to open'

              return (
                <Link
                  key={m.id}
                  href={`/app/messages/${m.id}`}
                  className="flex items-center gap-3 p-3.5 rounded-2xl hover:bg-white/[0.06] transition cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="h-14 w-14 rounded-full overflow-hidden bg-white/[0.04]">
                      {isBot ? (
                        <div className="w-full h-full brand-gradient flex items-center justify-center text-2xl">
                          🤖
                        </div>
                      ) : other?.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={other.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full brand-gradient flex items-center justify-center font-bold text-white text-lg">
                          {initial}
                        </div>
                      )}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0d0d0d]" />
                    )}
                    {isBot && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[var(--color-primary)] border-2 border-[#0d0d0d]" aria-hidden />
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={`font-bold text-[15px] truncate inline-flex items-center gap-1.5 max-w-[75%] ${unread ? 'text-white' : 'text-white/80'}`}>
                        <span className="truncate">
                          {isBot ? 'AI Coach' : (other?.display_name ?? 'Patna')}
                        </span>
                        {!isBot && (
                          <PremiumBadgeIf isPremium={other?.is_premium} premiumUntil={other?.premium_until} size="sm" />
                        )}
                      </h3>
                      <span className="text-[11px] text-white/40 shrink-0 ml-2">
                        {last ? timeAgo(last.created_at) : timeAgo(m.created_at)}
                      </span>
                    </div>
                    <p className={`text-[13px] truncate ${unread ? 'text-white/90 font-medium' : 'text-white/50'}`}>
                      {previewBody}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {unread && (
                    <span className="shrink-0 h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                  )}
                </Link>
              )
            })}
          </div>
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
