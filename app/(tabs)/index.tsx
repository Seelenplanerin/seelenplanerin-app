import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image,
  ImageBackground, Platform,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getCurrentMoonPhase } from "@/lib/moon-phase";
import { CONTENT_DATA } from "@/lib/content-data";
import * as Haptics from "expo-haptics";

const DAILY_IMPULSE_INDEX = new Date().getDate() % CONTENT_DATA.filter(c => c.category === "impuls").length;
const dailyImpuls = CONTENT_DATA.filter(c => c.category === "impuls")[DAILY_IMPULSE_INDEX];

const CATEGORIES = [
  { id: "ritual",     emoji: "🕯️", label: "Rituale",     subtitle: "Für deine Seele",   color: "#F2C4B8" },
  { id: "meditation", emoji: "🌸", label: "Meditationen", subtitle: "Komm zur Ruhe",     color: "#EDD9D0" },
  { id: "gedicht",    emoji: "🌿", label: "Gedichte",     subtitle: "Worte die berühren", color: "#F5E6D8" },
  { id: "impuls",     emoji: "✨", label: "Impulse",      subtitle: "Tägliche Weisheit",  color: "#FFF0EB" },
  { id: "runen",      emoji: "ᚱ",  label: "Runen",        subtitle: "Deine Schutzrune",   color: "#EDD9D0" },
];

export default function HomeScreen() {
  const colors = useColors();
  const moon = getCurrentMoonPhase();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Guten Morgen" : hour < 17 ? "Hallo" : "Guten Abend";
  const dayName = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"][now.getDay()];

  const handleCategory = (id: string) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (id === "runen") {
      router.push("/runen/quiz" as any);
    } else {
      router.push({ pathname: "/entdecken", params: { filter: id } } as any);
    }
  };

  const s = StyleSheet.create({
    scroll: { flex: 1 },
    heroBg: { width: "100%", height: 260, justifyContent: "flex-end" },
    heroOverlay: {
      paddingHorizontal: 24, paddingBottom: 28, paddingTop: 80,
      backgroundColor: "rgba(253,248,244,0.15)",
    },
    heroGreeting: {
      fontSize: 14, color: "#9C7B6E", fontWeight: "500", letterSpacing: 0.5,
      marginBottom: 4,
    },
    heroTitle: {
      fontSize: 30, fontWeight: "700", color: "#3D2B1F", lineHeight: 38,
    },
    heroSub: {
      fontSize: 15, color: "#9C7B6E", marginTop: 4, fontStyle: "italic",
    },
    logoSmall: { width: 36, height: 36, marginRight: 10 },
    headerRow: {
      flexDirection: "row", alignItems: "center", paddingHorizontal: 24,
      paddingTop: 20, paddingBottom: 8,
    },
    body: { paddingHorizontal: 20, paddingBottom: 40 },

    // Mondphase Card
    moonCard: {
      borderRadius: 24, overflow: "hidden", marginBottom: 20,
      borderWidth: 1, borderColor: "#EDD9D0",
      backgroundColor: "#FFF0EB",
    },
    moonCardInner: { flexDirection: "row", alignItems: "center", padding: 18 },
    moonImg: { width: 64, height: 64, marginRight: 16 },
    moonInfo: { flex: 1 },
    moonLabel: { fontSize: 11, color: "#C4826A", textTransform: "uppercase", letterSpacing: 1, fontWeight: "600", marginBottom: 2 },
    moonName: { fontSize: 18, fontWeight: "700", color: "#3D2B1F", marginBottom: 2 },
    moonDesc: { fontSize: 13, color: "#9C7B6E", lineHeight: 18 },
    moonBtn: {
      backgroundColor: "#C4826A", borderRadius: 12, paddingVertical: 8,
      paddingHorizontal: 14, alignSelf: "flex-start", marginTop: 8,
    },
    moonBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },

    // Tagesimpuls
    impulsCard: {
      borderRadius: 24, padding: 20, marginBottom: 20,
      backgroundColor: "#FFF0EB", borderWidth: 1, borderColor: "#EDD9D0",
    },
    impulsLabel: { fontSize: 11, color: "#C4826A", textTransform: "uppercase", letterSpacing: 1, fontWeight: "600", marginBottom: 8 },
    impulsDay: { fontSize: 13, color: "#9C7B6E", marginBottom: 6 },
    impulsText: {
      fontSize: 17, color: "#3D2B1F", lineHeight: 28, fontStyle: "italic",
      fontWeight: "500",
    },
    divider: { width: "100%", height: 30, marginVertical: 4 },

    // Kategorien
    sectionTitle: {
      fontSize: 20, fontWeight: "700", color: "#3D2B1F", marginBottom: 14,
      marginTop: 4,
    },
    catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
    catCard: {
      width: "47%", borderRadius: 20, padding: 16,
      borderWidth: 1, borderColor: "#EDD9D0",
      alignItems: "flex-start",
    },
    catEmoji: { fontSize: 28, marginBottom: 8 },
    catLabel: { fontSize: 15, fontWeight: "700", color: "#3D2B1F", marginBottom: 2 },
    catSub: { fontSize: 12, color: "#9C7B6E" },

    // Shop Teaser
    shopTeaser: {
      borderRadius: 24, padding: 20, marginBottom: 20,
      backgroundColor: "#F5E6D8", borderWidth: 1, borderColor: "#EDD9D0",
      flexDirection: "row", alignItems: "center",
    },
    shopImg: { width: 80, height: 80, borderRadius: 16, marginRight: 16 },
    shopInfo: { flex: 1 },
    shopLabel: { fontSize: 11, color: "#C4826A", textTransform: "uppercase", letterSpacing: 1, fontWeight: "600", marginBottom: 4 },
    shopTitle: { fontSize: 16, fontWeight: "700", color: "#3D2B1F", marginBottom: 4 },
    shopSub: { fontSize: 13, color: "#9C7B6E", lineHeight: 18 },
    shopBtn: {
      backgroundColor: "#C4826A", borderRadius: 12, paddingVertical: 8,
      paddingHorizontal: 14, alignSelf: "flex-start", marginTop: 8,
    },
    shopBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },

    // Journal Teaser
    journalCard: {
      borderRadius: 24, padding: 20, marginBottom: 20,
      backgroundColor: "#FFF0EB", borderWidth: 1, borderColor: "#EDD9D0",
      flexDirection: "row", alignItems: "center",
    },
    journalEmoji: { fontSize: 40, marginRight: 16 },
    journalInfo: { flex: 1 },
    journalTitle: { fontSize: 16, fontWeight: "700", color: "#3D2B1F", marginBottom: 4 },
    journalSub: { fontSize: 13, color: "#9C7B6E", lineHeight: 18 },
    journalBtn: {
      backgroundColor: "#C4826A", borderRadius: 12, paddingVertical: 8,
      paddingHorizontal: 14, alignSelf: "flex-start", marginTop: 8,
    },
    journalBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  });

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero Header mit Aquarell-Hintergrund */}
        <ImageBackground
          source={{ uri: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663350288528/LpOvnMhJNkKbbFdG.png" }}
          style={s.heroBg}
          resizeMode="cover"
        >
          <View style={s.heroOverlay}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Image source={require("../../assets/images/icon.png")} style={s.logoSmall} resizeMode="contain" />
              <Text style={{ fontSize: 13, color: "#9C7B6E", fontWeight: "600" }}>Die Seelenplanerin</Text>
            </View>
            <Text style={s.heroGreeting}>{greeting}, schöne Seele ✦</Text>
            <Text style={s.heroTitle}>Willkommen{"\n"}in deinem Seelenraum</Text>
            <Text style={s.heroSub}>{dayName} · {now.toLocaleDateString("de-DE", { day: "numeric", month: "long" })}</Text>
          </View>
        </ImageBackground>

        <View style={s.body}>

          {/* Mondphase */}
          <TouchableOpacity
            style={s.moonCard}
            onPress={() => router.push("/(tabs)/mond" as any)}
            activeOpacity={0.85}
          >
            <View style={s.moonCardInner}>
              <Image source={{ uri: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663350288528/nZtVzwdnRzGcfejv.png" }} style={s.moonImg} resizeMode="contain" />
              <View style={s.moonInfo}>
                <Text style={s.moonLabel}>Aktuelle Mondphase</Text>
                <Text style={s.moonName}>{moon.name}</Text>
                <Text style={s.moonDesc}>{moon.energy}</Text>
                <TouchableOpacity style={s.moonBtn} onPress={() => router.push("/(tabs)/mond" as any)}>
                  <Text style={s.moonBtnText}>Mondkalender →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          {/* Tagesimpuls */}
          {dailyImpuls && (
            <TouchableOpacity
              style={s.impulsCard}
              onPress={() => router.push({ pathname: "/content/[id]", params: { id: dailyImpuls.id } } as any)}
              activeOpacity={0.85}
            >
              <Text style={s.impulsLabel}>✨ Dein Tagesimpuls</Text>
              <Text style={s.impulsDay}>{dayName}, {now.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}</Text>
              <Text style={s.impulsText}>"{dailyImpuls.content.substring(0, 120)}..."</Text>
              <Image source={{ uri: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663350288528/HZsyuaoJHcXswMbQ.png" }} style={s.divider} resizeMode="contain" />
            </TouchableOpacity>
          )}

          {/* Kategorien */}
          <Text style={s.sectionTitle}>Was möchtest du heute erkunden?</Text>
          <View style={s.catGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[s.catCard, { backgroundColor: cat.color }]}
                onPress={() => handleCategory(cat.id)}
                activeOpacity={0.82}
              >
                <Text style={s.catEmoji}>{cat.emoji}</Text>
                <Text style={s.catLabel}>{cat.label}</Text>
                <Text style={s.catSub}>{cat.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Shop Teaser */}
          <TouchableOpacity
            style={s.shopTeaser}
            onPress={() => router.push("/shop" as any)}
            activeOpacity={0.85}
          >
            <Image
              source={require("../../assets/images/product-charms.jpg")}
              style={s.shopImg}
              resizeMode="cover"
            />
            <View style={s.shopInfo}>
              <Text style={s.shopLabel}>✦ Runen-Armbänder</Text>
              <Text style={s.shopTitle}>Handgraviert mit Heilstein-Pulver</Text>
              <Text style={s.shopSub}>Jedes Plättchen ist ein Unikat – von Lara persönlich für dich gefertigt.</Text>
              <TouchableOpacity style={s.shopBtn} onPress={() => router.push("/shop" as any)}>
                <Text style={s.shopBtnText}>Zum Shop →</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Journal Teaser */}
          <TouchableOpacity
            style={s.journalCard}
            onPress={() => router.push("/journal" as any)}
            activeOpacity={0.85}
          >
            <Text style={s.journalEmoji}>📖</Text>
            <View style={s.journalInfo}>
              <Text style={s.journalTitle}>Dein Seelenjournal</Text>
              <Text style={s.journalSub}>Schreib für dich. Deine Gedanken, deine Gefühle, dein Weg.</Text>
              <TouchableOpacity style={s.journalBtn} onPress={() => router.push("/journal" as any)}>
                <Text style={s.journalBtnText}>Journal öffnen →</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
