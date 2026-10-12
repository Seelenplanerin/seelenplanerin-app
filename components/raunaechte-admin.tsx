import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { getApiBaseUrl } from "@/constants/oauth";
import { getProgramYear } from "@/lib/raunaechte-program";
import { requestRaunaechteAdmin, parseCodeCount, requireCodeRows, requireWaitlistRows, requireGeneratedCodes, type RaunaechteCodeRow, type RaunaechteWaitlistRow } from "@/lib/raunaechte-admin-api";
import { loginRauhAdmin, clearRauhAdminSession } from "@/lib/raunaechte-admin-api";

function message(error: unknown) { return error instanceof Error ? error.message : "Verbindung fehlgeschlagen. Bitte erneut aktualisieren."; }

export function RaunaechteAdminLogin({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => () => clearRauhAdminSession(), []);
  const login = async () => {
    if (busy || !password) return;
    setBusy(true); setError("");
    try { await loginRauhAdmin(getApiBaseUrl(), password); setAuthorized(true); }
    catch (e) { setError(message(e)); }
    finally { setPassword(""); setBusy(false); }
  };
  if (authorized) return <View><TouchableOpacity style={styles.secondary} onPress={() => { clearRauhAdminSession(); setAuthorized(false); }}><Text style={styles.label}>Codeverwaltung sicher abmelden</Text></TouchableOpacity>{children}</View>;
  return <View style={styles.section}>
    <Text style={styles.heading}>Geschützte Rauhnächte-Verwaltung</Text>
    <Text style={styles.muted}>Nur du kannst Zugangscodes erzeugen und verwalten. Melde dich mit deinem neu eingerichteten serverseitigen Adminpasswort an. Kundinnen benötigen dieses Passwort nicht.</Text>
    <TextInput accessibilityLabel="Serverseitiges Adminpasswort" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoCorrect={false} textContentType="password" returnKeyType="go" onSubmitEditing={() => void login()} />
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    <TouchableOpacity style={[styles.button, (busy || !password) && styles.disabled]} disabled={busy || !password} onPress={() => void login()}><Text style={styles.buttonText}>{busy ? "Anmeldung wird geprüft …" : "Sicher anmelden"}</Text></TouchableOpacity>
  </View>;
}

export function RaunaechteWaitlistAdmin() {
  const [entries, setEntries] = useState<RaunaechteWaitlistRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadWaitlist = async () => {
    setLoading(true); setError("");
    try { setEntries(requireWaitlistRows(await requestRaunaechteAdmin(getApiBaseUrl(), "raunaechteWaitlist.list"))); }
    catch (e) { setError(message(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadWaitlist(); }, []);
  return <View style={styles.section}>
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}{entries !== null ? " Angezeigt wird der zuletzt geladene Stand." : " Die Warteliste ist nicht gelöscht."}</Text>}
    {loading && <ActivityIndicator color="#C9A96E" />}
    {entries !== null && <>
      <Text style={styles.heading}>{entries.length} {entries.length === 1 ? "Eintrag" : "Einträge"}</Text>
      {entries.length === 0 && !error && !loading && <Text style={styles.muted}>Noch keine Einträge.</Text>}
      {entries.map(entry => <View key={entry.id} style={styles.row}><Text selectable style={styles.code}>{entry.email}</Text><Text style={styles.muted}>{new Date(entry.createdAt).toLocaleString("de-DE")}</Text></View>)}
    </>}
    <TouchableOpacity style={styles.secondary} disabled={loading} onPress={() => void loadWaitlist()}><Text style={styles.label}>{loading ? "Wird geladen …" : "Aktualisieren"}</Text></TouchableOpacity>
  </View>;
}

export function RaunaechteAdmin() {
  const [codes, setCodes] = useState<RaunaechteCodeRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState("1");
  const [newCodes, setNewCodes] = useState<string[]>([]);
  const year = getProgramYear();
  const loadCodes = useCallback(async () => {
    setLoading(true); setReady(false); setError("");
    try {
      setCodes(requireCodeRows(await requestRaunaechteAdmin(getApiBaseUrl(), "raunaechte.listCodes", { year })));
      setReady(true);
    } catch (e) { setError(message(e)); }
    finally { setLoading(false); }
  }, [year]);
  const generateCodes = async () => {
    if (!ready || generating || loading) return;
    let amount: number;
    try { amount = parseCodeCount(count); } catch (e) { setError(message(e)); return; }
    setGenerating(true); setError(""); setNewCodes([]);
    try {
      const result = await requestRaunaechteAdmin(getApiBaseUrl(), "raunaechte.generateCodes", { count: amount, year }, true);
      setNewCodes(requireGeneratedCodes(result, amount));
      await loadCodes();
    } catch (e) { setError(message(e)); setReady(false); }
    finally { setGenerating(false); }
  };
  useEffect(() => { void loadCodes(); }, [loadCodes]);
  const totalCount = codes === null ? "—" : codes.length;
  const activeCount = codes === null ? "—" : codes.filter(c => c.isActive === 1 && c.activatedAt).length;
  const unusedCount = codes === null ? "—" : codes.filter(c => c.isActive === 1 && !c.activatedAt).length;
  return <View style={styles.section}>
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}{codes !== null ? " Angezeigt wird der zuletzt geladene Stand." : " Es liegen noch keine verlässlichen Zahlen vor."}</Text>}
    <View style={styles.stats}>{[[totalCount, "Gesamt"], [activeCount, "Aktiviert"], [unusedCount, "Verfügbar"]].map(([value, label]) => <View key={label} style={styles.stat}><Text style={styles.number}>{value}</Text><Text style={styles.muted}>{label}</Text></View>)}</View>
    <TouchableOpacity style={styles.secondary} disabled={loading || generating} onPress={() => void loadCodes()}><Text style={styles.label}>{loading ? "Codes werden geladen …" : "Codeliste aktualisieren"}</Text></TouchableOpacity>
    <View style={styles.inputRow}><TextInput accessibilityLabel="Anzahl neuer Zugangscodes" style={styles.input} value={count} onChangeText={setCount} keyboardType="number-pad" placeholder="1–100" /><TouchableOpacity style={[styles.button, (!ready || generating || loading) && styles.disabled]} disabled={!ready || generating || loading} onPress={() => void generateCodes()}><Text style={styles.buttonText}>{generating ? "Wird gespeichert …" : "Generieren"}</Text></TouchableOpacity></View>
    {newCodes.length > 0 && <View style={styles.confirmation}><Text style={styles.heading}>{newCodes.length} {newCodes.length === 1 ? "Code gespeichert" : "Codes gespeichert"}</Text>{newCodes.map(code => <Text selectable key={code} style={styles.code}>{code}</Text>)}</View>}
    {loading ? <ActivityIndicator color="#C9A96E" /> : codes?.slice(0, 20).map(c => <View key={c.id} style={styles.row}><Text selectable style={styles.code}>{c.code}</Text><Text style={styles.muted}>{c.isActive !== 1 ? "Deaktiviert" : c.activatedAt ? `Aktiviert: ${new Date(c.activatedAt).toLocaleDateString("de-DE")}` : "Noch nicht aktiviert"}</Text></View>)}
  </View>;
}

const styles = StyleSheet.create({
  section: { marginTop: 12, gap: 10 },
  error: { color: "#A33C2F", backgroundColor: "#FFF0EB", padding: 12, borderRadius: 10, fontSize: 14, lineHeight: 21 },
  heading: { fontSize: 15, lineHeight: 21, fontWeight: "700", color: "#8B5E3C" },
  muted: { fontSize: 12, lineHeight: 18, color: "#A08070" },
  row: { backgroundColor: "#F5EEE8", padding: 12, borderRadius: 10, gap: 4 },
  code: { fontSize: 14, lineHeight: 21, color: "#5C3317", fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" },
  secondary: { backgroundColor: "#F5EEE8", padding: 12, borderRadius: 10 },
  label: { color: "#5C3317", fontSize: 14, lineHeight: 20, fontWeight: "600" },
  stats: { flexDirection: "row", gap: 10 },
  stat: { flex: 1, padding: 12, backgroundColor: "#FAF3E7", borderRadius: 12, alignItems: "center" },
  number: { fontSize: 22, lineHeight: 28, fontWeight: "700", color: "#C9A96E" },
  inputRow: { flexDirection: "row", gap: 12 },
  input: { flex: 1, color: "#5C3317", backgroundColor: "#F5EEE8", borderRadius: 10, padding: 12, fontSize: 16 },
  button: { backgroundColor: "#C9A96E", padding: 12, borderRadius: 10, justifyContent: "center" },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  disabled: { opacity: 0.45 },
  confirmation: { padding: 14, backgroundColor: "#FAF3E7", borderRadius: 12, gap: 8 },
});
