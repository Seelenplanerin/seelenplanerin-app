import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, FlatList, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
};

const STIMMUNGEN = [
  { emoji: "🌸", label: "Dankbar", farbe: "#F9EDE8" },
  { emoji: "✨", label: "Inspiriert", farbe: "#FAF3E7" },
  { emoji: "🌙", label: "Nachdenklich", farbe: "#EEF0F8" },
  { emoji: "💪", label: "Stark", farbe: "#E8F5E9" },
  { emoji: "😌", label: "Ruhig", farbe: "#F3E5F5" },
  { emoji: "🌊", label: "Bewegt", farbe: "#E3F2FD" },
  { emoji: "🔥", label: "Leidenschaftlich", farbe: "#FFF3E0" },
  { emoji: "🌿", label: "Geerdet", farbe: "#E8F5E9" },
];

const PROMPTS = [
  "Was hat mich heute bewegt?",
  "Wofür bin ich heute dankbar?",
  "Was möchte ich loslassen?",
  "Was wünsche ich mir für morgen?",
  "Welche Energie begleitet mich gerade?",
  "Was hat meine Seele heute geflüstert?",
  "Welche Erkenntnisse durfte ich heute sammeln?",
  "Was macht mich gerade glücklich?",
  "Welche Grenzen möchte ich setzen?",
  "Was brauche ich gerade am meisten?",
];

interface JournalEintrag {
  id: string;
  datum: string;
  stimmung: string;
  stimmungEmoji: string;
  text: string;
  prompt: string;
}

const STORAGE_KEY = "seelenplanerin_journal";

export default function JournalScreen() {
  const [eintraege, setEintraege] = useState<JournalEintrag[]>([]);
  const [ansicht, setAnsicht] = useState<"liste" | "neu">("liste");
  const [stimmung, setStimmung] = useState<typeof STIMMUNGEN[0] | null>(null);
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState(PROMPTS[0]);

  useEffect(() => {
    ladeEintraege();
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  async function ladeEintraege() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setEintraege(JSON.parse(raw));
    } catch {}
  }

  async function speichereEintrag() {
    if (!text.trim() || !stimmung) {
      Alert.alert("Bitte ausfüllen", "Wähle eine Stimmung und schreibe etwas.");
      return;
    }
    const neuer: JournalEintrag = {
      id: Date.now().toString(),
      datum: new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" }),
      stimmung: stimmung.label,
      stimmungEmoji: stimmung.emoji,
      text: text.trim(),
      prompt,
    };
    const aktualisiert = [neuer, ...eintraege];
    setEintraege(aktualisiert);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(aktualisiert));
    setText("");
    setStimmung(null);
    setAnsicht("liste");
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }

  async function loescheEintrag(id: string) {
    Alert.alert("Eintrag löschen?", "Dieser Eintrag wird unwiderruflich gelöscht.", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen", style: "destructive",
        onPress: async () => {
          const aktualisiert = eintraege.filter(e => e.id !== id);
          setEintraege(aktualisiert);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(aktualisiert));
        },
      },
    ]);
  }

  const renderEintrag = useCallback(({ item }: { item: JournalEintrag }) => (
    <View style={s.eintragCard}>
      <View style={s.eintragHeader}>
        <Text style={s.eintragEmoji}>{item.stimmungEmoji}</Text>
        <View style={s.eintragMeta}>
          <Text style={s.eintragDatum}>{item.datum}</Text>
          <Text style={s.eintragStimmung}>{item.stimmung}</Text>
        </View>
        <TouchableOpacity onPress={() => loescheEintrag(item.id)} style={s.deleteBtn} activeOpacity={0.7}>
          <Text style={s.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
      {item.prompt && <Text style={s.eintragPrompt}>💭 {item.prompt}</Text>}
      <Text style={s.eintragText}>{item.text}</Text>
    </View>
  ), [eintraege]);

  if (ansicht === "neu") {
    return (
      <ScreenContainer containerClassName="bg-background">
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
            <View style={s.neuHeader}>
              <TouchableOpacity onPress={() => setAnsicht("liste")} style={s.backBtn} activeOpacity={0.8}>
                <Text style={s.backBtnText}>← Zurück</Text>
              </TouchableOpacity>
              <Text style={s.neuTitle}>Neuer Eintrag</Text>
            </View>

            {/* Prompt */}
            <View style={s.promptCard}>
              <Text style={s.promptLabel}>💭 Schreibimpuls</Text>
              <Text style={s.promptText}>{prompt}</Text>
              <TouchableOpacity onPress={() => setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])} activeOpacity={0.8}>
                <Text style={s.promptRefresh}>Anderen Impuls →</Text>
              </TouchableOpacity>
            </View>

            {/* Stimmung */}
            <Text style={s.sectionLabel}>Wie fühlst du dich gerade?</Text>
            <View style={s.stimmungGrid}>
              {STIMMUNGEN.map(s2 => (
                <TouchableOpacity
                  key={s2.label}
                  style={[s.stimmungBtn, stimmung?.label === s2.label && { borderColor: C.rose, backgroundColor: s2.farbe }]}
                  onPress={() => setStimmung(s2)}
                  activeOpacity={0.8}
                >
                  <Text style={s.stimmungEmoji}>{s2.emoji}</Text>
                  <Text style={[s.stimmungLabel, stimmung?.label === s2.label && { color: C.rose, fontWeight: "700" }]}>{s2.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Text */}
            <Text style={s.sectionLabel}>Deine Gedanken...</Text>
            <TextInput
              style={s.textArea}
              placeholder="Schreibe was deine Seele bewegt..."
              placeholderTextColor={C.muted}
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />

            <TouchableOpacity style={s.saveBtn} onPress={speichereEintrag} activeOpacity={0.85}>
              <Text style={s.saveBtnText}>✨ Eintrag speichern</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Mein Seelenjournal</Text>
          <Text style={s.headerSub}>Dein persönlicher Raum für Gedanken</Text>
        </View>
        <TouchableOpacity style={s.neuBtn} onPress={() => setAnsicht("neu")} activeOpacity={0.85}>
          <Text style={s.neuBtnText}>+ Neu</Text>
        </TouchableOpacity>
      </View>

      {eintraege.length === 0 ? (
        <View style={s.leer}>
          <Text style={s.leerEmoji}>📖</Text>
          <Text style={s.leerTitle}>Dein Journal wartet auf dich</Text>
          <Text style={s.leerDesc}>Schreibe deinen ersten Eintrag und beginne deine Seelenreise.</Text>
          <TouchableOpacity style={s.leerBtn} onPress={() => setAnsicht("neu")} activeOpacity={0.85}>
            <Text style={s.leerBtnText}>Ersten Eintrag schreiben</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={eintraege}
          keyExtractor={item => item.id}
          renderItem={renderEintrag}
          contentContainerStyle={s.liste}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  header: { backgroundColor: C.roseLight, padding: 20, paddingTop: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "700", color: C.brown },
  headerSub: { fontSize: 13, color: C.muted, marginTop: 3 },
  neuBtn: { backgroundColor: C.rose, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  neuBtnText: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  liste: { padding: 16, gap: 12 },
  eintragCard: { backgroundColor: C.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border },
  eintragHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  eintragEmoji: { fontSize: 28, marginRight: 12 },
  eintragMeta: { flex: 1 },
  eintragDatum: { fontSize: 12, color: C.muted, marginBottom: 2 },
  eintragStimmung: { fontSize: 14, fontWeight: "700", color: C.brown },
  deleteBtn: { padding: 6 },
  deleteBtnText: { fontSize: 14, color: C.muted },
  eintragPrompt: { fontSize: 12, color: C.gold, fontStyle: "italic", marginBottom: 8 },
  eintragText: { fontSize: 14, color: C.brownMid, lineHeight: 21 },
  leer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  leerEmoji: { fontSize: 56, marginBottom: 16 },
  leerTitle: { fontSize: 20, fontWeight: "700", color: C.brown, marginBottom: 8, textAlign: "center" },
  leerDesc: { fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 21, marginBottom: 24 },
  leerBtn: { backgroundColor: C.rose, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 12 },
  leerBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  // Neu-Ansicht
  neuHeader: { backgroundColor: C.roseLight, padding: 20, paddingTop: 24 },
  backBtn: { marginBottom: 8 },
  backBtnText: { fontSize: 14, color: C.rose, fontWeight: "600" },
  neuTitle: { fontSize: 22, fontWeight: "700", color: C.brown },
  promptCard: { margin: 16, backgroundColor: C.goldLight, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E8D5B0" },
  promptLabel: { fontSize: 12, fontWeight: "700", color: C.gold, marginBottom: 6 },
  promptText: { fontSize: 16, color: C.brown, fontStyle: "italic", lineHeight: 24, marginBottom: 8 },
  promptRefresh: { fontSize: 13, color: C.rose, fontWeight: "600" },
  sectionLabel: { fontSize: 15, fontWeight: "700", color: C.brown, marginHorizontal: 16, marginBottom: 10, marginTop: 4 },
  stimmungGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 8, marginBottom: 16 },
  stimmungBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border },
  stimmungEmoji: { fontSize: 18 },
  stimmungLabel: { fontSize: 13, color: C.muted, fontWeight: "600" },
  textArea: { marginHorizontal: 16, backgroundColor: C.card, borderRadius: 16, padding: 16, fontSize: 15, color: C.brown, lineHeight: 23, minHeight: 160, borderWidth: 1, borderColor: C.border, marginBottom: 16 },
  saveBtn: { marginHorizontal: 16, backgroundColor: C.rose, borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
