// Danger zone: permanent account deletion (required by Apple 5.1.1(v) and
// our privacy policy). Two deliberate steps — expand, then type DELETE —
// because this cancels the subscription and wipes all data irreversibly.
'use client'

import { useState, useTransition } from 'react'
import { deleteAccount } from '../../../../../lib/actions/account'

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const armed = confirmText.trim().toUpperCase() === 'DELETE'

  function handleDelete() {
    setError(null)
    start(async () => {
      const res = await deleteAccount()
      // On success deleteAccount() redirects and never returns.
      if (res && !res.ok) setError(res.error)
    })
  }

  return (
    <div className="rounded-2xl border border-[var(--color-danger)]/25 bg-[var(--color-danger)]/[0.04] p-4">
      <p className="text-[13px] font-bold text-[var(--color-danger)]">Delete account</p>
      <p className="mt-1 text-[12px] text-[var(--color-text-muted)] leading-snug">
        Permanently deletes your account, cancels any active subscription, and erases your
        intake, workouts, messages, and history. This cannot be undone.
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 h-10 px-4 rounded-full border border-[var(--color-danger)]/40 text-[13px] font-semibold text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition"
        >
          Delete my account…
        </button>
      ) : (
        <div className="mt-3 space-y-3">
          <label className="block space-y-1.5">
            <span className="text-[12px] text-white/70">
              Type <strong className="text-[var(--color-danger)]">DELETE</strong> to confirm:
            </span>
            <input
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
              autoCapitalize="characters"
              className="w-full rounded-xl border border-[var(--color-border)] bg-white/[0.04] p-3 text-[14px] text-white placeholder:text-white/25 focus:outline-none focus:border-[var(--color-danger)]"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={!armed || pending}
              className="h-10 px-4 rounded-full bg-[var(--color-danger)] text-white text-[13px] font-bold disabled:opacity-40"
            >
              {pending ? 'Deleting…' : 'Permanently delete'}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setConfirmText(''); setError(null) }}
              disabled={pending}
              className="h-10 px-4 rounded-full border border-[var(--color-border)] text-[13px] font-semibold text-white/70 hover:bg-white/[0.05]"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-[12px] text-[var(--color-danger)]">{error}</p>}
        </div>
      )}
    </div>
  )
}
