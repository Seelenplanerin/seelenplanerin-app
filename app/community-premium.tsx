import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import { MoonIcon } from "@/components/moon-icon";
import {
  getMoonPhaseForDate,
  getMoonZodiac,
  getMoonIllumination,
  isMoonWaxing,
  getNextVollmond,
  getNextNeumond,
  MOON_PHASES,
} from "@/lib/moon-phase";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
  purple: "#9B7CB8", purpleLight: "#F3EDF8", purpleDim: "rgba(155,124,184,0.15)",
};

const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

// ── Mondphase & Weiblicher Zyklus ──
const ZYKLUS_PHASEN = [
  {
    mondphase: "Neumond",
    zyklusphase: "Menstruation",
    emoji: "🌑",
    beschreibung: "Rückzug und Erneuerung",
    details: "Wie der Neumond ist die Menstruation eine Zeit des Rückzugs und der inneren Einkehr. Dein Körper reinigt sich und bereitet sich auf einen neuen Zyklus vor. Gönne dir Ruhe, warme Tees und sanfte Bewegung.",
    tipps: ["Wärmflasche auf den Bauch", "Tagebuch schreiben", "Leichte Yoga-Übungen", "Kräutertee (Frauenmantel, Schafgarbe)"],
    farbe: "#6B7280",
  },
  {
    mondphase: "Zunehmender Mond",
    zyklusphase: "Follikelphase",
    emoji: "🌒",
    beschreibung: "Aufbruch und neue Energie",
    details: "Wie der zunehmende Mond wächst deine Energie in der Follikelphase. Östrogen steigt, du fühlst dich kreativer und offener. Nutze diese Phase für neue Projekte und soziale Aktivitäten.",
    tipps: ["Neue Projekte starten", "Sport und Bewegung intensivieren", "Kreative Arbeit", "Soziale Kontakte pflegen"],
    farbe: "#10B981",
  },
  {
    mondphase: "Vollmond",
    zyklusphase: "Eisprung",
    emoji: "🌕",
    beschreibung: "Höhepunkt und Ausstrahlung",
    details: "Der Vollmond spiegelt den Eisprung wider – deine Energie ist auf dem Höhepunkt. Du strahlst, bist kommunikativ und magnetisch. Nutze diese kraftvolle Zeit für wichtige Gespräche und Manifestation.",
    tipps: ["Wichtige Gespräche führen", "Manifestations-Rituale", "Vollmond-Bad mit Rosenblüten", "Dankbarkeits-Meditation"],
    farbe: "#F59E0B",
  },
  {
    mondphase: "Abnehmender Mond",
    zyklusphase: "Lutealphase",
    emoji: "🌘",
    beschreibung: "Reflexion und Loslassen",
    details: "Wie der abnehmende Mond zieht sich deine Energie in der Lutealphase zurück. Progesteron steigt, du wirst nachdenklicher und sensibler. Höre auf deinen Körper und lass los, was nicht mehr dient.",
    tipps: ["Räuchern und Reinigen", "Grenzen setzen", "Nährende Ernährung", "Abend-Meditation"],
    farbe: "#8B5CF6",
  },
];

// ── Exklusive Meditationen (Platzhalter – werden von der Seelenplanerin hochgeladen) ──
const PREMIUM_MEDITATIONEN = [
  { id: "pm1", titel: "Neumond-Manifestation", dauer: "15 Min.", emoji: "🌑", beschreibung: "Geführte Meditation für deine Neumond-Intentionen", verfuegbar: false },
  { id: "pm2", titel: "Vollmond-Loslassen", dauer: "20 Min.", emoji: "🌕", beschreibung: "Loslassen und Dankbarkeit unter dem Vollmond", verfuegbar: false },
  { id: "pm3", titel: "Chakra-Reinigung", dauer: "25 Min.", emoji: "🌈", beschreibung: "Alle 7 Chakren reinigen und ausbalancieren", verfuegbar: false },
  { id: "pm4", titel: "Schutzrune Meditation", dauer: "12 Min.", emoji: "🛡️", beschreibung: "Verbinde dich mit deiner persönlichen Schutzrune", verfuegbar: false },
  { id: "pm5", titel: "Weibliche Kraft", dauer: "18 Min.", emoji: "🌸", beschreibung: "Aktiviere deine weibliche Urkraft und Intuition", verfuegbar: false },
  { id: "pm6", titel: "Mondwasser-Zeremonie", dauer: "10 Min.", emoji: "💧", beschreibung: "Anleitung zur Herstellung von Mondwasser", verfuegbar: false },
];

// ── Premium Mondkalender: Exakte Daten ──
function getPremiumMondkalender(): { datum: string; phase: string; uhrzeit: string; tierkreis: string; besonderheit: string }[] {
  const events: { datum: string; phase: string; uhrzeit: string; tierkreis: string; besonderheit: string }[] = [];
  
  // Nächste 3 Monate Hauptphasen
  const now = new Date();
  for (let monat = 0; monat < 3; monat++) {
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() + monat, 1);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1, 0);
    
    // Jeden Tag prüfen
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const phase = getMoonPhaseForDate(d);
      const prevDay = new Date(d);
      prevDay.setDate(d.getDate() - 1);
      const prevPhase = getMoonPhaseForDate(prevDay);
      
      // Nur Phasenwechsel anzeigen
      if (phase.name !== prevPhase.name) {
        const zodiac = getMoonZodiac(d);
        let besonderheit = "";
        if (phase.name === "Vollmond") besonderheit = "Manifestation & Loslassen";
        else if (phase.name === "Neumond") besonderheit = "Intentionen setzen";
        else if (phase.name === "Erstes Viertel") besonderheit = "Entscheidungen treffen";
        else if (phase.name === "Letztes Viertel") besonderheit = "Reinigung & Aufräumen";
        
        events.push({
          datum: d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "long", timeZone: "Europe/Berlin" }),
          phase: phase.name,
          uhrzeit: "",
          tierkreis: `${zodiac.symbol} ${zodiac.name}`,
          besonderheit,
        });
      }
    }
  }
  
  return events;
}

export default function CommunityPremiumScreen() {
  const [tab, setTab] = useState<"kalender" | "zyklus" | "meditation">("kalender");
  const mondkalender = getPremiumMondkalender();

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Premium Inhalte</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Premium Badge */}
        <View style={s.premiumBadge}>
          <Text style={{ fontSize: 22 }}>👑</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.premiumTitle}>Seelenimpuls Premium</Text>
            <Text style={s.premiumSub}>Exklusive Inhalte von der Seelenplanerin</Text>
          </View>
        </View>

        {/* Tab-Navigation */}
        <View style={s.tabRow}>
          {[
            { key: "kalender", label: "Mondkalender" },
            { key: "zyklus", label: "Mond & Zyklus" },
            { key: "meditation", label: "Meditationen" },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[s.tab, tab === t.key && s.tabActive]}
              onPress={() => setTab(t.key as any)}
              activeOpacity={0.8}
            >
              <Text style={[s.tabText, tab === t.key && s.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* ── MONDKALENDER PREMIUM ── */}
          {tab === "kalender" && (
            <View style={s.content}>
              <Text style={s.sectionTitle}>Mondphasen-Kalender</Text>
              <Text style={s.sectionSub}>Alle Phasenwechsel der nächsten 3 Monate mit exakten Daten</Text>

              {mondkalender.map((event, i) => {
                const isVollmond = event.phase === "Vollmond";
                const isNeumond = event.phase === "Neumond";
                return (
                  <View key={i} style={[s.eventCard, isVollmond && s.eventCardGold, isNeumond && s.eventCardDark]}>
                    <View style={s.eventLeft}>
                      <Text style={[s.eventPhase, isVollmond && { color: C.gold }, isNeumond && { color: C.muted }]}>
                        {event.phase}
                      </Text>
                      <Text style={s.eventDatum}>{event.datum}</Text>
                      <Text style={s.eventTierkreis}>{event.tierkreis}</Text>
                    </View>
                    {event.besonderheit ? (
                      <View style={[s.eventBadge, isVollmond && { backgroundColor: C.goldLight }]}>
                        <Text style={[s.eventBadgeText, isVollmond && { color: C.brown }]}>{event.besonderheit}</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}

              {/* Vollmond/Neumond Highlights */}
              <View style={s.highlightCard}>
                <Text style={s.highlightTitle}>Nächster Vollmond</Text>
                <Text style={s.highlightDate}>
                  {getNextVollmond().toLocaleDateString("de-DE", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin",
                  })}
                </Text>
                <Text style={s.highlightTime}>
                  {getNextVollmond().toLocaleTimeString("de-DE", {
                    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
                  })} Uhr (MEZ)
                </Text>
              </View>

              <View style={s.highlightCard}>
                <Text style={s.highlightTitle}>Nächster Neumond</Text>
                <Text style={s.highlightDate}>
                  {getNextNeumond().toLocaleDateString("de-DE", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin",
                  })}
                </Text>
                <Text style={s.highlightTime}>
                  {getNextNeumond().toLocaleTimeString("de-DE", {
                    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
                  })} Uhr (MEZ)
                </Text>
              </View>
            </View>
          )}

          {/* ── MONDPHASE & WEIBLICHER ZYKLUS ── */}
          {tab === "zyklus" && (
            <View style={s.content}>
              <Text style={s.sectionTitle}>Mond & Weiblicher Zyklus</Text>
              <Text style={s.sectionSub}>
                Der weibliche Zyklus und der Mondzyklus sind tief miteinander verbunden. Beide dauern ca. 29,5 Tage und durchlaufen 4 Phasen.
              </Text>

              {ZYKLUS_PHASEN.map((z, i) => (
                <View key={i} style={s.zyklusCard}>
                  <View style={[s.zyklusHeader, { borderLeftColor: z.farbe }]}>
                    <Text style={{ fontSize: 28 }}>{z.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.zyklusMondphase}>{z.mondphase}</Text>
                      <Text style={s.zyklusPhase}>{z.zyklusphase}</Text>
                      <Text style={s.zyklusBeschreibung}>{z.beschreibung}</Text>
                    </View>
                  </View>
                  <Text style={s.zyklusDetails}>{z.details}</Text>
                  <View style={s.zyklusTipps}>
                    {z.tipps.map((tipp, j) => (
                      <View key={j} style={s.zyklusTippItem}>
                        <Text style={s.zyklusTippDot}>•</Text>
                        <Text style={s.zyklusTippText}>{tipp}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              <View style={s.infoBox}>
                <Text style={{ fontSize: 18, marginBottom: 8 }}>🌸</Text>
                <Text style={s.infoBoxTitle}>Dein Zyklus ist einzigartig</Text>
                <Text style={s.infoBoxText}>
                  Nicht jede Frau menstruiert zum Neumond. Das ist völlig normal. Beobachte deinen eigenen Rhythmus und nutze die Mondenergie als zusätzliche Unterstützung für dein Wohlbefinden.
                </Text>
              </View>
            </View>
          )}

          {/* ── EXKLUSIVE MEDITATIONEN ── */}
          {tab === "meditation" && (
            <View style={s.content}>
              <Text style={s.sectionTitle}>Exklusive Meditationen</Text>
              <Text style={s.sectionSub}>
                Geführte Meditationen von der Seelenplanerin – speziell für deinen spirituellen Weg.
              </Text>

              {PREMIUM_MEDITATIONEN.map((med) => (
                <View key={med.id} style={[s.meditationCard, !med.verfuegbar && { opacity: 0.6 }]}>
                  <View style={s.meditationEmoji}>
                    <Text style={{ fontSize: 28 }}>{med.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={s.meditationTitel}>{med.titel}</Text>
                      {!med.verfuegbar && (
                        <View style={s.comingSoonBadge}>
                          <Text style={s.comingSoonText}>Bald verfügbar</Text>
                        </View>
                      )}
                    </View>
                    <Text style={s.meditationBeschreibung}>{med.beschreibung}</Text>
                    <Text style={s.meditationDauer}>{med.dauer}</Text>
                  </View>
                  {med.verfuegbar ? (
                    <Text style={{ fontSize: 20, color: C.rose }}>▶</Text>
                  ) : (
                    <Text style={{ fontSize: 16, color: C.muted }}>🔒</Text>
                  )}
                </View>
              ))}

              <View style={s.infoBox}>
                <Text style={{ fontSize: 18, marginBottom: 8 }}>🎧</Text>
                <Text style={s.infoBoxTitle}>Meditationen werden ergänzt</Text>
                <Text style={s.infoBoxText}>
                  Die Seelenplanerin arbeitet gerade an exklusiven geführten Meditationen für dich. Sie werden nach und nach freigeschaltet. Bleib dran!
                </Text>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: C.roseLight,
    alignItems: "center", justifyContent: "center",
  },
  backIcon: { fontSize: 20, color: C.rose },
  headerTitle: { fontSize: 18, fontWeight: "700", color: C.brown, letterSpacing: 1 },

  premiumBadge: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: C.brown, borderRadius: 16, padding: 16,
    flexDirection: "row", alignItems: "center", gap: 12,
  },
  premiumTitle: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  premiumSub: { fontSize: 12, color: "rgba(255,255,255,0.7)" },

  tabRow: {
    flexDirection: "row", marginHorizontal: 16, marginBottom: 12,
    backgroundColor: C.surface, borderRadius: 12, padding: 3,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: C.card, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  tabText: { fontSize: 12, color: C.muted, fontWeight: "600" },
  tabTextActive: { color: C.brown },

  content: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: C.brown, marginBottom: 6 },
  sectionSub: { fontSize: 14, color: C.muted, lineHeight: 21, marginBottom: 16 },

  // Mondkalender Events
  eventCard: {
    backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: C.border, flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
  },
  eventCardGold: { backgroundColor: C.goldLight, borderColor: "#E8D5B0" },
  eventCardDark: { backgroundColor: C.surface },
  eventLeft: { flex: 1 },
  eventPhase: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 2 },
  eventDatum: { fontSize: 13, color: C.brownMid },
  eventTierkreis: { fontSize: 12, color: C.muted, marginTop: 2 },
  eventBadge: { backgroundColor: C.roseLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, maxWidth: 140 },
  eventBadgeText: { fontSize: 10, fontWeight: "700", color: C.rose, textAlign: "center" },

  highlightCard: {
    backgroundColor: C.goldLight, borderRadius: 16, padding: 18, marginTop: 8, marginBottom: 8,
    borderWidth: 1, borderColor: "#E8D5B0", alignItems: "center",
  },
  highlightTitle: { fontSize: 13, fontWeight: "700", color: C.gold, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" },
  highlightDate: { fontSize: 17, fontWeight: "700", color: C.brown, textAlign: "center" },
  highlightTime: { fontSize: 14, color: C.brownMid, marginTop: 4 },

  // Zyklus
  zyklusCard: {
    backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: C.border,
  },
  zyklusHeader: {
    flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12,
    borderLeftWidth: 3, paddingLeft: 12,
  },
  zyklusMondphase: { fontSize: 12, fontWeight: "700", color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  zyklusPhase: { fontSize: 17, fontWeight: "700", color: C.brown, marginBottom: 2 },
  zyklusBeschreibung: { fontSize: 13, color: C.rose, fontWeight: "600" },
  zyklusDetails: { fontSize: 14, color: C.brownMid, lineHeight: 21, marginBottom: 12 },
  zyklusTipps: { gap: 6 },
  zyklusTippItem: { flexDirection: "row", gap: 8 },
  zyklusTippDot: { color: C.rose, fontSize: 14, fontWeight: "700" },
  zyklusTippText: { fontSize: 13, color: C.brownMid, lineHeight: 19, flex: 1 },

  // Info Box
  infoBox: {
    backgroundColor: C.roseLight, borderRadius: 16, padding: 18, marginTop: 8,
    borderWidth: 1, borderColor: C.rose + "30", alignItems: "center",
  },
  infoBoxTitle: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 6, textAlign: "center" },
  infoBoxText: { fontSize: 13, color: C.brownMid, lineHeight: 20, textAlign: "center" },

  // Meditationen
  meditationCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: C.card,
    borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: C.border,
  },
  meditationEmoji: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: C.roseLight,
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  meditationTitel: { fontSize: 15, fontWeight: "700", color: C.brown },
  meditationBeschreibung: { fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 17 },
  meditationDauer: { fontSize: 11, color: C.rose, fontWeight: "600", marginTop: 4 },
  comingSoonBadge: { backgroundColor: C.goldLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  comingSoonText: { fontSize: 10, fontWeight: "700", color: C.gold },
});
