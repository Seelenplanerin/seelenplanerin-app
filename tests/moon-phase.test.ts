import { describe, it, expect } from "vitest";
import {
  getMoonPhaseForDate,
  getCurrentMoonPhase,
  getNextVollmond,
  getNextNeumond,
  getMoonZodiac,
  getMoonIllumination,
  getMoonDirection,
} from "../lib/moon-phase";

describe("Moon Phase Calculations 2026", () => {
  it("should show Vollmond on March 3, 2026", () => {
    // Vollmond 3. März 2026 um 11:37 UTC (MEZ: 12:37)
    const date = new Date("2026-03-03T12:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).toBe("Vollmond");
  });

  it("should show Vollmond on January 3, 2026", () => {
    const date = new Date("2026-01-03T10:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).toBe("Vollmond");
  });

  it("should show Neumond on February 17, 2026", () => {
    const date = new Date("2026-02-17T12:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).toBe("Neumond");
  });

  it("should show Zunehmender Mond on February 25, 2026 (today)", () => {
    // Feb 25 is between Erstes Viertel (Feb 24, 12:27) and Vollmond (Mar 3, 11:37)
    // Position in cycle: Feb 17 (Neumond) to Mar 19 (Neumond)
    // 8 days into ~30 day cycle = ~0.27 → Erstes Viertel or Zunehmender Mond
    const date = new Date("2026-02-25T18:00:00Z");
    const phase = getMoonPhaseForDate(date);
    // Should be Zunehmender Mond (between Erstes Viertel and Vollmond)
    expect(["Zunehmender Mond", "Erstes Viertel"]).toContain(phase.name);
  });

  it("should show Vollmond on February 1, 2026", () => {
    const date = new Date("2026-02-01T22:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).toBe("Vollmond");
  });

  it("should show Neumond on March 19, 2026", () => {
    const date = new Date("2026-03-19T02:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).toBe("Neumond");
  });

  it("should show Vollmond on April 2, 2026", () => {
    const date = new Date("2026-04-02T02:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).toBe("Vollmond");
  });

  it("should show Vollmond on May 31, 2026 (Blue Moon)", () => {
    const date = new Date("2026-05-31T09:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).toBe("Vollmond");
  });

  it("should show Vollmond on December 24, 2026", () => {
    const date = new Date("2026-12-24T02:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).toBe("Vollmond");
  });

  it("should return next Vollmond after today (Feb 25)", () => {
    const next = getNextVollmond();
    // Next Vollmond after Feb 25 should be March 3
    expect(next.getUTCMonth()).toBe(2); // March = 2
    expect(next.getUTCDate()).toBe(3);
  });

  it("should return next Neumond after today (Feb 25)", () => {
    const next = getNextNeumond();
    // Next Neumond after Feb 25 should be March 19
    expect(next.getUTCMonth()).toBe(2); // March = 2
    expect(next.getUTCDate()).toBe(19);
  });

  it("should calculate illumination correctly", () => {
    // At Vollmond, illumination should be near 100
    const vollmond = new Date("2026-03-03T11:37:00Z");
    const illum = getMoonIllumination(vollmond);
    expect(illum).toBeGreaterThan(90);

    // At Neumond, illumination should be near 0
    const neumond = new Date("2026-03-19T01:23:00Z");
    const illumNeu = getMoonIllumination(neumond);
    expect(illumNeu).toBeLessThan(10);
  });

  it("should return zodiac sign", () => {
    const date = new Date("2026-02-25T12:00:00Z");
    const zodiac = getMoonZodiac(date);
    expect(zodiac.name).toBeDefined();
    expect(zodiac.symbol).toBeDefined();
    expect(zodiac.element).toBeDefined();
  });

  it("should return moon direction", () => {
    const date = new Date("2026-02-25T12:00:00Z");
    const direction = getMoonDirection(date);
    expect(["aufsteigend", "absteigend"]).toContain(direction);
  });

  it("should show abnehmende Phase between Vollmond and Neumond", () => {
    // March 10 is between Vollmond (Mar 3) and Neumond (Mar 19)
    const date = new Date("2026-03-10T12:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(["Abnehmender Mond", "Letztes Viertel"]).toContain(phase.name);
  });

  it("should show zunehmende Phase between Neumond and Vollmond", () => {
    // March 28 is between Neumond (Mar 19) and Vollmond (Apr 2)
    const date = new Date("2026-03-28T12:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(["Zunehmende Sichel", "Erstes Viertel", "Zunehmender Mond"]).toContain(phase.name);
  });
});
