import { describe, it, expect } from "vitest";
import {
  CONTENT_DATA,
  CATEGORY_CONFIG,
  getDailyImpulse,
  getContentByCategory,
  getContentById,
} from "../lib/content-data";
import { getCurrentMoonPhase, getMoonCalendar, MOON_PHASES } from "../lib/moon-phase";

describe("Content Data", () => {
  it("should have content items", () => {
    expect(CONTENT_DATA.length).toBeGreaterThan(0);
  });

  it("should have all required categories", () => {
    const categories = new Set(CONTENT_DATA.map((item) => item.category));
    expect(categories.has("ritual")).toBe(true);
    expect(categories.has("meditation")).toBe(true);
    expect(categories.has("gedicht")).toBe(true);
    expect(categories.has("impuls")).toBe(true);
  });

  it("should have valid content items with required fields", () => {
    CONTENT_DATA.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.content).toBeTruthy();
      expect(item.emoji).toBeTruthy();
      expect(item.tags).toBeInstanceOf(Array);
    });
  });

  it("should return daily impulse", () => {
    const impulse = getDailyImpulse();
    expect(impulse).toBeDefined();
    expect(impulse.category).toBe("impuls");
  });

  it("should filter content by category", () => {
    const rituals = getContentByCategory("ritual");
    expect(rituals.length).toBeGreaterThan(0);
    rituals.forEach((item) => expect(item.category).toBe("ritual"));
  });

  it("should find content by id", () => {
    const firstItem = CONTENT_DATA[0];
    const found = getContentById(firstItem.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(firstItem.id);
  });

  it("should return undefined for unknown id", () => {
    const found = getContentById("unknown-id-xyz");
    expect(found).toBeUndefined();
  });

  it("should have category config for all categories", () => {
    const categories: Array<"ritual" | "meditation" | "gedicht" | "impuls"> = [
      "ritual",
      "meditation",
      "gedicht",
      "impuls",
    ];
    categories.forEach((cat) => {
      expect(CATEGORY_CONFIG[cat]).toBeDefined();
      expect(CATEGORY_CONFIG[cat].label).toBeTruthy();
      expect(CATEGORY_CONFIG[cat].emoji).toBeTruthy();
    });
  });
});

describe("Moon Phase", () => {
  it("should return current moon phase", () => {
    const phase = getCurrentMoonPhase();
    expect(phase).toBeDefined();
    expect(phase.name).toBeTruthy();
    expect(phase.emoji).toBeTruthy();
    expect(phase.illumination).toBeGreaterThanOrEqual(0);
    expect(phase.illumination).toBeLessThanOrEqual(100);
  });

  it("should have 8 moon phases", () => {
    expect(MOON_PHASES.length).toBe(8);
  });

  it("should return moon calendar with 30 days", () => {
    const calendar = getMoonCalendar();
    expect(calendar.length).toBe(30);
    calendar.forEach((entry) => {
      expect(entry.date).toBeInstanceOf(Date);
      expect(entry.phase).toBeDefined();
    });
  });

  it("should have valid moon phase data", () => {
    MOON_PHASES.forEach((phase) => {
      expect(phase.name).toBeTruthy();
      expect(phase.emoji).toBeTruthy();
      expect(phase.description).toBeTruthy();
      expect(phase.energy).toBeTruthy();
      expect(phase.ritual).toBeTruthy();
      expect(phase.illumination).toBeGreaterThanOrEqual(0);
      expect(phase.illumination).toBeLessThanOrEqual(100);
    });
  });
});
