import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
  RefreshControl, Platform, ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

// Conditional audio import – only on native
let useAudioPlayerHook: any = null;
let useAudioPlayerStatusHook: any = null;
let setAudioModeAsyncFn: any = null;
if (Platform.OS !== "web") {
  try {
    const audioModule = require("expo-audio");
    useAudioPlayerHook = audioModule.useAudioPlayer;
    useAudioPlayerStatusHook = audioModule.useAudioPlayerStatus;
    setAudioModeAsyncFn = audioModule.setAudioModeAsync;
  } catch {}
}

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
  mp3Url?: string;
  mp3FileName?: string;
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
];

const KAT_LABELS: Record<string, string> = {
  alle: "Alle",
  musik: "Musik",
  ritual: "Ritual",
  mantra: "Mantra",
};

// Simple web audio player component
function WebAudioPlayer({ url, songTitle }: { url: string; songTitle: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });
    audio.addEventListener("ended", () => { setIsPlaying(false); setProgress(0); });
    audio.addEventListener("waiting", () => setLoading(true));
    audio.addEventListener("canplay", () => setLoading(false));
    return () => { audio.pause(); audio.src = ""; };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={s.playerContainer}>
      <TouchableOpacity onPress={togglePlay} style={s.playerPlayBtn} activeOpacity={0.8}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "700" }}>
            {isPlaying ? "⏸" : "▶"}
          </Text>
        )}
      </TouchableOpacity>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: C.brown }} numberOfLines={1}>
          {songTitle}
        </Text>
        <View style={s.playerProgressBg}>
          <View style={[s.playerProgressFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={s.playerTime}>{formatTime((audioRef.current?.currentTime || 0))}</Text>
          <Text style={s.playerTime}>{duration > 0 ? formatTime(duration) : "--:--"}</Text>
        </View>
      </View>
    </View>
  );
}

export default function MusikScreen() {
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [filter, setFilter] = useState("alle");
  const [refreshing, setRefreshing] = useState(false);
  const [playingMp3, setPlayingMp3] = useState<Song | null>(null);

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
    // If song has MP3, play in-app
    if (song.mp3Url) {
      setPlayingMp3(playingMp3?.id === song.id ? null : song);
      return;
    }
    // Otherwise open streaming link
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
              <Text style={s.spotifyDesc}>Musik von der Seelenplanerin – Die Seelenplanerin</Text>
            </View>
            <View style={s.spotifyBadge}>
              <Text style={s.spotifyBadgeText}>Öffnen</Text>
            </View>
          </TouchableOpacity>

          {/* ── In-App Player ── */}
          {playingMp3 && playingMp3.mp3Url && Platform.OS === "web" && (
            <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
              <WebAudioPlayer url={playingMp3.mp3Url} songTitle={playingMp3.titel} />
            </View>
          )}

          {/* ── Info-Hinweis ── */}
          <View style={s.infoCard}>
            <Text style={s.infoEmoji}>🎵</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.infoTitle}>Musik von der Seelenplanerin</Text>
              <Text style={s.infoText}>
                Die Musik ist von der Seelenplanerin und auf Spotify verfügbar. Songs mit 🎧 können direkt in der App abgespielt werden. Geführte Meditationen werden nach und nach ergänzt.
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
              style={[
                s.songCard,
                !song.verfuegbar && s.songCardDisabled,
                playingMp3?.id === song.id && s.songCardPlaying,
              ]}
              onPress={() => openSong(song)}
              activeOpacity={song.verfuegbar ? 0.85 : 1}
            >
              <View style={[s.songEmoji, !song.verfuegbar && s.songEmojiDisabled, playingMp3?.id === song.id && s.songEmojiPlaying]}>
                <Text style={{ fontSize: 24 }}>{song.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={[s.songTitel, !song.verfuegbar && s.songTitelDisabled]}>{song.titel}</Text>
                  {song.mp3Url && <View style={s.mp3Badge}><Text style={s.mp3BadgeText}>🎧 In-App</Text></View>}
                  {!song.verfuegbar && (
                    <View style={s.comingSoonBadge}>
                      <Text style={s.comingSoonText}>Bald verfügbar</Text>
                    </View>
                  )}
                </View>
                <Text style={s.songBeschreibung}>{song.beschreibung}</Text>
                {/* Streaming-Links Badges */}
                <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                  {song.spotifyUrl && <Text style={{ fontSize: 10, color: "#1DB954", fontWeight: "600" }}>● Spotify</Text>}
                  {song.appleMusicUrl && <Text style={{ fontSize: 10, color: "#FC3C44", fontWeight: "600" }}>● Apple</Text>}
                  {song.youtubeUrl && <Text style={{ fontSize: 10, color: "#FF0000", fontWeight: "600" }}>● YouTube</Text>}
                </View>
              </View>
              {song.verfuegbar ? (
                <Text style={{ fontSize: 16, color: playingMp3?.id === song.id ? "#FFF" : C.rose, fontWeight: "600" }}>
                  {playingMp3?.id === song.id ? "⏸" : "▶"}
                </Text>
              ) : (
                <Text style={{ fontSize: 14, color: C.muted }}>🔒</Text>
              )}
            </TouchableOpacity>
          ))}

          {/* Bald verfügbar Hinweis */}
          <View style={s.comingSoonCard}>
            <Text style={{ fontSize: 28, marginBottom: 8 }}>🎶</Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 6 }}>Bald mehr Inhalte</Text>
            <Text style={{ fontSize: 13, color: C.muted, lineHeight: 20, textAlign: "center" }}>
              Geführte Meditationen, Klangfrequenzen und weitere Inhalte werden nach und nach ergänzt.
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
  songCardPlaying: {
    backgroundColor: C.rose, borderColor: C.rose,
  },
  songEmoji: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: C.roseLight,
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  songEmojiDisabled: {
    backgroundColor: C.surface,
  },
  songEmojiPlaying: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  songTitel: { fontSize: 15, fontWeight: "700", color: C.brown },
  songTitelDisabled: { color: C.muted },
  songBeschreibung: { fontSize: 12, color: C.muted, marginTop: 2 },

  // MP3 Badge
  mp3Badge: {
    backgroundColor: C.roseLight, borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  mp3BadgeText: {
    fontSize: 10, fontWeight: "700", color: C.rose,
  },

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

  // Coming Soon Card
  comingSoonCard: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 24, alignItems: "center",
    borderWidth: 1, borderColor: "#E8D5B0",
  },

  // Player
  playerContainer: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.card, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.rose,
    shadowColor: C.rose, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 8,
  },
  playerPlayBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: C.rose,
    alignItems: "center", justifyContent: "center",
  },
  playerProgressBg: {
    height: 4, backgroundColor: C.border, borderRadius: 2,
    marginTop: 6, marginBottom: 4, overflow: "hidden",
  },
  playerProgressFill: {
    height: 4, backgroundColor: C.rose, borderRadius: 2,
  },
  playerTime: {
    fontSize: 10, color: C.muted,
  },
});
