import { describe, it, expect } from "vitest";
import { RITUALE_2026 } from "../data/rituale-kalender";

describe("Rituale verwenden NUR Set-Inhalte", () => {
  // Verbotene externe Materialien die NICHT im Set sind
  const VERBOTEN = [
    "Honig", "Milch", "Rosenblüten", "Rosenöl", "Duftöl",
    "Narzissen", "Tulpen", "Hyazinthen", "Brot", "Maibaum",
    "Orangenscheibe", "Meersalz", "Badewanne", "Blumentopf",
    "Schneeglöckchen", "Kakao", "Schokolade", "Muschel",
    "Kristallglas", "Rosmarin", "Basilikum", "Thymian",
    "Zimt", "Apfel", "Wein",
  ];

  it("sollte keine verbotenen externen Materialien in den Ritual-Texten haben", () => {
    const violations: string[] = [];
    
    for (const ritual of RITUALE_2026) {
      for (const abschnitt of ritual.abschnitte) {
        for (const word of VERBOTEN) {
          if (abschnitt.text.includes(word)) {
            violations.push(`${ritual.id}: "${word}" in ${abschnitt.typ}`);
          }
        }
      }
    }
    
    expect(violations).toEqual([]);
  });

  it("sollte in den bullet-Abschnitten nur Set-Inhalte auflisten", () => {
    const erlaubteSteine = [
      "Bergkristall", "Amethyst", "Rosenquarz", "Mondstein",
      "Schwarzer Turmalin", "Citrin", "Karneol", "Sonnenstein",
      "Labradorit", "Pyrit",
    ];
    const erlaubteRaeucherwerke = ["Weißer Salbei", "Myrrhe", "Palo Santo", "Weihrauch"];
    const erlaubteKerzen = [
      "Schwarze Kerze", "Rosa Kerze", "Goldene Kerze", "Violette Kerze",
      "Rote Kerze", "Weiße Kerze", "Gelbe Kerze", "Braune Kerze",
      "Orange Kerze", "Grüne Kerze",
    ];
    
    const allErlaubt = [...erlaubteSteine, ...erlaubteRaeucherwerke, ...erlaubteKerzen];
    
    for (const ritual of RITUALE_2026) {
      const bullets = ritual.abschnitte.filter(a => a.typ === "bullet");
      for (const bullet of bullets) {
        const hasErlaubt = allErlaubt.some(item => bullet.text.includes(item));
        expect(hasErlaubt).toBe(true);
      }
    }
  });

  it("jedes Ritual sollte genau 4 bullet-Einträge haben (2 Steine + 1 Räucherwerk + 1 Kerze)", () => {
    for (const ritual of RITUALE_2026) {
      const bulletCount = ritual.abschnitte.filter(a => a.typ === "bullet").length;
      expect(bulletCount).toBe(4);
    }
  });

  it("jedes Ritual sollte genau 5 Schritte haben", () => {
    for (const ritual of RITUALE_2026) {
      const schrittCount = ritual.abschnitte.filter(a => a.typ === "schritt").length;
      expect(schrittCount).toBe(5);
    }
  });
});
