export interface OfficialOffer {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  url: string;
}

/**
 * Zentrale Quelle für die aktuell verifizierten Angebote der Seelenplanerin.
 * Stand: 11. September 2026, abgeglichen mit dieseelenplanerin.de/seelenarbeit.
 */
export const OFFICIAL_OFFERS = {
  auraReading: {
    id: "aura-reading",
    name: "Aura Reading",
    price: 147,
    priceLabel: "147 €",
    url: "https://dieseelenplanerin.de/seelenarbeit/aura-analyse",
  },
  thetaHealing: {
    id: "thetahealing-intensiv",
    name: "ThetaHealing Intensiv",
    price: 197,
    priceLabel: "197 €",
    url: "https://dieseelenplanerin.de/seelenarbeit/thetahealing",
  },
  seelenlegungEineFrage: {
    id: "seelenlegung-eine-frage",
    name: "Seelenlegung – Eine Frage",
    price: 47,
    priceLabel: "47 €",
    url: "https://dieseelenplanerin.de/seelenarbeit/seelenlegung",
  },
  seelenlegungGross: {
    id: "seelenlegung-gross",
    name: "Große Seelenlegung",
    price: 97,
    priceLabel: "97 €",
    url: "https://dieseelenplanerin.de/seelenarbeit/seelenlegung",
  },
  seelenklang: {
    id: "seelenklang",
    name: "Seelenklang – 3 Monate",
    price: 2197,
    priceLabel: "2.197 €",
    url: "https://dieseelenplanerin.de/seelenarbeit/seelenklang",
  },
} as const satisfies Record<string, OfficialOffer>;

/** Aktuelle Einzelpreise für ein vollständiges Runen-Armband. */
export const RUNEN_PRICES = {
  armband: 24,
  armbandLabel: "24 €",
  zweiThemenrunen: 22,
  zweiThemenrunenLabel: "22 €",
  schutzrune: 11,
  schutzruneLabel: "11 €",
  gesamt: 57,
  gesamtLabel: "57 €",
  versandLabel: "Versandkostenfrei ab 50 €",
  url: "https://dieseelenplanerin.de/runenarmbander",
} as const;

export const SHOP_PRICES = {
  energiearmband: { price: 33, priceLabel: "33 €" },
  meditationskerze: { price: 17, priceLabel: "17 €" },
} as const;
