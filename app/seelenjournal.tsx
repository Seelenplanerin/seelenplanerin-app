import { useState, useEffect, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  ActivityIndicator, Alert, RefreshControl,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "@/constants/oauth";

const C = {
  bg: "#FAF6F0", card: "#FFFFFF", rose: "#C4897B", roseLight: "#F9EDE8",
  sage: "#8FAF8E", sageLight: "#E8F0E8", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", gold: "#C9A96E",
};

const CATEGORIES: Record<string, { label: string; color: string; bg: string }> = {
  "Aura Reading": { label: "Aura Reading", color: "#7B5EA7", bg: "#F0E8F5" },
  "Seelenplan": { label: "Seelenplan", color: C.rose, bg: C.roseLight },
  "Energie-Update": { label: "Energie-Update", color: C.sage, bg: C.sageLight },
  "Persönliches": { label: "Persönliches", color: C.gold, bg: "#FBF5E8" },
};

type Entry = {
  id: number; title: string; content: string | null; category: string | null;
  date: string; createdAt: string; updatedAt: string;
  attachments: { id: number; filename: string; url: string; type: string }[];
};

type ClientInfo = { id: number; name: string; email: string };

export default function SeelenjournalScreen() {
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  async function getToken() {
    return AsyncStorage.getItem("sj_token");
  }

  async function loadData() {
    try {
      const token = await getToken();
      if (!token) { router.replace("/seelenjournal-login" as any); return; }
      const clientStr = await AsyncStorage.getItem("sj_client");
      if (clientStr) setClient(JSON.parse(clientStr));

      const apiBase = getApiBaseUrl();
      const [entriesRes, unreadRes] = await Promise.all([
        fetch(`${apiBase}/api/seelenjournal/entries`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiBase}/api/seelenjournal/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (entriesRes.status === 401) {
        await AsyncStorage.multiRemove(["sj_token", "sj_client"]);
        router.replace("/seelenjournal-login" as any);
        return;
      }
      const entriesData = await entriesRes.json();
      setEntries(Array.isArray(entriesData) ? entriesData : []);
      const unreadData = await unreadRes.json();
      setUnreadCount(unreadData.count || 0);
    } catch (err) {
      console.error("Seelenjournal load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { loadData(); }, []);
  useFocusEffect(useCallback(() => { loadData(); }, []));

  async function handleLogout() {
    await AsyncStorage.multiRemove(["sj_token", "sj_client"]);
    router.replace("/(tabs)/ich" as any);
  }

  function formatDate(d: string) {
    try {
      return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
    } catch { return d; }
  }

  function formatDateTime(d: string) {
    try {
      const date = new Date(d);
      return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
        + " um " + date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) + " Uhr";
    } catch { return d; }
  }

  function renderEntry({ item }: { item: Entry }) {
    const cat = item.category ? CATEGORIES[item.category] : null;
    const hasPdf = item.attachments?.some(a => a.type === "pdf");
    const hasImage = item.attachments?.some(a => a.type === "image");

    return (
      <TouchableOpacity
        style={s.entryCard}
        activeOpacity={0.85}
        onPress={() => router.push({ pathname: "/seelenjournal-entry", params: { id: String(item.id) } } as any)}
      >
        <View style={s.entryHeader}>
          {cat && (
            <View style={[s.badge, { backgroundColor: cat.bg }]}>
              <Text style={[s.badgeText, { color: cat.color }]}>{cat.label}</Text>
            </View>
          )}
          <Text style={s.entryDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={{ marginBottom: 6 }}>
          <Text style={s.entrySentDate}>Gesendet: {formatDateTime(item.createdAt)}</Text>
        </View>
        <Text style={s.entryTitle}>{item.title}</Text>
        {item.content && (
          <Text style={s.entryPreview} numberOfLines={2}>
            {item.content.replace(/<[^>]*>/g, "").slice(0, 120)}
          </Text>
        )}
        <View style={s.entryFooter}>
          {hasPdf && <Text style={s.attachBadge}>📄 PDF</Text>}
          {hasImage && <Text style={s.attachBadge}>🖼 Bild</Text>}
          <Text style={s.readMore}>Lesen →</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
        <View style={[s.center, { backgroundColor: C.bg }]}>
          <ActivityIndicator size="large" color={C.rose} />
          <Text style={s.loadingText}>Lade dein Seelenjournal...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Text style={s.logoutText}>Abmelden</Text>
          </TouchableOpacity>
        </View>

        {/* Willkommen */}
        <View style={s.welcomeSection}>
          <Text style={s.welcomeText}>
            Willkommen, {client?.name || "Seele"} 🌸
          </Text>
          <Text style={s.welcomeSub}>Dies ist dein persönlicher Seelenraum.</Text>
        </View>

        {/* Nachrichten-Button */}
        <TouchableOpacity
          style={s.messagesBtn}
          activeOpacity={0.85}
          onPress={() => router.push("/seelenjournal-messages" as any)}
        >
          <View style={s.messagesBtnInner}>
            <Text style={s.messagesBtnIcon}>💌</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.messagesBtnTitle}>Nachrichten von der Seelenplanerin</Text>
              {unreadCount > 0 && (
                <Text style={s.messagesBtnSub}>{unreadCount} neue Nachricht{unreadCount > 1 ? "en" : ""}</Text>
              )}
            </View>
            {unreadCount > 0 && (
              <View style={s.unreadBadge}>
                <Text style={s.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
            <Text style={s.messagesBtnArrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Einträge */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>📖 Meine Journaleinträge</Text>
        </View>

        {entries.length === 0 ? (
          <View style={s.emptyState}>
            <Text style={s.emptyEmoji}>🌱</Text>
            <Text style={s.emptyText}>Noch keine Einträge vorhanden.</Text>
            <Text style={s.emptySub}>Dein Seelenjournal wird von der Seelenplanerin für dich befüllt.</Text>
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderEntry}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={C.rose} />
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 14, color: C.muted },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backText: { fontSize: 16, color: C.rose, fontWeight: "600" },
  logoutText: { fontSize: 14, color: C.muted },
  welcomeSection: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  welcomeText: { fontSize: 24, fontWeight: "700", color: C.brown },
  welcomeSub: { fontSize: 14, color: C.muted, marginTop: 4 },
  messagesBtn: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden",
  },
  messagesBtnInner: {
    flexDirection: "row", alignItems: "center", padding: 16,
  },
  messagesBtnIcon: { fontSize: 28, marginRight: 12 },
  messagesBtnTitle: { fontSize: 15, fontWeight: "600", color: C.brown },
  messagesBtnSub: { fontSize: 12, color: C.rose, marginTop: 2 },
  messagesBtnArrow: { fontSize: 24, color: C.muted, marginLeft: 8 },
  unreadBadge: {
    backgroundColor: C.rose, borderRadius: 12, minWidth: 24, height: 24,
    justifyContent: "center", alignItems: "center", paddingHorizontal: 6,
  },
  unreadBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  sectionHeader: { paddingHorizontal: 20, paddingBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: C.brown },
  entryCard: {
    backgroundColor: C.card, borderRadius: 16, padding: 18, marginBottom: 12,
    borderWidth: 1, borderColor: C.border,
  },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  entryDate: { fontSize: 12, color: C.muted },
  entrySentDate: { fontSize: 11, color: C.sage, fontStyle: "italic" },
  entryTitle: { fontSize: 17, fontWeight: "700", color: C.brown, marginBottom: 6 },
  entryPreview: { fontSize: 14, color: C.brownMid, lineHeight: 20, marginBottom: 10 },
  entryFooter: { flexDirection: "row", alignItems: "center", gap: 8 },
  attachBadge: { fontSize: 12, color: C.muted, backgroundColor: C.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  readMore: { fontSize: 13, color: C.rose, fontWeight: "600", marginLeft: "auto" },
  emptyState: { alignItems: "center", paddingTop: 40, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: "600", color: C.brown, textAlign: "center" },
  emptySub: { fontSize: 13, color: C.muted, textAlign: "center", marginTop: 8, lineHeight: 20 },
});
