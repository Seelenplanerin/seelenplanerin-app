import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "@/constants/oauth";

function showAlert(title: string, msg: string) {
  if (Platform.OS === "web") { window.alert(`${title}\n${msg}`); }
  else { Alert.alert(title, msg); }
}

const C = {
  bg: "#FAF6F0",
  card: "#FFFFFF",
  rose: "#C4897B",
  roseLight: "#F9EDE8",
  sage: "#8FAF8E",
  sageLight: "#E8F0E8",
  brown: "#5C3317",
  brownMid: "#8B5E3C",
  muted: "#A08070",
  border: "#EDD9D0",
  gold: "#C9A96E",
};

export default function SeelenjournalLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      showAlert("Bitte ausfüllen", "E-Mail und Passwort sind erforderlich.");
      return;
    }
    setLoading(true);
    try {
      const API_BASE = getApiBaseUrl();
      const res = await fetch(`${API_BASE}/api/seelenjournal/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: password.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        await AsyncStorage.setItem("sj_token", data.token);
        await AsyncStorage.setItem("sj_client", JSON.stringify(data.client));
        router.replace("/seelenjournal" as any);
      } else {
        showAlert("Login fehlgeschlagen", data.error || "Bitte überprüfe deine Zugangsdaten.");
      }
    } catch (err) {
      showAlert("Fehler", "Verbindung zum Server fehlgeschlagen. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          style={{ backgroundColor: C.bg }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Zurück-Button */}
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.backBtnText}>← Zurück</Text>
          </TouchableOpacity>

          <View style={s.container}>
            {/* Header */}
            <View style={s.headerSection}>
              <Text style={s.headerEmoji}>✨</Text>
              <Text style={s.headerTitle}>Dein Seelenjournal</Text>
              <Text style={s.headerSub}>
                Dein persönlicher, geschützter Seelenraum.{"\n"}
                Melde dich mit deinen Zugangsdaten an.
              </Text>
            </View>

            {/* Login-Formular */}
            <View style={s.formCard}>
              <Text style={s.label}>E-Mail-Adresse</Text>
              <TextInput
                style={s.input}
                placeholder="deine@email.de"
                placeholderTextColor={C.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />

              <Text style={s.label}>Passwort</Text>
              <TextInput
                style={s.input}
                placeholder="Dein Passwort"
                placeholderTextColor={C.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                style={[s.loginBtn, loading && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={s.loginBtnText}>Anmelden 🌸</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Hinweis */}
            <View style={s.hintCard}>
              <Text style={s.hintText}>
                Du hast deine Zugangsdaten von der Seelenplanerin erhalten.{"\n"}
                Bei Fragen wende dich direkt an Lara.
              </Text>
            </View>

            {/* Admin-Zugang */}
            <TouchableOpacity
              style={s.adminLink}
              onPress={() => router.push("/seelenjournal-admin" as any)}
              activeOpacity={0.7}
            >
              <Text style={s.adminLinkText}>🔐 Admin-Zugang</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  backBtn: { position: "absolute", top: 16, left: 16, zIndex: 10, padding: 8 },
  backBtnText: { fontSize: 16, color: C.rose, fontWeight: "600" },
  container: { paddingHorizontal: 24, paddingBottom: 40 },
  headerSection: { alignItems: "center", marginBottom: 32 },
  headerEmoji: { fontSize: 48, marginBottom: 12 },
  headerTitle: {
    fontSize: 28, fontWeight: "700", color: C.brown,
    textAlign: "center", marginBottom: 8,
  },
  headerSub: {
    fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 22,
  },
  formCard: {
    backgroundColor: C.card, borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: C.border, marginBottom: 20,
  },
  label: { fontSize: 13, fontWeight: "600", color: C.brownMid, marginBottom: 6 },
  input: {
    backgroundColor: C.bg, borderRadius: 12, padding: 14, fontSize: 15,
    color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 16,
  },
  loginBtn: {
    backgroundColor: C.rose, borderRadius: 14, padding: 16,
    alignItems: "center", marginTop: 4,
  },
  loginBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  hintCard: {
    backgroundColor: C.roseLight, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: C.border,
  },
  hintText: { fontSize: 13, color: C.brownMid, textAlign: "center", lineHeight: 20 },
  adminLink: {
    marginTop: 24, alignItems: "center", padding: 14,
    borderRadius: 14, borderWidth: 1, borderColor: C.gold,
    backgroundColor: "rgba(201,169,110,0.08)",
  },
  adminLinkText: { fontSize: 14, fontWeight: "600", color: C.gold },
});
