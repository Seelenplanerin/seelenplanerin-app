import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

function readSource(relativePath: string) {
  return readFileSync(join(projectRoot, relativePath), "utf8");
}

describe("Seelenakademie und Angebotsbereinigung", () => {
  it("verlinkt Business-Kompass und persönliche Bewerbung korrekt", () => {
    const source = readSource("app/seelenakademie.tsx");

    expect(source).toContain("https://dieseelenplanerin.de/seelenakademie-test");
    expect(source).toContain("https://dieseelenplanerin.de/seelenakademie#bewerbung");
    expect(source).toContain("Seele");
    expect(source).toContain("Positionierung");
    expect(source).toContain("Angebot");
    expect(source).toContain("Content");
    expect(source).toContain("Strategie");
  });

  it("enthält in sichtbaren App-Oberflächen keine alten Angebots- oder Ausbildungsbezeichnungen", () => {
    const files = [
      "app/_layout.tsx",
      "app/(tabs)/index.tsx",
      "app/(tabs)/community.tsx",
      "app/(tabs)/ich.tsx",
      "app/(tabs)/lara.tsx",
      "app/(tabs)/rituale.tsx",
      "app/rituale/[slug].tsx",
      "app/mondtyp-quiz.tsx",
      "app/runen-quiz.tsx",
      "app/community-premium.tsx",
      "app/admin.tsx",
    ];
    const combinedSource = files.map(readSource).join("\n");

    for (const forbiddenText of [
      "Seelenimpuls",
      "E6FP1U",
      "Geplante Ausbildungen",
      "Aura Reading Ausbildung",
      "Theta Healing Ausbildung",
      "Kakaozeremonie Ausbildung",
    ]) {
      expect(combinedSource).not.toContain(forbiddenText);
    }
  });
});
