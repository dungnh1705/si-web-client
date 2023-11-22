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

self.addEventListener('push', event => {
  const options = {
    body: event.data.text()
  }

  const data = event.data.json()

  event.waitUntil(self.registration.showNotification(data?.title, options))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  // Add custom logic for notification click event
  console.log('Notification clicked:', event)
})
