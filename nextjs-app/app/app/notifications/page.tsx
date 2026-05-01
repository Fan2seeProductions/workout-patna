// Notifications page. Shows the user's last 50 notifications.
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase/server'
import { Logo } from '../../../components/app/Logo'
import { BackIcon } from '../../../components/app/icons'

export const metadata = { title: 'Notifications', robots: { index: false, follow: false } }

const KIND_ICON: Record<string, string> = {
  match_request:     '👋',
  match_accepted:    '🎉',
  message:           '💬',
  challenge_reminder:'⏰',
  challenge_won:     '🏆',
  workout_ready:     '🏋️',
  offer_nearby:      '🏷️',
  event_nearby:      '📅',
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

  return (
    <main className="mx-auto max-w-md px-5 pt-3 pb-6 min-h-dvh">
      <header className="flex items-center gap-3 py-3">
        <Link href="/app/home" aria-label="Back" className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85">
          <BackIcon width={18} height={18} />
        </Link>
        <Logo size={24} withWordmark />
      </header>

      <h1 className="text-[24px] font-extrabold tracking-tight">Notifications</h1>

      <div className="mt-4 space-y-2">
        {(rows ?? []).length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--color-border-bright)] p-6 text-center text-[13px] text-[var(--color-text-muted)]">
            No notifications yet. They'll show up here when there's match or message activity.
          </div>
        )}

        {(rows ?? []).map(n => (
          <Link
            key={n.id}
            href={n.link ?? '#'}
            className={`flex items-start gap-3 p-3.5 rounded-2xl border transition ${
              n.read_at
                ? 'border-[var(--color-border)] bg-white/[0.02]'
                : 'border-[var(--color-brand)]/30 bg-[var(--color-brand)]/8'
            } hover:border-[var(--color-border-bright)]`}
          >
            <span className="shrink-0 h-10 w-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-lg">
              {KIND_ICON[n.kind] ?? '🔔'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[14px] text-white truncate">{n.title}</p>
              {n.body && <p className="mt-0.5 text-[12.5px] text-[var(--color-text-muted)] line-clamp-2">{n.body}</p>}
              <p className="mt-1 text-[10px] text-[var(--color-text-dim)]">{timeAgo(n.created_at)}</p>
            </div>
            {!n.read_at && <span className="shrink-0 mt-2 h-2 w-2 rounded-full bg-[var(--color-brand-bright)]" />}
          </Link>
        ))}
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
