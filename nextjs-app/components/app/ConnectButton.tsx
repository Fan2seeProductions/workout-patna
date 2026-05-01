// Sticky Connect button for the Profile Detail page.
// Calls sendMatchRequest server action. Disables itself with status feedback.
'use client'

import { useTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendMatchRequest } from '../../lib/actions/matches'
import { ArrowRightIcon, ChatIcon, CheckIcon } from './icons'

type Status = 'idle' | 'sent' | 'matched' | 'error'

export function ConnectButton({ profileId }: { profileId: string }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [status, setStatus] = useState<Status>('idle')
  const [matchId, setMatchId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function onClick() {
    setStatus('idle')
    setErrorMessage(null)
    start(async () => {
      try {
        const res = await sendMatchRequest(profileId)
        setMatchId(res.matchId)
        if (res.matched) {
          setStatus('matched')
        } else {
          setStatus('sent')
        }
      } catch (err) {
        const message = (err as Error).message
        if (message.toLowerCase().includes('not signed in')) {
          router.push('/app/signin')
          return
        }
        setStatus('error')
        setErrorMessage(message)
      }
    })
  }

  if (status === 'matched' && matchId) {
    return (
      <button
        onClick={() => router.push(`/app/messages/${matchId}`)}
        className="flex-1 h-12 rounded-full brand-gradient text-white font-semibold inline-flex items-center justify-center gap-1.5 text-[15px] shadow-[0_8px_24px_-4px_rgba(59,130,246,0.45)]"
      >
        <ChatIcon width={16} height={16} /> Message
      </button>
    )
  }

  if (status === 'sent') {
    return (
      <button
        disabled
        className="flex-1 h-12 rounded-full bg-white/[0.04] border border-[var(--color-border-bright)] text-white/85 font-semibold inline-flex items-center justify-center gap-1.5 text-[15px]"
      >
        <CheckIcon width={16} height={16} className="text-[var(--color-match)]" /> Request sent
      </button>
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-1.5">
      <button
        onClick={onClick}
        disabled={pending}
        className="h-12 rounded-full brand-gradient text-white font-semibold inline-flex items-center justify-center gap-1.5 text-[15px] shadow-[0_8px_24px_-4px_rgba(59,130,246,0.45)] disabled:opacity-60"
      >
        {pending ? 'Connecting...' : <>Connect <ArrowRightIcon width={16} height={16} /></>}
      </button>
      {errorMessage && (
        <p className="text-[11px] text-[var(--color-danger)] text-center px-2">{errorMessage}</p>
      )}
    </div>
  )
}
