// Chat detail. Server component renders the initial messages, client component handles realtime + send.
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { BackIcon, MoreIcon } from '../../../../components/app/icons'
import { ChatThread } from './ChatThread'

const BOT_ID = '00000000-0000-0000-0000-000000000001'

export const metadata = { title: 'Chat', robots: { index: false, follow: false } }

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  // Load match with both profiles
  const { data: match } = await supabase
    .from('matches')
    .select(`
      id, status, sender_id, receiver_id,
      sender:profiles!matches_sender_id_fkey(id, display_name, photo_url, primary_location),
      receiver:profiles!matches_receiver_id_fkey(id, display_name, photo_url, primary_location)
    `)
    .eq('id', id)
    .maybeSingle()

  if (!match) notFound()
  if (match.status !== 'active') redirect('/app/matches')
  if (match.sender_id !== user.id && match.receiver_id !== user.id) notFound()

  const otherSide = match.sender_id === user.id ? match.receiver : match.sender
  const other = otherSide as unknown as {
    id: string; display_name: string | null; photo_url: string | null; primary_location: string | null
  } | null

  // Initial messages, oldest first
  const { data: messages } = await supabase
    .from('messages')
    .select('id, sender_id, body, created_at, read_at')
    .eq('match_id', id)
    .order('created_at', { ascending: true })
    .limit(200)

  return (
    <main className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
          <Link
            href="/app/messages"
            aria-label="Back"
            className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85"
          >
            <BackIcon width={18} height={18} />
          </Link>
          {other?.id === BOT_ID ? (
            /* AI Coach bot header — no profile link */
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="h-9 w-9 rounded-full brand-gradient flex items-center justify-center text-base shrink-0">
                🤖
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[14px] text-white truncate">AI Coach</p>
                <p className="text-[11px] text-[var(--color-text-muted)] truncate">Your daily workout planner</p>
              </div>
            </div>
          ) : (
            <Link href={`/app/profile/${other?.id}`} className="flex items-center gap-2.5 min-w-0 flex-1">
              {other?.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={other.photo_url} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full brand-gradient flex items-center justify-center text-white text-sm font-bold">
                  {other?.display_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-[14px] text-white truncate">
                  {other?.display_name ?? 'Member'}
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                  {other?.primary_location ?? 'Active'}
                </p>
              </div>
            </Link>
          )}
          <button aria-label="More" className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85">
            <MoreIcon width={18} height={18} />
          </button>
        </div>
      </header>

      <ChatThread
        matchId={id}
        currentUserId={user.id}
        otherDisplayName={other?.display_name ?? 'Member'}
        initialMessages={messages ?? []}
      />
    </main>
  )
}
