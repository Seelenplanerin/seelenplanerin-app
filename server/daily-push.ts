/**
 * Tägliche Push-Benachrichtigung mit Tagesimpuls
 * Sendet jeden Morgen um 7:00 Uhr (Europe/Berlin) den aktuellen Tagesimpuls
 * an alle registrierten Geräte.
 */

import { getAllActivePushTokens, createPushMessage, updatePushMessage, deactivatePushToken } from "./db";
import { sendPortaltagPush } from "./portaltage";

// Die gleichen Impulse wie in der App (app/(tabs)/index.tsx)
const IMPULSE = [
  "Du bist genug. Genau so wie du bist, in diesem Moment.",
  "Vertraue dem Prozess. Alles entfaltet sich im richtigen Tempo.",
  "Deine Intuition ist dein stärkster Kompass. Höre auf sie.",
  "Heute darfst du sanft mit dir sein. Du musst nichts beweisen.",
  "Jeder Atemzug ist ein Neuanfang. Atme tief und beginne.",
  "Du trägst Licht in dir. Lass es leuchten.",
  "Was du aussendest, kehrt zu dir zurück. Wähle Liebe.",
  "Deine Wurzeln geben dir Halt. Deine Flügel geben dir Freiheit.",
  "Heute ist ein guter Tag, um dankbar zu sein.",
  "Du bist auf dem richtigen Weg. Vertraue dir selbst.",
  "Deine Seele weiß den Weg. Höre ihr zu.",
  "Grenzen setzen ist ein Akt der Selbstliebe.",
  "Wachstum geschieht oft im Stillen. Sei geduldig mit dir.",
  "Du verdienst alles Gute, das das Leben zu bieten hat.",
  "Lass los was dich schwer macht. Du darfst leicht sein.",
  "Deine Energie ist kostbar. Schütze sie liebevoll.",
  "Heute darfst du fühlen was du fühlst. Alles ist erlaubt.",
  "Du bist verbunden mit allem was ist. Du bist nie allein.",
  "Deine Geschichte ist wertvoll. Teile sie wenn du bereit bist.",
  "Jeder Tag trägt ein Geschenk in sich. Öffne die Augen dafür.",
  "Du bist stärker als du denkst und schöner als du glaubst.",
  "Vertrauen ist die höchste Form des Mutes.",
  "Dein Herz kennt die Antworten. Frage es.",
  "Heute darfst du einfach sein. Ohne Leistung, ohne Druck.",
  "Du bist ein Wunder des Lebens. Vergiss das nie.",
  "Was du liebst, liebt dich zurück.",
  "Deine Seele hat einen Plan. Vertraue ihm.",
  "Heute ist ein guter Tag, um dir selbst zu vergeben.",
  "Du bist im Fluss des Lebens. Lass dich tragen.",
  "Deine Präsenz ist ein Geschenk an die Welt.",
];

/**
 * Gibt den Tagesimpuls für das aktuelle Datum zurück.
 * Gleiche Logik wie in der App: Tag + Datum als Index.
 */
function getTagesimpuls(): string {
  const now = new Date();
  const day = now.getDay() + now.getDate();
  return IMPULSE[day % IMPULSE.length];
}

/**
 * Sendet den Tagesimpuls als Push-Benachrichtigung an alle registrierten Geräte.
 */
export async function sendDailyImpulsPush(): Promise<void> {
  console.log("[daily-push] Starte tägliche Tagesimpuls-Push...");

  try {
    const tokens = await getAllActivePushTokens();
    if (!tokens || tokens.length === 0) {
      console.log("[daily-push] Keine registrierten Push-Tokens gefunden. Überspringe.");
      return;
    }

    const impuls = getTagesimpuls();
    console.log(`[daily-push] Tagesimpuls: "${impuls.substring(0, 50)}..." → ${tokens.length} Geräte`);

    // Push-Nachricht in DB speichern
    const messageId = await createPushMessage({
      title: "✨ Dein Tagesimpuls",
      body: impuls,
      data: JSON.stringify({ type: "tagesimpuls" }),
    });

    // Expo Push API: max 100 pro Request
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
          title: "✨ Dein Tagesimpuls",
          body: impuls,
          data: { type: "tagesimpuls" },
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
              // Deaktiviere ungültige Tokens
              if (data[i].details?.error === "DeviceNotRegistered") {
                await deactivatePushToken(chunk[i]);
                console.log(`[daily-push] Token deaktiviert (nicht registriert): ${chunk[i].substring(0, 20)}...`);
              }
            }
          }
        } else {
          sentFailed += chunk.length;
          console.error(`[daily-push] Expo Push API Fehler: ${response.status}`);
        }
      } catch (err) {
        sentFailed += chunk.length;
        console.error("[daily-push] Chunk-Fehler:", err);
      }
    }

    // DB-Eintrag aktualisieren
    await updatePushMessage(messageId, { sentSuccess, sentFailed });
    console.log(`[daily-push] Fertig: ${sentSuccess} erfolgreich, ${sentFailed} fehlgeschlagen`);
  } catch (err) {
    console.error("[daily-push] Kritischer Fehler:", err);
  }
}

/**
 * Startet den täglichen Cron-Job.
 * Prüft jede Minute ob es 7:00 / 19:00 Uhr in Europe/Berlin ist.
 * 
 * Zeitplan:
 * - 7:00 Uhr: Tagesimpuls-Push (jeden Tag)
 * - 19:00 Uhr: Portaltag-Push (nur an Portaltagen)
 *   → Abends, damit die Nutzerin den Tag bewusst reflektieren kann
 *   → Passt zur Abend-Meditation / Journaling-Routine
 */
export function startDailyPushCron(): void {
  let lastImpulsDate = "";
  let lastPortaltagDate = "";

  // Prüfe jede Minute
  setInterval(() => {
    const now = new Date();
    // Konvertiere zu Berlin-Zeit
    const berlinTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
    const hour = berlinTime.getHours();
    const minute = berlinTime.getMinutes();
    const dateStr = berlinTime.toISOString().split("T")[0]; // YYYY-MM-DD

    // Um 7:00 Uhr: Tagesimpuls senden
    if (hour === 7 && minute === 0 && lastImpulsDate !== dateStr) {
      lastImpulsDate = dateStr;
      sendDailyImpulsPush().catch(err => {
        console.error("[daily-push] Fehler beim Senden:", err);
      });
    }

    // Um 19:00 Uhr: Portaltag-Push senden (nur an Portaltagen)
    // Abends zur Reflexionszeit – perfekt für Journaling & Abend-Meditation
    if (hour === 19 && minute === 0 && lastPortaltagDate !== dateStr) {
      lastPortaltagDate = dateStr;
      sendPortaltagPush().catch(err => {
        console.error("[portaltage] Fehler beim Senden:", err);
      });
    }
  }, 60_000); // Jede Minute prüfen

  console.log("[daily-push] Cron-Job gestartet: Tagesimpuls 7:00 + Portaltage 19:00 (Europe/Berlin)");
}
