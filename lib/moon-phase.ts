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
 * Tierkreiszeichen des Mondes.
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

function findTierkreis(name: string): ZodiacSign {
  return TIERKREIS.find(t => t.name === name) || TIERKREIS[0];
}

/**
 * ============================================================
 * EXAKTE TIERKREISZEICHEN FÜR ALLE HAUPTPHASEN 2026
 * Quelle: astro-seek.com + cafeastrology.com (verifiziert 26.02.2026)
 * Key = UTC ISO-Datum-String der Phase → Tierkreiszeichen-Name
 * ============================================================
 */
const HAUPTPHASEN_TIERKREIS: Record<string, string> = {
  // ── Vollmonde 2026 ──
  "2026-01-03T10:02:00Z": "Krebs",
  "2026-02-01T22:09:00Z": "Löwe",
  "2026-03-03T11:37:00Z": "Jungfrau",
  "2026-04-02T02:11:00Z": "Waage",
  "2026-05-01T17:23:00Z": "Skorpion",
  "2026-05-31T08:45:00Z": "Schütze",
  "2026-06-29T23:56:00Z": "Steinbock",
  "2026-07-29T14:35:00Z": "Wassermann",
  "2026-08-28T04:18:00Z": "Fische",
  "2026-09-26T16:49:00Z": "Widder",
  "2026-10-26T04:11:00Z": "Stier",
  "2026-11-24T14:53:00Z": "Zwillinge",
  "2026-12-24T01:28:00Z": "Krebs",
  // ── Neumonde 2026 ──
  "2026-01-18T19:51:00Z": "Steinbock",
  "2026-02-17T12:01:00Z": "Wassermann",  // ← NICHT Fische!
  "2026-03-19T01:23:00Z": "Fische",
  "2026-04-17T11:51:00Z": "Widder",
  "2026-05-16T20:01:00Z": "Stier",
  "2026-06-15T02:54:00Z": "Zwillinge",
  "2026-07-14T09:43:00Z": "Krebs",
  "2026-08-12T17:36:00Z": "Löwe",
  "2026-09-11T03:26:00Z": "Jungfrau",
  "2026-10-10T15:50:00Z": "Waage",
  "2026-11-09T07:02:00Z": "Skorpion",
  "2026-12-09T00:51:00Z": "Schütze",
  // ── Erstes Viertel 2026 ──
  "2026-01-26T04:47:00Z": "Stier",
  "2026-02-24T12:27:00Z": "Zwillinge",
  "2026-03-25T19:17:00Z": "Krebs",
  "2026-04-24T02:31:00Z": "Löwe",
  "2026-05-23T11:10:00Z": "Jungfrau",
  "2026-06-21T21:55:00Z": "Waage",
  "2026-07-21T11:05:00Z": "Waage",
  "2026-08-20T02:46:00Z": "Skorpion",
  "2026-09-18T20:43:00Z": "Schütze",
  "2026-10-18T16:12:00Z": "Steinbock",
  "2026-11-17T11:47:00Z": "Wassermann",
  "2026-12-17T05:42:00Z": "Fische",
  // ── Letztes Viertel 2026 ──
  "2026-01-10T15:48:00Z": "Waage",
  "2026-02-09T12:43:00Z": "Skorpion",
  "2026-03-11T09:38:00Z": "Schütze",
  "2026-04-10T04:51:00Z": "Steinbock",
  "2026-05-09T21:10:00Z": "Wassermann",
  "2026-06-08T10:00:00Z": "Fische",
  "2026-07-07T19:29:00Z": "Widder",
  "2026-08-06T02:21:00Z": "Stier",
  "2026-09-04T07:51:00Z": "Zwillinge",
  "2026-10-03T13:25:00Z": "Krebs",
  "2026-11-01T20:28:00Z": "Löwe",
  "2026-12-01T06:08:00Z": "Jungfrau",
  "2026-12-30T18:59:00Z": "Waage",
};

/**
 * Gibt das exakte Tierkreiszeichen für eine Hauptphase zurück.
 * Für Hauptphasen-Daten wird die verifizierte Lookup-Tabelle verwendet.
 * Für andere Daten wird eine Interpolation basierend auf den nächsten Hauptphasen berechnet.
 */
export function getMoonZodiac(date: Date): ZodiacSign {
  // Exakte Lookup für Hauptphasen
  const isoKey = date.toISOString().replace(".000Z", "Z");
  const exakt = HAUPTPHASEN_TIERKREIS[isoKey];
  if (exakt) return findTierkreis(exakt);

  // Für andere Daten: finde die nächstgelegene Hauptphase
  const allKeys = Object.keys(HAUPTPHASEN_TIERKREIS);
  let closest = allKeys[0];
  let closestDiff = Math.abs(date.getTime() - new Date(allKeys[0]).getTime());
  for (const key of allKeys) {
    const diff = Math.abs(date.getTime() - new Date(key).getTime());
    if (diff < closestDiff) { closestDiff = diff; closest = key; }
  }
  // Wenn innerhalb 2 Tage einer Hauptphase, verwende deren Zeichen
  if (closestDiff < 2 * 24 * 60 * 60 * 1000) {
    return findTierkreis(HAUPTPHASEN_TIERKREIS[closest]);
  }
  // Fallback: Interpolation basierend auf siderischem Monat
  const ref = new Date("2026-01-01T00:00:00Z");
  const daysSinceRef = (date.getTime() - ref.getTime()) / (24 * 60 * 60 * 1000);
  const daysPerSign = 27.32 / 12;
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
  const aufsteigend = ["Schütze", "Steinbock", "Wassermann", "Fische", "Widder", "Stier"];
  return aufsteigend.includes(zodiac.name) ? "aufsteigend" : "absteigend";
}

/**
 * Gibt alle exakten Hauptphasen-Daten zurück (wie MoonWorx).
 * Sortiert nach Datum, mit Phase-Name und Uhrzeit.
 */
export interface ExaktePhase {
  datum: Date;
  name: string;
  emoji: string;
}

export function getExakteHauptphasen(): ExaktePhase[] {
  const phasen: ExaktePhase[] = [];
  for (const d of NEUMONDE_2026) phasen.push({ datum: d, name: "Neumond", emoji: "🌑" });
  for (const d of ERSTES_VIERTEL_2026) phasen.push({ datum: d, name: "Erstes Viertel", emoji: "🌓" });
  for (const d of VOLLMONDE_2026) phasen.push({ datum: d, name: "Vollmond", emoji: "🌕" });
  for (const d of LETZTES_VIERTEL_2026) phasen.push({ datum: d, name: "Letztes Viertel", emoji: "🌗" });
  phasen.sort((a, b) => a.datum.getTime() - b.datum.getTime());
  return phasen;
}

/**
 * Gibt die nächsten N exakten Hauptphasen ab einem Datum zurück.
 */
export function getNextExaktePhasen(fromDate: Date, count: number = 8): ExaktePhase[] {
  const alle = getExakteHauptphasen();
  const now = fromDate.getTime();
  const upcoming = alle.filter(p => p.datum.getTime() > now);
  return upcoming.slice(0, count);
}

/**
 * Gibt den nächsten Vollmond AB einem bestimmten Datum zurück.
 */
export function getNextVollmondFromDate(date: Date): Date {
  const t = date.getTime();
  for (const vm of VOLLMONDE_2026) {
    if (vm.getTime() > t) return vm;
  }
  return VOLLMONDE_2026[VOLLMONDE_2026.length - 1];
}

/**
 * Gibt den nächsten Neumond AB einem bestimmten Datum zurück.
 */
export function getNextNeumondFromDate(date: Date): Date {
  const t = date.getTime();
  for (const nm of NEUMONDE_2026) {
    if (nm.getTime() > t) return nm;
  }
  return NEUMONDE_2026[NEUMONDE_2026.length - 1];
}

/**
 * Prüft ob ein bestimmter Tag ein Hauptphasen-Tag ist.
 * Gibt die ExaktePhase zurück oder null.
 */
export function getExaktePhaseForDate(date: Date): ExaktePhase | null {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  
  const alle = getExakteHauptphasen();
  for (const p of alle) {
    const pLocal = new Date(p.datum.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
    if (pLocal >= dayStart && pLocal <= dayEnd) return p;
  }
  return null;
}

/**
 * Gibt das Emoji für eine Beleuchtung und Richtung zurück.
 */
export function getMoonEmoji(date: Date): string {
  const phase = getMoonPhaseForDate(date);
  return phase.emoji;
}
