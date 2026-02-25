import React, { useState, useMemo, useCallback } from "react";
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
  MOON_PHASES,
} from "@/lib/moon-phase";

const WOCHENTAGE_KURZ = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const WOCHENTAGE_LANG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

// MoonWorx-inspiriertes dunkles Farbschema
const C = {
  bg: "#0A0E1A",
  bgGrad: "#111827",
  card: "#1A1F33",
  cardLight: "#222842",
  gold: "#D4A853",
  goldLight: "#E8C97A",
  goldDim: "rgba(212,168,83,0.3)",
  silver: "#C0C8D8",
  white: "#F0F0F5",
  muted: "#8892A8",
  mutedDim: "#5A6478",
  accent: "#7B68EE",
  green: "#4ADE80",
  greenDim: "rgba(74,222,128,0.15)",
  orange: "#FBBF24",
  orangeDim: "rgba(251,191,36,0.15)",
  red: "#F87171",
  redDim: "rgba(248,113,113,0.15)",
  rose: "#C4826A",
  border: "#2A3048",
};

// Körperregionen nach Tierkreiszeichen (wie MoonWorx)
const KOERPERREGIONEN: Record<string, { region: string; tipp: string }> = {
  Widder: { region: "Kopf & Gehirn", tipp: "Kopfmassage, Stirnchakra-Meditation" },
  Stier: { region: "Hals & Nacken", tipp: "Nackenübungen, Kehlchakra-Arbeit, Singen" },
  Zwillinge: { region: "Schultern & Arme", tipp: "Atemübungen, Schultern lockern, Journaling" },
  Krebs: { region: "Brust & Magen", tipp: "Herzchakra-Meditation, warme Suppen, Selbstfürsorge" },
  Löwe: { region: "Herz & Rücken", tipp: "Herzöffnende Yoga-Posen, Rückenübungen" },
  Jungfrau: { region: "Verdauung & Darm", tipp: "Leichte Kost, Detox-Tee, Bauchmassage" },
  Waage: { region: "Nieren & Hüfte", tipp: "Viel trinken, Hüftöffner, Balance-Übungen" },
  Skorpion: { region: "Unterleib & Geschlechtsorgane", tipp: "Sakralchakra-Arbeit, Wärme, Loslassen" },
  Schütze: { region: "Oberschenkel & Leber", tipp: "Wandern, Stretching, Leberentlastung" },
  Steinbock: { region: "Knie & Gelenke", tipp: "Gelenkpflege, Knieübungen, Erdung" },
  Wassermann: { region: "Unterschenkel & Kreislauf", tipp: "Beine hochlegen, Wechselduschen, Meditation" },
  Fische: { region: "Füße & Lymphe", tipp: "Fußbad, Fußmassage, Lymphdrainage" },
};

// Tages-Tipps nach Element (MoonWorx-Stil)
interface TagesTipp {
  kategorie: string;
  icon: string;
  text: string;
  eignung: "sehr_gut" | "gut" | "ungeeignet";
}

function getTagesTipps(zodiacName: string, phaseName: string): TagesTipp[] {
  const element = getMoonZodiac(new Date()).element;
  const zunehmend = phaseName.includes("Zunehmend") || phaseName === "Erstes Viertel";
  const abnehmend = phaseName.includes("Abnehmend") || phaseName === "Letztes Viertel";
  const vollmond = phaseName === "Vollmond";
  const neumond = phaseName === "Neumond";

  const tipps: TagesTipp[] = [];

  // Haare & Schönheit
  if (zunehmend) {
    tipps.push({ kategorie: "Haare", icon: "✂️", text: "Haare schneiden fördert kräftiges Wachstum", eignung: "sehr_gut" });
  } else if (abnehmend) {
    tipps.push({ kategorie: "Haare", icon: "✂️", text: "Haare schneiden – wachsen langsamer nach", eignung: "gut" });
  } else if (vollmond) {
    tipps.push({ kategorie: "Haare", icon: "✂️", text: "Optimaler Tag für Haarschnitt – maximale Fülle", eignung: "sehr_gut" });
  } else {
    tipps.push({ kategorie: "Haare", icon: "✂️", text: "Haare in Ruhe lassen, Kopfhaut pflegen", eignung: "ungeeignet" });
  }

  // Garten & Natur
  if (element === "Erde") {
    tipps.push({ kategorie: "Garten", icon: "🌱", text: "Wurzelgemüse pflanzen, Erde bearbeiten", eignung: "sehr_gut" });
  } else if (element === "Wasser") {
    tipps.push({ kategorie: "Garten", icon: "🌱", text: "Blattgemüse gießen, Pflanzen wässern", eignung: "sehr_gut" });
  } else if (element === "Feuer") {
    tipps.push({ kategorie: "Garten", icon: "🌱", text: "Fruchtgemüse ernten, Samen trocknen", eignung: "gut" });
  } else {
    tipps.push({ kategorie: "Garten", icon: "🌱", text: "Blütenblumen pflegen, Unkraut jäten", eignung: "gut" });
  }

  // Gesundheit & Körper
  const koerper = KOERPERREGIONEN[zodiacName];
  if (koerper) {
    tipps.push({ kategorie: "Körper", icon: "🧘", text: `${koerper.region} besonders empfindlich – ${koerper.tipp}`, eignung: "gut" });
  }

  // Ernährung
  if (element === "Feuer") {
    tipps.push({ kategorie: "Ernährung", icon: "🍽️", text: "Proteinreiche Kost bevorzugen, Gewürze nutzen", eignung: "sehr_gut" });
  } else if (element === "Erde") {
    tipps.push({ kategorie: "Ernährung", icon: "🍽️", text: "Salzige Speisen meiden, Wurzelgemüse bevorzugen", eignung: "gut" });
  } else if (element === "Luft") {
    tipps.push({ kategorie: "Ernährung", icon: "🍽️", text: "Leichte Kost, Salate, viel Flüssigkeit", eignung: "sehr_gut" });
  } else {
    tipps.push({ kategorie: "Ernährung", icon: "🍽️", text: "Kohlenhydrate reduzieren, Suppen & Tees", eignung: "gut" });
  }

  // Rituale & Spirituelles
  if (vollmond) {
    tipps.push({ kategorie: "Ritual", icon: "🕯️", text: "Vollmond-Ritual: Loslassen, Dankbarkeit, Mondwasser herstellen", eignung: "sehr_gut" });
  } else if (neumond) {
    tipps.push({ kategorie: "Ritual", icon: "🕯️", text: "Neumond-Ritual: Intentionen setzen, Wünsche aufschreiben", eignung: "sehr_gut" });
  } else if (zunehmend) {
    tipps.push({ kategorie: "Ritual", icon: "🕯️", text: "Manifestieren, Projekte starten, Fülle einladen", eignung: "sehr_gut" });
  } else {
    tipps.push({ kategorie: "Ritual", icon: "🕯️", text: "Reinigung, Loslassen, Räuchern, Altes verabschieden", eignung: "sehr_gut" });
  }

  // Meditation
  tipps.push({
    kategorie: "Meditation",
    icon: "🧘‍♀️",
    text: vollmond
      ? "Vollmond-Meditation: Klarheit & Erleuchtung"
      : neumond
      ? "Stille Meditation: Innere Einkehr & Neuausrichtung"
      : zunehmend
      ? "Visualisierung: Ziele manifestieren"
      : "Loslassen-Meditation: Altes freigeben",
    eignung: "sehr_gut",
  });

  // Haushalt
  if (abnehmend) {
    tipps.push({ kategorie: "Haushalt", icon: "🏠", text: "Fenster putzen, Großreinemachen – trocknet streifenfrei", eignung: "sehr_gut" });
  } else if (zunehmend) {
    tipps.push({ kategorie: "Haushalt", icon: "🏠", text: "Konservieren, Einmachen, Vorräte anlegen", eignung: "gut" });
  } else {
    tipps.push({ kategorie: "Haushalt", icon: "🏠", text: "Ausmisten, Ordnung schaffen, Altes entsorgen", eignung: "gut" });
  }

  return tipps;
}

function getEignungColor(eignung: "sehr_gut" | "gut" | "ungeeignet") {
  switch (eignung) {
    case "sehr_gut": return { bg: C.greenDim, text: C.green, label: "Sehr gut" };
    case "gut": return { bg: C.orangeDim, text: C.orange, label: "Gut" };
    case "ungeeignet": return { bg: C.redDim, text: C.red, label: "Ungeeignet" };
  }
}

export default function MondScreen() {
  const today = new Date();
  const currentPhase = getCurrentMoonPhase();
  const calendar = getMoonCalendar();
  const [selectedDay, setSelectedDay] = useState<number>(0);

  const selectedEntry = calendar[selectedDay];
  const nextVollmond = useMemo(() => getNextVollmond(), []);
  const nextNeumond = useMemo(() => getNextNeumond(), []);

  const zodiac = useMemo(() => getMoonZodiac(today), []);
  const illumination = useMemo(() => getMoonIllumination(today), []);
  const direction = useMemo(() => getMoonDirection(today), []);
  const koerper = KOERPERREGIONEN[zodiac.name];

  const daysToVollmond = useMemo(() => {
    const diff = nextVollmond.getTime() - today.getTime();
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  }, [nextVollmond]);

  const daysToNeumond = useMemo(() => {
    const diff = nextNeumond.getTime() - today.getTime();
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  }, [nextNeumond]);

  // 5-Tage-Vorschau (vorgestern bis übermorgen) wie MoonWorx
  const fiveDayPreview = useMemo(() => {
    const days = [];
    for (let i = -2; i <= 2; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        date: d,
        phase: getMoonPhaseForDate(d),
        illumination: getMoonIllumination(d),
        isToday: i === 0,
        label: i === -2 ? "Vorgestern" : i === -1 ? "Gestern" : i === 0 ? "Heute" : i === 1 ? "Morgen" : "Übermorgen",
      });
    }
    return days;
  }, []);

  const tipps = useMemo(() => getTagesTipps(zodiac.name, currentPhase.name), [zodiac.name, currentPhase.name]);

  const selectedZodiac = useMemo(
    () => (selectedEntry ? getMoonZodiac(selectedEntry.date) : zodiac),
    [selectedDay]
  );

  return (
    <ScreenContainer containerClassName="bg-[#0A0E1A]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mondkalender</Text>
          <Text style={styles.headerDate}>
            {today.toLocaleDateString("de-DE", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "Europe/Berlin",
            })}
          </Text>
        </View>

        {/* ── HERO: Aktuelle Mondphase (MoonWorx-Stil) ── */}
        <View style={styles.heroCard}>
          {/* 5-Tage-Vorschau */}
          <View style={styles.fiveDayRow}>
            {fiveDayPreview.map((day, i) => (
              <View key={i} style={[styles.fiveDayItem, day.isToday && styles.fiveDayItemToday]}>
                <Text style={styles.fiveDayEmoji}>{day.phase.emoji}</Text>
                <Text style={[styles.fiveDayLabel, day.isToday && styles.fiveDayLabelToday]}>
                  {day.date.getDate()}.{day.date.getMonth() + 1}.
                </Text>
                {day.isToday && <View style={styles.fiveDayDot} />}
              </View>
            ))}
          </View>

          {/* Hauptphase */}
          <Text style={styles.heroMoonEmoji}>{currentPhase.emoji}</Text>
          <Text style={styles.heroTitle}>{currentPhase.name}</Text>
          <Text style={styles.heroZodiac}>
            {zodiac.symbol} im {zodiac.name}
          </Text>
          <Text style={styles.heroElement}>
            {zodiac.element} · {zodiac.qualitaet}
          </Text>

          {/* Beleuchtung */}
          <View style={styles.illuminationContainer}>
            <View style={styles.illuminationBar}>
              <View style={[styles.illuminationFill, { width: `${illumination}%` }]} />
            </View>
            <Text style={styles.illuminationText}>{illumination}% beleuchtet</Text>
          </View>

          {/* Auf-/Absteigend */}
          <View style={styles.directionRow}>
            <View style={styles.directionBadge}>
              <Text style={styles.directionText}>
                {direction === "aufsteigend" ? "↑ Aufsteigend" : "↓ Absteigend"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Tagesqualität ── */}
        <View style={styles.qualityCard}>
          <Text style={styles.sectionLabel}>TAGESQUALITÄT</Text>
          <Text style={styles.qualityTitle}>
            {currentPhase.name} im {zodiac.name}
          </Text>
          <Text style={styles.qualityText}>{currentPhase.description}</Text>

          <View style={styles.qualityDivider} />

          <View style={styles.qualityRow}>
            <Text style={styles.qualityIcon}>⚡</Text>
            <View style={styles.qualityContent}>
              <Text style={styles.qualitySubLabel}>ENERGIE</Text>
              <Text style={styles.qualityValue}>{currentPhase.energy}</Text>
            </View>
          </View>

          <View style={styles.qualityRow}>
            <Text style={styles.qualityIcon}>🕯️</Text>
            <View style={styles.qualityContent}>
              <Text style={styles.qualitySubLabel}>RITUAL-EMPFEHLUNG</Text>
              <Text style={styles.qualityValue}>{currentPhase.ritual}</Text>
            </View>
          </View>

          {koerper && (
            <View style={styles.qualityRow}>
              <Text style={styles.qualityIcon}>🧘</Text>
              <View style={styles.qualityContent}>
                <Text style={styles.qualitySubLabel}>KÖRPERREGION</Text>
                <Text style={styles.qualityValue}>{koerper.region}</Text>
                <Text style={styles.qualityTipp}>{koerper.tipp}</Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Tages-Tipps (MoonWorx-Stil mit Farbcodierung) ── */}
        <View style={styles.tippSection}>
          <Text style={styles.sectionLabel}>TAGES-TIPPS</Text>
          <Text style={styles.tippSubtitle}>Was ist heute gut geeignet?</Text>
          {tipps.map((tipp, i) => {
            const farbe = getEignungColor(tipp.eignung);
            return (
              <View key={i} style={styles.tippCard}>
                <Text style={styles.tippIcon}>{tipp.icon}</Text>
                <View style={styles.tippContent}>
                  <Text style={styles.tippKategorie}>{tipp.kategorie}</Text>
                  <Text style={styles.tippText}>{tipp.text}</Text>
                </View>
                <View style={[styles.tippBadge, { backgroundColor: farbe.bg }]}>
                  <Text style={[styles.tippBadgeText, { color: farbe.text }]}>
                    {farbe.label}
                  </Text>
                </View>
              </View>
            );
          })}
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
                month: "long",
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
                month: "long",
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
        <Text style={styles.sectionTitle}>Nächste 30 Tage</Text>
        <FlatList
          data={calendar}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarRow}
          renderItem={({ item, index }) => {
            const isToday = index === 0;
            const isSelected = index === selectedDay;
            const isVollmond = item.phase.name === "Vollmond";
            const isNeumond = item.phase.name === "Neumond";
            return (
              <TouchableOpacity
                onPress={() => setSelectedDay(index)}
                style={[
                  styles.calendarDay,
                  isSelected && styles.calendarDaySelected,
                  isVollmond && styles.calendarDayVollmond,
                  isNeumond && styles.calendarDayNeumond,
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.calendarDayWeekday, isSelected && styles.calendarTextWhite]}>
                  {WOCHENTAGE_KURZ[item.date.getDay()]}
                </Text>
                <Text style={[styles.calendarDayNum, isSelected && styles.calendarTextWhite]}>
                  {item.date.getDate()}
                </Text>
                <Text style={styles.calendarMoonEmoji}>{item.phase.emoji}</Text>
                {isToday && <View style={styles.todayDot} />}
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
                : `${WOCHENTAGE_LANG[selectedEntry.date.getDay()]}, ${selectedEntry.date.getDate()}. ${["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"][selectedEntry.date.getMonth()]}`}
            </Text>
            <View style={styles.selectedDayRow}>
              <Text style={styles.selectedDayEmoji}>{selectedEntry.phase.emoji}</Text>
              <View style={styles.selectedDayInfo}>
                <Text style={styles.selectedDayPhase}>{selectedEntry.phase.name}</Text>
                <Text style={styles.selectedDayZodiac}>
                  {selectedZodiac.symbol} im {selectedZodiac.name}
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
        <Text style={styles.sectionTitle}>Mondphasen-Guide</Text>
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
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 28, marginRight: 12 }}>🌕</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.quizBannerTitle}>Welcher Mondtyp bist du?</Text>
            <Text style={styles.quizBannerDesc}>Finde es mit unserem Quiz heraus →</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Header
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.white,
    marginBottom: 2,
  },
  headerDate: {
    fontSize: 14,
    color: C.muted,
  },

  // Hero Card
  heroCard: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },

  // 5-Tage-Vorschau
  fiveDayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  fiveDayItem: {
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    minWidth: 54,
  },
  fiveDayItemToday: {
    backgroundColor: "rgba(212,168,83,0.15)",
    borderWidth: 1,
    borderColor: C.goldDim,
  },
  fiveDayEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  fiveDayLabel: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "500",
  },
  fiveDayLabelToday: {
    color: C.gold,
    fontWeight: "700",
  },
  fiveDayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.gold,
    marginTop: 4,
  },

  heroMoonEmoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  heroTitle: {
    color: C.gold,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  heroZodiac: {
    color: C.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  heroElement: {
    color: C.muted,
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
    backgroundColor: "rgba(255,255,255,0.1)",
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
    color: C.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  directionRow: {
    flexDirection: "row",
    gap: 8,
  },
  directionBadge: {
    backgroundColor: "rgba(212,168,83,0.15)",
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.gold,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  qualityTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.white,
    marginBottom: 6,
  },
  qualityText: {
    fontSize: 15,
    color: C.silver,
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
    fontSize: 10,
    fontWeight: "700",
    color: C.muted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  qualityValue: {
    fontSize: 14,
    color: C.silver,
    lineHeight: 20,
  },
  qualityTipp: {
    fontSize: 12,
    color: C.muted,
    lineHeight: 18,
    marginTop: 2,
    fontStyle: "italic",
  },

  // Tages-Tipps
  tippSection: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  tippSubtitle: {
    fontSize: 14,
    color: C.silver,
    marginBottom: 14,
  },
  tippCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 10,
  },
  tippIcon: {
    fontSize: 20,
    width: 28,
    textAlign: "center",
  },
  tippContent: {
    flex: 1,
  },
  tippKategorie: {
    fontSize: 12,
    fontWeight: "700",
    color: C.gold,
    marginBottom: 2,
  },
  tippText: {
    fontSize: 13,
    color: C.silver,
    lineHeight: 18,
  },
  tippBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tippBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },

  // Nächste Hauptphasen
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.white,
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
    color: C.white,
    marginBottom: 4,
  },
  nextPhaseDate: {
    fontSize: 15,
    fontWeight: "800",
    color: C.gold,
    marginBottom: 2,
    textAlign: "center",
  },
  nextPhaseTime: {
    fontSize: 12,
    color: C.muted,
    marginBottom: 4,
  },
  nextPhaseDays: {
    fontSize: 11,
    color: C.goldLight,
    fontWeight: "600",
  },

  // 30-Tage-Kalender
  calendarRow: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  calendarDay: {
    width: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.card,
    padding: 8,
    alignItems: "center",
    gap: 2,
  },
  calendarDaySelected: {
    backgroundColor: C.gold,
    borderColor: C.gold,
  },
  calendarDayVollmond: {
    borderColor: C.goldDim,
  },
  calendarDayNeumond: {
    borderColor: C.mutedDim,
  },
  calendarDayWeekday: {
    fontSize: 10,
    fontWeight: "500",
    color: C.muted,
  },
  calendarDayNum: {
    fontSize: 18,
    fontWeight: "700",
    color: C.white,
  },
  calendarTextWhite: {
    color: "#0A0E1A",
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
    color: C.white,
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
    color: C.gold,
    marginBottom: 2,
  },
  selectedDayZodiac: {
    fontSize: 14,
    fontWeight: "600",
    color: C.white,
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
    color: C.white,
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
    backgroundColor: C.cardLight,
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: C.goldDim,
  },
  quizBannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.gold,
    marginBottom: 3,
  },
  quizBannerDesc: {
    fontSize: 13,
    color: C.muted,
  },
});
