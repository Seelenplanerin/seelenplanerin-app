import React, { useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Image, Dimensions, Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  darkCard: "#2C1810",
};

// ─── Mondphasen (aus zentraler moon-phase.ts mit exakten astronomischen Daten) ───
import { getCurrentMoonPhase, getMoonZodiac, getMoonIllumination, getNextVollmond } from "@/lib/moon-phase";

function getMondphase() {
  const phase = getCurrentMoonPhase();
  const zodiac = getMoonZodiac(new Date());
  const illum = getMoonIllumination(new Date());
  const nextVM = getNextVollmond();
  const daysToVM = Math.ceil((nextVM.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  return {
    name: phase.name,
    symbol: phase.emoji,
    energie: phase.energy,
    zodiac: `${zodiac.symbol} ${zodiac.name}`,
    illumination: illum,
    nextVollmond: daysToVM,
  };
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

        {/* ── HERO: Foto + Logo freigestellt ── */}
        <View style={s.heroWrapper}>
          <View style={s.hero}>
            <Image
              source={require("@/assets/images/lara-profile.jpg")}
              style={s.heroImage}
              resizeMode="cover"
              resizeMethod="resize"
            />
            <View style={s.heroGradient} />
          </View>
          <View style={s.heroLogoContainer} pointerEvents="none">
            <Image
              source={require("@/assets/images/logo-transparent.png")}
              style={s.heroLogo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ── BEGRÜSSUNG ── */}
        <LinearGradient
          colors={["#FDF0EA", "#F9E4D8", "#F5D9CC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.greetingBox}
        >
          <Text style={s.greetingTitle}>Schön, dass du da bist. 🌸</Text>
          <Text style={s.greetingText}>
            Ich bin die Seelenplanerin. Hier findest du Rituale, Mondenergie, Runen und Impulse für deine Seele. Dieser Raum gehört dir.
          </Text>
        </LinearGradient>

        {/* ── TAGESIMPULS ── */}
        <LinearGradient
          colors={["#FAF3E7", "#F5E6D0", "#F0D9BC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.impulsCard}
        >
          <Text style={s.impulsLabel}>✨ Dein Tagesimpuls</Text>
          <Text style={s.impulsText}>"{impuls}"</Text>
          <Text style={s.impulsCredit}>— Die Seelenplanerin</Text>
        </LinearGradient>

        {/* ── MONDPHASE (erweitert mit Tierkreiszeichen) ── */}
        <TouchableOpacity
          style={s.mondCard}
          onPress={() => router.push("/(tabs)/mond" as any)}
          activeOpacity={0.85}
        >
          <View style={s.mondLeft}>
            <Text style={s.mondSymbol}>{mond.symbol}</Text>
            <Text style={s.mondIllum}>{mond.illumination}%</Text>
          </View>
          <View style={s.mondRight}>
            <Text style={s.mondLabel}>Aktuelle Mondphase</Text>
            <Text style={s.mondName}>{mond.name}</Text>
            <Text style={s.mondZodiac}>{mond.zodiac}</Text>
            <Text style={s.mondEnergie}>{mond.energie}</Text>
            {mond.nextVollmond > 0 && (
              <Text style={s.mondCountdown}>
                🌕 Vollmond in {mond.nextVollmond} {mond.nextVollmond === 1 ? "Tag" : "Tagen"}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* ══════════════════════════════════════════════════════════
            KERZEN-QUIZ – PROMINENT AUF DEM STARTSCREEN
            ══════════════════════════════════════════════════════════ */}
        <TouchableOpacity
          style={s.kerzenCard}
          onPress={() => router.push("/kerzen-quiz" as any)}
          activeOpacity={0.85}
        >
          <Image
            source={require("@/assets/images/kerze-1.jpg")}
            style={s.kerzenImage}
            resizeMode="cover"
          />
          <View style={s.kerzenOverlay}>
            <Text style={s.kerzenLabel}>🕯️ Meditationskerzen</Text>
            <Text style={s.kerzenTitle}>Welche Kerze passt zu dir?</Text>
            <Text style={s.kerzenDesc}>
              Handgefertigt mit echtem Heilstein – finde deine persönliche Kerze.
            </Text>
            <View style={s.kerzenBadge}>
              <Text style={s.kerzenBadgeText}>Quiz starten →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ══════════════════════════════════════════════════════════
            MUSIK & MEDITATION – PROMINENT AUF DEM STARTSCREEN
            ══════════════════════════════════════════════════════════ */}
        <TouchableOpacity
          style={s.musikBanner}
          onPress={() => router.push("/musik" as any)}
          activeOpacity={0.85}
        >
          <View style={s.musikIconCircle}>
            <Text style={{ fontSize: 28 }}>🎧</Text>
          </View>
          <View style={s.musikContent}>
            <Text style={s.musikTitle}>Musik & Meditation</Text>
            <Text style={s.musikSubtitle}>Musik von der Seelenplanerin</Text>
            <Text style={s.musikDesc}>Musik der Seelenplanerin auf Spotify hören</Text>
          </View>
          <View style={s.musikPlayBtn}>
            <Text style={s.musikPlayText}>▶</Text>
          </View>
        </TouchableOpacity>

        {/* ── MONDTYP-QUIZ ── */}
        <TouchableOpacity
          style={{
            marginHorizontal: 16, marginBottom: 16, borderRadius: 16,
            backgroundColor: "#1A1F33", borderWidth: 1, borderColor: "rgba(212,168,83,0.4)",
            padding: 14, flexDirection: "row", alignItems: "center", gap: 12,
          }}
          onPress={() => router.push("/mondtyp-quiz" as any)}
          activeOpacity={0.85}
        >
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(212,168,83,0.2)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 22 }}>🌙</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#D4A853" }}>Dein Mondtyp-Quiz</Text>
            <Text style={{ fontSize: 11, color: "#8892A8", marginTop: 2 }}>Finde heraus, welcher Mondtyp du bist</Text>
          </View>
          <Text style={{ fontSize: 16, color: "#D4A853" }}>›</Text>
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
          onPress={() => router.push("/seelenimpuls" as any)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#3D2314", "#5C3317", "#6B3A1F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.premiumCard}
          >
            <Text style={s.premiumCrown}>👑</Text>
            <Text style={s.premiumTitle}>Seelenimpuls</Text>
            <Text style={s.premiumDesc}>
              Exklusive Meditationen, tiefe Rituale, persönliche Impulse von der Seelenplanerin – nur für dich.
            </Text>
            <View style={s.premiumBadge}>
              <Text style={s.premiumBadgeText}>17 € / Monat · Jetzt entdecken →</Text>
            </View>
          </LinearGradient>
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
  },
  heroLogoContainer: {
    position: "absolute",
    bottom: 16,
    right: 20,
    zIndex: 10,
    alignItems: "center",
  },
  heroLogo: { width: 90, height: 110 },
  greetingBox: {
    padding: 20, marginHorizontal: 16,
    marginTop: 16, borderRadius: 20, borderWidth: 1, borderColor: C.border,
    overflow: "hidden" as const,
  },
  greetingTitle: { fontSize: 24, fontWeight: "700", color: C.brown, marginBottom: 8, fontFamily: "DancingScript" },
  greetingText: { fontSize: 14, color: C.brownMid, lineHeight: 22 },
  impulsCard: {
    margin: 16,
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: "#E8D5B0",
    overflow: "hidden" as const,
  },
  impulsLabel: {
    fontSize: 12, fontWeight: "700", color: C.gold,
    textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
  },
  impulsText: { fontSize: 17, color: C.brown, fontStyle: "italic", lineHeight: 26, marginBottom: 10 },
  impulsCredit: { fontSize: 12, color: C.muted, textAlign: "right" },

  // Mondphase (erweitert)
  mondCard: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: C.darkCard, borderRadius: 20, padding: 18,
    flexDirection: "row", alignItems: "center",
  },
  mondLeft: { width: 70, alignItems: "center" },
  mondSymbol: { fontSize: 44 },
  mondIllum: { fontSize: 11, color: C.gold, fontWeight: "700", marginTop: 4 },
  mondRight: { flex: 1, marginLeft: 14 },
  mondLabel: {
    fontSize: 11, color: "rgba(232,213,196,0.6)", fontWeight: "600",
    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3,
  },
  mondName: { fontSize: 18, fontWeight: "700", color: C.gold, marginBottom: 2 },
  mondZodiac: { fontSize: 13, fontWeight: "600", color: "#E8D5C4", marginBottom: 2 },
  mondEnergie: { fontSize: 12, color: "rgba(232,213,196,0.7)", lineHeight: 17 },
  mondCountdown: {
    fontSize: 11, color: "rgba(201,169,110,0.8)", fontWeight: "600", marginTop: 4,
  },

  // Kerzen-Quiz (prominent)
  kerzenCard: {
    marginHorizontal: 16, marginBottom: 16,
    borderRadius: 20, overflow: "hidden",
    height: 240,
    position: "relative" as const,
  },
  kerzenImage: {
    width: "100%" as any, height: "100%" as any,
    position: "absolute" as const, top: 0, left: 0,
  },
  kerzenOverlay: {
    flex: 1, justifyContent: "flex-end" as const,
    padding: 20,
    backgroundColor: "rgba(92,51,23,0.55)",
  },
  kerzenLabel: {
    fontSize: 12, fontWeight: "700" as any, color: C.goldLight,
    textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 4,
  },
  kerzenTitle: { fontSize: 26, fontWeight: "800" as any, color: "#FFF", marginBottom: 6, fontFamily: "DancingScript" },
  kerzenDesc: { fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 18, marginBottom: 14 },
  kerzenBadge: {
    alignSelf: "flex-start" as const,
    backgroundColor: C.gold, borderRadius: 14,
    paddingVertical: 10, paddingHorizontal: 20,
  },
  kerzenBadgeText: { color: "#FFF", fontSize: 14, fontWeight: "700" as any },

  // Musik-Banner (prominent)
  musikBanner: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: "#191414", borderRadius: 20, padding: 18,
    flexDirection: "row" as const, alignItems: "center" as const,
  },
  musikIconCircle: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: "#1DB954",
    alignItems: "center" as const, justifyContent: "center" as const, marginRight: 14,
  },
  musikContent: { flex: 1 },
  musikTitle: { fontSize: 16, fontWeight: "700" as any, color: "#FFF", marginBottom: 2 },
  musikSubtitle: { fontSize: 12, fontWeight: "600" as any, color: "#1DB954", marginBottom: 2 },
  musikDesc: { fontSize: 11, color: "rgba(255,255,255,0.6)" },
  musikPlayBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#1DB954",
    alignItems: "center" as const, justifyContent: "center" as const,
  },
  musikPlayText: { color: "#FFF", fontSize: 18, fontWeight: "700" as any },

  // Kategorien
  sectionTitle: { fontSize: 22, fontWeight: "700" as any, color: C.brown, marginHorizontal: 16, marginBottom: 12, fontFamily: "DancingScript" },
  kategorienGrid: { flexDirection: "row" as const, flexWrap: "wrap" as const, paddingHorizontal: 12, gap: 10, marginBottom: 16 },
  katCard: {
    width: (width - 44) / 2,
    backgroundColor: C.card, borderRadius: 18, padding: 16,
    alignItems: "center" as const, borderWidth: 1, borderColor: C.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
    elevation: 1,
  },
  katEmoji: { fontSize: 32, marginBottom: 8 },
  katLabel: { fontSize: 14, fontWeight: "700" as any, color: C.brown, marginBottom: 4 },
  katDesc: { fontSize: 11, color: C.muted, textAlign: "center" as const, lineHeight: 15 },

  // Premium
  premiumCard: {
    marginHorizontal: 16, marginBottom: 16,
    borderRadius: 20, padding: 20,
    alignItems: "center" as const,
    overflow: "hidden" as const,
  },
  premiumCrown: { fontSize: 32, marginBottom: 8 },
  premiumTitle: { fontSize: 26, fontWeight: "700" as any, color: C.goldLight, marginBottom: 8, fontFamily: "DancingScript" },
  premiumDesc: { fontSize: 14, color: "rgba(255,255,255,0.8)", textAlign: "center" as const, lineHeight: 20, marginBottom: 14 },
  premiumBadge: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20 },
  premiumBadgeText: { color: "#FFF", fontSize: 14, fontWeight: "700" as any },

  // Instagram
  instaCard: {
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: C.roseLight, borderRadius: 16, padding: 16,
    alignItems: "center" as const, borderWidth: 1, borderColor: C.border,
  },
  instaText: { fontSize: 14, color: C.brown, fontWeight: "600" as any, marginBottom: 4 },
  instaHandle: { fontSize: 13, color: C.rose },
});
