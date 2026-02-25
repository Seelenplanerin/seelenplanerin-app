import React, { useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
  RefreshControl,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
};

interface Meditation {
  id: string;
  titel: string;
  dauer: string;
  beschreibung: string;
  emoji: string;
  kategorie: "geführt" | "klangschale" | "atemübung" | "chakra";
  spotifyUrl?: string;
  appleMusicUrl?: string;
}

const DEFAULT_MEDITATIONEN: Meditation[] = [
  {
    id: "m1",
    titel: "Neumond-Meditation",
    dauer: "15 Min",
    beschreibung: "Geführte Meditation für Neumond-Rituale – setze Intentionen und verbinde dich mit der Mondenergie.",
    emoji: "🌑",
    kategorie: "geführt",
  },
  {
    id: "m2",
    titel: "Vollmond-Loslassmeditation",
    dauer: "20 Min",
    beschreibung: "Lass los was dich belastet. Geführte Meditation zum Loslassen unter dem Vollmond.",
    emoji: "🌕",
    kategorie: "geführt",
  },
  {
    id: "m3",
    titel: "Chakra-Harmonisierung",
    dauer: "25 Min",
    beschreibung: "Bringe alle sieben Chakren in Balance mit Klangschalen und Visualisierung.",
    emoji: "🌈",
    kategorie: "chakra",
  },
  {
    id: "m4",
    titel: "Morgen-Atemübung",
    dauer: "10 Min",
    beschreibung: "Starte deinen Tag mit bewusstem Atmen. Energetisierend und zentrierend.",
    emoji: "☀️",
    kategorie: "atemübung",
  },
  {
    id: "m5",
    titel: "Klangschalen-Reise",
    dauer: "30 Min",
    beschreibung: "Tiefe Entspannung durch tibetische Klangschalen. Perfekt vor dem Schlafen.",
    emoji: "🔔",
    kategorie: "klangschale",
  },
  {
    id: "m6",
    titel: "Herzchakra-Öffnung",
    dauer: "15 Min",
    beschreibung: "Öffne dein Herzchakra und empfange bedingungslose Liebe.",
    emoji: "💚",
    kategorie: "chakra",
  },
];

const KAT_LABELS: Record<string, string> = {
  alle: "Alle",
  geführt: "Geführt",
  klangschale: "Klangschale",
  atemübung: "Atemübung",
  chakra: "Chakra",
};

export default function MeditationScreen() {
  const [meditationen, setMeditationen] = useState<Meditation[]>(DEFAULT_MEDITATIONEN);
  const [filter, setFilter] = useState("alle");
  const [refreshing, setRefreshing] = useState(false);

  const loadMeditationen = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("lara_meditationen");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMeditationen(parsed);
        }
      }
    } catch {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMeditationen();
    }, [loadMeditationen])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeditationen();
    setRefreshing(false);
  };

  const filtered = filter === "alle" ? meditationen : meditationen.filter(m => m.kategorie === filter);

  const openMeditation = (m: Meditation) => {
    if (m.spotifyUrl) Linking.openURL(m.spotifyUrl);
    else if (m.appleMusicUrl) Linking.openURL(m.appleMusicUrl);
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Meditationen</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Kategorie-Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 12 }}
        >
          {Object.entries(KAT_LABELS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[s.filterBtn, filter === key && s.filterBtnActive]}
              onPress={() => setFilter(key)}
              activeOpacity={0.8}
            >
              <Text style={[s.filterText, filter === key && s.filterTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Meditationen-Liste */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.rose} />}
        >
          {filtered.map(m => (
            <TouchableOpacity
              key={m.id}
              style={s.meditationCard}
              onPress={() => openMeditation(m)}
              activeOpacity={0.85}
            >
              <View style={s.meditationEmoji}>
                <Text style={{ fontSize: 28 }}>{m.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={s.meditationTitel}>{m.titel}</Text>
                  <Text style={s.meditationDauer}>{m.dauer}</Text>
                </View>
                <Text style={s.meditationBeschreibung}>{m.beschreibung}</Text>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                  {m.spotifyUrl ? (
                    <Text style={s.streamBadge}>🟢 Spotify</Text>
                  ) : null}
                  {m.appleMusicUrl ? (
                    <Text style={[s.streamBadge, { backgroundColor: "#FC3C44" + "20", color: "#FC3C44" }]}>🔴 Apple</Text>
                  ) : null}
                  {!m.spotifyUrl && !m.appleMusicUrl ? (
                    <Text style={[s.streamBadge, { backgroundColor: C.goldLight, color: C.gold }]}>Bald verfügbar</Text>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Hinweis */}
          <View style={s.adminHint}>
            <Text style={{ fontSize: 14, marginBottom: 6 }}>🧘‍♀️</Text>
            <Text style={{ fontSize: 12, color: C.muted, lineHeight: 18 }}>
              Lara fügt regelmäßig neue Meditationen hinzu.{"\n"}
              Über den Admin-Bereich können neue Meditationen mit Spotify- oder Apple Music-Links verknüpft werden.
            </Text>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.roseLight, alignItems: "center", justifyContent: "center" },
  backIcon: { fontSize: 20, color: C.rose },
  headerTitle: { fontSize: 18, fontWeight: "700", color: C.brown, letterSpacing: 2 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
  },
  filterBtnActive: { backgroundColor: C.rose, borderColor: C.rose },
  filterText: { fontSize: 13, color: C.muted, fontWeight: "600" },
  filterTextActive: { color: "#FFF" },
  meditationCard: {
    flexDirection: "row", alignItems: "flex-start", marginHorizontal: 16,
    marginBottom: 12, backgroundColor: C.card, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: C.border,
  },
  meditationEmoji: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: C.roseLight,
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  meditationTitel: { fontSize: 15, fontWeight: "700", color: C.brown, flex: 1 },
  meditationDauer: { fontSize: 12, fontWeight: "600", color: C.rose, backgroundColor: C.roseLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, overflow: "hidden" },
  meditationBeschreibung: { fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 18 },
  streamBadge: {
    fontSize: 11, fontWeight: "600", color: "#1DB954",
    backgroundColor: "#1DB954" + "20", paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8, overflow: "hidden",
  },
  adminHint: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: C.goldLight,
    borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "flex-start",
    borderWidth: 1, borderColor: "#E8D5B0",
  },
});
