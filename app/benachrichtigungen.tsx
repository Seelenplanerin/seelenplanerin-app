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
import { isWebPushSupported, initWebPush, isPushEnabled } from "@/lib/web-push-client";
import { getApiBaseUrl } from "@/constants/oauth";

const isWeb = Platform.OS as string === "web";

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

  // Web Push State
  const [webPushSupported, setWebPushSupported] = useState(false);
  const [webPushEnabled, setWebPushEnabled] = useState(false);
  const [webPushLoading, setWebPushLoading] = useState(false);
  const [webPushError, setWebPushError] = useState<string | null>(null);

  // Einstellungen laden
  useEffect(() => {
    (async () => {
      const loaded = await loadSettings();
      setSettings(loaded);

      if (!isWeb) {
        const perm = await hasNotificationPermissions();
        setHasPermission(perm);
        const count = await getScheduledCount();
        setScheduledCount(count);
      }

      // Web Push Status prüfen
      if (isWeb) {
        const supported = isWebPushSupported();
        setWebPushSupported(supported);
        if (supported) {
          const enabled = await isPushEnabled();
          setWebPushEnabled(enabled);
          if (enabled) setHasPermission(true);
        }
      }

      setUpcomingEvents(getUpcomingEvents(8));
    })();
  }, []);

  // Web Push aktivieren
  const activateWebPush = useCallback(async () => {
    setWebPushLoading(true);
    setWebPushError(null);
    try {
      const apiBase = getApiBaseUrl();
      const result = await initWebPush(apiBase);
      if (result.success) {
        setWebPushEnabled(true);
        setHasPermission(true);
        // Auch die lokalen Settings aktualisieren
        const newSettings = { ...settings, enabled: true };
        setSettings(newSettings);
        await saveSettings(newSettings);
      } else {
        setWebPushError(result.error || "Unbekannter Fehler");
      }
    } catch (e: any) {
      setWebPushError(e.message || "Fehler beim Aktivieren");
    } finally {
      setWebPushLoading(false);
    }
  }, [settings]);

  // Einstellung ändern und speichern (nur für native)
  const updateSetting = useCallback(async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);

    // Wenn Hauptschalter aktiviert wird, Berechtigungen anfragen
    if (key === "enabled" && value && !hasPermission) {
      if (isWeb) {
        // Web: Web Push aktivieren
        await activateWebPush();
        return;
      }
      const granted = await requestNotificationPermissions();
      setHasPermission(granted);
      if (!granted) {
        if (!isWeb) {
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

    // Benachrichtigungen neu planen (nur native)
    if (!isWeb) {
      if (newSettings.enabled) {
        setSaving(true);
        const count = await scheduleAllNotifications();
        setScheduledCount(count);
        setSaving(false);
      } else {
        await cancelAllNotifications();
        setScheduledCount(0);
      }
    }
  }, [settings, hasPermission, activateWebPush]);

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

        {/* Web Push Banner für Android PWA */}
        {isWeb && webPushSupported && !webPushEnabled && (
          <View style={s.webPushBanner}>
            <Text style={s.webPushIcon}>🔔</Text>
            <View style={s.webPushInfo}>
              <Text style={s.webPushTitle}>Push-Benachrichtigungen aktivieren</Text>
              <Text style={s.webPushDesc}>
                Erhalte Erinnerungen für Vollmond, Neumond und Rituale direkt auf dein Handy.
              </Text>
            </View>
            <TouchableOpacity
              style={[s.webPushBtn, webPushLoading && { opacity: 0.6 }]}
              onPress={activateWebPush}
              disabled={webPushLoading}
            >
              <Text style={s.webPushBtnText}>
                {webPushLoading ? "..." : "Aktivieren"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Web Push Erfolg */}
        {isWeb && webPushEnabled && (
          <View style={s.webPushSuccess}>
            <Text style={s.webPushSuccessIcon}>✓</Text>
            <Text style={s.webPushSuccessText}>
              Push-Benachrichtigungen sind aktiv! Du wirst über Rituale und Mondphasen informiert.
            </Text>
          </View>
        )}

        {/* Web Push Fehler */}
        {webPushError && (
          <View style={s.webPushErrorCard}>
            <Text style={s.webPushErrorText}>{webPushError}</Text>
            <TouchableOpacity onPress={() => setWebPushError(null)}>
              <Text style={s.webPushErrorDismiss}>Schließen</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Status */}
        <View style={s.statusCard}>
          <View style={s.statusRow}>
            <View style={[s.statusDot, { backgroundColor: (settings.enabled && hasPermission) || webPushEnabled ? C.green : C.muted }]} />
            <Text style={s.statusText}>
              {webPushEnabled
                ? "Push-Benachrichtigungen aktiv"
                : settings.enabled && hasPermission
                  ? `${scheduledCount} Erinnerungen geplant`
                  : "Erinnerungen deaktiviert"}
            </Text>
          </View>
          {saving && <Text style={s.savingText}>Wird aktualisiert...</Text>}
        </View>

        {/* Hauptschalter (nur native) */}
        {!isWeb && (
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
        )}

        {/* Einzelne Kategorien (nur native) */}
        {!isWeb && settings.enabled && (
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
          </>
        )}

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

        {/* Info */}
        <View style={s.infoCard}>
          <Text style={s.infoTitle}>
            {isWeb ? "So funktionieren Push-Nachrichten" : "So funktionieren die Erinnerungen"}
          </Text>
          <Text style={s.infoText}>
            {isWeb
              ? "Nach dem Aktivieren erhältst du Push-Nachrichten direkt auf dein Handy – auch wenn die App geschlossen ist. Du wirst über Vollmond, Neumond, Jahreskreisfeste und besondere Rituale informiert."
              : "Du erhältst am Abend vorher (19:00 Uhr) eine Erinnerung, damit du deinen heiligen Raum vorbereiten kannst. Am Tag selbst bekommst du morgens (8:00 Uhr) eine weitere Benachrichtigung mit deinem Ritual."}
          </Text>
          <Text style={s.infoText}>
            {isWeb
              ? "Deine Benachrichtigungen werden von Lara persönlich verschickt – zu Vollmond, Neumond und besonderen Anlässen."
              : "Die Benachrichtigungen werden lokal auf deinem Gerät geplant – deine Daten bleiben privat."}
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

  // Web Push Banner
  webPushBanner: {
    marginHorizontal: 20, marginBottom: 20, backgroundColor: C.roseLight,
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.rose + "40",
    flexDirection: "row", alignItems: "center",
  },
  webPushIcon: { fontSize: 32, marginRight: 12 },
  webPushInfo: { flex: 1, marginRight: 12 },
  webPushTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 4 },
  webPushDesc: { fontSize: 13, color: C.brownMid, lineHeight: 18 },
  webPushBtn: {
    backgroundColor: C.rose, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 20,
  },
  webPushBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },

  // Web Push Erfolg
  webPushSuccess: {
    marginHorizontal: 20, marginBottom: 20, backgroundColor: "#E8F5E9",
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.green + "40",
    flexDirection: "row", alignItems: "center",
  },
  webPushSuccessIcon: {
    fontSize: 20, fontWeight: "700", color: C.green,
    marginRight: 12, width: 28, height: 28, textAlign: "center",
    lineHeight: 28, backgroundColor: C.green + "20", borderRadius: 14,
  },
  webPushSuccessText: { flex: 1, fontSize: 14, color: "#2E7D32", lineHeight: 20 },

  // Web Push Fehler
  webPushErrorCard: {
    marginHorizontal: 20, marginBottom: 20, backgroundColor: "#FFF3F3",
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#EF4444" + "40",
  },
  webPushErrorText: { fontSize: 14, color: "#B91C1C", marginBottom: 8 },
  webPushErrorDismiss: { fontSize: 14, color: C.rose, fontWeight: "600" },

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
