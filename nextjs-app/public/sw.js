// WorkoutPartna Service Worker — handles web push notifications.
// Registered by PushNotificationSetup.tsx.

self.addEventListener('push', event => {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'WorkoutPartna', {
      body: data.body ?? '',
      icon: data.icon ?? '/logo-square-1024.png',
      badge: '/logo-square-1024.png',
      tag: data.tag ?? 'workoutpartna',
      renotify: true,
      data: { url: data.url ?? '/app/messages' },
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/app/messages'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Focus existing tab if open, otherwise open new one
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      return clients.openWindow(url)
    })
  )
})
