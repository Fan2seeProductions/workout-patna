// Server-side utility to send a web push notification to a subscription endpoint.
// Called by the daily-workouts cron after each workout is generated.

import webPush from 'web-push'

const VAPID_PUBLIC  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY ?? ''
const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? 'mailto:noreply@workoutpartna.com'

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)
}

export type PushSubscription = {
  endpoint: string
  p256dh: string
  auth: string
}

export type PushPayload = {
  title: string
  body: string
  url?: string
  tag?: string
  icon?: string
}

/**
 * Send a push notification to one subscription.
 * Returns true on success, false on failure (stale subscription etc.).
 */
export async function sendPush(
  sub: PushSubscription,
  payload: PushPayload,
): Promise<boolean> {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return false
  try {
    await webPush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      },
      JSON.stringify(payload),
      { TTL: 86400 },   // deliver within 24 hours or drop
    )
    return true
  } catch {
    return false
  }
}

/**
 * Send to all subscriptions for a user. Silently ignores failures.
 */
export async function sendPushToAll(
  subs: PushSubscription[],
  payload: PushPayload,
): Promise<void> {
  await Promise.allSettled(subs.map(s => sendPush(s, payload)))
}
