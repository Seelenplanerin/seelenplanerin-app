
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, TextInput,
  Alert, Platform,
} from "react-native";
import { useState, useRef, useCallback } from "react";
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
    stimmung: "🌸",
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
          const journalData = await AsyncStorage.getItem("seelenplanerin_journal");
          if (journalData) {
            const entries = JSON.parse(journalData);
            setJournalCount(Array.isArray(entries) ? entries.length : 0);
          }
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
  const greeting = getGreeting();

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Guten Morgen";
    if (h < 18) return "Schönen Nachmittag";
    return "Guten Abend";
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>

        {/* Persönlicher Header mit warmem Gradient-Effekt */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <View style={s.avatarCircle}>
              <Text style={s.avatarEmoji}>{profile.stimmung}</Text>
            </View>
            <View style={s.headerInfo}>
              <Text style={s.headerGreeting}>{greeting},</Text>
              <Text style={s.headerName}>{displayName}</Text>
              <Text style={s.headerSubtext}>Schön, dass du hier bist 🌸</Text>
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
              <Text style={s.statLabel}>Journal-Einträge</Text>
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
                {STIMMUNGEN.map(emoji => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => setEditProfile({ ...editProfile, stimmung: emoji })}
                    style={[
                      styles2.stimmungBtn,
                      editProfile.stimmung === emoji && styles2.stimmungBtnActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontSize: 24 }}>{emoji}</Text>
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

        {/* Intention anzeigen */}
        {!isEditing && profile.intention ? (
          <View style={s.intentionCard}>
            <Text style={s.intentionLabel}>✨ Deine Intention</Text>
            <Text style={s.intentionText}>"{profile.intention}"</Text>
          </View>
        ) : null}

        {/* Lieblingszitat anzeigen */}
        {!isEditing && profile.lieblingszitat ? (
          <View style={s.zitatCard}>
            <Text style={s.zitatLabel}>💫 Dein Lieblingszitat</Text>
            <Text style={s.zitatText}>"{profile.lieblingszitat}"</Text>
          </View>
        ) : null}

        {/* Mein Seelenraum – persönliche Features */}
        <Text style={s.sec}>Mein Seelenraum</Text>
        <View style={s.gridContainer}>
          <View style={s.gridRow}>
            <TouchableOpacity style={s.gridCard} onPress={() => router.push("/(tabs)/journal" as any)} activeOpacity={0.8}>
              <Text style={s.gridEmoji}>📖</Text>
              <Text style={s.gridLabel}>Mein Journal</Text>
              <Text style={s.gridSub}>{journalCount} Einträge</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.gridCard} onPress={() => router.push("/musik" as any)} activeOpacity={0.8}>
              <Text style={s.gridEmoji}>🎵</Text>
              <Text style={s.gridLabel}>Meine Musik</Text>
              <Text style={s.gridSub}>Klänge für die Seele</Text>
            </TouchableOpacity>
          </View>
          <View style={s.gridRow}>
            <TouchableOpacity style={s.gridCard} onPress={() => router.push("/meditation" as any)} activeOpacity={0.8}>
              <Text style={s.gridEmoji}>🧘‍♀️</Text>
              <Text style={s.gridLabel}>Meditationen</Text>
              <Text style={s.gridSub}>Geführte Reisen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.gridCard} onPress={() => router.push("/aura" as any)} activeOpacity={0.8}>
              <Text style={s.gridEmoji}>🌈</Text>
              <Text style={s.gridLabel}>Aura Reading</Text>
              <Text style={s.gridSub}>Deine Energiefarbe</Text>
            </TouchableOpacity>
          </View>
          <View style={s.gridRow}>
            <TouchableOpacity style={s.gridCard} onPress={() => router.push("/(tabs)/runen" as any)} activeOpacity={0.8}>
              <Text style={s.gridEmoji}>ᚱ</Text>
              <Text style={s.gridLabel}>Runen</Text>
              <Text style={s.gridSub}>Schutzrune & Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.gridCard} onPress={() => router.push("/kerzen-quiz" as any)} activeOpacity={0.8}>
              <Text style={s.gridEmoji}>🕯️</Text>
              <Text style={s.gridLabel}>Kerzen-Quiz</Text>
              <Text style={s.gridSub}>Finde deine Kerze</Text>
            </TouchableOpacity>
          </View>
          <View style={s.gridRow}>
            <TouchableOpacity
              style={[s.gridCard, { borderColor: '#C9A96E', borderWidth: 1.5 }]}
              onPress={() => router.push("/seelenjournal-login" as any)}
              activeOpacity={0.8}
            >
              <Text style={s.gridEmoji}>🔮</Text>
              <Text style={s.gridLabel}>Seelenjournal</Text>
              <Text style={s.gridSub}>Dein persönlicher Raum</Text>
            </TouchableOpacity>
            <View style={[s.gridCard, { opacity: 0 }]} />
          </View>
        </View>

        {/* Mond & Rituale */}
        <Text style={s.sec}>Mond & Rituale</Text>
        <View style={s.menuSection}>
          <TouchableOpacity
            style={[s.menuItem, s.menuItemBorder]}
            onPress={() => router.push("/(tabs)/mond" as any)}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>🌙</Text>
            <View style={s.menuTextWrap}>
              <Text style={s.menuLabel}>Mondphasen-Kalender</Text>
              <Text style={s.menuDesc}>Tagesqualitäten & Tipps</Text>
            </View>
            <Text style={s.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.menuItem, s.menuItemBorder]}
            onPress={() => router.push("/(tabs)/rituale" as any)}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>🕯️</Text>
            <View style={s.menuTextWrap}>
              <Text style={s.menuLabel}>Rituale-Kalender</Text>
              <Text style={s.menuDesc}>51 Rituale für 2026</Text>
            </View>
            <Text style={s.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.menuItem}
            onPress={() => router.push("/benachrichtigungen" as any)}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>🔔</Text>
            <View style={s.menuTextWrap}>
              <Text style={s.menuLabel}>Benachrichtigungen</Text>
              <Text style={s.menuDesc}>Erinnerungen für Vollmond, Neumond & Feste</Text>
            </View>
            <Text style={s.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Shop & Buchung */}
        <Text style={s.sec}>Shop & Buchung</Text>
        <View style={s.menuSection}>
          <TouchableOpacity
            style={[s.menuItem, s.menuItemBorder]}
            onPress={() => Linking.openURL("https://dieseelenplanerin.de")}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>✨</Text>
            <View style={s.menuTextWrap}>
              <Text style={s.menuLabel}>Zum Shop</Text>
              <Text style={s.menuDesc}>Ritual-Sets, Kerzen & mehr</Text>
            </View>
            <Text style={s.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.menuItem, s.menuItemBorder]}
            onPress={() => Linking.openURL("https://calendly.com/hallo-seelenplanerin/30min")}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>📅</Text>
            <View style={s.menuTextWrap}>
              <Text style={s.menuLabel}>Termin buchen</Text>
              <Text style={s.menuDesc}>Soul Talk, Aura Reading & mehr</Text>
            </View>
            <Text style={s.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.menuItem, s.menuItemBorder]}
            onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/E6FP1U")}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>👑</Text>
            <View style={s.menuTextWrap}>
              <Text style={s.menuLabel}>Seelenimpuls Premium</Text>
              <Text style={s.menuDesc}>17 € / Monat · Exklusive Inhalte</Text>
            </View>
            <Text style={s.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.menuItem}
            onPress={() => Linking.openURL("https://www.instagram.com/die.seelenplanerin/")}
            activeOpacity={0.8}
          >
            <Text style={s.menuEmoji}>📸</Text>
            <View style={s.menuTextWrap}>
              <Text style={s.menuLabel}>Instagram</Text>
              <Text style={s.menuDesc}>@die.seelenplanerin</Text>
            </View>
            <Text style={s.menuArrow}>›</Text>
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
    width: 64, height: 64, borderRadius: 32, backgroundColor: "#FFF",
    alignItems: "center", justifyContent: "center", marginRight: 14,
    borderWidth: 2, borderColor: C.rose,
  },
  avatarEmoji: { fontSize: 30 },
  headerInfo: { flex: 1 },
  headerGreeting: { fontSize: 14, color: C.muted },
  headerName: { fontSize: 26, fontWeight: "700", color: C.brown, fontFamily: "DancingScript" },
  headerSubtext: { fontSize: 12, color: C.rose, marginTop: 2 },
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
  intentionLabel: { fontSize: 12, fontWeight: "600", color: C.gold, marginBottom: 6 },
  intentionText: { fontSize: 16, color: C.brown, fontStyle: "italic", lineHeight: 24 },

  zitatCard: {
    marginHorizontal: 16, marginTop: 12, backgroundColor: C.roseLight,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  zitatLabel: { fontSize: 12, fontWeight: "600", color: C.rose, marginBottom: 6 },
  zitatText: { fontSize: 14, color: C.brownMid, fontStyle: "italic", lineHeight: 22, textAlign: "center" },

  sec: {
    fontSize: 15, fontWeight: "700", color: C.muted, marginHorizontal: 16,
    marginTop: 24, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8,
  },

  // Grid für Seelenraum
  gridContainer: { marginHorizontal: 16, gap: 10 },
  gridRow: { flexDirection: "row", gap: 10 },
  gridCard: {
    flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: C.border, alignItems: "center",
  },
  gridEmoji: { fontSize: 28, marginBottom: 8 },
  gridLabel: { fontSize: 14, fontWeight: "600", color: C.brown, textAlign: "center" },
  gridSub: { fontSize: 11, color: C.muted, marginTop: 3, textAlign: "center" },

  // Menü-Liste
  menuSection: {
    marginHorizontal: 16, backgroundColor: C.card, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, overflow: "hidden",
  },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  menuEmoji: { fontSize: 20, marginRight: 14, width: 28, textAlign: "center" },
  menuTextWrap: { flex: 1 },
  menuLabel: { fontSize: 15, color: C.brown, fontWeight: "500" },
  menuDesc: { fontSize: 12, color: C.muted, marginTop: 2 },
  menuArrow: { fontSize: 20, color: C.muted },

  aboutCard: {
    marginHorizontal: 16, marginTop: 24, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#E8D5B0",
  },
  aboutTitle: { fontSize: 20, fontWeight: "700", color: C.brown, marginBottom: 8, fontFamily: "DancingScript" },
  aboutText: { fontSize: 13, color: C.brownMid, lineHeight: 20, marginBottom: 8 },
  aboutVersion: { fontSize: 12, color: C.muted },
});
