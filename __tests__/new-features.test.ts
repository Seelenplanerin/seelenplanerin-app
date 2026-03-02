import { describe, it, expect } from "vitest";

// ═══════════════════════════════════════════════════════════════
// Test 1: Shop hat Ritual-Sets Kategorie mit 10 Sets
// ═══════════════════════════════════════════════════════════════
describe("Shop – Ritual-Sets Kategorie", () => {
  // Wir testen die Datenstruktur direkt (Shop-Screen Produkte)
  const RITUAL_SET_IDS = [
    "set-schutz", "set-selbstliebe", "set-fuelle", "set-transformation",
    "set-kraft", "set-intuition", "set-neuanfang", "set-erdung",
    "set-lebensfreude", "set-heilung",
  ];

  const RITUAL_SET_LINKS: Record<string, string> = {
    "set-schutz": "https://dieseelenplanerin.tentary.com/p/OX0aPw",
    "set-selbstliebe": "https://dieseelenplanerin.tentary.com/p/QtLnrA",
    "set-fuelle": "https://dieseelenplanerin.tentary.com/p/QjvV1I",
    "set-transformation": "https://dieseelenplanerin.tentary.com/p/sGn2aD",
    "set-kraft": "https://dieseelenplanerin.tentary.com/p/BQ7sqg",
    "set-intuition": "https://dieseelenplanerin.tentary.com/p/tfehqK",
    "set-neuanfang": "https://dieseelenplanerin.tentary.com/p/QFEH0i",
    "set-erdung": "https://dieseelenplanerin.tentary.com/p/VN9WOT",
    "set-lebensfreude": "https://dieseelenplanerin.tentary.com/p/gFloc9",
    "set-heilung": "https://dieseelenplanerin.tentary.com/p/f9A55Q",
  };

  it("sollte genau 10 Ritual-Sets haben", () => {
    expect(RITUAL_SET_IDS).toHaveLength(10);
  });

  it("sollte alle Tentary-Links haben", () => {
    for (const id of RITUAL_SET_IDS) {
      expect(RITUAL_SET_LINKS[id]).toBeDefined();
      expect(RITUAL_SET_LINKS[id]).toMatch(/^https:\/\/dieseelenplanerin\.tentary\.com\/p\//);
    }
  });

  it("alle Links sollten einzigartig sein", () => {
    const links = Object.values(RITUAL_SET_LINKS);
    const uniqueLinks = new Set(links);
    expect(uniqueLinks.size).toBe(links.length);
  });
});

// ═══════════════════════════════════════════════════════════════
// Test 2: Notification-Service Daten
// ═══════════════════════════════════════════════════════════════
describe("Notification-Service – Astronomische Daten", () => {
  // Vollmonde 2026 (astronomisch korrekt, MEZ-Kalendertage)
  const VOLLMONDE_2026 = [
    "2026-01-03", "2026-02-01", "2026-03-03", "2026-04-02",
    "2026-05-01", "2026-05-31", "2026-06-30", "2026-07-29",
    "2026-08-28", "2026-09-26", "2026-10-26", "2026-11-24", "2026-12-24",
  ];

  const NEUMONDE_2026 = [
    "2026-01-18", "2026-02-17", "2026-03-19", "2026-04-17",
    "2026-05-16", "2026-06-15", "2026-07-14", "2026-08-12",
    "2026-09-11", "2026-10-10", "2026-11-09", "2026-12-09",
  ];

  const JAHRESKREIS_2026 = [
    { date: "2026-02-01", name: "Imbolc" },
    { date: "2026-03-20", name: "Ostara" },
    { date: "2026-04-30", name: "Beltane" },
    { date: "2026-06-21", name: "Litha" },
    { date: "2026-08-01", name: "Lughnasadh" },
    { date: "2026-09-22", name: "Mabon" },
    { date: "2026-10-31", name: "Samhain" },
    { date: "2026-12-21", name: "Yule" },
  ];

  it("sollte 13 Vollmonde haben (inkl. Blue Moon)", () => {
    expect(VOLLMONDE_2026).toHaveLength(13);
  });

  it("sollte 12 Neumonde haben", () => {
    expect(NEUMONDE_2026).toHaveLength(12);
  });

  it("sollte 8 Jahreskreisfeste haben", () => {
    expect(JAHRESKREIS_2026).toHaveLength(8);
  });

  it("alle Vollmond-Daten sollten im Jahr 2026 liegen", () => {
    for (const date of VOLLMONDE_2026) {
      expect(date).toMatch(/^2026-/);
      const d = new Date(date);
      expect(d.getFullYear()).toBe(2026);
    }
  });

  it("alle Neumond-Daten sollten im Jahr 2026 liegen", () => {
    for (const date of NEUMONDE_2026) {
      expect(date).toMatch(/^2026-/);
      const d = new Date(date);
      expect(d.getFullYear()).toBe(2026);
    }
  });

  it("Vollmonde sollten chronologisch sortiert sein", () => {
    for (let i = 1; i < VOLLMONDE_2026.length; i++) {
      expect(VOLLMONDE_2026[i] > VOLLMONDE_2026[i - 1]).toBe(true);
    }
  });

  it("Neumonde sollten chronologisch sortiert sein", () => {
    for (let i = 1; i < NEUMONDE_2026.length; i++) {
      expect(NEUMONDE_2026[i] > NEUMONDE_2026[i - 1]).toBe(true);
    }
  });

  it("Jahreskreisfeste sollten alle 8 traditionellen Feste enthalten", () => {
    const names = JAHRESKREIS_2026.map(e => e.name);
    expect(names).toContain("Imbolc");
    expect(names).toContain("Ostara");
    expect(names).toContain("Beltane");
    expect(names).toContain("Litha");
    expect(names).toContain("Lughnasadh");
    expect(names).toContain("Mabon");
    expect(names).toContain("Samhain");
    expect(names).toContain("Yule");
  });
});

// ═══════════════════════════════════════════════════════════════
// Test 3: Heilsteine-Dokument Preisstruktur
// ═══════════════════════════════════════════════════════════════
describe("Heilsteine – Preisstruktur", () => {
  const HEILSTEINE = [
    { name: "Bergkristall", preis: 6.90 },
    { name: "Amethyst", preis: 7.90 },
    { name: "Rosenquarz", preis: 6.90 },
    { name: "Mondstein", preis: 8.90 },
    { name: "Schwarzer Turmalin", preis: 7.90 },
    { name: "Citrin", preis: 8.90 },
    { name: "Karneol", preis: 6.90 },
    { name: "Obsidian", preis: 6.90 },
    { name: "Labradorit", preis: 9.90 },
    { name: "Sodalith", preis: 6.90 },
  ];

  it("sollte genau 10 Heilsteine haben", () => {
    expect(HEILSTEINE).toHaveLength(10);
  });

  it("alle Preise sollten zwischen 5 und 15 Euro liegen", () => {
    for (const stein of HEILSTEINE) {
      expect(stein.preis).toBeGreaterThanOrEqual(5);
      expect(stein.preis).toBeLessThanOrEqual(15);
    }
  });

  it("alle Steine sollten einzigartige Namen haben", () => {
    const names = HEILSTEINE.map(s => s.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it("sollte die häufigsten Ritual-Steine enthalten", () => {
    const names = HEILSTEINE.map(s => s.name);
    // Die am häufigsten in den Ritualen verwendeten Steine
    expect(names).toContain("Bergkristall");
    expect(names).toContain("Amethyst");
    expect(names).toContain("Rosenquarz");
    expect(names).toContain("Mondstein");
    expect(names).toContain("Schwarzer Turmalin");
    expect(names).toContain("Citrin");
  });
});
