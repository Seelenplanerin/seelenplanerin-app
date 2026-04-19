import { ScrollView, Text, View, TouchableOpacity, StyleSheet, Linking, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0",
};

export default function ImpressumScreen() {
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.backText}>← Zurück</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Impressum & Datenschutz</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Impressum */}
          <View style={s.card}>
            <Text style={s.sectionTitle}>📋 Impressum</Text>
            <Text style={s.label}>Angaben gemäß § 5 TMG</Text>

            <Text style={s.subTitle}>Betreiberin</Text>
            <Text style={s.text}>Lara{"\n"}Die Seelenplanerin</Text>

            <Text style={s.subTitle}>Kontakt</Text>
            <TouchableOpacity onPress={() => Linking.openURL("mailto:hallo@dieseelenplanerin.de")}>
              <Text style={[s.text, s.link]}>hallo@dieseelenplanerin.de</Text>
            </TouchableOpacity>

            <Text style={s.subTitle}>Website</Text>
            <TouchableOpacity onPress={() => Linking.openURL("https://dieseelenplanerin.de")}>
              <Text style={[s.text, s.link]}>www.dieseelenplanerin.de</Text>
            </TouchableOpacity>

            <Text style={s.subTitle}>Instagram</Text>
            <TouchableOpacity onPress={() => Linking.openURL("https://www.instagram.com/die.seelenplanerin/")}>
              <Text style={[s.text, s.link]}>@die.seelenplanerin</Text>
            </TouchableOpacity>
          </View>

          {/* Datenschutz */}
          <View style={s.card}>
            <Text style={s.sectionTitle}>🔒 Datenschutz</Text>
            <Text style={s.text}>
              Der Schutz deiner persönlichen Daten ist mir sehr wichtig. Diese App verarbeitet deine Daten ausschließlich im Rahmen der geltenden Datenschutz-Grundverordnung (DSGVO).
            </Text>

            <Text style={s.subTitle}>Welche Daten werden erhoben?</Text>
            <Text style={s.text}>
              • Lokale Daten (Journal, Favoriten, Einstellungen) werden nur auf deinem Gerät gespeichert und nicht an Server übertragen.{"\n"}
              • Push-Benachrichtigungen: Wenn du Benachrichtigungen aktivierst, wird ein anonymes Geräte-Token gespeichert.{"\n"}
              • Seelenjournal: Wenn du dich einloggst, werden dein Name und deine E-Mail-Adresse gespeichert, um dir persönliche Inhalte bereitzustellen.
            </Text>

            <Text style={s.subTitle}>Deine Rechte</Text>
            <Text style={s.text}>
              Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten. Wende dich dazu an hallo@dieseelenplanerin.de.
            </Text>

            <Text style={s.subTitle}>Vollständige Datenschutzerklärung</Text>
            <TouchableOpacity onPress={() => Linking.openURL("https://dieseelenplanerin.de/datenschutz")}>
              <Text style={[s.text, s.link]}>Datenschutzerklärung auf dieseelenplanerin.de →</Text>
            </TouchableOpacity>
          </View>

          {/* Haftungsausschluss */}
          <View style={s.card}>
            <Text style={s.sectionTitle}>⚖️ Haftungsausschluss</Text>
            <Text style={s.text}>
              Die Inhalte dieser App dienen der spirituellen Begleitung und Inspiration. Sie ersetzen keine medizinische, psychologische oder therapeutische Beratung. Bei gesundheitlichen Beschwerden wende dich bitte an eine Fachperson.
            </Text>
          </View>

          {/* Urheberrecht */}
          <View style={s.card}>
            <Text style={s.sectionTitle}>©️ Urheberrecht</Text>
            <Text style={s.text}>
              Alle Inhalte dieser App (Texte, Bilder, Rituale, Meditationen) sind urheberrechtlich geschützt und dürfen ohne ausdrückliche Genehmigung nicht vervielfältigt oder weitergegeben werden.
            </Text>
            <Text style={[s.text, { marginTop: 12, fontStyle: "italic", color: C.muted }]}>
              © {new Date().getFullYear()} Die Seelenplanerin. Alle Rechte vorbehalten.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border,
    backgroundColor: C.bg,
  },
  backText: { fontSize: 15, color: C.rose, fontWeight: "600" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: C.brown, flex: 1, textAlign: "center" },
  card: {
    backgroundColor: C.card, borderRadius: 16, padding: 20, marginBottom: 14,
    borderWidth: 1, borderColor: C.border,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: "700", color: C.brown, marginBottom: 12,
  },
  label: {
    fontSize: 13, color: C.muted, marginBottom: 12, fontStyle: "italic",
  },
  subTitle: {
    fontSize: 14, fontWeight: "700", color: C.brownMid, marginTop: 14, marginBottom: 4,
  },
  text: {
    fontSize: 14, color: C.brownMid, lineHeight: 22,
  },
  link: {
    color: C.rose, fontWeight: "600", textDecorationLine: "underline",
  },
});
