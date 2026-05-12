// More-menu (kebab) on a real user's profile detail. Surfaces Rate, Report,
// Block actions. Rate opens a 5-star modal. Report opens a reason picker.
'use client'

import { useState, useTransition } from 'react'
import { Star, Flag, Shield, X, MoreVertical } from 'lucide-react'
import { rateUser } from '../../lib/actions/ratings'
import { reportUser, blockUser } from '../../lib/actions/safety'
import { cn } from '../../lib/utils'

const reportReasons = [
  'Harassment or abuse',
  'Inappropriate messages',
  'Fake or misleading profile',
  'Spam or scam',
  'Made me feel unsafe',
  'Other',
]

type Modal = null | 'menu' | 'rate' | 'report' | 'block'

export function ProfileSafetyMenu({ targetId, targetName }: { targetId: string; targetName: string }) {
  const [modal, setModal] = useState<Modal>(null)
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  const [reason, setReason] = useState(reportReasons[0])
  const [details, setDetails] = useState('')
  const [pending, start] = useTransition()
  const [info, setInfo] = useState<string | null>(null)

  function close() {
    setModal(null)
    setInfo(null)
  }

  function submitRating() {
    start(async () => {
      const res = await rateUser({ ratedUserId: targetId, score, comment })
      setInfo(res.ok ? 'Thanks for the rating.' : (res.error ?? 'Failed.'))
      if (res.ok) setTimeout(close, 1100)
    })
  }

  function submitReport() {
    start(async () => {
      const res = await reportUser({ reportedId: targetId, reason, details })
      setInfo(res.ok ? 'Report submitted. Our team will review it.' : (res.error ?? 'Failed.'))
      if (res.ok) setTimeout(close, 1500)
    })
  }

  function submitBlock() {
    start(async () => {
      const res = await blockUser({ blockedId: targetId, reason })
      setInfo(res.ok ? `${targetName} blocked.` : (res.error ?? 'Failed.'))
      if (res.ok) setTimeout(() => { close(); window.location.href = '/app/browse' }, 1100)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModal('menu')}
        aria-label="More"
        className="h-10 w-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center text-white"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={close}>
          <div
            className="bg-[#141414] border border-white/10 rounded-t-3xl md:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold text-[var(--color-foreground)]">
                {modal === 'menu' && targetName}
                {modal === 'rate' && `Rate ${targetName}`}
                {modal === 'report' && `Report ${targetName}`}
                {modal === 'block' && `Block ${targetName}?`}
              </h2>
              <button type="button" onClick={close} aria-label="Close" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {modal === 'menu' && (
                <div className="space-y-2">
                  <MenuRow icon={<Star className="w-5 h-5" />} label="Rate this Partna" onClick={() => setModal('rate')} />
                  <MenuRow icon={<Flag className="w-5 h-5" />} label="Report" onClick={() => setModal('report')} danger />
                  <MenuRow icon={<Shield className="w-5 h-5" />} label="Block" onClick={() => setModal('block')} danger />
                </div>
              )}

              {modal === 'rate' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2">Score</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setScore(s)}
                          className={cn('text-3xl transition', s <= score ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400')}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2">Comment (optional)</p>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value.slice(0, 500))}
                      rows={3}
                      placeholder="Showed up on time. Pushed me hard. Would train again."
                      className="w-full p-3 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  {info && <p className="text-sm text-[var(--color-muted-foreground)] text-center">{info}</p>}
                  <button
                    type="button"
                    onClick={submitRating}
                    disabled={pending}
                    className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-60"
                  >
                    {pending ? 'Submitting...' : 'Submit rating'}
                  </button>
                </div>
              )}

              {(modal === 'report' || modal === 'block') && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2">Reason</p>
                    <div className="space-y-2">
                      {reportReasons.map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReason(r)}
                          className={cn(
                            'w-full text-left p-3 rounded-xl border text-sm font-medium transition',
                            reason === r
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-foreground)]'
                              : 'border-white/15 bg-white/[0.04] text-white hover:border-[var(--color-primary)]/40 hover:bg-white/[0.08]',
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {modal === 'report' && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-2">Details (optional)</p>
                      <textarea
                        value={details}
                        onChange={e => setDetails(e.target.value.slice(0, 800))}
                        rows={3}
                        placeholder="What happened?"
                        className="w-full p-3 border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                  )}

                  {info && <p className="text-sm text-[var(--color-muted-foreground)] text-center">{info}</p>}

                  <button
                    type="button"
                    onClick={modal === 'report' ? submitReport : submitBlock}
                    disabled={pending}
                    className={cn(
                      'w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-60',
                      modal === 'block' ? 'bg-red-600 hover:bg-red-700' : 'bg-[var(--color-primary)] hover:opacity-90',
                    )}
                  >
                    {pending ? 'Working...' : (modal === 'block' ? 'Block user' : 'Submit report')}
                  </button>

                  {modal === 'block' && (
                    <p className="text-xs text-center text-[var(--color-muted-foreground)]">
                      Blocking removes any existing match and hides their profile from you.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function MenuRow({
  icon, label, onClick, danger = false,
}: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] transition text-left',
        danger ? 'text-red-600' : 'text-[var(--color-foreground)]',
      )}
    >
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </button>
  )
}
