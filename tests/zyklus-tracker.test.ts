import { describe, it, expect } from "vitest";
import {
  berechneZyklusTag,
  berechneZyklusUebersicht,
  berechneZyklusKalender,
  getDefaultEinstellungen,
  datumZuString,
  STIMMUNGEN,
  KOERPER_SYMPTOME,
  BLUTUNGS_OPTIONEN,
  ZyklusEinstellungen,
} from "../lib/zyklus-tracker";

describe("Zyklustracking", () => {
  const einstellungen: ZyklusEinstellungen = {
    letztePeriodenStart: "2026-02-10",
    zyklusLaenge: 28,
    periodenDauer: 5,
  };

  it("berechnet Zyklustag korrekt", () => {
    // Tag 1 = 10. Feb
    const tag1 = berechneZyklusTag(new Date(2026, 1, 10), einstellungen);
    expect(tag1.zyklusTag).toBe(1);
    expect(tag1.phase.name).toBe("menstruation");

    // Tag 5 = 14. Feb (letzter Menstruationstag)
    const tag5 = berechneZyklusTag(new Date(2026, 1, 14), einstellungen);
    expect(tag5.zyklusTag).toBe(5);
    expect(tag5.phase.name).toBe("menstruation");

    // Tag 6 = 15. Feb (Follikelphase)
    const tag6 = berechneZyklusTag(new Date(2026, 1, 15), einstellungen);
    expect(tag6.zyklusTag).toBe(6);
    expect(tag6.phase.name).toBe("follikel");
  });

  it("berechnet Eisprung korrekt (ca. Tag 14)", () => {
    // Tag 14 = 23. Feb (Eisprung bei 28-Tage-Zyklus)
    const tag14 = berechneZyklusTag(new Date(2026, 1, 23), einstellungen);
    expect(tag14.zyklusTag).toBe(14);
    expect(tag14.phase.name).toBe("eisprung");
  });

  it("berechnet Lutealphase korrekt", () => {
    // Tag 16 = 25. Feb (Lutealphase)
    const tag16 = berechneZyklusTag(new Date(2026, 1, 25), einstellungen);
    expect(tag16.zyklusTag).toBe(16);
    expect(tag16.phase.name).toBe("luteal");
  });

  it("Zyklus wiederholt sich nach Zykluslänge", () => {
    // Tag 29 = 10. März = neuer Zyklus Tag 1
    const tag29 = berechneZyklusTag(new Date(2026, 2, 10), einstellungen);
    expect(tag29.zyklusTag).toBe(1);
    expect(tag29.phase.name).toBe("menstruation");
  });

  it("enthält Mondphasen-Daten", () => {
    const tag = berechneZyklusTag(new Date(2026, 1, 25), einstellungen);
    expect(tag.mondphase).toBeTruthy();
    expect(tag.mondBeleuchtung).toBeGreaterThanOrEqual(0);
    expect(tag.mondBeleuchtung).toBeLessThanOrEqual(100);
    expect(tag.mondZeichen).toBeTruthy();
  });

  it("berechnet Synchronisation", () => {
    const tag = berechneZyklusTag(new Date(2026, 1, 25), einstellungen);
    expect(["harmonisch", "neutral", "gegenläufig"]).toContain(tag.synchronisation);
    expect(tag.synchronisationTipp).toBeTruthy();
    expect(tag.synchronisationTipp.length).toBeGreaterThan(10);
  });

  it("berechnet Zyklusübersicht korrekt", () => {
    const uebersicht = berechneZyklusUebersicht(new Date(2026, 1, 25), einstellungen);
    expect(uebersicht.aktuellerTag).toBe(16);
    expect(uebersicht.aktuellePhase.name).toBe("luteal");
    expect(uebersicht.tageZurNaechstenPeriode).toBeGreaterThan(0);
    expect(uebersicht.naechstePeriode).toBeInstanceOf(Date);
  });

  it("berechnet 30-Tage-Kalender", () => {
    const kalender = berechneZyklusKalender(new Date(2026, 1, 25), 30, einstellungen);
    expect(kalender).toHaveLength(30);
    // Jeder Tag hat alle Felder
    kalender.forEach((tag) => {
      expect(tag.datum).toBeInstanceOf(Date);
      expect(tag.zyklusTag).toBeGreaterThan(0);
      expect(tag.phase).toBeTruthy();
      expect(tag.mondphase).toBeTruthy();
    });
  });

  it("Default-Einstellungen sind gültig", () => {
    const defaults = getDefaultEinstellungen();
    expect(defaults.zyklusLaenge).toBe(28);
    expect(defaults.periodenDauer).toBe(5);
    expect(defaults.letztePeriodenStart).toBeTruthy();
  });
});

describe("Symptom-Tracking Datenmodell", () => {
  it("hat alle Stimmungstypen definiert", () => {
    expect(STIMMUNGEN.length).toBeGreaterThanOrEqual(6);
    STIMMUNGEN.forEach((s) => {
      expect(s.typ).toBeDefined();
      expect(s.label).toBeDefined();
      expect(s.emoji).toBeDefined();
    });
  });

  it("hat körperliche Symptome definiert", () => {
    expect(KOERPER_SYMPTOME.length).toBeGreaterThanOrEqual(8);
    expect(KOERPER_SYMPTOME).toContain("Krämpfe");
    expect(KOERPER_SYMPTOME).toContain("Kopfschmerzen");
  });

  it("hat Blutungsoptionen definiert", () => {
    expect(BLUTUNGS_OPTIONEN.length).toBe(4);
    const typen = BLUTUNGS_OPTIONEN.map(b => b.typ);
    expect(typen).toContain("leicht");
    expect(typen).toContain("mittel");
    expect(typen).toContain("stark");
    expect(typen).toContain("schmierblutung");
  });
});

describe("Hilfsfunktionen", () => {
  it("datumZuString formatiert korrekt", () => {
    const d = new Date("2026-03-15T14:30:00");
    const str = datumZuString(d);
    expect(str).toBe("2026-03-15");
  });
});
