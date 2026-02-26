import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMoonPhaseForDate, getMoonIllumination, getMoonZodiac, isMoonWaxing } from "./moon-phase";

// ── Datenmodell ──

export interface ZyklusEinstellungen {
  letztePeriodenStart: string; // ISO date string
  zyklusLaenge: number; // Tage (Standard: 28)
  periodenDauer: number; // Tage (Standard: 5)
}

export type ZyklusPhaseName = "menstruation" | "follikel" | "eisprung" | "luteal";

export interface ZyklusPhase {
  name: ZyklusPhaseName;
  label: string;
  emoji: string;
  farbe: string;
  beschreibung: string;
  startTag: number; // Tag im Zyklus (1-basiert)
  endTag: number;
}

export interface ZyklusTag {
  datum: Date;
  zyklusTag: number; // 1-basiert
  phase: ZyklusPhase;
  mondphase: string;
  mondEmoji: string;
  mondBeleuchtung: number;
  mondZeichen: string;
  mondZeichenSymbol: string;
  mondZunehmend: boolean;
  synchronisation: "harmonisch" | "neutral" | "gegenläufig";
  synchronisationTipp: string;
}

export interface ZyklusUebersicht {
  aktuellerTag: number;
  aktuellePhase: ZyklusPhase;
  naechstePhase: ZyklusPhase;
  tageZurNaechstenPhase: number;
  naechstePeriode: Date;
  tageZurNaechstenPeriode: number;
  fruchtbareFensterStart: Date;
  fruchtbareFensterEnde: Date;
}

// ── Zyklusphasen-Definition ──

function getZyklusPhasen(zyklusLaenge: number, periodenDauer: number): ZyklusPhase[] {
  const eisprungTag = Math.round(zyklusLaenge / 2); // ca. Tag 14 bei 28-Tage-Zyklus
  const follikelStart = periodenDauer + 1;
  const eisprungStart = eisprungTag - 1;
  const eisprungEnde = eisprungTag + 1;
  const lutealStart = eisprungEnde + 1;

  return [
    {
      name: "menstruation",
      label: "Menstruation",
      emoji: "🩸",
      farbe: "#E74C3C",
      beschreibung: "Rückzug und Erneuerung",
      startTag: 1,
      endTag: periodenDauer,
    },
    {
      name: "follikel",
      label: "Follikelphase",
      emoji: "🌱",
      farbe: "#27AE60",
      beschreibung: "Aufbruch und neue Energie",
      startTag: follikelStart,
      endTag: eisprungStart - 1,
    },
    {
      name: "eisprung",
      label: "Eisprung",
      emoji: "🌸",
      farbe: "#F39C12",
      beschreibung: "Höhepunkt und Ausstrahlung",
      startTag: eisprungStart,
      endTag: eisprungEnde,
    },
    {
      name: "luteal",
      label: "Lutealphase",
      emoji: "🍂",
      farbe: "#8E44AD",
      beschreibung: "Reflexion und Loslassen",
      startTag: lutealStart,
      endTag: zyklusLaenge,
    },
  ];
}

// ── Berechnungen ──

function getZyklusTag(datum: Date, letztePeriodenStart: Date, zyklusLaenge: number): number {
  const diffMs = datum.getTime() - letztePeriodenStart.getTime();
  const diffTage = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  // Modulo für wiederkehrenden Zyklus
  let tag = (diffTage % zyklusLaenge) + 1;
  if (tag <= 0) tag += zyklusLaenge;
  return tag;
}

function getPhaseForTag(tag: number, phasen: ZyklusPhase[]): ZyklusPhase {
  for (const phase of phasen) {
    if (tag >= phase.startTag && tag <= phase.endTag) {
      return phase;
    }
  }
  return phasen[phasen.length - 1]; // Fallback: Lutealphase
}

function getSynchronisation(
  zyklusPhase: ZyklusPhaseName,
  mondphase: string
): { typ: "harmonisch" | "neutral" | "gegenläufig"; tipp: string } {
  // Harmonische Kombinationen (Mond und Zyklus in Einklang)
  const harmonisch: Record<string, string[]> = {
    menstruation: ["Neumond", "Abnehmende Sichel"],
    follikel: ["Zunehmende Sichel", "Erstes Viertel"],
    eisprung: ["Vollmond", "Zunehmender Mond"],
    luteal: ["Abnehmender Mond", "Letztes Viertel"],
  };

  const tipps: Record<string, Record<string, string>> = {
    menstruation: {
      harmonisch: "Dein Zyklus ist im Einklang mit dem Mond. Nutze die doppelte Rückzugsenergie für tiefe Innenschau und Regeneration.",
      neutral: "Dein Körper ruht, während der Mond aktiv ist. Lass dich nicht von äußerer Energie mitreißen – deine Ruhe hat Vorrang.",
      "gegenläufig": "Vollmond-Energie trifft auf Menstruation. Das kann intensiv sein. Nutze die Klarheit des Vollmonds, um loszulassen.",
    },
    follikel: {
      harmonisch: "Perfekte Synergie! Der zunehmende Mond unterstützt deinen Aufbruch. Starte jetzt neue Projekte mit voller Kraft.",
      neutral: "Deine Energie steigt unabhängig vom Mond. Nutze deine innere Kraft und vertraue deinem eigenen Rhythmus.",
      "gegenläufig": "Der Mond nimmt ab, aber deine Energie steigt. Nutze diese Gegensätzlichkeit für bewusstes Loslassen alter Muster.",
    },
    eisprung: {
      harmonisch: "Maximale Kraft! Vollmond und Eisprung zusammen – du strahlst und manifestierst. Nutze diese magische Zeit bewusst.",
      neutral: "Deine Ausstrahlung ist stark, auch wenn der Mond nicht voll ist. Vertraue deiner inneren Leuchtkraft.",
      "gegenläufig": "Neumond trifft auf Eisprung. Deine äußere Kraft ist stark, aber der Mond lädt zur Stille ein. Balance finden.",
    },
    luteal: {
      harmonisch: "Mond und Zyklus laden gemeinsam zum Rückzug ein. Perfekt für Reflexion, Räuchern und Loslassen.",
      neutral: "Dein Körper bereitet sich auf die Ruhe vor. Ehre diesen Übergang und setze bewusst Grenzen.",
      "gegenläufig": "Der Mond wächst, aber dein Körper zieht sich zurück. Lass dich nicht unter Druck setzen – dein Rhythmus zählt.",
    },
  };

  const isHarmonisch = harmonisch[zyklusPhase]?.includes(mondphase);
  const isGegenlaefig =
    (zyklusPhase === "menstruation" && ["Vollmond", "Zunehmender Mond"].includes(mondphase)) ||
    (zyklusPhase === "eisprung" && ["Neumond", "Abnehmende Sichel"].includes(mondphase)) ||
    (zyklusPhase === "follikel" && ["Abnehmender Mond", "Letztes Viertel"].includes(mondphase)) ||
    (zyklusPhase === "luteal" && ["Zunehmende Sichel", "Erstes Viertel"].includes(mondphase));

  const typ = isHarmonisch ? "harmonisch" : isGegenlaefig ? "gegenläufig" : "neutral";
  const tipp = tipps[zyklusPhase]?.[typ] || "Beobachte deinen Körper und vertraue deinem inneren Rhythmus.";

  return { typ, tipp };
}

// ── Öffentliche API ──

export function berechneZyklusTag(
  datum: Date,
  einstellungen: ZyklusEinstellungen
): ZyklusTag {
  const letztePeriodenStart = new Date(einstellungen.letztePeriodenStart);
  const phasen = getZyklusPhasen(einstellungen.zyklusLaenge, einstellungen.periodenDauer);
  const zyklusTag = getZyklusTag(datum, letztePeriodenStart, einstellungen.zyklusLaenge);
  const phase = getPhaseForTag(zyklusTag, phasen);
  
  const mondphase = getMoonPhaseForDate(datum);
  const beleuchtung = getMoonIllumination(datum);
  const zodiac = getMoonZodiac(datum);
  const zunehmend = isMoonWaxing(datum);
  const sync = getSynchronisation(phase.name, mondphase.name);

  return {
    datum,
    zyklusTag,
    phase,
    mondphase: mondphase.name,
    mondEmoji: mondphase.emoji,
    mondBeleuchtung: beleuchtung,
    mondZeichen: zodiac.name,
    mondZeichenSymbol: zodiac.symbol,
    mondZunehmend: zunehmend,
    synchronisation: sync.typ,
    synchronisationTipp: sync.tipp,
  };
}

export function berechneZyklusUebersicht(
  datum: Date,
  einstellungen: ZyklusEinstellungen
): ZyklusUebersicht {
  const letztePeriodenStart = new Date(einstellungen.letztePeriodenStart);
  const phasen = getZyklusPhasen(einstellungen.zyklusLaenge, einstellungen.periodenDauer);
  const zyklusTag = getZyklusTag(datum, letztePeriodenStart, einstellungen.zyklusLaenge);
  const aktuellePhase = getPhaseForTag(zyklusTag, phasen);
  
  // Nächste Phase berechnen
  const aktuellerIndex = phasen.findIndex(p => p.name === aktuellePhase.name);
  const naechsterIndex = (aktuellerIndex + 1) % phasen.length;
  const naechstePhase = phasen[naechsterIndex];
  const tageZurNaechstenPhase = aktuellePhase.endTag - zyklusTag + 1;

  // Nächste Periode berechnen
  const tageBisNaechstePeriode = einstellungen.zyklusLaenge - zyklusTag + 1;
  const naechstePeriode = new Date(datum);
  naechstePeriode.setDate(naechstePeriode.getDate() + tageBisNaechstePeriode);
  
  // Fruchtbares Fenster (ca. 5 Tage vor Eisprung bis 1 Tag danach)
  const eisprungTag = Math.round(einstellungen.zyklusLaenge / 2);
  const tageZumEisprung = eisprungTag - zyklusTag;
  const fruchtbarStart = new Date(datum);
  fruchtbarStart.setDate(fruchtbarStart.getDate() + tageZumEisprung - 4);
  const fruchtbarEnde = new Date(datum);
  fruchtbarEnde.setDate(fruchtbarEnde.getDate() + tageZumEisprung + 1);

  return {
    aktuellerTag: zyklusTag,
    aktuellePhase,
    naechstePhase,
    tageZurNaechstenPhase,
    naechstePeriode,
    tageZurNaechstenPeriode: tageBisNaechstePeriode,
    fruchtbareFensterStart: fruchtbarStart,
    fruchtbareFensterEnde: fruchtbarEnde,
  };
}

export function berechneZyklusKalender(
  startDatum: Date,
  anzahlTage: number,
  einstellungen: ZyklusEinstellungen
): ZyklusTag[] {
  const tage: ZyklusTag[] = [];
  for (let i = 0; i < anzahlTage; i++) {
    const d = new Date(startDatum);
    d.setDate(d.getDate() + i);
    tage.push(berechneZyklusTag(d, einstellungen));
  }
  return tage;
}

// ── Persistenz ──

const STORAGE_KEY = "seelenplanerin_zyklus";

export async function speichereZyklusEinstellungen(einstellungen: ZyklusEinstellungen): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(einstellungen));
}

export async function ladeZyklusEinstellungen(): Promise<ZyklusEinstellungen | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return null;
}

export function getDefaultEinstellungen(): ZyklusEinstellungen {
  const heute = new Date();
  return {
    letztePeriodenStart: heute.toISOString().split("T")[0],
    zyklusLaenge: 28,
    periodenDauer: 5,
  };
}
