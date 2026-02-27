import { describe, it, expect } from "vitest";
import { getMoonPhaseForDate, getMoonIllumination, getMoonCalendar } from "../lib/moon-phase";

describe("Mond-Emoji Konsistenz", () => {
  it("25. Februar 2026 sollte Erstes Viertel oder Zunehmender Mond sein (nicht Abnehmende Sichel)", () => {
    const date = new Date("2026-02-25T12:00:00Z");
    const phase = getMoonPhaseForDate(date);
    const illum = getMoonIllumination(date);
    console.log(`25. Feb: ${phase.name} (${phase.emoji}) - ${illum}% beleuchtet`);
    // Erstes Viertel war am 24. Feb 12:27 UTC, also am 25. sollte es Zunehmender Mond sein
    expect(["Erstes Viertel", "Zunehmender Mond"]).toContain(phase.name);
    expect(illum).toBeGreaterThan(25); // Erstes Viertel = ~34% ist korrekt
  });

  it("15. März 2026 sollte Abnehmende Sichel sein (Neumond 19. März)", () => {
    const date = new Date("2026-03-15T12:00:00Z");
    const phase = getMoonPhaseForDate(date);
    const illum = getMoonIllumination(date);
    console.log(`15. Mär: ${phase.name} (${phase.emoji}) - ${illum}% beleuchtet`);
    // Letztes Viertel 11. März, Neumond 19. März → Abnehmende Sichel
    expect(["Abnehmende Sichel", "Letztes Viertel"]).toContain(phase.name);
  });

  it("3. März 2026 sollte Vollmond sein", () => {
    const date = new Date("2026-03-03T12:00:00Z");
    const phase = getMoonPhaseForDate(date);
    const illum = getMoonIllumination(date);
    console.log(`3. Mär: ${phase.name} (${phase.emoji}) - ${illum}% beleuchtet`);
    expect(phase.name).toBe("Vollmond");
    expect(illum).toBeGreaterThan(90);
  });

  it("Emoji und Beleuchtung müssen konsistent sein für alle 30 Tage", () => {
    const calendar = getMoonCalendar();
    for (const entry of calendar) {
      const illum = getMoonIllumination(entry.date);
      const name = entry.phase.name;
      const emoji = entry.phase.emoji;
      const dateStr = entry.date.toISOString().slice(0, 10);
      
      // Prüfe Konsistenz: Wenn Beleuchtung < 15%, darf es kein 🌔 oder 🌕 sein
      if (illum < 15) {
        expect(["🌑", "🌒", "🌘"]).toContain(emoji);
      }
      // Wenn Beleuchtung > 85%, darf es kein 🌑 oder 🌒 sein
      if (illum > 85) {
        expect(["🌕", "🌖", "🌔"]).toContain(emoji);
      }
      
      console.log(`${dateStr}: ${name} ${emoji} - ${illum}%`);
    }
  });

  it("5-Tage-Vorschau Emojis müssen zur Beleuchtung passen", () => {
    const today = new Date("2026-02-25T12:00:00Z");
    for (let i = -2; i <= 2; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const phase = getMoonPhaseForDate(d);
      const illum = getMoonIllumination(d);
      const dateStr = d.toISOString().slice(0, 10);
      console.log(`Vorschau ${dateStr}: ${phase.name} ${phase.emoji} - ${illum}%`);
      
      // Grundlegende Konsistenz
      if (phase.name === "Vollmond") {
        expect(illum).toBeGreaterThan(80);
        expect(phase.emoji).toBe("🌕");
      }
      if (phase.name === "Neumond") {
        expect(illum).toBeLessThan(15);
        expect(phase.emoji).toBe("🌑");
      }
    }
  });
});
