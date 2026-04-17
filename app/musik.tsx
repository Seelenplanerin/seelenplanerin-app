import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
};

const SPOTIFY_ARTIST = "https://open.spotify.com/artist/3iJelwHVMnw2cNtIY3CrFo?si=XmEG8x-rQGy3XL9c7gIDXg";

export default function MusikScreen() {
  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={st.header}>
          <TouchableOpacity onPress={() => router.back()} style={st.backBtn} activeOpacity={0.7}>
            <Text style={st.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={st.headerTitle}>Musik</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* ── Spotify Banner ── */}
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

          {/* ── Spotify öffnen Button ── */}
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <TouchableOpacity
              style={st.openSpotifyBtn}
              onPress={() => Linking.openURL(SPOTIFY_ARTIST)}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>🎵</Text>
              <Text style={st.openSpotifyText}>Spotify öffnen</Text>
            </TouchableOpacity>
          </View>

          {/* ── Info ── */}
          <View style={st.infoCard}>
            <Text style={{ fontSize: 28, marginBottom: 12 }}>✨</Text>
            <Text style={st.infoTitle}>Musik für deine Seele</Text>
            <Text style={st.infoText}>
              Höre die Musik von der Seelenplanerin auf Spotify – perfekt für deine Rituale, Meditationen und spirituelle Praxis.
            </Text>
          </View>

          <View style={{ height: 40 }} />
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

  // Spotify Banner
  spotifyBanner: {
    marginHorizontal: 16, marginTop: 8, marginBottom: 20,
    backgroundColor: C.roseLight, borderRadius: 20, padding: 20,
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: C.border,
  },
  spotifyIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: "#D4E8D0",
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  spotifyTitle: { fontSize: 17, fontWeight: "700", color: C.brown, marginBottom: 2 },
  spotifySubtitle: { fontSize: 13, color: C.rose, fontWeight: "600", marginBottom: 2 },
  spotifyDesc: { fontSize: 11, color: C.muted },
  spotifyBadge: { backgroundColor: C.rose, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 },
  spotifyBadgeText: { color: "#FFF", fontSize: 13, fontWeight: "700" },

  // Spotify öffnen Button
  openSpotifyBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: C.rose, borderRadius: 16, paddingVertical: 16,
    shadowColor: C.rose, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  openSpotifyText: { fontSize: 16, fontWeight: "700", color: "#FFF" },

  // Info
  infoCard: {
    marginHorizontal: 16, backgroundColor: C.goldLight, borderRadius: 20,
    padding: 24, alignItems: "center", borderWidth: 1, borderColor: "#E8D5B0",
  },
  infoTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 8, textAlign: "center" },
  infoText: { fontSize: 14, color: C.brownMid, lineHeight: 22, textAlign: "center" },
});
