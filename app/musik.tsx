import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
  RefreshControl, Platform, ActivityIndicator,
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
  mp3Url?: string;
  mp3FileName?: string;
  emoji: string;
  kategorie: "musik" | "meditation" | "ritual" | "mantra";
  verfuegbar: boolean;
}

const DEFAULT_SONGS: Song[] = [
  {
    id: "s1", titel: "Seelenklänge", beschreibung: "Musik von der Seelenplanerin",
    spotifyUrl: SPOTIFY_ARTIST, emoji: "🎶", kategorie: "musik", verfuegbar: true,
  },
  {
    id: "s2", titel: "Ritual-Musik", beschreibung: "Atmosphärische Klänge für deine Rituale",
    spotifyUrl: SPOTIFY_ARTIST, emoji: "🔥", kategorie: "ritual", verfuegbar: true,
  },
  {
    id: "s3", titel: "Runen-Mantra", beschreibung: "Kraftvolle Mantras für die Runenarbeit",
    spotifyUrl: SPOTIFY_ARTIST, emoji: "ᛋ", kategorie: "mantra", verfuegbar: true,
  },
];

const KAT_LABELS: Record<string, string> = {
  alle: "Alle", musik: "Musik", ritual: "Ritual", mantra: "Mantra",
};

const formatTime = (secs: number) => {
  if (!secs || !isFinite(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

// ─── Audio Player Hook (works on both web and native) ───
function useAudioManager() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setLoading(false);
    setError(null);
  }, []);

  const play = useCallback((url: string) => {
    // If same URL, toggle play/pause
    if (currentUrl === url && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((e) => setError("Wiedergabe fehlgeschlagen: " + e.message));
      }
      return;
    }

    // New URL – cleanup old and start new
    cleanup();
    setCurrentUrl(url);
    setLoading(true);
    setError(null);

    if (Platform.OS === "web") {
      const audio = new Audio();
      audioRef.current = audio;

      // Set crossOrigin for CORS
      audio.crossOrigin = "anonymous";

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        setLoading(false);
      });

      audio.addEventListener("canplaythrough", () => {
        setLoading(false);
      });

      audio.addEventListener("error", () => {
        const errCode = audio.error?.code;
        const errMsg = audio.error?.message || "Unbekannter Fehler";
        setError(`Audio-Fehler (${errCode}): ${errMsg}`);
        setLoading(false);
        setIsPlaying(false);
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      // Start polling for time updates (more reliable than timeupdate event)
      intervalRef.current = setInterval(() => {
        if (audio && !audio.paused) {
          setCurrentTime(audio.currentTime);
          if (audio.duration) setDuration(audio.duration);
        }
      }, 250);

      audio.src = url;
      audio.load();

      // Small delay to let browser start loading
      setTimeout(() => {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setLoading(false);
          })
          .catch((e) => {
            setError("Wiedergabe konnte nicht gestartet werden. Tippe erneut.");
            setLoading(false);
          });
      }, 300);
    }
  }, [currentUrl, isPlaying, cleanup]);

  const stop = useCallback(() => {
    cleanup();
    setCurrentUrl(null);
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    play, stop, isPlaying, currentTime, duration, loading, error, currentUrl,
    progress: duration > 0 ? currentTime / duration : 0,
  };
}

export default function MusikScreen() {
  const [songs, setSongs] = useState<Song[]>(DEFAULT_SONGS);
  const [filter, setFilter] = useState("alle");
  const [refreshing, setRefreshing] = useState(false);
  const audio = useAudioManager();

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

  // Stop audio when leaving screen
  useFocusEffect(
    useCallback(() => {
      return () => audio.stop();
    }, [])
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
      audio.play(song.mp3Url);
      return;
    }
    // Otherwise open streaming link
    if (song.spotifyUrl) Linking.openURL(song.spotifyUrl);
    else if (song.appleMusicUrl) Linking.openURL(song.appleMusicUrl);
    else if (song.youtubeUrl) Linking.openURL(song.youtubeUrl);
    else Linking.openURL(SPOTIFY_ARTIST);
  };

  const playingSongId = songs.find(s => s.mp3Url === audio.currentUrl)?.id;

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={st.header}>
          <TouchableOpacity onPress={() => { audio.stop(); router.back(); }} style={st.backBtn} activeOpacity={0.7}>
            <Text style={st.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={st.headerTitle}>Musik & Meditation</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.rose} />}
        >
          {/* ── Spotify Artist Banner ── */}
          <TouchableOpacity
            style={st.spotifyBanner}
            onPress={() => Linking.openURL(SPOTIFY_ARTIST)}
            activeOpacity={0.85}
          >
            <View style={st.spotifyIcon}>
              <Text style={{ fontSize: 32 }}>🎧</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={st.spotifyTitle}>Die Seelenplanerin</Text>
              <Text style={st.spotifySubtitle}>Auf Spotify anhören</Text>
              <Text style={st.spotifyDesc}>Musik von der Seelenplanerin</Text>
            </View>
            <View style={st.spotifyBadge}>
              <Text style={st.spotifyBadgeText}>Öffnen</Text>
            </View>
          </TouchableOpacity>

          {/* ── Now Playing Bar ── */}
          {audio.currentUrl && (
            <View style={st.nowPlayingBar}>
              <View style={st.nowPlayingHeader}>
                <Text style={{ fontSize: 16 }}>
                  {audio.isPlaying ? "🔊" : "⏸"}
                </Text>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={st.nowPlayingTitle} numberOfLines={1}>
                    {songs.find(s => s.mp3Url === audio.currentUrl)?.titel || "Wiedergabe"}
                  </Text>
                  <Text style={st.nowPlayingArtist}>Die Seelenplanerin</Text>
                </View>
                {audio.loading && <ActivityIndicator size="small" color={C.rose} />}
                <TouchableOpacity
                  onPress={() => audio.currentUrl && audio.play(audio.currentUrl)}
                  style={st.nowPlayingPlayBtn}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700" }}>
                    {audio.isPlaying ? "⏸" : "▶"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => audio.stop()}
                  style={st.nowPlayingStopBtn}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: C.muted, fontSize: 14, fontWeight: "700" }}>✕</Text>
                </TouchableOpacity>
              </View>
              {/* Progress Bar */}
              <View style={st.progressBarBg}>
                <View style={[st.progressBarFill, { width: `${audio.progress * 100}%` }]} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4 }}>
                <Text style={st.timeText}>{formatTime(audio.currentTime)}</Text>
                <Text style={st.timeText}>{formatTime(audio.duration)}</Text>
              </View>
              {audio.error && (
                <Text style={{ fontSize: 11, color: "#C87C82", marginTop: 4 }}>{audio.error}</Text>
              )}
            </View>
          )}

          {/* ── Info-Hinweis ── */}
          <View style={st.infoCard}>
            <Text style={st.infoEmoji}>🎵</Text>
            <View style={{ flex: 1 }}>
              <Text style={st.infoTitle}>Musik von der Seelenplanerin</Text>
              <Text style={st.infoText}>
                Songs mit 🎧 können direkt in der App abgespielt werden. Tippe auf einen Song zum Starten. Geführte Meditationen werden nach und nach ergänzt.
              </Text>
            </View>
          </View>

          {/* ── Streaming-Plattformen ── */}
          <Text style={st.sectionTitle}>Überall hören</Text>
          <View style={st.platformsRow}>
            <TouchableOpacity
              style={[st.platformCard, { backgroundColor: "#191414" }]}
              onPress={() => Linking.openURL(SPOTIFY_ARTIST)}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 24, marginBottom: 6 }}>🟢</Text>
              <Text style={st.platformName}>Spotify</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[st.platformCard, { backgroundColor: "#FC3C44" }]}
              onPress={() => Linking.openURL("https://music.apple.com/")}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 24, marginBottom: 6 }}>🎵</Text>
              <Text style={st.platformName}>Apple Music</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[st.platformCard, { backgroundColor: "#FF0000" }]}
              onPress={() => Linking.openURL("https://www.youtube.com/")}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 24, marginBottom: 6 }}>▶️</Text>
              <Text style={st.platformName}>YouTube</Text>
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
                style={[st.filterBtn, filter === key && st.filterBtnActive]}
                onPress={() => setFilter(key)}
                activeOpacity={0.8}
              >
                <Text style={[st.filterText, filter === key && st.filterTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── Song-Liste ── */}
          {filtered.map(song => {
            const isCurrentlyPlaying = playingSongId === song.id;
            return (
              <TouchableOpacity
                key={song.id}
                style={[
                  st.songCard,
                  !song.verfuegbar && st.songCardDisabled,
                  isCurrentlyPlaying && st.songCardPlaying,
                ]}
                onPress={() => openSong(song)}
                activeOpacity={song.verfuegbar ? 0.85 : 1}
              >
                <View style={[
                  st.songEmoji,
                  !song.verfuegbar && st.songEmojiDisabled,
                  isCurrentlyPlaying && st.songEmojiPlaying,
                ]}>
                  <Text style={{ fontSize: 24 }}>
                    {isCurrentlyPlaying && audio.isPlaying ? "🔊" : song.emoji}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <Text style={[
                      st.songTitel,
                      !song.verfuegbar && st.songTitelDisabled,
                      isCurrentlyPlaying && { color: "#FFF" },
                    ]}>
                      {song.titel}
                    </Text>
                    {song.mp3Url && (
                      <View style={[st.mp3Badge, isCurrentlyPlaying && { backgroundColor: "rgba(255,255,255,0.3)" }]}>
                        <Text style={[st.mp3BadgeText, isCurrentlyPlaying && { color: "#FFF" }]}>🎧 In-App</Text>
                      </View>
                    )}
                    {!song.verfuegbar && (
                      <View style={st.comingSoonBadge}>
                        <Text style={st.comingSoonText}>Bald verfügbar</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[st.songBeschreibung, isCurrentlyPlaying && { color: "rgba(255,255,255,0.7)" }]}>
                    {song.beschreibung}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                    {song.spotifyUrl && <Text style={{ fontSize: 10, color: isCurrentlyPlaying ? "rgba(255,255,255,0.7)" : "#1DB954", fontWeight: "600" }}>● Spotify</Text>}
                    {song.appleMusicUrl && <Text style={{ fontSize: 10, color: isCurrentlyPlaying ? "rgba(255,255,255,0.7)" : "#FC3C44", fontWeight: "600" }}>● Apple</Text>}
                    {song.youtubeUrl && <Text style={{ fontSize: 10, color: isCurrentlyPlaying ? "rgba(255,255,255,0.7)" : "#FF0000", fontWeight: "600" }}>● YouTube</Text>}
                  </View>
                </View>
                {song.verfuegbar ? (
                  <View style={[st.playIcon, isCurrentlyPlaying && { backgroundColor: "rgba(255,255,255,0.3)" }]}>
                    <Text style={{ fontSize: 14, color: isCurrentlyPlaying ? "#FFF" : C.rose, fontWeight: "700" }}>
                      {isCurrentlyPlaying && audio.isPlaying ? "⏸" : "▶"}
                    </Text>
                  </View>
                ) : (
                  <Text style={{ fontSize: 14, color: C.muted }}>🔒</Text>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Bald verfügbar Hinweis */}
          <View style={st.comingSoonCard}>
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

const st = StyleSheet.create({
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

  // Now Playing Bar
  nowPlayingBar: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: C.card, borderRadius: 16, padding: 14,
    borderWidth: 2, borderColor: C.rose,
    shadowColor: C.rose, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  nowPlayingHeader: {
    flexDirection: "row", alignItems: "center", marginBottom: 8,
  },
  nowPlayingTitle: {
    fontSize: 14, fontWeight: "700", color: C.brown,
  },
  nowPlayingArtist: {
    fontSize: 11, color: C.muted, marginTop: 1,
  },
  nowPlayingPlayBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: C.rose,
    alignItems: "center", justifyContent: "center", marginLeft: 8,
  },
  nowPlayingStopBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: C.surface,
    alignItems: "center", justifyContent: "center", marginLeft: 6,
  },
  progressBarBg: {
    height: 4, backgroundColor: C.border, borderRadius: 2, overflow: "hidden",
  },
  progressBarFill: {
    height: 4, backgroundColor: C.rose, borderRadius: 2,
  },
  timeText: {
    fontSize: 10, color: C.muted, marginTop: 4,
  },

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
  spotifyTitle: { fontSize: 17, fontWeight: "700", color: "#FFF", marginBottom: 2 },
  spotifySubtitle: { fontSize: 13, color: "#1DB954", fontWeight: "600", marginBottom: 2 },
  spotifyDesc: { fontSize: 11, color: "rgba(255,255,255,0.6)" },
  spotifyBadge: { backgroundColor: "#1DB954", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 },
  spotifyBadgeText: { color: "#FFF", fontSize: 13, fontWeight: "700" },

  // Plattformen
  sectionTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginHorizontal: 16, marginBottom: 12 },
  platformsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginBottom: 8 },
  platformCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: "center" },
  platformName: { fontSize: 12, fontWeight: "700", color: "#FFF" },

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
  songCardDisabled: { opacity: 0.6 },
  songCardPlaying: { backgroundColor: C.rose, borderColor: C.rose },
  songEmoji: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: C.roseLight,
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  songEmojiDisabled: { backgroundColor: C.surface },
  songEmojiPlaying: { backgroundColor: "rgba(255,255,255,0.3)" },
  songTitel: { fontSize: 15, fontWeight: "700", color: C.brown },
  songTitelDisabled: { color: C.muted },
  songBeschreibung: { fontSize: 12, color: C.muted, marginTop: 2 },

  // Play Icon
  playIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: C.roseLight,
    alignItems: "center", justifyContent: "center",
  },

  // MP3 Badge
  mp3Badge: { backgroundColor: C.roseLight, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  mp3BadgeText: { fontSize: 10, fontWeight: "700", color: C.rose },

  // Coming Soon
  comingSoonBadge: { backgroundColor: C.goldLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  comingSoonText: { fontSize: 10, fontWeight: "700", color: C.gold },
  comingSoonCard: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 24, alignItems: "center",
    borderWidth: 1, borderColor: "#E8D5B0",
  },
});
