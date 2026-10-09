import { describe, expect, it } from "vitest";

import {
  findFirstOwnedSeelenplanerinUrl,
  getOwnedSeelenplanerinUrl,
  isOwnedSeelenplanerinUrl,
  normalizeExternalUrl,
} from "../lib/link-security";

describe("Link-Sicherheit", () => {
  it.each([
    "https://dieseelenplanerin.de",
    "https://dieseelenplanerin.de/produkt/divine-circle",
    "https://www.dieseelenplanerin.de/kontakt",
    "https://www.app.dieseelenplanerin.de",
  ])("erlaubt ausschließlich eigene HTTPS-Domains: %s", (url) => {
    expect(isOwnedSeelenplanerinUrl(url)).toBe(true);
    expect(getOwnedSeelenplanerinUrl(url)).toBe(url);
  });

  it.each([
    "https://shop-seelenschmuck.at",
    "https://seelenschmuck.at",
    "https://dieseelenplanerin.de.evil.example/produkt",
    "https://evil-dieseelenplanerin.de/produkt",
    "http://dieseelenplanerin.de/produkt/divine-circle",
    "javascript:alert(1)",
    "not-a-url",
  ])("blockiert fremde, unsichere oder täuschende Ziele: %s", (url) => {
    expect(isOwnedSeelenplanerinUrl(url)).toBe(false);
    expect(getOwnedSeelenplanerinUrl(url)).toBeNull();
  });

  it("entfernt Satzzeichen hinter Links", () => {
    expect(normalizeExternalUrl("https://dieseelenplanerin.de/shop)."))
      .toBe("https://dieseelenplanerin.de/shop");
  });

  it("öffnet aus Nachrichtentexten nur die erste eigene URL", () => {
    expect(
      findFirstOwnedSeelenplanerinUrl(
        "Nicht https://shop-seelenschmuck.at, sondern https://dieseelenplanerin.de/produkt/divine-circle.",
      ),
    ).toBe("https://dieseelenplanerin.de/produkt/divine-circle");
    expect(findFirstOwnedSeelenplanerinUrl("Nur https://shop-seelenschmuck.at"))
      .toBeNull();
  });
});
