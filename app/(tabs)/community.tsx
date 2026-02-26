import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
  TextInput, KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
};

const POSTS = [
  {
    id: "1", emoji: "🌙", titel: "Willkommen in unserem Seelenraum",
    text: "Ich bin so froh, dass du hier bist. Dieser Raum gehört uns – ein sicherer Ort für alle Frauen, die ihren spirituellen Weg gehen. Hier teilen wir Erfahrungen, unterstützen uns gegenseitig und wachsen gemeinsam.",
    datum: "Heute", von: "Die Seelenplanerin", istLara: true,
  },
  {
    id: "2", emoji: "✨", titel: "Nächster Community-Call",
    text: "Unser monatlicher Community-Call findet bald statt! Ich freue mich so sehr auf euch. Wir sprechen über die aktuelle Mondenergie, eure Fragen und ich führe euch durch eine kurze Meditation. Alle Seelenimpuls-Mitglieder sind dabei.",
    datum: "Gestern", von: "Die Seelenplanerin", istLara: true,
  },
  {
    id: "3", emoji: "🌸", titel: "Meine Erfahrung mit dem Neumond-Ritual",
    text: "Ich habe gestern das Neumond-Ritual gemacht und es war so kraftvoll. Ich habe drei Intentionen gesetzt und konnte wirklich spüren wie die Energie sich verändert hat. Danke für diese wunderschöne Anleitung!",
    datum: "Vor 2 Tagen", von: "Sarah M.", istLara: false,
  },
  {
    id: "4", emoji: "💎", titel: "Frage zu Heilsteinen",
    text: "Welchen Heilstein empfehlt ihr für mehr Schutz im Alltag? Ich trage gerade Rosenquarz aber spüre dass ich etwas Stärkeres brauche.",
    datum: "Vor 3 Tagen", von: "Julia K.", istLara: false,
  },
];

const ANGEBOTE = [
  { emoji: "☕", titel: "Soul Talk", preis: "Kostenlos", beschreibung: "30 Min. kostenloses Kennenlerngespräch", url: "https://calendly.com/hallo-seelenplanerin/30min" },
  { emoji: "🔮", titel: "Aura Reading", preis: "77 €", beschreibung: "Tiefes Aura-Reading mit persönlicher Botschaft", url: "https://dieseelenplanerin.tentary.com/p/TuOzYS" },
  { emoji: "💫", titel: "Deep Talk", preis: "111 €", beschreibung: "Intensives 60-Min. Seelengespräch", url: "https://dieseelenplanerin.tentary.com/p/Ciz1am" },
];

// Speichert registrierte Benutzer als JSON-Array in AsyncStorage
const USERS_KEY = "community_users";
const CURRENT_USER_KEY = "community_current_user";

interface CommunityUser {
  email: string;
  password: string;
  name: string;
}

async function getUsers(): Promise<CommunityUser[]> {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveUsers(users: CommunityUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export default function CommunityScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [fehler, setFehler] = useState("");
  const [checking, setChecking] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    AsyncStorage.getItem(CURRENT_USER_KEY).then((data) => {
      if (data) {
        const user = JSON.parse(data) as CommunityUser;
        setIsLoggedIn(true);
        setUserName(user.name || user.email.split("@")[0]);
      }
      setChecking(false);
    });
  }, []);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLogin = async () => {
    if (!email.trim()) { setFehler("Bitte gib deine E-Mail-Adresse ein."); return; }
    if (!validateEmail(email.trim())) { setFehler("Bitte gib eine gültige E-Mail-Adresse ein."); return; }
    if (!password.trim()) { setFehler("Bitte gib dein Passwort ein."); return; }

    const users = await getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      setFehler("Kein Konto mit dieser E-Mail gefunden. Bitte registriere dich zuerst.");
      return;
    }
    if (found.password !== password) {
      setFehler("Falsches Passwort. Bitte versuche es erneut.");
      return;
    }
    setIsLoggedIn(true);
    setUserName(found.name || found.email.split("@")[0]);
    setFehler("");
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
  };

  const handleRegister = async () => {
    if (!name.trim()) { setFehler("Bitte gib deinen Namen ein."); return; }
    if (!email.trim()) { setFehler("Bitte gib deine E-Mail-Adresse ein."); return; }
    if (!validateEmail(email.trim())) { setFehler("Bitte gib eine gültige E-Mail-Adresse ein."); return; }
    if (!password.trim()) { setFehler("Bitte wähle ein Passwort."); return; }
    if (password.length < 4) { setFehler("Das Passwort muss mindestens 4 Zeichen haben."); return; }
    if (password !== passwordConfirm) { setFehler("Die Passwörter stimmen nicht überein."); return; }

    const users = await getUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      setFehler("Diese E-Mail ist bereits registriert. Bitte logge dich ein.");
      return;
    }

    const newUser: CommunityUser = { email: email.trim().toLowerCase(), password, name: name.trim() };
    users.push(newUser);
    await saveUsers(users);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setIsLoggedIn(true);
    setUserName(newUser.name);
    setFehler("");
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setName("");
    setUserName("");
    setMode("login");
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
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
              {mode === "login"
                ? "Melde dich an, um in deinen Seelenraum zu gelangen."
                : "Erstelle dein Konto und werde Teil unserer Community."}
            </Text>

            {/* Tab-Umschalter Login / Registrieren */}
            <View style={s.tabRow}>
              <TouchableOpacity
                style={[s.tab, mode === "login" && s.tabActive]}
                onPress={() => { setMode("login"); setFehler(""); }}
                activeOpacity={0.8}
              >
                <Text style={[s.tabText, mode === "login" && s.tabTextActive]}>Anmelden</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.tab, mode === "register" && s.tabActive]}
                onPress={() => { setMode("register"); setFehler(""); }}
                activeOpacity={0.8}
              >
                <Text style={[s.tabText, mode === "register" && s.tabTextActive]}>Registrieren</Text>
              </TouchableOpacity>
            </View>

            <View style={s.loginCard}>
              {mode === "register" && (
                <>
                  <Text style={s.loginLabel}>Dein Name</Text>
                  <TextInput
                    style={s.loginInput}
                    placeholder="z.B. Sarah"
                    placeholderTextColor={C.muted}
                    value={name}
                    onChangeText={(t) => { setName(t); setFehler(""); }}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </>
              )}

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

              <Text style={[s.loginLabel, { marginTop: 4 }]}>Passwort</Text>
              <TextInput
                style={s.loginInput}
                placeholder={mode === "register" ? "Wähle ein Passwort" : "Dein Passwort"}
                placeholderTextColor={C.muted}
                secureTextEntry
                value={password}
                onChangeText={(t) => { setPassword(t); setFehler(""); }}
                returnKeyType={mode === "register" ? "next" : "done"}
                onSubmitEditing={mode === "login" ? handleLogin : undefined}
                autoCapitalize="none"
                textContentType="password"
              />

              {mode === "register" && (
                <>
                  <Text style={[s.loginLabel, { marginTop: 4 }]}>Passwort bestätigen</Text>
                  <TextInput
                    style={s.loginInput}
                    placeholder="Passwort wiederholen"
                    placeholderTextColor={C.muted}
                    secureTextEntry
                    value={passwordConfirm}
                    onChangeText={(t) => { setPasswordConfirm(t); setFehler(""); }}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                    autoCapitalize="none"
                  />
                </>
              )}

              {fehler !== "" && <Text style={s.loginFehler}>{fehler}</Text>}

              <TouchableOpacity
                style={s.loginBtn}
                onPress={mode === "login" ? handleLogin : handleRegister}
                activeOpacity={0.85}
              >
                <Text style={s.loginBtnText}>
                  {mode === "login" ? "Anmelden →" : "Konto erstellen →"}
                </Text>
              </TouchableOpacity>

              {mode === "login" && (
                <TouchableOpacity
                  style={s.forgotBtn}
                  onPress={() => {
                    if (!email.trim() || !validateEmail(email.trim())) {
                      setFehler("Bitte gib zuerst deine E-Mail-Adresse ein.");
                      return;
                    }
                    Alert.alert(
                      "Passwort zur\u00fccksetzen",
                      `Dein Passwort f\u00fcr ${email.trim()} wird zur\u00fcckgesetzt. Du kannst dich danach mit dem neuen Passwort anmelden.`,
                      [
                        { text: "Abbrechen", style: "cancel" },
                        { text: "Zur\u00fccksetzen", style: "destructive", onPress: async () => {
                          try {
                            const users = await getUsers();
                            const userIdx = users.findIndex(u => u.email.toLowerCase() === email.trim().toLowerCase());
                            if (userIdx === -1) {
                              Alert.alert("Nicht gefunden", "Es gibt kein Konto mit dieser E-Mail-Adresse. Bitte registriere dich zuerst.");
                              return;
                            }
                            // Neues tempor\u00e4res Passwort generieren
                            const tempPw = Math.random().toString(36).slice(2, 8);
                            users[userIdx].password = tempPw;
                            await saveUsers(users);
                            setFehler("");
                            Alert.alert(
                              "Passwort zur\u00fcckgesetzt",
                              `Dein neues tempor\u00e4res Passwort lautet:\n\n${tempPw}\n\nBitte merke es dir und \u00e4ndere es nach dem Anmelden in deinem Profil.\n\nAbsender: Die Seelenplanerin App`,
                            );
                          } catch {
                            Alert.alert("Fehler", "Beim Zur\u00fccksetzen ist ein Fehler aufgetreten. Bitte versuche es erneut.");
                          }
                        }},
                      ]
                    );
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={s.forgotText}>Passwort vergessen?</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={s.seelenimpulsBtn}
              onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/E6FP1U")}
              activeOpacity={0.85}
            >
              <Text style={s.seelenimpulsBtnText}>👑 Seelenimpuls buchen – exklusive Community-Inhalte</Text>
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
                Willkommen, {userName}! Schön, dass du da bist.
              </Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={s.logoutBtn} activeOpacity={0.8}>
              <Text style={s.logoutText}>Abmelden</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium-Inhalte Banner */}
        <TouchableOpacity
          style={s.premiumBanner}
          onPress={() => router.push("/community-premium" as any)}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 22 }}>👑</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.premiumBannerTitle}>Premium Inhalte</Text>
            <Text style={s.premiumBannerSub}>Mondkalender · Meditationen · Mond & Zyklus</Text>
          </View>
          <Text style={{ fontSize: 18, color: C.gold }}>›</Text>
        </TouchableOpacity>

        <Text style={s.sec}>📅 Buche Zeit mit der Seelenplanerin</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}>
          {ANGEBOTE.map((a, i) => (
            <TouchableOpacity key={i} style={s.angebotCard} onPress={() => Linking.openURL(a.url)} activeOpacity={0.85}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>{a.emoji}</Text>
              <Text style={s.angebotTitel}>{a.titel}</Text>
              <Text style={s.angebotBeschreibung}>{a.beschreibung}</Text>
              <Text style={s.angebotPreis}>{a.preis}</Text>
              <View style={s.angebotBtn}><Text style={s.angebotBtnText}>Buchen →</Text></View>
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
                  {post.istLara && <View style={s.laraTag}><Text style={s.laraTagText}>Seelenplanerin</Text></View>}
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
  loginSub: { fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 21, marginBottom: 20, maxWidth: 300 },
  tabRow: { flexDirection: "row", marginBottom: 16, backgroundColor: C.surface, borderRadius: 12, padding: 3, width: "100%" },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: C.card, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  tabText: { fontSize: 14, color: C.muted, fontWeight: "600" },
  tabTextActive: { color: C.brown },
  loginCard: { width: "100%", backgroundColor: C.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 16 },
  loginLabel: { fontSize: 13, color: C.brownMid, marginBottom: 6, fontWeight: "600" },
  loginInput: { backgroundColor: C.surface, borderRadius: 12, padding: 14, fontSize: 15, color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 8 },
  loginFehler: { fontSize: 13, color: "#C87C82", marginBottom: 10, textAlign: "center" },
  loginBtn: { backgroundColor: C.rose, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  forgotBtn: { alignItems: "center", marginTop: 12 },
  forgotText: { fontSize: 13, color: C.rose, fontWeight: "600" },
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
  premiumBanner: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center",
    gap: 12, borderWidth: 1, borderColor: "#E8D5B0",
  },
  premiumBannerTitle: { fontSize: 15, fontWeight: "700", color: C.brown },
  premiumBannerSub: { fontSize: 12, color: C.muted },
});
