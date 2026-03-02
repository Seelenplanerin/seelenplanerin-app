import { describe, it, expect } from "vitest";
import { getMoonPhaseForDate, getMoonIllumination, getExaktePhaseForDate, isMoonWaxing } from "../lib/moon-phase";

describe("Mondphasen März 2026 – korrekte Anzeige", () => {
  
  // 2. März 2026 – KEIN Vollmond, zunehmender Mond
  it("2. März 2026 Mittag (MEZ) sollte NICHT Vollmond sein", () => {
    // 2. März 2026 12:00 MEZ = 11:00 UTC
    const date = new Date("2026-03-02T11:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).not.toBe("Vollmond");
    console.log(`2. März 12:00 MEZ: ${phase.name} (${phase.emoji})`);
  });

  it("2. März 2026 sollte zunehmender Mond sein", () => {
    const date = new Date("2026-03-02T11:00:00Z");
    const waxing = isMoonWaxing(date);
    expect(waxing).toBe(true);
    const phase = getMoonPhaseForDate(date);
    console.log(`2. März: ${phase.name} – zunehmend: ${waxing}`);
  });

  it("2. März 2026 Morgen (07:50 MEZ) sollte NICHT Vollmond sein", () => {
    // 07:50 MEZ = 06:50 UTC
    const date = new Date("2026-03-02T06:50:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).not.toBe("Vollmond");
    console.log(`2. März 07:50 MEZ: ${phase.name}`);
  });

  it("2. März 2026 23:59 MEZ sollte NICHT Vollmond sein", () => {
    // 23:59 MEZ = 22:59 UTC
    const date = new Date("2026-03-02T22:59:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).not.toBe("Vollmond");
    console.log(`2. März 23:59 MEZ: ${phase.name}`);
  });

  // 3. März 2026 – VOLLMOND um 12:37 MEZ
  it("3. März 2026 Mittag (MEZ) sollte Vollmond sein", () => {
    // 3. März 2026 12:37 MEZ = 11:37 UTC
    const date = new Date("2026-03-03T11:37:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).toBe("Vollmond");
    console.log(`3. März 12:37 MEZ: ${phase.name}`);
  });

  it("3. März 2026 Morgen sollte Vollmond sein", () => {
    // 3. März 08:00 MEZ = 07:00 UTC (5h vor exaktem Vollmond)
    const date = new Date("2026-03-03T07:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).toBe("Vollmond");
    console.log(`3. März 08:00 MEZ: ${phase.name}`);
  });

  it("3. März 2026 Abend sollte Vollmond sein", () => {
    // 3. März 22:00 MEZ = 21:00 UTC (9.5h nach exaktem Vollmond)
    const date = new Date("2026-03-03T21:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).toBe("Vollmond");
    console.log(`3. März 22:00 MEZ: ${phase.name}`);
  });

  // 4. März 2026 – KEIN Vollmond mehr
  it("4. März 2026 sollte NICHT Vollmond sein", () => {
    // 4. März 12:00 MEZ = 11:00 UTC
    const date = new Date("2026-03-04T11:00:00Z");
    const phase = getMoonPhaseForDate(date);
    expect(phase.name).not.toBe("Vollmond");
    console.log(`4. März 12:00 MEZ: ${phase.name}`);
  });

  // Beleuchtung am 2. März sollte < 100% sein
  it("2. März Beleuchtung sollte unter 100% sein", () => {
    const date = new Date("2026-03-02T11:00:00Z");
    const illumination = getMoonIllumination(date);
    expect(illumination).toBeLessThan(100);
    console.log(`2. März Beleuchtung: ${illumination}%`);
  });

  // getExaktePhaseForDate: 2. März sollte KEINE exakte Phase haben
  it("2. März sollte keine exakte Hauptphase sein", () => {
    const date = new Date("2026-03-02T11:00:00Z");
    const exakt = getExaktePhaseForDate(date);
    // 2. März hat keine exakte Phase – Vollmond ist am 3.
    expect(exakt?.name).not.toBe("Vollmond");
    console.log(`2. März exakte Phase: ${exakt?.name || "keine"}`);
  });

  // getExaktePhaseForDate: 3. März sollte Vollmond sein
  it("3. März sollte exakte Vollmond-Phase haben", () => {
    const date = new Date("2026-03-03T11:00:00Z");
    const exakt = getExaktePhaseForDate(date);
    expect(exakt).not.toBeNull();
    expect(exakt?.name).toBe("Vollmond");
    console.log(`3. März exakte Phase: ${exakt?.name}`);
  });
});
