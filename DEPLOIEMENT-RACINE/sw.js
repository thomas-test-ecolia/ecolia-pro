// Service worker du CRM : affiche les notifications push (aucune mise en cache : le CRM est toujours à jour)
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

self.addEventListener('push', e => {
  let d = {}
  try { d = e.data ? e.data.json() : {} } catch (_) { d = { body: e.data ? e.data.text() : '' } }
  e.waitUntil(self.registration.showNotification(d.title || 'CRM Accompagnement', {
    body: d.body || '',
    icon: 'logo-192.png',
    badge: 'logo-192.png',
    tag: d.tag || undefined,
    data: { url: d.url || './' },
  }))
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus() }
    return self.clients.openWindow(url)
  }))
})
