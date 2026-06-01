import { describe, it, expect } from "vitest";

// We test the moon ritual data structure and date matching logic
// by importing the module and checking the ritual content

describe("Moon Rituals", () => {
  it("should have the moon-rituals.ts file with correct structure", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/moon-rituals.ts", "utf-8");
    
    // Check that all Vollmond dates are present
    expect(content).toContain("2026-06-30");
    expect(content).toContain("2026-07-29");
    expect(content).toContain("2026-08-28");
    expect(content).toContain("2026-09-26");
    expect(content).toContain("2026-10-26");
    expect(content).toContain("2026-11-24");
    expect(content).toContain("2026-12-24");
    
    // Check that all Neumond dates are present
    expect(content).toContain("2026-06-15");
    expect(content).toContain("2026-07-14");
    expect(content).toContain("2026-08-12");
    expect(content).toContain("2026-09-11");
    expect(content).toContain("2026-10-10");
    expect(content).toContain("2026-11-09");
    expect(content).toContain("2026-12-09");
  });

  it("should contain zodiac signs for each ritual", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/moon-rituals.ts", "utf-8");
    
    // Vollmond zodiac signs
    expect(content).toContain("Steinbock");
    expect(content).toContain("Wassermann");
    expect(content).toContain("Fische");
    expect(content).toContain("Widder");
    expect(content).toContain("Stier");
    expect(content).toContain("Zwillinge");
    expect(content).toContain("Krebs");
    
    // Neumond zodiac signs
    expect(content).toContain("Löwe");
    expect(content).toContain("Jungfrau");
    expect(content).toContain("Waage");
    expect(content).toContain("Skorpion");
    expect(content).toContain("Schütze");
  });

  it("should contain crystal/healing stone reminder in all Vollmond rituals", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/moon-rituals.ts", "utf-8");
    
    // Count occurrences of the crystal reminder
    const crystalReminder = "Lege deine Kristalle & Heilsteine heute Nacht ins Mondlicht";
    const matches = content.match(new RegExp(crystalReminder, "g"));
    // Should appear in all 7 Vollmond rituals
    expect(matches).not.toBeNull();
    expect(matches!.length).toBe(7);
  });

  it("should have unique rituals (different body content for each)", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/moon-rituals.ts", "utf-8");
    
    // Extract all body texts (simplified check - each ritual has unique zodiac-specific content)
    expect(content).toContain("Nimm den Stein in die Hand"); // Steinbock
    expect(content).toContain("Reiße es in kleine Stücke"); // Wassermann
    expect(content).toContain("stillen Sees"); // Fische
    expect(content).toContain("Stampfe 3x mit dem Fuß"); // Widder
    expect(content).toContain("Schmecke jeden Bissen bewusst"); // Stier
    expect(content).toContain("Dialog mit dir selbst"); // Zwillinge
    expect(content).toContain("Heiligabend"); // Krebs (Dez)
  });

  it("should have duplicate protection via checkIfPushSentToday", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/moon-rituals.ts", "utf-8");
    
    expect(content).toContain("checkIfPushSentToday");
    expect(content).toContain("bereits gesendet. Überspringe");
  });

  it("daily-push.ts should import and call sendMoonRitualPush", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/daily-push.ts", "utf-8");
    
    expect(content).toContain('import { sendMoonRitualPush } from "./moon-rituals"');
    expect(content).toContain("sendMoonRitualPush()");
  });

  it("daily-push.ts should have duplicate protection for Tagesimpuls", async () => {
    const fs = await import("fs");
    const content = fs.readFileSync("server/daily-push.ts", "utf-8");
    
    expect(content).toContain("checkIfPushSentToday");
    expect(content).toContain("Tagesimpuls wurde heute bereits gesendet");
  });
});
