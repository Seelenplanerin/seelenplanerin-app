export type ProductCategory = "raeuchern" | "kerzen" | "heilsteine" | "digital" | "sets";

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  currency: string;
  emoji: string;
  category: ProductCategory;
  tags: string[];
  ritualIds?: string[]; // Welche Rituale passen zu diesem Produkt
  isBestseller?: boolean;
  isNew?: boolean;
  externalUrl?: string; // Link zum externen Shop
}

export const PRODUCT_CATEGORIES: Record<ProductCategory, { label: string; labelEn: string; emoji: string }> = {
  raeuchern: { label: "Räuchern", labelEn: "Incense", emoji: "🌿" },
  kerzen: { label: "Kerzen", labelEn: "Candles", emoji: "🕯️" },
  heilsteine: { label: "Heilsteine", labelEn: "Crystals", emoji: "💎" },
  digital: { label: "Digitales", labelEn: "Digital", emoji: "📖" },
  sets: { label: "Sets", labelEn: "Sets", emoji: "✨" },
};

export const PRODUCTS: Product[] = [
  // Räuchern
  {
    id: "p1",
    name: "Weißer Salbei – Reinigungsbündel",
    nameEn: "White Sage – Cleansing Bundle",
    description: "Reinige deinen Raum und deine Energie mit diesem hochwertigen weißen Salbei-Bündel. Ideal für Mondrituale und Energiereinigung.",
    descriptionEn: "Cleanse your space and energy with this premium white sage bundle. Ideal for moon rituals and energy cleansing.",
    price: 8.90,
    currency: "EUR",
    emoji: "🌿",
    category: "raeuchern",
    tags: ["Reinigung", "Mondrituale", "Energie"],
    ritualIds: ["r1", "r3"],
    isBestseller: true,
  },
  {
    id: "p2",
    name: "Palo Santo – Heiliges Holz",
    nameEn: "Palo Santo – Sacred Wood",
    description: "Das heilige Holz aus Südamerika bringt positive Energie und Frieden in deinen Raum. 3 Stäbchen im Set.",
    descriptionEn: "Sacred wood from South America brings positive energy and peace to your space. Set of 3 sticks.",
    price: 9.90,
    currency: "EUR",
    emoji: "🪵",
    category: "raeuchern",
    tags: ["Positive Energie", "Reinigung", "Meditation"],
    ritualIds: ["r1", "r2"],
    isBestseller: true,
  },
  {
    id: "p3",
    name: "Räucherstäbchen – Mondmagie Set",
    nameEn: "Incense Sticks – Moon Magic Set",
    description: "12 handgefertigte Räucherstäbchen mit Mondblumen, Lavendel und Jasmin. Perfekt für deine Mondrituale.",
    descriptionEn: "12 handcrafted incense sticks with moonflower, lavender and jasmine. Perfect for your moon rituals.",
    price: 12.90,
    currency: "EUR",
    emoji: "🌙",
    category: "raeuchern",
    tags: ["Mondmagie", "Lavendel", "Jasmin"],
    ritualIds: ["r2", "r4"],
    isNew: true,
  },
  // Kerzen
  {
    id: "p4",
    name: "Mondphasen-Kerze – Vollmond",
    nameEn: "Moon Phase Candle – Full Moon",
    description: "Handgegossene Kerze mit Rosenquarz und Lavendelduft. Brenndauer ca. 40 Stunden. Für Vollmond-Rituale.",
    descriptionEn: "Hand-poured candle with rose quartz and lavender scent. Burn time approx. 40 hours. For full moon rituals.",
    price: 18.90,
    currency: "EUR",
    emoji: "🕯️",
    category: "kerzen",
    tags: ["Vollmond", "Rosenquarz", "Lavendel"],
    ritualIds: ["r2", "r4"],
    isBestseller: true,
  },
  {
    id: "p5",
    name: "Neumond-Kerze – Intention setzen",
    nameEn: "New Moon Candle – Set Intentions",
    description: "Schwarze Kerze mit Amethyst und Sandelholzduft. Ideal für Neumond-Rituale und das Setzen von Intentionen.",
    descriptionEn: "Black candle with amethyst and sandalwood scent. Ideal for new moon rituals and setting intentions.",
    price: 18.90,
    currency: "EUR",
    emoji: "🌑",
    category: "kerzen",
    tags: ["Neumond", "Amethyst", "Intentionen"],
    ritualIds: ["r1", "r3"],
  },
  {
    id: "p6",
    name: "Chakra-Kerzen Set – 7 Kerzen",
    nameEn: "Chakra Candle Set – 7 Candles",
    description: "7 farbige Kerzen für die 7 Chakren. Mit passenden ätherischen Ölen und Heilsteinen.",
    descriptionEn: "7 colored candles for the 7 chakras. With matching essential oils and healing crystals.",
    price: 34.90,
    currency: "EUR",
    emoji: "🌈",
    category: "kerzen",
    tags: ["Chakra", "Energie", "Balance"],
    isNew: true,
  },
  // Heilsteine
  {
    id: "p7",
    name: "Rosenquarz – Stein der Liebe",
    nameEn: "Rose Quartz – Stone of Love",
    description: "Natürlicher Rosenquarz-Rohstein für Selbstliebe, Heilung und emotionale Balance. Ca. 3–5 cm.",
    descriptionEn: "Natural raw rose quartz for self-love, healing and emotional balance. Approx. 3–5 cm.",
    price: 7.90,
    currency: "EUR",
    emoji: "💗",
    category: "heilsteine",
    tags: ["Liebe", "Heilung", "Selbstliebe"],
    isBestseller: true,
  },
  {
    id: "p8",
    name: "Amethyst – Stein der Intuition",
    nameEn: "Amethyst – Stone of Intuition",
    description: "Amethyst stärkt die Intuition und schützt vor negativen Energien. Perfekt für Meditationen.",
    descriptionEn: "Amethyst strengthens intuition and protects against negative energies. Perfect for meditations.",
    price: 9.90,
    currency: "EUR",
    emoji: "💜",
    category: "heilsteine",
    tags: ["Intuition", "Schutz", "Meditation"],
    ritualIds: ["r2"],
  },
  {
    id: "p9",
    name: "Mondstein – Stein der Weiblichkeit",
    nameEn: "Moonstone – Stone of Femininity",
    description: "Der Mondstein verbindet dich mit deiner weiblichen Energie und dem Mondrhythmus.",
    descriptionEn: "Moonstone connects you with your feminine energy and the moon rhythm.",
    price: 14.90,
    currency: "EUR",
    emoji: "🌕",
    category: "heilsteine",
    tags: ["Weiblichkeit", "Mondenergie", "Intuition"],
    ritualIds: ["r2", "r4"],
    isBestseller: true,
  },
  // Digital
  {
    id: "p10",
    name: "Mondkalender 2026 – PDF",
    nameEn: "Moon Calendar 2026 – PDF",
    description: "Dein spiritueller Begleiter durch das Jahr. Mit Mondphasen, Ritualen und Affirmationen für jeden Monat.",
    descriptionEn: "Your spiritual companion through the year. With moon phases, rituals and affirmations for every month.",
    price: 12.00,
    currency: "EUR",
    emoji: "📅",
    category: "digital",
    tags: ["Mondkalender", "PDF", "Rituale"],
    isNew: true,
  },
  {
    id: "p11",
    name: "Rauhnächte-Guide – PDF",
    nameEn: "Rauhnächte Guide – PDF",
    description: "Der komplette Guide für die 12 heiligen Nächte: Rituale, Meditationen, Traumdeutung und Jahresrückblick.",
    descriptionEn: "The complete guide for the 12 holy nights: rituals, meditations, dream interpretation and year review.",
    price: 15.00,
    currency: "EUR",
    emoji: "📖",
    category: "digital",
    tags: ["Rauhnächte", "Rituale", "Jahresrückblick"],
    isBestseller: true,
  },
  // Sets
  {
    id: "p12",
    name: "Mondmagie Starter-Set",
    nameEn: "Moon Magic Starter Set",
    description: "Alles was du für deine ersten Mondrituale brauchst: Weißer Salbei, Mondstein, Mondphasen-Kerze und Ritual-Anleitung.",
    descriptionEn: "Everything you need for your first moon rituals: white sage, moonstone, moon phase candle and ritual guide.",
    price: 39.90,
    currency: "EUR",
    emoji: "✨",
    category: "sets",
    tags: ["Starter", "Mondrituale", "Komplett-Set"],
    isBestseller: true,
    isNew: false,
  },
  {
    id: "p13",
    name: "Seelen-Reinigung Set",
    nameEn: "Soul Cleansing Set",
    description: "Palo Santo, Amethyst, Reinigungskerze und geführte Meditation als Audio. Für tiefe Energiereinigung.",
    descriptionEn: "Palo Santo, amethyst, cleansing candle and guided meditation as audio. For deep energy cleansing.",
    price: 44.90,
    currency: "EUR",
    emoji: "🌟",
    category: "sets",
    tags: ["Reinigung", "Energie", "Meditation"],
    isNew: true,
  },
];

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsForRitual(ritualId: string): Product[] {
  return PRODUCTS.filter((p) => p.ritualIds?.includes(ritualId)).slice(0, 3);
}

export function getBestsellers(): Product[] {
  return PRODUCTS.filter((p) => p.isBestseller);
}

export function getNewProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isNew);
}
