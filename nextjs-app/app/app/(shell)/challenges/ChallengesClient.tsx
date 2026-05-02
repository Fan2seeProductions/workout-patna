// Challenges page client. Daily/Weekly/Monthly tabs, active challenges
// section, join + check-in actions wired to existing server actions.
'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  Trophy, Flame, Target, ArrowRight, Zap, Clock, CheckCircle,
} from 'lucide-react'
import { cn } from '../../../../lib/utils'
import {
  joinChallenge, checkInChallenge,
} from '../../../../lib/actions/challenges'

export type ChallengeRow = {
  id: string
  title: string
  description: string | null
  type: 'daily' | 'weekly' | 'monthly' | 'sponsored'
  target_count: number
  badge: string | null
  reward: string | null
  entry_fee: number | null
  starts_at: string | null
  ends_at: string | null
}

export type UserChallengeRow = {
  challenge_id: string
  progress: number
  checked_today: boolean
}

const typeColors: Record<string, string> = {
  daily:   'bg-orange-500',
  weekly:  'bg-blue-500',
  monthly: 'bg-purple-500',
  sponsored: 'bg-emerald-500',
}

const typeIcons = { daily: Flame, weekly: Target, monthly: Trophy, sponsored: Trophy } as const

function formatPrice(cents: number | null) {
  if (!cents) return 'Free'
  return `$${(cents / 100).toFixed(2)}`
}

function getTimeLeft(endsAt: string | null) {
  if (!endsAt) return 'Open ended'
  const diff = new Date(endsAt).getTime() - Date.now()
  if (diff <= 0) return 'Ended'
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  if (days > 0) return `${days}d ${hours}h left`
  return `${hours}h left`
}

export function ChallengesClient({
  challenges, userChallenges,
}: {
  challenges: ChallengeRow[]
  userChallenges: UserChallengeRow[]
}) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [pending, start] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  const joinedMap = useMemo(() => new Map(userChallenges.map(uc => [uc.challenge_id, uc])), [userChallenges])
  const filtered = challenges.filter(c => c.type === activeTab)
  const activeJoined = challenges
    .filter(c => joinedMap.has(c.id))
    .map(c => ({ challenge: c, status: joinedMap.get(c.id)! }))

  function handleJoin(id: string) {
    setBusyId(id)
    start(async () => { await joinChallenge(id); setBusyId(null) })
  }
  function handleCheckin(id: string) {
    setBusyId(id)
    start(async () => { await checkInChallenge(id); setBusyId(null) })
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 pb-24">
      <header className="pt-2">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-[var(--color-foreground)] flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[var(--color-secondary)]" />
          </div>
          Challenges
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">Compete, earn badges, and win prizes</p>
      </header>

      {activeJoined.length > 0 && (
        <section className="bg-gradient-to-r from-[var(--color-secondary)]/10 to-[var(--color-secondary)]/5 rounded-2xl p-5 border border-[var(--color-secondary)]/20">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--color-secondary)] mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Your Active Challenges
          </h3>
          <div className="space-y-3">
            {activeJoined.map(({ challenge, status }) => {
              const pct = Math.min((status.progress / challenge.target_count) * 100, 100)
              return (
                <div key={challenge.id} className="bg-white rounded-xl p-4 border border-[var(--color-border)] shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{challenge.badge ?? '🏆'}</span>
                      <div>
                        <h4 className="font-bold text-[var(--color-foreground)]">{challenge.title}</h4>
                        <p className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {getTimeLeft(challenge.ends_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[var(--color-secondary)]">
                        {status.progress}/{challenge.target_count}
                      </p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">progress</p>
                    </div>
                  </div>
                  <div className="w-full bg-[var(--color-muted)] h-2 rounded-full overflow-hidden mb-3">
                    <div className="bg-[var(--color-secondary)] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCheckin(challenge.id)}
                    disabled={pending && busyId === challenge.id || status.checked_today}
                    className="w-full py-2 bg-[var(--color-secondary)] text-white rounded-lg font-bold text-sm hover:opacity-90 transition disabled:opacity-60"
                  >
                    {status.checked_today ? '✓ Checked in today' : (pending && busyId === challenge.id ? 'Logging...' : 'Log Check-in')}
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <div className="flex gap-2 p-1 bg-[var(--color-muted)] rounded-xl">
        {(['daily', 'weekly', 'monthly'] as const).map(type => {
          const Icon = typeIcons[type]
          const on = activeTab === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => setActiveTab(type)}
              className={cn(
                'flex-1 py-3 px-4 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2',
                on
                  ? 'bg-white shadow-sm text-[var(--color-foreground)]'
                  : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]',
              )}
            >
              <Icon className="w-4 h-4" />
              {type[0].toUpperCase() + type.slice(1)}
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[var(--color-border)]">
            <Trophy className="w-12 h-12 text-[var(--color-muted-foreground)] mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2 text-[var(--color-foreground)]">No {activeTab} challenges yet</h3>
            <p className="text-[var(--color-muted-foreground)] text-sm">Check back soon for new challenges!</p>
          </div>
        ) : filtered.map(challenge => {
          const joined = joinedMap.has(challenge.id)
          const status = joinedMap.get(challenge.id)
          return (
            <div key={challenge.id} className="bg-white rounded-2xl p-5 border border-[var(--color-border)] shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={cn('h-14 w-14 rounded-xl flex items-center justify-center text-2xl', typeColors[challenge.type] + '/10')}>
                    {challenge.badge ?? '🏆'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white', typeColors[challenge.type])}>
                        {challenge.type}
                      </span>
                      {(challenge.entry_fee ?? 0) === 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          Free
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-[var(--color-foreground)]">{challenge.title}</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{challenge.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-[var(--color-muted)]/50 rounded-xl">
                <div className="text-center">
                  <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Goal</p>
                  <p className="font-bold text-[var(--color-foreground)]">{challenge.target_count}x</p>
                </div>
                <div className="text-center border-x border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Entry</p>
                  <p className="font-bold text-[var(--color-foreground)]">{formatPrice(challenge.entry_fee)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Time Left</p>
                  <p className="font-bold text-sm text-[var(--color-foreground)]">{getTimeLeft(challenge.ends_at)}</p>
                </div>
              </div>

              {challenge.reward && (
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <span className="text-[var(--color-secondary)] font-medium flex items-center gap-1">
                    <Trophy className="w-4 h-4" /> Reward:
                  </span>
                  <span className="text-[var(--color-foreground)]">{challenge.reward}</span>
                </div>
              )}

              {joined ? (
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Joined • {status?.progress ?? 0}/{challenge.target_count} completed
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleJoin(challenge.id)}
                  disabled={pending && busyId === challenge.id}
                  className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {pending && busyId === challenge.id ? 'Joining...' : <>Join Challenge <ArrowRight className="w-4 h-4" /></>}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
