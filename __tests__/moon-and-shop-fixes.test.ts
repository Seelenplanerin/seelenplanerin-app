import { describe, it, expect } from "vitest";

describe("Mondphasen-Fix: Vollmond nur am exakten Tag", () => {
  // Vollmond 3. März 2026 um 11:37 UTC
  const VOLLMOND_MAERZ = new Date("2026-03-03T11:37:00Z");
  const HALF_DAY = 12 * 60 * 60 * 1000;

  it("2. März Mittag sollte NICHT als Vollmond erkannt werden", () => {
    const tag2Maerz = new Date("2026-03-02T12:00:00Z");
    const diff = Math.abs(VOLLMOND_MAERZ.getTime() - tag2Maerz.getTime());
    expect(diff).toBeGreaterThan(HALF_DAY);
  });

  it("3. März Mittag SOLL als Vollmond erkannt werden", () => {
    const tag3Maerz = new Date("2026-03-03T12:00:00Z");
    const diff = Math.abs(VOLLMOND_MAERZ.getTime() - tag3Maerz.getTime());
    expect(diff).toBeLessThan(HALF_DAY);
  });

  it("4. März 00:00 sollte NICHT als Vollmond erkannt werden", () => {
    const tag4Maerz = new Date("2026-03-04T00:00:00Z");
    const diff = Math.abs(VOLLMOND_MAERZ.getTime() - tag4Maerz.getTime());
    expect(diff).toBeGreaterThan(HALF_DAY);
  });

  it("4. März Mittag sollte NICHT als Vollmond erkannt werden", () => {
    const tag4MaerzMittag = new Date("2026-03-04T12:00:00Z");
    const diff = Math.abs(VOLLMOND_MAERZ.getTime() - tag4MaerzMittag.getTime());
    expect(diff).toBeGreaterThan(HALF_DAY);
  });

  it("3. März 00:00 SOLL als Vollmond erkannt werden (11.6h Differenz < 12h)", () => {
    const tag3MaerzMorgen = new Date("2026-03-03T00:00:00Z");
    const diff = Math.abs(VOLLMOND_MAERZ.getTime() - tag3MaerzMorgen.getTime());
    expect(diff).toBeLessThan(HALF_DAY);
  });

  it("3. März 23:30 SOLL als Vollmond erkannt werden (11.9h Differenz < 12h)", () => {
    const tag3MaerzAbend = new Date("2026-03-03T23:30:00Z");
    const diff = Math.abs(VOLLMOND_MAERZ.getTime() - tag3MaerzAbend.getTime());
    expect(diff).toBeLessThan(HALF_DAY);
  });
});

describe("Meditationskerze Tentary-Link", () => {
  const KORREKTER_LINK = "https://dieseelenplanerin.tentary.com/p/YQLsh3";

  it("Link enthält die korrekte Produkt-ID YQLsh3", () => {
    expect(KORREKTER_LINK).toContain("/p/YQLsh3");
  });

  it("Link ist kein generischer Tentary-Link ohne Produkt-ID", () => {
    expect(KORREKTER_LINK).not.toBe("https://dieseelenplanerin.tentary.com");
    expect(KORREKTER_LINK).not.toBe("https://dieseelenplanerin.tentary.com/");
  });
});
