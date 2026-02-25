// ============================================================
// RUNEN QUIZ – 9 Fragen, 8 Kategorien (A–H)
// Ergebnis = meistgewählte Kategorie → Runen-Set aus shop-data
// ============================================================

export type RunenCategory =
  | "liebe"
  | "fuelle"
  | "gesundheit"
  | "transformation"
  | "selbstvertrauen"
  | "spirituell"
  | "familie"
  | "kommunikation";

export interface QuizOption {
  id: string; // A–H
  text: string;
  category: RunenCategory;
}

export interface QuizQuestion {
  id: number;
  title: string;
  question: string;
  options: QuizOption[];
}

export const RUNEN_QUIZ_INTRO = {
  title: "Runen Quiz",
  subtitle: "Welches Runen-Set begleitet dich jetzt auf deinem Seelenweg?",
  description:
    "Jede Frau trägt eine persönliche Schutzrune, die anhand ihres Geburtsdatums ermittelt wird. Diese Schutzrune begleitet dich ein Leben lang.\n\nDieses Quiz zeigt dir die zwei Themen-Runen, die dich jetzt in deiner aktuellen Lebensphase unterstützen.\n\nGemeinsam mit deiner Schutzrune entsteht daraus dein persönliches Runen-Armband.",
};

export const RUNEN_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: "Dein aktueller Lebensfokus",
    question: "Welcher Lebensbereich steht aktuell im Mittelpunkt deines Lebens?",
    options: [
      { id: "A", text: "Liebe und Beziehungen", category: "liebe" },
      { id: "B", text: "Fülle und Finanzen", category: "fuelle" },
      { id: "C", text: "Gesundheit und Vitalität", category: "gesundheit" },
      { id: "D", text: "Transformation und Neuanfang", category: "transformation" },
      { id: "E", text: "Selbstvertrauen und innere Stärke", category: "selbstvertrauen" },
      { id: "F", text: "Spirituelle Entwicklung", category: "spirituell" },
      { id: "G", text: "Familie und Zuhause", category: "familie" },
      { id: "H", text: "Kommunikation und Klarheit", category: "kommunikation" },
    ],
  },
  {
    id: 2,
    title: "Seelenzustand",
    question: "Wie fühlt sich deine Seele im Moment an?",
    options: [
      { id: "A", text: "Ich wünsche mir mehr Nähe und Verbindung", category: "liebe" },
      { id: "B", text: "Ich habe das Gefühl, immer wieder gegen Mangel zu kämpfen", category: "fuelle" },
      { id: "C", text: "Ich fühle mich erschöpft und brauche neue Kraft", category: "gesundheit" },
      { id: "D", text: "Ich stecke in einem inneren Umbruch", category: "transformation" },
      { id: "E", text: "Ich spüre, dass mehr in mir steckt, traue mich aber noch nicht ganz", category: "selbstvertrauen" },
      { id: "F", text: "Ich nehme meine Intuition sehr stark wahr", category: "spirituell" },
      { id: "G", text: "Themen rund um Familie beschäftigen mich stark", category: "familie" },
      { id: "H", text: "Ich habe das Bedürfnis, mich klarer auszudrücken", category: "kommunikation" },
    ],
  },
  {
    id: 3,
    title: "Innere Sehnsucht",
    question: "Was wünschst du dir tief in deinem Inneren?",
    options: [
      { id: "A", text: "Vertrauen und Herzensöffnung", category: "liebe" },
      { id: "B", text: "Sicherheit und finanziellen Fluss", category: "fuelle" },
      { id: "C", text: "Heilung auf allen Ebenen", category: "gesundheit" },
      { id: "D", text: "Einen echten Neubeginn", category: "transformation" },
      { id: "E", text: "Mut, für mich einzustehen", category: "selbstvertrauen" },
      { id: "F", text: "Eine tiefere Verbindung zu mir und dem Universum", category: "spirituell" },
      { id: "G", text: "Harmonie und Geborgenheit", category: "familie" },
      { id: "H", text: "Klarheit und gute Entscheidungen", category: "kommunikation" },
    ],
  },
  {
    id: 4,
    title: "Energetische Anziehung",
    question: "Welche Energie zieht dich spontan am meisten an?",
    options: [
      { id: "A", text: "Herzenergie und Verbindung", category: "liebe" },
      { id: "B", text: "Reichtum, Fülle und Stabilität", category: "fuelle" },
      { id: "C", text: "Regeneration und Wachstum", category: "gesundheit" },
      { id: "D", text: "Licht nach einer dunklen Phase", category: "transformation" },
      { id: "E", text: "Stärke, Aufrichtung und Selbstermächtigung", category: "selbstvertrauen" },
      { id: "F", text: "Tiefe, Mysterium und innere Führung", category: "spirituell" },
      { id: "G", text: "Wurzeln, Herkunft und Zuhause", category: "familie" },
      { id: "H", text: "Klarheit, Wahrheit und Fokus", category: "kommunikation" },
    ],
  },
  {
    id: 5,
    title: "Deine Ausrichtung",
    question: "Was soll dich in den nächsten Monaten begleiten?",
    options: [
      { id: "A", text: "Liebevolle Beziehungen und Selbstliebe", category: "liebe" },
      { id: "B", text: "Ein stabiler Geldfluss und Sicherheit", category: "fuelle" },
      { id: "C", text: "Mehr Energie im Alltag", category: "gesundheit" },
      { id: "D", text: "Klarheit im Wandel", category: "transformation" },
      { id: "E", text: "Selbstvertrauen und innere Stärke", category: "selbstvertrauen" },
      { id: "F", text: "Intuition und spiritueller Schutz", category: "spirituell" },
      { id: "G", text: "Geborgenheit und Familienfrieden", category: "familie" },
      { id: "H", text: "Wahrheit und klare Kommunikation", category: "kommunikation" },
    ],
  },
  {
    id: 6,
    title: "Schatten & Wahrheit",
    question: "Was fordert dich innerlich gerade am meisten heraus?",
    options: [
      { id: "A", text: "Ich habe Angst, mein Herz wieder zu öffnen", category: "liebe" },
      { id: "B", text: "Ich sorge mich oft um meine finanzielle Sicherheit", category: "fuelle" },
      { id: "C", text: "Mein Körper zeigt mir deutlich, dass es zu viel war", category: "gesundheit" },
      { id: "D", text: "Ich weiß, dass etwas enden muss, halte aber noch fest", category: "transformation" },
      { id: "E", text: "Ich zweifle manchmal an mir und meiner Kraft", category: "selbstvertrauen" },
      { id: "F", text: "Ich fühle viel – manchmal zu viel – und brauche Orientierung", category: "spirituell" },
      { id: "G", text: "Familiäre Themen belasten oder verunsichern mich", category: "familie" },
      { id: "H", text: "Ich werde oft missverstanden oder traue mich nicht, alles auszusprechen", category: "kommunikation" },
    ],
  },
  {
    id: 7,
    title: "Körper & Alltag",
    question: "Wie zeigt sich dein aktuelles Thema in deinem Alltag?",
    options: [
      { id: "A", text: "In Beziehungen und emotionaler Nähe", category: "liebe" },
      { id: "B", text: "In Geldthemen, Arbeit oder Existenzfragen", category: "fuelle" },
      { id: "C", text: "In Müdigkeit, Erschöpfung oder körperlichen Signalen", category: "gesundheit" },
      { id: "D", text: "In Veränderungen, Abschieden oder innerem Chaos", category: "transformation" },
      { id: "E", text: "In Zurückhaltung, obwohl ich eigentlich mehr will", category: "selbstvertrauen" },
      { id: "F", text: "In starker Wahrnehmung, Träumen oder inneren Bildern", category: "spirituell" },
      { id: "G", text: "In Verantwortung für andere oder Familienthemen", category: "familie" },
      { id: "H", text: "In Gesprächen, Entscheidungen oder Konflikten", category: "kommunikation" },
    ],
  },
  {
    id: 8,
    title: "Innere Erleichterung",
    question: "Was würde dir gerade am meisten Erleichterung schenken?",
    options: [
      { id: "A", text: "Mich sicher und geliebt zu fühlen", category: "liebe" },
      { id: "B", text: "Vertrauen, dass für mich gesorgt ist", category: "fuelle" },
      { id: "C", text: "Neue Kraft und Regeneration", category: "gesundheit" },
      { id: "D", text: "Licht und Hoffnung in einer Umbruchphase", category: "transformation" },
      { id: "E", text: "An mich selbst zu glauben", category: "selbstvertrauen" },
      { id: "F", text: "Vertrauen in meine innere Führung", category: "spirituell" },
      { id: "G", text: "Frieden im familiären Umfeld", category: "familie" },
      { id: "H", text: "Klarheit und ehrliche Kommunikation", category: "kommunikation" },
    ],
  },
  {
    id: 9,
    title: "Ausrichtung",
    question: "Welche Qualität möchtest du bewusst in dein Leben einladen?",
    options: [
      { id: "A", text: "Sanfte Herzensverbindung", category: "liebe" },
      { id: "B", text: "Stabilität und Fülle", category: "fuelle" },
      { id: "C", text: "Heilung und Wachstum", category: "gesundheit" },
      { id: "D", text: "Transformation und Neubeginn", category: "transformation" },
      { id: "E", text: "Innere Stärke und Selbstermächtigung", category: "selbstvertrauen" },
      { id: "F", text: "Intuition und spirituelle Tiefe", category: "spirituell" },
      { id: "G", text: "Geborgenheit und Verwurzelung", category: "familie" },
      { id: "H", text: "Wahrheit und Klarheit", category: "kommunikation" },
    ],
  },
];

// ============================================================
// MOND QUIZ – 10 Fragen, 4 Archetypen (A–D)
// ============================================================

export type MondArchetyp = "neumond" | "zunehmend" | "vollmond" | "abnehmend";

export interface MondOption {
  id: string; // A–D
  text: string;
  archetyp: MondArchetyp;
}

export interface MondQuestion {
  id: number;
  title: string;
  question: string;
  options: MondOption[];
}

export const MOND_QUIZ_INTRO = {
  title: "Welcher Mond-Archetyp bist du?",
  subtitle: "Entdecke deine Mondenergie 🌙",
  description:
    "Du funktionierst im Alltag. Du erledigst, was erledigt werden muss. Aber abends fragst du dich manchmal: War das alles?\n\nDu lebst gegen deinen natürlichen Rhythmus.\n\nDer Mond durchläuft jeden Monat 4 Phasen – und du auch. Neumond, Wachstum, Fülle, Loslassen.",
  promises: [
    "Welcher der 4 Mond-Archetypen du bist",
    "Was das über deine aktuelle Lebensphase verrät",
    "Welches Ritual deine Seele jetzt braucht",
    "Welcher Kristall & welches Räucherwerk dich unterstützt",
  ],
};

export const MOND_QUESTIONS: MondQuestion[] = [
  {
    id: 1,
    title: "Frage 1 von 10",
    question: "Wann fühlst du dich am energiereichsten?",
    options: [
      { id: "A", text: "Wenn ich ganz bei mir bin und neue Ideen in mir keimen", archetyp: "neumond" },
      { id: "B", text: "Wenn ich aktiv an meinen Zielen arbeite und Fortschritte sehe", archetyp: "zunehmend" },
      { id: "C", text: "Wenn ich im Mittelpunkt stehe und meine volle Kraft auslebe", archetyp: "vollmond" },
      { id: "D", text: "Wenn ich loslasse und Altes hinter mir lasse", archetyp: "abnehmend" },
    ],
  },
  {
    id: 2,
    title: "Frage 2 von 10",
    question: "Wie gehst du mit großen Veränderungen um?",
    options: [
      { id: "A", text: "Ich ziehe mich zurück und horche in mich hinein", archetyp: "neumond" },
      { id: "B", text: "Ich mache einen Plan und gehe Schritt für Schritt vor", archetyp: "zunehmend" },
      { id: "C", text: "Ich stürze mich rein – volle Kraft voraus!", archetyp: "vollmond" },
      { id: "D", text: "Ich lasse los, was nicht mehr dient, und vertraue dem Prozess", archetyp: "abnehmend" },
    ],
  },
  {
    id: 3,
    title: "Frage 3 von 10",
    question: "Welcher Satz beschreibt dich am besten?",
    options: [
      { id: "A", text: "\"In der Stille finde ich meine größten Erkenntnisse.\"", archetyp: "neumond" },
      { id: "B", text: "\"Ich wachse jeden Tag ein Stückchen mehr in meine Kraft.\"", archetyp: "zunehmend" },
      { id: "C", text: "\"Wenn ich strahle, strahlt alles um mich herum mit.\"", archetyp: "vollmond" },
      { id: "D", text: "\"Loslassen ist meine Superpower.\"", archetyp: "abnehmend" },
    ],
  },
  {
    id: 4,
    title: "Frage 4 von 10",
    question: "Was brauchst du gerade am meisten?",
    options: [
      { id: "A", text: "Klarheit über meinen nächsten Schritt", archetyp: "neumond" },
      { id: "B", text: "Motivation und Durchhaltevermögen", archetyp: "zunehmend" },
      { id: "C", text: "Anerkennung und Sichtbarkeit", archetyp: "vollmond" },
      { id: "D", text: "Inneren Frieden und Abschluss", archetyp: "abnehmend" },
    ],
  },
  {
    id: 5,
    title: "Frage 5 von 10",
    question: "Wie lädst du deine Energie auf?",
    options: [
      { id: "A", text: "Alleine, in Stille, mit Journaling oder Meditation", archetyp: "neumond" },
      { id: "B", text: "Durch produktive Tätigkeiten und kleine Erfolge", archetyp: "zunehmend" },
      { id: "C", text: "Mit Menschen, Feiern, Tanzen – Leben spüren!", archetyp: "vollmond" },
      { id: "D", text: "In der Natur, beim Aufräumen, durch Rituale", archetyp: "abnehmend" },
    ],
  },
  {
    id: 6,
    title: "Frage 6 von 10",
    question: "Welches Element zieht dich am meisten an?",
    options: [
      { id: "A", text: "Erde – Verwurzelung, Stille, Samen säen", archetyp: "neumond" },
      { id: "B", text: "Luft – Bewegung, Ideen, Wachstum", archetyp: "zunehmend" },
      { id: "C", text: "Feuer – Leidenschaft, Ausdruck, Transformation", archetyp: "vollmond" },
      { id: "D", text: "Wasser – Fluss, Loslassen, Reinigung", archetyp: "abnehmend" },
    ],
  },
  {
    id: 7,
    title: "Frage 7 von 10",
    question: "Wenn du an den Mond denkst, welches Bild kommt zuerst?",
    options: [
      { id: "A", text: "Ein dunkler Himmel voller Möglichkeiten", archetyp: "neumond" },
      { id: "B", text: "Eine wachsende Sichel, die Hoffnung verspricht", archetyp: "zunehmend" },
      { id: "C", text: "Ein strahlend heller Vollmond in seiner ganzen Pracht", archetyp: "vollmond" },
      { id: "D", text: "Ein sanft schwindender Mond, der Raum schafft", archetyp: "abnehmend" },
    ],
  },
  {
    id: 8,
    title: "Frage 8 von 10",
    question: "Was ist deine größte Stärke?",
    options: [
      { id: "A", text: "Intuition und tiefes Wissen", archetyp: "neumond" },
      { id: "B", text: "Ausdauer und Zielstrebigkeit", archetyp: "zunehmend" },
      { id: "C", text: "Charisma und Ausdruckskraft", archetyp: "vollmond" },
      { id: "D", text: "Weisheit und die Fähigkeit loszulassen", archetyp: "abnehmend" },
    ],
  },
  {
    id: 9,
    title: "Frage 9 von 10",
    question: "Welche Herausforderung kennst du am besten?",
    options: [
      { id: "A", text: "Ich zweifle oft, ob ich bereit bin, den ersten Schritt zu machen", archetyp: "neumond" },
      { id: "B", text: "Ich werde ungeduldig, wenn Dinge nicht schnell genug gehen", archetyp: "zunehmend" },
      { id: "C", text: "Ich brenne manchmal aus, weil ich zu viel gebe", archetyp: "vollmond" },
      { id: "D", text: "Ich halte zu lange an Dingen fest, die mich nicht mehr nähren", archetyp: "abnehmend" },
    ],
  },
  {
    id: 10,
    title: "Letzte Frage ✨",
    question: "Was wünschst du dir für das kommende Jahr?",
    options: [
      { id: "A", text: "Einen klaren Neuanfang und frische Energie", archetyp: "neumond" },
      { id: "B", text: "Sichtbares Wachstum in einem wichtigen Lebensbereich", archetyp: "zunehmend" },
      { id: "C", text: "Meine volle Strahlkraft leben und feiern", archetyp: "vollmond" },
      { id: "D", text: "Endlich Frieden mit der Vergangenheit schließen", archetyp: "abnehmend" },
    ],
  },
];

// ============================================================
// MOND ARCHETYP ERGEBNISSE
// ============================================================

export interface MondArchetypResult {
  id: MondArchetyp;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  strengths: string[];
  challenges: string;
  ritual: string;
  kristall: string;
  raeucherwerk: string;
  affirmation: string;
  color: string;
}

export const MOND_ARCHETYP_RESULTS: Record<MondArchetyp, MondArchetypResult> = {
  neumond: {
    id: "neumond",
    name: "Die Neumond-Frau",
    emoji: "🌑",
    tagline: "Die Träumerin & Visionärin",
    description:
      "Du bist eine Frau der Stille und der inneren Welten. Deine Kraft liegt im Rückzug, im Träumen und im Empfangen neuer Visionen. Du spürst tief, was noch nicht sichtbar ist – und du trägst die Samen zukünftiger Realitäten in dir. Der Neumond ist dein Zuhause: der Moment vor dem Anfang, voller ungelebter Möglichkeiten.",
    strengths: ["Tiefe Intuition", "Kreative Visionen", "Innere Weisheit", "Stille als Kraftquelle"],
    challenges: "Du neigst dazu, dich zu lange in der Planung aufzuhalten und den ersten Schritt hinauszuzögern.",
    ritual:
      "Zünde eine schwarze oder dunkelblaue Kerze an. Schreibe in dein Journal: Was will durch mich in die Welt kommen? Halte inne in der Stille und lausche deiner inneren Stimme.",
    kristall: "Labradorit – öffnet die Intuition und schützt deine Energie",
    raeucherwerk: "Weißer Salbei – reinigt den Raum für neue Anfänge",
    affirmation: "Ich vertraue dem Timing meiner Seele. In der Stille empfange ich meine klarsten Botschaften.",
    color: "#1a1a2e",
  },
  zunehmend: {
    id: "zunehmend",
    name: "Die Zunehmende-Mond-Frau",
    emoji: "🌒",
    tagline: "Die Aufbauerin & Macherin",
    description:
      "Du bist eine Frau der Bewegung und des Wachstums. Deine Kraft liegt im Aufbauen, im Planen und im konsequenten Voranschreiten. Du weißt, was du willst – und du gehst Schritt für Schritt darauf zu. Der zunehmende Mond ist dein Verbündeter: Er gibt dir Rückenwind und Ausdauer für den Weg.",
    strengths: ["Zielstrebigkeit", "Ausdauer", "Strategisches Denken", "Wachstumsmentalität"],
    challenges: "Du wirst ungeduldig, wenn Ergebnisse auf sich warten lassen, und verlierst manchmal den Genuss am Prozess.",
    ritual:
      "Schreibe drei konkrete Ziele auf, die du im nächsten Mondmonat erreichen möchtest. Zünde eine grüne Kerze an und visualisiere, wie du diese Ziele bereits erreicht hast.",
    kristall: "Grüner Aventurin – zieht Wachstum, Glück und neue Chancen an",
    raeucherwerk: "Palo Santo – bringt positive Energie und Klarheit für deinen Weg",
    affirmation: "Ich wachse jeden Tag. Jeder Schritt bringt mich näher zu dem, was ich mir wünsche.",
    color: "#2d5a27",
  },
  vollmond: {
    id: "vollmond",
    name: "Die Vollmond-Frau",
    emoji: "🌕",
    tagline: "Die Strahlende & Kraftvolle",
    description:
      "Du bist eine Frau der Fülle und der Sichtbarkeit. Deine Kraft liegt in deiner Ausstrahlung, deiner Leidenschaft und deiner Fähigkeit, andere zu inspirieren. Du liebst es, deine volle Energie zu leben und andere damit zu berühren. Der Vollmond ist dein Element: strahlend, kraftvoll und unübersehbar.",
    strengths: ["Charisma & Ausstrahlung", "Leidenschaft", "Inspirationskraft", "Emotionale Tiefe"],
    challenges: "Du neigst dazu, dich zu verausgaben und vergisst manchmal, deine eigene Energie aufzufüllen.",
    ritual:
      "Stehe im Mondlicht (oder stelle dich ans Fenster). Strecke die Arme aus und lade die Mondenergie in dich ein. Danke für alles, was du in diesem Monat erschaffen hast.",
    kristall: "Mondstein – verbindet mit der weiblichen Mondenergie und stärkt die Intuition",
    raeucherwerk: "Rose – öffnet das Herz und zieht Liebe und Fülle an",
    affirmation: "Ich bin Licht. Ich erlaube mir, vollständig zu strahlen und meine Gaben mit der Welt zu teilen.",
    color: "#c9a84c",
  },
  abnehmend: {
    id: "abnehmend",
    name: "Die Abnehmende-Mond-Frau",
    emoji: "🌘",
    tagline: "Die Loslassende & Weise",
    description:
      "Du bist eine Frau der Tiefe und der Weisheit. Deine Kraft liegt im Loslassen, im Reinigen und im bewussten Abschluss. Du erkennst, was nicht mehr dient – und du hast den Mut, es gehen zu lassen. Der abnehmende Mond ist dein Lehrer: Er zeigt dir, dass im Loslassen die größte Freiheit liegt.",
    strengths: ["Tiefe Weisheit", "Mut zum Loslassen", "Reinigungskraft", "Innerer Frieden"],
    challenges: "Du hältst manchmal zu lange an Dingen, Menschen oder Situationen fest, die dich nicht mehr nähren.",
    ritual:
      "Schreibe alles auf, was du loslassen möchtest. Verbrenne das Papier sicher (oder zerreisse es) als Symbol des Loslassens. Räuchere deinen Raum mit Weißem Salbei.",
    kristall: "Schwarzer Turmalin – schützt vor negativen Energien und unterstützt das Loslassen",
    raeucherwerk: "Weißer Salbei – reinigt und befreit von alten Energien",
    affirmation: "Ich lasse los, was nicht mehr meins ist. Im Loslassen entsteht Raum für Neues.",
    color: "#4a3728",
  },
};

// ============================================================
// SCHUTZRUNE BERECHNUNG nach Geburtsdatum
// Numerologisches System: Quersumme des Geburtsdatums → Rune
// ============================================================

export const SCHUTZRUNEN: Record<number, { rune: string; symbol: string; name: string; bedeutung: string; beschreibung: string }> = {
  1: { rune: "Fehu", symbol: "ᚠ", name: "Fehu", bedeutung: "Urkraft & Wohlstand", beschreibung: "Fehu ist deine Schutzrune – die Rune der Urkraft und des Wohlstands. Sie schützt deine Lebensenergie und zieht materielle wie spirituelle Fülle an." },
  2: { rune: "Uruz", symbol: "ᚢ", name: "Uruz", bedeutung: "Wildheit & Gesundheit", beschreibung: "Uruz ist deine Schutzrune – die Rune der Wildheit und Gesundheit. Sie stärkt deine körperliche Kraft und schützt deine Vitalität." },
  3: { rune: "Thurisaz", symbol: "ᚦ", name: "Thurisaz", bedeutung: "Schutz & Abwehr", beschreibung: "Thurisaz ist deine Schutzrune – die Rune des Schutzes. Sie bildet eine energetische Schutzbarriere um dich und wehrt negative Einflüsse ab." },
  4: { rune: "Ansuz", symbol: "ᚨ", name: "Ansuz", bedeutung: "Göttliche Botschaft", beschreibung: "Ansuz ist deine Schutzrune – die Rune der göttlichen Kommunikation. Sie verbindet dich mit höherer Führung und schützt deine Stimme." },
  5: { rune: "Raidho", symbol: "ᚱ", name: "Raidho", bedeutung: "Richtiger Weg", beschreibung: "Raidho ist deine Schutzrune – die Rune des richtigen Weges. Sie schützt dich auf deiner Lebensreise und führt dich immer zum richtigen Ziel." },
  6: { rune: "Kenaz", symbol: "ᚲ", name: "Kenaz", bedeutung: "Inneres Feuer", beschreibung: "Kenaz ist deine Schutzrune – die Rune des inneren Feuers. Sie schützt deine Kreativität und hält dein inneres Licht am Brennen." },
  7: { rune: "Gebo", symbol: "ᚷ", name: "Gebo", bedeutung: "Gabe & Partnerschaft", beschreibung: "Gebo ist deine Schutzrune – die Rune der Gabe. Sie schützt deine Beziehungen und sorgt für harmonischen Austausch in deinem Leben." },
  8: { rune: "Wunjo", symbol: "ᚹ", name: "Wunjo", bedeutung: "Freude & Glück", beschreibung: "Wunjo ist deine Schutzrune – die Rune der Freude. Sie schützt dein Glück und zieht positive Energie in alle Lebensbereiche." },
  9: { rune: "Hagalaz", symbol: "ᚺ", name: "Hagalaz", bedeutung: "Transformation", beschreibung: "Hagalaz ist deine Schutzrune – die Rune der Transformation. Sie schützt dich in Zeiten des Wandels und verwandelt Herausforderungen in Wachstum." },
  10: { rune: "Nauthiz", symbol: "ᚾ", name: "Nauthiz", bedeutung: "Notwendigkeit & Stärke", beschreibung: "Nauthiz ist deine Schutzrune – die Rune der inneren Stärke. Sie schützt dich in schwierigen Zeiten und zeigt dir deinen wahren Kern." },
  11: { rune: "Isa", symbol: "ᛁ", name: "Isa", bedeutung: "Stille & Fokus", beschreibung: "Isa ist deine Schutzrune – die Rune der Stille. Sie schützt dich durch Innehalten und gibt dir Klarheit in chaotischen Zeiten." },
  12: { rune: "Jera", symbol: "ᛃ", name: "Jera", bedeutung: "Ernte & Zyklen", beschreibung: "Jera ist deine Schutzrune – die Rune der Ernte. Sie schützt deine Bemühungen und sorgt dafür, dass du die Früchte deiner Arbeit erntest." },
  13: { rune: "Eihwaz", symbol: "ᛇ", name: "Eihwaz", bedeutung: "Beständigkeit", beschreibung: "Eihwaz ist deine Schutzrune – die Rune des Lebensbaums. Sie gibt dir Stabilität und Beständigkeit in allen Lebenslagen." },
  14: { rune: "Perthro", symbol: "ᛈ", name: "Perthro", bedeutung: "Mysterium & Schicksal", beschreibung: "Perthro ist deine Schutzrune – die Rune des Mysteriums. Sie schützt deine tiefsten Geheimnisse und führt dich zu deinem wahren Schicksal." },
  15: { rune: "Algiz", symbol: "ᛉ", name: "Algiz", bedeutung: "Schutz & Abwehr", beschreibung: "Algiz ist deine Schutzrune – die mächtigste Schutzrune überhaupt. Sie bildet einen unüberwindbaren Schutzschild um dich und deine Liebsten." },
  16: { rune: "Sowilo", symbol: "ᛋ", name: "Sowilo", bedeutung: "Sieg & Lebensenergie", beschreibung: "Sowilo ist deine Schutzrune – die Rune der Sonne. Sie schützt deine Lebensenergie und führt dich immer zum Sieg." },
  17: { rune: "Tiwaz", symbol: "ᛏ", name: "Tiwaz", bedeutung: "Gerechtigkeit & Mut", beschreibung: "Tiwaz ist deine Schutzrune – die Rune des Kriegers. Sie schützt dich mit Mut und Gerechtigkeit und gibt dir die Kraft, für das Richtige einzustehen." },
  18: { rune: "Berkana", symbol: "ᛒ", name: "Berkana", bedeutung: "Heilung & Wachstum", beschreibung: "Berkana ist deine Schutzrune – die Rune der Birke. Sie schützt dein Wachstum und deine Heilung auf allen Ebenen." },
  19: { rune: "Ehwaz", symbol: "ᛖ", name: "Ehwaz", bedeutung: "Partnerschaft & Bewegung", beschreibung: "Ehwaz ist deine Schutzrune – die Rune der Partnerschaft. Sie schützt deine wichtigsten Beziehungen und sorgt für harmonische Zusammenarbeit." },
  20: { rune: "Mannaz", symbol: "ᛗ", name: "Mannaz", bedeutung: "Selbst & Bewusstsein", beschreibung: "Mannaz ist deine Schutzrune – die Rune des Selbst. Sie schützt deine Identität und stärkt dein Selbstbewusstsein." },
  21: { rune: "Laguz", symbol: "ᛚ", name: "Laguz", bedeutung: "Intuition & Emotionen", beschreibung: "Laguz ist deine Schutzrune – die Rune des Wassers. Sie schützt deine emotionale Welt und stärkt deine Intuition." },
  22: { rune: "Ingwaz", symbol: "ᛜ", name: "Ingwaz", bedeutung: "Fruchtbarkeit & Potenzial", beschreibung: "Ingwaz ist deine Schutzrune – die Rune des Potenzials. Sie schützt deine Schöpferkraft und hilft dir, dein volles Potenzial zu entfalten." },
  23: { rune: "Dagaz", symbol: "ᛞ", name: "Dagaz", bedeutung: "Durchbruch & Licht", beschreibung: "Dagaz ist deine Schutzrune – die Rune des Tageslichts. Sie schützt dich in dunklen Zeiten und führt dich immer ins Licht." },
  24: { rune: "Othala", symbol: "ᛟ", name: "Othala", bedeutung: "Heimat & Ahnen", beschreibung: "Othala ist deine Schutzrune – die Rune der Heimat. Sie verbindet dich mit deinen Wurzeln und dem Schutz deiner Ahnen." },
};

export function berechneSchutzrune(geburtsdatum: string): typeof SCHUTZRUNEN[number] {
  // Format: DD.MM.YYYY oder YYYY-MM-DD
  const cleaned = geburtsdatum.replace(/\D/g, "");
  let sum = 0;
  for (const char of cleaned) {
    sum += parseInt(char, 10);
  }
  // Quersumme reduzieren bis 1–24
  while (sum > 24) {
    let newSum = 0;
    for (const char of String(sum)) {
      newSum += parseInt(char, 10);
    }
    sum = newSum;
  }
  if (sum === 0) sum = 1;
  return SCHUTZRUNEN[sum] ?? SCHUTZRUNEN[1];
}

// Kategorie → Runen-Set Mapping (aus PDF)
export const KATEGORIE_TO_SETS: Record<RunenCategory, { label: string; emoji: string; setIds: number[] }> = {
  liebe: { label: "Liebe & Beziehungen", emoji: "💗", setIds: [1, 2, 3, 4, 5] },
  fuelle: { label: "Fülle & Finanzen", emoji: "✨", setIds: [6, 7, 8, 9, 10] },
  gesundheit: { label: "Gesundheit & Vitalität", emoji: "🌿", setIds: [11, 12, 13, 14, 15] },
  transformation: { label: "Transformation & Neuanfang", emoji: "🦋", setIds: [16, 17, 18, 19, 20] },
  selbstvertrauen: { label: "Selbstvertrauen & innere Stärke", emoji: "🔥", setIds: [21, 22, 23, 24, 25] },
  spirituell: { label: "Spirituelle Entwicklung", emoji: "🔮", setIds: [26, 27, 28, 29, 30] },
  familie: { label: "Familie & Zuhause", emoji: "🏡", setIds: [31, 32, 33, 34, 35] },
  kommunikation: { label: "Kommunikation & Klarheit", emoji: "💬", setIds: [36, 37, 38, 39, 40] },
};
