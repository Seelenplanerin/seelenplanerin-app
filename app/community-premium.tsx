import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
  Alert, Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import {
  getMoonPhaseForDate,
  getMoonZodiac,
  getMoonIllumination,
  isMoonWaxing,
  getNextVollmond,
  getNextNeumond,
  getExakteHauptphasen,
  MOON_PHASES,
  type ExaktePhase,
} from "@/lib/moon-phase";
import {
  ZyklusEinstellungen,
  ZyklusTag,
  ZyklusUebersicht,
  berechneZyklusTag,
  berechneZyklusUebersicht,
  berechneZyklusKalender,
  speichereZyklusEinstellungen,
  ladeZyklusEinstellungen,
  getDefaultEinstellungen,
} from "@/lib/zyklus-tracker";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
  purple: "#9B7CB8", purpleLight: "#F3EDF8",
  red: "#E74C3C", green: "#27AE60", orange: "#F39C12", violet: "#8E44AD",
};

const WOCHENTAGE_KURZ = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

// ── Exklusive Meditationen (Platzhalter) ──
const PREMIUM_MEDITATIONEN = [
  { id: "pm1", titel: "Neumond-Manifestation", dauer: "15 Min.", emoji: "🌑", beschreibung: "Geführte Meditation für deine Neumond-Intentionen", verfuegbar: false },
  { id: "pm2", titel: "Vollmond-Loslassen", dauer: "20 Min.", emoji: "🌕", beschreibung: "Loslassen und Dankbarkeit unter dem Vollmond", verfuegbar: false },
  { id: "pm3", titel: "Chakra-Reinigung", dauer: "25 Min.", emoji: "🌈", beschreibung: "Alle 7 Chakren reinigen und ausbalancieren", verfuegbar: false },
  { id: "pm4", titel: "Schutzrune Meditation", dauer: "12 Min.", emoji: "🛡️", beschreibung: "Verbinde dich mit deiner persönlichen Schutzrune", verfuegbar: false },
  { id: "pm5", titel: "Weibliche Kraft", dauer: "18 Min.", emoji: "🌸", beschreibung: "Aktiviere deine weibliche Urkraft und Intuition", verfuegbar: false },
  { id: "pm6", titel: "Mondwasser-Zeremonie", dauer: "10 Min.", emoji: "💧", beschreibung: "Anleitung zur Herstellung von Mondwasser", verfuegbar: false },
];

// ── Premium Mondkalender mit EXAKTEN astronomischen Daten ──
function getPremiumMondkalender() {
  const alleExakt = getExakteHauptphasen();
  const now = new Date();
  // Zeige alle Phasen des aktuellen Jahres (2026)
  return alleExakt.map((phase) => {
    const zodiac = getMoonZodiac(phase.datum);
    let besonderheit = "";
    if (phase.name === "Vollmond") besonderheit = "Manifestation & Loslassen";
    else if (phase.name === "Neumond") besonderheit = "Intentionen setzen";
    else if (phase.name === "Erstes Viertel") besonderheit = "Entscheidungen treffen";
    else if (phase.name === "Letztes Viertel") besonderheit = "Reinigung & Aufräumen";
    const zeitStr = phase.datum.toLocaleTimeString("de-DE", {
      hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
    });
    return {
      datum: phase.datum.toLocaleDateString("de-DE", {
        weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin",
      }),
      phase: phase.name,
      emoji: phase.emoji,
      tierkreis: `${zodiac.symbol} ${zodiac.name}`,
      besonderheit,
      zeit: `${zeitStr} Uhr`,
      istVergangen: phase.datum.getTime() < now.getTime(),
    };
  });
}

// ── Synchronisations-Farbe ──
function getSyncFarbe(typ: string): string {
  if (typ === "harmonisch") return C.green;
  if (typ === "gegenläufig") return C.orange;
  return C.muted;
}

function getSyncLabel(typ: string): string {
  if (typ === "harmonisch") return "Im Einklang";
  if (typ === "gegenläufig") return "Gegenläufig";
  return "Neutral";
}

export default function CommunityPremiumScreen() {
  const [tab, setTab] = useState<"kalender" | "zyklus" | "meditation">("kalender");
  const [zyklusEinstellungen, setZyklusEinstellungen] = useState<ZyklusEinstellungen | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [setupDatum, setSetupDatum] = useState("");
  const [setupLaenge, setSetupLaenge] = useState("28");
  const [setupDauer, setSetupDauer] = useState("5");
  const mondkalender = getPremiumMondkalender();

  // Zyklusdaten laden
  useEffect(() => {
    ladeZyklusEinstellungen().then((data) => {
      if (data) {
        setZyklusEinstellungen(data);
      }
    });
  }, []);

  const speichern = useCallback(async () => {
    if (!setupDatum || !setupDatum.match(/^\d{4}-\d{2}-\d{2}$/)) {
      if (Platform.OS === "web") {
        alert("Bitte gib ein gültiges Datum ein (JJJJ-MM-TT)");
      } else {
        Alert.alert("Ungültiges Datum", "Bitte gib ein gültiges Datum ein (JJJJ-MM-TT)");
      }
      return;
    }
    const einstellungen: ZyklusEinstellungen = {
      letztePeriodenStart: setupDatum,
      zyklusLaenge: parseInt(setupLaenge) || 28,
      periodenDauer: parseInt(setupDauer) || 5,
    };
    await speichereZyklusEinstellungen(einstellungen);
    setZyklusEinstellungen(einstellungen);
    setShowSetup(false);
  }, [setupDatum, setupLaenge, setupDauer]);

  // Zyklus-Daten berechnen
  const heute = new Date();
  const heuteTag = zyklusEinstellungen ? berechneZyklusTag(heute, zyklusEinstellungen) : null;
  const uebersicht = zyklusEinstellungen ? berechneZyklusUebersicht(heute, zyklusEinstellungen) : null;
  const kalenderTage = zyklusEinstellungen ? berechneZyklusKalender(heute, 30, zyklusEinstellungen) : [];

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
          {/* ══════════════════════════════════════════════ */}
          {/* ── MONDKALENDER PREMIUM ── */}
          {/* ══════════════════════════════════════════════ */}
          {tab === "kalender" && (
            <View style={s.content}>
              <Text style={s.sectionTitle}>Mondphasen-Kalender</Text>
              <Text style={s.sectionSub}>Alle exakten Mondphasen 2026 (astronomisch verifiziert)</Text>

              {mondkalender.map((event, i) => {
                const isVollmond = event.phase === "Vollmond";
                const isNeumond = event.phase === "Neumond";
                return (
                  <View key={i} style={[
                    s.eventCard,
                    isVollmond && s.eventCardGold,
                    isNeumond && s.eventCardDark,
                    event.istVergangen && { opacity: 0.5 },
                  ]}>
                    <Text style={{ fontSize: 28, marginRight: 12 }}>{event.emoji}</Text>
                    <View style={s.eventLeft}>
                      <Text style={[s.eventPhase, isVollmond && { color: C.gold }, isNeumond && { color: C.muted }]}>
                        {event.phase}
                      </Text>
                      <Text style={s.eventDatum}>{event.datum}</Text>
                      <Text style={s.eventTierkreis}>{event.tierkreis}</Text>
                      <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{event.zeit}</Text>
                    </View>
                    {event.besonderheit ? (
                      <View style={[s.eventBadge, isVollmond && { backgroundColor: C.goldLight }]}>
                        <Text style={[s.eventBadgeText, isVollmond && { color: C.brown }]}>{event.besonderheit}</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}

              <View style={s.highlightCard}>
                <Text style={s.highlightTitle}>Nächster Vollmond</Text>
                <Text style={s.highlightDate}>
                  {getNextVollmond().toLocaleDateString("de-DE", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin",
                  })}
                </Text>
              </View>
              <View style={s.highlightCard}>
                <Text style={s.highlightTitle}>Nächster Neumond</Text>
                <Text style={s.highlightDate}>
                  {getNextNeumond().toLocaleDateString("de-DE", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin",
                  })}
                </Text>
              </View>
            </View>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* ── MOND & ZYKLUS TRACKING ── */}
          {/* ══════════════════════════════════════════════ */}
          {tab === "zyklus" && (
            <View style={s.content}>
              <Text style={s.sectionTitle}>Mond & Weiblicher Zyklus</Text>
              <Text style={s.sectionSub}>
                Verfolge deinen Zyklus und entdecke, wie er mit den Mondphasen zusammenwirkt.
              </Text>

              {/* ── Setup / Einstellungen ── */}
              {(!zyklusEinstellungen || showSetup) ? (
                <View style={s.setupCard}>
                  <Text style={s.setupTitle}>
                    {zyklusEinstellungen ? "Zyklusdaten anpassen" : "Zyklustracking einrichten"}
                  </Text>
                  <Text style={s.setupSub}>
                    Gib deine Daten ein, um deinen Zyklus mit den Mondphasen zu synchronisieren.
                  </Text>

                  <View style={s.inputGroup}>
                    <Text style={s.inputLabel}>Letzter Periodenstart</Text>
                    <TextInput
                      style={s.input}
                      placeholder="JJJJ-MM-TT (z.B. 2026-02-15)"
                      placeholderTextColor={C.muted}
                      value={setupDatum}
                      onChangeText={setSetupDatum}
                      returnKeyType="done"
                    />
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={[s.inputGroup, { flex: 1 }]}>
                      <Text style={s.inputLabel}>Zykluslänge (Tage)</Text>
                      <TextInput
                        style={s.input}
                        placeholder="28"
                        placeholderTextColor={C.muted}
                        value={setupLaenge}
                        onChangeText={setSetupLaenge}
                        keyboardType="number-pad"
                        returnKeyType="done"
                      />
                    </View>
                    <View style={[s.inputGroup, { flex: 1 }]}>
                      <Text style={s.inputLabel}>Periodendauer (Tage)</Text>
                      <TextInput
                        style={s.input}
                        placeholder="5"
                        placeholderTextColor={C.muted}
                        value={setupDauer}
                        onChangeText={setSetupDauer}
                        keyboardType="number-pad"
                        returnKeyType="done"
                      />
                    </View>
                  </View>

                  <TouchableOpacity style={s.saveBtn} onPress={speichern} activeOpacity={0.85}>
                    <Text style={s.saveBtnText}>Speichern & Synchronisieren</Text>
                  </TouchableOpacity>

                  {zyklusEinstellungen && (
                    <TouchableOpacity
                      style={s.cancelBtn}
                      onPress={() => setShowSetup(false)}
                      activeOpacity={0.8}
                    >
                      <Text style={s.cancelBtnText}>Abbrechen</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <>
                  {/* ── Aktuelle Übersicht ── */}
                  {uebersicht && heuteTag && (
                    <>
                      {/* Hauptkarte: Aktueller Status */}
                      <View style={[s.statusCard, { borderLeftColor: heuteTag.phase.farbe }]}>
                        <View style={s.statusHeader}>
                          <View style={[s.phaseCircle, { backgroundColor: heuteTag.phase.farbe + "20" }]}>
                            <Text style={{ fontSize: 28 }}>{heuteTag.phase.emoji}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={s.statusPhase}>{heuteTag.phase.label}</Text>
                            <Text style={s.statusTag}>Zyklustag {uebersicht.aktuellerTag}</Text>
                            <Text style={s.statusBeschreibung}>{heuteTag.phase.beschreibung}</Text>
                          </View>
                        </View>

                        {/* Zyklusfortschritt */}
                        <View style={s.progressContainer}>
                          <View style={s.progressBar}>
                            <View
                              style={[
                                s.progressFill,
                                {
                                  width: `${(uebersicht.aktuellerTag / zyklusEinstellungen.zyklusLaenge) * 100}%`,
                                  backgroundColor: heuteTag.phase.farbe,
                                },
                              ]}
                            />
                          </View>
                          <Text style={s.progressText}>
                            Tag {uebersicht.aktuellerTag} von {zyklusEinstellungen.zyklusLaenge}
                          </Text>
                        </View>
                      </View>

                      {/* Synchronisation Mond & Zyklus */}
                      <View style={[s.syncCard, { borderColor: getSyncFarbe(heuteTag.synchronisation) + "40" }]}>
                        <View style={s.syncHeader}>
                          <View style={s.syncIcons}>
                            <Text style={{ fontSize: 22 }}>{heuteTag.phase.emoji}</Text>
                            <Text style={{ fontSize: 14, color: C.muted }}>⟷</Text>
                            <Text style={{ fontSize: 22 }}>{heuteTag.mondEmoji}</Text>
                          </View>
                          <View style={[s.syncBadge, { backgroundColor: getSyncFarbe(heuteTag.synchronisation) + "20" }]}>
                            <View style={[s.syncDot, { backgroundColor: getSyncFarbe(heuteTag.synchronisation) }]} />
                            <Text style={[s.syncBadgeText, { color: getSyncFarbe(heuteTag.synchronisation) }]}>
                              {getSyncLabel(heuteTag.synchronisation)}
                            </Text>
                          </View>
                        </View>
                        <Text style={s.syncTitle}>
                          {heuteTag.phase.label} + {heuteTag.mondphase}
                        </Text>
                        <Text style={s.syncTipp}>{heuteTag.synchronisationTipp}</Text>
                      </View>

                      {/* Schnellinfo-Karten */}
                      <View style={s.quickInfoRow}>
                        <View style={s.quickInfoCard}>
                          <Text style={s.quickInfoEmoji}>🩸</Text>
                          <Text style={s.quickInfoLabel}>Nächste Periode</Text>
                          <Text style={s.quickInfoValue}>in {uebersicht.tageZurNaechstenPeriode} Tagen</Text>
                        </View>
                        <View style={s.quickInfoCard}>
                          <Text style={s.quickInfoEmoji}>→</Text>
                          <Text style={s.quickInfoLabel}>Nächste Phase</Text>
                          <Text style={s.quickInfoValue}>
                            {uebersicht.naechstePhase.label}{"\n"}
                            <Text style={{ fontSize: 11, color: C.muted }}>in {uebersicht.tageZurNaechstenPhase} Tagen</Text>
                          </Text>
                        </View>
                      </View>

                      {/* 30-Tage Mond-Zyklus-Kalender */}
                      <Text style={[s.sectionTitle, { marginTop: 20 }]}>Nächste 30 Tage</Text>
                      <Text style={s.sectionSub}>Dein Zyklus synchronisiert mit dem Mond</Text>

                      {kalenderTage.map((tag, i) => {
                        const isHeute = tag.datum.toDateString() === heute.toDateString();
                        return (
                          <View
                            key={i}
                            style={[
                              s.kalenderRow,
                              isHeute && s.kalenderRowHeute,
                            ]}
                          >
                            {/* Datum */}
                            <View style={s.kalenderDatum}>
                              <Text style={[s.kalenderWochentag, isHeute && { color: C.rose, fontWeight: "700" }]}>
                                {WOCHENTAGE_KURZ[tag.datum.getDay()]}
                              </Text>
                              <Text style={[s.kalenderTag, isHeute && { color: C.rose }]}>
                                {tag.datum.getDate()}.{tag.datum.getMonth() + 1}.
                              </Text>
                            </View>

                            {/* Zyklusphase */}
                            <View style={[s.kalenderPhase, { backgroundColor: tag.phase.farbe + "15" }]}>
                              <Text style={{ fontSize: 14 }}>{tag.phase.emoji}</Text>
                              <Text style={[s.kalenderPhaseText, { color: tag.phase.farbe }]}>
                                Tag {tag.zyklusTag}
                              </Text>
                            </View>

                            {/* Mondphase */}
                            <View style={s.kalenderMond}>
                              <Text style={{ fontSize: 14 }}>{tag.mondEmoji}</Text>
                              <Text style={s.kalenderMondText}>{tag.mondBeleuchtung}%</Text>
                            </View>

                            {/* Sync-Indikator */}
                            <View style={[s.kalenderSync, { backgroundColor: getSyncFarbe(tag.synchronisation) + "20" }]}>
                              <View style={[s.kalenderSyncDot, { backgroundColor: getSyncFarbe(tag.synchronisation) }]} />
                            </View>
                          </View>
                        );
                      })}

                      {/* Legende */}
                      <View style={s.legendeCard}>
                        <Text style={s.legendeTitle}>Legende</Text>
                        <View style={s.legendeRow}>
                          <View style={[s.legendeDot, { backgroundColor: C.green }]} />
                          <Text style={s.legendeText}>Im Einklang – Mond und Zyklus harmonieren</Text>
                        </View>
                        <View style={s.legendeRow}>
                          <View style={[s.legendeDot, { backgroundColor: C.muted }]} />
                          <Text style={s.legendeText}>Neutral – keine besondere Wechselwirkung</Text>
                        </View>
                        <View style={s.legendeRow}>
                          <View style={[s.legendeDot, { backgroundColor: C.orange }]} />
                          <Text style={s.legendeText}>Gegenläufig – bewusste Balance finden</Text>
                        </View>
                      </View>

                      {/* Einstellungen ändern */}
                      <TouchableOpacity
                        style={s.editBtn}
                        onPress={() => {
                          setSetupDatum(zyklusEinstellungen.letztePeriodenStart);
                          setSetupLaenge(String(zyklusEinstellungen.zyklusLaenge));
                          setSetupDauer(String(zyklusEinstellungen.periodenDauer));
                          setShowSetup(true);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={s.editBtnText}>Zyklusdaten anpassen</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Allgemeine Zyklus-Mond-Info */}
                  <View style={s.infoBox}>
                    <Text style={{ fontSize: 18, marginBottom: 8 }}>🌸</Text>
                    <Text style={s.infoBoxTitle}>Dein Zyklus ist einzigartig</Text>
                    <Text style={s.infoBoxText}>
                      Nicht jede Frau menstruiert zum Neumond. Das ist völlig normal. Beobachte deinen eigenen Rhythmus und nutze die Mondenergie als zusätzliche Unterstützung.
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* ── EXKLUSIVE MEDITATIONEN ── */}
          {/* ══════════════════════════════════════════════ */}
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
                  Die Seelenplanerin arbeitet gerade an exklusiven geführten Meditationen für dich. Sie werden nach und nach freigeschaltet.
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

  // ── Zyklustracking Setup ──
  setupCard: {
    backgroundColor: C.card, borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
  },
  setupTitle: { fontSize: 18, fontWeight: "700", color: C.brown, marginBottom: 6 },
  setupSub: { fontSize: 14, color: C.muted, lineHeight: 21, marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: "700", color: C.brownMid, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  input: {
    backgroundColor: C.surface, borderRadius: 12, padding: 14, fontSize: 16,
    color: C.brown, borderWidth: 1, borderColor: C.border,
  },
  saveBtn: {
    backgroundColor: C.rose, borderRadius: 14, paddingVertical: 16, alignItems: "center",
    marginTop: 4,
  },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  cancelBtn: {
    borderRadius: 14, paddingVertical: 12, alignItems: "center", marginTop: 8,
  },
  cancelBtnText: { color: C.muted, fontSize: 14, fontWeight: "600" },

  // ── Status-Karte ──
  statusCard: {
    backgroundColor: C.card, borderRadius: 20, padding: 18, marginBottom: 12,
    borderWidth: 1, borderColor: C.border, borderLeftWidth: 4,
  },
  statusHeader: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 },
  phaseCircle: {
    width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center",
  },
  statusPhase: { fontSize: 18, fontWeight: "700", color: C.brown },
  statusTag: { fontSize: 14, color: C.rose, fontWeight: "600", marginTop: 2 },
  statusBeschreibung: { fontSize: 13, color: C.muted, marginTop: 2 },
  progressContainer: { marginTop: 4 },
  progressBar: {
    height: 8, backgroundColor: C.surface, borderRadius: 4, overflow: "hidden",
  },
  progressFill: { height: 8, borderRadius: 4 },
  progressText: { fontSize: 12, color: C.muted, marginTop: 6, textAlign: "center" },

  // ── Sync-Karte ──
  syncCard: {
    backgroundColor: C.card, borderRadius: 20, padding: 18, marginBottom: 12,
    borderWidth: 1.5,
  },
  syncHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  syncIcons: { flexDirection: "row", alignItems: "center", gap: 8 },
  syncBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,
  },
  syncDot: { width: 8, height: 8, borderRadius: 4 },
  syncBadgeText: { fontSize: 12, fontWeight: "700" },
  syncTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 6 },
  syncTipp: { fontSize: 14, color: C.brownMid, lineHeight: 21 },

  // ── Schnellinfo ──
  quickInfoRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  quickInfoCard: {
    flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.border, alignItems: "center",
  },
  quickInfoEmoji: { fontSize: 22, marginBottom: 6 },
  quickInfoLabel: { fontSize: 11, color: C.muted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  quickInfoValue: { fontSize: 14, fontWeight: "700", color: C.brown, textAlign: "center" },

  // ── Kalender ──
  kalenderRow: {
    flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12,
    marginBottom: 2, borderRadius: 10, gap: 8,
  },
  kalenderRowHeute: {
    backgroundColor: C.roseLight, borderWidth: 1, borderColor: C.rose + "30",
  },
  kalenderDatum: { width: 52 },
  kalenderWochentag: { fontSize: 11, color: C.muted, fontWeight: "600" },
  kalenderTag: { fontSize: 13, fontWeight: "700", color: C.brown },
  kalenderPhase: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 6,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  kalenderPhaseText: { fontSize: 12, fontWeight: "700" },
  kalenderMond: {
    flexDirection: "row", alignItems: "center", gap: 4, width: 52,
  },
  kalenderMondText: { fontSize: 11, color: C.muted },
  kalenderSync: {
    width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center",
  },
  kalenderSyncDot: { width: 8, height: 8, borderRadius: 4 },

  // ── Legende ──
  legendeCard: {
    backgroundColor: C.surface, borderRadius: 14, padding: 14, marginTop: 12, marginBottom: 8,
  },
  legendeTitle: { fontSize: 13, fontWeight: "700", color: C.brown, marginBottom: 8 },
  legendeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  legendeDot: { width: 10, height: 10, borderRadius: 5 },
  legendeText: { fontSize: 12, color: C.brownMid, flex: 1 },

  // ── Edit Button ──
  editBtn: {
    borderRadius: 14, paddingVertical: 14, alignItems: "center",
    borderWidth: 1, borderColor: C.border, marginTop: 8, marginBottom: 8,
  },
  editBtnText: { color: C.rose, fontSize: 14, fontWeight: "700" },

  // ── Info Box ──
  infoBox: {
    backgroundColor: C.roseLight, borderRadius: 16, padding: 18, marginTop: 12,
    borderWidth: 1, borderColor: C.rose + "30", alignItems: "center",
  },
  infoBoxTitle: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 6, textAlign: "center" },
  infoBoxText: { fontSize: 13, color: C.brownMid, lineHeight: 20, textAlign: "center" },

  // ── Meditationen ──
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
