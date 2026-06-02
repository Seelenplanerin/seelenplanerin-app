import { describe, it, expect } from "vitest";

// Test the URL extraction regex used in lib/notifications.ts
const extractUrl = (body: string): string | null => {
  const urlMatch = body.match(/https?:\/\/[^\s]+/);
  return urlMatch ? urlMatch[0] : null;
};

describe("Notification URL extraction", () => {
  it("extracts a URL from body text", () => {
    const body = "Schau dir das neue Ritual an: https://www.dieseelenplanerin.de/ritual/vollmond";
    expect(extractUrl(body)).toBe("https://www.dieseelenplanerin.de/ritual/vollmond");
  });

  it("extracts URL at the beginning of body", () => {
    const body = "https://example.com/page hier ist dein Link";
    expect(extractUrl(body)).toBe("https://example.com/page");
  });

  it("extracts URL at the end of body", () => {
    const body = "Dein Link: https://www.app.dieseelenplanerin.de/seelenlegung";
    expect(extractUrl(body)).toBe("https://www.app.dieseelenplanerin.de/seelenlegung");
  });

  it("returns null when no URL present", () => {
    const body = "Guten Morgen! Dein Tagesimpuls wartet auf dich.";
    expect(extractUrl(body)).toBeNull();
  });

  it("extracts first URL when multiple URLs present", () => {
    const body = "Link 1: https://first.com und Link 2: https://second.com";
    expect(extractUrl(body)).toBe("https://first.com");
  });

  it("handles http (non-https) URLs", () => {
    const body = "Hier: http://example.com/path?q=1";
    expect(extractUrl(body)).toBe("http://example.com/path?q=1");
  });

  it("handles URLs with query parameters and paths", () => {
    const body = "Klicke hier: https://www.dieseelenplanerin.de/shop?category=kerzen&id=123";
    expect(extractUrl(body)).toBe("https://www.dieseelenplanerin.de/shop?category=kerzen&id=123");
  });
});
