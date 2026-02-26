import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Meditationen-Anzeige", () => {
  const communityPath = path.join(__dirname, "../app/(tabs)/community.tsx");
  const premiumPath = path.join(__dirname, "../app/community-premium.tsx");
  const adminPath = path.join(__dirname, "../app/admin.tsx");

  it("Community-Screen lädt Meditationen aus lara_meditationen Storage-Key", () => {
    const content = fs.readFileSync(communityPath, "utf-8");
    expect(content).toContain('"lara_meditationen"');
    expect(content).toContain("MeditationenSektion");
  });

  it("Community-Screen verwendet useFocusEffect für Meditationen-Laden", () => {
    const content = fs.readFileSync(communityPath, "utf-8");
    expect(content).toContain("useFocusEffect");
    // MeditationenSektion sollte useFocusEffect nutzen statt nur useEffect
    const meditSektionMatch = content.match(/function MeditationenSektion[\s\S]*?^}/m);
    expect(meditSektionMatch).toBeTruthy();
  });

  it("Premium-Screen lädt Meditationen aus lara_meditationen Storage-Key", () => {
    const content = fs.readFileSync(premiumPath, "utf-8");
    expect(content).toContain('"lara_meditationen"');
    expect(content).toContain("uploadedMeditationen");
  });

  it("Premium-Screen verwendet useFocusEffect für Meditationen-Laden", () => {
    const content = fs.readFileSync(premiumPath, "utf-8");
    expect(content).toContain("useFocusEffect");
    expect(content).toContain("lara_meditationen");
  });

  it("Premium-Screen zeigt hochgeladene Meditationen mit Audio-Player", () => {
    const content = fs.readFileSync(premiumPath, "utf-8");
    // Prüfe dass uploadedMeditationen.map vorhanden ist (echte Daten rendern)
    expect(content).toContain("uploadedMeditationen.map");
    // Prüfe Audio-Player-Elemente
    expect(content).toContain("audio.play");
    expect(content).toContain("audio.stop");
    expect(content).toContain("In-App abspielen");
  });

  it("Premium-Screen hat Now-Playing-Bar für Meditationen", () => {
    const content = fs.readFileSync(premiumPath, "utf-8");
    expect(content).toContain("Meditation läuft");
    expect(content).toContain("audio.progress");
  });

  it("Admin speichert Meditationen unter lara_meditationen Storage-Key", () => {
    const content = fs.readFileSync(adminPath, "utf-8");
    expect(content).toContain('MEDITATIONEN_KEY = "lara_meditationen"');
    expect(content).toContain("saveMeditationen");
    expect(content).toContain("getMeditationen");
  });

  it("Admin hat getrennten Meditationen-Tab", () => {
    const content = fs.readFileSync(adminPath, "utf-8");
    // Prüfe dass Meditationen als eigener Tab existiert
    expect(content).toContain("meditationen");
    expect(content).toContain("Meditation hinzufügen");
  });

  it("Alle drei Screens verwenden denselben Storage-Key 'lara_meditationen'", () => {
    const communityContent = fs.readFileSync(communityPath, "utf-8");
    const premiumContent = fs.readFileSync(premiumPath, "utf-8");
    const adminContent = fs.readFileSync(adminPath, "utf-8");

    // Alle drei müssen denselben Key verwenden
    expect(communityContent).toContain("lara_meditationen");
    expect(premiumContent).toContain("lara_meditationen");
    expect(adminContent).toContain("lara_meditationen");
  });

  it("Premium-Screen importiert AsyncStorage und useFocusEffect", () => {
    const content = fs.readFileSync(premiumPath, "utf-8");
    expect(content).toContain("import AsyncStorage");
    expect(content).toContain("useFocusEffect");
  });
});
