'use client'

// Handles web push notification permission + subscription.
// Renders a small "Enable Notifications" banner when not yet subscribed.
// Safe to mount everywhere — no-ops on unsupported browsers.

import { useEffect, useState, useTransition } from 'react'
import { Bell, BellOff, X } from 'lucide-react'
import { subscribePush, unsubscribePush } from '../../lib/actions/push'

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

type State = 'loading' | 'unsupported' | 'denied' | 'prompt' | 'subscribed'

export function PushNotificationSetup() {
  const [state, setState] = useState<State>('loading')
  const [dismissed, setDismissed] = useState(false)
  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null)
  const [pending, start] = useTransition()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported')
      return
    }

    const perm = Notification.permission
    if (perm === 'denied') { setState('denied'); return }

    // Check if already subscribed
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        if (sub) {
          setCurrentEndpoint(sub.endpoint)
          setState('subscribed')
        } else {
          setState(perm === 'granted' ? 'prompt' : 'prompt')
        }
      })
    }).catch(() => setState('prompt'))

    // Register service worker
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }, [])

  function handleEnable() {
    start(async () => {
      try {
        const perm = await Notification.requestPermission()
        if (perm !== 'granted') { setState('denied'); return }

        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
        })

        const json = sub.toJSON() as {
          endpoint: string
          keys: { p256dh: string; auth: string }
        }

        await subscribePush(json)
        setCurrentEndpoint(json.endpoint)
        setState('subscribed')
      } catch {
        setState('prompt')
      }
    })
  }

  function handleDisable() {
    start(async () => {
      try {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.getSubscription()
        if (sub) {
          await sub.unsubscribe()
          if (currentEndpoint) await unsubscribePush(currentEndpoint)
        }
        setState('prompt')
        setCurrentEndpoint(null)
      } catch {
        // ignore
      }
    })
  }

  // Don't render anything for unsupported or while loading
  if (state === 'loading' || state === 'unsupported') return null

  // Already subscribed — show a small indicator (can be tapped to disable)
  if (state === 'subscribed') {
    return (
      <button
        onClick={handleDisable}
        disabled={pending}
        className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/60 transition"
        title="Notifications on — tap to disable"
      >
        <Bell className="w-3.5 h-3.5 text-emerald-400" />
        <span>Notifications on</span>
      </button>
    )
  }

  // Denied — can't ask again
  if (state === 'denied') {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-white/30">
        <BellOff className="w-3.5 h-3.5" />
        <span>Notifications blocked in browser settings</span>
      </div>
    )
  }

  // Prompt state — show enable banner (dismissable)
  if (dismissed) return null

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 bg-white/[0.04] border border-white/10">
      <div className="flex items-center gap-2.5 min-w-0">
        <Bell className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
        <p className="text-[12.5px] text-white/80 leading-snug">
          Get notified when your workout drops every morning
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleEnable}
          disabled={pending}
          className="px-3 py-1 rounded-full brand-gradient text-white text-[11px] font-bold disabled:opacity-50 whitespace-nowrap"
        >
          {pending ? '...' : 'Enable'}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/30 hover:text-white/60 transition"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
