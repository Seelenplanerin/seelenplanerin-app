import { describe, it, expect } from "vitest";

// Die 10 verfügbaren Heilsteine
const VERFUEGBARE_STEINE = [
  "Bergkristall", "Amethyst", "Rosenquarz", "Mondstein",
  "Schwarzer Turmalin", "Citrin", "Karneol", "Obsidian",
  "Labradorit", "Sodalith",
];

// Zuordnungstabelle: Materialien → Ritual-Set → shopUrl (KORRIGIERT – nur verfügbare Steine)
const MATERIAL_TO_SET: Record<string, { set: string; code: string }> = {
  "Schwarzer Turmalin,Obsidian,Weißer Salbei,Schwarze Kerze": { set: "Schutz", code: "OX0aPw" },
  "Rosenquarz,Mondstein,Myrrhe,Rosa Kerze": { set: "Selbstliebe", code: "QtLnrA" },
  "Citrin,Bergkristall,Weihrauch,Goldene Kerze": { set: "Fülle", code: "QjvV1I" },
  "Labradorit,Amethyst,Palo Santo,Violette Kerze": { set: "Transformation", code: "sGn2aD" },
  "Karneol,Bergkristall,Weihrauch,Rote Kerze": { set: "Kraft", code: "BQ7sqg" },
  "Amethyst,Mondstein,Myrrhe,Weiße Kerze": { set: "Intuition", code: "tfehqK" },
  "Bergkristall,Citrin,Weißer Salbei,Gelbe Kerze": { set: "Neuanfang", code: "QFEH0i" },
  "Schwarzer Turmalin,Karneol,Palo Santo,Braune Kerze": { set: "Erdung", code: "VN9WOT" },
  "Karneol,Rosenquarz,Weihrauch,Orange Kerze": { set: "Lebensfreude", code: "gFloc9" },
  "Rosenquarz,Amethyst,Palo Santo,Grüne Kerze": { set: "Heilung", code: "f9A55Q" },
};

// NICHT erlaubte Steine (haben wir nicht)
const VERBOTENE_STEINE = [
  "Pyrit", "Sonnenstein", "Roter Jaspis", "Lapislazuli", "Feueropal",
  "Aquamarin", "Granat", "Tigerauge", "Malachit", "Aventurin",
  "Calcit", "Moosachat", "Rauchquarz", "Bernstein",
];

describe("Ritual-Sets Korrekturen (10 Heilsteine)", () => {
  it("Alle 10 Sets haben gültige Tentary-Codes", () => {
    for (const [materials, info] of Object.entries(MATERIAL_TO_SET)) {
      expect(info.code).toBeTruthy();
      expect(info.set).toBeTruthy();
    }
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

  it("Alle Steine in den Sets sind aus den 10 verfügbaren Steinen", () => {
    for (const [materials] of Object.entries(MATERIAL_TO_SET)) {
      const items = materials.split(",");
      // Nur die Steine prüfen (nicht Räucherwerk und Kerzen)
      const steine = items.filter(item =>
        !item.includes("Salbei") && !item.includes("Myrrhe") &&
        !item.includes("Palo Santo") && !item.includes("Weihrauch") &&
        !item.includes("Kerze")
      );
      for (const stein of steine) {
        expect(VERFUEGBARE_STEINE).toContain(stein);
      }
    }
  });

  it("Keine verbotenen Steine in den Sets", () => {
    for (const [materials] of Object.entries(MATERIAL_TO_SET)) {
      for (const verboten of VERBOTENE_STEINE) {
        expect(materials).not.toContain(verboten);
      }
    }
  });

  it("Schutz-Set enthält Schwarzer Turmalin + Obsidian (nicht Bergkristall)", () => {
    const schutz = MATERIAL_TO_SET["Schwarzer Turmalin,Obsidian,Weißer Salbei,Schwarze Kerze"];
    expect(schutz).toBeDefined();
    expect(schutz.set).toBe("Schutz");
    expect(schutz.code).toBe("OX0aPw");
  });

  it("Fülle-Set enthält Citrin + Bergkristall (nicht Pyrit)", () => {
    const fuelle = MATERIAL_TO_SET["Citrin,Bergkristall,Weihrauch,Goldene Kerze"];
    expect(fuelle).toBeDefined();
    expect(fuelle.set).toBe("Fülle");
    expect(fuelle.code).toBe("QjvV1I");
  });

  it("Kraft-Set enthält Karneol + Bergkristall (nicht Sonnenstein)", () => {
    const kraft = MATERIAL_TO_SET["Karneol,Bergkristall,Weihrauch,Rote Kerze"];
    expect(kraft).toBeDefined();
    expect(kraft.set).toBe("Kraft");
    expect(kraft.code).toBe("BQ7sqg");
  });

  it("Lebensfreude-Set enthält Karneol + Rosenquarz (nicht Sonnenstein)", () => {
    const freude = MATERIAL_TO_SET["Karneol,Rosenquarz,Weihrauch,Orange Kerze"];
    expect(freude).toBeDefined();
    expect(freude.set).toBe("Lebensfreude");
    expect(freude.code).toBe("gFloc9");
  });
});
