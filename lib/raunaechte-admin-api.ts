import { getSessionToken } from "./_core/auth";

let rauhAdminToken: string | null = null;
export function clearRauhAdminSession() { rauhAdminToken = null; }
export async function loginRauhAdmin(baseUrl: string, password: string): Promise<void> {
  const response = await fetch(`${baseUrl}/api/rauhnaechte/admin/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }), signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  if (!response.ok || !data.token) throw new Error(data.error || "Admin-Anmeldung konnte nicht bestätigt werden.");
  rauhAdminToken = data.token;
}

export interface RaunaechteCodeRow {
  id: number;
  code: string;
  isActive: number;
  activatedAt: string | null;
}
export interface RaunaechteWaitlistRow {
  id: number;
  email: string;
  createdAt: string;
}

export function parseCodeCount(value: string): number {
  if (!/^\d+$/.test(value.trim())) throw new Error("Bitte gib eine ganze Anzahl von 1 bis 100 ein.");
  const count = Number(value);
  if (count < 1 || count > 100) throw new Error("Bitte gib eine Anzahl von 1 bis 100 ein.");
  return count;
}

export async function requestRaunaechteAdmin<T>(
  baseUrl: string,
  procedure: string,
  input?: Record<string, unknown>,
  mutation = false,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const query = !mutation && input ? `?input=${encodeURIComponent(JSON.stringify({ json: input }))}` : "";
    const token = rauhAdminToken || await getSessionToken();
    const response = await fetch(`${baseUrl}/api/trpc/${procedure}${query}`, {
      method: mutation ? "POST" : "GET",
      signal: controller.signal,
      credentials: "include",
      headers: { ...(mutation ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(mutation ? { body: JSON.stringify({ json: input }) } : {}),
    });
    if ([401, 403].includes(response.status)) {
      clearRauhAdminSession();
      throw new Error("Bitte melde dich erneut mit deinem serverseitigen Adminpasswort oder deinem Eigentümer-Konto an. Der lokale PIN allein berechtigt nicht zur Codeverwaltung.");
    }
    if (!response.ok) throw new Error(`Der App-Server ist derzeit nicht erreichbar (HTTP ${response.status}). Deine gespeicherten Daten bleiben erhalten.`);
    const payload = await response.json();
    if (payload.error) throw new Error(payload.error?.json?.message || payload.error?.message || "Der Server konnte die Anfrage nicht ausführen.");
    const data = payload.result?.data?.json ?? payload.result?.data;
    if (data === undefined) throw new Error("Der Server hat keine gültige Bestätigung zurückgegeben.");
    return data as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(mutation
        ? "Keine Serverbestätigung erhalten. Bitte zuerst die Codeliste aktualisieren, bevor du erneut generierst."
        : "Zeitüberschreitung beim Laden. Deine gespeicherten Daten bleiben erhalten.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export function requireCodeRows(value: unknown): RaunaechteCodeRow[] {
  if (!Array.isArray(value) || value.some(row => !row || typeof row.code !== "string" || ![0, 1].includes(row.isActive))) {
    throw new Error("Die Codeliste konnte nicht zuverlässig geladen werden.");
  }
  return value;
}

export function requireWaitlistRows(value: unknown): RaunaechteWaitlistRow[] {
  if (!Array.isArray(value) || value.some(row => !row || typeof row.email !== "string" || !row.createdAt)) {
    throw new Error("Die Warteliste konnte nicht zuverlässig geladen werden.");
  }
  return value;
}

export function requireGeneratedCodes(value: unknown, expectedCount: number): string[] {
  const result = value as { success?: boolean; codes?: string[]; count?: number } | null;
  if (!result?.success || !Array.isArray(result.codes) || result.codes.length !== expectedCount || result.count !== expectedCount || result.codes.some(code => !/^RN-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(code))) {
    throw new Error("Keine vollständige Bestätigung der Codegenerierung erhalten. Bitte zuerst die Codeliste aktualisieren.");
  }
  return result.codes;
}
