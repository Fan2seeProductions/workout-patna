'use client'

// Client-side editor for the user's Hinge-style profile prompts.
// Two states: "list" (the 3 slots they can edit) and "picker" (browsing the
// curated library to fill a slot).
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  CATEGORY_LABEL,
  MAX_PROMPTS,
  PROMPT_ANSWER_MAX,
  PROFILE_PROMPTS,
  findPrompt,
  promptsByCategory,
  type ProfilePromptCategory,
  type SavedPrompt,
} from '../../../../lib/profile/prompts'
import { updateMyPrompts } from '../../../../lib/actions/profile'

type Slot = SavedPrompt | null

export function PromptsEditor({ initial }: { initial: SavedPrompt[] }) {
  const router = useRouter()
  const [slots, setSlots] = useState<Slot[]>(() => {
    const padded: Slot[] = [...initial]
    while (padded.length < MAX_PROMPTS) padded.push(null)
    return padded.slice(0, MAX_PROMPTS)
  })
  const [pickerForSlot, setPickerForSlot] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState<number | null>(null)

  function chooseFor(slotIndex: number, promptId: string) {
    setSlots(prev => {
      const next = [...prev]
      next[slotIndex] = { id: promptId, answer: prev[slotIndex]?.id === promptId ? prev[slotIndex]!.answer : '' }
      return next
    })
    setPickerForSlot(null)
  }

  function setAnswer(slotIndex: number, answer: string) {
    setSlots(prev => {
      const next = [...prev]
      const cur = next[slotIndex]
      if (!cur) return prev
      next[slotIndex] = { ...cur, answer: answer.slice(0, PROMPT_ANSWER_MAX) }
      return next
    })
  }

  function clearSlot(slotIndex: number) {
    setSlots(prev => {
      const next = [...prev]
      next[slotIndex] = null
      return next
    })
  }

  function save() {
    const payload: SavedPrompt[] = slots
      .filter((s): s is SavedPrompt => !!s && s.answer.trim().length > 0)
    startTransition(async () => {
      const res = await updateMyPrompts(payload)
      if (res.ok) {
        setSavedAt(Date.now())
        router.refresh()
      }
    })
  }

  if (pickerForSlot !== null) {
    const usedIds = new Set(slots.filter(Boolean).map(s => s!.id))
    return (
      <PromptPicker
        excludeIds={usedIds}
        onPick={id => chooseFor(pickerForSlot, id)}
        onCancel={() => setPickerForSlot(null)}
      />
    )
  }

  return (
    <div className="space-y-5">
      {slots.map((slot, i) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          {slot ? (
            <SlotEditor
              slot={slot}
              onAnswer={a => setAnswer(i, a)}
              onSwap={() => setPickerForSlot(i)}
              onRemove={() => clearSlot(i)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setPickerForSlot(i)}
              className="w-full py-6 rounded-xl border-2 border-dashed border-white/15 text-sm font-bold text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition"
            >
              + Pick a prompt for slot {i + 1}
            </button>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between gap-3 pt-2">
        <p className="text-[12px] text-[var(--color-muted-foreground)]">
          {savedAt ? 'Saved.' : 'Changes are not saved until you tap Save.'}
        </p>
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="px-6 py-2.5 rounded-full brand-gradient text-white text-sm font-bold shadow-[0_4px_14px_-4px_rgba(220,22,22,0.6)] disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save prompts'}
        </button>
      </div>
    </div>
  )
}

function SlotEditor({
  slot,
  onAnswer,
  onSwap,
  onRemove,
}: {
  slot: SavedPrompt
  onAnswer: (a: string) => void
  onSwap: () => void
  onRemove: () => void
}) {
  const meta = findPrompt(slot.id)
  if (!meta) return null
  const remaining = PROMPT_ANSWER_MAX - slot.answer.length
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <p className="font-bold uppercase tracking-wider text-[var(--color-primary)] text-[11.5px]">
          {meta.question}
        </p>
        <div className="flex gap-2 shrink-0">
          <button type="button" onClick={onSwap} className="text-[11px] font-bold text-white/70 hover:text-white">
            Swap
          </button>
          <button type="button" onClick={onRemove} className="text-[11px] font-bold text-white/40 hover:text-[var(--color-primary)]">
            Remove
          </button>
        </div>
      </div>
      <textarea
        value={slot.answer}
        onChange={e => onAnswer(e.target.value)}
        placeholder={meta.placeholder}
        rows={3}
        maxLength={PROMPT_ANSWER_MAX}
        className="w-full rounded-xl bg-[#1a1a1a] border border-white/10 focus:border-[var(--color-primary)]/40 outline-none p-3 text-[15px] text-white/95 placeholder:text-white/30 resize-none"
      />
      <p className="text-right text-[11px] text-[var(--color-muted-foreground)]">
        {remaining} characters left
      </p>
    </div>
  )
}

function PromptPicker({
  excludeIds,
  onPick,
  onCancel,
}: {
  excludeIds: Set<string>
  onPick: (id: string) => void
  onCancel: () => void
}) {
  const grouped = promptsByCategory()
  const categories = Object.keys(grouped) as ProfilePromptCategory[]
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-extrabold tracking-tight">Pick a prompt</h2>
        <button type="button" onClick={onCancel} className="text-[12px] font-bold text-white/60 hover:text-white">
          Cancel
        </button>
      </div>
      {categories.map(cat => (
        <section key={cat}>
          <h3 className="text-[11px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)] mb-2 ml-1">
            {CATEGORY_LABEL[cat]}
          </h3>
          <div className="space-y-2">
            {grouped[cat].map(p => {
              const used = excludeIds.has(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={used}
                  onClick={() => onPick(p.id)}
                  className={
                    'w-full text-left rounded-xl border p-3 transition ' +
                    (used
                      ? 'border-white/5 bg-white/[0.02] text-white/30 cursor-not-allowed'
                      : 'border-white/10 bg-white/[0.04] text-white/90 hover:border-[var(--color-primary)]/40 hover:bg-[rgba(220,22,22,0.06)]')
                  }
                >
                  <p className="font-bold text-[14px]">{p.question}</p>
                  <p className="mt-0.5 text-[12px] text-white/50 italic">{p.placeholder}</p>
                  {used && <p className="mt-1 text-[10.5px] uppercase tracking-wider text-white/40">Already in use</p>}
                </button>
              )
            })}
          </div>
        </section>
      ))}
      <p className="text-[11.5px] text-[var(--color-muted-foreground)] pt-2 border-t border-white/5">
        {PROFILE_PROMPTS.length} prompts in the library.
      </p>
    </div>
  )
}
