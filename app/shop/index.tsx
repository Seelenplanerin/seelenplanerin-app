import React, { useRef, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, Linking, Dimensions, Platform, Animated,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 56) / 2; // 2 columns with gaps

// Sneak-Peek Produkt-Highlights (nur Bilder + Namen für visuelle Vorschau)
const SNEAK_PEEK = [
  {
    id: "1", name: "Schutz & Reinigung",
    image: "https://img.tentary.com/01-schutz-reinigung_7032068891806368942-1772437515.png?aspect_ratio=1:1&width=640",
    emoji: "🛡️",
    url: "https://dieseelenplanerin.tentary.com/p/OX0aPw",
  },
  {
    id: "2", name: "Selbstliebe",
    image: "https://img.tentary.com/02-selbstliebe-herzoeffnung_380106635895589047-1772437957.png?aspect_ratio=1:1&width=640",
    emoji: "💗",
    url: "https://dieseelenplanerin.tentary.com/p/QtLnrA",
  },
  {
    id: "3", name: "Fülle & Manifestation",
    image: "https://img.tentary.com/03-fuelle-manifestation_77358612426124021-1772438229.png?aspect_ratio=1:1&width=640",
    emoji: "✨",
    url: "https://dieseelenplanerin.tentary.com/p/QjvV1I",
  },
  {
    id: "4", name: "Transformation",
    image: "https://img.tentary.com/04-transformation-loslassen_165599632870260090-1772440133.png?aspect_ratio=1:1&width=640",
    emoji: "🦋",
    url: "https://dieseelenplanerin.tentary.com/p/sGn2aD",
  },
];

const SHOP_CATEGORIES = [
  { emoji: "📿", label: "Energiearmbänder", sub: "22 einzigartige Designs" },
  { emoji: "🕯️", label: "Meditationskerzen", sub: "Mit echtem Heilstein" },
  { emoji: "🌿", label: "Räuchern", sub: "Palo Santo & mehr" },
  { emoji: "💎", label: "Heilsteine", sub: "Selenit & Kristalle" },
  { emoji: "🔑", label: "Bodyguard Anhänger", sub: "Schwarzer Turmalin" },
  { emoji: "🖤", label: "Frequenz-Armbänder", sub: "Energetischer Schutz" },
];

export default function ShopScreen() {
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const openInAppBrowser = async (url: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        controlsColor: "#C4897B",
        toolbarColor: "#FFF8F5",
      });
    } else {
      Linking.openURL(url);
    }
  };

  const openShop = () => {
    openInAppBrowser("https://dieseelenplanerin.de");
  };

  const openTentary = () => {
    openInAppBrowser("https://dieseelenplanerin.de");
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <Animated.View style={[s.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={s.title}>Shop</Text>
          <Text style={s.subtitle}>Handgefertigt mit Liebe & echten Kristallen</Text>
        </Animated.View>

        {/* Hero Banner – Hauptshop */}
        <TouchableOpacity style={s.heroBanner} onPress={openShop} activeOpacity={0.85}>
          <View style={s.heroGlow} />
          <Text style={s.heroEmoji}>✨</Text>
          <Text style={s.heroTitle}>Die Seelenplanerin</Text>
          <Text style={s.heroSubtitle}>Entdecke handgefertigte Schätze für deine Seele</Text>
          <View style={s.heroDivider} />
          <Text style={s.heroDesc}>
            Energiearmbänder, Meditationskerzen, Räuchern, Heilsteine & mehr – jedes Stück mit Intention gefertigt.
          </Text>
          <View style={s.heroBtn}>
            <Text style={s.heroBtnText}>Shop entdecken  →</Text>
          </View>
        </TouchableOpacity>

        {/* Sneak Peek – Ritual-Sets Vorschau */}
        <View style={s.sneakSection}>
          <Text style={s.sectionTitle}>🌙 Ritual-Sets – Sneak Peek</Text>
          <Text style={s.sectionSub}>10 handgefertigte Sets für dein persönliches Ritual</Text>
          <View style={s.sneakGrid}>
            {SNEAK_PEEK.map((item) => (
              <TouchableOpacity key={item.id} style={s.sneakCard} onPress={() => openInAppBrowser(item.url)} activeOpacity={0.8}>
                <Image source={{ uri: item.image }} style={s.sneakImage} resizeMode="cover" />
                <View style={s.sneakOverlay}>
                  <Text style={s.sneakName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={s.sneakBtn} onPress={() => openInAppBrowser("https://dieseelenplanerin.de")} activeOpacity={0.8}>
            <Text style={s.sneakBtnText}>Alle 10 Ritual-Sets ansehen  →</Text>
          </TouchableOpacity>
        </View>

        {/* Was dich erwartet */}
        <View style={s.categoriesSection}>
          <Text style={s.sectionTitle}>Was dich im Shop erwartet</Text>
          <View style={s.catGrid}>
            {SHOP_CATEGORIES.map((cat, i) => (
              <TouchableOpacity key={i} style={s.catCard} onPress={openShop} activeOpacity={0.8}>
                <Text style={s.catEmoji}>{cat.emoji}</Text>
                <Text style={s.catLabel}>{cat.label}</Text>
                <Text style={s.catSub}>{cat.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Aura Reading & Soul Talk */}
        <View style={s.servicesSection}>
          <Text style={s.sectionTitle}>Persönliche Sessions</Text>
          <TouchableOpacity
            style={s.serviceCard}
            onPress={() => openInAppBrowser("https://dieseelenplanerin.de/products/aura-reading")}
            activeOpacity={0.8}
          >
            <View style={s.serviceLeft}>
              <Text style={s.serviceEmoji}>🌈</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.serviceName}>Aura Reading</Text>
                <Text style={s.serviceDesc}>Tiefe Einblicke in deine Energiefelder</Text>
              </View>
            </View>
            <View style={s.servicePrice}>
              <Text style={s.servicePriceText}>111 €</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.serviceCard}
            onPress={() => openInAppBrowser("https://calendly.com/hallo-seelenplanerin/30min")}
            activeOpacity={0.8}
          >
            <View style={s.serviceLeft}>
              <Text style={s.serviceEmoji}>☕</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.serviceName}>Soul Talk</Text>
                <Text style={s.serviceDesc}>30 Min. kostenloses Kennenlerngespräch</Text>
              </View>
            </View>
            <View style={[s.servicePrice, { backgroundColor: "#22C55E" }]}>
              <Text style={s.servicePriceText}>Gratis</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Runen-Quiz Banner */}
        <TouchableOpacity style={s.runenBanner} onPress={() => router.push("/runen-quiz" as any)} activeOpacity={0.8}>
          <Text style={s.runenEmoji}>ᚱ</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.runenTitle}>Finde dein Runen-Armband</Text>
            <Text style={s.runenSub}>Beantworte 5 Fragen und entdecke dein persönliches Armband</Text>
          </View>
          <Text style={s.runenArrow}>→</Text>
        </TouchableOpacity>

        {/* Footer CTA */}
        <TouchableOpacity style={s.footerCta} onPress={openShop} activeOpacity={0.85}>
          <Text style={s.footerCtaText}>Zum Shop  →</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: {
    fontSize: 32, fontWeight: "700", color: "#3D2B1F",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  subtitle: { fontSize: 15, color: "#9C7B6E", marginTop: 4, fontStyle: "italic" },

  // Hero Banner
  heroBanner: {
    marginHorizontal: 16, marginTop: 12, marginBottom: 24,
    backgroundColor: "#FFF8F5", borderRadius: 28,
    padding: 28, alignItems: "center",
    borderWidth: 1, borderColor: "#EDD9D0",
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute", top: -40, right: -40,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "#C4897B20",
  },
  heroEmoji: { fontSize: 40, marginBottom: 12 },
  heroTitle: {
    fontSize: 24, fontWeight: "800", color: "#3D2B1F",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16, color: "#9C7B6E", textAlign: "center",
    marginTop: 6, fontStyle: "italic", lineHeight: 22,
  },
  heroDivider: {
    width: 60, height: 2, backgroundColor: "#C4897B40",
    marginVertical: 16, borderRadius: 1,
  },
  heroDesc: {
    fontSize: 14, color: "#8B7B72", textAlign: "center",
    lineHeight: 22, marginBottom: 20, paddingHorizontal: 8,
  },
  heroBtn: {
    backgroundColor: "#C4897B", borderRadius: 16,
    paddingHorizontal: 32, paddingVertical: 14,
    shadowColor: "#C4897B", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  heroBtnText: { color: "#fff", fontSize: 17, fontWeight: "700", letterSpacing: 0.3 },

  // Sneak Peek
  sneakSection: { marginHorizontal: 16, marginBottom: 28 },
  sectionTitle: {
    fontSize: 20, fontWeight: "700", color: "#3D2B1F", marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  sectionSub: { fontSize: 14, color: "#9C7B6E", marginBottom: 16, fontStyle: "italic" },
  sneakGrid: {
    flexDirection: "row", flexWrap: "wrap",
    justifyContent: "space-between",
  },
  sneakCard: {
    width: CARD_SIZE, height: CARD_SIZE, borderRadius: 20,
    overflow: "hidden", marginBottom: 12,
    backgroundColor: "#F5EDE8",
  },
  sneakImage: { width: "100%", height: "100%" },
  sneakOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(61, 43, 31, 0.65)",
    paddingVertical: 10, paddingHorizontal: 12,
  },
  sneakName: { color: "#fff", fontSize: 13, fontWeight: "700" },
  sneakBtn: {
    backgroundColor: "#3D2B1F", borderRadius: 14,
    paddingVertical: 14, alignItems: "center", marginTop: 4,
  },
  sneakBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  // Categories
  categoriesSection: { marginHorizontal: 16, marginBottom: 28 },
  catGrid: {
    flexDirection: "row", flexWrap: "wrap",
    justifyContent: "space-between",
  },
  catCard: {
    width: (width - 48) / 2, backgroundColor: "#FFF8F5",
    borderRadius: 18, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: "#EDD9D0",
    alignItems: "center",
  },
  catEmoji: { fontSize: 28, marginBottom: 8 },
  catLabel: { fontSize: 14, fontWeight: "700", color: "#3D2B1F", textAlign: "center" },
  catSub: { fontSize: 12, color: "#9C7B6E", textAlign: "center", marginTop: 4 },

  // Services
  servicesSection: { marginHorizontal: 16, marginBottom: 24 },
  serviceCard: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#FFF8F5", borderRadius: 18, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: "#EDD9D0",
  },
  serviceLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  serviceEmoji: { fontSize: 28, marginRight: 14 },
  serviceName: { fontSize: 16, fontWeight: "700", color: "#3D2B1F" },
  serviceDesc: { fontSize: 13, color: "#9C7B6E", marginTop: 2 },
  servicePrice: {
    backgroundColor: "#C4897B", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 8, marginLeft: 10,
  },
  servicePriceText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  // Runen Banner
  runenBanner: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 16, marginBottom: 24,
    backgroundColor: "#C4897B15", borderRadius: 18,
    padding: 18, borderWidth: 1, borderColor: "#C4897B30",
  },
  runenEmoji: { fontSize: 32, marginRight: 14 },
  runenTitle: { fontSize: 16, fontWeight: "700", color: "#3D2B1F" },
  runenSub: { fontSize: 13, color: "#9C7B6E", marginTop: 2, lineHeight: 18 },
  runenArrow: { fontSize: 22, color: "#C4897B", fontWeight: "700", marginLeft: 8 },

  // Footer CTA
  footerCta: {
    marginHorizontal: 16,
    backgroundColor: "#C4897B", borderRadius: 18,
    paddingVertical: 18, alignItems: "center",
    shadowColor: "#C4897B", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  footerCtaText: { color: "#fff", fontSize: 18, fontWeight: "700", letterSpacing: 0.3 },
});
