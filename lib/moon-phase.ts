export interface MoonPhase {
  name: string;
  emoji: string;
  description: string;
  energy: string;
  ritual: string;
  illumination: number; // 0-100
}

export const MOON_PHASES: MoonPhase[] = [
  {
    name: "Neumond",
    emoji: "🌑",
    description: "Zeit der Stille und des Neubeginns",
    energy: "Neue Intentionen setzen, Träume pflanzen",
    ritual: "Schreibe deine Wünsche und Intentionen für den neuen Zyklus auf.",
    illumination: 0,
  },
  {
    name: "Zunehmende Sichel",
    emoji: "🌒",
    description: "Erste Schritte und Aufbruch",
    energy: "Aktiv werden, erste Schritte wagen",
    ritual: "Beginne mit einem Projekt, das dir am Herzen liegt.",
    illumination: 25,
  },
  {
    name: "Erstes Viertel",
    emoji: "🌓",
    description: "Entscheidungen und Handlung",
    energy: "Entscheidungen treffen, Hindernisse überwinden",
    ritual: "Identifiziere, was dich aufhält, und handle.",
    illumination: 50,
  },
  {
    name: "Zunehmender Mond",
    emoji: "🌔",
    description: "Wachstum und Ausdehnung",
    energy: "Ausdehnen, wachsen, verfeinern",
    ritual: "Überprüfe deine Intentionen und passe sie an.",
    illumination: 75,
  },
  {
    name: "Vollmond",
    emoji: "🌕",
    description: "Fülle, Klarheit und Loslassen",
    energy: "Manifestation, Loslassen, Dankbarkeit",
    ritual: "Feiere deine Erfolge und lasse los, was nicht mehr dient.",
    illumination: 100,
  },
  {
    name: "Abnehmender Mond",
    emoji: "🌖",
    description: "Reflexion und Dankbarkeit",
    energy: "Reflektieren, loslassen, dankbar sein",
    ritual: "Schreibe auf, wofür du dankbar bist.",
    illumination: 75,
  },
  {
    name: "Letztes Viertel",
    emoji: "🌗",
    description: "Loslassen und Reinigung",
    energy: "Aufräumen, reinigen, loslassen",
    ritual: "Räume deinen Raum und dein Herz auf.",
    illumination: 50,
  },
  {
    name: "Abnehmende Sichel",
    emoji: "🌘",
    description: "Rückzug und Vorbereitung",
    energy: "Ruhe, Einkehr, Vorbereitung",
    ritual: "Gönne dir Ruhe und bereite dich auf den neuen Zyklus vor.",
    illumination: 25,
  },
];

/**
 * Berechnet die aktuelle Mondphase basierend auf dem Datum.
 * Vereinfachte Berechnung (synodischer Monat ≈ 29.53 Tage)
 */
// Korrekte Neumond-Daten 2026 (UTC)
const NEUMONDE_2026 = [
  new Date("2026-01-18T19:53:00Z"),
  new Date("2026-02-17T12:03:00Z"),
  new Date("2026-03-19T01:26:00Z"),
  new Date("2026-04-17T11:54:00Z"),
  new Date("2026-05-16T20:03:00Z"),
  new Date("2026-06-15T02:56:00Z"),
  new Date("2026-07-14T09:45:00Z"),
  new Date("2026-08-12T17:37:00Z"),
  new Date("2026-09-11T03:27:00Z"),
  new Date("2026-10-10T15:50:00Z"),
  new Date("2026-11-09T07:02:00Z"),
  new Date("2026-12-09T00:52:00Z"),
];
const SYNODISCHER_MONAT = 29.53058867 * 24 * 60 * 60 * 1000;

function findLastNeumond(date: Date): Date {
  let ref = NEUMONDE_2026[0];
  for (const nm of NEUMONDE_2026) {
    if (nm.getTime() <= date.getTime()) ref = nm;
    else break;
  }
  return ref;
}

export function getCurrentMoonPhase(): MoonPhase {
  const now = new Date();
  const ref = findLastNeumond(now);
  const elapsed = now.getTime() - ref.getTime();
  const cyclePosition = ((elapsed % SYNODISCHER_MONAT) + SYNODISCHER_MONAT) % SYNODISCHER_MONAT;
  const phaseIndex = Math.floor((cyclePosition / SYNODISCHER_MONAT) * 8) % 8;
  return MOON_PHASES[phaseIndex];
}

/**
 * Berechnet die Mondphase für ein bestimmtes Datum.
 */
export function getMoonPhaseForDate(date: Date): MoonPhase {
  const ref = findLastNeumond(date);
  const elapsed = date.getTime() - ref.getTime();
  const cyclePosition = ((elapsed % SYNODISCHER_MONAT) + SYNODISCHER_MONAT) % SYNODISCHER_MONAT;
  const phaseIndex = Math.floor((cyclePosition / SYNODISCHER_MONAT) * 8) % 8;
  return MOON_PHASES[phaseIndex];
}

/**
 * Gibt den Mondkalender für die nächsten 30 Tage zurück.
 */
export function getMoonCalendar(): { date: Date; phase: MoonPhase }[] {
  const calendar = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    calendar.push({ date, phase: getMoonPhaseForDate(date) });
  }
  return calendar;
}
