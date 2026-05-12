/**
 * Service Worker für Die Seelenplanerin PWA
 * - Push-Nachrichten empfangen und anzeigen
 * - Klick auf Notification öffnet Nachrichten-Screen mit Inhalt
 * - Basis-Caching für Offline-Nutzung
 * Version: 3 (Nachrichten-Screen Integration)
 */

const CACHE_NAME = "seelenplanerin-v3";
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
  self.clients.claim();
});

// Fetch: Network-first mit Cache-Fallback
self.addEventListener("fetch", (event) => {
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
    // Speichere title + body für den Klick-Handler
    data: {
      title: data.title || "Die Seelenplanerin",
      body: data.body || "",
      url: data.url || APP_URL,
    },
    // Notification zusammenfassen wenn mehrere kommen
    tag: "seelenplanerin-" + Date.now(),
    renotify: true,
    // Notification bleibt sichtbar bis der User sie antippt
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Klick auf Push-Nachricht - Nachrichten-Screen öffnen mit Inhalt
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Nachricht-Daten aus der Notification holen
  const notifData = event.notification.data || {};
  const title = encodeURIComponent(notifData.title || "Die Seelenplanerin");
  const body = encodeURIComponent(notifData.body || "");

  // URL zum Nachrichten-Screen mit Titel und Text als Parameter
  const targetUrl = APP_URL + "/nachrichten?title=" + title + "&body=" + body;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Prüfen ob die App bereits offen ist
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus().then((focusedClient) => {
            if (focusedClient && "navigate" in focusedClient) {
              return focusedClient.navigate(targetUrl);
            }
            return focusedClient;
          });
        }
      }
      // App nicht offen - neues Fenster öffnen
      return self.clients.openWindow(targetUrl);
    })
  );
});
