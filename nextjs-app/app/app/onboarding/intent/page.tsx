// Onboarding step 1: what brings you to WorkoutPartna?
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingFrame } from '../../../../components/app/OnboardingFrame'
import { SelectCard } from '../../../../components/app/SelectCard'
import { BrandButton } from '../../../../components/app/BrandButton'
import {
  HeartPulseIcon, ArmIcon, TargetIcon, BrainIcon,
} from '../../../../components/app/icons'

const intents = [
  { id: 'partner',   title: 'Find a workout partner', subtitle: 'Match with people at your gym.', Icon: ArmIcon },
  { id: 'community', title: 'Join fitness communities', subtitle: 'Run clubs, gym groups, classes.', Icon: HeartPulseIcon },
  { id: 'accountability', title: 'Stay accountable', subtitle: 'Daily check-ins and challenges.', Icon: TargetIcon },
  { id: 'ai-coach',  title: 'Get AI daily workouts', subtitle: 'Personalized texts every morning.', Icon: BrainIcon },
]

export default function IntentPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <OnboardingFrame step={1} totalSteps={5} backHref="/app/signup">
      <div className="mt-2">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">
          What brings you here?
        </h1>
        <p className="mt-1.5 text-[14px] text-[var(--color-text-muted)]">
          Pick all that apply. We'll personalize your experience.
        </p>
      </div>

      <div className="mt-6 space-y-2.5">
        {intents.map(({ id, title, subtitle, Icon }) => (
          <SelectCard
            key={id}
            selected={selected.has(id)}
            onClick={() => toggle(id)}
            icon={<Icon width={22} height={22} />}
            title={title}
            subtitle={subtitle}
          />
        ))}
      </div>

      <div className="flex-1" />

      <BrandButton
        size="lg"
        className="w-full mt-4"
        disabled={selected.size === 0}
        onClick={() => router.push('/app/onboarding/location-type')}
      >
        Continue
      </BrandButton>
    </OnboardingFrame>
  )
}
