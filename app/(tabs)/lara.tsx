import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image,
  Linking, Platform, ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";

const INSTAGRAM_URL = "https://www.instagram.com/die.seelenplanerin/";
const TENTARY_URL = "https://dieseelenplanerin.tentary.com/p/E6FP1U";

export default function LaraScreen() {
  const tap = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const s = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: "#FDF8F4" },
    hero: { height: 420, justifyContent: "flex-end" },
    heroOverlay: {
      paddingHorizontal: 24, paddingBottom: 32, paddingTop: 120,
      backgroundColor: "rgba(253,248,244,0.2)",
    },
    heroName: {
      fontSize: 36, fontWeight: "800", color: "#fff",
      textShadowColor: "rgba(61,43,31,0.4)", textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6,
    },
    heroTitle: {
      fontSize: 16, color: "rgba(255,255,255,0.95)", fontStyle: "italic", marginTop: 4,
      textShadowColor: "rgba(61,43,31,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
    },
    body: { padding: 20, paddingBottom: 40 },

    // Persönliche Begrüßung
    welcomeCard: {
      borderRadius: 24, padding: 20, marginBottom: 16,
      backgroundColor: "#FFF0EB", borderWidth: 1, borderColor: "#EDD9D0",
    },
    welcomeText: {
      fontSize: 16, color: "#3D2B1F", lineHeight: 28, fontStyle: "italic",
    },
    welcomeSig: {
      fontSize: 14, color: "#C4826A", fontWeight: "700", marginTop: 10,
      textAlign: "right",
    },

    divider: { width: "100%", height: 32, marginVertical: 4 },

    // Angebote
    sectionTitle: {
      fontSize: 20, fontWeight: "700", color: "#3D2B1F", marginBottom: 14, marginTop: 8,
    },
    offerGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
    offerCard: {
      width: "47%", borderRadius: 20, padding: 16,
      borderWidth: 1, borderColor: "#EDD9D0", alignItems: "center",
    },
    offerEmoji: { fontSize: 30, marginBottom: 8 },
    offerTitle: { fontSize: 14, fontWeight: "700", color: "#3D2B1F", textAlign: "center", marginBottom: 2 },
    offerSub: { fontSize: 12, color: "#9C7B6E", textAlign: "center" },

    // Handwerk
    craftCard: { borderRadius: 24, overflow: "hidden", marginBottom: 16 },
    craftImg: { width: "100%", height: 220 },
    craftInfo: {
      padding: 16, backgroundColor: "#FFF0EB",
      borderWidth: 1, borderColor: "#EDD9D0", borderTopWidth: 0,
      borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    },
    craftTitle: { fontSize: 16, fontWeight: "700", color: "#3D2B1F", marginBottom: 4 },
    craftText: { fontSize: 14, color: "#9C7B6E", lineHeight: 20 },

    // Buttons
    igBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center",
      backgroundColor: "#E1306C", borderRadius: 20, paddingVertical: 16,
      paddingHorizontal: 24, marginBottom: 10,
    },
    igBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", marginLeft: 8 },
    shopBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center",
      backgroundColor: "#C4826A", borderRadius: 20, paddingVertical: 16,
      paddingHorizontal: 24, marginBottom: 10,
    },
    shopBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", marginLeft: 8 },
    bookBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center",
      borderWidth: 1.5, borderColor: "#C4826A", borderRadius: 20, paddingVertical: 16,
      paddingHorizontal: 24, marginBottom: 10,
    },
    bookBtnText: { color: "#C4826A", fontSize: 16, fontWeight: "700", marginLeft: 8 },
    journalBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center",
      backgroundColor: "#F2C4B8", borderRadius: 20, paddingVertical: 16,
      paddingHorizontal: 24, marginBottom: 10,
    },
    journalBtnText: { color: "#3D2B1F", fontSize: 16, fontWeight: "700", marginLeft: 8 },

    // Admin (versteckt, kleiner Link unten)
    adminRow: { alignItems: "center", paddingTop: 16, paddingBottom: 8 },
    adminLink: { fontSize: 11, color: "#EDD9D0" },
  });

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero mit der Seelenplanerins echtem Foto */}
        <ImageBackground
          source={require("../../assets/images/lara-profile.jpg")}
          style={s.hero}
          resizeMode="cover"
        >
          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 220, backgroundColor: "rgba(61,43,31,0.35)" }} />
          <View style={s.heroOverlay}>
            <Text style={s.heroName}>Lara</Text>
            <Text style={s.heroTitle}>Die Seelenplanerin ✦ Deine spirituelle Begleiterin</Text>
          </View>
        </ImageBackground>

        <View style={s.body}>

          {/* Persönliche Begrüßung von der Seelenplanerin */}
          <View style={s.welcomeCard}>
            <Text style={s.welcomeText}>
              "Ich freue mich, dass du hier bist.{"\n\n"}
              Diese App ist mein Herzensraum für dich – ein Ort, an dem du dich selbst wieder spüren darfst. Durch Runen, Rituale, Mondenergie und Impulse begleite ich dich auf deinem Weg zu dir selbst.{"\n\n"}
              Jedes Runen-Armband, das ich für dich erschaffe, ist ein Unikat – handgraviert und mit kraftvollem Heilstein-Pulver befüllt. Mit Liebe gemacht, nur für dich."
            </Text>
            <Image
              source={{ uri: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663350288528/HZsyuaoJHcXswMbQ.png" }}
              style={s.divider}
              resizeMode="contain"
            />
            <Text style={s.welcomeSig}>– Die Seelenplanerin 🌸</Text>
          </View>

          {/* Was ich anbiete */}
          <Text style={s.sectionTitle}>Was ich für dich tue</Text>
          <View style={s.offerGrid}>
            {[
              { emoji: "ᚱ", title: "Runen-Armbänder", sub: "Handgraviert & einzigartig" },
              { emoji: "🌈", title: "Aura Reading", sub: "Deine Energiefelder" },
              { emoji: "🌙", title: "Mondrituale", sub: "Im Rhythmus der Natur" },
              { emoji: "💫", title: "Deep Talk", sub: "1:1 mit der Seelenplanerin" },
              { emoji: "🔮", title: "Seelenreset", sub: "Neu beginnen" },
              { emoji: "✨", title: "Seelenimpulse", sub: "Tägliche Weisheit" },
            ].map((item) => (
              <View key={item.title} style={[s.offerCard, { backgroundColor: "#FFF0EB" }]}>
                <Text style={s.offerEmoji}>{item.emoji}</Text>
                <Text style={s.offerTitle}>{item.title}</Text>
                <Text style={s.offerSub}>{item.sub}</Text>
              </View>
            ))}
          </View>

          {/* Handwerk-Bild */}
          <View style={s.craftCard}>
            <Image source={require("../../assets/images/lara-crafting.jpg")} style={s.craftImg} resizeMode="cover" />
            <View style={s.craftInfo}>
              <Text style={s.craftTitle}>Handgefertigt mit Liebe ✦</Text>
              <Text style={s.craftText}>
                Jedes Runen-Plättchen wird von mir persönlich graviert und mit Heilstein-Pulver aus schwarzem Turmalin befüllt – für deinen Schutz und deine Kraft.
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity style={s.igBtn} onPress={() => { tap(); Linking.openURL(INSTAGRAM_URL); }} activeOpacity={0.85}>
            <Text style={{ fontSize: 20 }}>📸</Text>
            <Text style={s.igBtnText}>@die.seelenplanerin</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.shopBtn} onPress={() => { tap(); router.push("/shop" as any); }} activeOpacity={0.85}>
            <Text style={{ fontSize: 20 }}>✨</Text>
            <Text style={s.shopBtnText}>Zum Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.bookBtn} onPress={() => { tap(); router.push("/buchen" as any); }} activeOpacity={0.85}>
            <Text style={{ fontSize: 20 }}>📅</Text>
            <Text style={s.bookBtnText}>Session buchen</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.journalBtn} onPress={() => { tap(); router.push("/journal" as any); }} activeOpacity={0.85}>
            <Text style={{ fontSize: 20 }}>📖</Text>
            <Text style={s.journalBtnText}>Mein Seelenjournal</Text>
          </TouchableOpacity>

          {/* Versteckter Admin-Zugang */}
          <View style={s.adminRow}>
            <TouchableOpacity onPress={() => { tap(); router.push("/admin" as any); }}>
              <Text style={s.adminLink}>✦</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
