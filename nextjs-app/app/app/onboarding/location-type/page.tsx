// Onboarding step 2: what type of location do you train at?
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingFrame } from '../../../../components/app/OnboardingFrame'
import { SelectCard } from '../../../../components/app/SelectCard'
import { BrandButton } from '../../../../components/app/BrandButton'
import {
  StrengthIcon, RunIcon, YogaIcon, MapPinIcon, ArmIcon, MoreIcon,
} from '../../../../components/app/icons'

const types = [
  { id: 'gym',          title: 'Gym',                    subtitle: 'Planet Fitness, EOS, LA Fitness, local.', Icon: StrengthIcon },
  { id: 'apartment',    title: 'Apartment fitness center', subtitle: 'Match with neighbors in your complex.', Icon: ArmIcon },
  { id: 'community',    title: 'Community center',       subtitle: 'YMCA, rec center, public facilities.',    Icon: MapPinIcon },
  { id: 'park',         title: 'Park or outdoor',        subtitle: 'Calisthenics, bootcamps, trail runs.',    Icon: YogaIcon },
  { id: 'runclub',      title: 'Run club',               subtitle: 'Local running groups and meetups.',       Icon: RunIcon },
  { id: 'other',        title: 'Other',                  subtitle: 'Yoga studio, climbing gym, etc.',         Icon: MoreIcon },
]

export default function LocationTypePage() {
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
    <OnboardingFrame step={2} totalSteps={5} backHref="/app/onboarding/intent">
      <div className="mt-2">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">
          Where do you train?
        </h1>
        <p className="mt-1.5 text-[14px] text-[var(--color-text-muted)]">
          Select every place you regularly work out. You can add more later.
        </p>
      </div>

      <div className="mt-6 space-y-2.5">
        {types.map(({ id, title, subtitle, Icon }) => (
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
        onClick={() => router.push('/app/onboarding/find-location')}
      >
        Continue
      </BrandButton>
    </OnboardingFrame>
  )
}
