import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Linking, Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";

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

// ─── Runen-Daten ──────────────────────────────────────────────────────────────
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
  { name: "Sowilo", symbol: "ᛊ", thema: "Erfolg & Sonne", energie: "Siegeskraft, Lebensenergie, Klarheit", affirmation: "Ich strahle Licht und Erfolg aus." },
  { name: "Tiwaz", symbol: "ᛏ", thema: "Gerechtigkeit & Mut", energie: "Kriegsgott, Ehre, Opferbereitschaft", affirmation: "Ich handle mit Integrität und Mut." },
  { name: "Berkano", symbol: "ᛒ", thema: "Geburt & Wachstum", energie: "Birke, Fruchtbarkeit, Fürsorge", affirmation: "Ich pflege mein Wachstum liebevoll." },
  { name: "Ehwaz", symbol: "ᛖ", thema: "Vertrauen & Partnerschaft", energie: "Pferd, Bewegung, Zusammenarbeit", affirmation: "Ich vertraue meinen Beziehungen." },
  { name: "Mannaz", symbol: "ᛗ", thema: "Selbsterkenntnis & Humanität", energie: "Mensch, Gemeinschaft, Selbstbewusstsein", affirmation: "Ich kenne und liebe mich selbst." },
  { name: "Laguz", symbol: "ᛚ", thema: "Intuition & Gefühle", energie: "Wasser, Unterbewusstsein, Fluss", affirmation: "Ich fließe mit dem Strom des Lebens." },
  { name: "Ingwaz", symbol: "ᛜ", thema: "Fruchtbarkeit & Potenzial", energie: "Innere Kraft, Potenzial, Vollendung", affirmation: "Mein inneres Potenzial entfaltet sich." },
  { name: "Dagaz", symbol: "ᛞ", thema: "Durchbruch & Erleuchtung", energie: "Tagesanbruch, Transformation, Klarheit", affirmation: "Ein neuer Tag bringt neue Möglichkeiten." },
  { name: "Othala", symbol: "ᛟ", thema: "Heimat & Erbe", energie: "Ahnen, Heimat, Geborgenheit", affirmation: "Ich bin verwurzelt in meinem Erbe." },
];

const THEMEN = [
  { id: "liebe", label: "Liebe & Beziehung", emoji: "💗", runen: ["Gebo", "Wunjo", "Berkano", "Ehwaz", "Laguz"] },
  { id: "schutz", label: "Schutz & Sicherheit", emoji: "🛡️", runen: ["Thurisaz", "Algiz", "Eihwaz", "Isa", "Othala"] },
  { id: "erfolg", label: "Erfolg & Karriere", emoji: "✨", runen: ["Fehu", "Sowilo", "Tiwaz", "Raidho", "Kenaz"] },
  { id: "heilung", label: "Heilung & Gesundheit", emoji: "🌿", runen: ["Uruz", "Berkano", "Laguz", "Ingwaz", "Jera"] },
  { id: "intuition", label: "Intuition & Weisheit", emoji: "🔮", runen: ["Ansuz", "Perthro", "Laguz", "Mannaz", "Dagaz"] },
  { id: "kraft", label: "Kraft & Transformation", emoji: "🔥", runen: ["Hagalaz", "Nauthiz", "Uruz", "Dagaz", "Sowilo"] },
  { id: "fulle", label: "Fülle & Manifestation", emoji: "🌕", runen: ["Fehu", "Jera", "Ingwaz", "Wunjo", "Othala"] },
  { id: "frieden", label: "Frieden & Harmonie", emoji: "🕊️", runen: ["Wunjo", "Isa", "Gebo", "Mannaz", "Othala"] },
];

// Klassische Lebensweg-Numerologie: alle Ziffern addieren bis 1-9
// Lebensweg 1-9 entspricht den ersten 9 Runen des Elder Futhark
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
  // Format: DD.MM.YYYY
  const parts = geburtsdatum.split(".");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year || year < 1900 || year > 2100) return null;
  // Klassische Numerologie: alle Ziffern addieren und auf 1-9 reduzieren
  const allDigits = `${day}${month}${year}`.split("").map(Number);
  let sum = allDigits.reduce((a, b) => a + b, 0);
  // Wiederholt reduzieren bis 1-9 (Meisterzahlen 11, 22 werden auch reduziert)
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
  const [armband, setArmband] = useState<string[]>([]);

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
    // Automatisch die ersten 3 Runen des Themas als Armband vorschlagen
    const runenFuerThema = thema.runen
      .map(name => RUNEN.find(r => r.name === name))
      .filter(Boolean) as typeof RUNEN;
    setArmband(runenFuerThema.slice(0, 3).map(r => r.name));
  }

  function handleShopOeffnen() {
    Linking.openURL("https://dieseelenplanerin.tentary.com/p/qnl3vN");
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Zurück-Button */}
        <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4, alignSelf: "flex-start" }} activeOpacity={0.7}>
          <Text style={{ fontSize: 15, color: C.rose, fontWeight: "600" }}>← Zurück</Text>
        </TouchableOpacity>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerSymbol}>ᚱ</Text>
          <Text style={s.headerTitle}>Runen</Text>
          <Text style={s.headerSub}>Entdecke deine Runenenergie</Text>
        </View>

        {/* Section Tabs */}
        <View style={s.sectionTabs}>
          {[
            { id: "schutz", label: "Schutzrune" },
            { id: "thema", label: "Thema-Armband" },
            { id: "uebersicht", label: "Alle Runen" },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[s.sectionTab, activeSection === tab.id && s.sectionTabActive]}
              onPress={() => setActiveSection(tab.id as any)}
              activeOpacity={0.8}
            >
              <Text style={[s.sectionTabText, activeSection === tab.id && s.sectionTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── SCHUTZRUNE ── */}
        {activeSection === "schutz" && (
          <View style={s.section}>
            <View style={s.card}>
              <Text style={s.cardTitle}>🌙 Deine persönliche Schutzrune</Text>
              <Text style={s.cardDesc}>
                Gib dein Geburtsdatum ein und entdecke die Rune, die dich seit deiner Geburt begleitet und schützt.
              </Text>
              <TextInput
                style={s.input}
                placeholder="TT.MM.JJJJ (z.B. 15.03.1990)"
                placeholderTextColor={C.muted}
                value={geburtsdatum}
                onChangeText={setGeburtsdatum}
                keyboardType="numbers-and-punctuation"
                returnKeyType="done"
                onSubmitEditing={handleBerechnen}
              />
              {fehler ? <Text style={s.fehler}>{fehler}</Text> : null}
              <TouchableOpacity style={s.btn} onPress={handleBerechnen} activeOpacity={0.85}>
                <Text style={s.btnText}>✨ Meine Schutzrune berechnen</Text>
              </TouchableOpacity>
            </View>

            {schutzrune && (
              <View style={s.runeResult}>
                <Text style={s.runeSymbolBig}>{schutzrune.symbol}</Text>
                <Text style={s.runeName}>{schutzrune.name}</Text>
                <Text style={s.runeThema}>{schutzrune.thema}</Text>
                <Text style={s.runeEnergie}>{schutzrune.energie}</Text>
                <View style={s.affirmationBox}>
                  <Text style={s.affirmationLabel}>Deine Affirmation</Text>
                  <Text style={s.affirmationText}>"{schutzrune.affirmation}"</Text>
                </View>
                <Text style={s.shopHint}>
                  Möchtest du deine Schutzrune als handgraviertes Armband mit Heilstein-Pulver tragen?
                </Text>
                <TouchableOpacity style={s.shopBtn} onPress={handleShopOeffnen} activeOpacity={0.85}>
                  <Text style={s.shopBtnText}>🛍️ Jetzt im Shop bestellen</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ── THEMA-ARMBAND ── */}
        {activeSection === "thema" && (
          <View style={s.section}>
            <View style={s.card}>
              <Text style={s.cardTitle}>✨ Themen-Armband gestalten</Text>
              <Text style={s.cardDesc}>
                Wähle ein Thema das dich gerade bewegt. Ich stelle dir 3 passende Runen-Charms zusammen – handgraviert mit Heilstein-Pulver.
              </Text>
            </View>

            <View style={s.themenGrid}>
              {THEMEN.map(thema => (
                <TouchableOpacity
                  key={thema.id}
                  style={[s.themaCard, selectedThema?.id === thema.id && s.themaCardActive]}
                  onPress={() => handleThemaWaehlen(thema)}
                  activeOpacity={0.8}
                >
                  <Text style={s.themaEmoji}>{thema.emoji}</Text>
                  <Text style={[s.themaLabel, selectedThema?.id === thema.id && s.themaLabelActive]}>
                    {thema.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedThema && armband.length > 0 && (
              <View style={s.armbandResult}>
                <Text style={s.armbandTitle}>Dein {selectedThema.label}-Armband</Text>
                <Text style={s.armbandDesc}>
                  Diese 3 Runen-Charms + 1 Silberarmband ergeben dein persönliches Energiearmband:
                </Text>
                <View style={s.charmRow}>
                  {armband.map(runeName => {
                    const rune = RUNEN.find(r => r.name === runeName);
                    if (!rune) return null;
                    return (
                      <View key={runeName} style={s.charm}>
                        <Text style={s.charmSymbol}>{rune.symbol}</Text>
                        <Text style={s.charmName}>{rune.name}</Text>
                        <Text style={s.charmThema}>{rune.thema}</Text>
                      </View>
                    );
                  })}
                </View>
                <View style={s.armbandInfo}>
                  <Text style={s.armbandInfoText}>
                    🪨 Jedes Plättchen ist handgraviert von Lara{"\n"}
                    ✨ Mit kraftvollem Heilstein-Pulver befüllt{"\n"}
                    💫 Ein Unikat – nur für dich gemacht
                  </Text>
                </View>
                <TouchableOpacity style={s.shopBtn} onPress={handleShopOeffnen} activeOpacity={0.85}>
                  <Text style={s.shopBtnText}>🛍️ Armband bestellen – ab 28,90 €</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ── ALLE RUNEN ── */}
        {activeSection === "uebersicht" && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Die 24 Elder Futhark Runen</Text>
            {RUNEN.map(rune => (
              <View key={rune.name} style={s.runeRow}>
                <Text style={s.runeSymbolSmall}>{rune.symbol}</Text>
                <View style={s.runeInfo}>
                  <Text style={s.runeRowName}>{rune.name}</Text>
                  <Text style={s.runeRowThema}>{rune.thema}</Text>
                  <Text style={s.runeRowEnergie}>{rune.energie}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Runen-Quiz Banner */}
        <TouchableOpacity
          style={{marginHorizontal:16,marginTop:20,backgroundColor:C.brown,borderRadius:16,padding:18,flexDirection:"row",alignItems:"center"}}
          onPress={()=>router.push("/runen-quiz" as any)}
          activeOpacity={0.85}
        >
          <Text style={{fontSize:36,marginRight:14,color:C.gold}}>ᚱ</Text>
          <View style={{flex:1}}>
            <Text style={{fontSize:16,fontWeight:"700",color:"#FFF",marginBottom:3}}>Welche Rune führt dich?</Text>
            <Text style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>8 Fragen · Entdecke deine persönliche Seelenrune</Text>
          </View>
          <Text style={{fontSize:20,color:C.gold}}>→</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
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
  cardDesc: { fontSize: 14, color: C.muted, lineHeight: 20, marginBottom: 16 },
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
  armbandResult: { backgroundColor: C.card, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: C.border },
  armbandTitle: { fontSize: 18, fontWeight: "700", color: C.brown, marginBottom: 6, textAlign: "center" },
  armbandDesc: { fontSize: 13, color: C.muted, textAlign: "center", marginBottom: 16, lineHeight: 18 },
  charmRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
  charm: { alignItems: "center", flex: 1 },
  charmSymbol: { fontSize: 36, color: C.rose, marginBottom: 4 },
  charmName: { fontSize: 13, fontWeight: "700", color: C.brown },
  charmThema: { fontSize: 10, color: C.muted, textAlign: "center" },
  armbandInfo: { backgroundColor: C.goldLight, borderRadius: 12, padding: 14, marginBottom: 16 },
  armbandInfoText: { fontSize: 13, color: C.brown, lineHeight: 22 },
  runeRow: { flexDirection: "row", backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border, alignItems: "center" },
  runeSymbolSmall: { fontSize: 32, color: C.rose, width: 50, textAlign: "center" },
  runeInfo: { flex: 1, marginLeft: 10 },
  runeRowName: { fontSize: 15, fontWeight: "700", color: C.brown },
  runeRowThema: { fontSize: 12, color: C.gold, fontWeight: "600", marginTop: 2 },
  runeRowEnergie: { fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 16 },
});
