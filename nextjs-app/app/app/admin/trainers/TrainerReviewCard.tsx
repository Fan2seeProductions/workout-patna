'use client'

import { useState, useTransition } from 'react'
import { reviewTrainerApplication } from '../../../../lib/actions/trainer-applications'

type Application = {
  id: string
  name: string
  bio?: string | null
  specialties?: string[]
  certifications?: string | null
  years_experience?: number | null
  booking_link?: string | null
  photo_url?: string | null
  status: string
  created_at: string
}

export function TrainerReviewCard({
  application: app,
  gymName,
  gymCity,
  showActions,
}: {
  application: Application
  gymName?: string
  gymCity?: string
  showActions: boolean
}) {
  const [pending, start] = useTransition()
  const [decided, setDecided] = useState<string | null>(null)

  function decide(decision: 'approved' | 'rejected') {
    start(async () => {
      const res = await reviewTrainerApplication(app.id, decision)
      if (res.ok) setDecided(decision)
    })
  }

  if (decided) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 text-center">
        <p className="text-[14px] font-bold text-[var(--color-foreground)]">
          {app.name} {decided === 'approved' ? 'approved' : 'rejected'}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
      <div className="flex items-start gap-3">
        {app.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={app.photo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[var(--color-muted)] flex items-center justify-center text-[18px] font-bold text-[var(--color-primary)]">
            {app.name?.charAt(0) ?? 'T'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-[15px] text-[var(--color-foreground)] truncate">{app.name}</h3>
          {gymName && (
            <p className="text-[12px] text-[var(--color-muted-foreground)]">
              {gymName}{gymCity ? `, ${gymCity}` : ''}
            </p>
          )}
          <p className="text-[11px] text-[var(--color-muted-foreground)]">
            Applied {new Date(app.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {app.specialties && app.specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {app.specialties.map(s => (
            <span key={s} className="px-2.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[11px] font-bold">
              {s}
            </span>
          ))}
        </div>
      )}

      {app.bio && (
        <p className="mt-3 text-[13px] text-[var(--color-foreground)] leading-relaxed line-clamp-3">{app.bio}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--color-muted-foreground)]">
        {app.years_experience != null && <span>{app.years_experience}+ years</span>}
        {app.certifications && <span>{app.certifications}</span>}
        {app.booking_link && (
          <a href={app.booking_link} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] font-bold">
            Booking link
          </a>
        )}
      </div>

      {showActions && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => decide('rejected')}
            className="h-10 rounded-full border border-red-200 text-red-600 text-[12.5px] font-bold hover:bg-red-50 transition disabled:opacity-50"
          >
            Reject
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => decide('approved')}
            className="h-10 rounded-full brand-gradient text-white text-[12.5px] font-bold disabled:opacity-50"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  )
}
