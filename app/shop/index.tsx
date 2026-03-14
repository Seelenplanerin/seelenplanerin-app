import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Image, Linking, Dimensions,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const { width } = Dimensions.get("window");

type ShopCategory = "alle" | "ritual-sets" | "armbänder" | "sessions" | "digital" | "kerzen";

interface Product {
  id: string;
  name: string;
  nameEn?: string;
  kategorie: ShopCategory;
  preis: number;
  preisDisplay: string;
  beschreibung: string;
  emoji: string;
  highlight?: string;
  tentaryUrl: string;
  badge?: string;
  imageUrl?: string;
}

const PRODUCTS: Product[] = [
  // ═══════════════════════════════════════════════
  // RITUAL-SETS (10 Sets à 29,90 €)
  // ═══════════════════════════════════════════════
  {
    id: "set-schutz",
    name: "Schutz-Ritual-Set",
    kategorie: "ritual-sets",
    preis: 29.90,
    preisDisplay: "29,90 €",
    beschreibung: "Schwarzer Turmalin, Bergkristall, Weißer Salbei & Schwarze Kerze. Für alle Schutzrituale und energetische Reinigung.",
    emoji: "🛡️",
    highlight: "Inkl. Versand",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/OX0aPw",
    badge: "Bestseller",
    imageUrl: "https://img.tentary.com/01-schutz-reinigung_7032068891806368942-1772437515.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-selbstliebe",
    name: "Selbstliebe-Ritual-Set",
    kategorie: "ritual-sets",
    preis: 29.90,
    preisDisplay: "29,90 €",
    beschreibung: "Rosenquarz, Mondstein, Myrrhe & Rosa Kerze. Öffne dein Herz für bedingungslose Selbstliebe.",
    emoji: "💗",
    highlight: "Inkl. Versand",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/QtLnrA",
    imageUrl: "https://img.tentary.com/02-selbstliebe-herzoeffnung_380106635895589047-1772437957.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-fuelle",
    name: "Fülle-Ritual-Set",
    kategorie: "ritual-sets",
    preis: 29.90,
    preisDisplay: "29,90 €",
    beschreibung: "Citrin, Pyrit, Weihrauch & Goldene Kerze. Manifestiere Wohlstand und Überfluss in deinem Leben.",
    emoji: "✨",
    highlight: "Inkl. Versand",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/QjvV1I",
    imageUrl: "https://img.tentary.com/03-fuelle-manifestation_77358612426124021-1772438229.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-transformation",
    name: "Transformations-Ritual-Set",
    kategorie: "ritual-sets",
    preis: 29.90,
    preisDisplay: "29,90 €",
    beschreibung: "Labradorit, Amethyst, Palo Santo & Violette Kerze. Für tiefe Veränderung und Loslassen.",
    emoji: "🦋",
    highlight: "Inkl. Versand",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/sGn2aD",
    imageUrl: "https://img.tentary.com/04-transformation-loslassen_165599632870260090-1772440133.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-kraft",
    name: "Kraft-Ritual-Set",
    kategorie: "ritual-sets",
    preis: 29.90,
    preisDisplay: "29,90 €",
    beschreibung: "Karneol, Sonnenstein, Weihrauch & Rote Kerze. Entfache dein inneres Feuer und finde Stärke.",
    emoji: "🔥",
    highlight: "Inkl. Versand",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/BQ7sqg",
    imageUrl: "https://img.tentary.com/05-kraft-mut_1051342196418700370-1772440449.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-intuition",
    name: "Intuitions-Ritual-Set",
    kategorie: "ritual-sets",
    preis: 29.90,
    preisDisplay: "29,90 €",
    beschreibung: "Amethyst, Mondstein, Myrrhe & Weiße Kerze. Stärke dein Drittes Auge und vertraue deiner inneren Stimme.",
    emoji: "🔮",
    highlight: "Inkl. Versand",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/tfehqK",
    imageUrl: "https://img.tentary.com/06-intuition-spiritualitaet_1589606931969366424-1772440508.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-neuanfang",
    name: "Neuanfang-Ritual-Set",
    kategorie: "ritual-sets",
    preis: 29.90,
    preisDisplay: "29,90 €",
    beschreibung: "Bergkristall, Citrin, Weißer Salbei & Gelbe Kerze. Für frische Starts und neue Kapitel.",
    emoji: "🌱",
    highlight: "Inkl. Versand",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/QFEH0i",
    imageUrl: "https://img.tentary.com/07-neuanfang-klarheit_8655664392057718360-1772440875.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-erdung",
    name: "Erdungs-Ritual-Set",
    kategorie: "ritual-sets",
    preis: 29.90,
    preisDisplay: "29,90 €",
    beschreibung: "Schwarzer Turmalin, Karneol, Palo Santo & Braune Kerze. Verbinde dich mit der Kraft der Erde.",
    emoji: "🌍",
    highlight: "Inkl. Versand",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/VN9WOT",
    imageUrl: "https://img.tentary.com/08-erdung-stabilitaet_1373686916141576984-1772441080.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-lebensfreude",
    name: "Lebensfreude-Ritual-Set",
    kategorie: "ritual-sets",
    preis: 29.90,
    preisDisplay: "29,90 €",
    beschreibung: "Sonnenstein, Karneol, Weihrauch & Orange Kerze. Bringe Leichtigkeit und Freude in deinen Alltag.",
    emoji: "🌻",
    highlight: "Inkl. Versand",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/gFloc9",
    imageUrl: "https://img.tentary.com/09-lebensfreude-energie_40393902163744161-1772441353.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-heilung",
    name: "Heilungs-Ritual-Set",
    kategorie: "ritual-sets",
    preis: 29.90,
    preisDisplay: "29,90 €",
    beschreibung: "Rosenquarz, Amethyst, Palo Santo & Grüne Kerze. Für emotionale und energetische Heilung.",
    emoji: "💚",
    highlight: "Inkl. Versand",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/f9A55Q",
    imageUrl: "https://img.tentary.com/10-heilung-balance_19296041821404264109-1772441606.png?aspect_ratio=1:1&width=640",
  },
  // ═══════════════════════════════════════════════
  // ARMBÄNDER
  // ═══════════════════════════════════════════════
  {
    id: "runen-armband",
    name: "Themen-Armband",
    nameEn: "Theme Bracelet",
    kategorie: "armbänder",
    preis: 61.90,
    preisDisplay: "61,90 €",
    beschreibung: "Silberkette mit 3 handgravierten Runen-Charms + Heilstein-Pulver. Deine persönliche Schutzrune nach Geburtsdatum. Zzgl. Versand.",
    emoji: "ᚱ",
    highlight: "Handgraviert von der Seelenplanerin",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
    badge: "Bestseller",
    imageUrl: "https://img.tentary.com/dsc_4046_1117335234741787370-1769341559.jpg?aspect_ratio=1:1&width=640",
  },
  {
    id: "schutzarmband-mariposa",
    name: "Schutzarmband Mariposa",
    nameEn: "Protection Bracelet Mariposa",
    kategorie: "armbänder",
    preis: 24.00,
    preisDisplay: "24,00 €",
    beschreibung: "Schwarzer Turmalin – der stärkste Schutzstein. Elastisches Band in deiner Wunschfarbe. Schutz vor negativen Energien.",
    emoji: "\ud83d\udda4",
    highlight: "Schwarzer Turmalin",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/gGmtFy",
    imageUrl: "https://img.tentary.com/7b541a8d-2593-47d8-b4b4-3bcddfcf5efc_1499324952774879867-1771118349.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "runen-charm-einzeln",
    name: "Einzelne Runen-Charm",
    nameEn: "Single Rune Charm",
    kategorie: "armbänder",
    preis: 13.90,
    preisDisplay: "ab 13,90 €",
    beschreibung: "Dein persönliches Runen-Charm – handgefertigt mit Kristallpulver. 1 Schutzrune (11 € + Versand) oder 2er Themen-Set (22 € + Versand). Individuell auf dich abgestimmt.",
    emoji: "\u16b1",
    highlight: "Handgefertigt & individuell",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/HWnXez",
    badge: "Unikat",
    imageUrl: "https://img.tentary.com/design-ohne-titel-9_2975822091557902286-1773332430.png?aspect_ratio=1:1&width=640",
  },

  // ═══════════════════════════════════════════════
  // SESSIONS
  // ═══════════════════════════════════════════════
  {
    id: "aura-reading",
    name: "Aura Reading",
    nameEn: "Aura Reading",
    kategorie: "sessions",
    preis: 77.00,
    preisDisplay: "77,00 €",
    beschreibung: "Die Seelenplanerin liest deine Aura und gibt dir tiefe Einblicke in deine Energiefelder, Blockaden und Potenziale.",
    emoji: "🌈",
    highlight: "Persönlich",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/TuOzYS",
    badge: "Beliebt",
    imageUrl: "https://img.tentary.com/pyrit-2-kopie-3_431346584235124704-1765803454.png?aspect_ratio=1:1&width=640",
  },

  // ═══════════════════════════════════════════════
  // KERZEN
  // ═══════════════════════════════════════════════
  {
    id: "meditationskerze",
    name: "Meditationskerze",
    nameEn: "Meditation Candle",
    kategorie: "kerzen",
    preis: 0,
    preisDisplay: "",
    beschreibung: "Handgefertigte Kerze mit deinem persönlichen Heilstein. Jede Kerze ist ein Unikat – wähle deinen Stein im Quiz.",
    emoji: "🕯️",
    highlight: "Individuell mit Heilstein",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/YQLsh3",
    badge: "Neu",
    imageUrl: "https://img.tentary.com/dsc_3934_5475567991227762247-1772375879.jpg?aspect_ratio=1:1&width=640",
  },
  // ═══════════════════════════════════════════════
  // DIGITAL
  // ═══════════════════════════════════════════════
  {
    id: "seelenimpuls",
    name: "Seelenimpuls",
    nameEn: "Soul Impulse",
    kategorie: "digital",
    preis: 17.00,
    preisDisplay: "17,00 €",
    beschreibung: "Digitaler Impuls für deine Seele. Tiefe Botschaften, Rituale und Übungen für deinen persönlichen Wachstumsprozess.",
    emoji: "✨",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/E6FP1U",
    imageUrl: "https://img.tentary.com/seelenimpuls-2_1152465159638903276-1771450850.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "soul-talk",
    name: "Soul Talk",
    nameEn: "Soul Talk",
    kategorie: "digital",
    preis: 0,
    preisDisplay: "Kostenlos",
    beschreibung: "Kostenloser Einstieg in die Welt der Seelenplanerin. Erste Impulse und Einblicke.",
    emoji: "🎁",
    badge: "Gratis",
    tentaryUrl: "https://www.instagram.com/die.seelenplanerin/",
  },
];

const CATEGORIES: { id: ShopCategory; label: string; emoji: string }[] = [
  { id: "alle", label: "Alle", emoji: "✨" },
  { id: "ritual-sets", label: "Ritual-Sets", emoji: "🕯️" },
  { id: "armbänder", label: "Armbänder", emoji: "ᚱ" },
  { id: "sessions", label: "Sessions", emoji: "💫" },
  { id: "kerzen", label: "Kerzen", emoji: "🕯️" },
  { id: "digital", label: "Digital", emoji: "💿" },
];

export default function ShopScreen() {
  const colors = useColors();
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("alle");

  const filtered = activeCategory === "alle"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.kategorie === activeCategory);

  const s = StyleSheet.create({
    header: { padding: 20, paddingBottom: 8 },
    backBtn: { marginBottom: 8 },
    backText: { fontSize: 24, color: colors.primary },
    title: { fontSize: 28, fontWeight: "700", color: "#3D2B1F" },
    subtitle: { fontSize: 15, color: "#9C7B6E", marginTop: 4, fontStyle: "italic" },
    catRow: { paddingHorizontal: 16, paddingBottom: 4, paddingTop: 4, marginBottom: 12 },
    catBtn: {
      flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 12,
      borderRadius: 22, borderWidth: 1.5, borderColor: colors.border, marginRight: 10,
      backgroundColor: colors.surface, minHeight: 44,
    },
    catBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    catText: { fontSize: 14, color: colors.muted, fontWeight: "600" },
    catTextActive: { color: "#fff" },
    catEmoji: { fontSize: 14, marginRight: 4 },
    list: { paddingHorizontal: 16, paddingBottom: 32 },
    card: {
      backgroundColor: "#FFF0EB", borderRadius: 24, padding: 20,
      marginBottom: 14, borderWidth: 1, borderColor: "#EDD9D0",
    },
    cardTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
    emojiBox: {
      width: 52, height: 52, borderRadius: 14, backgroundColor: colors.primary + "15",
      alignItems: "center", justifyContent: "center", marginRight: 14,
    },
    emojiText: { fontSize: 26 },
    cardInfo: { flex: 1 },
    badgeRow: { flexDirection: "row", gap: 6, marginBottom: 4 },
    badge: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
    badgeText: { fontSize: 11, color: "#fff", fontWeight: "700" },
    cardName: { fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 2 },
    cardHighlight: { fontSize: 13, color: colors.primary, fontStyle: "italic" },
    cardDesc: { fontSize: 14, color: colors.muted, lineHeight: 20, marginBottom: 12 },
    cardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    price: { fontSize: 22, fontWeight: "700", color: colors.primary },
    buyBtn: {
      backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 22, paddingVertical: 12,
    },
    buyBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    freeBtn: {
      backgroundColor: "#22C55E", borderRadius: 14, paddingHorizontal: 22, paddingVertical: 12,
    },
    runenBanner: {
      backgroundColor: colors.primary + "15", borderRadius: 20, padding: 20,
      marginHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.primary + "30",
      alignItems: "center",
    },
    runenBannerTitle: { fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 4 },
    runenBannerText: { fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: 12 },
    runenBannerBtn: {
      backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10,
    },
    runenBannerBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    ritualSetsBanner: {
      backgroundColor: "#FAF3E7", borderRadius: 20, padding: 20,
      marginBottom: 16, borderWidth: 1, borderColor: "#C9A96E40",
      alignItems: "center",
    },
    ritualSetsBannerTitle: { fontSize: 18, fontWeight: "700", color: "#3D2B1F", marginBottom: 4 },
    ritualSetsBannerText: { fontSize: 14, color: "#9C7B6E", textAlign: "center", marginBottom: 4 },
    ritualSetsBannerPrice: { fontSize: 16, fontWeight: "700", color: "#C9A96E", marginBottom: 12 },
  });

  const handleBuy = (product: Product) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(product.tentaryUrl);
  };

  return (
    <ScreenContainer>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Shop ✨</Text>
        <Text style={s.subtitle}>Ritual-Sets, Runen-Armbänder & spirituelle Sessions</Text>
      </View>

      {/* Kategorie-Filter */}
      <View style={{ overflow: "visible" }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catRow} contentContainerStyle={{ paddingRight: 24, paddingVertical: 8 }}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[s.catBtn, activeCategory === cat.id && s.catBtnActive]}
            onPress={() => setActiveCategory(cat.id)}
            activeOpacity={0.7}
          >
            <Text style={s.catEmoji}>{cat.emoji}</Text>
            <Text style={[s.catText, activeCategory === cat.id && s.catTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <>
            {(activeCategory === "alle" || activeCategory === "ritual-sets") && (
              <View style={s.ritualSetsBanner}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>🕯️</Text>
                <Text style={s.ritualSetsBannerTitle}>Ritual-Sets für deine Praxis</Text>
                <Text style={s.ritualSetsBannerText}>
                  10 handkuratierte Sets mit Heilsteinen, Räucherwerk & Kerzen – passend zu den Ritualen in der App.
                </Text>
                <Text style={s.ritualSetsBannerPrice}>Je 29,90 € inkl. Versand</Text>
              </View>
            )}
            {(activeCategory === "alle" || activeCategory === "armbänder") && (
              <TouchableOpacity style={s.runenBanner} onPress={() => router.push("/runen-quiz" as any)} activeOpacity={0.8}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>ᚱ</Text>
                <Text style={s.runenBannerTitle}>Finde dein Runen-Set</Text>
                <Text style={s.runenBannerText}>Gib dein Geburtsdatum ein und beantworte 5 Fragen – wir empfehlen dir das perfekte Runen-Armband.</Text>
                <View style={s.runenBannerBtn}>
                  <Text style={s.runenBannerBtnText}>Zum Runen-Quiz →</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            {/* Produktbild wenn vorhanden */}
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: "100%", height: 200, borderRadius: 16, marginBottom: 12 }}
                resizeMode="cover"
              />
            )}
            <View style={s.cardTop}>
              <View style={s.emojiBox}>
                <Text style={s.emojiText}>{item.emoji}</Text>
              </View>
              <View style={s.cardInfo}>
                {item.badge && (
                  <View style={s.badgeRow}>
                    <View style={s.badge}>
                      <Text style={s.badgeText}>{item.badge}</Text>
                    </View>
                  </View>
                )}
                <Text style={s.cardName}>{item.name}</Text>
                {item.highlight && <Text style={s.cardHighlight}>\u2726 {item.highlight}</Text>}
              </View>
            </View>
            <Text style={s.cardDesc}>{item.beschreibung}</Text>
            <View style={s.cardBottom}>
              {item.preisDisplay ? <Text style={s.price}>{item.preisDisplay}</Text> : null}
              <TouchableOpacity
                style={item.preis === 0 ? s.freeBtn : s.buyBtn}
                onPress={() => handleBuy(item)}
                activeOpacity={0.8}
              >
                <Text style={s.buyBtnText}>
                  {item.preisDisplay ? "Kaufen →" : "Ansehen →"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScreenContainer>
  );
}
