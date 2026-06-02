import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Platform,
} from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

const SEELENLEGUNG_URL = "https://dieseelenplanerin.de/seelenarbeit/seelenlegung";

interface LegungOption {
  id: string;
  emoji: string;
  name: string;
  preis: string;
  features: string[];
  badge?: string;
}

const OPTIONEN: LegungOption[] = [
  {
    id: "eine-frage",
    emoji: "🌸",
    name: "Eine Frage",
    preis: "33 €",
    badge: "Beliebt",
    features: [
      "Deine konkrete Frage beantwortet",
      "Persönliche Sprachnachricht von mir",
      "PDF mit deiner Legung & Reflexionsfrage",
      "Lieferung innerhalb 48 Stunden",
    ],
  },
  {
    id: "rundum-blick",
    emoji: "🌿",
    name: "Rundum-Blick",
    preis: "77 €",
    badge: "Umfassend",
    features: [
      "Rundum-Blick auf dein Lebensbild",
      "Ausführliche Sprachnachricht",
      "PDF mit allen Lebensbereichen & Reflexionsfragen",
      "Lieferung innerhalb 48 Stunden",
    ],
  },
];

const FAQ = [
  {
    frage: "Was ist der Unterschied zwischen den beiden Optionen?",
    antwort: "Bei 'Eine Frage' beantworte ich dir eine konkrete Frage, die dich gerade besch\u00e4ftigt. Beim 'Rundum-Blick' schaue ich mir alle Lebensbereiche an \u2013 Liebe, Beruf, Gesundheit, Spiritualit\u00e4t \u2013 und gebe dir einen umfassenden \u00dcberblick.",
  },
  {
    frage: "Wie stelle ich meine Frage?",
    antwort: "Nach der Buchung bekommst du eine Best\u00e4tigung mit meiner Handynummer. Du schickst mir deine Frage einfach per WhatsApp oder SMS \u2013 ganz unkompliziert.",
  },
  {
    frage: "Wie bekomme ich meine Antwort?",
    antwort: "Innerhalb von 48 Stunden erhältst du eine persönliche Sprachnachricht von mir plus ein PDF mit deiner Legung und Reflexionsfragen zum Mitnehmen.",
  },
  {
    frage: "Muss ich beim Rundum-Blick etwas vorbereiten?",
    antwort: "Nein, du musst nichts vorbereiten. Ich lege die gro\u00dfe Tafel und h\u00f6re, was sich f\u00fcr dich zeigt. Du darfst einfach offen sein f\u00fcr das, was kommt.",
  },
];

export default function SeelenlegungScreen() {
  const colors = useColors();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleBuchen = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Linking.openURL(SEELENLEGUNG_URL);
  };

  const s = StyleSheet.create({
    header: { padding: 20, paddingBottom: 8 },
    backBtn: { marginBottom: 8 },
    backText: { fontSize: 24, color: colors.primary },
    title: { fontSize: 28, fontWeight: "700", color: "#3D2B1F", fontFamily: Platform.OS === "ios" ? "Georgia" : "serif" },
    subtitle: { fontSize: 15, color: "#9C7B6E", marginTop: 4, fontStyle: "italic" },
    heroImage: { width: "100%", height: 220, borderRadius: 0 },
    introBox: {
      marginHorizontal: 16, marginTop: 16, marginBottom: 20,
      backgroundColor: colors.primary + "10", borderRadius: 16, padding: 16,
      borderLeftWidth: 3, borderLeftColor: colors.primary,
    },
    introText: { fontSize: 15, color: colors.foreground, lineHeight: 24, fontStyle: "italic" },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#3D2B1F", marginBottom: 12, paddingHorizontal: 20 },
    optionCard: {
      marginHorizontal: 16, marginBottom: 12, borderRadius: 20, padding: 16,
      borderWidth: 1.5, borderColor: "#EDD9D0", backgroundColor: "#FFF8F5",
    },
    optionCardSelected: { borderColor: "#C4826A", backgroundColor: "#F9E0D8" },
    optionTop: { flexDirection: "row", alignItems: "flex-start" },
    optionEmoji: { fontSize: 32, marginRight: 12 },
    optionInfo: { flex: 1 },
    optionBadge: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start", marginBottom: 4 },
    optionBadgeText: { fontSize: 11, color: "#fff", fontWeight: "700" },
    optionName: { fontSize: 18, fontWeight: "700", color: colors.foreground },
    optionPreis: { fontSize: 15, color: colors.primary, fontWeight: "700", marginTop: 2 },
    featureList: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
    featureItem: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
    featureCheck: { fontSize: 14, color: colors.primary, marginRight: 8 },
    featureText: { fontSize: 14, color: colors.foreground, flex: 1 },
    bookBtn: {
      backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16,
      alignItems: "center", marginHorizontal: 16, marginTop: 16, marginBottom: 8,
    },
    bookBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
    bookHint: { textAlign: "center", fontSize: 12, color: colors.muted, marginBottom: 24 },
    divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16, marginVertical: 20 },
    faqCard: {
      marginHorizontal: 16, marginBottom: 8, borderRadius: 14,
      backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
      overflow: "hidden",
    },
    faqQuestion: { flexDirection: "row", alignItems: "center", padding: 14 },
    faqQuestionText: { fontSize: 15, fontWeight: "600", color: colors.foreground, flex: 1 },
    faqArrow: { fontSize: 16, color: colors.muted },
    faqAnswer: { paddingHorizontal: 14, paddingBottom: 14 },
    faqAnswerText: { fontSize: 14, color: colors.muted, lineHeight: 22 },
    wasBekommst: {
      marginHorizontal: 16, marginBottom: 20, borderRadius: 16,
      backgroundColor: "#FFF8F5", padding: 16, borderWidth: 1, borderColor: "#EDD9D0",
    },
    wasBekommstTitle: { fontSize: 16, fontWeight: "700", color: "#3D2B1F", marginBottom: 10 },
    wasBekommstItem: { flexDirection: "row", marginBottom: 8 },
    wasBekommstEmoji: { fontSize: 16, marginRight: 10 },
    wasBekommstText: { fontSize: 14, color: colors.foreground, lineHeight: 20, flex: 1 },
  });

  return (
    <ScreenContainer>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backText}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={s.title}>Seelenlegung</Text>
        <Text style={s.subtitle}>Lenormand-Legung für dich – ab 33 €</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <Image
          source={{ uri: "https://d2xsxph8kpxj0f.cloudfront.net/310519663350288528/6tNxx849MbaAPaCKuehjug/seelenlegung-karten_be057b64.jpeg" }}
          style={s.heroImage}
          contentFit="cover"
        />

        {/* Intro */}
        <View style={s.introBox}>
          <Text style={s.introText}>
            Manchmal stehst du an einem Punkt, an dem du nicht weißt, wohin. Eine Entscheidung. Eine Beziehung. Eine innere Stimme, die du nicht greifen kannst.{"\n\n"}
            Du brauchst nicht gleich eine ganze Begleitung. Du brauchst einen Impuls.{"\n\n"}
            Ich lege die große Tafel nach Lenormand und höre, was sich für dich zeigt. Du bekommst eine persönliche Sprachnachricht von mir plus PDF zum Mitnehmen – innerhalb von 48 Stunden.
          </Text>
        </View>

        {/* Was du bekommst */}
        <View style={s.wasBekommst}>
          <Text style={s.wasBekommstTitle}>🌸 Was du bekommst</Text>
          <View style={s.wasBekommstItem}>
            <Text style={s.wasBekommstEmoji}>🎴</Text>
            <Text style={s.wasBekommstText}>Persönliche Lenormand-Legung (große Tafel)</Text>
          </View>
          <View style={s.wasBekommstItem}>
            <Text style={s.wasBekommstEmoji}>🎙️</Text>
            <Text style={s.wasBekommstText}>Sprachnachricht mit meiner Deutung für dich</Text>
          </View>
          <View style={s.wasBekommstItem}>
            <Text style={s.wasBekommstEmoji}>📄</Text>
            <Text style={s.wasBekommstText}>PDF mit deiner Legung & Reflexionsfragen</Text>
          </View>
          <View style={s.wasBekommstItem}>
            <Text style={s.wasBekommstEmoji}>⏰</Text>
            <Text style={s.wasBekommstText}>Lieferung innerhalb 48 Stunden</Text>
          </View>
        </View>

        {/* Optionen wählen */}
        <Text style={s.sectionTitle}>Wähle deine Legung</Text>

        {OPTIONEN.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            style={[s.optionCard, selectedOption === opt.id && s.optionCardSelected]}
            onPress={() => {
              setSelectedOption(opt.id);
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.8}
          >
            <View style={s.optionTop}>
              <Text style={s.optionEmoji}>{opt.emoji}</Text>
              <View style={s.optionInfo}>
                {opt.badge && (
                  <View style={s.optionBadge}>
                    <Text style={s.optionBadgeText}>{opt.badge}</Text>
                  </View>
                )}
                <Text style={s.optionName}>{opt.name}</Text>
                <Text style={s.optionPreis}>{opt.preis}</Text>
              </View>
            </View>
            {selectedOption === opt.id && (
              <View style={s.featureList}>
                {opt.features.map((f, i) => (
                  <View key={i} style={s.featureItem}>
                    <Text style={s.featureCheck}>✓</Text>
                    <Text style={s.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Buchen Button */}
        <TouchableOpacity
          style={s.bookBtn}
          onPress={handleBuchen}
          activeOpacity={0.8}
        >
          <Text style={s.bookBtnText}>
            {selectedOption === "rundum-blick" ? "Jetzt für 77 € buchen" : "Jetzt für 33 € buchen"}
          </Text>
        </TouchableOpacity>
        <Text style={s.bookHint}>Einmalzahlung – Lieferung innerhalb 48 Stunden</Text>

        <View style={s.divider} />

        {/* FAQ */}
        <Text style={s.sectionTitle}>Häufige Fragen</Text>
        {FAQ.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={s.faqCard}
            onPress={() => {
              setExpandedFaq(expandedFaq === i ? null : i);
              if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.8}
          >
            <View style={s.faqQuestion}>
              <Text style={s.faqQuestionText}>{item.frage}</Text>
              <Text style={s.faqArrow}>{expandedFaq === i ? "▼" : "▶"}</Text>
            </View>
            {expandedFaq === i && (
              <View style={s.faqAnswer}>
                <Text style={s.faqAnswerText}>{item.antwort}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}
