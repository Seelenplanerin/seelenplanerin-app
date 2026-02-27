import { describe, it, expect } from "vitest";
import { getMoonZodiac } from "../lib/moon-phase";

describe("Exakte Tierkreiszeichen für Hauptphasen 2026", () => {
  it("Neumond 17. Feb 2026 = Wassermann (NICHT Fische)", () => {
    const zodiac = getMoonZodiac(new Date("2026-02-17T12:01:00Z"));
    expect(zodiac.name).toBe("Wassermann");
  });

  it("Vollmond 3. Jan 2026 = Krebs", () => {
    const zodiac = getMoonZodiac(new Date("2026-01-03T10:02:00Z"));
    expect(zodiac.name).toBe("Krebs");
  });

  it("Vollmond 1. Feb 2026 = Löwe", () => {
    const zodiac = getMoonZodiac(new Date("2026-02-01T22:09:00Z"));
    expect(zodiac.name).toBe("Löwe");
  });

  it("Vollmond 3. Mär 2026 = Jungfrau", () => {
    const zodiac = getMoonZodiac(new Date("2026-03-03T11:37:00Z"));
    expect(zodiac.name).toBe("Jungfrau");
  });

  it("Vollmond 2. Apr 2026 = Waage", () => {
    const zodiac = getMoonZodiac(new Date("2026-04-02T02:11:00Z"));
    expect(zodiac.name).toBe("Waage");
  });

  it("Neumond 18. Jan 2026 = Steinbock", () => {
    const zodiac = getMoonZodiac(new Date("2026-01-18T19:51:00Z"));
    expect(zodiac.name).toBe("Steinbock");
  });

  it("Neumond 19. Mär 2026 = Fische", () => {
    const zodiac = getMoonZodiac(new Date("2026-03-19T01:23:00Z"));
    expect(zodiac.name).toBe("Fische");
  });

  it("Neumond 17. Apr 2026 = Widder", () => {
    const zodiac = getMoonZodiac(new Date("2026-04-17T11:51:00Z"));
    expect(zodiac.name).toBe("Widder");
  });

  it("Letztes Viertel 9. Feb 2026 = Skorpion", () => {
    const zodiac = getMoonZodiac(new Date("2026-02-09T12:43:00Z"));
    expect(zodiac.name).toBe("Skorpion");
  });

  it("Erstes Viertel 24. Feb 2026 = Zwillinge", () => {
    const zodiac = getMoonZodiac(new Date("2026-02-24T12:27:00Z"));
    expect(zodiac.name).toBe("Zwillinge");
  });

  it("Letztes Viertel 11. Mär 2026 = Schütze", () => {
    const zodiac = getMoonZodiac(new Date("2026-03-11T09:38:00Z"));
    expect(zodiac.name).toBe("Schütze");
  });

  it("Erstes Viertel 25. Mär 2026 = Krebs", () => {
    const zodiac = getMoonZodiac(new Date("2026-03-25T19:17:00Z"));
    expect(zodiac.name).toBe("Krebs");
  });

  // Alle Vollmonde prüfen
  const vollmonde = [
    { datum: "2026-01-03T10:02:00Z", zeichen: "Krebs" },
    { datum: "2026-02-01T22:09:00Z", zeichen: "Löwe" },
    { datum: "2026-03-03T11:37:00Z", zeichen: "Jungfrau" },
    { datum: "2026-04-02T02:11:00Z", zeichen: "Waage" },
    { datum: "2026-05-01T17:23:00Z", zeichen: "Skorpion" },
    { datum: "2026-05-31T08:45:00Z", zeichen: "Schütze" },
    { datum: "2026-06-29T23:56:00Z", zeichen: "Steinbock" },
    { datum: "2026-07-29T14:35:00Z", zeichen: "Wassermann" },
    { datum: "2026-08-28T04:18:00Z", zeichen: "Fische" },
    { datum: "2026-09-26T16:49:00Z", zeichen: "Widder" },
    { datum: "2026-10-26T04:11:00Z", zeichen: "Stier" },
    { datum: "2026-11-24T14:53:00Z", zeichen: "Zwillinge" },
    { datum: "2026-12-24T01:28:00Z", zeichen: "Krebs" },
  ];

  vollmonde.forEach(({ datum, zeichen }) => {
    it(`Vollmond ${datum.slice(0, 10)} = ${zeichen}`, () => {
      const zodiac = getMoonZodiac(new Date(datum));
      expect(zodiac.name).toBe(zeichen);
    });
  });

  // Alle Neumonde prüfen
  const neumonde = [
    { datum: "2026-01-18T19:51:00Z", zeichen: "Steinbock" },
    { datum: "2026-02-17T12:01:00Z", zeichen: "Wassermann" },
    { datum: "2026-03-19T01:23:00Z", zeichen: "Fische" },
    { datum: "2026-04-17T11:51:00Z", zeichen: "Widder" },
    { datum: "2026-05-16T20:01:00Z", zeichen: "Stier" },
    { datum: "2026-06-15T02:54:00Z", zeichen: "Zwillinge" },
    { datum: "2026-07-14T09:43:00Z", zeichen: "Krebs" },
    { datum: "2026-08-12T17:36:00Z", zeichen: "Löwe" },
    { datum: "2026-09-11T03:26:00Z", zeichen: "Jungfrau" },
    { datum: "2026-10-10T15:50:00Z", zeichen: "Waage" },
    { datum: "2026-11-09T07:02:00Z", zeichen: "Skorpion" },
    { datum: "2026-12-09T00:51:00Z", zeichen: "Schütze" },
  ];

  neumonde.forEach(({ datum, zeichen }) => {
    it(`Neumond ${datum.slice(0, 10)} = ${zeichen}`, () => {
      const zodiac = getMoonZodiac(new Date(datum));
      expect(zodiac.name).toBe(zeichen);
    });
  });
});
