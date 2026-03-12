import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Switch, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpc } from "@/lib/trpc";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { getApiBaseUrl } from "@/constants/oauth";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
};

const DEFAULT_PIN = "1306";
const PIN_KEY = "admin_pin";
const USERS_KEY = "community_users";
const SONGS_KEY = "lara_songs";
const MEDITATIONEN_KEY = "lara_meditationen";
const IMPULSE_KEY = "admin_tagesimpulse_liste";

interface CommunityUser {
  email: string;
  password: string;
  name: string;
  mustChangePassword?: boolean;
}

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

interface Tagesimpuls {
  id: string;
  text: string;
  autor: string;
  datum?: string; // optional: geplantes Datum
}

async function getUsers(): Promise<CommunityUser[]> {
  // Lade Nutzer vom Server (DB)
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
    const data = await AsyncStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }
}
async function saveUsers(users: CommunityUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function getSongs(): Promise<Song[]> {
  const data = await AsyncStorage.getItem(SONGS_KEY);
  return data ? JSON.parse(data) : [];
}
async function saveSongs(songs: Song[]) {
  await AsyncStorage.setItem(SONGS_KEY, JSON.stringify(songs));
}

async function getMeditationen(): Promise<Song[]> {
  try {
    const API_URL = `${getApiBaseUrl()}/api/trpc`;
    const res = await fetch(`${API_URL}/meditations.listAll`);
    const data = await res.json();
    const result = data?.result?.data?.json || data?.result?.data;
    if (Array.isArray(result) && result.length > 0) {
      return result.map((m: any) => ({
        id: String(m.id),
        titel: m.title,
        beschreibung: m.description || "",
        mp3Url: m.audioUrl,
        emoji: m.emoji || "\u{1F9D8}\u200d\u2640\ufe0f",
        kategorie: "meditation" as Song["kategorie"],
        verfuegbar: m.isActive === 1,
      }));
    }
  } catch (e) {
    console.error("[Admin] Fehler beim Laden der Meditationen vom Server:", e);
  }
  // Fallback auf AsyncStorage
  const data = await AsyncStorage.getItem(MEDITATIONEN_KEY);
  return data ? JSON.parse(data) : [];
}
async function saveMeditationen(meditationen: Song[]) {
  // Legacy: auch lokal speichern als Backup
  await AsyncStorage.setItem(MEDITATIONEN_KEY, JSON.stringify(meditationen));
}

async function getImpulse(): Promise<Tagesimpuls[]> {
  const data = await AsyncStorage.getItem(IMPULSE_KEY);
  return data ? JSON.parse(data) : [];
}
async function saveImpulse(impulse: Tagesimpuls[]) {
  await AsyncStorage.setItem(IMPULSE_KEY, JSON.stringify(impulse));
}

function generateTempPassword(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789";
  let pw = "";
  for (let i = 0; i < 6; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const EMOJI_OPTIONS = ["🎶", "🔥", "ᛋ", "🧘‍♀️", "🌙", "💎", "🌸", "✨", "🎵", "🕯️", "🌊", "🦋"];
const KAT_OPTIONS: { key: Song["kategorie"]; label: string }[] = [
  { key: "musik", label: "Musik" },
  { key: "ritual", label: "Ritual" },
  { key: "mantra", label: "Mantra" },
  { key: "meditation", label: "Meditation" },
];

type AdminTab = "mitglieder" | "musik" | "meditationen" | "impulse" | "nachrichten" | "push" | "affiliate" | "academy" | "einstellungen";

interface AffiliateInfo {
  id: number; code: string; name: string; email: string;
  totalClicks: number; totalSales: number; totalEarnings: number; totalPaid: number;
  paypalEmail?: string; isActive: number; createdAt: string;
}
interface AffiliateSaleInfo {
  id: number; affiliateCode: string; productName: string;
  saleAmount: number; commissionAmount: number; status: string;
  customerEmail?: string; customerName?: string; createdAt: string;
}

export default function AdminScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pin, setPin] = useState("");
  const [currentPin, setCurrentPin] = useState(DEFAULT_PIN);
  const [fehler, setFehler] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("mitglieder");

  // PIN ändern
  const [showPinChange, setShowPinChange] = useState(false);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newPinConfirm, setNewPinConfirm] = useState("");
  const [pinChangeFehler, setPinChangeFehler] = useState("");

  // Einstellungen
  const [tagesimpulsText, setTagesimpulsText] = useState("");
  const [musikAktiv, setMusikAktiv] = useState(false);
  const [gespeichert, setGespeichert] = useState(false);

  // Mitgliederverwaltung
  const [members, setMembers] = useState<CommunityUser[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPw, setNewMemberPw] = useState("");
  const [memberFehler, setMemberFehler] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // Musik-Verwaltung
  const [songs, setSongs] = useState<Song[]>([]);
  const [showAddSong, setShowAddSong] = useState(false);
  const [editSongId, setEditSongId] = useState<string | null>(null);

  // Meditationen-Verwaltung (getrennt von Musik)
  const [meditationen, setMeditationen] = useState<Song[]>([]);
  const [showAddMedit, setShowAddMedit] = useState(false);
  const [editMeditId, setEditMeditId] = useState<string | null>(null);
  const [meditTitel, setMeditTitel] = useState("");
  const [meditBeschreibung, setMeditBeschreibung] = useState("");
  const [meditEmoji, setMeditEmoji] = useState("🧘‍♀️");
  const [meditVerfuegbar, setMeditVerfuegbar] = useState(true);
  const [meditMp3Url, setMeditMp3Url] = useState("");
  const [meditMp3FileName, setMeditMp3FileName] = useState("");
  const [meditFehler, setMeditFehler] = useState("");
  const [meditUploading, setMeditUploading] = useState(false);
  const [songTitel, setSongTitel] = useState("");
  const [songBeschreibung, setSongBeschreibung] = useState("");
  const [songSpotify, setSongSpotify] = useState("");
  const [songApple, setSongApple] = useState("");
  const [songYoutube, setSongYoutube] = useState("");
  const [songEmoji, setSongEmoji] = useState("🎶");
  const [songKat, setSongKat] = useState<Song["kategorie"]>("musik");
  const [songVerfuegbar, setSongVerfuegbar] = useState(true);
  const [songFehler, setSongFehler] = useState("");
  const [songMp3Url, setSongMp3Url] = useState("");
  const [songMp3FileName, setSongMp3FileName] = useState("");
  const [uploading, setUploading] = useState(false);

  // Tagesimpulse-Verwaltung
  const [impulse, setImpulse] = useState<Tagesimpuls[]>([]);
  const [showAddImpuls, setShowAddImpuls] = useState(false);
  const [impulsText, setImpulsText] = useState("");
  const [impulsAutor, setImpulsAutor] = useState("Die Seelenplanerin");
  const [impulsFehler, setImpulsFehler] = useState("");

  // Affiliate-Verwaltung
  const [affiliates, setAffiliates] = useState<AffiliateInfo[]>([]);
  const [affSales, setAffSales] = useState<AffiliateSaleInfo[]>([]);
  const [affLoading, setAffLoading] = useState(false);
  // Verkauf eintragen
  const [saleCode, setSaleCode] = useState("");
  const [saleProduct, setSaleProduct] = useState("");
  const [saleAmount, setSaleAmount] = useState("");
  const [saleCustomer, setSaleCustomer] = useState("");
  const [saleAdding, setSaleAdding] = useState(false);
  // Auszahlung
  const [payoutCode, setPayoutCode] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("paypal");
  const [payoutRef, setPayoutRef] = useState("");
  const [payoutAdding, setPayoutAdding] = useState(false);

  // Nachrichten (Broadcast)
  const [nachrichtBetreff, setNachrichtBetreff] = useState("");
  const [nachrichtText, setNachrichtText] = useState("");
  const [nachrichtFehler, setNachrichtFehler] = useState("");
  const [nachrichtSending, setNachrichtSending] = useState(false);
  const [nachrichtErfolg, setNachrichtErfolg] = useState("");

  // Push-Benachrichtigungen
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [pushFehler, setPushFehler] = useState("");
  const [pushSending, setPushSending] = useState(false);
  const [pushErfolg, setPushErfolg] = useState("");
  const [pushTokenCount, setPushTokenCount] = useState(0);
  const [pushHistory, setPushHistory] = useState<Array<{ id: number; title: string; body: string; sentTo: number; sentSuccess: number; sentFailed: number; createdAt: string }>>([]);
  const [pushHistoryLoading, setPushHistoryLoading] = useState(false);

  // Academy-Warteliste
  const [academyWaitlist, setAcademyWaitlist] = useState<{ id: number; email: string; createdAt: string }[]>([]);
  const [academyLoading, setAcademyLoading] = useState(false);

  // tRPC mutations
  const sendWelcomeMutation = trpc.email.sendWelcome.useMutation();
  const sendResetMutation = trpc.email.sendPasswordReset.useMutation();
  const sendBroadcastMutation = trpc.email.sendBroadcast.useMutation();
  const uploadAudioMutation = trpc.storage.uploadAudio.useMutation();

  useEffect(() => {
    AsyncStorage.getItem("admin_auth").then(val => {
      if (val === "true") setIsLoggedIn(true);
    });
    AsyncStorage.getItem(PIN_KEY).then(val => { if (val) setCurrentPin(val); });
    AsyncStorage.getItem("admin_tagesimpuls").then(val => { if (val) setTagesimpulsText(val); });
    AsyncStorage.getItem("admin_musik").then(val => { if (val) setMusikAktiv(val === "true"); });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getUsers().then(setMembers);
      getSongs().then(setSongs);
      getMeditationen().then(setMeditationen);
      getImpulse().then(setImpulse);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (pin === currentPin) {
      setIsLoggedIn(true);
      setFehler("");
      AsyncStorage.setItem("admin_auth", "true");
    } else {
      setFehler("Falscher PIN.");
    }
  };

  const handlePinChange = async () => {
    if (oldPin !== currentPin) { setPinChangeFehler("Aktueller PIN ist falsch."); return; }
    if (newPin.length < 4) { setPinChangeFehler("Neuer PIN muss mindestens 4 Zeichen haben."); return; }
    if (newPin !== newPinConfirm) { setPinChangeFehler("PINs stimmen nicht überein."); return; }
    await AsyncStorage.setItem(PIN_KEY, newPin);
    setCurrentPin(newPin);
    setShowPinChange(false);
    setOldPin("");
    setNewPin("");
    setNewPinConfirm("");
    setPinChangeFehler("");
    Alert.alert("PIN geändert ✓", "Dein neuer Admin-PIN wurde gespeichert.");
  };

  const handleSpeichern = async () => {
    await AsyncStorage.setItem("admin_tagesimpuls", tagesimpulsText);
    await AsyncStorage.setItem("admin_musik", musikAktiv ? "true" : "false");
    setGespeichert(true);
    setTimeout(() => setGespeichert(false), 2000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    AsyncStorage.removeItem("admin_auth");
    router.back();
  };

  // ── Mitglieder ──
  const handleAddMember = async () => {
    if (!newMemberName.trim()) { setMemberFehler("Bitte gib einen Namen ein."); return; }
    if (!newMemberEmail.trim()) { setMemberFehler("Bitte gib eine E-Mail-Adresse ein."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMemberEmail.trim())) {
      setMemberFehler("Bitte gib eine gültige E-Mail-Adresse ein."); return;
    }
    const tempPw = newMemberPw.trim() || generateTempPassword();
    const emailLower = newMemberEmail.trim().toLowerCase();
    setSendingEmail(true);
    setMemberFehler("");
    try {
      // 1. Mitglied in DB speichern
      const API_URL = getApiBaseUrl();
      const createRes = await fetch(`${API_URL}/api/trpc/communityUsers.create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { email: emailLower, password: tempPw, name: newMemberName.trim(), mustChangePassword: 1 } }),
      });
      const createData = await createRes.json();
      const createResult = createData?.result?.data?.json;
      if (createResult?.error === "exists") {
        setMemberFehler("Diese E-Mail ist bereits registriert.");
        setSendingEmail(false);
        return;
      }
      if (!createResult?.success) {
        setMemberFehler("Fehler beim Speichern. Bitte versuche es erneut.");
        setSendingEmail(false);
        return;
      }
      // 2. Liste neu laden
      const updatedUsers = await getUsers();
      setMembers(updatedUsers);
      // 3. Willkommens-E-Mail senden
      try {
        const mailResult = await sendWelcomeMutation.mutateAsync({
          toEmail: emailLower, toName: newMemberName.trim(), tempPassword: tempPw,
        });
        Alert.alert(
          mailResult.success ? "Mitglied angelegt ✨" : "Mitglied angelegt – E-Mail fehlgeschlagen",
          mailResult.success
            ? `${newMemberName.trim()} wurde angelegt.\n📧 E-Mail gesendet an ${emailLower}!`
            : `Angelegt, aber E-Mail fehlgeschlagen.\nPasswort: ${tempPw}\nBitte manuell senden.`,
        );
      } catch {
        Alert.alert("Mitglied angelegt ✓", `Gespeichert, aber E-Mail fehlgeschlagen.\nPasswort: ${tempPw}`);
      }
      setNewMemberName(""); setNewMemberEmail(""); setNewMemberPw(""); setShowAddMember(false);
    } catch (e: any) {
      setMemberFehler("Verbindungsfehler. Bitte prüfe deine Internetverbindung.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDeleteMember = async (email: string, name: string) => {
    const confirmed = Platform.OS === "web"
      ? window.confirm(`${name} (${email}) wirklich entfernen?`)
      : await new Promise<boolean>((resolve) => {
          Alert.alert("Mitglied entfernen", `${name} (${email}) wirklich entfernen?`, [
            { text: "Abbrechen", style: "cancel", onPress: () => resolve(false) },
            { text: "Entfernen", style: "destructive", onPress: () => resolve(true) },
          ]);
        });
    if (!confirmed) return;
    try {
      const API_URL = getApiBaseUrl();
      const res = await fetch(`${API_URL}/api/trpc/communityUsers.delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { email } }),
      });
      if (!res.ok) throw new Error("Server-Fehler");
      const updatedUsers = await getUsers();
      setMembers(updatedUsers);
      if (Platform.OS === "web") { window.alert(`${name} wurde aus der Community entfernt.`); }
      else { Alert.alert("Entfernt ✓", `${name} wurde aus der Community entfernt.`); }
    } catch (e) {
      if (Platform.OS === "web") { window.alert("Mitglied konnte nicht entfernt werden. Bitte versuche es erneut."); }
      else { Alert.alert("Fehler", "Mitglied konnte nicht entfernt werden. Bitte versuche es erneut."); }
    }
  };

  const handleResetMemberPw = async (email: string, name: string) => {
    const tempPw = generateTempPassword();
    const confirmed = Platform.OS === "web"
      ? window.confirm(`Neues Passwort für ${name} per E-Mail senden?`)
      : await new Promise<boolean>((resolve) => {
          Alert.alert("Passwort zurücksetzen", `Neues Passwort für ${name} per E-Mail senden?`, [
            { text: "Abbrechen", style: "cancel", onPress: () => resolve(false) },
            { text: "Zurücksetzen & senden", onPress: () => resolve(true) },
          ]);
        });
    if (!confirmed) return;
    try {
      const API_URL = getApiBaseUrl();
      await fetch(`${API_URL}/api/trpc/communityUsers.update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { email, password: tempPw, mustChangePassword: 1 } }),
      });
      const updatedUsers = await getUsers();
      setMembers(updatedUsers);
    } catch (e) {
      const users = await getUsers();
      const idx = users.findIndex(u => u.email === email);
      if (idx >= 0) { users[idx].password = tempPw; users[idx].mustChangePassword = true; await saveUsers(users); setMembers([...users]); }
    }
    try {
      const result = await sendResetMutation.mutateAsync({ toEmail: email, toName: name, tempPassword: tempPw });
      const msg = result.success ? `E-Mail an ${email} gesendet.` : `Passwort: ${tempPw}\nBitte manuell senden.`;
      if (Platform.OS === "web") { window.alert(msg); } else { Alert.alert(result.success ? "Passwort zurückgesetzt \u2728" : "Zurückgesetzt", msg); }
    } catch {
      const msg = `E-Mail fehlgeschlagen.\nPasswort: ${tempPw}`;
      if (Platform.OS === "web") { window.alert(msg); } else { Alert.alert("Zurückgesetzt", msg); }
    }
  };

  // ── Musik ──
  const resetSongForm = () => {
    setSongTitel(""); setSongBeschreibung(""); setSongSpotify(""); setSongApple("");
    setSongYoutube(""); setSongEmoji("🎶"); setSongKat("musik"); setSongVerfuegbar(true);
    setSongFehler(""); setEditSongId(null); setSongMp3Url(""); setSongMp3FileName("");
  };

  // ── Gemeinsame Upload-Logik (Multipart-FormData) ──
  const processAndUploadFile = async (
    uri: string,
    fileName: string,
    mimeType: string,
    setUrl: (url: string) => void,
    setFileName: (name: string) => void,
    setIsUploading: (v: boolean) => void,
  ) => {
    setIsUploading(true);
    setFileName(fileName);
    try {
      const apiBase = getApiBaseUrl();
      const uploadUrl = `${apiBase}/api/upload-audio`;
      console.log("[Upload] URL:", uploadUrl, "File:", fileName, "Type:", mimeType);

      if (Platform.OS === "web") {
        // Web: fetch blob and send as FormData
        const resp = await fetch(uri);
        const blob = await resp.blob();
        console.log("[Upload] Blob size:", blob.size, "bytes");
        const formData = new FormData();
        formData.append("file", blob, fileName);
        const uploadResp = await fetch(uploadUrl, { method: "POST", body: formData });
        const responseText = await uploadResp.text();
        console.log("[Upload] Response status:", uploadResp.status, "Body:", responseText.substring(0, 200));
        if (!uploadResp.ok) {
          Alert.alert("Upload fehlgeschlagen", `Server-Fehler (${uploadResp.status}): ${responseText.substring(0, 100)}`);
          return;
        }
        let result;
        try {
          result = JSON.parse(responseText);
        } catch {
          Alert.alert("Upload fehlgeschlagen", `Ung\u00fcltige Server-Antwort: ${responseText.substring(0, 100)}`);
          return;
        }
        if (result.success) {
          setUrl(result.url);
          Alert.alert("Upload erfolgreich \u2713", `"${fileName}" wurde hochgeladen.`);
        } else {
          Alert.alert("Upload fehlgeschlagen", result.error || "Unbekannter Fehler");
        }
      } else {
        // Native: use FileSystem.uploadAsync for direct multipart upload
        const uploadResult = await FileSystem.uploadAsync(uploadUrl, uri, {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "file",
          mimeType: mimeType,
          parameters: { fileName },
        });
        console.log("[Upload] Native response status:", uploadResult.status, "Body:", uploadResult.body?.substring(0, 200));
        if (uploadResult.status !== 200) {
          Alert.alert("Upload fehlgeschlagen", `Server-Fehler (${uploadResult.status})`);
          return;
        }
        let result;
        try {
          result = JSON.parse(uploadResult.body);
        } catch {
          Alert.alert("Upload fehlgeschlagen", `Ung\u00fcltige Server-Antwort: ${uploadResult.body?.substring(0, 100)}`);
          return;
        }
        if (result.success) {
          setUrl(result.url);
          Alert.alert("Upload erfolgreich \u2713", `"${fileName}" wurde hochgeladen.`);
        } else {
          Alert.alert("Upload fehlgeschlagen", result.error || "Unbekannter Fehler");
        }
      }
    } catch (err: any) {
      console.error("[Upload] Error:", err);
      Alert.alert("Upload fehlgeschlagen", err.message || "Fehler beim Hochladen");
    } finally {
      setIsUploading(false);
    }
  };

  // ── Direkte Dateiauswahl (ohne Alert-Dialog, funktioniert zuverlässig auf iOS/Web) ──
  const pickFileDirectly = async (
    setUrl: (url: string) => void,
    setFileName: (name: string) => void,
    setIsUploading: (v: boolean) => void,
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ["audio/*", "video/*", "application/octet-stream"], copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.[0]) return;
      const file = result.assets[0];
      if (file.size && file.size > 200 * 1024 * 1024) { Alert.alert("Datei zu gro\u00df", "Maximale Dateigr\u00f6\u00dfe: 100 MB"); return; }
      await processAndUploadFile(file.uri, file.name, file.mimeType || "audio/mpeg", setUrl, setFileName, setIsUploading);
    } catch (err: any) {
      if (err.message !== "User canceled document picker") {
        console.error("[PickFile] Error:", err);
        Alert.alert("Fehler", "Datei konnte nicht ausgew\u00e4hlt werden: " + (err.message || "Unbekannter Fehler"));
      }
    }
  };

  const handlePickMp3 = () => {
    pickFileDirectly(setSongMp3Url, setSongMp3FileName, setUploading);
  };

  const handleSaveSong = async () => {
    if (!songTitel.trim()) { setSongFehler("Bitte gib einen Titel ein."); return; }
    const allSongs = await getSongs();
    const songData: Song = {
      id: editSongId || generateId(),
      titel: songTitel.trim(), beschreibung: songBeschreibung.trim(),
      spotifyUrl: songSpotify.trim() || undefined, appleMusicUrl: songApple.trim() || undefined,
      youtubeUrl: songYoutube.trim() || undefined,
      mp3Url: songMp3Url.trim() || undefined, mp3FileName: songMp3FileName.trim() || undefined,
      emoji: songEmoji, kategorie: songKat, verfuegbar: songVerfuegbar,
    };
    if (editSongId) {
      const idx = allSongs.findIndex(s => s.id === editSongId);
      if (idx >= 0) allSongs[idx] = songData;
    } else {
      allSongs.push(songData);
    }
    await saveSongs(allSongs); setSongs(allSongs);
    resetSongForm(); setShowAddSong(false);
    Alert.alert("Gespeichert ✓", editSongId ? "Song wurde aktualisiert." : "Neuer Song wurde hinzugefügt.");
  };

  const handleEditSong = (song: Song) => {
    setEditSongId(song.id); setSongTitel(song.titel); setSongBeschreibung(song.beschreibung);
    setSongSpotify(song.spotifyUrl || ""); setSongApple(song.appleMusicUrl || "");
    setSongYoutube(song.youtubeUrl || ""); setSongEmoji(song.emoji);
    setSongKat(song.kategorie); setSongVerfuegbar(song.verfuegbar);
    setSongMp3Url(song.mp3Url || ""); setSongMp3FileName(song.mp3FileName || "");
    setShowAddSong(true);
  };

  const handleDeleteSong = async (id: string, titel: string) => {
    const confirmed = Platform.OS === "web"
      ? window.confirm(`"${titel}" wirklich löschen?`)
      : await new Promise<boolean>((resolve) => {
          Alert.alert("Song löschen", `"${titel}" wirklich löschen?`, [
            { text: "Abbrechen", style: "cancel", onPress: () => resolve(false) },
            { text: "Löschen", style: "destructive", onPress: () => resolve(true) },
          ]);
        });
    if (!confirmed) return;
    const allSongs = (await getSongs()).filter(s => s.id !== id);
    await saveSongs(allSongs); setSongs(allSongs);
  };

  // ── Tagesimpulse ──
  const handleAddImpuls = async () => {
    if (!impulsText.trim()) { setImpulsFehler("Bitte gib einen Impuls-Text ein."); return; }
    const all = await getImpulse();
    all.push({ id: generateId(), text: impulsText.trim(), autor: impulsAutor.trim() || "Die Seelenplanerin" });
    await saveImpulse(all); setImpulse(all);
    setImpulsText(""); setImpulsFehler(""); setShowAddImpuls(false);
    // Auch den aktuellen Tagesimpuls setzen
    await AsyncStorage.setItem("admin_tagesimpuls", impulsText.trim());
    setTagesimpulsText(impulsText.trim());
    Alert.alert("Impuls gespeichert ✓", "Der neue Tagesimpuls ist jetzt aktiv.");
  };

  const handleDeleteImpuls = async (id: string) => {
    const confirmed = Platform.OS === "web"
      ? window.confirm("Diesen Impuls wirklich löschen?")
      : await new Promise<boolean>((resolve) => {
          Alert.alert("Impuls löschen", "Diesen Impuls wirklich löschen?", [
            { text: "Abbrechen", style: "cancel", onPress: () => resolve(false) },
            { text: "Löschen", style: "destructive", onPress: () => resolve(true) },
          ]);
        });
    if (!confirmed) return;
    const all = (await getImpulse()).filter(i => i.id !== id);
    await saveImpulse(all); setImpulse(all);
  };

  const handleSetActiveImpuls = async (impuls: Tagesimpuls) => {
    await AsyncStorage.setItem("admin_tagesimpuls", impuls.text);
    setTagesimpulsText(impuls.text);
    Alert.alert("Aktiv ✓", `"${impuls.text.slice(0, 40)}..." ist jetzt der Tagesimpuls.`);
  };

  // ── LOGIN SCREEN ──
  if (!isLoggedIn) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={s.pinContainer}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
              <Text style={s.backBtnText}>← Zurück</Text>
            </TouchableOpacity>
            <Text style={s.pinEmoji}>🔐</Text>
            <Text style={s.pinTitel}>Admin-Bereich</Text>
            <Text style={s.pinSub}>Nur für die Seelenplanerin</Text>
            <TextInput
              style={s.pinInput} placeholder="PIN eingeben" placeholderTextColor={C.muted}
              secureTextEntry keyboardType="number-pad" value={pin} onChangeText={setPin}
              returnKeyType="done" onSubmitEditing={handleLogin} maxLength={8}
            />
            {fehler !== "" && <Text style={s.pinFehler}>{fehler}</Text>}
            <TouchableOpacity style={s.pinBtn} onPress={handleLogin} activeOpacity={0.85}>
              <Text style={s.pinBtnText}>Einloggen</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  // ── ADMIN DASHBOARD ──
  const TABS: { key: AdminTab; label: string; emoji: string }[] = [
    { key: "mitglieder", label: "Mitglieder", emoji: "👥" },
    { key: "musik", label: "Musik", emoji: "🎵" },
    { key: "meditationen", label: "Meditationen", emoji: "🧘‍♀️" },
    { key: "impulse", label: "Impulse", emoji: "✨" },
    { key: "nachrichten", label: "Nachrichten", emoji: "📬" },
    { key: "push", label: "Push", emoji: "📲" },
    { key: "affiliate", label: "Affiliate", emoji: "🤝" },
    { key: "academy", label: "Academy", emoji: "🎓" },
    { key: "einstellungen", label: "Einstellungen", emoji: "⚙️" },
  ];

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
            <Text style={[s.backBtnText, { color: C.rose }]}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>🔐 Admin-Bereich</Text>
          <Text style={s.headerSub}>Steuere deine App-Inhalte</Text>
        </View>

        {/* Tab-Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 6, paddingVertical: 6 }} style={{ maxHeight: 50, zIndex: 0 }}>
          {TABS.map(t => (
            <TouchableOpacity key={t.key}
              style={[s.tabBtn, activeTab === t.key && s.tabBtnActive]}
              onPress={() => setActiveTab(t.key)} activeOpacity={0.8}>
              <Text style={{ fontSize: 16 }}>{t.emoji}</Text>
              <Text style={[s.tabText, activeTab === t.key && s.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={{ flex: 1, zIndex: 1 }} showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}>

          {/* ═══════ MITGLIEDER TAB ═══════ */}
          {activeTab === "mitglieder" && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>👥 Mitgliederverwaltung</Text>
              <Text style={s.sectionHint}>
                Lege neue Mitglieder an – Login-Daten werden automatisch per E-Mail gesendet.
              </Text>

              {members.length > 0 ? (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, color: C.brownMid, fontWeight: "600", marginBottom: 8 }}>
                    {members.length} Mitglied{members.length !== 1 ? "er" : ""}
                  </Text>
                  {members.map(m => (
                    <View key={m.email} style={s.memberRow}>
                      <View style={s.memberAvatar}>
                        <Text style={{ fontSize: 14, color: "#FFF", fontWeight: "700" }}>{m.name.charAt(0).toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.memberName}>{m.name}</Text>
                        <Text style={s.memberEmail}>{m.email}</Text>
                        {m.mustChangePassword && <Text style={{ fontSize: 10, color: C.gold, fontWeight: "600" }}>⏳ Muss PW ändern</Text>}
                      </View>
                      <TouchableOpacity onPress={() => handleResetMemberPw(m.email, m.name)} style={s.memberAction} activeOpacity={0.7}>
                        <Text style={{ fontSize: 12, color: C.gold }}>🔑</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteMember(m.email, m.name)}
                        style={s.memberDeleteBtn}
                        activeOpacity={0.6}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text style={{ fontSize: 16, color: "#C87C82", fontWeight: "700" }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Noch keine Mitglieder.</Text>
              )}

              <TouchableOpacity style={[s.actionBtn, { borderColor: C.rose }]}
                onPress={() => setShowAddMember(!showAddMember)} activeOpacity={0.85}>
                <Text style={{ fontSize: 18, marginRight: 10 }}>{showAddMember ? "✕" : "➕"}</Text>
                <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
                  {showAddMember ? "Schließen" : "Neues Mitglied anlegen"}
                </Text>
              </TouchableOpacity>

              {showAddMember && (
                <View style={s.formBox}>
                  <Text style={s.formLabel}>Name</Text>
                  <TextInput style={s.formInput} placeholder="z.B. Sarah Müller" placeholderTextColor={C.muted}
                    value={newMemberName} onChangeText={t => { setNewMemberName(t); setMemberFehler(""); }}
                    autoCapitalize="words" returnKeyType="next" />
                  <Text style={s.formLabel}>E-Mail-Adresse</Text>
                  <TextInput style={s.formInput} placeholder="sarah@beispiel.de" placeholderTextColor={C.muted}
                    value={newMemberEmail} onChangeText={t => { setNewMemberEmail(t); setMemberFehler(""); }}
                    keyboardType="email-address" autoCapitalize="none" autoComplete="email" returnKeyType="next" />
                  <Text style={s.formLabel}>Temporäres Passwort (optional)</Text>
                  <TextInput style={s.formInput} placeholder="Leer = automatisch" placeholderTextColor={C.muted}
                    value={newMemberPw} onChangeText={t => { setNewMemberPw(t); setMemberFehler(""); }}
                    autoCapitalize="none" returnKeyType="done" onSubmitEditing={handleAddMember} />
                  {memberFehler !== "" && <Text style={s.formError}>{memberFehler}</Text>}
                  <TouchableOpacity style={[s.submitBtn, sendingEmail && { opacity: 0.6 }]}
                    onPress={handleAddMember} activeOpacity={0.85} disabled={sendingEmail}>
                    {sendingEmail ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <ActivityIndicator size="small" color="#FFF" />
                        <Text style={s.submitBtnText}>E-Mail wird gesendet...</Text>
                      </View>
                    ) : (
                      <Text style={s.submitBtnText}>📧 Anlegen & E-Mail senden</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* ═══════ MUSIK TAB ═══════ */}
          {activeTab === "musik" && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>🎵 Musik verwalten</Text>
              <Text style={s.sectionHint}>
                Füge Songs mit Streaming-Links oder eigenen MP3-Dateien hinzu.
                Du kannst Spotify-, Apple Music-, YouTube-Links hinterlegen oder MP3s direkt hochladen.
              </Text>

              {songs.length > 0 && songs.map(song => (
                <View key={song.id} style={[s.memberRow, !song.verfuegbar && { opacity: 0.5 }]}>
                  <View style={[s.memberAvatar, { backgroundColor: C.goldLight }]}>
                    <Text style={{ fontSize: 16 }}>{song.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.memberName}>{song.titel}</Text>
                    <Text style={s.memberEmail}>{song.beschreibung || song.kategorie}</Text>
                    <View style={{ flexDirection: "row", gap: 4, marginTop: 2 }}>
                      {song.mp3Url && <Text style={{ fontSize: 10, color: C.rose }}>● MP3</Text>}
                      {song.spotifyUrl && <Text style={{ fontSize: 10, color: "#1DB954" }}>● Spotify</Text>}
                      {song.appleMusicUrl && <Text style={{ fontSize: 10, color: "#FC3C44" }}>● Apple</Text>}
                      {song.youtubeUrl && <Text style={{ fontSize: 10, color: "#FF0000" }}>● YouTube</Text>}
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleEditSong(song)} style={s.memberAction} activeOpacity={0.7}>
                    <Text style={{ fontSize: 12, color: C.gold }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteSong(song.id, song.titel)} style={s.memberAction} activeOpacity={0.7}>
                    <Text style={{ fontSize: 12, color: "#C87C82" }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={[s.actionBtn, { borderColor: C.gold }]}
                onPress={() => { if (showAddSong) { resetSongForm(); setShowAddSong(false); } else { resetSongForm(); setShowAddSong(true); } }}
                activeOpacity={0.85}>
                <Text style={{ fontSize: 18, marginRight: 10 }}>{showAddSong ? "✕" : "➕"}</Text>
                <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
                  {showAddSong ? "Schließen" : (editSongId ? "Song bearbeiten" : "Neuen Song hinzufügen")}
                </Text>
              </TouchableOpacity>

              {showAddSong && (
                <View style={s.formBox}>
                  <Text style={s.formLabel}>Titel *</Text>
                  <TextInput style={s.formInput} placeholder="z.B. Seelenklänge" placeholderTextColor={C.muted}
                    value={songTitel} onChangeText={t => { setSongTitel(t); setSongFehler(""); }} returnKeyType="next" />

                  <Text style={s.formLabel}>Beschreibung</Text>
                  <TextInput style={s.formInput} placeholder="Kurze Beschreibung" placeholderTextColor={C.muted}
                    value={songBeschreibung} onChangeText={setSongBeschreibung} returnKeyType="next" />

                  <Text style={s.formLabel}>Emoji</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                    {EMOJI_OPTIONS.map(e => (
                      <TouchableOpacity key={e} onPress={() => setSongEmoji(e)}
                        style={[s.emojiBtn, songEmoji === e && s.emojiBtnActive]} activeOpacity={0.8}>
                        <Text style={{ fontSize: 20 }}>{e}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={s.formLabel}>Kategorie</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {KAT_OPTIONS.map(k => (
                      <TouchableOpacity key={k.key} onPress={() => setSongKat(k.key)}
                        style={[s.katBtn, songKat === k.key && s.katBtnActive]} activeOpacity={0.8}>
                        <Text style={[s.katText, songKat === k.key && s.katTextActive]}>{k.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* MP3-Upload */}
                  <Text style={s.formLabel}>🎧 MP3-Datei hochladen</Text>
                  {Platform.OS === "web" ? (
                    <View style={[s.actionBtn, { borderColor: C.rose, marginBottom: 8, position: "relative", overflow: "hidden" }, uploading && { opacity: 0.6 }]}>
                      {uploading ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <ActivityIndicator size="small" color={C.rose} />
                          <Text style={{ fontSize: 14, color: C.brown, fontWeight: "600" }}>Wird hochgeladen...</Text>
                        </View>
                      ) : (
                        <>
                          <Text style={{ fontSize: 18, marginRight: 10 }}>📁</Text>
                          <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
                            {songMp3FileName ? songMp3FileName : "MP3-Datei auswählen"}
                          </Text>
                          {songMp3Url ? <Text style={{ color: "#5C8A5C", fontSize: 14 }}>✓</Text> : null}
                        </>
                      )}
                      {!uploading && (
                        <input
                          type="file"
                          accept="audio/*,video/*,.mp3,.m4a,.wav,.ogg,.mp4"
                          onChange={(e: any) => {
                            const file = e.target?.files?.[0];
                            if (!file) return;
                            if (file.size > 200 * 1024 * 1024) { Alert.alert("Datei zu gro\u00df", "Max. 200 MB"); return; }
                            const uri = URL.createObjectURL(file);
                            processAndUploadFile(uri, file.name, file.type || "audio/mpeg", setSongMp3Url, setSongMp3FileName, setUploading);
                          }}
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 9999 } as any}
                        />
                      )}
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[s.actionBtn, { borderColor: C.rose, marginBottom: 8 }, uploading && { opacity: 0.6 }]}
                      onPress={handlePickMp3} activeOpacity={0.85} disabled={uploading}>
                      {uploading ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <ActivityIndicator size="small" color={C.rose} />
                          <Text style={{ fontSize: 14, color: C.brown, fontWeight: "600" }}>Wird hochgeladen...</Text>
                        </View>
                      ) : (
                        <>
                          <Text style={{ fontSize: 18, marginRight: 10 }}>📁</Text>
                          <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
                            {songMp3FileName ? songMp3FileName : "MP3-Datei auswählen"}
                          </Text>
                          {songMp3Url ? <Text style={{ color: "#5C8A5C", fontSize: 14 }}>✓</Text> : null}
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                  {songMp3Url ? (
                    <Text style={{ fontSize: 11, color: "#5C8A5C", marginBottom: 8 }}>✓ MP3 hochgeladen: {songMp3FileName}</Text>
                  ) : (
                    <Text style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Max. 200 MB. Wird in der App direkt abspielbar.</Text>
                  )}

                  <View style={{ height: 1, backgroundColor: C.border, marginVertical: 8 }} />
                  <Text style={{ fontSize: 13, fontWeight: "700", color: C.brown, marginBottom: 8 }}>Oder: Streaming-Links</Text>

                  <Text style={s.formLabel}>🟢 Spotify-Link</Text>
                  <TextInput style={s.formInput} placeholder="https://open.spotify.com/..." placeholderTextColor={C.muted}
                    value={songSpotify} onChangeText={setSongSpotify} autoCapitalize="none" keyboardType="url" />

                  <Text style={s.formLabel}>🎵 Apple Music-Link</Text>
                  <TextInput style={s.formInput} placeholder="https://music.apple.com/..." placeholderTextColor={C.muted}
                    value={songApple} onChangeText={setSongApple} autoCapitalize="none" keyboardType="url" />

                  <Text style={s.formLabel}>▶️ YouTube-Link</Text>
                  <TextInput style={s.formInput} placeholder="https://youtube.com/..." placeholderTextColor={C.muted}
                    value={songYoutube} onChangeText={setSongYoutube} autoCapitalize="none" keyboardType="url" />

                  <View style={[s.switchRow, { marginVertical: 8 }]}>
                    <Text style={{ fontSize: 14, color: C.brownMid }}>Sofort verfügbar</Text>
                    <Switch value={songVerfuegbar} onValueChange={setSongVerfuegbar}
                      trackColor={{ false: C.border, true: C.rose }} thumbColor="#FFF" />
                  </View>

                  {songFehler !== "" && <Text style={s.formError}>{songFehler}</Text>}
                  <TouchableOpacity style={s.submitBtn} onPress={handleSaveSong} activeOpacity={0.85}>
                    <Text style={s.submitBtnText}>{editSongId ? "✓ Song aktualisieren" : "🎵 Song hinzufügen"}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Tipp */}
              <View style={[s.formBox, { backgroundColor: C.goldLight, borderColor: "#E8D5B0" }]}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.brown, marginBottom: 4 }}>💡 Tipp</Text>
                <Text style={{ fontSize: 12, color: C.brownMid, lineHeight: 18 }}>
                  Kopiere die Links direkt aus Spotify, Apple Music oder YouTube.{"\n"}
                  In Spotify: Song → Teilen → Link kopieren{"\n"}
                  In Apple Music: Song → Teilen → Link kopieren{"\n"}
                  In YouTube: Video → Teilen → Link kopieren
                </Text>
              </View>
            </View>
          )}

          {/* ═══════ MEDITATIONEN TAB ═══════ */}
          {activeTab === "meditationen" && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>🧘‍♀️ Meditationen verwalten</Text>
              <Text style={s.sectionHint}>
                Lade hier deine Meditationen als MP3 hoch. Sie erscheinen automatisch im Community-Bereich für deine Mitglieder.
              </Text>

              {meditationen.map(m => (
                <View key={m.id} style={s.memberRow}>
                  <View style={[s.memberAvatar, { backgroundColor: m.verfuegbar ? C.rose : C.border }]}>
                    <Text style={{ fontSize: 14 }}>{m.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.memberName}>{m.titel}</Text>
                    <Text style={s.memberEmail}>{m.beschreibung}</Text>
                    <View style={{ flexDirection: "row", gap: 4, marginTop: 2 }}>
                      {m.mp3Url && <Text style={{ fontSize: 10, color: C.rose }}>● MP3 hochgeladen</Text>}
                      {!m.verfuegbar && <Text style={{ fontSize: 10, color: C.muted }}>● Bald verfügbar</Text>}
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setEditMeditId(m.id); setMeditTitel(m.titel); setMeditBeschreibung(m.beschreibung);
                    setMeditEmoji(m.emoji); setMeditVerfuegbar(m.verfuegbar);
                    setMeditMp3Url(m.mp3Url || ""); setMeditMp3FileName(m.mp3FileName || "");
                    setShowAddMedit(true);
                  }} style={s.memberAction} activeOpacity={0.7}>
                    <Text style={{ fontSize: 12, color: C.gold }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={async () => {
                    const confirmed = Platform.OS === "web"
                      ? window.confirm(`"${m.titel}" wirklich löschen?`)
                      : await new Promise<boolean>((resolve) => {
                          Alert.alert("Meditation löschen", `"${m.titel}" wirklich löschen?`, [
                            { text: "Abbrechen", style: "cancel", onPress: () => resolve(false) },
                            { text: "Löschen", style: "destructive", onPress: () => resolve(true) },
                          ]);
                        });
                    if (!confirmed) return;
                    try {
                      const API_URL = `${getApiBaseUrl()}/api/trpc`;
                      const numId = parseInt(m.id);
                      if (!isNaN(numId)) {
                        await fetch(`${API_URL}/meditations.delete`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ json: { id: numId } }),
                        });
                      }
                    } catch (e) { console.error("[Admin] DB-Löschen fehlgeschlagen:", e); }
                    const all = (await getMeditationen()).filter(x => x.id !== m.id);
                    await saveMeditationen(all); setMeditationen(all);
                  }} style={s.memberAction} activeOpacity={0.7}>
                    <Text style={{ fontSize: 12, color: "#C87C82" }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={[s.actionBtn, { borderColor: C.rose }]}
                onPress={() => {
                  if (showAddMedit) {
                    setShowAddMedit(false); setEditMeditId(null); setMeditTitel(""); setMeditBeschreibung("");
                    setMeditEmoji("🧘‍♀️"); setMeditVerfuegbar(true); setMeditMp3Url(""); setMeditMp3FileName(""); setMeditFehler("");
                  } else {
                    setEditMeditId(null); setMeditTitel(""); setMeditBeschreibung("");
                    setMeditEmoji("🧘‍♀️"); setMeditVerfuegbar(true); setMeditMp3Url(""); setMeditMp3FileName(""); setMeditFehler("");
                    setShowAddMedit(true);
                  }
                }}
                activeOpacity={0.85}>
                <Text style={{ fontSize: 18, marginRight: 10 }}>{showAddMedit ? "✕" : "➕"}</Text>
                <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
                  {showAddMedit ? "Schließen" : "Neue Meditation hinzufügen"}
                </Text>
              </TouchableOpacity>

              {showAddMedit && (
                <View style={s.formBox}>
                  <Text style={s.formLabel}>Titel *</Text>
                  <TextInput style={s.formInput} placeholder="z.B. Neumond-Manifestation" placeholderTextColor={C.muted}
                    value={meditTitel} onChangeText={t => { setMeditTitel(t); setMeditFehler(""); }} returnKeyType="next" />

                  {/* MP3-Upload */}
                  <Text style={s.formLabel}>🎧 MP3-Datei hochladen *</Text>
                  {Platform.OS === "web" ? (
                    <View style={[s.actionBtn, { borderColor: C.rose, marginBottom: 8, position: "relative", overflow: "hidden" }, meditUploading && { opacity: 0.6 }]}>
                      {meditUploading ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <ActivityIndicator size="small" color={C.rose} />
                          <Text style={{ fontSize: 14, color: C.brown, fontWeight: "600" }}>Wird hochgeladen...</Text>
                        </View>
                      ) : (
                        <>
                          <Text style={{ fontSize: 18, marginRight: 10 }}>📁</Text>
                          <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
                            {meditMp3FileName ? meditMp3FileName : "MP3-Datei auswählen"}
                          </Text>
                          {meditMp3Url ? <Text style={{ color: "#5C8A5C", fontSize: 14 }}>✓</Text> : null}
                        </>
                      )}
                      {!meditUploading && (
                        <input
                          type="file"
                          accept="audio/*,video/*,.mp3,.m4a,.wav,.ogg,.mp4"
                          onChange={(e: any) => {
                            const file = e.target?.files?.[0];
                            if (!file) return;
                            if (file.size > 200 * 1024 * 1024) { Alert.alert("Datei zu gro\u00df", "Max. 200 MB"); return; }
                            const uri = URL.createObjectURL(file);
                            processAndUploadFile(uri, file.name, file.type || "audio/mpeg", setMeditMp3Url, setMeditMp3FileName, setMeditUploading);
                          }}
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 9999 } as any}
                        />
                      )}
                    </View>
                  ) : (
                  <TouchableOpacity
                    style={[s.actionBtn, { borderColor: C.rose, marginBottom: 8 }, meditUploading && { opacity: 0.6 }]}
                    onPress={() => pickFileDirectly(setMeditMp3Url, setMeditMp3FileName, setMeditUploading)}
                    activeOpacity={0.85} disabled={meditUploading}>
                    {meditUploading ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <ActivityIndicator size="small" color={C.rose} />
                        <Text style={{ fontSize: 14, color: C.brown, fontWeight: "600" }}>Wird hochgeladen...</Text>
                      </View>
                    ) : (
                      <>
                        <Text style={{ fontSize: 18, marginRight: 10 }}>📁</Text>
                        <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
                          {meditMp3FileName ? meditMp3FileName : "MP3-Datei auswählen"}
                        </Text>
                        {meditMp3Url ? <Text style={{ color: "#5C8A5C", fontSize: 14 }}>✓</Text> : null}
                      </>
                    )}
                  </TouchableOpacity>
                  )}
                  {meditMp3Url ? (
                    <Text style={{ fontSize: 11, color: "#5C8A5C", marginBottom: 8 }}>✓ MP3 hochgeladen: {meditMp3FileName}</Text>
                  ) : (
                    <Text style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Max. 200 MB. Wird im Community-Bereich direkt abspielbar.</Text>
                  )}

                  <Text style={s.formLabel}>Beschreibung</Text>
                  <TextInput style={s.formInput} placeholder="Kurze Beschreibung der Meditation" placeholderTextColor={C.muted}
                    value={meditBeschreibung} onChangeText={setMeditBeschreibung} returnKeyType="next" />

                  <View style={[s.switchRow, { marginVertical: 8 }]}>
                    <Text style={{ fontSize: 14, color: C.brownMid }}>Sofort verfügbar</Text>
                    <Switch value={meditVerfuegbar} onValueChange={setMeditVerfuegbar}
                      trackColor={{ false: C.border, true: C.rose }} thumbColor="#FFF" />
                  </View>

                  {meditFehler !== "" && <Text style={s.formError}>{meditFehler}</Text>}
                  <TouchableOpacity style={s.submitBtn} onPress={async () => {
                    if (!meditTitel.trim()) { setMeditFehler("Bitte gib einen Titel ein."); return; }
                    if (!meditMp3Url) { setMeditFehler("Bitte lade eine MP3-Datei hoch."); return; }
                    setMeditUploading(true);
                    try {
                      const API_URL = `${getApiBaseUrl()}/api/trpc`;
                      if (editMeditId) {
                        // Update in DB
                        const numId = parseInt(editMeditId);
                        if (!isNaN(numId)) {
                          const res = await fetch(`${API_URL}/meditations.update`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ json: { id: numId, title: meditTitel.trim(), description: meditBeschreibung.trim(), emoji: meditEmoji, isActive: meditVerfuegbar ? 1 : 0 } }),
                          });
                          if (!res.ok) throw new Error("Update fehlgeschlagen");
                        }
                      } else {
                        // Neu in DB erstellen
                        const res = await fetch(`${API_URL}/meditations.create`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ json: { title: meditTitel.trim(), description: meditBeschreibung.trim() || "", emoji: meditEmoji, audioUrl: meditMp3Url, isPremium: 1 } }),
                        });
                        if (!res.ok) throw new Error("Erstellen fehlgeschlagen");
                        const resData = await res.json();
                        if (!resData?.result?.data?.json?.success) throw new Error("Erstellen fehlgeschlagen");
                      }
                      // Liste neu laden
                      const updated = await getMeditationen();
                      setMeditationen(updated);
                      setShowAddMedit(false); setEditMeditId(null); setMeditTitel(""); setMeditBeschreibung("");
                      setMeditEmoji("🧘‍♀️"); setMeditVerfuegbar(true); setMeditMp3Url(""); setMeditMp3FileName(""); setMeditFehler("");
                      Alert.alert("Gespeichert ✓", editMeditId ? "Meditation wurde aktualisiert." : "Neue Meditation wurde hinzugefügt.");
                    } catch (e: any) {
                      setMeditFehler("Fehler beim Speichern: " + (e?.message || "Bitte versuche es erneut."));
                    } finally {
                      setMeditUploading(false);
                    }
                  }} activeOpacity={0.85}>
                    <Text style={s.submitBtnText}>{editMeditId ? "✓ Meditation aktualisieren" : "🧘‍♀️ Meditation hinzufügen"}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Tipp */}
              <View style={[s.formBox, { backgroundColor: C.goldLight, borderColor: "#E8D5B0" }]}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.brown, marginBottom: 4 }}>💡 Tipp</Text>
                <Text style={{ fontSize: 12, color: C.brownMid, lineHeight: 18 }}>
                  Meditationen werden automatisch im Community-Bereich für eingeloggte Mitglieder angezeigt.{"\n"}
                  Lade MP3-Dateien hoch (max. 200 MB) – sie können direkt in der App abgespielt werden.
                </Text>
              </View>
            </View>
          )}

          {/* ═══════ IMPULSE TAB ═══════ */}
          {activeTab === "impulse" && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>✨ Tagesimpulse verwalten</Text>
              <Text style={s.sectionHint}>
                Erstelle Tagesimpulse, die auf der Startseite angezeigt werden.
                Der zuletzt aktivierte Impuls wird angezeigt.
              </Text>

              {/* Aktueller Impuls */}
              {tagesimpulsText ? (
                <View style={[s.formBox, { backgroundColor: C.goldLight, borderColor: "#E8D5B0" }]}>
                  <Text style={{ fontSize: 11, color: C.gold, fontWeight: "700", marginBottom: 4 }}>AKTUELLER TAGESIMPULS</Text>
                  <Text style={{ fontSize: 14, color: C.brown, fontStyle: "italic", lineHeight: 20 }}>
                    "{tagesimpulsText}"
                  </Text>
                </View>
              ) : (
                <Text style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>
                  Kein Tagesimpuls aktiv. Es wird ein Standard-Impuls angezeigt.
                </Text>
              )}

              {/* Gespeicherte Impulse */}
              {impulse.length > 0 && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 13, color: C.brownMid, fontWeight: "600", marginBottom: 8 }}>
                    {impulse.length} gespeicherte Impulse
                  </Text>
                  {impulse.map(imp => (
                    <View key={imp.id} style={s.memberRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, color: C.brown, fontStyle: "italic", lineHeight: 18 }} numberOfLines={2}>
                          "{imp.text}"
                        </Text>
                        <Text style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>— {imp.autor}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleSetActiveImpuls(imp)} style={s.memberAction} activeOpacity={0.7}>
                        <Text style={{ fontSize: 12, color: C.gold }}>✨</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteImpuls(imp.id)} style={s.memberAction} activeOpacity={0.7}>
                        <Text style={{ fontSize: 12, color: "#C87C82" }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity style={[s.actionBtn, { borderColor: C.gold }]}
                onPress={() => setShowAddImpuls(!showAddImpuls)} activeOpacity={0.85}>
                <Text style={{ fontSize: 18, marginRight: 10 }}>{showAddImpuls ? "✕" : "➕"}</Text>
                <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
                  {showAddImpuls ? "Schließen" : "Neuen Impuls erstellen"}
                </Text>
              </TouchableOpacity>

              {showAddImpuls && (
                <View style={s.formBox}>
                  <Text style={s.formLabel}>Impuls-Text *</Text>
                  <TextInput style={[s.formInput, { height: 80, textAlignVertical: "top" }]}
                    placeholder="Dein Impuls für die Community..." placeholderTextColor={C.muted}
                    value={impulsText} onChangeText={t => { setImpulsText(t); setImpulsFehler(""); }}
                    multiline />
                  <Text style={s.formLabel}>Autor</Text>
                  <TextInput style={s.formInput} placeholder="Die Seelenplanerin" placeholderTextColor={C.muted}
                    value={impulsAutor} onChangeText={setImpulsAutor} returnKeyType="done" />
                  {impulsFehler !== "" && <Text style={s.formError}>{impulsFehler}</Text>}
                  <TouchableOpacity style={s.submitBtn} onPress={handleAddImpuls} activeOpacity={0.85}>
                    <Text style={s.submitBtnText}>✨ Impuls speichern & aktivieren</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Schnelleingabe */}
              <View style={[s.formBox, { marginTop: 12 }]}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.brown, marginBottom: 6 }}>⚡ Schnelleingabe</Text>
                <Text style={s.sectionHint}>Ändere den aktuellen Tagesimpuls direkt:</Text>
                <TextInput style={[s.formInput, { height: 60, textAlignVertical: "top" }]}
                  value={tagesimpulsText} onChangeText={setTagesimpulsText}
                  placeholder="Dein heutiger Impuls..." placeholderTextColor={C.muted} multiline />
                <TouchableOpacity style={[s.submitBtn, { backgroundColor: C.gold, marginTop: 8 }]}
                  onPress={async () => {
                    await AsyncStorage.setItem("admin_tagesimpuls", tagesimpulsText);
                    Alert.alert("Gespeichert ✓", "Der Tagesimpuls wurde aktualisiert.");
                  }} activeOpacity={0.85}>
                  <Text style={s.submitBtnText}>Impuls aktualisieren</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ═══════ NACHRICHTEN TAB ═══════ */}
          {activeTab === "nachrichten" && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>📬 Nachricht an alle Mitglieder</Text>
              <Text style={s.sectionHint}>
                Sende eine E-Mail-Nachricht an alle Community-Mitglieder gleichzeitig.
                {members.length > 0 ? ` Aktuell ${members.length} Mitglied${members.length !== 1 ? "er" : ""}.` : ""}
              </Text>

              <View style={s.formBox}>
                <Text style={s.formLabel}>Betreff *</Text>
                <TextInput style={s.formInput}
                  placeholder="z.B. Neuer Seelenimpuls f\u00fcr dich \u{1F338}"
                  placeholderTextColor={C.muted}
                  value={nachrichtBetreff}
                  onChangeText={t => { setNachrichtBetreff(t); setNachrichtFehler(""); setNachrichtErfolg(""); }}
                  returnKeyType="next" />

                <Text style={s.formLabel}>Nachricht *</Text>
                <TextInput style={[s.formInput, { height: 140, textAlignVertical: "top" }]}
                  placeholder="Deine Nachricht an die Community..."
                  placeholderTextColor={C.muted}
                  value={nachrichtText}
                  onChangeText={t => { setNachrichtText(t); setNachrichtFehler(""); setNachrichtErfolg(""); }}
                  multiline />

                {nachrichtFehler !== "" && <Text style={s.formError}>{nachrichtFehler}</Text>}
                {nachrichtErfolg !== "" && (
                  <View style={{ backgroundColor: "#E8F5E9", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                    <Text style={{ fontSize: 13, color: "#2E7D32", fontWeight: "600" }}>{nachrichtErfolg}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[s.submitBtn, nachrichtSending && { opacity: 0.6 }]}
                  onPress={async () => {
                    if (!nachrichtBetreff.trim()) { setNachrichtFehler("Bitte gib einen Betreff ein."); return; }
                    if (!nachrichtText.trim()) { setNachrichtFehler("Bitte gib eine Nachricht ein."); return; }
                    if (members.length === 0) { setNachrichtFehler("Keine Mitglieder vorhanden."); return; }

                    Alert.alert(
                      "Nachricht senden?",
                      `E-Mail an ${members.length} Mitglied${members.length !== 1 ? "er" : ""} senden?\n\nBetreff: ${nachrichtBetreff}`,
                      [
                        { text: "Abbrechen", style: "cancel" },
                        {
                          text: "Senden",
                          style: "default",
                          onPress: async () => {
                            setNachrichtSending(true);
                            setNachrichtFehler("");
                            setNachrichtErfolg("");
                            try {
                              const result = await sendBroadcastMutation.mutateAsync({
                                subject: nachrichtBetreff.trim(),
                                message: nachrichtText.trim(),
                              });
                              if (result.sent > 0) {
                                setNachrichtErfolg(`\u2705 ${result.sent} E-Mail${result.sent !== 1 ? "s" : ""} erfolgreich gesendet!${result.failed > 0 ? ` (${result.failed} fehlgeschlagen)` : ""}`);
                                setNachrichtBetreff("");
                                setNachrichtText("");
                              } else {
                                setNachrichtFehler("Keine E-Mails konnten gesendet werden. " + (result.errors?.[0] || ""));
                              }
                            } catch (e: any) {
                              setNachrichtFehler("Fehler: " + (e?.message || "Bitte versuche es erneut."));
                            } finally {
                              setNachrichtSending(false);
                            }
                          },
                        },
                      ]
                    );
                  }}
                  activeOpacity={0.85}
                  disabled={nachrichtSending}>
                  {nachrichtSending ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <ActivityIndicator size="small" color="#FFF" />
                      <Text style={s.submitBtnText}>Wird gesendet...</Text>
                    </View>
                  ) : (
                    <Text style={s.submitBtnText}>📨 An alle {members.length} Mitglieder senden</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Tipp */}
              <View style={[s.formBox, { backgroundColor: C.goldLight, borderColor: "#E8D5B0", marginTop: 12 }]}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.brown, marginBottom: 4 }}>💡 Tipp</Text>
                <Text style={{ fontSize: 12, color: C.brownMid, lineHeight: 18 }}>
                  Die Nachricht wird als sch\u00f6ne E-Mail im Seelenplanerin-Design an jedes Mitglied pers\u00f6nlich gesendet.{"\n"}
                  Jede E-Mail beginnt mit "Hallo [Name]" und enth\u00e4lt deine Nachricht.
                </Text>
              </View>
            </View>
          )}

          {/* ═══════ PUSH TAB ═══════ */}
          {activeTab === "push" && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>📲 Push-Benachrichtigung senden</Text>
              <Text style={s.sectionHint}>
                Sende eine Push-Nachricht direkt auf die Handys deiner Nutzerinnen.
                {pushTokenCount > 0 ? ` ${pushTokenCount} Ger\u00e4t${pushTokenCount !== 1 ? "e" : ""} registriert.` : " Lade Ger\u00e4te-Anzahl..."}
              </Text>

              {/* Token-Count laden */}
              <TouchableOpacity
                style={[s.actionBtn, { borderColor: C.gold, marginBottom: 12 }]}
                onPress={async () => {
                  try {
                    const API_URL = getApiBaseUrl();
                    const res = await fetch(`${API_URL}/api/trpc/push.tokenCount`);
                    const data = await res.json();
                    const count = data?.result?.data?.json ?? data?.result?.data ?? 0;
                    setPushTokenCount(Number(count));
                  } catch (e) {
                    setPushTokenCount(0);
                  }
                }}
                activeOpacity={0.8}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: C.brown }}>🔄 Geräte-Anzahl aktualisieren</Text>
              </TouchableOpacity>

              <View style={s.formBox}>
                <Text style={s.formLabel}>Titel *</Text>
                <TextInput style={s.formInput}
                  placeholder="z.B. Vollmond-Ritual heute Abend \u{1F315}"
                  placeholderTextColor={C.muted}
                  value={pushTitle}
                  onChangeText={t => { setPushTitle(t); setPushFehler(""); setPushErfolg(""); }}
                  returnKeyType="next" />

                <Text style={s.formLabel}>Nachricht *</Text>
                <TextInput style={[s.formInput, { height: 100, textAlignVertical: "top" }]}
                  placeholder="Deine Push-Nachricht..."
                  placeholderTextColor={C.muted}
                  value={pushBody}
                  onChangeText={t => { setPushBody(t); setPushFehler(""); setPushErfolg(""); }}
                  multiline />

                {pushFehler !== "" && <Text style={s.formError}>{pushFehler}</Text>}
                {pushErfolg !== "" && (
                  <View style={{ backgroundColor: "#E8F5E9", borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#C8E6C9" }}>
                    <Text style={{ fontSize: 22, textAlign: "center", marginBottom: 6 }}>✅</Text>
                    <Text style={{ fontSize: 15, color: "#2E7D32", fontWeight: "700", textAlign: "center", lineHeight: 22 }}>{pushErfolg}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[s.submitBtn, pushSending && { opacity: 0.6 }]}
                  onPress={async () => {
                    if (!pushTitle.trim()) { setPushFehler("Bitte gib einen Titel ein."); return; }
                    if (!pushBody.trim()) { setPushFehler("Bitte gib eine Nachricht ein."); return; }

                    // Web-kompatible Bestätigung
                    const confirmed = Platform.OS === "web"
                      ? window.confirm(`Push-Nachricht an alle registrierten Geräte senden?\n\nTitel: ${pushTitle}`)
                      : await new Promise<boolean>((resolve) => {
                          Alert.alert("Push senden?", `Push-Nachricht an alle registrierten Geräte senden?\n\nTitel: ${pushTitle}`, [
                            { text: "Abbrechen", style: "cancel", onPress: () => resolve(false) },
                            { text: "Senden", style: "default", onPress: () => resolve(true) },
                          ]);
                        });
                    if (!confirmed) return;

                    setPushSending(true);
                    setPushFehler("");
                    setPushErfolg("");
                    try {
                      const API_URL = getApiBaseUrl();
                      const res = await fetch(`${API_URL}/api/trpc/push.sendToAll`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ json: { title: pushTitle.trim(), body: pushBody.trim() } }),
                      });
                      const data = await res.json();
                      const result = data?.result?.data?.json;
                      if (result?.success && result?.sent > 0) {
                        setPushErfolg(`Erfolgreich gesendet! ${result.sent} Gerät${result.sent !== 1 ? "e" : ""} haben die Nachricht erhalten.${result.failed > 0 ? ` (${result.failed} fehlgeschlagen)` : ""}`);
                        setPushTitle("");
                        setPushBody("");
                      } else if (result?.error) {
                        setPushFehler(result.error);
                      } else {
                        setPushFehler("Keine Push-Nachrichten konnten gesendet werden. Sind Geräte registriert?");
                      }
                    } catch (e: any) {
                      setPushFehler("Fehler: " + (e?.message || "Bitte versuche es erneut."));
                    } finally {
                      setPushSending(false);
                    }
                  }}
                  activeOpacity={0.85}
                  disabled={pushSending}>
                  {pushSending ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <ActivityIndicator size="small" color="#FFF" />
                      <Text style={s.submitBtnText}>Wird gesendet...</Text>
                    </View>
                  ) : (
                    <Text style={s.submitBtnText}>📲 Push an alle senden</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Vorlagen */}
              <View style={[s.formBox, { backgroundColor: C.goldLight, borderColor: "#E8D5B0", marginTop: 12 }]}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.brown, marginBottom: 8 }}>✨ Schnellvorlagen</Text>
                {[
                  { title: "\u{1F315} Vollmond-Ritual", body: "Heute Abend ist Vollmond \u2013 dein Ritual wartet auf dich. \u00d6ffne die App und lass dich f\u00fchren." },
                  { title: "\u{1F311} Neumond-Intention", body: "Heute ist Neumond \u2013 die perfekte Zeit, neue Intentionen zu setzen. Was m\u00f6chtest du manifestieren?" },
                  { title: "\u2728 Neuer Seelenimpuls", body: "Ein neuer Seelenimpuls wartet auf dich. \u00d6ffne die App und lass dich inspirieren." },
                  { title: "\u{1F9D8}\u200d\u2640\ufe0f Neue Meditation", body: "Eine neue Meditation ist verf\u00fcgbar. Nimm dir einen Moment der Stille." },
                  { title: "\u{1F338} Community-Update", body: "Es gibt Neuigkeiten in der Seelenplanerin-Community. Schau vorbei!" },
                ].map((vorlage, i) => (
                  <TouchableOpacity key={i}
                    style={{ paddingVertical: 8, paddingHorizontal: 10, backgroundColor: C.card, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: C.border }}
                    onPress={() => { setPushTitle(vorlage.title); setPushBody(vorlage.body); setPushFehler(""); setPushErfolg(""); }}
                    activeOpacity={0.7}>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: C.brown }}>{vorlage.title}</Text>
                    <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }} numberOfLines={1}>{vorlage.body}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Historie */}
              <View style={{ marginTop: 16 }}>
                <TouchableOpacity
                  style={[s.actionBtn, { borderColor: C.rose }]}
                  onPress={async () => {
                    setPushHistoryLoading(true);
                    try {
                      const API_URL = getApiBaseUrl();
                      const res = await fetch(`${API_URL}/api/trpc/push.history`);
                      const data = await res.json();
                      const history = data?.result?.data?.json ?? data?.result?.data ?? [];
                      setPushHistory(Array.isArray(history) ? history : []);
                    } catch (e) {
                      setPushHistory([]);
                    } finally {
                      setPushHistoryLoading(false);
                    }
                  }}
                  activeOpacity={0.8}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: C.brown }}>📜 Gesendete Nachrichten laden</Text>
                </TouchableOpacity>

                {pushHistoryLoading && <ActivityIndicator style={{ marginTop: 12 }} color={C.rose} />}

                {pushHistory.length > 0 && (
                  <View style={{ marginTop: 12 }}>
                    {pushHistory.map((msg) => (
                      <View key={msg.id} style={{ backgroundColor: C.card, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: C.border }}>
                        <Text style={{ fontSize: 14, fontWeight: "700", color: C.brown }}>{msg.title}</Text>
                        <Text style={{ fontSize: 12, color: C.brownMid, marginTop: 4 }} numberOfLines={2}>{msg.body}</Text>
                        <View style={{ flexDirection: "row", gap: 12, marginTop: 6 }}>
                          <Text style={{ fontSize: 11, color: C.muted }}>\u2705 {msg.sentSuccess} gesendet</Text>
                          {msg.sentFailed > 0 && <Text style={{ fontSize: 11, color: "#E53935" }}>\u274c {msg.sentFailed} fehlgeschlagen</Text>}
                          <Text style={{ fontSize: 11, color: C.muted }}>{new Date(msg.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Tipp */}
              <View style={[s.formBox, { backgroundColor: C.roseLight, borderColor: C.rose + "40", marginTop: 12 }]}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.brown, marginBottom: 4 }}>💡 So funktioniert's</Text>
                <Text style={{ fontSize: 12, color: C.brownMid, lineHeight: 18 }}>
                  Push-Nachrichten erscheinen direkt auf dem Sperrbildschirm deiner Nutzerinnen \u2013 auch wenn die App geschlossen ist.{"\n"}
                  Jede Nutzerin muss einmalig die Benachrichtigungen erlauben. Die Anzahl registrierter Ger\u00e4te siehst du oben.
                </Text>
              </View>
            </View>
          )}

          {/* ═══════ AFFILIATE TAB ═══════ */}
          {activeTab === "affiliate" && (
            <>
              {/* Affiliates Übersicht */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>🤝 Affiliate-Übersicht</Text>
                <Text style={s.sectionHint}>Alle Affiliates und deren Statistiken auf einen Blick. Volle Transparenz: Wer hat was empfohlen und wie viel Provision fällt an.</Text>
                <TouchableOpacity style={[s.actionBtn, { borderColor: C.gold }]} onPress={async () => {
                  setAffLoading(true);
                  try {
                    const API = getApiBaseUrl();
                    const res = await fetch(`${API}/api/trpc/affiliate.list`);
                    const d = await res.json();
                    if (d?.result?.data?.json) setAffiliates(d.result.data.json);
                    const res2 = await fetch(`${API}/api/trpc/affiliate.listAllSales`);
                    const d2 = await res2.json();
                    if (d2?.result?.data?.json) setAffSales(d2.result.data.json);
                  } catch (e) { console.error(e); }
                  setAffLoading(false);
                }} activeOpacity={0.85}>
                  <Text style={{ fontSize: 18, marginRight: 10 }}>🔄</Text>
                  <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
                    {affLoading ? "Lade..." : "Daten laden"}
                  </Text>
                </TouchableOpacity>

                {/* Gesamt-Statistik */}
                {affiliates.length > 0 && (
                  <View style={{ backgroundColor: C.goldLight, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#E8D5B0" }}>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: C.brown, marginBottom: 6 }}>📊 Gesamt-Statistik</Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: C.brown }}>{affiliates.length}</Text>
                        <Text style={{ fontSize: 10, color: C.muted }}>Affiliates</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: C.brown }}>{affiliates.reduce((s, a) => s + a.totalClicks, 0)}</Text>
                        <Text style={{ fontSize: 10, color: C.muted }}>Klicks</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: C.brown }}>{affiliates.reduce((s, a) => s + a.totalSales, 0)}</Text>
                        <Text style={{ fontSize: 10, color: C.muted }}>Verkäufe</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#4CAF50" }}>{(affiliates.reduce((s, a) => s + a.totalEarnings, 0) / 100).toFixed(2)} €</Text>
                        <Text style={{ fontSize: 10, color: C.muted }}>Provision</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#E65100" }}>{((affiliates.reduce((s, a) => s + a.totalEarnings, 0) - affiliates.reduce((s, a) => s + a.totalPaid, 0)) / 100).toFixed(2)} €</Text>
                        <Text style={{ fontSize: 10, color: C.muted }}>Offen</Text>
                      </View>
                    </View>
                  </View>
                )}

                    {affiliates.length > 0 && affiliates.map(a => (
                  <View key={a.id} style={[s.memberRow, { flexDirection: "column", alignItems: "stretch", opacity: a.isActive ? 1 : 0.5 }]}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                      <View style={[s.memberAvatar, { backgroundColor: a.isActive ? C.gold : C.muted }]}>
                        <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 14 }}>{a.name.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.memberName}>{a.name}</Text>
                        <Text style={s.memberEmail}>{a.email}</Text>
                      </View>
                      <TouchableOpacity
                        style={{ backgroundColor: a.isActive ? "#E8F5E9" : "#FFEBEE", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginRight: 6 }}
                        onPress={async () => {
                          try {
                            const API = getApiBaseUrl();
                            await fetch(`${API}/api/trpc/affiliate.toggleActive`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ json: { code: a.code, isActive: a.isActive ? 0 : 1 } }),
                            });
                            setAffiliates(prev => prev.map(af => af.code === a.code ? { ...af, isActive: af.isActive ? 0 : 1 } : af));
                          } catch (e) { console.error(e); }
                        }} activeOpacity={0.7}>
                        <Text style={{ fontSize: 10, fontWeight: "700", color: a.isActive ? "#4CAF50" : "#F44336" }}>
                          {a.isActive ? "Aktiv" : "Inaktiv"}
                        </Text>
                      </TouchableOpacity>
                      <View style={{ backgroundColor: C.goldLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 12, fontWeight: "700", color: C.gold }}>{a.code}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, padding: 8, alignItems: "center" }}>
                        <Text style={{ fontSize: 14, fontWeight: "700", color: C.brown }}>{a.totalClicks}</Text>
                        <Text style={{ fontSize: 10, color: C.muted }}>Klicks</Text>
                      </View>
                      <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, padding: 8, alignItems: "center" }}>
                        <Text style={{ fontSize: 14, fontWeight: "700", color: C.brown }}>{a.totalSales}</Text>
                        <Text style={{ fontSize: 10, color: C.muted }}>Verkäufe</Text>
                      </View>
                      <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, padding: 8, alignItems: "center" }}>
                        <Text style={{ fontSize: 14, fontWeight: "700", color: "#4CAF50" }}>{(a.totalEarnings / 100).toFixed(2)} €</Text>
                        <Text style={{ fontSize: 10, color: C.muted }}>Verdient</Text>
                      </View>
                      <View style={{ flex: 1, backgroundColor: C.bg, borderRadius: 8, padding: 8, alignItems: "center" }}>
                        <Text style={{ fontSize: 14, fontWeight: "700", color: C.brown }}>{(a.totalPaid / 100).toFixed(2)} €</Text>
                        <Text style={{ fontSize: 10, color: C.muted }}>Bezahlt</Text>
                      </View>
                    </View>
                    {a.paypalEmail && (
                      <Text style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                        PayPal: {a.paypalEmail}
                      </Text>
                    )}
                  </View>
                ))}
                {affiliates.length === 0 && !affLoading && (
                  <Text style={{ fontSize: 13, color: C.muted, textAlign: "center", marginTop: 12 }}>Noch keine Affiliates vorhanden.</Text>
                )}
              </View>

              {/* Verkauf eintragen */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>💰 Verkauf eintragen</Text>
                <Text style={s.sectionHint}>Trage einen Verkauf ein, der über einen Affiliate-Link zustande kam. Die 20% Provision wird automatisch berechnet (nur auf Produktpreis, nicht auf Versand).</Text>
                <View style={s.formBox}>
                  <Text style={s.formLabel}>Affiliate auswählen</Text>
                  {affiliates.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                      <View style={{ flexDirection: "row", gap: 6 }}>
                        {affiliates.map(a => (
                          <TouchableOpacity key={a.code}
                            style={[s.katBtn, saleCode === a.code && s.katBtnActive]}
                            onPress={() => setSaleCode(a.code)} activeOpacity={0.8}>
                            <Text style={[s.katText, saleCode === a.code && s.katTextActive]}>{a.name} ({a.code})</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  ) : (
                    <TextInput style={s.formInput} placeholder="Code eingeben" placeholderTextColor={C.muted}
                      value={saleCode} onChangeText={setSaleCode} autoCapitalize="characters" />
                  )}
                  <Text style={s.formLabel}>Produkt auswählen</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
                    <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap" }}>
                      {[
                        { name: "Schutzarmband", price: "24.00" },
                        { name: "Runen-Armband (Kette + 3 Charms)", price: "57.00" },

                        { name: "Aura Reading", price: "77.00" },
                        { name: "Meditationskerze", price: "17.00" },
                        { name: "Seelenimpuls", price: "17.00" },

                        { name: "Vollmond Ritual-Set", price: "29.90" },
                        { name: "Neumond Ritual-Set", price: "29.90" },
                        { name: "Imbolc Ritual-Set", price: "29.90" },
                        { name: "Ostara Ritual-Set", price: "29.90" },
                        { name: "Beltane Ritual-Set", price: "29.90" },
                        { name: "Litha Ritual-Set", price: "29.90" },
                        { name: "Lammas Ritual-Set", price: "29.90" },
                        { name: "Mabon Ritual-Set", price: "29.90" },
                        { name: "Samhain Ritual-Set", price: "29.90" },
                        { name: "Yule Ritual-Set", price: "29.90" },
                      ].map(p => (
                        <TouchableOpacity key={p.name}
                          style={[s.katBtn, saleProduct === p.name && s.katBtnActive, { marginBottom: 4 }]}
                          onPress={() => { setSaleProduct(p.name); setSaleAmount(p.price); }} activeOpacity={0.8}>
                          <Text style={[s.katText, saleProduct === p.name && s.katTextActive]}>{p.name} ({p.price}€)</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                  <Text style={s.formLabel}>Oder manuell eingeben:</Text>
                  <TextInput style={s.formInput} placeholder="z.B. Seelenimpuls, Armband, Aura Reading" placeholderTextColor={C.muted}
                    value={saleProduct} onChangeText={setSaleProduct} />
                  <Text style={s.formLabel}>Betrag in Euro (z.B. 17.00)</Text>
                  <TextInput style={s.formInput} placeholder="17.00" placeholderTextColor={C.muted}
                    value={saleAmount} onChangeText={setSaleAmount} keyboardType="decimal-pad" />
                  <Text style={s.formLabel}>Kundenname (optional)</Text>
                  <TextInput style={s.formInput} placeholder="Name des Käufers" placeholderTextColor={C.muted}
                    value={saleCustomer} onChangeText={setSaleCustomer} />
                  {saleAmount ? (
                    <Text style={{ fontSize: 13, color: "#4CAF50", fontWeight: "600", marginBottom: 8 }}>
                      Provision: {(parseFloat(saleAmount.replace(",", ".")) * 0.20).toFixed(2)} € (20%)
                    </Text>
                  ) : null}
                  <TouchableOpacity style={[s.submitBtn, saleAdding && { opacity: 0.6 }]} onPress={async () => {
                    if (!saleCode.trim() || !saleProduct.trim() || !saleAmount.trim()) {
                      if (Platform.OS === "web") window.alert("Bitte fülle alle Pflichtfelder aus.");
                      else Alert.alert("Fehler", "Bitte fülle alle Pflichtfelder aus.");
                      return;
                    }
                    const amountEuro = parseFloat(saleAmount.replace(",", "."));
                    if (isNaN(amountEuro) || amountEuro <= 0) {
                      if (Platform.OS === "web") window.alert("Bitte gib einen gültigen Betrag ein.");
                      else Alert.alert("Fehler", "Bitte gib einen gültigen Betrag ein.");
                      return;
                    }
                    setSaleAdding(true);
                    try {
                      const API = getApiBaseUrl();
                      const res = await fetch(`${API}/api/trpc/affiliate.createSale`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ json: {
                          affiliateCode: saleCode.trim().toUpperCase(),
                          productName: saleProduct.trim(),
                          saleAmount: Math.round(amountEuro * 100),
                          customerName: saleCustomer.trim() || undefined,
                        } }),
                      });
                      const d = await res.json();
                      if (d?.result?.data?.json?.success) {
                        const comm = (d.result.data.json.commissionAmount / 100).toFixed(2);
                        if (Platform.OS === "web") window.alert(`Verkauf eingetragen! Provision: ${comm} €`);
                        else Alert.alert("Erfolg", `Verkauf eingetragen! Provision: ${comm} €`);
                        setSaleCode(""); setSaleProduct(""); setSaleAmount(""); setSaleCustomer("");
                      } else {
                        const err = d?.result?.data?.json?.error === "code_not_found" ? "Affiliate-Code nicht gefunden!" : "Fehler beim Eintragen.";
                        if (Platform.OS === "web") window.alert(err);
                        else Alert.alert("Fehler", err);
                      }
                    } catch (e) {
                      if (Platform.OS === "web") window.alert("Verbindungsfehler.");
                      else Alert.alert("Fehler", "Verbindungsfehler.");
                    }
                    setSaleAdding(false);
                  }} disabled={saleAdding} activeOpacity={0.85}>
                    <Text style={s.submitBtnText}>{saleAdding ? "Wird eingetragen..." : "💰 Verkauf eintragen"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Auszahlung erstellen */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>💸 Auszahlung erstellen</Text>
                <Text style={s.sectionHint}>Wenn du eine Provision ausgezahlt hast, trage es hier ein.</Text>
                <View style={s.formBox}>
                  <Text style={s.formLabel}>Affiliate-Code</Text>
                  {affiliates.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                      <View style={{ flexDirection: "row", gap: 6 }}>
                        {affiliates.map(a => (
                          <TouchableOpacity key={a.code}
                            style={[s.katBtn, payoutCode === a.code && s.katBtnActive]}
                            onPress={() => setPayoutCode(a.code)} activeOpacity={0.8}>
                            <Text style={[s.katText, payoutCode === a.code && s.katTextActive]}>{a.name} ({a.code})</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  ) : (
                    <TextInput style={s.formInput} placeholder="Code eingeben" placeholderTextColor={C.muted}
                      value={payoutCode} onChangeText={setPayoutCode} autoCapitalize="characters" />
                  )}
                  <Text style={s.formLabel}>Betrag in Euro</Text>
                  <TextInput style={s.formInput} placeholder="z.B. 25.50" placeholderTextColor={C.muted}
                    value={payoutAmount} onChangeText={setPayoutAmount} keyboardType="decimal-pad" />
                  <Text style={s.formLabel}>Methode</Text>
                  <Text style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>Methode: PayPal</Text>
                  <Text style={s.formLabel}>Referenz / Notiz (optional)</Text>
                  <TextInput style={s.formInput} placeholder="z.B. PayPal Transaktions-ID" placeholderTextColor={C.muted}
                    value={payoutRef} onChangeText={setPayoutRef} />
                  <TouchableOpacity style={[s.submitBtn, payoutAdding && { opacity: 0.6 }]} onPress={async () => {
                    if (!payoutCode.trim() || !payoutAmount.trim()) {
                      if (Platform.OS === "web") window.alert("Bitte fülle Code und Betrag aus.");
                      else Alert.alert("Fehler", "Bitte fülle Code und Betrag aus.");
                      return;
                    }
                    const amountEuro = parseFloat(payoutAmount.replace(",", "."));
                    if (isNaN(amountEuro) || amountEuro <= 0) {
                      if (Platform.OS === "web") window.alert("Bitte gib einen gültigen Betrag ein.");
                      else Alert.alert("Fehler", "Bitte gib einen gültigen Betrag ein.");
                      return;
                    }
                    setPayoutAdding(true);
                    try {
                      const API = getApiBaseUrl();
                      const res = await fetch(`${API}/api/trpc/affiliate.createPayout`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ json: {
                          affiliateCode: payoutCode.trim().toUpperCase(),
                          amount: Math.round(amountEuro * 100),
                          method: payoutMethod,
                          reference: payoutRef.trim() || undefined,
                        } }),
                      });
                      const d = await res.json();
                      if (d?.result?.data?.json?.success) {
                        if (Platform.OS === "web") window.alert("Auszahlung eingetragen!");
                        else Alert.alert("Erfolg", "Auszahlung eingetragen!");
                        setPayoutCode(""); setPayoutAmount(""); setPayoutRef("");
                      } else {
                        if (Platform.OS === "web") window.alert("Fehler beim Eintragen.");
                        else Alert.alert("Fehler", "Fehler beim Eintragen.");
                      }
                    } catch (e) {
                      if (Platform.OS === "web") window.alert("Verbindungsfehler.");
                      else Alert.alert("Fehler", "Verbindungsfehler.");
                    }
                    setPayoutAdding(false);
                  }} disabled={payoutAdding} activeOpacity={0.85}>
                    <Text style={s.submitBtnText}>{payoutAdding ? "Wird eingetragen..." : "💸 Auszahlung eintragen"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Letzte Verkäufe */}
              {affSales.length > 0 && (
                <View style={s.section}>
                  <Text style={s.sectionTitle}>📊 Alle Verkäufe – Volle Transparenz</Text>
                  <Text style={s.sectionHint}>Hier siehst du jeden einzelnen Verkauf: Wer hat empfohlen, was wurde gekauft, wie viel Provision fällt an.</Text>
                  {affSales.map(sale => {
                    const affName = affiliates.find(a => a.code === sale.affiliateCode)?.name || sale.affiliateCode;
                    const affEmail = affiliates.find(a => a.code === sale.affiliateCode)?.email || "";
                    const saleDate = new Date(sale.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
                    return (
                      <View key={sale.id} style={[s.memberRow, { flexDirection: "column", alignItems: "stretch" }]}>
                        {/* Zeile 1: Produkt + Provision */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                          <Text style={{ fontSize: 14, fontWeight: "700", color: C.brown, flex: 1 }}>{sale.productName}</Text>
                          <Text style={{ fontSize: 14, fontWeight: "700", color: "#4CAF50" }}>+{(sale.commissionAmount / 100).toFixed(2)} €</Text>
                        </View>
                        {/* Zeile 2: Empfohlen von (Affiliate-Name) */}
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
                          <View style={{ backgroundColor: C.goldLight, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginRight: 6 }}>
                            <Text style={{ fontSize: 10, fontWeight: "700", color: C.gold }}>{sale.affiliateCode}</Text>
                          </View>
                          <Text style={{ fontSize: 12, fontWeight: "600", color: C.brownMid }}>Empfohlen von: {affName}</Text>
                        </View>
                        {affEmail ? <Text style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{affEmail}</Text> : null}
                        {/* Zeile 3: Betrag */}
                        <Text style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Betrag: {(sale.saleAmount / 100).toFixed(2)} € · 20% = {(sale.commissionAmount / 100).toFixed(2)} €</Text>
                        {/* Zeile 3b: Status-Buttons */}
                        <View style={{ flexDirection: "row", gap: 6, marginBottom: 2 }}>
                          {["pending", "confirmed", "paid"].map(st => (
                            <TouchableOpacity key={st}
                              style={{ flex: 1, backgroundColor: sale.status === st ? (st === "paid" ? "#E8F5E9" : st === "confirmed" ? C.goldLight : C.surface) : "#F5F5F5", borderRadius: 8, paddingVertical: 6, alignItems: "center", borderWidth: sale.status === st ? 1.5 : 0.5, borderColor: sale.status === st ? (st === "paid" ? "#4CAF50" : st === "confirmed" ? C.gold : C.muted) : C.border }}
                              onPress={async () => {
                                if (sale.status === st) return;
                                try {
                                  const API = getApiBaseUrl();
                                  await fetch(`${API}/api/trpc/affiliate.updateSaleStatus`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ json: { id: sale.id, status: st } }),
                                  });
                                  setAffSales(prev => prev.map(s2 => s2.id === sale.id ? { ...s2, status: st } : s2));
                                } catch (e) { console.error(e); }
                              }} activeOpacity={0.7}>
                              <Text style={{ fontSize: 10, fontWeight: "700", color: sale.status === st ? (st === "paid" ? "#4CAF50" : st === "confirmed" ? C.gold : C.muted) : "#999" }}>
                                {st === "paid" ? "✓ Bezahlt" : st === "confirmed" ? "Bestätigt" : "Ausstehend"}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        {/* Zeile 4: Kunde + Datum */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                          {sale.customerName ? <Text style={{ fontSize: 11, color: C.muted }}>Kunde: {sale.customerName}</Text> : <View />}
                          <Text style={{ fontSize: 10, color: C.muted }}>{saleDate}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )}

          {/* ═══════ ACADEMY TAB ═══════ */}
          {activeTab === "academy" && (
            <>
              <View style={s.section}>
                <Text style={s.sectionTitle}>🎓 Seelen Academy – Warteliste</Text>
                <Text style={s.sectionHint}>Alle Interessentinnen, die sich für die Academy-Ausbildungen auf die Warteliste eingetragen haben.</Text>
                <TouchableOpacity style={[s.actionBtn, { borderColor: C.gold }]} onPress={async () => {
                  setAcademyLoading(true);
                  try {
                    const API = getApiBaseUrl();
                    const res = await fetch(`${API}/api/trpc/academy.listWaitlist`);
                    const d = await res.json();
                    if (d?.result?.data?.json) setAcademyWaitlist(d.result.data.json);
                    else if (d?.result?.data) setAcademyWaitlist(d.result.data);
                  } catch (e) { console.error(e); }
                  setAcademyLoading(false);
                }} activeOpacity={0.85}>
                  <Text style={{ fontSize: 18, marginRight: 10 }}>🔄</Text>
                  <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
                    {academyLoading ? "Lade..." : "Warteliste laden"}
                  </Text>
                </TouchableOpacity>

                {academyWaitlist.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8, paddingHorizontal: 4 }}>
                      <Text style={{ fontSize: 14, fontWeight: "700", color: C.gold }}>
                        {academyWaitlist.length} Einträg{academyWaitlist.length === 1 ? "" : "e"}
                      </Text>
                    </View>
                    {academyWaitlist.map((entry, idx) => (
                      <View key={entry.id || idx} style={[s.memberRow, { flexDirection: "row", alignItems: "center" }]}>
                        <View style={[s.memberAvatar, { backgroundColor: C.gold }]}>
                          <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 14 }}>{idx + 1}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.memberName}>{entry.email}</Text>
                          <Text style={s.memberEmail}>
                            Eingetragen am {new Date(entry.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
                {academyWaitlist.length === 0 && !academyLoading && (
                  <Text style={{ fontSize: 13, color: C.muted, textAlign: "center", marginTop: 12 }}>Noch keine Einträge auf der Warteliste.</Text>
                )}
              </View>

              {/* Geplante Ausbildungen */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>📚 Geplante Ausbildungen</Text>
                <View style={[s.memberRow, { flexDirection: "row", alignItems: "center" }]}>
                  <View style={[s.memberAvatar, { backgroundColor: "#8B5E3C" }]}>
                    <Text style={{ color: "#FFF", fontSize: 16 }}>👁️</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.memberName}>Aura Reading Ausbildung</Text>
                    <Text style={s.memberEmail}>Coming Soon</Text>
                  </View>
                  <View style={{ backgroundColor: C.goldLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: C.gold }}>Geplant</Text>
                  </View>
                </View>
                <View style={[s.memberRow, { flexDirection: "row", alignItems: "center" }]}>
                  <View style={[s.memberAvatar, { backgroundColor: "#8B5E3C" }]}>
                    <Text style={{ color: "#FFF", fontSize: 16 }}>🌀</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.memberName}>Theta Healing Ausbildung</Text>
                    <Text style={s.memberEmail}>Coming Soon</Text>
                  </View>
                  <View style={{ backgroundColor: C.goldLight, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: C.gold }}>Geplant</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* ═══════ EINSTELLUNGEN TAB ═══════ */}
          {activeTab === "einstellungen" && (
            <>
              {/* PIN ändern */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>🔒 Admin-PIN ändern</Text>
                <Text style={s.sectionHint}>Ändere deinen PIN für den Admin-Zugang.</Text>
                <TouchableOpacity style={[s.actionBtn, { borderColor: C.rose }]}
                  onPress={() => setShowPinChange(!showPinChange)} activeOpacity={0.85}>
                  <Text style={{ fontSize: 18, marginRight: 10 }}>🔑</Text>
                  <Text style={{ flex: 1, fontSize: 14, color: C.brown, fontWeight: "600" }}>
                    {showPinChange ? "Schließen" : "PIN ändern"}
                  </Text>
                </TouchableOpacity>

                {showPinChange && (
                  <View style={s.formBox}>
                    <Text style={s.formLabel}>Aktueller PIN</Text>
                    <TextInput style={s.formInput} placeholder="Dein aktueller PIN" placeholderTextColor={C.muted}
                      value={oldPin} onChangeText={t => { setOldPin(t); setPinChangeFehler(""); }}
                      secureTextEntry keyboardType="number-pad" maxLength={8} returnKeyType="next" />
                    <Text style={s.formLabel}>Neuer PIN (mind. 4 Zeichen)</Text>
                    <TextInput style={s.formInput} placeholder="Neuer PIN" placeholderTextColor={C.muted}
                      value={newPin} onChangeText={t => { setNewPin(t); setPinChangeFehler(""); }}
                      secureTextEntry keyboardType="number-pad" maxLength={8} returnKeyType="next" />
                    <Text style={s.formLabel}>Neuen PIN bestätigen</Text>
                    <TextInput style={s.formInput} placeholder="Neuen PIN wiederholen" placeholderTextColor={C.muted}
                      value={newPinConfirm} onChangeText={t => { setNewPinConfirm(t); setPinChangeFehler(""); }}
                      secureTextEntry keyboardType="number-pad" maxLength={8} returnKeyType="done"
                      onSubmitEditing={handlePinChange} />
                    {pinChangeFehler !== "" && <Text style={s.formError}>{pinChangeFehler}</Text>}
                    <TouchableOpacity style={s.submitBtn} onPress={handlePinChange} activeOpacity={0.85}>
                      <Text style={s.submitBtnText}>🔒 PIN ändern</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Hintergrundmusik */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>🎵 Hintergrundmusik</Text>
                <View style={s.switchRow}>
                  <Text style={{ fontSize: 14, color: C.brownMid }}>{musikAktiv ? "Musik aktiv" : "Musik deaktiviert"}</Text>
                  <Switch value={musikAktiv} onValueChange={setMusikAktiv}
                    trackColor={{ false: C.border, true: C.rose }} thumbColor="#FFF" />
                </View>
              </View>

              {/* Speichern */}
              <TouchableOpacity style={[s.speichernBtn, gespeichert && s.speichernBtnSuccess]}
                onPress={handleSpeichern} activeOpacity={0.85}>
                <Text style={s.speichernBtnText}>{gespeichert ? "✓ Gespeichert!" : "Einstellungen speichern"}</Text>
              </TouchableOpacity>

              {/* Abmelden */}
              <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                <Text style={s.logoutText}>Admin-Bereich verlassen</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  pinContainer: { flex: 1, backgroundColor: C.bg, padding: 24, justifyContent: "center", alignItems: "center" },
  pinEmoji: { fontSize: 60, marginBottom: 16 },
  pinTitel: { fontSize: 26, fontWeight: "700", color: C.brown, marginBottom: 6 },
  pinSub: { fontSize: 14, color: C.muted, marginBottom: 32 },
  pinInput: { width: "100%", backgroundColor: C.card, borderRadius: 14, padding: 16, fontSize: 20, color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 12, textAlign: "center", letterSpacing: 8 },
  pinFehler: { fontSize: 13, color: "#C87C82", marginBottom: 10 },
  pinBtn: { backgroundColor: C.rose, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 40, marginTop: 8 },
  pinBtnText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  header: { backgroundColor: C.roseLight, padding: 20, paddingTop: 24 },
  backBtn: { marginBottom: 8 },
  backBtnText: { fontSize: 15, fontWeight: "600" },
  headerTitle: { fontSize: 24, fontWeight: "700", color: C.brown },
  headerSub: { fontSize: 13, color: C.muted, marginTop: 4 },

  // Tabs
  tabBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  tabBtnActive: { backgroundColor: C.rose, borderColor: C.rose },
  tabText: { fontSize: 13, fontWeight: "600", color: C.muted },
  tabTextActive: { color: "#FFF" },

  // Sections
  section: { margin: 16, marginBottom: 0, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 6 },
  sectionHint: { fontSize: 12, color: C.muted, lineHeight: 18, marginBottom: 12 },

  // Forms
  formBox: { marginTop: 12, backgroundColor: C.roseLight, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border },
  formLabel: { fontSize: 12, color: C.brownMid, fontWeight: "600", marginBottom: 4, marginTop: 4 },
  formInput: { backgroundColor: C.card, borderRadius: 10, padding: 12, fontSize: 14, color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 6 },
  formError: { fontSize: 12, color: "#C87C82", marginBottom: 8 },
  submitBtn: { backgroundColor: C.rose, borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 4 },
  submitBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },

  // Action buttons
  actionBtn: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 8, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },

  // Members
  memberRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderRadius: 12, padding: 10, marginBottom: 6, borderWidth: 1, borderColor: C.border },
  memberAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.rose, alignItems: "center", justifyContent: "center", marginRight: 10 },
  memberName: { fontSize: 14, fontWeight: "700", color: C.brown },
  memberEmail: { fontSize: 11, color: C.muted },
  memberAction: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.card, alignItems: "center", justifyContent: "center", marginLeft: 6, borderWidth: 1, borderColor: C.border },
  memberDeleteBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FDE8E8", alignItems: "center", justifyContent: "center", marginLeft: 8, borderWidth: 1, borderColor: "#C87C82" },

  // Switch
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  // Emoji/Kat buttons
  emojiBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", marginRight: 6, borderWidth: 1, borderColor: C.border },
  emojiBtnActive: { backgroundColor: C.roseLight, borderColor: C.rose },
  katBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  katBtnActive: { backgroundColor: C.rose, borderColor: C.rose },
  katText: { fontSize: 12, fontWeight: "600", color: C.muted },
  katTextActive: { color: "#FFF" },

  // Bottom buttons
  speichernBtn: { margin: 16, backgroundColor: C.rose, borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  speichernBtnSuccess: { backgroundColor: "#5C8A5C" },
  speichernBtnText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  logoutBtn: { marginHorizontal: 16, marginBottom: 8, backgroundColor: C.surface, borderRadius: 14, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: C.border },
  logoutText: { fontSize: 14, color: C.muted },
});
