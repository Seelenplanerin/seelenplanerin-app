import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { isOwnedSeelenplanerinUrl } from "../lib/link-security";

const ROOT = join(import.meta.dirname, "..");

const COMMERCE_FILES = [
  "data/angebote.ts",
  "data/ritual-sets.ts",
  "components/ritual-shop-screen.tsx",
  "app/buchen/index.tsx",
  "app/(tabs)/community.tsx",
  "app/runen-quiz.tsx",
  "app/heilstein-quiz.tsx",
  "app/kerzen-quiz.tsx",
];

const PROTECTED_LINK_FILES = [
  ...COMMERCE_FILES,
  "lib/runen-sets.ts",
  "lib/raunaechte-program.ts",
  "app/(tabs)/raunaechte.tsx",
  "lib/notifications.ts",
  "lib/link-security.ts",
  "lib/open-owned-url.ts",
  "app/nachrichten.tsx",
  "app/aura.tsx",
  "app/seelenlegung.tsx",
  "app/(tabs)/runen.tsx",
  "app/runen/set/[id].tsx",
  "components/ritual-set-card.tsx",
];

function read(relativePath: string): string {
  return readFileSync(join(ROOT, relativePath), "utf8");
}

describe("Eigene Kauf- und Buchungsziele", () => {
  it.each(COMMERCE_FILES)("enthält in %s nur eigene URL-Felder", (relativePath) => {
    const source = read(relativePath);
    const matches = [
      ...source.matchAll(/(?:url|bookingUrl|shopUrl):\s*["'](https?:\/\/[^"']+)["']/g),
    ];

    expect(matches.length).toBeGreaterThan(0);
    for (const [, url] of matches) {
      expect(isOwnedSeelenplanerinUrl(url), `${relativePath}: ${url}`).toBe(true);
    }
  });

  it("enthält weder Seelenschmuck noch alte Tentary-Ziele im App-Quellcode", () => {
    const source = PROTECTED_LINK_FILES
      .map(read)
      .join("\n");

    expect(source).not.toMatch(/shop-seelenschmuck|seelenschmuck\.at|Seelenschmuck/i);
    expect(source).not.toMatch(/(?:dieseelenplanerin\.)?tentary\.com/i);
  });
});
