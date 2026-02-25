import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getSetById } from "@/lib/runen-sets";
import { KATEGORIE_TO_SETS } from "@/lib/quiz-data";

export default function RunenSetDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const set = getSetById(Number(id));

  const s = StyleSheet.create({
    back: { padding: 16, paddingBottom: 0 },
    backText: { fontSize: 24, color: colors.primary },
    content: { padding: 24, paddingBottom: 48 },
    badge: {
      alignSelf: "center", backgroundColor: colors.primary + "20",
      borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 16,
    },
    badgeText: { fontSize: 13, color: colors.primary, fontWeight: "600" },
    runeRow: { flexDirection: "row", justifyContent: "center", gap: 16, marginBottom: 8 },
    runeItem: { alignItems: "center" },
    runeSymbol: { fontSize: 48, color: colors.primary },
    runeName: { fontSize: 12, color: colors.muted, marginTop: 2 },
    plus: { fontSize: 24, color: colors.muted, alignSelf: "center" },
    title: { fontSize: 26, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 4 },
    wirkung: { fontSize: 15, color: colors.primary, textAlign: "center", fontStyle: "italic", marginBottom: 20 },
    card: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
    sectionLabel: { fontSize: 12, color: colors.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
    desc: { fontSize: 15, color: colors.foreground, lineHeight: 24 },
    highlightBox: {
      backgroundColor: colors.primary + "10", borderRadius: 16, padding: 16,
      borderLeftWidth: 3, borderLeftColor: colors.primary, marginBottom: 16,
    },
    highlightText: { fontSize: 14, color: colors.foreground, lineHeight: 22, fontStyle: "italic" },
    priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    priceLabel: { fontSize: 14, color: colors.muted },
    price: { fontSize: 28, fontWeight: "700", color: colors.primary },
    shopBtn: {
      backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16,
      alignItems: "center", marginTop: 8, marginBottom: 8,
    },
    shopBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
    secondaryBtn: {
      borderWidth: 1.5, borderColor: colors.primary, borderRadius: 16, paddingVertical: 14,
      alignItems: "center", marginBottom: 16,
    },
    secondaryBtnText: { color: colors.primary, fontSize: 16, fontWeight: "600" },
  });

  if (!set) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.muted }}>Set nicht gefunden</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.primary, marginTop: 12 }}>← Zurück</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const katInfo = KATEGORIE_TO_SETS[set.kategorie];

  return (
    <ScreenContainer>
      <TouchableOpacity style={s.back} onPress={() => router.back()}>
        <Text style={s.backText}>←</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.badge}>
          <Text style={s.badgeText}>{katInfo.emoji} {katInfo.label}</Text>
        </View>

        {/* Runen-Symbole */}
        <View style={s.runeRow}>
          {set.runenSymbole.map((sym, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Text style={s.plus}>+</Text>}
              <View style={s.runeItem}>
                <Text style={s.runeSymbol}>{sym}</Text>
                <Text style={s.runeName}>{i === 0 ? "Schutzrune" : set.runen[i]}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <Text style={s.title}>{set.name}</Text>
        <Text style={s.wirkung}>{set.wirkung}</Text>

        {/* Beschreibung */}
        <View style={s.card}>
          <Text style={s.sectionLabel}>Über dieses Set</Text>
          <Text style={s.desc}>{set.beschreibung}</Text>
        </View>

        {/* Handgraviert */}
        <View style={s.highlightBox}>
          <Text style={s.highlightText}>
            ✦ Jedes Plättchen wird von Lara persönlich handgraviert und mit kraftvollem Heilstein-Pulver befüllt – ein echtes Unikat für dich.
          </Text>
        </View>

        {/* Was ist enthalten */}
        <View style={s.card}>
          <Text style={s.sectionLabel}>Was ist enthalten</Text>
          <Text style={s.desc}>
            • 1 silbernes Kettenarmband{"\n"}
            • 3 handgravierte Runen-Plättchen mit Heilstein-Pulver{"\n"}
            • Deine persönliche Schutzrune (nach Geburtsdatum){"\n"}
            • {set.runen[1]} – {set.runenSymbole[1]}{"\n"}
            • {set.runen[2]} – {set.runenSymbole[2]}{"\n"}
            • Liebevoll verpackt mit Bedeutungskarte
          </Text>
        </View>

        {/* Preis & Kauf */}
        <View style={s.card}>
          <View style={s.priceRow}>
            <Text style={s.priceLabel}>Preis</Text>
            <Text style={s.price}>{set.preis.toFixed(2)} €</Text>
          </View>
        </View>

        <TouchableOpacity style={s.shopBtn} onPress={() => Linking.openURL(set.tentaryUrl)}>
          <Text style={s.shopBtnText}>Jetzt bestellen ✨</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.secondaryBtn} onPress={() => router.push("/runen/quiz" as any)}>
          <Text style={s.secondaryBtnText}>Quiz wiederholen</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
