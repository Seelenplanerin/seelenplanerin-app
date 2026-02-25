import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
};

const MENU_ITEMS = [
  {
    section: "Entdecken",
    items: [
      { id: "runen", label: "Runen & Schutzrune", emoji: "ᚱ", route: "/(tabs)/runen" },
      { id: "mond", label: "Mondphasen-Kalender", emoji: "🌙", route: "/(tabs)/rituale" },
      { id: "journal", label: "Mein Journal", emoji: "📖", route: "/(tabs)/journal" },
    ],
  },
  {
    section: "Shop & Buchung",
    items: [
      { id: "shop", label: "Zum Shop", emoji: "✨", url: "https://dieseelenplanerin.tentary.com" },
      { id: "buchen", label: "Termin buchen", emoji: "📅", url: "https://calendly.com/dieseelenplanerin" },
      { id: "seelenimpuls", label: "Seelenimpuls Premium", emoji: "👑", url: "https://dieseelenplanerin.tentary.com" },
    ],
  },
  {
    section: "Verbinden",
    items: [
      { id: "instagram", label: "Instagram", emoji: "📸", url: "https://www.instagram.com/die.seelenplanerin/" },
      { id: "quiz-runen", label: "Runen-Quiz", emoji: "🔮", url: "https://tally.so/r/b5WLY7" },
      { id: "quiz-mond", label: "Mondenergie-Quiz", emoji: "🌕", url: "https://tally.so/r/jabkdR" },
    ],
  },
];

const PRODUKTE = [
  { id: "schutz", name: "Schutzarmband", beschreibung: "Schwarzer Turmalin + handgravierter Runen-Charm", preis: "28,90 €", emoji: "🖤" },
  { id: "runen", name: "Runen-Armband", beschreibung: "3 handgravierte Charms auf Silberkette mit Heilsteinpulver", preis: "ab 38 €", emoji: "✨" },
  { id: "soul-talk", name: "Soul Talk", beschreibung: "Persönliches Gespräch mit Lara – kostenlos", preis: "Kostenlos", emoji: "☕" },
  { id: "aura", name: "Aura Reading", beschreibung: "Tiefe Aura-Analyse und Energiearbeit", preis: "77 €", emoji: "🔮", route: "/aura" },
];

export default function IchScreen() {
  function navigate(item: { route?: string; url?: string }) {
    if (item.url) {
      Linking.openURL(item.url);
    } else if (item.route) {
      router.push(item.route as any);
    }
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerAvatar}>
            <Text style={s.headerAvatarText}>🌸</Text>
          </View>
          <View style={s.headerInfo}>
            <Text style={s.headerName}>Die Seelenplanerin</Text>
            <Text style={s.headerTagline}>Spirituelle Begleiterin für Frauen</Text>
          </View>
        </View>

        {/* Seelenimpuls Banner */}
        <TouchableOpacity
          style={s.premiumBanner}
          onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com")}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 22, marginRight: 12 }}>👑</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#FFF" }}>Seelenimpuls Premium</Text>
            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Exklusive Inhalte von Lara · 17 € / Monat</Text>
          </View>
          <Text style={{ color: C.gold, fontSize: 16, fontWeight: "700" }}>Starten →</Text>
        </TouchableOpacity>

        {/* Produkte Highlights */}
        <Text style={s.sec}>🛍️ Laras Produkte</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}>
          {PRODUKTE.map(p => (
            <TouchableOpacity
              key={p.id}
              style={s.produktCard}
              onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com")}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{p.emoji}</Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: C.brown, marginBottom: 4 }}>{p.name}</Text>
              <Text style={{ fontSize: 11, color: C.muted, lineHeight: 16, marginBottom: 8 }}>{p.beschreibung}</Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: C.rose }}>{p.preis}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menü-Sektionen */}
        {MENU_ITEMS.map(section => (
          <View key={section.section}>
            <Text style={s.sec}>{section.section}</Text>
            <View style={s.menuSection}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[s.menuItem, idx < section.items.length - 1 && s.menuItemBorder]}
                  onPress={() => navigate(item)}
                  activeOpacity={0.8}
                >
                  <Text style={s.menuEmoji}>{item.emoji}</Text>
                  <Text style={s.menuLabel}>{item.label}</Text>
                  <Text style={s.menuArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Admin */}
        <Text style={s.sec}>⚙️ Verwaltung</Text>
        <View style={s.menuSection}>
          <TouchableOpacity
            style={s.menuItem}
            onPress={() => router.push("/admin" as any)}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>🔐</Text>
            <Text style={s.menuLabel}>Admin-Bereich (Lara)</Text>
            <Text style={s.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Über die App */}
        <View style={s.aboutCard}>
          <Text style={s.aboutTitle}>Über Die Seelenplanerin</Text>
          <Text style={s.aboutText}>
            Diese App ist mit Liebe von Lara für alle Frauen geschaffen, die auf ihrer spirituellen Reise Begleitung suchen. Hier findest du Rituale, Mondenergie, Runen und persönliche Impulse – alles handgemacht und von Herzen.
          </Text>
          <Text style={s.aboutVersion}>Version 1.0 · Made with 🌸 by Lara</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: C.roseLight, padding: 20, paddingTop: 24, flexDirection: "row", alignItems: "center" },
  headerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.rose, alignItems: "center", justifyContent: "center", marginRight: 14 },
  headerAvatarText: { fontSize: 28 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 20, fontWeight: "700", color: C.brown },
  headerTagline: { fontSize: 13, color: C.muted, marginTop: 2 },
  premiumBanner: { marginHorizontal: 16, marginTop: 16, backgroundColor: C.brown, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center" },
  sec: { fontSize: 15, fontWeight: "700", color: C.muted, marginHorizontal: 16, marginTop: 20, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 },
  produktCard: { width: 160, backgroundColor: C.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border },
  menuSection: { marginHorizontal: 16, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  menuEmoji: { fontSize: 20, marginRight: 14, width: 28, textAlign: "center" },
  menuLabel: { flex: 1, fontSize: 15, color: C.brown, fontWeight: "500" },
  menuArrow: { fontSize: 20, color: C.muted },
  aboutCard: { marginHorizontal: 16, marginTop: 8, backgroundColor: C.goldLight, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#E8D5B0" },
  aboutTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 8 },
  aboutText: { fontSize: 13, color: C.brownMid, lineHeight: 20, marginBottom: 8 },
  aboutVersion: { fontSize: 12, color: C.muted },
});
