import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, Linking, Dimensions, Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";

// Echte Armbänder von dieseelenplanerin.de, nach Heilstein zugeordnet
const ARMBAND_MAP: Record<string, { name: string; steine: string; image: string; url: string }[]> = {
  mondstein: [
    { name: "Divine Circle", steine: "Mondstein", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/DivineCircle_b6030451.jpg", url: "https://dieseelenplanerin.de/produkt/divine-circle" },
    { name: "Pure Spirit", steine: "Mondstein + Amethyst", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/purespirit_9f2b6a28.jpg", url: "https://dieseelenplanerin.de/produkt/pure-spirit" },
    { name: "Pure Grace", steine: "Opal + Bergkristall + Rosenquarz + Mondstein", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/PureGrace_44f99243.jpg", url: "https://dieseelenplanerin.de/produkt/pure-grace" },
  ],
  rosenquarz: [
    { name: "Happy Soul", steine: "Rosenquarz + Rhodonit", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Happysoul_e2fbf042.jpg", url: "https://dieseelenplanerin.de/produkt/happy-soul" },
    { name: "Pure Love", steine: "Rosenquarz", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/purelove2_604f308d.jpg", url: "https://dieseelenplanerin.de/produkt/pure-love" },
    { name: "Soul Letters \u2013 Rosenquarz", steine: "Wei\u00dfe Perlen + Rosenquarz", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/soulletterrosenquarz._8399a510.jpg", url: "https://dieseelenplanerin.de/produkt/soul-letters-rosenquarz" },
  ],
  "schwarzer-turmalin": [
    { name: "Bodyguard", steine: "Schwarzer Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/bodyguard_c0a58b10.jpg", url: "https://dieseelenplanerin.de/produkt/bodyguard-armband" },
    { name: "Safe Light", steine: "Schwarzer Turmalin + Dalmatiner Jaspis", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/SafeLight_f4ea2538.jpg", url: "https://dieseelenplanerin.de/produkt/safe-light" },
    { name: "Power Shield", steine: "Tigerauge + Schwarzer Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Powershield_bbdefa32.jpg", url: "https://dieseelenplanerin.de/produkt/power-shield" },
  ],
  amethyst: [
    { name: "Clear Mind", steine: "Bergkristall + Lapislazuli + Amethyst", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Clearmind_c5930d21.jpg", url: "https://dieseelenplanerin.de/produkt/clear-mind" },
    { name: "Pure Spirit", steine: "Mondstein + Amethyst", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/purespirit_9f2b6a28.jpg", url: "https://dieseelenplanerin.de/produkt/pure-spirit" },
  ],
  citrin: [
    { name: "Positive Mind", steine: "Citrin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/positivemnd,_001160a8.jpg", url: "https://dieseelenplanerin.de/produkt/positive-mind" },
    { name: "Golden Power", steine: "Citrin + Schwarzer Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Potitivemind_41a4770e.jpg", url: "https://dieseelenplanerin.de/produkt/golden-power" },
    { name: "Soul Letters \u2013 Citrin", steine: "Wei\u00dfe Perlen + Citrin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/SoulLetterCitrin_37a595b5.jpg", url: "https://dieseelenplanerin.de/produkt/soul-letters-citrin" },
    { name: "Spirit Glow", steine: "Peridot + Citrin + Rosenquarz", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/SpiritGlow_578dbe79.PNG", url: "https://dieseelenplanerin.de/produkt/spirit-glow" },
  ],
  labradorit: [
    { name: "Calm Spirit", steine: "Blauer Apatit + Lapislazuli + Bergkristall", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/CalmSpirit_b7d87f56.jpg", url: "https://dieseelenplanerin.de/produkt/calm-spirit" },
    { name: "True Voice", steine: "Blauer Apatit + T\u00fcrkis", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/truevoice_c4b1c1dd.jpg", url: "https://dieseelenplanerin.de/produkt/true-voice" },
  ],
  pyrit: [
    { name: "Golden Power", steine: "Citrin + Schwarzer Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Potitivemind_41a4770e.jpg", url: "https://dieseelenplanerin.de/produkt/golden-power" },
    { name: "Power Shield", steine: "Tigerauge + Schwarzer Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Powershield_bbdefa32.jpg", url: "https://dieseelenplanerin.de/produkt/power-shield" },
  ],
  carneol: [
    { name: "Inner Power", steine: "Malachit + Pinker Achat", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/InnerPower_2c1f936d.jpg", url: "https://dieseelenplanerin.de/produkt/inner-power" },
    { name: "Energy Flower", steine: "Peridot + Schwarzer Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/EnergyFlower_43dc2b42.jpg", url: "https://dieseelenplanerin.de/produkt/energy-flower" },
    { name: "True Love", steine: "Pinker Achat + Schwarzer Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/truelove_fe6ec462.jpg", url: "https://dieseelenplanerin.de/produkt/true-love" },
  ],
};

const openProduct = (url: string) => {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      controlsColor: "#C4897B",
      toolbarColor: "#FFF8F5",
    });
  } else {
    Linking.openURL(url);
  }
};

const { width } = Dimensions.get("window");

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
};

// ============================================================
// HEILSTEIN-DATENBANK – korrekte Zuordnungen
// ============================================================
interface Heilstein {
  id: string;
  name: string;
  emoji: string;
  farbe: string;
  farbCode: string;
  chakra: string;
  element: string;
  themen: string[];
  kurzBeschreibung: string;
  langBeschreibung: string;
  affirmation: string;
  wirkung: string[];
}

const HEILSTEINE: Heilstein[] = [
  {
    id: "mondstein",
    name: "Mondstein",
    emoji: "🌙",
    farbe: "Schimmerndes Weiß-Blau",
    farbCode: "#D4E4F7",
    chakra: "Sakralchakra & Kronenchakra",
    element: "Wasser",
    themen: ["intuition", "weiblichkeit", "zyklen", "neuanfang"],
    kurzBeschreibung: "Der Stein der Intuition und weiblichen Kraft",
    langBeschreibung: "Der Mondstein ist der Stein der Göttinnen und der weiblichen Energie. Er stärkt deine Intuition, verbindet dich mit den natürlichen Zyklen des Mondes und hilft dir, deine innere Weisheit zu hören. Er ist besonders kraftvoll bei Neumond und Vollmond und unterstützt dich bei Neuanfängen und Übergängen im Leben.",
    affirmation: "Ich vertraue meiner inneren Stimme und fließe mit den Zyklen des Lebens.",
    wirkung: ["Stärkt die Intuition", "Fördert weibliche Energie", "Unterstützt bei Neuanfängen", "Harmonisiert den Hormonhaushalt", "Verbindet mit der Mondenergie"],
  },
  {
    id: "rosenquarz",
    name: "Rosenquarz",
    emoji: "💗",
    farbe: "Zartes Rosa",
    farbCode: "#F5D5D5",
    chakra: "Herzchakra",
    element: "Wasser",
    themen: ["liebe", "selbstliebe", "heilung", "mitgefühl"],
    kurzBeschreibung: "Der Stein der bedingungslosen Liebe",
    langBeschreibung: "Der Rosenquarz öffnet dein Herz für Liebe – vor allem für die Liebe zu dir selbst. Er heilt alte Herzwunden, löst emotionale Blockaden und umgibt dich mit einer sanften, liebevollen Energie. Er erinnert dich daran, dass du es wert bist, geliebt zu werden – genau so wie du bist.",
    affirmation: "Ich bin es wert, geliebt zu werden. Mein Herz ist offen für Liebe und Heilung.",
    wirkung: ["Öffnet das Herzchakra", "Fördert Selbstliebe", "Heilt emotionale Wunden", "Stärkt Beziehungen", "Bringt inneren Frieden"],
  },
  {
    id: "schwarzer-turmalin",
    name: "Schwarzer Turmalin",
    emoji: "🖤",
    farbe: "Tiefes Schwarz",
    farbCode: "#2D2D2D",
    chakra: "Wurzelchakra",
    element: "Erde",
    themen: ["schutz", "erdung", "reinigung", "grenzen"],
    kurzBeschreibung: "Der stärkste Schutzstein",
    langBeschreibung: "Schwarzer Turmalin ist dein energetischer Bodyguard. Er absorbiert negative Energien, schützt dich vor Energievampiren und elektromagnetischer Strahlung. Er erdet dich tief mit der Erde und hilft dir, klare Grenzen zu setzen. Wenn du dich energetisch ausgelaugt fühlst, ist er dein wichtigster Begleiter.",
    affirmation: "Ich bin geschützt und geerdet. Negative Energien prallen an mir ab.",
    wirkung: ["Stärkster energetischer Schutz", "Absorbiert Negativität", "Erdet und stabilisiert", "Schützt vor Energievampiren", "Stärkt das Wurzelchakra"],
  },
  {
    id: "amethyst",
    name: "Amethyst",
    emoji: "💜",
    farbe: "Violett",
    farbCode: "#C8A2D4",
    chakra: "Kronenchakra & Drittes Auge",
    element: "Luft",
    themen: ["spiritualität", "ruhe", "transformation", "klarheit"],
    kurzBeschreibung: "Der Stein der spirituellen Transformation",
    langBeschreibung: "Der Amethyst ist der Meister der Transformation und spirituellen Entwicklung. Er beruhigt den Geist, fördert tiefe Meditation und öffnet das dritte Auge für höhere Einsichten. Er hilft dir, alte Muster loszulassen und dich auf deinem spirituellen Weg weiterzuentwickeln. Besonders kraftvoll bei Vollmond-Ritualen.",
    affirmation: "Ich bin offen für spirituelle Erkenntnis und transformiere mich mit Leichtigkeit.",
    wirkung: ["Fördert spirituelles Wachstum", "Beruhigt den Geist", "Unterstützt Meditation", "Öffnet das dritte Auge", "Hilft bei Transformation"],
  },
  {
    id: "citrin",
    name: "Citrin",
    emoji: "☀️",
    farbe: "Sonniges Gelb-Gold",
    farbCode: "#F7E4A3",
    chakra: "Solarplexus-Chakra",
    element: "Feuer",
    themen: ["fülle", "freude", "selbstvertrauen", "manifestation"],
    kurzBeschreibung: "Der Stein der Fülle und Lebensfreude",
    langBeschreibung: "Citrin ist pures Sonnenlicht in Steinform. Er zieht Fülle, Erfolg und Freude in dein Leben. Er stärkt dein Selbstvertrauen, aktiviert deine Manifestationskraft und hilft dir, deine Ziele mit Leichtigkeit zu erreichen. Er vertreibt dunkle Gedanken und füllt dich mit positiver Energie.",
    affirmation: "Ich bin voller Lebensfreude und ziehe Fülle in mein Leben.",
    wirkung: ["Zieht Fülle und Erfolg an", "Stärkt Selbstvertrauen", "Fördert Manifestation", "Bringt Lebensfreude", "Aktiviert Solarplexus"],
  },
  {
    id: "labradorit",
    name: "Labradorit",
    emoji: "🌌",
    farbe: "Schillerndes Blau-Grün",
    farbCode: "#7BA7BC",
    chakra: "Halschakra & Drittes Auge",
    element: "Wasser & Luft",
    themen: ["magie", "schutz", "intuition", "veränderung"],
    kurzBeschreibung: "Der Stein der Magie und Transformation",
    langBeschreibung: "Labradorit ist der mystischste aller Heilsteine. Sein schillerndes Farbenspiel erinnert an das Nordlicht und verbindet dich mit der Magie des Universums. Er schützt deine Aura, stärkt deine übersinnlichen Fähigkeiten und begleitet dich durch Zeiten der Veränderung. Er ist der Stein der Heiler und Lichtarbeiter.",
    affirmation: "Ich bin verbunden mit der Magie des Universums und vertraue meinem Weg.",
    wirkung: ["Schützt die Aura", "Stärkt übersinnliche Fähigkeiten", "Begleitet Veränderungen", "Fördert Kreativität", "Verbindet mit höheren Dimensionen"],
  },
  {
    id: "pyrit",
    name: "Pyrit",
    emoji: "✨",
    farbe: "Goldenes Metallic",
    farbCode: "#B8860B",
    chakra: "Solarplexuschakra",
    element: "Erde & Feuer",
    themen: ["fülle", "manifestation", "schutz", "willenskraft"],
    kurzBeschreibung: "Der Stein der Fülle und Manifestation",
    langBeschreibung: "Pyrit, auch Katzengold genannt, ist ein kraftvoller Manifestationsstein. Er hilft dir, deine Ziele zu verwirklichen, Fülle in dein Leben zu ziehen und dein Selbstvertrauen zu stärken. Er schützt vor negativen Energien und fördert Willenskraft und Durchsetzungsvermögen.",
    affirmation: "Ich bin es wert, in Fülle und Wohlstand zu leben. Alles was ich brauche, fließt zu mir.",
    wirkung: ["Zieht Fülle und Wohlstand an", "Stärkt Selbstvertrauen", "Schützt vor negativen Energien", "Fördert Willenskraft", "Unterstützt Manifestation"],
  },
  {
    id: "carneol",
    name: "Carneol",
    emoji: "🔥",
    farbe: "Warmes Orange-Rot",
    farbCode: "#E8A07A",
    chakra: "Sakralchakra",
    element: "Feuer",
    themen: ["mut", "kreativität", "leidenschaft", "energie"],
    kurzBeschreibung: "Der Stein des Mutes und der Kreativität",
    langBeschreibung: "Carneol ist der Feuerstein unter den Heilsteinen. Er entfacht deine Leidenschaft, deinen Mut und deine kreative Kraft. Er aktiviert dein Sakralchakra und hilft dir, deine Wünsche und Träume mutig in die Tat umzusetzen. Er ist der perfekte Begleiter, wenn du einen Energieschub brauchst und Neues wagen möchtest.",
    affirmation: "Ich bin mutig, kreativ und voller Leidenschaft für mein Leben.",
    wirkung: ["Entfacht Mut und Leidenschaft", "Fördert Kreativität", "Aktiviert Sakralchakra", "Gibt Energieschub", "Stärkt Entschlusskraft"],
  },
];

// ============================================================
// QUIZ-FRAGEN
// ============================================================
interface QuizFrage {
  id: number;
  frage: string;
  emoji: string;
  antworten: { text: string; steine: string[] }[];
}

const QUIZ_FRAGEN: QuizFrage[] = [
  {
    id: 1,
    frage: "Was brauchst du gerade am meisten in deinem Leben?",
    emoji: "🌿",
    antworten: [
      { text: "Schutz und Erdung – ich fühle mich energetisch belastet", steine: ["schwarzer-turmalin", "labradorit"] },
      { text: "Liebe und Heilung – mein Herz braucht Zuwendung", steine: ["rosenquarz", "mondstein"] },
      { text: "Klarheit und spirituelles Wachstum", steine: ["amethyst", "labradorit"] },
      { text: "Mut und Energie – ich will endlich loslegen!", steine: ["carneol", "sunstone"] },
    ],
  },
  {
    id: 2,
    frage: "Welches Element zieht dich am meisten an?",
    emoji: "🌊",
    antworten: [
      { text: "🌊 Wasser – fließend, intuitiv, tief", steine: ["mondstein", "rosenquarz"] },
      { text: "🔥 Feuer – leidenschaftlich, mutig, kraftvoll", steine: ["carneol", "sunstone", "citrin"] },
      { text: "🌍 Erde – stabil, geerdet, beschützend", steine: ["schwarzer-turmalin"] },
      { text: "💨 Luft – frei, spirituell, transformierend", steine: ["amethyst", "labradorit"] },
    ],
  },
  {
    id: 3,
    frage: "Welche Mondphase spricht dich am meisten an?",
    emoji: "🌙",
    antworten: [
      { text: "🌑 Neumond – Neuanfänge und Intentionen setzen", steine: ["mondstein", "citrin"] },
      { text: "🌓 Zunehmender Mond – Wachstum und Manifestation", steine: ["citrin", "sunstone"] },
      { text: "🌕 Vollmond – Loslassen und Reinigung", steine: ["amethyst", "schwarzer-turmalin"] },
      { text: "🌗 Abnehmender Mond – Reflexion und Innenschau", steine: ["labradorit", "rosenquarz"] },
    ],
  },
  {
    id: 4,
    frage: "Wie würdest du deinen aktuellen Gemütszustand beschreiben?",
    emoji: "💭",
    antworten: [
      { text: "Unruhig und überfordert – ich brauche Ruhe", steine: ["amethyst", "mondstein"] },
      { text: "Traurig oder verletzt – mein Herz ist schwer", steine: ["rosenquarz", "mondstein"] },
      { text: "Energielos und antriebslos – mir fehlt die Kraft", steine: ["carneol", "sunstone", "citrin"] },
      { text: "Unsicher und ängstlich – ich brauche Schutz", steine: ["schwarzer-turmalin", "labradorit"] },
    ],
  },
  {
    id: 5,
    frage: "Was ist dein größter Wunsch für die nächsten Wochen?",
    emoji: "✨",
    antworten: [
      { text: "Mehr Selbstliebe und inneren Frieden finden", steine: ["rosenquarz", "amethyst"] },
      { text: "Meine Ziele manifestieren und erfolgreich sein", steine: ["citrin", "sunstone"] },
      { text: "Mich energetisch schützen und abgrenzen", steine: ["schwarzer-turmalin", "labradorit"] },
      { text: "Meine Intuition stärken und spirituell wachsen", steine: ["mondstein", "labradorit", "amethyst"] },
    ],
  },
  {
    id: 6,
    frage: "Welche Farbe zieht dich gerade magisch an?",
    emoji: "🎨",
    antworten: [
      { text: "Rosa oder Weiß – sanft und liebevoll", steine: ["rosenquarz", "mondstein"] },
      { text: "Violett oder Blau – mystisch und tief", steine: ["amethyst", "labradorit"] },
      { text: "Orange oder Gold – warm und kraftvoll", steine: ["carneol", "sunstone", "citrin"] },
      { text: "Schwarz oder Dunkelgrün – schützend und erdend", steine: ["schwarzer-turmalin"] },
    ],
  },
  {
    id: 7,
    frage: "Wie möchtest du deine Kerze am liebsten nutzen?",
    emoji: "🕯️",
    antworten: [
      { text: "Bei Meditation und spiritueller Praxis", steine: ["amethyst", "mondstein", "labradorit"] },
      { text: "Für Schutz und Reinigung meines Raumes", steine: ["schwarzer-turmalin", "amethyst"] },
      { text: "Als Begleiter für Manifestation und Ziele", steine: ["citrin", "sunstone", "carneol"] },
      { text: "Für Selbstliebe-Rituale und Herzöffnung", steine: ["rosenquarz", "mondstein"] },
    ],
  },
];

// ============================================================
// QUIZ COMPONENT
// ============================================================
export default function KerzenQuizScreen() {
  const [schritt, setSchritt] = useState<"intro" | "quiz" | "ergebnis">("intro");
  const [aktFrage, setAktFrage] = useState(0);
  const [punkte, setPunkte] = useState<Record<string, number>>({});

  const handleAntwort = (steine: string[]) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const neuePunkte = { ...punkte };
    steine.forEach(s => { neuePunkte[s] = (neuePunkte[s] || 0) + 1; });
    setPunkte(neuePunkte);

    if (aktFrage < QUIZ_FRAGEN.length - 1) {
      setAktFrage(aktFrage + 1);
    } else {
      setSchritt("ergebnis");
    }
  };

  const getErgebnis = (): Heilstein => {
    const sorted = Object.entries(punkte).sort((a, b) => b[1] - a[1]);
    const topId = sorted[0]?.[0] || "rosenquarz";
    return HEILSTEINE.find(h => h.id === topId) || HEILSTEINE[1];
  };

  const neuStarten = () => {
    setSchritt("intro");
    setAktFrage(0);
    setPunkte({});
  };

  // ---- INTRO ----
  if (schritt === "intro") {
    return (
      <ScreenContainer containerClassName="bg-background">
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
          <View style={st.header}>
            <TouchableOpacity onPress={() => router.back()} style={st.backBtn} activeOpacity={0.7}>
              <Text style={st.backText}>←</Text>
            </TouchableOpacity>
          </View>

          <View style={st.introContainer}>
            <Image
              source={require("@/assets/images/kerze-1.jpg")}
              style={st.introImage}
              resizeMode="cover"
            />
            <Text style={st.introTitle}>Welche Meditationskerze{"\n"}passt zu dir? 🕯️</Text>
            <Text style={st.introSub}>
              Jede meiner Meditationskerzen ist ein Unikat – handgefertigt mit einem echten Heilstein, 
              der genau zu deiner aktuellen Lebensphase passt. Beantworte 7 Fragen und finde heraus, 
              welcher Heilstein deine Kerze krönen soll.
            </Text>

            <View style={st.steinGrid}>
              {HEILSTEINE.map(h => (
                <View key={h.id} style={[st.steinChip, { backgroundColor: h.farbCode + "30" }]}>
                  <Text style={{ fontSize: 16 }}>{h.emoji}</Text>
                  <Text style={st.steinChipText}>{h.name}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={st.startBtn}
              onPress={() => { setSchritt("quiz"); if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
              activeOpacity={0.85}
            >
              <Text style={st.startBtnText}>Quiz starten →</Text>
            </TouchableOpacity>

            <Text style={st.hinweis}>🕯️ 7 Fragen · ca. 2 Minuten</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ---- QUIZ ----
  if (schritt === "quiz") {
    const frage = QUIZ_FRAGEN[aktFrage];
    const fortschritt = ((aktFrage + 1) / QUIZ_FRAGEN.length) * 100;

    return (
      <ScreenContainer containerClassName="bg-background">
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
          <View style={st.header}>
            <TouchableOpacity onPress={() => router.back()} style={st.backBtn} activeOpacity={0.7}>
              <Text style={st.backText}>←</Text>
            </TouchableOpacity>
            <Text style={st.frageNr}>Frage {aktFrage + 1} von {QUIZ_FRAGEN.length}</Text>
          </View>

          {/* Fortschrittsbalken */}
          <View style={st.progressBar}>
            <View style={[st.progressFill, { width: `${fortschritt}%` }]} />
          </View>

          <View style={st.quizContainer}>
            <Text style={{ fontSize: 48, textAlign: "center", marginBottom: 16 }}>{frage.emoji}</Text>
            <Text style={st.frageTitel}>{frage.frage}</Text>

            {frage.antworten.map((antwort, i) => (
              <TouchableOpacity
                key={i}
                style={st.antwortBtn}
                onPress={() => handleAntwort(antwort.steine)}
                activeOpacity={0.8}
              >
                <Text style={st.antwortText}>{antwort.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ---- ERGEBNIS ----
  const ergebnis = getErgebnis();
  const alleSorted = Object.entries(punkte)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => HEILSTEINE.find(h => h.id === id))
    .filter(Boolean) as Heilstein[];

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        <View style={st.header}>
          <TouchableOpacity onPress={() => router.back()} style={st.backBtn} activeOpacity={0.7}>
            <Text style={st.backText}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={st.ergebnisContainer}>
          <Text style={{ fontSize: 60, textAlign: "center", marginBottom: 12 }}>{ergebnis.emoji}</Text>
          <Text style={st.ergebnisTitel}>Dein Heilstein:</Text>
          <Text style={st.ergebnisName}>{ergebnis.name}</Text>
          <Text style={st.ergebnisSub}>{ergebnis.kurzBeschreibung}</Text>

          {/* Kerzen-Bild */}
          <Image
            source={require("@/assets/images/kerze-3.jpg")}
            style={st.ergebnisBild}
            resizeMode="cover"
          />

          {/* Beschreibung */}
          <View style={st.ergebnisCard}>
            <Text style={st.ergebnisCardTitel}>Über deinen Heilstein</Text>
            <Text style={st.ergebnisCardText}>{ergebnis.langBeschreibung}</Text>
          </View>

          {/* Wirkung */}
          <View style={st.ergebnisCard}>
            <Text style={st.ergebnisCardTitel}>Wirkung von {ergebnis.name}</Text>
            {ergebnis.wirkung.map((w, i) => (
              <View key={i} style={st.wirkungRow}>
                <Text style={st.wirkungDot}>✦</Text>
                <Text style={st.wirkungText}>{w}</Text>
              </View>
            ))}
          </View>

          {/* Details */}
          <View style={st.detailRow}>
            <View style={st.detailItem}>
              <Text style={st.detailLabel}>Chakra</Text>
              <Text style={st.detailValue}>{ergebnis.chakra}</Text>
            </View>
            <View style={st.detailItem}>
              <Text style={st.detailLabel}>Element</Text>
              <Text style={st.detailValue}>{ergebnis.element}</Text>
            </View>
          </View>

          {/* Affirmation */}
          <View style={[st.ergebnisCard, { backgroundColor: C.goldLight, borderColor: "#E8D5B0" }]}>
            <Text style={st.affirmationLabel}>🙏 Deine Affirmation</Text>
            <Text style={st.affirmationText}>"{ergebnis.affirmation}"</Text>
          </View>

          {/* Weitere Empfehlungen */}
          {alleSorted.length > 1 && (
            <View style={st.ergebnisCard}>
              <Text style={st.ergebnisCardTitel}>Auch passend für dich</Text>
              {alleSorted.slice(1, 3).map(stein => (
                <View key={stein.id} style={st.weitererStein}>
                  <Text style={{ fontSize: 24 }}>{stein.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={st.weitererSteinName}>{stein.name}</Text>
                    <Text style={st.weitererSteinBeschreibung}>{stein.kurzBeschreibung}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Passende Armbänder */}
          {ARMBAND_MAP[ergebnis.id] && (
            <View style={st.ergebnisCard}>
              <Text style={st.ergebnisCardTitel}>💎 Passende Armbänder mit {ergebnis.name}</Text>
              <View style={st.armbandList}>
                {ARMBAND_MAP[ergebnis.id].map((ab, i) => (
                  <TouchableOpacity
                    key={i}
                    style={st.armbandItem}
                    onPress={() => openProduct(ab.url)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: ab.image }} style={st.armbandImage} resizeMode="cover" />
                    <View style={st.armbandInfo}>
                      <Text style={st.armbandName}>{ab.name}</Text>
                      <Text style={st.armbandSteine}>{ab.steine}</Text>
                      <Text style={st.armbandPreis}>33,00 €</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* CTA – Kerze bestellen */}
          <View style={st.ctaCard}>
            <Image
              source={require("@/assets/images/kerze-2.jpg")}
              style={st.ctaBild}
              resizeMode="cover"
            />
            <Text style={st.ctaTitel}>Deine individuelle Meditationskerze 🕯️</Text>
            <Text style={st.ctaText}>
              Jede Kerze wird von der Seelenplanerin handgefertigt – mit deinem persönlichen Heilstein {ergebnis.name}. 
              Ein Unikat, nur für dich und deine spirituelle Praxis.
            </Text>
            <TouchableOpacity
              style={st.ctaBtn}
              onPress={() => {
                if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Linking.openURL("https://dieseelenplanerin.de/kategorie/meditationskerzen");
              }}
              activeOpacity={0.85}
            >
              <Text style={st.ctaBtnText}>🕯️ Kerze bestellen →</Text>
            </TouchableOpacity>
          </View>

          {/* Nochmal spielen */}
          <TouchableOpacity style={st.neuBtn} onPress={neuStarten} activeOpacity={0.8}>
            <Text style={st.neuBtnText}>Quiz nochmal machen</Text>
          </TouchableOpacity>
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
  introImage: { width: width - 40, height: 220, borderRadius: 24, marginBottom: 20 },
  introTitle: { fontSize: 26, fontWeight: "700", color: C.brown, textAlign: "center", lineHeight: 34, marginBottom: 12 },
  introSub: { fontSize: 14, color: C.brownMid, textAlign: "center", lineHeight: 22, marginBottom: 20, paddingHorizontal: 10 },
  steinGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 24 },
  steinChip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4 },
  steinChipText: { fontSize: 12, color: C.brown, fontWeight: "600" },
  startBtn: { backgroundColor: C.rose, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40, marginBottom: 12 },
  startBtnText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
  hinweis: { fontSize: 13, color: C.muted },

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
  ergebnisBild: { width: "100%", height: 200, borderRadius: 20, marginBottom: 20 },
  ergebnisCard: { backgroundColor: C.card, borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: C.border },
  ergebnisCardTitel: { fontSize: 17, fontWeight: "700", color: C.brown, marginBottom: 10 },
  ergebnisCardText: { fontSize: 14, color: C.brownMid, lineHeight: 22 },
  wirkungRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  wirkungDot: { fontSize: 14, color: C.rose, marginTop: 2 },
  wirkungText: { fontSize: 14, color: C.brownMid, flex: 1, lineHeight: 20 },
  detailRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  detailItem: { flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  detailLabel: { fontSize: 12, color: C.muted, marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: "700", color: C.brown },
  affirmationLabel: { fontSize: 14, color: C.gold, fontWeight: "700", marginBottom: 8 },
  affirmationText: { fontSize: 16, color: C.brown, fontStyle: "italic", lineHeight: 24 },
  weitererStein: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  weitererSteinName: { fontSize: 15, fontWeight: "700", color: C.brown },
  weitererSteinBeschreibung: { fontSize: 12, color: C.muted },

  // CTA
  ctaCard: { backgroundColor: C.roseLight, borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: C.rose + "40", alignItems: "center" },
  ctaBild: { width: "100%", height: 160, borderRadius: 16, marginBottom: 16 },
  ctaTitel: { fontSize: 18, fontWeight: "700", color: C.brown, textAlign: "center", marginBottom: 8 },
  ctaText: { fontSize: 14, color: C.brownMid, textAlign: "center", lineHeight: 21, marginBottom: 16 },
  ctaBtn: { backgroundColor: C.rose, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28 },
  ctaBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  // Armbänder
  armbandList: { marginTop: 12, gap: 12 },
  armbandItem: {
    flexDirection: "row", backgroundColor: "#FFF8F5", borderRadius: 16,
    overflow: "hidden", borderWidth: 1, borderColor: C.border,
  },
  armbandImage: { width: 90, height: 90 },
  armbandInfo: { flex: 1, padding: 12, justifyContent: "center" },
  armbandName: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 3 },
  armbandSteine: { fontSize: 12, color: C.muted, marginBottom: 4, lineHeight: 16 },
  armbandPreis: { fontSize: 14, fontWeight: "700", color: C.rose },

  neuBtn: { backgroundColor: C.surface, borderRadius: 14, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: C.border },
  neuBtnText: { fontSize: 15, color: C.brownMid, fontWeight: "600" },
});
