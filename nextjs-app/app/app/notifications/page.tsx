// Notifications page — dark cinematic redesign.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '../../../lib/supabase/server'

export const metadata = { title: 'Notifications', robots: { index: false, follow: false } }

const KIND_META: Record<string, { icon: string; color: string }> = {
  match_request:      { icon: '👋', color: 'rgba(220,22,22,0.12)' },
  match_accepted:     { icon: '🎉', color: 'rgba(220,22,22,0.12)' },
  message:            { icon: '💬', color: 'rgba(255,255,255,0.06)' },
  challenge_reminder: { icon: '⏰', color: 'rgba(251,191,36,0.10)' },
  challenge_won:      { icon: '🏆', color: 'rgba(251,191,36,0.12)' },
  workout_ready:      { icon: '🏋️', color: 'rgba(220,22,22,0.10)' },
  offer_nearby:       { icon: '🏷️', color: 'rgba(255,255,255,0.06)' },
  event_nearby:       { icon: '📅', color: 'rgba(255,255,255,0.06)' },
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const { data: rows } = await supabase
    .from('notifications')
    .select('id, kind, title, body, link, read_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Mark visible notifications as read (best effort)
  const unreadIds = (rows ?? []).filter(r => !r.read_at).map(r => r.id)
  if (unreadIds.length > 0) {
    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .in('id', unreadIds)
  }

  const list = rows ?? []
  const unreadCount = unreadIds.length

  return (
    <main className="mx-auto max-w-md px-5 pt-5 pb-24" style={{ background: '#0d0d0d', minHeight: '100dvh' }}>

      {/* Header */}
      <header className="flex items-center gap-3 mb-6">
        <Link
          href="/app/home"
          aria-label="Back"
          className="h-9 w-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/85 hover:bg-white/[0.08] transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-[22px] font-extrabold tracking-tight text-white">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-[11px] text-white/40 mt-0.5">{unreadCount} new</p>
          )}
        </div>
      </header>

      {/* Empty state */}
      {list.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-3xl mb-4">
            🔔
          </div>
          <p className="text-[16px] font-bold text-white">All caught up</p>
          <p className="mt-1.5 text-[13px] text-white/50">
            Notifications show up here when you get matches, messages, or activity.
          </p>
          <Link
            href="/app/discover"
            className="mt-6 inline-flex h-10 px-6 rounded-full brand-gradient text-white text-[13px] font-extrabold items-center"
          >
            Find Partnas
          </Link>
        </div>
      )}

      {/* Notification list */}
      <div className="space-y-2">
        {list.map(n => {
          const meta = KIND_META[n.kind] ?? { icon: '🔔', color: 'rgba(255,255,255,0.04)' }
          const isUnread = !n.read_at
          return (
            <Link
              key={n.id}
              href={n.link ?? '#'}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                isUnread
                  ? 'border-[rgba(220,22,22,0.25)] bg-[rgba(220,22,22,0.05)] hover:border-[rgba(220,22,22,0.4)]'
                  : 'border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12]'
              }`}
            >
              <span
                className="shrink-0 h-11 w-11 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: meta.color }}
              >
                {meta.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-[14px] leading-snug ${isUnread ? 'text-white' : 'text-white/80'}`}>
                  {n.title}
                </p>
                {n.body && (
                  <p className="mt-0.5 text-[12.5px] text-white/50 line-clamp-2">{n.body}</p>
                )}
                <p className="mt-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                  {timeAgo(n.created_at)}
                </p>
              </div>
              {isUnread && (
                <span className="shrink-0 mt-1.5 h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
              )}
            </Link>
          )
        })}
      </div>
    </main>
  )
}

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime()
  const s = Math.floor(ms / 1000)
  if (s < 60) return 'now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(iso).toLocaleDateString()
}
