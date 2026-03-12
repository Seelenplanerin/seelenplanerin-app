import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Platform,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface Session {
  id: string;
  name: string;
  dauer: string;
  preis: string;
  beschreibung: string;
  details: string[];
  emoji: string;
  badge?: string;
  bookingUrl: string;
}

const SESSIONS: Session[] = [
  {
    id: "soul-talk",
    name: "Soul Talk",
    dauer: "30 Min",
    preis: "Kostenlos",
    beschreibung: "Dein erster Schritt in die Welt der Seelenplanerin. Die Seelenplanerin hört dir zu und gibt dir erste Impulse.",
    details: [
      "Kostenloses Kennenlerngespräch",
      "30 Minuten via Zoom",
      "Erste spirituelle Impulse",
      "Kein Commitment nötig",
    ],
    emoji: "🎁",
    badge: "Gratis",
    bookingUrl: "https://calendly.com/hallo-seelenplanerin/30min",
  },
  {
    id: "aura-reading",
    name: "Aura Reading",
    dauer: "Online",
    preis: "77,00 €",
    beschreibung: "Die Seelenplanerin liest deine Aura und gibt dir tiefe Einblicke in deine Energiefelder, Blockaden und Potenziale.",
    details: [
      "Persönliches Aura-Reading",
      "Analyse deiner Energiefelder",
      "Aufdeckung von Blockaden",
      "Konkrete Handlungsempfehlungen",
      "Online via Zoom",
    ],
    emoji: "🌈",
    badge: "Beliebt",
    bookingUrl: "https://dieseelenplanerin.tentary.com/p/TuOzYS",
  },

  {
    id: "seelenreset",
    name: "Seelenreset",
    dauer: "Programm",
    preis: "Auf Anfrage",
    beschreibung: "Das intensive Transformationsprogramm für Frauen, die bereit sind, ihr Leben von Grund auf neu auszurichten.",
    details: [
      "Mehrwöchiges Intensiv-Programm",
      "Wöchentliche 1:1 Sessions",
      "Runen-Armband inklusive",
      "Persönlicher Ritualplan",
      "Community-Zugang",
      "Lebenslanger Zugang zu Materialien",
    ],
    emoji: "🔮",
    badge: "Premium",
    bookingUrl: "https://www.instagram.com/die.seelenplanerin/",
  },
];

// Einfacher Kalender für die nächsten 14 Tage
function generateDays() {
  const days = [];
  const today = new Date();
  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d,
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      available: d.getDay() !== 0 && d.getDay() !== 6, // Wochentage verfügbar
    });
  }
  return days;
}

const DAYS = generateDays();

const TIME_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"];

export default function BuchenScreen() {
  const colors = useColors();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const session = SESSIONS.find((s) => s.id === selectedSession);

  const s = StyleSheet.create({
    header: { padding: 20, paddingBottom: 8 },
    backBtn: { marginBottom: 8 },
    backText: { fontSize: 24, color: colors.primary },
    title: { fontSize: 28, fontWeight: "700", color: "#3D2B1F" },
    subtitle: { fontSize: 15, color: "#9C7B6E", marginTop: 4, marginBottom: 4, fontStyle: "italic" },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#3D2B1F", marginBottom: 12, paddingHorizontal: 20 },
    sessionCard: {
      marginHorizontal: 16, marginBottom: 10, borderRadius: 20, padding: 16,
      borderWidth: 1.5, borderColor: "#EDD9D0", backgroundColor: "#FFF0EB",
    },
    sessionCardSelected: { borderColor: "#C4826A", backgroundColor: "#F9E0D8" },
    sessionTop: { flexDirection: "row", alignItems: "flex-start" },
    sessionEmoji: { fontSize: 32, marginRight: 12 },
    sessionInfo: { flex: 1 },
    sessionBadge: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start", marginBottom: 4 },
    sessionBadgeText: { fontSize: 11, color: "#fff", fontWeight: "700" },
    sessionName: { fontSize: 18, fontWeight: "700", color: colors.foreground },
    sessionMeta: { fontSize: 13, color: colors.muted, marginTop: 2 },
    sessionDesc: { fontSize: 14, color: colors.muted, lineHeight: 20, marginTop: 8 },
    sessionDetails: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
    detailItem: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
    detailText: { fontSize: 13, color: colors.foreground, marginLeft: 6 },
    calendarRow: { paddingHorizontal: 16, marginBottom: 4 },
    dayBtn: {
      alignItems: "center", paddingVertical: 10, paddingHorizontal: 12,
      borderRadius: 14, borderWidth: 1.5, borderColor: colors.border,
      marginRight: 8, backgroundColor: colors.surface, minWidth: 52,
    },
    dayBtnSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
    dayBtnDisabled: { opacity: 0.35 },
    dayName: { fontSize: 11, color: colors.muted, fontWeight: "600", textTransform: "uppercase" },
    dayNameSelected: { color: "#fff" },
    dayNum: { fontSize: 18, fontWeight: "700", color: colors.foreground, marginTop: 2 },
    dayNumSelected: { color: "#fff" },
    timeGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 8, marginBottom: 8 },
    timeBtn: {
      paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
      borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface,
    },
    timeBtnSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
    timeText: { fontSize: 15, color: colors.foreground, fontWeight: "600" },
    timeTextSelected: { color: "#fff" },
    bookBtn: {
      backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16,
      alignItems: "center", marginHorizontal: 16, marginTop: 8, marginBottom: 32,
    },
    bookBtnDisabled: { opacity: 0.4 },
    bookBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
    divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16, marginVertical: 16 },
    laraNote: {
      backgroundColor: colors.primary + "10", borderRadius: 16, padding: 16,
      marginHorizontal: 16, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: colors.primary,
    },
    laraNoteText: { fontSize: 14, color: colors.foreground, lineHeight: 22, fontStyle: "italic" },
  });

  const handleBook = () => {
    if (!session) return;
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Linking.openURL(session.bookingUrl);
  };

  return (
    <ScreenContainer>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Session buchen</Text>
        <Text style={s.subtitle}>Wähle deine Session und deinen Wunschtermin</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Lara-Notiz */}
        <View style={s.laraNote}>
          <Text style={s.laraNoteText}>
            "Ich freue mich darauf, dich auf deinem Weg zu begleiten. Jede Session ist einzigartig und wird von Herzen für dich gestaltet." – Die Seelenplanerin 🌙
          </Text>
        </View>

        {/* Session auswählen */}
        <Text style={s.sectionTitle}>1. Session wählen</Text>
        {SESSIONS.map((sess) => (
          <TouchableOpacity
            key={sess.id}
            style={[s.sessionCard, selectedSession === sess.id && s.sessionCardSelected]}
            onPress={() => {
              setSelectedSession(sess.id);
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.8}
          >
            <View style={s.sessionTop}>
              <Text style={s.sessionEmoji}>{sess.emoji}</Text>
              <View style={s.sessionInfo}>
                {sess.badge && (
                  <View style={s.sessionBadge}>
                    <Text style={s.sessionBadgeText}>{sess.badge}</Text>
                  </View>
                )}
                <Text style={s.sessionName}>{sess.name}</Text>
                <Text style={s.sessionMeta}>{sess.dauer} · {sess.preis}</Text>
              </View>
            </View>
            <Text style={s.sessionDesc}>{sess.beschreibung}</Text>
            {selectedSession === sess.id && (
              <View style={s.sessionDetails}>
                {sess.details.map((d, i) => (
                  <View key={i} style={s.detailItem}>
                    <Text style={{ color: colors.primary }}>✓</Text>
                    <Text style={s.detailText}>{d}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={s.divider} />

        {/* Datum wählen */}
        <Text style={s.sectionTitle}>2. Datum wählen</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.calendarRow} contentContainerStyle={{ paddingRight: 16 }}>
          {DAYS.map((day, i) => (
            <TouchableOpacity
              key={i}
              style={[s.dayBtn, selectedDay === i && s.dayBtnSelected, !day.available && s.dayBtnDisabled]}
              onPress={() => day.available && setSelectedDay(i)}
              disabled={!day.available}
              activeOpacity={0.7}
            >
              <Text style={[s.dayName, selectedDay === i && s.dayNameSelected]}>{day.dayName}</Text>
              <Text style={[s.dayNum, selectedDay === i && s.dayNumSelected]}>{day.dayNum}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={s.divider} />

        {/* Uhrzeit wählen */}
        <Text style={s.sectionTitle}>3. Uhrzeit wählen</Text>
        <View style={s.timeGrid}>
          {TIME_SLOTS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[s.timeBtn, selectedTime === time && s.timeBtnSelected]}
              onPress={() => setSelectedTime(time)}
              activeOpacity={0.7}
            >
              <Text style={[s.timeText, selectedTime === time && s.timeTextSelected]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.divider} />

        {/* Buchungs-Button */}
        <TouchableOpacity
          style={[s.bookBtn, (!selectedSession || selectedDay === null || !selectedTime) && s.bookBtnDisabled]}
          onPress={handleBook}
          disabled={!selectedSession || selectedDay === null || !selectedTime}
          activeOpacity={0.8}
        >
          <Text style={s.bookBtnText}>
            {selectedSession && selectedDay !== null && selectedTime
              ? `${session?.name} buchen – ${session?.preis} ✨`
              : "Bitte alle Felder ausfüllen"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
