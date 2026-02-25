import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getCurrentMoonPhase, getMoonCalendar, MOON_PHASES } from "@/lib/moon-phase";

const MONTH_NAMES = [
  "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
];

export default function MondScreen() {
  const colors = useColors();
  const currentPhase = getCurrentMoonPhase();
  const calendar = getMoonCalendar();
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const selectedEntry = calendar[selectedDay];

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Text style={[styles.title, { color: colors.foreground }]}>Mondkalender</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Lebe im Rhythmus des Mondes
        </Text>

        {/* Current Moon Phase Hero */}
        <View style={[styles.heroCard, { backgroundColor: "#1A0F2E" }]}>
          <Text style={styles.heroMoonEmoji}>{currentPhase.emoji}</Text>
          <Text style={styles.heroTitle}>{currentPhase.name}</Text>
          <Text style={styles.heroDesc}>{currentPhase.description}</Text>

          <View style={styles.illuminationBar}>
            <View
              style={[
                styles.illuminationFill,
                { width: `${currentPhase.illumination}%` },
              ]}
            />
          </View>
          <Text style={styles.illuminationText}>
            Beleuchtung: {currentPhase.illumination}%
          </Text>
        </View>

        {/* Energy & Ritual */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⚡</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Energie</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {currentPhase.energy}
              </Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🕯️</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Ritual</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {currentPhase.ritual}
              </Text>
            </View>
          </View>
        </View>

        {/* 30-Day Calendar */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          🌙 Nächste 30 Tage
        </Text>

        <FlatList
          data={calendar}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarRow}
          renderItem={({ item, index }) => {
            const isToday = index === 0;
            const isSelected = index === selectedDay;
            const date = item.date;
            return (
              <Pressable
                onPress={() => setSelectedDay(index)}
                style={[
                  styles.calendarDay,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.calendarDayMonth,
                    { color: isSelected ? "#FAF7F2" : colors.muted },
                  ]}
                >
                  {MONTH_NAMES[date.getMonth()]}
                </Text>
                <Text
                  style={[
                    styles.calendarDayNum,
                    { color: isSelected ? "#FAF7F2" : colors.foreground },
                  ]}
                >
                  {date.getDate()}
                </Text>
                <Text style={styles.calendarMoonEmoji}>{item.phase.emoji}</Text>
                {isToday && (
                  <View style={[styles.todayDot, { backgroundColor: "#C9A84C" }]} />
                )}
              </Pressable>
            );
          }}
        />

        {/* Selected Day Info */}
        {selectedEntry && (
          <View style={[styles.selectedDayCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.selectedDayTitle, { color: colors.foreground }]}>
              {selectedDay === 0 ? "Heute" : selectedEntry.date.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
            </Text>
            <Text style={styles.selectedDayEmoji}>{selectedEntry.phase.emoji}</Text>
            <Text style={[styles.selectedDayPhase, { color: colors.primary }]}>
              {selectedEntry.phase.name}
            </Text>
            <Text style={[styles.selectedDayDesc, { color: colors.muted }]}>
              {selectedEntry.phase.energy}
            </Text>
          </View>
        )}

        {/* All Moon Phases Guide */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          🌑 Mondphasen-Guide
        </Text>
        {MOON_PHASES.map((phase, index) => (
          <View
            key={index}
            style={[styles.phaseGuideCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={styles.phaseGuideEmoji}>{phase.emoji}</Text>
            <View style={styles.phaseGuideContent}>
              <Text style={[styles.phaseGuideName, { color: colors.foreground }]}>
                {phase.name}
              </Text>
              <Text style={[styles.phaseGuideDesc, { color: colors.muted }]} numberOfLines={2}>
                {phase.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  heroCard: {
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginBottom: 16,
  },
  heroMoonEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  heroTitle: {
    color: "#C9A84C",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroDesc: {
    color: "#9B8AAB",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  illuminationBar: {
    width: "80%",
    height: 6,
    backgroundColor: "#2D1F4A",
    borderRadius: 3,
    marginBottom: 6,
    overflow: "hidden",
  },
  illuminationFill: {
    height: "100%",
    backgroundColor: "#C9A84C",
    borderRadius: 3,
  },
  illuminationText: {
    color: "#9B8AAB",
    fontSize: 12,
  },
  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
  },
  infoIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  calendarRow: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  calendarDay: {
    width: 60,
    borderRadius: 14,
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
    gap: 2,
  },
  calendarDayMonth: {
    fontSize: 10,
    fontWeight: "500",
  },
  calendarDayNum: {
    fontSize: 18,
    fontWeight: "700",
  },
  calendarMoonEmoji: {
    fontSize: 18,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  selectedDayCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  selectedDayTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  selectedDayEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  selectedDayPhase: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  selectedDayDesc: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  phaseGuideCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  phaseGuideEmoji: {
    fontSize: 28,
  },
  phaseGuideContent: {
    flex: 1,
  },
  phaseGuideName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  phaseGuideDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
