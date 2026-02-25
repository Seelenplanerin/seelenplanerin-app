import React, { useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Linking, Image, Dimensions,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
};

// ─── Aura-Farben mit Hex-Codes ───────────────────────────────────────────────
const AURA_FARBEN: Record<string, {
  hex: string; hex2: string; glow: string;
  chakra: string; element: string;
  bedeutung: string; botschaft: string;
}> = {
  "Weißgold":        { hex: "#E8C96A", hex2: "#FFF9F0", glow: "rgba(232,201,106,0.55)", chakra: "Kronenchakra", element: "Äther", bedeutung: "Klarheit & Neuanfang", botschaft: "Deine Aura strahlt in Weißgold — du bist bereit für Neues. Empfange mit offenen Händen." },
  "Silberblau":      { hex: "#7EB8D8", hex2: "#E8F4FF", glow: "rgba(126,184,216,0.55)", chakra: "Kehlchakra", element: "Luft", bedeutung: "Reinigung & Loslassen", botschaft: "Silberblaues Licht umgibt dich — Altes darf abfließen. Du wirst leichter." },
  "Korallenrosa":    { hex: "#F4886A", hex2: "#FFE8DC", glow: "rgba(244,136,106,0.55)", chakra: "Sakralchakra", element: "Feuer", bedeutung: "Kreativität & Ausdruck", botschaft: "Warmes Korallenrosa — dein kreatives Feld leuchtet. Erschaffe heute etwas Schönes." },
  "Roségold":        { hex: "#E8946A", hex2: "#FFF0EB", glow: "rgba(232,148,106,0.55)", chakra: "Herzchakra", element: "Luft", bedeutung: "Liebe & Verbundenheit", botschaft: "Roségoldenes Licht umhüllt dein Herz. Öffne dich für tiefe Verbindungen." },
  "Smaragdgrün":     { hex: "#4AAE7E", hex2: "#E0F5EC", glow: "rgba(74,174,126,0.55)", chakra: "Herzchakra", element: "Erde", bedeutung: "Fülle & Wachstum", botschaft: "Smaragdgrün — dein Feld zieht Fülle magnetisch an. Vertraue dem Wachstum." },
  "Himmelblau":      { hex: "#5AAEDB", hex2: "#E8F6FF", glow: "rgba(90,174,219,0.55)", chakra: "Kehlchakra", element: "Luft", bedeutung: "Wahrheit & Klarheit", botschaft: "Himmelblau reinigt dein Feld. Sprich deine Wahrheit mit Liebe aus." },
  "Tiefviolett":     { hex: "#8B4E9E", hex2: "#F0E8F5", glow: "rgba(139,78,158,0.55)", chakra: "Kronenchakra", element: "Äther", bedeutung: "Transformation & Heilung", botschaft: "Tiefviolett — du bist in einem Wandlungsprozess. Vertraue der Transformation." },
  "Sonnengelb":      { hex: "#F5C832", hex2: "#FFFBE0", glow: "rgba(245,200,50,0.55)", chakra: "Solarplexus", element: "Feuer", bedeutung: "Kraft & Selbstvertrauen", botschaft: "Sonnengelb stärkt deinen Solarplexus. Stehe zu dir und deiner Kraft." },
  "Bernsteingold":   { hex: "#C9A96E", hex2: "#FAF3E7", glow: "rgba(201,169,110,0.55)", chakra: "Solarplexus", element: "Feuer", bedeutung: "Dankbarkeit & Ernte", botschaft: "Bernsteingold — du erntest, was du gesät hast. Sei dankbar für deinen Weg." },
  "Türkis":          { hex: "#3ECDC4", hex2: "#E0F8F7", glow: "rgba(62,205,196,0.55)", chakra: "Herzchakra", element: "Wasser", bedeutung: "Balance & Harmonie", botschaft: "Türkis bringt Balance. Finde heute die Mitte zwischen Geben und Nehmen." },
  "Dunkelrot":       { hex: "#C03020", hex2: "#FFE8E8", glow: "rgba(192,48,32,0.55)", chakra: "Wurzelchakra", element: "Erde", bedeutung: "Wurzelkraft & Wiedergeburt", botschaft: "Dunkelrot erdet dich tief. Du bist geerdet, geschützt und kraftvoll." },
  "Kristallweiß":    { hex: "#D8D8E8", hex2: "#FAFAFA", glow: "rgba(216,216,232,0.55)", chakra: "Kronenchakra", element: "Äther", bedeutung: "Vollendung & Reinheit", botschaft: "Kristallweiß umhüllt dich mit Reinheit. Alles ist vollendet wie es ist." },
  "Regenbogen-Opal": { hex: "#C890D8", hex2: "#F5EAF8", glow: "rgba(200,144,216,0.55)", chakra: "Alle Chakren", element: "Alle", bedeutung: "Alle Möglichkeiten", botschaft: "Regenbogen-Opal — alle Möglichkeiten stehen dir offen. Wähle bewusst." },
  "Lavendelblau":    { hex: "#9888C8", hex2: "#F0EBF8", glow: "rgba(152,136,200,0.55)", chakra: "Drittes Auge", element: "Luft", bedeutung: "Intuition & Traumarbeit", botschaft: "Lavendelblau öffnet dein drittes Auge. Vertraue deinen inneren Bildern." },
  "Kupferrot":       { hex: "#B87333", hex2: "#F5EBE0", glow: "rgba(184,115,51,0.55)", chakra: "Wurzelchakra", element: "Erde", bedeutung: "Erdung & Leidenschaft", botschaft: "Kupferrot verbindet Leidenschaft mit Erdung. Handle aus deiner Mitte heraus." },
  "Perlmutt":        { hex: "#E8C8B8", hex2: "#FFF8F5", glow: "rgba(232,200,184,0.55)", chakra: "Sakralchakra", element: "Wasser", bedeutung: "Weiblichkeit & Mondkraft", botschaft: "Perlmutt ehrt deine weibliche Kraft. Fließe mit dem Rhythmus des Lebens." },
  "Waldgrün":        { hex: "#3A7C49", hex2: "#E0F0E8", glow: "rgba(58,124,73,0.55)", chakra: "Herzchakra", element: "Erde", bedeutung: "Heilung & Naturverbindung", botschaft: "Waldgrün heilt dein Energiefeld. Geh in die Natur und lade dich auf." },
  "Mitternachtsblau":{ hex: "#2A3A8E", hex2: "#E8EAF6", glow: "rgba(42,58,142,0.55)", chakra: "Drittes Auge", element: "Äther", bedeutung: "Tiefe & Mysterium", botschaft: "Mitternachtsblau lädt dich in die Tiefe. Vertraue dem Unbekannten." },
  "Zartrosa":        { hex: "#F2A4A8", hex2: "#FFF0EC", glow: "rgba(242,164,168,0.55)", chakra: "Herzchakra", element: "Luft", bedeutung: "Sanftheit & Selbstmitgefühl", botschaft: "Zartrosa erinnert dich: Sei sanft mit dir. Du verdienst Mitgefühl." },
  "Goldgelb":        { hex: "#FFD020", hex2: "#FFFDE0", glow: "rgba(255,208,32,0.55)", chakra: "Solarplexus", element: "Feuer", bedeutung: "Strahlen & Manifestation", botschaft: "Goldgelb aktiviert deine Manifestationskraft. Strahle dein Licht aus." },
  "Silber":          { hex: "#A8A8B8", hex2: "#F5F5F5", glow: "rgba(168,168,184,0.55)", chakra: "Kronenchakra", element: "Äther", bedeutung: "Mondenergie & Intuition", botschaft: "Silber verbindet dich mit der Mondenergie. Höre auf deine innere Stimme." },
  "Indigoviolett":   { hex: "#5A2882", hex2: "#EDE8F5", glow: "rgba(90,40,130,0.55)", chakra: "Drittes Auge", element: "Äther", bedeutung: "Visionen & inneres Sehen", botschaft: "Indigoviolett öffnet deine Visionen. Vertraue dem, was du innerlich siehst." },
  "Rubinrot":        { hex: "#9B1B30", hex2: "#FFE8EC", glow: "rgba(155,27,48,0.55)", chakra: "Wurzelchakra", element: "Feuer", bedeutung: "Lebenskraft & Leidenschaft", botschaft: "Rubinrot feuert deine Lebenskraft an. Du bist lebendig, kraftvoll, präsent." },
  "Aquamarin":       { hex: "#5FEAD4", hex2: "#E0FFF8", glow: "rgba(95,234,212,0.55)", chakra: "Herzchakra", element: "Wasser", bedeutung: "Fluss & Klarheit", botschaft: "Aquamarin bringt Fluss in dein Leben. Lass los und fließe mit dem Strom." },
  "Champagner":      { hex: "#E8D0A0", hex2: "#FFFBF5", glow: "rgba(232,208,160,0.55)", chakra: "Kronenchakra", element: "Äther", bedeutung: "Feier & Wertschätzung", botschaft: "Champagner erinnert dich: Feiere dich! Du hast so viel erreicht." },
  "Moosgrün":        { hex: "#7A9A4B", hex2: "#EFF2E8", glow: "rgba(122,154,75,0.55)", chakra: "Herzchakra", element: "Erde", bedeutung: "Geduld & stetiges Wachstum", botschaft: "Moosgrün wächst langsam aber beständig. Vertraue deinem stetigen Wachstum." },
  "Koralle":         { hex: "#FF6A40", hex2: "#FFE8E0", glow: "rgba(255,106,64,0.55)", chakra: "Sakralchakra", element: "Feuer", bedeutung: "Lebensfreude & Optimismus", botschaft: "Koralle bringt Lebensfreude. Lass heute Leichtigkeit in dein Herz." },
  "Graphit":         { hex: "#5A5A6A", hex2: "#F0F0F0", glow: "rgba(90,90,106,0.55)", chakra: "Wurzelchakra", element: "Erde", bedeutung: "Schutz & Abgrenzung", botschaft: "Graphit schützt dein Energiefeld. Du darfst Grenzen setzen." },
  "Flieder":         { hex: "#C898C8", hex2: "#F5EEF8", glow: "rgba(200,152,200,0.55)", chakra: "Kronenchakra", element: "Äther", bedeutung: "Spirituelle Öffnung", botschaft: "Flieder öffnet dich für spirituelle Impulse. Sei offen für Zeichen." },
  "Bronze":          { hex: "#CD7F32", hex2: "#F5EAE0", glow: "rgba(205,127,50,0.55)", chakra: "Solarplexus", element: "Erde", bedeutung: "Stärke & Ausdauer", botschaft: "Bronze erinnert dich an deine Stärke. Du hast schon so viel gemeistert." },
};

const AURA_SEQUENZ = [
  "Weißgold","Silberblau","Korallenrosa","Roségold","Smaragdgrün","Himmelblau","Tiefviolett",
  "Sonnengelb","Bernsteingold","Türkis","Dunkelrot","Kristallweiß","Regenbogen-Opal","Lavendelblau",
  "Kupferrot","Perlmutt","Waldgrün","Mitternachtsblau","Zartrosa","Goldgelb","Silber","Indigoviolett",
  "Rubinrot","Aquamarin","Champagner","Moosgrün","Koralle","Graphit","Flieder","Bronze",
];

function getHeutigeAura() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const farbe = AURA_SEQUENZ[(dayOfYear - 1) % AURA_SEQUENZ.length];
  return { farbe, ...AURA_FARBEN[farbe] };
}

export default function AuraScreen() {
  const aura = useMemo(() => getHeutigeAura(), []);
  const datum = new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

  // Foto-Höhe: 3:4 Verhältnis
  const fotoHoehe = Math.round(width * 1.2);

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={[s.header, { backgroundColor: aura.hex2 }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
            <Text style={s.backBtnText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Deine Aura</Text>
          <Text style={s.headerDatum}>{datum}</Text>
        </View>

        {/* ── FOTO MIT AURA-GLOW-OVERLAY ── */}
        <View style={[s.fotoContainer, { height: fotoHoehe }]}>
          {/* Echtes Foto */}
          <Image
            source={require("@/assets/images/lara-chakra.jpg")}
            style={s.fotoImage}
            resizeMode="cover"
          />

          {/* Äußerer Aura-Glow (weich, groß) */}
          <View style={[s.auraGlowOuter, {
            shadowColor: aura.hex,
            backgroundColor: aura.glow,
          }]} />

          {/* Mittlerer Aura-Glow */}
          <View style={[s.auraGlowMid, {
            borderColor: aura.hex + "80",
            backgroundColor: aura.glow.replace("0.55", "0.15"),
          }]} />

          {/* Innerer Rand */}
          <View style={[s.auraGlowInner, {
            borderColor: aura.hex + "CC",
          }]} />

          {/* Aura-Farb-Overlay über dem ganzen Foto (sehr subtil) */}
          <View style={[s.fotoOverlay, { backgroundColor: aura.hex + "22" }]} />

          {/* Aura-Name Badge unten */}
          <View style={[s.auraBadge, { backgroundColor: aura.hex + "EE" }]}>
            <Text style={s.auraBadgeFarbe}>{aura.farbe}</Text>
            <Text style={s.auraBadgeBed}>{aura.bedeutung}</Text>
          </View>
        </View>

        {/* ── AURA-INFO KARTE ── */}
        <View style={[s.infoCard, { backgroundColor: aura.hex2, borderColor: aura.hex + "60" }]}>
          <View style={s.infoRow}>
            <View style={s.infoItem}>
              <Text style={s.infoLabel}>Chakra</Text>
              <Text style={[s.infoValue, { color: C.brown }]}>{aura.chakra}</Text>
            </View>
            <View style={[s.infoItem, s.infoDivider]}>
              <Text style={s.infoLabel}>Element</Text>
              <Text style={[s.infoValue, { color: C.brown }]}>{aura.element}</Text>
            </View>
            <View style={[s.infoItem, s.infoDivider]}>
              <Text style={s.infoLabel}>Energie</Text>
              <View style={[s.infoColorDot, { backgroundColor: aura.hex }]} />
            </View>
          </View>
        </View>

        {/* ── LARAS BOTSCHAFT ── */}
        <View style={s.botschaftCard}>
          <Text style={s.botschaftLabel}>🌸 Laras Botschaft für dich heute</Text>
          <Text style={s.botschaftText}>"{aura.botschaft}"</Text>
          <Text style={s.botschaftCredit}>— Lara, Die Seelenplanerin</Text>
        </View>

        {/* ── AURA READING BUCHUNG ── */}
        <View style={[s.bookingCard, { backgroundColor: aura.hex + "22", borderColor: aura.hex + "60" }]}>
          <Text style={{ fontSize: 28, marginBottom: 8 }}>🔮</Text>
          <Text style={s.bookingTitle}>Persönliches Aura Reading mit Lara</Text>
          <Text style={s.bookingDesc}>
            Lara liest deine Aura live und gibt dir tiefe Einblicke in deine Energiefelder, Blockaden und Gaben.
          </Text>
          <View style={s.bookingPreisRow}>
            <Text style={[s.bookingPreis, { color: C.brown }]}>77 €</Text>
            <Text style={s.bookingUnit}>· online</Text>
          </View>
          <TouchableOpacity
            style={[s.bookingBtn, { backgroundColor: aura.hex }]}
            onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/TuOzYS")}
            activeOpacity={0.85}
          >
            <Text style={s.bookingBtnText}>Jetzt buchen →</Text>
          </TouchableOpacity>
        </View>

        {/* ── WAS IST EINE AURA ── */}
        <Text style={s.sec}>Was ist eine Aura?</Text>
        {[
          { emoji: "🌈", titel: "Das Energiefeld", text: "Die Aura ist das Energiefeld, das jeden Menschen umgibt. Sie spiegelt deinen emotionalen, mentalen und spirituellen Zustand wider – und verändert sich täglich." },

          { emoji: "✨", titel: "Deine tägliche Aura", text: "Jede Aura-Farbe hat eine eigene Bedeutung. Sie zeigt, welche Energie gerade in dir aktiv ist, wo Heilung stattfindet und welche Gaben du in dir trägst." },
        ].map((item, i) => (
          <View key={i} style={s.erklaerungCard}>
            <Text style={{ fontSize: 26, marginBottom: 6 }}>{item.emoji}</Text>
            <Text style={s.erklaerungTitel}>{item.titel}</Text>
            <Text style={s.erklaerungText}>{item.text}</Text>
          </View>
        ))}

        {/* ── ALLE AURA-FARBEN ── */}
        <Text style={s.sec}>Alle 30 Aura-Farben</Text>
        <View style={s.alleGrid}>
          {AURA_SEQUENZ.map((farbe) => {
            const info = AURA_FARBEN[farbe];
            const isHeute = farbe === aura.farbe;
            return (
              <View key={farbe} style={[
                s.gridItem,
                { backgroundColor: info.hex2, borderColor: isHeute ? info.hex : C.border },
                isHeute && { borderWidth: 2 },
              ]}>
                <View style={[s.gridDot, { backgroundColor: info.hex }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[s.gridName, isHeute && { fontWeight: "700" }]}>{farbe}</Text>
                  <Text style={s.gridBed}>{info.bedeutung}</Text>
                </View>
                {isHeute && <Text style={[s.gridHeute, { color: info.hex }]}>Heute</Text>}
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

  // Foto + Aura-Overlay
  fotoContainer: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  fotoImage: {
    width: "100%",
    height: "100%",
  },
  fotoOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
  },
  // Äußerer Glow-Ring (außerhalb des Fotos simuliert durch absoluten View)
  auraGlowOuter: {
    position: "absolute",
    top: -30, left: -30, right: -30, bottom: -30,
    borderRadius: 20,
    opacity: 0.35,
    // shadowRadius und elevation für Glow-Effekt
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 60,
    shadowOpacity: 0.9,
    elevation: 20,
  },
  auraGlowMid: {
    position: "absolute",
    top: 8, left: 8, right: 8, bottom: 8,
    borderRadius: 12,
    borderWidth: 3,
  },
  auraGlowInner: {
    position: "absolute",
    top: 20, left: 20, right: 20, bottom: 20,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  auraBadge: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    paddingVertical: 14, paddingHorizontal: 20,
    alignItems: "center",
  },
  auraBadgeFarbe: { fontSize: 22, fontWeight: "700", color: "#FFF", textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  auraBadgeBed: { fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 2, textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },

  // Info-Karte
  infoCard: { marginHorizontal: 16, marginTop: 16, borderRadius: 20, borderWidth: 1.5, overflow: "hidden" },
  infoRow: { flexDirection: "row" },
  infoItem: { flex: 1, alignItems: "center", paddingVertical: 14 },
  infoDivider: { borderLeftWidth: 1, borderLeftColor: C.border },
  infoLabel: { fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  infoValue: { fontSize: 13, fontWeight: "600" },
  infoColorDot: { width: 20, height: 20, borderRadius: 10, marginTop: 2 },

  // Botschaft
  botschaftCard: { marginHorizontal: 16, marginTop: 12, backgroundColor: C.roseLight, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border },
  botschaftLabel: { fontSize: 13, fontWeight: "700", color: C.rose, marginBottom: 10 },
  botschaftText: { fontSize: 16, color: C.brown, fontStyle: "italic", lineHeight: 26, marginBottom: 10 },
  botschaftCredit: { fontSize: 12, color: C.muted, textAlign: "right" },

  // Buchung
  bookingCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 20, padding: 20, borderWidth: 1.5, alignItems: "center" },
  bookingTitle: { fontSize: 18, fontWeight: "700", color: C.brown, marginBottom: 8, textAlign: "center" },
  bookingDesc: { fontSize: 13, color: C.brownMid, lineHeight: 20, textAlign: "center", marginBottom: 14 },
  bookingPreisRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 16 },
  bookingPreis: { fontSize: 32, fontWeight: "700" },
  bookingUnit: { fontSize: 13, color: C.muted, marginLeft: 8 },
  bookingBtn: { borderRadius: 14, paddingVertical: 13, paddingHorizontal: 32 },
  bookingBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },

  // Erklärung
  sec: { fontSize: 17, fontWeight: "700", color: C.brown, marginHorizontal: 16, marginTop: 20, marginBottom: 10 },
  erklaerungCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  erklaerungTitel: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 6 },
  erklaerungText: { fontSize: 13, color: C.brownMid, lineHeight: 20 },

  // Alle Farben Grid
  alleGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: 12, gap: 8 },
  gridItem: { width: "47%", borderRadius: 12, padding: 10, borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  gridDot: { width: 14, height: 14, borderRadius: 7, flexShrink: 0 },
  gridName: { fontSize: 12, fontWeight: "600", color: C.brown },
  gridBed: { fontSize: 10, color: C.muted, marginTop: 1 },
  gridHeute: { fontSize: 10, fontWeight: "700", flexShrink: 0 },
});
