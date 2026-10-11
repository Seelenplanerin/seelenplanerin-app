import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined),
  },
}));

import {
  getCurrentRaunaechteDay, getRaunaechteDate, isDayUnlocked,
  formatDateDE, getCurrentRaunaechteYear,
} from "../lib/raunaechte-store";
import { RAUHNAECHTE_PROGRAM, formatProgramISODate, getProgramDay, getProgramYear } from "../lib/raunaechte-program";
import { getAllRaunaechteContent, getRaunaechteDay } from "../lib/raunaechte-data";
import { isOwnedSeelenplanerinUrl } from "../lib/link-security";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
afterEach(() => vi.useRealTimers());

describe("Rauhnächte mit Sperrnächten: 8. Dezember bis 6. Januar", () => {
  it.each([
    [2026, 11, 7, 23, 0],
    [2026, 11, 8, 0, 1],
    [2026, 11, 8, 12, 1],
    [2026, 11, 10, 12, 3],
    [2026, 11, 14, 12, 7],
    [2026, 11, 31, 12, 24],
    [2027, 0, 1, 12, 25],
    [2027, 0, 5, 12, 29],
    [2027, 0, 6, 23, 30],
    [2027, 0, 7, 0, 31],
  ])("bestimmt am %i/%i/%i um %i Uhr den Begleittag %i", (year, month, date, hour, expected) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(year, month, date, hour));
    expect(getCurrentRaunaechteDay(2026)).toBe(expected);
  });

  it.each([[1, "2026-12-08"], [3, "2026-12-10"], [24, "2026-12-31"], [25, "2027-01-01"], [30, "2027-01-06"]])(
    "ordnet Tag %i dem Datum %s zu", (day, isoDate) => {
      expect(formatProgramISODate(getRaunaechteDate(2026, Number(day)))).toBe(isoDate);
    },
  );

  it("liefert exakt 25 Inhaltstage mit 75 Telegram-Inhalten und korrekten Pausen", () => {
    const content = getAllRaunaechteContent(2026);
    expect(content).toHaveLength(RAUHNAECHTE_PROGRAM.contentDays);
    expect(RAUHNAECHTE_PROGRAM.totalContents).toBe(75);
    expect(content.filter(tag => tag.day <= 12)).toHaveLength(12);
    expect(content.filter(tag => tag.day >= 17)).toHaveLength(13);
    expect(content.map(tag => tag.contentDay)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
    for (const tag of content) {
      expect(tag.date).toBe(formatProgramISODate(getRaunaechteDate(2026, tag.day)));
      expect(getProgramDay(2026, getRaunaechteDate(2026, tag.day))).toBe(tag.day);
      expect(tag.theme).toBeTruthy();
      expect(tag.rune.name).toBeTruthy();
      expect(tag.journal.question).toBeTruthy();
    }
    expect(content[0].theme).toContain("Sperrnächte");
    expect(content[1].theme).toContain("Sperrnächte");
    expect(content[11].date).toBe("2026-12-19");
    expect(content[12].date).toBe("2026-12-24");
    expect(content[24]).toMatchObject({ date: "2027-01-05", theme: "Integration & Abschluss" });
    for (const day of [13, 14, 15, 16, 30]) expect(getRaunaechteDay(2026, day)).toBeNull();
    expect(getRaunaechteDay(2026, 31)).toBeNull();
  });

  it("gibt vor Beginn keinen Tag und später nur gültige erreichte Tage frei", () => {
    expect(isDayUnlocked(1, 0)).toBe(false);
    expect(isDayUnlocked(1, 1)).toBe(true);
    expect(isDayUnlocked(5, 4)).toBe(false);
    expect(isDayUnlocked(29, 28)).toBe(false);
    expect(isDayUnlocked(29, 29)).toBe(true);
    expect(isDayUnlocked(29, 31)).toBe(true);
    expect(isDayUnlocked(30, 31)).toBe(false);
    for (const day of [13, 14, 15, 16]) expect(isDayUnlocked(day, 31)).toBe(false);
    expect(isDayUnlocked(0, 31)).toBe(false);
    expect(isDayUnlocked(31, 31)).toBe(false);
  });

  it("formatiert Kalenderdaten auf Deutsch", () => {
    expect(formatDateDE(getRaunaechteDate(2026, 1))).toBe("8. Dez");
    expect(formatDateDE(getRaunaechteDate(2026, 30))).toBe("6. Jan");
  });

  it.each([[new Date(2026, 9, 9), 2026], [new Date(2027, 0, 6), 2026], [new Date(2027, 4, 10), 2026]])(
    "verwendet für %s das Beginnjahr %i", (now, year) => {
      vi.useFakeTimers();
      vi.setSystemTime(now);
      expect(getCurrentRaunaechteYear()).toBe(year);
      expect(getProgramYear(now)).toBe(year);
    },
  );

  it("öffnet die Anmeldung direkt zur angegebenen eigenen Website und entfernt die Warteliste", () => {
    expect(RAUHNAECHTE_PROGRAM.registrationUrl).toBe("https://dieseelenplanerin.de/rauhnaechte");
    expect(isOwnedSeelenplanerinUrl(RAUHNAECHTE_PROGRAM.registrationUrl)).toBe(true);
    expect(RAUHNAECHTE_PROGRAM.journalUrl).toBe("https://seelenplanerin.github.io/rauhnaechte-journal/");
    const screen = read("app/(tabs)/raunaechte.tsx");
    expect(screen).toContain("openSeelenplanerinUrl(RAUHNAECHTE_PROGRAM.registrationUrl)");
    expect(screen).toContain("Jetzt anmelden →");
    expect(screen).toContain("Die Anmeldung ist geöffnet");
    expect(screen).toContain("25 Inhaltstage mit insgesamt 75 Inhalten");
    expect(screen).toContain("Zeit zum Nachspüren");
    expect(screen).not.toMatch(/Warteliste|waitlist|aktuell nicht verfügbar|10\. Dezember|von 28/);
    expect(read("server/daily-push.ts")).toContain("getProgramDay(programYear, berlinTime)");
    expect(read("server/daily-push.ts")).not.toContain("day - 9");
  });
});
