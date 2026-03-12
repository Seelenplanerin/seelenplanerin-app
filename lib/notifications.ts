/**
 * Notification-Service für Die Seelenplanerin
 * Verwaltet lokale Push-Benachrichtigungen für:
 * - Vollmond-Rituale (1 Tag vorher + am Tag)
 * - Neumond-Rituale (1 Tag vorher + am Tag)
 * - Jahreskreisfeste (1 Tag vorher + am Tag)
 * - Tägliche Morgen-Erinnerung (optional)
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { getApiBaseUrl } from "@/constants/oauth";

// ═══════════════════════════════════════════════════════════════
// STORAGE KEYS
// ═══════════════════════════════════════════════════════════════
const STORAGE_KEY_SETTINGS = "seelenplanerin_notification_settings";
const STORAGE_KEY_SCHEDULED = "seelenplanerin_scheduled_notifications";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
export interface NotificationSettings {
  enabled: boolean;
  vollmondReminder: boolean;
  neumondReminder: boolean;
  jahreskreisReminder: boolean;
  morgenimpuls: boolean;
  morgenimpulsZeit: { hour: number; minute: number }; // Default 7:00
}

export const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  vollmondReminder: true,
  neumondReminder: true,
  jahreskreisReminder: true,
  morgenimpuls: false,
  morgenimpulsZeit: { hour: 7, minute: 0 },
};

// ═══════════════════════════════════════════════════════════════
// ASTRONOMISCHE DATEN 2026 (MEZ-Kalendertage)
// ═══════════════════════════════════════════════════════════════

interface MondEvent {
  date: string; // "YYYY-MM-DD" (MEZ Kalendertag)
  type: "vollmond" | "neumond";
  title: string;
  body: string;
  bodyVortag: string;
}

interface JahreskreisEvent {
  date: string; // "YYYY-MM-DD"
  name: string;
  title: string;
  body: string;
  bodyVortag: string;
}

const VOLLMONDE_2026: MondEvent[] = [
  { date: "2026-01-03", type: "vollmond", title: "Vollmond im Krebs", body: "Heute ist Vollmond – Zeit für Dankbarkeit und Loslassen. Dein Ritual wartet auf dich.", bodyVortag: "Morgen ist Vollmond – bereite dich auf dein Ritual vor." },
  { date: "2026-02-01", type: "vollmond", title: "Vollmond im Löwen", body: "Heute ist Vollmond – lass dein inneres Licht strahlen. Dein Ritual wartet.", bodyVortag: "Morgen ist Vollmond – bereite deinen heiligen Raum vor." },
  { date: "2026-03-03", type: "vollmond", title: "Vollmond in der Jungfrau", body: "Heute ist Vollmond – Zeit für Ordnung und Klarheit. Dein Ritual wartet.", bodyVortag: "Morgen ist Vollmond – dein Ritual wartet auf dich." },
  { date: "2026-04-02", type: "vollmond", title: "Vollmond in der Waage", body: "Heute ist Vollmond – finde Balance und Harmonie. Dein Ritual wartet.", bodyVortag: "Morgen ist Vollmond – bereite dich auf dein Ritual vor." },
  { date: "2026-05-01", type: "vollmond", title: "Vollmond im Skorpion", body: "Heute ist Vollmond – tauche tief ein und transformiere. Dein Ritual wartet.", bodyVortag: "Morgen ist Vollmond – bereite deinen heiligen Raum vor." },
  { date: "2026-05-31", type: "vollmond", title: "Blue Moon im Schützen", body: "Heute ist Blue Moon – ein seltener zweiter Vollmond! Nutze diese besondere Energie.", bodyVortag: "Morgen ist Blue Moon – ein seltener zweiter Vollmond im Mai!" },
  { date: "2026-06-30", type: "vollmond", title: "Vollmond im Steinbock", body: "Heute ist Vollmond – setze Grenzen und feiere deine Stärke. Dein Ritual wartet.", bodyVortag: "Morgen ist Vollmond – bereite dich auf dein Ritual vor." },
  { date: "2026-07-29", type: "vollmond", title: "Vollmond im Wassermann", body: "Heute ist Vollmond – sei frei und authentisch. Dein Ritual wartet.", bodyVortag: "Morgen ist Vollmond – dein Ritual wartet auf dich." },
  { date: "2026-08-28", type: "vollmond", title: "Vollmond in den Fischen", body: "Heute ist Vollmond – vertraue deiner Intuition. Dein Ritual wartet.", bodyVortag: "Morgen ist Vollmond – bereite deinen heiligen Raum vor." },
  { date: "2026-09-26", type: "vollmond", title: "Vollmond im Widder", body: "Heute ist Vollmond – entfache dein inneres Feuer. Dein Ritual wartet.", bodyVortag: "Morgen ist Vollmond – bereite dich auf dein Ritual vor." },
  { date: "2026-10-26", type: "vollmond", title: "Vollmond im Stier", body: "Heute ist Vollmond – genieße und sei dankbar. Dein Ritual wartet.", bodyVortag: "Morgen ist Vollmond – dein Ritual wartet auf dich." },
  { date: "2026-11-24", type: "vollmond", title: "Vollmond in den Zwillingen", body: "Heute ist Vollmond – kommuniziere deine Wahrheit. Dein Ritual wartet.", bodyVortag: "Morgen ist Vollmond – bereite deinen heiligen Raum vor." },
  { date: "2026-12-24", type: "vollmond", title: "Vollmond im Krebs", body: "Heute ist Vollmond an Heiligabend – ein magischer Moment. Dein Ritual wartet.", bodyVortag: "Morgen ist Vollmond an Heiligabend – bereite dich auf diesen besonderen Moment vor." },
];

const NEUMONDE_2026: MondEvent[] = [
  { date: "2026-01-18", type: "neumond", title: "Neumond im Steinbock", body: "Heute ist Neumond – setze neue Intentionen. Was möchtest du manifestieren?", bodyVortag: "Morgen ist Neumond – bereite deine Wünsche und Intentionen vor." },
  { date: "2026-02-17", type: "neumond", title: "Neumond im Wassermann", body: "Heute ist Neumond – Zeit für frische Ideen und Visionen. Dein Ritual wartet.", bodyVortag: "Morgen ist Neumond – bereite dich auf neue Intentionen vor." },
  { date: "2026-03-19", type: "neumond", title: "Neumond in den Fischen", body: "Heute ist Neumond – vertraue deiner Intuition und träume groß.", bodyVortag: "Morgen ist Neumond – bereite deinen heiligen Raum vor." },
  { date: "2026-04-17", type: "neumond", title: "Neumond im Widder", body: "Heute ist Neumond – starte mutig in einen neuen Zyklus.", bodyVortag: "Morgen ist Neumond – bereite dich auf deinen Neuanfang vor." },
  { date: "2026-05-16", type: "neumond", title: "Neumond im Stier", body: "Heute ist Neumond – pflanze Samen für Fülle und Wohlstand.", bodyVortag: "Morgen ist Neumond – bereite deine Manifestations-Wünsche vor." },
  { date: "2026-06-15", type: "neumond", title: "Neumond in den Zwillingen", body: "Heute ist Neumond – kommuniziere deine Wünsche klar und deutlich.", bodyVortag: "Morgen ist Neumond – bereite dich auf neue Intentionen vor." },
  { date: "2026-07-14", type: "neumond", title: "Neumond im Krebs", body: "Heute ist Neumond – nähre deine Seele und setze Herzenswünsche.", bodyVortag: "Morgen ist Neumond – bereite deinen heiligen Raum vor." },
  { date: "2026-08-12", type: "neumond", title: "Neumond im Löwen", body: "Heute ist Neumond – lass dein Licht leuchten und setze mutige Intentionen.", bodyVortag: "Morgen ist Neumond – bereite dich auf leuchtende Intentionen vor." },
  { date: "2026-09-11", type: "neumond", title: "Neumond in der Jungfrau", body: "Heute ist Neumond – bringe Ordnung in dein Leben und setze klare Ziele.", bodyVortag: "Morgen ist Neumond – bereite deine Intentionen vor." },
  { date: "2026-10-10", type: "neumond", title: "Neumond in der Waage", body: "Heute ist Neumond – finde Balance und setze Intentionen für Harmonie.", bodyVortag: "Morgen ist Neumond – bereite dich auf harmonische Intentionen vor." },
  { date: "2026-11-09", type: "neumond", title: "Neumond im Skorpion", body: "Heute ist Neumond – tauche tief und transformiere dich.", bodyVortag: "Morgen ist Neumond – bereite dich auf tiefe Transformation vor." },
  { date: "2026-12-09", type: "neumond", title: "Neumond im Schützen", body: "Heute ist Neumond – setze Intentionen für Freiheit und Weisheit.", bodyVortag: "Morgen ist Neumond – bereite deine Wünsche für den letzten Neumond des Jahres vor." },
];

const JAHRESKREIS_2026: JahreskreisEvent[] = [
  { date: "2026-02-01", name: "Imbolc", title: "Imbolc – Lichtfest", body: "Heute ist Imbolc – feiere das zurückkehrende Licht und die Erneuerung.", bodyVortag: "Morgen ist Imbolc – bereite dich auf das Lichtfest vor." },
  { date: "2026-03-20", name: "Ostara", title: "Ostara – Frühlings-Tagundnachtgleiche", body: "Heute ist Ostara – feiere das Gleichgewicht und den Frühlingsbeginn.", bodyVortag: "Morgen ist Ostara – bereite dein Frühlings-Ritual vor." },
  { date: "2026-04-30", name: "Beltane", title: "Beltane – Fest des Feuers", body: "Heute ist Beltane – feiere die Lebenskraft und die Verbindung zur Natur.", bodyVortag: "Morgen ist Beltane – bereite dein Feuer-Ritual vor." },
  { date: "2026-06-21", name: "Litha", title: "Litha – Sommersonnenwende", body: "Heute ist Litha – der längste Tag des Jahres. Feiere das Licht in dir.", bodyVortag: "Morgen ist Sommersonnenwende – bereite dein Sonnen-Ritual vor." },
  { date: "2026-08-01", name: "Lughnasadh", title: "Lughnasadh – Erntefest", body: "Heute ist Lughnasadh – feiere die erste Ernte und sei dankbar.", bodyVortag: "Morgen ist Lughnasadh – bereite dein Ernte-Ritual vor." },
  { date: "2026-09-22", name: "Mabon", title: "Mabon – Herbst-Tagundnachtgleiche", body: "Heute ist Mabon – feiere das Gleichgewicht und die Fülle des Herbstes.", bodyVortag: "Morgen ist Mabon – bereite dein Herbst-Ritual vor." },
  { date: "2026-10-31", name: "Samhain", title: "Samhain – Ahnenfest", body: "Heute ist Samhain – ehre deine Ahnen und blicke nach innen.", bodyVortag: "Morgen ist Samhain – bereite deinen heiligen Raum für das Ahnenfest vor." },
  { date: "2026-12-21", name: "Yule", title: "Yule – Wintersonnenwende", body: "Heute ist Yule – die längste Nacht. Das Licht kehrt zurück.", bodyVortag: "Morgen ist Wintersonnenwende – bereite dein Yule-Ritual vor." },
];

// ═══════════════════════════════════════════════════════════════
// SETUP & PERMISSIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Initialisiert den Notification-Handler für Foreground-Benachrichtigungen.
 * Muss einmal beim App-Start aufgerufen werden.
 */
export function initNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    } as Notifications.NotificationBehavior),
  });
}

/**
 * Richtet den Android Notification Channel ein.
 */
export async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("ritual-reminders", {
      name: "Ritual-Erinnerungen",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#C4826A",
      description: "Erinnerungen für Vollmond, Neumond und Jahreskreisfeste",
    });

    await Notifications.setNotificationChannelAsync("morgenimpuls", {
      name: "Morgenimpuls",
      importance: Notifications.AndroidImportance.DEFAULT,
      description: "Täglicher spiritueller Morgenimpuls",
    });
  }
}

/**
 * Fragt Notification-Berechtigungen ab.
 * Gibt true zurück wenn Berechtigungen erteilt wurden.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

/**
 * Prüft ob Notification-Berechtigungen erteilt sind.
 */
export async function hasNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

// ═════════════════════════════// ═════════════════════════════════════════════════════════════════
// PUSH TOKEN REGISTRATION (Server-seitig)
// ═════════════════════════════════════════════════════════════════

const PUSH_TOKEN_KEY = "seelenplanerin_push_token";

/**
 * Registriert den Expo Push Token beim Server.
 * Wird beim App-Start aufgerufen, nachdem Berechtigungen erteilt wurden.
 */
export async function registerPushTokenWithServer(communityEmail?: string): Promise<string | null> {
  if (Platform.OS === "web") return null;

  try {
    // Berechtigungen prüfen
    const hasPerms = await hasNotificationPermissions();
    if (!hasPerms) {
      const granted = await requestNotificationPermissions();
      if (!granted) return null;
    }

    // Expo Push Token holen
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId || undefined,
    });
    const token = tokenData.data;

    if (!token) return null;

    // Prüfen ob Token schon registriert wurde
    const storedToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    if (storedToken === token && !communityEmail) {
      return token; // Bereits registriert
    }

    // Token an Server senden
    const API_URL = getApiBaseUrl();
    await fetch(`${API_URL}/api/trpc/push.registerToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        json: {
          token,
          platform: Platform.OS,
          communityEmail: communityEmail || undefined,
        },
      }),
    });

    // Token lokal speichern
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    return token;
  } catch (e) {
    console.warn("[Push] Token-Registrierung fehlgeschlagen:", e);
    return null;
  }
}

/**
 * Gibt den gespeicherten Push-Token zurück (oder null).
 */
export async function getStoredPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

// ════════════════════════════════
// SETTINGS MANAGEMENT// ═══════════════════════════════════════════════════════════════

export async function loadSettings(): Promise<NotificationSettings> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: NotificationSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

// ═══════════════════════════════════════════════════════════════
// SCHEDULING
// ═══════════════════════════════════════════════════════════════

/**
 * Löscht alle geplanten Benachrichtigungen.
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.removeItem(STORAGE_KEY_SCHEDULED);
}

/**
 * Erstellt ein Date-Objekt für einen bestimmten Tag und Uhrzeit (lokale Zeit).
 */
function createLocalDate(dateStr: string, hour: number, minute: number): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day, hour, minute, 0, 0);
  return d;
}

/**
 * Plant eine einzelne Benachrichtigung für ein bestimmtes Datum.
 */
async function scheduleNotificationForDate(
  title: string,
  body: string,
  date: Date,
  data: Record<string, unknown>,
  channelId: string = "ritual-reminders"
): Promise<string | null> {
  // Nicht in der Vergangenheit planen
  if (date.getTime() <= Date.now()) return null;

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: Platform.OS === "android" ? channelId : undefined,
      } as any,
    });
    return id;
  } catch (e) {
    console.warn("Notification scheduling failed:", e);
    return null;
  }
}

/**
 * Plant alle Ritual-Benachrichtigungen basierend auf den aktuellen Einstellungen.
 * Löscht zuerst alle bestehenden und plant dann neu.
 */
export async function scheduleAllNotifications(): Promise<number> {
  if (Platform.OS === "web") return 0;

  const settings = await loadSettings();
  if (!settings.enabled) {
    await cancelAllNotifications();
    return 0;
  }

  const hasPermission = await hasNotificationPermissions();
  if (!hasPermission) return 0;

  // Alle bestehenden löschen
  await cancelAllNotifications();

  let scheduledCount = 0;
  const now = new Date();

  // Vollmond-Erinnerungen
  if (settings.vollmondReminder) {
    for (const event of VOLLMONDE_2026) {
      // Vortag um 19:00
      const vortagDate = createLocalDate(event.date, 19, 0);
      vortagDate.setDate(vortagDate.getDate() - 1);
      if (vortagDate.getTime() > now.getTime()) {
        const id = await scheduleNotificationForDate(
          "🌕 " + event.title,
          event.bodyVortag,
          vortagDate,
          { type: "vollmond", screen: "rituale" }
        );
        if (id) scheduledCount++;
      }

      // Am Tag um 8:00
      const tagDate = createLocalDate(event.date, 8, 0);
      if (tagDate.getTime() > now.getTime()) {
        const id = await scheduleNotificationForDate(
          "🌕 " + event.title,
          event.body,
          tagDate,
          { type: "vollmond", screen: "rituale" }
        );
        if (id) scheduledCount++;
      }
    }
  }

  // Neumond-Erinnerungen
  if (settings.neumondReminder) {
    for (const event of NEUMONDE_2026) {
      // Vortag um 19:00
      const vortagDate = createLocalDate(event.date, 19, 0);
      vortagDate.setDate(vortagDate.getDate() - 1);
      if (vortagDate.getTime() > now.getTime()) {
        const id = await scheduleNotificationForDate(
          "🌑 " + event.title,
          event.bodyVortag,
          vortagDate,
          { type: "neumond", screen: "rituale" }
        );
        if (id) scheduledCount++;
      }

      // Am Tag um 8:00
      const tagDate = createLocalDate(event.date, 8, 0);
      if (tagDate.getTime() > now.getTime()) {
        const id = await scheduleNotificationForDate(
          "🌑 " + event.title,
          event.body,
          tagDate,
          { type: "neumond", screen: "rituale" }
        );
        if (id) scheduledCount++;
      }
    }
  }

  // Jahreskreisfest-Erinnerungen
  if (settings.jahreskreisReminder) {
    for (const event of JAHRESKREIS_2026) {
      // Vortag um 19:00
      const vortagDate = createLocalDate(event.date, 19, 0);
      vortagDate.setDate(vortagDate.getDate() - 1);
      if (vortagDate.getTime() > now.getTime()) {
        const id = await scheduleNotificationForDate(
          "🌿 " + event.title,
          event.bodyVortag,
          vortagDate,
          { type: "jahreskreis", name: event.name, screen: "rituale" }
        );
        if (id) scheduledCount++;
      }

      // Am Tag um 8:00
      const tagDate = createLocalDate(event.date, 8, 0);
      if (tagDate.getTime() > now.getTime()) {
        const id = await scheduleNotificationForDate(
          "🌿 " + event.title,
          event.body,
          tagDate,
          { type: "jahreskreis", name: event.name, screen: "rituale" }
        );
        if (id) scheduledCount++;
      }
    }
  }

  // Morgenimpuls (täglich wiederkehrend)
  if (settings.morgenimpuls) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "✨ Dein Morgenimpuls",
          body: "Guten Morgen, schöne Seele. Dein Tagesimpuls wartet auf dich.",
          data: { type: "morgenimpuls", screen: "index" },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: settings.morgenimpulsZeit.hour,
          minute: settings.morgenimpulsZeit.minute,
          channelId: Platform.OS === "android" ? "morgenimpuls" : undefined,
        } as any,
      });
      scheduledCount++;
    } catch (e) {
      console.warn("Daily notification scheduling failed:", e);
    }
  }

  // Speichere Anzahl geplanter Benachrichtigungen
  await AsyncStorage.setItem(STORAGE_KEY_SCHEDULED, JSON.stringify({
    count: scheduledCount,
    lastScheduled: new Date().toISOString(),
  }));

  return scheduledCount;
}

/**
 * Gibt die Anzahl der aktuell geplanten Benachrichtigungen zurück.
 */
export async function getScheduledCount(): Promise<number> {
  if (Platform.OS === "web") return 0;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.length;
  } catch {
    return 0;
  }
}

/**
 * Gibt die nächsten geplanten Events zurück (für UI-Anzeige).
 */
export function getUpcomingEvents(limit: number = 5): Array<{ date: string; title: string; type: string }> {
  const now = new Date();
  const nowStr = now.toISOString().split("T")[0];

  const allEvents: Array<{ date: string; title: string; type: string }> = [];

  for (const e of VOLLMONDE_2026) {
    if (e.date >= nowStr) {
      allEvents.push({ date: e.date, title: e.title, type: "vollmond" });
    }
  }
  for (const e of NEUMONDE_2026) {
    if (e.date >= nowStr) {
      allEvents.push({ date: e.date, title: e.title, type: "neumond" });
    }
  }
  for (const e of JAHRESKREIS_2026) {
    if (e.date >= nowStr) {
      allEvents.push({ date: e.date, title: e.title, type: "jahreskreis" });
    }
  }

  allEvents.sort((a, b) => a.date.localeCompare(b.date));
  return allEvents.slice(0, limit);
}

/**
 * Formatiert ein Datum-String "YYYY-MM-DD" ins deutsche Format.
 */
export function formatDateDE(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  return `${day}. ${months[month - 1]} ${year}`;
}
