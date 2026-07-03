// /api/telnyx/voice — TeXML webhook called by Telnyx when a voice call connects.
// Fetches today's workout for the given user and speaks it using TTS.
// Telnyx reads the returned XML to control the call.
//
// Called with ?uid=USER_ID (set when we initiate the call).

import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'

// The uid is HMAC-signed when the call is initiated (lib/sms/sms.ts), so
// only URLs we generated ourselves are honored — this route returns the
// member's name and workout, which must not be readable by uid-guessing.
function tokenValid(uid: string, tok: string | null): boolean {
  const secret = process.env.CRON_SECRET ?? process.env.TELNYX_API_KEY
  if (!secret) return true   // dev without secrets configured
  if (!tok) return false
  const expected = createHmac('sha256', secret).update(uid).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(tok)
  return a.length === b.length && timingSafeEqual(a, b)
}

function workoutToSpeech(plan: {
  focus: string
  warm_up: string
  main: string
  finisher: string
  notes: string
}, firstName: string | null): string {
  const name = firstName ?? 'there'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  // Strip markdown symbols and format naturally for speech
  const clean = (s: string) =>
    s
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#+\s/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\.\s*\./g, '.')
      .trim()

  return [
    `Hey ${name}! Good morning. It's ${today} and your WorkoutPartna AI Coach has your workout ready.`,
    `Today's focus is: ${clean(plan.focus)}.`,
    `First, your warm up. ${clean(plan.warm_up)}`,
    `Now for your main workout. ${clean(plan.main)}`,
    `Your finisher today is: ${clean(plan.finisher)}`,
    `Coach's notes: ${clean(plan.notes)}`,
    `That's your workout for today! Head to the WorkoutPartna app to log your session. Have a great workout!`,
  ].join('  ')
}

export async function GET(request: Request) {
  const url   = new URL(request.url)
  const uid   = url.searchParams.get('uid')
  const tok   = url.searchParams.get('tok')

  // Return a simple fallback if uid is missing or the signature is wrong
  if (!uid || !tokenValid(uid, tok)) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="en-US-Neural2-F" rate="95%">Sorry, we could not load your workout. Please check the WorkoutPartna app. Have a great day!</Say>
  <Hangup/>
</Response>`,
      { headers: { 'Content-Type': 'text/xml' } },
    )
  }

  // Use service-role client (this is a server-to-server webhook, not a browser session)
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)

  const [{ data: workout }, { data: profile }] = await Promise.all([
    supabase
      .from('ai_workouts')
      .select('focus, warm_up, main, finisher, notes')
      .eq('user_id', uid)
      .eq('day', today)
      .maybeSingle(),
    supabase
      .from('profiles')
      .select('display_name, first_name')
      .eq('id', uid)
      .maybeSingle(),
  ])

  const firstName =
    (profile?.first_name as string | undefined) ??
    (profile?.display_name as string | undefined)?.split(/\s+/)[0] ??
    null

  let speechText: string

  if (workout) {
    speechText = workoutToSpeech(
      workout as { focus: string; warm_up: string; main: string; finisher: string; notes: string },
      firstName,
    )
  } else {
    speechText =
      `Hey ${firstName ?? 'there'}! Your WorkoutPartna AI Coach workout for today isn't ready yet. ` +
      `Open the app to generate your personalized plan. Have a great day!`
  }

  // Escape XML special characters
  const escaped = speechText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="en-US-Neural2-F" rate="95%">${escaped}</Say>
  <Hangup/>
</Response>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'text/xml' },
  })
}
