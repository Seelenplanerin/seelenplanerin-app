import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Dimensions, Platform, ActivityIndicator, Linking,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import {
  getAccess, setAccess, getProgress, getDeviceId,
  getCurrentRaunaechteDay, getRaunaechteDate, isDayUnlocked,
  formatDateDE, getCurrentRaunaechteYear,
} from "@/lib/raunaechte-store";
import { getAllRaunaechteContent, type RaunaechteTag } from "@/lib/raunaechte-data";
import { getApiBaseUrl } from "@/constants/oauth";

const { width } = Dimensions.get("window");

// Helles Farbschema – passend zum Rest der App
const RN = {
  bg: "#FDF8F4",
  surface: "#FFF0EB",
  primary: "#C4826A",
  text: "#3D2B1F",
  muted: "#9C7B6E",
  border: "#EDD9D0",
  accent: "#B5675A",
  locked: "#E0D0C8",
  gold: "#C9A96E",
  rose: "#C4826A",
  blush: "#F2C4B8",
  white: "#FFFFFF",
};

const SHOP_URL = "https://dieseelenplanerin.de/rauhnaechte";

export default function RaunaechteScreen() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgressState] = useState<{ completedDays: number[] }>({ completedDays: [] });

  const year = getCurrentRaunaechteYear();
  const currentDay = getCurrentRaunaechteDay(year);
  const content = getAllRaunaechteContent(year);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const access = await getAccess();
    if (access && access.verified && access.year === year) {
      setHasAccess(true);
      const prog = await getProgress(year);
      setProgressState(prog);
    } else {
      setHasAccess(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");

    try {
      const deviceId = await getDeviceId();
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/trpc/raunaechte.validateCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { code: code.toUpperCase().trim(), deviceId } }),
      });
      const result = await response.json();
      const data = result?.result?.data?.json;

      if (data?.valid) {
        await setAccess({ code: code.toUpperCase().trim(), verified: true, year: data.year, activatedAt: new Date().toISOString() });
        setHasAccess(true);
        if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setError(data?.error || "Ungültiger Code. Bitte versuche es erneut.");
        if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (e) {
      setError("Verbindungsfehler. Bitte prüfe deine Internetverbindung.");
    } finally {
      setLoading(false);
    }
  };

  const handleDayPress = (day: number) => {
    if (!isDayUnlocked(day, currentDay)) return;
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: "/raunaechte-tag", params: { day: day.toString(), year: year.toString() } });
  };

  const openShop = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(SHOP_URL);
  };

  // Loading state
  if (hasAccess === null) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={RN.gold} />
      </View>
    );
  }

  // Lock Screen
  if (!hasAccess) {
    return (
      <View style={styles.container}>
        <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-transparent">
          <ScrollView contentContainerStyle={styles.lockContent}>
            {/* Header */}
            <View style={styles.lockHeader}>
              <Text style={styles.lockEmoji}>✨</Text>
              <Text style={styles.lockTitle}>Raunächte</Text>
              <Text style={styles.lockSubtitle}>Deine persönliche Begleitung</Text>
            </View>

            {/* Beschreibung */}
            <View style={styles.lockCard}>
              <Text style={styles.lockCardTitle}>28 Tage Seelenreise</Text>
              <Text style={styles.lockCardText}>
                Vom 10. Dezember bis zum 6. Januar begleite ich dich durch die magische Zeit
                der Raunächte und Portaltage. Jeden Tag erwartet dich:
              </Text>
              <View style={styles.lockFeatures}>
                {["🕯️ Tagesimpuls & Meditation", "🔮 Ritual & Klangwelt", "📝 Journal-Reflexion", "ᚠ Rune des Tages", "✨ Portaltag-Energie"].map((f, i) => (
                  <Text key={i} style={styles.lockFeature}>{f}</Text>
                ))}
              </View>
            </View>

            {/* Code-Eingabe */}
            <View style={styles.codeSection}>
              <Text style={styles.codeSectionTitle}>Zugangscode eingeben</Text>
              <TextInput
                style={styles.codeInput}
                value={code}
                onChangeText={setCode}
                placeholder="RN-XXXX-XXXX"
                placeholderTextColor={RN.locked}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleCodeSubmit}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <TouchableOpacity
                style={[styles.codeButton, loading && { opacity: 0.6 }]}
                onPress={handleCodeSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color={RN.white} size="small" />
                ) : (
                  <Text style={styles.codeButtonText}>Code einlösen</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Shop-Link */}
            <View style={styles.shopSection}>
              <Text style={styles.shopText}>
                Noch keinen Code? Sichere dir jetzt deine 28-Tage-Begleitung:
              </Text>
              <TouchableOpacity
                style={styles.shopButton}
                onPress={openShop}
                activeOpacity={0.8}
              >
                <Text style={styles.shopButtonText}>Jetzt dabei sein – 11,11 € →</Text>
              </TouchableOpacity>
              <Text style={styles.shopHint}>Einmalige Zahlung · Kein Abo · Zugang über die App</Text>
            </View>
          </ScrollView>
        </ScreenContainer>
      </View>
    );
  }

  // Hauptansicht (nach Freischaltung)
  const completedCount = progress.completedDays.length;
  const progressPercent = Math.round((completedCount / 28) * 100);

  return (
    <View style={styles.container}>
      <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-transparent">
        <ScrollView contentContainerStyle={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Raunächte {year}/{year + 1}</Text>
            <Text style={styles.headerSubtitle}>
              {currentDay === 0
                ? "Beginnt am 10. Dezember"
                : currentDay >= 29
                  ? "Alle Tage freigeschaltet"
                  : `Tag ${currentDay} von 28`}
            </Text>
          </View>

          {/* Fortschritts-Anzeige */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Dein Fortschritt</Text>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressDetail}>{completedCount} von 28 Tagen abgeschlossen</Text>
          </View>

          {/* Tage-Grid */}
          <View style={styles.gridContainer}>
            <Text style={styles.gridTitle}>Deine Tage</Text>
            <View style={styles.grid}>
              {content.map((tag) => {
                const unlocked = isDayUnlocked(tag.day, currentDay);
                const completed = progress.completedDays.includes(tag.day);
                const isToday = tag.day === currentDay;
                const date = getRaunaechteDate(year, tag.day);

                return (
                  <TouchableOpacity
                    key={tag.day}
                    style={[
                      styles.dayCell,
                      unlocked && styles.dayCellUnlocked,
                      completed && styles.dayCellCompleted,
                      isToday && styles.dayCellToday,
                      tag.isPortaltag && unlocked && styles.dayCellPortaltag,
                    ]}
                    onPress={() => handleDayPress(tag.day)}
                    disabled={!unlocked}
                    activeOpacity={0.7}
                  >
                    {!unlocked ? (
                      <IconSymbol name="lock.fill" size={14} color={RN.locked} />
                    ) : completed ? (
                      <IconSymbol name="checkmark" size={14} color={RN.gold} />
                    ) : (
                      <Text style={styles.dayNumber}>{tag.day}</Text>
                    )}
                    <Text style={[styles.dayDate, !unlocked && { color: RN.locked }]}>
                      {formatDateDE(date)}
                    </Text>
                    {tag.isPortaltag && unlocked && (
                      <View style={styles.portalBadge}>
                        <Text style={styles.portalBadgeText}>P</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Legende */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: RN.gold }]} />
              <Text style={styles.legendText}>Abgeschlossen</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: RN.rose }]} />
              <Text style={styles.legendText}>Portaltag</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: RN.locked }]} />
              <Text style={styles.legendText}>Gesperrt</Text>
            </View>
          </View>

          {/* Shop-Link unten */}
          <View style={styles.shopSectionBottom}>
            <TouchableOpacity
              style={styles.shopButtonBottom}
              onPress={openShop}
              activeOpacity={0.8}
            >
              <Text style={styles.shopButtonBottomText}>Zum Shop – dieseelenplanerin.de →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}

const CELL_SIZE = (width - 64) / 7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RN.bg,
  },
  // Lock Screen
  lockContent: {
    padding: 24,
    paddingBottom: 100,
  },
  lockHeader: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  lockEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  lockTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: RN.text,
    letterSpacing: 1,
  },
  lockSubtitle: {
    fontSize: 16,
    color: RN.muted,
    marginTop: 8,
  },
  lockCard: {
    backgroundColor: RN.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: RN.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lockCardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: RN.gold,
    marginBottom: 12,
  },
  lockCardText: {
    fontSize: 15,
    color: RN.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  lockFeatures: {
    gap: 8,
  },
  lockFeature: {
    fontSize: 14,
    color: RN.text,
    lineHeight: 22,
  },
  codeSection: {
    marginBottom: 24,
  },
  codeSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: RN.text,
    marginBottom: 12,
    textAlign: "center",
  },
  codeInput: {
    backgroundColor: RN.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: RN.text,
    textAlign: "center",
    letterSpacing: 2,
    borderWidth: 1,
    borderColor: RN.border,
    fontWeight: "600",
  },
  errorText: {
    color: "#C87C82",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  codeButton: {
    backgroundColor: RN.rose,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: "center",
  },
  codeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: RN.white,
  },
  // Shop Section (Lock Screen)
  shopSection: {
    alignItems: "center",
    marginTop: 8,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: RN.border,
  },
  shopText: {
    fontSize: 14,
    color: RN.muted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  shopButton: {
    backgroundColor: RN.gold,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: RN.white,
  },
  shopHint: {
    fontSize: 12,
    color: RN.muted,
    textAlign: "center",
    marginTop: 12,
  },
  // Main Content
  mainContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: RN.text,
  },
  headerSubtitle: {
    fontSize: 15,
    color: RN.muted,
    marginTop: 4,
  },
  // Progress
  progressCard: {
    backgroundColor: RN.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: RN.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: RN.muted,
    fontWeight: "500",
  },
  progressPercent: {
    fontSize: 16,
    color: RN.gold,
    fontWeight: "700",
  },
  progressBar: {
    height: 6,
    backgroundColor: RN.blush,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: RN.gold,
    borderRadius: 3,
  },
  progressDetail: {
    fontSize: 12,
    color: RN.muted,
    marginTop: 8,
  },
  // Grid
  gridContainer: {
    marginBottom: 24,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: RN.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayCell: {
    width: CELL_SIZE - 4,
    height: CELL_SIZE + 8,
    backgroundColor: RN.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: RN.border,
    position: "relative",
  },
  dayCellUnlocked: {
    borderColor: RN.muted,
  },
  dayCellCompleted: {
    borderColor: RN.gold,
    backgroundColor: "rgba(201, 169, 110, 0.08)",
  },
  dayCellToday: {
    borderColor: RN.gold,
    borderWidth: 2,
    backgroundColor: "rgba(201, 169, 110, 0.12)",
  },
  dayCellPortaltag: {
    borderColor: RN.rose,
    backgroundColor: "rgba(196, 130, 106, 0.08)",
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: RN.text,
  },
  dayDate: {
    fontSize: 9,
    color: RN.muted,
    marginTop: 2,
  },
  portalBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: RN.rose,
    borderRadius: 6,
    width: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  portalBadgeText: {
    fontSize: 7,
    fontWeight: "700",
    color: "#fff",
  },
  // Legend
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: RN.muted,
  },
  // Shop Section Bottom (Main Content)
  shopSectionBottom: {
    marginTop: 32,
    alignItems: "center",
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: RN.border,
  },
  shopButtonBottom: {
    backgroundColor: RN.gold,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  shopButtonBottomText: {
    fontSize: 15,
    fontWeight: "600",
    color: RN.white,
  },
});
