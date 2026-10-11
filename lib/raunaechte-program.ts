/** Zentrale Angaben zur Rauhnächte-Begleitung; auf Wunsch ab 8. Dezember. */
export const RAUHNAECHTE_PROGRAM = {
  title: "Rauhnächte mit Sperrnächten",
  startDay: 8,
  totalDays: 30,
  contentDays: 25,
  totalContents: 75,
  dateLabel: "8. Dezember bis 6. Januar",
  registrationUrl: "https://dieseelenplanerin.de/rauhnaechte",
  /** Eigenständiges Journal; speichert nur im Browser der Teilnehmerin. */
  journalUrl: "https://seelenplanerin.github.io/rauhnaechte-journal/",
} as const;

/** 12 Sperrnächte-Tage ab 8.12. und 13 Rauhnächte-Tage ab 24.12. bis 5.1. */
export const RAUHNAECHTE_CONTENT_CALENDAR_DAYS: readonly number[] = [
  ...Array.from({ length: 12 }, (_, i) => i + 1),
  ...Array.from({ length: 13 }, (_, i) => i + 17),
];

export function getContentDayNumber(calendarDay: number): number | null {
  const index = RAUHNAECHTE_CONTENT_CALENDAR_DAYS.indexOf(calendarDay);
  return index < 0 ? null : index + 1;
}

/** Kalenderdatum eines Begleittages (ohne zeitzonenabhängige ISO-Verschiebung). */
export function getProgramDate(year: number, day: number): Date {
  return new Date(year, 11, RAUHNAECHTE_PROGRAM.startDay + day - 1);
}

/** 0 vor Beginn, 1–30 während der Begleitung, 31 nach dem 6. Januar. */
export function getProgramDay(year: number, now: Date = new Date()): number {
  const calendarDay = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const start = Date.UTC(year, 11, RAUHNAECHTE_PROGRAM.startDay);
  const end = Date.UTC(year + 1, 0, 7);
  if (calendarDay < start) return 0;
  if (calendarDay >= end) return RAUHNAECHTE_PROGRAM.totalDays + 1;
  return Math.floor((calendarDay - start) / 86_400_000) + 1;
}

export function isProgramDayUnlocked(day: number, currentDay: number): boolean {
  if (!Number.isInteger(day) || getContentDayNumber(day) === null) return false;
  return day <= currentDay;
}

/** Beginnjahr der über den Jahreswechsel laufenden Begleitung. */
export function getProgramYear(now: Date = new Date()): number {
  return now.getMonth() >= 9 ? now.getFullYear() : now.getFullYear() - 1;
}

export function formatProgramISODate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
