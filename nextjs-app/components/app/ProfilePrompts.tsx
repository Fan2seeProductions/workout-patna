// Hinge-style prompt cards. Each saved prompt renders as a "question on top,
// answer below" card with the brand's red voltage on the question. Designed
// to live both on the profile page and in the Discover swipe deck.
import { findPrompt, sanitizePrompts } from '../../lib/profile/prompts'

type Props = {
  prompts: unknown
  /** Compact = smaller padding, used inside swipe cards. */
  compact?: boolean
  /** Hide the section heading (used inside cards that already title themselves). */
  hideHeading?: boolean
}

export function ProfilePrompts({ prompts, compact, hideHeading }: Props) {
  const list = sanitizePrompts(prompts)
  if (list.length === 0) return null

  return (
    <section className={compact ? 'space-y-2' : 'space-y-3'}>
      {!hideHeading && (
        <h3 className="text-[12px] uppercase font-bold tracking-wider text-[var(--color-muted-foreground)] ml-1">
          Prompts
        </h3>
      )}
      <div className={compact ? 'space-y-2' : 'space-y-3'}>
        {list.map(({ id, answer }) => {
          const meta = findPrompt(id)
          if (!meta) return null
          return (
            <article
              key={id}
              className={
                'rounded-2xl border border-white/10 bg-white/[0.04] ' +
                (compact ? 'p-3' : 'p-4')
              }
            >
              <p className={
                'font-bold uppercase tracking-wider text-[var(--color-primary)] ' +
                (compact ? 'text-[10.5px]' : 'text-[11.5px]')
              }>
                {meta.question}
              </p>
              <p className={
                'mt-1.5 text-white/90 leading-snug font-medium ' +
                (compact ? 'text-[14px]' : 'text-[15.5px]')
              }>
                {answer}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
