import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  loadJournalEntries, saveJournalEntry, createNewEntry,
  MOOD_OPTIONS, type JournalEntry, type Mood,
} from "@/lib/journal-store";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";

const JOURNAL_PROMPTS = [
  "Was bewegt dich heute?",
  "Wofür bist du dankbar?",
  "Was hat deine Seele heute gebraucht?",
  "Welche Erkenntnis trägst du heute in dir?",
  "Was möchtest du loslassen?",
  "Was blüht gerade in dir auf?",
  "Welche Botschaft hat dein Herz für dich?",
];

export default function JournalWriteScreen() {
  useKeepAwake();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [entry, setEntry] = useState<JournalEntry>(createNewEntry());
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const prompt = JOURNAL_PROMPTS[new Date().getDate() % JOURNAL_PROMPTS.length];

  useEffect(() => {
    if (id) {
      loadJournalEntries().then(entries => {
        const found = entries.find(e => e.id === id);
        if (found) setEntry(found);
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!entry.text.trim()) {
      Alert.alert("Hinweis", "Bitte schreibe etwas in dein Journal.");
      return;
    }
    setIsSaving(true);
    try {
      await saveJournalEntry(entry);
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Alert.alert("Fehler", "Der Eintrag konnte nicht gespeichert werden.");
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !entry.tags.includes(tag)) {
      setEntry(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setEntry(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const s = StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      paddingHorizontal: 20, paddingVertical: 12,
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backBtn: { fontSize: 16, color: "#C4826A", fontWeight: "600" },
    headerTitle: { fontSize: 17, fontWeight: "700", color: "#3D2B1F" },
    saveBtn: {
      backgroundColor: "#C4826A", borderRadius: 12,
      paddingHorizontal: 16, paddingVertical: 8,
    },
    saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    scroll: { flex: 1, padding: 20 },
    dateText: { fontSize: 13, color: colors.muted, marginBottom: 16 },
    promptBox: {
      backgroundColor: "#FFF0EB", borderRadius: 16, padding: 14,
      borderLeftWidth: 3, borderLeftColor: colors.primary, marginBottom: 20,
    },
    promptLabel: { fontSize: 11, color: colors.primary, textTransform: "uppercase", letterSpacing: 1, fontWeight: "700", marginBottom: 4 },
    promptText: { fontSize: 15, color: colors.foreground, fontStyle: "italic", lineHeight: 22 },
    sectionLabel: { fontSize: 13, fontWeight: "700", color: colors.foreground, marginBottom: 10 },
    moodRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
    moodBtn: {
      borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8,
      borderWidth: 1.5, flexDirection: "row", alignItems: "center", gap: 4,
    },
    moodEmoji: { fontSize: 20 },
    moodLabel: { fontSize: 13, fontWeight: "600" },
    titleInput: {
      backgroundColor: "#FFF0EB", borderRadius: 14, borderWidth: 1, borderColor: "#EDD9D0",
      padding: 14, fontSize: 17, fontWeight: "600", color: "#3D2B1F", marginBottom: 14,
    },
    textInput: {
      backgroundColor: "#FFF0EB", borderRadius: 14, borderWidth: 1, borderColor: "#EDD9D0",
      padding: 14, fontSize: 16, color: "#3D2B1F", lineHeight: 26,
      minHeight: 200, textAlignVertical: "top", marginBottom: 20,
    },
    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
    tag: {
      backgroundColor: colors.primary + "15", borderRadius: 10,
      paddingHorizontal: 10, paddingVertical: 5, flexDirection: "row", alignItems: "center", gap: 4,
    },
    tagText: { fontSize: 13, color: colors.primary, fontWeight: "600" },
    tagRemove: { fontSize: 14, color: colors.primary },
    tagInputRow: { flexDirection: "row", gap: 8, marginBottom: 30 },
    tagInput: {
      flex: 1, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
      paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: colors.foreground,
    },
    tagAddBtn: {
      backgroundColor: colors.primary + "20", borderRadius: 12,
      paddingHorizontal: 14, paddingVertical: 10, justifyContent: "center",
    },
    tagAddBtnText: { fontSize: 14, color: colors.primary, fontWeight: "700" },
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={s.backBtn}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>📖 Journal</Text>
          <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={isSaving}>
            <Text style={s.saveBtnText}>{isSaving ? "..." : "Speichern"}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={s.dateText}>{formatDate(entry.date)}</Text>

          {/* Tages-Prompt */}
          <View style={s.promptBox}>
            <Text style={s.promptLabel}>✨ Impuls für heute</Text>
            <Text style={s.promptText}>{prompt}</Text>
          </View>

          {/* Stimmung */}
          <Text style={s.sectionLabel}>Wie fühlst du dich?</Text>
          <View style={s.moodRow}>
            {MOOD_OPTIONS.map(m => {
              const isSelected = entry.mood === m.emoji;
              return (
                <TouchableOpacity
                  key={m.emoji}
                  style={[s.moodBtn, {
                    backgroundColor: isSelected ? colors.primary + "20" : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }]}
                  onPress={() => setEntry(prev => ({ ...prev, mood: m.emoji as Mood }))}
                  activeOpacity={0.7}
                >
                  <Text style={s.moodEmoji}>{m.emoji}</Text>
                  <Text style={[s.moodLabel, { color: isSelected ? colors.primary : colors.muted }]}>{m.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Titel */}
          <TextInput
            style={s.titleInput}
            placeholder="Titel (optional)"
            placeholderTextColor={colors.muted}
            value={entry.title}
            onChangeText={text => setEntry(prev => ({ ...prev, title: text }))}
            returnKeyType="next"
          />

          {/* Freitext */}
          <TextInput
            style={s.textInput}
            placeholder="Schreibe hier alles, was deine Seele bewegt..."
            placeholderTextColor={colors.muted}
            value={entry.text}
            onChangeText={text => setEntry(prev => ({ ...prev, text }))}
            multiline
            textAlignVertical="top"
          />

          {/* Tags */}
          <Text style={s.sectionLabel}>Tags</Text>
          {entry.tags.length > 0 && (
            <View style={s.tagRow}>
              {entry.tags.map(tag => (
                <TouchableOpacity key={tag} style={s.tag} onPress={() => removeTag(tag)}>
                  <Text style={s.tagText}>{tag}</Text>
                  <Text style={s.tagRemove}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={s.tagInputRow}>
            <TextInput
              style={s.tagInput}
              placeholder="Tag hinzufügen (z.B. Dankbarkeit)"
              placeholderTextColor={colors.muted}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
              returnKeyType="done"
            />
            <TouchableOpacity style={s.tagAddBtn} onPress={addTag}>
              <Text style={s.tagAddBtnText}>+ Hinzufügen</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
