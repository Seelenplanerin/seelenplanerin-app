import { useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { RITUALE_2026, type Ritual } from "@/data/rituale-kalender";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
};

const KAT_EMOJI: Record<string, string> = {
  Neumond: "\u{1F311}", Vollmond: "\u{1F315}", Jahreskreis: "\u{1F525}", Spezial: "\u2728",
  Morgen: "\u2600\uFE0F", Abend: "\u{1F56F}\uFE0F", Schutz: "\u{1F6E1}\uFE0F", Meditation: "\u{1F48E}", Reinigung: "\u{1F33F}",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\u00e4/g, "ae").replace(/\u00f6/g, "oe").replace(/\u00fc/g, "ue").replace(/\u00df/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getKatColor(kat: string): string {
  switch (kat) {
    case "Neumond": return "#2C2C3E";
    case "Vollmond": return "#E8D5B0";
    case "Jahreskreis": return "#D4A574";
    case "Spezial": return "#C4826A";
    case "Morgen": return "#F5E6C8";
    case "Abend": return "#3D2B1F";
    case "Schutz": return "#1A1A2E";
    case "Meditation": return "#8B7EC8";
    case "Reinigung": return "#7AB88E";
    default: return C.roseLight;
  }
}

export default function RitualDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const ritual = useMemo(() => {
    if (!slug) return null;
    const decoded = decodeURIComponent(slug);
    // Match by slug generated from title
    const found = RITUALE_2026.find(r => slugify(r.titel) === decoded);
    if (found) return found;
    // Match by id
    const byId = RITUALE_2026.find(r => r.id === decoded);
    if (byId) return byId;
    // Fuzzy match
    const fuzzy = RITUALE_2026.find(r => {
      const s = slugify(r.titel);
      return s.includes(decoded) || decoded.includes(s);
    });
    return fuzzy || null;
  }, [slug]);

  if (!ritual) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>🕯️</Text>
          <Text style={{ fontSize: 20, fontWeight: "700", color: C.brown, textAlign: "center", marginBottom: 8 }}>
            Ritual nicht gefunden
          </Text>
          <Text style={{ fontSize: 14, color: C.muted, textAlign: "center", marginBottom: 24 }}>
            Dieses Ritual existiert leider nicht oder wurde verschoben.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: C.rose, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 24 }}
            onPress={() => router.replace("/(tabs)/rituale" as any)}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 14 }}>Alle Rituale ansehen</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Top Bar */}
        <View style={s.modalTopBar}>
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)/rituale" as any);
              }
            }}
            style={s.backBtn}
            activeOpacity={0.8}
          >
            <Text style={s.backBtnText}>← Zurück</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={[s.modalHero, { backgroundColor: getKatColor(ritual.kategorie) + "30" }]}>
            <Text style={s.modalEmoji}>{KAT_EMOJI[ritual.kategorie] || "✨"}</Text>
            <Text style={s.modalTitel}>{ritual.titel}</Text>
            <View style={s.modalMetaRow}>
              <View style={s.modalKatBadge}>
                <Text style={s.modalKatText}>{ritual.kategorie}</Text>
              </View>
              <Text style={s.modalDatum}>📅 {ritual.datum}</Text>
            </View>
          </View>

          {/* Inhalt */}
          <View style={s.textCard}>
            {ritual.abschnitte.map((a, i) => {
              if (a.typ === "intro") return <Text key={i} style={s.textIntro}>{a.text}</Text>;
              if (a.typ === "h2") return <Text key={i} style={s.textH2}>{a.text}</Text>;
              if (a.typ === "bullet") return <Text key={i} style={s.textBullet}>• {a.text}</Text>;
              if (a.typ === "schritt") return (
                <View key={i} style={s.schrittCard}>
                  <Text style={s.schrittText}>{a.text}</Text>
                </View>
              );
              if (a.typ === "affirmation") return (
                <View key={i} style={s.affirmCard}>
                  <Text style={s.affirmText}>{a.text}</Text>
                </View>
              );
              return <Text key={i} style={s.textPara}>{a.text}</Text>;
            })}
          </View>

          {/* Materialien */}
          {ritual.materialien.length > 0 && (
            <View style={s.materialSection}>
              <Text style={s.materialTitle}>🧿 Was du brauchst:</Text>
              <View style={s.materialRow}>
                {ritual.materialien.map((m, i) => (
                  <View key={i} style={s.materialTag}>
                    <Text style={s.materialText}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Produkt-CTA */}
          <View style={s.ctaCard}>
            <Text style={s.ctaTitle}>✨ Dein Ritual-Set bestellen</Text>
            <Text style={s.ctaText}>
              Alle Materialien für dieses Ritual bekommst du als fertiges Set von der Seelenplanerin – Heilsteine, Räucherwerk und Kerze, mit Liebe zusammengestellt. Ein Klick, alles dabei.
            </Text>
            <TouchableOpacity
              style={s.ctaBtn}
              onPress={() => Linking.openURL(ritual.shopUrl)}
              activeOpacity={0.85}
            >
              <Text style={s.ctaBtnText}>Ritual-Set bestellen →</Text>
            </TouchableOpacity>
          </View>

          {/* Seelenimpuls CTA */}
          <View style={s.premiumCta}>
            <Text style={{ fontSize: 18, marginBottom: 6 }}>👑</Text>
            <Text style={s.premiumCtaTitle}>Seelenimpuls Premium</Text>
            <Text style={s.premiumCtaText}>
              Exklusive Meditationen, tiefe Rituale und persönliche Impulse von der Seelenplanerin – nur für dich.
            </Text>
            <TouchableOpacity
              style={s.premiumCtaBtn}
              onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/E6FP1U")}
              activeOpacity={0.85}
            >
              <Text style={s.premiumCtaBtnText}>Exklusive Inhalte · Jetzt entdecken →</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  modalTopBar: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FDF8F4",
    borderBottomWidth: 1,
    borderBottomColor: "#EDD9D0",
  },
  backBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  backBtnText: { fontSize: 16, color: "#C4826A", fontWeight: "600" },
  modalHero: { padding: 24, alignItems: "center" },
  modalEmoji: { fontSize: 52, marginBottom: 12 },
  modalTitel: { fontSize: 22, fontWeight: "700", color: "#5C3317", textAlign: "center", marginBottom: 10 },
  modalMetaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalKatBadge: {
    backgroundColor: "#C4826A",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  modalKatText: { fontSize: 12, color: "#FFF", fontWeight: "600" },
  modalDatum: { fontSize: 13, color: "#A08070" },
  textCard: { marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
  textIntro: { fontSize: 15, color: "#8B5E3C", lineHeight: 24, marginBottom: 16, fontStyle: "italic" },
  textH2: { fontSize: 16, fontWeight: "700", color: "#5C3317", marginTop: 16, marginBottom: 8 },
  textBullet: { fontSize: 13, color: "#8B5E3C", lineHeight: 22, marginLeft: 4, marginBottom: 4 },
  textPara: { fontSize: 14, color: "#8B5E3C", lineHeight: 22, marginBottom: 8 },
  schrittCard: {
    backgroundColor: "#F5EEE8",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#C4826A",
  },
  schrittText: { fontSize: 13, color: "#8B5E3C", lineHeight: 21 },
  affirmCard: {
    backgroundColor: "#F9EDE8",
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  affirmText: { fontSize: 15, color: "#5C3317", fontStyle: "italic", textAlign: "center", lineHeight: 23 },
  materialSection: { marginHorizontal: 16, marginTop: 8, marginBottom: 8 },
  materialTitle: { fontSize: 15, fontWeight: "700", color: "#5C3317", marginBottom: 10 },
  materialRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  materialTag: {
    backgroundColor: "#FAF3E7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8D5B0",
  },
  materialText: { fontSize: 12, color: "#8B5E3C", fontWeight: "500" },
  ctaCard: {
    margin: 16,
    backgroundColor: "#FAF3E7",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E8D5B0",
  },
  ctaTitle: { fontSize: 16, fontWeight: "700", color: "#5C3317", marginBottom: 8 },
  ctaText: { fontSize: 13, color: "#A08070", lineHeight: 19, marginBottom: 14 },
  ctaBtn: { backgroundColor: "#C4826A", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  ctaBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  premiumCta: {
    marginHorizontal: 16,
    backgroundColor: "#5C3317",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  premiumCtaTitle: { fontSize: 18, fontWeight: "700", color: "#FAF3E7", marginBottom: 6 },
  premiumCtaText: { fontSize: 13, color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 19, marginBottom: 14 },
  premiumCtaBtn: { backgroundColor: "#C9A96E", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  premiumCtaBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
});
