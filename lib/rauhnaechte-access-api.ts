import { getApiBaseUrl } from "@/constants/oauth";
import { getAccess, getDeviceId } from "./raunaechte-store";
import type { RaunaechteTag } from "./raunaechte-data";

export async function requestRauhnaechteAccess<T>(path: string, extra: Record<string, unknown> = {}): Promise<T> {
  const access = await getAccess();
  if (!access?.verified || !access.code) throw new Error("Zugangscode erforderlich. Bitte buche die Begleitung und löse den von Lara vergebenen Code ein.");
  const response = await fetch(`${getApiBaseUrl()}/api/rauhnaechte/${path}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: access.code, deviceId: await getDeviceId(), ...extra }),
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Zugang konnte nicht bestätigt werden.");
  return data as T;
}
export async function checkRauhnaechteAccess(year: number): Promise<{ valid: boolean; year: number; currentDay: number }> {
  const data = await requestRauhnaechteAccess<{ valid: boolean; year: number; currentDay: number }>("access/check");
  if (!data.valid || data.year !== year) throw new Error("Der Zugangscode ist nicht für diesen Jahreskreis freigeschaltet.");
  return data;
}
export async function loadRauhnaechteDay(year: number, day: number): Promise<RaunaechteTag> {
  const data = await requestRauhnaechteAccess<{ content: RaunaechteTag }>("day", { year, day });
  if (!data.content || data.content.day !== day) throw new Error("Kein bestätigter Inhaltstag erhalten.");
  return data.content;
}
