// Server actions for challenge templates. Mirrors the Replit
// generateChallengeFromTemplate flow: pick a template, materialize
// it as an active challenge with a duration based on type.
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'

const DURATION_MS: Record<string, number> = {
  daily:   24 * 60 * 60 * 1000,
  weekly:  7  * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
}

export async function generateChallengeFromTemplate(templateId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Sign in required.' }

  const { data: tpl, error: tplErr } = await supabase
    .from('challenge_templates')
    .select('id, type, title, description, level, target_count, badge')
    .eq('id', templateId)
    .maybeSingle()

  if (tplErr || !tpl) return { ok: false, error: 'Template not found.' }

  const startsAt = new Date()
  const endsAt = new Date(startsAt.getTime() + (DURATION_MS[tpl.type] ?? DURATION_MS.weekly))

  const { data, error } = await supabase
    .from('challenges')
    .insert({
      title: tpl.title,
      description: tpl.description,
      type: tpl.type,
      target_count: tpl.target_count,
      badge: tpl.badge,
      entry_fee: 0,
      active: true,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  revalidatePath('/app/challenges')
  return { ok: true, challengeId: data.id }
}
