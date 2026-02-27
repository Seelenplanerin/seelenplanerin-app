import { describe, it, expect } from "vitest";

/**
 * Test der MoonIcon SVG-Pfad-Logik.
 * Wir testen die Pfad-Berechnung direkt ohne React-Rendering.
 */

function computeMoonPath(illumination: number, isWaxing: boolean, size: number = 80) {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const moonR = r - 1;
  const illum = Math.max(0, Math.min(100, Math.round(illumination)));

  if (illum <= 1) return "";
  if (illum >= 99) {
    return `M ${cx} ${cy - moonR} A ${moonR} ${moonR} 0 1 0 ${cx} ${cy + moonR} A ${moonR} ${moonR} 0 1 0 ${cx} ${cy - moonR} Z`;
  }

  const f = illum / 100;
  const ellipseRx = Math.abs(moonR * (2 * f - 1));
  const innerSweep = f > 0.5 ? 0 : 1;

  if (isWaxing) {
    return `M ${cx} ${cy - moonR} A ${moonR} ${moonR} 0 0 1 ${cx} ${cy + moonR} A ${ellipseRx} ${moonR} 0 0 ${innerSweep} ${cx} ${cy - moonR} Z`;
  } else {
    return `M ${cx} ${cy - moonR} A ${moonR} ${moonR} 0 0 0 ${cx} ${cy + moonR} A ${ellipseRx} ${moonR} 0 0 ${1 - innerSweep} ${cx} ${cy - moonR} Z`;
  }
}

describe("MoonIcon SVG Pfad-Berechnung", () => {
  it("Neumond (0%) = kein Pfad", () => {
    expect(computeMoonPath(0, true)).toBe("");
    expect(computeMoonPath(0, false)).toBe("");
  });

  it("Vollmond (100%) = voller Kreis", () => {
    const path = computeMoonPath(100, true);
    expect(path).toContain("1 0"); // large-arc flag für vollen Kreis
    expect(path).toContain("Z");
    // Vollmond sieht gleich aus egal ob waxing oder waning
    const path2 = computeMoonPath(100, false);
    expect(path2).toContain("1 0");
  });

  it("Zunehmend (25%) = rechte Seite beleuchtet (sweep=1 für äußeren Bogen)", () => {
    const path = computeMoonPath(25, true);
    // Äußerer Bogen geht von oben nach unten über RECHTS: sweep-flag = 1
    expect(path).toMatch(/A \d+\.?\d* \d+\.?\d* 0 0 1/); // sweep=1 = rechts
  });

  it("Abnehmend (25%) = linke Seite beleuchtet (sweep=0 für äußeren Bogen)", () => {
    const path = computeMoonPath(25, false);
    // Äußerer Bogen geht von oben nach unten über LINKS: sweep-flag = 0
    expect(path).toMatch(/A \d+\.?\d* \d+\.?\d* 0 0 0/); // sweep=0 = links
  });

  it("Zunehmend und Abnehmend bei 50% haben unterschiedliche Pfade", () => {
    const waxing = computeMoonPath(50, true);
    const waning = computeMoonPath(50, false);
    expect(waxing).not.toBe(waning);
  });

  it("Zunehmend bei 75% = großer beleuchteter Bereich rechts", () => {
    const path = computeMoonPath(75, true);
    expect(path).toBeTruthy();
    // Äußerer Bogen sweep=1 (rechts)
    expect(path).toMatch(/A \d+\.?\d* \d+\.?\d* 0 0 1/);
  });

  it("Abnehmend bei 75% = großer beleuchteter Bereich links", () => {
    const path = computeMoonPath(75, false);
    expect(path).toBeTruthy();
    // Äußerer Bogen sweep=0 (links)
    expect(path).toMatch(/A \d+\.?\d* \d+\.?\d* 0 0 0/);
  });

  it("Pfad enthält immer Z am Ende (geschlossener Pfad)", () => {
    for (const illum of [10, 25, 50, 75, 90]) {
      expect(computeMoonPath(illum, true)).toMatch(/Z$/);
      expect(computeMoonPath(illum, false)).toMatch(/Z$/);
    }
  });
});
