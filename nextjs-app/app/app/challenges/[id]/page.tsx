// Challenge detail page with join + check-in.
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { BackIcon, CheckIcon, SparkleIcon } from '../../../../components/app/icons'
import { ChallengeActions } from './ChallengeActions'

export const metadata = { title: 'Challenge', robots: { index: false, follow: false } }

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/signin')

  const [{ data: challenge }, { data: joined }, { count: participantCount }, { data: myCheckins }] =
    await Promise.all([
      supabase.from('challenges').select('*').eq('id', id).maybeSingle(),
      supabase.from('challenge_participants').select('user_id').eq('challenge_id', id).eq('user_id', user.id).maybeSingle(),
      supabase.from('challenge_participants').select('*', { count: 'exact', head: true }).eq('challenge_id', id),
      supabase.from('challenge_checkins').select('day').eq('challenge_id', id).eq('user_id', user.id).order('day', { ascending: false }).limit(30),
    ])

  if (!challenge) notFound()

  const today = new Date().toISOString().slice(0, 10)
  const checkedInToday = (myCheckins ?? []).some(c => c.day === today)
  const totalCheckins = (myCheckins ?? []).length

  return (
    <main className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
          <Link
            href="/app/challenges"
            aria-label="Back"
            className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85"
          >
            <BackIcon width={18} height={18} />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">
              {challenge.cadence} challenge
            </p>
            <h1 className="font-bold text-[16px] text-white truncate">{challenge.title}</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md px-5 py-6">
        {/* Hero */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-50 blur-2xl"
            style={{ background: 'radial-gradient(circle, #3B82F6, transparent 70%)' }}
          />
          <div className="flex items-center gap-2 relative">
            <SparkleIcon width={18} height={18} className="text-[var(--color-brand-bright)]" />
            <h2 className="text-[20px] font-extrabold tracking-tight">{challenge.title}</h2>
          </div>
          {challenge.description && (
            <p className="mt-2 text-[14px] text-white/85 leading-relaxed relative">
              {challenge.description}
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3 relative">
            <Stat label="Goal" value={challenge.goal ?? 'Track your progress'} />
            <Stat label="Reward" value={challenge.reward ?? 'Bragging rights'} />
            <Stat label="Cadence" value={challenge.cadence} className="capitalize" />
            <Stat label="Joined" value={`${participantCount ?? 0}`} />
          </div>
        </div>

        {/* My progress */}
        {joined && (
          <section className="mt-6">
            <h3 className="text-[12px] uppercase font-bold tracking-wider text-[var(--color-text-muted)] mb-2.5">
              Your progress
            </h3>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[var(--color-text-muted)]">Total check-ins</p>
                  <p className="text-[28px] font-extrabold mt-0.5">{totalCheckins}</p>
                </div>
                {checkedInToday ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--color-match)]/15 border border-[var(--color-match)]/30">
                    <CheckIcon width={14} height={14} className="text-[var(--color-match)]" />
                    <span className="text-[12px] font-bold text-[var(--color-match)]">Checked in today</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[var(--color-text-dim)]">Tap below to check in</span>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Sticky bottom action */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-md px-5 py-3">
          <ChallengeActions
            challengeId={id}
            joined={!!joined}
            checkedInToday={checkedInToday}
          />
        </div>
      </div>
      <div className="h-24" />
    </main>
  )
}

function Stat({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">{label}</p>
      <p className={`mt-0.5 text-[13px] font-semibold text-white ${className}`}>{value}</p>
    </div>
  )
}
