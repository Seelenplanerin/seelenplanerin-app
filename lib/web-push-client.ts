/**
 * Web Push Client-Logik
 * Registriert den Service Worker und verwaltet Push-Subscriptions
 */
import { Platform } from "react-native";

// VAPID Public Key (muss mit dem Server-Key übereinstimmen)
const VAPID_PUBLIC_KEY = "BE8kb2r3dwQ4qM0scx3L8JjuBc69D3iH88WKSAQxWz3NsMTUQSypeIl-xyZQW5B3_GWdy11ImHrUcMkPE0Tg6Mw";

/**
 * Prüft ob Web Push unterstützt wird
 */
export function isWebPushSupported(): boolean {
  if (Platform.OS !== "web") return false;
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

/**
 * Registriert den Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isWebPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    console.log("[SW] Service Worker registriert:", registration.scope);
    return registration;
  } catch (error) {
    console.error("[SW] Service Worker Registrierung fehlgeschlagen:", error);
    return null;
  }
}

/**
 * Fragt die Berechtigung für Push-Nachrichten an
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isWebPushSupported()) return "denied";
  return await Notification.requestPermission();
}

/**
 * Holt die aktuelle Push-Subscription oder erstellt eine neue
 */
export async function subscribeToPush(registration: ServiceWorkerRegistration): Promise<PushSubscription | null> {
  try {
    // Prüfe ob bereits eine Subscription existiert
    let subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      console.log("[Push] Bestehende Subscription gefunden");
      return subscription;
    }

    // Neue Subscription erstellen
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log("[Push] Neue Subscription erstellt");
    return subscription;
  } catch (error) {
    console.error("[Push] Subscription fehlgeschlagen:", error);
    return null;
  }
}

/**
 * Sendet die Push-Subscription an den Server
 */
export async function sendSubscriptionToServer(
  subscription: PushSubscription,
  apiBaseUrl: string
): Promise<boolean> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/web-push/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
      }),
    });
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("[Push] Subscription an Server senden fehlgeschlagen:", error);
    return false;
  }
}

/**
 * Kompletter Flow: Service Worker registrieren → Berechtigung anfragen → Subscription erstellen → an Server senden
 */
export async function initWebPush(apiBaseUrl: string): Promise<{ success: boolean; error?: string }> {
  if (!isWebPushSupported()) {
    return { success: false, error: "Web Push wird auf diesem Gerät nicht unterstützt" };
  }

  // 1. Service Worker registrieren
  const registration = await registerServiceWorker();
  if (!registration) {
    return { success: false, error: "Service Worker konnte nicht registriert werden" };
  }

  // 2. Berechtigung anfragen
  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    return { success: false, error: "Push-Benachrichtigungen wurden nicht erlaubt" };
  }

  // 3. Subscription erstellen
  const subscription = await subscribeToPush(registration);
  if (!subscription) {
    return { success: false, error: "Push-Subscription konnte nicht erstellt werden" };
  }

  // 4. An Server senden
  const sent = await sendSubscriptionToServer(subscription, apiBaseUrl);
  if (!sent) {
    return { success: false, error: "Subscription konnte nicht an den Server gesendet werden" };
  }

  return { success: true };
}

/**
 * Prüft ob Push-Nachrichten bereits aktiviert sind
 */
export async function isPushEnabled(): Promise<boolean> {
  if (!isWebPushSupported()) return false;
  
  const permission = Notification.permission;
  if (permission !== "granted") return false;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return subscription !== null;
}

/**
 * Konvertiert einen Base64-URL-String in ein Uint8Array (für VAPID Key)
 */
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}
