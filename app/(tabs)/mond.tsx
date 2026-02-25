import React, { useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  getCurrentMoonPhase,
  getMoonCalendar,
  getMoonPhaseForDate,
  getNextVollmond,
  getNextNeumond,
  getMoonZodiac,
  getMoonIllumination,
  getMoonDirection,
  formatMondDatum,
  MOON_PHASES,
} from "@/lib/moon-phase";

const MONTH_NAMES = [
  "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
];

const WOCHENTAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

const C = {
  bg: "#FDF8F4",
  card: "#FFFFFF",
  rose: "#C4826A",
  roseLight: "#F9EDE8",
  gold: "#C9A96E",
  goldLight: "#FAF3E7",
  brown: "#5C3317",
  brownMid: "#8B5E3C",
  muted: "#A08070",
  border: "#EDD9D0",
  darkCard: "#2C1810",
  darkText: "#E8D5C4",
};

export default function MondScreen() {
  const currentPhase = getCurrentMoonPhase();
  const calendar = getMoonCalendar();
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const selectedEntry = calendar[selectedDay];
  const nextVollmond = useMemo(() => getNextVollmond(), []);
  const nextNeumond = useMemo(() => getNextNeumond(), []);

  const today = new Date();
  const zodiac = useMemo(() => getMoonZodiac(today), []);
  const illumination = useMemo(() => getMoonIllumination(today), []);
  const direction = useMemo(() => getMoonDirection(today), []);

  // Tage bis zum nächsten Vollmond
  const daysToVollmond = useMemo(() => {
    const diff = nextVollmond.getTime() - today.getTime();
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  }, [nextVollmond]);

  // Tage bis zum nächsten Neumond
  const daysToNeumond = useMemo(() => {
    const diff = nextNeumond.getTime() - today.getTime();
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  }, [nextNeumond]);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Text style={styles.title}>Mondkalender</Text>
        <Text style={styles.subtitle}>Lebe im Rhythmus des Mondes</Text>

        {/* ── HERO: Aktuelle Mondphase (MoonWorx-Stil) ── */}
        <View style={styles.heroCard}>
          {/* Mondphase + Tierkreiszeichen */}
          <Text style={styles.heroMoonEmoji}>{currentPhase.emoji}</Text>
          <Text style={styles.heroTitle}>{currentPhase.name}</Text>
          <Text style={styles.heroZodiac}>
            {zodiac.symbol} im {zodiac.name}
          </Text>
          <Text style={styles.heroElement}>
            Element: {zodiac.element} · {zodiac.qualitaet}
          </Text>

          {/* Beleuchtung */}
          <View style={styles.illuminationContainer}>
            <View style={styles.illuminationBar}>
              <View
                style={[
                  styles.illuminationFill,
                  { width: `${illumination}%` },
                ]}
              />
            </View>
            <Text style={styles.illuminationText}>
              {illumination}% beleuchtet
            </Text>
          </View>

          {/* Auf-/Absteigend */}
          <View style={styles.directionBadge}>
            <Text style={styles.directionText}>
              {direction === "aufsteigend" ? "↑ Aufsteigender Mond" : "↓ Absteigender Mond"}
            </Text>
          </View>
        </View>

        {/* ── Tagesqualität ── */}
        <View style={styles.qualityCard}>
          <Text style={styles.qualityLabel}>✨ Tagesqualität</Text>
          <Text style={styles.qualityText}>{currentPhase.description}</Text>
          <View style={styles.qualityDivider} />
          <View style={styles.qualityRow}>
            <Text style={styles.qualityIcon}>⚡</Text>
            <View style={styles.qualityContent}>
              <Text style={styles.qualitySubLabel}>Energie</Text>
              <Text style={styles.qualityValue}>{currentPhase.energy}</Text>
            </View>
          </View>
          <View style={styles.qualityRow}>
            <Text style={styles.qualityIcon}>🕯️</Text>
            <View style={styles.qualityContent}>
              <Text style={styles.qualitySubLabel}>Ritual-Empfehlung</Text>
              <Text style={styles.qualityValue}>{currentPhase.ritual}</Text>
            </View>
          </View>
        </View>

        {/* ── Nächste Hauptphasen ── */}
        <Text style={styles.sectionTitle}>Nächste Hauptphasen</Text>
        <View style={styles.nextPhasesRow}>
          <View style={styles.nextPhaseCard}>
            <Text style={styles.nextPhaseEmoji}>🌕</Text>
            <Text style={styles.nextPhaseLabel}>Vollmond</Text>
            <Text style={styles.nextPhaseDate}>
              {nextVollmond.toLocaleDateString("de-DE", {
                day: "numeric",
                month: "short",
                timeZone: "Europe/Berlin",
              })}
            </Text>
            <Text style={styles.nextPhaseTime}>
              {nextVollmond.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Berlin",
              })} Uhr
            </Text>
            <Text style={styles.nextPhaseDays}>
              in {daysToVollmond} {daysToVollmond === 1 ? "Tag" : "Tagen"}
            </Text>
          </View>
          <View style={styles.nextPhaseCard}>
            <Text style={styles.nextPhaseEmoji}>🌑</Text>
            <Text style={styles.nextPhaseLabel}>Neumond</Text>
            <Text style={styles.nextPhaseDate}>
              {nextNeumond.toLocaleDateString("de-DE", {
                day: "numeric",
                month: "short",
                timeZone: "Europe/Berlin",
              })}
            </Text>
            <Text style={styles.nextPhaseTime}>
              {nextNeumond.toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Berlin",
              })} Uhr
            </Text>
            <Text style={styles.nextPhaseDays}>
              in {daysToNeumond} {daysToNeumond === 1 ? "Tag" : "Tagen"}
            </Text>
          </View>
        </View>

        {/* ── 30-Tage-Kalender ── */}
        <Text style={styles.sectionTitle}>🌙 Nächste 30 Tage</Text>
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
              <TouchableOpacity
                onPress={() => setSelectedDay(index)}
                style={[
                  styles.calendarDay,
                  isSelected && styles.calendarDaySelected,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.calendarDayWeekday,
                    isSelected && styles.calendarDayTextSelected,
                  ]}
                >
                  {WOCHENTAGE[date.getDay()]}
                </Text>
                <Text
                  style={[
                    styles.calendarDayNum,
                    isSelected && styles.calendarDayTextSelected,
                  ]}
                >
                  {date.getDate()}
                </Text>
                <Text style={styles.calendarMoonEmoji}>{item.phase.emoji}</Text>
                {isToday && (
                  <View style={styles.todayDot} />
                )}
              </TouchableOpacity>
            );
          }}
        />

        {/* Ausgewählter Tag */}
        {selectedEntry && (
          <View style={styles.selectedDayCard}>
            <Text style={styles.selectedDayTitle}>
              {selectedDay === 0
                ? "Heute"
                : selectedEntry.date.toLocaleDateString("de-DE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
            </Text>
            <View style={styles.selectedDayRow}>
              <Text style={styles.selectedDayEmoji}>{selectedEntry.phase.emoji}</Text>
              <View style={styles.selectedDayInfo}>
                <Text style={styles.selectedDayPhase}>{selectedEntry.phase.name}</Text>
                <Text style={styles.selectedDayZodiac}>
                  {getMoonZodiac(selectedEntry.date).symbol} im {getMoonZodiac(selectedEntry.date).name}
                </Text>
                <Text style={styles.selectedDayEnergy}>{selectedEntry.phase.energy}</Text>
              </View>
            </View>
            <View style={styles.selectedDayIllum}>
              <View style={styles.illuminationBarSmall}>
                <View
                  style={[
                    styles.illuminationFillSmall,
                    { width: `${getMoonIllumination(selectedEntry.date)}%` },
                  ]}
                />
              </View>
              <Text style={styles.illuminationTextSmall}>
                {getMoonIllumination(selectedEntry.date)}% beleuchtet
              </Text>
            </View>
          </View>
        )}

        {/* ── Mondphasen-Guide ── */}
        <Text style={styles.sectionTitle}>🌑 Mondphasen-Guide</Text>
        {MOON_PHASES.map((phase, index) => (
          <View key={index} style={styles.phaseGuideCard}>
            <Text style={styles.phaseGuideEmoji}>{phase.emoji}</Text>
            <View style={styles.phaseGuideContent}>
              <Text style={styles.phaseGuideName}>{phase.name}</Text>
              <Text style={styles.phaseGuideDesc} numberOfLines={2}>
                {phase.description}
              </Text>
            </View>
          </View>
        ))}

        {/* ── Mondtyp-Quiz Banner ── */}
        <TouchableOpacity
          style={styles.quizBanner}
          onPress={() => router.push("/mondtyp-quiz" as any)}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 28, marginRight: 12 }}>🌕</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.quizBannerTitle}>Welcher Mondtyp bist du?</Text>
            <Text style={styles.quizBannerDesc}>Finde es mit unserem Quiz heraus →</Text>
          </View>
        </TouchableOpacity>
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
    color: C.brown,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: C.muted,
    marginBottom: 20,
  },

  // Hero Card (MoonWorx-Stil)
  heroCard: {
    backgroundColor: C.darkCard,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginBottom: 16,
  },
  heroMoonEmoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  heroTitle: {
    color: C.gold,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  heroZodiac: {
    color: C.darkText,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  heroElement: {
    color: "rgba(232,213,196,0.7)",
    fontSize: 13,
    marginBottom: 16,
  },
  illuminationContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  illuminationBar: {
    width: "80%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 4,
    marginBottom: 6,
    overflow: "hidden",
  },
  illuminationFill: {
    height: "100%",
    backgroundColor: C.gold,
    borderRadius: 4,
  },
  illuminationText: {
    color: "rgba(232,213,196,0.8)",
    fontSize: 13,
    fontWeight: "600",
  },
  directionBadge: {
    backgroundColor: "rgba(201,169,110,0.2)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  directionText: {
    color: C.gold,
    fontSize: 12,
    fontWeight: "700",
  },

  // Tagesqualität
  qualityCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  qualityLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: C.gold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  qualityText: {
    fontSize: 16,
    color: C.brown,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 12,
  },
  qualityDivider: {
    height: 1,
    backgroundColor: C.border,
    marginBottom: 12,
  },
  qualityRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
  },
  qualityIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  qualityContent: {
    flex: 1,
  },
  qualitySubLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  qualityValue: {
    fontSize: 14,
    color: C.brownMid,
    lineHeight: 20,
  },

  // Nächste Hauptphasen
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.brown,
    marginBottom: 12,
    marginTop: 8,
  },
  nextPhasesRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  nextPhaseCard: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  nextPhaseEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  nextPhaseLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: C.brown,
    marginBottom: 4,
  },
  nextPhaseDate: {
    fontSize: 16,
    fontWeight: "800",
    color: C.rose,
    marginBottom: 2,
  },
  nextPhaseTime: {
    fontSize: 12,
    color: C.muted,
    marginBottom: 4,
  },
  nextPhaseDays: {
    fontSize: 11,
    color: C.gold,
    fontWeight: "600",
  },

  // 30-Tage-Kalender
  calendarRow: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  calendarDay: {
    width: 60,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.card,
    padding: 8,
    alignItems: "center",
    gap: 2,
  },
  calendarDaySelected: {
    backgroundColor: C.rose,
    borderColor: C.rose,
  },
  calendarDayWeekday: {
    fontSize: 10,
    fontWeight: "500",
    color: C.muted,
  },
  calendarDayNum: {
    fontSize: 18,
    fontWeight: "700",
    color: C.brown,
  },
  calendarDayTextSelected: {
    color: "#FFF",
  },
  calendarMoonEmoji: {
    fontSize: 18,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.gold,
    marginTop: 2,
  },

  // Ausgewählter Tag
  selectedDayCard: {
    backgroundColor: C.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
    marginBottom: 24,
  },
  selectedDayTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.brown,
    marginBottom: 12,
  },
  selectedDayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },
  selectedDayEmoji: {
    fontSize: 44,
  },
  selectedDayInfo: {
    flex: 1,
  },
  selectedDayPhase: {
    fontSize: 18,
    fontWeight: "700",
    color: C.rose,
    marginBottom: 2,
  },
  selectedDayZodiac: {
    fontSize: 14,
    fontWeight: "600",
    color: C.brown,
    marginBottom: 2,
  },
  selectedDayEnergy: {
    fontSize: 13,
    color: C.muted,
    lineHeight: 18,
  },
  selectedDayIllum: {
    alignItems: "center",
  },
  illuminationBarSmall: {
    width: "100%",
    height: 6,
    backgroundColor: C.border,
    borderRadius: 3,
    marginBottom: 4,
    overflow: "hidden",
  },
  illuminationFillSmall: {
    height: "100%",
    backgroundColor: C.gold,
    borderRadius: 3,
  },
  illuminationTextSmall: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "600",
  },

  // Mondphasen-Guide
  phaseGuideCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
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
    color: C.brown,
    marginBottom: 2,
  },
  phaseGuideDesc: {
    fontSize: 13,
    color: C.muted,
    lineHeight: 18,
  },

  // Quiz-Banner
  quizBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.darkCard,
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  quizBannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.gold,
    marginBottom: 3,
  },
  quizBannerDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
});
