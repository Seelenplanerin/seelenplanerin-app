import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

const C = {
  bg: "#FDF8F4",
  card: "#FFFFFF",
  rose: "#C4826A",
  roseLight: "#F9EDE8",
  gold: "#C9A96E",
  goldLight: "#FAF3E7",
  brown: "#5C3317",
  brownMid: "#8B5E3C",
  muted: "#A08070",
  border: "#EDD9D0",
};

const BUSINESS_KOMPASS_URL = "https://dieseelenplanerin.de/seelenakademie-test";
const BEWERBUNG_URL = "https://dieseelenplanerin.de/seelenakademie#bewerbung";

const BEREICHE = [
  { number: "01", title: "Seele", question: "Was will wirklich durch dich entstehen?", text: "Wir beginnen bei dir: deinen Stärken, deiner Geschichte und dem, was sich für dich wahr anfühlt." },
  { number: "02", title: "Positionierung", question: "Wofür möchtest du stehen?", text: "Aus vielen Gedanken wird eine klare Botschaft, die deine Wunschkundin versteht und mit dir verbindet." },
  { number: "03", title: "Angebot", question: "Was darf entstehen oder sich verändern?", text: "Wir entwickeln ein Angebot, das ein echtes Bedürfnis löst, zu dir passt und sich nachvollziehbar verkaufen lässt." },
  { number: "04", title: "Content", question: "Was soll deine Kommunikation bewirken?", text: "Du erhältst Richtung für Inhalte, die Vertrauen aufbauen und zu deinen Angeboten führen." },
  { number: "05", title: "Strategie", question: "Was ist jetzt dein nächster Schritt?", text: "Ein klarer Fahrplan ersetzt Überforderung, Aktionismus und das Springen zur nächsten Idee." },
];

async function openExternalUrl(url: string) {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error("[Seelenakademie] Link konnte nicht geöffnet werden:", error);
  }
}

export default function SeelenakademieScreen() {
  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "bottom", "left", "right"]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backButton} activeOpacity={0.7}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Die Seelenakademie</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#F9EAF0", "#FFF8E4", "#F8F1D0"]} style={s.hero}>
          <View style={s.brandBadge}>
            <Text style={s.brandBadgeText}>SA · VON DER SEELENPLANERIN</Text>
          </View>
          <Text style={s.eyebrow}>DIE SEELENAKADEMIE</Text>
          <Text style={s.heroTitle}>Business darf sich nach dir anfühlen.</Text>
          <Text style={s.heroText}>
            Für Frauen, die etwas Eigenes aufbauen möchten – und für Frauen, deren Business existiert, aber nicht läuft oder nicht mehr zu ihnen passt.
          </Text>
          <Text style={s.heroText}>
            Wir verbinden deine Wahrheit mit klarer Positionierung, einem tragfähigen Angebot, durchdachtem Content und einer Strategie, die du wirklich umsetzen kannst.
          </Text>

          <TouchableOpacity style={s.primaryButton} onPress={() => openExternalUrl(BUSINESS_KOMPASS_URL)} activeOpacity={0.85}>
            <Text style={s.primaryButtonText}>Kostenlosen Business-Kompass starten →</Text>
          </TouchableOpacity>
          <Text style={s.buttonHint}>15 Fragen · ca. 4 Minuten · persönliche Standortbestimmung</Text>
          <TouchableOpacity style={s.secondaryButton} onPress={() => openExternalUrl(BEWERBUNG_URL)} activeOpacity={0.85}>
            <Text style={s.secondaryButtonText}>Persönliche Begleitung entdecken</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={s.section}>
          <Text style={s.sectionLabel}>DEIN STARTPUNKT</Text>
          <Text style={s.sectionTitle}>Nicht weiter. Sondern stimmiger.</Text>
          <Text style={s.sectionIntro}>Zwei Ausgangspunkte. Ein echter Weg.</Text>

          <View style={s.startCard}>
            <Text style={s.cardNumber}>01</Text>
            <Text style={s.cardTitle}>Du willst etwas Eigenes.</Text>
            <Text style={s.cardText}>Vielleicht ist da bisher nur ein Gefühl, eine Idee oder der Wunsch nach mehr Selbstbestimmung. Gemeinsam wird daraus ein klarer erster Weg.</Text>
          </View>
          <View style={s.startCard}>
            <Text style={s.cardNumber}>02</Text>
            <Text style={s.cardTitle}>Du hast ein Business – aber es trägt nicht.</Text>
            <Text style={s.cardText}>Es fehlen Resonanz, Klarheit oder Freude. Wir lösen, was nicht mehr passt, und bauen eine Richtung auf, hinter der du wieder stehen kannst.</Text>
          </View>
        </View>

        <View style={[s.section, s.foundationSection]}>
          <Text style={s.sectionLabel}>DAS FUNDAMENT</Text>
          <Text style={s.sectionTitle}>Fünf Bereiche, die zusammengehören.</Text>
          <Text style={s.sectionIntro}>Seele trifft Strategie – statt noch mehr unverbundenem Einzelwissen.</Text>
          {BEREICHE.map((bereich) => (
            <View key={bereich.number} style={s.foundationRow}>
              <Text style={s.foundationNumber}>{bereich.number}</Text>
              <View style={s.foundationContent}>
                <Text style={s.foundationTitle}>{bereich.title}</Text>
                <Text style={s.foundationQuestion}>{bereich.question}</Text>
                <Text style={s.foundationText}>{bereich.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <LinearGradient colors={["#F9EDE8", "#FAF3E7"]} style={s.whyCard}>
          <Text style={s.sectionLabel}>WARUM DIE SEELENAKADEMIE?</Text>
          <Text style={s.sectionTitle}>Weil Strategie ohne dich nicht funktionieren kann.</Text>
          <Text style={s.cardText}>
            Lara Mareen Wille verbindet ihre Erfahrung als studierte Social Media Managerin und ehemalige Agenturinhaberin mit ihrer Arbeit als Seelenplanerin. Du bekommst keine Schablone, sondern ein Fundament, das zu dir passt.
          </Text>
          {[
            "Klare Richtung statt Ideenchaos",
            "Angebote mit nachvollziehbarem Wert",
            "Content mit Aufgabe und Haltung",
            "Ein persönlicher GPT-Assistent",
          ].map((item) => (
            <View key={item} style={s.benefitRow}>
              <Text style={s.check}>✓</Text>
              <Text style={s.benefitText}>{item}</Text>
            </View>
          ))}
        </LinearGradient>

        <View style={s.applicationCard}>
          <Text style={s.applicationLabel}>PERSÖNLICHE BEGLEITUNG</Text>
          <Text style={s.applicationTitle}>Erzähl mir, wo du gerade stehst.</Text>
          <Text style={s.applicationText}>
            Du musst noch nicht alle Antworten haben. Beschreibe ehrlich, was du aufbauen möchtest oder warum sich dein bestehendes Business nicht mehr stimmig anfühlt. Lara schaut persönlich, ob und wie sie dich begleiten kann.
          </Text>
          <TouchableOpacity style={s.primaryButton} onPress={() => openExternalUrl(BEWERBUNG_URL)} activeOpacity={0.85}>
            <Text style={s.primaryButtonText}>Jetzt persönlich bewerben →</Text>
          </TouchableOpacity>
          <Text style={s.privacyText}>Deine Angaben werden vertraulich behandelt und nur für die persönliche Rückmeldung verwendet.</Text>
        </View>

        <Text style={s.closing}>Du musst nicht lauter werden. Du darfst klarer werden – in dem, was wirklich deins ist.</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: { height: 56, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.bg },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 20, backgroundColor: C.roseLight },
  backText: { fontSize: 22, color: C.brown },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "700", color: C.brown },
  headerSpacer: { width: 40 },
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { paddingBottom: 40 },
  hero: { margin: 16, padding: 22, borderRadius: 24, borderWidth: 1, borderColor: "#E8D5B0" },
  brandBadge: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 14, paddingVertical: 7, paddingHorizontal: 11, marginBottom: 18 },
  brandBadgeText: { fontSize: 10, color: C.rose, fontWeight: "800", letterSpacing: 0.8 },
  eyebrow: { fontSize: 11, color: C.rose, fontWeight: "800", letterSpacing: 2, marginBottom: 8 },
  heroTitle: { fontSize: 35, lineHeight: 41, color: C.brown, fontWeight: "800", fontFamily: "DancingScript-Bold", marginBottom: 16 },
  heroText: { fontSize: 14, lineHeight: 22, color: C.brownMid, marginBottom: 12 },
  primaryButton: { backgroundColor: C.brown, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 16, alignItems: "center", marginTop: 10 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800", textAlign: "center" },
  buttonHint: { fontSize: 10, color: C.muted, textAlign: "center", marginTop: 7, lineHeight: 15 },
  secondaryButton: { borderWidth: 1, borderColor: C.brown, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, alignItems: "center", marginTop: 12, backgroundColor: "rgba(255,255,255,0.65)" },
  secondaryButtonText: { color: C.brown, fontSize: 14, fontWeight: "700" },
  section: { marginHorizontal: 16, marginTop: 10, marginBottom: 18 },
  sectionLabel: { fontSize: 10, color: C.rose, fontWeight: "800", letterSpacing: 1.8, marginBottom: 7 },
  sectionTitle: { fontSize: 27, lineHeight: 33, color: C.brown, fontWeight: "800", fontFamily: "DancingScript-Bold", marginBottom: 8 },
  sectionIntro: { fontSize: 13, lineHeight: 20, color: C.muted, marginBottom: 14 },
  startCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, padding: 18, marginBottom: 10 },
  cardNumber: { fontSize: 11, fontWeight: "800", color: C.gold, letterSpacing: 1, marginBottom: 8 },
  cardTitle: { fontSize: 18, lineHeight: 24, fontWeight: "800", color: C.brown, marginBottom: 7 },
  cardText: { fontSize: 13, lineHeight: 21, color: C.brownMid },
  foundationSection: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 22, padding: 18 },
  foundationRow: { flexDirection: "row", paddingVertical: 14, borderTopWidth: 1, borderTopColor: C.border },
  foundationNumber: { width: 36, fontSize: 11, fontWeight: "800", color: C.rose },
  foundationContent: { flex: 1 },
  foundationTitle: { fontSize: 17, fontWeight: "800", color: C.brown, marginBottom: 3 },
  foundationQuestion: { fontSize: 13, fontWeight: "700", color: C.brownMid, marginBottom: 5 },
  foundationText: { fontSize: 12, lineHeight: 19, color: C.muted },
  whyCard: { marginHorizontal: 16, marginBottom: 18, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: C.border },
  benefitRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  check: { width: 26, height: 26, lineHeight: 26, textAlign: "center", borderRadius: 13, backgroundColor: C.gold, color: "#FFFFFF", fontWeight: "800", marginRight: 10 },
  benefitText: { flex: 1, fontSize: 13, color: C.brown, fontWeight: "600" },
  applicationCard: { marginHorizontal: 16, marginBottom: 18, backgroundColor: C.card, borderRadius: 22, padding: 21, borderWidth: 1, borderColor: C.border },
  applicationLabel: { fontSize: 10, color: C.gold, fontWeight: "800", letterSpacing: 1.7, marginBottom: 8 },
  applicationTitle: { fontSize: 27, lineHeight: 33, color: C.brown, fontWeight: "800", fontFamily: "DancingScript-Bold", marginBottom: 9 },
  applicationText: { fontSize: 13, lineHeight: 21, color: C.brownMid },
  privacyText: { fontSize: 10, lineHeight: 15, color: C.muted, textAlign: "center", marginTop: 9 },
  closing: { marginHorizontal: 26, marginVertical: 12, fontSize: 17, lineHeight: 25, fontFamily: "DancingScript-Bold", color: C.rose, textAlign: "center" },
});
