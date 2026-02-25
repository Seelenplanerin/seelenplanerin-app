import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
};

const FRAGEN = [
  {
    frage: "Was suchst du gerade in deinem Leben am meisten?",
    antworten: [
      { text: "Schutz und Sicherheit", typ: "ALGIZ" },
      { text: "Liebe und tiefe Verbindung", typ: "GEBO" },
      { text: "Kraft und Mut für Veränderungen", typ: "URUZ" },
      { text: "Klarheit und innere Weisheit", typ: "ANSUZ" },
    ],
  },
  {
    frage: "Welches Bild berührt dich am tiefsten?",
    antworten: [
      { text: "Ein mächtiger Baum mit tiefen Wurzeln", typ: "EIHWAZ" },
      { text: "Ein strahlendes Licht im Dunkeln", typ: "SOWILO" },
      { text: "Eine ruhige Quelle im Wald", typ: "LAGUZ" },
      { text: "Ein Blitz, der den Himmel erhellt", typ: "THURISAZ" },
    ],
  },
  {
    frage: "Was blockiert dich gerade am meisten?",
    antworten: [
      { text: "Angst und Unsicherheit", typ: "ALGIZ" },
      { text: "Mangel an Energie und Antrieb", typ: "URUZ" },
      { text: "Unklarheit über meinen Weg", typ: "RAIDHO" },
      { text: "Alte Muster, die ich nicht loslassen kann", typ: "ISA" },
    ],
  },
  {
    frage: "Wie würden deine engsten Freunde dich beschreiben?",
    antworten: [
      { text: "Stark, beschützend, zuverlässig", typ: "ALGIZ" },
      { text: "Liebevoll, großzügig, verbindend", typ: "GEBO" },
      { text: "Kreativ, inspirierend, feurig", typ: "KENAZ" },
      { text: "Weise, intuitiv, tiefgründig", typ: "ANSUZ" },
    ],
  },
  {
    frage: "Welches Element spricht dich am meisten an?",
    antworten: [
      { text: "Feuer – Transformation und Leidenschaft", typ: "KENAZ" },
      { text: "Wasser – Intuition und Heilung", typ: "LAGUZ" },
      { text: "Erde – Stabilität und Verwurzelung", typ: "EIHWAZ" },
      { text: "Luft – Freiheit und Kommunikation", typ: "ANSUZ" },
    ],
  },
  {
    frage: "Was ist dein größter Wunsch für die nächsten Monate?",
    antworten: [
      { text: "Einen neuen Weg einschlagen", typ: "RAIDHO" },
      { text: "Tiefe Liebe und Partnerschaft finden", typ: "GEBO" },
      { text: "Meine Kraft und Gesundheit stärken", typ: "URUZ" },
      { text: "Erfolg und Wohlstand manifestieren", typ: "FEHU" },
    ],
  },
  {
    frage: "Welches Tier fühlt sich wie dein Seelenbegleiter an?",
    antworten: [
      { text: "Wolf – Schutz, Instinkt, Rudel", typ: "ALGIZ" },
      { text: "Adler – Weitsicht, Freiheit, Stärke", typ: "SOWILO" },
      { text: "Schlange – Transformation, Heilung, Weisheit", typ: "EIHWAZ" },
      { text: "Schwan – Anmut, Liebe, Schönheit", typ: "GEBO" },
    ],
  },
  {
    frage: "Was gibt dir in schwierigen Momenten Halt?",
    antworten: [
      { text: "Mein inneres Licht und meine Intuition", typ: "SOWILO" },
      { text: "Die Verbindung zu Menschen, die ich liebe", typ: "GEBO" },
      { text: "Meine Wurzeln und meine innere Stärke", typ: "URUZ" },
      { text: "Stille, Rückzug und Reflexion", typ: "ISA" },
    ],
  },
];

const RUNEN: Record<string, {
  name: string; symbol: string; bedeutung: string; energie: string;
  botschaft: string; affirmation: string; heilstein: string; farbe: string; farbHell: string;
}> = {
  ALGIZ: {
    name: "Algiz", symbol: "ᛉ", bedeutung: "Schutz & Verbindung zum Höheren",
    energie: "Schützende Kraft, göttliche Verbindung, Abwehr negativer Energien",
    botschaft: "Du trägst einen natürlichen Schutzschild in dir. Algiz erinnert dich daran, dass du immer mit dem Höheren verbunden bist. Vertraue deiner Intuition – sie ist dein stärkster Schutz.",
    affirmation: "Ich bin geschützt. Göttliches Licht umhüllt mich auf meinem Weg.",
    heilstein: "Schwarzer Turmalin oder Amethyst",
    farbe: "#2C4A2E", farbHell: "#E8F0E8",
  },
  GEBO: {
    name: "Gebo", symbol: "ᚷ", bedeutung: "Geschenk & Partnerschaft",
    energie: "Liebe, Geben und Nehmen, tiefe Verbindungen, Ausgewogenheit",
    botschaft: "Deine Seele sehnt sich nach echter Verbindung. Gebo erinnert dich daran, dass wahre Liebe ein Gleichgewicht aus Geben und Nehmen ist. Öffne dein Herz – du verdienst es, geliebt zu werden.",
    affirmation: "Ich bin offen für tiefe Liebe. Ich gebe und empfange mit offenem Herzen.",
    heilstein: "Rosenquarz oder Rhodonit",
    farbe: "#C4826A", farbHell: "#F9EDE8",
  },
  URUZ: {
    name: "Uruz", symbol: "ᚢ", bedeutung: "Urkraft & Gesundheit",
    energie: "Wilde Kraft, Vitalität, Mut, körperliche und seelische Stärke",
    botschaft: "In dir schlummert eine unbändige Urkraft. Uruz ruft dich auf, diese Energie zu erwecken und mutig voranzugehen. Dein Körper und deine Seele sind stärker als du glaubst.",
    affirmation: "Ich bin kraftvoll und vital. Meine innere Stärke trägt mich durch jeden Sturm.",
    heilstein: "Roter Jaspis oder Karneol",
    farbe: "#8B2020", farbHell: "#F5E8E8",
  },
  ANSUZ: {
    name: "Ansuz", symbol: "ᚨ", bedeutung: "Göttliche Botschaft & Weisheit",
    energie: "Kommunikation, Inspiration, Weisheit, Verbindung zur höheren Wahrheit",
    botschaft: "Du bist ein Kanal für göttliche Weisheit. Ansuz erinnert dich daran, auf die Zeichen zu achten, die dir das Leben sendet. Deine Worte haben Kraft – nutze sie weise.",
    affirmation: "Ich höre auf meine innere Weisheit. Göttliche Führung leitet meine Schritte.",
    heilstein: "Lapislazuli oder Sodalith",
    farbe: "#1A3A5C", farbHell: "#E0EEF5",
  },
  RAIDHO: {
    name: "Raidho", symbol: "ᚱ", bedeutung: "Reise & Richtung",
    energie: "Bewegung, Weg, Rhythmus, die richtige Richtung finden",
    botschaft: "Du stehst an einem Wendepunkt. Raidho zeigt dir, dass es Zeit ist, dich in Bewegung zu setzen. Vertraue dem Weg – auch wenn du das Ziel noch nicht siehst. Jeder Schritt bringt dich näher.",
    affirmation: "Ich vertraue meinem Weg. Jeder Schritt führt mich zu meiner wahren Bestimmung.",
    heilstein: "Tigerauge oder Citrin",
    farbe: "#5C4A1A", farbHell: "#F5F0E0",
  },
  SOWILO: {
    name: "Sowilo", symbol: "ᛋ", bedeutung: "Sonne & Sieg",
    energie: "Licht, Erfolg, Heilung, inneres Leuchten, Lebenskraft",
    botschaft: "Du bist ein Licht in dieser Welt. Sowilo erinnert dich daran, dass du die Kraft hast, jeden Schatten zu erhellen. Dein inneres Licht ist unauslöschlich – lass es strahlen.",
    affirmation: "Ich leuchte aus meiner Mitte heraus. Mein Licht erhellt meinen Weg und den anderer.",
    heilstein: "Bergkristall oder Citrin",
    farbe: "#C9A96E", farbHell: "#FAF3E7",
  },
  LAGUZ: {
    name: "Laguz", symbol: "ᛚ", bedeutung: "Wasser & Intuition",
    energie: "Fließen, Intuition, Heilung, emotionale Tiefe, weibliche Kraft",
    botschaft: "Deine Intuition ist dein stärkster Kompass. Laguz lädt dich ein, dem Fluss des Lebens zu vertrauen und deine emotionale Tiefe als Stärke zu sehen. Fließe – widersetze dich nicht.",
    affirmation: "Ich vertraue meiner Intuition. Ich fließe mit dem Strom des Lebens.",
    heilstein: "Mondstein oder Aquamarin",
    farbe: "#1A4A5C", farbHell: "#E0F0F5",
  },
  KENAZ: {
    name: "Kenaz", symbol: "ᚲ", bedeutung: "Feuer & Kreativität",
    energie: "Kreative Kraft, Leidenschaft, Erleuchtung, Transformation durch Feuer",
    botschaft: "In dir brennt ein kreatives Feuer. Kenaz ruft dich auf, deine Leidenschaften zu entfachen und deine einzigartigen Gaben in die Welt zu bringen. Deine Kreativität ist ein Geschenk.",
    affirmation: "Mein inneres Feuer brennt hell. Ich erschaffe mit Leidenschaft und Freude.",
    heilstein: "Karneol oder Feueropal",
    farbe: "#C45A1A", farbHell: "#F5EAE0",
  },
  EIHWAZ: {
    name: "Eihwaz", symbol: "ᛇ", bedeutung: "Lebensbaum & Transformation",
    energie: "Verwurzelung, Ausdauer, Verbindung zwischen Welten, tiefe Transformation",
    botschaft: "Du bist wie der Lebensbaum – tief verwurzelt und gleichzeitig in den Himmel strebend. Eihwaz zeigt dir, dass du die Kraft hast, jede Transformation zu durchleben und gestärkt daraus hervorzugehen.",
    affirmation: "Ich bin tief verwurzelt und gleichzeitig frei. Ich wachse durch jede Herausforderung.",
    heilstein: "Obsidian oder Rauchquarz",
    farbe: "#2C4A2E", farbHell: "#E8F0E8",
  },
  THURISAZ: {
    name: "Thurisaz", symbol: "ᚦ", bedeutung: "Schutz & Durchbruch",
    energie: "Schutzende Kraft, Durchbruch durch Hindernisse, Entschlossenheit",
    botschaft: "Es ist Zeit, Hindernisse zu überwinden. Thurisaz gibt dir die Kraft, Grenzen zu setzen und mutig voranzugehen. Du bist stärker als jede Herausforderung, die vor dir liegt.",
    affirmation: "Ich überwinde alle Hindernisse mit Mut und Entschlossenheit.",
    heilstein: "Hämatit oder Schwarzer Turmalin",
    farbe: "#3A2C1A", farbHell: "#F0EAE0",
  },
  FEHU: {
    name: "Fehu", symbol: "ᚠ", bedeutung: "Fülle & Wohlstand",
    energie: "Reichtum, Manifestation, Überfluss, materielle und spirituelle Fülle",
    botschaft: "Du verdienst Fülle in allen Bereichen deines Lebens. Fehu erinnert dich daran, dass Wohlstand nicht nur materiell ist – es ist auch Liebe, Gesundheit und Freude. Öffne dich für den Überfluss.",
    affirmation: "Ich bin offen für Fülle. Das Universum versorgt mich in allen Bereichen meines Lebens.",
    heilstein: "Citrin oder Grüner Aventurin",
    farbe: "#4A7C1A", farbHell: "#EAF5E0",
  },
  ISA: {
    name: "Isa", symbol: "ᛁ", bedeutung: "Stille & innere Einkehr",
    energie: "Pause, Reflexion, innere Stärke, Geduld, Rückzug",
    botschaft: "Manchmal ist Stillstand der tiefste Fortschritt. Isa lädt dich ein, innezuhalten, zu reflektieren und deine innere Kraft zu sammeln. In der Stille findest du die Antworten, die du suchst.",
    affirmation: "In der Stille finde ich meine Kraft. Ich vertraue dem Timing des Lebens.",
    heilstein: "Bergkristall oder Mondstein",
    farbe: "#2C3A4A", farbHell: "#E8EEF5",
  },
};

export default function RunenQuizScreen() {
  const [aktFrage, setAktFrage] = useState(0);
  const [punkte, setPunkte] = useState<Record<string, number>>({});
  const [ergebnis, setErgebnis] = useState<string | null>(null);
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);

  function antwortWaehlen(typ: string, idx: number) {
    setGewaehlt(idx);
    setTimeout(() => {
      const neuePunkte = { ...punkte, [typ]: (punkte[typ] || 0) + 1 };
      setPunkte(neuePunkte);
      if (aktFrage < FRAGEN.length - 1) {
        setAktFrage(aktFrage + 1);
        setGewaehlt(null);
      } else {
        const max = Object.entries(neuePunkte).sort((a, b) => b[1] - a[1])[0][0];
        setErgebnis(max);
      }
    }, 300);
  }

  function neuStarten() {
    setAktFrage(0);
    setPunkte({});
    setErgebnis(null);
    setGewaehlt(null);
  }

  if (ergebnis) {
    const rune = RUNEN[ergebnis] || RUNEN["ALGIZ"];
    return (
      <ScreenContainer containerClassName="bg-background">
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={[s.ergebnisHeader, { backgroundColor: rune.farbe }]}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <Text style={s.backBtnText}>← Zurück</Text>
            </TouchableOpacity>
            <Text style={s.ergebnisSymbol}>{rune.symbol}</Text>
            <Text style={s.ergebnisLabel}>Deine Seelenrune</Text>
            <Text style={s.ergebnisName}>{rune.name}</Text>
            <Text style={s.ergebnisBedeutung}>{rune.bedeutung}</Text>
          </View>

          {/* Energie */}
          <View style={[s.card, { backgroundColor: rune.farbHell, borderColor: rune.farbe + "40" }]}>
            <Text style={[s.cardTitel, { color: rune.farbe }]}>⚡ Deine Runenenergie</Text>
            <Text style={[s.cardText, { color: C.brown }]}>{rune.energie}</Text>
          </View>

          {/* Botschaft */}
          <View style={s.card}>
            <Text style={s.cardTitel}>🌙 Laras Botschaft für dich</Text>
            <Text style={s.cardText}>{rune.botschaft}</Text>
          </View>

          {/* Heilstein */}
          <View style={s.card}>
            <Text style={s.cardTitel}>💎 Dein Heilstein</Text>
            <Text style={[s.cardText, { fontWeight: "700", color: C.brown, fontSize: 16 }]}>{rune.heilstein}</Text>
          </View>

          {/* Affirmation */}
          <View style={[s.card, { backgroundColor: rune.farbHell }]}>
            <Text style={s.cardTitel}>✨ Deine Runen-Affirmation</Text>
            <Text style={[s.affirmation, { color: rune.farbe }]}>"{rune.affirmation}"</Text>
          </View>

          {/* Armband CTA */}
          <View style={s.ctaCard}>
            <Text style={s.ctaSymbol}>{rune.symbol}</Text>
            <Text style={s.ctaTitel}>Trage deine Rune bei dir</Text>
            <Text style={s.ctaText}>Lara graviert deine persönliche Rune {rune.name} von Hand auf einen Charm – mit Heilsteinpulver veredelt. Dein persönliches Schutzarmband.</Text>
            <TouchableOpacity
              style={s.ctaBtn}
              onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/qnl3vN")}
              activeOpacity={0.85}
            >
              <Text style={s.ctaBtnText}>Runen-Armband bestellen →</Text>
            </TouchableOpacity>
          </View>

          {/* Seelenimpuls CTA */}
          <View style={[s.ctaCard, { backgroundColor: C.goldLight }]}>
            <Text style={s.ctaTitel}>Tiefer in die Runen eintauchen?</Text>
            <Text style={s.ctaText}>Im Seelenimpuls bekommst du monatlich tiefe Runen-Readings, persönliche Deutungen und Laras Begleitung.</Text>
            <TouchableOpacity
              style={[s.ctaBtn, { backgroundColor: C.gold }]}
              onPress={() => router.push("/seelenimpuls")}
              activeOpacity={0.85}
            >
              <Text style={s.ctaBtnText}>Zum Seelenimpuls → 17 € / Monat</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.neuStartenBtn} onPress={neuStarten} activeOpacity={0.8}>
            <Text style={s.neuStartenText}>Quiz wiederholen</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  const frage = FRAGEN[aktFrage];
  const fortschritt = (aktFrage / FRAGEN.length) * 100;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backBtnText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerSymbol}>ᚱ</Text>
          <Text style={s.headerTitel}>Welche Rune führt dich?</Text>
          <Text style={s.headerSub}>8 Fragen · Entdecke deine Seelenrune</Text>
        </View>

        {/* Fortschritt */}
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
  headerSymbol: { fontSize: 48, marginBottom: 8, color: C.gold },
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

  ergebnisHeader: { padding: 32, paddingTop: 40, alignItems: "center" },
  ergebnisSymbol: { fontSize: 72, marginBottom: 8, color: "#FFF" },
  ergebnisLabel: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 4 },
  ergebnisName: { fontSize: 28, fontWeight: "700", color: "#FFF", textAlign: "center", marginBottom: 6 },
  ergebnisBedeutung: { fontSize: 15, color: "rgba(255,255,255,0.85)", textAlign: "center", fontStyle: "italic" },

  card: { marginHorizontal: 16, marginTop: 12, backgroundColor: C.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: C.border },
  cardTitel: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 10 },
  cardText: { fontSize: 15, color: C.brownMid, lineHeight: 24 },
  affirmation: { fontSize: 16, fontStyle: "italic", lineHeight: 26, textAlign: "center", fontWeight: "600" },

  ctaCard: { margin: 16, marginTop: 12, backgroundColor: C.roseLight, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border, alignItems: "center" },
  ctaSymbol: { fontSize: 48, color: C.gold, marginBottom: 8 },
  ctaTitel: { fontSize: 18, fontWeight: "700", color: C.brown, marginBottom: 8, textAlign: "center" },
  ctaText: { fontSize: 14, color: C.brownMid, lineHeight: 22, textAlign: "center", marginBottom: 16 },
  ctaBtn: { backgroundColor: C.rose, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24 },
  ctaBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  neuStartenBtn: { marginHorizontal: 16, marginTop: 8, padding: 14, alignItems: "center" },
  neuStartenText: { fontSize: 14, color: C.muted, textDecorationLine: "underline" },
});
