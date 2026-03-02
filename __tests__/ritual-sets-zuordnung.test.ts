import { describe, it, expect } from "vitest";

// Die 10 Tentary-Links
const TENTARY_LINKS = {
  schutz: "https://dieseelenplanerin.tentary.com/p/OX0aPw",
  selbstliebe: "https://dieseelenplanerin.tentary.com/p/QtLnrA",
  fuelle: "https://dieseelenplanerin.tentary.com/p/QjvV1I",
  transformation: "https://dieseelenplanerin.tentary.com/p/sGn2aD",
  kraft: "https://dieseelenplanerin.tentary.com/p/BQ7sqg",
  intuition: "https://dieseelenplanerin.tentary.com/p/tfehqK",
  neuanfang: "https://dieseelenplanerin.tentary.com/p/QFEH0i",
  erdung: "https://dieseelenplanerin.tentary.com/p/VN9WOT",
  lebensfreude: "https://dieseelenplanerin.tentary.com/p/gFloc9",
  heilung: "https://dieseelenplanerin.tentary.com/p/f9A55Q",
};

const SET_MATERIALIEN = {
  schutz: ["Schwarzer Turmalin", "Bergkristall", "Weißer Salbei", "Schwarze Kerze"],
  selbstliebe: ["Rosenquarz", "Mondstein", "Myrrhe", "Rosa Kerze"],
  fuelle: ["Citrin", "Pyrit", "Weihrauch", "Goldene Kerze"],
  transformation: ["Labradorit", "Amethyst", "Palo Santo", "Violette Kerze"],
  kraft: ["Karneol", "Sonnenstein", "Weihrauch", "Rote Kerze"],
  intuition: ["Amethyst", "Mondstein", "Myrrhe", "Weiße Kerze"],
  neuanfang: ["Bergkristall", "Citrin", "Weißer Salbei", "Gelbe Kerze"],
  erdung: ["Schwarzer Turmalin", "Karneol", "Palo Santo", "Braune Kerze"],
  lebensfreude: ["Sonnenstein", "Karneol", "Weihrauch", "Orange Kerze"],
  heilung: ["Rosenquarz", "Amethyst", "Palo Santo", "Grüne Kerze"],
};

// Alle erlaubten Links
const VALID_LINKS = Object.values(TENTARY_LINKS);

// Alle erlaubten Materialien-Sets
const VALID_MATERIALIEN_SETS = Object.values(SET_MATERIALIEN).map(m => JSON.stringify(m.sort()));

describe("Ritual-Set-Zuordnung", () => {
  // Dynamisch importieren um TypeScript-Probleme zu vermeiden
  it("sollte die Rituale-Datei laden können", async () => {
    const { RITUALE_2026 } = await import("../data/rituale-kalender");
    expect(RITUALE_2026).toBeDefined();
    expect(RITUALE_2026.length).toBeGreaterThanOrEqual(51);
  });

  it("jedes Ritual sollte einen gültigen Tentary-Link haben", async () => {
    const { RITUALE_2026 } = await import("../data/rituale-kalender");
    for (const ritual of RITUALE_2026) {
      expect(
        VALID_LINKS,
        `Ritual "${ritual.titel}" (${ritual.id}) hat ungültigen shopUrl: ${ritual.shopUrl}`
      ).toContain(ritual.shopUrl);
    }
  });

  it("kein Ritual sollte den alten generischen Link haben", async () => {
    const { RITUALE_2026 } = await import("../data/rituale-kalender");
    for (const ritual of RITUALE_2026) {
      expect(ritual.shopUrl).not.toContain("qnl3vN");
      expect(ritual.shopUrl).not.toContain("gGmtFy");
    }
  });

  it("jedes Ritual sollte genau 4 Materialien haben (passend zum Set)", async () => {
    const { RITUALE_2026 } = await import("../data/rituale-kalender");
    for (const ritual of RITUALE_2026) {
      expect(
        ritual.materialien.length,
        `Ritual "${ritual.titel}" (${ritual.id}) hat ${ritual.materialien.length} Materialien statt 4`
      ).toBe(4);
    }
  });

  it("die Materialien jedes Rituals sollten einem der 10 Sets entsprechen", async () => {
    const { RITUALE_2026 } = await import("../data/rituale-kalender");
    for (const ritual of RITUALE_2026) {
      const sortedMat = JSON.stringify([...ritual.materialien].sort());
      expect(
        VALID_MATERIALIEN_SETS,
        `Ritual "${ritual.titel}" (${ritual.id}) hat unbekannte Materialien: ${ritual.materialien.join(", ")}`
      ).toContain(sortedMat);
    }
  });

  it("Materialien und shopUrl sollten konsistent sein (gleiches Set)", async () => {
    const { RITUALE_2026 } = await import("../data/rituale-kalender");
    
    // Erstelle Mapping: Link -> erwartete Materialien
    const linkToMat: Record<string, string[]> = {};
    for (const [key, link] of Object.entries(TENTARY_LINKS)) {
      linkToMat[link] = SET_MATERIALIEN[key as keyof typeof SET_MATERIALIEN];
    }
    
    for (const ritual of RITUALE_2026) {
      const expectedMat = linkToMat[ritual.shopUrl];
      if (expectedMat) {
        const sortedActual = JSON.stringify([...ritual.materialien].sort());
        const sortedExpected = JSON.stringify([...expectedMat].sort());
        expect(
          sortedActual,
          `Ritual "${ritual.titel}" (${ritual.id}): Materialien passen nicht zum shopUrl`
        ).toBe(sortedExpected);
      }
    }
  });
});
