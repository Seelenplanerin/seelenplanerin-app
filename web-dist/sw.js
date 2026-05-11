/**
 * Service Worker für Die Seelenplanerin PWA
 * - Push-Nachrichten empfangen und anzeigen
 * - Basis-Caching für Offline-Nutzung
 */

const CACHE_NAME = "seelenplanerin-v1";

// Install: Cache grundlegende Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/manifest.json",
        "/icon-192.png",
        "/icon-512.png",
      ]);
    })
  );
  self.skipWaiting();
});

// Activate: Alte Caches löschen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first mit Cache-Fallback
self.addEventListener("fetch", (event) => {
  // Nur GET-Requests cachen
  if (event.request.method !== "GET") return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Erfolgreiche Antwort cachen
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Bei Netzwerkfehler: aus Cache laden
        return caches.match(event.request);
      })
  );
});

// Push-Nachricht empfangen
self.addEventListener("push", (event) => {
  let data = { title: "Die Seelenplanerin", body: "Du hast eine neue Nachricht" };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      { action: "open", title: "Öffnen" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Klick auf Push-Nachricht
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Wenn die App bereits offen ist, fokussieren
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // Sonst neues Fenster öffnen
      return self.clients.openWindow(urlToOpen);
    })
  );
});
