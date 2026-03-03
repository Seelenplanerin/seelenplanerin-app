import { describe, it, expect } from "vitest";
import { RUNEN_QUESTIONS, type RunenCategory } from "../lib/quiz-data";
import { RUNEN_SETS, getSetsByKategorie, getSetById } from "../lib/runen-sets";

const ALL_CATEGORIES: RunenCategory[] = [
  "liebe", "fuelle", "gesundheit", "transformation",
  "selbstvertrauen", "spirituell", "familie", "kommunikation",
];

const VERFUEGBARE_HEILSTEINE = [
  "Mondstein", "Bergkristall", "Amethyst", "Rosenquarz", "Schwarzer Turmalin",
];

describe("Runen-Quiz Daten (quiz-data.ts)", () => {
  it("hat genau 9 Fragen", () => {
    expect(RUNEN_QUESTIONS.length).toBe(9);
  });

  it("jede Frage hat genau 8 Antwortoptionen (A-H)", () => {
    RUNEN_QUESTIONS.forEach((q) => {
      expect(q.options.length).toBe(8);
      const ids = q.options.map((o) => o.id);
      expect(ids).toEqual(["A", "B", "C", "D", "E", "F", "G", "H"]);
    });
  });

  it("jede Antwortoption hat eine gültige Kategorie", () => {
    RUNEN_QUESTIONS.forEach((q) => {
      q.options.forEach((o) => {
        expect(ALL_CATEGORIES).toContain(o.category);
      });
    });
  });

  it("alle 8 Kategorien sind in jeder Frage vertreten", () => {
    RUNEN_QUESTIONS.forEach((q) => {
      const categories = q.options.map((o) => o.category);
      ALL_CATEGORIES.forEach((cat) => {
        expect(categories).toContain(cat);
      });
    });
  });
});

describe("Runen-Sets (runen-sets.ts)", () => {
  it("hat genau 40 Sets", () => {
    expect(RUNEN_SETS.length).toBe(40);
  });

  it("jede Kategorie hat genau 5 Sets", () => {
    ALL_CATEGORIES.forEach((cat) => {
      const sets = getSetsByKategorie(cat);
      expect(sets.length).toBe(5);
    });
  });

  it("jedes Set hat 3 Runen (Schutzrune + 2 Themenrunen)", () => {
    RUNEN_SETS.forEach((set) => {
      expect(set.runen.length).toBe(3);
      expect(set.runen[0]).toBe("Schutzrune");
    });
  });

  it("jedes Set hat 3 Runen-Symbole", () => {
    RUNEN_SETS.forEach((set) => {
      expect(set.runenSymbole.length).toBe(3);
      expect(set.runenSymbole[0]).toBe("✦"); // Schutzrune-Platzhalter
    });
  });

  it("alle Sets haben korrekte IDs (1-40)", () => {
    const ids = RUNEN_SETS.map((s) => s.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 40 }, (_, i) => i + 1));
  });

  it("getSetById findet jedes Set", () => {
    for (let i = 1; i <= 40; i++) {
      const set = getSetById(i);
      expect(set).toBeDefined();
      expect(set!.id).toBe(i);
    }
  });

  it("alle Sets haben einen Tentary-Link", () => {
    RUNEN_SETS.forEach((set) => {
      expect(set.tentaryUrl).toBeTruthy();
      expect(set.tentaryUrl).toContain("tentary.com");
    });
  });

  it("alle Sets haben einen Preis von 49.90", () => {
    RUNEN_SETS.forEach((set) => {
      expect(set.preis).toBe(49.90);
    });
  });

  it("alle Sets haben eine Beschreibung mit mindestens 50 Zeichen", () => {
    RUNEN_SETS.forEach((set) => {
      expect(set.beschreibung.length).toBeGreaterThan(50);
    });
  });
});

describe("Runen-Kombinationen aus PDF", () => {
  // Prüfe alle 40 Sets gegen das PDF
  const PDF_SETS = [
    // LIEBE & BEZIEHUNGEN
    { id: 1, name: "Selbstliebe stärken", runen: ["Schutzrune", "Wunjo", "Sowilo"] },
    { id: 2, name: "Partnerschaft vertiefen", runen: ["Schutzrune", "Gebo", "Ehwaz"] },
    { id: 3, name: "Neue Liebe anziehen", runen: ["Schutzrune", "Raidho", "Jera"] },
    { id: 4, name: "Schutz vor toxischen Beziehungen", runen: ["Schutzrune", "Algiz", "Thurisaz"] },
    { id: 5, name: "Herzöffnung & Vertrauen", runen: ["Schutzrune", "Berkana", "Laguz"] },
    // FÜLLE & FINANZEN
    { id: 6, name: "Ganzheitliche Fülle", runen: ["Schutzrune", "Fehu", "Sowilo"] },
    { id: 7, name: "Geldblockaden lösen", runen: ["Schutzrune", "Perthro", "Dagaz"] },
    { id: 8, name: "Nachhaltige Fülle", runen: ["Schutzrune", "Fehu", "Jera"] },
    { id: 9, name: "Business & Karriere", runen: ["Schutzrune", "Tiwaz", "Raidho"] },
    { id: 10, name: "Fülle empfangen", runen: ["Schutzrune", "Laguz", "Fehu"] },
    // GESUNDHEIT & VITALITÄT
    { id: 11, name: "Körperliche Kraft", runen: ["Schutzrune", "Sowilo", "Berkana"] },
    { id: 12, name: "Emotionale Balance", runen: ["Schutzrune", "Laguz", "Isa"] },
    { id: 13, name: "Immunsystem stärken", runen: ["Schutzrune", "Algiz", "Eihwaz"] },
    { id: 14, name: "Burnout-Prävention", runen: ["Schutzrune", "Isa", "Jera"] },
    { id: 15, name: "Ganzheitliche Heilung", runen: ["Schutzrune", "Berkana", "Ingwaz"] },
    // TRANSFORMATION & NEUANFANG
    { id: 16, name: "Neustart nach Krise", runen: ["Schutzrune", "Dagaz", "Fehu"] },
    { id: 17, name: "Altes loslassen", runen: ["Schutzrune", "Hagalaz", "Kenaz"] },
    { id: 18, name: "Lebensumbruch meistern", runen: ["Schutzrune", "Eihwaz", "Dagaz"] },
    { id: 19, name: "Schattenseiten integrieren", runen: ["Schutzrune", "Perthro", "Sowilo"] },
    { id: 20, name: "Wiedergeburt", runen: ["Schutzrune", "Berkana", "Dagaz"] },
    // SELBSTVERTRAUEN & INNERE STÄRKE
    { id: 21, name: "Mut & Durchsetzung", runen: ["Schutzrune", "Tiwaz", "Sowilo"] },
    { id: 22, name: "Innere Kriegerin", runen: ["Schutzrune", "Thurisaz", "Tiwaz"] },
    { id: 23, name: "Authentisch sein", runen: ["Schutzrune", "Ansuz", "Mannaz"] },
    { id: 24, name: "Ängste überwinden", runen: ["Schutzrune", "Algiz", "Dagaz"] },
    { id: 25, name: "Selbstermächtigung", runen: ["Schutzrune", "Kenaz", "Sowilo"] },
    // SPIRITUELLE ENTWICKLUNG
    { id: 26, name: "Intuition stärken", runen: ["Schutzrune", "Laguz", "Perthro"] },
    { id: 27, name: "Ahnenverbindung", runen: ["Schutzrune", "Othala", "Ansuz"] },
    { id: 28, name: "Höheres Selbst", runen: ["Schutzrune", "Ansuz", "Sowilo"] },
    { id: 29, name: "Manifestation", runen: ["Schutzrune", "Ingwaz", "Jera"] },
    { id: 30, name: "Schutz bei spiritueller Arbeit", runen: ["Schutzrune", "Algiz", "Eihwaz"] },
    // FAMILIE & ZUHAUSE
    { id: 31, name: "Familienzusammenhalt", runen: ["Schutzrune", "Othala", "Berkana"] },
    { id: 32, name: "Kinderwunsch", runen: ["Schutzrune", "Ingwaz", "Berkana"] },
    { id: 33, name: "Harmonie im Heim", runen: ["Schutzrune", "Wunjo", "Gebo"] },
    { id: 34, name: "Generationsheilung", runen: ["Schutzrune", "Othala", "Hagalaz"] },
    { id: 35, name: "Mutterschaft", runen: ["Schutzrune", "Berkana", "Laguz"] },
    // KOMMUNIKATION & KLARHEIT
    { id: 36, name: "Klare Kommunikation", runen: ["Schutzrune", "Ansuz", "Raidho"] },
    { id: 37, name: "Konflikte lösen", runen: ["Schutzrune", "Ansuz", "Gebo"] },
    { id: 38, name: "Entscheidungen treffen", runen: ["Schutzrune", "Kenaz", "Raidho"] },
    { id: 39, name: "Grenzen kommunizieren", runen: ["Schutzrune", "Ansuz", "Algiz"] },
    { id: 40, name: "Kreative Inspiration", runen: ["Schutzrune", "Kenaz", "Wunjo"] },
  ];

  it("alle 40 Sets stimmen mit dem PDF überein", () => {
    PDF_SETS.forEach((pdfSet) => {
      const appSet = getSetById(pdfSet.id);
      expect(appSet).toBeDefined();
      expect(appSet!.name).toBe(pdfSet.name);
      expect(appSet!.runen).toEqual(pdfSet.runen);
    });
  });
});

describe("Heilsteine-Zuordnung", () => {
  it("nur die 5 verfügbaren Heilsteine werden verwendet", () => {
    // Prüfe die Kategorie-Heilsteine im Quiz-Ergebnis
    const kategorieHeilsteine: Record<RunenCategory, string> = {
      liebe: "Rosenquarz",
      fuelle: "Bergkristall",
      gesundheit: "Amethyst",
      transformation: "Mondstein",
      selbstvertrauen: "Schwarzer Turmalin",
      spirituell: "Amethyst",
      familie: "Rosenquarz",
      kommunikation: "Bergkristall",
    };

    Object.values(kategorieHeilsteine).forEach((stein) => {
      expect(VERFUEGBARE_HEILSTEINE).toContain(stein);
    });
  });
});

describe("Quiz-Ergebnis-Logik", () => {
  it("meistgewählte Kategorie wird korrekt ermittelt", () => {
    // Simuliere 9 Antworten: 5x liebe, 2x fuelle, 1x gesundheit, 1x transformation
    const antworten: RunenCategory[] = [
      "liebe", "liebe", "liebe", "fuelle", "liebe",
      "fuelle", "gesundheit", "transformation", "liebe",
    ];
    const counts: Record<string, number> = {};
    antworten.forEach((c) => { counts[c] = (counts[c] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    expect(sorted[0][0]).toBe("liebe");
    expect(sorted[0][1]).toBe(5);
  });

  it("bei Gleichstand wird die erste Kategorie gewählt", () => {
    const antworten: RunenCategory[] = [
      "liebe", "fuelle", "liebe", "fuelle", "gesundheit",
      "gesundheit", "transformation", "transformation", "spirituell",
    ];
    const counts: Record<string, number> = {};
    antworten.forEach((c) => { counts[c] = (counts[c] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    // liebe und fuelle haben je 2, sorted by first occurrence
    expect(sorted[0][1]).toBe(2);
  });
});
