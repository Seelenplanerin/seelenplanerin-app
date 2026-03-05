import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
  Alert, Platform, Share, ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { router } from "expo-router";
import { getApiBaseUrl } from "@/constants/oauth";

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
  totalEarnings: number;
  totalPaid: number;
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
  return (cent / 100).toFixed(2).replace(".", ",") + " \u20AC";
}

export default function AffiliateScreen() {
  const [step, setStep] = useState<"form" | "login" | "dashboard">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wunschCode, setWunschCode] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [sales, setSales] = useState<SaleData[]>([]);
  const [showRichtlinien, setShowRichtlinien] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [savingPayment, setSavingPayment] = useState(false);
  const [resetSending, setResetSending] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [changePwMsg, setChangePwMsg] = useState("");

  const baseUrl = "https://seelenplanerin-app.onrender.com";
  const getLink = (code: string) => `${baseUrl}/ref/${code}`;

  // Wunschcode formatieren: nur Buchstaben, keine Sonderzeichen, Gro\u00dfbuchstaben
  function formatCode(text: string): string {
    return text.replace(/[^a-zA-Z\u00e4\u00f6\u00fc\u00c4\u00d6\u00dc0-9]/g, "").toUpperCase().slice(0, 20);
  }

  async function handleGetCode() {
    if (!name.trim() || !email.trim()) {
      const msg = "Bitte gib deinen Namen und deine E-Mail ein.";
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Fehler", msg);
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      const msg = "Bitte gib eine g\u00fcltige E-Mail-Adresse ein.";
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Fehler", msg);
      return;
    }
    if (!wunschCode.trim() || wunschCode.trim().length < 2) {
      const msg = "Bitte gib einen Wunschcode ein (mindestens 2 Zeichen).";
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Fehler", msg);
      return;
    }
    if (!password.trim() || password.trim().length < 4) {
      const msg = "Bitte w\u00e4hle ein Passwort (mindestens 4 Zeichen).";
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Fehler", msg);
      return;
    }
    setCodeError("");
    setLoading(true);
    try {
      const API_URL = getApiBaseUrl();
      const res = await fetch(`${API_URL}/api/trpc/affiliate.getOrCreate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: {
          email: email.trim().toLowerCase(),
          name: name.trim(),
          wunschCode: wunschCode.trim().toUpperCase(),
          password: password.trim(),
        } }),
      });
      const data = await res.json();
      const result = data?.result?.data?.json;
      if (result?.success && result.affiliate) {
        setAffiliate(result.affiliate);
        setPaypalEmail(result.affiliate.paypalEmail || "");
        setStep("dashboard");
        loadSales(result.affiliate.code);
      } else if (result?.error === "code_taken") {
        setCodeError("Dieser Code ist leider schon vergeben. Bitte w\u00e4hle einen anderen.");
      } else {
        const msg = "Fehler beim Erstellen deines Codes. Bitte versuche es erneut.";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("Fehler", msg);
      }
    } catch (e) {
      console.error("[Affiliate] Error:", e);
      const msg = "Verbindungsfehler. Bitte versuche es erneut.";
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Fehler", msg);
    }
    setLoading(false);
  }

  async function handleLogin() {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      const msg = "Bitte gib deine E-Mail und dein Passwort ein.";
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Fehler", msg);
      return;
    }
    setLoginError("");
    setLoading(true);
    try {
      const API_URL = getApiBaseUrl();
      const res = await fetch(`${API_URL}/api/trpc/affiliate.login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: {
          email: loginEmail.trim().toLowerCase(),
          password: loginPassword.trim(),
        } }),
      });
      const data = await res.json();
      const result = data?.result?.data?.json;
      if (result?.success && result.affiliate) {
        setAffiliate(result.affiliate);
        setPaypalEmail(result.affiliate.paypalEmail || "");
        setStep("dashboard");
        loadSales(result.affiliate.code);
      } else if (result?.error === "not_found") {
        setLoginError("Diese E-Mail ist nicht registriert. Bitte erstelle zuerst einen Code.");
      } else if (result?.error === "wrong_password") {
        setLoginError("Falsches Passwort. Bitte versuche es erneut.");
      } else {
        setLoginError("Login fehlgeschlagen. Bitte versuche es erneut.");
      }
    } catch (e) {
      console.error("[Affiliate] Login Error:", e);
      setLoginError("Verbindungsfehler. Bitte versuche es erneut.");
    }
    setLoading(false);
  }

  async function handleResetPassword() {
    if (!loginEmail.trim()) {
      const msg = "Bitte gib zuerst deine E-Mail-Adresse ein.";
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Hinweis", msg);
      return;
    }
    setResetSending(true);
    try {
      const API_URL = getApiBaseUrl();
      const res = await fetch(`${API_URL}/api/trpc/affiliate.resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { email: loginEmail.trim().toLowerCase() } }),
      });
      const data = await res.json();
      const result = data?.result?.data?.json;
      if (result?.success) {
        setResetSent(true);
        const msg = "Ein neues Passwort wurde an deine E-Mail gesendet. Bitte pr\u00fcfe dein Postfach.";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("E-Mail gesendet", msg);
      } else if (result?.error === "not_found") {
        const msg = "Diese E-Mail ist nicht registriert.";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("Fehler", msg);
      } else if (result?.error === "email_failed") {
        const msg = "E-Mail konnte nicht gesendet werden. Bitte versuche es sp\u00e4ter erneut.";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("Fehler", msg);
      } else {
        const msg = "Fehler beim Zur\u00fccksetzen. Bitte versuche es erneut.";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("Fehler", msg);
      }
    } catch (e) {
      console.error("[Affiliate] Reset error:", e);
      const msg = "Verbindungsfehler. Bitte versuche es erneut.";
      if (Platform.OS === "web") window.alert(msg);
      else Alert.alert("Fehler", msg);
    }
    setResetSending(false);
  }

  async function loadSales(code: string) {
    try {
      const API_URL = getApiBaseUrl();
      const res = await fetch(`${API_URL}/api/trpc/affiliate.getSales?input=${encodeURIComponent(JSON.stringify({ json: { code } }))}`);
      const data = await res.json();
      if (data?.result?.data?.json) setSales(data.result.data.json);
    } catch (e) {
      console.error("[Affiliate] Load sales error:", e);
    }
  }

  async function handleCopyCode() {
    if (!affiliate) return;
    try {
      if (Platform.OS === "web" && navigator.clipboard) {
        await navigator.clipboard.writeText(affiliate.code);
      } else {
        await Share.share({ message: `Mein Empfehlungscode f\u00fcr Die Seelenplanerin: ${affiliate.code}` });
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      if (Platform.OS === "web") window.prompt("Code kopieren:", affiliate.code);
    }
  }

  async function handleShareCode() {
    if (!affiliate) return;
    const message = `Schau dir Die Seelenplanerin an \u2013 Rituale, Meditationen & spirituelle Begleitung f\u00fcr deine Seele \ud83c\udf38\n\nGib bei deiner Bestellung meinen Code ein: ${affiliate.code}\n\n${getLink(affiliate.code)}`;
    try {
      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({ title: "Die Seelenplanerin", text: message });
        } else {
          await navigator.clipboard.writeText(message);
          window.alert("Nachricht wurde kopiert!");
        }
      } else {
        await Share.share({ message });
      }
    } catch (e) { /* User cancelled */ }
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

  async function handleChangePassword() {
    if (!affiliate) return;
    if (!oldPw.trim()) {
      setChangePwMsg("Bitte gib dein aktuelles Passwort ein.");
      return;
    }
    if (newPw.length < 4) {
      setChangePwMsg("Das neue Passwort muss mindestens 4 Zeichen lang sein.");
      return;
    }
    if (newPw !== newPw2) {
      setChangePwMsg("Die Passw\u00f6rter stimmen nicht \u00fcberein.");
      return;
    }
    setChangePwLoading(true);
    setChangePwMsg("");
    try {
      const API_URL = getApiBaseUrl();
      const res = await fetch(`${API_URL}/api/trpc/affiliate.changePassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: {
          code: affiliate.code,
          oldPassword: oldPw,
          newPassword: newPw,
        } }),
      });
      const data = await res.json();
      const result = data?.result?.data?.json;
      if (result?.success) {
        const msg = "Passwort erfolgreich ge\u00e4ndert!";
        if (Platform.OS === "web") window.alert(msg);
        else Alert.alert("Erfolg", msg);
        setOldPw(""); setNewPw(""); setNewPw2(""); setShowChangePw(false); setChangePwMsg("");
      } else if (result?.error === "wrong_password") {
        setChangePwMsg("Das aktuelle Passwort ist falsch.");
      } else {
        setChangePwMsg("Fehler beim \u00c4ndern. Bitte versuche es erneut.");
      }
    } catch (e) {
      setChangePwMsg("Verbindungsfehler. Bitte versuche es erneut.");
    }
    setChangePwLoading(false);
  }

  const openBalance = affiliate ? (affiliate.totalEarnings - affiliate.totalPaid) : 0;

  // \u2500\u2500 LOGIN: E-Mail + Passwort eingeben \u2500\u2500
  if (step === "login") {
    return (
      <ScreenContainer className="bg-[#FDF8F4]">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
              <Text style={{ fontSize: 22, color: C.brown }}>{"\u2039"}</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>Geben & Nehmen</Text>
          </View>

          {/* Login Card */}
          <View style={s.formCard}>
            <Text style={s.formTitle}>Einloggen</Text>
            <Text style={{ fontSize: 14, color: C.brownMid, marginBottom: 16, lineHeight: 20 }}>
              Melde dich mit deiner E-Mail und deinem Passwort an, um dein Affiliate-Dashboard zu sehen.
            </Text>

            <Text style={s.inputLabel}>Deine E-Mail</Text>
            <TextInput
              style={[s.input, loginError ? { borderColor: "#EF4444" } : {}]}
              placeholder="deine@email.de"
              placeholderTextColor={C.muted}
              value={loginEmail}
              onChangeText={(t) => { setLoginEmail(t); setLoginError(""); }}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />

            <Text style={s.inputLabel}>Dein Passwort</Text>
            <TextInput
              style={[s.input, loginError ? { borderColor: "#EF4444" } : {}]}
              placeholder="Dein Passwort"
              placeholderTextColor={C.muted}
              value={loginPassword}
              onChangeText={(t) => { setLoginPassword(t); setLoginError(""); }}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            {loginError ? (
              <Text style={{ fontSize: 13, color: "#EF4444", marginBottom: 8 }}>{loginError}</Text>
            ) : null}

            <TouchableOpacity
              style={[s.primaryBtn, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={s.primaryBtnText}>Einloggen</Text>
              )}
            </TouchableOpacity>

            {/* Passwort vergessen */}
            <TouchableOpacity
              style={{ marginTop: 12, alignItems: "center", padding: 8 }}
              onPress={handleResetPassword}
              disabled={resetSending}
              activeOpacity={0.7}
            >
              {resetSending ? (
                <ActivityIndicator color={C.gold} size="small" />
              ) : resetSent ? (
                <Text style={{ fontSize: 13, color: C.green, fontWeight: "600" }}>{"\u2713"} Neues Passwort gesendet!</Text>
              ) : (
                <Text style={{ fontSize: 13, color: C.gold, fontWeight: "600" }}>Passwort vergessen?</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Noch nicht registriert? */}
          <TouchableOpacity
            style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border }}
            onPress={() => setStep("form")}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: C.brown, marginBottom: 4 }}>Noch nicht registriert?</Text>
            <Text style={{ fontSize: 13, color: C.gold, fontWeight: "600" }}>Jetzt Code erstellen {"\u2192"}</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  // \u2500\u2500 FORM: Name + E-Mail + Wunschcode eingeben \u2500\u2500
  if (step === "form") {
    return (
      <ScreenContainer className="bg-[#FDF8F4]">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
              <Text style={{ fontSize: 22, color: C.brown }}>{"\u2039"}</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>Geben & Nehmen</Text>
          </View>

          {/* Intro */}
          <View style={s.introCard}>
            <Text style={s.introEmoji}>{"\ud83e\udd1d"}</Text>
            <Text style={s.introTitle}>Empfehle Die Seelenplanerin{"\n"}und verdiene mit</Text>
            <Text style={s.introText}>
              Du liebst Die Seelenplanerin? Dann teile deinen pers\u00f6nlichen Code mit Freundinnen, Familie oder deiner Community \u2013 und erhalte{" "}
              <Text style={{ fontWeight: "700", color: C.gold }}>20% Provision</Text> auf jeden Verkauf.
            </Text>
            <Text style={[s.introText, { marginTop: 8 }]}>
              Egal ob Armb\u00e4nder, Kerzen, Aura Readings, Soul Talks oder der Seelenimpuls \u2013 du verdienst auf alles mit. Kein Mindestbetrag, keine versteckten Bedingungen.
            </Text>
          </View>

          {/* So funktioniert's */}
          <View style={s.stepsCard}>
            <Text style={s.stepsTitle}>So funktioniert's</Text>
            <View style={s.stepRow}>
              <View style={s.stepCircle}><Text style={s.stepNum}>1</Text></View>
              <Text style={s.stepText}>W\u00e4hle deinen pers\u00f6nlichen Code \u2013 z.B. deinen Vornamen</Text>
            </View>
            <View style={s.stepRow}>
              <View style={s.stepCircle}><Text style={s.stepNum}>2</Text></View>
              <Text style={s.stepText}>Teile deinen Code per WhatsApp, Instagram oder pers\u00f6nlich</Text>
            </View>
            <View style={s.stepRow}>
              <View style={s.stepCircle}><Text style={s.stepNum}>3</Text></View>
              <Text style={s.stepText}>Der K\u00e4ufer gibt deinen Code bei der Bestellung auf Tentary ein</Text>
            </View>
            <View style={s.stepRow}>
              <View style={s.stepCircle}><Text style={s.stepNum}>4</Text></View>
              <Text style={s.stepText}>Du erh\u00e4ltst 20% Provision sobald die Zahlung eingegangen ist</Text>
            </View>
          </View>

          {/* Formular */}
          <View style={s.formCard}>
            <Text style={s.formTitle}>Jetzt deinen Code holen</Text>

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
              returnKeyType="next"
            />

            <Text style={s.inputLabel}>Dein Wunschcode</Text>
            <Text style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>
              W\u00e4hle einen einfachen Code, den du leicht weitergeben kannst \u2013 z.B. deinen Vornamen.
            </Text>
            <TextInput
              style={[s.input, codeError ? { borderColor: "#EF4444" } : {}]}
              placeholder="z.B. SARAH, LISA, ANNA"
              placeholderTextColor={C.muted}
              value={wunschCode}
              onChangeText={(t) => { setWunschCode(formatCode(t)); setCodeError(""); }}
              autoCapitalize="characters"
              returnKeyType="next"
            />
            {codeError ? (
              <Text style={{ fontSize: 12, color: "#EF4444", marginBottom: 8, marginTop: -4 }}>{codeError}</Text>
            ) : null}
            {wunschCode.length >= 2 && (
              <View style={{ backgroundColor: C.goldLight, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: C.gold + "40" }}>
                <Text style={{ fontSize: 13, color: C.brown, textAlign: "center" }}>
                  Dein Code wird: <Text style={{ fontWeight: "700", color: C.gold, fontSize: 16 }}>{wunschCode}</Text>
                </Text>
              </View>
            )}

            <Text style={s.inputLabel}>Dein Passwort</Text>
            <Text style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>
              W\u00e4hle ein Passwort, damit nur du auf dein Dashboard zugreifen kannst.
            </Text>
            <TextInput
              style={s.input}
              placeholder="Mindestens 4 Zeichen"
              placeholderTextColor={C.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
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
                <Text style={s.primaryBtnText}>Meinen Code erstellen</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Bereits registriert? */}
          <TouchableOpacity
            style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border }}
            onPress={() => setStep("login")}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: C.brown, marginBottom: 4 }}>Bereits registriert?</Text>
            <Text style={{ fontSize: 13, color: C.gold, fontWeight: "600" }}>Hier einloggen {"\u2192"}</Text>
          </TouchableOpacity>

          {/* Richtlinien-Teaser */}
          <TouchableOpacity
            style={s.richtlinienToggle}
            onPress={() => setShowRichtlinien(!showRichtlinien)}
            activeOpacity={0.8}
          >
            <Text style={s.richtlinienToggleText}>
              {showRichtlinien ? "\u25be Richtlinien ausblenden" : "\u25b8 Richtlinien & Bedingungen anzeigen"}
            </Text>
          </TouchableOpacity>

          {showRichtlinien && (
            <View style={s.richtlinienCard}>
              <Text style={s.richtlinienTitle}>Richtlinien & Bedingungen</Text>
              <Text style={s.richtlinienText}>
                <Text style={{ fontWeight: "700" }}>1. Provisionsh\u00f6he{"\n"}</Text>
                Du erh\u00e4ltst 20% Provision auf den Netto-Produktpreis (ohne Versandkosten) aller Produkte und Dienstleistungen, die \u00fcber deinen pers\u00f6nlichen Code gekauft werden.{"\n\n"}
                <Text style={{ fontWeight: "700" }}>2. Wann wird die Provision f\u00e4llig?{"\n"}</Text>
                Die Provision wird erst f\u00e4llig, sobald die Zahlung des K\u00e4ufers vollst\u00e4ndig eingegangen ist. Bei R\u00fcckerstattungen oder Stornierungen entf\u00e4llt die Provision.{"\n\n"}
                <Text style={{ fontWeight: "700" }}>3. Auszahlung{"\n"}</Text>
                Es gibt keinen Mindestbetrag. Jeder verdiente Betrag wird per PayPal ausgezahlt. Hinterlege dazu deine PayPal-E-Mail-Adresse.{"\n\n"}
                <Text style={{ fontWeight: "700" }}>4. Zuordnung{"\n"}</Text>
                Ein Verkauf wird dir zugeordnet, wenn der K\u00e4ufer deinen Code bei der Bestellung auf Tentary eingibt.{"\n\n"}
                <Text style={{ fontWeight: "700" }}>5. Faire Nutzung{"\n"}</Text>
                Eigenk\u00e4ufe sind nicht provisionsberechtigt. Spam oder irref\u00fchrende Werbung f\u00fchren zum Ausschluss.{"\n\n"}
                <Text style={{ fontWeight: "700" }}>6. Transparenz{"\n"}</Text>
                Du kannst jederzeit in der App deinen Stand einsehen: Verk\u00e4ufe, Provision und Auszahlungen.{"\n\n"}
                <Text style={{ fontWeight: "700" }}>7. \u00c4nderungen{"\n"}</Text>
                Die Seelenplanerin beh\u00e4lt sich vor, die Bedingungen jederzeit anzupassen.{"\n\n"}
                <Text style={{ fontWeight: "700" }}>8. Steuerliche Hinweise{"\n"}</Text>
                Provisionseinnahmen k\u00f6nnen steuerpflichtig sein. Du bist selbst f\u00fcr die korrekte Versteuerung verantwortlich.
              </Text>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  // \u2500\u2500 DASHBOARD: Code + Statistiken \u2500\u2500
  return (
    <ScreenContainer className="bg-[#FDF8F4]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <Text style={{ fontSize: 22, color: C.brown }}>{"\u2039"}</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Geben & Nehmen</Text>
        </View>

        {/* Willkommen */}
        <View style={s.welcomeCard}>
          <Text style={s.welcomeEmoji}>{"\ud83c\udf38"}</Text>
          <Text style={s.welcomeName}>Hallo {affiliate?.name}!</Text>
          <Text style={s.welcomeText}>Hier ist dein pers\u00f6nlicher Empfehlungscode. Teile ihn und verdiene 20% auf jeden Verkauf.</Text>
        </View>

        {/* Dein Code */}
        <View style={s.linkCard}>
          <Text style={s.linkTitle}>Dein pers\u00f6nlicher Code</Text>
          <View style={{ backgroundColor: C.goldLight, borderRadius: 16, padding: 20, borderWidth: 2, borderColor: C.gold, marginBottom: 12, alignItems: "center" }}>
            <Text style={{ fontSize: 32, fontWeight: "800", color: C.gold, letterSpacing: 3 }}>
              {affiliate?.code}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: C.muted, textAlign: "center", marginBottom: 12, lineHeight: 18 }}>
            Der K\u00e4ufer gibt diesen Code bei der Bestellung auf Tentary im Gutscheinfeld ein.
          </Text>
          <View style={s.linkBtnRow}>
            <TouchableOpacity style={[s.linkBtn, copied && { backgroundColor: C.green }]} onPress={handleCopyCode} activeOpacity={0.85}>
              <Text style={s.linkBtnText}>{copied ? "\u2713 Kopiert!" : "Code kopieren"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.linkBtn, { backgroundColor: C.gold }]} onPress={handleShareCode} activeOpacity={0.85}>
              <Text style={s.linkBtnText}>Teilen</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wie funktioniert's Hinweis */}
        <View style={{ marginHorizontal: 16, marginBottom: 16, backgroundColor: C.goldLight, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.gold + "40" }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: C.brown, marginBottom: 8, fontFamily: "serif" }}>So nutzt der K\u00e4ufer deinen Code</Text>
          <Text style={{ fontSize: 13, color: C.brownMid, lineHeight: 20 }}>
            1. Der K\u00e4ufer geht auf den Tentary-Shop der Seelenplanerin{"\n"}
            2. W\u00e4hlt ein Produkt aus und geht zur Kasse{"\n"}
            3. Gibt deinen Code <Text style={{ fontWeight: "700", color: C.gold }}>{affiliate?.code}</Text> im Gutscheinfeld ein{"\n"}
            4. Du erh\u00e4ltst 20% Provision auf den Produktpreis
          </Text>
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
              <Text style={s.statLabel}>Verk\u00e4ufe</Text>
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

        {/* Letzte Verk\u00e4ufe */}
        {sales.length > 0 && (
          <View style={s.salesCard}>
            <Text style={s.salesTitle}>Deine Verk\u00e4ufe</Text>
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
                    {sale.status === "paid" ? "Ausgezahlt" : sale.status === "confirmed" ? "Best\u00e4tigt" : "Ausstehend"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {sales.length === 0 && (
          <View style={s.emptySales}>
            <Text style={s.emptySalesEmoji}>{"\ud83d\udcca"}</Text>
            <Text style={s.emptySalesText}>Noch keine Verk\u00e4ufe \u2013 teile deinen Code und es geht los!</Text>
          </View>
        )}

        {/* Zahlungsdaten */}
        <View style={s.paymentCard}>
          <Text style={s.paymentTitle}>Deine Zahlungsdaten</Text>
          <Text style={s.paymentDesc}>Damit wir dir deine Provision auszahlen k\u00f6nnen, hinterlege bitte deine PayPal-Adresse.</Text>
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

        {/* Passwort ändern */}
        <View style={s.paymentCard}>
          <TouchableOpacity
            onPress={() => { setShowChangePw(!showChangePw); setChangePwMsg(""); setOldPw(""); setNewPw(""); setNewPw2(""); }}
            activeOpacity={0.7}
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text style={s.paymentTitle}>Passwort \u00e4ndern</Text>
            <Text style={{ fontSize: 18, color: C.gold }}>{showChangePw ? "\u2303" : "\u2304"}</Text>
          </TouchableOpacity>
          {showChangePw && (
            <View style={{ marginTop: 12 }}>
              <Text style={s.inputLabel}>Aktuelles Passwort</Text>
              <TextInput
                style={s.input}
                placeholder="Dein aktuelles Passwort"
                placeholderTextColor={C.muted}
                value={oldPw}
                onChangeText={(t) => { setOldPw(t); setChangePwMsg(""); }}
                secureTextEntry
                returnKeyType="next"
              />
              <Text style={s.inputLabel}>Neues Passwort</Text>
              <TextInput
                style={s.input}
                placeholder="Mindestens 4 Zeichen"
                placeholderTextColor={C.muted}
                value={newPw}
                onChangeText={(t) => { setNewPw(t); setChangePwMsg(""); }}
                secureTextEntry
                returnKeyType="next"
              />
              <Text style={s.inputLabel}>Neues Passwort best\u00e4tigen</Text>
              <TextInput
                style={s.input}
                placeholder="Passwort wiederholen"
                placeholderTextColor={C.muted}
                value={newPw2}
                onChangeText={(t) => { setNewPw2(t); setChangePwMsg(""); }}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleChangePassword}
              />
              {changePwMsg ? (
                <Text style={{ fontSize: 13, color: changePwMsg.includes("erfolgreich") ? "#4CAF50" : "#EF4444", marginBottom: 8 }}>{changePwMsg}</Text>
              ) : null}
              <TouchableOpacity
                style={[s.saveBtn, changePwLoading && { opacity: 0.6 }]}
                onPress={handleChangePassword}
                disabled={changePwLoading}
                activeOpacity={0.85}
              >
                {changePwLoading ? (
                  <ActivityIndicator color={C.brown} />
                ) : (
                  <Text style={s.saveBtnText}>Passwort \u00e4ndern</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Social-Media-Vorlagen */}
        <View style={s.paymentCard}>
          <Text style={s.paymentTitle}>Fertige Vorlagen zum Teilen</Text>
          <Text style={s.paymentDesc}>Kopiere eine Vorlage und teile sie direkt. Dein Code ist automatisch eingef\u00fcgt!</Text>

          {/* Instagram */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: C.brown, marginBottom: 8 }}>Instagram Story / Post</Text>
            <View style={{ backgroundColor: C.bg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 13, color: C.brownMid, lineHeight: 20 }}>
                Ich habe etwas Wundervolles entdeckt \u2013 Die Seelenplanerin{"\n\n"}
                Rituale, Mondenergie, Runen und so viel mehr f\u00fcr deine Seele. Wenn du auch auf der Suche bist \u2013 nutze meinen Code{" "}
                <Text style={{ fontWeight: "700" }}>{affiliate?.code}</Text> bei deiner Bestellung!{"\n\n"}
                #DieSeelenplanerin #Seelenimpuls #Mondenergie #Spiritualit\u00e4t
              </Text>
            </View>
            <TouchableOpacity
              style={{ marginTop: 8, backgroundColor: C.gold, borderRadius: 10, paddingVertical: 10, alignItems: "center" }}
              onPress={() => {
                const text = `Ich habe etwas Wundervolles entdeckt \u2013 Die Seelenplanerin\n\nRituale, Mondenergie, Runen und so viel mehr f\u00fcr deine Seele. Wenn du auch auf der Suche bist \u2013 nutze meinen Code ${affiliate?.code} bei deiner Bestellung!\n\n#DieSeelenplanerin #Seelenimpuls #Mondenergie #Spiritualit\u00e4t`;
                if (Platform.OS === "web" && navigator.clipboard) navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
                else Share.share({ message: text });
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 13 }}>Vorlage kopieren</Text>
            </TouchableOpacity>
          </View>

          {/* WhatsApp */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: C.brown, marginBottom: 8 }}>WhatsApp-Nachricht</Text>
            <View style={{ backgroundColor: C.bg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 13, color: C.brownMid, lineHeight: 20 }}>
                Hey, ich wollte dir etwas zeigen, das mir richtig gut tut: Die Seelenplanerin{"\n\n"}
                Das ist eine App mit Ritualen, Mondenergie, t\u00e4glichen Impulsen und so viel mehr. Wenn du dort etwas bestellst, gib einfach meinen Code{" "}
                <Text style={{ fontWeight: "700" }}>{affiliate?.code}</Text> ein!{"\n\n"}
                Schau mal hier: {getLink(affiliate?.code || "")}
              </Text>
            </View>
            <TouchableOpacity
              style={{ marginTop: 8, backgroundColor: "#25D366", borderRadius: 10, paddingVertical: 10, alignItems: "center" }}
              onPress={() => {
                const text = `Hey, ich wollte dir etwas zeigen, das mir richtig gut tut: Die Seelenplanerin\n\nDas ist eine App mit Ritualen, Mondenergie, t\u00e4glichen Impulsen und so viel mehr. Wenn du dort etwas bestellst, gib einfach meinen Code ${affiliate?.code} ein!\n\nSchau mal hier: ${getLink(affiliate?.code || "")}`;
                if (Platform.OS === "web" && navigator.clipboard) navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
                else Share.share({ message: text });
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 13 }}>WhatsApp-Vorlage kopieren</Text>
            </TouchableOpacity>
          </View>

          {/* Kurz-Vorlage */}
          <View>
            <Text style={{ fontSize: 14, fontWeight: "700", color: C.brown, marginBottom: 8 }}>Kurze Empfehlung (universal)</Text>
            <View style={{ backgroundColor: C.bg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 13, color: C.brownMid, lineHeight: 20 }}>
                Die Seelenplanerin \u2013 Rituale, Mondenergie & Impulse f\u00fcr deine Seele{"\n"}
                Bestelle mit meinem Code: <Text style={{ fontWeight: "700" }}>{affiliate?.code}</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={{ marginTop: 8, backgroundColor: C.rose, borderRadius: 10, paddingVertical: 10, alignItems: "center" }}
              onPress={() => {
                const text = `Die Seelenplanerin \u2013 Rituale, Mondenergie & Impulse f\u00fcr deine Seele\nBestelle mit meinem Code: ${affiliate?.code}`;
                if (Platform.OS === "web" && navigator.clipboard) navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
                else Share.share({ message: text });
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 13 }}>Kurz-Vorlage kopieren</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Richtlinien */}
        <TouchableOpacity
          style={s.richtlinienToggle}
          onPress={() => setShowRichtlinien(!showRichtlinien)}
          activeOpacity={0.8}
        >
          <Text style={s.richtlinienToggleText}>
            {showRichtlinien ? "\u25be Richtlinien ausblenden" : "\u25b8 Richtlinien & Bedingungen anzeigen"}
          </Text>
        </TouchableOpacity>

        {showRichtlinien && (
          <View style={s.richtlinienCard}>
            <Text style={s.richtlinienTitle}>Richtlinien & Bedingungen</Text>
            <Text style={s.richtlinienText}>
              <Text style={{ fontWeight: "700" }}>1. Provisionsh\u00f6he{"\n"}</Text>
              Du erh\u00e4ltst 20% Provision auf den Netto-Produktpreis (ohne Versandkosten).{"\n\n"}
              <Text style={{ fontWeight: "700" }}>2. Zuordnung{"\n"}</Text>
              Ein Verkauf wird dir zugeordnet, wenn der K\u00e4ufer deinen Code bei der Bestellung eingibt.{"\n\n"}
              <Text style={{ fontWeight: "700" }}>3. Auszahlung{"\n"}</Text>
              Kein Mindestbetrag. Auszahlung per PayPal.{"\n\n"}
              <Text style={{ fontWeight: "700" }}>4. Faire Nutzung{"\n"}</Text>
              Eigenk\u00e4ufe sind nicht provisionsberechtigt.{"\n\n"}
              <Text style={{ fontWeight: "700" }}>5. Steuerliche Hinweise{"\n"}</Text>
              Du bist selbst f\u00fcr die korrekte Versteuerung verantwortlich.
            </Text>
          </View>
        )}

        {/* Zur\u00fcck zum Formular */}
        <TouchableOpacity style={s.switchBtn} onPress={() => { setStep("form"); setAffiliate(null); }} activeOpacity={0.8}>
          <Text style={s.switchBtnText}>Ausloggen</Text>
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
  stepsCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.gold + "40",
  },
  stepsTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 16, fontFamily: "serif",
  },
  stepRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: C.gold,
    alignItems: "center", justifyContent: "center", marginRight: 12, marginTop: 1,
  },
  stepNum: { fontSize: 14, fontWeight: "700", color: "#FFF" },
  stepText: { flex: 1, fontSize: 14, color: C.brownMid, lineHeight: 20 },
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
  richtlinienToggle: { marginHorizontal: 16, marginBottom: 8, padding: 12 },
  richtlinienToggleText: { fontSize: 14, color: C.gold, fontWeight: "600" },
  richtlinienCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  richtlinienTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 12, fontFamily: "serif",
  },
  richtlinienText: { fontSize: 13, color: C.brownMid, lineHeight: 20 },
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
  linkCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  linkTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 12, fontFamily: "serif",
  },
  linkBtnRow: { flexDirection: "row", gap: 10 },
  linkBtn: {
    flex: 1, backgroundColor: C.rose, borderRadius: 10, padding: 12,
    alignItems: "center",
  },
  linkBtnText: { fontSize: 14, fontWeight: "700", color: "#FFF" },
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
  emptySales: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.goldLight,
    borderRadius: 16, padding: 24, alignItems: "center",
    borderWidth: 1, borderColor: C.gold + "30",
  },
  emptySalesEmoji: { fontSize: 32, marginBottom: 8 },
  emptySalesText: { fontSize: 14, color: C.brownMid, textAlign: "center", lineHeight: 20 },
  paymentCard: {
    marginHorizontal: 16, marginBottom: 16, backgroundColor: C.card,
    borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border,
  },
  paymentTitle: {
    fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 8, fontFamily: "serif",
  },
  paymentDesc: { fontSize: 13, color: C.muted, marginBottom: 12, lineHeight: 18 },
  saveBtn: {
    backgroundColor: C.goldLight, borderRadius: 12, padding: 14, alignItems: "center",
    marginTop: 8, borderWidth: 1, borderColor: C.gold,
  },
  saveBtnText: { fontSize: 14, fontWeight: "600", color: C.brown },
  switchBtn: {
    marginHorizontal: 16, marginBottom: 8, padding: 12, alignItems: "center",
  },
  switchBtnText: { fontSize: 13, color: C.muted, textDecorationLine: "underline" },
});
