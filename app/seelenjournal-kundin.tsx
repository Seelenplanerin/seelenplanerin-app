import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBaseUrl } from "@/constants/oauth";
import * as WebBrowser from "expo-web-browser";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
  sage: "#8FA98F", sageLight: "#E8F0E8",
};

interface KlientinPdf {
  id: number;
  klientinId: number;
  titel: string;
  pdfUrl: string;
  fileName: string;
  createdAt: string;
}

const API_URL = () => getApiBaseUrl();

export default function SeelenjournalKundinScreen() {
  const [pdfs, setPdfs] = useState<KlientinPdf[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    loadUserAndPdfs();
  }, []);

  const loadUserAndPdfs = async () => {
    try {
      // Lade den aktuellen Community-User aus AsyncStorage
      const userData = await AsyncStorage.getItem("community_current_user");
      if (!userData) {
        Alert.alert("Nicht angemeldet", "Bitte melde dich zuerst in der Community an.");
        router.back();
        return;
      }
      const user = JSON.parse(userData);
      setUserName(user.name || "");
      setUserEmail(user.email || "");

      // Finde die Klientin per E-Mail
      const apiBase = API_URL();
      const klientinnenRes = await fetch(`${apiBase}/api/trpc/seelenjournal.listKlientinnen`);
      const klientinnenJson = await klientinnenRes.json();
      const klientinnen = klientinnenJson?.result?.data?.json || klientinnenJson?.result?.data || [];
      const klientin = klientinnen.find((k: any) => k.email.toLowerCase() === user.email.toLowerCase());

      if (!klientin) {
        setPdfs([]);
        setLoading(false);
        return;
      }

      // Lade PDFs der Klientin
      const pdfsRes = await fetch(`${apiBase}/api/trpc/seelenjournal.listPdfs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { klientinId: klientin.id } }),
      });
      const pdfsJson = await pdfsRes.json();
      const pdfList = pdfsJson?.result?.data?.json || pdfsJson?.result?.data || [];
      setPdfs(pdfList);
    } catch (e) {
      console.error("[SJ Kundin] Fehler:", e);
    }
    setLoading(false);
  };

  const handleOpenPdf = async (pdf: KlientinPdf) => {
    try {
      if (Platform.OS === "web") {
        window.open(pdf.pdfUrl, "_blank");
      } else {
        await WebBrowser.openBrowserAsync(pdf.pdfUrl, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
          controlsColor: C.sage,
        });
      }
    } catch {
      Alert.alert("Fehler", "PDF konnte nicht ge\u00f6ffnet werden.");
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.8}>
            <Text style={[s.backBtnText, { color: C.sage }]}>{"\u2190"} Zur\u00fcck</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Mein Seelenjournal</Text>
          {userName ? (
            <Text style={s.headerSub}>Hallo {userName}, hier findest du deine pers\u00f6nlichen Berichte.</Text>
          ) : null}
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          {loading ? (
            <View style={{ alignItems: "center", padding: 40 }}>
              <ActivityIndicator size="large" color={C.sage} />
              <Text style={{ fontSize: 14, color: C.muted, marginTop: 12 }}>Berichte werden geladen...</Text>
            </View>
          ) : pdfs.length === 0 ? (
            <View style={{ alignItems: "center", padding: 40 }}>
              <Text style={{ fontSize: 50, marginBottom: 16 }}>{"\uD83D\uDCC4"}</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 8 }}>
                Noch keine Berichte
              </Text>
              <Text style={{ fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 22, maxWidth: 280 }}>
                Deine Seelenplanerin hat noch keine Berichte f\u00fcr dich hinterlegt. Schau sp\u00e4ter wieder vorbei.
              </Text>
            </View>
          ) : (
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 13, color: C.brownMid, fontWeight: "600", marginBottom: 12 }}>
                {pdfs.length} Bericht{pdfs.length !== 1 ? "e" : ""} verf\u00fcgbar
              </Text>
              {pdfs.map(pdf => (
                <TouchableOpacity
                  key={pdf.id}
                  style={s.pdfCard}
                  onPress={() => handleOpenPdf(pdf)}
                  activeOpacity={0.7}
                >
                  <View style={s.pdfIcon}>
                    <Text style={{ fontSize: 24 }}>{"\uD83D\uDCC4"}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.pdfTitel} numberOfLines={2}>{pdf.titel}</Text>
                    <Text style={s.pdfDate}>
                      {new Date(pdf.createdAt).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
                    </Text>
                  </View>
                  <View style={s.openBtn}>
                    <Text style={s.openBtnText}>Öffnen</Text>
                  </View>
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
  headerSub: { fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 20 },

  pdfCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: C.card,
    borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: C.border,
    gap: 12,
  },
  pdfIcon: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: C.sageLight,
    alignItems: "center", justifyContent: "center",
  },
  pdfTitel: { fontSize: 15, fontWeight: "700", color: C.brown, lineHeight: 21 },
  pdfDate: { fontSize: 12, color: C.muted, marginTop: 4 },
  openBtn: {
    backgroundColor: C.sage, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
  },
  openBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
});
