export type RitualSetId =
  | "schutz"
  | "selbstliebe"
  | "klarheit-ruhe"
  | "manifestation"
  | "komplett";

export interface RitualSet {
  id: RitualSetId;
  name: string;
  price: number;
  priceLabel: string;
  url: string;
  imageUrl: string;
  description: string;
  components: readonly string[];
}

/**
 * Aktueller offizieller Ritual-Set-Katalog.
 * Produktseiten, Preise und Bilder wurden am 18. September 2026 geprüft.
 */
export const RITUAL_SETS: readonly RitualSet[] = [
  {
    id: "schutz",
    name: "Schutz-Ritual-Set",
    price: 49,
    priceLabel: "49 €",
    url: "https://dieseelenplanerin.de/produkt/bundle-schutz-ritual",
    imageUrl: "https://dieseelenplanerin.de/manus-storage/bundle-schutz-collage_a45e8bcb.jpg",
    description: "Für energetischen Schutz, Reinigung und klare Grenzen.",
    components: ["Bodyguard-Armband", "Schwarzer Turmalin", "Weißer Salbei"],
  },
  {
    id: "selbstliebe",
    name: "Selbstliebe-Set",
    price: 52,
    priceLabel: "52 €",
    url: "https://dieseelenplanerin.de/produkt/bundle-selbstliebe",
    imageUrl: "https://dieseelenplanerin.de/manus-storage/bundle-selbstliebe-collage_390daae6.jpg",
    description: "Für Herzensöffnung, Selbstannahme und liebevolle Verbindung.",
    components: ["True-Love-Armband", "Rosenquarz-Kerze", "Rosenquarz-Stein"],
  },
  {
    id: "klarheit-ruhe",
    name: "Klarheit & Ruhe Set",
    price: 52,
    priceLabel: "52 €",
    url: "https://dieseelenplanerin.de/produkt/bundle-klarheit-ruhe",
    imageUrl: "https://dieseelenplanerin.de/manus-storage/bundle-klarheit-collage_e0df72ac.jpg",
    description: "Für innere Ruhe, Meditation, Balance und klare Gedanken.",
    components: ["Calm-Spirit-Armband", "Amethyst-Kerze", "Amethyst-Stein"],
  },
  {
    id: "manifestation",
    name: "Manifestations-Set",
    price: 52,
    priceLabel: "52 €",
    url: "https://dieseelenplanerin.de/produkt/bundle-manifestation",
    imageUrl: "https://dieseelenplanerin.de/manus-storage/bundle-manifestation-collage_938f31e8.jpg",
    description: "Für Wünsche, Fülle, neue Wege und kraftvolle Intentionen.",
    components: ["Positive-Mind-Armband", "Citrin-Kerze", "Pyrit"],
  },
  {
    id: "komplett",
    name: "Komplett-Ritual-Set",
    price: 69,
    priceLabel: "69 €",
    url: "https://dieseelenplanerin.de/produkt/bundle-komplett-ritual",
    imageUrl: "https://dieseelenplanerin.de/manus-storage/bundle-komplett-collage_394fda0b.jpg",
    description: "Der vielseitige Begleiter für Jahreskreisfeste und umfassende Rituale.",
    components: ["Energiearmband", "Meditationskerze", "Palo Santo", "Selenit-Schale"],
  },
] as const;

export const RITUAL_SETS_BY_ID: Readonly<Record<RitualSetId, RitualSet>> = Object.fromEntries(
  RITUAL_SETS.map((set) => [set.id, set]),
) as Record<RitualSetId, RitualSet>;

/**
 * Bewusste, nachvollziehbare Empfehlung pro Ritual:
 * Schutz/Reinigung → Schutz, Herz/Liebe/Wärme → Selbstliebe,
 * Meditation/Stille/Klarheit → Klarheit & Ruhe,
 * Wünsche/Fülle/Ernte/Neuanfang/Sonne → Manifestation,
 * umfassende Jahreskreis- und Mehrthemenrituale → Komplett.
 */
export const RITUAL_SET_ASSIGNMENTS: Readonly<Record<string, RitualSetId>> = {
  "feb-1": "komplett",
  "feb-2": "komplett",
  "feb-3": "selbstliebe",
  "mar-1": "komplett",
  "mar-2": "manifestation",
  "mar-3": "komplett",
  "mar-4": "klarheit-ruhe",
  "apr-1": "selbstliebe",
  "apr-2": "manifestation",
  "apr-3": "komplett",
  "mai-1": "komplett",
  "mai-2": "schutz",
  "mai-3": "klarheit-ruhe",
  "jun-1": "klarheit-ruhe",
  "jun-2": "manifestation",
  "jun-3": "schutz",
  "jun-4": "selbstliebe",
  "jul-1": "komplett",
  "jul-2": "manifestation",
  "jul-3": "manifestation",
  "aug-1": "manifestation",
  "aug-2": "manifestation",
  "aug-3": "komplett",
  "aug-4": "schutz",
  "sep-1": "manifestation",
  "sep-2": "manifestation",
  "sep-3": "schutz",
  "okt-1": "klarheit-ruhe",
  "okt-2": "schutz",
  "okt-3": "schutz",
  "nov-1": "klarheit-ruhe",
  "nov-2": "manifestation",
  "nov-3": "klarheit-ruhe",
  "dez-1": "komplett",
  "dez-2": "komplett",
  "dez-3": "manifestation",
  "dez-4": "schutz",
  "feb-4": "schutz",
  "feb-5": "schutz",
  "apr-4": "selbstliebe",
  "apr-5": "klarheit-ruhe",
  "mai-4": "manifestation",
  "mai-5": "komplett",
  "jul-4": "manifestation",
  "jul-5": "schutz",
  "sep-4": "manifestation",
  "sep-5": "klarheit-ruhe",
  "okt-4": "komplett",
  "okt-5": "schutz",
  "nov-4": "klarheit-ruhe",
  "nov-5": "selbstliebe",
};

export function getRitualSetForRitual(ritual: { id: string }): RitualSet {
  const setId = RITUAL_SET_ASSIGNMENTS[ritual.id] ?? "komplett";
  return RITUAL_SETS_BY_ID[setId];
}
