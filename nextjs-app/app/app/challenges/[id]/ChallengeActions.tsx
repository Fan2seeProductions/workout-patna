'use client'

import { useTransition } from 'react'
import { joinChallenge, leaveChallenge, checkInChallenge } from '../../../../lib/actions/challenges'

export function ChallengeActions({
  challengeId,
  joined,
  checkedInToday,
}: {
  challengeId: string
  joined: boolean
  checkedInToday: boolean
}) {
  const [pending, start] = useTransition()

  if (!joined) {
    return (
      <button
        onClick={() => start(async () => { await joinChallenge(challengeId) })}
        disabled={pending}
        className="w-full h-12 rounded-full brand-gradient text-white font-semibold text-[15px] disabled:opacity-50"
      >
        {pending ? 'Joining...' : 'Join challenge'}
      </button>
    )
  }

  if (checkedInToday) {
    return (
      <div className="flex gap-2">
        <button
          disabled
          className="flex-1 h-12 rounded-full bg-white/[0.04] border border-[var(--color-border-bright)] text-white/70 font-semibold text-[14px]"
        >
          ✓ Done for today
        </button>
        <button
          onClick={() => start(async () => { await leaveChallenge(challengeId) })}
          disabled={pending}
          className="h-12 px-4 rounded-full border border-[var(--color-border-bright)] bg-white/[0.04] text-[13px] text-white/85 disabled:opacity-50"
        >
          Leave
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => start(async () => { await checkInChallenge(challengeId) })}
        disabled={pending}
        className="flex-1 h-12 rounded-full brand-gradient text-white font-semibold text-[15px] disabled:opacity-50"
      >
        {pending ? 'Checking in...' : 'Check in for today'}
      </button>
      <button
        onClick={() => start(async () => { await leaveChallenge(challengeId) })}
        disabled={pending}
        className="h-12 px-4 rounded-full border border-[var(--color-border-bright)] bg-white/[0.04] text-[13px] text-white/85 disabled:opacity-50"
      >
        Leave
      </button>
    </div>
  )
}
