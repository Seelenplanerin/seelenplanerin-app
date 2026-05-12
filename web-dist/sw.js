/**
 * Service Worker für Die Seelenplanerin PWA
 * - Push-Nachrichten empfangen und anzeigen
 * - Klick auf Notification öffnet die App
 * - Basis-Caching für Offline-Nutzung
 * Version: 2 (Cache-Update erzwingt neuen SW)
 */

const CACHE_NAME = "seelenplanerin-v2";
const APP_URL = "https://www.app.dieseelenplanerin.de";

// Install: Cache grundlegende Assets + sofort aktivieren
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
  // Sofort den neuen Service Worker aktivieren
  self.skipWaiting();
});

// Activate: Alte Caches löschen + sofort übernehmen
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
  // Sofort alle Clients übernehmen (ohne Reload)
  self.clients.claim();
});

// Fetch: Network-first mit Cache-Fallback
self.addEventListener("fetch", (event) => {
  // Nur GET-Requests cachen
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Push-Nachricht empfangen und anzeigen
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
    // URL zum Öffnen beim Klick - vollständige URL verwenden
    data: {
      url: data.url || data.data?.url || APP_URL,
    },
    // Notification zusammenfassen wenn mehrere kommen
    tag: "seelenplanerin-notification",
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Klick auf Push-Nachricht - App öffnen oder fokussieren
self.addEventListener("notificationclick", (event) => {
  // Notification schließen
  event.notification.close();

  // Ziel-URL bestimmen (immer absolute URL)
  let targetUrl = event.notification.data?.url || APP_URL;
  
  // Relative URLs in absolute umwandeln
  if (targetUrl.startsWith("/")) {
    targetUrl = APP_URL + targetUrl;
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Prüfen ob die App bereits in einem Tab/Fenster offen ist
      for (const client of clientList) {
        if ("focus" in client) {
          // App ist bereits offen - fokussieren und navigieren
          return client.focus().then((focusedClient) => {
            if (focusedClient && "navigate" in focusedClient) {
              return focusedClient.navigate(targetUrl);
            }
            return focusedClient;
          });
        }
      }
      // App ist nicht offen - neues Fenster/Tab öffnen
      return self.clients.openWindow(targetUrl);
    })
  );
});
