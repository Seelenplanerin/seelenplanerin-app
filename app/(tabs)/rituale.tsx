import React, { useState, useMemo, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Modal, Linking, FlatList,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import {
  RITUALE_2026, RITUAL_KATEGORIEN, MONATSNAMEN,
  getRitualeNachMonat, type Ritual,
} from "@/data/rituale-kalender";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
};

const KAT_EMOJI: Record<string, string> = {
  Neumond: "🌑", Vollmond: "🌕", Jahreskreis: "🔥", Spezial: "✨",
  Morgen: "☀️", Abend: "🕯️", Schutz: "🛡️", Meditation: "💎", Reinigung: "🌿",
};

export default function RitualeScreen() {
  const [suchtext, setSuchtext] = useState("");
  const [aktiveKat, setAktiveKat] = useState("Alle");
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);

  // Filtern + Suchen
  const gefiltert = useMemo(() => {
    let list = RITUALE_2026;
    if (aktiveKat !== "Alle") {
      list = list.filter(r => r.kategorie === aktiveKat);
    }
    if (suchtext.trim()) {
      const q = suchtext.toLowerCase();
      list = list.filter(r =>
        r.titel.toLowerCase().includes(q) ||
        r.kurz.toLowerCase().includes(q) ||
        r.kategorie.toLowerCase().includes(q)
      );
    }
    return list;
  }, [aktiveKat, suchtext]);

  // Nach Monat gruppieren
  const monatsGruppen = useMemo(() => {
    const map = new Map<number, Ritual[]>();
    for (const r of gefiltert) {
      const list = map.get(r.monat) || [];
      list.push(r);
      map.set(r.monat, list);
    }
    // Sortiert nach Monat, innerhalb jedes Monats chronologisch nach Datum
    const parseDatum = (d: string) => {
      const [tag, monat, jahr] = d.split(".").map(Number);
      return new Date(jahr, monat - 1, tag).getTime();
    };
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([monat, rituale]) => [monat, rituale.sort((a, b) => parseDatum(a.datum) - parseDatum(b.datum))] as [number, Ritual[]]);
  }, [gefiltert]);

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Rituale</Text>
        </View>

        {/* Suchfeld */}
        <View style={s.searchContainer}>
          <View style={s.searchBox}>
            <Text style={s.searchIcon}>🔍</Text>
            <TextInput
              style={s.searchInput}
              placeholder="Rituale finden"
              placeholderTextColor={C.muted}
              value={suchtext}
              onChangeText={setSuchtext}
              returnKeyType="search"
            />
            {suchtext.length > 0 && (
              <TouchableOpacity onPress={() => setSuchtext("")} activeOpacity={0.7}>
                <Text style={s.searchClear}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Kategorie-Filter */}
        <TouchableOpacity
          style={s.katHeader}
          activeOpacity={0.8}
        >
          <Text style={s.katLabel}>KATEGORIE</Text>
        </TouchableOpacity>
        <View style={{ marginBottom: 4 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.katRow}
        >
          {RITUAL_KATEGORIEN.map(k => (
            <TouchableOpacity
              key={k}
              style={[s.katBtn, aktiveKat === k && s.katBtnActive]}
              onPress={() => setAktiveKat(k)}
              activeOpacity={0.8}
            >
              {k !== "Alle" && <Text style={s.katEmoji}>{KAT_EMOJI[k] || "✨"}</Text>}
              <Text style={[s.katText, aktiveKat === k && s.katTextActive]}>{k}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        </View>

        {/* Ritual-Liste nach Monat */}
        <FlatList
          data={monatsGruppen}
          keyExtractor={([monat]) => String(monat)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item: [monat, rituale] }) => (
            <View>
              {/* Monatsüberschrift */}
              <View style={s.monatHeader}>
                <Text style={s.monatText}>{MONATSNAMEN[monat]}</Text>
              </View>

              {/* Rituale des Monats */}
              {rituale.map((ritual) => (
                <TouchableOpacity
                  key={ritual.id}
                  style={s.ritualRow}
                  onPress={() => setSelectedRitual(ritual)}
                  activeOpacity={0.7}
                >
                  <View style={[s.ritualIcon, { backgroundColor: getKatColor(ritual.kategorie) }]}>
                    <Text style={s.ritualIconText}>{KAT_EMOJI[ritual.kategorie] || "✨"}</Text>
                  </View>
                  <View style={s.ritualInfo}>
                    <Text style={s.ritualTitel} numberOfLines={1}>{ritual.titel.toUpperCase()}</Text>
                    <Text style={s.ritualDatum}>{ritual.datum}</Text>
                  </View>
                  <Text style={s.ritualArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          ListEmptyComponent={
            <View style={s.emptyContainer}>
              <Text style={s.emptyText}>Keine Rituale gefunden</Text>
              <Text style={s.emptyHint}>Versuche einen anderen Suchbegriff oder Filter</Text>
            </View>
          }
        />
      </View>

      {/* Detail-Modal */}
      <Modal
        visible={selectedRitual !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedRitual(null)}
      >
        {selectedRitual && (
          <RitualDetail
            ritual={selectedRitual}
            onClose={() => setSelectedRitual(null)}
          />
        )}
      </Modal>
    </ScreenContainer>
  );
}

function getKatColor(kat: string): string {
  switch (kat) {
    case "Neumond": return "#2C2C3E";
    case "Vollmond": return "#E8D5B0";
    case "Jahreskreis": return "#D4A574";
    case "Spezial": return "#C4826A";
    case "Morgen": return "#F5E6C8";
    case "Abend": return "#3D2B1F";
    case "Schutz": return "#1A1A2E";
    case "Meditation": return "#8B7EC8";
    case "Reinigung": return "#7AB88E";
    default: return C.roseLight;
  }
}

// ─── Ritual Detail Component ───────────────────────────────────────────────
function RitualDetail({ ritual, onClose }: { ritual: Ritual; onClose: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Top Bar */}
      <View style={s.modalTopBar}>
        <TouchableOpacity onPress={onClose} style={s.backBtn} activeOpacity={0.8}>
          <Text style={s.backBtnText}>← Zurück</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[s.modalHero, { backgroundColor: getKatColor(ritual.kategorie) + "30" }]}>
          <Text style={s.modalEmoji}>{KAT_EMOJI[ritual.kategorie] || "✨"}</Text>
          <Text style={s.modalTitel}>{ritual.titel}</Text>
          <View style={s.modalMetaRow}>
            <View style={s.modalKatBadge}>
              <Text style={s.modalKatText}>{ritual.kategorie}</Text>
            </View>
            <Text style={s.modalDatum}>📅 {ritual.datum}</Text>
          </View>
        </View>

        {/* Inhalt */}
        <View style={s.textCard}>
          {ritual.abschnitte.map((a, i) => {
            if (a.typ === "intro") return <Text key={i} style={s.textIntro}>{a.text}</Text>;
            if (a.typ === "h2") return <Text key={i} style={s.textH2}>{a.text}</Text>;
            if (a.typ === "bullet") return <Text key={i} style={s.textBullet}>• {a.text}</Text>;
            if (a.typ === "schritt") return (
              <View key={i} style={s.schrittCard}>
                <Text style={s.schrittText}>{a.text}</Text>
              </View>
            );
            if (a.typ === "affirmation") return (
              <View key={i} style={s.affirmCard}>
                <Text style={s.affirmText}>{a.text}</Text>
              </View>
            );
            return <Text key={i} style={s.textPara}>{a.text}</Text>;
          })}
        </View>

        {/* Materialien */}
        {ritual.materialien.length > 0 && (
          <View style={s.materialSection}>
            <Text style={s.materialTitle}>🧿 Was du brauchst:</Text>
            <View style={s.materialRow}>
              {ritual.materialien.map((m, i) => (
                <View key={i} style={s.materialTag}>
                  <Text style={s.materialText}>{m}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Produkt-CTA */}
        <View style={s.ctaCard}>
          <Text style={s.ctaTitle}>✨ Passende Produkte von der Seelenplanerin</Text>
          <Text style={s.ctaText}>
            Alle Materialien für dieses Ritual findest du im Shop der Seelenplanerin – handgravierte Runen-Armbänder, Schutzarmbänder mit schwarzem Turmalin, Räucherwerk und mehr. Mit Energie und Liebe gefertigt.
          </Text>
          <TouchableOpacity
            style={s.ctaBtn}
            onPress={() => Linking.openURL(ritual.shopUrl)}
            activeOpacity={0.85}
          >
            <Text style={s.ctaBtnText}>Jetzt im Shop bestellen →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.ctaBtn, { backgroundColor: C.roseLight, marginTop: 10 }]}
            onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/gGmtFy")}
            activeOpacity={0.85}
          >
            <Text style={[s.ctaBtnText, { color: C.brown }]}>Schutzarmband ansehen →</Text>
          </TouchableOpacity>
        </View>

        {/* Seelenimpuls CTA */}
        <View style={s.premiumCta}>
          <Text style={{ fontSize: 18, marginBottom: 6 }}>👑</Text>
          <Text style={s.premiumCtaTitle}>Seelenimpuls Premium</Text>
          <Text style={s.premiumCtaText}>
            Exklusive Meditationen, tiefe Rituale und persönliche Impulse von der Seelenplanerin – nur für dich.
          </Text>
          <TouchableOpacity
            style={s.premiumCtaBtn}
            onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/E6FP1U")}
            activeOpacity={0.85}
          >
            <Text style={s.premiumCtaBtnText}>17 € / Monat · Jetzt entdecken →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Header
  header: {
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: C.brown,
    fontFamily: "DancingScript",
  },

  // Suche
  searchContainer: { paddingHorizontal: 20, marginBottom: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: C.brown, padding: 0 },
  searchClear: { fontSize: 16, color: C.muted, paddingLeft: 8 },

  // Kategorie
  katHeader: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  katLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.muted,
    letterSpacing: 1.5,
  },
  katRow: { paddingHorizontal: 20, gap: 10, paddingBottom: 20, paddingTop: 8 },
  katBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    gap: 8,
    minHeight: 44,
  },
  katBtnActive: { backgroundColor: C.rose, borderColor: C.rose },
  katEmoji: { fontSize: 16 },
  katText: { fontSize: 14, color: C.muted, fontWeight: "600" },
  katTextActive: { color: "#FFF" },

  // Monatsüberschrift
  monatHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  monatText: {
    fontSize: 14,
    color: C.muted,
    fontWeight: "500",
  },

  // Ritual-Zeile (Sacred Space Stil)
  ritualRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  ritualIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  ritualIconText: { fontSize: 20 },
  ritualInfo: { flex: 1 },
  ritualTitel: {
    fontSize: 14,
    fontWeight: "700",
    color: C.brown,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  ritualDatum: { fontSize: 13, color: C.muted },
  ritualArrow: { fontSize: 22, color: C.muted },

  // Leer
  emptyContainer: { alignItems: "center", paddingTop: 60 },
  emptyText: { fontSize: 16, fontWeight: "600", color: C.brown, marginBottom: 6 },
  emptyHint: { fontSize: 13, color: C.muted },

  // Modal
  modalTopBar: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  backBtnText: { fontSize: 16, color: C.rose, fontWeight: "600" },
  modalHero: { padding: 24, alignItems: "center" },
  modalEmoji: { fontSize: 52, marginBottom: 12 },
  modalTitel: { fontSize: 22, fontWeight: "700", color: C.brown, textAlign: "center", marginBottom: 10 },
  modalMetaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalKatBadge: {
    backgroundColor: C.rose,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  modalKatText: { fontSize: 12, color: "#FFF", fontWeight: "600" },
  modalDatum: { fontSize: 13, color: C.muted },

  // Text-Inhalte
  textCard: { marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
  textIntro: { fontSize: 15, color: C.brownMid, lineHeight: 24, marginBottom: 16, fontStyle: "italic" },
  textH2: { fontSize: 16, fontWeight: "700", color: C.brown, marginTop: 16, marginBottom: 8 },
  textBullet: { fontSize: 13, color: C.brownMid, lineHeight: 22, marginLeft: 4, marginBottom: 4 },
  textPara: { fontSize: 14, color: C.brownMid, lineHeight: 22, marginBottom: 8 },
  schrittCard: {
    backgroundColor: C.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: C.rose,
  },
  schrittText: { fontSize: 13, color: C.brownMid, lineHeight: 21 },
  affirmCard: {
    backgroundColor: C.roseLight,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  affirmText: { fontSize: 15, color: C.brown, fontStyle: "italic", textAlign: "center", lineHeight: 23 },

  // Materialien
  materialSection: { marginHorizontal: 16, marginTop: 8, marginBottom: 8 },
  materialTitle: { fontSize: 15, fontWeight: "700", color: C.brown, marginBottom: 10 },
  materialRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  materialTag: {
    backgroundColor: C.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8D5B0",
  },
  materialText: { fontSize: 12, color: C.brownMid, fontWeight: "500" },

  // CTA
  ctaCard: {
    margin: 16,
    backgroundColor: C.goldLight,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E8D5B0",
  },
  ctaTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 8 },
  ctaText: { fontSize: 13, color: C.muted, lineHeight: 19, marginBottom: 14 },
  ctaBtn: { backgroundColor: C.rose, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  ctaBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },

  // Premium CTA
  premiumCta: {
    marginHorizontal: 16,
    backgroundColor: C.brown,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  premiumCtaTitle: { fontSize: 18, fontWeight: "700", color: C.goldLight, marginBottom: 6 },
  premiumCtaText: { fontSize: 13, color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 19, marginBottom: 14 },
  premiumCtaBtn: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  premiumCtaBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
});
