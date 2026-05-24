// Toggle to enable/disable browser push notifications.
'use client'

import { useEffect, useState, useTransition } from 'react'
import { subscribePush, unsubscribePush } from '../../lib/actions/push'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

export function PushSubscriptionToggle() {
  const [supported, setSupported] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [pending, start] = useTransition()

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    setSupported(true)

    // Register the SW if not already registered, then check subscription state.
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setEnabled(!!sub))
      .catch(() => {})
  }, [])

  if (!supported) return null

  function toggle() {
    start(async () => {
      const reg = await navigator.serviceWorker.ready

      if (enabled) {
        const sub = await reg.pushManager.getSubscription()
        if (sub) {
          await unsubscribePush(sub.endpoint)
          await sub.unsubscribe()
        }
        setEnabled(false)
      } else {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidKey) return

        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        })

        const json = sub.toJSON()
        await subscribePush({
          endpoint: sub.endpoint,
          keys: {
            p256dh: json.keys?.p256dh ?? '',
            auth: json.keys?.auth ?? '',
          },
        })
        setEnabled(true)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className="relative h-7 w-12 rounded-full border border-[var(--color-border)] transition-colors"
      style={{ background: enabled ? 'var(--color-brand)' : 'rgba(255,255,255,0.06)' }}
      aria-label={enabled ? 'Disable push notifications' : 'Enable push notifications'}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
        style={{ left: enabled ? '22px' : '3px' }}
      />
    </button>
  )
}
