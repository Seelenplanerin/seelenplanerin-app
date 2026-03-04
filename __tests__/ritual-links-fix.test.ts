import { describe, it, expect } from "vitest";
import { RITUALE_2026 as RITUALE } from "../data/rituale-kalender";

// Die 10 verfügbaren Ritual-Steine
const VERFUEGBARE_STEINE = [
  "Citrin", "Labradorit", "Sonnenstein", "Karneol",
  "Amethyst", "Rosenquarz", "Schwarzer Turmalin", "Bergkristall",
  "Pyrit", "Mondstein",
];

// Erlaubtes Räucherwerk
const ERLAUBTES_RAEUCHERWERK = [
  "Weißer Salbei", "Myrrhe", "Palo Santo", "Weihrauch",
];

// Erlaubte Kerzen
const ERLAUBTE_KERZEN = [
  "Schwarze Kerze", "Rosa Kerze", "Goldene Kerze", "Violette Kerze",
  "Rote Kerze", "Weiße Kerze", "Gelbe Kerze", "Braune Kerze",
  "Orange Kerze", "Grüne Kerze",
];

const ALLE_ERLAUBT = [...VERFUEGBARE_STEINE, ...ERLAUBTES_RAEUCHERWERK, ...ERLAUBTE_KERZEN];

// NICHT erlaubte Steine (haben wir nicht)
const VERBOTENE_STEINE = [
  "Obsidian", "Sodalith", "Aventurin", "Lapislazuli", "Tigerauge",
  "Malachit", "Moosachat", "Rauchquarz", "Bernstein", "Granat",
  "Aquamarin", "Feueropal", "Calcit", "Roter Jaspis",
];

// Die 10 Ritual-Sets mit korrekten Tentary-Codes und Steinen
const RITUAL_SETS: Record<string, { code: string; steine: string[] }> = {
  "Schutz": { code: "OX0aPw", steine: ["Schwarzer Turmalin", "Bergkristall"] },
  "Selbstliebe": { code: "QtLnrA", steine: ["Rosenquarz", "Mondstein"] },
  "Fülle": { code: "QjvV1I", steine: ["Citrin", "Pyrit"] },
  "Transformation": { code: "sGn2aD", steine: ["Labradorit", "Amethyst"] },
  "Kraft": { code: "BQ7sqg", steine: ["Karneol", "Sonnenstein"] },
  "Intuition": { code: "tfehqK", steine: ["Amethyst", "Mondstein"] },
  "Neuanfang": { code: "QFEH0i", steine: ["Bergkristall", "Citrin"] },
  "Erdung": { code: "VN9WOT", steine: ["Schwarzer Turmalin", "Karneol"] },
  "Lebensfreude": { code: "gFloc9", steine: ["Sonnenstein", "Karneol"] },
  "Heilung": { code: "f9A55Q", steine: ["Rosenquarz", "Amethyst"] },
};

describe("Ritual-Steine Korrektheit (10 Steine)", () => {
  it("sollte genau 51 Rituale haben", () => {
    expect(RITUALE.length).toBe(51);
  });

  it("sollte KEINE verbotenen Steine in materialien haben", () => {
    const fehler: string[] = [];
    RITUALE.forEach((r) => {
      r.materialien.forEach((m) => {
        if (VERBOTENE_STEINE.includes(m)) {
          fehler.push(`${r.id}: "${m}" ist verboten`);
        }
      });
    });
    expect(fehler).toEqual([]);
  });

  it("sollte NUR erlaubte Materialien verwenden", () => {
    const fehler: string[] = [];
    RITUALE.forEach((r) => {
      r.materialien.forEach((m) => {
        if (!ALLE_ERLAUBT.includes(m)) {
          fehler.push(`${r.id}: "${m}" ist nicht erlaubt`);
        }
      });
    });
    expect(fehler).toEqual([]);
  });

  it("sollte gültige Tentary-Links haben", () => {
    const gueltigeCodes = Object.values(RITUAL_SETS).map((s) => s.code);
    const fehler: string[] = [];
    RITUALE.forEach((r) => {
      const code = r.shopUrl.split("/").pop();
      if (!gueltigeCodes.includes(code!)) {
        fehler.push(`${r.id}: Code "${code}" ist ungültig`);
      }
    });
    expect(fehler).toEqual([]);
  });

  it("sollte materialien passend zum shopUrl-Set haben", () => {
    const fehler: string[] = [];
    RITUALE.forEach((r) => {
      const code = r.shopUrl.split("/").pop();
      const set = Object.entries(RITUAL_SETS).find(([_, v]) => v.code === code);
      if (set) {
        const [setName, setData] = set;
        const hatSetStein = setData.steine.some((s) => r.materialien.includes(s));
        if (!hatSetStein) {
          fehler.push(`${r.id} (${setName}): Keiner der Set-Steine [${setData.steine.join(", ")}] in materialien [${r.materialien.join(", ")}]`);
        }
      }
    });
    expect(fehler).toEqual([]);
  });

  it("sollte KEINE Obsidian- oder Sodalith-Erwähnungen in Ritual-Texten haben", () => {
    const fehler: string[] = [];
    RITUALE.forEach((r) => {
      r.abschnitte.forEach((a) => {
        if (a.text.includes("Obsidian")) {
          fehler.push(`${r.id}: "Obsidian" in Ritual-Text`);
        }
        if (a.text.includes("Sodalith")) {
          fehler.push(`${r.id}: "Sodalith" in Ritual-Text`);
        }
      });
    });
    expect(fehler).toEqual([]);
  });

  it("sollte alle 10 Steine mindestens einmal verwenden", () => {
    const verwendeteSteine = new Set<string>();
    RITUALE.forEach((r) => {
      r.materialien.forEach((m) => {
        if (VERFUEGBARE_STEINE.includes(m)) {
          verwendeteSteine.add(m);
        }
      });
    });
    const fehlend = VERFUEGBARE_STEINE.filter((s) => !verwendeteSteine.has(s));
    expect(fehlend).toEqual([]);
  });

  it("Schutz-Set enthält Schwarzer Turmalin + Bergkristall", () => {
    const schutzRituale = RITUALE.filter((r) => r.shopUrl.includes("OX0aPw"));
    expect(schutzRituale.length).toBeGreaterThan(0);
    schutzRituale.forEach((r) => {
      expect(r.materialien).toContain("Schwarzer Turmalin");
      expect(r.materialien).toContain("Bergkristall");
      expect(r.materialien).not.toContain("Obsidian");
    });
  });

  it("Fülle-Set enthält Citrin + Pyrit", () => {
    const fuelleRituale = RITUALE.filter((r) => r.shopUrl.includes("QjvV1I"));
    expect(fuelleRituale.length).toBeGreaterThan(0);
    fuelleRituale.forEach((r) => {
      expect(r.materialien).toContain("Citrin");
      expect(r.materialien).toContain("Pyrit");
    });
  });

  it("Kraft-Set enthält Karneol + Sonnenstein", () => {
    const kraftRituale = RITUALE.filter((r) => r.shopUrl.includes("BQ7sqg"));
    expect(kraftRituale.length).toBeGreaterThan(0);
    kraftRituale.forEach((r) => {
      expect(r.materialien).toContain("Karneol");
      expect(r.materialien).toContain("Sonnenstein");
    });
  });

  it("Lebensfreude-Set enthält Sonnenstein + Karneol", () => {
    const freudeRituale = RITUALE.filter((r) => r.shopUrl.includes("gFloc9"));
    expect(freudeRituale.length).toBeGreaterThan(0);
    freudeRituale.forEach((r) => {
      expect(r.materialien).toContain("Sonnenstein");
      expect(r.materialien).toContain("Karneol");
    });
  });
});
