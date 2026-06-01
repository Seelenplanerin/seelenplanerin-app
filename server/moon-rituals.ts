/**
 * Automatische Mond-Ritual Push-Nachrichten
 * Sendet bei Vollmond und Neumond ein einzigartiges Ritual als Push-Nachricht.
 * Jedes Ritual ist auf das jeweilige Tierkreiszeichen abgestimmt.
 * Versand: Am Tag des Voll-/Neumondes um 19:00 Uhr (Europe/Berlin).
 */

import { getAllActivePushTokens, createPushMessage, updatePushMessage, deactivatePushToken, checkIfPushSentToday } from "./db";
import { sendWebPushToAll } from "./web-push";

// ── Vollmond-Daten 2026 (UTC) mit Tierkreiszeichen ──

interface MoonEvent {
  date: string; // YYYY-MM-DD (Berlin-Zeit)
  zodiac: string;
  title: string;
  body: string;
}

const VOLLMOND_RITUALE_2026: MoonEvent[] = [
  {
    date: "2026-06-30",
    zodiac: "Steinbock",
    title: "Vollmond im Steinbock ♑🌕",
    body: `Hey du 🌕

Heute steht der Vollmond im Steinbock – das Zeichen der Disziplin, Struktur und inneren Stärke.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen können. ✨

Du brauchst:
Kerze, Stift, Papier, einen Stein (symbolisch für den Steinbock)

1. Ankommen
Kerze anzünden. Nimm den Stein in die Hand.
3x tief atmen. Sprich: „Ich bin stark. Ich bin beständig. Ich vertraue meinem Weg."

2. Ernte betrachten
Schreib auf: „Was habe ich durch meine Ausdauer erreicht?"
Mindestens 3 Dinge. Auch kleine Erfolge zählen.

3. Loslassen was blockiert
Schreib auf: „Welche Pflicht oder Last darf ich jetzt ablegen?"
Lies laut vor. Lege das Papier unter den Stein.
Sprich: „Ich muss nicht alles tragen. Ich darf leicht sein."

4. Neue Struktur
Schreib auf: „Welche eine Gewohnheit stärkt mich im nächsten Zyklus?"
Falte das Papier. Lege es ans Fenster im Mondlicht.

Der Steinbock-Mond erinnert dich: Du bist stärker als du denkst. 🏔️🌕
Lara 🤍`,
  },
  {
    date: "2026-07-29",
    zodiac: "Wassermann",
    title: "Vollmond im Wassermann ♒🌕",
    body: `Hey du 🌕

Heute steht der Vollmond im Wassermann – das Zeichen der Freiheit, Originalität und Gemeinschaft.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen können. ✨

Du brauchst:
Kerze, Stift, Papier, ein Glas Wasser

1. Ankommen
Kerze anzünden. 3x tief atmen.
Sprich: „Ich erlaube mir, anders zu sein. Meine Einzigartigkeit ist mein Geschenk."

2. Freiheits-Check
Schreib auf: „Wo passe ich mich an, obwohl es sich falsch anfühlt?"
Sei ehrlich. Wo verstellst du dich?

3. Befreiung
Schreib auf ein separates Blatt alles, was du loslässt.
Reiße es in kleine Stücke. Lege sie in das Glas Wasser.
Sprich: „Ich löse mich von dem, was nicht zu mir gehört."

4. Vision für die Gemeinschaft
Schreib auf: „Wie möchte ich die Welt um mich herum bereichern?"
Eine Idee reicht. Der Wassermann-Mond stärkt deine Vision.

Sei wild. Sei frei. Sei du. 🌊🌕
Lara 🤍`,
  },
  {
    date: "2026-08-28",
    zodiac: "Fische",
    title: "Mondfinsternis in den Fischen ♓🌕",
    body: `Hey du 🌕

Heute ist nicht nur Vollmond – es ist eine Mondfinsternis in den Fischen. Ein Portal für tiefe Transformation.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen können. ✨

Du brauchst:
Kerze, Stift, Papier, ätherisches Öl (Lavendel oder Rose)

1. Ankommen
Kerze anzünden. Einen Tropfen Öl auf die Handgelenke.
Augen schließen. 7 tiefe Atemzüge.
Sprich: „Ich öffne mich für das, was sich zeigen will."

2. Intuitions-Reise
Stell dir vor, du stehst am Ufer eines stillen Sees.
Der Mond spiegelt sich im Wasser. Du tauchst ein.
Was siehst du unter der Oberfläche? Schreib es auf.

3. Loslassen ins Wasser
Schreib auf: „Was darf zurück ins Meer fließen?"
Alte Wunden, Illusionen, Ängste.
Sprich: „Ich lasse los. Das Wasser trägt es fort."

4. Segen empfangen
Lege beide Hände auf dein Herz.
Sprich: „Ich bin gehalten. Ich bin geliebt. Ich bin verbunden mit allem."

Die Fische-Finsternis heilt, was bereit ist zu heilen. 🌊🌕
Lara 🤍`,
  },
  {
    date: "2026-09-26",
    zodiac: "Widder",
    title: "Vollmond im Widder ♈🌕",
    body: `Hey du 🌕

Heute steht der Vollmond im Widder – das Zeichen des Mutes, der Leidenschaft und des Neuanfangs.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen können. ✨

Du brauchst:
Kerze (rot wenn möglich), Stift, Papier

1. Ankommen
Kerze anzünden. Steh auf. Stampfe 3x mit dem Fuß auf den Boden.
Sprich laut: „Ich bin hier. Ich bin lebendig. Ich bin mutig."

2. Mut-Frage
Schreib auf: „Wovor habe ich Angst – und was würde ich tun, wenn ich keine hätte?"
Schreib mindestens 3 mutige Antworten.

3. Feuer-Ritual
Wähle EINE mutige Sache, die du im nächsten Monat umsetzt.
Schreib sie groß auf. Halte das Papier ans Kerzenlicht (nicht verbrennen!).
Sprich: „Ich zünde mein inneres Feuer an. Ich handle JETZT."

4. Krafttier
Schließe die Augen. Welches Tier erscheint vor dir?
Das ist dein Begleiter für den nächsten Zyklus. Schreib es auf.

Der Widder-Mond gibt dir Feuer. Nutze es. 🔥🌕
Lara 🤍`,
  },
  {
    date: "2026-10-26",
    zodiac: "Stier",
    title: "Vollmond im Stier ♉🌕",
    body: `Hey du 🌕

Heute steht der Vollmond im Stier – das Zeichen der Sinnlichkeit, Erdung und des Genusses.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen können. ✨

Du brauchst:
Kerze, etwas Schokolade oder Obst, Bodylotion, Notizbuch

1. Ankommen
Kerze anzünden. Nimm die Schokolade/Obst.
Iss ganz langsam. Schmecke jeden Bissen bewusst.
Der Stier lehrt uns: Genuss ist heilig.

2. Körper-Dankbarkeit
Creme deine Hände und Arme ein. Langsam. Liebevoll.
Sprich: „Mein Körper ist mein Zuhause. Ich ehre ihn."

3. Fülle-Inventur
Schreib auf: „Was besitze ich bereits, das mich glücklich macht?"
Materiell und immateriell. Mindestens 5 Dinge.

4. Erdung
Stell dich barfuß hin (auf den Boden oder Teppich).
Sprich: „Ich bin geerdet. Ich bin sicher. Ich habe genug."
Atme 5x tief in den Bauch.

Der Stier-Mond erinnert dich: Du darfst genießen. 🌿🌕
Lara 🤍`,
  },
  {
    date: "2026-11-24",
    zodiac: "Zwillinge",
    title: "Vollmond in den Zwillingen ♊🌕",
    body: `Hey du 🌕

Heute steht der Vollmond in den Zwillingen – das Zeichen der Kommunikation, Neugier und Vielfalt.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen können. ✨

Du brauchst:
Kerze, Stift, zwei Blätter Papier

1. Ankommen
Kerze anzünden. 3x tief atmen.
Sprich: „Ich höre zu – mir selbst und der Welt um mich."

2. Dialog mit dir selbst
Nimm zwei Blätter. Auf das eine schreibst du als dein „Kopf" (Verstand).
Auf das andere als dein „Herz" (Gefühl).
Frage: „Was brauche ich gerade wirklich?"
Lass beide Seiten antworten.

3. Aussprechen
Lies beide Antworten laut vor.
Wo stimmen sie überein? Wo widersprechen sie sich?
Sprich: „Ich ehre beide Stimmen in mir."

4. Botschaft senden
Schreib einer Person, an die du heute denkst, eine kurze Nachricht.
Nur 1-2 Sätze. Von Herzen. Der Zwillinge-Mond stärkt Verbindung.

Worte haben Kraft. Nutze sie weise. 💬🌕
Lara 🤍`,
  },
  {
    date: "2026-12-24",
    zodiac: "Krebs",
    title: "Vollmond im Krebs ♋🌕",
    body: `Hey du 🌕

Heute – an Heiligabend – steht der Vollmond im Krebs. Das Zeichen der Geborgenheit, Familie und tiefen Gefühle.

Vergiss nicht: Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht, damit sie sich aufladen können. ✨

Du brauchst:
Kerze, Stift, Papier, eine Tasse Tee oder Kakao

1. Ankommen
Kerze anzünden. Tee/Kakao einschenken. Hände um die Tasse.
3x tief atmen. Sprich: „Ich bin geborgen. Ich bin geliebt."

2. Herz öffnen
Schreib auf: „Wem bin ich dieses Jahr dankbar?"
Mindestens 5 Menschen. Spüre die Liebe bei jedem Namen.

3. Loslassen
Schreib auf: „Welchen Schmerz aus diesem Jahr darf ich jetzt loslassen?"
Falte das Papier. Lege es unter die Kerze.
Sprich: „Ich vergebe. Ich heile. Ich bin frei."

4. Wunsch fürs neue Jahr
Schreib auf: „Was wünsche ich mir für 2027?"
Einen Herzenswunsch. Lege ihn ans Fenster im Mondlicht.

Der Krebs-Mond hüllt dich heute in Liebe. Frohe Weihnachten. 🎄🌕
Lara 🤍`,
  },
];

const NEUMOND_RITUALE_2026: MoonEvent[] = [
  {
    date: "2026-06-15",
    zodiac: "Zwillinge",
    title: "Neumond in den Zwillingen ♊🌑",
    body: `Hey du 🌑

Heute ist Neumond in den Zwillingen – Zeit für neue Gedanken, Gespräche und Perspektiven.

Du brauchst:
Kerze, Stift, Notizbuch

1. Ankommen
Kerze anzünden. 3x tief atmen.
Sprich: „Ich öffne meinen Geist für neue Möglichkeiten."

2. Gedanken-Inventur
Schreib auf: „Welcher Gedanke hält mich gerade fest?"
Und dann: „Wie könnte ich ihn anders denken?"
Der Zwillinge-Neumond schenkt dir eine neue Perspektive.

3. Intention setzen
Schreib auf: „In diesem Zyklus möchte ich lernen / entdecken / aussprechen..."
Etwas Neues. Etwas Mutiges.

4. Versiegeln
Sprich: „Meine Worte erschaffen meine Realität. Ich wähle sie bewusst."
Puste die Kerze aus.

Neue Gedanken, neues Leben. 💫🌑
Lara 🤍`,
  },
  {
    date: "2026-07-14",
    zodiac: "Krebs",
    title: "Neumond im Krebs ♋🌑",
    body: `Hey du 🌑

Heute ist Neumond im Krebs – Zeit für Geborgenheit, Selbstfürsorge und emotionale Heilung.

Du brauchst:
Kerze, Stift, Papier, eine Decke oder Kissen

1. Ankommen
Wickle dich in die Decke. Kerze anzünden.
3x tief atmen. Sprich: „Ich bin sicher. Ich darf fühlen."

2. Emotionaler Check-in
Schreib auf: „Wie fühle ich mich wirklich gerade?"
Nicht wie du dich fühlen „solltest". Wie du dich WIRKLICH fühlst.
Alles ist erlaubt.

3. Selbstfürsorge-Intention
Schreib auf: „In diesem Zyklus sorge ich für mich, indem ich..."
3 konkrete Dinge. Klein und machbar.
z.B. „Ich gehe jeden Abend 10 Minuten spazieren."

4. Innere Umarmung
Lege beide Arme um dich selbst. Halte dich.
Sprich: „Ich bin für mich da. Immer."

Der Krebs-Neumond nährt deine Seele. 🫂🌑
Lara 🤍`,
  },
  {
    date: "2026-08-12",
    zodiac: "Löwe",
    title: "Sonnenfinsternis im Löwen ♌🌑",
    body: `Hey du 🌑

Heute ist eine Sonnenfinsternis im Löwen – ein kraftvolles Portal für Selbstausdruck und Herzöffnung.

Du brauchst:
Kerze (gold oder gelb wenn möglich), Stift, Papier, Spiegel

1. Ankommen
Kerze anzünden. Setze dich vor den Spiegel.
Schau dir in die Augen. Lächle dich an.
Sprich: „Ich sehe dich. Du bist wunderschön."

2. Löwen-Kraft
Schreib auf: „Was macht mich einzigartig? Was ist mein Licht?"
Mindestens 5 Dinge. Sei nicht bescheiden. Der Löwe strahlt.

3. Herzens-Intention
Schreib auf: „In diesem Zyklus zeige ich mich der Welt, indem ich..."
Etwas, das Mut erfordert. Etwas, das dein Herz zum Leuchten bringt.

4. Krönung
Steh auf. Stell dir vor, du setzt dir eine goldene Krone auf.
Sprich: „Ich bin die Königin meines Lebens. Ich strahle."

Die Löwen-Finsternis entfacht dein inneres Feuer. 🦁🌑
Lara 🤍`,
  },
  {
    date: "2026-09-11",
    zodiac: "Jungfrau",
    title: "Neumond in der Jungfrau ♍🌑",
    body: `Hey du 🌑

Heute ist Neumond in der Jungfrau – Zeit für Ordnung, Heilung und liebevolle Routinen.

Du brauchst:
Kerze, Stift, Notizbuch, Räucherwerk (optional)

1. Ankommen
Kerze anzünden. Optional räuchern.
3x tief atmen. Sprich: „Ich bringe Ordnung in mein Leben – mit Liebe."

2. Lebens-Inventur
Schreib auf: „Was in meinem Leben braucht gerade Aufmerksamkeit?"
Körper, Wohnung, Beziehungen, Arbeit – wo ruft es?

3. Heilungs-Intention
Schreib auf: „In diesem Zyklus heile ich... indem ich..."
Eine konkrete Sache. Ein kleiner Schritt zur Besserung.
z.B. „Ich heile meine Erschöpfung, indem ich um 22 Uhr ins Bett gehe."

4. Dankbarkeit für deinen Körper
Lege deine Hände auf deinen Bauch.
Sprich: „Danke, Körper, für alles was du täglich für mich tust."

Die Jungfrau-Energie ordnet mit Liebe. 🌿🌑
Lara 🤍`,
  },
  {
    date: "2026-10-10",
    zodiac: "Waage",
    title: "Neumond in der Waage ♎🌑",
    body: `Hey du 🌑

Heute ist Neumond in der Waage – Zeit für Balance, Harmonie und liebevolle Beziehungen.

Du brauchst:
Kerze, Stift, Papier, eine Blume oder etwas Schönes

1. Ankommen
Kerze anzünden. Lege die Blume vor dich.
3x tief atmen. Sprich: „Ich lade Harmonie in mein Leben ein."

2. Beziehungs-Check
Schreib auf: „In welcher Beziehung wünsche ich mir mehr Balance?"
Das kann eine Beziehung zu einem Menschen sein – oder zu dir selbst.

3. Harmonie-Intention
Schreib auf: „In diesem Zyklus bringe ich Balance, indem ich..."
z.B. „Ich sage öfter was ich brauche." oder „Ich nehme mir Zeit für Schönheit."

4. Schönheits-Ritual
Tu dir etwas Schönes. Creme, Musik, ein Bad, Blumen kaufen.
Sprich: „Ich verdiene Schönheit und Harmonie in meinem Leben."

Die Waage schenkt dir Gleichgewicht. ⚖️🌑
Lara 🤍`,
  },
  {
    date: "2026-11-09",
    zodiac: "Skorpion",
    title: "Neumond im Skorpion ♏🌑",
    body: `Hey du 🌑

Heute ist Neumond im Skorpion – die tiefste, transformativste Energie des Jahres.

Du brauchst:
Kerze (schwarz oder dunkelrot wenn möglich), Stift, Papier, feuerfeste Schale

1. Ankommen
Kerze anzünden. Augen schließen. 5 tiefe Atemzüge.
Sprich: „Ich bin bereit für die Wahrheit. Ich bin bereit für Transformation."

2. Schatten-Arbeit
Schreib auf: „Was verberge ich vor mir selbst?"
Sei radikal ehrlich. Der Skorpion fordert Tiefe.
Niemand liest das außer du.

3. Transformation
Verbrenne das Papier in der Schale.
Sprich: „Aus der Asche entsteht Neues. Ich transformiere."

4. Phoenix-Intention
Neues Blatt. Schreib: „Ich erhebe mich als..."
Wer willst du nach dieser Transformation sein?
Falte es. Lege es unter dein Kopfkissen.

Der Skorpion-Neumond ist deine Wiedergeburt. 🦂🌑
Lara 🤍`,
  },
  {
    date: "2026-12-09",
    zodiac: "Schütze",
    title: "Neumond im Schützen ♐🌑",
    body: `Hey du 🌑

Heute ist Neumond im Schützen – Zeit für Abenteuer, Weisheit und große Visionen.

Du brauchst:
Kerze, Stift, Papier

1. Ankommen
Kerze anzünden. 3x tief atmen.
Sprich: „Ich öffne mich für die Weite des Lebens."

2. Abenteuerlust
Schreib auf: „Was würde ich tun, wenn alles möglich wäre?"
Reisen, lernen, wagen – der Schütze kennt keine Grenzen.
Träume groß. Mindestens 5 Dinge.

3. Weisheits-Frage
Schreib auf: „Was ist die wichtigste Lektion, die ich dieses Jahr gelernt habe?"
Und: „Welche Weisheit nehme ich mit ins neue Jahr?"

4. Pfeil abschießen
Stell dir vor, du bist der Schütze mit Pfeil und Bogen.
Dein Pfeil ist deine größte Intention für 2027.
Sprich: „Ich ziele hoch. Ich lasse los. Ich vertraue."
Puste die Kerze aus.

Der Schütze-Neumond zeigt dir den Weg. 🏹🌑
Lara 🤍`,
  },
];

/**
 * Prüft ob heute ein Vollmond- oder Neumond-Tag ist und sendet das entsprechende Ritual.
 */
export async function sendMoonRitualPush(): Promise<void> {
  const now = new Date();
  const berlinTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
  const todayStr = `${berlinTime.getFullYear()}-${String(berlinTime.getMonth() + 1).padStart(2, "0")}-${String(berlinTime.getDate()).padStart(2, "0")}`;

  // Prüfe ob heute ein Vollmond-Ritual ansteht
  const vollmondRitual = VOLLMOND_RITUALE_2026.find(r => r.date === todayStr);
  const neumondRitual = NEUMOND_RITUALE_2026.find(r => r.date === todayStr);

  const ritual = vollmondRitual || neumondRitual;
  if (!ritual) {
    return; // Kein Mond-Event heute
  }

  const type = vollmondRitual ? "vollmond" : "neumond";
  console.log(`[moon-ritual] Heute ist ${type === "vollmond" ? "Vollmond" : "Neumond"} im ${ritual.zodiac}! Sende Ritual...`);

  try {
    // Duplikat-Schutz
    const keyword = vollmondRitual ? "Vollmond" : "Neumond";
    const alreadySent = await checkIfPushSentToday(keyword);
    if (alreadySent) {
      console.log(`[moon-ritual] ${keyword}-Ritual wurde heute bereits gesendet. Überspringe.`);
      return;
    }

    const tokens = await getAllActivePushTokens();
    if (!tokens || tokens.length === 0) {
      console.log("[moon-ritual] Keine registrierten Push-Tokens gefunden. Überspringe.");
      return;
    }

    // Web-Push senden
    sendWebPushToAll({ title: ritual.title, body: ritual.body, data: { type: `moon-${type}`, zodiac: ritual.zodiac } })
      .then(r => console.log(`[moon-ritual] Web-Push: ${r.sent} gesendet, ${r.failed} fehlgeschlagen`))
      .catch(e => console.error("[moon-ritual] Web-Push Fehler:", e));

    // Push-Nachricht in DB speichern
    const messageId = await createPushMessage({
      title: ritual.title,
      body: ritual.body,
      data: JSON.stringify({ type: `moon-${type}`, zodiac: ritual.zodiac }),
    });

    // Expo Push API senden
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
          title: ritual.title,
          body: ritual.body,
          data: { type: `moon-${type}`, zodiac: ritual.zodiac },
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
                console.log(`[moon-ritual] Token deaktiviert: ${chunk[i].substring(0, 20)}...`);
              }
            }
          }
        } else {
          sentFailed += chunk.length;
          console.error(`[moon-ritual] Expo Push API Fehler: ${response.status}`);
        }
      } catch (err) {
        sentFailed += chunk.length;
        console.error("[moon-ritual] Chunk-Fehler:", err);
      }
    }

    await updatePushMessage(messageId, { sentSuccess, sentFailed });
    console.log(`[moon-ritual] Fertig: ${sentSuccess} erfolgreich, ${sentFailed} fehlgeschlagen`);
  } catch (err) {
    console.error("[moon-ritual] Kritischer Fehler:", err);
  }
}
