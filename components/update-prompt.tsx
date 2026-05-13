import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Updates from "expo-updates";

/**
 * UpdatePrompt – zeigt ein Popup wenn ein neues OTA-Update verfügbar ist.
 * Beim Tippen auf "Jetzt aktualisieren" wird das Update geladen und die App neu gestartet.
 */
export function UpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Nur auf nativen Plattformen prüfen (nicht im Web oder Dev-Client)
    if (Platform.OS === "web" || __DEV__) return;

    checkForUpdate();
  }, []);

  const checkForUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setUpdateAvailable(true);
      }
    } catch (e) {
      // Stille Fehlerbehandlung – kein Popup wenn Check fehlschlägt
      console.log("[Update] Check fehlgeschlagen:", e);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (e) {
      console.error("[Update] Fehler beim Aktualisieren:", e);
      setIsUpdating(false);
      setUpdateAvailable(false);
    }
  };

  const handleLater = () => {
    setUpdateAvailable(false);
  };

  if (!updateAvailable) return null;

  return (
    <Modal
      visible={updateAvailable}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.title}>Neues Update verfügbar</Text>
          <Text style={styles.description}>
            Es gibt eine neue Version der App mit Verbesserungen und neuen Inhalten. Aktualisiere jetzt für das beste Erlebnis.
          </Text>

          {isUpdating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#C9A96E" />
              <Text style={styles.loadingText}>Wird aktualisiert...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
                activeOpacity={0.8}
              >
                <Text style={styles.updateButtonText}>Jetzt aktualisieren</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.laterButton}
                onPress={handleLater}
                activeOpacity={0.7}
              >
                <Text style={styles.laterButtonText}>Später</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  card: {
    backgroundColor: "#FDF8F4",
    borderRadius: 24,
    padding: 32,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3D2B1F",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#9C7B6E",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  updateButton: {
    backgroundColor: "#C9A96E",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    shadowColor: "#C9A96E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  laterButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  laterButtonText: {
    fontSize: 14,
    color: "#9C7B6E",
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
  },
  loadingText: {
    fontSize: 15,
    color: "#C9A96E",
    fontWeight: "600",
  },
});
