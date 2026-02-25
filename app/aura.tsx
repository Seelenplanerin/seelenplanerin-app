import React, { useMemo } from "react";
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

// Aura-Farben mit Hex-Codes für visuelle Darstellung
const AURA_FARBEN: Record<string, { hex: string; hex2: string; chakra: string; element: string }> = {
  "Weißgold":        { hex: "#F5E6C8", hex2: "#FFF9F0", chakra: "Kronenchakra", element: "Äther" },
  "Silberblau":      { hex: "#B8D4E8", hex2: "#E8F4FF", chakra: "Kehlchakra", element: "Luft" },
  "Korallenrosa":    { hex: "#F4A882", hex2: "#FFE8DC", chakra: "Sakralchakra", element: "Feuer" },
  "Roségold":        { hex: "#E8B4A0", hex2: "#FFF0EB", chakra: "Herzchakra", element: "Luft" },
  "Smaragdgrün":     { hex: "#6BAE8E", hex2: "#E0F5EC", chakra: "Herzchakra", element: "Erde" },
  "Himmelblau":      { hex: "#87CEEB", hex2: "#E8F6FF", chakra: "Kehlchakra", element: "Luft" },
  "Tiefviolett":     { hex: "#8B5E9E", hex2: "#F0E8F5", chakra: "Kronenchakra", element: "Äther" },
  "Sonnengelb":      { hex: "#F5C842", hex2: "#FFFBE0", chakra: "Solarplexus", element: "Feuer" },
  "Bernsteingold":   { hex: "#C9A96E", hex2: "#FAF3E7", chakra: "Solarplexus", element: "Feuer" },
  "Türkis":          { hex: "#4ECDC4", hex2: "#E0F8F7", chakra: "Herzchakra", element: "Wasser" },
  "Dunkelrot":       { hex: "#C0392B", hex2: "#FFE8E8", chakra: "Wurzelchakra", element: "Erde" },
  "Kristallweiß":    { hex: "#F0F0F0", hex2: "#FAFAFA", chakra: "Kronenchakra", element: "Äther" },
  "Regenbogen-Opal": { hex: "#D4A8E0", hex2: "#F5EAF8", chakra: "Alle Chakren", element: "Alle" },
  "Lavendelblau":    { hex: "#B8A8D8", hex2: "#F0EBF8", chakra: "Drittes Auge", element: "Luft" },
  "Kupferrot":       { hex: "#B87333", hex2: "#F5EBE0", chakra: "Wurzelchakra", element: "Erde" },
  "Perlmutt":        { hex: "#E8D8C8", hex2: "#FFF8F5", chakra: "Sakralchakra", element: "Wasser" },
  "Waldgrün":        { hex: "#4A7C59", hex2: "#E0F0E8", chakra: "Herzchakra", element: "Erde" },
  "Mitternachtsblau":{ hex: "#1A237E", hex2: "#E8EAF6", chakra: "Drittes Auge", element: "Äther" },
  "Zartrosa":        { hex: "#F2C4B8", hex2: "#FFF0EC", chakra: "Herzchakra", element: "Luft" },
  "Goldgelb":        { hex: "#FFD700", hex2: "#FFFDE0", chakra: "Solarplexus", element: "Feuer" },
  "Silber":          { hex: "#C0C0C0", hex2: "#F5F5F5", chakra: "Kronenchakra", element: "Äther" },
  "Indigoviolett":   { hex: "#4B0082", hex2: "#EDE8F5", chakra: "Drittes Auge", element: "Äther" },
  "Rubinrot":        { hex: "#9B1B30", hex2: "#FFE8EC", chakra: "Wurzelchakra", element: "Feuer" },
  "Aquamarin":       { hex: "#7FFFD4", hex2: "#E0FFF8", chakra: "Herzchakra", element: "Wasser" },
  "Champagner":      { hex: "#F7E7CE", hex2: "#FFFBF5", chakra: "Kronenchakra", element: "Äther" },
  "Moosgrün":        { hex: "#8A9A5B", hex2: "#EFF2E8", chakra: "Herzchakra", element: "Erde" },
  "Koralle":         { hex: "#FF7F50", hex2: "#FFE8E0", chakra: "Sakralchakra", element: "Feuer" },
  "Graphit":         { hex: "#6B6B6B", hex2: "#F0F0F0", chakra: "Wurzelchakra", element: "Erde" },
  "Flieder":         { hex: "#C8A2C8", hex2: "#F5EEF8", chakra: "Kronenchakra", element: "Äther" },
  "Bronze":          { hex: "#CD7F32", hex2: "#F5EAE0", chakra: "Solarplexus", element: "Erde" },
};

// Tägliche Aura aus JSON-Daten (Reihenfolge der 30 Farben, 365 Tage)
const AURA_SEQUENZ = [
  "Weißgold","Silberblau","Korallenrosa","Roségold","Smaragdgrün","Himmelblau","Tiefviolett",
  "Sonnengelb","Bernsteingold","Türkis","Dunkelrot","Kristallweiß","Regenbogen-Opal","Lavendelblau",
  "Kupferrot","Perlmutt","Waldgrün","Mitternachtsblau","Zartrosa","Goldgelb","Silber","Indigoviolett",
  "Rubinrot","Aquamarin","Champagner","Moosgrün","Koralle","Graphit","Flieder","Bronze",
];

const AURA_BEDEUTUNGEN: Record<string, { bedeutung: string; botschaft: string }> = {
  "Weißgold":        { bedeutung: "Klarheit & Neuanfang", botschaft: "Deine Aura strahlt in Weißgold — du bist bereit für Neues. Empfange mit offenen Händen." },
  "Silberblau":      { bedeutung: "Reinigung & Loslassen", botschaft: "Silberblaues Licht umgibt dich — Altes darf abfließen. Du wirst leichter." },
  "Korallenrosa":    { bedeutung: "Kreativität & Ausdruck", botschaft: "Warmes Korallenrosa — dein kreatives Feld leuchtet. Erschaffe heute etwas Schönes." },
  "Roségold":        { bedeutung: "Liebe & Verbundenheit", botschaft: "Roségoldenes Licht umhüllt dein Herz. Öffne dich für tiefe Verbindungen." },
  "Smaragdgrün":     { bedeutung: "Fülle & Wachstum", botschaft: "Smaragdgrün — dein Feld zieht Fülle magnetisch an. Vertraue dem Wachstum." },
  "Himmelblau":      { bedeutung: "Wahrheit & Klarheit", botschaft: "Himmelblau reinigt dein Feld. Sprich deine Wahrheit mit Liebe aus." },
  "Tiefviolett":     { bedeutung: "Transformation & Heilung", botschaft: "Tiefviolett — du bist in einem Wandlungsprozess. Vertraue der Transformation." },
  "Sonnengelb":      { bedeutung: "Kraft & Selbstvertrauen", botschaft: "Sonnengelb stärkt deinen Solarplexus. Stehe zu dir und deiner Kraft." },
  "Bernsteingold":   { bedeutung: "Dankbarkeit & Ernte", botschaft: "Bernsteingold — du erntest, was du gesät hast. Sei dankbar für deinen Weg." },
  "Türkis":          { bedeutung: "Balance & Harmonie", botschaft: "Türkis bringt Balance. Finde heute die Mitte zwischen Geben und Nehmen." },
  "Dunkelrot":       { bedeutung: "Wurzelkraft & Wiedergeburt", botschaft: "Dunkelrot erdet dich tief. Du bist geerdet, geschützt und kraftvoll." },
  "Kristallweiß":    { bedeutung: "Vollendung & Reinheit", botschaft: "Kristallweiß umhüllt dich mit Reinheit. Alles ist vollendet wie es ist." },
  "Regenbogen-Opal": { bedeutung: "Alle Möglichkeiten", botschaft: "Regenbogen-Opal — alle Möglichkeiten stehen dir offen. Wähle bewusst." },
  "Lavendelblau":    { bedeutung: "Intuition & Traumarbeit", botschaft: "Lavendelblau öffnet dein drittes Auge. Vertraue deinen inneren Bildern." },
  "Kupferrot":       { bedeutung: "Erdung & Leidenschaft", botschaft: "Kupferrot verbindet Leidenschaft mit Erdung. Handle aus deiner Mitte heraus." },
  "Perlmutt":        { bedeutung: "Weiblichkeit & Mondkraft", botschaft: "Perlmutt ehrt deine weibliche Kraft. Fließe mit dem Rhythmus des Lebens." },
  "Waldgrün":        { bedeutung: "Heilung & Naturverbindung", botschaft: "Waldgrün heilt dein Energiefeld. Geh in die Natur und lade dich auf." },
  "Mitternachtsblau":{ bedeutung: "Tiefe & Mysterium", botschaft: "Mitternachtsblau lädt dich in die Tiefe. Vertraue dem Unbekannten." },
  "Zartrosa":        { bedeutung: "Sanftheit & Selbstmitgefühl", botschaft: "Zartrosa erinnert dich: Sei sanft mit dir. Du verdienst Mitgefühl." },
  "Goldgelb":        { bedeutung: "Strahlen & Manifestation", botschaft: "Goldgelb aktiviert deine Manifestationskraft. Strahle dein Licht aus." },
  "Silber":          { bedeutung: "Mondenergie & Intuition", botschaft: "Silber verbindet dich mit der Mondenergie. Höre auf deine innere Stimme." },
  "Indigoviolett":   { bedeutung: "Visionen & inneres Sehen", botschaft: "Indigoviolett öffnet deine Visionen. Vertraue dem, was du innerlich siehst." },
  "Rubinrot":        { bedeutung: "Lebenskraft & Leidenschaft", botschaft: "Rubinrot feuert deine Lebenskraft an. Du bist lebendig, kraftvoll, präsent." },
  "Aquamarin":       { bedeutung: "Fluss & Klarheit", botschaft: "Aquamarin bringt Fluss in dein Leben. Lass los und fließe mit dem Strom." },
  "Champagner":      { bedeutung: "Feier & Wertschätzung", botschaft: "Champagner erinnert dich: Feiere dich! Du hast so viel erreicht." },
  "Moosgrün":        { bedeutung: "Geduld & stetiges Wachstum", botschaft: "Moosgrün wächst langsam aber beständig. Vertraue deinem stetigen Wachstum." },
  "Koralle":         { bedeutung: "Lebensfreude & Optimismus", botschaft: "Koralle bringt Lebensfreude. Lass heute Leichtigkeit in dein Herz." },
  "Graphit":         { bedeutung: "Schutz & Abgrenzung", botschaft: "Graphit schützt dein Energiefeld. Du darfst Grenzen setzen." },
  "Flieder":         { bedeutung: "Spirituelle Öffnung", botschaft: "Flieder öffnet dich für spirituelle Impulse. Sei offen für Zeichen." },
  "Bronze":          { bedeutung: "Stärke & Ausdauer", botschaft: "Bronze erinnert dich an deine Stärke. Du hast schon so viel gemeistert." },
};

function getHeutigeAura() {
  // Berechnung basierend auf Datum (Tag des Jahres)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const idx = (dayOfYear - 1) % AURA_SEQUENZ.length;
  const farbe = AURA_SEQUENZ[idx];
  const info = AURA_FARBEN[farbe] || { hex: "#E8D5C8", hex2: "#FFF5F0", chakra: "Herzchakra", element: "Luft" };
  const bedeutung = AURA_BEDEUTUNGEN[farbe] || { bedeutung: "Licht & Liebe", botschaft: "Deine Aura leuchtet heute besonders hell." };
  return { farbe, ...info, ...bedeutung };
}

const AURA_ERKLAERUNG = [
  { emoji: "🌈", titel: "Was ist eine Aura?", text: "Die Aura ist das Energiefeld, das jeden Menschen umgibt. Sie spiegelt deinen emotionalen, mentalen und spirituellen Zustand wider – und verändert sich täglich." },
  { emoji: "🔮", titel: "Wie liest Lara Auren?", text: "Lara hat die Fähigkeit entwickelt, Auren visuell wahrzunehmen. In einem Aura Reading beschreibt sie Farben, Muster und Blockaden in deinem Energiefeld." },
  { emoji: "✨", titel: "Was verrät deine Aura?", text: "Jede Aura-Farbe hat eine eigene Bedeutung. Sie zeigt, welche Energie gerade in dir aktiv ist, wo Heilung stattfindet und welche Gaben du in dir trägst." },
];

export default function AuraScreen() {
  const aura = useMemo(() => getHeutigeAura(), []);
  const datum = new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={[s.header, { backgroundColor: aura.hex2 }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
            <Text style={s.backBtnText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Deine Aura</Text>
          <Text style={s.headerDatum}>{datum}</Text>
        </View>

        {/* Aura-Visualisierung */}
        <View style={[s.auraCard, { backgroundColor: aura.hex2, borderColor: aura.hex }]}>
          {/* Aura-Kreis */}
          <View style={[s.auraOuter, { backgroundColor: aura.hex + "40" }]}>
            <View style={[s.auraMid, { backgroundColor: aura.hex + "70" }]}>
              <View style={[s.auraInner, { backgroundColor: aura.hex }]}>
                <Text style={s.auraSymbol}>✦</Text>
              </View>
            </View>
          </View>

          <Text style={[s.auraFarbe, { color: C.brown }]}>{aura.farbe}</Text>
          <Text style={[s.auraBedeutung, { color: C.rose }]}>{aura.bedeutung}</Text>

          <View style={[s.auraInfoRow]}>
            <View style={s.auraInfoItem}>
              <Text style={s.auraInfoLabel}>Chakra</Text>
              <Text style={s.auraInfoValue}>{aura.chakra}</Text>
            </View>
            <View style={[s.auraInfoItem, { borderLeftWidth: 1, borderLeftColor: C.border }]}>
              <Text style={s.auraInfoLabel}>Element</Text>
              <Text style={s.auraInfoValue}>{aura.element}</Text>
            </View>
          </View>
        </View>

        {/* Botschaft */}
        <View style={s.botschaftCard}>
          <Text style={s.botschaftLabel}>🌸 Laras Botschaft für dich heute</Text>
          <Text style={s.botschaftText}>"{aura.botschaft}"</Text>
          <Text style={s.botschaftCredit}>— Lara, Die Seelenplanerin</Text>
        </View>

        {/* Aura-Erklärung */}
        <Text style={s.sec}>Was ist eine Aura?</Text>
        {AURA_ERKLAERUNG.map((item, i) => (
          <View key={i} style={s.erklaerungCard}>
            <Text style={{ fontSize: 28, marginBottom: 8 }}>{item.emoji}</Text>
            <Text style={s.erklaerungTitel}>{item.titel}</Text>
            <Text style={s.erklaerungText}>{item.text}</Text>
          </View>
        ))}

        {/* Aura Reading Buchung */}
        <View style={s.bookingCard}>
          <Text style={{ fontSize: 32, marginBottom: 12 }}>🔮</Text>
          <Text style={s.bookingTitle}>Persönliches Aura Reading mit Lara</Text>
          <Text style={s.bookingDesc}>
            Lara liest deine Aura live und gibt dir tiefe Einblicke in deine Energiefelder, Blockaden und Gaben. Ein transformatives Erlebnis.
          </Text>
          <View style={s.bookingPreis}>
            <Text style={s.bookingPreisText}>77 €</Text>
            <Text style={s.bookingPreisUnit}>· ca. 60 Minuten · online</Text>
          </View>
          <TouchableOpacity
            style={s.bookingBtn}
            onPress={() => Linking.openURL("https://calendly.com/dieseelenplanerin")}
            activeOpacity={0.85}
          >
            <Text style={s.bookingBtnText}>Jetzt buchen →</Text>
          </TouchableOpacity>
        </View>

        {/* Alle Aura-Farben */}
        <Text style={s.sec}>Alle Aura-Farben</Text>
        <View style={s.alleAuraGrid}>
          {AURA_SEQUENZ.map((farbe) => {
            const info = AURA_FARBEN[farbe];
            const bed = AURA_BEDEUTUNGEN[farbe];
            return (
              <View key={farbe} style={[s.auraGridItem, { backgroundColor: info?.hex2 || "#FFF", borderColor: info?.hex || C.border }]}>
                <View style={[s.auraGridDot, { backgroundColor: info?.hex || C.rose }]} />
                <Text style={s.auraGridName}>{farbe}</Text>
                <Text style={s.auraGridBed}>{bed?.bedeutung || ""}</Text>
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: { padding: 20, paddingTop: 24 },
  backBtn: { marginBottom: 12 },
  backBtnText: { fontSize: 14, color: C.muted, fontWeight: "600" },
  headerTitle: { fontSize: 28, fontWeight: "700", color: C.brown },
  headerDatum: { fontSize: 13, color: C.muted, marginTop: 4 },
  auraCard: { margin: 16, borderRadius: 24, padding: 24, borderWidth: 1.5, alignItems: "center" },
  auraOuter: { width: 180, height: 180, borderRadius: 90, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  auraMid: { width: 130, height: 130, borderRadius: 65, alignItems: "center", justifyContent: "center" },
  auraInner: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  auraSymbol: { fontSize: 32, color: "#FFF" },
  auraFarbe: { fontSize: 26, fontWeight: "700", marginBottom: 4 },
  auraBedeutung: { fontSize: 16, fontWeight: "600", marginBottom: 16 },
  auraInfoRow: { flexDirection: "row", width: "100%" },
  auraInfoItem: { flex: 1, alignItems: "center", paddingVertical: 8 },
  auraInfoLabel: { fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  auraInfoValue: { fontSize: 14, fontWeight: "600", color: C.brown },
  botschaftCard: { marginHorizontal: 16, marginBottom: 8, backgroundColor: C.roseLight, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border },
  botschaftLabel: { fontSize: 13, fontWeight: "700", color: C.rose, marginBottom: 10 },
  botschaftText: { fontSize: 16, color: C.brown, fontStyle: "italic", lineHeight: 26, marginBottom: 10 },
  botschaftCredit: { fontSize: 12, color: C.muted, textAlign: "right" },
  sec: { fontSize: 17, fontWeight: "700", color: C.brown, marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  erklaerungCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  erklaerungTitel: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 6 },
  erklaerungText: { fontSize: 13, color: C.brownMid, lineHeight: 20 },
  bookingCard: { margin: 16, backgroundColor: C.brown, borderRadius: 24, padding: 24, alignItems: "center" },
  bookingTitle: { fontSize: 20, fontWeight: "700", color: "#FFF", marginBottom: 10, textAlign: "center" },
  bookingDesc: { fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 22, textAlign: "center", marginBottom: 16 },
  bookingPreis: { flexDirection: "row", alignItems: "baseline", marginBottom: 20 },
  bookingPreisText: { fontSize: 36, fontWeight: "700", color: C.gold },
  bookingPreisUnit: { fontSize: 14, color: "rgba(255,255,255,0.7)", marginLeft: 8 },
  bookingBtn: { backgroundColor: C.gold, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 32 },
  bookingBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  alleAuraGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: 12, gap: 8 },
  auraGridItem: { width: "47%", borderRadius: 12, padding: 12, borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  auraGridDot: { width: 14, height: 14, borderRadius: 7 },
  auraGridName: { fontSize: 12, fontWeight: "700", color: C.brown, flex: 1 },
  auraGridBed: { fontSize: 10, color: C.muted, flex: 1 },
});
