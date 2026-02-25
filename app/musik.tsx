import React, { useState, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
  TextInput, RefreshControl,
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

interface Song {
  id: string;
  titel: string;
  beschreibung: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  emoji: string;
  kategorie: "meditation" | "ritual" | "entspannung" | "mantra";
}

// Standard-Songs die Lara über Admin hinzufügen/ändern kann
const DEFAULT_SONGS: Song[] = [
  {
    id: "s1",
    titel: "Mondmeditation",
    beschreibung: "Geführte Meditation für Neumond-Rituale",
    spotifyUrl: "",
    appleMusicUrl: "",
    emoji: "🌙",
    kategorie: "meditation",
  },
  {
    id: "s2",
    titel: "Chakra Balance",
    beschreibung: "Klangschalen für die Chakra-Harmonisierung",
    spotifyUrl: "",
    appleMusicUrl: "",
    emoji: "🎵",
    kategorie: "entspannung",
  },
  {
    id: "s3",
    titel: "Runen-Mantra",
    beschreibung: "Kraftvolle Mantras für die Runenarbeit",
    spotifyUrl: "",
    appleMusicUrl: "",
    emoji: "ᚱ",
    kategorie: "mantra",
  },
  {
    id: "s4",
    titel: "Ritual-Musik",
    beschreibung: "Atmosphärische Klänge für deine Rituale",
    spotifyUrl: "",
    appleMusicUrl: "",
    emoji: "🔥",
    kategorie: "ritual",
  },
];

const KAT_LABELS: Record<string, string> = {
  alle: "Alle",
  meditation: "Meditation",
  ritual: "Ritual",
  entspannung: "Entspannung",
  mantra: "Mantra",
};

export default function MusikScreen() {
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [filter, setFilter] = useState("alle");
  const [refreshing, setRefreshing] = useState(false);

  // Songs aus AsyncStorage laden (Admin kann neue hinzufügen)
  const loadSongs = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("lara_songs");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSongs(parsed);
        }
      }
    } catch {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSongs();
    }, [loadSongs])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSongs();
    setRefreshing(false);
  };

  const filtered = filter === "alle" ? songs : songs.filter(s => s.kategorie === filter);

  const openSong = (song: Song) => {
    if (song.spotifyUrl) {
      Linking.openURL(song.spotifyUrl);
    } else if (song.appleMusicUrl) {
      Linking.openURL(song.appleMusicUrl);
    } else if (song.youtubeUrl) {
      Linking.openURL(song.youtubeUrl);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Meine Musik</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Spotify/Apple Music Banner */}
        <TouchableOpacity
          style={s.spotifyBanner}
          onPress={() => Linking.openURL("https://open.spotify.com/")}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 28, marginRight: 12 }}>🎧</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#FFF" }}>Laras Musik auf Spotify</Text>
            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Meditationen, Mantras & Ritual-Musik</Text>
          </View>
          <Text style={{ color: "#1DB954", fontSize: 14, fontWeight: "700" }}>Öffnen →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.spotifyBanner, { backgroundColor: "#FC3C44" }]}
          onPress={() => Linking.openURL("https://music.apple.com/")}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 28, marginRight: 12 }}>🎵</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#FFF" }}>Laras Musik auf Apple Music</Text>
            <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Auch auf iTunes verfügbar</Text>
          </View>
          <Text style={{ color: "#FFF", fontSize: 14, fontWeight: "700" }}>Öffnen →</Text>
        </TouchableOpacity>

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

        {/* Song-Liste */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.rose} />}
        >
          {filtered.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🎵</Text>
              <Text style={{ fontSize: 16, fontWeight: "600", color: C.brown, marginBottom: 6 }}>Noch keine Songs</Text>
              <Text style={{ fontSize: 13, color: C.muted, textAlign: "center" }}>
                Lara fügt regelmäßig neue Musik hinzu.{"\n"}Ziehe zum Aktualisieren nach unten.
              </Text>
            </View>
          ) : (
            filtered.map(song => (
              <TouchableOpacity
                key={song.id}
                style={s.songCard}
                onPress={() => openSong(song)}
                activeOpacity={0.85}
              >
                <View style={s.songEmoji}>
                  <Text style={{ fontSize: 24 }}>{song.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.songTitel}>{song.titel}</Text>
                  <Text style={s.songBeschreibung}>{song.beschreibung}</Text>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                    {song.spotifyUrl ? (
                      <TouchableOpacity onPress={() => Linking.openURL(song.spotifyUrl!)} activeOpacity={0.7}>
                        <Text style={s.streamBadge}>🟢 Spotify</Text>
                      </TouchableOpacity>
                    ) : null}
                    {song.appleMusicUrl ? (
                      <TouchableOpacity onPress={() => Linking.openURL(song.appleMusicUrl!)} activeOpacity={0.7}>
                        <Text style={[s.streamBadge, { backgroundColor: "#FC3C44" + "20", color: "#FC3C44" }]}>🔴 Apple</Text>
                      </TouchableOpacity>
                    ) : null}
                    {song.youtubeUrl ? (
                      <TouchableOpacity onPress={() => Linking.openURL(song.youtubeUrl!)} activeOpacity={0.7}>
                        <Text style={[s.streamBadge, { backgroundColor: "#FF0000" + "20", color: "#FF0000" }]}>▶️ YouTube</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
                <Text style={{ fontSize: 16, color: C.muted }}>›</Text>
              </TouchableOpacity>
            ))
          )}

          {/* Hinweis für Lara */}
          <View style={s.adminHint}>
            <Text style={{ fontSize: 14, marginBottom: 6 }}>💡</Text>
            <Text style={{ fontSize: 12, color: C.muted, lineHeight: 18 }}>
              Du kannst neue Songs über den Admin-Bereich hinzufügen.{"\n"}
              Gehe zu: Ich → Admin-Bereich → Musik verwalten
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
  spotifyBanner: {
    marginHorizontal: 16, marginTop: 8, backgroundColor: "#191414",
    borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center",
  },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
  },
  filterBtnActive: { backgroundColor: C.rose, borderColor: C.rose },
  filterText: { fontSize: 13, color: C.muted, fontWeight: "600" },
  filterTextActive: { color: "#FFF" },
  songCard: {
    flexDirection: "row", alignItems: "center", marginHorizontal: 16,
    marginBottom: 10, backgroundColor: C.card, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.border,
  },
  songEmoji: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: C.roseLight,
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  songTitel: { fontSize: 15, fontWeight: "700", color: C.brown },
  songBeschreibung: { fontSize: 12, color: C.muted, marginTop: 2 },
  streamBadge: {
    fontSize: 11, fontWeight: "600", color: "#1DB954",
    backgroundColor: "#1DB954" + "20", paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8, overflow: "hidden",
  },
  emptyState: {
    alignItems: "center", justifyContent: "center", paddingTop: 60, paddingHorizontal: 40,
  },
  adminHint: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: C.goldLight,
    borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "flex-start",
    borderWidth: 1, borderColor: "#E8D5B0",
  },
});
