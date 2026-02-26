import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Switch, KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
};

const ADMIN_PIN = "1234";

const THEMEN = [
  { key: "rose", label: "Rose & Creme (Standard)", primary: "#C4826A", bg: "#FDF8F4" },
  { key: "lila", label: "Mondviolett", primary: "#7B5EA7", bg: "#F8F4FD" },
  { key: "gold", label: "Goldenes Licht", primary: "#C9A96E", bg: "#FDFAF4" },
  { key: "dunkel", label: "Dunkle Mondnacht", primary: "#C4826A", bg: "#1A1A2E" },
];

export default function AdminScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pin, setPin] = useState("");
  const [fehler, setFehler] = useState("");

  // Einstellungen
  const [communityPw, setCommunityPw] = useState("seele2026");
  const [tagesimpulsText, setTagesimpulsText] = useState("");
  const [musikAktiv, setMusikAktiv] = useState(false);
  const [gewaehltesThema, setGewaehltesThema] = useState("rose");
  const [gespeichert, setGespeichert] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("admin_auth").then(val => {
      if (val === "true") setIsLoggedIn(true);
    });
    AsyncStorage.getItem("admin_community_pw").then(val => { if (val) setCommunityPw(val); });
    AsyncStorage.getItem("admin_tagesimpuls").then(val => { if (val) setTagesimpulsText(val); });
    AsyncStorage.getItem("admin_musik").then(val => { if (val) setMusikAktiv(val === "true"); });
    AsyncStorage.getItem("admin_thema").then(val => { if (val) setGewaehltesThema(val); });
  }, []);

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setIsLoggedIn(true);
      setFehler("");
      AsyncStorage.setItem("admin_auth", "true");
    } else {
      setFehler("Falscher PIN.");
    }
  };

  const handleSpeichern = async () => {
    await AsyncStorage.setItem("admin_community_pw", communityPw);
    await AsyncStorage.setItem("admin_tagesimpuls", tagesimpulsText);
    await AsyncStorage.setItem("admin_musik", musikAktiv ? "true" : "false");
    await AsyncStorage.setItem("admin_thema", gewaehltesThema);
    setGespeichert(true);
    setTimeout(() => setGespeichert(false), 2000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    AsyncStorage.removeItem("admin_auth");
    router.back();
  };

  if (!isLoggedIn) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: C.bg }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={s.pinContainer}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
              <Text style={s.backBtnText}>← Zurück</Text>
            </TouchableOpacity>
            <Text style={s.pinEmoji}>🔐</Text>
            <Text style={s.pinTitel}>Admin-Bereich</Text>
            <Text style={s.pinSub}>Nur für die Seelenplanerin</Text>
            <TextInput
              style={s.pinInput}
              placeholder="PIN eingeben"
              placeholderTextColor={C.muted}
              secureTextEntry
              keyboardType="number-pad"
              value={pin}
              onChangeText={setPin}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              maxLength={4}
            />
            {fehler !== "" && <Text style={s.pinFehler}>{fehler}</Text>}
            <TouchableOpacity style={s.pinBtn} onPress={handleLogin} activeOpacity={0.85}>
              <Text style={s.pinBtnText}>Einloggen</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
            <Text style={[s.backBtnText, { color: C.rose }]}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>🔐 Admin-Bereich</Text>
          <Text style={s.headerSub}>Deine persönlichen Einstellungen</Text>
        </View>

        {/* Community-Passwort */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>🔑 Community-Passwort</Text>
          <Text style={s.sectionHint}>Das Passwort das Mitglieder eingeben müssen um die Community zu betreten.</Text>
          <TextInput
            style={s.input}
            value={communityPw}
            onChangeText={setCommunityPw}
            placeholder="Community-Passwort"
            placeholderTextColor={C.muted}
            autoCapitalize="none"
          />
        </View>

        {/* Tagesimpuls */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>✨ Tagesimpuls</Text>
          <Text style={s.sectionHint}>Dein persönlicher Impuls für heute. Leer lassen für automatischen Impuls.</Text>
          <TextInput
            style={[s.input, { height: 80, textAlignVertical: "top" }]}
            value={tagesimpulsText}
            onChangeText={setTagesimpulsText}
            placeholder="Dein heutiger Impuls für die Community..."
            placeholderTextColor={C.muted}
            multiline
          />
        </View>

        {/* Musik */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>🎵 Hintergrundmusik</Text>
          <Text style={s.sectionHint}>Sanfte Meditationsmusik in der App aktivieren.</Text>
          <View style={s.switchRow}>
            <Text style={s.switchLabel}>{musikAktiv ? "Musik aktiv" : "Musik deaktiviert"}</Text>
            <Switch
              value={musikAktiv}
              onValueChange={setMusikAktiv}
              trackColor={{ false: C.border, true: C.rose }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Farbthema */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>🎨 App-Farbthema</Text>
          <Text style={s.sectionHint}>Wähle das Farbschema für die gesamte App.</Text>
          {THEMEN.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[s.themaBtn, gewaehltesThema === t.key && s.themaBtnActive]}
              onPress={() => setGewaehltesThema(t.key)}
              activeOpacity={0.85}
            >
              <View style={[s.themaFarbe, { backgroundColor: t.primary }]} />
              <Text style={[s.themaLabel, gewaehltesThema === t.key && { color: C.brown, fontWeight: "700" }]}>
                {t.label}
              </Text>
              {gewaehltesThema === t.key && <Text style={{ color: C.gold, fontSize: 18 }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Musik verwalten */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>🎵 Musik verwalten</Text>
          <Text style={s.sectionHint}>Füge deine Spotify- und Apple Music-Songs hinzu. Nutzer finden sie unter "Meine Musik".</Text>
          <TouchableOpacity
            style={[s.themaBtn, { borderColor: C.rose }]}
            onPress={() => router.push("/musik" as any)}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 18, marginRight: 10 }}>🎵</Text>
            <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>Musik-Bereich öffnen</Text>
            <Text style={{ color: C.rose, fontSize: 16 }}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.themaBtn, { borderColor: C.gold }]}
            onPress={() => router.push("/meditation" as any)}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 18, marginRight: 10 }}>🧘‍♀️</Text>
            <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>Meditationen verwalten</Text>
            <Text style={{ color: C.gold, fontSize: 16 }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Admin-PIN ändern */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>🔒 Admin-PIN</Text>
          <Text style={s.sectionHint}>Aktueller PIN: {ADMIN_PIN}. Um den PIN zu ändern, wende dich an den App-Entwickler.</Text>
        </View>

        {/* Speichern */}
        <TouchableOpacity
          style={[s.speichernBtn, gespeichert && s.speichernBtnSuccess]}
          onPress={handleSpeichern}
          activeOpacity={0.85}
        >
          <Text style={s.speichernBtnText}>{gespeichert ? "✓ Gespeichert!" : "Einstellungen speichern"}</Text>
        </TouchableOpacity>

        {/* Abmelden */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={s.logoutText}>Admin-Bereich verlassen</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  pinContainer: { flex: 1, backgroundColor: C.bg, padding: 24, justifyContent: "center", alignItems: "center" },
  pinEmoji: { fontSize: 60, marginBottom: 16 },
  pinTitel: { fontSize: 26, fontWeight: "700", color: C.brown, marginBottom: 6 },
  pinSub: { fontSize: 14, color: C.muted, marginBottom: 32 },
  pinInput: { width: "100%", backgroundColor: C.card, borderRadius: 14, padding: 16, fontSize: 20, color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 12, textAlign: "center", letterSpacing: 8 },
  pinFehler: { fontSize: 13, color: "#C87C82", marginBottom: 10 },
  pinBtn: { backgroundColor: C.rose, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 40, marginTop: 8 },
  pinBtnText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  header: { backgroundColor: C.roseLight, padding: 20, paddingTop: 24 },
  backBtn: { marginBottom: 8 },
  backBtnText: { fontSize: 15, fontWeight: "600" },
  headerTitle: { fontSize: 24, fontWeight: "700", color: C.brown },
  headerSub: { fontSize: 13, color: C.muted, marginTop: 4 },
  section: { margin: 16, marginBottom: 0, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 6 },
  sectionHint: { fontSize: 12, color: C.muted, lineHeight: 18, marginBottom: 12 },
  input: { backgroundColor: C.surface, borderRadius: 12, padding: 14, fontSize: 14, color: C.brown, borderWidth: 1, borderColor: C.border },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  switchLabel: { fontSize: 14, color: C.brownMid },
  themaBtn: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  themaBtnActive: { borderColor: C.rose, backgroundColor: C.roseLight },
  themaFarbe: { width: 24, height: 24, borderRadius: 12, marginRight: 12 },
  themaLabel: { flex: 1, fontSize: 14, color: C.muted },
  speichernBtn: { margin: 16, backgroundColor: C.rose, borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  speichernBtnSuccess: { backgroundColor: "#5C8A5C" },
  speichernBtnText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  logoutBtn: { marginHorizontal: 16, marginBottom: 8, backgroundColor: C.surface, borderRadius: 14, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: C.border },
  logoutText: { fontSize: 14, color: C.muted },
});
