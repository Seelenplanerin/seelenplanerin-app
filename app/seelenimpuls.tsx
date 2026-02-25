import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Image,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
};

const FEATURES = [
  { emoji: "🎧", titel: "Exklusive Meditationen", beschreibung: "Geführte Meditationen von Lara – nur für Mitglieder" },
  { emoji: "🕯️", titel: "Tiefe Rituale", beschreibung: "Ausführliche Mondphasen- und Seelenrituale" },
  { emoji: "✨", titel: "Persönliche Impulse", beschreibung: "Wöchentliche Botschaften direkt von Lara an dich" },
  { emoji: "🌙", titel: "Mondkalender Premium", beschreibung: "Detaillierte Mondenergie-Vorhersagen für jeden Tag" },
  { emoji: "📞", titel: "Monatlicher Community-Call", beschreibung: "Live-Call mit Lara und allen Mitgliedern – gemeinsam wachsen" },
  { emoji: "💌", titel: "Community-Zugang", beschreibung: "Exklusiver Zugang zur Seelenplanerin-Community" },
  { emoji: "🎁", titel: "Frühzugang zu Produkten", beschreibung: "Neue Armbänder und Angebote zuerst für Mitglieder" },
];

const TESTIMONIALS = [
  { name: "Sarah M.", text: "Der Seelenimpuls hat mein Leben verändert. Laras Meditationen helfen mir jeden Morgen, zentriert in den Tag zu starten.", emoji: "🌸" },
  { name: "Julia K.", text: "Endlich eine spirituelle Begleitung die sich wirklich persönlich anfühlt. Lara ist so authentisch und herzlich.", emoji: "✨" },
  { name: "Marie L.", text: "Die Mondphasen-Rituale haben mir geholfen, meinen eigenen Rhythmus zu finden. Ich bin so dankbar für diesen Raum.", emoji: "🌙" },
];

export default function SeelenimpulsScreen() {
  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        {/* Zurück-Button */}
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
            <Text style={s.backBtnText}>← Zurück</Text>
          </TouchableOpacity>
        </View>

        {/* Laras Bild direkt auf der Hauptseite */}
        <View style={s.heroSection}>
          <Image
            source={require("@/assets/images/lara-profile.jpg")}
            style={s.laraImage}
            resizeMode="cover"
          />
          <View style={s.heroBadge}>
            <Text style={s.heroBadgeText}>17 € / Monat</Text>
          </View>
        </View>

        {/* Lara's Botschaft */}
        <View style={s.botschaftCard}>
          <Text style={s.botschaftEmoji}>🌸</Text>
          <Text style={s.botschaftText}>
            "Ich habe den Seelenimpuls für alle Frauen geschaffen, die tiefer in ihre spirituelle Praxis eintauchen möchten. Hier bekommst du nicht nur Inhalte – du bekommst meine volle Präsenz und Begleitung."
          </Text>
          <Text style={s.botschaftAutor}>— Lara, Die Seelenplanerin</Text>
        </View>

        {/* Features */}
        <Text style={s.sec}>Was dich erwartet</Text>
        {FEATURES.map((f, i) => (
          <View key={i} style={s.featureRow}>
            <View style={s.featureEmoji}>
              <Text style={{ fontSize: 24 }}>{f.emoji}</Text>
            </View>
            <View style={s.featureInfo}>
              <Text style={s.featureTitel}>{f.titel}</Text>
              <Text style={s.featureDesc}>{f.beschreibung}</Text>
            </View>
            <Text style={{ color: C.gold, fontSize: 18 }}>✓</Text>
          </View>
        ))}

        {/* Testimonials */}
        <Text style={s.sec}>Was Mitglieder sagen</Text>
        {TESTIMONIALS.map((t, i) => (
          <View key={i} style={s.testimonialCard}>
            <Text style={{ fontSize: 24, marginBottom: 8 }}>{t.emoji}</Text>
            <Text style={s.testimonialText}>"{t.text}"</Text>
            <Text style={s.testimonialName}>— {t.name}</Text>
          </View>
        ))}

        {/* Preis */}
        <View style={s.preisCard}>
          <Text style={s.preisTitle}>Seelenimpuls Mitgliedschaft</Text>
          <Text style={s.preis}>17 €</Text>
          <Text style={s.preisUnit}>pro Monat - jederzeit kündbar</Text>
          <View style={s.preisFeatures}>
            {["Alle exklusiven Inhalte", "Persönliche Impulse von Lara", "Monatlicher Community-Call mit Lara", "Community-Zugang", "Jederzeit kündbar"].map((f, i) => (
              <View key={i} style={s.preisFeatureRow}>
                <Text style={{ color: C.gold, fontSize: 16, marginRight: 8 }}>✓</Text>
                <Text style={{ fontSize: 14, color: C.brownMid }}>{f}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={s.cta}
            onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/E6FP1U")}
            activeOpacity={0.85}
          >
            <Text style={s.ctaText}>Jetzt Mitglied werden →</Text>
          </TouchableOpacity>
          <Text style={s.ctaHint}>Sicher bezahlen über Tentary · SSL-verschlüsselt</Text>
        </View>

        {/* FAQ */}
        <Text style={s.sec}>Häufige Fragen</Text>
        <View style={s.faqCard}>
          {[
            { frage: "Wie kann ich kündigen?", antwort: "Du kannst jederzeit über Tentary kündigen. Keine Mindestlaufzeit." },
            { frage: "Wie erhalte ich die Inhalte?", antwort: "Nach der Buchung erhältst du Zugang zu allen exklusiven Inhalten direkt in der App." },
            { frage: "Gibt es eine Testphase?", antwort: "Schreibe Lara direkt auf Instagram an – sie freut sich über jede Nachricht." },
          ].map((item, i) => (
            <View key={i} style={[s.faqItem, i > 0 && { borderTopWidth: 1, borderTopColor: C.border }]}>
              <Text style={s.faqFrage}>{item.frage}</Text>
              <Text style={s.faqAntwort}>{item.antwort}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: C.bg,
  },
  backBtn: { alignSelf: "flex-start" },
  backBtnText: { fontSize: 15, color: C.rose, fontWeight: "600" },
  heroSection: {
    width: "100%",
    position: "relative",
  },
  laraImage: {
    width: "100%",
    height: 380,
  },
  heroBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: C.gold,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  heroBadgeText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  botschaftCard: { margin: 16, backgroundColor: C.roseLight, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border, alignItems: "center" },
  botschaftEmoji: { fontSize: 32, marginBottom: 12 },
  botschaftText: { fontSize: 15, color: C.brown, fontStyle: "italic", lineHeight: 24, textAlign: "center", marginBottom: 10 },
  botschaftAutor: { fontSize: 13, color: C.muted },
  sec: { fontSize: 17, fontWeight: "700", color: C.brown, marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  featureRow: { marginHorizontal: 16, marginBottom: 10, backgroundColor: "#FFFFFF", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: C.border },
  featureEmoji: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.goldLight, alignItems: "center", justifyContent: "center", marginRight: 12 },
  featureInfo: { flex: 1 },
  featureTitel: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 2 },
  featureDesc: { fontSize: 12, color: C.muted },
  testimonialCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: C.goldLight, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E8D5B0" },
  testimonialText: { fontSize: 14, color: C.brown, fontStyle: "italic", lineHeight: 21, marginBottom: 8 },
  testimonialName: { fontSize: 12, color: C.muted },
  preisCard: { margin: 16, backgroundColor: C.roseLight, borderRadius: 24, padding: 24, alignItems: "center", borderWidth: 1, borderColor: C.border },
  preisTitle: { fontSize: 16, color: C.brown, marginBottom: 8, fontWeight: "700" },
  preis: { fontSize: 52, fontWeight: "700", color: C.rose, lineHeight: 60 },
  preisUnit: { fontSize: 14, color: C.muted, marginBottom: 20 },
  preisFeatures: { width: "100%", marginBottom: 20 },
  preisFeatureRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cta: { backgroundColor: C.rose, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 32, marginBottom: 10 },
  ctaText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
  ctaHint: { fontSize: 12, color: C.muted },
  faqCard: { marginHorizontal: 16, backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  faqItem: { padding: 16 },
  faqFrage: { fontSize: 14, fontWeight: "700", color: C.brown, marginBottom: 4 },
  faqAntwort: { fontSize: 13, color: C.muted, lineHeight: 19 },
});
