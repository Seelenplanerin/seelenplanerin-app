import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking,
  TextInput, KeyboardAvoidingView, Platform, Alert, FlatList,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

// ── Song-Interface (gleich wie in musik.tsx) ──
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

// ── Simple Audio Manager for Community ──
function useCommunityAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; audioRef.current = null; }
    setIsPlaying(false); setCurrentTime(0); setDuration(0); setLoading(false);
  }, []);

  const play = useCallback((url: string) => {
    if (currentUrl === url && audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
      else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); }
      return;
    }
    cleanup(); setCurrentUrl(url); setLoading(true);
    if (Platform.OS === "web") {
      const audio = new Audio();
      audioRef.current = audio;
      audio.crossOrigin = "anonymous";
      audio.addEventListener("loadedmetadata", () => { setDuration(audio.duration); setLoading(false); });
      audio.addEventListener("canplaythrough", () => setLoading(false));
      audio.addEventListener("error", () => { setLoading(false); setIsPlaying(false); });
      audio.addEventListener("ended", () => { setIsPlaying(false); setCurrentTime(0); });
      intervalRef.current = setInterval(() => {
        if (audio && !audio.paused) { setCurrentTime(audio.currentTime); if (audio.duration) setDuration(audio.duration); }
      }, 250);
      audio.src = url; audio.load();
      setTimeout(() => { audio.play().then(() => { setIsPlaying(true); setLoading(false); }).catch(() => setLoading(false)); }, 300);
    }
  }, [currentUrl, isPlaying, cleanup]);

  const stop = useCallback(() => { cleanup(); setCurrentUrl(null); }, [cleanup]);

  useEffect(() => { return () => cleanup(); }, [cleanup]);

  return { play, stop, isPlaying, currentTime, duration, loading, currentUrl, progress: duration > 0 ? currentTime / duration : 0 };
}

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
};

interface CommunityPost {
  id: string;
  emoji: string;
  titel: string;
  text: string;
  datum: string;
  von: string;
  istLara: boolean;
}

const DEFAULT_POSTS: CommunityPost[] = [
  {
    id: "default-1", emoji: "🌙", titel: "Willkommen in unserem Seelenraum",
    text: "Ich bin so froh, dass du hier bist. Dieser Raum gehört uns – ein sicherer Ort für alle Frauen, die ihren spirituellen Weg gehen. Hier teilen wir Erfahrungen, unterstützen uns gegenseitig und wachsen gemeinsam.",
    datum: new Date().toISOString(), von: "Die Seelenplanerin", istLara: true,
  },
  {
    id: "default-2", emoji: "✨", titel: "Nächster Community-Call",
    text: "Unser monatlicher Community-Call findet bald statt! Ich freue mich so sehr auf euch. Wir sprechen über die aktuelle Mondenergie, eure Fragen und ich führe euch durch eine kurze Meditation. Alle Seelenimpuls-Mitglieder sind dabei.",
    datum: new Date(Date.now() - 86400000).toISOString(), von: "Die Seelenplanerin", istLara: true,
  },
  {
    id: "default-3", emoji: "🌸", titel: "Meine Erfahrung mit dem Neumond-Ritual",
    text: "Ich habe gestern das Neumond-Ritual gemacht und es war so kraftvoll. Ich habe drei Intentionen gesetzt und konnte wirklich spüren wie die Energie sich verändert hat. Danke für diese wunderschöne Anleitung!",
    datum: new Date(Date.now() - 172800000).toISOString(), von: "Sarah M.", istLara: false,
  },
  {
    id: "default-4", emoji: "💎", titel: "Frage zu Heilsteinen",
    text: "Welchen Heilstein empfehlt ihr für mehr Schutz im Alltag? Ich trage gerade Rosenquarz aber spüre dass ich etwas Stärkeres brauche.",
    datum: new Date(Date.now() - 259200000).toISOString(), von: "Julia K.", istLara: false,
  },
];

const ANGEBOTE = [
  { emoji: "☕", titel: "Soul Talk", preis: "Kostenlos", beschreibung: "30 Min. kostenloses Kennenlerngespräch", url: "https://calendly.com/hallo-seelenplanerin/30min" },
  { emoji: "🔮", titel: "Aura Reading", preis: "77 €", beschreibung: "Tiefes Aura-Reading mit persönlicher Botschaft", url: "https://dieseelenplanerin.tentary.com/p/TuOzYS" },
  { emoji: "💫", titel: "Deep Talk", preis: "111 €", beschreibung: "Intensives 60-Min. Seelengespräch", url: "https://dieseelenplanerin.tentary.com/p/Ciz1am" },
];

const POSTS_KEY = "community_posts";
const USERS_KEY = "community_users";
const CURRENT_USER_KEY = "community_current_user";

const POST_EMOJIS = ["🌸", "🌙", "✨", "💎", "🔮", "🌿", "🦋", "💫", "🕯️", "🌈"];

interface CommunityUser {
  email: string;
  password: string;
  name: string;
  mustChangePassword?: boolean;
}

async function getUsers(): Promise<CommunityUser[]> {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

async function saveUsers(users: CommunityUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function getPosts(): Promise<CommunityPost[]> {
  const data = await AsyncStorage.getItem(POSTS_KEY);
  if (data) {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }
  // Initialisiere mit Default-Posts
  await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
  return DEFAULT_POSTS;
}

async function savePosts(posts: CommunityPost[]) {
  await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function formatDatum(isoString: string): string {
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Heute";
  if (diffDays === 1) return "Gestern";
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  return d.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

// ── Meditationen Sektion Komponente ──
const MEDITATIONEN_VORSCHAU = [
  { id: "m1", emoji: "🌙", titel: "Neumond-Manifestation", dauer: "15 Min.", beschreibung: "Setze kraftvolle Intentionen unter dem Neumond" },
  { id: "m2", emoji: "🌕", titel: "Vollmond-Loslassen", dauer: "20 Min.", beschreibung: "Lass los, was dir nicht mehr dient" },
  { id: "m3", emoji: "🌈", titel: "Chakra-Reinigung", dauer: "25 Min.", beschreibung: "Alle 7 Chakren reinigen und ausbalancieren" },
  { id: "m4", emoji: "🛡️", titel: "Schutzrune Meditation", dauer: "12 Min.", beschreibung: "Verbinde dich mit deiner persönlichen Schutzrune" },
  { id: "m5", emoji: "🌸", titel: "Weibliche Kraft", dauer: "18 Min.", beschreibung: "Aktiviere deine weibliche Urkraft und Intuition" },
  { id: "m6", emoji: "💧", titel: "Mondwasser-Zeremonie", dauer: "10 Min.", beschreibung: "Anleitung zur Herstellung von Mondwasser" },
];

function MeditationenSektion({ audio }: { audio: ReturnType<typeof useCommunityAudio> }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("admin_songs").then((data) => {
      if (data) {
        const allSongs: Song[] = JSON.parse(data);
        const meditationen = allSongs.filter(s => s.kategorie === "meditation" && s.verfuegbar);
        setSongs(meditationen);
      }
    });
  }, []);

  const handlePlay = (song: Song) => {
    if (song.mp3Url) {
      audio.play(song.mp3Url);
      setPlayingSongId(audio.currentUrl === song.mp3Url && audio.isPlaying ? null : song.id);
    } else if (song.spotifyUrl) {
      Linking.openURL(song.spotifyUrl);
    } else if (song.appleMusicUrl) {
      Linking.openURL(song.appleMusicUrl);
    } else if (song.youtubeUrl) {
      Linking.openURL(song.youtubeUrl);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View>
      <Text style={ms.sec}>🧘‍♀️ Meditationen</Text>
      
      {/* Hochgeladene Meditationen mit Player */}
      {songs.length > 0 && (
        <View>
          {songs.map((song) => {
            const isActive = audio.currentUrl === song.mp3Url;
            return (
              <TouchableOpacity
                key={song.id}
                style={[ms.meditCard, isActive && ms.meditCardActive]}
                onPress={() => handlePlay(song)}
                activeOpacity={0.85}
              >
                <View style={ms.meditRow}>
                  <Text style={{ fontSize: 28 }}>{song.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={ms.meditTitel}>{song.titel}</Text>
                    <Text style={ms.meditBeschreibung}>{song.beschreibung}</Text>
                    {song.mp3Url && (
                      <View style={ms.meditBadgeRow}>
                        <View style={ms.mp3Badge}>
                          <Text style={ms.mp3BadgeText}>🎧 In-App</Text>
                        </View>
                      </View>
                    )}
                  </View>
                  <View style={[ms.playBtn, isActive && audio.isPlaying && ms.playBtnActive]}>
                    {audio.loading && isActive ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={ms.playBtnText}>{isActive && audio.isPlaying ? "⏸" : "▶"}</Text>
                    )}
                  </View>
                </View>
                {isActive && (audio.isPlaying || audio.currentTime > 0) && (
                  <View style={ms.progressSection}>
                    <View style={ms.progressBar}>
                      <View style={[ms.progressFill, { width: `${audio.progress * 100}%` }]} />
                    </View>
                    <View style={ms.timeRow}>
                      <Text style={ms.timeText}>{formatTime(audio.currentTime)}</Text>
                      <Text style={ms.timeText}>{formatTime(audio.duration)}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Vorschau-Meditationen (Platzhalter) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}>
        {MEDITATIONEN_VORSCHAU.map((m) => (
          <View key={m.id} style={ms.meditPreviewCard}>
            <Text style={{ fontSize: 28, marginBottom: 8 }}>{m.emoji}</Text>
            <Text style={ms.meditPreviewTitel}>{m.titel}</Text>
            <Text style={ms.meditPreviewDauer}>{m.dauer}</Text>
            <Text style={ms.meditPreviewBeschreibung}>{m.beschreibung}</Text>
            <View style={ms.comingSoonBadge}>
              <Text style={ms.comingSoonText}>Bald verfügbar</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Now Playing Bar */}
      {audio.isPlaying && (
        <View style={ms.nowPlayingBar}>
          <Text style={ms.nowPlayingText}>🎧 Meditation läuft...</Text>
          <TouchableOpacity onPress={audio.stop} activeOpacity={0.7}>
            <Text style={ms.stopText}>■ Stop</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const ms = StyleSheet.create({
  sec: { fontSize: 17, fontWeight: "700", color: "#5C3317", marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  meditCard: {
    marginHorizontal: 16, marginBottom: 10, backgroundColor: "#FFFFFF",
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#EDD9D0",
  },
  meditCardActive: { backgroundColor: "#F9EDE8", borderColor: "#C4826A" },
  meditRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  meditTitel: { fontSize: 15, fontWeight: "700", color: "#5C3317" },
  meditBeschreibung: { fontSize: 12, color: "#A08070", marginTop: 2, lineHeight: 17 },
  meditBadgeRow: { flexDirection: "row", gap: 6, marginTop: 4 },
  mp3Badge: { backgroundColor: "#F9EDE8", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  mp3BadgeText: { fontSize: 10, color: "#C4826A", fontWeight: "700" },
  playBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#C4826A",
    alignItems: "center", justifyContent: "center",
  },
  playBtnActive: { backgroundColor: "#5C3317" },
  playBtnText: { color: "#FFF", fontSize: 16 },
  progressSection: { marginTop: 10 },
  progressBar: { height: 3, backgroundColor: "#EDD9D0", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#C4826A", borderRadius: 2 },
  timeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  timeText: { fontSize: 10, color: "#A08070" },
  meditPreviewCard: {
    width: 160, backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: "#EDD9D0", alignItems: "center",
  },
  meditPreviewTitel: { fontSize: 13, fontWeight: "700", color: "#5C3317", textAlign: "center", marginBottom: 4 },
  meditPreviewDauer: { fontSize: 11, color: "#C9A96E", fontWeight: "600", marginBottom: 4 },
  meditPreviewBeschreibung: { fontSize: 10, color: "#A08070", textAlign: "center", lineHeight: 14, marginBottom: 8 },
  comingSoonBadge: { backgroundColor: "#F5EEE8", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  comingSoonText: { fontSize: 10, color: "#A08070", fontWeight: "600" },
  nowPlayingBar: {
    marginHorizontal: 16, marginTop: 8, marginBottom: 4, backgroundColor: "#F9EDE8",
    borderRadius: 12, padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, borderColor: "#C4826A",
  },
  nowPlayingText: { fontSize: 13, color: "#5C3317", fontWeight: "600" },
  stopText: { fontSize: 13, color: "#C4826A", fontWeight: "700" },
});

export default function CommunityScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [fehler, setFehler] = useState("");
  const [checking, setChecking] = useState(true);
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState<CommunityUser | null>(null);

  // Post-Erstellung
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitel, setNewPostTitel] = useState("");
  const [newPostText, setNewPostText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🌸");

  // Passwort ändern
  const [showChangePw, setShowChangePw] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");

  // Audio für Meditationen
  const audio = useCommunityAudio();

  useEffect(() => {
    AsyncStorage.getItem(CURRENT_USER_KEY).then((data) => {
      if (data) {
        const user = JSON.parse(data) as CommunityUser;
        setIsLoggedIn(true);
        setUserName(user.name || user.email.split("@")[0]);
        setCurrentUser(user);
        // Prüfe ob Passwort geändert werden muss
        if (user.mustChangePassword) {
          setShowChangePw(true);
        }
      }
      setChecking(false);
    });
  }, []);

  // Posts laden bei Focus
  useFocusEffect(
    useCallback(() => {
      getPosts().then(setPosts);
    }, [])
  );

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLogin = async () => {
    if (!email.trim()) { setFehler("Bitte gib deine E-Mail-Adresse ein."); return; }
    if (!validateEmail(email.trim())) { setFehler("Bitte gib eine gültige E-Mail-Adresse ein."); return; }
    if (!password.trim()) { setFehler("Bitte gib dein Passwort ein."); return; }

    const users = await getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      setFehler("Kein Konto mit dieser E-Mail gefunden. Bitte registriere dich zuerst.");
      return;
    }
    if (found.password !== password) {
      setFehler("Falsches Passwort. Bitte versuche es erneut.");
      return;
    }
    setIsLoggedIn(true);
    setUserName(found.name || found.email.split("@")[0]);
    setCurrentUser(found);
    setFehler("");
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    // Prüfe ob temporäres Passwort → Passwort ändern
    if (found.mustChangePassword) {
      setShowChangePw(true);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) { setFehler("Bitte gib deinen Namen ein."); return; }
    if (!email.trim()) { setFehler("Bitte gib deine E-Mail-Adresse ein."); return; }
    if (!validateEmail(email.trim())) { setFehler("Bitte gib eine gültige E-Mail-Adresse ein."); return; }
    if (!password.trim()) { setFehler("Bitte wähle ein Passwort."); return; }
    if (password.length < 4) { setFehler("Das Passwort muss mindestens 4 Zeichen haben."); return; }
    if (password !== passwordConfirm) { setFehler("Die Passwörter stimmen nicht überein."); return; }

    const users = await getUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      setFehler("Diese E-Mail ist bereits registriert. Bitte logge dich ein.");
      return;
    }

    const newUser: CommunityUser = { email: email.trim().toLowerCase(), password, name: name.trim() };
    users.push(newUser);
    await saveUsers(users);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setIsLoggedIn(true);
    setUserName(newUser.name);
    setCurrentUser(newUser);
    setFehler("");
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setName("");
    setUserName("");
    setCurrentUser(null);
    setMode("login");
    setShowNewPost(false);
    setShowChangePw(false);
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  };

  const handleChangePassword = async () => {
    if (!newPw.trim()) { setFehler("Bitte gib ein neues Passwort ein."); return; }
    if (newPw.length < 4) { setFehler("Das Passwort muss mindestens 4 Zeichen haben."); return; }
    if (newPw !== newPwConfirm) { setFehler("Die Passwörter stimmen nicht überein."); return; }

    if (currentUser) {
      const users = await getUsers();
      const idx = users.findIndex(u => u.email === currentUser.email);
      if (idx >= 0) {
        users[idx].password = newPw;
        users[idx].mustChangePassword = false;
        await saveUsers(users);
        const updatedUser = { ...currentUser, password: newPw, mustChangePassword: false };
        setCurrentUser(updatedUser);
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      }
    }
    setShowChangePw(false);
    setNewPw("");
    setNewPwConfirm("");
    setFehler("");
    Alert.alert("Passwort geändert", "Dein neues Passwort wurde gespeichert.");
  };

  const handleCreatePost = async () => {
    if (!newPostTitel.trim()) {
      Alert.alert("Titel fehlt", "Bitte gib deinem Beitrag einen Titel.");
      return;
    }
    if (!newPostText.trim()) {
      Alert.alert("Text fehlt", "Bitte schreibe etwas für deinen Beitrag.");
      return;
    }

    const newPost: CommunityPost = {
      id: `user-${Date.now()}`,
      emoji: selectedEmoji,
      titel: newPostTitel.trim(),
      text: newPostText.trim(),
      datum: new Date().toISOString(),
      von: userName,
      istLara: false,
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    await savePosts(updatedPosts);
    setNewPostTitel("");
    setNewPostText("");
    setSelectedEmoji("🌸");
    setShowNewPost(false);
  };

  if (checking) {
    return <ScreenContainer><View style={{ flex: 1, backgroundColor: C.bg }} /></ScreenContainer>;
  }

  // ── Passwort ändern (nach erstem Login mit temporärem Passwort) ──
  if (isLoggedIn && showChangePw) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: C.bg }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={s.loginContainer} keyboardShouldPersistTaps="handled">
            <Text style={s.loginEmoji}>🔑</Text>
            <Text style={s.loginTitel}>Passwort ändern</Text>
            <Text style={s.loginSub}>
              Bitte wähle ein neues, persönliches Passwort für deinen Community-Zugang.
            </Text>

            <View style={s.loginCard}>
              <Text style={s.loginLabel}>Neues Passwort</Text>
              <TextInput
                style={s.loginInput}
                placeholder="Dein neues Passwort"
                placeholderTextColor={C.muted}
                secureTextEntry
                value={newPw}
                onChangeText={(t) => { setNewPw(t); setFehler(""); }}
                returnKeyType="next"
                autoCapitalize="none"
              />

              <Text style={[s.loginLabel, { marginTop: 4 }]}>Passwort bestätigen</Text>
              <TextInput
                style={s.loginInput}
                placeholder="Passwort wiederholen"
                placeholderTextColor={C.muted}
                secureTextEntry
                value={newPwConfirm}
                onChangeText={(t) => { setNewPwConfirm(t); setFehler(""); }}
                returnKeyType="done"
                onSubmitEditing={handleChangePassword}
                autoCapitalize="none"
              />

              {fehler !== "" && <Text style={s.loginFehler}>{fehler}</Text>}

              <TouchableOpacity style={s.loginBtn} onPress={handleChangePassword} activeOpacity={0.85}>
                <Text style={s.loginBtnText}>Passwort speichern →</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  // ── Login / Registrierung ──
  if (!isLoggedIn) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: C.bg }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView contentContainerStyle={s.loginContainer} keyboardShouldPersistTaps="handled">
            <Text style={s.loginEmoji}>🌸</Text>
            <Text style={s.loginTitel}>Community</Text>
            <Text style={s.loginSub}>
              {mode === "login"
                ? "Melde dich an, um in deinen Seelenraum zu gelangen."
                : "Erstelle dein Konto und werde Teil unserer Community."}
            </Text>

            <View style={s.tabRow}>
              <TouchableOpacity
                style={[s.tab, mode === "login" && s.tabActive]}
                onPress={() => { setMode("login"); setFehler(""); }}
                activeOpacity={0.8}
              >
                <Text style={[s.tabText, mode === "login" && s.tabTextActive]}>Anmelden</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.tab, mode === "register" && s.tabActive]}
                onPress={() => { setMode("register"); setFehler(""); }}
                activeOpacity={0.8}
              >
                <Text style={[s.tabText, mode === "register" && s.tabTextActive]}>Registrieren</Text>
              </TouchableOpacity>
            </View>

            <View style={s.loginCard}>
              {mode === "register" && (
                <>
                  <Text style={s.loginLabel}>Dein Name</Text>
                  <TextInput
                    style={s.loginInput}
                    placeholder="z.B. Sarah"
                    placeholderTextColor={C.muted}
                    value={name}
                    onChangeText={(t) => { setName(t); setFehler(""); }}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </>
              )}

              <Text style={s.loginLabel}>E-Mail-Adresse</Text>
              <TextInput
                style={s.loginInput}
                placeholder="deine@email.de"
                placeholderTextColor={C.muted}
                value={email}
                onChangeText={(t) => { setEmail(t); setFehler(""); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                textContentType="emailAddress"
              />

              <Text style={[s.loginLabel, { marginTop: 4 }]}>Passwort</Text>
              <TextInput
                style={s.loginInput}
                placeholder={mode === "register" ? "Wähle ein Passwort" : "Dein Passwort"}
                placeholderTextColor={C.muted}
                secureTextEntry
                value={password}
                onChangeText={(t) => { setPassword(t); setFehler(""); }}
                returnKeyType={mode === "register" ? "next" : "done"}
                onSubmitEditing={mode === "login" ? handleLogin : undefined}
                autoCapitalize="none"
                textContentType="password"
              />

              {mode === "register" && (
                <>
                  <Text style={[s.loginLabel, { marginTop: 4 }]}>Passwort bestätigen</Text>
                  <TextInput
                    style={s.loginInput}
                    placeholder="Passwort wiederholen"
                    placeholderTextColor={C.muted}
                    secureTextEntry
                    value={passwordConfirm}
                    onChangeText={(t) => { setPasswordConfirm(t); setFehler(""); }}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                    autoCapitalize="none"
                  />
                </>
              )}

              {fehler !== "" && <Text style={s.loginFehler}>{fehler}</Text>}

              <TouchableOpacity
                style={s.loginBtn}
                onPress={mode === "login" ? handleLogin : handleRegister}
                activeOpacity={0.85}
              >
                <Text style={s.loginBtnText}>
                  {mode === "login" ? "Anmelden →" : "Konto erstellen →"}
                </Text>
              </TouchableOpacity>

              {mode === "login" && (
                <TouchableOpacity
                  style={s.forgotBtn}
                  onPress={() => {
                    if (!email.trim()) {
                      setFehler("Bitte gib zuerst deine E-Mail-Adresse ein.");
                      return;
                    }
                    Alert.alert(
                      "Passwort zurücksetzen",
                      `Dein Passwort für ${email.trim()} wird zurückgesetzt. Du kannst dich danach mit dem neuen Passwort anmelden.`,
                      [
                        { text: "Abbrechen", style: "cancel" },
                        { text: "Zurücksetzen", style: "destructive", onPress: async () => {
                          try {
                            const users = await getUsers();
                            const userIdx = users.findIndex(u => u.email.toLowerCase() === email.trim().toLowerCase());
                            if (userIdx === -1) {
                              Alert.alert("Nicht gefunden", "Es gibt kein Konto mit dieser E-Mail-Adresse.");
                              return;
                            }
                            const tempPw = Math.random().toString(36).slice(2, 8);
                            users[userIdx].password = tempPw;
                            users[userIdx].mustChangePassword = true;
                            await saveUsers(users);
                            setFehler("");
                            Alert.alert(
                              "Passwort zurückgesetzt",
                              `Dein neues temporäres Passwort lautet:\n\n${tempPw}\n\nBitte merke es dir und ändere es nach dem Anmelden.\n\nAbsender: Die Seelenplanerin App`,
                            );
                          } catch {
                            Alert.alert("Fehler", "Beim Zurücksetzen ist ein Fehler aufgetreten.");
                          }
                        }},
                      ]
                    );
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={s.forgotText}>Passwort vergessen?</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={s.seelenimpulsBtn}
              onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/E6FP1U")}
              activeOpacity={0.85}
            >
              <Text style={s.seelenimpulsBtnText}>👑 Seelenimpuls buchen – exklusive Community-Inhalte</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  // ── Eingeloggt: Community-Feed ──
  return (
    <ScreenContainer containerClassName="bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: C.bg }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={s.header}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View>
                <Text style={s.headerTitle}>Community 🌸</Text>
                <Text style={s.headerSub}>
                  Willkommen, {userName}! Schön, dass du da bist.
                </Text>
              </View>
              <TouchableOpacity onPress={handleLogout} style={s.logoutBtn} activeOpacity={0.8}>
                <Text style={s.logoutText}>Abmelden</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Premium-Inhalte Banner */}
          <TouchableOpacity
            style={s.premiumBanner}
            onPress={() => router.push("/community-premium" as any)}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 22 }}>👑</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.premiumBannerTitle}>Premium Inhalte</Text>
              <Text style={s.premiumBannerSub}>Mondkalender · Meditationen · Mond & Zyklus</Text>
            </View>
            <Text style={{ fontSize: 18, color: C.gold }}>›</Text>
          </TouchableOpacity>

          {/* ── Meditationen Sektion ── */}
          <MeditationenSektion audio={audio} />

          <Text style={s.sec}>📅 Buche Zeit mit der Seelenplanerin</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 4 }}>
            {ANGEBOTE.map((a, i) => (
              <TouchableOpacity key={i} style={s.angebotCard} onPress={() => Linking.openURL(a.url)} activeOpacity={0.85}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>{a.emoji}</Text>
                <Text style={s.angebotTitel}>{a.titel}</Text>
                <Text style={s.angebotBeschreibung}>{a.beschreibung}</Text>
                <Text style={s.angebotPreis}>{a.preis}</Text>
                <View style={s.angebotBtn}><Text style={s.angebotBtnText}>Buchen →</Text></View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── Neuen Beitrag schreiben ── */}
          <View style={s.newPostSection}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={s.sec}>💬 Community-Beiträge</Text>
              <TouchableOpacity
                style={s.newPostToggle}
                onPress={() => setShowNewPost(!showNewPost)}
                activeOpacity={0.8}
              >
                <Text style={s.newPostToggleText}>{showNewPost ? "✕ Schließen" : "✏️ Schreiben"}</Text>
              </TouchableOpacity>
            </View>

            {showNewPost && (
              <View style={s.newPostCard}>
                <Text style={s.newPostLabel}>Wähle ein Emoji für deinen Beitrag</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
                  {POST_EMOJIS.map(e => (
                    <TouchableOpacity
                      key={e}
                      style={[s.emojiBtn, selectedEmoji === e && s.emojiBtnActive]}
                      onPress={() => setSelectedEmoji(e)}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 22 }}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={s.newPostLabel}>Titel</Text>
                <TextInput
                  style={s.newPostInput}
                  placeholder="z.B. Meine Erfahrung mit dem Vollmond-Ritual"
                  placeholderTextColor={C.muted}
                  value={newPostTitel}
                  onChangeText={setNewPostTitel}
                  returnKeyType="next"
                  maxLength={100}
                />

                <Text style={s.newPostLabel}>Dein Beitrag</Text>
                <TextInput
                  style={[s.newPostInput, { height: 100, textAlignVertical: "top" }]}
                  placeholder="Teile deine Erfahrungen, stelle eine Frage oder inspiriere andere..."
                  placeholderTextColor={C.muted}
                  value={newPostText}
                  onChangeText={setNewPostText}
                  multiline
                  maxLength={500}
                />

                <TouchableOpacity style={s.newPostSubmit} onPress={handleCreatePost} activeOpacity={0.85}>
                  <Text style={s.newPostSubmitText}>Beitrag veröffentlichen →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ── Posts ── */}
          {posts.map(post => (
            <View key={post.id} style={[s.postCard, post.istLara && s.postCardLara]}>
              <View style={s.postHeader}>
                <View style={[s.postAvatar, post.istLara && s.postAvatarLara]}>
                  <Text style={{ fontSize: 18 }}>{post.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={s.postVon}>{post.von}</Text>
                    {post.istLara && <View style={s.laraTag}><Text style={s.laraTagText}>Seelenplanerin</Text></View>}
                  </View>
                  <Text style={s.postDatum}>{formatDatum(post.datum)}</Text>
                </View>
              </View>
              <Text style={s.postTitel}>{post.titel}</Text>
              <Text style={s.postText}>{post.text}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={s.instagramCard}
            onPress={() => Linking.openURL("https://www.instagram.com/die.seelenplanerin")}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 28 }}>📸</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.instagramTitel}>Folge mir auf Instagram</Text>
              <Text style={s.instagramHandle}>@die.seelenplanerin</Text>
            </View>
            <Text style={{ fontSize: 20, color: C.muted }}>›</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  loginContainer: { flexGrow: 1, backgroundColor: C.bg, padding: 24, justifyContent: "center", alignItems: "center", minHeight: 600 },
  loginEmoji: { fontSize: 60, marginBottom: 16 },
  loginTitel: { fontSize: 28, fontWeight: "700", color: C.brown, marginBottom: 8 },
  loginSub: { fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 21, marginBottom: 20, maxWidth: 300 },
  tabRow: { flexDirection: "row", marginBottom: 16, backgroundColor: C.surface, borderRadius: 12, padding: 3, width: "100%" },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: C.card, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  tabText: { fontSize: 14, color: C.muted, fontWeight: "600" },
  tabTextActive: { color: C.brown },
  loginCard: { width: "100%", backgroundColor: C.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 16 },
  loginLabel: { fontSize: 13, color: C.brownMid, marginBottom: 6, fontWeight: "600" },
  loginInput: { backgroundColor: C.surface, borderRadius: 12, padding: 14, fontSize: 15, color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 8 },
  loginFehler: { fontSize: 13, color: "#C87C82", marginBottom: 10, textAlign: "center" },
  loginBtn: { backgroundColor: C.rose, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  forgotBtn: { alignItems: "center", marginTop: 12 },
  forgotText: { fontSize: 13, color: C.rose, fontWeight: "600" },
  loginBtnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  seelenimpulsBtn: { backgroundColor: C.goldLight, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, borderWidth: 1, borderColor: "#E8D5B0", width: "100%" },
  seelenimpulsBtnText: { fontSize: 14, color: C.brown, fontWeight: "700", textAlign: "center" },
  header: { backgroundColor: C.roseLight, padding: 20, paddingTop: 24 },
  headerTitle: { fontSize: 26, fontWeight: "700", color: C.brown },
  headerSub: { fontSize: 14, color: C.muted, marginTop: 4 },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border },
  logoutText: { fontSize: 12, color: C.muted },
  sec: { fontSize: 17, fontWeight: "700", color: C.brown, marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  angebotCard: { width: 180, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, alignItems: "center" },
  angebotTitel: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 4, textAlign: "center" },
  angebotBeschreibung: { fontSize: 11, color: C.muted, textAlign: "center", lineHeight: 16, marginBottom: 8 },
  angebotPreis: { fontSize: 16, fontWeight: "700", color: C.rose, marginBottom: 10 },
  angebotBtn: { backgroundColor: C.rose, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  angebotBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  postCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  postCardLara: { backgroundColor: C.roseLight, borderColor: C.rose },
  postHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.goldLight, alignItems: "center", justifyContent: "center" },
  postAvatarLara: { backgroundColor: C.rose },
  postVon: { fontSize: 14, fontWeight: "700", color: C.brown },
  laraTag: { backgroundColor: C.gold, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  laraTagText: { fontSize: 10, color: "#FFF", fontWeight: "700" },
  postDatum: { fontSize: 11, color: C.muted },
  postTitel: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 6 },
  postText: { fontSize: 13, color: C.brownMid, lineHeight: 20 },
  instagramCard: { marginHorizontal: 16, marginTop: 8, backgroundColor: C.card, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: C.border },
  instagramTitel: { fontSize: 14, fontWeight: "700", color: C.brown },
  instagramHandle: { fontSize: 13, color: C.rose },
  premiumBanner: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center",
    gap: 12, borderWidth: 1, borderColor: "#E8D5B0",
  },
  premiumBannerTitle: { fontSize: 15, fontWeight: "700", color: C.brown },
  premiumBannerSub: { fontSize: 12, color: C.muted },

  // Neuer Beitrag
  newPostSection: { marginTop: 4 },
  newPostToggle: {
    backgroundColor: C.rose, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8,
    marginRight: 16,
  },
  newPostToggleText: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  newPostCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.rose,
  },
  newPostLabel: { fontSize: 13, color: C.brownMid, fontWeight: "600", marginBottom: 6, marginTop: 4 },
  newPostInput: {
    backgroundColor: C.surface, borderRadius: 12, padding: 14, fontSize: 14,
    color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 8,
  },
  emojiBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface,
    alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: C.border,
  },
  emojiBtnActive: { borderColor: C.rose, backgroundColor: C.roseLight },
  newPostSubmit: {
    backgroundColor: C.rose, borderRadius: 14, paddingVertical: 14,
    alignItems: "center", marginTop: 8,
  },
  newPostSubmitText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
});
