import { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Linking,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { requestNotificationPermissions, registerPushTokenWithServer } from "@/lib/notifications";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4897B", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
};

const ONBOARDING_KEY = "seelenplanerin_onboarding_done";

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(ONBOARDING_KEY);
    return val === "true";
  } catch {
    return false;
  }
}

export async function setOnboardingDone(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch {}
}

export default function OnboardingScreen() {
  const [dsgvoAccepted, setDsgvoAccepted] = useState(false);
  const [pushAccepted, setPushAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!dsgvoAccepted) return;
    setLoading(true);
    try {
      // Push-Benachrichtigungen anfragen wenn gewünscht
      if (pushAccepted && Platform.OS !== "web") {
        const granted = await requestNotificationPermissions();
        if (granted) {
          // Token beim Server registrieren
          await registerPushTokenWithServer();
        }
      }
      // Onboarding als abgeschlossen markieren
      await setOnboardingDone();
      // Zur App navigieren
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Onboarding error:", err);
      // Trotzdem weiter
      await setOnboardingDone();
      router.replace("/(tabs)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
      <ScrollView
        style={{ flex: 1, backgroundColor: C.bg }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
      >
        {/* Logo / Willkommen */}
        <View style={s.headerSection}>
          <Text style={s.emoji}>🌿</Text>
          <Text style={s.title}>Willkommen bei der{"\n"}Seelenplanerin</Text>
          <Text style={s.subtitle}>
            Schön, dass du hier bist. Bevor du loslegst, brauche ich kurz deine Zustimmung.
          </Text>
        </View>

        {/* DSGVO Zustimmung */}
        <View style={s.consentCard}>
          <TouchableOpacity
            style={s.checkboxRow}
            onPress={() => setDsgvoAccepted(!dsgvoAccepted)}
            activeOpacity={0.7}
          >
            <View style={[s.checkbox, dsgvoAccepted && s.checkboxChecked]}>
              {dsgvoAccepted && <Text style={s.checkmark}>✓</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.consentTitle}>Datenschutz (DSGVO) *</Text>
              <Text style={s.consentText}>
                Mit der Nutzung dieser App stimmst du der Verarbeitung deiner Daten gemäß der Datenschutz-Grundverordnung (DSGVO) zu. Deine Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://dieseelenplanerin.de/datenschutz")}
            activeOpacity={0.7}
          >
            <Text style={s.linkText}>Datenschutzerklärung lesen →</Text>
          </TouchableOpacity>
        </View>

        {/* Push-Benachrichtigungen */}
        <View style={s.consentCard}>
          <TouchableOpacity
            style={s.checkboxRow}
            onPress={() => setPushAccepted(!pushAccepted)}
            activeOpacity={0.7}
          >
            <View style={[s.checkbox, pushAccepted && s.checkboxChecked]}>
              {pushAccepted && <Text style={s.checkmark}>✓</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.consentTitle}>Benachrichtigungen 💌</Text>
              <Text style={s.consentText}>
                Erlaube der Seelenplanerin, dir Nachrichten und Impulse zu schicken. Du erhältst Vollmond- und Neumond-Erinnerungen, Tagesimpulse und persönliche Nachrichten von Lara.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Hinweis */}
        <Text style={s.hinweis}>
          * Die Datenschutz-Zustimmung ist erforderlich, um die App nutzen zu können. Die Benachrichtigungen sind optional, werden aber empfohlen.
        </Text>

        {/* Weiter-Button */}
        <TouchableOpacity
          style={[s.continueBtn, !dsgvoAccepted && s.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!dsgvoAccepted || loading}
          activeOpacity={0.85}
        >
          <Text style={s.continueBtnText}>
            {loading ? "Einen Moment..." : "Weiter zur App →"}
          </Text>
        </TouchableOpacity>

        <Text style={s.footer}>— Die Seelenplanerin —</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  headerSection: {
    alignItems: "center", marginBottom: 28,
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: {
    fontSize: 26, fontWeight: "700", color: C.brown, textAlign: "center",
    lineHeight: 34, fontFamily: Platform.OS !== "web" ? "DancingScript-Bold" : undefined,
  },
  subtitle: {
    fontSize: 15, color: C.muted, textAlign: "center", marginTop: 10, lineHeight: 22,
    paddingHorizontal: 16,
  },
  consentCard: {
    backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: C.border,
  },
  checkboxRow: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
  },
  checkbox: {
    width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: C.border,
    justifyContent: "center", alignItems: "center", marginTop: 2,
    backgroundColor: C.bg,
  },
  checkboxChecked: {
    backgroundColor: C.rose, borderColor: C.rose,
  },
  checkmark: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  consentTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 6,
  },
  consentText: {
    fontSize: 13, color: C.brownMid, lineHeight: 20,
  },
  linkText: {
    fontSize: 13, color: C.rose, fontWeight: "600", marginTop: 10, marginLeft: 38,
  },
  hinweis: {
    fontSize: 12, color: C.muted, textAlign: "center", marginTop: 4, marginBottom: 20,
    lineHeight: 18, paddingHorizontal: 8,
  },
  continueBtn: {
    backgroundColor: C.rose, borderRadius: 16, paddingVertical: 16, alignItems: "center",
    marginBottom: 16,
  },
  continueBtnDisabled: {
    opacity: 0.4,
  },
  continueBtnText: {
    color: "#FFF", fontSize: 17, fontWeight: "700",
  },
  footer: {
    fontSize: 13, color: C.muted, textAlign: "center", marginBottom: 16,
    fontStyle: "italic",
  },
});
