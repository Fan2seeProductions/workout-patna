'use client'

import { useState, useTransition } from 'react'
import { ShieldCheck, X, Mail, Loader2 } from 'lucide-react'
import { sendEmailVerification } from '../../lib/actions/verification'

export function VerifyEmailBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [sent, setSent] = useState(false)
  const [pending, startTransition] = useTransition()

  if (dismissed) return null

  function resend() {
    startTransition(async () => {
      await sendEmailVerification()
      setSent(true)
    })
  }

  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center gap-3">
      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />

      <p className="flex-1 text-[12.5px] text-amber-200/90 font-medium leading-snug">
        {sent
          ? '✓ Verification email sent — check your inbox.'
          : 'Verify your email to secure your account.'}
      </p>

      {!sent && (
        <button
          onClick={resend}
          disabled={pending}
          className="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-bold text-amber-300 hover:text-white transition disabled:opacity-50"
        >
          {pending
            ? <><Loader2 className="w-3 h-3 animate-spin" /> Sending…</>
            : <><Mail className="w-3 h-3" /> Send link</>}
        </button>
      )}

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="shrink-0 text-amber-400/60 hover:text-amber-200 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
