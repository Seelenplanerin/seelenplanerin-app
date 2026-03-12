import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
  Alert, Platform, ActivityIndicator, Linking, Dimensions,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getApiBaseUrl } from "@/constants/oauth";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import {
  getMoonPhaseForDate,
  getMoonZodiac,
  getMoonIllumination,
  isMoonWaxing,
  getNextVollmond,
  getNextNeumond,
  getExakteHauptphasen,
} from "@/lib/moon-phase";
import {
  ZyklusEinstellungen,
  ZyklusTag,
  ZyklusUebersicht,
  SymptomEintrag,
  StimmungTyp,
  EnergieLevel,
  BlutungsStaerke,
  STIMMUNGEN,
  KOERPER_SYMPTOME,
  BLUTUNGS_OPTIONEN,
  berechneZyklusTag,
  berechneZyklusUebersicht,
  berechneZyklusKalender,
  speichereZyklusEinstellungen,
  ladeZyklusEinstellungen,
  speichereSymptomEintrag,
  ladeAlleSymptome,
  ladeSymptomFuerDatum,
  datumZuString,
} from "@/lib/zyklus-tracker";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
  purple: "#9B7CB8", purpleLight: "#F3EDF8",
  red: "#E74C3C", green: "#27AE60", orange: "#F39C12", violet: "#8E44AD",
  pink: "#E8A0BF", pinkLight: "#FDF0F5",
};

const WOCHENTAGE_KURZ = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

// ── Song-Interface ──
interface Song {
  id: string;
  titel: string;
  beschreibung: string;
  mp3Url?: string;
  mp3FileName?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  emoji: string;
  kategorie: string;
  verfuegbar: boolean;
}

// ── Audio-Manager für Web ──
function usePremiumAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const intervalRef = React.useRef<any>(null);

  const stop = useCallback(() => {
    if (Platform.OS === "web" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setCurrentUrl("");
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const play = useCallback((url: string) => {
    if (currentUrl === url && isPlaying) { stop(); return; }
    stop();
    setLoading(true);
    setCurrentUrl(url);
    if (Platform.OS === "web") {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onloadedmetadata = () => { setDuration(audio.duration || 0); };
      audio.onplay = () => { setIsPlaying(true); setLoading(false); };
      audio.onended = () => { stop(); };
      audio.onerror = () => { setLoading(false); stop(); };
      intervalRef.current = setInterval(() => {
        if (audio && !audio.paused) setCurrentTime(audio.currentTime || 0);
      }, 500);
      audio.play().catch(() => { setLoading(false); });
    }
  }, [currentUrl, isPlaying, stop]);

  const progress = duration > 0 ? currentTime / duration : 0;

  useEffect(() => { return () => { stop(); }; }, [stop]);

  return { play, stop, isPlaying, currentUrl, loading, currentTime, duration, progress };
}

// ── Premium Mondkalender ──
function getPremiumMondkalender() {
  const alleExakt = getExakteHauptphasen();
  const now = new Date();
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

// ── Tageskreis-Komponente ──
function ZyklusKreis({
  zyklusTag,
  zyklusLaenge,
  phase,
  mondEmoji,
}: {
  zyklusTag: number;
  zyklusLaenge: number;
  phase: { farbe: string; emoji: string; label: string };
  mondEmoji: string;
}) {
  const size = 220;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = zyklusTag / zyklusLaenge;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <View style={{ alignItems: "center", marginVertical: 16 }}>
      <Svg width={size} height={size}>
        {/* Hintergrund-Kreis */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={C.surface}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Fortschritts-Kreis */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={phase.farbe}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      {/* Innerer Text */}
      <View style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        alignItems: "center", justifyContent: "center",
      }}>
        <Text style={{ fontSize: 38, marginBottom: 2 }}>{phase.emoji}</Text>
        <Text style={{ fontSize: 36, fontWeight: "800", color: C.brown }}>
          Tag {zyklusTag}
        </Text>
        <Text style={{ fontSize: 14, color: phase.farbe, fontWeight: "700", marginTop: 2 }}>
          {phase.label}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 4 }}>{mondEmoji}</Text>
      </View>
    </View>
  );
}

// ── Symptom-Logging Komponente ──
function SymptomLogger({
  datum,
  onSave,
}: {
  datum: string;
  onSave: () => void;
}) {
  const [stimmungen, setStimmungen] = useState<StimmungTyp[]>([]);
  const [energie, setEnergie] = useState<EnergieLevel>(3);
  const [koerperlich, setKoerperlich] = useState<string[]>([]);
  const [blutung, setBlutung] = useState<BlutungsStaerke | undefined>(undefined);
  const [notiz, setNotiz] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSaved(false);
    ladeSymptomFuerDatum(datum).then((eintrag) => {
      if (eintrag) {
        setStimmungen(eintrag.stimmungen || []);
        setEnergie(eintrag.energie || 3);
        setKoerperlich(eintrag.koerperlich || []);
        setBlutung(eintrag.blutung);
        setNotiz(eintrag.notiz || "");
      } else {
        setStimmungen([]);
        setEnergie(3);
        setKoerperlich([]);
        setBlutung(undefined);
        setNotiz("");
      }
      setLoading(false);
    });
  }, [datum]);

  const toggleStimmung = (typ: StimmungTyp) => {
    setStimmungen(prev =>
      prev.includes(typ) ? prev.filter(s => s !== typ) : [...prev, typ]
    );
    setSaved(false);
  };

  const toggleSymptom = (symptom: string) => {
    setKoerperlich(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    const eintrag: SymptomEintrag = {
      datum,
      stimmungen,
      energie,
      koerperlich,
      blutung,
      notiz: notiz.trim() || undefined,
    };
    await speichereSymptomEintrag(eintrag);
    setSaved(true);
    onSave();
  };

  if (loading) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <ActivityIndicator color={C.rose} />
      </View>
    );
  }

  return (
    <View style={s.symptomContainer}>
      {/* Stimmung */}
      <Text style={s.symptomSectionTitle}>Wie fühlst du dich heute?</Text>
      <View style={s.symptomGrid}>
        {STIMMUNGEN.map((st) => {
          const isActive = stimmungen.includes(st.typ);
          return (
            <TouchableOpacity
              key={st.typ}
              style={[s.symptomChip, isActive && { backgroundColor: C.roseLight, borderColor: C.rose }]}
              onPress={() => toggleStimmung(st.typ)}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 20 }}>{st.emoji}</Text>
              <Text style={[s.symptomChipText, isActive && { color: C.rose }]}>{st.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Energie */}
      <Text style={s.symptomSectionTitle}>Dein Energielevel</Text>
      <View style={s.energieRow}>
        {([1, 2, 3, 4, 5] as EnergieLevel[]).map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              s.energieBtn,
              energie === level && { backgroundColor: C.rose, borderColor: C.rose },
            ]}
            onPress={() => { setEnergie(level); setSaved(false); }}
            activeOpacity={0.7}
          >
            <Text style={[
              s.energieBtnText,
              energie === level && { color: "#FFF" },
            ]}>
              {level === 1 ? "😴" : level === 2 ? "😐" : level === 3 ? "🙂" : level === 4 ? "😊" : "⚡"}
            </Text>
            <Text style={[
              { fontSize: 10, color: C.muted, marginTop: 2 },
              energie === level && { color: "#FFF" },
            ]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Blutung */}
      <Text style={s.symptomSectionTitle}>Blutung</Text>
      <View style={s.blutungRow}>
        <TouchableOpacity
          style={[s.blutungChip, !blutung && { backgroundColor: C.surface, borderColor: C.border }]}
          onPress={() => { setBlutung(undefined); setSaved(false); }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 14 }}>–</Text>
          <Text style={[s.blutungChipText, !blutung && { fontWeight: "700" }]}>Keine</Text>
        </TouchableOpacity>
        {BLUTUNGS_OPTIONEN.map((opt) => {
          const isActive = blutung === opt.typ;
          return (
            <TouchableOpacity
              key={opt.typ}
              style={[s.blutungChip, isActive && { backgroundColor: C.pinkLight, borderColor: C.pink }]}
              onPress={() => { setBlutung(opt.typ); setSaved(false); }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 14 }}>{opt.emoji}</Text>
              <Text style={[s.blutungChipText, isActive && { color: C.rose }]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Körperliche Symptome */}
      <Text style={s.symptomSectionTitle}>Körperliche Symptome</Text>
      <View style={s.symptomGrid}>
        {KOERPER_SYMPTOME.map((symptom) => {
          const isActive = koerperlich.includes(symptom);
          return (
            <TouchableOpacity
              key={symptom}
              style={[s.symptomChipSmall, isActive && { backgroundColor: C.purpleLight, borderColor: C.purple }]}
              onPress={() => toggleSymptom(symptom)}
              activeOpacity={0.7}
            >
              <Text style={[s.symptomChipSmallText, isActive && { color: C.purple }]}>{symptom}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notiz */}
      <Text style={s.symptomSectionTitle}>Persönliche Notiz</Text>
      <TextInput
        style={s.notizInput}
        placeholder="Wie geht es dir heute? Was beschäftigt dich?"
        placeholderTextColor={C.muted}
        value={notiz}
        onChangeText={(t) => { setNotiz(t); setSaved(false); }}
        multiline
        maxLength={300}
      />

      {/* Speichern */}
      <TouchableOpacity
        style={[s.saveSymptomBtn, saved && { backgroundColor: C.green }]}
        onPress={handleSave}
        activeOpacity={0.85}
      >
        <Text style={s.saveSymptomBtnText}>
          {saved ? "✓ Gespeichert" : "Eintrag speichern"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Kalender-Monatsansicht (Flo-Stil) ──
function MonatsKalender({
  einstellungen,
  symptome,
  onDayPress,
  selectedDate,
}: {
  einstellungen: ZyklusEinstellungen;
  symptome: SymptomEintrag[];
  onDayPress: (datum: string) => void;
  selectedDate: string;
}) {
  const [monatOffset, setMonatOffset] = useState(0);

  const { tage, monatLabel, jahrLabel } = useMemo(() => {
    const jetzt = new Date();
    const monat = new Date(jetzt.getFullYear(), jetzt.getMonth() + monatOffset, 1);
    const label = MONATE[monat.getMonth()];
    const jahr = monat.getFullYear();
    const ersterTag = monat.getDay(); // 0=So
    const letzterTag = new Date(monat.getFullYear(), monat.getMonth() + 1, 0).getDate();

    const tageArray: (ZyklusTag | null)[] = [];
    // Leere Felder vor dem 1.
    for (let i = 0; i < ersterTag; i++) tageArray.push(null);
    // Tage des Monats
    for (let d = 1; d <= letzterTag; d++) {
      const datum = new Date(monat.getFullYear(), monat.getMonth(), d);
      tageArray.push(berechneZyklusTag(datum, einstellungen));
    }
    return { tage: tageArray, monatLabel: label, jahrLabel: jahr };
  }, [monatOffset, einstellungen]);

  const heute = new Date();
  const heuteStr = datumZuString(heute);

  return (
    <View style={s.kalenderContainer}>
      {/* Monat-Navigation */}
      <View style={s.kalenderNav}>
        <TouchableOpacity onPress={() => setMonatOffset(prev => prev - 1)} activeOpacity={0.7}>
          <Text style={s.kalenderNavBtn}>‹</Text>
        </TouchableOpacity>
        <Text style={s.kalenderMonatLabel}>{monatLabel} {jahrLabel}</Text>
        <TouchableOpacity onPress={() => setMonatOffset(prev => prev + 1)} activeOpacity={0.7}>
          <Text style={s.kalenderNavBtn}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Wochentage */}
      <View style={s.kalenderWochenRow}>
        {["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"].map((w) => (
          <Text key={w} style={s.kalenderWochenTag}>{w}</Text>
        ))}
      </View>

      {/* Tage-Grid */}
      <View style={s.kalenderGrid}>
        {tage.map((tag, i) => {
          if (!tag) {
            return <View key={`empty-${i}`} style={s.kalenderZelle} />;
          }
          const datumStr = datumZuString(tag.datum);
          const isHeute = datumStr === heuteStr;
          const isSelected = datumStr === selectedDate;
          const hatSymptom = symptome.some(s => s.datum === datumStr);
          const hatBlutung = symptome.find(s => s.datum === datumStr)?.blutung;

          return (
            <TouchableOpacity
              key={datumStr}
              style={[
                s.kalenderZelle,
                { backgroundColor: tag.phase.farbe + "15" },
                isHeute && { borderWidth: 2, borderColor: C.rose },
                isSelected && { backgroundColor: tag.phase.farbe + "35" },
              ]}
              onPress={() => onDayPress(datumStr)}
              activeOpacity={0.7}
            >
              <Text style={[
                s.kalenderZelleTag,
                isHeute && { color: C.rose, fontWeight: "800" },
              ]}>
                {tag.datum.getDate()}
              </Text>
              {hatBlutung && (
                <View style={s.kalenderBlutungDot} />
              )}
              {hatSymptom && !hatBlutung && (
                <View style={[s.kalenderSymptomDot, { backgroundColor: tag.phase.farbe }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Phasen-Legende */}
      <View style={s.phasenLegende}>
        {[
          { farbe: C.red, label: "Menstruation" },
          { farbe: C.green, label: "Follikel" },
          { farbe: C.orange, label: "Eisprung" },
          { farbe: C.violet, label: "Luteal" },
        ].map((p) => (
          <View key={p.label} style={s.legendeItem}>
            <View style={[s.legendeFarbDot, { backgroundColor: p.farbe }]} />
            <Text style={s.legendeItemText}>{p.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function CommunityPremiumScreen() {
  const [tab, setTab] = useState<"zyklus" | "kalender" | "mondkalender" | "meditation">("zyklus");
  const [zyklusEinstellungen, setZyklusEinstellungen] = useState<ZyklusEinstellungen | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [setupDatum, setSetupDatum] = useState("");
  const [setupLaenge, setSetupLaenge] = useState("28");
  const [setupDauer, setSetupDauer] = useState("5");
  const [selectedDate, setSelectedDate] = useState(datumZuString(new Date()));
  const [symptome, setSymptome] = useState<SymptomEintrag[]>([]);
  const [showSymptomLog, setShowSymptomLog] = useState(false);
  const mondkalender = getPremiumMondkalender();
  const audio = usePremiumAudio();
  const [uploadedMeditationen, setUploadedMeditationen] = useState<Song[]>([]);

  // Zyklusdaten laden
  useEffect(() => {
    ladeZyklusEinstellungen().then((data) => {
      if (data) setZyklusEinstellungen(data);
    });
    ladeAlleSymptome().then(setSymptome);
  }, []);

  // Meditationen vom Server laden
  useFocusEffect(
    useCallback(() => {
      const API_URL = `${getApiBaseUrl()}/api/trpc`;
      fetch(`${API_URL}/meditations.list`)
        .then(res => res.json())
        .then(data => {
          const result = data?.result?.data?.json || data?.result?.data;
          if (Array.isArray(result) && result.length > 0) {
            const mapped: Song[] = result.map((m: any) => ({
              id: String(m.id),
              titel: m.title,
              beschreibung: m.description || "",
              mp3Url: m.audioUrl,
              emoji: m.emoji || "🧘‍♀️",
              kategorie: "meditation" as const,
              verfuegbar: true,
            }));
            setUploadedMeditationen(mapped);
          } else {
            AsyncStorage.getItem("lara_meditationen").then((localData) => {
              if (localData) {
                try {
                  const all: Song[] = JSON.parse(localData);
                  setUploadedMeditationen(all.filter(s => s.verfuegbar));
                } catch (e) { /* ignore */ }
              }
            });
          }
        })
        .catch(() => {
          AsyncStorage.getItem("lara_meditationen").then((localData) => {
            if (localData) {
              try {
                const all: Song[] = JSON.parse(localData);
                setUploadedMeditationen(all.filter(s => s.verfuegbar));
              } catch (e) { /* ignore */ }
            }
          });
        });
    }, [])
  );

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

  const reloadSymptome = useCallback(async () => {
    const alle = await ladeAlleSymptome();
    setSymptome(alle);
  }, []);

  // Zyklus-Daten berechnen
  const heute = new Date();
  const heuteTag = zyklusEinstellungen ? berechneZyklusTag(heute, zyklusEinstellungen) : null;
  const uebersicht = zyklusEinstellungen ? berechneZyklusUebersicht(heute, zyklusEinstellungen) : null;

  // Ausgewählter Tag
  const selectedZyklusTag = useMemo(() => {
    if (!zyklusEinstellungen) return null;
    const d = new Date(selectedDate + "T12:00:00");
    return berechneZyklusTag(d, zyklusEinstellungen);
  }, [selectedDate, zyklusEinstellungen]);

  const selectedSymptom = useMemo(() => {
    return symptome.find(s => s.datum === selectedDate) || null;
  }, [selectedDate, symptome]);

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
            <Text style={s.premiumSub}>Mondkalender · Meditationen · Zyklus</Text>
          </View>
        </View>

        {/* Tab-Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabScrollRow}>
          {[
            { key: "zyklus", label: "🌸 Zyklus" },
            { key: "kalender", label: "📅 Kalender" },
            { key: "mondkalender", label: "🌙 Mondphasen" },
            { key: "meditation", label: "🧘 Meditationen" },
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
        </ScrollView>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

          {/* ── Zyklustracker ── */}
          {tab === "zyklus" && (
            <View style={s.content}>
              {(!zyklusEinstellungen || showSetup) ? (
                /* ── Setup ── */
                <View style={s.setupCard}>
                  <Text style={{ fontSize: 48, textAlign: "center", marginBottom: 12 }}>🌸</Text>
                  <Text style={s.setupTitle}>
                    {zyklusEinstellungen ? "Zyklusdaten anpassen" : "Dein Zyklustracker"}
                  </Text>
                  <Text style={s.setupSub}>
                    Gib deine Daten ein, um deinen persönlichen Zyklus zu verfolgen und mit den Mondphasen zu verbinden.
                  </Text>

                  <View style={s.inputGroup}>
                    <Text style={s.inputLabel}>Letzter Periodenstart</Text>
                    <TextInput
                      style={s.input}
                      placeholder="JJJJ-MM-TT (z.B. 2026-03-01)"
                      placeholderTextColor={C.muted}
                      value={setupDatum}
                      onChangeText={setSetupDatum}
                      returnKeyType="done"
                    />
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={[s.inputGroup, { flex: 1 }]}>
                      <Text style={s.inputLabel}>Zykluslänge</Text>
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
                      <Text style={s.inputLabel}>Periodendauer</Text>
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
                    <Text style={s.saveBtnText}>Speichern & Starten</Text>
                  </TouchableOpacity>

                  {zyklusEinstellungen && (
                    <TouchableOpacity style={s.cancelBtn} onPress={() => setShowSetup(false)} activeOpacity={0.8}>
                      <Text style={s.cancelBtnText}>Abbrechen</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <>
                  {/* ── Tagesansicht ── */}
                  {heuteTag && uebersicht && (
                    <>
                      {/* Großer Tageskreis */}
                      <ZyklusKreis
                        zyklusTag={uebersicht.aktuellerTag}
                        zyklusLaenge={zyklusEinstellungen.zyklusLaenge}
                        phase={heuteTag.phase}
                        mondEmoji={heuteTag.mondEmoji}
                      />

                      {/* Spiritueller Tipp */}
                      <View style={[s.tippCard, { borderLeftColor: heuteTag.phase.farbe }]}>
                        <Text style={s.tippTitle}>Dein Seelentipp für heute</Text>
                        <Text style={s.tippText}>{heuteTag.phase.spirituellerTipp}</Text>
                      </View>

                      {/* Schnellinfo-Karten */}
                      <View style={s.quickInfoRow}>
                        <View style={s.quickInfoCard}>
                          <Text style={s.quickInfoEmoji}>🩸</Text>
                          <Text style={s.quickInfoLabel}>Nächste Periode</Text>
                          <Text style={s.quickInfoValue}>in {uebersicht.tageZurNaechstenPeriode} Tagen</Text>
                        </View>
                        <View style={s.quickInfoCard}>
                          <Text style={s.quickInfoEmoji}>{uebersicht.naechstePhase.emoji}</Text>
                          <Text style={s.quickInfoLabel}>{uebersicht.naechstePhase.label}</Text>
                          <Text style={s.quickInfoValue}>in {uebersicht.tageZurNaechstenPhase} Tagen</Text>
                        </View>
                      </View>

                      {/* Mond-Synchronisation */}
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

                      {/* Symptom-Logging Button */}
                      <TouchableOpacity
                        style={s.logSymptomBtn}
                        onPress={() => {
                          setSelectedDate(datumZuString(heute));
                          setShowSymptomLog(!showSymptomLog);
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={{ fontSize: 22 }}>📝</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={s.logSymptomTitle}>
                            {showSymptomLog ? "Eintrag schließen" : "Wie fühlst du dich heute?"}
                          </Text>
                          <Text style={s.logSymptomSub}>Stimmung, Energie & Symptome tracken</Text>
                        </View>
                        <Text style={{ fontSize: 18, color: C.rose }}>{showSymptomLog ? "▲" : "▼"}</Text>
                      </TouchableOpacity>

                      {/* Symptom-Logger */}
                      {showSymptomLog && (
                        <SymptomLogger
                          datum={datumZuString(heute)}
                          onSave={reloadSymptome}
                        />
                      )}

                      {/* Einstellungen */}
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
                        <Text style={s.editBtnText}>⚙️ Zyklusdaten anpassen</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}
            </View>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* ── KALENDER-ANSICHT (FLO-STIL) ── */}
          {/* ══════════════════════════════════════════════ */}
          {tab === "kalender" && (
            <View style={s.content}>
              {!zyklusEinstellungen ? (
                <View style={s.infoBox}>
                  <Text style={{ fontSize: 28, marginBottom: 8 }}>📅</Text>
                  <Text style={s.infoBoxTitle}>Zyklus einrichten</Text>
                  <Text style={s.infoBoxText}>
                    Richte zuerst deinen Zyklustracker ein, um den Kalender zu nutzen.
                  </Text>
                  <TouchableOpacity
                    style={[s.saveBtn, { marginTop: 12 }]}
                    onPress={() => setTab("zyklus")}
                    activeOpacity={0.85}
                  >
                    <Text style={s.saveBtnText}>Zum Zyklustracker →</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {/* Monatskalender */}
                  <MonatsKalender
                    einstellungen={zyklusEinstellungen}
                    symptome={symptome}
                    onDayPress={(datum) => setSelectedDate(datum)}
                    selectedDate={selectedDate}
                  />

                  {/* Ausgewählter Tag – Details */}
                  {selectedZyklusTag && (
                    <View style={[s.selectedDayCard, { borderLeftColor: selectedZyklusTag.phase.farbe }]}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <View style={[s.dayCircle, { backgroundColor: selectedZyklusTag.phase.farbe + "20" }]}>
                          <Text style={{ fontSize: 22 }}>{selectedZyklusTag.phase.emoji}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.selectedDayTitle}>
                            {new Date(selectedDate + "T12:00:00").toLocaleDateString("de-DE", {
                              weekday: "long", day: "numeric", month: "long",
                            })}
                          </Text>
                          <Text style={[s.selectedDayPhase, { color: selectedZyklusTag.phase.farbe }]}>
                            {selectedZyklusTag.phase.label} · Tag {selectedZyklusTag.zyklusTag}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 22 }}>{selectedZyklusTag.mondEmoji}</Text>
                      </View>

                      {/* Symptome des Tages */}
                      {selectedSymptom ? (
                        <View style={s.daySymptomSummary}>
                          {selectedSymptom.stimmungen.length > 0 && (
                            <View style={s.daySymptomRow}>
                              <Text style={s.daySymptomLabel}>Stimmung:</Text>
                              <Text style={s.daySymptomValue}>
                                {selectedSymptom.stimmungen.map(st =>
                                  STIMMUNGEN.find(s => s.typ === st)?.emoji || ""
                                ).join(" ")}
                              </Text>
                            </View>
                          )}
                          {selectedSymptom.energie && (
                            <View style={s.daySymptomRow}>
                              <Text style={s.daySymptomLabel}>Energie:</Text>
                              <Text style={s.daySymptomValue}>
                                {"●".repeat(selectedSymptom.energie)}{"○".repeat(5 - selectedSymptom.energie)}
                              </Text>
                            </View>
                          )}
                          {selectedSymptom.blutung && (
                            <View style={s.daySymptomRow}>
                              <Text style={s.daySymptomLabel}>Blutung:</Text>
                              <Text style={s.daySymptomValue}>
                                {BLUTUNGS_OPTIONEN.find(b => b.typ === selectedSymptom.blutung)?.label || ""}
                              </Text>
                            </View>
                          )}
                          {selectedSymptom.koerperlich.length > 0 && (
                            <View style={s.daySymptomRow}>
                              <Text style={s.daySymptomLabel}>Symptome:</Text>
                              <Text style={s.daySymptomValue}>{selectedSymptom.koerperlich.join(", ")}</Text>
                            </View>
                          )}
                          {selectedSymptom.notiz && (
                            <Text style={s.dayNotiz}>"{selectedSymptom.notiz}"</Text>
                          )}
                        </View>
                      ) : (
                        <Text style={{ fontSize: 13, color: C.muted, fontStyle: "italic" }}>
                          Noch keine Einträge für diesen Tag
                        </Text>
                      )}

                      {/* Symptom für diesen Tag loggen */}
                      <TouchableOpacity
                        style={s.logDayBtn}
                        onPress={() => {
                          setTab("zyklus");
                          setShowSymptomLog(true);
                        }}
                        activeOpacity={0.85}
                      >
                        <Text style={s.logDayBtnText}>
                          {selectedSymptom ? "Eintrag bearbeiten" : "Eintrag hinzufügen"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* ── MONDKALENDER PREMIUM ── */}
          {/* ══════════════════════════════════════════════ */}
          {tab === "mondkalender" && (
            <View style={s.content}>
              <Text style={s.sectionTitle}>Mondphasen-Kalender 2026</Text>
              <Text style={s.sectionSub}>Alle exakten Mondphasen (astronomisch verifiziert)</Text>

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
          {/* ── EXKLUSIVE MEDITATIONEN ── */}
          {/* ══════════════════════════════════════════════ */}
          {tab === "meditation" && (
            <View style={s.content}>
              <Text style={s.sectionTitle}>Exklusive Meditationen</Text>
              <Text style={s.sectionSub}>
                Geführte Meditationen von der Seelenplanerin – speziell für deinen spirituellen Weg.
              </Text>

              {uploadedMeditationen.length > 0 && uploadedMeditationen.map((med) => {
                const isActive = audio.currentUrl === med.mp3Url;
                return (
                  <TouchableOpacity
                    key={med.id}
                    style={[s.meditationCard, isActive && { backgroundColor: C.roseLight, borderColor: C.rose }]}
                    onPress={() => {
                      if (med.mp3Url) audio.play(med.mp3Url);
                      else if (med.spotifyUrl) Linking.openURL(med.spotifyUrl);
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={s.meditationEmoji}>
                      <Text style={{ fontSize: 28 }}>{med.emoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.meditationTitel}>{med.titel}</Text>
                      <Text style={s.meditationBeschreibung}>{med.beschreibung}</Text>
                      {med.mp3Url && (
                        <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                          <View style={{ backgroundColor: C.roseLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
                            <Text style={{ fontSize: 10, color: C.rose, fontWeight: "700" }}>🎧 In-App abspielen</Text>
                          </View>
                        </View>
                      )}
                    </View>
                    <View style={[{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.rose, alignItems: "center", justifyContent: "center" }, isActive && audio.isPlaying && { backgroundColor: C.brown }]}>
                      {audio.loading && isActive ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Text style={{ color: "#FFF", fontSize: 16 }}>{isActive && audio.isPlaying ? "⏸" : "▶"}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}

              {audio.isPlaying && (
                <View style={{ backgroundColor: C.brown, borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "600" }}>🎧 Meditation läuft...</Text>
                    <View style={{ height: 3, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                      <View style={{ height: "100%", backgroundColor: C.gold, borderRadius: 2, width: `${audio.progress * 100}%` }} />
                    </View>
                  </View>
                  <TouchableOpacity onPress={audio.stop} style={{ marginLeft: 12 }} activeOpacity={0.7}>
                    <Text style={{ color: C.gold, fontSize: 14, fontWeight: "700" }}>■ Stop</Text>
                  </TouchableOpacity>
                </View>
              )}

              {uploadedMeditationen.length === 0 && (
                <View style={s.infoBox}>
                  <Text style={{ fontSize: 18, marginBottom: 8 }}>🎧</Text>
                  <Text style={s.infoBoxTitle}>Meditationen werden ergänzt</Text>
                  <Text style={s.infoBoxText}>
                    Die Seelenplanerin arbeitet gerade an exklusiven geführten Meditationen für dich.
                  </Text>
                </View>
              )}
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
    backgroundColor: C.roseLight, borderRadius: 16, padding: 16,
    flexDirection: "row", alignItems: "center", gap: 12,
    borderWidth: 1, borderColor: C.rose + "30",
  },
  premiumTitle: { fontSize: 16, fontWeight: "700", color: C.brown },
  premiumSub: { fontSize: 12, color: C.muted },

  tabScrollRow: {
    paddingHorizontal: 16, gap: 8, paddingBottom: 10, flexDirection: "row",
  },
  tab: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
  },
  tabActive: {
    backgroundColor: C.rose + "18", borderColor: C.rose + "50",
  },
  tabText: { fontSize: 13, color: C.muted, fontWeight: "600" },
  tabTextActive: { color: C.rose, fontWeight: "700" },

  content: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: C.brown, marginBottom: 6 },
  sectionSub: { fontSize: 14, color: C.muted, lineHeight: 21, marginBottom: 16 },

  // ── Setup ──
  setupCard: {
    backgroundColor: C.card, borderRadius: 20, padding: 24, marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
  },
  setupTitle: { fontSize: 22, fontWeight: "700", color: C.brown, marginBottom: 8, textAlign: "center" },
  setupSub: { fontSize: 14, color: C.muted, lineHeight: 21, marginBottom: 24, textAlign: "center" },
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
  cancelBtn: { borderRadius: 14, paddingVertical: 12, alignItems: "center", marginTop: 8 },
  cancelBtnText: { color: C.muted, fontSize: 14, fontWeight: "600" },

  // ── Tipp-Karte ──
  tippCard: {
    backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: C.border, borderLeftWidth: 4,
  },
  tippTitle: { fontSize: 14, fontWeight: "700", color: C.brown, marginBottom: 6 },
  tippText: { fontSize: 14, color: C.brownMid, lineHeight: 22 },

  // ── Schnellinfo ──
  quickInfoRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  quickInfoCard: {
    flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.border, alignItems: "center",
  },
  quickInfoEmoji: { fontSize: 22, marginBottom: 6 },
  quickInfoLabel: { fontSize: 11, color: C.muted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  quickInfoValue: { fontSize: 14, fontWeight: "700", color: C.brown, textAlign: "center" },

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

  // ── Symptom-Logging Button ──
  logSymptomBtn: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: C.roseLight, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: C.rose + "30",
  },
  logSymptomTitle: { fontSize: 15, fontWeight: "700", color: C.brown },
  logSymptomSub: { fontSize: 12, color: C.muted, marginTop: 2 },

  // ── Symptom-Container ──
  symptomContainer: {
    backgroundColor: C.card, borderRadius: 20, padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
  },
  symptomSectionTitle: {
    fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 10, marginTop: 8,
  },
  symptomGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8,
  },
  symptomChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
  },
  symptomChipText: { fontSize: 13, color: C.brownMid, fontWeight: "600" },
  symptomChipSmall: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
  },
  symptomChipSmallText: { fontSize: 12, color: C.brownMid, fontWeight: "600" },

  // ── Energie ──
  energieRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  energieBtn: {
    flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
  },
  energieBtnText: { fontSize: 20 },

  // ── Blutung ──
  blutungRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  blutungChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
  },
  blutungChipText: { fontSize: 12, color: C.brownMid, fontWeight: "600" },

  // ── Notiz ──
  notizInput: {
    backgroundColor: C.surface, borderRadius: 12, padding: 14, fontSize: 14,
    color: C.brown, borderWidth: 1, borderColor: C.border,
    minHeight: 80, textAlignVertical: "top", marginBottom: 12,
  },

  // ── Save Symptom ──
  saveSymptomBtn: {
    backgroundColor: C.rose, borderRadius: 14, paddingVertical: 14, alignItems: "center",
  },
  saveSymptomBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  // ── Edit Button ──
  editBtn: {
    borderRadius: 14, paddingVertical: 14, alignItems: "center",
    borderWidth: 1, borderColor: C.border, marginTop: 8, marginBottom: 8,
  },
  editBtnText: { color: C.rose, fontSize: 14, fontWeight: "700" },

  // ── Kalender ──
  kalenderContainer: {
    backgroundColor: C.card, borderRadius: 20, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
  },
  kalenderNav: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: 16,
  },
  kalenderNavBtn: { fontSize: 28, color: C.rose, fontWeight: "700", paddingHorizontal: 12 },
  kalenderMonatLabel: { fontSize: 18, fontWeight: "700", color: C.brown },
  kalenderWochenRow: { flexDirection: "row", marginBottom: 8 },
  kalenderWochenTag: {
    flex: 1, textAlign: "center", fontSize: 12, fontWeight: "700",
    color: C.muted, textTransform: "uppercase",
  },
  kalenderGrid: { flexDirection: "row", flexWrap: "wrap" },
  kalenderZelle: {
    width: `${100 / 7}%`, aspectRatio: 1, alignItems: "center", justifyContent: "center",
    borderRadius: 8, marginBottom: 2,
  },
  kalenderZelleTag: { fontSize: 14, fontWeight: "600", color: C.brown },
  kalenderBlutungDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: C.red,
    position: "absolute", bottom: 4,
  },
  kalenderSymptomDot: {
    width: 5, height: 5, borderRadius: 2.5,
    position: "absolute", bottom: 4,
  },
  phasenLegende: {
    flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 12,
    justifyContent: "center",
  },
  legendeItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendeFarbDot: { width: 10, height: 10, borderRadius: 5 },
  legendeItemText: { fontSize: 11, color: C.muted, fontWeight: "600" },

  // ── Selected Day ──
  selectedDayCard: {
    backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: C.border, borderLeftWidth: 4,
  },
  dayCircle: {
    width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center",
  },
  selectedDayTitle: { fontSize: 15, fontWeight: "700", color: C.brown },
  selectedDayPhase: { fontSize: 13, fontWeight: "600", marginTop: 2 },
  daySymptomSummary: { marginTop: 8 },
  daySymptomRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  daySymptomLabel: { fontSize: 12, color: C.muted, fontWeight: "600", width: 70 },
  daySymptomValue: { fontSize: 13, color: C.brown, flex: 1 },
  dayNotiz: { fontSize: 13, color: C.brownMid, fontStyle: "italic", marginTop: 6, lineHeight: 19 },
  logDayBtn: {
    backgroundColor: C.roseLight, borderRadius: 10, paddingVertical: 10, alignItems: "center",
    marginTop: 10, borderWidth: 1, borderColor: C.rose + "30",
  },
  logDayBtnText: { fontSize: 13, fontWeight: "700", color: C.rose },

  // ── Mondkalender Events ──
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
});
