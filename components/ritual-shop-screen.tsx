import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { OFFICIAL_OFFERS } from "@/data/angebote";
import { RITUAL_SETS } from "@/data/ritual-sets";
import { openSeelenplanerinUrl } from "@/lib/open-owned-url";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 56) / 2;

const SHOP_CATEGORIES = [
  { emoji: "ᚱ", label: "Runen-Armbänder", sub: "Handgraviert & einzigartig", url: "https://dieseelenplanerin.de/runenarmbander" },
  { emoji: "📿", label: "Energiearmbänder", sub: "22 einzigartige Designs", url: "https://dieseelenplanerin.de/kategorie/energiearmbaender" },
  { emoji: "🕯️", label: "Meditationskerzen", sub: "Mit echtem Heilstein", url: "https://dieseelenplanerin.de/kategorie/meditationskerzen" },
  { emoji: "🌿", label: "Räuchern", sub: "Palo Santo & mehr", url: "https://dieseelenplanerin.de/kategorie/raeuchern" },
  { emoji: "💎", label: "Heilsteine", sub: "Selenit & Kristalle", url: "https://dieseelenplanerin.de/kategorie/heilsteine-zubehoer" },
  { emoji: "🔑", label: "Bodyguard Anhänger", sub: "Schwarzer Turmalin", url: "https://dieseelenplanerin.de/kategorie/schluesselanhaenger" },
];

const PERSONAL_SESSIONS = [
  {
    emoji: "🌈",
    name: OFFICIAL_OFFERS.auraReading.name,
    description: "Tiefe Einblicke in deine Energiefelder",
    priceLabel: OFFICIAL_OFFERS.auraReading.priceLabel,
    url: OFFICIAL_OFFERS.auraReading.url,
    isFree: false,
  },
  {
    emoji: "✨",
    name: OFFICIAL_OFFERS.thetaHealing.name,
    description: "Intensive 1:1-Begleitung für dein persönliches Thema",
    priceLabel: OFFICIAL_OFFERS.thetaHealing.priceLabel,
    url: OFFICIAL_OFFERS.thetaHealing.url,
    isFree: false,
  },
  {
    emoji: "☕",
    name: "Soul Talk",
    description: "30 Min. kostenloses Kennenlerngespräch",
    priceLabel: "Gratis",
    url: "https://dieseelenplanerin.de/kontakt",
    isFree: true,
  },
] as const;

export function RitualShopScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const openInAppBrowser = async (url: string) => {
    await openSeelenplanerinUrl(url);
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Shop</Text>
          <Text style={styles.subtitle}>Handgefertigt mit Liebe & echten Kristallen</Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.heroBanner}
          onPress={() => openInAppBrowser("https://dieseelenplanerin.de")}
          activeOpacity={0.85}
        >
          <View style={styles.heroGlow} />
          <Text style={styles.heroEmoji}>✨</Text>
          <Text style={styles.heroTitle}>Die Seelenplanerin</Text>
          <Text style={styles.heroSubtitle}>Entdecke handgefertigte Schätze für deine Seele</Text>
          <View style={styles.heroDivider} />
          <Text style={styles.heroDesc}>
            Energiearmbänder, Meditationskerzen, Räuchern, Heilsteine & mehr – jedes Stück mit Intention gefertigt.
          </Text>
          <View style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>Shop entdecken →</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.ritualSection}>
          <Text style={styles.sectionTitle}>🌙 Ritual-Sets</Text>
          <Text style={styles.sectionSub}>5 handverlesene Sets für dein persönliches Ritual</Text>
          <View style={styles.ritualGrid}>
            {RITUAL_SETS.map((set) => (
              <TouchableOpacity
                key={set.id}
                style={styles.ritualCard}
                onPress={() => openInAppBrowser(set.url)}
                activeOpacity={0.8}
                accessibilityRole="link"
                accessibilityLabel={`${set.name} für ${set.priceLabel} ansehen`}
              >
                <Image source={{ uri: set.imageUrl }} style={styles.ritualImage} contentFit="cover" transition={250} />
                <View style={styles.ritualInfo}>
                  <View style={styles.ritualTitleRow}>
                    <Text style={styles.ritualName}>{set.name}</Text>
                    <Text style={styles.ritualPrice}>{set.priceLabel}</Text>
                  </View>
                  <Text style={styles.ritualDescription}>{set.description}</Text>
                  <Text style={styles.ritualComponents} numberOfLines={2}>{set.components.join(" · ")}</Text>
                  <Text style={styles.ritualLink}>Im Shop ansehen →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Was dich im Shop erwartet</Text>
          <View style={styles.catGrid}>
            {SHOP_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.label}
                style={styles.catCard}
                onPress={() => openInAppBrowser(category.url)}
                activeOpacity={0.8}
              >
                <Text style={styles.catEmoji}>{category.emoji}</Text>
                <Text style={styles.catLabel}>{category.label}</Text>
                <Text style={styles.catSub}>{category.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Persönliche Sessions</Text>
          {PERSONAL_SESSIONS.map((session) => (
            <TouchableOpacity
              key={session.name}
              style={styles.serviceCard}
              onPress={() => openInAppBrowser(session.url)}
              activeOpacity={0.8}
            >
              <View style={styles.serviceLeft}>
                <Text style={styles.serviceEmoji}>{session.emoji}</Text>
                <View style={styles.serviceCopy}>
                  <Text style={styles.serviceName}>{session.name}</Text>
                  <Text style={styles.serviceDesc}>{session.description}</Text>
                </View>
              </View>
              <View style={[styles.servicePrice, session.isFree && styles.freePrice]}>
                <Text style={styles.servicePriceText}>{session.priceLabel}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.runenBanner} onPress={() => router.push("/runen-quiz" as never)} activeOpacity={0.8}>
          <Text style={styles.runenEmoji}>ᚱ</Text>
          <View style={styles.runenCopy}>
            <Text style={styles.runenTitle}>Finde dein Runen-Armband</Text>
            <Text style={styles.runenSub}>Beantworte 5 Fragen und entdecke dein persönliches Armband</Text>
          </View>
          <Text style={styles.runenArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerCta}
          onPress={() => openInAppBrowser("https://dieseelenplanerin.de")}
          activeOpacity={0.85}
        >
          <Text style={styles.footerCtaText}>Zum Shop →</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#3D2B1F",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  subtitle: { fontSize: 15, color: "#9C7B6E", marginTop: 4, fontStyle: "italic" },
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: "#FFF8F5",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EDD9D0",
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#C4897B20",
  },
  heroEmoji: { fontSize: 40, marginBottom: 12 },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#3D2B1F",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    textAlign: "center",
  },
  heroSubtitle: { fontSize: 16, color: "#9C7B6E", textAlign: "center", marginTop: 6, fontStyle: "italic", lineHeight: 22 },
  heroDivider: { width: 60, height: 2, backgroundColor: "#C4897B40", marginVertical: 16, borderRadius: 1 },
  heroDesc: { fontSize: 14, color: "#8B7B72", textAlign: "center", lineHeight: 22, marginBottom: 20, paddingHorizontal: 8 },
  heroBtn: {
    backgroundColor: "#C4897B",
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
    shadowColor: "#C4897B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  heroBtnText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700", letterSpacing: 0.3 },
  ritualSection: { marginHorizontal: 16, marginBottom: 28 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3D2B1F",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  sectionSub: { fontSize: 14, color: "#9C7B6E", marginBottom: 16, fontStyle: "italic" },
  ritualGrid: { gap: 14 },
  ritualCard: { backgroundColor: "#FFF8F5", borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "#EDD9D0" },
  ritualImage: { width: "100%", height: Math.min(260, Math.max(190, CARD_SIZE * 1.25)), backgroundColor: "#F5EDE8" },
  ritualInfo: { padding: 16 },
  ritualTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  ritualName: { flex: 1, color: "#3D2B1F", fontSize: 17, fontWeight: "700", lineHeight: 22 },
  ritualPrice: { color: "#C4897B", fontSize: 17, fontWeight: "800" },
  ritualDescription: { color: "#8B7B72", fontSize: 13, lineHeight: 19, marginTop: 7 },
  ritualComponents: { color: "#9C7B6E", fontSize: 12, lineHeight: 18, marginTop: 7 },
  ritualLink: { color: "#C4897B", fontSize: 13, fontWeight: "700", marginTop: 12 },
  categoriesSection: { marginHorizontal: 16, marginBottom: 28 },
  catGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  catCard: {
    width: (width - 48) / 2,
    backgroundColor: "#FFF8F5",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EDD9D0",
    alignItems: "center",
  },
  catEmoji: { fontSize: 28, marginBottom: 8 },
  catLabel: { fontSize: 14, fontWeight: "700", color: "#3D2B1F", textAlign: "center" },
  catSub: { fontSize: 12, color: "#9C7B6E", textAlign: "center", marginTop: 4 },
  servicesSection: { marginHorizontal: 16, marginBottom: 24 },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF8F5",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EDD9D0",
  },
  serviceLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  serviceEmoji: { fontSize: 28, marginRight: 14 },
  serviceCopy: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: "700", color: "#3D2B1F" },
  serviceDesc: { fontSize: 13, color: "#9C7B6E", marginTop: 2, lineHeight: 18 },
  servicePrice: { backgroundColor: "#C4897B", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, marginLeft: 10 },
  freePrice: { backgroundColor: "#22C55E" },
  servicePriceText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  runenBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: "#C4897B15",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#C4897B30",
  },
  runenEmoji: { fontSize: 32, marginRight: 14 },
  runenCopy: { flex: 1 },
  runenTitle: { fontSize: 16, fontWeight: "700", color: "#3D2B1F" },
  runenSub: { fontSize: 13, color: "#9C7B6E", marginTop: 2, lineHeight: 18 },
  runenArrow: { fontSize: 22, color: "#C4897B", fontWeight: "700", marginLeft: 8 },
  footerCta: {
    marginHorizontal: 16,
    backgroundColor: "#C4897B",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#C4897B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  footerCtaText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", letterSpacing: 0.3 },
});
