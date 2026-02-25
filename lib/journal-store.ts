import AsyncStorage from "@react-native-async-storage/async-storage";

const JOURNAL_KEY = "seelenplanerin_journal_entries";

export type Mood = "🌟" | "😊" | "😌" | "🌧️" | "💫" | "🌸" | "🔥" | "🌙";

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  title: string;
  text: string;
  mood: Mood;
  tags: string[];
}

export const MOOD_OPTIONS: { emoji: Mood; label: string }[] = [
  { emoji: "🌟", label: "Strahlend" },
  { emoji: "😊", label: "Glücklich" },
  { emoji: "😌", label: "Ruhig" },
  { emoji: "🌸", label: "Dankbar" },
  { emoji: "💫", label: "Inspiriert" },
  { emoji: "🔥", label: "Kraftvoll" },
  { emoji: "🌙", label: "Nachdenklich" },
  { emoji: "🌧️", label: "Schwer" },
];

export async function loadJournalEntries(): Promise<JournalEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(JOURNAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const entries = await loadJournalEntries();
  const idx = entries.findIndex(e => e.id === entry.id);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.unshift(entry);
  }
  await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const entries = await loadJournalEntries();
  const filtered = entries.filter(e => e.id !== id);
  await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(filtered));
}

export function createNewEntry(): JournalEntry {
  return {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    title: "",
    text: "",
    mood: "😌",
    tags: [],
  };
}
