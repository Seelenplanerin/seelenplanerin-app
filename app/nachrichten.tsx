import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "@/constants/oauth";

/** Macht URLs im Text klickbar */
function LinkifiedText({ text, style }: { text: string; style?: any }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);

  if (parts.length === 1) {
    return <Text style={style}>{text}</Text>;
  }

  return (
    <Text style={style}>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          return (
            <Text
              key={i}
              style={{ color: "#C4826A", textDecorationLine: "underline" }}
              onPress={() => Linking.openURL(part)}
            >
              {part}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
}

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
};

const STORAGE_KEY = "seelenplanerin_nachrichten";

export interface Nachricht {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

/** Nachricht speichern (wird vom SW oder Notification-Handler aufgerufen) */
export async function saveNachricht(title: string, body: string): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const messages: Nachricht[] = existing ? JSON.parse(existing) : [];
    const newMsg: Nachricht = {
      id: Date.now().toString(),
      title,
      body,
      timestamp: Date.now(),
      read: false,
    };
    messages.unshift(newMsg); // Neueste zuerst
    // Maximal 50 Nachrichten speichern
    if (messages.length > 50) messages.length = 50;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("Fehler beim Speichern der Nachricht:", e);
  }
}

/** Nachrichten vom Server laden (push.history) – enthält IMMER den vollständigen Text */
async function loadNachrichtenFromServer(): Promise<Nachricht[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/trpc/push.history`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) return [];
    const json = await response.json();
    // tRPC response format: { result: { data: { json: [...] } } }
    const data = json?.result?.data?.json || json?.result?.data || [];
    if (!Array.isArray(data)) return [];
    
    return data.map((msg: any) => ({
      id: String(msg.id),
      title: msg.title || "Die Seelenplanerin",
      body: msg.body || "",
      timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(),
      read: true, // Server-Nachrichten als gelesen markieren
    }));
  } catch (e) {
    console.log("[Nachrichten] Server-Abruf fehlgeschlagen:", e);
    return [];
  }
}

/** Lokale Nachrichten laden (Fallback) */
async function loadNachrichtenLocal(): Promise<Nachricht[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Alle als gelesen markieren */
async function markAllRead(): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return;
    const messages: Nachricht[] = JSON.parse(data);
    messages.forEach(m => m.read = true);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {}
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Gerade eben";
  if (diffMin < 60) return `Vor ${diffMin} Min.`;
  if (diffH < 24) return `Vor ${diffH} Std.`;
  if (diffD === 1) return "Gestern";
  if (diffD < 7) return `Vor ${diffD} Tagen`;
  return d.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
}

export default function NachrichtenScreen() {
  const params = useLocalSearchParams<{ title?: string; body?: string }>();
  const [nachrichten, setNachrichten] = useState<Nachricht[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<Nachricht | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      setLoading(true);
      
      // 1. Versuche Nachrichten vom Server zu laden (vollständige Texte)
      let serverMessages = await loadNachrichtenFromServer();
      
      // 2. Lokale Nachrichten als Fallback
      const localMessages = await loadNachrichtenLocal();
      
      // 3. Server-Nachrichten haben Priorität (vollständiger Text!)
      // Merge: Server-Nachrichten + lokale die nicht auf dem Server sind
      let allMessages: Nachricht[] = [];
      
      if (serverMessages.length > 0) {
        allMessages = serverMessages;
        // Lokale Nachrichten die nicht vom Server kommen (z.B. lokale Notifications)
        // hinzufügen wenn sie nicht schon existieren (nach Titel+Body prüfen)
        for (const local of localMessages) {
          const exists = serverMessages.some(
            s => s.title === local.title && s.body.substring(0, 50) === local.body.substring(0, 50)
          );
          if (!exists) {
            allMessages.push(local);
          }
        }
        // Nach Zeitstempel sortieren (neueste zuerst)
        allMessages.sort((a, b) => b.timestamp - a.timestamp);
      } else {
        // Kein Server erreichbar → nur lokale Nachrichten
        allMessages = localMessages;
      }
      
      setNachrichten(allMessages);
      setLoading(false);
      markAllRead();
    }

    // Wenn über Notification geöffnet: direkt Detail-Ansicht zeigen
    if (params.title && params.body) {
      const msg: Nachricht = {
        id: Date.now().toString(),
        title: params.title,
        body: params.body,
        timestamp: Date.now(),
        read: true,
      };
      setSelectedMsg(msg);
      // Auch lokal speichern
      saveNachricht(params.title, params.body);
    }

    loadMessages();
  }, []);

  // Detail-Ansicht: Wenn eine Nachricht ausgewählt ist, zeige sie vollständig scrollbar
  if (selectedMsg) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          {/* Header mit Zurück-Button – AUSSERHALB der ScrollView */}
          <View style={s.header}>
            <TouchableOpacity style={s.backBtn} onPress={() => setSelectedMsg(null)}>
              <Text style={s.backText}>← Alle Nachrichten</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollbarer Nachrichteninhalt */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            {/* Nachricht vollständig anzeigen */}
            <View style={s.detailCard}>
              <View style={s.detailHeader}>
                <Text style={s.detailBadge}>Nachricht</Text>
                <Text style={s.detailTime}>{formatTime(selectedMsg.timestamp)}</Text>
              </View>
              <Text style={s.detailTitle}>{selectedMsg.title}</Text>
              <LinkifiedText text={selectedMsg.body} style={s.detailBody} />
            </View>
          </ScrollView>
        </View>
      </ScreenContainer>
    );
  }

  // Listen-Ansicht: Alle Nachrichten
  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.title}>Nachrichten</Text>
          <Text style={s.subtitle}>Deine Botschaften von der Seelenplanerin</Text>
        </View>

        {/* Ladeindikator */}
        {loading && (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color={C.rose} />
            <Text style={{ marginTop: 12, color: C.muted, fontSize: 14 }}>Nachrichten werden geladen...</Text>
          </View>
        )}

        {/* Nachrichten-Liste */}
        {!loading && nachrichten.length > 0 && (
          <View style={s.list}>
            {nachrichten.map((msg, i) => (
              <TouchableOpacity
                key={msg.id + "-" + i}
                style={[s.msgCard, !msg.read && s.msgUnread, i > 0 && { marginTop: 10 }]}
                onPress={() => setSelectedMsg(msg)}
              >
                <View style={s.msgHeader}>
                  {!msg.read && <View style={s.unreadDot} />}
                  <Text style={s.msgTime}>{formatTime(msg.timestamp)}</Text>
                </View>
                <Text style={s.msgTitle} numberOfLines={2}>{msg.title}</Text>
                <Text style={s.msgBody} numberOfLines={3}>{msg.body}</Text>
                <Text style={s.readMore}>Tippen zum Lesen →</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Leerer Zustand */}
        {!loading && nachrichten.length === 0 && (
          <View style={s.emptyCard}>
            <Text style={s.emptyIcon}>💌</Text>
            <Text style={s.emptyTitle}>Noch keine Nachrichten</Text>
            <Text style={s.emptyText}>
              Hier erscheinen deine Push-Nachrichten von der Seelenplanerin – zu Vollmond, Neumond und besonderen Anlässen.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: { padding: 20, paddingBottom: 12 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: 16, color: C.rose, fontWeight: "600" },
  title: { fontSize: 28, fontWeight: "700", color: C.brown, fontFamily: "DancingScript" },
  subtitle: { fontSize: 15, color: C.muted, marginTop: 4, fontStyle: "italic" },

  // Detail-Ansicht (vollständige Nachricht)
  detailCard: {
    marginHorizontal: 20, marginBottom: 20, backgroundColor: C.roseLight,
    borderRadius: 20, padding: 20, borderWidth: 1.5, borderColor: C.rose + "60",
  },
  detailHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12,
  },
  detailBadge: {
    fontSize: 12, fontWeight: "700", color: "#FFFFFF", backgroundColor: C.rose,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: "hidden",
  },
  detailTime: { fontSize: 12, color: C.muted },
  detailTitle: { fontSize: 22, fontWeight: "700", color: C.brown, marginBottom: 12 },
  detailBody: { fontSize: 16, color: C.brownMid, lineHeight: 28 },

  // Section
  sectionTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown,
    marginHorizontal: 20, marginBottom: 10,
  },

  // Message List
  list: { marginHorizontal: 20, marginBottom: 20 },
  msgCard: {
    backgroundColor: C.card, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: C.border,
  },
  msgUnread: { borderColor: C.rose + "60", borderWidth: 1.5 },
  msgHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: C.rose, marginRight: 8,
  },
  msgTime: { fontSize: 12, color: C.muted },
  msgTitle: { fontSize: 16, fontWeight: "600", color: C.brown, marginBottom: 4 },
  msgBody: { fontSize: 14, color: C.brownMid, lineHeight: 22 },
  readMore: { fontSize: 12, color: C.rose, marginTop: 8, fontWeight: "600" },

  // Empty State
  emptyCard: {
    marginHorizontal: 20, marginTop: 40, alignItems: "center", padding: 30,
    backgroundColor: C.card, borderRadius: 20, borderWidth: 1, borderColor: C.border,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: C.brown, marginBottom: 8 },
  emptyText: { fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 20 },
});
