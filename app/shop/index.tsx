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

type ShopCategory = "alle" | "armbänder" | "sessions" | "digital";

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
  {
    id: "runen-armband",
    name: "Runen-Armband",
    nameEn: "Rune Bracelet",
    kategorie: "armbänder",
    preis: 49.90,
    preisDisplay: "ab 49,90 €",
    beschreibung: "Silberkette mit 3 handgravierten Runen-Plättchen + Heilstein-Pulver. Deine persönliche Schutzrune nach Geburtsdatum.",
    emoji: "ᚱ",
    highlight: "Handgraviert von Lara",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/",
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
    tentaryUrl: "https://dieseelenplanerin.tentary.com/",
  },
  {
    id: "charm-einzeln",
    name: "Runen-Charm einzeln",
    nameEn: "Single Rune Charm",
    kategorie: "armbänder",
    preis: 14.90,
    preisDisplay: "14,90 €",
    beschreibung: "Einzelner Runen-Charm mit Heilstein-Pulver. Handgraviert. Passend für das Silberkettenarmband.",
    emoji: "✦",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/",
  },
  {
    id: "aura-reading",
    name: "Aura Reading",
    nameEn: "Aura Reading",
    kategorie: "sessions",
    preis: 77.00,
    preisDisplay: "77,00 €",
    beschreibung: "Lara liest deine Aura und gibt dir tiefe Einblicke in deine Energiefelder, Blockaden und Potenziale.",
    emoji: "🌈",
    highlight: "Mit Lara persönlich",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/",
    badge: "Beliebt",
  },
  {
    id: "deep-talk",
    name: "Deep Talk",
    nameEn: "Deep Talk",
    kategorie: "sessions",
    preis: 111.00,
    preisDisplay: "111,00 €",
    beschreibung: "Ein tiefes 1:1 Gespräch mit Lara. Energiearbeit, Seelenplanung, persönliche Transformation.",
    emoji: "💫",
    highlight: "1:1 mit Lara",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/",
  },
  {
    id: "seelenreset",
    name: "Seelenreset",
    nameEn: "Soul Reset",
    kategorie: "sessions",
    preis: 0,
    preisDisplay: "Auf Anfrage",
    beschreibung: "Das intensive Transformationsprogramm. Für Frauen, die bereit sind, ihr Leben von Grund auf neu auszurichten.",
    emoji: "🔮",
    highlight: "Intensiv-Programm",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/",
    badge: "Neu",
  },
  {
    id: "seelenimpuls",
    name: "Seelenimpuls",
    nameEn: "Soul Impulse",
    kategorie: "digital",
    preis: 17.00,
    preisDisplay: "17,00 €",
    beschreibung: "Digitaler Impuls für deine Seele. Tiefe Botschaften, Rituale und Übungen für deinen persönlichen Wachstumsprozess.",
    emoji: "✨",
    tentaryUrl: "https://dieseelenplanerin.tentary.com/",
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
    tentaryUrl: "https://dieseelenplanerin.tentary.com/",
  },
];

const CATEGORIES: { id: ShopCategory; label: string; emoji: string }[] = [
  { id: "alle", label: "Alle", emoji: "✨" },
  { id: "armbänder", label: "Armbänder", emoji: "ᚱ" },
  { id: "sessions", label: "Sessions", emoji: "💫" },
  { id: "digital", label: "Digital", emoji: "📿" },
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
    catRow: { paddingHorizontal: 16, paddingBottom: 12 },
    catBtn: {
      flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 8,
      borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, marginRight: 8,
      backgroundColor: colors.surface,
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
      backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10,
    },
    buyBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    freeBtn: {
      backgroundColor: "#22C55E", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10,
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
        <Text style={s.subtitle}>Handgefertigte Runen-Armbänder & spirituelle Sessions</Text>
      </View>

      {/* Kategorie-Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catRow} contentContainerStyle={{ paddingRight: 16 }}>
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          (activeCategory === "alle" || activeCategory === "armbänder") ? (
            <TouchableOpacity style={s.runenBanner} onPress={() => router.push("/runen/quiz" as any)} activeOpacity={0.8}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>ᚱ</Text>
              <Text style={s.runenBannerTitle}>Finde dein Runen-Set</Text>
              <Text style={s.runenBannerText}>Gib dein Geburtsdatum ein und beantworte 5 Fragen – wir empfehlen dir das perfekte Runen-Armband.</Text>
              <View style={s.runenBannerBtn}>
                <Text style={s.runenBannerBtnText}>Zum Runen-Quiz →</Text>
              </View>
            </TouchableOpacity>
          ) : null
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
              <Text style={s.price}>{item.preisDisplay}</Text>
              <TouchableOpacity
                style={item.preis === 0 && item.id !== "seelenreset" ? s.freeBtn : s.buyBtn}
                onPress={() => handleBuy(item)}
                activeOpacity={0.8}
              >
                <Text style={s.buyBtnText}>
                  {item.preis === 0 && item.id !== "seelenreset" ? "Kostenlos →" : "Kaufen →"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScreenContainer>
  );
}
