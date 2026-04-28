import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import { RUNEN_SETS, getSetsByKategorie, type RunenSet } from "@/lib/runen-sets";
import { type RunenCategory } from "@/lib/quiz-data";

// ─── Farben ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#FDF8F4",
  card: "#FFFFFF",
  rose: "#C4826A",
  roseLight: "#F5E6E0",
  gold: "#C9A96E",
  goldLight: "#FAF3E7",
  brown: "#6B4226",
  muted: "#A08070",
  border: "#EDD9D0",
  text: "#3D2314",
};

// ─── Runen-Daten (24 Elder Futhark) ──────────────────────────────────────────
const RUNEN = [
  { name: "Fehu", symbol: "ᚠ", thema: "Wohlstand & Fülle", energie: "Überfluss, Erfolg, materielle Sicherheit", affirmation: "Ich bin offen für Fülle in allen Formen." },
  { name: "Uruz", symbol: "ᚢ", thema: "Kraft & Gesundheit", energie: "Urkraft, Vitalität, körperliche Stärke", affirmation: "Meine Lebenskraft ist unerschöpflich." },
  { name: "Thurisaz", symbol: "ᚦ", thema: "Schutz & Abwehr", energie: "Schutz, Grenzen setzen, Transformation", affirmation: "Ich bin geschützt und sicher." },
  { name: "Ansuz", symbol: "ᚨ", thema: "Kommunikation & Weisheit", energie: "Göttliche Botschaft, Intuition, Sprache", affirmation: "Ich empfange göttliche Führung." },
  { name: "Raidho", symbol: "ᚱ", thema: "Reise & Wandel", energie: "Bewegung, Fortschritt, Lebensreise", affirmation: "Mein Weg entfaltet sich perfekt." },
  { name: "Kenaz", symbol: "ᚲ", thema: "Kreativität & Erleuchtung", energie: "Feuer, Inspiration, Klarheit", affirmation: "Meine Kreativität leuchtet hell." },
  { name: "Gebo", symbol: "ᚷ", thema: "Liebe & Partnerschaft", energie: "Geschenk, Verbindung, Balance", affirmation: "Ich gebe und empfange Liebe frei." },
  { name: "Wunjo", symbol: "ᚹ", thema: "Freude & Harmonie", energie: "Glück, Erfüllung, Gemeinschaft", affirmation: "Freude ist mein natürlicher Zustand." },
  { name: "Hagalaz", symbol: "ᚺ", thema: "Transformation & Wandel", energie: "Disruption, Reinigung, Neuanfang", affirmation: "Ich begrüße Veränderung als Wachstum." },
  { name: "Nauthiz", symbol: "ᚾ", thema: "Geduld & Ausdauer", energie: "Not, Widerstand, innere Stärke", affirmation: "Ich habe die Kraft, alles zu überwinden." },
  { name: "Isa", symbol: "ᛁ", thema: "Stille & Innehalten", energie: "Eis, Pause, Selbstreflexion", affirmation: "In der Stille finde ich meine Wahrheit." },
  { name: "Jera", symbol: "ᛃ", thema: "Ernte & Zyklen", energie: "Jahreskreis, Geduld, Belohnung", affirmation: "Ich ernte was ich gesät habe." },
  { name: "Eihwaz", symbol: "ᛇ", thema: "Ausdauer & Schutz", energie: "Lebensbaum, Kontinuität, Stärke", affirmation: "Ich bin verwurzelt und unerschütterlich." },
  { name: "Perthro", symbol: "ᛈ", thema: "Schicksal & Magie", energie: "Mysterium, Schicksal, verborgenes Wissen", affirmation: "Ich vertraue dem Fluss des Lebens." },
  { name: "Algiz", symbol: "ᛉ", thema: "Schutz & Intuition", energie: "Schutzschild, Verbindung zum Göttlichen", affirmation: "Ich bin von göttlichem Licht umgeben." },
  { name: "Sowilo", symbol: "ᛋ", thema: "Erfolg & Sonne", energie: "Siegeskraft, Lebensenergie, Klarheit", affirmation: "Ich strahle Licht und Erfolg aus." },
  { name: "Tiwaz", symbol: "ᛏ", thema: "Gerechtigkeit & Mut", energie: "Kriegsgott, Ehre, Opferbereitschaft", affirmation: "Ich handle mit Integrität und Mut." },
  { name: "Berkana", symbol: "ᛒ", thema: "Geburt & Wachstum", energie: "Birke, Fruchtbarkeit, Fürsorge", affirmation: "Ich pflege mein Wachstum liebevoll." },
  { name: "Ehwaz", symbol: "ᛖ", thema: "Vertrauen & Partnerschaft", energie: "Pferd, Bewegung, Zusammenarbeit", affirmation: "Ich vertraue meinen Beziehungen." },
  { name: "Mannaz", symbol: "ᛗ", thema: "Selbsterkenntnis & Humanität", energie: "Mensch, Gemeinschaft, Selbstbewusstsein", affirmation: "Ich kenne und liebe mich selbst." },
  { name: "Laguz", symbol: "ᛚ", thema: "Intuition & Gefühle", energie: "Wasser, Unterbewusstsein, Fluss", affirmation: "Ich fließe mit dem Strom des Lebens." },
  { name: "Ingwaz", symbol: "ᛜ", thema: "Fruchtbarkeit & Potenzial", energie: "Innere Kraft, Potenzial, Vollendung", affirmation: "Mein inneres Potenzial entfaltet sich." },
  { name: "Dagaz", symbol: "ᛞ", thema: "Durchbruch & Erleuchtung", energie: "Tagesanbruch, Transformation, Klarheit", affirmation: "Ein neuer Tag bringt neue Möglichkeiten." },
  { name: "Othala", symbol: "ᛟ", thema: "Heimat & Erbe", energie: "Ahnen, Heimat, Geborgenheit", affirmation: "Ich bin verwurzelt in meinem Erbe." },
];

// ─── 8 Themen-Kategorien (aus dem PDF) ───────────────────────────────────────
const THEMEN: { id: RunenCategory; label: string; emoji: string; heilstein: string }[] = [
  { id: "liebe", label: "Liebe & Beziehungen", emoji: "💗", heilstein: "Rosenquarz" },
  { id: "fuelle", label: "Fülle & Finanzen", emoji: "✨", heilstein: "Bergkristall" },
  { id: "gesundheit", label: "Gesundheit & Vitalität", emoji: "🌿", heilstein: "Amethyst" },
  { id: "transformation", label: "Transformation & Neuanfang", emoji: "🦋", heilstein: "Mondstein" },
  { id: "selbstvertrauen", label: "Selbstvertrauen & Stärke", emoji: "🔥", heilstein: "Schwarzer Turmalin" },
  { id: "spirituell", label: "Spirituelle Entwicklung", emoji: "🔮", heilstein: "Amethyst" },
  { id: "familie", label: "Familie & Zuhause", emoji: "🏡", heilstein: "Rosenquarz" },
  { id: "kommunikation", label: "Kommunikation & Klarheit", emoji: "🗝️", heilstein: "Bergkristall" },
];

// Klassische Lebensweg-Numerologie: alle Ziffern addieren bis 1-9
const LEBENSWEG_RUNEN = [
  { lebensweg: 1, name: "Fehu", symbol: "ᚠ", thema: "Fülle & Wohlstand", energie: "Überfluss, Erfolg, materielle Sicherheit, neue Anfänge", affirmation: "Ich bin offen für Fülle in allen Formen des Lebens." },
  { lebensweg: 2, name: "Uruz", symbol: "ᚢ", thema: "Kraft & Vitalität", energie: "Urkraft, Gesundheit, Ausdauer, wilde Stärke", affirmation: "Meine Lebenskraft ist unerschöpflich und stark." },
  { lebensweg: 3, name: "Thurisaz", symbol: "ᚦ", thema: "Schutz & Transformation", energie: "Schutz, Grenzen setzen, Wandel, Durchbruch", affirmation: "Ich bin geschützt und wandle mich mit Kraft." },
  { lebensweg: 4, name: "Ansuz", symbol: "ᚨ", thema: "Weisheit & Kommunikation", energie: "Göttliche Botschaft, Intuition, Sprache, Inspiration", affirmation: "Ich empfange göttliche Führung und spreche meine Wahrheit." },
  { lebensweg: 5, name: "Raidho", symbol: "ᚱ", thema: "Reise & Bewegung", energie: "Lebensreise, Fortschritt, Rhythmus, Abenteuer", affirmation: "Mein Weg entfaltet sich perfekt in seinem eigenen Rhythmus." },
  { lebensweg: 6, name: "Kenaz", symbol: "ᚲ", thema: "Kreativität & Feuer", energie: "Inspiration, Leidenschaft, Erleuchtung, Handwerk", affirmation: "Meine Kreativität leuchtet hell und erhellt meinen Weg." },
  { lebensweg: 7, name: "Gebo", symbol: "ᚷ", thema: "Liebe & Verbindung", energie: "Geschenk, Partnerschaft, Balance, Austausch", affirmation: "Ich gebe und empfange Liebe frei und aus vollem Herzen." },
  { lebensweg: 8, name: "Wunjo", symbol: "ᚹ", thema: "Freude & Harmonie", energie: "Glück, Erfüllung, Gemeinschaft, innerer Frieden", affirmation: "Freude und Harmonie sind mein natürlicher Zustand." },
  { lebensweg: 9, name: "Hagalaz", symbol: "ᚺ", thema: "Transformation & Reinigung", energie: "Wandel, Disruption, Reinigung, Neuanfang aus Trümmern", affirmation: "Ich begrüße Veränderung als Geschenk des Wachstums." },
];

function berechneSchutzrune(geburtsdatum: string): typeof LEBENSWEG_RUNEN[0] | null {
  const parts = geburtsdatum.split(".");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year || year < 1900 || year > 2100) return null;
  const allDigits = `${day}${month}${year}`.split("").map(Number);
  let sum = allDigits.reduce((a, b) => a + b, 0);
  while (sum > 9) {
    sum = sum.toString().split("").map(Number).reduce((a, b) => a + b, 0);
  }
  if (sum === 0) sum = 9;
  return LEBENSWEG_RUNEN[sum - 1];
}

export default function RunenScreen() {
  const [activeSection, setActiveSection] = useState<"schutz" | "thema" | "uebersicht">("schutz");
  const [geburtsdatum, setGeburtsdatum] = useState("");
  const [schutzrune, setSchutzrune] = useState<typeof LEBENSWEG_RUNEN[0] | null>(null);
  const [fehler, setFehler] = useState("");
  const [selectedThema, setSelectedThema] = useState<typeof THEMEN[0] | null>(null);
  const [selectedSet, setSelectedSet] = useState<RunenSet | null>(null);

  function handleBerechnen() {
    setFehler("");
    const rune = berechneSchutzrune(geburtsdatum);
    if (!rune) {
      setFehler("Bitte gib dein Geburtsdatum ein (z.B. 15.03.1990)");
      return;
    }
    setSchutzrune(rune);
  }

  function handleThemaWaehlen(thema: typeof THEMEN[0]) {
    setSelectedThema(thema);
    // Erstes Set der Kategorie vorauswählen
    const sets = getSetsByKategorie(thema.id);
    if (sets.length > 0) setSelectedSet(sets[0]);
  }

  function handleSetWaehlen(set: RunenSet) {
    setSelectedSet(set);
  }

  function handleShopOeffnen() {
    const url = "https://dieseelenplanerin.de/runenarmbander";
    Linking.openURL(url);
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={st.header}>
          <Text style={st.headerSymbol}>ᚱ</Text>
          <Text style={st.headerTitle}>Runen</Text>
          <Text style={st.headerSub}>Entdecke deine Runenenergie</Text>
        </View>

        {/* Section Tabs */}
        <View style={st.sectionTabs}>
          {([
            { id: "schutz" as const, label: "Schutzrune" },
            { id: "thema" as const, label: "Themen-Armband" },
            { id: "uebersicht" as const, label: "Alle Runen" },
          ]).map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[st.sectionTab, activeSection === tab.id && st.sectionTabActive]}
              onPress={() => setActiveSection(tab.id)}
              activeOpacity={0.8}
            >
              <Text style={[st.sectionTabText, activeSection === tab.id && st.sectionTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── SCHUTZRUNE ── */}
        {activeSection === "schutz" && (
          <View style={st.section}>
            <View style={st.card}>
              <Text style={st.cardTitle}>🌙 Deine persönliche Schutzrune</Text>
              <Text style={st.cardDesc}>
                Gib dein Geburtsdatum ein und entdecke die Rune, die dich seit deiner Geburt begleitet und schützt. Sie ist der erste Charm auf deinem Armband.
              </Text>
              <TextInput
                style={st.input}
                placeholder="TT.MM.JJJJ (z.B. 15.03.1990)"
                placeholderTextColor={C.muted}
                value={geburtsdatum}
                onChangeText={setGeburtsdatum}
                keyboardType="numbers-and-punctuation"
                returnKeyType="done"
                onSubmitEditing={handleBerechnen}
              />
              {fehler ? <Text style={st.fehler}>{fehler}</Text> : null}
              <TouchableOpacity style={st.btn} onPress={handleBerechnen} activeOpacity={0.85}>
                <Text style={st.btnText}>✨ Meine Schutzrune berechnen</Text>
              </TouchableOpacity>
            </View>

            {schutzrune && (
              <View style={st.runeResult}>
                <Text style={st.runeSymbolBig}>{schutzrune.symbol}</Text>
                <Text style={st.runeName}>{schutzrune.name}</Text>
                <Text style={st.runeThema}>{schutzrune.thema}</Text>
                <Text style={st.runeEnergie}>{schutzrune.energie}</Text>
                <View style={st.affirmationBox}>
                  <Text style={st.affirmationLabel}>Deine Affirmation</Text>
                  <Text style={st.affirmationText}>"{schutzrune.affirmation}"</Text>
                </View>
                <Text style={st.shopHint}>
                  Deine Schutzrune {schutzrune.name} wird als erster Charm auf dein Armband graviert – mit Heilstein-Pulver veredelt.
                </Text>
                <TouchableOpacity style={st.shopBtn} onPress={handleShopOeffnen} activeOpacity={0.85}>
                  <Text style={st.shopBtnText}>🛍️ Runen-Armband bestellen</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ── THEMA-ARMBAND ── */}
        {activeSection === "thema" && (
          <View style={st.section}>
            <View style={st.card}>
              <Text style={st.cardTitle}>✨ Dein Themen-Armband</Text>
              <Text style={st.cardDesc}>
                Wähle ein Thema das dich gerade bewegt. Dein Armband besteht aus 3 Charms:{"\n"}
                1. Deine Schutzrune (nach Geburtsdatum){"\n"}
                2. + 3. Zwei Themenrunen für dein Seelenthema{"\n\n"}
                Jeder Charm wird auf einem Heilstein-Plättchen graviert:{"\n"}
                Mondstein · Bergkristall · Amethyst · Rosenquarz · Schwarzer Turmalin
              </Text>
            </View>

            {/* Themen-Auswahl */}
            <View style={st.themenGrid}>
              {THEMEN.map(thema => (
                <TouchableOpacity
                  key={thema.id}
                  style={[st.themaCard, selectedThema?.id === thema.id && st.themaCardActive]}
                  onPress={() => handleThemaWaehlen(thema)}
                  activeOpacity={0.8}
                >
                  <Text style={st.themaEmoji}>{thema.emoji}</Text>
                  <Text style={[st.themaLabel, selectedThema?.id === thema.id && st.themaLabelActive]}>
                    {thema.label}
                  </Text>
                  <Text style={st.themaStein}>{thema.heilstein}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Set-Auswahl innerhalb des Themas */}
            {selectedThema && (
              <View style={st.card}>
                <Text style={st.cardTitle}>
                  {selectedThema.emoji} {selectedThema.label} – Wähle dein Set
                </Text>
                <Text style={[st.cardDesc, { marginBottom: 12 }]}>
                  5 verschiedene Runen-Kombinationen für dein Thema. Jedes Set hat eine andere Wirkung:
                </Text>
                {getSetsByKategorie(selectedThema.id).map(set => (
                  <TouchableOpacity
                    key={set.id}
                    style={[
                      st.setOption,
                      selectedSet?.id === set.id && { borderColor: C.rose, backgroundColor: C.roseLight },
                    ]}
                    onPress={() => handleSetWaehlen(set)}
                    activeOpacity={0.8}
                  >
                    <View style={st.setHeader}>
                      <View style={st.setRunenRow}>
                        <Text style={st.setRuneSymbol}>✦</Text>
                        <Text style={[st.setRuneSymbol, { color: C.rose }]}>{set.runenSymbole[1]}</Text>
                        <Text style={[st.setRuneSymbol, { color: C.rose }]}>{set.runenSymbole[2]}</Text>
                      </View>
                      {selectedSet?.id === set.id && (
                        <Text style={{ fontSize: 18, color: C.rose, fontWeight: "700" }}>✓</Text>
                      )}
                    </View>
                    <Text style={st.setName}>{set.name}</Text>
                    <Text style={st.setWirkung}>{set.wirkung}</Text>
                    <Text style={st.setRunenNames}>
                      Schutzrune + {set.runen[1]} + {set.runen[2]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Gewähltes Set Detail */}
            {selectedSet && (
              <View style={[st.card, { backgroundColor: C.roseLight }]}>
                <Text style={[st.cardTitle, { color: C.rose }]}>
                  {selectedSet.runenSymbole[1]} {selectedSet.runenSymbole[2]} {selectedSet.name}
                </Text>
                <Text style={st.cardDesc}>{selectedSet.beschreibung}</Text>
                <View style={st.charmRow}>
                  <View style={st.charm}>
                    <Text style={st.charmSymbol}>✦</Text>
                    <Text style={st.charmName}>Schutzrune</Text>
                    <Text style={st.charmThema}>Persönlicher Anker</Text>
                  </View>
                  <View style={st.charm}>
                    <Text style={[st.charmSymbol, { color: C.rose }]}>{selectedSet.runenSymbole[1]}</Text>
                    <Text style={st.charmName}>{selectedSet.runen[1]}</Text>
                    <Text style={st.charmThema}>Themenrune 1</Text>
                  </View>
                  <View style={st.charm}>
                    <Text style={[st.charmSymbol, { color: C.rose }]}>{selectedSet.runenSymbole[2]}</Text>
                    <Text style={st.charmName}>{selectedSet.runen[2]}</Text>
                    <Text style={st.charmThema}>Themenrune 2</Text>
                  </View>
                </View>
                <View style={st.armbandInfo}>
                  <Text style={st.armbandInfoText}>
                    💎 Heilstein: {selectedThema?.heilstein}{"\n"}
                    🪨 Handgraviert von der Seelenplanerin{"\n"}
                    ✨ Mit Heilstein-Pulver befüllt{"\n"}
                    💫 Ein Unikat – nur für dich
                  </Text>
                </View>
                <Text style={st.preisText}>57,00 € zzgl. 4,90 € Versand</Text>
                <TouchableOpacity style={st.shopBtn} onPress={handleShopOeffnen} activeOpacity={0.85}>
                  <Text style={st.shopBtnText}>🛍️ Armband bestellen →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ── ALLE RUNEN ── */}
        {activeSection === "uebersicht" && (
          <View style={st.section}>
            <Text style={st.sectionTitle}>Die 24 Elder Futhark Runen</Text>
            {RUNEN.map(rune => (
              <View key={rune.name} style={st.runeRow}>
                <Text style={st.runeSymbolSmall}>{rune.symbol}</Text>
                <View style={st.runeInfo}>
                  <Text style={st.runeRowName}>{rune.name}</Text>
                  <Text style={st.runeRowThema}>{rune.thema}</Text>
                  <Text style={st.runeRowEnergie}>{rune.energie}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Runen-Quiz Banner */}
        <TouchableOpacity
          style={{ marginHorizontal: 16, marginTop: 20, backgroundColor: C.brown, borderRadius: 16, padding: 18, flexDirection: "row", alignItems: "center" }}
          onPress={() => router.push("/runen-quiz" as any)}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 36, marginRight: 14, color: C.gold }}>ᚱ</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFF", marginBottom: 3 }}>Welches Runen-Set begleitet dich?</Text>
            <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>9 Fragen · Entdecke dein Seelenthema & deine Runen</Text>
          </View>
          <Text style={{ fontSize: 20, color: C.gold }}>→</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  header: { alignItems: "center", paddingTop: 32, paddingBottom: 20, backgroundColor: C.roseLight },
  headerSymbol: { fontSize: 48, color: C.rose, marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: "700", color: C.brown, letterSpacing: 1 },
  headerSub: { fontSize: 14, color: C.muted, marginTop: 4 },
  sectionTabs: { flexDirection: "row", margin: 16, backgroundColor: C.roseLight, borderRadius: 12, padding: 4 },
  sectionTab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  sectionTabActive: { backgroundColor: C.rose },
  sectionTabText: { fontSize: 11, fontWeight: "600", color: C.muted },
  sectionTabTextActive: { color: "#FFF" },
  section: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 12, marginTop: 4 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: C.border },
  cardTitle: { fontSize: 17, fontWeight: "700", color: C.brown, marginBottom: 8 },
  cardDesc: { fontSize: 14, color: C.muted, lineHeight: 22, marginBottom: 16 },
  input: { borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 14, fontSize: 16, color: C.text, backgroundColor: C.bg, marginBottom: 8 },
  fehler: { color: "#C0392B", fontSize: 13, marginBottom: 8 },
  btn: { backgroundColor: C.rose, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  btnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  runeResult: { backgroundColor: C.card, borderRadius: 20, padding: 24, alignItems: "center", marginBottom: 16, borderWidth: 1, borderColor: C.border },
  runeSymbolBig: { fontSize: 72, color: C.rose, marginBottom: 8 },
  runeName: { fontSize: 26, fontWeight: "700", color: C.brown, marginBottom: 4 },
  runeThema: { fontSize: 15, color: C.gold, fontWeight: "600", marginBottom: 8 },
  runeEnergie: { fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 20, marginBottom: 16 },
  affirmationBox: { backgroundColor: C.goldLight, borderRadius: 12, padding: 16, width: "100%", marginBottom: 16 },
  affirmationLabel: { fontSize: 11, color: C.gold, fontWeight: "700", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 },
  affirmationText: { fontSize: 15, color: C.brown, fontStyle: "italic", lineHeight: 22, textAlign: "center" },
  shopHint: { fontSize: 13, color: C.muted, textAlign: "center", marginBottom: 12, lineHeight: 18 },
  shopBtn: { backgroundColor: C.gold, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24, alignItems: "center", width: "100%" },
  shopBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  themenGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  themaCard: { width: "47%", backgroundColor: C.card, borderRadius: 14, padding: 14, alignItems: "center", borderWidth: 1.5, borderColor: C.border },
  themaCardActive: { borderColor: C.rose, backgroundColor: C.roseLight },
  themaEmoji: { fontSize: 28, marginBottom: 6 },
  themaLabel: { fontSize: 12, fontWeight: "600", color: C.muted, textAlign: "center" },
  themaLabelActive: { color: C.rose },
  themaStein: { fontSize: 10, color: C.gold, marginTop: 4, fontWeight: "600" },
  setOption: { backgroundColor: C.bg, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: C.border },
  setHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  setRunenRow: { flexDirection: "row", gap: 8 },
  setRuneSymbol: { fontSize: 22, color: C.gold },
  setName: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 2 },
  setWirkung: { fontSize: 13, color: C.muted, marginBottom: 4 },
  setRunenNames: { fontSize: 12, color: C.gold, fontWeight: "600" },
  charmRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 16 },
  charm: { alignItems: "center", flex: 1 },
  charmSymbol: { fontSize: 36, color: C.gold, marginBottom: 4 },
  charmName: { fontSize: 13, fontWeight: "700", color: C.brown },
  charmThema: { fontSize: 10, color: C.muted, textAlign: "center" },
  armbandInfo: { backgroundColor: C.goldLight, borderRadius: 12, padding: 14, marginBottom: 16 },
  armbandInfoText: { fontSize: 13, color: C.brown, lineHeight: 22 },
  preisText: { fontSize: 20, fontWeight: "700", color: C.rose, textAlign: "center", marginBottom: 16 },
  runeRow: { flexDirection: "row", backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border, alignItems: "center" },
  runeSymbolSmall: { fontSize: 32, color: C.rose, width: 50, textAlign: "center" },
  runeInfo: { flex: 1, marginLeft: 10 },
  runeRowName: { fontSize: 15, fontWeight: "700", color: C.brown },
  runeRowThema: { fontSize: 12, color: C.gold, fontWeight: "600", marginTop: 2 },
  runeRowEnergie: { fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 16 },
});
