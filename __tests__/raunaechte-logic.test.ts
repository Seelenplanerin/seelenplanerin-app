import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AsyncStorage and Platform before importing
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("react-native", () => ({
  Platform: { OS: "web" },
}));

import {
  getCurrentRaunaechteDay,
  getRaunaechteDate,
  isDayUnlocked,
  formatDateDE,
  getCurrentRaunaechteYear,
} from "../lib/raunaechte-store";

describe("Raunächte Store - Logik-Funktionen", () => {
  describe("getCurrentRaunaechteDay", () => {
    it("gibt 0 zurück wenn vor dem 10. Dezember", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 10, 15)); // 15. November 2026
      expect(getCurrentRaunaechteDay(2026)).toBe(0);
      vi.useRealTimers();
    });

    it("gibt 1 zurück am 10. Dezember", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 11, 10, 12, 0)); // 10. Dez 2026 12:00
      expect(getCurrentRaunaechteDay(2026)).toBe(1);
      vi.useRealTimers();
    });

    it("gibt 5 zurück am 14. Dezember", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 11, 14, 12, 0)); // 14. Dez 2026
      expect(getCurrentRaunaechteDay(2026)).toBe(5);
      vi.useRealTimers();
    });

    it("gibt 28 zurück am 5. Januar (vorletzter Tag)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2027, 0, 5, 12, 0)); // 5. Jan 2027
      expect(getCurrentRaunaechteDay(2026)).toBe(27);
      vi.useRealTimers();
    });

    it("gibt 28 zurück am 6. Januar (letzter Tag)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2027, 0, 6, 12, 0)); // 6. Jan 2027 12:00
      expect(getCurrentRaunaechteDay(2026)).toBe(28);
      vi.useRealTimers();
    });

    it("gibt 29 zurück nach dem 6. Januar (alle offen)", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2027, 0, 10)); // 10. Jan 2027
      expect(getCurrentRaunaechteDay(2026)).toBe(29);
      vi.useRealTimers();
    });
  });

  describe("getRaunaechteDate", () => {
    it("Tag 1 ist der 10. Dezember", () => {
      const date = getRaunaechteDate(2026, 1);
      expect(date.getDate()).toBe(10);
      expect(date.getMonth()).toBe(11); // Dezember = 11
    });

    it("Tag 22 ist der 31. Dezember", () => {
      const date = getRaunaechteDate(2026, 22);
      expect(date.getDate()).toBe(31);
      expect(date.getMonth()).toBe(11); // Dezember
    });

    it("Tag 23 ist der 1. Januar", () => {
      const date = getRaunaechteDate(2026, 23);
      expect(date.getDate()).toBe(1);
      expect(date.getMonth()).toBe(0); // Januar
    });

    it("Tag 28 ist der 6. Januar", () => {
      const date = getRaunaechteDate(2026, 28);
      expect(date.getDate()).toBe(6);
      expect(date.getMonth()).toBe(0); // Januar
    });
  });

  describe("isDayUnlocked", () => {
    it("Tag 1 ist freigeschaltet wenn currentDay >= 1", () => {
      expect(isDayUnlocked(1, 1)).toBe(true);
      expect(isDayUnlocked(1, 5)).toBe(true);
    });

    it("Tag 5 ist gesperrt wenn currentDay < 5", () => {
      expect(isDayUnlocked(5, 4)).toBe(false);
      expect(isDayUnlocked(5, 3)).toBe(false);
    });

    it("alle Tage sind offen wenn currentDay >= 29", () => {
      expect(isDayUnlocked(1, 29)).toBe(true);
      expect(isDayUnlocked(28, 29)).toBe(true);
    });
  });

  describe("formatDateDE", () => {
    it("formatiert 10. Dezember korrekt", () => {
      const date = new Date(2026, 11, 10);
      expect(formatDateDE(date)).toBe("10. Dez");
    });

    it("formatiert 1. Januar korrekt", () => {
      const date = new Date(2027, 0, 1);
      expect(formatDateDE(date)).toBe("1. Jan");
    });
  });

  describe("getCurrentRaunaechteYear", () => {
    it("gibt aktuelles Jahr zurück ab Oktober", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 9, 15)); // 15. Oktober 2026
      expect(getCurrentRaunaechteYear()).toBe(2026);
      vi.useRealTimers();
    });

    it("gibt vorheriges Jahr zurück im Januar-September", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2027, 0, 5)); // 5. Januar 2027
      expect(getCurrentRaunaechteYear()).toBe(2026);
      vi.useRealTimers();
    });

    it("gibt vorheriges Jahr zurück im Mai", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 4, 10)); // 10. Mai 2026
      expect(getCurrentRaunaechteYear()).toBe(2025);
      vi.useRealTimers();
    });
  });
});
