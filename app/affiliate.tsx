import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
  Alert, Platform, Share, ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import { getApiBaseUrl } from "@/constants/oauth";
// Clipboard: Platform-basiert (kein expo-clipboard nötig)

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", green: "#4CAF50", greenLight: "#E8F5E9",
};

interface AffiliateData {
  code: string;
  name: string;
  email: string;
  totalClicks: number;
  totalSales: number;
  totalEarnings: number; // in Cent
  totalPaid: number; // in Cent
  paypalEmail?: string;

}

interface SaleData {
  id: number;
  productName: string;
  saleAmount: number;
  commissionAmount: number;
  status: string;
  createdAt: string;
}

function formatCent(cent: number): string {
  return (cent / 100).toFixed(2).replace(".", ",") + " €";
}

export default function AffiliateScreen() {
  const [step, setStep] = useState<"form" | "dashboard">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [sales, setSales] = useState<SaleData[]>([]);
  const [showRichtlinien, setShowRichtlinien] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [savingPayment, setSavingPayment] = useState(false);

  const baseUrl = "https://seelenplanerin-app.onrender.com";

  const getLink = (code: string) => `${baseUrl}/ref/${code}`;

  async function handleGetCode() {
    if (!name.trim() || !email.trim()) {
      if (Platform.OS === "web") window.alert("Bitte gib deinen Namen und deine E-Mail ein.");
      else Alert.alert("Fehler", "Bitte gib deinen Namen und deine E-Mail ein.");
      return;
    }
    // Einfache E-Mail-Validierung
    if (!email.includes("@") || !email.includes(".")) {
      if (Platform.OS === "web") window.alert("Bitte gib eine gültige E-Mail-Adresse ein.");
      else Alert.alert("Fehler", "Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    setLoading(true);
    try {
      const API_URL = getApiBaseUrl();
      const res = await fetch(`${API_URL}/api/trpc/affiliate.getOrCreate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { email: email.trim().toLowerCase(), name: name.trim() } }),
      });
      const data = await res.json();
      if (data?.result?.data?.json?.success && data.result.data.json.affiliate) {
        const aff = data.result.data.json.affiliate;
        setAffiliate(aff);
        setPaypalEmail(aff.paypalEmail || "");
        setStep("dashboard");
        // Verkäufe laden
        loadSales(aff.code);
      } else {
        if (Platform.OS === "web") window.alert("Fehler beim Erstellen deines Codes. Bitte versuche es erneut.");
        else Alert.alert("Fehler", "Fehler beim Erstellen deines Codes. Bitte versuche es erneut.");
      }
    } catch (e) {
      console.error("[Affiliate] Error:", e);
      if (Platform.OS === "web") window.alert("Verbindungsfehler. Bitte versuche es erneut.");
      else Alert.alert("Fehler", "Verbindungsfehler. Bitte versuche es erneut.");
    }
    setLoading(false);
  }

  async function loadSales(code: string) {
    try {
      const API_URL = getApiBaseUrl();
      const res = await fetch(`${API_URL}/api/trpc/affiliate.getSales?input=${encodeURIComponent(JSON.stringify({ json: { code } }))}`);
      const data = await res.json();
      if (data?.result?.data?.json) {
        setSales(data.result.data.json);
      }
    } catch (e) {
      console.error("[Affiliate] Load sales error:", e);
    }
  }

  async function handleCopyLink() {
    if (!affiliate) return;
    const link = getLink(affiliate.code);
    try {
      if (Platform.OS === "web" && navigator.clipboard) {
        await navigator.clipboard.writeText(link);
      } else {
        // Fallback: Share-API oder Prompt
        await Share.share({ message: link });
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Letzter Fallback
      if (Platform.OS === "web") {
        window.prompt("Link kopieren:", link);
      }
    }
  }

  async function handleShareLink() {
    if (!affiliate) return;
    const link = getLink(affiliate.code);
    const message = `Schau dir Die Seelenplanerin an – Rituale, Meditationen & spirituelle Begleitung für deine Seele 🌸\n\n${link}`;
    try {
      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({ title: "Die Seelenplanerin", text: message, url: link });
        } else {
          await navigator.clipboard.writeText(message);
          window.alert("Link wurde kopiert!");
        }
      } else {
        await Share.share({ message });
      }
    } catch (e) {
      // User cancelled
    }
  }

  async function handleSavePaymentInfo() {
    if (!affiliate) return;
    setSavingPayment(true);
    try {
      const API_URL = getApiBaseUrl();
      await fetch(`${API_URL}/api/trpc/affiliate.updatePaymentInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { code: affiliate.code, paypalEmail: paypalEmail.trim() } }),
      });
      if (Platform.OS === "web") window.alert("Zahlungsdaten gespeichert!");
      else Alert.alert("Gespeichert", "Deine Zahlungsdaten wurden gespeichert.");
    } catch (e) {
      if (Platform.OS === "web") window.alert("Fehler beim Speichern.");
      else Alert.alert("Fehler", "Fehler beim Speichern.");
    }
    setSavingPayment(false);
  }

  const openBalance = affiliate ? (affiliate.totalEarnings - affiliate.totalPaid) : 0;

  // ── FORM: Name + E-Mail eingeben ──
  if (step === "form") {
    return (
      <ScreenContainer className="bg-[#FDF8F4]">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
              <Text style={{ fontSize: 22, color: C.brown }}>‹</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>Geben & Nehmen</Text>
          </View>

          {/* Intro */}
          <View style={s.introCard}>
            <Text style={s.introEmoji}>🤝</Text>
            <Text style={s.introTitle}>Empfehle Die Seelenplanerin{"\n"}und verdiene mit</Text>
            <Text style={s.introText}>
              Du liebst Die Seelenplanerin? Dann teile sie mit deinen Freundinnen, deiner Familie oder deiner Community – und erhalte{" "}
              <Text style={{ fontWeight: "700", color: C.gold }}>15% Provision</Text> auf jeden Verkauf, der über deinen persönlichen Link zustande kommt.
            </Text>
            <Text style={[s.introText, { marginTop: 8 }]}>
              Egal ob Armbänder, Kerzen, Aura Readings, Soul Talks oder der Seelenimpuls – du verdienst auf alles mit. Kein Mindestbetrag, keine versteckten Bedingungen.
            </Text>
          </View>

          {/* So funktioniert's */}
          <View style={s.stepsCard}>
            <Text style={s.stepsTitle}>So funktioniert's</Text>
            <View style={s.stepRow}>
              <View style={s.stepCircle}><Text style={s.stepNum}>1</Text></View>
              <Text style={s.stepText}>Gib deinen Namen und deine E-Mail ein</Text>
            </View>
            <View style={s.stepRow}>
              <View style={s.stepCircle}><Text style={s.stepNum}>2</Text></View>
              <Text style={s.stepText}>Du bekommst sofort deinen persönlichen Empfehlungslink</Text>
            </View>
            <View style={s.stepRow}>
              <View style={s.stepCircle}><Text style={s.stepNum}>3</Text></View>
              <Text style={s.stepText}>Teile den Link per WhatsApp, Instagram, E-Mail – wie du möchtest</Text>
            </View>
            <View style={s.stepRow}>
              <View style={s.stepCircle}><Text style={s.stepNum}>4</Text></View>
              <Text style={s.stepText}>Sobald jemand über deinen Link kauft und die Zahlung eingegangen ist, erhältst du 15% Provision</Text>
            </View>
          </View>

          {/* Formular */}
          <View style={s.formCard}>
            <Text style={s.formTitle}>Jetzt deinen Link holen</Text>
            <Text style={s.inputLabel}>Dein Name</Text>
            <TextInput
              style={s.input}
              placeholder="Vorname Nachname"
              placeholderTextColor={C.muted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <Text style={s.inputLabel}>Deine E-Mail</Text>
            <TextInput
              style={s.input}
              placeholder="deine@email.de"
              placeholderTextColor={C.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleGetCode}
            />
            <TouchableOpacity
              style={[s.primaryBtn, loading && { opacity: 0.6 }]}
              onPress={handleGetCode}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={s.primaryBtnText}>Meinen Link erstellen</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Richtlinien-Teaser */}
          <TouchableOpacity
            style={s.richtlinienToggle}
            onPress={() => setShowRichtlinien(!showRichtlinien)}
            activeOpacity={0.8}
          >
            <Text style={s.richtlinienToggleText}>
              {showRichtlinien ? "▾ Richtlinien ausblenden" : "▸ Richtlinien & Bedingungen anzeigen"}
            </Text>
          </TouchableOpacity>

          {showRichtlinien && (
            <View style={s.richtlinienCard}>
              <Text style={s.richtlinienTitle}>Richtlinien & Bedingungen</Text>
              <Text style={s.richtlinienText}>
                <Text style={{ fontWeight: "700" }}>1. Provisionshöhe{"\n"}</Text>
                Du erhältst 15% Provision auf den Netto-Verkaufspreis aller Produkte und Dienstleistungen, die über deinen persönlichen Empfehlungslink gekauft werden.{"\n\n"}

                <Text style={{ fontWeight: "700" }}>2. Wann wird die Provision fällig?{"\n"}</Text>
                Die Provision wird erst fällig und gutgeschrieben, sobald die Zahlung des Käufers vollständig und positiv eingegangen ist. Bei Rückerstattungen, Stornierungen oder Rückbuchungen entfällt die Provision.{"\n\n"}

                <Text style={{ fontWeight: "700" }}>3. Auszahlung{"\n"}</Text>
                Es gibt keinen Mindestbetrag für Auszahlungen. Jeder verdiente Betrag wird ausgezahlt. Die Auszahlung erfolgt per PayPal. Hinterlege dazu einfach deine PayPal-E-Mail-Adresse. Auszahlungen werden regelmäßig von Die Seelenplanerin veranlasst.{"\n\n"}

                <Text style={{ fontWeight: "700" }}>4. Zuordnung von Verkäufen{"\n"}</Text>
                Ein Verkauf wird dir zugeordnet, wenn der Käufer über deinen persönlichen Empfehlungslink auf die Seite gelangt ist. Die Zuordnung erfolgt über einen Tracking-Code in deinem Link.{"\n\n"}

                <Text style={{ fontWeight: "700" }}>5. Faire Nutzung{"\n"}</Text>
                Eigenkäufe über den eigenen Empfehlungslink sind nicht provisionsberechtigt. Spam, irreführende Werbung oder das Vortäuschen falscher Tatsachen führen zum Ausschluss aus dem Programm.{"\n\n"}

                <Text style={{ fontWeight: "700" }}>6. Transparenz{"\n"}</Text>
                Du kannst jederzeit in der App deinen aktuellen Stand einsehen: Klicks, Verkäufe, verdiente Provision und Auszahlungen. Alles ist transparent und nachvollziehbar.{"\n\n"}

                <Text style={{ fontWeight: "700" }}>7. Änderungen{"\n"}</Text>
                Die Seelenplanerin behält sich vor, die Bedingungen des Empfehlungsprogramms jederzeit anzupassen. Über Änderungen wirst du per E-Mail informiert.{"\n\n"}

                <Text style={{ fontWeight: "700" }}>8. Steuerliche Hinweise{"\n"}</Text>
                Provisionseinnahmen können steuerpflichtig sein. Du bist selbst für die korrekte Versteuerung deiner Einnahmen verantwortlich.
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ── DASHBOARD: Link + Statistiken ──
  return (
    <ScreenContainer className="bg-[#FDF8F4]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <Text style={{ fontSize: 22, color: C.brown }}>‹</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Geben & Nehmen</Text>
        </View>

        {/* Willkommen */}
        <View style={s.welcomeCard}>
          <Text style={s.welcomeEmoji}>🌸</Text>
          <Text style={s.welcomeName}>Hallo {affiliate?.name}!</Text>
          <Text style={s.welcomeText}>Hier ist dein persönlicher Empfehlungslink. Teile ihn und verdiene 15% auf jeden Verkauf.</Text>
        </View>

        {/* Dein Link */}
        <View style={s.linkCard}>
          <Text style={s.linkTitle}>Dein persönlicher Link</Text>
          <View style={s.linkBox}>
            <Text style={s.linkText} numberOfLines={1} ellipsizeMode="middle">
              {affiliate ? getLink(affiliate.code) : ""}
            </Text>
          </View>
          <View style={s.linkBtnRow}>
            <TouchableOpacity style={[s.linkBtn, copied && { backgroundColor: C.green }]} onPress={handleCopyLink} activeOpacity={0.85}>
              <Text style={s.linkBtnText}>{copied ? "✓ Kopiert!" : "Link kopieren"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.linkBtn, { backgroundColor: C.gold }]} onPress={handleShareLink} activeOpacity={0.85}>
              <Text style={s.linkBtnText}>Teilen</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.codeHint}>Dein Code: <Text style={{ fontWeight: "700", color: C.gold }}>{affiliate?.code}</Text></Text>
        </View>

        {/* Statistiken */}
        <View style={s.statsCard}>
          <Text style={s.statsTitle}>Deine Statistiken</Text>
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statNum}>{affiliate?.totalClicks || 0}</Text>
              <Text style={s.statLabel}>Klicks</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statNum}>{affiliate?.totalSales || 0}</Text>
              <Text style={s.statLabel}>Verkäufe</Text>
            </View>
            <View style={s.statBox}>
              <Text style={[s.statNum, { color: C.green }]}>{formatCent(affiliate?.totalEarnings || 0)}</Text>
              <Text style={s.statLabel}>Verdient</Text>
            </View>
          </View>
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statNum}>{formatCent(affiliate?.totalPaid || 0)}</Text>
              <Text style={s.statLabel}>Ausgezahlt</Text>
            </View>
            <View style={[s.statBox, { backgroundColor: openBalance > 0 ? C.greenLight : C.goldLight }]}>
              <Text style={[s.statNum, { color: openBalance > 0 ? C.green : C.brown }]}>{formatCent(openBalance)}</Text>
              <Text style={s.statLabel}>Offen</Text>
            </View>
          </View>
        </View>

        {/* Letzte Verkäufe */}
        {sales.length > 0 && (
          <View style={s.salesCard}>
            <Text style={s.salesTitle}>Deine Verkäufe</Text>
            {sales.map((sale) => (
              <View key={sale.id} style={s.saleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.saleProduct}>{sale.productName}</Text>
                  <Text style={s.saleDate}>{new Date(sale.createdAt).toLocaleDateString("de-DE")}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={s.saleAmount}>+{formatCent(sale.commissionAmount)}</Text>
                  <Text style={[s.saleStatus, {
                    color: sale.status === "paid" ? C.green : sale.status === "confirmed" ? C.gold : C.muted
                  }]}>
                    {sale.status === "paid" ? "Ausgezahlt" : sale.status === "confirmed" ? "Bestätigt" : "Ausstehend"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {sales.length === 0 && (
          <View style={s.emptySales}>
            <Text style={s.emptySalesEmoji}>📊</Text>
            <Text style={s.emptySalesText}>Noch keine Verkäufe – teile deinen Link und es geht los!</Text>
          </View>
        )}

        {/* Zahlungsdaten */}
        <View style={s.paymentCard}>
          <Text style={s.paymentTitle}>Deine Zahlungsdaten</Text>
          <Text style={s.paymentDesc}>Damit wir dir deine Provision auszahlen können, hinterlege bitte deine PayPal-Adresse. Falls du noch kein PayPal hast, kannst du dir kostenlos ein Konto erstellen unter paypal.com.</Text>
          <Text style={s.inputLabel}>PayPal E-Mail</Text>
          <TextInput
            style={s.input}
            placeholder="deine@paypal-email.de"
            placeholderTextColor={C.muted}
            value={paypalEmail}
            onChangeText={setPaypalEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[s.saveBtn, savingPayment && { opacity: 0.6 }]}
            onPress={handleSavePaymentInfo}
            disabled={savingPayment}
            activeOpacity={0.85}
          >
            {savingPayment ? (
              <ActivityIndicator color={C.brown} />
            ) : (
              <Text style={s.saveBtnText}>Zahlungsdaten speichern</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Richtlinien */}
        <TouchableOpacity
          style={s.richtlinienToggle}
          onPress={() => setShowRichtlinien(!showRichtlinien)}
          activeOpacity={0.8}
        >
          <Text style={s.richtlinienToggleText}>
            {showRichtlinien ? "▾ Richtlinien ausblenden" : "▸ Richtlinien & Bedingungen anzeigen"}
          </Text>
        </TouchableOpacity>

        {showRichtlinien && (
          <View style={s.richtlinienCard}>
            <Text style={s.richtlinienTitle}>Richtlinien & Bedingungen</Text>
            <Text style={s.richtlinienText}>
              <Text style={{ fontWeight: "700" }}>1. Provisionshöhe{"\n"}</Text>
              Du erhältst 15% Provision auf den Netto-Verkaufspreis aller Produkte und Dienstleistungen, die über deinen persönlichen Empfehlungslink gekauft werden.{"\n\n"}

              <Text style={{ fontWeight: "700" }}>2. Wann wird die Provision fällig?{"\n"}</Text>
              Die Provision wird erst fällig und gutgeschrieben, sobald die Zahlung des Käufers vollständig und positiv eingegangen ist. Bei Rückerstattungen, Stornierungen oder Rückbuchungen entfällt die Provision.{"\n\n"}

              <Text style={{ fontWeight: "700" }}>3. Auszahlung{"\n"}</Text>
              Es gibt keinen Mindestbetrag für Auszahlungen. Jeder verdiente Betrag wird ausgezahlt. Die Auszahlung erfolgt per PayPal. Hinterlege dazu einfach deine PayPal-E-Mail-Adresse. Auszahlungen werden regelmäßig von Die Seelenplanerin veranlasst.{"\n\n"}

              <Text style={{ fontWeight: "700" }}>4. Zuordnung von Verkäufen{"\n"}</Text>
              Ein Verkauf wird dir zugeordnet, wenn der Käufer über deinen persönlichen Empfehlungslink auf die Seite gelangt ist. Die Zuordnung erfolgt über einen Tracking-Code in deinem Link.{"\n\n"}

              <Text style={{ fontWeight: "700" }}>5. Faire Nutzung{"\n"}</Text>
              Eigenkäufe über den eigenen Empfehlungslink sind nicht provisionsberechtigt. Spam, irreführende Werbung oder das Vortäuschen falscher Tatsachen führen zum Ausschluss aus dem Programm.{"\n\n"}

              <Text style={{ fontWeight: "700" }}>6. Transparenz{"\n"}</Text>
              Du kannst jederzeit in der App deinen aktuellen Stand einsehen: Klicks, Verkäufe, verdiente Provision und Auszahlungen. Alles ist transparent und nachvollziehbar.{"\n\n"}

              <Text style={{ fontWeight: "700" }}>7. Änderungen{"\n"}</Text>
              Die Seelenplanerin behält sich vor, die Bedingungen des Empfehlungsprogramms jederzeit anzupassen. Über Änderungen wirst du per E-Mail informiert.{"\n\n"}

              <Text style={{ fontWeight: "700" }}>8. Steuerliche Hinweise{"\n"}</Text>
              Provisionseinnahmen können steuerpflichtig sein. Du bist selbst für die korrekte Versteuerung deiner Einnahmen verantwortlich.
            </Text>
          </View>
        )}

        {/* Zurück zum Formular */}
        <TouchableOpacity style={s.switchBtn} onPress={() => setStep("form")} activeOpacity={0.8}>
          <Text style={s.switchBtnText}>Mit anderer E-Mail anmelden</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 16,
    paddingTop: 16, paddingBottom: 12, backgroundColor: C.roseLight,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: C.card,
    alignItems: "center", justifyContent: "center", marginRight: 12,
    borderWidth: 1, borderColor: C.border,
  },
  headerTitle: {
    fontSize: 20, fontWeight: "700", color: C.brown, fontFamily: "serif",
  },

  // Intro
  introCard: {
    margin: 16, backgroundColor: C.card, borderRadius: 16, padding: 24,
    borderWidth: 1, borderColor: C.border, alignItems: "center",
  },
  introEmoji: { fontSize: 40, marginBottom: 12 },
  introTitle: {
    fontSize: 20, fontWeight: "700", color: C.brown, textAlign: "center",
    marginBottom: 12, lineHeight: 28, fontFamily: "serif",
  },
  introText: {
    fontSize: 14, color: C.brownMid, lineHeight: 22, textAlign: "center",
  },

  // Steps
  stepsCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.gold + "40",
  },
  stepsTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 16, fontFamily: "serif",
  },
  stepRow: {
    flexDirection: "row", alignItems: "flex-start", marginBottom: 12,
  },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: C.gold,
    alignItems: "center", justifyContent: "center", marginRight: 12, marginTop: 1,
  },
  stepNum: { fontSize: 14, fontWeight: "700", color: "#FFF" },
  stepText: { flex: 1, fontSize: 14, color: C.brownMid, lineHeight: 20 },

  // Form
  formCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  formTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 16, fontFamily: "serif",
  },
  inputLabel: {
    fontSize: 13, fontWeight: "600", color: C.brownMid, marginBottom: 6, marginTop: 8,
  },
  input: {
    backgroundColor: C.bg, borderRadius: 12, padding: 14, fontSize: 15,
    color: C.brown, borderWidth: 1, borderColor: C.border, marginBottom: 8,
  },
  primaryBtn: {
    backgroundColor: C.rose, borderRadius: 12, padding: 16, alignItems: "center",
    marginTop: 12,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "700", color: "#FFF" },

  // Richtlinien
  richtlinienToggle: {
    marginHorizontal: 16, marginBottom: 8, padding: 12,
  },
  richtlinienToggleText: {
    fontSize: 14, color: C.gold, fontWeight: "600",
  },
  richtlinienCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  richtlinienTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 12, fontFamily: "serif",
  },
  richtlinienText: {
    fontSize: 13, color: C.brownMid, lineHeight: 20,
  },

  // Dashboard
  welcomeCard: {
    margin: 16, backgroundColor: C.roseLight, borderRadius: 16, padding: 24,
    alignItems: "center", borderWidth: 1, borderColor: C.rose + "30",
  },
  welcomeEmoji: { fontSize: 36, marginBottom: 8 },
  welcomeName: {
    fontSize: 20, fontWeight: "700", color: C.brown, marginBottom: 8, fontFamily: "serif",
  },
  welcomeText: {
    fontSize: 14, color: C.brownMid, textAlign: "center", lineHeight: 20,
  },

  // Link
  linkCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  linkTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 12, fontFamily: "serif",
  },
  linkBox: {
    backgroundColor: C.bg, borderRadius: 10, padding: 14, borderWidth: 1,
    borderColor: C.border, marginBottom: 12,
  },
  linkText: { fontSize: 13, color: C.gold, fontWeight: "600" },
  linkBtnRow: { flexDirection: "row", gap: 10 },
  linkBtn: {
    flex: 1, backgroundColor: C.rose, borderRadius: 10, padding: 12,
    alignItems: "center",
  },
  linkBtnText: { fontSize: 14, fontWeight: "700", color: "#FFF" },
  codeHint: {
    fontSize: 12, color: C.muted, textAlign: "center", marginTop: 12,
  },

  // Stats
  statsCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  statsTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 16, fontFamily: "serif",
  },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  statBox: {
    flex: 1, backgroundColor: C.bg, borderRadius: 12, padding: 14,
    alignItems: "center", borderWidth: 1, borderColor: C.border,
  },
  statNum: { fontSize: 18, fontWeight: "700", color: C.brown, marginBottom: 4 },
  statLabel: { fontSize: 11, color: C.muted, fontWeight: "500" },

  // Sales
  salesCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  salesTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 12, fontFamily: "serif",
  },
  saleRow: {
    flexDirection: "row", alignItems: "center", paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  saleProduct: { fontSize: 14, fontWeight: "600", color: C.brown },
  saleDate: { fontSize: 12, color: C.muted, marginTop: 2 },
  saleAmount: { fontSize: 15, fontWeight: "700", color: C.green },
  saleStatus: { fontSize: 11, fontWeight: "500", marginTop: 2 },

  // Empty sales
  emptySales: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 24, alignItems: "center",
    borderWidth: 1, borderColor: C.gold + "30",
  },
  emptySalesEmoji: { fontSize: 32, marginBottom: 8 },
  emptySalesText: { fontSize: 14, color: C.brownMid, textAlign: "center", lineHeight: 20 },

  // Payment
  paymentCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  paymentTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 8, fontFamily: "serif",
  },
  paymentDesc: {
    fontSize: 13, color: C.muted, marginBottom: 12, lineHeight: 18,
  },
  saveBtn: {
    backgroundColor: C.goldLight, borderRadius: 12, padding: 14, alignItems: "center",
    marginTop: 8, borderWidth: 1, borderColor: C.gold,
  },
  saveBtnText: { fontSize: 14, fontWeight: "600", color: C.brown },

  // Switch
  switchBtn: {
    marginHorizontal: 16, marginBottom: 8, padding: 12, alignItems: "center",
  },
  switchBtnText: { fontSize: 13, color: C.muted, textDecorationLine: "underline" },
});
