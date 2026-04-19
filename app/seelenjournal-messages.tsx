import { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,
  ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard,
  TouchableWithoutFeedback,
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

type Message = {
  id: number; content: string; fromAdmin: number; isRead: number; createdAt: string;
};

export default function SeelenjournalMessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  async function getToken() {
    return AsyncStorage.getItem("sj_token");
  }

  async function loadMessages() {
    try {
      const token = await getToken();
      if (!token) { router.replace("/seelenjournal-login" as any); return; }
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/seelenjournal/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        await AsyncStorage.multiRemove(["sj_token", "sj_client"]);
        router.replace("/seelenjournal-login" as any);
        return;
      }
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Messages load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadMessages(); }, []);
  useFocusEffect(useCallback(() => { loadMessages(); }, []));

  async function handleSend() {
    if (!newMsg.trim() || sending) return;
    setSending(true);
    try {
      const token = await getToken();
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/seelenjournal/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newMsg.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewMsg("");
        await loadMessages();
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
      }
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  }

  function formatTime(d: string) {
    try {
      const date = new Date(d);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const time = date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
      if (isToday) return time;
      return `${date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })} ${time}`;
    } catch { return d; }
  }

  function renderMessage({ item }: { item: Message }) {
    const isAdmin = item.fromAdmin === 1;
    return (
      <View style={[s.msgRow, isAdmin ? s.msgRowLeft : s.msgRowRight]}>
        <View style={[s.msgBubble, isAdmin ? s.msgBubbleAdmin : s.msgBubbleClient]}>
          {isAdmin && <Text style={s.msgSender}>Die Seelenplanerin 🌸</Text>}
          <Text style={[s.msgText, isAdmin ? s.msgTextAdmin : s.msgTextClient]}>
            {item.content}
          </Text>
          <Text style={[s.msgTime, isAdmin ? s.msgTimeAdmin : s.msgTimeClient]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
        <View style={[s.center, { backgroundColor: C.bg }]}>
          <ActivityIndicator size="large" color={C.rose} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: C.bg }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>💌 Nachrichten</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Nachrichten-Liste */}
        {messages.length === 0 ? (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={s.emptyState}>
              <Text style={s.emptyEmoji}>💌</Text>
              <Text style={s.emptyText}>Noch keine Nachrichten.</Text>
              <Text style={s.emptySub}>Schreibe der Seelenplanerin eine Nachricht!</Text>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* Eingabefeld */}
        <View style={s.inputBar}>
          <TextInput
            style={s.input}
            placeholder="Nachricht schreiben..."
            placeholderTextColor={C.muted}
            value={newMsg}
            onChangeText={setNewMsg}
            multiline
            maxLength={2000}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[s.sendBtn, !newMsg.trim() && { opacity: 0.4 }]}
            onPress={handleSend}
            disabled={!newMsg.trim() || sending}
            activeOpacity={0.85}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={s.sendBtnText}>↑</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  backText: { fontSize: 16, color: C.rose, fontWeight: "600" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: C.brown },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: "600", color: C.brown },
  emptySub: { fontSize: 13, color: C.muted, textAlign: "center", marginTop: 6 },
  msgRow: { marginBottom: 10 },
  msgRowLeft: { alignItems: "flex-start" },
  msgRowRight: { alignItems: "flex-end" },
  msgBubble: { maxWidth: "80%", borderRadius: 16, padding: 12 },
  msgBubbleAdmin: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderBottomLeftRadius: 4 },
  msgBubbleClient: { backgroundColor: C.rose, borderBottomRightRadius: 4 },
  msgSender: { fontSize: 11, fontWeight: "700", color: C.rose, marginBottom: 4 },
  msgText: { fontSize: 15, lineHeight: 22 },
  msgTextAdmin: { color: C.brown },
  msgTextClient: { color: "#FFF" },
  msgTime: { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  msgTimeAdmin: { color: C.muted },
  msgTimeClient: { color: "rgba(255,255,255,0.7)" },
  inputBar: {
    flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 12, paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 24 : 10,
    borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.card,
  },
  input: {
    flex: 1, backgroundColor: C.bg, borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 10, fontSize: 15, color: C.brown, maxHeight: 100,
    borderWidth: 1, borderColor: C.border,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: C.rose,
    justifyContent: "center", alignItems: "center", marginLeft: 8,
  },
  sendBtnText: { color: "#FFF", fontSize: 20, fontWeight: "700" },
});
