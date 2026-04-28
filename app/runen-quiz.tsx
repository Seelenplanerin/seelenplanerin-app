import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Image, Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import { RUNEN_QUESTIONS, type RunenCategory } from "@/lib/quiz-data";
import { RUNEN_SETS, getSetsByKategorie } from "@/lib/runen-sets";
const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
};

// Kategorie-Infos für die Ergebnis-Anzeige
// Echte Armbänder von dieseelenplanerin.de, nach Kategorie zugeordnet
const KATEGORIE_ARMBAENDER: Record<string, { name: string; steine: string; image: string; url: string }[]> = {
  liebe: [
    { name: "Happy Soul", steine: "Rosenquarz + Rhodonit", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Happysoul_e2fbf042.jpg", url: "https://dieseelenplanerin.de/produkt/happy-soul" },
    { name: "Pure Love", steine: "Rosenquarz", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/purelove2_604f308d.jpg", url: "https://dieseelenplanerin.de/produkt/pure-love" },
    { name: "True Love", steine: "Pinker Achat + Schwarzer Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/truelove_fe6ec462.jpg", url: "https://dieseelenplanerin.de/produkt/true-love" },
  ],
  fuelle: [
    { name: "Positive Mind", steine: "Citrin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/positivemnd,_001160a8.jpg", url: "https://dieseelenplanerin.de/produkt/positive-mind" },
    { name: "Golden Power", steine: "Citrin + Schwarzer Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Potitivemind_41a4770e.jpg", url: "https://dieseelenplanerin.de/produkt/golden-power" },
    { name: "Soul Letters \u2013 Citrin", steine: "Wei\u00dfe Perlen + Citrin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/SoulLetterCitrin_37a595b5.jpg", url: "https://dieseelenplanerin.de/produkt/soul-letters-citrin" },
  ],
  gesundheit: [
    { name: "Clear Mind", steine: "Bergkristall + Lapislazuli + Amethyst", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Clearmind_c5930d21.jpg", url: "https://dieseelenplanerin.de/produkt/clear-mind" },
    { name: "Pure Spirit", steine: "Mondstein + Amethyst", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/purespirit_9f2b6a28.jpg", url: "https://dieseelenplanerin.de/produkt/pure-spirit" },
    { name: "Calm Spirit", steine: "Blauer Apatit + Lapislazuli + Bergkristall", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/CalmSpirit_b7d87f56.jpg", url: "https://dieseelenplanerin.de/produkt/calm-spirit" },
  ],
  transformation: [
    { name: "Inner Power", steine: "Malachit + Pinker Achat", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/InnerPower_2c1f936d.jpg", url: "https://dieseelenplanerin.de/produkt/inner-power" },
    { name: "Divine Circle", steine: "Mondstein", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/DivineCircle_b6030451.jpg", url: "https://dieseelenplanerin.de/produkt/divine-circle" },
    { name: "Spirit Glow", steine: "Peridot + Citrin + Rosenquarz", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/SpiritGlow_578dbe79.PNG", url: "https://dieseelenplanerin.de/produkt/spirit-glow" },
  ],
  selbstvertrauen: [
    { name: "Bodyguard", steine: "Schwarzer Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/bodyguard_c0a58b10.jpg", url: "https://dieseelenplanerin.de/produkt/bodyguard-armband" },
    { name: "Power Shield", steine: "Tigerauge + Schwarzer Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Powershield_bbdefa32.jpg", url: "https://dieseelenplanerin.de/produkt/power-shield" },
    { name: "Safe Light", steine: "Schwarzer Turmalin + Dalmatiner Jaspis", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/SafeLight_f4ea2538.jpg", url: "https://dieseelenplanerin.de/produkt/safe-light" },
  ],
  spirituell: [
    { name: "Pure Spirit", steine: "Mondstein + Amethyst", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/purespirit_9f2b6a28.jpg", url: "https://dieseelenplanerin.de/produkt/pure-spirit" },
    { name: "Clear Mind", steine: "Bergkristall + Lapislazuli + Amethyst", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Clearmind_c5930d21.jpg", url: "https://dieseelenplanerin.de/produkt/clear-mind" },
    { name: "Divine Circle", steine: "Mondstein", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/DivineCircle_b6030451.jpg", url: "https://dieseelenplanerin.de/produkt/divine-circle" },
  ],
  familie: [
    { name: "Happy Soul", steine: "Rosenquarz + Rhodonit", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Happysoul_e2fbf042.jpg", url: "https://dieseelenplanerin.de/produkt/happy-soul" },
    { name: "Pure Grace", steine: "Opal + Bergkristall + Rosenquarz + Mondstein", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/PureGrace_44f99243.jpg", url: "https://dieseelenplanerin.de/produkt/pure-grace" },
    { name: "Positive Vibes", steine: "Wassermelonen-Turmalin", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/PositiveVibe_9a8e6407.PNG", url: "https://dieseelenplanerin.de/produkt/positive-vibes" },
  ],
  kommunikation: [
    { name: "True Voice", steine: "Blauer Apatit + T\u00fcrkis", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/truevoice_c4b1c1dd.jpg", url: "https://dieseelenplanerin.de/produkt/true-voice" },
    { name: "Calm Spirit", steine: "Blauer Apatit + Lapislazuli + Bergkristall", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/CalmSpirit_b7d87f56.jpg", url: "https://dieseelenplanerin.de/produkt/calm-spirit" },
    { name: "Clear Mind", steine: "Bergkristall + Lapislazuli + Amethyst", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6xNnCqiUctcuk4Htpiw8hj/Clearmind_c5930d21.jpg", url: "https://dieseelenplanerin.de/produkt/clear-mind" },
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

const KATEGORIE_INFO: Record<RunenCategory, {
  titel: string; emoji: string; beschreibung: string; farbe: string; farbHell: string;
  heilstein: string; heilsteinBeschreibung: string;
}> = {
  liebe: {
    titel: "Liebe & Beziehungen", emoji: "💗",
    beschreibung: "Deine Seele sehnt sich nach tiefer Verbindung, Herzensöffnung und liebevollen Beziehungen. Die Runen zeigen dir den Weg zu mehr Liebe – in dir und um dich herum.",
    farbe: "#C4826A", farbHell: "#F9EDE8",
    heilstein: "Rosenquarz",
    heilsteinBeschreibung: "Der Stein der bedingungslosen Liebe. Er öffnet dein Herz und stärkt Selbstliebe und Mitgefühl.",
  },
  fuelle: {
    titel: "Fülle & Finanzen", emoji: "✨",
    beschreibung: "Du bist bereit, Fülle auf allen Ebenen zu empfangen. Die Runen helfen dir, Blockaden zu lösen und den Fluss des Wohlstands zu aktivieren.",
    farbe: "#C9A96E", farbHell: "#FAF3E7",
    heilstein: "Bergkristall",
    heilsteinBeschreibung: "Der Meisterheiler. Er verstärkt die Energie aller anderen Steine und bringt Klarheit in deine Fülle-Intention.",
  },
  gesundheit: {
    titel: "Gesundheit & Vitalität", emoji: "🌿",
    beschreibung: "Dein Körper und deine Seele brauchen jetzt Heilung und neue Kraft. Die Runen unterstützen dich bei Regeneration und ganzheitlichem Wohlbefinden.",
    farbe: "#4A7C4A", farbHell: "#E8F0E8",
    heilstein: "Amethyst",
    heilsteinBeschreibung: "Der Stein der Heilung und inneren Ruhe. Er fördert Regeneration und schützt vor negativen Energien.",
  },
  transformation: {
    titel: "Transformation & Neuanfang", emoji: "🦋",
    beschreibung: "Du stehst an einem Wendepunkt. Die Runen begleiten dich durch den Wandel und zeigen dir das Licht am Ende des Tunnels.",
    farbe: "#6B4A8A", farbHell: "#F0E8F5",
    heilstein: "Mondstein",
    heilsteinBeschreibung: "Der Stein des Neuanfangs. Er unterstützt dich bei Veränderungen und stärkt deine Intuition in Umbruchphasen.",
  },
  selbstvertrauen: {
    titel: "Selbstvertrauen & Innere Stärke", emoji: "🔥",
    beschreibung: "Es ist Zeit, deine innere Kriegerin zu wecken. Die Runen stärken deinen Mut, dein Selbstvertrauen und deine Durchsetzungskraft.",
    farbe: "#8B4513", farbHell: "#F5EAE0",
    heilstein: "Schwarzer Turmalin",
    heilsteinBeschreibung: "Der mächtigste Schutzstein. Er gibt dir Kraft, Grenzen zu setzen und stärkt dein Selbstvertrauen.",
  },
  spirituell: {
    titel: "Spirituelle Entwicklung", emoji: "🔮",
    beschreibung: "Deine Seele ruft nach tieferer Verbindung zum Göttlichen. Die Runen öffnen den Kanal zu deiner Intuition und spirituellen Kraft.",
    farbe: "#1A4A5C", farbHell: "#E0F0F5",
    heilstein: "Amethyst",
    heilsteinBeschreibung: "Der Stein der Spiritualität. Er öffnet das dritte Auge und vertieft deine Meditation und Intuition.",
  },
  familie: {
    titel: "Familie & Zuhause", emoji: "🏡",
    beschreibung: "Familiäre Themen stehen im Mittelpunkt. Die Runen unterstützen dich bei Zusammenhalt, Heilung und Harmonie in deinem Zuhause.",
    farbe: "#5C3317", farbHell: "#F5EDE8",
    heilstein: "Rosenquarz",
    heilsteinBeschreibung: "Der Stein der Fürsorge und Geborgenheit. Er harmonisiert Familienbeziehungen und bringt Frieden ins Heim.",
  },
  kommunikation: {
    titel: "Kommunikation & Klarheit", emoji: "🗝️",
    beschreibung: "Du brauchst Klarheit und die Kraft, deine Wahrheit auszusprechen. Die Runen stärken deine Kommunikation und Entscheidungsfähigkeit.",
    farbe: "#2C4A6E", farbHell: "#E0E8F5",
    heilstein: "Bergkristall",
    heilsteinBeschreibung: "Der Stein der Klarheit. Er schärft deinen Geist und hilft dir, klare Entscheidungen zu treffen.",
  },
};

export default function RunenQuizScreen() {
  const [aktFrage, setAktFrage] = useState(0);
  const [antworten, setAntworten] = useState<RunenCategory[]>([]);
  const [ergebnis, setErgebnis] = useState<RunenCategory | null>(null);
  const [gewaehlt, setGewaehlt] = useState<string | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);

  function antwortWaehlen(category: RunenCategory, optionId: string) {
    setGewaehlt(optionId);
    setTimeout(() => {
      const neueAntworten = [...antworten, category];
      setAntworten(neueAntworten);
      if (aktFrage < RUNEN_QUESTIONS.length - 1) {
        setAktFrage(aktFrage + 1);
        setGewaehlt(null);
      } else {
        // Meistgewählte Kategorie ermitteln
        const counts: Record<string, number> = {};
        neueAntworten.forEach(c => { counts[c] = (counts[c] || 0) + 1; });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const topKategorie = sorted[0][0] as RunenCategory;
        setErgebnis(topKategorie);
        // Erstes Set der Kategorie vorauswählen
        const sets = getSetsByKategorie(topKategorie);
        if (sets.length > 0) setSelectedSetId(sets[0].id);
      }
    }, 300);
  }

  function neuStarten() {
    setAktFrage(0);
    setAntworten([]);
    setErgebnis(null);
    setGewaehlt(null);
    setSelectedSetId(null);
  }

  // ── ERGEBNIS-SCREEN ──
  if (ergebnis) {
    const info = KATEGORIE_INFO[ergebnis];
    const sets = getSetsByKategorie(ergebnis);
    const selectedSet = sets.find(s => s.id === selectedSetId) || sets[0];

    return (
      <ScreenContainer containerClassName="bg-background">
        <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={[s.ergebnisHeader, { backgroundColor: info.farbe }]}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <Text style={s.backBtnText}>← Zurück</Text>
            </TouchableOpacity>
            <Text style={s.ergebnisEmoji}>{info.emoji}</Text>
            <Text style={s.ergebnisLabel}>Dein Seelenthema</Text>
            <Text style={s.ergebnisName}>{info.titel}</Text>
          </View>

          {/* Beschreibung */}
          <View style={[s.card, { backgroundColor: info.farbHell, borderColor: info.farbe + "40" }]}>
            <Text style={[s.cardText, { color: C.brown }]}>{info.beschreibung}</Text>
          </View>

          {/* Dein Runen-Set */}
          <View style={s.card}>
            <Text style={s.cardTitel}>✨ Dein persönliches Runen-Armband</Text>
            <Text style={[s.cardText, { marginBottom: 12 }]}>
              Dein Armband besteht aus 3 Runen-Charms: Deine persönliche Schutzrune (nach Geburtsdatum) + 2 Themenrunen für dein aktuelles Seelenthema.
            </Text>

            {/* Set-Auswahl */}
            <Text style={[s.cardTitel, { fontSize: 14, marginBottom: 8 }]}>
              Wähle dein {info.titel}-Set:
            </Text>
            {sets.map(set => (
              <TouchableOpacity
                key={set.id}
                style={[
                  s.setOption,
                  selectedSetId === set.id && { borderColor: info.farbe, backgroundColor: info.farbHell },
                ]}
                onPress={() => setSelectedSetId(set.id)}
                activeOpacity={0.8}
              >
                <View style={s.setOptionHeader}>
                  <View style={s.setRunenRow}>
                    <Text style={s.setRuneSymbol}>{set.runenSymbole[0]}</Text>
                    <Text style={[s.setRuneSymbol, { color: info.farbe }]}>{set.runenSymbole[1]}</Text>
                    <Text style={[s.setRuneSymbol, { color: info.farbe }]}>{set.runenSymbole[2]}</Text>
                  </View>
                  {selectedSetId === set.id && (
                    <Text style={[s.setCheck, { color: info.farbe }]}>✓</Text>
                  )}
                </View>
                <Text style={s.setName}>{set.name}</Text>
                <Text style={s.setWirkung}>{set.wirkung}</Text>
                <Text style={s.setRunenNames}>
                  Schutzrune + {set.runen[1]} + {set.runen[2]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Gewähltes Set Detail */}
          {selectedSet && (
            <View style={[s.card, { backgroundColor: info.farbHell }]}>
              <Text style={[s.cardTitel, { color: info.farbe }]}>
                {selectedSet.runenSymbole[1]} {selectedSet.runenSymbole[2]} {selectedSet.name}
              </Text>
              <Text style={s.cardText}>{selectedSet.beschreibung}</Text>
              <View style={s.runenDetail}>
                <View style={s.runeDetailItem}>
                  <Text style={s.runeDetailSymbol}>✦</Text>
                  <Text style={s.runeDetailName}>Deine Schutzrune</Text>
                  <Text style={s.runeDetailDesc}>Persönlicher Anker nach Geburtsdatum</Text>
                </View>
                <View style={s.runeDetailItem}>
                  <Text style={[s.runeDetailSymbol, { color: info.farbe }]}>{selectedSet.runenSymbole[1]}</Text>
                  <Text style={s.runeDetailName}>{selectedSet.runen[1]}</Text>
                  <Text style={s.runeDetailDesc}>Themenrune 1</Text>
                </View>
                <View style={s.runeDetailItem}>
                  <Text style={[s.runeDetailSymbol, { color: info.farbe }]}>{selectedSet.runenSymbole[2]}</Text>
                  <Text style={s.runeDetailName}>{selectedSet.runen[2]}</Text>
                  <Text style={s.runeDetailDesc}>Themenrune 2</Text>
                </View>
              </View>
            </View>
          )}

          {/* Heilstein */}
          <View style={s.card}>
            <Text style={s.cardTitel}>💎 Dein Heilstein: {info.heilstein}</Text>
            <Text style={s.cardText}>{info.heilsteinBeschreibung}</Text>
            <Text style={[s.cardText, { marginTop: 8, fontStyle: "italic", fontSize: 13 }]}>
              Dein Runen-Charm wird mit {info.heilstein}-Pulver veredelt – so trägst du die Kraft des Steins direkt bei dir.
            </Text>
          </View>

          {/* Passende Energiearmbänder */}
          {KATEGORIE_ARMBAENDER[ergebnis] && (
            <View style={s.card}>
              <Text style={s.cardTitel}>💎 Passende Energiearmbänder</Text>
              <Text style={[s.cardText, { marginBottom: 12 }]}>
                Ergänze dein Runen-Armband mit einem passenden Energiearmband von der Seelenplanerin.
              </Text>
              <View style={{ gap: 12 }}>
                {KATEGORIE_ARMBAENDER[ergebnis].map((ab, i) => (
                  <TouchableOpacity
                    key={i}
                    style={s.armbandItem}
                    onPress={() => openProduct(ab.url)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: ab.image }} style={s.armbandImage} resizeMode="cover" />
                    <View style={s.armbandInfo}>
                      <Text style={s.armbandName}>{ab.name}</Text>
                      <Text style={s.armbandSteine}>{ab.steine}</Text>
                      <Text style={s.armbandPreis}>33,00 €</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Armband bestellen CTA */}
          <View style={s.ctaCard}>
            <Text style={s.ctaTitel}>Dein Runen-Armband bestellen</Text>
            <Text style={s.ctaText}>
              3 handgravierte Runen-Charms auf {info.heilstein}-Plättchen, befüllt mit Heilstein-Pulver. Ein Unikat – nur für dich.
            </Text>
            <Text style={s.ctaPreis}>57,00 € zzgl. 4,90 € Versand</Text>
            <TouchableOpacity
              style={[s.ctaBtn, { backgroundColor: info.farbe }]}
              onPress={() => Linking.openURL("https://dieseelenplanerin.de/runenarmbander")}
              activeOpacity={0.85}
            >
              <Text style={s.ctaBtnText}>Jetzt bestellen →</Text>
            </TouchableOpacity>
          </View>

          {/* Seelenimpuls CTA */}
          <View style={[s.ctaCard, { backgroundColor: C.goldLight }]}>
            <Text style={s.ctaTitel}>Tiefer in die Runen eintauchen?</Text>
            <Text style={s.ctaText}>Im Seelenimpuls bekommst du monatlich tiefe Runen-Readings, persönliche Deutungen und die Begleitung der Seelenplanerin.</Text>
            <TouchableOpacity
              style={[s.ctaBtn, { backgroundColor: C.gold }]}
              onPress={() => router.push("/seelenimpuls")}
              activeOpacity={0.85}
            >
              <Text style={s.ctaBtnText}>Zum Seelenimpuls →</Text>
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

  // ── FRAGEN-SCREEN ──
  const frage = RUNEN_QUESTIONS[aktFrage];
  const fortschritt = ((aktFrage + 1) / RUNEN_QUESTIONS.length) * 100;

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backBtnText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerSymbol}>ᚱ</Text>
          <Text style={s.headerTitel}>Runen Quiz</Text>
          <Text style={s.headerSub}>9 Fragen · Entdecke dein Seelenthema & deine Runen</Text>
        </View>

        {/* Fortschritt */}
        <View style={s.progressContainer}>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${fortschritt}%` }]} />
          </View>
          <Text style={s.progressText}>Frage {aktFrage + 1} von {RUNEN_QUESTIONS.length}</Text>
        </View>

        {/* Frage-Titel */}
        <View style={s.frageTitelContainer}>
          <Text style={s.frageTitel}>{frage.title}</Text>
        </View>

        {/* Frage */}
        <View style={s.frageCard}>
          <Text style={s.frageText}>{frage.question}</Text>
        </View>

        {/* Antworten */}
        <View style={s.antwortenContainer}>
          {frage.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                s.antwortBtn,
                gewaehlt === option.id && { backgroundColor: C.goldLight, borderColor: C.gold },
              ]}
              onPress={() => antwortWaehlen(option.category, option.id)}
              activeOpacity={0.8}
            >
              <Text style={s.antwortId}>{option.id}</Text>
              <Text style={s.antwortText}>{option.text}</Text>
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
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", textAlign: "center" },

  progressContainer: { paddingHorizontal: 20, paddingVertical: 16 },
  progressBg: { height: 6, backgroundColor: C.border, borderRadius: 3, overflow: "hidden", marginBottom: 8 },
  progressFill: { height: "100%", backgroundColor: C.gold, borderRadius: 3 },
  progressText: { fontSize: 12, color: C.muted, textAlign: "right" },

  frageTitelContainer: { paddingHorizontal: 20, marginBottom: 4 },
  frageTitel: { fontSize: 13, fontWeight: "700", color: C.gold, textTransform: "uppercase", letterSpacing: 1 },

  frageCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border },
  frageText: { fontSize: 18, fontWeight: "600", color: C.brown, lineHeight: 28, textAlign: "center" },

  antwortenContainer: { paddingHorizontal: 16, gap: 10 },
  antwortBtn: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: C.border, flexDirection: "row", alignItems: "center" },
  antwortId: { fontSize: 14, fontWeight: "700", color: C.gold, marginRight: 12, width: 20 },
  antwortText: { fontSize: 15, color: C.brownMid, lineHeight: 22, flex: 1 },

  ergebnisHeader: { padding: 32, paddingTop: 40, alignItems: "center" },
  ergebnisEmoji: { fontSize: 56, marginBottom: 8 },
  ergebnisLabel: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
  ergebnisName: { fontSize: 24, fontWeight: "700", color: "#FFF", textAlign: "center" },

  card: { marginHorizontal: 16, marginTop: 12, backgroundColor: C.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: C.border },
  cardTitel: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 10 },
  cardText: { fontSize: 15, color: C.brownMid, lineHeight: 24 },

  setOption: { backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: C.border },
  setOptionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  setRunenRow: { flexDirection: "row", gap: 8 },
  setRuneSymbol: { fontSize: 24, color: C.gold },
  setCheck: { fontSize: 20, fontWeight: "700" },
  setName: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 2 },
  setWirkung: { fontSize: 13, color: C.muted, marginBottom: 4 },
  setRunenNames: { fontSize: 12, color: C.gold, fontWeight: "600" },

  runenDetail: { flexDirection: "row", justifyContent: "space-around", marginTop: 16 },
  runeDetailItem: { alignItems: "center", flex: 1 },
  runeDetailSymbol: { fontSize: 32, color: C.gold, marginBottom: 4 },
  runeDetailName: { fontSize: 12, fontWeight: "700", color: C.brown },
  runeDetailDesc: { fontSize: 10, color: C.muted, textAlign: "center" },

  ctaCard: { margin: 16, marginTop: 12, backgroundColor: C.roseLight, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border, alignItems: "center" },
  ctaTitel: { fontSize: 18, fontWeight: "700", color: C.brown, marginBottom: 8, textAlign: "center" },
  ctaText: { fontSize: 14, color: C.brownMid, lineHeight: 22, textAlign: "center", marginBottom: 12 },
  ctaPreis: { fontSize: 20, fontWeight: "700", color: C.rose, marginBottom: 16 },
  ctaBtn: { backgroundColor: C.rose, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24 },
  ctaBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  neuStartenBtn: { marginHorizontal: 16, marginTop: 8, padding: 14, alignItems: "center" },
  neuStartenText: { fontSize: 14, color: C.muted, textDecorationLine: "underline" },

  // Armbänder
  armbandItem: {
    flexDirection: "row" as const, backgroundColor: "#FFF8F5", borderRadius: 16,
    overflow: "hidden" as const, borderWidth: 1, borderColor: C.border,
  },
  armbandImage: { width: 90, height: 90 },
  armbandInfo: { flex: 1, padding: 12, justifyContent: "center" as const },
  armbandName: { fontSize: 15, fontWeight: "700" as const, color: C.brown, marginBottom: 3 },
  armbandSteine: { fontSize: 12, color: C.muted, marginBottom: 4, lineHeight: 16 },
  armbandPreis: { fontSize: 14, fontWeight: "700" as const, color: C.rose },
});
