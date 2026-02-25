import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
};

const LARAS_NACHRICHTEN = [
  {
    id: "1",
    datum: "Heute",
    text: "Heute Morgen beim Räuchern hatte ich das Gefühl, dass viele von euch gerade in einer Phase des Loslassens sind. Wenn du das liest: Du darfst. Du musst nicht festhalten was dir nicht mehr dient. 🌿",
    emoji: "🌿",
  },
  {
    id: "2",
    datum: "Gestern",
    text: "Vollmond-Energie! Ich habe heute Nacht alle meine Kristalle ins Mondlicht gelegt und eine lange Meditation gemacht. Was habt ihr beim Vollmond gespürt? 🌕",
    emoji: "🌕",
  },
  {
    id: "3",
    datum: "Vor 3 Tagen",
    text: "Neue Runen-Armbänder sind fertig! Ich habe jeden Charm einzeln graviert und mit Heilsteinpulver befüllt. Jedes Stück trägt meine Energie und Liebe. 💫",
    emoji: "💫",
  },
  {
    id: "4",
    datum: "Letzte Woche",
    text: "Danke für eure wunderschönen Nachrichten nach dem letzten Soul Talk. Ihr seid so mutig und so offen – ich bin jedes Mal tief berührt. Danke dass ihr mir vertraut. 🙏",
    emoji: "🙏",
  },
];

const INSPIRATIONEN = [
  { id: "1", text: "Du bist nicht kaputt. Du bist im Prozess.", autor: "Lara", emoji: "🌸" },
  { id: "2", text: "Deine Wunden sind deine Weisheit.", autor: "Lara", emoji: "✨" },
  { id: "3", text: "Manchmal ist Ruhe die kraftvollste Handlung.", autor: "Lara", emoji: "🌙" },
  { id: "4", text: "Du verdienst Liebe ohne Bedingungen – auch von dir selbst.", autor: "Lara", emoji: "💗" },
  { id: "5", text: "Grenzen setzen ist Selbstliebe in Aktion.", autor: "Lara", emoji: "🛡️" },
  { id: "6", text: "Vertraue dem Timing deines Lebens.", autor: "Lara", emoji: "⏳" },
];

const ANGEBOTE = [
  { id: "soul-talk", titel: "Soul Talk", emoji: "☕", preis: "Kostenlos", beschreibung: "Ein offenes Gespräch mit Lara. Kein Druck, kein Programm – einfach Seele zu Seele.", farbe: C.roseLight, borderFarbe: C.border, url: "https://calendly.com/dieseelenplanerin" },
  { id: "aura", titel: "Aura Reading", emoji: "🔮", preis: "77 €", beschreibung: "Lara liest deine Aura und gibt dir tiefe Einblicke in deine Energiefelder und Blockaden.", farbe: "#EEF0F8", borderFarbe: "#D0D4E8", url: "https://calendly.com/dieseelenplanerin" },
  { id: "deep-talk", titel: "Deep Talk", emoji: "💫", preis: "111 €", beschreibung: "Ein tiefes, transformatives Gespräch für Frauen die bereit sind, sich wirklich zu zeigen.", farbe: C.goldLight, borderFarbe: "#E8D5B0", url: "https://calendly.com/dieseelenplanerin" },
];

export default function CommunityScreen() {
  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ backgroundColor: C.roseLight, padding: 20, paddingTop: 24 }}>
          <Text style={{ fontSize: 26, fontWeight: "700", color: C.brown }}>Community & Lara</Text>
          <Text style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>Verbinde dich mit Lara und der Gemeinschaft</Text>
        </View>

        {/* Laras Nachrichten */}
        <Text style={s.sec}>💌 Nachrichten von Lara</Text>
        {LARAS_NACHRICHTEN.map(n => (
          <View key={n.id} style={s.nachrichtCard}>
            <View style={s.nachrichtHeader}>
              <Text style={s.nachrichtEmoji}>{n.emoji}</Text>
              <View style={s.nachrichtMeta}>
                <Text style={s.nachrichtName}>Lara · Die Seelenplanerin</Text>
                <Text style={s.nachrichtDatum}>{n.datum}</Text>
              </View>
            </View>
            <Text style={s.nachrichtText}>{n.text}</Text>
          </View>
        ))}

        {/* Instagram */}
        <TouchableOpacity
          style={s.instaCard}
          onPress={() => Linking.openURL("https://www.instagram.com/die.seelenplanerin/")}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 28, marginRight: 14 }}>📸</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 3 }}>Folge mir auf Instagram</Text>
            <Text style={{ fontSize: 13, color: C.muted }}>@die.seelenplanerin · Tägliche Impulse & Einblicke</Text>
          </View>
          <Text style={{ fontSize: 20, color: C.rose }}>→</Text>
        </TouchableOpacity>

        {/* Inspirationen */}
        <Text style={s.sec}>✨ Impulse von Lara</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}>
          {INSPIRATIONEN.map(i => (
            <View key={i.id} style={s.inspirCard}>
              <Text style={{ fontSize: 24, marginBottom: 10 }}>{i.emoji}</Text>
              <Text style={{ fontSize: 14, color: C.brown, fontStyle: "italic", lineHeight: 21, flex: 1 }}>"{i.text}"</Text>
              <Text style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>— {i.autor}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Buchungsangebote */}
        <Text style={s.sec}>📅 Persönliche Sitzungen mit Lara</Text>
        {ANGEBOTE.map(a => (
          <TouchableOpacity
            key={a.id}
            style={[s.angebotCard, { backgroundColor: a.farbe, borderColor: a.borderFarbe }]}
            onPress={() => Linking.openURL(a.url)}
            activeOpacity={0.85}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Text style={{ fontSize: 28, marginRight: 12 }}>{a.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 17, fontWeight: "700", color: C.brown }}>{a.titel}</Text>
                <Text style={{ fontSize: 14, color: C.rose, fontWeight: "700" }}>{a.preis}</Text>
              </View>
              <Text style={{ fontSize: 18, color: C.muted }}>→</Text>
            </View>
            <Text style={{ fontSize: 13, color: C.brownMid, lineHeight: 19 }}>{a.beschreibung}</Text>
          </TouchableOpacity>
        ))}

        {/* Seelenimpuls Premium */}
        <View style={s.premiumCard}>
          <Text style={{ fontSize: 28, marginBottom: 8 }}>👑</Text>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFF", marginBottom: 8 }}>Seelenimpuls</Text>
          <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 21, marginBottom: 14 }}>
            Exklusive Meditationen, tiefe Rituale und persönliche Impulse von Lara – nur für Mitglieder.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: C.gold, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 }}
            onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com")}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "700" }}>17 € / Monat · Jetzt starten</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  sec: { fontSize: 17, fontWeight: "700", color: C.brown, marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  nachrichtCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: C.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border },
  nachrichtHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  nachrichtEmoji: { fontSize: 28, marginRight: 12 },
  nachrichtMeta: { flex: 1 },
  nachrichtName: { fontSize: 13, fontWeight: "700", color: C.brown },
  nachrichtDatum: { fontSize: 12, color: C.muted },
  nachrichtText: { fontSize: 14, color: C.brownMid, lineHeight: 21 },
  instaCard: { marginHorizontal: 16, marginBottom: 4, backgroundColor: "#FFF0F5", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#F0C0C8", flexDirection: "row", alignItems: "center" },
  inspirCard: { width: 200, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, justifyContent: "space-between" },
  angebotCard: { marginHorizontal: 16, marginBottom: 10, borderRadius: 18, padding: 16, borderWidth: 1 },
  premiumCard: { marginHorizontal: 16, marginTop: 8, marginBottom: 8, backgroundColor: C.brown, borderRadius: 20, padding: 20, alignItems: "center" },
});
