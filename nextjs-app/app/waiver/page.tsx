// /waiver — Liability Waiver, Release & Assumption of Risk.
// Public page (matches /terms and /privacy structure).
import Link from 'next/link'
import type { Metadata } from 'next'
import { Logo } from '../../components/app/Logo'
import { BackIcon } from '../../components/app/icons'

export const metadata: Metadata = {
  title: 'Liability Waiver',
  description: 'WorkoutPartna liability waiver, release, and assumption of risk.',
  alternates: { canonical: '/waiver' },
}

export default function WaiverPage() {
  return (
    <main className="min-h-dvh bg-[var(--color-background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-card)]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-5 py-3 flex items-center gap-3">
          <Link
            href="/app"
            aria-label="Back"
            className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-[var(--color-foreground)]/85"
          >
            <BackIcon width={18} height={18} />
          </Link>
          <Logo size={20} withWordmark />
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-10 text-[var(--color-foreground)]/85 leading-relaxed">
        <h1 className="text-[32px] font-extrabold font-display tracking-tight text-[var(--color-foreground)]">
          Liability Waiver, Release &amp; Assumption of Risk
        </h1>
        <p className="text-[13px] text-[var(--color-muted-foreground)] mt-2">
          <strong>Last Updated:</strong> May 2, 2026
        </p>

        <p className="mt-6">
          By participating in or attending any event, activity, or service provided by{' '}
          <strong>WorkoutPartna</strong>, the undersigned acknowledges and agrees as follows:
        </p>

        <Section n="1" title="Assumption of Risk">
          <p>
            I understand that participation involves inherent risks including, but not limited to,
            bodily injury, illness, property damage, or death. I voluntarily assume all such risks.
          </p>
        </Section>

        <Section n="2" title="Release of Liability">
          <p>
            I hereby release, waive, and discharge <strong>WorkoutPartna</strong>, its owners,
            employees, contractors, agents, and affiliates from any and all claims, demands,
            actions, or causes of action arising from injury, damage, or loss, whether caused by
            negligence or otherwise, to the fullest extent permitted by law.
          </p>
        </Section>

        <Section n="3" title="Indemnification">
          <p>
            I agree to indemnify and hold harmless <strong>WorkoutPartna</strong> from any claims
            brought by third parties arising from my participation.
          </p>
        </Section>

        <Section n="4" title="No Guarantees">
          <p>
            I acknowledge that <strong>WorkoutPartna</strong> makes no warranties regarding safety
            conditions and is not responsible for the actions of other participants, venue
            conditions, or third-party vendors.
          </p>
        </Section>

        <Section n="5" title="Arbitration &amp; Venue">
          <p>
            Any dispute shall be resolved through binding arbitration in <strong>Texas</strong>,
            and I waive my right to a jury trial.
          </p>
        </Section>

        <Section n="6" title="Severability">
          <p>
            If any portion of this agreement is held invalid, the remaining provisions shall
            remain in full force.
          </p>
        </Section>

        <div className="mt-10 p-6 rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-white">
          <p className="font-medium text-gray-900">
            I have read and fully understand this agreement and sign it voluntarily.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Signature</p>
              <div className="mt-2 h-12 border-b-2 border-gray-300" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Date</p>
              <div className="mt-2 h-12 border-b-2 border-gray-300" />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-[var(--color-muted-foreground)]">
          Questions about this waiver? Contact{' '}
          <a href="mailto:sales@fan2seeproductions.com" className="font-bold text-[var(--color-primary)] underline">
            sales@fan2seeproductions.com
          </a>
        </div>

        <div className="mt-4 text-center text-xs text-[var(--color-muted-foreground)]">
          See also our{' '}
          <Link href="/terms" className="underline">Terms &amp; Conditions</Link> and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </div>

        <div className="h-12" />
      </article>
    </main>
  )
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-[20px] font-extrabold font-display tracking-tight text-[var(--color-foreground)]">
        <span className="text-[var(--color-primary)] mr-2">{n}.</span>
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}
