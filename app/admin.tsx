import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Switch, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpc } from "@/lib/trpc";

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

const USERS_KEY = "community_users";

interface CommunityUser {
  email: string;
  password: string;
  name: string;
  mustChangePassword?: boolean;
}

async function getUsers(): Promise<CommunityUser[]> {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveUsers(users: CommunityUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateTempPassword(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let pw = "";
  for (let i = 0; i < 6; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}

export default function AdminScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pin, setPin] = useState("");
  const [fehler, setFehler] = useState("");

  // Einstellungen
  const [tagesimpulsText, setTagesimpulsText] = useState("");
  const [musikAktiv, setMusikAktiv] = useState(false);
  const [gewaehltesThema, setGewaehltesThema] = useState("rose");
  const [gespeichert, setGespeichert] = useState(false);

  // Mitgliederverwaltung
  const [members, setMembers] = useState<CommunityUser[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPw, setNewMemberPw] = useState("");
  const [memberFehler, setMemberFehler] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // tRPC mutations
  const sendWelcomeMutation = trpc.email.sendWelcome.useMutation();
  const sendResetMutation = trpc.email.sendPasswordReset.useMutation();

  useEffect(() => {
    AsyncStorage.getItem("admin_auth").then(val => {
      if (val === "true") setIsLoggedIn(true);
    });
    AsyncStorage.getItem("admin_tagesimpuls").then(val => { if (val) setTagesimpulsText(val); });
    AsyncStorage.getItem("admin_musik").then(val => { if (val) setMusikAktiv(val === "true"); });
    AsyncStorage.getItem("admin_thema").then(val => { if (val) setGewaehltesThema(val); });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getUsers().then(setMembers);
    }
  }, [isLoggedIn]);

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

  const handleAddMember = async () => {
    if (!newMemberName.trim()) { setMemberFehler("Bitte gib einen Namen ein."); return; }
    if (!newMemberEmail.trim()) { setMemberFehler("Bitte gib eine E-Mail-Adresse ein."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMemberEmail.trim())) {
      setMemberFehler("Bitte gib eine gültige E-Mail-Adresse ein."); return;
    }

    const users = await getUsers();
    const exists = users.find(u => u.email.toLowerCase() === newMemberEmail.trim().toLowerCase());
    if (exists) {
      setMemberFehler("Diese E-Mail ist bereits registriert.");
      return;
    }

    const tempPw = newMemberPw.trim() || generateTempPassword();
    const newUser: CommunityUser = {
      email: newMemberEmail.trim().toLowerCase(),
      password: tempPw,
      name: newMemberName.trim(),
      mustChangePassword: true,
    };

    users.push(newUser);
    await saveUsers(users);
    setMembers(users);
    setMemberFehler("");

    // Automatisch E-Mail senden
    setSendingEmail(true);
    try {
      const result = await sendWelcomeMutation.mutateAsync({
        toEmail: newUser.email,
        toName: newUser.name,
        tempPassword: tempPw,
      });

      if (result.success) {
        Alert.alert(
          "Mitglied angelegt ✨",
          `${newUser.name} wurde erfolgreich angelegt.\n\n` +
          `📧 Willkommens-E-Mail wurde automatisch an ${newUser.email} gesendet!\n\n` +
          `Das Mitglied erhält die Login-Daten per E-Mail und wird beim ersten Login aufgefordert, ein eigenes Passwort zu wählen.`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Mitglied angelegt – E-Mail fehlgeschlagen",
          `${newUser.name} wurde angelegt, aber die E-Mail konnte nicht gesendet werden.\n\n` +
          `Fehler: ${result.error}\n\n` +
          `Temporäres Passwort: ${tempPw}\n\n` +
          `Bitte sende die Zugangsdaten manuell per E-Mail.`,
          [{ text: "OK" }]
        );
      }
    } catch (err: any) {
      Alert.alert(
        "Mitglied angelegt – E-Mail fehlgeschlagen",
        `${newUser.name} wurde angelegt, aber die E-Mail konnte nicht gesendet werden.\n\n` +
        `Temporäres Passwort: ${tempPw}\n\n` +
        `Bitte sende die Zugangsdaten manuell per E-Mail.`,
        [{ text: "OK" }]
      );
    } finally {
      setSendingEmail(false);
    }

    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberPw("");
    setShowAddMember(false);
  };

  const handleDeleteMember = (email: string, name: string) => {
    Alert.alert(
      "Mitglied entfernen",
      `Möchtest du ${name} (${email}) wirklich aus der Community entfernen?`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Entfernen", style: "destructive", onPress: async () => {
            const users = await getUsers();
            const filtered = users.filter(u => u.email !== email);
            await saveUsers(filtered);
            setMembers(filtered);
          }
        },
      ]
    );
  };

  const handleResetMemberPw = (email: string, name: string) => {
    const tempPw = generateTempPassword();
    Alert.alert(
      "Passwort zurücksetzen",
      `Neues temporäres Passwort für ${name} generieren und per E-Mail senden?`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Zurücksetzen & E-Mail senden", onPress: async () => {
            // Passwort in der lokalen Datenbank aktualisieren
            const users = await getUsers();
            const idx = users.findIndex(u => u.email === email);
            if (idx >= 0) {
              users[idx].password = tempPw;
              users[idx].mustChangePassword = true;
              await saveUsers(users);
              setMembers([...users]);
            }

            // E-Mail senden
            try {
              const result = await sendResetMutation.mutateAsync({
                toEmail: email,
                toName: name,
                tempPassword: tempPw,
              });

              if (result.success) {
                Alert.alert(
                  "Passwort zurückgesetzt ✨",
                  `Das neue temporäre Passwort wurde per E-Mail an ${name} (${email}) gesendet.\n\n` +
                  `${name} wird beim nächsten Login aufgefordert, ein eigenes Passwort zu wählen.`,
                  [{ text: "OK" }]
                );
              } else {
                Alert.alert(
                  "Passwort zurückgesetzt – E-Mail fehlgeschlagen",
                  `Das Passwort wurde zurückgesetzt, aber die E-Mail konnte nicht gesendet werden.\n\n` +
                  `Fehler: ${result.error}\n\n` +
                  `Temporäres Passwort: ${tempPw}\n\n` +
                  `Bitte sende es manuell an ${email}.`,
                  [{ text: "OK" }]
                );
              }
            } catch (err: any) {
              Alert.alert(
                "Passwort zurückgesetzt – E-Mail fehlgeschlagen",
                `Das Passwort wurde zurückgesetzt, aber die E-Mail konnte nicht gesendet werden.\n\n` +
                `Temporäres Passwort: ${tempPw}\n\n` +
                `Bitte sende es manuell an ${email}.`,
                [{ text: "OK" }]
              );
            }
          }
        },
      ]
    );
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

        {/* ── Mitgliederverwaltung ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>👥 Mitgliederverwaltung</Text>
          <Text style={s.sectionHint}>
            Lege hier neue Community-Mitglieder an. Die Login-Daten werden automatisch per E-Mail an das neue Mitglied gesendet.
            Beim ersten Login wird das Mitglied aufgefordert, ein eigenes Passwort zu wählen.
          </Text>

          {/* Mitgliederliste */}
          {members.length > 0 ? (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: C.brownMid, fontWeight: "600", marginBottom: 8 }}>
                {members.length} Mitglied{members.length !== 1 ? "er" : ""}
              </Text>
              {members.map((m) => (
                <View key={m.email} style={s.memberRow}>
                  <View style={s.memberAvatar}>
                    <Text style={{ fontSize: 14, color: "#FFF", fontWeight: "700" }}>
                      {m.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.memberName}>{m.name}</Text>
                    <Text style={s.memberEmail}>{m.email}</Text>
                    {m.mustChangePassword && (
                      <Text style={{ fontSize: 10, color: C.gold, fontWeight: "600" }}>⏳ Muss Passwort ändern</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleResetMemberPw(m.email, m.name)}
                    style={s.memberAction}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 12, color: C.gold }}>🔑</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteMember(m.email, m.name)}
                    style={s.memberAction}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 12, color: "#C87C82" }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>
              Noch keine Mitglieder angelegt. Nutzer können sich auch selbst registrieren.
            </Text>
          )}

          {/* Neues Mitglied hinzufügen */}
          <TouchableOpacity
            style={[s.themaBtn, { borderColor: C.rose }]}
            onPress={() => setShowAddMember(!showAddMember)}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 18, marginRight: 10 }}>{showAddMember ? "✕" : "➕"}</Text>
            <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
              {showAddMember ? "Schließen" : "Neues Mitglied anlegen"}
            </Text>
          </TouchableOpacity>

          {showAddMember && (
            <View style={{ marginTop: 12, backgroundColor: C.roseLight, borderRadius: 14, padding: 14 }}>
              <Text style={s.memberFormLabel}>Name</Text>
              <TextInput
                style={s.memberFormInput}
                placeholder="z.B. Sarah Müller"
                placeholderTextColor={C.muted}
                value={newMemberName}
                onChangeText={(t) => { setNewMemberName(t); setMemberFehler(""); }}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <Text style={s.memberFormLabel}>E-Mail-Adresse</Text>
              <TextInput
                style={s.memberFormInput}
                placeholder="sarah@beispiel.de"
                placeholderTextColor={C.muted}
                value={newMemberEmail}
                onChangeText={(t) => { setNewMemberEmail(t); setMemberFehler(""); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />

              <Text style={s.memberFormLabel}>Temporäres Passwort (optional)</Text>
              <TextInput
                style={s.memberFormInput}
                placeholder="Leer = automatisch generiert"
                placeholderTextColor={C.muted}
                value={newMemberPw}
                onChangeText={(t) => { setNewMemberPw(t); setMemberFehler(""); }}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleAddMember}
              />

              {memberFehler !== "" && <Text style={{ fontSize: 12, color: "#C87C82", marginBottom: 8 }}>{memberFehler}</Text>}

              <TouchableOpacity
                style={[s.addMemberBtn, sendingEmail && { opacity: 0.6 }]}
                onPress={handleAddMember}
                activeOpacity={0.85}
                disabled={sendingEmail}
              >
                {sendingEmail ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <ActivityIndicator size="small" color="#FFF" />
                    <Text style={s.addMemberBtnText}>E-Mail wird gesendet...</Text>
                  </View>
                ) : (
                  <Text style={s.addMemberBtnText}>📧 Mitglied anlegen & E-Mail senden →</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
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

  // Mitgliederverwaltung
  memberRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: C.surface,
    borderRadius: 12, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: C.border,
  },
  memberAvatar: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: C.rose,
    alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  memberName: { fontSize: 14, fontWeight: "700", color: C.brown },
  memberEmail: { fontSize: 11, color: C.muted },
  memberAction: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: C.card,
    alignItems: "center", justifyContent: "center", marginLeft: 6,
    borderWidth: 1, borderColor: C.border,
  },
  memberFormLabel: { fontSize: 12, color: C.brownMid, fontWeight: "600", marginBottom: 4, marginTop: 4 },
  memberFormInput: {
    backgroundColor: C.card, borderRadius: 10, padding: 12, fontSize: 14,
    color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 6,
  },
  addMemberBtn: {
    backgroundColor: C.rose, borderRadius: 12, paddingVertical: 12,
    alignItems: "center", marginTop: 4,
  },
  addMemberBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
});
