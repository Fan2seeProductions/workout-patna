// 4-step onboarding flow (where you train, level, goals, vibe).
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight, Check, Dumbbell, Heart, Building2, Users, Plus, X,
  MapPin, Loader2,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { addGym } from '../../../lib/actions/gyms'
import { updateMyProfile } from '../../../lib/actions/profile'

export type GymOption = {
  id: string
  name: string
  type: string
  city: string
  state: string
  members: number | null
}

const locationTypeConfig: Record<string, { label: string; icon: typeof Dumbbell; color: string }> = {
  gym:              { label: 'Gym',              icon: Dumbbell,   color: 'bg-orange-100 text-orange-700' },
  apartment:        { label: 'Apartment',        icon: Building2,  color: 'bg-blue-100 text-blue-700' },
  community_center: { label: 'Community Center', icon: Users,      color: 'bg-green-100 text-green-700' },
}

const levels = [
  { label: 'Beginner',     desc: 'Just starting out, need guidance' },
  { label: 'Intermediate', desc: 'Consistent, know the basics' },
  { label: 'Advanced',     desc: 'Training for years, high intensity' },
]

const goalOptions = [
  'Muscle Gain', 'Weight Loss', 'Endurance',
  'Strength', 'Flexibility', 'Consistency',
  'Socializing', 'Competition Prep',
]

const vibes = [
  { label: 'Headphones On',   desc: 'Focused, minimal chatting' },
  { label: 'Friendly Chat',   desc: 'Open to talking between sets' },
  { label: 'Motivator',       desc: 'High energy, push each other' },
  { label: 'Social Butterfly', desc: 'Love meeting new people' },
]

export function OnboardingClient({ initialGyms }: { initialGyms: GymOption[] }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [gyms, setGyms] = useState<GymOption[]>(initialGyms)
  const [showAddGym, setShowAddGym] = useState(false)
  const [addingGym, setAddingGym] = useState(false)
  const [newGym, setNewGym] = useState({ name: '', city: '', state: 'TX', type: 'gym' as 'gym' | 'apartment' | 'community_center', address: '' })
  const [locationLoading, setLocationLoading] = useState(false)
  const [userCity, setUserCity] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    gymId: '',
    gymName: '',
    gymCity: '',
    level: '',
    goals: [] as string[],
    vibe: '',
  })

  const totalSteps = 4

  function next() {
    setError(null)
    if (step < totalSteps) { setStep(step + 1); return }
    save()
  }

  function save() {
    start(async () => {
      const res = await updateMyProfile({
        primary_location: form.gymName ? `${form.gymName}, ${form.gymCity}` : undefined,
        fitness_level: form.level,
        goals: form.goals,
        vibe: form.vibe,
        styles: ['Strength'],
        schedule_times: ['Mornings'],
        onboarded: true,
      })
      if (!res.ok) {
        setError(res.error ?? 'Save failed.')
        return
      }
      router.push('/app/home')
    })
  }

  function toggleGoal(goal: string) {
    setForm(f => ({
      ...f,
      goals: f.goals.includes(goal) ? f.goals.filter(g => g !== goal) : [...f.goals, goal],
    }))
  }

  async function handleUseLocation() {
    if (!navigator.geolocation) return
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          if (res.ok) {
            const data = await res.json()
            const city: string | undefined = data.address?.city || data.address?.town || data.address?.village || data.address?.county
            const state: string | undefined = data.address?.state
            if (city) {
              setUserCity(city)
              setGyms(prev => [...prev].sort((a, b) => {
                const aMatch = a.city.toLowerCase().includes(city.toLowerCase()) ? -1 : 1
                const bMatch = b.city.toLowerCase().includes(city.toLowerCase()) ? -1 : 1
                return aMatch - bMatch
              }))
              setNewGym(prev => ({ ...prev, city, state: state ?? 'TX' }))
            }
          }
        } finally {
          setLocationLoading(false)
        }
      },
      () => setLocationLoading(false),
      { enableHighAccuracy: false, timeout: 10000 },
    )
  }

  async function handleAddGym() {
    if (!newGym.name || !newGym.city || !newGym.state) return
    setAddingGym(true)
    try {
      const res = await addGym(newGym)
      if (res.ok && res.gym) {
        const g = res.gym as GymOption
        setGyms(prev => [g, ...prev])
        setForm(f => ({ ...f, gymId: g.id, gymName: g.name, gymCity: g.city }))
        setShowAddGym(false)
        setNewGym({ name: '', city: '', state: 'TX', type: 'gym', address: '' })
      }
    } finally {
      setAddingGym(false)
    }
  }

  const canContinue =
    (step === 1 && !!form.gymId) ||
    (step === 2 && !!form.level) ||
    (step === 3 && form.goals.length > 0) ||
    (step === 4 && !!form.vibe)

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col justify-between p-6 max-w-lg mx-auto">

      {/* Progress */}
      <div className="w-full pt-8 pb-12">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all',
                i <= step ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-muted)]',
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display leading-tight text-[var(--color-primary)]">Where do you train?</h1>
            <p className="text-[var(--color-muted-foreground)]">Find your workout Partna at gyms, apartment complexes, or community centers.</p>

            {!userCity && (
              <div className="bg-[var(--color-secondary)]/10 rounded-xl p-4 border border-[var(--color-secondary)]/20">
                <p className="text-sm font-medium text-[var(--color-foreground)] mb-2">Find gyms near you</p>
                <p className="text-xs text-[var(--color-muted-foreground)] mb-3">Allow location access to show gyms close to you. You can always add your gym manually.</p>
                <button
                  onClick={handleUseLocation}
                  disabled={locationLoading}
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  {locationLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Finding your location...</> : <><MapPin className="w-4 h-4" /> Use my location</>}
                </button>
              </div>
            )}

            {userCity && (
              <div className="bg-green-50 rounded-xl p-3 border border-green-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800">Showing gyms near <strong>{userCity}</strong></span>
              </div>
            )}

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {gyms.length === 0 && (
                <p className="text-sm text-[var(--color-muted-foreground)] text-center py-6">
                  No gyms in the database yet. Use &ldquo;Add my gym&rdquo; below to register yours.
                </p>
              )}
              {gyms.map(gym => {
                const cfg = locationTypeConfig[gym.type] ?? locationTypeConfig.gym
                const Icon = cfg.icon
                const selected = form.gymId === gym.id
                return (
                  <button
                    key={gym.id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, gymId: gym.id, gymName: gym.name, gymCity: gym.city }))}
                    className={cn(
                      'w-full p-4 rounded-2xl border-2 text-left transition flex justify-between items-center shadow-sm',
                      selected
                        ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 shadow-md'
                        : 'border-[var(--color-border)] bg-white hover:border-[var(--color-secondary)]/30',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('p-2 rounded-lg', cfg.color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[var(--color-foreground)]">{gym.name}</span>
                        <p className="text-xs text-[var(--color-muted-foreground)]">{gym.city}, {gym.state}</p>
                        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block', cfg.color)}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    {selected && <Check className="w-5 h-5 text-[var(--color-secondary)] shrink-0" />}
                  </button>
                )
              })}
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] mt-4">
              <p className="text-sm text-[var(--color-muted-foreground)] mb-2">Can&rsquo;t find your gym?</p>
              <button
                type="button"
                onClick={() => setShowAddGym(true)}
                className="flex items-center gap-2 text-[var(--color-secondary)] font-semibold hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add my gym
              </button>
            </div>
          </div>
        )}

        {showAddGym && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[var(--color-primary)]">Add Your Gym</h2>
                <button type="button" onClick={() => setShowAddGym(false)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Field label="Gym Name *">
                  <input value={newGym.name} onChange={e => setNewGym(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Planet Fitness" className={inputClass} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City *">
                    <input value={newGym.city} onChange={e => setNewGym(p => ({ ...p, city: e.target.value }))} placeholder="e.g. Austin" className={inputClass} />
                  </Field>
                  <Field label="State *">
                    <input value={newGym.state} onChange={e => setNewGym(p => ({ ...p, state: e.target.value }))} placeholder="e.g. TX" className={inputClass} />
                  </Field>
                </div>
                <Field label="Type">
                  <select value={newGym.type} onChange={e => setNewGym(p => ({ ...p, type: e.target.value as 'gym' | 'apartment' | 'community_center' }))} className={`${inputClass} bg-white`}>
                    <option value="gym">Gym</option>
                    <option value="apartment">Apartment Fitness Center</option>
                    <option value="community_center">Community Center</option>
                  </select>
                </Field>
                <Field label="Address (optional)">
                  <input value={newGym.address} onChange={e => setNewGym(p => ({ ...p, address: e.target.value }))} placeholder="e.g. 123 Main St" className={inputClass} />
                </Field>

                <button
                  type="button"
                  onClick={handleAddGym}
                  disabled={addingGym || !newGym.name || !newGym.city || !newGym.state}
                  className="w-full py-3 bg-[var(--color-secondary)] text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
                >
                  {addingGym ? 'Adding...' : 'Add Gym'}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display leading-tight text-[var(--color-primary)]">What&rsquo;s your experience level?</h1>
            <p className="text-[var(--color-muted-foreground)]">Be honest, this helps us find the best match.</p>
            <div className="grid grid-cols-1 gap-4">
              {levels.map(level => {
                const selected = form.level === level.label
                return (
                  <button
                    key={level.label}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, level: level.label }))}
                    className={cn(
                      'w-full p-5 rounded-2xl border-2 text-left transition shadow-sm',
                      selected
                        ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 shadow-md'
                        : 'border-[var(--color-border)] bg-white hover:border-[var(--color-secondary)]/30',
                    )}
                  >
                    <div className="font-bold text-lg mb-1 text-[var(--color-foreground)]">{level.label}</div>
                    <div className="text-sm text-[var(--color-muted-foreground)]">{level.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display leading-tight text-[var(--color-primary)]">What are your goals?</h1>
            <p className="text-[var(--color-muted-foreground)]">Select all that apply.</p>
            <div className="flex flex-wrap gap-3">
              {goalOptions.map(goal => {
                const on = form.goals.includes(goal)
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={cn(
                      'px-5 py-3 rounded-xl border-2 font-bold transition shadow-sm',
                      on
                        ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white shadow-md'
                        : 'border-[var(--color-border)] bg-white text-[var(--color-muted-foreground)] hover:border-[var(--color-secondary)]/30 hover:text-[var(--color-foreground)]',
                    )}
                  >
                    {goal}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-display leading-tight text-[var(--color-primary)]">What&rsquo;s your vibe?</h1>
            <p className="text-[var(--color-muted-foreground)]">How do you like to interact at the gym?</p>
            <div className="space-y-3">
              {vibes.map(vibe => {
                const on = form.vibe === vibe.label
                return (
                  <button
                    key={vibe.label}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, vibe: vibe.label }))}
                    className={cn(
                      'w-full p-4 rounded-2xl border-2 text-left transition flex items-center gap-4 shadow-sm',
                      on
                        ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 shadow-md'
                        : 'border-[var(--color-border)] bg-white hover:border-[var(--color-secondary)]/30',
                    )}
                  >
                    <div className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center transition',
                      on ? 'bg-[var(--color-secondary)] text-white' : 'bg-[var(--color-muted)]',
                    )}>
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--color-foreground)]">{vibe.label}</div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">{vibe.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="pt-8 space-y-2">
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <button
          type="button"
          onClick={next}
          disabled={pending || !canContinue}
          className="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          {pending ? 'Saving...' : step === totalSteps ? 'Finish Setup' : 'Continue'}
          {step < totalSteps && <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}

const inputClass = 'w-full p-3 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] text-[var(--color-foreground)]'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">{label}</label>
      {children}
    </div>
  )
}
