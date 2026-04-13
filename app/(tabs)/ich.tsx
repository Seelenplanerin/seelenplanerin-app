
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, TextInput,
  Alert, Platform,
} from "react-native";
import { useState, useRef, useEffect, useCallback } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
};

const STIMMUNGEN = ["🌸", "🌙", "✨", "🔥", "🌊", "🦋", "🌻", "💫", "🍃", "🌈"];

const QUICK_LINKS = [
  { id: "runen", label: "Runen & Schutzrune", emoji: "\u16B1", route: "/(tabs)/runen" },
  { id: "mond", label: "Mondphasen-Kalender", emoji: "\uD83C\uDF19", route: "/(tabs)/mond" },
  { id: "journal", label: "Mein Journal", emoji: "\uD83D\uDCD6", route: "/(tabs)/journal" },
  { id: "musik", label: "Meine Musik", emoji: "\uD83C\uDFB5", route: "/musik" },
  { id: "meditation", label: "Meditationen", emoji: "\uD83E\uDDD8\u200D\u2640\uFE0F", route: "/meditation" },
  { id: "kerzen-quiz", label: "Kerzen-Quiz", emoji: "\uD83D\uDD6F\uFE0F", route: "/kerzen-quiz" },
  { id: "aura", label: "Aura Reading", emoji: "\uD83C\uDF08", route: "/aura" },
  { id: "seelenjournal", label: "Mein Seelenjournal", emoji: "\uD83D\uDCC4", route: "/seelenjournal-kundin" },
];

interface UserProfile {
  name: string;
  stimmung: string;
  intention: string;
  lieblingszitat: string;
}

const STORAGE_KEY = "seelenplanerin_user_profile";

export default function IchScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    stimmung: "\uD83C\uDF38",
    intention: "",
    lieblingszitat: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfile>(profile);
  const [journalCount, setJournalCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  // Geheimer Admin-Zugang: 5x auf Version tippen
  const [tapCount, setTapCount] = useState(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleVersionTap() {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => setTapCount(0), 2000);
    if (newCount >= 5) {
      setTapCount(0);
      if (tapTimer.current) clearTimeout(tapTimer.current);
      router.push("/admin" as any);
    }
  }

  // Profil laden
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            setProfile(parsed);
            setEditProfile(parsed);
          }
          // Journal-Einträge zählen
          const journalData = await AsyncStorage.getItem("seelenplanerin_journal");
          if (journalData) {
            const entries = JSON.parse(journalData);
            setJournalCount(Array.isArray(entries) ? entries.length : 0);
          }
          // Favoriten zählen
          const favData = await AsyncStorage.getItem("seelenplanerin_favoriten");
          if (favData) {
            const favs = JSON.parse(favData);
            setFavCount(Array.isArray(favs) ? favs.length : 0);
          }
        } catch {}
      })();
    }, [])
  );

  async function saveProfile() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(editProfile));
      setProfile(editProfile);
      setIsEditing(false);
    } catch {
      Alert.alert("Fehler", "Profil konnte nicht gespeichert werden.");
    }
  }

  const displayName = profile.name || "Schöne Seele";

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        {/* Persönlicher Header */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <View style={s.avatarCircle}>
              <Text style={s.avatarEmoji}>{profile.stimmung}</Text>
            </View>
            <View style={s.headerInfo}>
              <Text style={s.headerGreeting}>Hallo,</Text>
              <Text style={s.headerName}>{displayName}</Text>
            </View>
            <TouchableOpacity
              style={s.editBtn}
              onPress={() => {
                setEditProfile(profile);
                setIsEditing(!isEditing);
              }}
              activeOpacity={0.8}
            >
              <Text style={s.editBtnText}>{isEditing ? "✕" : "✏️"}</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={s.statsRow}>
            <TouchableOpacity style={s.statItem} onPress={() => router.push("/(tabs)/journal" as any)} activeOpacity={0.8}>
              <Text style={s.statNumber}>{journalCount}</Text>
              <Text style={s.statLabel}>Journal</Text>
            </TouchableOpacity>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={s.statNumber}>{favCount}</Text>
              <Text style={s.statLabel}>Favoriten</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Text style={s.statNumber}>{profile.stimmung}</Text>
              <Text style={s.statLabel}>Stimmung</Text>
            </View>
          </View>
        </View>

        {/* Profil bearbeiten */}
        {isEditing && (
          <View style={s.editCard}>
            <Text style={s.editTitle}>Dein Profil gestalten</Text>

            <Text style={s.editLabel}>Dein Name</Text>
            <TextInput
              style={s.editInput}
              placeholder="Wie möchtest du genannt werden?"
              placeholderTextColor={C.muted}
              value={editProfile.name}
              onChangeText={(t) => setEditProfile({ ...editProfile, name: t })}
              returnKeyType="next"
            />

            <Text style={s.editLabel}>Deine Stimmung heute</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {STIMMUNGEN.map(s => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setEditProfile({ ...editProfile, stimmung: s })}
                    style={[
                      styles2.stimmungBtn,
                      editProfile.stimmung === s && styles2.stimmungBtnActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 24 }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={s.editLabel}>Deine Intention / Affirmation</Text>
            <TextInput
              style={[s.editInput, { minHeight: 60, textAlignVertical: "top" }]}
              placeholder="z.B. Ich bin genug. Ich vertraue dem Universum."
              placeholderTextColor={C.muted}
              value={editProfile.intention}
              onChangeText={(t) => setEditProfile({ ...editProfile, intention: t })}
              multiline
              returnKeyType="next"
            />

            <Text style={s.editLabel}>Dein Lieblingszitat</Text>
            <TextInput
              style={[s.editInput, { minHeight: 60, textAlignVertical: "top" }]}
              placeholder="Ein Zitat, das dich inspiriert..."
              placeholderTextColor={C.muted}
              value={editProfile.lieblingszitat}
              onChangeText={(t) => setEditProfile({ ...editProfile, lieblingszitat: t })}
              multiline
              returnKeyType="done"
            />

            <TouchableOpacity style={s.saveBtn} onPress={saveProfile} activeOpacity={0.85}>
              <Text style={s.saveBtnText}>Speichern ✨</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Intention anzeigen (wenn gesetzt) */}
        {!isEditing && profile.intention ? (
          <View style={s.intentionCard}>
            <Text style={s.intentionLabel}>Deine Intention</Text>
            <Text style={s.intentionText}>"{profile.intention}"</Text>
          </View>
        ) : null}

        {/* Lieblingszitat anzeigen (wenn gesetzt) */}
        {!isEditing && profile.lieblingszitat ? (
          <View style={s.zitatCard}>
            <Text style={s.zitatText}>"{profile.lieblingszitat}"</Text>
          </View>
        ) : null}

        {/* Schnellzugriff */}
        <Text style={s.sec}>Schnellzugriff</Text>
        <View style={s.menuSection}>
          {QUICK_LINKS.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[s.menuItem, idx < QUICK_LINKS.length - 1 && s.menuItemBorder]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <Text style={s.menuEmoji}>{item.emoji}</Text>
              <Text style={s.menuLabel}>{item.label}</Text>
              <Text style={s.menuArrow}>{"\u203A"}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Externe Links */}
        <Text style={s.sec}>Shop & Buchung</Text>
        <View style={s.menuSection}>
          <TouchableOpacity
            style={[s.menuItem, s.menuItemBorder]}
            onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/qnl3vN")}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>{"\u2728"}</Text>
            <Text style={s.menuLabel}>Zum Shop</Text>
            <Text style={s.menuArrow}>{"\u203A"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.menuItem, s.menuItemBorder]}
            onPress={() => Linking.openURL("https://calendly.com/hallo-seelenplanerin/30min")}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>{"\uD83D\uDCC5"}</Text>
            <Text style={s.menuLabel}>Termin buchen</Text>
            <Text style={s.menuArrow}>{"\u203A"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.menuItem, s.menuItemBorder]}
            onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/E6FP1U")}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>{"\uD83D\uDC51"}</Text>
            <Text style={s.menuLabel}>Seelenimpuls Premium</Text>
            <Text style={s.menuArrow}>{"\u203A"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.menuItem}
            onPress={() => Linking.openURL("https://www.instagram.com/die.seelenplanerin/")}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>{"\uD83D\uDCF8"}</Text>
            <Text style={s.menuLabel}>Instagram</Text>
            <Text style={s.menuArrow}>{"\u203A"}</Text>
          </TouchableOpacity>
        </View>

        {/* Über die App */}
        <View style={s.aboutCard}>
          <Text style={s.aboutTitle}>Über Die Seelenplanerin</Text>
          <Text style={s.aboutText}>
            Diese App ist mit Liebe von der Seelenplanerin für alle Frauen geschaffen, die auf ihrer spirituellen Reise Begleitung suchen.
          </Text>
          <TouchableOpacity onPress={handleVersionTap} activeOpacity={1}>
            <Text style={s.aboutVersion}>Version 1.0 · Made with 🌸 by Die Seelenplanerin</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles2 = StyleSheet.create({
  stimmungBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#FDF8F4",
    alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "transparent",
  },
  stimmungBtnActive: {
    borderColor: C.gold, backgroundColor: C.goldLight,
  },
});

const s = StyleSheet.create({
  header: { backgroundColor: C.roseLight, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
  headerTop: { flexDirection: "row", alignItems: "center" },
  avatarCircle: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: "#FFF",
    alignItems: "center", justifyContent: "center", marginRight: 14,
    borderWidth: 2, borderColor: C.rose,
  },
  avatarEmoji: { fontSize: 30 },
  headerInfo: { flex: 1 },
  headerGreeting: { fontSize: 14, color: C.muted },
  headerName: { fontSize: 22, fontWeight: "700", color: C.brown },
  editBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFF",
    alignItems: "center", justifyContent: "center",
  },
  editBtnText: { fontSize: 18 },
  statsRow: {
    flexDirection: "row", backgroundColor: "#FFF", borderRadius: 16,
    marginTop: 16, padding: 16, alignItems: "center",
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 20, fontWeight: "700", color: C.brown },
  statLabel: { fontSize: 11, color: C.muted, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: C.border },

  editCard: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: C.card,
    borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  editTitle: { fontSize: 18, fontWeight: "700", color: C.brown, marginBottom: 16 },
  editLabel: { fontSize: 13, fontWeight: "600", color: C.muted, marginBottom: 6 },
  editInput: {
    backgroundColor: C.bg, borderRadius: 12, padding: 14, fontSize: 15,
    color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: C.rose, borderRadius: 14, padding: 16, alignItems: "center",
  },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },

  intentionCard: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#E8D5B0",
  },
  intentionLabel: { fontSize: 11, fontWeight: "600", color: C.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  intentionText: { fontSize: 16, color: C.brown, fontStyle: "italic", lineHeight: 24 },

  zitatCard: {
    marginHorizontal: 16, marginTop: 12, backgroundColor: C.roseLight,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  zitatText: { fontSize: 14, color: C.brownMid, fontStyle: "italic", lineHeight: 22, textAlign: "center" },

  sec: {
    fontSize: 15, fontWeight: "700", color: C.muted, marginHorizontal: 16,
    marginTop: 20, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8,
  },
  menuSection: {
    marginHorizontal: 16, backgroundColor: C.card, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, overflow: "hidden",
  },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  menuEmoji: { fontSize: 20, marginRight: 14, width: 28, textAlign: "center" },
  menuLabel: { flex: 1, fontSize: 15, color: C.brown, fontWeight: "500" },
  menuArrow: { fontSize: 20, color: C.muted },

  aboutCard: {
    marginHorizontal: 16, marginTop: 20, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#E8D5B0",
  },
  aboutTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 8 },
  aboutText: { fontSize: 13, color: C.brownMid, lineHeight: 20, marginBottom: 8 },
  aboutVersion: { fontSize: 12, color: C.muted },
});
