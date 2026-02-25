import React, { useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  loadJournalEntries, deleteJournalEntry, type JournalEntry,
} from "@/lib/journal-store";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function JournalScreen() {
  const colors = useColors();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadJournalEntries().then(setEntries);
    }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert("Eintrag löschen", "Möchtest du diesen Eintrag wirklich löschen?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen", style: "destructive",
        onPress: async () => {
          await deleteJournalEntry(id);
          setEntries(prev => prev.filter(e => e.id !== id));
        },
      },
    ]);
  };

  const s = StyleSheet.create({
    header: {
      paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20,
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    },
    headerTitle: { fontSize: 26, fontWeight: "700", color: "#3D2B1F" },
    headerSub: { fontSize: 14, color: "#9C7B6E", marginTop: 2, fontStyle: "italic" },
    newBtn: {
      backgroundColor: "#C4826A", borderRadius: 16,
      paddingHorizontal: 18, paddingVertical: 10,
      flexDirection: "row", alignItems: "center", gap: 6,
    },
    newBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
    emptyEmoji: { fontSize: 60, marginBottom: 16 },
    emptyTitle: { fontSize: 20, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 8 },
    emptyText: { fontSize: 15, color: colors.muted, textAlign: "center", lineHeight: 22 },
    emptyBtn: {
      marginTop: 24, backgroundColor: colors.primary, borderRadius: 16,
      paddingHorizontal: 24, paddingVertical: 12,
    },
    emptyBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    list: { paddingHorizontal: 20, paddingBottom: 100 },
    card: {
      backgroundColor: "#FFF0EB", borderRadius: 24,
      borderWidth: 1, borderColor: "#EDD9D0",
      padding: 18, marginBottom: 12,
      shadowColor: "#C4826A", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8,
      elevation: 2,
    },
    cardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 },
    cardMood: { fontSize: 28 },
    cardDate: { fontSize: 12, color: colors.muted },
    cardTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground, flex: 1, marginHorizontal: 10 },
    cardPreview: { fontSize: 14, color: colors.muted, lineHeight: 20, marginTop: 4 },
    cardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 },
    cardTag: {
      backgroundColor: colors.primary + "15", borderRadius: 8,
      paddingHorizontal: 8, paddingVertical: 3, marginRight: 6,
    },
    cardTagText: { fontSize: 11, color: colors.primary, fontWeight: "600" },
    deleteBtn: { padding: 4 },
    deleteBtnText: { fontSize: 13, color: colors.error },
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const handleNew = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/journal/write" as any);
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>📖 Mein Journal</Text>
          <Text style={s.headerSub}>{entries.length} {entries.length === 1 ? "Eintrag" : "Einträge"}</Text>
        </View>
        <TouchableOpacity style={s.newBtn} onPress={handleNew} activeOpacity={0.8}>
          <Text style={{ color: "#fff", fontSize: 18 }}>+</Text>
          <Text style={s.newBtnText}>Neu</Text>
        </TouchableOpacity>
      </View>

      {entries.length === 0 ? (
        <View style={s.emptyContainer}>
          <Text style={s.emptyEmoji}>🌸</Text>
          <Text style={s.emptyTitle}>Dein persönlicher Seelenraum</Text>
          <Text style={s.emptyText}>
            Hier kannst du deine Gedanken, Gefühle und Erkenntnisse festhalten – ganz für dich allein.
          </Text>
          <TouchableOpacity style={s.emptyBtn} onPress={handleNew}>
            <Text style={s.emptyBtnText}>Ersten Eintrag schreiben ✨</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.card}
              onPress={() => router.push(`/journal/write?id=${item.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={s.cardTop}>
                <Text style={s.cardMood}>{item.mood}</Text>
                <Text style={s.cardTitle} numberOfLines={1}>{item.title || "Kein Titel"}</Text>
                <Text style={s.cardDate}>{formatDate(item.date)}</Text>
              </View>
              <Text style={s.cardPreview} numberOfLines={3}>{item.text}</Text>
              <View style={s.cardBottom}>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {item.tags.slice(0, 3).map(tag => (
                    <View key={tag} style={s.cardTag}>
                      <Text style={s.cardTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={s.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Text style={s.deleteBtnText}>Löschen</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenContainer>
  );
}
