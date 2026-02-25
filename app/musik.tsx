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

const SPOTIFY_ARTIST = "https://open.spotify.com/artist/3iJelwHVMnw2cNtIY3CrFo?si=XmEG8x-rQGy3XL9c7gIDXg";

interface Song {
  id: string;
  titel: string;
  beschreibung: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  emoji: string;
  kategorie: "musik" | "meditation" | "ritual" | "mantra";
  verfuegbar: boolean;
}

// Musik von der Seelenplanerin – Meditationen kommen noch
const DEFAULT_SONGS: Song[] = [
  {
    id: "s1",
    titel: "Seelenklänge",
    beschreibung: "Musik von der Seelenplanerin",
    spotifyUrl: SPOTIFY_ARTIST,
    emoji: "🎶",
    kategorie: "musik",
    verfuegbar: true,
  },
  {
    id: "s2",
    titel: "Ritual-Musik",
    beschreibung: "Atmosphärische Klänge für deine Rituale",
    spotifyUrl: SPOTIFY_ARTIST,
    emoji: "🔥",
    kategorie: "ritual",
    verfuegbar: true,
  },
  {
    id: "s3",
    titel: "Runen-Mantra",
    beschreibung: "Kraftvolle Mantras für die Runenarbeit",
    spotifyUrl: SPOTIFY_ARTIST,
    emoji: "ᛋ",
    kategorie: "mantra",
    verfuegbar: true,
  },
  {
    id: "s4",
    titel: "Mondmeditation",
    beschreibung: "Geführte Meditation für Neumond-Rituale",
    emoji: "🌙",
    kategorie: "meditation",
    verfuegbar: false,
  },
  {
    id: "s5",
    titel: "Chakra Balance",
    beschreibung: "Klangschalen für die Chakra-Harmonisierung",
    emoji: "🧘‍♀️",
    kategorie: "meditation",
    verfuegbar: false,
  },
  {
    id: "s6",
    titel: "Schutzrune Meditation",
    beschreibung: "Geführte Meditation mit deiner Schutzrune",
    emoji: "🛡️",
    kategorie: "meditation",
    verfuegbar: false,
  },
];

const KAT_LABELS: Record<string, string> = {
  alle: "Alle",
  musik: "Musik",
  ritual: "Ritual",
  mantra: "Mantra",
  meditation: "Meditation",
};

export default function MusikScreen() {
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [filter, setFilter] = useState("alle");
  const [refreshing, setRefreshing] = useState(false);

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
    if (!song.verfuegbar) return;
    if (song.spotifyUrl) Linking.openURL(song.spotifyUrl);
    else if (song.appleMusicUrl) Linking.openURL(song.appleMusicUrl);
    else if (song.youtubeUrl) Linking.openURL(song.youtubeUrl);
    else Linking.openURL(SPOTIFY_ARTIST);
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Musik & Meditation</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.rose} />}
        >
          {/* ── Spotify Artist Banner ── */}
          <TouchableOpacity
            style={s.spotifyBanner}
            onPress={() => Linking.openURL(SPOTIFY_ARTIST)}
            activeOpacity={0.85}
          >
            <View style={s.spotifyIcon}>
              <Text style={{ fontSize: 32 }}>🎧</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.spotifyTitle}>Die Seelenplanerin</Text>
              <Text style={s.spotifySubtitle}>Auf Spotify anhören</Text>
              <Text style={s.spotifyDesc}>Musik von Lara – Die Seelenplanerin</Text>
            </View>
            <View style={s.spotifyBadge}>
              <Text style={s.spotifyBadgeText}>Öffnen</Text>
            </View>
          </TouchableOpacity>

          {/* ── Info-Hinweis ── */}
          <View style={s.infoCard}>
            <Text style={s.infoEmoji}>🎵</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.infoTitle}>Musik von der Seelenplanerin</Text>
              <Text style={s.infoText}>
                Die Musik ist von Lara und auf Spotify verfügbar. Geführte Meditationen und weitere Inhalte werden nach und nach ergänzt.
              </Text>
            </View>
          </View>

          {/* ── Streaming-Plattformen ── */}
          <Text style={s.sectionTitle}>Überall hören</Text>
          <View style={s.platformsRow}>
            <TouchableOpacity
              style={[s.platformCard, { backgroundColor: "#191414" }]}
              onPress={() => Linking.openURL(SPOTIFY_ARTIST)}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 24, marginBottom: 6 }}>🟢</Text>
              <Text style={s.platformName}>Spotify</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.platformCard, { backgroundColor: "#FC3C44" }]}
              onPress={() => Linking.openURL("https://music.apple.com/")}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 24, marginBottom: 6 }}>🎵</Text>
              <Text style={s.platformName}>Apple Music</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.platformCard, { backgroundColor: "#FF0000" }]}
              onPress={() => Linking.openURL("https://www.youtube.com/")}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 24, marginBottom: 6 }}>▶️</Text>
              <Text style={s.platformName}>YouTube</Text>
            </TouchableOpacity>
          </View>

          {/* ── Kategorie-Filter ── */}
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

          {/* ── Song-Liste ── */}
          {filtered.map(song => (
            <TouchableOpacity
              key={song.id}
              style={[s.songCard, !song.verfuegbar && s.songCardDisabled]}
              onPress={() => openSong(song)}
              activeOpacity={song.verfuegbar ? 0.85 : 1}
            >
              <View style={[s.songEmoji, !song.verfuegbar && s.songEmojiDisabled]}>
                <Text style={{ fontSize: 24 }}>{song.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={[s.songTitel, !song.verfuegbar && s.songTitelDisabled]}>{song.titel}</Text>
                  {!song.verfuegbar && (
                    <View style={s.comingSoonBadge}>
                      <Text style={s.comingSoonText}>Bald verfügbar</Text>
                    </View>
                  )}
                </View>
                <Text style={s.songBeschreibung}>{song.beschreibung}</Text>
              </View>
              {song.verfuegbar ? (
                <Text style={{ fontSize: 16, color: C.rose, fontWeight: "600" }}>▶</Text>
              ) : (
                <Text style={{ fontSize: 14, color: C.muted }}>🔒</Text>
              )}
            </TouchableOpacity>
          ))}

          {/* Admin-Hinweis */}
          <View style={s.adminHint}>
            <Text style={{ fontSize: 14, marginBottom: 6 }}>💡</Text>
            <Text style={{ fontSize: 12, color: C.muted, lineHeight: 18 }}>
              Neue Songs und Meditationen können über den Admin-Bereich hinzugefügt werden.{"\n"}
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
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: C.roseLight,
    alignItems: "center", justifyContent: "center",
  },
  backIcon: { fontSize: 20, color: C.rose },
  headerTitle: { fontSize: 18, fontWeight: "700", color: C.brown, letterSpacing: 1 },

  // Info-Card
  infoCard: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: C.goldLight, borderRadius: 16, padding: 16,
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    borderWidth: 1, borderColor: "#E8D5B0",
  },
  infoEmoji: { fontSize: 24, marginTop: 2 },
  infoTitle: { fontSize: 14, fontWeight: "700", color: C.brown, marginBottom: 4 },
  infoText: { fontSize: 13, color: C.brownMid, lineHeight: 19 },

  // Spotify Banner
  spotifyBanner: {
    marginHorizontal: 16, marginTop: 8, marginBottom: 16,
    backgroundColor: "#191414", borderRadius: 20, padding: 20,
    flexDirection: "row", alignItems: "center",
  },
  spotifyIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: "#1DB954",
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  spotifyTitle: {
    fontSize: 17, fontWeight: "700", color: "#FFF", marginBottom: 2,
  },
  spotifySubtitle: {
    fontSize: 13, color: "#1DB954", fontWeight: "600", marginBottom: 2,
  },
  spotifyDesc: {
    fontSize: 11, color: "rgba(255,255,255,0.6)",
  },
  spotifyBadge: {
    backgroundColor: "#1DB954", borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  spotifyBadgeText: {
    color: "#FFF", fontSize: 13, fontWeight: "700",
  },

  // Plattformen
  sectionTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown,
    marginHorizontal: 16, marginBottom: 12,
  },
  platformsRow: {
    flexDirection: "row", gap: 10, paddingHorizontal: 16, marginBottom: 8,
  },
  platformCard: {
    flex: 1, borderRadius: 16, padding: 14, alignItems: "center",
  },
  platformName: {
    fontSize: 12, fontWeight: "700", color: "#FFF",
  },

  // Filter
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
  },
  filterBtnActive: { backgroundColor: C.rose, borderColor: C.rose },
  filterText: { fontSize: 13, color: C.muted, fontWeight: "600" },
  filterTextActive: { color: "#FFF" },

  // Songs
  songCard: {
    flexDirection: "row", alignItems: "center", marginHorizontal: 16,
    marginBottom: 10, backgroundColor: C.card, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.border,
  },
  songCardDisabled: {
    opacity: 0.6,
  },
  songEmoji: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: C.roseLight,
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  songEmojiDisabled: {
    backgroundColor: C.surface,
  },
  songTitel: { fontSize: 15, fontWeight: "700", color: C.brown },
  songTitelDisabled: { color: C.muted },
  songBeschreibung: { fontSize: 12, color: C.muted, marginTop: 2 },

  // Coming Soon
  comingSoonBadge: {
    backgroundColor: C.goldLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.gold,
  },

  // Admin
  adminHint: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: C.goldLight,
    borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "flex-start",
    borderWidth: 1, borderColor: "#E8D5B0",
  },
});
