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
import { getApiBaseUrl } from "@/constants/oauth";

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
      // No crossOrigin - causes CORS issues on iOS Safari with CDN audio
      audio.addEventListener("loadedmetadata", () => { setDuration(audio.duration); setLoading(false); });
      audio.addEventListener("canplaythrough", () => setLoading(false));
      audio.addEventListener("error", () => { setLoading(false); setIsPlaying(false); });
      audio.addEventListener("ended", () => { setIsPlaying(false); setCurrentTime(0); });
      intervalRef.current = setInterval(() => {
        if (audio && !audio.paused) { setCurrentTime(audio.currentTime); if (audio.duration) setDuration(audio.duration); }
      }, 250);
      audio.src = url;
      // Play immediately within user gesture context (no setTimeout)
      audio.play().then(() => { setIsPlaying(true); setLoading(false); }).catch(() => {
        // Fallback: try after brief delay
        setTimeout(() => { audio.play().then(() => { setIsPlaying(true); setLoading(false); }).catch(() => setLoading(false)); }, 100);
      });
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

interface QAFrage {
  id: string;
  frage: string;
  von: string;
  datum: string;
  antwort?: string;
  antwortDatum?: string;
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

];

const POSTS_KEY = "community_posts";
const USERS_KEY = "community_users";
const CURRENT_USER_KEY = "community_current_user";
const QA_KEY = "community_qa_fragen";

const POST_EMOJIS = ["🌸", "🌙", "✨", "💎", "🔮", "🌿", "🦋", "💫", "🕯️", "🌈"];

interface CommunityUser {
  email: string;
  password: string;
  name: string;
  mustChangePassword?: boolean;
}

async function getUsers(): Promise<CommunityUser[]> {
  // Lade Nutzer vom Server (DB) statt aus AsyncStorage
  try {
    const API_URL = getApiBaseUrl();
    const res = await fetch(`${API_URL}/api/trpc/communityUsers.list`);
    const json = await res.json();
    const dbUsers = json?.result?.data?.json || json?.result?.data || [];
    return dbUsers.map((u: any) => ({
      email: u.email,
      password: u.password,
      name: u.name,
      mustChangePassword: u.mustChangePassword === 1,
    }));
  } catch (e) {
    // Fallback: AsyncStorage
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }
}

async function saveUsers(users: CommunityUser[]) {
  // Backward compatibility: auch in AsyncStorage speichern
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

const DEFAULT_QA: QAFrage[] = [
  {
    id: "qa-default-1",
    frage: "Welcher Heilstein passt am besten zu mir, wenn ich gerade eine schwierige Phase durchmache?",
    von: "Sarah M.",
    datum: new Date(Date.now() - 172800000).toISOString(),
    antwort: "Rosenquarz ist dein treuer Begleiter in schweren Zeiten \u2013 er \u00f6ffnet dein Herz f\u00fcr Selbstliebe und Mitgef\u00fchl. Trage ihn nah am Herzen und sp\u00fcre, wie er dich sanft tr\u00e4gt. Amethyst kann zus\u00e4tzlich helfen, innere Ruhe zu finden. \ud83d\udc9c",
    antwortDatum: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "qa-default-2",
    frage: "Wie oft sollte ich meine Runen reinigen?",
    von: "Julia K.",
    datum: new Date(Date.now() - 345600000).toISOString(),
    antwort: "Ich empfehle, deine Runen bei jedem Vollmond zu reinigen \u2013 lege sie ins Mondlicht oder r\u00e4uchere sie mit wei\u00dfem Salbei. Wenn du sie t\u00e4glich nutzt, kannst du sie auch w\u00f6chentlich kurz unter flie\u00dfendes Wasser halten. H\u00f6re auf deine Intuition! \u2728",
    antwortDatum: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "qa-default-3",
    frage: "Kann ich das Neumond-Ritual auch alleine machen oder brauche ich jemanden daf\u00fcr?",
    von: "Lena B.",
    datum: new Date(Date.now() - 86400000).toISOString(),
  },
];

async function getQAFragen(): Promise<QAFrage[]> {
  const data = await AsyncStorage.getItem(QA_KEY);
  if (data) {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  }
  await AsyncStorage.setItem(QA_KEY, JSON.stringify(DEFAULT_QA));
  return DEFAULT_QA;
}

async function saveQAFragen(fragen: QAFrage[]) {
  await AsyncStorage.setItem(QA_KEY, JSON.stringify(fragen));
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

// Platzhalter-Meditationen entfernt – nur echte hochgeladene Meditationen werden angezeigt

interface ServerMeditation {
  id: number;
  title: string;
  description: string | null;
  emoji: string | null;
  audioUrl: string;
  isPremium: number;
  isActive: number;
  createdAt: string;
}

function MeditationenSektion({ audio }: { audio: ReturnType<typeof useCommunityAudio> }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [loadingMeditations, setLoadingMeditations] = useState(true);

  // Bei jedem Tab-Focus Meditationen vom SERVER laden (sichtbar auf allen Geräten)
  useFocusEffect(
    useCallback(() => {
      setLoadingMeditations(true);
      const API_URL = `${getApiBaseUrl()}/api/trpc`;
      fetch(`${API_URL}/meditations.list`)
        .then(res => res.json())
        .then(data => {
          const result = data?.result?.data?.json || data?.result?.data;
          if (Array.isArray(result) && result.length > 0) {
            const mapped: Song[] = result.map((m: ServerMeditation) => ({
              id: String(m.id),
              titel: m.title,
              beschreibung: m.description || "",
              mp3Url: m.audioUrl,
              emoji: m.emoji || "🧘\u200d\u2640\ufe0f",
              kategorie: "meditation" as const,
              verfuegbar: true,
            }));
            setSongs(mapped);
          } else {
            // Fallback: auch AsyncStorage prüfen (für Migration)
            AsyncStorage.getItem("lara_meditationen").then((localData) => {
              if (localData) {
                try {
                  const allMeditationen: Song[] = JSON.parse(localData);
                  setSongs(allMeditationen.filter(s => s.verfuegbar));
                } catch (e) { /* ignore */ }
              }
            });
          }
        })
        .catch(() => {
          // Fallback auf AsyncStorage bei Netzwerkfehler
          AsyncStorage.getItem("lara_meditationen").then((localData) => {
            if (localData) {
              try {
                const allMeditationen: Song[] = JSON.parse(localData);
                setSongs(allMeditationen.filter(s => s.verfuegbar));
              } catch (e) { /* ignore */ }
            }
          });
        })
        .finally(() => setLoadingMeditations(false));
    }, [])
  );

  const handlePlay = (song: Song) => {
    if (song.mp3Url) {
      // Proxy the audio through our server to avoid CORS issues on iOS Safari
      const proxyUrl = `${getApiBaseUrl()}/api/audio-proxy?url=${encodeURIComponent(song.mp3Url)}`;
      audio.play(proxyUrl);
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

      {/* Loading-Indicator */}
      {loadingMeditations && songs.length === 0 && (
        <View style={{ marginHorizontal: 16, marginBottom: 12, alignItems: "center", padding: 20 }}>
          <ActivityIndicator size="small" color="#C4956A" />
          <Text style={{ fontSize: 13, color: "#A08070", marginTop: 8 }}>Meditationen werden geladen...</Text>
        </View>
      )}

      {/* Hinweis wenn keine Meditationen vorhanden */}
      {!loadingMeditations && songs.length === 0 && (
        <View style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: "#F9EDE8", borderRadius: 12, padding: 14, alignItems: "center" }}>
          <Text style={{ fontSize: 13, color: "#A08070", textAlign: "center", lineHeight: 18 }}>
            Meditationen werden nach und nach hinzugefügt. Schau bald wieder vorbei!
          </Text>
        </View>
      )}

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

  // Q&A – Frage an die Seelenplanerin
  const [qaFragen, setQaFragen] = useState<QAFrage[]>([]);
  const [showNewFrage, setShowNewFrage] = useState(false);
  const [newFrage, setNewFrage] = useState("");
  const [frageGesendet, setFrageGesendet] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Passwort ändern
  const [resetSent, setResetSent] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");

  // Audio für Meditationen
  const audio = useCommunityAudio();

  // Admin-Erkennung (hallo@seelenplanerin.de = Admin)
  const isAdmin = currentUser?.email?.toLowerCase() === "hallo@seelenplanerin.de";

  const handleDeletePost = async (postId: string) => {
    Alert.alert(
      "Beitrag löschen",
      "Möchtest du diesen Beitrag wirklich löschen?",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            const updatedPosts = posts.filter(p => p.id !== postId);
            setPosts(updatedPosts);
            await savePosts(updatedPosts);
          },
        },
      ]
    );
  };

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

  // Posts und Q&A laden bei Focus
  useFocusEffect(
    useCallback(() => {
      getPosts().then(setPosts);
      getQAFragen().then(setQaFragen);
    }, [])
  );

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLogin = async () => {
    if (!email.trim()) { setFehler("Bitte gib deine E-Mail-Adresse ein."); return; }
    if (!validateEmail(email.trim())) { setFehler("Bitte gib eine gültige E-Mail-Adresse ein."); return; }
    if (!password.trim()) { setFehler("Bitte gib dein Passwort ein."); return; }

    try {
      const API_URL = getApiBaseUrl();
      // Direkt die Server-Login-Route nutzen (prüft Passwort in der DB)
      const res = await fetch(`${API_URL}/api/trpc/communityUsers.login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { email: email.trim().toLowerCase(), password: password } }),
      });
      const data = await res.json();
      const result = data?.result?.data?.json || data?.result?.data;

      if (result?.error === "not_found") {
        setFehler("Kein Konto mit dieser E-Mail gefunden. Dein Zugang wird von der Seelenplanerin angelegt.");
        return;
      }
      if (result?.error === "wrong_password") {
        setFehler("Falsches Passwort. Bitte versuche es erneut.");
        return;
      }
      if (result?.success && result.user) {
        const found: CommunityUser = {
          email: result.user.email,
          password: password,
          name: result.user.name,
          mustChangePassword: result.user.mustChangePassword === true,
        };
        setIsLoggedIn(true);
        setUserName(found.name || found.email.split("@")[0]);
        setCurrentUser(found);
        setFehler("");
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
        if (found.mustChangePassword) {
          setShowChangePw(true);
        }
      } else {
        setFehler("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
      }
    } catch (e: any) {
      console.error('Login error:', e?.message || e);
      // Fallback: versuche mit gecachten Daten
      try {
        const cached = await AsyncStorage.getItem(USERS_KEY);
        const users: CommunityUser[] = cached ? JSON.parse(cached) : [];
        const emailLower = email.trim().toLowerCase();
        const found = users.find(u => u.email.toLowerCase() === emailLower);
        if (!found) { setFehler("Verbindungsfehler und kein lokaler Cache vorhanden."); return; }
        if (found.password !== password) { setFehler("Falsches Passwort."); return; }
        setIsLoggedIn(true);
        setUserName(found.name || found.email.split("@")[0]);
        setCurrentUser(found);
        setFehler("");
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
        if (found.mustChangePassword) setShowChangePw(true);
      } catch {
        setFehler("Verbindungsfehler. Bitte versuche es erneut.");
      }
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
      // Passwort in DB aktualisieren
      try {
        const API_URL = getApiBaseUrl();
        await fetch(`${API_URL}/api/trpc/communityUsers.update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ json: { email: currentUser.email, password: newPw, mustChangePassword: 0 } }),
        });
      } catch (e) {
        // Fallback: AsyncStorage
        const users = await getUsers();
        const idx = users.findIndex(u => u.email === currentUser.email);
        if (idx >= 0) { users[idx].password = newPw; users[idx].mustChangePassword = false; await saveUsers(users); }
      }
      const updatedUser = { ...currentUser, password: newPw, mustChangePassword: false };
      setCurrentUser(updatedUser);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
    setShowChangePw(false);
    setNewPw("");
    setNewPwConfirm("");
    setFehler("");
    Alert.alert("Passwort geändert", "Dein neues Passwort wurde gespeichert.");
  };

  const handleSendFrage = async () => {
    if (!newFrage.trim()) return;
    const frage: QAFrage = {
      id: `qa-${Date.now()}`,
      frage: newFrage.trim(),
      von: userName,
      datum: new Date().toISOString(),
    };
    const updated = [frage, ...qaFragen];
    setQaFragen(updated);
    await saveQAFragen(updated);
    setNewFrage("");
    setShowNewFrage(false);
    setFrageGesendet(true);
    setTimeout(() => setFrageGesendet(false), 4000);
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
              Melde dich an, um in deinen Seelenraum zu gelangen.
            </Text>

            {/* Nur Login - Registrierung nur über Admin */}

            <View style={s.loginCard}>

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
                placeholder="Dein Passwort"
                placeholderTextColor={C.muted}
                secureTextEntry
                value={password}
                onChangeText={(t) => { setPassword(t); setFehler(""); }}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                autoCapitalize="none"
                textContentType="password"
              />



              {fehler !== "" && <Text style={s.loginFehler}>{fehler}</Text>}

              <TouchableOpacity
                style={s.loginBtn}
                onPress={handleLogin}
                activeOpacity={0.85}
              >
                <Text style={s.loginBtnText}>Anmelden →</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={s.forgotBtn}
                  onPress={async () => {
                    if (!email.trim()) {
                      setFehler("Bitte gib zuerst deine E-Mail-Adresse ein.");
                      return;
                    }
                    try {
                      // Prüfe ob Nutzer in DB existiert
                      const API_URL_PW = getApiBaseUrl();
                      let userFound = false;
                      let userName = "";
                      try {
                        const checkRes = await fetch(`${API_URL_PW}/api/trpc/communityUsers.login`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ json: { email: email.trim().toLowerCase(), password: "___check___" } }),
                        });
                        const checkJson = await checkRes.json();
                        const checkResult = checkJson?.result?.data?.json || checkJson?.result?.data;
                        // not_found = Nutzer existiert nicht, wrong_password = Nutzer existiert
                        if (checkResult?.error === "not_found") {
                          setFehler("Kein Konto mit dieser E-Mail gefunden.");
                          return;
                        }
                        userFound = true;
                        userName = checkResult?.user?.name || email.trim().split("@")[0];
                      } catch (e) {
                        const users = await getUsers();
                        const userIdx = users.findIndex(u => u.email.toLowerCase() === email.trim().toLowerCase());
                        if (userIdx === -1) {
                          setFehler("Kein Konto mit dieser E-Mail gefunden.");
                          return;
                        }
                        userFound = true;
                        userName = users[userIdx].name;
                      }
                      if (!userFound) {
                        setFehler("Kein Konto mit dieser E-Mail gefunden.");
                        return;
                      }
                      const tempPw = Math.random().toString(36).slice(2, 8);
                      // Passwort in DB aktualisieren
                      try {
                        await fetch(`${API_URL_PW}/api/trpc/communityUsers.update`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ json: { email: email.trim().toLowerCase(), password: tempPw, mustChangePassword: 1 } }),
                        });
                      } catch (e) {
                        // Fallback
                        const users = await getUsers();
                        const userIdx = users.findIndex(u => u.email.toLowerCase() === email.trim().toLowerCase());
                        if (userIdx >= 0) { users[userIdx].password = tempPw; users[userIdx].mustChangePassword = true; await saveUsers(users); }
                      }
                      // E-Mail senden über Server
                      try {
                        const API_URL_EMAIL = getApiBaseUrl();
                        await fetch(`${API_URL_EMAIL}/api/trpc/email.sendPasswordReset`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ json: { toEmail: email.trim(), toName: userName || "Seele", tempPassword: tempPw } }),
                        });
                      } catch (e) { /* E-Mail-Fehler ignorieren, PW wurde trotzdem geändert */ }
                      setFehler("");
                      setResetSent(true);
                    } catch {
                      Alert.alert("Fehler", "Beim Zurücksetzen ist ein Fehler aufgetreten.");
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={s.forgotText}>Passwort vergessen?</Text>
                </TouchableOpacity>
                {resetSent && (
                  <View style={{ backgroundColor: "#F0F7F0", borderRadius: 12, padding: 14, marginTop: 12, borderWidth: 1, borderColor: "#C8E6C9" }}>
                    <Text style={{ fontSize: 14, color: "#2E7D32", textAlign: "center", fontWeight: "600", lineHeight: 20 }}>
                      ✉️ Ein neues Passwort wurde an {email.trim()} gesendet. Prüfe deinen Posteingang (auch den Spam-Ordner).
                    </Text>
                  </View>
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

          {/* ══════════════════════════════════════════════ */}
          {/* ── PREMIUM-BEREICH – GROSS & AUFFÄLLIG ── */}
          {/* ══════════════════════════════════════════════ */}
          <TouchableOpacity
            style={s.premiumHero}
            onPress={() => router.push("/community-premium" as any)}
            activeOpacity={0.85}
          >
            <View style={s.premiumHeroInner}>
              <Text style={{ fontSize: 40, marginBottom: 8 }}>👑</Text>
              <Text style={s.premiumHeroTitle}>Premium Bereich</Text>
              <Text style={s.premiumHeroSub}>
                Dein exklusiver Zugang zu Zyklustracker, Mondkalender & geführten Meditationen
              </Text>
              <View style={s.premiumHeroFeatures}>
                <View style={s.premiumFeatureRow}>
                  <Text style={s.premiumFeatureIcon}>🌸</Text>
                  <Text style={s.premiumFeatureText}>Persönlicher Zyklustracker</Text>
                </View>
                <View style={s.premiumFeatureRow}>
                  <Text style={s.premiumFeatureIcon}>🌙</Text>
                  <Text style={s.premiumFeatureText}>Mondphasen-Kalender 2026</Text>
                </View>
                <View style={s.premiumFeatureRow}>
                  <Text style={s.premiumFeatureIcon}>🧘</Text>
                  <Text style={s.premiumFeatureText}>Exklusive Meditationen</Text>
                </View>
                <View style={s.premiumFeatureRow}>
                  <Text style={s.premiumFeatureIcon}>📝</Text>
                  <Text style={s.premiumFeatureText}>Symptom- & Stimmungstracking</Text>
                </View>
              </View>
              <View style={s.premiumHeroBtn}>
                <Text style={s.premiumHeroBtnText}>Jetzt entdecken →</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* ── Meditationen Sektion ── */}
          <MeditationenSektion audio={audio} />

          {/* ══════════════════════════════════════════════ */}
          {/* ── FRAGE AN DIE SEELENPLANERIN ── */}
          {/* ══════════════════════════════════════════════ */}
          <View style={s.qaSection}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={s.sec}>🌙 Frage an die Seelenplanerin</Text>
              <TouchableOpacity
                style={s.qaAskBtn}
                onPress={() => { setShowNewFrage(!showNewFrage); setFrageGesendet(false); }}
                activeOpacity={0.8}
              >
                <Text style={s.qaAskBtnText}>{showNewFrage ? "✕ Schlie\u00dfen" : "✨ Frage stellen"}</Text>
              </TouchableOpacity>
            </View>

            {frageGesendet && (
              <View style={s.qaSuccessBox}>
                <Text style={{ fontSize: 18, marginBottom: 4 }}>✅</Text>
                <Text style={s.qaSuccessText}>Deine Frage wurde gesendet! Die Seelenplanerin wird sie bald beantworten.</Text>
              </View>
            )}

            {showNewFrage && (
              <View style={s.qaInputCard}>
                <Text style={s.qaInputLabel}>Deine Frage an die Seelenplanerin</Text>
                <TextInput
                  style={[s.qaInput, { height: 80, textAlignVertical: "top" }]}
                  placeholder="Was m\u00f6chtest du wissen? Stelle deine Frage..."
                  placeholderTextColor={C.muted}
                  value={newFrage}
                  onChangeText={setNewFrage}
                  multiline
                  maxLength={300}
                />
                <Text style={s.qaCharCount}>{newFrage.length}/300</Text>
                <TouchableOpacity
                  style={[s.qaSendBtn, !newFrage.trim() && { opacity: 0.5 }]}
                  onPress={handleSendFrage}
                  disabled={!newFrage.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={s.qaSendBtnText}>Frage senden \u2192</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Beantwortete Fragen */}
            {qaFragen.filter(f => f.antwort).length > 0 && (
              <View style={{ marginBottom: 8 }}>
                {qaFragen.filter(f => f.antwort).map(f => (
                  <View key={f.id} style={s.qaCard}>
                    <View style={s.qaFrageRow}>
                      <View style={s.qaFrageAvatar}>
                        <Text style={{ fontSize: 14 }}>🙋</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.qaFrageVon}>{f.von}</Text>
                        <Text style={s.qaFrageDatum}>{formatDatum(f.datum)}</Text>
                      </View>
                    </View>
                    <Text style={s.qaFrageText}>{f.frage}</Text>
                    {f.antwort && (
                      <View style={s.qaAntwortBox}>
                        <View style={s.qaAntwortHeader}>
                          <View style={s.qaAntwortAvatar}>
                            <Text style={{ fontSize: 12 }}>🌸</Text>
                          </View>
                          <Text style={s.qaAntwortVon}>Die Seelenplanerin</Text>
                          {f.antwortDatum && <Text style={s.qaAntwortDatum}>{formatDatum(f.antwortDatum)}</Text>}
                        </View>
                        <Text style={s.qaAntwortText}>{f.antwort}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Unbeantwortete Fragen */}
            {qaFragen.filter(f => !f.antwort).length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 13, color: C.muted, marginHorizontal: 16, marginBottom: 8, fontStyle: "italic" }}>Warten auf Antwort...</Text>
                {qaFragen.filter(f => !f.antwort).map(f => (
                  <View key={f.id} style={[s.qaCard, { borderStyle: "dashed" as any }]}>
                    <View style={s.qaFrageRow}>
                      <View style={s.qaFrageAvatar}>
                        <Text style={{ fontSize: 14 }}>🙋</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.qaFrageVon}>{f.von}</Text>
                        <Text style={s.qaFrageDatum}>{formatDatum(f.datum)}</Text>
                      </View>
                    </View>
                    <Text style={s.qaFrageText}>{f.frage}</Text>
                    {isAdmin ? (
                      replyingTo === f.id ? (
                        <View style={{ marginTop: 10 }}>
                          <TextInput
                            style={[s.qaInput, { height: 80, textAlignVertical: "top" }]}
                            placeholder="Deine Antwort als Seelenplanerin..."
                            placeholderTextColor={C.muted}
                            value={replyText}
                            onChangeText={setReplyText}
                            multiline
                            maxLength={500}
                          />
                          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                            <TouchableOpacity
                              style={[s.qaSendBtn, { flex: 1 }]}
                              onPress={async () => {
                                if (!replyText.trim()) return;
                                const updated = qaFragen.map(q =>
                                  q.id === f.id ? { ...q, antwort: replyText.trim(), antwortDatum: new Date().toISOString() } : q
                                );
                                setQaFragen(updated);
                                await saveQAFragen(updated);
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              activeOpacity={0.85}
                            >
                              <Text style={s.qaSendBtnText}>Antworten</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[s.qaSendBtn, { flex: 0.5, backgroundColor: C.surface }]}
                              onPress={() => { setReplyingTo(null); setReplyText(""); }}
                              activeOpacity={0.85}
                            >
                              <Text style={[s.qaSendBtnText, { color: C.muted }]}>Abbrechen</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={{ marginTop: 10, backgroundColor: C.goldLight, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, alignItems: "center", borderWidth: 1, borderColor: "#E8D5B0" }}
                          onPress={() => { setReplyingTo(f.id); setReplyText(""); }}
                          activeOpacity={0.85}
                        >
                          <Text style={{ color: C.brown, fontWeight: "700", fontSize: 13 }}>💌 Jetzt antworten</Text>
                        </TouchableOpacity>
                      )
                    ) : (
                      <Text style={{ fontSize: 12, color: C.muted, fontStyle: "italic", marginTop: 8 }}>🕒 Die Seelenplanerin wird bald antworten...</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

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
                {isAdmin && (
                  <TouchableOpacity
                    onPress={() => handleDeletePost(post.id)}
                    style={s.deleteBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={s.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                )}
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
  loginTitel: { fontSize: 32, fontWeight: "700", color: C.brown, marginBottom: 8, fontFamily: "DancingScript" },
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
  headerTitle: { fontSize: 30, fontWeight: "700", color: C.brown, fontFamily: "DancingScript" },
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
  premiumHero: {
    marginHorizontal: 16, marginTop: 16, marginBottom: 4,
    borderRadius: 24, overflow: "hidden",
    shadowColor: "#C9A96E", shadowOpacity: 0.25, shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  premiumHeroInner: {
    backgroundColor: "#F9EDE8", borderRadius: 24, padding: 24,
    alignItems: "center", borderWidth: 1, borderColor: "#EDD9D0",
  },
  premiumHeroTitle: {
    fontSize: 24, fontWeight: "800", color: C.brown, marginBottom: 8,
    letterSpacing: 1,
  },
  premiumHeroSub: {
    fontSize: 14, color: C.brownMid, textAlign: "center",
    lineHeight: 21, marginBottom: 16, maxWidth: 280,
  },
  premiumHeroFeatures: {
    width: "100%", marginBottom: 16,
  },
  premiumFeatureRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 6, paddingHorizontal: 12,
  },
  premiumFeatureIcon: { fontSize: 18 },
  premiumFeatureText: {
    fontSize: 14, color: C.brownMid, fontWeight: "600",
  },
  premiumHeroBtn: {
    backgroundColor: C.gold, borderRadius: 14, paddingVertical: 14,
    paddingHorizontal: 32, alignItems: "center", width: "100%",
  },
  premiumHeroBtnText: {
    color: "#FFF", fontSize: 16, fontWeight: "700",
  },

  // Q&A – Frage an die Seelenplanerin
  qaSection: { marginTop: 8 },
  qaAskBtn: {
    backgroundColor: C.goldLight, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8,
    marginRight: 16, borderWidth: 1, borderColor: "#E8D5B0",
  },
  qaAskBtnText: { color: C.brown, fontSize: 13, fontWeight: "700" },
  qaSuccessBox: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: "#F0F7F0",
    borderRadius: 16, padding: 16, alignItems: "center",
    borderWidth: 1, borderColor: "#C8E6C9",
  },
  qaSuccessText: { fontSize: 13, color: "#2E7D32", textAlign: "center", fontWeight: "600", lineHeight: 20 },
  qaInputCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.gold,
  },
  qaInputLabel: { fontSize: 13, color: C.brownMid, fontWeight: "600", marginBottom: 8 },
  qaInput: {
    backgroundColor: C.surface, borderRadius: 12, padding: 14, fontSize: 14,
    color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 4,
  },
  qaCharCount: { fontSize: 11, color: C.muted, textAlign: "right", marginBottom: 8 },
  qaSendBtn: {
    backgroundColor: C.gold, borderRadius: 14, paddingVertical: 14,
    alignItems: "center", marginTop: 4,
  },
  qaSendBtnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  qaCard: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: C.card,
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border,
  },
  qaFrageRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  qaFrageAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: C.goldLight,
    alignItems: "center", justifyContent: "center",
  },
  qaFrageVon: { fontSize: 14, fontWeight: "700", color: C.brown },
  qaFrageDatum: { fontSize: 11, color: C.muted },
  qaFrageText: { fontSize: 14, color: C.brownMid, lineHeight: 21 },
  qaAntwortBox: {
    marginTop: 12, backgroundColor: C.roseLight, borderRadius: 14,
    padding: 14, borderLeftWidth: 3, borderLeftColor: C.rose,
  },
  qaAntwortHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  qaAntwortAvatar: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: C.rose,
    alignItems: "center", justifyContent: "center",
  },
  qaAntwortVon: { fontSize: 13, fontWeight: "700", color: C.brown },
  qaAntwortDatum: { fontSize: 11, color: C.muted, marginLeft: "auto" },
  qaAntwortText: { fontSize: 13, color: C.brownMid, lineHeight: 20 },

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
  deleteBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: "#F5EEE8",
    alignItems: "center", justifyContent: "center", marginLeft: 8,
  },
  deleteBtnText: { fontSize: 14, color: "#C87C82", fontWeight: "700" },
});
