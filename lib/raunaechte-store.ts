/**
 * Raunächte Store – Lokale Datenverwaltung
 * Verwaltet Zugangscode, Fortschritt und Journal-Einträge
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// ─── Typen ────────────────────────────────────────────────────────────────────

export interface RaunaechteAccess {
  code: string;
  verified: boolean;
  year: number;
  activatedAt: string;
}

export interface RaunaechteProgress {
  completedDays: number[];
  journalEntries: Record<number, string>;
  lastAccessedDay: number;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const ACCESS_KEY = "raunaechte_access";
const PROGRESS_KEY = (year: number) => `raunaechte_progress_${year}`;

// ─── Geräte-ID ────────────────────────────────────────────────────────────────

let _deviceId: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (_deviceId) return _deviceId;
  let stored = await AsyncStorage.getItem("raunaechte_device_id");
  if (!stored) {
    // Generiere eine einzigartige Geräte-ID
    stored = `device_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    await AsyncStorage.setItem("raunaechte_device_id", stored);
  }
  _deviceId = stored;
  return stored;
}

// ─── Zugang ───────────────────────────────────────────────────────────────────

export async function getAccess(): Promise<RaunaechteAccess | null> {
  try {
    const raw = await AsyncStorage.getItem(ACCESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function setAccess(access: RaunaechteAccess): Promise<void> {
  await AsyncStorage.setItem(ACCESS_KEY, JSON.stringify(access));
}

export async function clearAccess(): Promise<void> {
  await AsyncStorage.removeItem(ACCESS_KEY);
}

export async function hasValidAccess(year: number): Promise<boolean> {
  const access = await getAccess();
  if (!access) return false;
  return access.verified && access.year === year;
}

// ─── Fortschritt ──────────────────────────────────────────────────────────────

export async function getProgress(year: number): Promise<RaunaechteProgress> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY(year));
    if (!raw) return { completedDays: [], journalEntries: {}, lastAccessedDay: 0 };
    return JSON.parse(raw);
  } catch {
    return { completedDays: [], journalEntries: {}, lastAccessedDay: 0 };
  }
}

export async function saveProgress(year: number, progress: RaunaechteProgress): Promise<void> {
  await AsyncStorage.setItem(PROGRESS_KEY(year), JSON.stringify(progress));
}

export async function completeDay(year: number, day: number): Promise<void> {
  const progress = await getProgress(year);
  if (!progress.completedDays.includes(day)) {
    progress.completedDays.push(day);
    progress.completedDays.sort((a, b) => a - b);
  }
  progress.lastAccessedDay = day;
  await saveProgress(year, progress);
}

export async function saveJournalEntry(year: number, day: number, text: string): Promise<void> {
  const progress = await getProgress(year);
  progress.journalEntries[day] = text;
  await saveProgress(year, progress);
}

export async function getJournalEntry(year: number, day: number): Promise<string> {
  const progress = await getProgress(year);
  return progress.journalEntries[day] || "";
}

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────

/** Berechnet den aktuellen Raunächte-Tag (1-28) basierend auf dem Datum */
export function getCurrentRaunaechteDay(year: number): number {
  const now = new Date();
  const start = new Date(year, 11, 10); // 10. Dezember
  const end = new Date(year + 1, 0, 7); // 7. Januar (Tag nach dem letzten Raunächte-Tag)

  if (now < start) return 0; // Noch nicht gestartet
  if (now >= end) return 29; // Bereits vorbei (alle offen)

  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  return Math.min(diffDays + 1, 28);
}

/** Gibt das Datum für einen bestimmten Raunächte-Tag zurück */
export function getRaunaechteDate(year: number, day: number): Date {
  const start = new Date(year, 11, 10); // 10. Dezember
  const date = new Date(start);
  date.setDate(start.getDate() + day - 1);
  return date;
}

/** Prüft ob ein Tag freigeschaltet ist */
export function isDayUnlocked(day: number, currentDay: number): boolean {
  if (currentDay >= 29) return true; // Nach Ende: alle offen
  return day <= currentDay;
}

/** Formatiert ein Datum auf Deutsch */
export function formatDateDE(date: Date): string {
  const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  return `${date.getDate()}. ${months[date.getMonth()]}`;
}

/** Aktuelles Raunächte-Jahr bestimmen */
export function getCurrentRaunaechteYear(): number {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  // Ab Oktober zeigen wir das aktuelle Jahr (Vorbereitung)
  // Jan-Sep: vorheriges Jahr (falls Nachhol-Modus)
  if (month >= 9) return now.getFullYear(); // Okt-Dez
  return now.getFullYear() - 1; // Jan-Sep (letztes Jahr)
}
