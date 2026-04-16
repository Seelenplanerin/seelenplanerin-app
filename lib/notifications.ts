/**
 * Benachrichtigungen – Push-Token-Registrierung & lokale Notifications
 * 
 * Exportiert alle Funktionen, die in _layout.tsx und benachrichtigungen.tsx verwendet werden:
 * - initNotificationHandler: Setzt den Notification-Handler für Foreground-Notifications
 * - setupAndroidChannel: Erstellt den Android-Notification-Channel
 * - registerPushTokenWithServer: Registriert den Expo Push Token beim Server
 * - NotificationSettings, DEFAULT_SETTINGS, loadSettings, saveSettings
 * - requestNotificationPermissions, hasNotificationPermissions
 * - scheduleAllNotifications, cancelAllNotifications, getScheduledCount
 * - getUpcomingEvents, formatDateDE
 */
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "@/constants/oauth";

// Lazy-load expo-notifications to avoid crash on web
let Notifications: typeof import("expo-notifications") | null = null;

async function getNotifications() {
  if (!Notifications) {
    try {
      Notifications = await import("expo-notifications");
    } catch {
      return null;
    }
  }
  return Notifications;
}

// ── Notification Handler (Foreground) ──

export function initNotificationHandler() {
  if (Platform.OS === "web") return;
  getNotifications().then((N) => {
    if (!N) return;
    N.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  });
}

// ── Android Channel ──

export async function setupAndroidChannel() {
  if (Platform.OS !== "android") return;
  const N = await getNotifications();
  if (!N) return;
  await N.setNotificationChannelAsync("default", {
    name: "Seelenplanerin",
    importance: N.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#C9A96E",
  });
  await N.setNotificationChannelAsync("rituals", {
    name: "Ritual-Erinnerungen",
    importance: N.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#C4826A",
  });
}

// ── Push Token Registration ──

export async function registerPushTokenWithServer(): Promise<void> {
  if (Platform.OS === "web") return;
  
  const N = await getNotifications();
  if (!N) return;

  try {
    // Berechtigungen prüfen
    const { status: existingStatus } = await N.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await N.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("[Push] Keine Berechtigung für Push-Nachrichten");
      return;
    }

    // Expo Push Token holen
    let token: string;
    try {
      // Try with projectId from Constants
      const Constants = (await import("expo-constants")).default;
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? 
        (Constants as any)?.easConfig?.projectId;
      
      if (projectId) {
        const tokenData = await N.getExpoPushTokenAsync({ projectId });
        token = tokenData.data;
      } else {
        // Fallback without projectId (works in Expo Go)
        const tokenData = await N.getExpoPushTokenAsync();
        token = tokenData.data;
      }
    } catch (e) {
      console.warn("[Push] Token konnte nicht geholt werden:", e);
      return;
    }

    if (!token) return;
    console.log("[Push] Token erhalten:", token.substring(0, 20) + "...");

    // Token beim Server registrieren via tRPC
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/trpc/push.registerToken`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        json: {
          token,
          platform: Platform.OS,
        },
      }),
    });

    if (response.ok) {
      console.log("[Push] Token erfolgreich beim Server registriert");
    } else {
      console.warn("[Push] Token-Registrierung fehlgeschlagen:", response.status);
    }
  } catch (e) {
    console.warn("[Push] Fehler bei Token-Registrierung:", e);
  }
}

// ── Notification Settings (lokale Erinnerungen) ──

export interface NotificationSettings {
  enabled: boolean;
  vollmondReminder: boolean;
  neumondReminder: boolean;
  jahreskreisReminder: boolean;
  morgenimpuls: boolean;
  morgenimpulsZeit: { hour: number; minute: number };
}

export const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  vollmondReminder: true,
  neumondReminder: true,
  jahreskreisReminder: true,
  morgenimpuls: false,
  morgenimpulsZeit: { hour: 7, minute: 0 },
};

const SETTINGS_KEY = "seelenplanerin_notification_settings";

export async function loadSettings(): Promise<NotificationSettings> {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);
    if (json) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(json) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: NotificationSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

// ── Permissions ──

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const N = await getNotifications();
  if (!N) return false;
  const { status } = await N.requestPermissionsAsync();
  return status === "granted";
}

export async function hasNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const N = await getNotifications();
  if (!N) return false;
  const { status } = await N.getPermissionsAsync();
  return status === "granted";
}

// ── Astronomische Daten 2025-2027 ──

interface MoonEvent {
  date: string; // YYYY-MM-DD
  title: string;
  type: "vollmond" | "neumond" | "jahreskreis";
}

const MOON_EVENTS: MoonEvent[] = [
  // Vollmonde 2025-2026
  { date: "2025-01-13", title: "Wolfsmond (Vollmond)", type: "vollmond" },
  { date: "2025-02-12", title: "Schneemond (Vollmond)", type: "vollmond" },
  { date: "2025-03-14", title: "Wurmmond (Vollmond)", type: "vollmond" },
  { date: "2025-04-13", title: "Rosa Mond (Vollmond)", type: "vollmond" },
  { date: "2025-05-12", title: "Blumenmond (Vollmond)", type: "vollmond" },
  { date: "2025-06-11", title: "Erdbeermond (Vollmond)", type: "vollmond" },
  { date: "2025-07-10", title: "Bockmond (Vollmond)", type: "vollmond" },
  { date: "2025-08-09", title: "Störmond (Vollmond)", type: "vollmond" },
  { date: "2025-09-07", title: "Erntemond (Vollmond)", type: "vollmond" },
  { date: "2025-10-07", title: "Jägermond (Vollmond)", type: "vollmond" },
  { date: "2025-11-05", title: "Bibermond (Vollmond)", type: "vollmond" },
  { date: "2025-12-04", title: "Kalter Mond (Vollmond)", type: "vollmond" },
  { date: "2026-01-03", title: "Wolfsmond (Vollmond)", type: "vollmond" },
  { date: "2026-02-01", title: "Schneemond (Vollmond)", type: "vollmond" },
  { date: "2026-03-03", title: "Wurmmond (Vollmond)", type: "vollmond" },
  { date: "2026-04-01", title: "Rosa Mond (Vollmond)", type: "vollmond" },
  { date: "2026-05-01", title: "Blumenmond (Vollmond)", type: "vollmond" },
  { date: "2026-05-31", title: "Erdbeermond (Vollmond)", type: "vollmond" },
  { date: "2026-06-29", title: "Bockmond (Vollmond)", type: "vollmond" },
  { date: "2026-07-29", title: "Störmond (Vollmond)", type: "vollmond" },
  { date: "2026-08-28", title: "Erntemond (Vollmond)", type: "vollmond" },
  { date: "2026-09-26", title: "Jägermond (Vollmond)", type: "vollmond" },
  { date: "2026-10-26", title: "Bibermond (Vollmond)", type: "vollmond" },
  { date: "2026-11-24", title: "Kalter Mond (Vollmond)", type: "vollmond" },
  { date: "2026-12-24", title: "Langmond (Vollmond)", type: "vollmond" },
  // Neumonde 2025-2026
  { date: "2025-01-29", title: "Neumond", type: "neumond" },
  { date: "2025-02-28", title: "Neumond", type: "neumond" },
  { date: "2025-03-29", title: "Neumond", type: "neumond" },
  { date: "2025-04-27", title: "Neumond", type: "neumond" },
  { date: "2025-05-27", title: "Neumond", type: "neumond" },
  { date: "2025-06-25", title: "Neumond", type: "neumond" },
  { date: "2025-07-24", title: "Neumond", type: "neumond" },
  { date: "2025-08-23", title: "Neumond", type: "neumond" },
  { date: "2025-09-21", title: "Neumond", type: "neumond" },
  { date: "2025-10-21", title: "Neumond", type: "neumond" },
  { date: "2025-11-20", title: "Neumond", type: "neumond" },
  { date: "2025-12-20", title: "Neumond", type: "neumond" },
  { date: "2026-01-18", title: "Neumond", type: "neumond" },
  { date: "2026-02-17", title: "Neumond", type: "neumond" },
  { date: "2026-03-19", title: "Neumond", type: "neumond" },
  { date: "2026-04-17", title: "Neumond", type: "neumond" },
  { date: "2026-05-16", title: "Neumond", type: "neumond" },
  { date: "2026-06-15", title: "Neumond", type: "neumond" },
  { date: "2026-07-14", title: "Neumond", type: "neumond" },
  { date: "2026-08-13", title: "Neumond", type: "neumond" },
  { date: "2026-09-11", title: "Neumond", type: "neumond" },
  { date: "2026-10-11", title: "Neumond", type: "neumond" },
  { date: "2026-11-09", title: "Neumond", type: "neumond" },
  { date: "2026-12-09", title: "Neumond", type: "neumond" },
  // Jahreskreisfeste
  { date: "2025-02-01", title: "Imbolc – Lichtmess", type: "jahreskreis" },
  { date: "2025-03-20", title: "Ostara – Frühlingsäquinoktium", type: "jahreskreis" },
  { date: "2025-05-01", title: "Beltane – Walpurgisnacht", type: "jahreskreis" },
  { date: "2025-06-21", title: "Litha – Sommersonnenwende", type: "jahreskreis" },
  { date: "2025-08-01", title: "Lughnasadh – Schnitterfest", type: "jahreskreis" },
  { date: "2025-09-22", title: "Mabon – Herbstäquinoktium", type: "jahreskreis" },
  { date: "2025-10-31", title: "Samhain – Ahnenfest", type: "jahreskreis" },
  { date: "2025-12-21", title: "Yule – Wintersonnenwende", type: "jahreskreis" },
  { date: "2026-02-01", title: "Imbolc – Lichtmess", type: "jahreskreis" },
  { date: "2026-03-20", title: "Ostara – Frühlingsäquinoktium", type: "jahreskreis" },
  { date: "2026-05-01", title: "Beltane – Walpurgisnacht", type: "jahreskreis" },
  { date: "2026-06-21", title: "Litha – Sommersonnenwende", type: "jahreskreis" },
  { date: "2026-08-01", title: "Lughnasadh – Schnitterfest", type: "jahreskreis" },
  { date: "2026-09-23", title: "Mabon – Herbstäquinoktium", type: "jahreskreis" },
  { date: "2026-10-31", title: "Samhain – Ahnenfest", type: "jahreskreis" },
  { date: "2026-12-21", title: "Yule – Wintersonnenwende", type: "jahreskreis" },
];

// ── Scheduling ──

export async function scheduleAllNotifications(): Promise<number> {
  if (Platform.OS === "web") return 0;
  const N = await getNotifications();
  if (!N) return 0;

  // Alle bestehenden Benachrichtigungen löschen
  await N.cancelAllScheduledNotificationsAsync();

  const settings = await loadSettings();
  if (!settings.enabled) return 0;

  const now = new Date();
  let scheduled = 0;

  for (const event of MOON_EVENTS) {
    const eventDate = new Date(event.date + "T00:00:00");
    
    // Nur zukünftige Events
    if (eventDate < now) continue;

    // Filter nach Einstellungen
    if (event.type === "vollmond" && !settings.vollmondReminder) continue;
    if (event.type === "neumond" && !settings.neumondReminder) continue;
    if (event.type === "jahreskreis" && !settings.jahreskreisReminder) continue;

    // Erinnerung am Vortag um 19:00
    const dayBefore = new Date(eventDate);
    dayBefore.setDate(dayBefore.getDate() - 1);
    dayBefore.setHours(19, 0, 0, 0);
    if (dayBefore > now) {
      try {
        await N.scheduleNotificationAsync({
          content: {
            title: `Morgen: ${event.title}`,
            body: "Bereite deinen heiligen Raum vor und stimme dich auf das Ritual ein 🌙",
            data: { type: event.type, date: event.date },
          },
          trigger: { type: "date" as any, date: dayBefore },
        });
        scheduled++;
      } catch {}
    }

    // Erinnerung am Tag um 8:00
    const dayOf = new Date(eventDate);
    dayOf.setHours(8, 0, 0, 0);
    if (dayOf > now) {
      try {
        await N.scheduleNotificationAsync({
          content: {
            title: event.title,
            body: "Heute ist ein besonderer Tag. Öffne die App für dein Ritual ✨",
            data: { type: event.type, date: event.date },
          },
          trigger: { type: "date" as any, date: dayOf },
        });
        scheduled++;
      } catch {}
    }
  }

  // Morgenimpuls (täglich)
  if (settings.morgenimpuls) {
    try {
      await N.scheduleNotificationAsync({
        content: {
          title: "Guten Morgen, Seelenkind ✨",
          body: "Dein täglicher Seelenimpuls wartet auf dich.",
          data: { type: "morgenimpuls" },
        },
        trigger: {
          type: "daily" as any,
          hour: settings.morgenimpulsZeit.hour,
          minute: settings.morgenimpulsZeit.minute,
          repeats: true,
        },
      });
      scheduled++;
    } catch {}
  }

  return scheduled;
}

export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === "web") return;
  const N = await getNotifications();
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledCount(): Promise<number> {
  if (Platform.OS === "web") return 0;
  const N = await getNotifications();
  if (!N) return 0;
  const all = await N.getAllScheduledNotificationsAsync();
  return all.length;
}

// ── Upcoming Events ──

export function getUpcomingEvents(count: number = 8): Array<{ date: string; title: string; type: string }> {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  
  return MOON_EVENTS
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count)
    .map((e) => ({ date: e.date, title: e.title, type: e.type }));
}

// ── Formatierung ──

const MONATE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];
const WOCHENTAGE = [
  "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag",
];

export function formatDateDE(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${WOCHENTAGE[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]} ${d.getFullYear()}`;
}
