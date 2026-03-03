import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
  neumond: "#2C1A4E", vollmond: "#C9A96E", zunehmend: "#4A7C9E", abnehmend: "#8B5E3C",
};

const FRAGEN = [
  {
    frage: "Wie beginnst du deinen Morgen am liebsten?",
    antworten: [
      { text: "In Stille und Dunkelheit – ich brauche Zeit für mich", typ: "N" },
      { text: "Mit einem Ritual: Kerze, Tee, Meditation", typ: "V" },
      { text: "Voller Energie – ich starte direkt durch", typ: "Z" },
      { text: "Langsam, mit Reflexion und Rückblick", typ: "A" },
    ],
  },
  {
    frage: "Welches Bild beschreibt dich am besten?",
    antworten: [
      { text: "Ein leerer Himmel voller Möglichkeiten", typ: "N" },
      { text: "Ein strahlender Vollmond über dem Meer", typ: "V" },
      { text: "Eine aufgehende Sonne am Horizont", typ: "Z" },
      { text: "Ein ruhiger Herbstwald im Abendlicht", typ: "A" },
    ],
  },
  {
    frage: "Was gibt dir am meisten Kraft?",
    antworten: [
      { text: "Stille, Rückzug und innere Einkehr", typ: "N" },
      { text: "Tiefe Verbindungen und Herzensmomente", typ: "V" },
      { text: "Neue Projekte und das Gefühl von Wachstum", typ: "Z" },
      { text: "Loslassen und Raum schaffen für Neues", typ: "A" },
    ],
  },
  {
    frage: "Wie gehst du mit Veränderungen um?",
    antworten: [
      { text: "Ich ziehe mich zurück und verarbeite alles innerlich", typ: "N" },
      { text: "Ich feiere und teile es mit anderen", typ: "V" },
      { text: "Ich packe es an und setze es um", typ: "Z" },
      { text: "Ich reflektiere und lasse los, was nicht mehr passt", typ: "A" },
    ],
  },
  {
    frage: "Welches Element spricht dich am meisten an?",
    antworten: [
      { text: "Erde – geerdet, tief, beständig", typ: "N" },
      { text: "Feuer – leuchtend, wärmend, transformierend", typ: "V" },
      { text: "Luft – frei, leicht, voller Ideen", typ: "Z" },
      { text: "Wasser – fließend, heilend, intuitiv", typ: "A" },
    ],
  },
  {
    frage: "Was machst du, wenn du dich überwältigt fühlst?",
    antworten: [
      { text: "Ich ziehe mich in die Stille zurück", typ: "N" },
      { text: "Ich spreche mit jemandem, dem ich vertraue", typ: "V" },
      { text: "Ich mache etwas – Bewegung, Kreativität, Aktion", typ: "Z" },
      { text: "Ich schreibe, meditiere und lasse los", typ: "A" },
    ],
  },
  {
    frage: "Welche Mondphase fühlt sich für dich wie Heimat an?",
    antworten: [
      { text: "Neumond – Stille, Neuanfang, Leere", typ: "N" },
      { text: "Vollmond – Fülle, Licht, Intensität", typ: "V" },
      { text: "Zunehmender Mond – Aufbau, Wachstum, Energie", typ: "Z" },
      { text: "Abnehmender Mond – Loslassen, Ruhe, Reflexion", typ: "A" },
    ],
  },
  {
    frage: "Was ist deine tiefste innere Sehnsucht?",
    antworten: [
      { text: "Wahrhaftigkeit – ich selbst sein, ohne Maske", typ: "N" },
      { text: "Verbindung – tief geliebt und gesehen werden", typ: "V" },
      { text: "Entfaltung – mein volles Potenzial leben", typ: "Z" },
      { text: "Frieden – loslassen und im Fluss sein", typ: "A" },
    ],
  },
];

const MONDTYPEN: Record<string, {
  name: string; symbol: string; farbe: string; farbHell: string;
  beschreibung: string; staerken: string[]; ritual: string; heilstein: string; affirmation: string;
}> = {
  N: {
    name: "Die Neumondfrau",
    symbol: "🌑",
    farbe: C.neumond,
    farbHell: "#E8E0F5",
    beschreibung: "Du bist eine Hüterin der Stille und der Tiefe. Deine Kraft liegt im Innen – in der Reflexion, der Intuition und dem Mut, neu anzufangen. Du bist eine Visionärin, die in der Dunkelheit die Samen für Neues pflanzt.",
    staerken: ["Tiefe Intuition", "Mut zum Neuanfang", "Innere Weisheit", "Authentizität"],
    ritual: "Zünde eine schwarze oder dunkle Kerze an. Schreibe auf, was du loslassen möchtest – und was du neu erschaffen willst. Verbrenne das Papier als Symbol des Wandels.",
    heilstein: "Obsidian oder Mondstein",
    affirmation: "Ich vertraue meiner inneren Stimme. In der Stille finde ich meine Kraft.",
  },
  V: {
    name: "Die Vollmondfrau",
    symbol: "🌕",
    farbe: C.vollmond,
    farbHell: "#FAF3E7",
    beschreibung: "Du strahlst wie der Vollmond – hell, warm und magnetisch. Du liebst tiefe Verbindungen, feierst das Leben und bringst Licht in die Dunkelheit anderer. Deine Präsenz ist ein Geschenk.",
    staerken: ["Strahlende Ausstrahlung", "Tiefe Empathie", "Herzensverbindungen", "Heilende Energie"],
    ritual: "Stelle ein Glas Wasser in das Mondlicht. Am nächsten Morgen trinke es mit Dankbarkeit. Schreibe drei Dinge auf, für die du heute dankbar bist.",
    heilstein: "Bergkristall oder Rosenquarz",
    affirmation: "Ich bin Licht. Meine Liebe und Fülle strahlen in die Welt.",
  },
  Z: {
    name: "Die Zunehmende-Mond-Frau",
    symbol: "🌒",
    farbe: C.zunehmend,
    farbHell: "#E0EEF5",
    beschreibung: "Du bist eine Macherin und Erschafferin. Voller Energie, Ideen und dem Willen, deine Träume in die Realität zu bringen. Du wächst, du blühst, du entfaltest dich – und du inspirierst andere, dasselbe zu tun.",
    staerken: ["Tatkraft & Energie", "Kreativität", "Manifestationskraft", "Inspirierende Präsenz"],
    ritual: "Schreibe drei Ziele auf, die du in diesem Mondmonat erreichen möchtest. Lege einen Citrin dazu und visualisiere, wie du sie bereits erlebt hast.",
    heilstein: "Citrin oder Karneol",
    affirmation: "Ich wachse mit jeder Atemzug. Meine Träume werden Wirklichkeit.",
  },
  A: {
    name: "Die Abnehmende-Mond-Frau",
    symbol: "🌘",
    farbe: C.abnehmend,
    farbHell: "#F5EDE0",
    beschreibung: "Du bist eine Meisterin des Loslassens und der Weisheit. Du weißt, dass wahre Stärke darin liegt, Altes zu verabschieden und Raum für Neues zu schaffen. Deine Tiefe und Reife sind ein Geschenk für alle, die dich kennen.",
    staerken: ["Weisheit & Reife", "Loslassen können", "Tiefe Reflexion", "Heilsame Präsenz"],
    ritual: "Schreibe auf, was du loslassen möchtest – Gedanken, Beziehungen, Gewohnheiten. Lege das Papier unter deinen Kopfkissen und lass es in der Nacht los.",
    heilstein: "Amethyst oder Obsidian",
    affirmation: "Ich lasse los, was mich nicht mehr dient. Im Loslassen finde ich Frieden.",
  },
};

export default function MondtypQuizScreen() {
  const [aktFrage, setAktFrage] = useState(0);
  const [punkte, setPunkte] = useState<Record<string, number>>({ N: 0, V: 0, Z: 0, A: 0 });
  const [ergebnis, setErgebnis] = useState<string | null>(null);
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);

  function antwortWaehlen(typ: string, idx: number) {
    setGewaehlt(idx);
    setTimeout(() => {
      const neuePunkte = { ...punkte, [typ]: punkte[typ] + 1 };
      setPunkte(neuePunkte);
      if (aktFrage < FRAGEN.length - 1) {
        setAktFrage(aktFrage + 1);
        setGewaehlt(null);
      } else {
        // Ergebnis berechnen
        const max = Object.entries(neuePunkte).sort((a, b) => b[1] - a[1])[0][0];
        setErgebnis(max);
      }
    }, 300);
  }

  function neuStarten() {
    setAktFrage(0);
    setPunkte({ N: 0, V: 0, Z: 0, A: 0 });
    setErgebnis(null);
    setGewaehlt(null);
  }

  if (ergebnis) {
    const typ = MONDTYPEN[ergebnis];
    return (
      <ScreenContainer containerClassName="bg-background">
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={[s.ergebnisHeader, { backgroundColor: typ.farbe }]}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <Text style={s.backBtnText}>← Zurück</Text>
            </TouchableOpacity>
            <Text style={s.ergebnisSymbol}>{typ.symbol}</Text>
            <Text style={s.ergebnisLabel}>Dein Mondtyp</Text>
            <Text style={s.ergebnisName}>{typ.name}</Text>
          </View>

          {/* Beschreibung */}
          <View style={[s.card, { backgroundColor: typ.farbHell, borderColor: typ.farbe + "40" }]}>
            <Text style={[s.cardText, { color: C.brown }]}>{typ.beschreibung}</Text>
          </View>

          {/* Stärken */}
          <View style={s.card}>
            <Text style={s.cardTitel}>✨ Deine Stärken</Text>
            <View style={s.staerkenGrid}>
              {typ.staerken.map((st, i) => (
                <View key={i} style={[s.staerkenBadge, { backgroundColor: typ.farbHell, borderColor: typ.farbe + "60" }]}>
                  <Text style={[s.staerkenText, { color: typ.farbe }]}>{st}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Ritual */}
          <View style={s.card}>
            <Text style={s.cardTitel}>🕯️ Dein Mondphasen-Ritual</Text>
            <Text style={s.cardText}>{typ.ritual}</Text>
          </View>

          {/* Heilstein */}
          <View style={s.card}>
            <Text style={s.cardTitel}>💎 Dein Heilstein</Text>
            <Text style={[s.cardText, { fontWeight: "600", color: C.brown }]}>{typ.heilstein}</Text>
          </View>

          {/* Affirmation */}
          <View style={[s.card, { backgroundColor: typ.farbHell }]}>
            <Text style={s.cardTitel}>🌙 Deine Affirmation</Text>
            <Text style={[s.affirmation, { color: typ.farbe }]}>"{typ.affirmation}"</Text>
          </View>

          {/* Seelenimpuls CTA */}
          <View style={s.ctaCard}>
            <Text style={s.ctaTitel}>Tiefer eintauchen?</Text>
            <Text style={s.ctaText}>Im Seelenimpuls bekommst du jeden Monat tiefe Mondenergie-Impulse, persönliche Rituale und die Begleitung der Seelenplanerin – passend zu deinem Mondtyp.</Text>
            <TouchableOpacity style={s.ctaBtn} onPress={() => router.push("/seelenimpuls")} activeOpacity={0.85}>
              <Text style={s.ctaBtnText}>Zum Seelenimpuls → 17 € / Monat</Text>
            </TouchableOpacity>
          </View>

          {/* Neu starten */}
          <TouchableOpacity style={s.neuStartenBtn} onPress={neuStarten} activeOpacity={0.8}>
            <Text style={s.neuStartenText}>Quiz wiederholen</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  const frage = FRAGEN[aktFrage];
  const fortschritt = ((aktFrage) / FRAGEN.length) * 100;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backBtnText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerSymbol}>🌙</Text>
          <Text style={s.headerTitel}>Welcher Mondtyp bist du?</Text>
          <Text style={s.headerSub}>8 Fragen · Entdecke deine Mondenergie</Text>
        </View>

        {/* Fortschrittsbalken */}
        <View style={s.progressContainer}>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${fortschritt}%` }]} />
          </View>
          <Text style={s.progressText}>Frage {aktFrage + 1} von {FRAGEN.length}</Text>
        </View>

        {/* Frage */}
        <View style={s.frageCard}>
          <Text style={s.frageText}>{frage.frage}</Text>
        </View>

        {/* Antworten */}
        <View style={s.antwortenContainer}>
          {frage.antworten.map((a, i) => (
            <TouchableOpacity
              key={i}
              style={[
                s.antwortBtn,
                gewaehlt === i && { backgroundColor: C.goldLight, borderColor: C.gold },
              ]}
              onPress={() => antwortWaehlen(a.typ, i)}
              activeOpacity={0.8}
            >
              <Text style={s.antwortText}>{a.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: C.brown, padding: 24, paddingTop: 32, alignItems: "center" },
  backBtn: { alignSelf: "flex-start", marginBottom: 12 },
  backBtnText: { fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: "600" },
  headerSymbol: { fontSize: 48, marginBottom: 8 },
  headerTitel: { fontSize: 22, fontWeight: "700", color: "#FFF", textAlign: "center", marginBottom: 6 },
  headerSub: { fontSize: 14, color: "rgba(255,255,255,0.75)", textAlign: "center" },

  progressContainer: { paddingHorizontal: 20, paddingVertical: 16 },
  progressBg: { height: 6, backgroundColor: C.border, borderRadius: 3, overflow: "hidden", marginBottom: 8 },
  progressFill: { height: "100%", backgroundColor: C.gold, borderRadius: 3 },
  progressText: { fontSize: 12, color: C.muted, textAlign: "right" },

  frageCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border },
  frageText: { fontSize: 18, fontWeight: "600", color: C.brown, lineHeight: 28, textAlign: "center" },

  antwortenContainer: { paddingHorizontal: 16, gap: 10 },
  antwortBtn: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: C.border },
  antwortText: { fontSize: 15, color: C.brownMid, lineHeight: 22 },

  // Ergebnis
  ergebnisHeader: { padding: 32, paddingTop: 40, alignItems: "center" },
  ergebnisSymbol: { fontSize: 64, marginBottom: 8 },
  ergebnisLabel: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 4 },
  ergebnisName: { fontSize: 26, fontWeight: "700", color: "#FFF", textAlign: "center" },

  card: { marginHorizontal: 16, marginTop: 12, backgroundColor: C.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: C.border },
  cardTitel: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 10 },
  cardText: { fontSize: 15, color: C.brownMid, lineHeight: 24 },
  affirmation: { fontSize: 16, fontStyle: "italic", lineHeight: 26, textAlign: "center", fontWeight: "600" },

  staerkenGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  staerkenBadge: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1 },
  staerkenText: { fontSize: 13, fontWeight: "600" },

  ctaCard: { margin: 16, marginTop: 12, backgroundColor: C.goldLight, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.gold + "60", alignItems: "center" },
  ctaTitel: { fontSize: 18, fontWeight: "700", color: C.brown, marginBottom: 8, textAlign: "center" },
  ctaText: { fontSize: 14, color: C.brownMid, lineHeight: 22, textAlign: "center", marginBottom: 16 },
  ctaBtn: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24 },
  ctaBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  neuStartenBtn: { marginHorizontal: 16, marginTop: 8, padding: 14, alignItems: "center" },
  neuStartenText: { fontSize: 14, color: C.muted, textDecorationLine: "underline" },
});
