import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions, Platform, Linking,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
  purple: "#2D1B4E", purpleLight: "#3D2B5E",
};

// ============================================================
// FRAGEN
// ============================================================
const fragen = [
  { frage: "Wie fühlt sich dein Herz gerade an?", antworten: [
    { text: "🌹 Es sehnt sich nach Wärme und Selbstliebe", typ: "R" },
    { text: "🌙 Es ist träumerisch und nach innen gewandt", typ: "M" },
    { text: "💜 Es sucht Stille und inneren Frieden", typ: "A" },
    { text: "🛡️ Es fühlt sich überreizt und schutzbedürftig an", typ: "S" },
    { text: "🌿 Es sehnt sich nach Veränderung und neuer Energie", typ: "E" },
  ]},
  { frage: "Was brauchst du gerade am meisten?", antworten: [
    { text: "💗 Mehr Liebe und Mitgefühl für mich selbst", typ: "R" },
    { text: "✨ Verbindung zu meiner Intuition", typ: "M" },
    { text: "🧘 Klarheit im Kopf und innere Ruhe", typ: "A" },
    { text: "⚡ Schutz – ich spüre zu viel von meiner Umgebung", typ: "S" },
    { text: "🌊 Frische Energie und den Mut zur Veränderung", typ: "E" },
  ]},
  { frage: "Welche Farbe zieht dich gerade an?", antworten: [
    { text: "🌸 Rosa & zartes Pink – weich und liebevoll", typ: "R" },
    { text: "🤍 Perlweiß & Creme – mondlich und rein", typ: "M" },
    { text: "💜 Lila & Violett – tief und besinnlich", typ: "A" },
    { text: "🖤 Schwarz – kraftvoll und schützend", typ: "S" },
    { text: "💚 Grün & Türkis – lebendig und frisch", typ: "E" },
  ]},
  { frage: "Was beschreibt dich gerade am besten?", antworten: [
    { text: "🩹 Ich bin gerade in einer Heilungsphase", typ: "R" },
    { text: "🌙 Ich bin sensitiv und sehr nach innen gewandt", typ: "M" },
    { text: "🌀 Mein Kopf rattert – ich suche Stille", typ: "A" },
    { text: "🧱 Ich lasse mich zu viel von anderen beeinflussen", typ: "S" },
    { text: "🦋 Ich bin im Aufbruch – etwas Neues beginnt", typ: "E" },
  ]},
  { frage: "Welcher Satz trifft dich am tiefsten?", antworten: [
    { text: "🌹 Ich bin es wert, geliebt zu werden.", typ: "R" },
    { text: "🌙 Ich vertraue dem, was ich tief innen weiß.", typ: "M" },
    { text: "💎 Ich darf zur Ruhe kommen.", typ: "A" },
    { text: "🛡️ Ich bin geschützt. Nichts muss mich destabilisieren.", typ: "S" },
    { text: "🌿 Ich lasse los und mache Platz für das Neue.", typ: "E" },
  ]},
  { frage: "Wie schläfst du gerade?", antworten: [
    { text: "💗 Unruhig – ich trage nachts viele Gefühle", typ: "R" },
    { text: "🌙 Intensiv und voller lebhafter Träume", typ: "M" },
    { text: "🧠 Schlecht – mein Geist findet keine Ruhe", typ: "A" },
    { text: "😰 Angespannt – ich kann schwer abschalten", typ: "S" },
    { text: "🌀 Unregelmäßig – mein Leben ist im Umbruch", typ: "E" },
  ]},
  { frage: "Welches Element spricht deine Seele an?", antworten: [
    { text: "🌊 Wasser – fließend, heilend, weich", typ: "R" },
    { text: "🌙 Mond & Äther – mystisch, zwischen den Welten", typ: "M" },
    { text: "💨 Luft – klar, befreiend, leicht", typ: "A" },
    { text: "🌍 Erde – sicher, geerdet, stabil", typ: "S" },
    { text: "🔥 Feuer – transformierend, lebendig", typ: "E" },
  ]},
  { frage: "Was zeigt sich bei dir oft im Alltag?", antworten: [
    { text: "😢 Ich bin schnell gerührt oder verletzlich", typ: "R" },
    { text: "💭 Ich habe starke Vorahnungen und innere Bilder", typ: "M" },
    { text: "🌀 Meine Gedanken hören nicht auf zu kreisen", typ: "A" },
    { text: "😤 Ich nehme Energie anderer sehr stark auf", typ: "S" },
    { text: "✨ Ich spüre eine Sehnsucht nach etwas Neuem", typ: "E" },
  ]},
  { frage: "Was darf gerade heilen?", antworten: [
    { text: "💔 Eine alte Herzwunde – das Gefühl, nicht genug zu sein", typ: "R" },
    { text: "🌫️ Die Verbindung zu mir selbst – ich fühle mich unklar", typ: "M" },
    { text: "🧊 Innere Anspannung und gedankliche Überlastung", typ: "A" },
    { text: "🔒 Meine Grenzen – ich gebe zu viel von mir weg", typ: "S" },
    { text: "🌱 Die Angst vor Veränderung und dem Loslassen", typ: "E" },
  ]},
  { frage: "Was stärkst du gerne in dir?", antworten: [
    { text: "💖 Selbstliebe und Herzwärme", typ: "R" },
    { text: "🔮 Intuition und spirituelles Gespür", typ: "M" },
    { text: "🌤️ Geistige Leichtigkeit und Fokus", typ: "A" },
    { text: "💪 Innere Stärke und klare Energiegrenzen", typ: "S" },
    { text: "🌈 Lebensfreude, Wachstum und neue Impulse", typ: "E" },
  ]},
  { frage: "Welche Stimmung passt gerade zu dir?", antworten: [
    { text: "🌸 Sanft, romantisch, herzlich", typ: "R" },
    { text: "🌙 Ruhig, verträumt, nach innen gewandt", typ: "M" },
    { text: "🕊️ Klar, still, friedvoll", typ: "A" },
    { text: "🏔️ Geerdet, zurückgezogen, schützend", typ: "S" },
    { text: "🌊 Aufbruch – frisch, neugierig, lebendig", typ: "E" },
  ]},
  { frage: "Was würde deine Seele dir heute flüstern?", antworten: [
    { text: "🌹 Sei sanfter mit dir. Du verdienst echte Liebe.", typ: "R" },
    { text: "🌙 Vertrau dem Flüstern in dir. Es führt dich.", typ: "M" },
    { text: "💜 Atme. Komm zur Ruhe. Du musst nicht alles durchdenken.", typ: "A" },
    { text: "🛡️ Schütz deine Energie. Nicht alles gehört zu dir.", typ: "S" },
    { text: "🌿 Lass los. Das Neue wartet schon auf dich.", typ: "E" },
  ]},
];

// ============================================================
// ERGEBNISSE
// ============================================================
interface Ergebnis {
  gem: string;
  titel: string;
  stein: string;
  text: string;
  aff: string;
  armbaender: string[];
}

const ergebnisse: Record<string, Ergebnis> = {
  R: {
    gem: "🌹", titel: "Rosenquarz",
    stein: "Der Stein der Herzöffnung & Selbstliebe",
    text: "Rosenquarz ist der sanfteste Heiler des Herzens. Er erinnert dich daran, dass du Liebe nicht verdienen musst – du bist Liebe. In dieser Phase darf dein Herz sich öffnen, atmen und heilen.",
    aff: "Ich bin es wert, geliebt zu werden – beginnend bei mir selbst.",
    armbaender: ["Happy Heart", "Heart of Love", "Pure Heart", "Pure Love", "Soul Letters", "Wolke 7"],
  },
  M: {
    gem: "🌙", titel: "Mondstein",
    stein: "Der Stein der Intuition & weiblichen Kraft",
    text: "Mondstein verbindet dich mit deinen tiefsten Gefühlen und deiner inneren Weisheit. Er begleitet dich durch Zyklen und erinnert dich: Du bist Teil von etwas viel Größerem.",
    aff: "Ich vertraue dem Rhythmus meines Lebens und der Stille in mir.",
    armbaender: ["Pure Elegance", "Happy Moonlight", "Daisy Moon", "Happy Glow", "True Heart", "Inner Moonlight", "Peaceful Blue", "Soul Care", "Intuitive Glow"],
  },
  A: {
    gem: "💜", titel: "Amethyst",
    stein: "Der Stein der inneren Ruhe & Klarheit",
    text: "Amethyst beruhigt den Geist und schützt deine Energie. Wenn deine Gedanken nicht aufhören wollen – Amethyst hält dich geerdet und klar.",
    aff: "Mein Geist wird stiller. Ich finde meinen inneren Frieden.",
    armbaender: ["Happy Vibes", "Positive Aura", "Soft Peace", "Clear Mind"],
  },
  S: {
    gem: "🖤", titel: "Schwarzer Turmalin",
    stein: "Der Stein des Schutzes & der Stärke",
    text: "Schwarzer Turmalin ist dein kraftvollster Schutzstein. Er hält fremde Energien fern, erdet dich tief und stärkt deine innere Grenze. Du darfst dich schützen – das ist keine Schwäche.",
    aff: "Ich bin geerdet und geschützt. Ich bestimme, was zu mir darf.",
    armbaender: ["Safe Aura", "Mystic Guard", "Superhero (Herren)"],
  },
  E: {
    gem: "🌿", titel: "Grüner Aventurin",
    stein: "Der Stein des Wachstums & neuer Energie",
    text: "Du bist im Aufbruch. Grüner Aventurin bringt Glück, Wachstum und frische Lebensenergie. Er begleitet deinen Neuanfang mit der vollen Kraft der Natur.",
    aff: "Ich öffne mich dem Neuen. Mein Leben darf sich wunderbar wandeln.",
    armbaender: ["Happy Harmony", "Energy Mix", "Green Aura", "Ocean", "Ocean Wave", "Pastel Mood", "Lunar Heart"],
  },
};

// ============================================================
// QUIZ COMPONENT
// ============================================================
export default function HeilsteinQuizScreen() {
  const [schritt, setSchritt] = useState<"intro" | "quiz" | "ergebnis">("intro");
  const [aktFrage, setAktFrage] = useState(0);
  const [punkte, setPunkte] = useState<Record<string, number>>({ R: 0, M: 0, A: 0, S: 0, E: 0 });
  const [sieger, setSieger] = useState<string | null>(null);

  const handleAntwort = (typ: string) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const neu = { ...punkte, [typ]: punkte[typ] + 1 };
    setPunkte(neu);

    if (aktFrage < fragen.length - 1) {
      setAktFrage(aktFrage + 1);
    } else {
      const w = Object.entries(neu).sort((a, b) => b[1] - a[1])[0][0];
      setSieger(w);
      setSchritt("ergebnis");
    }
  };

  const neuStarten = () => {
    setSchritt("intro");
    setAktFrage(0);
    setPunkte({ R: 0, M: 0, A: 0, S: 0, E: 0 });
    setSieger(null);
  };

  const pct = Math.round((aktFrage / fragen.length) * 100);
  const e = sieger ? ergebnisse[sieger] : null;

  // ---- INTRO ----
  if (schritt === "intro") {
    return (
      <ScreenContainer containerClassName="bg-background">
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
          <View style={st.header}>
            <TouchableOpacity style={st.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={st.backText}>‹</Text>
            </TouchableOpacity>
          </View>

          <View style={st.introContainer}>
            <Text style={{ fontSize: 52, marginBottom: 18 }}>🔮</Text>
            <Text style={st.introTitle}>Welcher Heilstein gehört gerade zu dir?</Text>
            <Text style={st.introSub}>
              Heilsteine finden uns – in dem Moment, in dem wir sie wirklich brauchen.{"\n"}
              Sie spüren, was deine Seele gerade braucht, manchmal bevor du es selbst weißt.
            </Text>

            {/* Stein-Chips */}
            <View style={st.steinGrid}>
              {[
                { emoji: "🌹", name: "Rosenquarz", color: "#F5D5D5" },
                { emoji: "🌙", name: "Mondstein", color: "#D4E4F7" },
                { emoji: "💜", name: "Amethyst", color: "#E8D5F5" },
                { emoji: "🖤", name: "Turmalin", color: "#D5D5D5" },
                { emoji: "🌿", name: "Aventurin", color: "#D5F0D5" },
              ].map((s, i) => (
                <View key={i} style={[st.steinChip, { backgroundColor: s.color }]}>
                  <Text style={{ fontSize: 14 }}>{s.emoji}</Text>
                  <Text style={st.steinChipText}>{s.name}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 13, color: C.muted, fontStyle: "italic", marginBottom: 24, letterSpacing: 0.5 }}>
              12 ehrliche Fragen · dein persönliches Ergebnis
            </Text>

            <TouchableOpacity
              style={st.startBtn}
              onPress={() => {
                if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setSchritt("quiz");
              }}
              activeOpacity={0.85}
            >
              <Text style={st.startBtnText}>🔮 Jetzt entdecken</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ---- QUIZ ----
  if (schritt === "quiz") {
    return (
      <ScreenContainer containerClassName="bg-background">
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
          <View style={st.header}>
            <TouchableOpacity style={st.backBtn} onPress={() => {
              if (aktFrage > 0) {
                setAktFrage(aktFrage - 1);
              } else {
                setSchritt("intro");
              }
            }} activeOpacity={0.7}>
              <Text style={st.backText}>‹</Text>
            </TouchableOpacity>
            <Text style={st.frageNr}>Frage {aktFrage + 1} von {fragen.length}</Text>
          </View>

          {/* Progress Bar */}
          <View style={st.progressBar}>
            <View style={[st.progressFill, { width: `${pct}%` }]} />
          </View>

          <View style={st.quizContainer}>
            <Text style={st.frageTitel}>{fragen[aktFrage].frage}</Text>
            {fragen[aktFrage].antworten.map((a, i) => (
              <TouchableOpacity
                key={i}
                style={st.antwortBtn}
                onPress={() => handleAntwort(a.typ)}
                activeOpacity={0.8}
              >
                <Text style={st.antwortText}>{a.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ---- ERGEBNIS ----
  if (!e) return null;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        <View style={st.header}>
          <TouchableOpacity style={st.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={st.backText}>‹</Text>
          </TouchableOpacity>
        </View>

        <View style={st.ergebnisContainer}>
          {/* Stein-Emoji groß */}
          <Text style={{ fontSize: 58, textAlign: "center", marginBottom: 18 }}>{e.gem}</Text>

          <Text style={st.ergebnisTitel}>Dein Heilstein</Text>
          <Text style={st.ergebnisName}>{e.titel}</Text>
          <Text style={st.ergebnisSub}>{e.stein}</Text>

          {/* Beschreibung */}
          <View style={st.ergebnisCard}>
            <Text style={st.ergebnisCardTitel}>Dein Stein spricht zu dir</Text>
            <Text style={st.ergebnisCardText}>{e.text}</Text>
          </View>

          {/* Affirmation */}
          <View style={[st.ergebnisCard, { backgroundColor: C.goldLight, borderColor: "#E8D5B0" }]}>
            <Text style={st.affirmationLabel}>✨ Deine Affirmation</Text>
            <Text style={st.affirmationText}>{e.aff}</Text>
          </View>

          {/* Passende Armbänder */}
          <View style={st.ergebnisCard}>
            <Text style={st.ergebnisCardTitel}>🌙 Deine passenden Armbänder</Text>
            <View style={st.armbandGrid}>
              {e.armbaender.map((name, i) => (
                <View key={i} style={st.armbandChip}>
                  <Text style={st.armbandChipText}>🌙 {name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* CTA – Shop */}
          <View style={st.ctaCard}>
            <Text style={st.ctaTitel}>🌙 Entdecke dein Armband</Text>
            <Text style={st.ctaText}>
              Jedes Armband wird mit echten Heilsteinen handgefertigt – finde dein persönliches Kraftarmband im Shop der Seelenplanerin.
            </Text>
            <TouchableOpacity
              style={st.ctaBtn}
              onPress={() => {
                if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Linking.openURL("https://dieseelenplanerin.de/collections/energiearmbander");
              }}
              activeOpacity={0.85}
            >
              <Text style={st.ctaBtnText}>Zum Shop →</Text>
            </TouchableOpacity>
          </View>

          {/* Nochmal spielen */}
          <TouchableOpacity style={st.neuBtn} onPress={neuStarten} activeOpacity={0.8}>
            <Text style={st.neuBtnText}>Quiz nochmal machen</Text>
          </TouchableOpacity>

          <Text style={{ textAlign: "center", fontSize: 13, color: C.muted, fontStyle: "italic", marginTop: 20 }}>
            — Die Seelenplanerin —
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

// ============================================================
// STYLES
// ============================================================
const st = StyleSheet.create({
  header: { padding: 16, paddingBottom: 0, flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" },
  backText: { fontSize: 20, color: C.rose },
  frageNr: { fontSize: 14, color: C.muted, fontWeight: "600" },
  progressBar: { height: 4, backgroundColor: C.border, marginHorizontal: 16, marginTop: 8, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: C.rose, borderRadius: 2 },

  // Intro
  introContainer: { padding: 20, alignItems: "center" },
  introTitle: { fontSize: 26, fontWeight: "700", color: C.brown, textAlign: "center", lineHeight: 34, marginBottom: 12 },
  introSub: { fontSize: 14, color: C.brownMid, textAlign: "center", lineHeight: 22, marginBottom: 20, paddingHorizontal: 10 },
  steinGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 16 },
  steinChip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4 },
  steinChipText: { fontSize: 12, color: C.brown, fontWeight: "600" },
  startBtn: { backgroundColor: C.rose, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40, marginBottom: 12 },
  startBtnText: { color: "#FFF", fontSize: 17, fontWeight: "700" },

  // Quiz
  quizContainer: { padding: 20 },
  frageTitel: { fontSize: 20, fontWeight: "700", color: C.brown, textAlign: "center", lineHeight: 28, marginBottom: 24 },
  antwortBtn: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1.5, borderColor: C.border },
  antwortText: { fontSize: 15, color: C.brownMid, lineHeight: 22 },

  // Ergebnis
  ergebnisContainer: { padding: 20 },
  ergebnisTitel: { fontSize: 16, color: C.muted, textAlign: "center", marginBottom: 4 },
  ergebnisName: { fontSize: 32, fontWeight: "700", color: C.brown, textAlign: "center", marginBottom: 6 },
  ergebnisSub: { fontSize: 16, color: C.rose, textAlign: "center", fontStyle: "italic", marginBottom: 20 },
  ergebnisCard: { backgroundColor: C.card, borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: C.border },
  ergebnisCardTitel: { fontSize: 17, fontWeight: "700", color: C.brown, marginBottom: 10 },
  ergebnisCardText: { fontSize: 14, color: C.brownMid, lineHeight: 22 },
  affirmationLabel: { fontSize: 14, color: C.gold, fontWeight: "700", marginBottom: 8 },
  affirmationText: { fontSize: 16, color: C.brown, fontStyle: "italic", lineHeight: 24 },

  // Armbänder
  armbandGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  armbandChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: C.gold + "50", backgroundColor: C.goldLight },
  armbandChipText: { fontSize: 12, color: C.gold, fontWeight: "500" },

  // CTA
  ctaCard: { backgroundColor: C.roseLight, borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: C.rose + "40", alignItems: "center" },
  ctaTitel: { fontSize: 18, fontWeight: "700", color: C.brown, textAlign: "center", marginBottom: 8 },
  ctaText: { fontSize: 14, color: C.brownMid, textAlign: "center", lineHeight: 21, marginBottom: 16 },
  ctaBtn: { backgroundColor: C.rose, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28 },
  ctaBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  neuBtn: { backgroundColor: C.surface, borderRadius: 14, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: C.border },
  neuBtnText: { fontSize: 15, color: C.brownMid, fontWeight: "600" },
});
