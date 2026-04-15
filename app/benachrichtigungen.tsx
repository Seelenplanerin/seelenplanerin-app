import React, { useState, useCallback, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Switch, Platform, Alert,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  NotificationSettings,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  requestNotificationPermissions,
  hasNotificationPermissions,
  scheduleAllNotifications,
  cancelAllNotifications,
  getScheduledCount,
  getUpcomingEvents,
  formatDateDE,
} from "@/lib/notifications";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", green: "#4CAF50",
};

export default function BenachrichtigungenScreen() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [hasPermission, setHasPermission] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<Array<{ date: string; title: string; type: string }>>([]);

  // Einstellungen laden
  useEffect(() => {
    (async () => {
      const loaded = await loadSettings();
      setSettings(loaded);

      if (Platform.OS !== "web") {
        const perm = await hasNotificationPermissions();
        setHasPermission(perm);
        const count = await getScheduledCount();
        setScheduledCount(count);
      }

      setUpcomingEvents(getUpcomingEvents(8));
    })();
  }, []);

  // Einstellung ändern und speichern
  const updateSetting = useCallback(async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);

    // Wenn Hauptschalter aktiviert wird, Berechtigungen anfragen
    if (key === "enabled" && value && !hasPermission) {
      const granted = await requestNotificationPermissions();
      setHasPermission(granted);
      if (!granted) {
        if (Platform.OS !== "web") {
          Alert.alert(
            "Berechtigungen benötigt",
            "Bitte erlaube Benachrichtigungen in den Geräte-Einstellungen, um Ritual-Erinnerungen zu erhalten."
          );
        }
        const revert = { ...newSettings, enabled: false };
        setSettings(revert);
        await saveSettings(revert);
        return;
      }
    }

    // Benachrichtigungen neu planen
    if (newSettings.enabled) {
      setSaving(true);
      const count = await scheduleAllNotifications();
      setScheduledCount(count);
      setSaving(false);
    } else {
      await cancelAllNotifications();
      setScheduledCount(0);
    }
  }, [settings, hasPermission]);

  const typeEmoji: Record<string, string> = {
    vollmond: "🌕",
    neumond: "🌑",
    jahreskreis: "🌿",
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.title}>Benachrichtigungen</Text>
          <Text style={s.subtitle}>Lass dich an deine Rituale erinnern</Text>
        </View>

        {/* Status */}
        <View style={s.statusCard}>
          <View style={s.statusRow}>
            <View style={[s.statusDot, { backgroundColor: settings.enabled && hasPermission ? C.green : C.muted }]} />
            <Text style={s.statusText}>
              {settings.enabled && hasPermission
                ? `${scheduledCount} Erinnerungen geplant`
                : "Erinnerungen deaktiviert"}
            </Text>
          </View>
          {saving && <Text style={s.savingText}>Wird aktualisiert...</Text>}
        </View>

        {/* Hauptschalter */}
        <View style={s.section}>
          <View style={s.settingRow}>
            <View style={s.settingInfo}>
              <Text style={s.settingLabel}>Ritual-Erinnerungen</Text>
              <Text style={s.settingDesc}>Erhalte Benachrichtigungen für Vollmond, Neumond und Jahreskreisfeste</Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={(v) => updateSetting("enabled", v)}
              trackColor={{ false: C.border, true: C.rose + "80" }}
              thumbColor={settings.enabled ? C.rose : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Einzelne Kategorien */}
        {settings.enabled && (
          <>
            <Text style={s.sectionTitle}>Erinnerungen</Text>
            <View style={s.section}>
              <View style={[s.settingRow, s.settingRowBorder]}>
                <View style={s.settingInfo}>
                  <Text style={s.settingLabel}>🌕 Vollmond-Rituale</Text>
                  <Text style={s.settingDesc}>Erinnerung am Vortag (19:00) und am Tag (8:00)</Text>
                </View>
                <Switch
                  value={settings.vollmondReminder}
                  onValueChange={(v) => updateSetting("vollmondReminder", v)}
                  trackColor={{ false: C.border, true: C.rose + "80" }}
                  thumbColor={settings.vollmondReminder ? C.rose : "#f4f3f4"}
                />
              </View>

              <View style={[s.settingRow, s.settingRowBorder]}>
                <View style={s.settingInfo}>
                  <Text style={s.settingLabel}>🌑 Neumond-Rituale</Text>
                  <Text style={s.settingDesc}>Erinnerung am Vortag (19:00) und am Tag (8:00)</Text>
                </View>
                <Switch
                  value={settings.neumondReminder}
                  onValueChange={(v) => updateSetting("neumondReminder", v)}
                  trackColor={{ false: C.border, true: C.rose + "80" }}
                  thumbColor={settings.neumondReminder ? C.rose : "#f4f3f4"}
                />
              </View>

              <View style={[s.settingRow, s.settingRowBorder]}>
                <View style={s.settingInfo}>
                  <Text style={s.settingLabel}>🌿 Jahreskreisfeste</Text>
                  <Text style={s.settingDesc}>Imbolc, Ostara, Beltane, Litha, Lughnasadh, Mabon, Samhain, Yule</Text>
                </View>
                <Switch
                  value={settings.jahreskreisReminder}
                  onValueChange={(v) => updateSetting("jahreskreisReminder", v)}
                  trackColor={{ false: C.border, true: C.rose + "80" }}
                  thumbColor={settings.jahreskreisReminder ? C.rose : "#f4f3f4"}
                />
              </View>

              <View style={s.settingRow}>
                <View style={s.settingInfo}>
                  <Text style={s.settingLabel}>✨ Täglicher Morgenimpuls</Text>
                  <Text style={s.settingDesc}>Jeden Morgen um {settings.morgenimpulsZeit.hour}:{String(settings.morgenimpulsZeit.minute).padStart(2, "0")} Uhr</Text>
                </View>
                <Switch
                  value={settings.morgenimpuls}
                  onValueChange={(v) => updateSetting("morgenimpuls", v)}
                  trackColor={{ false: C.border, true: C.rose + "80" }}
                  thumbColor={settings.morgenimpuls ? C.rose : "#f4f3f4"}
                />
              </View>
            </View>

            {/* Nächste Events */}
            <Text style={s.sectionTitle}>Nächste Ereignisse</Text>
            <View style={s.section}>
              {upcomingEvents.map((event, i) => (
                <View key={i} style={[s.eventRow, i < upcomingEvents.length - 1 && s.eventRowBorder]}>
                  <Text style={s.eventEmoji}>{typeEmoji[event.type] || "✨"}</Text>
                  <View style={s.eventInfo}>
                    <Text style={s.eventTitle}>{event.title}</Text>
                    <Text style={s.eventDate}>{formatDateDE(event.date)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Info */}
        <View style={s.infoCard}>
          <Text style={s.infoTitle}>So funktionieren die Erinnerungen</Text>
          <Text style={s.infoText}>
            Du erhältst am Abend vorher (19:00 Uhr) eine Erinnerung, damit du deinen heiligen Raum vorbereiten kannst.
            Am Tag selbst bekommst du morgens (8:00 Uhr) eine weitere Benachrichtigung mit deinem Ritual.
          </Text>
          <Text style={s.infoText}>
            Die Benachrichtigungen werden lokal auf deinem Gerät geplant – deine Daten bleiben privat.
          </Text>
        </View>

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

  statusCard: {
    marginHorizontal: 20, marginBottom: 20, backgroundColor: C.card,
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border,
  },
  statusRow: { flexDirection: "row", alignItems: "center" },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  statusText: { fontSize: 15, color: C.brownMid, fontWeight: "600" },
  savingText: { fontSize: 13, color: C.muted, marginTop: 4 },

  sectionTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown,
    marginHorizontal: 20, marginBottom: 8, marginTop: 8,
  },
  section: {
    marginHorizontal: 20, marginBottom: 20, backgroundColor: C.card,
    borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 16,
  },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  settingInfo: { flex: 1, marginRight: 12 },
  settingLabel: { fontSize: 16, fontWeight: "600", color: C.brown, marginBottom: 2 },
  settingDesc: { fontSize: 13, color: C.muted, lineHeight: 18 },

  eventRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  eventRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  eventEmoji: { fontSize: 24, marginRight: 12 },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 15, fontWeight: "600", color: C.brown },
  eventDate: { fontSize: 13, color: C.muted, marginTop: 2 },

  infoCard: {
    marginHorizontal: 20, marginTop: 8, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.gold + "40",
  },
  infoTitle: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 8 },
  infoText: { fontSize: 14, color: C.brownMid, lineHeight: 20, marginBottom: 8 },
});
