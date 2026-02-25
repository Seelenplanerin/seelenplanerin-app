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
export function getCurrentMoonPhase(): MoonPhase {
  const knownNewMoon = new Date("2024-01-11T11:57:00Z").getTime();
  const synodicMonth = 29.53058867 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const elapsed = now - knownNewMoon;
  const cyclePosition = ((elapsed % synodicMonth) + synodicMonth) % synodicMonth;
  const phaseIndex = Math.floor((cyclePosition / synodicMonth) * 8) % 8;
  return MOON_PHASES[phaseIndex];
}

/**
 * Berechnet die Mondphase für ein bestimmtes Datum.
 */
export function getMoonPhaseForDate(date: Date): MoonPhase {
  const knownNewMoon = new Date("2024-01-11T11:57:00Z").getTime();
  const synodicMonth = 29.53058867 * 24 * 60 * 60 * 1000;
  const elapsed = date.getTime() - knownNewMoon;
  const cyclePosition = ((elapsed % synodicMonth) + synodicMonth) % synodicMonth;
  const phaseIndex = Math.floor((cyclePosition / synodicMonth) * 8) % 8;
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
