import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Image, Linking, Dimensions, LayoutAnimation, Platform,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

type ShopCategory = "alle" | "ritual-sets" | "physisch" | "sessions" | "digital";

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
  url: string;
  badge?: string;
  imageUrl?: string;
}

// ── RITUAL-SETS (bleiben auf Tentary) ──
const RITUAL_SETS: Product[] = [
  {
    id: "set-schutz", name: "Schutz & Reinigung", kategorie: "ritual-sets",
    preis: 29.90, preisDisplay: "29,90 €",
    beschreibung: "Schwarzer Turmalin, Bergkristall, Weißer Salbei & schwarze Kerze",
    emoji: "🛡️", highlight: "Inkl. Versand",
    url: "https://dieseelenplanerin.tentary.com/p/OX0aPw", badge: "Ritual-Set",
    imageUrl: "https://img.tentary.com/01-schutz-reinigung_7032068891806368942-1772437515.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-selbstliebe", name: "Selbstliebe & Herzöffnung", kategorie: "ritual-sets",
    preis: 29.90, preisDisplay: "29,90 €",
    beschreibung: "Rosenquarz, Mondstein, Myrrhe & rosa Kerze",
    emoji: "💗", highlight: "Inkl. Versand",
    url: "https://dieseelenplanerin.tentary.com/p/QtLnrA", badge: "Ritual-Set",
    imageUrl: "https://img.tentary.com/02-selbstliebe-herzoeffnung_380106635895589047-1772437957.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-fuelle", name: "Fülle & Manifestation", kategorie: "ritual-sets",
    preis: 29.90, preisDisplay: "29,90 €",
    beschreibung: "Citrin, Pyrit, Weihrauch & goldene Kerze",
    emoji: "✨", highlight: "Inkl. Versand",
    url: "https://dieseelenplanerin.tentary.com/p/QjvV1I", badge: "Ritual-Set",
    imageUrl: "https://img.tentary.com/03-fuelle-manifestation_77358612426124021-1772438229.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-transformation", name: "Transformation & Loslassen", kategorie: "ritual-sets",
    preis: 29.90, preisDisplay: "29,90 €",
    beschreibung: "Labradorit, Amethyst, Palo Santo & violette Kerze",
    emoji: "🦋", highlight: "Inkl. Versand",
    url: "https://dieseelenplanerin.tentary.com/p/sGn2aD", badge: "Ritual-Set",
    imageUrl: "https://img.tentary.com/04-transformation-loslassen_165599632870260090-1772440133.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-kraft", name: "Kraft & Mut", kategorie: "ritual-sets",
    preis: 29.90, preisDisplay: "29,90 €",
    beschreibung: "Karneol, Sonnenstein, Weihrauch & rote Kerze",
    emoji: "🔥", highlight: "Inkl. Versand",
    url: "https://dieseelenplanerin.tentary.com/p/BQ7sqg", badge: "Ritual-Set",
    imageUrl: "https://img.tentary.com/05-kraft-mut_1051342196418700370-1772440449.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-intuition", name: "Intuition & Spiritualität", kategorie: "ritual-sets",
    preis: 29.90, preisDisplay: "29,90 €",
    beschreibung: "Amethyst, Mondstein, Myrrhe & weiße Kerze",
    emoji: "🔮", highlight: "Inkl. Versand",
    url: "https://dieseelenplanerin.tentary.com/p/tfehqK", badge: "Ritual-Set",
    imageUrl: "https://img.tentary.com/06-intuition-spiritualitaet_1589606931969366424-1772440508.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-neuanfang", name: "Neuanfang & Klarheit", kategorie: "ritual-sets",
    preis: 29.90, preisDisplay: "29,90 €",
    beschreibung: "Bergkristall, Citrin, Weißer Salbei & gelbe Kerze",
    emoji: "🌅", highlight: "Inkl. Versand",
    url: "https://dieseelenplanerin.tentary.com/p/QFEH0i", badge: "Ritual-Set",
    imageUrl: "https://img.tentary.com/07-neuanfang-klarheit_8655664392057718360-1772440875.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-erdung", name: "Erdung & Stabilität", kategorie: "ritual-sets",
    preis: 29.90, preisDisplay: "29,90 €",
    beschreibung: "Schwarzer Turmalin, Karneol, Palo Santo & braune Kerze",
    emoji: "🌿", highlight: "Inkl. Versand",
    url: "https://dieseelenplanerin.tentary.com/p/VN9WOT", badge: "Ritual-Set",
    imageUrl: "https://img.tentary.com/08-erdung-stabilitaet_1373686916141576984-1772441080.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-lebensfreude", name: "Lebensfreude & Energie", kategorie: "ritual-sets",
    preis: 29.90, preisDisplay: "29,90 €",
    beschreibung: "Sonnenstein, Karneol, Weihrauch & orange Kerze",
    emoji: "☀️", highlight: "Inkl. Versand",
    url: "https://dieseelenplanerin.tentary.com/p/gFloc9", badge: "Ritual-Set",
    imageUrl: "https://img.tentary.com/09-lebensfreude-energie_40393902163744161-1772441353.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "set-heilung", name: "Heilung & Balance", kategorie: "ritual-sets",
    preis: 29.90, preisDisplay: "29,90 €",
    beschreibung: "Rosenquarz, Amethyst, Palo Santo & grüne Kerze",
    emoji: "💚", highlight: "Inkl. Versand",
    url: "https://dieseelenplanerin.tentary.com/p/f9A55Q", badge: "Ritual-Set",
    imageUrl: "https://img.tentary.com/10-heilung-balance_19296041821404264109-1772441606.png?aspect_ratio=1:1&width=640",
  },
];

// ── ANDERE PRODUKTE ──
const OTHER_PRODUCTS: Product[] = [
  // === SESSIONS (bleiben auf Tentary) ===
  {
    id: "aura-reading", name: "Aura Reading", kategorie: "sessions",
    preis: 111.00, preisDisplay: "111,00 €",
    beschreibung: "Die Seelenplanerin liest deine Aura und gibt dir tiefe Einblicke in deine Energiefelder, Blockaden und Potenziale.",
    emoji: "\ud83c\udf08", highlight: "Persönlich",
    url: "https://dieseelenplanerin.tentary.com/p/TuOzYS", badge: "Beliebt",
    imageUrl: "https://img.tentary.com/pyrit-2-kopie-3_431346584235124704-1765803454.png?aspect_ratio=1:1&width=640",
  },
  // === DIGITAL (bleiben auf Tentary) ===
  {
    id: "seelenimpuls", name: "Seelenimpuls", kategorie: "digital",
    preis: 17.00, preisDisplay: "17,00 €",
    beschreibung: "Digitaler Impuls für deine Seele. Tiefe Botschaften, Rituale und Übungen für deinen persönlichen Wachstumsprozess.",
    emoji: "✨",
    url: "https://dieseelenplanerin.tentary.com/p/E6FP1U",
    imageUrl: "https://img.tentary.com/seelenimpuls-2_1152465159638903276-1771450850.png?aspect_ratio=1:1&width=640",
  },
  {
    id: "soul-talk", name: "Soul Talk – Klarheitsgespräch", kategorie: "digital",
    preis: 0, preisDisplay: "Kostenlos",
    beschreibung: "30 Min. kostenloses Kennenlerngespräch mit Lara. Dein erster Schritt in die Welt der Seelenplanerin.",
    emoji: "☕", badge: "Gratis",
    url: "https://calendly.com/hallo-seelenplanerin/30min",
  },
  // === PHYSISCHE PRODUKTE (verlinken auf www.dieseelenplanerin.de) ===
  {
    id: "energiearmbänder", name: "Energiearmbänder", kategorie: "physisch",
    preis: 33.00, preisDisplay: "ab 33,00 €",
    beschreibung: "22 einzigartige Armbänder mit echten Kristallen – handgefertigt mit Liebe und Intention. Calm Spirit, True Love und viele mehr.",
    emoji: "📿", highlight: "Handgefertigt mit echten Kristallen",
    url: "https://dieseelenplanerin.de/collections/energiearmbander", badge: "Bestseller",
  },
  {
    id: "frequenz-armbänder", name: "Frequenz-Armbänder", kategorie: "physisch",
    preis: 0, preisDisplay: "Im Shop",
    beschreibung: "Schutz. Geerdet. Echt. – Armbänder mit echtem schwarzen Turmalin-Pulver für energetischen Schutz.",
    emoji: "\ud83d\udda4", highlight: "Schwarzer Turmalin",
    url: "https://dieseelenplanerin.de/collections/frequenz-armbander",
  },
  {
    id: "meditationskerzen", name: "Meditationskerzen", kategorie: "physisch",
    preis: 17.00, preisDisplay: "ab 17,00 €",
    beschreibung: "Handgefertigt mit echtem Heilstein – finde deine persönliche Kerze für Meditation und Rituale.",
    emoji: "🕯️", highlight: "Individuell mit Heilstein",
    url: "https://dieseelenplanerin.de/collections/meditationskerzen", badge: "Neu",
  },
  {
    id: "schlüsselanhänger", name: "Bodyguard Schlüsselanhänger", kategorie: "physisch",
    preis: 17.00, preisDisplay: "17,00 €",
    beschreibung: "Klein. Kraftvoll. Immer dabei. – Mit echtem schwarzen Turmalin. Jedes Stück ein Unikat.",
    emoji: "🔑", highlight: "Schwarzer Turmalin – Unikat",
    url: "https://dieseelenplanerin.de/collections/bodyguard-schlusselanhanger", badge: "Unikat",
  },
  {
    id: "räuchern", name: "Räuchern", kategorie: "physisch",
    preis: 11.00, preisDisplay: "ab 11,00 €",
    beschreibung: "Räucherstäbchen und Räucherstab-Halter für dein tägliches Reinigungsritual. Palo Santo & mehr.",
    emoji: "🌿", highlight: "Heiliges Holz",
    url: "https://dieseelenplanerin.de/collections/rauchern",
  },
  {
    id: "heilsteine", name: "Heilsteine & Zubehör", kategorie: "physisch",
    preis: 17.00, preisDisplay: "ab 17,00 €",
    beschreibung: "Selenitschalen zum Aufladen und Reinigen deiner Heilsteine und Kristalle.",
    emoji: "💎", highlight: "Selenit – Reinigung & Aufladung",
    url: "https://dieseelenplanerin.de/collections/heilsteine-zubehor",
  },
];

const CATEGORIES: { id: ShopCategory; label: string; emoji: string }[] = [
  { id: "alle", label: "Alle", emoji: "✨" },
  { id: "ritual-sets", label: "Ritual-Sets", emoji: "🌙" },
  { id: "physisch", label: "Shop-Produkte", emoji: "📿" },
  { id: "sessions", label: "Sessions", emoji: "💫" },
  { id: "digital", label: "Digital", emoji: "💿" },
];

export default function ShopScreen() {
  const colors = useColors();
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("alle");
  const [ritualSetsOpen, setRitualSetsOpen] = useState(false);

  const filtered = activeCategory === "alle"
    ? OTHER_PRODUCTS
    : OTHER_PRODUCTS.filter((p) => p.kategorie === activeCategory);

  const showRitualSets = activeCategory === "alle" || activeCategory === "ritual-sets";

  const toggleRitualSets = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRitualSetsOpen(!ritualSetsOpen);
  };

  const handleBuy = (product: Product) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(product.url);
  };

  const s = StyleSheet.create({
    header: { padding: 20, paddingBottom: 8 },
    title: { fontSize: 32, fontWeight: "700", color: "#3D2B1F", fontFamily: "DancingScript" },
    subtitle: { fontSize: 15, color: "#9C7B6E", marginTop: 4, fontStyle: "italic" },
    // Shop-Banner
    shopBanner: {
      backgroundColor: "#FFF8F5", borderRadius: 20, padding: 20,
      marginHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: "#EDD9D0",
      alignItems: "center",
    },
    shopBannerTitle: { fontSize: 18, fontWeight: "700", color: "#3D2B1F", marginBottom: 4 },
    shopBannerText: { fontSize: 14, color: "#9C7B6E", textAlign: "center", marginBottom: 12 },
    shopBannerBtn: {
      backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10,
    },
    shopBannerBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
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
    // Ritual-Sets Dropdown
    ritualSetsContainer: { marginHorizontal: 16, marginBottom: 16 },
    ritualSetsHeader: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      backgroundColor: colors.primary, borderRadius: ritualSetsOpen ? 20 : 20,
      borderBottomLeftRadius: ritualSetsOpen ? 0 : 20,
      borderBottomRightRadius: ritualSetsOpen ? 0 : 20,
      padding: 18, paddingHorizontal: 22,
    },
    ritualSetsHeaderLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    ritualSetsHeaderEmoji: { fontSize: 22, marginRight: 12 },
    ritualSetsHeaderTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
    ritualSetsHeaderSub: { fontSize: 13, color: "#ffffffcc", marginTop: 2 },
    ritualSetsArrow: { fontSize: 20, color: "#fff", fontWeight: "700" },
    ritualSetsDropdown: {
      backgroundColor: "#FFF8F5", borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
      borderWidth: 1, borderTopWidth: 0, borderColor: colors.primary + "40",
      overflow: "hidden",
    },
    ritualSetItem: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      paddingVertical: 14, paddingHorizontal: 20,
      borderBottomWidth: 1, borderBottomColor: colors.border + "60",
    },
    ritualSetItemLast: { borderBottomWidth: 0 },
    ritualSetLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    ritualSetEmoji: { fontSize: 20, marginRight: 12, width: 30, textAlign: "center" },
    ritualSetInfo: { flex: 1 },
    ritualSetName: { fontSize: 15, fontWeight: "600", color: colors.foreground },
    ritualSetDesc: { fontSize: 12, color: colors.muted, marginTop: 2 },
    ritualSetPrice: { fontSize: 14, fontWeight: "700", color: colors.primary, marginLeft: 8 },
    ritualSetBuyBtn: {
      backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
      marginLeft: 10,
    },
    ritualSetBuyText: { color: "#fff", fontSize: 13, fontWeight: "700" },
    // Product cards
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
    shopBadge: { backgroundColor: "#22C55E", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
    shopBadgeText: { fontSize: 11, color: "#fff", fontWeight: "700" },
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
    shopBtn: {
      backgroundColor: "#3D2B1F", borderRadius: 14, paddingHorizontal: 22, paddingVertical: 12,
    },
    shopBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    // Runen-Banner
    runenBanner: {
      backgroundColor: colors.primary + "15", borderRadius: 20, padding: 20,
      marginHorizontal: 0, marginBottom: 16, borderWidth: 1, borderColor: colors.primary + "30",
      alignItems: "center",
    },
    runenBannerTitle: { fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 4 },
    runenBannerText: { fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: 12 },
    runenBannerBtn: {
      backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10,
    },
    runenBannerBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  });

  const renderRitualSetsDropdown = () => {
    if (!showRitualSets) return null;
    return (
      <View style={s.ritualSetsContainer}>
        <TouchableOpacity style={s.ritualSetsHeader} onPress={toggleRitualSets} activeOpacity={0.8}>
          <View style={s.ritualSetsHeaderLeft}>
            <Text style={s.ritualSetsHeaderEmoji}>🌙</Text>
            <View>
              <Text style={s.ritualSetsHeaderTitle}>Ritual-Sets</Text>
              <Text style={s.ritualSetsHeaderSub}>10 Sets – je 29,90 € inkl. Versand</Text>
            </View>
          </View>
          <Text style={s.ritualSetsArrow}>{ritualSetsOpen ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {ritualSetsOpen && (
          <View style={s.ritualSetsDropdown}>
            {RITUAL_SETS.map((set, index) => (
              <TouchableOpacity
                key={set.id}
                style={[s.ritualSetItem, index === RITUAL_SETS.length - 1 && s.ritualSetItemLast]}
                onPress={() => handleBuy(set)}
                activeOpacity={0.7}
              >
                <View style={s.ritualSetLeft}>
                  {set.imageUrl ? (
                    <Image source={{ uri: set.imageUrl }} style={{ width: 44, height: 44, borderRadius: 10, marginRight: 12 }} resizeMode="cover" />
                  ) : (
                    <Text style={s.ritualSetEmoji}>{set.emoji}</Text>
                  )}
                  <View style={s.ritualSetInfo}>
                    <Text style={s.ritualSetName}>{set.name}</Text>
                    <Text style={s.ritualSetDesc}>{set.beschreibung}</Text>
                  </View>
                </View>
                <View style={s.ritualSetBuyBtn}>
                  <Text style={s.ritualSetBuyText}>Kaufen</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer>
      <View style={s.header}>
        <Text style={s.title}>Shop ✨</Text>
        <Text style={s.subtitle}>Ritual-Sets, Kristalle & spirituelle Sessions</Text>
      </View>

      {/* Hauptshop-Banner */}
      <TouchableOpacity
        style={s.shopBanner}
        onPress={() => Linking.openURL("https://dieseelenplanerin.de")}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 32, marginBottom: 8 }}>🛍️</Text>
        <Text style={s.shopBannerTitle}>Die Seelenplanerin – Shop</Text>
        <Text style={s.shopBannerText}>
          Energiearmbänder, Meditationskerzen, Räuchern & mehr – handgefertigt mit echten Kristallen
        </Text>
        <View style={s.shopBannerBtn}>
          <Text style={s.shopBannerBtnText}>Zum Shop →</Text>
        </View>
      </TouchableOpacity>

      {/* Kategorie-Filter */}
      <View style={{ overflow: "visible" }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catRow} contentContainerStyle={{ paddingRight: 24, paddingVertical: 8 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[s.catBtn, activeCategory === cat.id && s.catBtnActive]}
              onPress={() => {
                setActiveCategory(cat.id);
                if (cat.id === "ritual-sets") setRitualSetsOpen(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={s.catEmoji}>{cat.emoji}</Text>
              <Text style={[s.catText, activeCategory === cat.id && s.catTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={activeCategory === "ritual-sets" ? [] : filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <View>
            {/* Ritual-Sets Dropdown */}
            {renderRitualSetsDropdown()}

            {/* Runen-Banner */}
            {(activeCategory === "alle" || activeCategory === "physisch") && (
              <TouchableOpacity style={s.runenBanner} onPress={() => router.push("/runen-quiz" as any)} activeOpacity={0.8}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>ᚱ</Text>
                <Text style={s.runenBannerTitle}>Finde dein Runen-Set</Text>
                <Text style={s.runenBannerText}>Gib dein Geburtsdatum ein und beantworte 5 Fragen – wir empfehlen dir das perfekte Runen-Armband.</Text>
                <View style={s.runenBannerBtn}>
                  <Text style={s.runenBannerBtnText}>Zum Runen-Quiz →</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const isShopProduct = item.kategorie === "physisch";
          return (
            <View style={s.card}>
              {item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: "100%", height: 180, borderRadius: 16, marginBottom: 12 }}
                  resizeMode="cover"
                />
              )}
              <View style={s.cardTop}>
                <View style={s.emojiBox}>
                  <Text style={s.emojiText}>{item.emoji}</Text>
                </View>
                <View style={s.cardInfo}>
                  <View style={s.badgeRow}>
                    {item.badge && (
                      <View style={s.badge}>
                        <Text style={s.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                    {isShopProduct && (
                      <View style={s.shopBadge}>
                        <Text style={s.shopBadgeText}>dieseelenplanerin.de</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.cardName}>{item.name}</Text>
                  {item.highlight && <Text style={s.cardHighlight}>✦ {item.highlight}</Text>}
                </View>
              </View>
              <Text style={s.cardDesc}>{item.beschreibung}</Text>
              <View style={s.cardBottom}>
                {item.preisDisplay ? <Text style={s.price}>{item.preisDisplay}</Text> : null}
                <TouchableOpacity
                  style={item.preis === 0 && !isShopProduct ? s.freeBtn : isShopProduct ? s.shopBtn : s.buyBtn}
                  onPress={() => handleBuy(item)}
                  activeOpacity={0.8}
                >
                  <Text style={isShopProduct ? s.shopBtnText : s.buyBtnText}>
                    {isShopProduct ? "Im Shop →" : item.preisDisplay ? "Kaufen →" : "Ansehen →"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </ScreenContainer>
  );
}
