import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
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
  MOON_PHASES,
  getMoonPhaseForDate,
  getMoonZodiac,
  getMoonIllumination,
  getMoonDirection,
  isMoonWaxing,
  getNextExaktePhasen,
  getNextVollmondFromDate,
  getNextNeumondFromDate,
  getExaktePhaseForDate,
  getMoonEmoji,
  type ExaktePhase,
} from "@/lib/moon-phase";

const WOCHENTAGE_KURZ = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const WOCHENTAGE_LANG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const MONATE_KURZ = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

// MoonWorx-inspiriertes dunkles Farbschema
const C = {
  bg: "#0A0E1A",
  card: "#1A1F33",
  cardLight: "#222842",
  gold: "#D4A853",
  goldLight: "#E8C97A",
  goldDim: "rgba(212,168,83,0.3)",
  silver: "#C0C8D8",
  white: "#F0F0F5",
  muted: "#8892A8",
  mutedDim: "#5A6478",
  green: "#4ADE80",
  greenDim: "rgba(74,222,128,0.15)",
  orange: "#FBBF24",
  orangeDim: "rgba(251,191,36,0.15)",
  red: "#F87171",
  redDim: "rgba(248,113,113,0.15)",
  border: "#2A3048",
};

// Körperregionen nach Tierkreiszeichen
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

// ── Tages-Tipps ──
interface TagesTipp {
  kategorie: string;
  icon: string;
  text: string;
  eignung: "sehr_gut" | "gut" | "ungeeignet";
}

function getTagesTipps(date: Date): TagesTipp[] {
  const zodiac = getMoonZodiac(date);
  const phase = getMoonPhaseForDate(date);
  const element = zodiac.element;
  const phaseName = phase.name;
  const zunehmend = phaseName.includes("Zunehmend") || phaseName === "Erstes Viertel";
  const abnehmend = phaseName.includes("Abnehmend") || phaseName === "Letztes Viertel";
  const vollmond = phaseName === "Vollmond";
  const neumond = phaseName === "Neumond";

  const tipps: TagesTipp[] = [];

  // Haare
  if (vollmond) {
    tipps.push({ kategorie: "Haare", icon: "✂️", text: "Optimaler Tag für Haarschnitt – maximale Fülle & Glanz", eignung: "sehr_gut" });
  } else if (zunehmend) {
    tipps.push({ kategorie: "Haare", icon: "✂️", text: "Haare schneiden fördert kräftiges Wachstum", eignung: "sehr_gut" });
  } else if (abnehmend) {
    tipps.push({ kategorie: "Haare", icon: "✂️", text: "Haare schneiden – wachsen langsamer nach, gut für Formschnitt", eignung: "gut" });
  } else {
    tipps.push({ kategorie: "Haare", icon: "✂️", text: "Haare ruhen lassen, Kopfhaut pflegen & nähren", eignung: "ungeeignet" });
  }

  // Garten
  if (element === "Erde") {
    tipps.push({ kategorie: "Garten", icon: "🌱", text: "Wurzelgemüse pflanzen, Erde bearbeiten, Kompost anlegen", eignung: "sehr_gut" });
  } else if (element === "Wasser") {
    tipps.push({ kategorie: "Garten", icon: "🌱", text: "Blattgemüse gießen, Pflanzen wässern, Stecklinge setzen", eignung: "sehr_gut" });
  } else if (element === "Feuer") {
    tipps.push({ kategorie: "Garten", icon: "🌱", text: "Fruchtgemüse ernten, Samen trocknen, Kräuter schneiden", eignung: "gut" });
  } else {
    tipps.push({ kategorie: "Garten", icon: "🌱", text: "Blütenblumen pflegen, Unkraut jäten, Luft an Pflanzen lassen", eignung: "gut" });
  }

  // Körper
  const koerper = KOERPERREGIONEN[zodiac.name];
  if (koerper) {
    tipps.push({ kategorie: "Körper", icon: "🧘", text: `${koerper.region} besonders empfindlich – ${koerper.tipp}`, eignung: "gut" });
  }

  // Ernährung
  if (element === "Feuer") {
    tipps.push({ kategorie: "Ernährung", icon: "🍽️", text: "Proteinreiche Kost, wärmende Gewürze, Ingwertee", eignung: "sehr_gut" });
  } else if (element === "Erde") {
    tipps.push({ kategorie: "Ernährung", icon: "🍽️", text: "Salzige Speisen meiden, Wurzelgemüse & Vollkorn bevorzugen", eignung: "gut" });
  } else if (element === "Luft") {
    tipps.push({ kategorie: "Ernährung", icon: "🍽️", text: "Leichte Kost, frische Salate, viel Wasser & Kräutertee", eignung: "sehr_gut" });
  } else {
    tipps.push({ kategorie: "Ernährung", icon: "🍽️", text: "Kohlenhydrate reduzieren, Suppen & wärmende Tees genießen", eignung: "gut" });
  }

  // Ritual
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
    kategorie: "Meditation", icon: "🧘‍♀️",
    text: vollmond ? "Vollmond-Meditation: Klarheit & Erleuchtung empfangen"
      : neumond ? "Stille Meditation: Innere Einkehr & Neuausrichtung"
      : zunehmend ? "Visualisierung: Ziele & Wünsche manifestieren"
      : "Loslassen-Meditation: Altes freigeben & Raum schaffen",
    eignung: "sehr_gut",
  });

  // Haushalt
  if (abnehmend) {
    tipps.push({ kategorie: "Haushalt", icon: "🏠", text: "Fenster putzen, Großreinemachen – trocknet streifenfrei", eignung: "sehr_gut" });
  } else if (zunehmend) {
    tipps.push({ kategorie: "Haushalt", icon: "🏠", text: "Konservieren, Einmachen, Vorräte anlegen", eignung: "gut" });
  } else if (vollmond) {
    tipps.push({ kategorie: "Haushalt", icon: "🏠", text: "Kristalle & Schmuck im Mondlicht aufladen", eignung: "sehr_gut" });
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

// ── Unendlicher Kalender ──
const DAYS_BUFFER = 365;

function generateDays(centerDate: Date, count: number, startOffset: number): { date: Date; key: string }[] {
  const days: { date: Date; key: string }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + startOffset + i);
    days.push({ date: d, key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` });
  }
  return days;
}

const DAY_WIDTH = 62;
const DAY_GAP = 6;
const ITEM_SIZE = DAY_WIDTH + DAY_GAP;

export default function MondScreen() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);

  const allDays = useMemo(() => generateDays(today, DAYS_BUFFER * 2 + 1, -DAYS_BUFFER), [today]);
  const todayIndex = DAYS_BUFFER;

  const [selectedIndex, setSelectedIndex] = useState(todayIndex);
  const calendarRef = useRef<FlatList>(null);
  const hasScrolledToToday = useRef(false);

  useEffect(() => {
    if (!hasScrolledToToday.current && calendarRef.current) {
      setTimeout(() => {
        calendarRef.current?.scrollToOffset({
          offset: (todayIndex - 2) * ITEM_SIZE,
          animated: false,
        });
        hasScrolledToToday.current = true;
      }, 100);
    }
  }, [todayIndex]);

  // ── ALLES basiert auf dem gewählten Tag ──
  const selectedDate = allDays[selectedIndex]?.date ?? today;
  const selectedPhase = useMemo(() => getMoonPhaseForDate(selectedDate), [selectedIndex]);
  const selectedZodiac = useMemo(() => getMoonZodiac(selectedDate), [selectedIndex]);
  const selectedIllum = useMemo(() => getMoonIllumination(selectedDate), [selectedIndex]);
  const selectedDirection = useMemo(() => getMoonDirection(selectedDate), [selectedIndex]);
  const selectedWaxing = useMemo(() => isMoonWaxing(selectedDate), [selectedIndex]);
  const selectedKoerper = KOERPERREGIONEN[selectedZodiac.name];
  const selectedTipps = useMemo(() => getTagesTipps(selectedDate), [selectedIndex]);
  const selectedEmoji = useMemo(() => getMoonEmoji(selectedDate), [selectedIndex]);

  // DYNAMISCH: Nächste Hauptphasen basierend auf dem GEWÄHLTEN Datum
  const nextVollmond = useMemo(() => getNextVollmondFromDate(selectedDate), [selectedIndex]);
  const nextNeumond = useMemo(() => getNextNeumondFromDate(selectedDate), [selectedIndex]);
  const exaktePhasen = useMemo(() => getNextExaktePhasen(selectedDate, 12), [selectedIndex]);

  // Prüfe ob der gewählte Tag ein Hauptphasen-Tag ist
  const exaktePhaseHeute = useMemo(() => getExaktePhaseForDate(selectedDate), [selectedIndex]);

  const isToday = selectedIndex === todayIndex;

  const selectedDateLabel = useMemo(() => {
    const d = selectedDate;
    return `${WOCHENTAGE_LANG[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]} ${d.getFullYear()}`;
  }, [selectedIndex]);

  const goToPrevDay = () => {
    if (selectedIndex > 0) {
      const newIdx = selectedIndex - 1;
      setSelectedIndex(newIdx);
      calendarRef.current?.scrollToOffset({ offset: Math.max(0, (newIdx - 2) * ITEM_SIZE), animated: true });
    }
  };
  const goToNextDay = () => {
    if (selectedIndex < allDays.length - 1) {
      const newIdx = selectedIndex + 1;
      setSelectedIndex(newIdx);
      calendarRef.current?.scrollToOffset({ offset: Math.max(0, (newIdx - 2) * ITEM_SIZE), animated: true });
    }
  };
  const goToToday = () => {
    setSelectedIndex(todayIndex);
    calendarRef.current?.scrollToOffset({ offset: (todayIndex - 2) * ITEM_SIZE, animated: true });
  };

  // Kalender-Item: JETZT MIT MONAT UND EMOJI
  const renderCalendarDay = useCallback(({ item, index }: { item: { date: Date; key: string }; index: number }) => {
    const d = item.date;
    const isSelected = index === selectedIndex;
    const isTodayItem = index === todayIndex;
    const emoji = getMoonEmoji(d);
    const phase = getMoonPhaseForDate(d);
    const isVollmond = phase.name === "Vollmond";
    const isNeumond = phase.name === "Neumond";

    // Zeige Monat wenn es der 1. des Monats ist ODER der erste sichtbare Tag
    const showMonth = d.getDate() === 1 || index === 0;

    return (
      <TouchableOpacity
        onPress={() => setSelectedIndex(index)}
        style={[
          st.calDay,
          isSelected && st.calDaySelected,
          !isSelected && isVollmond && st.calDayVollmond,
          !isSelected && isNeumond && st.calDayNeumond,
        ]}
        activeOpacity={0.7}
      >
        {showMonth && (
          <Text style={[st.calDayMonth, isSelected && st.calDayTextDark]}>
            {MONATE_KURZ[d.getMonth()]}
          </Text>
        )}
        <Text style={[st.calDayWeekday, isSelected && st.calDayTextDark]}>
          {WOCHENTAGE_KURZ[d.getDay()]}
        </Text>
        <Text style={[st.calDayNum, isSelected && st.calDayTextDark]}>
          {d.getDate()}
        </Text>
        <Text style={st.calDayEmoji}>{emoji}</Text>
        {isTodayItem && !isSelected && <View style={st.calTodayDot} />}
        {isVollmond && !isSelected && <Text style={st.calDayLabel}>VM</Text>}
        {isNeumond && !isSelected && <Text style={st.calDayLabel}>NM</Text>}
      </TouchableOpacity>
    );
  }, [selectedIndex, todayIndex]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: ITEM_SIZE,
    offset: ITEM_SIZE * index,
    index,
  }), []);

  // Countdown-Berechnung
  const daysUntil = (target: Date) => {
    const diff = target.getTime() - selectedDate.getTime();
    const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
    if (days === 0) return "Heute!";
    if (days === 1) return "Morgen";
    return `in ${days} Tagen`;
  };

  return (
    <ScreenContainer containerClassName="bg-[#0A0E1A]">
      {/* ── HEADER mit Datum-Navigation ── */}
      <View style={st.header}>
        <TouchableOpacity onPress={goToToday} style={st.todayBtn} activeOpacity={0.7}>
          <Text style={st.todayBtnText}>Heute</Text>
        </TouchableOpacity>
        <View style={st.dateNav}>
          <TouchableOpacity onPress={goToPrevDay} style={st.navArrow} activeOpacity={0.6}>
            <Text style={st.navArrowText}>‹</Text>
          </TouchableOpacity>
          <Text style={st.dateNavText}>{selectedDateLabel}</Text>
          <TouchableOpacity onPress={goToNextDay} style={st.navArrow} activeOpacity={0.6}>
            <Text style={st.navArrowText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── KALENDER-LEISTE OBEN (unendlich scrollbar, mit Monat + Emoji) ── */}
      <FlatList
        ref={calendarRef}
        data={allDays}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderCalendarDay}
        getItemLayout={getItemLayout}
        contentContainerStyle={st.calRow}
        initialScrollIndex={todayIndex > 2 ? todayIndex - 2 : 0}
        style={st.calContainer}
        windowSize={15}
        maxToRenderPerBatch={20}
        removeClippedSubviews
      />

      {/* ── SCROLLBARER INHALT ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={st.scrollContent}
      >
        {/* ── HERO: Mondphase des gewählten Tages ── */}
        <View style={st.heroCard}>
          <Text style={st.heroEmoji}>{selectedEmoji}</Text>
          <Text style={st.heroTitle}>{selectedPhase.name}</Text>
          <Text style={st.heroZodiac}>
            {selectedZodiac.symbol} im {selectedZodiac.name}
          </Text>
          <Text style={st.heroElement}>
            {selectedZodiac.element} · {selectedZodiac.qualitaet}
          </Text>

          {/* Exaktes Datum wenn Hauptphase */}
          {exaktePhaseHeute && (
            <View style={st.exaktHeuteBox}>
              <Text style={st.exaktHeuteText}>
                {exaktePhaseHeute.emoji} {exaktePhaseHeute.name} um{" "}
                {exaktePhaseHeute.datum.toLocaleTimeString("de-DE", {
                  hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
                })} Uhr
              </Text>
            </View>
          )}

          <View style={st.illuminationContainer}>
            <View style={st.illuminationBar}>
              <View style={[st.illuminationFill, { width: `${selectedIllum}%` }]} />
            </View>
            <Text style={st.illuminationText}>{selectedIllum}% beleuchtet</Text>
          </View>

          <View style={st.directionRow}>
            <View style={st.directionBadge}>
              <Text style={st.directionText}>
                {selectedDirection === "aufsteigend" ? "↑ Aufsteigend" : "↓ Absteigend"}
              </Text>
            </View>
            <View style={st.directionBadge}>
              <Text style={st.directionText}>
                {selectedWaxing ? "☽ Zunehmend" : "☾ Abnehmend"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Nächste Hauptphasen (DYNAMISCH zum gewählten Datum) ── */}
        <View style={st.nextPhasesRow}>
          <View style={st.nextPhaseCard}>
            <Text style={st.nextPhaseEmoji}>🌕</Text>
            <Text style={st.nextPhaseLabel}>Vollmond</Text>
            <Text style={st.nextPhaseDate}>
              {nextVollmond.toLocaleDateString("de-DE", {
                day: "numeric", month: "numeric", year: "numeric", timeZone: "Europe/Berlin",
              })}
            </Text>
            <Text style={st.nextPhaseTime}>
              {nextVollmond.toLocaleTimeString("de-DE", {
                hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
              })} Uhr
            </Text>
            <Text style={st.nextPhaseCountdown}>{daysUntil(nextVollmond)}</Text>
          </View>
          <View style={st.nextPhaseCard}>
            <Text style={st.nextPhaseEmoji}>🌑</Text>
            <Text style={st.nextPhaseLabel}>Neumond</Text>
            <Text style={st.nextPhaseDate}>
              {nextNeumond.toLocaleDateString("de-DE", {
                day: "numeric", month: "numeric", year: "numeric", timeZone: "Europe/Berlin",
              })}
            </Text>
            <Text style={st.nextPhaseTime}>
              {nextNeumond.toLocaleTimeString("de-DE", {
                hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
              })} Uhr
            </Text>
            <Text style={st.nextPhaseCountdown}>{daysUntil(nextNeumond)}</Text>
          </View>
        </View>

        {/* ── Tagesqualität ── */}
        <View style={st.qualityCard}>
          <Text style={st.sectionLabel}>
            TAGESQUALITÄT · {selectedDate.getDate()}. {MONATE[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
          <Text style={st.qualityTitle}>
            {selectedPhase.name} im {selectedZodiac.name}
          </Text>
          <Text style={st.qualityText}>{selectedPhase.description}</Text>

          <View style={st.qualityDivider} />

          <View style={st.qualityRow}>
            <Text style={st.qualityIcon}>⚡</Text>
            <View style={st.qualityContent}>
              <Text style={st.qualitySubLabel}>ENERGIE</Text>
              <Text style={st.qualityValue}>{selectedPhase.energy}</Text>
            </View>
          </View>

          <View style={st.qualityRow}>
            <Text style={st.qualityIcon}>🕯️</Text>
            <View style={st.qualityContent}>
              <Text style={st.qualitySubLabel}>RITUAL-EMPFEHLUNG</Text>
              <Text style={st.qualityValue}>{selectedPhase.ritual}</Text>
            </View>
          </View>

          {selectedKoerper && (
            <View style={st.qualityRow}>
              <Text style={st.qualityIcon}>🧘</Text>
              <View style={st.qualityContent}>
                <Text style={st.qualitySubLabel}>KÖRPERREGION ({selectedZodiac.name.toUpperCase()})</Text>
                <Text style={st.qualityValue}>{selectedKoerper.region}</Text>
                <Text style={st.qualityTipp}>{selectedKoerper.tipp}</Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Tages-Tipps ── */}
        <View style={st.tippSection}>
          <Text style={st.sectionLabel}>
            TAGES-TIPPS · {selectedDate.getDate()}. {MONATE[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
          <Text style={st.tippSubtitle}>
            {isToday ? "Was ist heute gut geeignet?" : `Was ist am ${selectedDate.getDate()}. ${MONATE[selectedDate.getMonth()]} gut geeignet?`}
          </Text>
          {selectedTipps.map((tipp, i) => {
            const farbe = getEignungColor(tipp.eignung);
            return (
              <View key={i} style={[st.tippCard, i === selectedTipps.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={st.tippIcon}>{tipp.icon}</Text>
                <View style={st.tippContent}>
                  <Text style={st.tippKategorie}>{tipp.kategorie}</Text>
                  <Text style={st.tippText}>{tipp.text}</Text>
                </View>
                <View style={[st.tippBadge, { backgroundColor: farbe.bg }]}>
                  <Text style={[st.tippBadgeText, { color: farbe.text }]}>{farbe.label}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Exakte Mondphasen-Daten 2026 (wie MoonWorx) ── */}
        <View style={st.exaktSection}>
          <Text style={st.sectionLabel}>MONDKALENDER · EXAKTE DATEN</Text>
          <Text style={st.exaktSubtitle}>Astronomisch exakte Zeiten (MEZ/MESZ)</Text>
          {exaktePhasen.map((phase, i) => {
            const tagName = WOCHENTAGE_KURZ[phase.datum.getDay()];
            const datumStr = phase.datum.toLocaleDateString("de-DE", {
              day: "numeric", month: "numeric", year: "numeric", timeZone: "Europe/Berlin",
            });
            const zeitStr = phase.datum.toLocaleTimeString("de-DE", {
              hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
            });
            return (
              <View key={i} style={[st.exaktCard, i === exaktePhasen.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={st.exaktEmoji}>{phase.emoji}</Text>
                <View style={st.exaktContent}>
                  <Text style={st.exaktName}>{phase.name}</Text>
                  <Text style={st.exaktDatum}>{tagName}, {datumStr}</Text>
                </View>
                <Text style={st.exaktZeit}>{zeitStr} Uhr</Text>
              </View>
            );
          })}
        </View>

        {/* ── Dein Mondtyp-Quiz ── */}
        <TouchableOpacity
          style={{
            marginHorizontal: 16, marginBottom: 16, borderRadius: 16,
            backgroundColor: C.card, borderWidth: 1, borderColor: C.gold,
            padding: 16, flexDirection: "row", alignItems: "center", gap: 12,
          }}
          onPress={() => router.push("/mondtyp-quiz" as any)}
          activeOpacity={0.8}
        >
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.goldDim, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 24 }}>🌙</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: C.gold }}>Dein Mondtyp-Quiz</Text>
            <Text style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Finde heraus, welcher Mondtyp du bist</Text>
          </View>
          <Text style={{ fontSize: 18, color: C.gold }}>›</Text>
        </TouchableOpacity>

        {/* ── Mondphasen-Guide ── */}
        <Text style={st.sectionTitle}>Mondphasen-Guide</Text>
        {MOON_PHASES.map((phase, index) => (
          <View key={index} style={st.phaseGuideCard}>
            <Text style={st.phaseGuideEmoji}>{phase.emoji}</Text>
            <View style={st.phaseGuideContent}>
              <Text style={st.phaseGuideName}>{phase.name}</Text>
              <Text style={st.phaseGuideDesc} numberOfLines={2}>{phase.description}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const st = StyleSheet.create({
  // Header
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4,
  },
  todayBtn: {
    backgroundColor: C.goldDim, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  todayBtnText: { color: C.gold, fontSize: 13, fontWeight: "700" },
  dateNav: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1, justifyContent: "flex-end" },
  navArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.card, alignItems: "center", justifyContent: "center" },
  navArrowText: { color: C.white, fontSize: 22, fontWeight: "600", marginTop: -2 },
  dateNavText: { color: C.white, fontSize: 13, fontWeight: "600" },

  // Kalender
  calContainer: { height: 140, minHeight: 140, flexGrow: 0, overflow: "visible" as any },
  calRow: { gap: DAY_GAP, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 6, alignItems: "flex-end" as any },
  calDay: {
    width: DAY_WIDTH, height: 120, borderRadius: 14, borderWidth: 1, borderColor: C.border,
    backgroundColor: C.card, paddingHorizontal: 4, paddingVertical: 6, alignItems: "center" as any, justifyContent: "center" as any, gap: 2,
  },
  calDaySelected: { backgroundColor: C.gold, borderColor: C.gold },
  calDayVollmond: { borderColor: C.goldLight, borderWidth: 2 },
  calDayNeumond: { borderColor: C.mutedDim, borderWidth: 2 },
  calDayMonth: { fontSize: 9, fontWeight: "700", color: C.gold, letterSpacing: 0.5 },
  calDayWeekday: { fontSize: 12, fontWeight: "700", color: C.silver, lineHeight: 16 },
  calDayNum: { fontSize: 17, fontWeight: "700", color: C.white, lineHeight: 22 },
  calDayEmoji: { fontSize: 16 },
  calDayTextDark: { color: "#0A0E1A" },
  calTodayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.gold, marginTop: 1 },
  calDayLabel: { fontSize: 8, fontWeight: "800", color: C.gold, marginTop: 1 },

  // Scroll-Content
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

  // Hero
  heroCard: {
    backgroundColor: C.card, borderRadius: 24, padding: 20,
    alignItems: "center", marginBottom: 16, marginTop: 8,
    borderWidth: 1, borderColor: C.border,
  },
  heroEmoji: { fontSize: 80, marginBottom: 8 },
  heroTitle: { color: C.gold, fontSize: 28, fontWeight: "800", marginBottom: 4, fontFamily: "DancingScript" },
  heroZodiac: { color: C.white, fontSize: 16, fontWeight: "600", marginBottom: 2 },
  heroElement: { color: C.muted, fontSize: 13, marginBottom: 12 },

  // Exakte Phase heute
  exaktHeuteBox: {
    backgroundColor: C.goldDim, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8,
    marginBottom: 12,
  },
  exaktHeuteText: { color: C.gold, fontSize: 14, fontWeight: "700", textAlign: "center" },

  illuminationContainer: { width: "100%", alignItems: "center", marginBottom: 12 },
  illuminationBar: {
    width: "80%", height: 8, backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4, marginBottom: 6, overflow: "hidden",
  },
  illuminationFill: { height: "100%", backgroundColor: C.gold, borderRadius: 4 },
  illuminationText: { color: C.muted, fontSize: 13, fontWeight: "600" },

  directionRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  directionBadge: {
    backgroundColor: "rgba(212,168,83,0.15)", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  directionText: { color: C.gold, fontSize: 12, fontWeight: "700" },

  // Nächste Hauptphasen
  nextPhasesRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  nextPhaseCard: {
    flex: 1, backgroundColor: C.card, borderRadius: 18, padding: 14,
    alignItems: "center", borderWidth: 1, borderColor: C.border,
  },
  nextPhaseEmoji: { fontSize: 32, marginBottom: 4 },
  nextPhaseLabel: { fontSize: 13, fontWeight: "700", color: C.white, marginBottom: 2 },
  nextPhaseDate: { fontSize: 15, fontWeight: "800", color: C.gold, marginBottom: 2, textAlign: "center" },
  nextPhaseTime: { fontSize: 12, color: C.muted },
  nextPhaseCountdown: { fontSize: 11, color: C.gold, fontWeight: "600", marginTop: 4 },

  // Tagesqualität
  qualityCard: {
    backgroundColor: C.card, borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: "700", color: C.gold,
    letterSpacing: 1.5, marginBottom: 8,
  },
  qualityTitle: { fontSize: 18, fontWeight: "700", color: C.white, marginBottom: 6 },
  qualityText: { fontSize: 15, color: C.silver, lineHeight: 22, marginBottom: 12 },
  qualityDivider: { height: 1, backgroundColor: C.border, marginBottom: 12 },
  qualityRow: { flexDirection: "row", gap: 12, paddingVertical: 8 },
  qualityIcon: { fontSize: 20, marginTop: 2 },
  qualityContent: { flex: 1 },
  qualitySubLabel: {
    fontSize: 10, fontWeight: "700", color: C.muted,
    letterSpacing: 0.5, marginBottom: 2,
  },
  qualityValue: { fontSize: 14, color: C.silver, lineHeight: 20 },
  qualityTipp: { fontSize: 12, color: C.muted, lineHeight: 18, marginTop: 2, fontStyle: "italic" },

  // Tages-Tipps
  tippSection: {
    backgroundColor: C.card, borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
  },
  tippSubtitle: { fontSize: 14, color: C.silver, marginBottom: 14 },
  tippCard: {
    flexDirection: "row", alignItems: "center", paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: C.border, gap: 10,
  },
  tippIcon: { fontSize: 20, width: 28, textAlign: "center" },
  tippContent: { flex: 1 },
  tippKategorie: { fontSize: 12, fontWeight: "700", color: C.gold, marginBottom: 2 },
  tippText: { fontSize: 13, color: C.silver, lineHeight: 18 },
  tippBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  tippBadgeText: { fontSize: 10, fontWeight: "700" },

  // Section Title
  sectionTitle: { fontSize: 18, fontWeight: "700", color: C.white, marginBottom: 12, marginTop: 8 },

  // Mondphasen-Guide
  phaseGuideCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: C.card,
    borderRadius: 12, borderWidth: 1, borderColor: C.border,
    padding: 12, marginBottom: 8, gap: 12,
  },
  phaseGuideEmoji: { fontSize: 32 },
  phaseGuideContent: { flex: 1 },
  phaseGuideName: { fontSize: 15, fontWeight: "700", color: C.white, marginBottom: 2 },
  phaseGuideDesc: { fontSize: 13, color: C.muted, lineHeight: 18 },

  // Exakte Mondphasen-Daten
  exaktSection: {
    backgroundColor: C.card, borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
  },
  exaktSubtitle: { fontSize: 13, color: C.muted, marginBottom: 14 },
  exaktCard: {
    flexDirection: "row", alignItems: "center", paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: C.border, gap: 12,
  },
  exaktEmoji: { fontSize: 28 },
  exaktContent: { flex: 1 },
  exaktName: { fontSize: 14, fontWeight: "700", color: C.white, marginBottom: 2 },
  exaktDatum: { fontSize: 13, color: C.silver },
  exaktZeit: { fontSize: 14, fontWeight: "700", color: C.gold },
});
