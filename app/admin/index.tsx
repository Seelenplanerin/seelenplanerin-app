import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Alert, Platform, FlatList,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { CONTENT_DATA, type ContentItem, type ContentCategory } from "@/lib/content-data";
import * as Haptics from "expo-haptics";

const ADMIN_PIN_KEY = "seelenplanerin_admin_pin";
const DEFAULT_PIN = "1234"; // Lara kann dies ändern

const ADMIN_SECTIONS = [
  { id: "content",   emoji: "📝", title: "Content verwalten",    subtitle: "Rituale, Meditationen, Gedichte, Impulse" },
  { id: "shop",      emoji: "🛍️", title: "Shop-Links",           subtitle: "Tentary & Shopify URLs aktualisieren" },
  { id: "impuls",    emoji: "✨", title: "Tagesimpuls",           subtitle: "Heutigen Impuls manuell setzen" },
  { id: "pin",       emoji: "🔐", title: "PIN ändern",            subtitle: "Admin-Zugangscode ändern" },
];

export default function AdminScreen() {
  const colors = useColors();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [savedPin, setSavedPin] = useState(DEFAULT_PIN);
  const [shopUrl, setShopUrl] = useState("https://dieseelenplanerin.tentary.com/");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [customImpuls, setCustomImpuls] = useState("");
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [customContent, setCustomContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(ADMIN_PIN_KEY).then(pin => {
      if (pin) setSavedPin(pin);
    });
    AsyncStorage.getItem("admin_shop_url").then(url => {
      if (url) setShopUrl(url);
    });
    AsyncStorage.getItem("admin_custom_impuls").then(imp => {
      if (imp) setCustomImpuls(imp);
    });
    AsyncStorage.getItem("admin_custom_content").then(raw => {
      if (raw) setCustomContent(JSON.parse(raw));
    });
  }, []);

  const handleUnlock = () => {
    if (pinInput === savedPin) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsUnlocked(true);
      setPinInput("");
    } else {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Falscher PIN", "Bitte versuche es erneut.");
      setPinInput("");
    }
  };

  const handleSaveShopUrl = async () => {
    await AsyncStorage.setItem("admin_shop_url", shopUrl);
    Alert.alert("Gespeichert ✓", "Shop-URL wurde aktualisiert.");
  };

  const handleSaveImpuls = async () => {
    await AsyncStorage.setItem("admin_custom_impuls", customImpuls);
    Alert.alert("Gespeichert ✓", "Tagesimpuls wurde gesetzt.");
  };

  const handleChangePin = async () => {
    if (newPin.length < 4) {
      Alert.alert("Fehler", "PIN muss mindestens 4 Zeichen haben.");
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert("Fehler", "Die PINs stimmen nicht überein.");
      return;
    }
    await AsyncStorage.setItem(ADMIN_PIN_KEY, newPin);
    setSavedPin(newPin);
    setNewPin("");
    setConfirmPin("");
    Alert.alert("Gespeichert ✓", "PIN wurde erfolgreich geändert.");
  };

  const handleSaveContent = async (item: ContentItem) => {
    const updated = [...customContent];
    const idx = updated.findIndex(c => c.id === item.id);
    if (idx >= 0) updated[idx] = item;
    else updated.push(item);
    setCustomContent(updated);
    await AsyncStorage.setItem("admin_custom_content", JSON.stringify(updated));
    setEditingItem(null);
    Alert.alert("Gespeichert ✓", "Inhalt wurde gespeichert.");
  };

  const s = StyleSheet.create({
    header: {
      paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20,
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    },
    backBtn: { fontSize: 16, color: "#C4826A", fontWeight: "600" },
    headerTitle: { fontSize: 22, fontWeight: "700", color: "#3D2B1F" },
    // PIN Screen
    pinContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
    pinEmoji: { fontSize: 60, marginBottom: 20 },
    pinTitle: { fontSize: 24, fontWeight: "700", color: "#3D2B1F", marginBottom: 8 },
    pinSub: { fontSize: 15, color: "#9C7B6E", textAlign: "center", marginBottom: 32 },
    pinInput: {
      backgroundColor: "#FFF0EB", borderRadius: 16, borderWidth: 1.5, borderColor: "#EDD9D0",
      paddingHorizontal: 20, paddingVertical: 14, fontSize: 24, letterSpacing: 8,
      textAlign: "center", color: "#3D2B1F", width: "100%", marginBottom: 16,
    },
    pinBtn: {
      backgroundColor: "#C4826A", borderRadius: 16, paddingVertical: 14,
      paddingHorizontal: 40, width: "100%", alignItems: "center",
    },
    pinBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
    // Admin sections
    scroll: { flex: 1, padding: 20 },
    sectionCard: {
      backgroundColor: "#FFF0EB", borderRadius: 20, padding: 18, marginBottom: 12,
      borderWidth: 1, borderColor: "#EDD9D0", flexDirection: "row", alignItems: "center",
    },
    sectionEmoji: { fontSize: 32, marginRight: 14 },
    sectionInfo: { flex: 1 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground },
    sectionSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
    sectionArrow: { fontSize: 18, color: colors.muted },
    // Detail sections
    detailContainer: { flex: 1, padding: 20 },
    detailTitle: { fontSize: 20, fontWeight: "700", color: colors.foreground, marginBottom: 16 },
    label: { fontSize: 14, fontWeight: "600", color: colors.foreground, marginBottom: 6 },
    input: {
      backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border,
      paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.foreground, marginBottom: 14,
    },
    textArea: { minHeight: 100, textAlignVertical: "top" },
    saveBtn: {
      backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginBottom: 12,
    },
    saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    backSectionBtn: {
      borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingVertical: 12, alignItems: "center",
    },
    backSectionBtnText: { fontSize: 15, color: colors.muted },
    contentItem: {
      backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginBottom: 10,
      borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center",
    },
    contentItemEmoji: { fontSize: 24, marginRight: 12 },
    contentItemTitle: { fontSize: 14, fontWeight: "600", color: colors.foreground, flex: 1 },
    contentItemCat: { fontSize: 12, color: colors.primary },
    addBtn: {
      backgroundColor: colors.primary + "15", borderRadius: 14, padding: 14,
      alignItems: "center", marginBottom: 12, borderWidth: 1, borderColor: colors.primary + "40",
    },
    addBtnText: { fontSize: 15, color: colors.primary, fontWeight: "700" },
  });

  // PIN Screen
  if (!isUnlocked) {
    return (
      <ScreenContainer edges={["top", "left", "right"]}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={s.backBtn}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Admin</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={s.pinContainer}>
          <Text style={s.pinEmoji}>🔐</Text>
          <Text style={s.pinTitle}>Admin-Bereich</Text>
          <Text style={s.pinSub}>Gib deinen PIN ein, um auf den Admin-Bereich zuzugreifen.</Text>
          <TextInput
            style={s.pinInput}
            placeholder="••••"
            placeholderTextColor={colors.muted}
            value={pinInput}
            onChangeText={setPinInput}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={8}
            returnKeyType="done"
            onSubmitEditing={handleUnlock}
          />
          <TouchableOpacity style={s.pinBtn} onPress={handleUnlock}>
            <Text style={s.pinBtnText}>Entsperren</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // Content-Bereich
  if (activeSection === "content") {
    const allContent = [...CONTENT_DATA, ...customContent];
    return (
      <ScreenContainer edges={["top", "left", "right"]}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setActiveSection(null)}>
            <Text style={s.backBtn}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>📝 Content</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView style={s.detailContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={s.addBtn} onPress={() => setEditingItem({
            id: `custom_${Date.now()}`, category: "impuls", title: "", subtitle: "",
            content: "", tags: [], emoji: "✨", color: "#C9A84C",
          })}>
            <Text style={s.addBtnText}>+ Neuen Inhalt hinzufügen</Text>
          </TouchableOpacity>

          {editingItem && (
            <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.primary }}>
              <Text style={[s.label, { color: colors.primary }]}>Neuen Inhalt erstellen</Text>
              <TextInput style={s.input} placeholder="Titel" placeholderTextColor={colors.muted}
                value={editingItem.title} onChangeText={t => setEditingItem(prev => prev ? { ...prev, title: t } : null)} />
              <TextInput style={[s.input, s.textArea]} placeholder="Inhalt / Text" placeholderTextColor={colors.muted}
                value={editingItem.content} onChangeText={t => setEditingItem(prev => prev ? { ...prev, content: t } : null)}
                multiline />
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                {(["ritual", "meditation", "gedicht", "impuls"] as ContentCategory[]).map(cat => (
                  <TouchableOpacity key={cat} onPress={() => setEditingItem(prev => prev ? { ...prev, category: cat } : null)}
                    style={{ backgroundColor: editingItem.category === cat ? colors.primary : colors.surface,
                      borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: colors.border }}>
                    <Text style={{ fontSize: 12, color: editingItem.category === cat ? "#fff" : colors.muted, fontWeight: "600" }}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={s.saveBtn} onPress={() => handleSaveContent(editingItem)}>
                <Text style={s.saveBtnText}>Speichern ✓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.backSectionBtn} onPress={() => setEditingItem(null)}>
                <Text style={s.backSectionBtnText}>Abbrechen</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={[s.label, { marginBottom: 10 }]}>Alle Inhalte ({allContent.length})</Text>
          {allContent.map(item => (
            <View key={item.id} style={s.contentItem}>
              <Text style={s.contentItemEmoji}>{item.emoji}</Text>
              <Text style={s.contentItemTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={s.contentItemCat}>{item.category}</Text>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Shop-Links
  if (activeSection === "shop") {
    return (
      <ScreenContainer edges={["top", "left", "right"]}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setActiveSection(null)}>
            <Text style={s.backBtn}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>🛍️ Shop-Links</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={s.detailContainer}>
          <Text style={s.label}>Aktueller Shop-Link (Tentary / Shopify)</Text>
          <TextInput style={s.input} placeholder="https://..." placeholderTextColor={colors.muted}
            value={shopUrl} onChangeText={setShopUrl} autoCapitalize="none" keyboardType="url" />
          <TouchableOpacity style={s.saveBtn} onPress={handleSaveShopUrl}>
            <Text style={s.saveBtnText}>Speichern ✓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.backSectionBtn} onPress={() => setActiveSection(null)}>
            <Text style={s.backSectionBtnText}>Zurück</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // Tagesimpuls
  if (activeSection === "impuls") {
    return (
      <ScreenContainer edges={["top", "left", "right"]}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setActiveSection(null)}>
            <Text style={s.backBtn}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>✨ Tagesimpuls</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={s.detailContainer}>
          <Text style={s.label}>Heutigen Impuls manuell setzen</Text>
          <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 12 }}>
            Dieser Text erscheint heute auf dem Home Screen. Leer lassen = automatischer Impuls.
          </Text>
          <TextInput style={[s.input, s.textArea]} placeholder="Dein heutiger Impuls für deine Community..."
            placeholderTextColor={colors.muted} value={customImpuls} onChangeText={setCustomImpuls} multiline />
          <TouchableOpacity style={s.saveBtn} onPress={handleSaveImpuls}>
            <Text style={s.saveBtnText}>Speichern ✓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.backSectionBtn} onPress={() => setActiveSection(null)}>
            <Text style={s.backSectionBtnText}>Zurück</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // PIN ändern
  if (activeSection === "pin") {
    return (
      <ScreenContainer edges={["top", "left", "right"]}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setActiveSection(null)}>
            <Text style={s.backBtn}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>🔐 PIN ändern</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={s.detailContainer}>
          <Text style={s.label}>Neuer PIN</Text>
          <TextInput style={s.input} placeholder="Neuer PIN (mind. 4 Stellen)" placeholderTextColor={colors.muted}
            value={newPin} onChangeText={setNewPin} keyboardType="number-pad" secureTextEntry maxLength={8} />
          <Text style={s.label}>PIN bestätigen</Text>
          <TextInput style={s.input} placeholder="PIN wiederholen" placeholderTextColor={colors.muted}
            value={confirmPin} onChangeText={setConfirmPin} keyboardType="number-pad" secureTextEntry maxLength={8} />
          <TouchableOpacity style={s.saveBtn} onPress={handleChangePin}>
            <Text style={s.saveBtnText}>PIN ändern ✓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.backSectionBtn} onPress={() => setActiveSection(null)}>
            <Text style={s.backSectionBtnText}>Zurück</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // Haupt-Admin-Menü
  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.backBtn}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>⚙️ Admin</Text>
        <TouchableOpacity onPress={() => setIsUnlocked(false)}>
          <Text style={{ fontSize: 14, color: colors.error }}>Sperren</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: "#FFF0EB", borderRadius: 16, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: "#EDD9CC" }}>
          <Text style={{ fontSize: 15, color: colors.foreground, fontWeight: "600" }}>Willkommen, Lara! 🌸</Text>
          <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>
            Hier kannst du alles in deiner App selbst verwalten und anpassen.
          </Text>
        </View>
        {ADMIN_SECTIONS.map(section => (
          <TouchableOpacity key={section.id} style={s.sectionCard} onPress={() => setActiveSection(section.id)} activeOpacity={0.8}>
            <Text style={s.sectionEmoji}>{section.emoji}</Text>
            <View style={s.sectionInfo}>
              <Text style={s.sectionTitle}>{section.title}</Text>
              <Text style={s.sectionSub}>{section.subtitle}</Text>
            </View>
            <Text style={s.sectionArrow}>›</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}
