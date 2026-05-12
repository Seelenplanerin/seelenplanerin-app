import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isWebPushSupported, initWebPush, isPushEnabled } from "@/lib/web-push-client";
import { getApiBaseUrl } from "@/constants/oauth";

const isWeb = Platform.OS as string === "web";
const STORAGE_KEY = "seelenplanerin_web_push_prompted";

/**
 * Shows a one-time push notification opt-in popup for web/PWA users.
 * Only appears on first visit if web push is supported and not yet enabled.
 * After dismissal or activation, it never shows again.
 */
export function WebPushPrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isWeb) return;

    // Delay the popup slightly so the app loads first
    const timer = setTimeout(async () => {
      try {
        // Check if we already prompted
        const prompted = await AsyncStorage.getItem(STORAGE_KEY);
        if (prompted === "true") return;

        // Check if web push is supported
        if (!isWebPushSupported()) return;

        // Check if already enabled
        const enabled = await isPushEnabled();
        if (enabled) {
          await AsyncStorage.setItem(STORAGE_KEY, "true");
          return;
        }

        // Show the popup
        setVisible(true);
      } catch (e) {
        // Silently fail
      }
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleActivate = async () => {
    setLoading(true);
    try {
      const apiBase = getApiBaseUrl();
      await initWebPush(apiBase);
    } catch (e) {
      // Even if it fails, don't show again
    }
    await AsyncStorage.setItem(STORAGE_KEY, "true");
    setLoading(false);
    setVisible(false);
  };

  const handleDismiss = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!isWeb || !visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleDismiss}
    >
      <View style={s.overlay}>
        <View style={s.card}>
          {/* Bell Icon */}
          <Text style={s.icon}>🔔</Text>

          {/* Title */}
          <Text style={s.title}>Bleib verbunden</Text>

          {/* Description */}
          <Text style={s.description}>
            Möchtest du Erinnerungen zu Vollmond, Neumond und besonderen Ritualen erhalten?
            Ich schicke dir liebevolle Impulse direkt auf dein Handy.
          </Text>

          {/* Signature */}
          <Text style={s.signature}>– Lara, Die Seelenplanerin</Text>

          {/* Buttons */}
          <TouchableOpacity
            style={[s.activateBtn, loading && { opacity: 0.6 }]}
            onPress={handleActivate}
            disabled={loading}
          >
            <Text style={s.activateBtnText}>
              {loading ? "Wird aktiviert..." : "Ja, erinnere mich ✨"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.dismissBtn} onPress={handleDismiss}>
            <Text style={s.dismissBtnText}>Später vielleicht</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FDF8F4",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#5C3317",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: "DancingScript-Bold",
  },
  description: {
    fontSize: 15,
    color: "#8B5E3C",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 8,
  },
  signature: {
    fontSize: 14,
    color: "#A08070",
    fontStyle: "italic",
    marginBottom: 24,
    textAlign: "center",
  },
  activateBtn: {
    backgroundColor: "#C4826A",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  activateBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  dismissBtn: {
    paddingVertical: 8,
  },
  dismissBtnText: {
    color: "#A08070",
    fontSize: 14,
  },
});
