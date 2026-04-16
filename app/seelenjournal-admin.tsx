import { useState, useEffect, useCallback } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView,
  ActivityIndicator, Alert, Modal, Platform, KeyboardAvoidingView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "@/constants/oauth";

const C = {
  bg: "#FAF6F0", card: "#FFFFFF", rose: "#C4897B", roseLight: "#F9EDE8",
  sage: "#8FAF8E", sageLight: "#E8F0E8", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", gold: "#C9A96E",
};

const CATEGORIES = ["Aura Reading", "Seelenplan", "Energie-Update", "Persönliches"];

type Client = {
  id: number; email: string; name: string; isActive: number;
  readingDate: string | null; internalNote: string | null; createdAt: string;
  unreadMessages: number;
};

type Entry = {
  id: number; title: string; content: string | null; category: string | null;
  date: string; isPublished: number; attachments: any[];
};

type Message = {
  id: number; content: string; fromAdmin: number; isRead: number; createdAt: string;
};

export default function SeelenjournalAdminScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Data
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Views
  const [activeView, setActiveView] = useState<"clients" | "entries" | "messages">("clients");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Modals
  const [showClientModal, setShowClientModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formReadingDate, setFormReadingDate] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formPublished, setFormPublished] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<any[]>([]);

  async function getToken() {
    return AsyncStorage.getItem("sj_admin_token");
  }

  async function apiCall(path: string, options?: RequestInit & { timeoutMs?: number }) {
    const token = await getToken();
    const apiBase = getApiBaseUrl();
    const controller = new AbortController();
    const timeoutMs = options?.timeoutMs || 20000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${apiBase}/api/seelenjournal${path}`, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options?.headers || {}),
        },
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok && data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error("Zeitüberschreitung – bitte versuche es erneut.");
      }
      throw err;
    }
  }

  // ── Login ──
  async function handleAdminLogin() {
    if (!adminEmail.trim() || !adminPassword.trim()) return;
    setLoginLoading(true);
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/seelenjournal/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail.trim(), password: adminPassword.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        await AsyncStorage.setItem("sj_admin_token", data.token);
        setIsLoggedIn(true);
        loadClients();
      } else {
        Alert.alert("Fehler", data.error || "Login fehlgeschlagen");
      }
    } catch (err) {
      Alert.alert("Fehler", "Verbindung fehlgeschlagen");
    } finally {
      setLoginLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("sj_admin_token");
      if (token) { setIsLoggedIn(true); loadClients(); }
    })();
  }, []);

  // ── Klientinnen laden ──
  async function loadClients() {
    setLoading(true);
    try {
      const data = await apiCall("/admin/clients");
      setClients(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  // ── Klientin erstellen/bearbeiten ──
  function openClientModal(client?: Client) {
    if (client) {
      setEditingClient(client);
      setFormName(client.name);
      setFormEmail(client.email);
      setFormPassword("");
      setFormReadingDate(client.readingDate ? client.readingDate.split("T")[0] : "");
      setFormNote(client.internalNote || "");
    } else {
      setEditingClient(null);
      setFormName(""); setFormEmail(""); setFormPassword("");
      setFormReadingDate(""); setFormNote("");
    }
    setShowClientModal(true);
  }

  const [saving, setSaving] = useState(false);

  async function saveClient() {
    if (!formName.trim() || !formEmail.trim()) {
      Alert.alert("Fehler", "Name und E-Mail sind erforderlich"); return;
    }
    if (saving) return;
    setSaving(true);
    try {
      if (editingClient) {
        const body: any = { name: formName.trim(), internalNote: formNote.trim() || null };
        if (formPassword.trim()) body.password = formPassword.trim();
        if (formReadingDate) body.readingDate = formReadingDate;
        await apiCall(`/admin/clients/${editingClient.id}`, { method: "PUT", body: JSON.stringify(body) });
        Alert.alert("Erfolg", "Klientin aktualisiert");
      } else {
        if (!formPassword.trim()) { setSaving(false); Alert.alert("Fehler", "Passwort erforderlich"); return; }
        const result = await apiCall("/admin/clients", {
          method: "POST",
          timeoutMs: 25000,
          body: JSON.stringify({
            email: formEmail.trim(), password: formPassword.trim(), name: formName.trim(),
            readingDate: formReadingDate || null, internalNote: formNote.trim() || null,
          }),
        });
        if (result?.success) {
          Alert.alert("Erfolg", `Klientin "${formName.trim()}" wurde angelegt`);
        } else {
          Alert.alert("Fehler", result?.error || "Klientin konnte nicht angelegt werden");
          setSaving(false);
          return;
        }
      }
      setShowClientModal(false);
      loadClients();
    } catch (err: any) {
      console.error("saveClient error:", err);
      Alert.alert("Fehler", err.message || "Speichern fehlgeschlagen – bitte versuche es erneut.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleClientActive(client: Client) {
    await apiCall(`/admin/clients/${client.id}`, {
      method: "PUT", body: JSON.stringify({ isActive: client.isActive === 1 ? 0 : 1 }),
    });
    loadClients();
  }

  async function deleteClient(client: Client) {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(`${client.name} und alle zugehörigen Daten werden unwiderruflich gelöscht. Wirklich löschen?`);
      if (!confirmed) return;
      try {
        await apiCall(`/admin/clients/${client.id}`, { method: "DELETE" });
        loadClients();
      } catch (err: any) {
        alert("Fehler beim Löschen: " + (err.message || "Unbekannter Fehler"));
      }
    } else {
      Alert.alert("Klientin löschen?", `${client.name} und alle zugehörigen Daten werden unwiderruflich gelöscht.`, [
        { text: "Abbrechen" },
        { text: "Löschen", style: "destructive", onPress: async () => {
          try {
            await apiCall(`/admin/clients/${client.id}`, { method: "DELETE" });
            loadClients();
          } catch (err: any) {
            Alert.alert("Fehler", err.message || "Löschen fehlgeschlagen");
          }
        }},
      ]);
    }
  }

  // ── Einträge ──
  async function loadEntries(clientId: number) {
    try {
      const data = await apiCall(`/admin/clients/${clientId}/entries`);
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  }

  function openEntryModal(entry?: Entry) {
    if (entry) {
      setEditingEntry(entry);
      setFormTitle(entry.title);
      setFormContent(entry.content || "");
      setFormCategory(entry.category || "");
      setFormDate(entry.date ? entry.date.split("T")[0] : "");
      setFormPublished(entry.isPublished === 1);
    } else {
      setEditingEntry(null);
      setFormTitle(""); setFormContent(""); setFormCategory("");
      setFormDate(new Date().toISOString().split("T")[0]); setFormPublished(false);
    }
    setPendingFiles([]);
    setShowEntryModal(true);
  }

  async function saveEntry() {
    if (!formTitle.trim() || !selectedClient) {
      Alert.alert("Fehler", "Titel ist erforderlich"); return;
    }
    try {
      let entryId: number;
      if (editingEntry) {
        await apiCall(`/admin/entries/${editingEntry.id}`, {
          method: "PUT",
          body: JSON.stringify({
            title: formTitle.trim(), content: formContent.trim() || null,
            category: formCategory || null, date: formDate || null,
            isPublished: formPublished ? 1 : 0,
          }),
        });
        entryId = editingEntry.id;
      } else {
        const result = await apiCall(`/admin/clients/${selectedClient.id}/entries`, {
          method: "POST",
          body: JSON.stringify({
            title: formTitle.trim(), content: formContent.trim() || null,
            category: formCategory || null, date: formDate || null,
            isPublished: formPublished ? 1 : 0,
          }),
        });
        entryId = result.id;
      }

      // Pending Files hochladen (aus dem Modal)
      if (pendingFiles.length > 0 && entryId) {
        setUploading(true);
        try {
          const token = await getToken();
          const formData = new FormData();
          for (const f of pendingFiles) {
            formData.append("file", f);
          }
          formData.append("entryId", String(entryId));
          await fetch(`${getApiBaseUrl()}/api/seelenjournal/admin/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
        } catch (uploadErr) {
          console.error("Upload nach Speichern fehlgeschlagen:", uploadErr);
        } finally {
          setUploading(false);
        }
      }

      setPendingFiles([]);
      setShowEntryModal(false);
      loadEntries(selectedClient.id);
    } catch (err) { Alert.alert("Fehler", "Speichern fehlgeschlagen"); }
  }

  // Dateien im Modal auswählen (noch nicht hochladen)
  function pickFilesForModal() {
    if (Platform.OS === "web") {
      const fileInput = document.getElementById("sj-modal-file-input") as HTMLInputElement;
      if (fileInput) { fileInput.value = ""; fileInput.click(); }
    } else {
      DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
        copyToCacheDirectory: true,
        multiple: true,
      }).then((result) => {
        if (!result.canceled && result.assets?.length) {
          setPendingFiles(prev => [...prev, ...result.assets!]);
        }
      });
    }
  }

  function handleModalFileSelect(event: any) {
    const fileList = event?.target?.files;
    if (!fileList || fileList.length === 0) return;
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    const newFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      if (allowedTypes.includes(fileList[i].type)) newFiles.push(fileList[i]);
    }
    if (newFiles.length > 0) setPendingFiles(prev => [...prev, ...newFiles]);
  }

  async function deleteEntry(entry: Entry) {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Dieser Eintrag wird unwiderruflich gelöscht. Wirklich löschen?");
      if (!confirmed) return;
      try {
        await apiCall(`/admin/entries/${entry.id}`, { method: "DELETE" });
        if (selectedClient) loadEntries(selectedClient.id);
      } catch (err: any) {
        alert("Fehler beim Löschen: " + (err.message || "Unbekannter Fehler"));
      }
    } else {
      Alert.alert("Eintrag löschen?", "Dieser Eintrag wird unwiderruflich gelöscht.", [
        { text: "Abbrechen" },
        { text: "Löschen", style: "destructive", onPress: async () => {
          try {
            await apiCall(`/admin/entries/${entry.id}`, { method: "DELETE" });
            if (selectedClient) loadEntries(selectedClient.id);
          } catch (err: any) {
            Alert.alert("Fehler", err.message || "Löschen fehlgeschlagen");
          }
        }},
      ]);
    }
  }

  // ── PDF/Bild Upload (Multi-Upload) ──
  const [uploadEntryId, setUploadEntryId] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState("");

  async function uploadFileToEntry(entryId: number) {
    if (Platform.OS === "web") {
      // Web: HTML file input benutzen (multiple)
      setUploadEntryId(entryId);
      const fileInput = document.getElementById("sj-file-input") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
        fileInput.click();
      }
      return;
    }
    // Native: DocumentPicker mit multiple
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
        copyToCacheDirectory: true,
        multiple: true,
      });
      if (result.canceled || !result.assets?.length) return;

      const assets = result.assets;
      setUploading(true);
      const token = await getToken();
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        setUploadProgress(`${i + 1} von ${assets.length}: ${asset.name || "Datei"}`);
        try {
          const uploadResult = await FileSystem.uploadAsync(
            `${getApiBaseUrl()}/api/seelenjournal/admin/upload`,
            asset.uri,
            {
              httpMethod: "POST",
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              fieldName: "file",
              parameters: { entryId: String(entryId) },
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = JSON.parse(uploadResult.body);
          if (data.success) { successCount++; } else { failCount++; }
        } catch { failCount++; }
      }

      setUploadProgress("");
      const msg = `${successCount} von ${assets.length} Dateien hochgeladen.` + (failCount > 0 ? ` ${failCount} fehlgeschlagen.` : "");
      Alert.alert("Upload abgeschlossen", msg);
      if (selectedClient) loadEntries(selectedClient.id);
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Fehler", "Dateien konnten nicht hochgeladen werden.");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  }

  // Web: Mehrere Dateien über HTML-Input hochladen
  async function handleWebFileUpload(event: any) {
    const fileList = event?.target?.files;
    if (!fileList || fileList.length === 0 || !uploadEntryId) return;
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

    // Alle Dateien validieren
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      if (allowedTypes.includes(f.type)) {
        files.push(f);
      }
    }
    if (files.length === 0) {
      window.alert("Keine g\u00fcltigen Dateien ausgew\u00e4hlt. Erlaubt: PDF, JPG, PNG, WebP.");
      return;
    }

    setUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      for (const file of files) {
        formData.append("file", file);
      }
      formData.append("entryId", String(uploadEntryId));

      setUploadProgress(`${files.length} Datei${files.length > 1 ? "en" : ""} werden hochgeladen...`);

      const res = await fetch(`${getApiBaseUrl()}/api/seelenjournal/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      setUploadProgress("");

      if (data.success) {
        const msg = `${data.uploaded} von ${data.total} Datei${data.total > 1 ? "en" : ""} erfolgreich hochgeladen.`
          + (data.errors?.length > 0 ? `\n\nFehler:\n${data.errors.join("\n")}` : "");
        window.alert(msg);
        if (selectedClient) loadEntries(selectedClient.id);
      } else {
        window.alert(data.error || "Upload fehlgeschlagen");
      }
    } catch (err) {
      console.error("Web upload error:", err);
      window.alert("Dateien konnten nicht hochgeladen werden.");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  }

  const [togglingId, setTogglingId] = useState<number | null>(null);

  async function togglePublished(entry: Entry) {
    if (togglingId) return; // Verhindere Doppelklick
    setTogglingId(entry.id);
    try {
      const newStatus = entry.isPublished === 1 ? 0 : 1;
      const token = await getToken();
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/seelenjournal/admin/entries/${entry.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        Alert.alert("Fehler", result.error || `Server-Fehler: ${res.status}`);
      } else {
        Alert.alert("Erfolg", newStatus === 1 ? "Eintrag veröffentlicht! E-Mail wird gesendet." : "Eintrag zurückgezogen.");
      }
      if (selectedClient) await loadEntries(selectedClient.id);
    } catch (err: any) {
      console.error("togglePublished error:", err);
      Alert.alert("Fehler", `Status konnte nicht geändert werden: ${err.message || "Netzwerkfehler"}`);
    } finally {
      setTogglingId(null);
    }
  }

  // ── Nachrichten ──
  async function loadMessages(clientId: number) {
    try {
      const data = await apiCall(`/admin/clients/${clientId}/messages`);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedClient) return;
    await apiCall(`/admin/clients/${selectedClient.id}/messages`, {
      method: "POST", body: JSON.stringify({ content: newMessage.trim() }),
    });
    setNewMessage("");
    loadMessages(selectedClient.id);
  }

  // ── Navigation ──
  function selectClient(client: Client, view: "entries" | "messages") {
    setSelectedClient(client);
    setActiveView(view);
    if (view === "entries") loadEntries(client.id);
    if (view === "messages") loadMessages(client.id);
  }

  function goBackToClients() {
    setActiveView("clients");
    setSelectedClient(null);
    loadClients();
  }

  // ── Filtered clients ──
  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  // ══════════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ══════════════════════════════════════════════════════════════
  if (!isLoggedIn) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} style={{ backgroundColor: C.bg }}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={s.backBtnText}>← Zurück</Text>
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 24 }}>
              <Text style={s.adminTitle}>Seelenjournal Admin</Text>
              <Text style={s.adminSub}>Zugang nur für die Seelenplanerin</Text>
              <View style={s.formCard}>
                <Text style={s.label}>E-Mail</Text>
                <TextInput style={s.input} value={adminEmail} onChangeText={setAdminEmail}
                  placeholder="lara@..." autoCapitalize="none" keyboardType="email-address" placeholderTextColor={C.muted} />
                <Text style={s.label}>Passwort</Text>
                <TextInput style={s.input} value={adminPassword} onChangeText={setAdminPassword}
                  placeholder="Admin-Passwort" secureTextEntry placeholderTextColor={C.muted}
                  returnKeyType="done" onSubmitEditing={handleAdminLogin} />
                <TouchableOpacity style={s.primaryBtn} onPress={handleAdminLogin} disabled={loginLoading} activeOpacity={0.85}>
                  {loginLoading ? <ActivityIndicator color="#FFF" /> : <Text style={s.primaryBtnText}>Anmelden</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // EINTRÄGE-ANSICHT
  // ══════════════════════════════════════════════════════════════
  if (activeView === "entries" && selectedClient) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          <View style={s.navBar}>
            <TouchableOpacity onPress={goBackToClients}><Text style={s.navBack}>← Klientinnen</Text></TouchableOpacity>
            <Text style={s.navTitle} numberOfLines={1}>{selectedClient.name}</Text>
            <TouchableOpacity onPress={() => selectClient(selectedClient, "messages")}>
              <Text style={s.navAction}>💌</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={s.addBtn} onPress={() => openEntryModal()} activeOpacity={0.85}>
            <Text style={s.addBtnText}>+ Neuer Eintrag</Text>
          </TouchableOpacity>
          <FlatList
            data={entries}
            keyExtractor={i => String(i.id)}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={s.entryAdminCard}>
                <View style={s.entryAdminHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.entryAdminTitle}>{item.title}</Text>
                    <Text style={s.entryAdminMeta}>
                      {item.category || "Keine Kategorie"} · {item.date?.split("T")[0]}
                    </Text>
                  </View>
                  <View style={[s.statusBadge, item.isPublished === 1 ? s.statusPublished : s.statusDraft]}>
                    <Text style={s.statusText}>{item.isPublished === 1 ? "Veröffentlicht" : "Entwurf"}</Text>
                  </View>
                </View>
                {/* Anhänge anzeigen */}
                {item.attachments && item.attachments.length > 0 && (
                  <View style={{ marginTop: 8, marginBottom: 4 }}>
                    {item.attachments.map((att: any) => (
                      <Text key={att.id} style={{ fontSize: 12, color: C.sage, marginBottom: 2 }}>
                        📎 {att.filename} ({att.type})
                      </Text>
                    ))}
                  </View>
                )}
                <View style={s.entryAdminActions}>
                  <TouchableOpacity style={[s.actionBtn, { backgroundColor: C.sageLight }]} onPress={() => uploadFileToEntry(item.id)} disabled={uploading}>
                    <Text style={s.actionBtnText}>{uploading ? "⏳..." : "📄 Dateien hochladen"}</Text>
                  </TouchableOpacity>
                  {uploading && uploadProgress ? (
                    <Text style={{ fontSize: 11, color: C.sage, marginLeft: 4, alignSelf: "center" }}>{uploadProgress}</Text>
                  ) : null}
                  <TouchableOpacity
                    style={[s.actionBtn, togglingId === item.id && { opacity: 0.5 }]}
                    onPress={() => togglePublished(item)}
                    disabled={togglingId !== null}
                  >
                    <Text style={s.actionBtnText}>
                      {togglingId === item.id ? "⏳..." : (item.isPublished === 1 ? "Zurückziehen" : "Veröffentlichen")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionBtn} onPress={() => openEntryModal(item)}>
                    <Text style={s.actionBtnText}>Bearbeiten</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.actionBtn, { borderColor: "#EF4444" }]} onPress={() => deleteEntry(item)}>
                    <Text style={[s.actionBtnText, { color: "#EF4444" }]}>Löschen</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={s.emptyText}>Noch keine Einträge für diese Klientin.</Text>}
          />

          {/* Hidden file input for web multi-upload */}
          {Platform.OS === "web" && (
            <input
              id="sj-file-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              multiple
              style={{ display: "none" } as any}
              onChange={handleWebFileUpload as any}
            />
          )}

          {/* Entry Modal */}
          <Modal visible={showEntryModal} animationType="slide" transparent>
            <View style={s.modalOverlay}>
              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.modalContainer}>
                <ScrollView style={s.modalScroll}>
                  <Text style={s.modalTitle}>{editingEntry ? "Eintrag bearbeiten" : "Neuer Eintrag"}</Text>
                  <Text style={s.label}>Titel *</Text>
                  <TextInput style={s.input} value={formTitle} onChangeText={setFormTitle} placeholder="z.B. Deine Aura-Analyse" placeholderTextColor={C.muted} />
                  <Text style={s.label}>Kategorie</Text>
                  <View style={s.categoryRow}>
                    {CATEGORIES.map(cat => (
                      <TouchableOpacity key={cat} style={[s.catChip, formCategory === cat && s.catChipActive]}
                        onPress={() => setFormCategory(formCategory === cat ? "" : cat)}>
                        <Text style={[s.catChipText, formCategory === cat && s.catChipTextActive]}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={s.label}>Datum</Text>
                  <TextInput style={s.input} value={formDate} onChangeText={setFormDate} placeholder="YYYY-MM-DD" placeholderTextColor={C.muted} />
                  <Text style={s.label}>Inhalt</Text>
                  <TextInput style={[s.input, { height: 150, textAlignVertical: "top" }]} value={formContent}
                    onChangeText={setFormContent} placeholder="Freitext..." multiline placeholderTextColor={C.muted} />
                  {/* Dateien anhängen */}
                  <Text style={s.label}>Dateien anhängen</Text>
                  <TouchableOpacity
                    style={[s.input, { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14 }]}
                    onPress={pickFilesForModal}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: C.sage, fontWeight: "600", fontSize: 15 }}>📎 PDFs / Bilder auswählen</Text>
                  </TouchableOpacity>
                  {pendingFiles.length > 0 && (
                    <View style={{ marginTop: 8, marginBottom: 4 }}>
                      {pendingFiles.map((f: any, idx: number) => (
                        <View key={idx} style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                          <Text style={{ flex: 1, fontSize: 13, color: C.brown }}>📄 {f.name || f.originalname || `Datei ${idx + 1}`}</Text>
                          <TouchableOpacity onPress={() => setPendingFiles(prev => prev.filter((_, i) => i !== idx))}>
                            <Text style={{ color: "#EF4444", fontSize: 16, paddingHorizontal: 8 }}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                  {/* Hidden file input for modal (web) */}
                  {Platform.OS === "web" && (
                    <input
                      id="sj-modal-file-input"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      multiple
                      style={{ display: "none" } as any}
                      onChange={handleModalFileSelect as any}
                    />
                  )}

                  <TouchableOpacity style={s.toggleRow} onPress={() => setFormPublished(!formPublished)}>
                    <View style={[s.toggle, formPublished && s.toggleActive]}>
                      <View style={[s.toggleDot, formPublished && s.toggleDotActive]} />
                    </View>
                    <Text style={s.toggleLabel}>Sofort veröffentlichen</Text>
                  </TouchableOpacity>
                  <View style={s.modalActions}>
                    <TouchableOpacity style={s.cancelBtn} onPress={() => setShowEntryModal(false)}>
                      <Text style={s.cancelBtnText}>Abbrechen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.primaryBtn} onPress={saveEntry}>
                      <Text style={s.primaryBtnText}>Speichern</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </Modal>
        </View>
      </ScreenContainer>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // NACHRICHTEN-ANSICHT
  // ══════════════════════════════════════════════════════════════
  if (activeView === "messages" && selectedClient) {
    return (
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={s.navBar}>
            <TouchableOpacity onPress={goBackToClients}><Text style={s.navBack}>← Zurück</Text></TouchableOpacity>
            <Text style={s.navTitle} numberOfLines={1}>💌 {selectedClient.name}</Text>
            <TouchableOpacity onPress={() => selectClient(selectedClient, "entries")}>
              <Text style={s.navAction}>📖</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={messages}
            keyExtractor={i => String(i.id)}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => {
              const isAdmin = item.fromAdmin === 1;
              return (
                <View style={[s.msgRow, isAdmin ? { alignItems: "flex-end" } : { alignItems: "flex-start" }]}>
                  <View style={[s.msgBubble, isAdmin ? s.msgBubbleAdmin : s.msgBubbleClient]}>
                    <Text style={[s.msgText, isAdmin ? { color: "#FFF" } : { color: C.brown }]}>{item.content}</Text>
                    <Text style={[s.msgTime, isAdmin ? { color: "rgba(255,255,255,0.7)" } : { color: C.muted }]}>
                      {new Date(item.createdAt).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </Text>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={<Text style={s.emptyText}>Noch keine Nachrichten.</Text>}
          />
          <View style={s.inputBar}>
            <TextInput style={s.msgInput} value={newMessage} onChangeText={setNewMessage}
              placeholder="Nachricht an Klientin..." multiline maxLength={2000} placeholderTextColor={C.muted} />
            <TouchableOpacity style={[s.sendBtn, !newMessage.trim() && { opacity: 0.4 }]}
              onPress={sendMessage} disabled={!newMessage.trim()}>
              <Text style={s.sendBtnText}>↑</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // KLIENTINNEN-ÜBERSICHT (Standard)
  // ══════════════════════════════════════════════════════════════
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={s.navBar}>
          <TouchableOpacity onPress={() => router.back()}><Text style={s.navBack}>← Zurück</Text></TouchableOpacity>
          <Text style={s.navTitle}>Seelenjournal Admin</Text>
          <TouchableOpacity onPress={async () => {
            await AsyncStorage.removeItem("sj_admin_token");
            setIsLoggedIn(false);
          }}><Text style={s.navAction}>Abmelden</Text></TouchableOpacity>
        </View>

        {/* Suchleiste */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <TextInput style={s.searchInput} value={search} onChangeText={setSearch}
            placeholder="Klientin suchen..." placeholderTextColor={C.muted} />
        </View>

        <TouchableOpacity style={s.addBtn} onPress={() => openClientModal()} activeOpacity={0.85}>
          <Text style={s.addBtnText}>+ Neue Klientin anlegen</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={C.rose} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filteredClients}
            keyExtractor={i => String(i.id)}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={s.clientCard}>
                <View style={s.clientHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.clientName}>{item.name}</Text>
                    <Text style={s.clientEmail}>{item.email}</Text>
                    {item.readingDate && (
                      <Text style={s.clientMeta}>Reading: {item.readingDate.split("T")[0]}</Text>
                    )}
                    {item.internalNote && (
                      <Text style={s.clientNote}>📝 {item.internalNote}</Text>
                    )}
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <View style={[s.activeBadge, item.isActive === 1 ? s.activeBadgeOn : s.activeBadgeOff]}>
                      <Text style={s.activeBadgeText}>{item.isActive === 1 ? "Aktiv" : "Inaktiv"}</Text>
                    </View>
                    {item.unreadMessages > 0 && (
                      <View style={s.unreadBadge}>
                        <Text style={s.unreadBadgeText}>{item.unreadMessages} 💌</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={s.clientActions}>
                  <TouchableOpacity style={s.actionBtn} onPress={() => selectClient(item, "entries")}>
                    <Text style={s.actionBtnText}>📖 Einträge</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionBtn} onPress={() => selectClient(item, "messages")}>
                    <Text style={s.actionBtnText}>💌 Nachrichten</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionBtn} onPress={() => openClientModal(item)}>
                    <Text style={s.actionBtnText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionBtn} onPress={() => toggleClientActive(item)}>
                    <Text style={s.actionBtnText}>{item.isActive === 1 ? "⏸" : "▶️"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.actionBtn, { borderColor: "#EF4444", minWidth: 44, minHeight: 44, justifyContent: "center", alignItems: "center" }]}
                    onPress={() => deleteClient(item)}
                    activeOpacity={0.6}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[s.actionBtnText, { color: "#EF4444", fontSize: 18 }]}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={s.emptyText}>Noch keine Klientinnen angelegt.</Text>}
          />
        )}

        {/* Client Modal */}
        <Modal visible={showClientModal} animationType="slide" transparent>
          <View style={s.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.modalContainer}>
              <ScrollView style={s.modalScroll}>
                <Text style={s.modalTitle}>{editingClient ? "Klientin bearbeiten" : "Neue Klientin"}</Text>
                <Text style={s.label}>Name *</Text>
                <TextInput style={s.input} value={formName} onChangeText={setFormName} placeholder="Vorname Nachname" placeholderTextColor={C.muted} />
                <Text style={s.label}>E-Mail *</Text>
                <TextInput style={s.input} value={formEmail} onChangeText={setFormEmail} placeholder="email@..." autoCapitalize="none" keyboardType="email-address" editable={!editingClient} placeholderTextColor={C.muted} />
                <Text style={s.label}>{editingClient ? "Neues Passwort (leer = unverändert)" : "Passwort *"}</Text>
                <TextInput style={s.input} value={formPassword} onChangeText={setFormPassword} placeholder="Passwort" placeholderTextColor={C.muted} />
                <Text style={s.label}>Datum des Aura Readings</Text>
                <TextInput style={s.input} value={formReadingDate} onChangeText={setFormReadingDate} placeholder="YYYY-MM-DD" placeholderTextColor={C.muted} />
                <Text style={s.label}>Interne Notiz (nur für dich)</Text>
                <TextInput style={[s.input, { height: 80, textAlignVertical: "top" }]} value={formNote} onChangeText={setFormNote} placeholder="Notizen..." multiline placeholderTextColor={C.muted} />
                <View style={s.modalActions}>
                  <TouchableOpacity style={s.cancelBtn} onPress={() => setShowClientModal(false)}>
                    <Text style={s.cancelBtnText}>Abbrechen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.primaryBtn, saving && { opacity: 0.6 }]} onPress={saveClient} disabled={saving}>
                    {saving ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={s.primaryBtnText}>Speichern</Text>}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  backBtn: { position: "absolute", top: 16, left: 16, zIndex: 10, padding: 8 },
  backBtnText: { fontSize: 16, color: C.rose, fontWeight: "600" },
  adminTitle: { fontSize: 28, fontWeight: "700", color: C.brown, textAlign: "center", marginBottom: 8 },
  adminSub: { fontSize: 14, color: C.muted, textAlign: "center", marginBottom: 24 },
  formCard: { backgroundColor: C.card, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: C.border },
  label: { fontSize: 13, fontWeight: "600", color: C.brownMid, marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: C.bg, borderRadius: 12, padding: 14, fontSize: 15,
    color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 8,
  },
  primaryBtn: { backgroundColor: C.rose, borderRadius: 14, padding: 16, alignItems: "center", marginTop: 8, flex: 1 },
  primaryBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  cancelBtn: { backgroundColor: C.bg, borderRadius: 14, padding: 16, alignItems: "center", marginTop: 8, flex: 1, marginRight: 8, borderWidth: 1, borderColor: C.border },
  cancelBtnText: { color: C.brownMid, fontSize: 16, fontWeight: "600" },
  navBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  navBack: { fontSize: 15, color: C.rose, fontWeight: "600" },
  navTitle: { fontSize: 17, fontWeight: "700", color: C.brown, flex: 1, textAlign: "center" },
  navAction: { fontSize: 14, color: C.muted },
  searchInput: { backgroundColor: C.card, borderRadius: 12, padding: 12, fontSize: 15, color: C.brown, borderWidth: 1, borderColor: C.border },
  addBtn: { marginHorizontal: 16, marginVertical: 8, backgroundColor: C.sage, borderRadius: 12, padding: 14, alignItems: "center" },
  addBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  clientCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  clientHeader: { flexDirection: "row", justifyContent: "space-between" },
  clientName: { fontSize: 16, fontWeight: "700", color: C.brown },
  clientEmail: { fontSize: 13, color: C.muted, marginTop: 2 },
  clientMeta: { fontSize: 12, color: C.sage, marginTop: 4 },
  clientNote: { fontSize: 12, color: C.gold, marginTop: 4 },
  activeBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  activeBadgeOn: { backgroundColor: C.sageLight },
  activeBadgeOff: { backgroundColor: C.roseLight },
  activeBadgeText: { fontSize: 11, fontWeight: "700", color: C.brownMid },
  unreadBadge: { marginTop: 6, backgroundColor: C.rose, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  unreadBadgeText: { fontSize: 11, fontWeight: "700", color: "#FFF" },
  clientActions: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 },
  actionBtn: { borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  actionBtnText: { fontSize: 12, color: C.brownMid, fontWeight: "600" },
  entryAdminCard: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  entryAdminHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  entryAdminTitle: { fontSize: 16, fontWeight: "700", color: C.brown },
  entryAdminMeta: { fontSize: 12, color: C.muted, marginTop: 4 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusPublished: { backgroundColor: C.sageLight },
  statusDraft: { backgroundColor: C.roseLight },
  statusText: { fontSize: 11, fontWeight: "700", color: C.brownMid },
  entryAdminActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  emptyText: { fontSize: 14, color: C.muted, textAlign: "center", marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContainer: { maxHeight: "85%", backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalScroll: { padding: 24 },
  modalTitle: { fontSize: 22, fontWeight: "700", color: C.brown, marginBottom: 16 },
  modalActions: { flexDirection: "row", marginTop: 16, marginBottom: 32 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  catChip: { borderWidth: 1, borderColor: C.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: C.bg },
  catChipActive: { backgroundColor: C.rose, borderColor: C.rose },
  catChipText: { fontSize: 12, color: C.brownMid },
  catChipTextActive: { color: "#FFF", fontWeight: "700" },
  toggleRow: { flexDirection: "row", alignItems: "center", marginTop: 12, marginBottom: 8 },
  toggle: { width: 48, height: 28, borderRadius: 14, backgroundColor: C.border, justifyContent: "center", paddingHorizontal: 3 },
  toggleActive: { backgroundColor: C.sage },
  toggleDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#FFF" },
  toggleDotActive: { alignSelf: "flex-end" },
  toggleLabel: { fontSize: 14, color: C.brownMid, marginLeft: 10 },
  msgRow: { marginBottom: 10 },
  msgBubble: { maxWidth: "80%", borderRadius: 16, padding: 12 },
  msgBubbleAdmin: { backgroundColor: C.rose, borderBottomRightRadius: 4 },
  msgBubbleClient: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderBottomLeftRadius: 4 },
  msgText: { fontSize: 15, lineHeight: 22 },
  msgTime: { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  inputBar: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.card },
  msgInput: { flex: 1, backgroundColor: C.bg, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: C.brown, maxHeight: 100, borderWidth: 1, borderColor: C.border },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.rose, justifyContent: "center", alignItems: "center", marginLeft: 8 },
  sendBtnText: { color: "#FFF", fontSize: 20, fontWeight: "700" },
});
