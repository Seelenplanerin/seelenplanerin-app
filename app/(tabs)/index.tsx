import React, { useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Image, Dimensions, Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// ─── Farben ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#FDF8F4",
  card: "#FFFFFF",
  rose: "#C4826A",
  roseLight: "#F9EDE8",
  roseMid: "#E8B4A0",
  gold: "#C9A96E",
  goldLight: "#FAF3E7",
  brown: "#5C3317",
  brownMid: "#8B5E3C",
  muted: "#A08070",
  border: "#EDD9D0",
  text: "#3D2314",
  cream: "#FDF8F4",
  white: "#FFFFFF",
};

// ─── Mondphasen (aus zentraler moon-phase.ts mit exakten astronomischen Daten) ───
import { getCurrentMoonPhase } from "@/lib/moon-phase";

function getMondphase(): { name: string; symbol: string; energie: string } {
  const phase = getCurrentMoonPhase();
  return { name: phase.name, symbol: phase.emoji, energie: phase.energy };
}

// ─── Tagesimpulse ─────────────────────────────────────────────────────────────
const IMPULSE = [
  "Du bist genug. Genau so wie du bist, in diesem Moment.",
  "Vertraue dem Prozess. Alles entfaltet sich im richtigen Tempo.",
  "Deine Intuition ist dein stärkster Kompass. Höre auf sie.",
  "Heute darfst du sanft mit dir sein. Du musst nichts beweisen.",
  "Jeder Atemzug ist ein Neuanfang. Atme tief und beginne.",
  "Du trägst Licht in dir. Lass es leuchten.",
  "Was du aussendest, kehrt zu dir zurück. Wähle Liebe.",
  "Deine Wurzeln geben dir Halt. Deine Flügel geben dir Freiheit.",
  "Heute ist ein guter Tag, um dankbar zu sein.",
  "Du bist auf dem richtigen Weg. Vertraue dir selbst.",
  "Deine Seele weiß den Weg. Höre ihr zu.",
  "Grenzen setzen ist ein Akt der Selbstliebe.",
  "Wachstum geschieht oft im Stillen. Sei geduldig mit dir.",
  "Du verdienst alles Gute, das das Leben zu bieten hat.",
  "Lass los was dich schwer macht. Du darfst leicht sein.",
  "Deine Energie ist kostbar. Schütze sie liebevoll.",
  "Heute darfst du fühlen was du fühlst. Alles ist erlaubt.",
  "Du bist verbunden mit allem was ist. Du bist nie allein.",
  "Deine Geschichte ist wertvoll. Teile sie wenn du bereit bist.",
  "Jeder Tag trägt ein Geschenk in sich. Öffne die Augen dafür.",
  "Du bist stärker als du denkst und schöner als du glaubst.",
  "Vertrauen ist die höchste Form des Mutes.",
  "Dein Herz kennt die Antworten. Frage es.",
  "Heute darfst du einfach sein. Ohne Leistung, ohne Druck.",
  "Du bist ein Wunder des Lebens. Vergiss das nie.",
  "Was du liebst, liebt dich zurück.",
  "Deine Seele hat einen Plan. Vertraue ihm.",
  "Heute ist ein guter Tag, um dir selbst zu vergeben.",
  "Du bist im Fluss des Lebens. Lass dich tragen.",
  "Deine Präsenz ist ein Geschenk an die Welt.",
];

const KATEGORIEN = [
  { id: "rituale", label: "Rituale", emoji: "🕯️", desc: "Jahreskalender mit Ritualen", route: "/(tabs)/rituale" },
  { id: "mond", label: "Mondphasen", emoji: "🌙", desc: "Lebe im Rhythmus des Mondes", route: "/(tabs)/mond" },
  { id: "runen", label: "Runen", emoji: "ᚱ", desc: "Schutzrune & Runen-Quiz", route: "/(tabs)/runen" },
  { id: "aura", label: "Aura", emoji: "🌈", desc: "Deine heutige Aura-Farbe", route: "/aura" },
  { id: "journal", label: "Journal", emoji: "📖", desc: "Dein persönliches Seelentagebuch", route: "/(tabs)/journal" },
  { id: "shop", label: "Shop", emoji: "✨", desc: "Handgravierte Runen-Armbänder", route: "/shop" },
];

export default function AktuellesScreen() {
  const mond = useMemo(() => getMondphase(), []);
  const impuls = useMemo(() => {
    const day = new Date().getDay() + new Date().getDate();
    return IMPULSE[day % IMPULSE.length];
  }, []);

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HERO: Laras Foto + Logo freigestellt ── */}
        <View style={s.heroWrapper}>
          <View style={s.hero}>
            <Image
              source={require("@/assets/images/lara-profile.jpg")}
              style={s.heroImage}
              resizeMode="cover"
              resizeMethod="resize"
            />
            {/* Gradient-Overlay für sanften Übergang */}
            <View style={s.heroGradient} />
          </View>
          {/* Logo freigestellt – rechts unten, überlappt Begrüßungskarte */}
          <View style={s.heroLogoContainer} pointerEvents="none">
            <Image
              source={require("@/assets/images/logo-transparent.png")}
              style={s.heroLogo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ── BEGRÜSSUNG ── */}
        <View style={s.greetingBox}>
          <Text style={s.greetingTitle}>Schön, dass du da bist. 🌸</Text>
          <Text style={s.greetingText}>
            Ich bin Lara – die Seelenplanerin. Hier findest du Rituale, Mondenergie, Runen und Impulse für deine Seele. Dieser Raum gehört dir.
          </Text>
        </View>

        {/* ── TAGESIMPULS ── */}
        <View style={s.impulsCard}>
          <Text style={s.impulsLabel}>✨ Dein Tagesimpuls</Text>
          <Text style={s.impulsText}>"{impuls}"</Text>
          <Text style={s.impulsCredit}>— Lara, Die Seelenplanerin</Text>
        </View>

        {/* ── MONDPHASE ── */}
        <TouchableOpacity
          style={s.mondCard}
          onPress={() => router.push("/(tabs)/mond" as any)}
          activeOpacity={0.85}
        >
          <View style={s.mondLeft}>
            <Text style={s.mondSymbol}>{mond.symbol}</Text>
          </View>
          <View style={s.mondRight}>
            <Text style={s.mondLabel}>Aktuelle Mondphase</Text>
            <Text style={s.mondName}>{mond.name}</Text>
            <Text style={s.mondEnergie}>{mond.energie}</Text>
          </View>
        </TouchableOpacity>

        {/* ── KATEGORIEN ── */}
        <Text style={s.sectionTitle}>Entdecke die Seelenplanerin</Text>
        <View style={s.kategorienGrid}>
          {KATEGORIEN.map(kat => (
            <TouchableOpacity
              key={kat.id}
              style={s.katCard}
              onPress={() => router.push(kat.route as any)}
              activeOpacity={0.85}
            >
              <Text style={s.katEmoji}>{kat.emoji}</Text>
              <Text style={s.katLabel}>{kat.label}</Text>
              <Text style={s.katDesc}>{kat.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── SEELENIMPULS PREMIUM ── */}
        <TouchableOpacity
          style={s.premiumCard}
          onPress={() => router.push("/seelenimpuls" as any)}
          activeOpacity={0.85}
        >
          <Text style={s.premiumCrown}>👑</Text>
          <Text style={s.premiumTitle}>Seelenimpuls</Text>
          <Text style={s.premiumDesc}>
            Exklusive Meditationen, tiefe Rituale, persönliche Impulse von Lara – nur für dich.
          </Text>
          <View style={s.premiumBadge}>
            <Text style={s.premiumBadgeText}>17 € / Monat · Jetzt entdecken →</Text>
          </View>
        </TouchableOpacity>

        {/* ── INSTAGRAM ── */}
        <TouchableOpacity
          style={s.instaCard}
          onPress={() => Linking.openURL("https://www.instagram.com/die.seelenplanerin/")}
          activeOpacity={0.85}
        >
          <Text style={s.instaText}>📸 Folge mir auf Instagram</Text>
          <Text style={s.instaHandle}>@die.seelenplanerin</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  heroWrapper: { width: "100%", position: "relative" },
  hero: { width: "100%", height: 480, overflow: "hidden" },
  heroImage: {
    width: "100%",
    height: "105%",
    top: 0,
  },
  heroGradient: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
    backgroundColor: "transparent",
    // Sanfter Übergang zum Hintergrund
  },
  heroLogoContainer: {
    position: "absolute",
    bottom: 16,
    right: 20,
    zIndex: 10,
    alignItems: "center",
  },
  heroLogo: { width: 90, height: 110 },
  greetingBox: { backgroundColor: C.roseLight, padding: 20, marginHorizontal: 16, marginTop: 16, borderRadius: 20, borderWidth: 1, borderColor: C.border },
  greetingTitle: { fontSize: 20, fontWeight: "700", color: C.brown, marginBottom: 8 },
  greetingText: { fontSize: 14, color: C.brownMid, lineHeight: 22 },
  impulsCard: {
    margin: 16, backgroundColor: C.goldLight,
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: "#E8D5B0",
  },
  impulsLabel: { fontSize: 12, fontWeight: "700", color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  impulsText: { fontSize: 17, color: C.brown, fontStyle: "italic", lineHeight: 26, marginBottom: 10 },
  impulsCredit: { fontSize: 12, color: C.muted, textAlign: "right" },
  mondCard: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: C.card, borderRadius: 20, padding: 16,
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.rose, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8,
    elevation: 2,
  },
  mondLeft: { width: 60, alignItems: "center" },
  mondSymbol: { fontSize: 40 },
  mondRight: { flex: 1, marginLeft: 12 },
  mondLabel: { fontSize: 11, color: C.muted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 },
  mondName: { fontSize: 17, fontWeight: "700", color: C.brown, marginBottom: 3 },
  mondEnergie: { fontSize: 13, color: C.muted, lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: C.brown, marginHorizontal: 16, marginBottom: 12 },
  kategorienGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 10, marginBottom: 16 },
  katCard: {
    width: (width - 44) / 2,
    backgroundColor: C.card, borderRadius: 18, padding: 16,
    alignItems: "center", borderWidth: 1, borderColor: C.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
    elevation: 1,
  },
  katEmoji: { fontSize: 32, marginBottom: 8 },
  katLabel: { fontSize: 14, fontWeight: "700", color: C.brown, marginBottom: 4 },
  katDesc: { fontSize: 11, color: C.muted, textAlign: "center", lineHeight: 15 },
  premiumCard: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: C.brown, borderRadius: 20, padding: 20,
    alignItems: "center",
  },
  premiumCrown: { fontSize: 32, marginBottom: 8 },
  premiumTitle: { fontSize: 22, fontWeight: "700", color: C.goldLight, marginBottom: 8 },
  premiumDesc: { fontSize: 14, color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 20, marginBottom: 14 },
  premiumBadge: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20 },
  premiumBadgeText: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  instaCard: {
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: C.roseLight, borderRadius: 16, padding: 16,
    alignItems: "center", borderWidth: 1, borderColor: C.border,
  },
  instaText: { fontSize: 14, color: C.brown, fontWeight: "600", marginBottom: 4 },
  instaHandle: { fontSize: 13, color: C.rose },
});
