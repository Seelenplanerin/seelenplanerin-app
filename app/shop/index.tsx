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
  },
  // ═══════════════════════════════════════════════
  // ARMBÄNDER
  // ═══════════════════════════════════════════════
  {
    id: "runen-armband",
    name: "Themen-Armband",
    nameEn: "Theme Bracelet",
    kategorie: "armbänder",
    preis: 0,
    preisDisplay: "",
    beschreibung: "Silberkette mit 3 handgravierten Runen-Plättchen + Heilstein-Pulver. Deine persönliche Schutzrune nach Geburtsdatum.",
    emoji: "ᚱ",
    highlight: "Handgraviert von der Seelenplanerin",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
    badge: "Bestseller",
  },
  {
    id: "schutzarmband-mariposa",
    name: "Schutzarmband Mariposa",
    nameEn: "Protection Bracelet Mariposa",
    kategorie: "armbänder",
    preis: 28.90,
    preisDisplay: "28,90 €",
    beschreibung: "Schwarzer Turmalin – der stärkste Schutzstein. Elastisches Band in deiner Wunschfarbe. Schutz vor negativen Energien.",
    emoji: "🖤",
    highlight: "Schwarzer Turmalin",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/gGmtFy",
  },
  {
    id: "charm-einzeln",
    name: "Runen-Charm einzeln",
    nameEn: "Single Rune Charm",
    kategorie: "armbänder",
    preis: 0,
    preisDisplay: "",
    beschreibung: "Einzelner Runen-Charm mit Heilstein-Pulver. Handgraviert. Passend für das Silberkettenarmband.",
    emoji: "✦",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
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
  },
  {
    id: "deep-talk",
    name: "Deep Talk",
    nameEn: "Deep Talk",
    kategorie: "sessions",
    preis: 111.00,
    preisDisplay: "111,00 €",
    beschreibung: "Ein tiefes 1:1 Gespräch. Energiearbeit, Seelenplanung, persönliche Transformation.",
    emoji: "💫",
    highlight: "1:1 mit der Seelenplanerin",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/p/Ciz1am",
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
                {item.highlight && <Text style={s.cardHighlight}>✦ {item.highlight}</Text>}
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
