import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
  TextInput, KeyboardAvoidingView, Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import AsyncStorage from "@react-native-async-storage/async-storage";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
};

const DEFAULT_COMMUNITY_PASSWORD = "seele2026";

const POSTS = [
  {
    id: "1", emoji: "🌙", titel: "Willkommen in unserem Seelenraum",
    text: "Ich bin so froh, dass du hier bist. Dieser Raum gehört uns – ein sicherer Ort für alle Frauen, die ihren spirituellen Weg gehen. Hier teilen wir Erfahrungen, unterstützen uns gegenseitig und wachsen gemeinsam.",
    datum: "Heute", von: "Lara", istLara: true,
  },
  {
    id: "2", emoji: "✨", titel: "Nächster Community-Call",
    text: "Unser monatlicher Community-Call findet bald statt! Ich freue mich so sehr auf euch. Wir sprechen über die aktuelle Mondenergie, eure Fragen und ich führe euch durch eine kurze Meditation. Alle Seelenimpuls-Mitglieder sind dabei.",
    datum: "Gestern", von: "Lara", istLara: true,
  },
  {
    id: "3", emoji: "🌸", titel: "Meine Erfahrung mit dem Neumond-Ritual",
    text: "Ich habe gestern das Neumond-Ritual gemacht und es war so kraftvoll. Ich habe drei Intentionen gesetzt und konnte wirklich spüren wie die Energie sich verändert hat. Danke Lara für diese wunderschöne Anleitung!",
    datum: "Vor 2 Tagen", von: "Sarah M.", istLara: false,
  },
  {
    id: "4", emoji: "💎", titel: "Frage zu Heilsteinen",
    text: "Welchen Heilstein empfehlt ihr für mehr Schutz im Alltag? Ich trage gerade Rosenquarz aber spüre dass ich etwas Stärkeres brauche.",
    datum: "Vor 3 Tagen", von: "Julia K.", istLara: false,
  },
];

const ANGEBOTE = [
  { emoji: "☕", titel: "Soul Talk", preis: "Kostenlos", beschreibung: "30 Min. kostenloses Kennenlerngespräch mit Lara", url: "https://calendly.com/hallo-seelenplanerin/30min" },
  { emoji: "🔮", titel: "Aura Reading", preis: "77 €", beschreibung: "Tiefes Aura-Reading mit persönlicher Botschaft", url: "https://dieseelenplanerin.tentary.com/p/TuOzYS" },
  { emoji: "💫", titel: "Deep Talk", preis: "111 €", beschreibung: "Intensives 60-Min. Seelengespräch mit Lara", url: "https://dieseelenplanerin.tentary.com/p/Ciz1am" },
];

export default function CommunityScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fehler, setFehler] = useState("");
  const [checking, setChecking] = useState(true);
  const [adminPw, setAdminPw] = useState(DEFAULT_COMMUNITY_PASSWORD);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem("community_auth"),
      AsyncStorage.getItem("admin_community_pw"),
      AsyncStorage.getItem("community_user_email"),
    ]).then(([auth, pw, storedEmail]) => {
      if (auth === "true") {
        setIsLoggedIn(true);
        if (storedEmail) setUserName(storedEmail.split("@")[0]);
      }
      if (pw) setAdminPw(pw);
      setChecking(false);
    });
  }, []);

  const validateEmail = (e: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };

  const handleLogin = () => {
    if (!email.trim()) {
      setFehler("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }
    if (!validateEmail(email.trim())) {
      setFehler("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    if (!password.trim()) {
      setFehler("Bitte gib dein Passwort ein.");
      return;
    }
    if (password === adminPw) {
      setIsLoggedIn(true);
      setFehler("");
      setUserName(email.split("@")[0]);
      AsyncStorage.setItem("community_auth", "true");
      AsyncStorage.setItem("community_user_email", email.trim());
    } else {
      setFehler("Falsches Passwort. Bitte versuche es erneut.");
    }
  };

  if (checking) {
    return <ScreenContainer><View style={{ flex: 1, backgroundColor: C.bg }} /></ScreenContainer>;
  }

  if (!isLoggedIn) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: C.bg }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={s.loginContainer} keyboardShouldPersistTaps="handled">
            <Text style={s.loginEmoji}>🌸</Text>
            <Text style={s.loginTitel}>Community</Text>
            <Text style={s.loginSub}>
              Dieser Bereich ist nur für Seelenimpuls-Mitglieder zugänglich.{"\n"}
              Deine Zugangsdaten erhältst du nach deiner Buchung.
            </Text>

            <View style={s.loginCard}>
              <Text style={s.loginLabel}>E-Mail-Adresse</Text>
              <TextInput
                style={s.loginInput}
                placeholder="deine@email.de"
                placeholderTextColor={C.muted}
                value={email}
                onChangeText={(t) => { setEmail(t); setFehler(""); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                textContentType="emailAddress"
              />

              <Text style={[s.loginLabel, { marginTop: 8 }]}>Passwort</Text>
              <TextInput
                style={s.loginInput}
                placeholder="Dein Community-Passwort"
                placeholderTextColor={C.muted}
                secureTextEntry
                value={password}
                onChangeText={(t) => { setPassword(t); setFehler(""); }}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                autoCapitalize="none"
                textContentType="password"
              />

              {fehler !== "" && <Text style={s.loginFehler}>{fehler}</Text>}

              <TouchableOpacity style={s.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
                <Text style={s.loginBtnText}>Einloggen →</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={s.seelenimpulsBtn}
              onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/E6FP1U")}
              activeOpacity={0.85}
            >
              <Text style={s.seelenimpulsBtnText}>👑 Noch kein Mitglied? Jetzt Seelenimpuls buchen</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View>
              <Text style={s.headerTitle}>Community 🌸</Text>
              <Text style={s.headerSub}>
                Willkommen{userName ? `, ${userName}` : ""}! Dein sicherer Seelenraum.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setIsLoggedIn(false);
                setEmail("");
                setPassword("");
                setUserName("");
                AsyncStorage.removeItem("community_auth");
                AsyncStorage.removeItem("community_user_email");
              }}
              style={s.logoutBtn}
              activeOpacity={0.8}
            >
              <Text style={s.logoutText}>Abmelden</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={s.sec}>📅 Buche Zeit mit Lara</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}>
          {ANGEBOTE.map((a, i) => (
            <TouchableOpacity
              key={i}
              style={s.angebotCard}
              onPress={() => Linking.openURL(a.url)}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 32, marginBottom: 8 }}>{a.emoji}</Text>
              <Text style={s.angebotTitel}>{a.titel}</Text>
              <Text style={s.angebotBeschreibung}>{a.beschreibung}</Text>
              <Text style={s.angebotPreis}>{a.preis}</Text>
              <View style={s.angebotBtn}>
                <Text style={s.angebotBtnText}>Buchen →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={s.sec}>💬 Community-Beiträge</Text>
        {POSTS.map(post => (
          <View key={post.id} style={[s.postCard, post.istLara && s.postCardLara]}>
            <View style={s.postHeader}>
              <View style={[s.postAvatar, post.istLara && s.postAvatarLara]}>
                <Text style={{ fontSize: 18 }}>{post.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={s.postVon}>{post.von}</Text>
                  {post.istLara && (
                    <View style={s.laraTag}>
                      <Text style={s.laraTagText}>Lara</Text>
                    </View>
                  )}
                </View>
                <Text style={s.postDatum}>{post.datum}</Text>
              </View>
            </View>
            <Text style={s.postTitel}>{post.titel}</Text>
            <Text style={s.postText}>{post.text}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={s.instagramCard}
          onPress={() => Linking.openURL("https://www.instagram.com/die.seelenplanerin")}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 28 }}>📸</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.instagramTitel}>Folge mir auf Instagram</Text>
            <Text style={s.instagramHandle}>@die.seelenplanerin</Text>
          </View>
          <Text style={{ fontSize: 20, color: C.muted }}>›</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  loginContainer: { flexGrow: 1, backgroundColor: C.bg, padding: 24, justifyContent: "center", alignItems: "center", minHeight: 600 },
  loginEmoji: { fontSize: 60, marginBottom: 16 },
  loginTitel: { fontSize: 28, fontWeight: "700", color: C.brown, marginBottom: 8 },
  loginSub: { fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 21, marginBottom: 32, maxWidth: 300 },
  loginCard: { width: "100%", backgroundColor: C.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 16 },
  loginLabel: { fontSize: 13, color: C.brownMid, marginBottom: 6, fontWeight: "600" },
  loginInput: { backgroundColor: C.surface, borderRadius: 12, padding: 14, fontSize: 15, color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 8 },
  loginFehler: { fontSize: 13, color: "#C87C82", marginBottom: 10, textAlign: "center" },
  loginBtn: { backgroundColor: C.rose, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  loginBtnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  seelenimpulsBtn: { backgroundColor: C.goldLight, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, borderWidth: 1, borderColor: "#E8D5B0", width: "100%" },
  seelenimpulsBtnText: { fontSize: 14, color: C.brown, fontWeight: "700", textAlign: "center" },
  header: { backgroundColor: C.roseLight, padding: 20, paddingTop: 24 },
  headerTitle: { fontSize: 26, fontWeight: "700", color: C.brown },
  headerSub: { fontSize: 14, color: C.muted, marginTop: 4 },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border },
  logoutText: { fontSize: 12, color: C.muted },
  sec: { fontSize: 17, fontWeight: "700", color: C.brown, marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  angebotCard: { width: 180, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, alignItems: "center" },
  angebotTitel: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 4, textAlign: "center" },
  angebotBeschreibung: { fontSize: 11, color: C.muted, textAlign: "center", lineHeight: 16, marginBottom: 8 },
  angebotPreis: { fontSize: 16, fontWeight: "700", color: C.rose, marginBottom: 10 },
  angebotBtn: { backgroundColor: C.rose, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  angebotBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  postCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  postCardLara: { backgroundColor: C.roseLight, borderColor: C.rose },
  postHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.goldLight, alignItems: "center", justifyContent: "center" },
  postAvatarLara: { backgroundColor: C.rose },
  postVon: { fontSize: 14, fontWeight: "700", color: C.brown },
  laraTag: { backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  laraTagText: { fontSize: 10, color: "#FFF", fontWeight: "700" },
  postDatum: { fontSize: 11, color: C.muted },
  postTitel: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 6 },
  postText: { fontSize: 13, color: C.brownMid, lineHeight: 20 },
  instagramCard: { marginHorizontal: 16, marginTop: 8, backgroundColor: C.card, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: C.border },
  instagramTitel: { fontSize: 14, fontWeight: "700", color: C.brown },
  instagramHandle: { fontSize: 13, color: C.rose },
});
