import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Dimensions, Platform, ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import {
  getProgress, completeDay, saveJournalEntry, getJournalEntry,
  getRaunaechteDate, formatDateDE,
} from "@/lib/raunaechte-store";
import { getRaunaechteDay, type RaunaechteTag } from "@/lib/raunaechte-data";

const { width } = Dimensions.get("window");

// Raunächte Farbschema
const RN = {
  bg: "#1A1425",
  surface: "#2A2035",
  primary: "#C9A96E",
  text: "#F5EDE8",
  muted: "#9B8A9E",
  border: "#3D2F4A",
  accent: "#7B5EA7",
  gold: "#C9A96E",
  rose: "#C4826A",
};

type Section = "impuls" | "meditation" | "ritual" | "journal" | "klang" | "rune" | "affirmation" | "portaltag";

export default function RaunaechteTagScreen() {
  const { day, year } = useLocalSearchParams<{ day: string; year: string }>();
  const dayNum = parseInt(day || "1");
  const yearNum = parseInt(year || "2026");

  const [content, setContent] = useState<RaunaechteTag | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("impuls");
  const [journalText, setJournalText] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [journalSaved, setJournalSaved] = useState(false);

  useEffect(() => {
    const data = getRaunaechteDay(yearNum, dayNum);
    setContent(data);
    loadProgress();
  }, [dayNum, yearNum]);

  const loadProgress = async () => {
    const progress = await getProgress(yearNum);
    setIsCompleted(progress.completedDays.includes(dayNum));
    const entry = await getJournalEntry(yearNum, dayNum);
    if (entry) setJournalText(entry);
  };

  const handleComplete = async () => {
    await completeDay(yearNum, dayNum);
    setIsCompleted(true);
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSaveJournal = async () => {
    await saveJournalEntry(yearNum, dayNum, journalText);
    setJournalSaved(true);
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setJournalSaved(false), 2000);
  };

  if (!content) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={RN.gold} />
      </View>
    );
  }

  const date = getRaunaechteDate(yearNum, dayNum);
  const sections: { key: Section; label: string; emoji: string }[] = [
    { key: "impuls", label: "Impuls", emoji: "🕯️" },
    { key: "meditation", label: "Meditation", emoji: "🧘" },
    { key: "ritual", label: "Ritual", emoji: "🔮" },
    { key: "journal", label: "Journal", emoji: "📝" },
    { key: "klang", label: "Klang", emoji: "🎵" },
    { key: "rune", label: "Rune", emoji: content.rune.symbol },
    { key: "affirmation", label: "Affirmation", emoji: "✨" },
    ...(content.isPortaltag ? [{ key: "portaltag" as Section, label: "Portaltag", emoji: "🌀" }] : []),
  ];

  return (
    <View style={styles.container}>
      <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-transparent">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header mit Zurück-Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <IconSymbol name="chevron.left" size={20} color={RN.text} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerEmoji}>{content.themeEmoji}</Text>
              <Text style={styles.headerTitle}>Tag {dayNum}</Text>
              <Text style={styles.headerDate}>{formatDateDE(date)}</Text>
              <Text style={styles.headerTheme}>{content.theme}</Text>
            </View>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={RN.gold} />
              </View>
            )}
          </View>

          {/* Section Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
            <View style={styles.tabs}>
              {sections.map((s) => (
                <TouchableOpacity
                  key={s.key}
                  style={[styles.tab, activeSection === s.key && styles.tabActive]}
                  onPress={() => {
                    setActiveSection(s.key);
                    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tabEmoji}>{s.emoji}</Text>
                  <Text style={[styles.tabLabel, activeSection === s.key && styles.tabLabelActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Content */}
          <View style={styles.contentCard}>
            {activeSection === "impuls" && (
              <View>
                <Text style={styles.contentTitle}>{content.impuls.title}</Text>
                <Text style={styles.contentText}>{content.impuls.text}</Text>
              </View>
            )}

            {activeSection === "meditation" && (
              <View>
                <Text style={styles.contentTitle}>{content.meditation.title}</Text>
                {content.meditation.audioUrl ? (
                  <View style={styles.audioPlaceholder}>
                    <Text style={styles.audioIcon}>🎧</Text>
                    <Text style={styles.audioText}>{content.meditation.duration} Minuten</Text>
                    <TouchableOpacity style={styles.playButton} activeOpacity={0.7}>
                      <Text style={styles.playButtonText}>▶ Abspielen</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.comingSoon}>
                    <Text style={styles.comingSoonText}>Meditation wird bald verfügbar sein</Text>
                  </View>
                )}
              </View>
            )}

            {activeSection === "ritual" && (
              <View>
                <Text style={styles.contentTitle}>{content.ritual.title}</Text>
                <Text style={styles.sectionLabel}>Materialien:</Text>
                <View style={styles.materialsList}>
                  {content.ritual.materials.map((m, i) => (
                    <View key={i} style={styles.materialItem}>
                      <Text style={styles.materialDot}>•</Text>
                      <Text style={styles.materialText}>{m}</Text>
                    </View>
                  ))}
                </View>
                <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Anleitung:</Text>
                {content.ritual.steps.map((step, i) => (
                  <View key={i} style={styles.stepItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeSection === "journal" && (
              <View>
                <Text style={styles.contentTitle}>Journal-Reflexion</Text>
                <Text style={styles.journalQuestion}>{content.journal.question}</Text>
                <TextInput
                  style={styles.journalInput}
                  value={journalText}
                  onChangeText={(text) => {
                    setJournalText(text);
                    setJournalSaved(false);
                  }}
                  placeholder="Schreibe hier deine Gedanken..."
                  placeholderTextColor={RN.muted}
                  multiline
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveJournal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveButtonText}>
                    {journalSaved ? "✓ Gespeichert" : "Speichern"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {activeSection === "klang" && (
              <View>
                <Text style={styles.contentTitle}>{content.klang.title}</Text>
                {content.klang.audioUrl ? (
                  <View style={styles.audioPlaceholder}>
                    <Text style={styles.audioIcon}>🎶</Text>
                    <Text style={styles.audioText}>{content.klang.duration} Minuten</Text>
                    <TouchableOpacity style={styles.playButton} activeOpacity={0.7}>
                      <Text style={styles.playButtonText}>▶ Abspielen</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.comingSoon}>
                    <Text style={styles.comingSoonText}>Klangwelt wird bald verfügbar sein</Text>
                  </View>
                )}
              </View>
            )}

            {activeSection === "rune" && (
              <View style={styles.runeContent}>
                <Text style={styles.runeSymbol}>{content.rune.symbol}</Text>
                <Text style={styles.runeName}>{content.rune.name}</Text>
                <Text style={styles.runeBedeutung}>{content.rune.bedeutung}</Text>
                <View style={styles.runeAffirmationBox}>
                  <Text style={styles.runeAffirmationLabel}>Affirmation</Text>
                  <Text style={styles.runeAffirmation}>"{content.rune.affirmation}"</Text>
                </View>
              </View>
            )}

            {activeSection === "affirmation" && (
              <View style={styles.affirmationContent}>
                <Text style={styles.affirmationEmoji}>✨</Text>
                <Text style={styles.affirmationText}>"{content.affirmation.text}"</Text>
                <Text style={styles.affirmationHint}>
                  Wiederhole diese Affirmation dreimal laut oder in Gedanken.
                </Text>
              </View>
            )}

            {activeSection === "portaltag" && content.portaltag && (
              <View>
                <Text style={styles.contentTitle}>{content.portaltag.title}</Text>
                <View style={styles.portalHighlight}>
                  <Text style={styles.portalEmoji}>🌀</Text>
                  <Text style={styles.portalLabel}>Portaltag-Energie</Text>
                </View>
                <Text style={styles.contentText}>{content.portaltag.text}</Text>
                <View style={styles.portalEnergieBox}>
                  <Text style={styles.portalEnergieTitle}>Energetischer Hinweis</Text>
                  <Text style={styles.portalEnergieText}>{content.portaltag.energie}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Tag abschließen */}
          {!isCompleted && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>Tag abschließen ✓</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RN.bg,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: RN.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: RN.text,
  },
  headerDate: {
    fontSize: 13,
    color: RN.muted,
    marginTop: 2,
  },
  headerTheme: {
    fontSize: 15,
    color: RN.gold,
    fontWeight: "600",
    marginTop: 4,
  },
  completedBadge: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  // Tabs
  tabsScroll: {
    marginBottom: 20,
    maxHeight: 70,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
  },
  tab: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: RN.surface,
    borderWidth: 1,
    borderColor: RN.border,
    minWidth: 60,
  },
  tabActive: {
    borderColor: RN.gold,
    backgroundColor: "rgba(201, 169, 110, 0.1)",
  },
  tabEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: RN.muted,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: RN.gold,
  },
  // Content Card
  contentCard: {
    backgroundColor: RN.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: RN.border,
    marginBottom: 24,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: RN.text,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 15,
    color: RN.text,
    lineHeight: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: RN.gold,
    marginBottom: 8,
  },
  // Audio
  audioPlaceholder: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(201, 169, 110, 0.05)",
    borderRadius: 16,
  },
  audioIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  audioText: {
    fontSize: 14,
    color: RN.muted,
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: RN.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: RN.bg,
  },
  comingSoon: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(155, 138, 158, 0.1)",
    borderRadius: 16,
  },
  comingSoonText: {
    fontSize: 14,
    color: RN.muted,
    fontStyle: "italic",
  },
  // Ritual
  materialsList: {
    gap: 6,
  },
  materialItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  materialDot: {
    color: RN.gold,
    fontSize: 16,
  },
  materialText: {
    fontSize: 14,
    color: RN.text,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: RN.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: RN.bg,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: RN.text,
    lineHeight: 22,
  },
  // Journal
  journalQuestion: {
    fontSize: 16,
    color: RN.gold,
    fontStyle: "italic",
    lineHeight: 24,
    marginBottom: 20,
  },
  journalInput: {
    backgroundColor: "rgba(245, 237, 232, 0.05)",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: RN.text,
    minHeight: 200,
    borderWidth: 1,
    borderColor: RN.border,
    lineHeight: 24,
  },
  saveButton: {
    backgroundColor: RN.gold,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: RN.bg,
  },
  // Rune
  runeContent: {
    alignItems: "center",
  },
  runeSymbol: {
    fontSize: 72,
    marginBottom: 12,
    color: RN.gold,
  },
  runeName: {
    fontSize: 24,
    fontWeight: "700",
    color: RN.text,
    marginBottom: 8,
  },
  runeBedeutung: {
    fontSize: 15,
    color: RN.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  runeAffirmationBox: {
    backgroundColor: "rgba(201, 169, 110, 0.1)",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  runeAffirmationLabel: {
    fontSize: 12,
    color: RN.muted,
    fontWeight: "500",
    marginBottom: 8,
  },
  runeAffirmation: {
    fontSize: 16,
    color: RN.gold,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 24,
  },
  // Affirmation
  affirmationContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  affirmationEmoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  affirmationText: {
    fontSize: 20,
    color: RN.gold,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 20,
  },
  affirmationHint: {
    fontSize: 13,
    color: RN.muted,
    textAlign: "center",
  },
  // Portaltag
  portalHighlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    backgroundColor: "rgba(123, 94, 167, 0.1)",
    padding: 12,
    borderRadius: 12,
  },
  portalEmoji: {
    fontSize: 24,
  },
  portalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: RN.accent,
  },
  portalEnergieBox: {
    marginTop: 20,
    backgroundColor: "rgba(123, 94, 167, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  portalEnergieTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: RN.accent,
    marginBottom: 8,
  },
  portalEnergieText: {
    fontSize: 14,
    color: RN.text,
    lineHeight: 22,
  },
  // Complete Button
  completeButton: {
    backgroundColor: RN.gold,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: RN.bg,
  },
});
