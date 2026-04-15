import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Linking, useWindowDimensions, Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "@/constants/oauth";
import * as WebBrowser from "expo-web-browser";

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

type Attachment = { id: number; filename: string; url: string; type: string };
type Entry = {
  id: number; title: string; content: string | null; category: string | null;
  date: string; createdAt: string; updatedAt: string; attachments: Attachment[];
};

export default function SeelenjournalEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width, height } = useWindowDimensions();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewingPdf, setViewingPdf] = useState<{ url: string; filename: string } | null>(null);

  useEffect(() => {
    loadEntry();
  }, [id]);

  async function loadEntry() {
    try {
      const token = await AsyncStorage.getItem("sj_token");
      if (!token) { router.replace("/seelenjournal-login" as any); return; }
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/seelenjournal/entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        await AsyncStorage.multiRemove(["sj_token", "sj_client"]);
        router.replace("/seelenjournal-login" as any);
        return;
      }
      const data = await res.json();
      if (data.error) {
        setEntry(null);
      } else {
        setEntry(data);
      }
    } catch (err) {
      console.error("Entry load error:", err);
    } finally {
      setLoading(false);
    }
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

  function renderContent(html: string) {
    // Einfache HTML-zu-Text-Konvertierung für die Anzeige
    const text = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return text;
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

  if (!entry) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
        <View style={[s.center, { backgroundColor: C.bg }]}>
          <Text style={s.errorText}>Eintrag nicht gefunden.</Text>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtnBottom}>
            <Text style={s.backBtnBottomText}>← Zurück</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const cat = entry.category ? CATEGORIES[entry.category] : null;
  const pdfs = entry.attachments?.filter(a => a.type === "pdf") || [];
  const images = entry.attachments?.filter(a => a.type === "image") || [];

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Titel-Bereich */}
          <View style={s.titleSection}>
            {cat && (
              <View style={[s.badge, { backgroundColor: cat.bg }]}>
                <Text style={[s.badgeText, { color: cat.color }]}>{cat.label}</Text>
              </View>
            )}
            <Text style={s.title}>{entry.title}</Text>
            <Text style={s.date}>{formatDate(entry.date)}</Text>
            <Text style={s.sentDate}>Gesendet: {formatDateTime(entry.createdAt)}</Text>
          </View>

          {/* Inhalt */}
          {entry.content && (
            <View style={s.contentCard}>
              <Text style={s.contentText}>{renderContent(entry.content)}</Text>
            </View>
          )}

          {/* Bilder */}
          {images.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>🖼 Bilder</Text>
              {images.map((img) => (
                <View key={img.id} style={s.imageContainer}>
                  <Image
                    source={{ uri: img.url }}
                    style={{ width: width - 64, height: (width - 64) * 0.75, borderRadius: 12 }}
                    contentFit="contain"
                  />
                  <Text style={s.imageCaption}>{img.filename}</Text>
                </View>
              ))}
            </View>
          )}

          {/* PDFs */}
          {pdfs.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>📄 Dokumente</Text>
              {pdfs.map((pdf) => {
                const apiBase = getApiBaseUrl();
                const pdfUrl = `${apiBase}/api/seelenjournal/download/${pdf.id}`;
                return (
                  <View key={pdf.id} style={s.pdfCard}>
                    <View style={s.pdfInfo}>
                      <Text style={s.pdfIcon}>📄</Text>
                      <Text style={s.pdfName} numberOfLines={1}>{pdf.filename}</Text>
                    </View>
                    <View style={s.pdfActions}>
                      <TouchableOpacity
                        style={s.pdfBtn}
                        activeOpacity={0.85}
                        onPress={async () => {
                          if (Platform.OS === 'web') {
                            // Auf Web: Eingebetteten PDF-Viewer mit Zurück-Button anzeigen
                            setViewingPdf({ url: pdfUrl, filename: pdf.filename });
                          } else {
                            // Auf iOS/Android: In-App-Browser (schließbar)
                            await WebBrowser.openBrowserAsync(pdfUrl);
                          }
                        }}
                      >
                        <Text style={s.pdfBtnText}>Öffnen</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.pdfBtn, s.pdfBtnDownload]}
                        activeOpacity={0.85}
                        onPress={() => {
                          if (Platform.OS === 'web') {
                            // Download in neuem Tab
                            window.open(pdfUrl, '_blank');
                          } else {
                            Linking.openURL(pdfUrl);
                          }
                        }}
                      >
                        <Text style={[s.pdfBtnText, { color: C.rose }]}>Herunterladen ↓</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Fullscreen PDF-Viewer Overlay (nur Web) */}
        {viewingPdf && Platform.OS === 'web' && (
          <View style={[s.pdfOverlay, { width, height }]}>
            {/* Zurück-Header */}
            <View style={s.pdfOverlayHeader}>
              <TouchableOpacity
                onPress={() => setViewingPdf(null)}
                style={s.pdfOverlayBackBtn}
                activeOpacity={0.7}
              >
                <Text style={s.pdfOverlayBackText}>← Zurück zum Eintrag</Text>
              </TouchableOpacity>
              <Text style={s.pdfOverlayTitle} numberOfLines={1}>{viewingPdf.filename}</Text>
              <TouchableOpacity
                onPress={() => window.open(viewingPdf.url, '_blank')}
                style={s.pdfOverlayDownloadBtn}
                activeOpacity={0.7}
              >
                <Text style={s.pdfOverlayDownloadText}>↓ Download</Text>
              </TouchableOpacity>
            </View>
            {/* Eingebetteter PDF-Viewer */}
            <View style={{ flex: 1 }}>
              {/* @ts-ignore - iframe ist nur auf Web verfügbar */}
              <iframe
                src={viewingPdf.url}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title={viewingPdf.filename}
              />
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: C.muted, marginBottom: 16 },
  backBtnBottom: { padding: 12 },
  backBtnBottomText: { fontSize: 16, color: C.rose, fontWeight: "600" },
  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12,
  },
  backText: { fontSize: 16, color: C.rose, fontWeight: "600" },
  titleSection: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  title: { fontSize: 24, fontWeight: "700", color: C.brown, marginBottom: 6 },
  date: { fontSize: 13, color: C.muted },
  sentDate: { fontSize: 11, color: C.sage, fontStyle: "italic", marginTop: 4 },
  contentCard: {
    marginHorizontal: 16, backgroundColor: C.card, borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: C.border, marginBottom: 16,
  },
  contentText: { fontSize: 15, color: C.brownMid, lineHeight: 24 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 12 },
  imageContainer: { marginBottom: 16, alignItems: "center" },
  imageCaption: { fontSize: 12, color: C.muted, marginTop: 6 },
  pdfCard: {
    backgroundColor: C.card, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 10,
  },
  pdfInfo: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  pdfIcon: { fontSize: 28, marginRight: 10 },
  pdfName: { fontSize: 14, fontWeight: "600", color: C.brown, flex: 1 },
  pdfActions: { flexDirection: "row", gap: 10 },
  pdfBtn: {
    flex: 1, backgroundColor: C.rose, borderRadius: 10, padding: 12, alignItems: "center",
  },
  pdfBtnDownload: {
    backgroundColor: C.roseLight, borderWidth: 1, borderColor: C.border,
  },
  pdfBtnText: { fontSize: 14, fontWeight: "600", color: "#FFF" },
  // PDF-Viewer Overlay Styles
  pdfOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.bg,
    zIndex: 100,
  },
  pdfOverlayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  pdfOverlayBackBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: C.roseLight,
    borderRadius: 10,
  },
  pdfOverlayBackText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.rose,
  },
  pdfOverlayTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: C.brown,
    textAlign: "center",
    marginHorizontal: 8,
  },
  pdfOverlayDownloadBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: C.sageLight,
    borderRadius: 10,
  },
  pdfOverlayDownloadText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.sage,
  },
});
