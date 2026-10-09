import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { OFFICIAL_OFFERS, RUNEN_PRICES, SHOP_PRICES } from "../data/angebote";
import {
  RITUAL_SETS,
  RITUAL_SET_ASSIGNMENTS,
  getRitualSetForRitual,
} from "../data/ritual-sets";
import { RITUALE_2026 } from "../data/rituale-kalender";
import { RUNEN_SETS } from "../lib/runen-sets";

const projectRoot = process.cwd();
const readSource = (relativePath: string) => readFileSync(join(projectRoot, relativePath), "utf8");

describe("Aktuelle Angebotspreise", () => {
  it("enthält die verifizierten Preise und offiziellen Detailseiten", () => {
    expect(OFFICIAL_OFFERS.auraReading).toMatchObject({
      price: 147,
      priceLabel: "147 €",
      url: "https://dieseelenplanerin.de/seelenarbeit/aura-analyse",
    });
    expect(OFFICIAL_OFFERS.thetaHealing).toMatchObject({
      price: 197,
      priceLabel: "197 €",
      url: "https://dieseelenplanerin.de/seelenarbeit/thetahealing",
    });
    expect(OFFICIAL_OFFERS.seelenlegungEineFrage.price).toBe(47);
    expect(OFFICIAL_OFFERS.seelenlegungGross.price).toBe(97);
    expect(OFFICIAL_OFFERS.seelenklang.price).toBe(2197);
    expect(SHOP_PRICES.energiearmband.price).toBe(33);
    expect(SHOP_PRICES.meditationskerze.price).toBe(17);
  });

  it("enthält keine alten Aura- oder Seelenlegungs-Preise in den sichtbaren Angebotsflächen", () => {
    const sources = [
      "app/aura.tsx",
      "app/buchen/index.tsx",
      "app/(tabs)/community.tsx",
      "components/ritual-shop-screen.tsx",
      "app/seelenlegung.tsx",
    ].map(readSource).join("\n");

    expect(sources).not.toContain("111 €");
    expect(sources).not.toContain("111,00 €");
    expect(sources).not.toContain("ab 33 €");
    expect(sources).not.toContain("Jetzt für 33 € buchen");
    expect(sources).not.toContain("Jetzt für 77 € buchen");
  });

  it("bildet das vollständige Runen-Armband korrekt und versandkostenfrei ab", () => {
    expect(RUNEN_PRICES).toMatchObject({
      armband: 24,
      zweiThemenrunen: 22,
      schutzrune: 11,
      gesamt: 57,
      versandLabel: "Versandkostenfrei ab 50 €",
    });
    expect(RUNEN_SETS).toHaveLength(40);
    expect(RUNEN_SETS.every((set) => set.preis === RUNEN_PRICES.gesamt)).toBe(true);
    expect(RUNEN_SETS.every((set) => set.shopUrl === RUNEN_PRICES.url)).toBe(true);
  });

  it("zeigt keine Frequenz-Armbänder in beiden Shoprouten, behält aber die anderen Armbänder", () => {
    const shop = readSource("components/ritual-shop-screen.tsx");
    const tabRoute = readSource("app/(tabs)/shop.tsx");
    const shopRoute = readSource("app/shop/index.tsx");

    expect(shop).not.toMatch(/frequenz[-\s]?armb[äa]nder|frequenz-armbaender/i);
    expect(shop).toContain("Energiearmbänder");
    expect(shop).toContain("Runen-Armbänder");
    expect(tabRoute).toContain("RitualShopScreen");
    expect(shopRoute).toContain("RitualShopScreen");
  });
});

describe("Aktuelle Ritual-Sets", () => {
  it("enthält exakt die fünf offiziellen Sets mit Preis, Direktlink und Bild", () => {
    expect(RITUAL_SETS).toEqual([
      expect.objectContaining({ id: "schutz", name: "Schutz-Ritual-Set", price: 49, url: "https://dieseelenplanerin.de/produkt/bundle-schutz-ritual", imageUrl: "https://dieseelenplanerin.de/manus-storage/bundle-schutz-collage_a45e8bcb.jpg" }),
      expect.objectContaining({ id: "selbstliebe", name: "Selbstliebe-Set", price: 52, url: "https://dieseelenplanerin.de/produkt/bundle-selbstliebe", imageUrl: "https://dieseelenplanerin.de/manus-storage/bundle-selbstliebe-collage_390daae6.jpg" }),
      expect.objectContaining({ id: "klarheit-ruhe", name: "Klarheit & Ruhe Set", price: 52, url: "https://dieseelenplanerin.de/produkt/bundle-klarheit-ruhe", imageUrl: "https://dieseelenplanerin.de/manus-storage/bundle-klarheit-collage_e0df72ac.jpg" }),
      expect.objectContaining({ id: "manifestation", name: "Manifestations-Set", price: 52, url: "https://dieseelenplanerin.de/produkt/bundle-manifestation", imageUrl: "https://dieseelenplanerin.de/manus-storage/bundle-manifestation-collage_938f31e8.jpg" }),
      expect.objectContaining({ id: "komplett", name: "Komplett-Ritual-Set", price: 69, url: "https://dieseelenplanerin.de/produkt/bundle-komplett-ritual", imageUrl: "https://dieseelenplanerin.de/manus-storage/bundle-komplett-collage_394fda0b.jpg" }),
    ]);
  });

  it("ordnet jedes der 51 Rituale genau einem vorhandenen Set zu", () => {
    expect(RITUALE_2026).toHaveLength(51);
    expect(Object.keys(RITUAL_SET_ASSIGNMENTS).sort()).toEqual(RITUALE_2026.map((ritual) => ritual.id).sort());

    for (const ritual of RITUALE_2026) {
      const set = getRitualSetForRitual(ritual);
      expect(RITUAL_SETS.some((candidate) => candidate.id === set.id)).toBe(true);
      expect(set.url).toMatch(/^https:\/\/dieseelenplanerin\.de\/produkt\/bundle-/);
      expect(set.imageUrl).toMatch(/^https:\/\/dieseelenplanerin\.de\/manus-storage\//);
    }
  });

  it("enthält in aktuellen Preis- und Ritualflächen keine Tentary-Altlinks", () => {
    const sources = [
      "data/rituale-kalender.ts",
      "data/ritual-sets.ts",
      "data/angebote.ts",
      "components/ritual-set-card.tsx",
      "components/ritual-shop-screen.tsx",
      "app/(tabs)/rituale.tsx",
      "app/rituale/[slug].tsx",
      "app/aura.tsx",
      "app/buchen/index.tsx",
      "app/(tabs)/community.tsx",
      "lib/runen-sets.ts",
      "app/runen/set/[id].tsx",
    ].map(readSource).join("\n");

    expect(sources.toLowerCase()).not.toContain("tentary.com");
  });
});
