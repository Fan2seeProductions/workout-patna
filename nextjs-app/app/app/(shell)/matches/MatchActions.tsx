// Client component for the accept/decline/cancel buttons.
'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { acceptMatchRequest, declineMatchRequest, cancelMatchRequest } from '../../../../lib/actions/matches'

export function MatchActions({
  matchId,
  direction,
}: {
  matchId: string
  direction: 'incoming' | 'outgoing'
}) {
  const router = useRouter()
  const [pending, start] = useTransition()

  if (direction === 'outgoing') {
    return (
      <button
        onClick={() => start(async () => { await cancelMatchRequest(matchId) })}
        disabled={pending}
        className="w-full h-10 rounded-full border border-[var(--color-border-bright)] bg-white/[0.04] text-[13px] font-semibold text-white/85 disabled:opacity-50"
      >
        {pending ? 'Cancelling...' : 'Cancel request'}
      </button>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => start(async () => { await declineMatchRequest(matchId) })}
        disabled={pending}
        className="h-10 rounded-full border border-[var(--color-border-bright)] bg-white/[0.04] text-[13px] font-semibold text-white/85 disabled:opacity-50"
      >
        Decline
      </button>
      <button
        onClick={() =>
          start(async () => {
            const res = await acceptMatchRequest(matchId)
            if (res.ok) {
              // Navigate to the chat so the user can start messaging immediately
              router.push(`/app/messages/${matchId}`)
            }
          })
        }
        disabled={pending}
        className="h-10 rounded-full brand-gradient text-[13px] font-bold text-white disabled:opacity-50"
      >
        {pending ? 'Matching...' : 'Accept'}
      </button>
    </div>
  )
}
