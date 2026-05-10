/**
 * Portaltage 2026 – Maya-Kalender Portal-Tage
 * Push-Benachrichtigung mit Mini-Tipps an Portaltagen.
 * 
 * Quelle: 260-Tage-Zyklus (Tzolk'in) / Dreamspell-Kalender
 */

import { getAllActivePushTokens, createPushMessage, updatePushMessage, deactivatePushToken } from "./db";

// Portaltage 2026 als Set für schnellen Lookup
// Format: "YYYY-MM-DD"
const PORTALTAGE_2026: Set<string> = new Set([
  // Januar
  "2026-01-17", "2026-01-21", "2026-01-28", "2026-01-29",
  // Februar
  "2026-02-05", "2026-02-11", "2026-02-16", "2026-02-19", "2026-02-24",
  // März
  "2026-03-04", "2026-03-07", "2026-03-12", "2026-03-15",
  "2026-03-25", "2026-03-26", "2026-03-27", "2026-03-28", "2026-03-29", "2026-03-30", "2026-03-31",
  // April
  "2026-04-01", "2026-04-02", "2026-04-03",
  // Mai
  "2026-05-04", "2026-05-05", "2026-05-06", "2026-05-07", "2026-05-08", "2026-05-09",
  "2026-05-10", "2026-05-11", "2026-05-12", "2026-05-13", "2026-05-23", "2026-05-26", "2026-05-31",
  // Juni
  "2026-06-03", "2026-06-11", "2026-06-16", "2026-06-19", "2026-06-24", "2026-06-30",
  // Juli
  "2026-07-07", "2026-07-08", "2026-07-15", "2026-07-19",
  // August
  "2026-08-05", "2026-08-07", "2026-08-26", "2026-08-27",
  // September
  "2026-09-15", "2026-09-17",
  // Oktober
  "2026-10-04", "2026-10-08", "2026-10-15", "2026-10-16", "2026-10-23", "2026-10-29",
  // November
  "2026-11-03", "2026-11-06", "2026-11-11", "2026-11-19", "2026-11-22", "2026-11-27", "2026-11-30",
  // Dezember
  "2026-12-10", "2026-12-11", "2026-12-12", "2026-12-13", "2026-12-14",
  "2026-12-15", "2026-12-16", "2026-12-17", "2026-12-18", "2026-12-19",
]);

// Mini-Tipps für Portaltage – rotieren basierend auf dem Tag
const PORTALTAG_TIPPS = [
  "Die Schleier sind heute dünn. Nimm dir einen Moment der Stille und höre nach innen.",
  "Perfekter Tag für Journaling: Was zeigt sich gerade? Was darf gehen?",
  "Heute ist die Energie intensiv. Sei sanft mit dir und trinke viel Wasser.",
  "Nutze die hohe Schwingung für eine kurze Meditation oder ein Räucherritual.",
  "Deine Intuition ist heute besonders stark. Vertraue deinen Eingebungen.",
  "Lass heute bewusst los, was dich belastet. Die Energie unterstützt Transformation.",
  "Guter Tag für bewusste Neuausrichtung. Was möchtest du in dein Leben einladen?",
  "Die kosmische Energie öffnet Türen. Achte auf Zeichen und Synchronizitäten.",
  "Heute darfst du langsamer sein. Dein Körper verarbeitet die hohen Schwingungen.",
  "Ideal für Innenschau: Welche alten Muster dürfen sich heute lösen?",
  "Verbinde dich mit der Natur. Ein Spaziergang kann heute Wunder wirken.",
  "Deine Träume könnten heute besonders lebendig sein. Halte sie fest.",
  "Heute ist ein kraftvoller Tag für Manifestation. Setze klare Intentionen.",
  "Die Energie lädt zur Selbstreflexion ein. Was brauchst du wirklich?",
  "Erlaube dir heute Ruhe. Nicht jeder Portaltag muss aktiv gestaltet werden.",
  "Dein Energiefeld ist heute besonders empfänglich. Schütze deine Grenzen liebevoll.",
  "Nutze die Portalenergie für ein kleines Ritual: Kerze anzünden, Intention setzen, loslassen.",
  "Heute fließt die Energie zwischen den Welten. Verbinde dich mit deiner Seele.",
  "Achte auf deine Gedanken – sie manifestieren heute schneller als sonst.",
  "Gönne dir eine Auszeit vom Alltag. Dein Inneres sortiert sich neu.",
  "Die Schwingung ist hoch. Atme tief und lass die Energie durch dich fließen.",
  "Heute ist ein guter Tag, um alte Wunden zu heilen. Sei liebevoll mit dir.",
  "Verbringe Zeit in Stille. Die Antworten kommen von innen.",
  "Dein Herz öffnet sich heute leichter. Lass Liebe fließen – zu dir und anderen.",
  "Die Portalenergie unterstützt Klarheit. Was ist dir wirklich wichtig?",
  "Heute darfst du dich von altem Ballast befreien. Leichtigkeit wartet auf dich.",
  "Verbinde dich mit deinem höheren Selbst. Es hat eine Botschaft für dich.",
  "Die Energie ist transformativ. Vertraue dem Prozess, auch wenn er sich intensiv anfühlt.",
  "Nimm dir heute bewusst Zeit für dich. Du bist es wert.",
  "Die Tore sind offen. Empfange, was das Universum für dich bereithält.",
];

/**
 * Prüft ob heute ein Portaltag ist (in Europe/Berlin Zeitzone)
 */
export function isPortaltag(): boolean {
  const now = new Date();
  const berlinDate = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
  const year = berlinDate.getFullYear();
  const month = String(berlinDate.getMonth() + 1).padStart(2, "0");
  const day = String(berlinDate.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;
  return PORTALTAGE_2026.has(dateStr);
}

/**
 * Gibt den Portaltag-Tipp für heute zurück
 */
export function getPortaltagTipp(): string {
  const now = new Date();
  const berlinDate = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
  const dayOfYear = Math.floor((berlinDate.getTime() - new Date(berlinDate.getFullYear(), 0, 0).getTime()) / 86400000);
  return PORTALTAG_TIPPS[dayOfYear % PORTALTAG_TIPPS.length];
}

/**
 * Sendet die Portaltag-Push-Benachrichtigung an alle Geräte
 */
export async function sendPortaltagPush(): Promise<void> {
  if (!isPortaltag()) {
    return; // Kein Portaltag heute
  }

  console.log("[portaltage] Heute ist ein Portaltag! Sende Push...");

  try {
    const tokens = await getAllActivePushTokens();
    if (!tokens || tokens.length === 0) {
      console.log("[portaltage] Keine Push-Tokens registriert.");
      return;
    }

    const tipp = getPortaltagTipp();
    const title = "🌀 Heute ist ein Portaltag";
    const body = tipp;

    console.log(`[portaltage] Tipp: "${tipp.substring(0, 50)}..." → ${tokens.length} Geräte`);

    // Auch an Web-Push-Subscriber senden
    const { sendWebPushToAll } = await import("./web-push");
    sendWebPushToAll({ title, body, data: { type: "portaltag" } })
      .then(r => console.log(`[portaltage] Web-Push: ${r.sent} gesendet, ${r.failed} fehlgeschlagen`))
      .catch(e => console.error("[portaltage] Web-Push Fehler:", e));

    // In DB speichern
    const messageId = await createPushMessage({
      title,
      body,
      data: JSON.stringify({ type: "portaltag" }),
    });

    // Expo Push API
    const tokenStrings = tokens.map((t: any) => t.token);
    const chunks: string[][] = [];
    for (let i = 0; i < tokenStrings.length; i += 100) {
      chunks.push(tokenStrings.slice(i, i + 100));
    }

    let sentSuccess = 0;
    let sentFailed = 0;

    for (const chunk of chunks) {
      try {
        const messages = chunk.map(token => ({
          to: token,
          sound: "default" as const,
          title,
          body,
          data: { type: "portaltag" },
        }));

        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messages),
        });

        if (response.ok) {
          const result = await response.json();
          const data = result.data || [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].status === "ok") {
              sentSuccess++;
            } else {
              sentFailed++;
              if (data[i].details?.error === "DeviceNotRegistered") {
                await deactivatePushToken(chunk[i]);
              }
            }
          }
        } else {
          sentFailed += chunk.length;
        }
      } catch (err) {
        sentFailed += chunk.length;
        console.error("[portaltage] Chunk-Fehler:", err);
      }
    }

    await updatePushMessage(messageId, { sentSuccess, sentFailed });
    console.log(`[portaltage] Fertig: ${sentSuccess} erfolgreich, ${sentFailed} fehlgeschlagen`);
  } catch (err) {
    console.error("[portaltage] Kritischer Fehler:", err);
  }
}
