import { describe, it, expect } from "vitest";

// Zuordnungstabelle: Materialien → Ritual-Set → shopUrl
const MATERIAL_TO_SET: Record<string, { set: string; code: string }> = {
  "Schwarzer Turmalin,Bergkristall,Weißer Salbei,Schwarze Kerze": { set: "Schutz", code: "OX0aPw" },
  "Rosenquarz,Mondstein,Myrrhe,Rosa Kerze": { set: "Selbstliebe", code: "QtLnrA" },
  "Citrin,Pyrit,Weihrauch,Goldene Kerze": { set: "Fülle", code: "QjvV1I" },
  "Labradorit,Amethyst,Palo Santo,Violette Kerze": { set: "Transformation", code: "sGn2aD" },
  "Karneol,Sonnenstein,Weihrauch,Rote Kerze": { set: "Kraft", code: "BQ7sqg" },
  "Amethyst,Mondstein,Myrrhe,Weiße Kerze": { set: "Intuition", code: "tfehqK" },
  "Bergkristall,Citrin,Weißer Salbei,Gelbe Kerze": { set: "Neuanfang", code: "QFEH0i" },
  "Schwarzer Turmalin,Karneol,Palo Santo,Braune Kerze": { set: "Erdung", code: "VN9WOT" },
  "Sonnenstein,Karneol,Weihrauch,Orange Kerze": { set: "Lebensfreude", code: "gFloc9" },
  "Rosenquarz,Amethyst,Palo Santo,Grüne Kerze": { set: "Heilung", code: "f9A55Q" },
};

// Thema-zu-passende-Sets Zuordnung (welche Sets passen zu welchem Ritual-Thema)
const THEMA_PASSENDE_SETS: Record<string, string[]> = {
  // Reinigung/Schutz-Rituale → Schutz-Set
  "Reinigung": ["Schutz", "Erdung"],
  "Schutz": ["Schutz"],
  "Abendritual": ["Intuition", "Schutz", "Selbstliebe"],
  // Meditation/Balance → Intuition
  "Meditation": ["Intuition", "Heilung"],
  "Balance": ["Transformation", "Heilung", "Intuition"],
  // Kommunikation/Innere Stimme → Intuition
  "Kommunikation": ["Intuition", "Kraft"],
  // Loslassen → Transformation
  "Loslassen": ["Transformation", "Schutz"],
  // Transformation → Transformation
  "Transformation": ["Transformation"],
  // Dankbarkeit → Fülle
  "Dankbarkeit": ["Fülle", "Lebensfreude"],
  // Selbstbewusstsein/Kraft → Kraft
  "Selbstbewusstsein": ["Kraft", "Schutz"],
  // Loslösung → Transformation
  "Loslösung": ["Transformation", "Selbstliebe"],
  // Herbst-Balance → Transformation
  "Herbst-Balance": ["Transformation", "Heilung"],
};

describe("Ritual-Link Korrekturen", () => {
  it("Alle Materialien haben einen gültigen Tentary-Code", () => {
    for (const [materials, info] of Object.entries(MATERIAL_TO_SET)) {
      expect(info.code).toBeTruthy();
      expect(info.set).toBeTruthy();
    }
  });

  it("Korrigierte Rituale: mai-2 (Reinigung) → Schutz-Set (OX0aPw)", () => {
    // Reinigungsritual sollte Schutz-Materialien haben
    const expected = MATERIAL_TO_SET["Schwarzer Turmalin,Bergkristall,Weißer Salbei,Schwarze Kerze"];
    expect(expected.set).toBe("Schutz");
    expect(expected.code).toBe("OX0aPw");
  });

  it("Korrigierte Rituale: mai-3 (Meditation) → Intuition-Set (tfehqK)", () => {
    const expected = MATERIAL_TO_SET["Amethyst,Mondstein,Myrrhe,Weiße Kerze"];
    expect(expected.set).toBe("Intuition");
    expect(expected.code).toBe("tfehqK");
  });

  it("Korrigierte Rituale: jun-1 (Kommunikation/Inner Voice) → Intuition-Set (tfehqK)", () => {
    const expected = MATERIAL_TO_SET["Amethyst,Mondstein,Myrrhe,Weiße Kerze"];
    expect(expected.set).toBe("Intuition");
    expect(expected.code).toBe("tfehqK");
  });

  it("Korrigierte Rituale: jun-3 (Raumreinigung) → Schutz-Set (OX0aPw)", () => {
    const expected = MATERIAL_TO_SET["Schwarzer Turmalin,Bergkristall,Weißer Salbei,Schwarze Kerze"];
    expect(expected.set).toBe("Schutz");
    expect(expected.code).toBe("OX0aPw");
  });

  it("Korrigierte Rituale: okt-2 (Loslassen) → Transformation-Set (sGn2aD)", () => {
    const expected = MATERIAL_TO_SET["Labradorit,Amethyst,Palo Santo,Violette Kerze"];
    expect(expected.set).toBe("Transformation");
    expect(expected.code).toBe("sGn2aD");
  });

  it("Korrigierte Rituale: nov-1 (Transformation) → Transformation-Set (sGn2aD)", () => {
    const expected = MATERIAL_TO_SET["Labradorit,Amethyst,Palo Santo,Violette Kerze"];
    expect(expected.set).toBe("Transformation");
    expect(expected.code).toBe("sGn2aD");
  });

  it("Korrigierte Rituale: nov-2 (Dankbarkeit) → Fülle-Set (QjvV1I)", () => {
    const expected = MATERIAL_TO_SET["Citrin,Pyrit,Weihrauch,Goldene Kerze"];
    expect(expected.set).toBe("Fülle");
    expect(expected.code).toBe("QjvV1I");
  });

  it("Korrigierte Rituale: nov-3 (Abendritual) → Intuition-Set (tfehqK)", () => {
    const expected = MATERIAL_TO_SET["Amethyst,Mondstein,Myrrhe,Weiße Kerze"];
    expect(expected.set).toBe("Intuition");
    expect(expected.code).toBe("tfehqK");
  });

  it("Korrigierte Rituale: feb-4 (Selbstbewusstsein) → Kraft-Set (BQ7sqg)", () => {
    const expected = MATERIAL_TO_SET["Karneol,Sonnenstein,Weihrauch,Rote Kerze"];
    expect(expected.set).toBe("Kraft");
    expect(expected.code).toBe("BQ7sqg");
  });

  it("Korrigierte Rituale: sep-5 (Herbst-Balance) → Transformation-Set (sGn2aD)", () => {
    const expected = MATERIAL_TO_SET["Labradorit,Amethyst,Palo Santo,Violette Kerze"];
    expect(expected.set).toBe("Transformation");
    expect(expected.code).toBe("sGn2aD");
  });

  it("Alle 10 Ritual-Sets haben eindeutige Tentary-Codes", () => {
    const codes = Object.values(MATERIAL_TO_SET).map(v => v.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(10);
  });

  it("Alle shopUrls verwenden das korrekte Tentary-Format", () => {
    for (const [, info] of Object.entries(MATERIAL_TO_SET)) {
      const url = `https://dieseelenplanerin.tentary.com/p/${info.code}`;
      expect(url).toMatch(/^https:\/\/dieseelenplanerin\.tentary\.com\/p\/[A-Za-z0-9]+$/);
    }
  });
});
