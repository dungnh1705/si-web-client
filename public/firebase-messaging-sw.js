self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-react-app-cache').then(cache => {
      return cache.addAll(['/index.html', '/offline.html'])
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})

// event nhận notification
self.addEventListener('push', event => {
  const data = event.data.json()

  const options = {
    body: data.notification?.body
  }
  const title = data.notification?.title

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  // Add custom logic for notification click event
  console.log('Notification clicked:', event)
})
