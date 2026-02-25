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
 * Exakte Vollmond-Daten 2026 (UTC)
 * Quelle: astronomische Berechnungen
 */
const VOLLMONDE_2026 = [
  new Date("2026-01-03T22:03:00Z"),  // 3. Januar
  new Date("2026-02-01T22:09:00Z"),  // 1. Februar (MEZ: 23:09)
  new Date("2026-03-03T11:38:00Z"),  // 3. März (MEZ: 12:38)
  new Date("2026-04-01T23:12:00Z"),  // 2. April (MESZ: 01:12)
  new Date("2026-05-01T13:23:00Z"),  // 1. Mai (MESZ: 15:23)
  new Date("2026-05-31T08:45:00Z"),  // 31. Mai (MESZ: 10:45)
  new Date("2026-06-30T02:57:00Z"),  // 30. Juni (MESZ: 04:57)
  new Date("2026-07-29T18:36:00Z"),  // 29. Juli (MESZ: 20:36)
  new Date("2026-08-28T06:19:00Z"),  // 28. August (MESZ: 08:19)
  new Date("2026-09-26T16:49:00Z"),  // 26. September (MESZ: 18:49)
  new Date("2026-10-26T04:12:00Z"),  // 26. Oktober (MEZ: 05:12)
  new Date("2026-11-24T14:53:00Z"),  // 24. November (MEZ: 15:53)
  new Date("2026-12-24T01:28:00Z"),  // 24. Dezember (MEZ: 02:28)
];

/**
 * Exakte Neumond-Daten 2026 (UTC)
 */
const NEUMONDE_2026 = [
  new Date("2026-01-18T19:53:00Z"),  // 18. Januar
  new Date("2026-02-17T12:03:00Z"),  // 17. Februar
  new Date("2026-03-19T01:26:00Z"),  // 19. März
  new Date("2026-04-17T11:54:00Z"),  // 17. April
  new Date("2026-05-16T20:03:00Z"),  // 16. Mai
  new Date("2026-06-15T02:56:00Z"),  // 15. Juni
  new Date("2026-07-14T09:45:00Z"),  // 14. Juli
  new Date("2026-08-12T17:37:00Z"),  // 12. August
  new Date("2026-09-11T03:27:00Z"),  // 11. September
  new Date("2026-10-10T15:50:00Z"),  // 10. Oktober
  new Date("2026-11-09T07:02:00Z"),  // 9. November
  new Date("2026-12-09T00:52:00Z"),  // 9. Dezember
];

/**
 * Berechnet die aktuelle Mondphase basierend auf exakten astronomischen Daten.
 * Verwendet die nächsten Vollmond/Neumond-Daten um die Phase exakt zu bestimmen.
 */
function getPhaseForDate(date: Date): MoonPhase {
  const now = date.getTime();

  // Finde den nächsten und letzten Vollmond
  let closestVollmond = VOLLMONDE_2026[0];
  let minVollmondDiff = Infinity;
  for (const vm of VOLLMONDE_2026) {
    const diff = Math.abs(vm.getTime() - now);
    if (diff < minVollmondDiff) {
      minVollmondDiff = diff;
      closestVollmond = vm;
    }
  }

  // Finde den nächsten Neumond
  let closestNeumond = NEUMONDE_2026[0];
  let minNeumondDiff = Infinity;
  for (const nm of NEUMONDE_2026) {
    const diff = Math.abs(nm.getTime() - now);
    if (diff < minNeumondDiff) {
      minNeumondDiff = diff;
      closestNeumond = nm;
    }
  }

  const ONE_DAY = 24 * 60 * 60 * 1000;

  // Innerhalb 1 Tag vom Vollmond = Vollmond
  if (minVollmondDiff < ONE_DAY) {
    return MOON_PHASES[4]; // Vollmond
  }

  // Innerhalb 1 Tag vom Neumond = Neumond
  if (minNeumondDiff < ONE_DAY) {
    return MOON_PHASES[0]; // Neumond
  }

  // Finde den letzten Neumond VOR dem Datum
  let lastNeumond = NEUMONDE_2026[0];
  for (const nm of NEUMONDE_2026) {
    if (nm.getTime() <= now) lastNeumond = nm;
    else break;
  }

  // Finde den nächsten Neumond NACH dem Datum
  let nextNeumond = NEUMONDE_2026[NEUMONDE_2026.length - 1];
  for (const nm of NEUMONDE_2026) {
    if (nm.getTime() > now) {
      nextNeumond = nm;
      break;
    }
  }

  // Berechne Position im Zyklus (0-1)
  const cycleLength = nextNeumond.getTime() - lastNeumond.getTime();
  const elapsed = now - lastNeumond.getTime();
  const position = elapsed / cycleLength; // 0 = Neumond, 0.5 = Vollmond, 1 = nächster Neumond

  // Mappe auf 8 Phasen
  if (position < 0.0625) return MOON_PHASES[0]; // Neumond
  if (position < 0.1875) return MOON_PHASES[1]; // Zunehmende Sichel
  if (position < 0.3125) return MOON_PHASES[2]; // Erstes Viertel
  if (position < 0.4375) return MOON_PHASES[3]; // Zunehmender Mond
  if (position < 0.5625) return MOON_PHASES[4]; // Vollmond
  if (position < 0.6875) return MOON_PHASES[5]; // Abnehmender Mond
  if (position < 0.8125) return MOON_PHASES[6]; // Letztes Viertel
  if (position < 0.9375) return MOON_PHASES[7]; // Abnehmende Sichel
  return MOON_PHASES[0]; // Neumond (Ende des Zyklus)
}

export function getCurrentMoonPhase(): MoonPhase {
  return getPhaseForDate(new Date());
}

export function getMoonPhaseForDate(date: Date): MoonPhase {
  return getPhaseForDate(date);
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

/**
 * Gibt das nächste Vollmond-Datum zurück.
 */
export function getNextVollmond(): Date {
  const now = new Date();
  for (const vm of VOLLMONDE_2026) {
    if (vm.getTime() > now.getTime()) return vm;
  }
  return VOLLMONDE_2026[VOLLMONDE_2026.length - 1];
}

/**
 * Gibt das nächste Neumond-Datum zurück.
 */
export function getNextNeumond(): Date {
  const now = new Date();
  for (const nm of NEUMONDE_2026) {
    if (nm.getTime() > now.getTime()) return nm;
  }
  return NEUMONDE_2026[NEUMONDE_2026.length - 1];
}
