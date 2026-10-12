import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { RAUHNAECHTE_PROGRAM } from "../lib/raunaechte-program";
import { isOwnedSeelenplanerinUrl } from "../lib/link-security";

const ROOT = join(import.meta.dirname, "..");
const read = (file: string) => readFileSync(join(ROOT, file), "utf8");

describe("Eigenständiges Rauhnächte-Journal", () => {
  it("verwendet ausschließlich die feste, ausdrücklich freigegebene Journaladresse", () => {
    expect(RAUHNAECHTE_PROGRAM.journalUrl).toBe("https://seelenplanerin.github.io/rauhnaechte-journal/");
    const helper = read("lib/open-journal-url.ts");
    expect(helper).toContain("openRauhnaechteJournal(): Promise<boolean>");
    expect(helper).toContain('("journal/ticket")');
    expect(helper).toContain("await Linking.openURL(`${RAUHNAECHTE_PROGRAM.journalUrl}#ticket=");
    expect(helper).not.toMatch(/openBrowserAsync|expo-web-browser|WebView|iframe/);
  });

  it("lockert die bestehende Eigendomain-Sicherheitsprüfung nicht", () => {
    expect(isOwnedSeelenplanerinUrl(RAUHNAECHTE_PROGRAM.registrationUrl)).toBe(true);
    expect(isOwnedSeelenplanerinUrl(RAUHNAECHTE_PROGRAM.journalUrl)).toBe(false);
    expect(isOwnedSeelenplanerinUrl("https://seelenplanerin.github.io/fremder-pfad/")).toBe(false);
    expect(read("lib/link-security.ts")).not.toContain("github.io");
  });

  it("zeigt den Übersichtsbutton erst nach der Code-Freischaltung", () => {
    const screen = read("app/(tabs)/raunaechte.tsx");
    const lockedStart = screen.indexOf("if (!hasAccess)");
    const unlockedStart = screen.indexOf("// Hauptansicht (nach Freischaltung)");
    expect(lockedStart).toBeGreaterThan(0);
    expect(unlockedStart).toBeGreaterThan(lockedStart);
    expect(screen.slice(lockedStart, unlockedStart)).not.toContain("Journal öffnen");
    expect(screen.indexOf("Dein Rauhnächte-Journal")).toBeGreaterThan(unlockedStart);
    expect(screen.indexOf("{/* Eigenständiges Journal */}")).toBeGreaterThan(screen.indexOf("{/* Legende */}"));
    expect(screen.slice(unlockedStart)).toContain("onPress={openRauhnaechteJournal}");
  });

  it("ergänzt den Tageslink nach Speichern ausschließlich im vorhandenen Journalabschnitt", () => {
    const screen = read("app/raunaechte-tag.tsx");
    const journalStart = screen.indexOf('activeSection === "journal"');
    const journalEnd = screen.indexOf('activeSection === "klang"', journalStart);
    const section = screen.slice(journalStart, journalEnd);
    expect(section).toContain("onPress={handleSaveJournal}");
    expect(section).toContain("onPress={openRauhnaechteJournal}");
    expect(section.indexOf("Im Rauhnächte-Journal weiterschreiben →")).toBeGreaterThan(section.indexOf('"Speichern"'));
  });

  it("zeigt bei einem fehlgeschlagenen Browseraufruf einen verständlichen Fehler", () => {
    const helper = read("lib/open-journal-url.ts");
    expect(helper).toContain("Journal konnte nicht geöffnet werden");
    expect(helper).toContain("return false;");
  });
});
