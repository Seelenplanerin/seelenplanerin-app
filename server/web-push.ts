/**
 * Web Push Server-Logik
 * Verwaltet Web-Push-Subscriptions und sendet Push-Nachrichten an Web-Clients
 */
import webpush from "web-push";
import * as database from "./db";

// VAPID Keys
const VAPID_PUBLIC_KEY = "BE8kb2r3dwQ4qM0scx3L8JjuBc69D3iH88WKSAQxWz3NsMTUQSypeIl-xyZQW5B3_GWdy11ImHrUcMkPE0Tg6Mw";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "rfzsuBI4eHdhDyMrKEPcp-xm-vif4w5D5QeGBP6Cx0Q";

// Web Push konfigurieren
webpush.setVapidDetails(
  "mailto:hallo@seelenplanerin.de",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export interface WebPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Sendet eine Push-Nachricht an eine einzelne Web-Push-Subscription
 */
export async function sendWebPush(
  subscription: WebPushSubscription,
  payload: { title: string; body: string; data?: Record<string, unknown> }
): Promise<boolean> {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      JSON.stringify(payload)
    );
    return true;
  } catch (error: any) {
    // 410 Gone oder 404 = Subscription ist ungültig
    if (error.statusCode === 410 || error.statusCode === 404) {
      console.log("[WebPush] Subscription ungültig, wird entfernt:", subscription.endpoint.slice(0, 50));
      return false;
    }
    console.error("[WebPush] Fehler beim Senden:", error.message);
    return false;
  }
}

/**
 * Sendet eine Push-Nachricht an alle aktiven Web-Push-Subscriptions
 */
export async function sendWebPushToAll(
  payload: { title: string; body: string; data?: Record<string, unknown> }
): Promise<{ sent: number; failed: number }> {
  const subscriptions = await database.getAllWebPushSubscriptions();
  let sent = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    try {
      const subscription: WebPushSubscription = JSON.parse(sub.subscription);
      const success = await sendWebPush(subscription, payload);
      if (success) {
        sent++;
      } else {
        failed++;
        // Ungültige Subscription deaktivieren
        await database.deactivateWebPushSubscription(sub.id);
      }
    } catch (e) {
      failed++;
    }
  }

  return { sent, failed };
}

export { VAPID_PUBLIC_KEY };
