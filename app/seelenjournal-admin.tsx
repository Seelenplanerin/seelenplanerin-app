import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
  Alert, Platform, ActivityIndicator, FlatList,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "@/constants/oauth";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as WebBrowser from "expo-web-browser";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
  sage: "#8FA98F", sageLight: "#E8F0E8",
};

interface Klientin {
  id: number;
  name: string;
  email: string;
  notizen?: string;
  createdAt: string;
}

interface KlientinPdf {
  id: number;
  klientinId: number;
  titel: string;
  pdfUrl: string;
  fileName: string;
  createdAt: string;
}

const API_URL = () => getApiBaseUrl();

// ── API Helpers ──
async function fetchKlientinnen(): Promise<Klientin[]> {
  try {
    const res = await fetch(`${API_URL()}/api/trpc/seelenjournal.listKlientinnen`);
    const json = await res.json();
    return json?.result?.data?.json || json?.result?.data || [];
  } catch (e) {
    console.error("[SJ] Fehler beim Laden der Klientinnen:", e);
    return [];
  }
}

async function createKlientin(data: { name: string; email: string; notizen?: string }): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const res = await fetch(`${API_URL()}/api/trpc/seelenjournal.createKlientin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: data }),
    });
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    return result || { success: false, error: "Unbekannter Fehler" };
  } catch (e: any) {
    return { success: false, error: e.message || "Netzwerkfehler" };
  }
}

async function deleteKlientin(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL()}/api/trpc/seelenjournal.deleteKlientin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { id } }),
    });
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    return result?.success === true;
  } catch {
    return false;
  }
}

async function fetchPdfs(klientinId: number): Promise<KlientinPdf[]> {
  try {
    const res = await fetch(`${API_URL()}/api/trpc/seelenjournal.listPdfs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { klientinId } }),
    });
    const json = await res.json();
    return json?.result?.data?.json || json?.result?.data || [];
  } catch {
    return [];
  }
}

async function deletePdf(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL()}/api/trpc/seelenjournal.deletePdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ json: { id } }),
    });
    const json = await res.json();
    const result = json?.result?.data?.json || json?.result?.data;
    return result?.success === true;
  } catch {
    return false;
  }
}

export default function SeelenjournalAdminScreen() {
  const [klientinnen, setKlientinnen] = useState<Klientin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Neue Klientin anlegen
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newNotizen, setNewNotizen] = useState("");
  const [addFehler, setAddFehler] = useState("");
  const [adding, setAdding] = useState(false);

  // Klientin-Detail (PDFs)
  const [selectedKlientin, setSelectedKlientin] = useState<Klientin | null>(null);
  const [pdfs, setPdfs] = useState<KlientinPdf[]>([]);
  const [loadingPdfs, setLoadingPdfs] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadKlientinnen();
  }, []);

  const loadKlientinnen = async () => {
    setLoading(true);
    const data = await fetchKlientinnen();
    setKlientinnen(data);
    setLoading(false);
  };

  const loadPdfs = async (klientinId: number) => {
    setLoadingPdfs(true);
    const data = await fetchPdfs(klientinId);
    setPdfs(data);
    setLoadingPdfs(false);
  };

  const handleAddKlientin = async () => {
    if (!newName.trim()) { setAddFehler("Bitte gib einen Namen ein."); return; }
    if (!newEmail.trim()) { setAddFehler("Bitte gib eine E-Mail-Adresse ein."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
      setAddFehler("Bitte gib eine gültige E-Mail-Adresse ein."); return;
    }
    setAdding(true);
    const result = await createKlientin({
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      notizen: newNotizen.trim() || undefined,
    });
    setAdding(false);
    if (result.success) {
      Alert.alert("Klientin angelegt ✨", `${newName.trim()} wurde erfolgreich angelegt.`);
      setNewName(""); setNewEmail(""); setNewNotizen(""); setShowAdd(false); setAddFehler("");
      await loadKlientinnen();
    } else {
      setAddFehler(result.error === "exists" ? "Diese E-Mail ist bereits registriert." : (result.error || "Fehler beim Anlegen."));
    }
  };

  const handleDeleteKlientin = (klientin: Klientin) => {
    Alert.alert(
      "Klientin entfernen",
      `${klientin.name} (${klientin.email}) und alle zugehörigen PDFs wirklich löschen?`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen", style: "destructive",
          onPress: async () => {
            const ok = await deleteKlientin(klientin.id);
            if (ok) {
              await loadKlientinnen();
              if (selectedKlientin?.id === klientin.id) {
                setSelectedKlientin(null);
                setPdfs([]);
              }
            } else {
              Alert.alert("Fehler", "Klientin konnte nicht gelöscht werden.");
            }
          },
        },
      ]
    );
  };

  const handleSelectKlientin = async (klientin: Klientin) => {
    setSelectedKlientin(klientin);
    await loadPdfs(klientin.id);
  };

  const handleUploadPdf = async () => {
    if (!selectedKlientin) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const file = result.assets[0];
      if (file.size && file.size > 50 * 1024 * 1024) {
        Alert.alert("Datei zu groß", "Maximale Dateigröße: 50 MB");
        return;
      }
      setUploading(true);
      const apiBase = API_URL();
      const uploadUrl = `${apiBase}/api/upload-pdf`;

      if (Platform.OS === "web") {
        const resp = await fetch(file.uri);
        const blob = await resp.blob();
        const formData = new FormData();
        formData.append("file", blob, file.name);
        formData.append("klientinId", String(selectedKlientin.id));
        formData.append("titel", file.name.replace(/\.pdf$/i, ""));
        const uploadResp = await fetch(uploadUrl, { method: "POST", body: formData });
        const responseText = await uploadResp.text();
        if (!uploadResp.ok) {
          Alert.alert("Upload fehlgeschlagen", `Server-Fehler (${uploadResp.status})`);
          setUploading(false);
          return;
        }
        let uploadResult;
        try { uploadResult = JSON.parse(responseText); } catch {
          Alert.alert("Upload fehlgeschlagen", "Ungültige Server-Antwort");
          setUploading(false);
          return;
        }
        if (uploadResult.success) {
          Alert.alert("PDF hochgeladen ✓", `"${file.name}" wurde für ${selectedKlientin.name} hochgeladen.`);
          await loadPdfs(selectedKlientin.id);
        } else {
          Alert.alert("Upload fehlgeschlagen", uploadResult.error || "Unbekannter Fehler");
        }
      } else {
        // Native: use FileSystem.uploadAsync
        const uploadResult = await FileSystem.uploadAsync(uploadUrl, file.uri, {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "file",
          mimeType: "application/pdf",
          parameters: {
            klientinId: String(selectedKlientin.id),
            titel: file.name.replace(/\.pdf$/i, ""),
          },
        });
        if (uploadResult.status !== 200) {
          Alert.alert("Upload fehlgeschlagen", `Server-Fehler (${uploadResult.status})`);
          setUploading(false);
          return;
        }
        let parsed;
        try { parsed = JSON.parse(uploadResult.body); } catch {
          Alert.alert("Upload fehlgeschlagen", "Ungültige Server-Antwort");
          setUploading(false);
          return;
        }
        if (parsed.success) {
          Alert.alert("PDF hochgeladen ✓", `"${file.name}" wurde für ${selectedKlientin.name} hochgeladen.`);
          await loadPdfs(selectedKlientin.id);
        } else {
          Alert.alert("Upload fehlgeschlagen", parsed.error || "Unbekannter Fehler");
        }
      }
      setUploading(false);
    } catch (err: any) {
      if (err.message !== "User canceled document picker") {
        Alert.alert("Fehler", err.message || "Datei konnte nicht ausgewählt werden.");
      }
      setUploading(false);
    }
  };

  const handleOpenPdf = async (pdf: KlientinPdf) => {
    try {
      if (Platform.OS === "web") {
        window.open(pdf.pdfUrl, "_blank");
      } else {
        await WebBrowser.openBrowserAsync(pdf.pdfUrl, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
          controlsColor: C.rose,
        });
      }
    } catch {
      Alert.alert("Fehler", "PDF konnte nicht geöffnet werden.");
    }
  };

  const handleDeletePdf = (pdf: KlientinPdf) => {
    Alert.alert(
      "PDF löschen",
      `"${pdf.titel}" wirklich löschen?`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen", style: "destructive",
          onPress: async () => {
            const ok = await deletePdf(pdf.id);
            if (ok && selectedKlientin) {
              await loadPdfs(selectedKlientin.id);
            } else if (!ok) {
              Alert.alert("Fehler", "PDF konnte nicht gelöscht werden.");
            }
          },
        },
      ]
    );
  };

  const filteredKlientinnen = klientinnen.filter(k =>
    k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Klientin-Detail-Ansicht (PDFs) ──
  if (selectedKlientin) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity
              onPress={() => { setSelectedKlientin(null); setPdfs([]); }}
              style={s.backBtn}
              activeOpacity={0.8}
            >
              <Text style={[s.backBtnText, { color: C.rose }]}>← Zurück</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>{selectedKlientin.name}</Text>
            <Text style={s.headerSub}>{selectedKlientin.email}</Text>
            {selectedKlientin.notizen ? (
              <Text style={[s.headerSub, { marginTop: 4, fontStyle: "italic" }]}>
                {selectedKlientin.notizen}
              </Text>
            ) : null}
          </View>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
            {/* Upload Button */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Seelenjournal-Berichte</Text>
              <Text style={s.sectionHint}>
                Lade PDF-Formulare und Berichte für {selectedKlientin.name} hoch.
              </Text>

              <TouchableOpacity
                style={[s.uploadBtn, uploading && { opacity: 0.6 }]}
                onPress={handleUploadPdf}
                activeOpacity={0.85}
                disabled={uploading}
              >
                {uploading ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <ActivityIndicator size="small" color="#FFF" />
                    <Text style={s.uploadBtnText}>PDF wird hochgeladen...</Text>
                  </View>
                ) : (
                  <Text style={s.uploadBtnText}>+ PDF hochladen</Text>
                )}
              </TouchableOpacity>

              {/* PDFs */}
              {loadingPdfs ? (
                <View style={{ alignItems: "center", padding: 20 }}>
                  <ActivityIndicator size="small" color={C.sage} />
                  <Text style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>PDFs werden geladen...</Text>
                </View>
              ) : pdfs.length === 0 ? (
                <View style={{ alignItems: "center", padding: 20 }}>
                  <Text style={{ fontSize: 40, marginBottom: 8 }}>📄</Text>
                  <Text style={{ fontSize: 14, color: C.muted, textAlign: "center" }}>
                    Noch keine PDFs für {selectedKlientin.name} hochgeladen.
                  </Text>
                </View>
              ) : (
                <View style={{ marginTop: 12 }}>
                  {pdfs.map(pdf => (
                    <View key={pdf.id} style={s.pdfRow}>
                      <TouchableOpacity
                        style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}
                        onPress={() => handleOpenPdf(pdf)}
                        activeOpacity={0.7}
                      >
                        <View style={s.pdfIcon}>
                          <Text style={{ fontSize: 18 }}>📄</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.pdfTitel} numberOfLines={1}>{pdf.titel}</Text>
                          <Text style={s.pdfDate}>
                            {new Date(pdf.createdAt).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 14, color: C.sage }}>Öffnen ›</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeletePdf(pdf)}
                        style={s.deleteBtn}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 12, color: "#C87C82" }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </ScreenContainer>
    );
  }

  // ── Hauptansicht: Klientinnen-Liste ──
  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.header}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
              <Text style={[s.backBtnText, { color: C.rose }]}>← Zurück</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
              <Text style={{ fontSize: 14, color: C.muted }}>Abmelden</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.headerTitle}>Seelenjournal Admin</Text>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          {/* Suchfeld */}
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <TextInput
              style={s.searchInput}
              placeholder="Klientin suchen..."
              placeholderTextColor={C.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>

          {/* Neue Klientin anlegen */}
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            <TouchableOpacity
              style={s.addBtn}
              onPress={() => setShowAdd(!showAdd)}
              activeOpacity={0.85}
            >
              <Text style={s.addBtnText}>{showAdd ? "✕ Schließen" : "+ Neue Klientin anlegen"}</Text>
            </TouchableOpacity>
          </View>

          {showAdd && (
            <View style={s.formBox}>
              <Text style={s.formLabel}>Name *</Text>
              <TextInput
                style={s.formInput}
                placeholder="z.B. Sarah Müller"
                placeholderTextColor={C.muted}
                value={newName}
                onChangeText={t => { setNewName(t); setAddFehler(""); }}
                autoCapitalize="words"
                returnKeyType="next"
              />
              <Text style={s.formLabel}>E-Mail-Adresse *</Text>
              <TextInput
                style={s.formInput}
                placeholder="sarah@beispiel.de"
                placeholderTextColor={C.muted}
                value={newEmail}
                onChangeText={t => { setNewEmail(t); setAddFehler(""); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
              <Text style={s.formLabel}>Notizen (optional)</Text>
              <TextInput
                style={[s.formInput, { height: 60, textAlignVertical: "top" }]}
                placeholder="z.B. Seelenreset-Klientin seit März 2026"
                placeholderTextColor={C.muted}
                value={newNotizen}
                onChangeText={t => { setNewNotizen(t); setAddFehler(""); }}
                multiline
                returnKeyType="done"
              />
              {addFehler !== "" && <Text style={s.formError}>{addFehler}</Text>}
              <TouchableOpacity
                style={[s.submitBtn, adding && { opacity: 0.6 }]}
                onPress={handleAddKlientin}
                activeOpacity={0.85}
                disabled={adding}
              >
                {adding ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <ActivityIndicator size="small" color="#FFF" />
                    <Text style={s.submitBtnText}>Wird angelegt...</Text>
                  </View>
                ) : (
                  <Text style={s.submitBtnText}>Klientin anlegen ✨</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Klientinnen-Liste */}
          {loading ? (
            <View style={{ alignItems: "center", padding: 40 }}>
              <ActivityIndicator size="large" color={C.sage} />
              <Text style={{ fontSize: 14, color: C.muted, marginTop: 12 }}>Klientinnen werden geladen...</Text>
            </View>
          ) : filteredKlientinnen.length === 0 ? (
            <View style={{ alignItems: "center", padding: 40 }}>
              <Text style={{ fontSize: 14, color: C.muted }}>
                {searchQuery ? "Keine Klientinnen gefunden." : "Noch keine Klientinnen angelegt."}
              </Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
              <Text style={{ fontSize: 13, color: C.brownMid, fontWeight: "600", marginBottom: 8 }}>
                {filteredKlientinnen.length} Klientin{filteredKlientinnen.length !== 1 ? "nen" : ""}
              </Text>
              {filteredKlientinnen.map(k => (
                <TouchableOpacity
                  key={k.id}
                  style={s.klientinRow}
                  onPress={() => handleSelectKlientin(k)}
                  activeOpacity={0.7}
                >
                  <View style={s.klientinAvatar}>
                    <Text style={{ fontSize: 14, color: "#FFF", fontWeight: "700" }}>
                      {k.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.klientinName}>{k.name}</Text>
                    <Text style={s.klientinEmail}>{k.email}</Text>
                    {k.notizen ? (
                      <Text style={s.klientinNotizen} numberOfLines={1}>{k.notizen}</Text>
                    ) : null}
                  </View>
                  <Text style={{ fontSize: 18, color: C.muted }}>›</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteKlientin(k)}
                    style={s.deleteBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 12, color: "#C87C82" }}>✕</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: C.sageLight, padding: 20, paddingTop: 24 },
  backBtn: { marginBottom: 8 },
  backBtnText: { fontSize: 15, fontWeight: "600" },
  headerTitle: { fontSize: 24, fontWeight: "700", color: C.brown },
  headerSub: { fontSize: 13, color: C.muted, marginTop: 4 },

  searchInput: {
    backgroundColor: C.card, borderRadius: 14, padding: 14, fontSize: 15,
    color: C.brown, borderWidth: 1, borderColor: C.border,
  },

  addBtn: {
    backgroundColor: C.sage, borderRadius: 14, paddingVertical: 14,
    alignItems: "center", marginTop: 8,
  },
  addBtnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },

  formBox: {
    marginHorizontal: 16, marginTop: 12, backgroundColor: C.sageLight,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border,
  },
  formLabel: { fontSize: 12, color: C.brownMid, fontWeight: "600", marginBottom: 4, marginTop: 4 },
  formInput: {
    backgroundColor: C.card, borderRadius: 10, padding: 12, fontSize: 14,
    color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 6,
  },
  formError: { fontSize: 12, color: "#C87C82", marginBottom: 8 },
  submitBtn: { backgroundColor: C.sage, borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 4 },
  submitBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },

  klientinRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: C.card,
    borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: C.border,
  },
  klientinAvatar: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: C.sage,
    alignItems: "center", justifyContent: "center", marginRight: 12,
  },
  klientinName: { fontSize: 15, fontWeight: "700", color: C.brown },
  klientinEmail: { fontSize: 12, color: C.muted },
  klientinNotizen: { fontSize: 11, color: C.gold, fontStyle: "italic", marginTop: 2 },

  deleteBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: C.surface,
    alignItems: "center", justifyContent: "center", marginLeft: 8,
    borderWidth: 1, borderColor: C.border,
  },

  section: {
    margin: 16, backgroundColor: C.card, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: C.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 6 },
  sectionHint: { fontSize: 12, color: C.muted, lineHeight: 18, marginBottom: 12 },

  uploadBtn: {
    backgroundColor: C.sage, borderRadius: 12, paddingVertical: 12,
    alignItems: "center",
  },
  uploadBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },

  pdfRow: {
    flexDirection: "row", alignItems: "center", backgroundColor: C.surface,
    borderRadius: 12, padding: 12, marginBottom: 6, borderWidth: 1, borderColor: C.border,
  },
  pdfIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: C.sageLight,
    alignItems: "center", justifyContent: "center",
  },
  pdfTitel: { fontSize: 14, fontWeight: "600", color: C.brown },
  pdfDate: { fontSize: 11, color: C.muted, marginTop: 2 },
});
