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
 * ============================================================
 * EXAKTE ASTRONOMISCHE MONDPHASEN-DATEN 2026 (UTC)
 * Quelle: timeanddate.com (US Naval Observatory Daten)
 * Verifiziert am 25.02.2026
 * ============================================================
 */

/** Vollmond-Daten 2026 (UTC) – exakt von timeanddate.com */
const VOLLMONDE_2026 = [
  new Date("2026-01-03T10:02:00Z"),  // 3. Januar  (MEZ: 11:02)
  new Date("2026-02-01T22:09:00Z"),  // 1. Februar (MEZ: 23:09)
  new Date("2026-03-03T11:37:00Z"),  // 3. März    (MEZ: 12:37) ← BESTÄTIGT!
  new Date("2026-04-02T02:11:00Z"),  // 2. April   (MESZ: 04:11)
  new Date("2026-05-01T17:23:00Z"),  // 1. Mai     (MESZ: 19:23)
  new Date("2026-05-31T08:45:00Z"),  // 31. Mai    (MESZ: 10:45) Blue Moon
  new Date("2026-06-29T23:56:00Z"),  // 29. Juni   (MESZ: 01:56 am 30.)
  new Date("2026-07-29T14:35:00Z"),  // 29. Juli   (MESZ: 16:35)
  new Date("2026-08-28T04:18:00Z"),  // 28. August (MESZ: 06:18)
  new Date("2026-09-26T16:49:00Z"),  // 26. Sept.  (MESZ: 18:49)
  new Date("2026-10-26T04:11:00Z"),  // 26. Oktober(MEZ: 05:11)
  new Date("2026-11-24T14:53:00Z"),  // 24. Nov.   (MEZ: 15:53)
  new Date("2026-12-24T01:28:00Z"),  // 24. Dez.   (MEZ: 02:28)
];

/** Neumond-Daten 2026 (UTC) – exakt von timeanddate.com */
const NEUMONDE_2026 = [
  new Date("2026-01-18T19:51:00Z"),  // 18. Januar
  new Date("2026-02-17T12:01:00Z"),  // 17. Februar
  new Date("2026-03-19T01:23:00Z"),  // 19. März
  new Date("2026-04-17T11:51:00Z"),  // 17. April
  new Date("2026-05-16T20:01:00Z"),  // 16. Mai
  new Date("2026-06-15T02:54:00Z"),  // 15. Juni
  new Date("2026-07-14T09:43:00Z"),  // 14. Juli
  new Date("2026-08-12T17:36:00Z"),  // 12. August
  new Date("2026-09-11T03:26:00Z"),  // 11. September
  new Date("2026-10-10T15:50:00Z"),  // 10. Oktober
  new Date("2026-11-09T07:02:00Z"),  // 9. November
  new Date("2026-12-09T00:51:00Z"),  // 9. Dezember
];

/** Erstes Viertel 2026 (UTC) */
const ERSTES_VIERTEL_2026 = [
  new Date("2026-01-26T04:47:00Z"),
  new Date("2026-02-24T12:27:00Z"),
  new Date("2026-03-25T19:17:00Z"),
  new Date("2026-04-24T02:31:00Z"),
  new Date("2026-05-23T11:10:00Z"),
  new Date("2026-06-21T21:55:00Z"),
  new Date("2026-07-21T11:05:00Z"),
  new Date("2026-08-20T02:46:00Z"),
  new Date("2026-09-18T20:43:00Z"),
  new Date("2026-10-18T16:12:00Z"),
  new Date("2026-11-17T11:47:00Z"),
  new Date("2026-12-17T05:42:00Z"),
];

/** Letztes Viertel 2026 (UTC) */
const LETZTES_VIERTEL_2026 = [
  new Date("2026-01-10T15:48:00Z"),
  new Date("2026-02-09T12:43:00Z"),
  new Date("2026-03-11T09:38:00Z"),
  new Date("2026-04-10T04:51:00Z"),
  new Date("2026-05-09T21:10:00Z"),
  new Date("2026-06-08T10:00:00Z"),
  new Date("2026-07-07T19:29:00Z"),
  new Date("2026-08-06T02:21:00Z"),
  new Date("2026-09-04T07:51:00Z"),
  new Date("2026-10-03T13:25:00Z"),
  new Date("2026-11-01T20:28:00Z"),
  new Date("2026-12-01T06:08:00Z"),
  new Date("2026-12-30T18:59:00Z"),
];

/**
 * Tierkreiszeichen des Mondes basierend auf dem Datum.
 * Vereinfachte Berechnung: Der Mond durchläuft alle 12 Zeichen in ~29.5 Tagen,
 * also wechselt er ca. alle 2.46 Tage das Zeichen.
 */
interface ZodiacSign {
  name: string;
  symbol: string;
  element: string;
  qualitaet: string;
}

const TIERKREIS: ZodiacSign[] = [
  { name: "Widder", symbol: "♈", element: "Feuer", qualitaet: "Energie & Tatendrang" },
  { name: "Stier", symbol: "♉", element: "Erde", qualitaet: "Genuss & Beständigkeit" },
  { name: "Zwillinge", symbol: "♊", element: "Luft", qualitaet: "Kommunikation & Neugier" },
  { name: "Krebs", symbol: "♋", element: "Wasser", qualitaet: "Gefühl & Geborgenheit" },
  { name: "Löwe", symbol: "♌", element: "Feuer", qualitaet: "Selbstausdruck & Freude" },
  { name: "Jungfrau", symbol: "♍", element: "Erde", qualitaet: "Ordnung & Achtsamkeit" },
  { name: "Waage", symbol: "♎", element: "Luft", qualitaet: "Harmonie & Schönheit" },
  { name: "Skorpion", symbol: "♏", element: "Wasser", qualitaet: "Tiefe & Transformation" },
  { name: "Schütze", symbol: "♐", element: "Feuer", qualitaet: "Freiheit & Weisheit" },
  { name: "Steinbock", symbol: "♑", element: "Erde", qualitaet: "Disziplin & Struktur" },
  { name: "Wassermann", symbol: "♒", element: "Luft", qualitaet: "Innovation & Freigeist" },
  { name: "Fische", symbol: "♓", element: "Wasser", qualitaet: "Intuition & Mitgefühl" },
];

/**
 * Berechnet das ungefähre Tierkreiszeichen des Mondes.
 * Basiert auf dem synodischen Monat und einer Referenz-Position.
 * Referenz: Am 1. Jan 2026 00:00 UTC steht der Mond ungefähr im Krebs.
 */
export function getMoonZodiac(date: Date): ZodiacSign {
  const ref = new Date("2026-01-01T00:00:00Z");
  const daysSinceRef = (date.getTime() - ref.getTime()) / (24 * 60 * 60 * 1000);
  // Mond durchläuft alle 12 Zeichen in ~27.32 Tagen (siderischer Monat)
  const daysPerSign = 27.32 / 12; // ~2.28 Tage pro Zeichen
  // Referenz: 1. Jan 2026, Mond im Krebs (Index 3)
  const signIndex = Math.floor(((daysSinceRef / daysPerSign) + 3) % 12);
  return TIERKREIS[signIndex >= 0 ? signIndex : signIndex + 12];
}

/**
 * Berechnet die aktuelle Mondphase basierend auf exakten astronomischen Daten.
 * Verwendet alle 4 Hauptphasen (Neumond, Erstes Viertel, Vollmond, Letztes Viertel)
 * für maximale Genauigkeit.
 */
function getPhaseForDate(date: Date): MoonPhase {
  const now = date.getTime();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const HALF_DAY = 12 * 60 * 60 * 1000;

  // Prüfe ob wir nahe an einer Hauptphase sind (innerhalb 1 Tag)
  for (const vm of VOLLMONDE_2026) {
    if (Math.abs(vm.getTime() - now) < ONE_DAY) return MOON_PHASES[4]; // Vollmond
  }
  for (const nm of NEUMONDE_2026) {
    if (Math.abs(nm.getTime() - now) < ONE_DAY) return MOON_PHASES[0]; // Neumond
  }
  for (const ev of ERSTES_VIERTEL_2026) {
    if (Math.abs(ev.getTime() - now) < HALF_DAY) return MOON_PHASES[2]; // Erstes Viertel
  }
  for (const lv of LETZTES_VIERTEL_2026) {
    if (Math.abs(lv.getTime() - now) < HALF_DAY) return MOON_PHASES[6]; // Letztes Viertel
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
  const position = cycleLength > 0 ? elapsed / cycleLength : 0;

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

/**
 * Berechnet die ungefähre Beleuchtung des Mondes in Prozent.
 */
export function getMoonIllumination(date: Date): number {
  const now = date.getTime();

  let lastNeumond = NEUMONDE_2026[0];
  for (const nm of NEUMONDE_2026) {
    if (nm.getTime() <= now) lastNeumond = nm;
    else break;
  }

  let nextNeumond = NEUMONDE_2026[NEUMONDE_2026.length - 1];
  for (const nm of NEUMONDE_2026) {
    if (nm.getTime() > now) {
      nextNeumond = nm;
      break;
    }
  }

  const cycleLength = nextNeumond.getTime() - lastNeumond.getTime();
  const elapsed = now - lastNeumond.getTime();
  const position = cycleLength > 0 ? elapsed / cycleLength : 0;

  // Beleuchtung: 0 bei Neumond, 100 bei Vollmond, dann wieder 0
  return Math.round(Math.abs(Math.cos(position * Math.PI)) * -100 + 100);
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

/**
 * Formatiert ein Datum im deutschen Format mit Uhrzeit (MEZ/MESZ).
 */
export function formatMondDatum(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  });
}

/**
 * Gibt Info über auf-/absteigenden Mond zurück.
 * Aufsteigend: Schütze → Zwillinge (ca. 2 Wochen)
 * Absteigend: Zwillinge → Schütze (ca. 2 Wochen)
 */
/**
 * Gibt zurück ob der Mond zunimmt (true) oder abnimmt (false).
 */
export function isMoonWaxing(date: Date): boolean {
  const phase = getMoonPhaseForDate(date);
  return ["Neumond", "Zunehmende Sichel", "Erstes Viertel", "Zunehmender Mond"].includes(phase.name);
}

export function getMoonDirection(date: Date): "aufsteigend" | "absteigend" {
  const zodiac = getMoonZodiac(date);
  // Aufsteigende Zeichen: Schütze, Steinbock, Wassermann, Fische, Widder, Stier, Zwillinge
  const aufsteigend = ["Schütze", "Steinbock", "Wassermann", "Fische", "Widder", "Stier"];
  return aufsteigend.includes(zodiac.name) ? "aufsteigend" : "absteigend";
}
