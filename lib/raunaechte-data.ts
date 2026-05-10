/**
 * Raunächte Content-Daten 2026
 * 28 Tage: 10. Dezember 2026 – 6. Januar 2027
 * Inkl. Portaltage-Markierung
 */

export interface RaunaechteTag {
  day: number;
  date: string; // ISO format
  theme: string;
  themeEmoji: string;
  isPortaltag: boolean;
  impuls: { title: string; text: string };
  meditation: { title: string; audioUrl: string; duration: number };
  ritual: { title: string; steps: string[]; materials: string[] };
  journal: { question: string };
  klang: { title: string; audioUrl: string; duration: number };
  rune: { name: string; symbol: string; bedeutung: string; affirmation: string };
  affirmation: { text: string };
  portaltag?: { title: string; text: string; energie: string };
}

// Portaltage im Dezember 2026 / Januar 2027 (Maya-Kalender)
const PORTALTAGE_2026_DEC = [10, 11, 14, 23, 24, 25];
const PORTALTAGE_2027_JAN = [1, 2, 5, 6];

function isPortaltag(date: string): boolean {
  const d = new Date(date);
  const month = d.getMonth();
  const day = d.getDate();
  if (month === 11) return PORTALTAGE_2026_DEC.includes(day);
  if (month === 0) return PORTALTAGE_2027_JAN.includes(day);
  return false;
}

// Die 24 Elder Futhark Runen (Rotation über 28 Tage)
const RUNEN = [
  { name: "Fehu", symbol: "ᚠ", bedeutung: "Fülle, Reichtum, neue Anfänge", affirmation: "Ich bin offen für die Fülle des Lebens." },
  { name: "Uruz", symbol: "ᚢ", bedeutung: "Urkraft, Gesundheit, Vitalität", affirmation: "Meine innere Kraft trägt mich durch alles." },
  { name: "Thurisaz", symbol: "ᚦ", bedeutung: "Schutz, Grenzen, Durchbruch", affirmation: "Ich setze klare Grenzen und schütze meine Energie." },
  { name: "Ansuz", symbol: "ᚨ", bedeutung: "Weisheit, Kommunikation, göttliche Botschaft", affirmation: "Ich höre auf die Stimme meiner Seele." },
  { name: "Raidho", symbol: "ᚱ", bedeutung: "Reise, Rhythmus, Lebensweg", affirmation: "Ich vertraue meinem Weg." },
  { name: "Kenaz", symbol: "ᚲ", bedeutung: "Erleuchtung, Kreativität, inneres Feuer", affirmation: "Mein inneres Licht leuchtet hell." },
  { name: "Gebo", symbol: "ᚷ", bedeutung: "Geschenk, Partnerschaft, Gleichgewicht", affirmation: "Ich gebe und empfange in Harmonie." },
  { name: "Wunjo", symbol: "ᚹ", bedeutung: "Freude, Harmonie, Erfüllung", affirmation: "Ich erlaube mir, glücklich zu sein." },
  { name: "Hagalaz", symbol: "ᚺ", bedeutung: "Transformation, Loslassen, Neubeginn", affirmation: "Ich lasse los, was mir nicht mehr dient." },
  { name: "Nauthiz", symbol: "ᚾ", bedeutung: "Notwendigkeit, Ausdauer, innere Stärke", affirmation: "Aus jeder Herausforderung wachse ich." },
  { name: "Isa", symbol: "ᛁ", bedeutung: "Stille, Klarheit, Innenschau", affirmation: "In der Stille finde ich meine Antworten." },
  { name: "Jera", symbol: "ᛃ", bedeutung: "Ernte, Zyklen, Geduld", affirmation: "Alles hat seine Zeit – ich vertraue dem Prozess." },
  { name: "Eihwaz", symbol: "ᛇ", bedeutung: "Ausdauer, Verbindung, Lebensbaum", affirmation: "Ich bin tief verwurzelt und wachse zum Licht." },
  { name: "Perthro", symbol: "ᛈ", bedeutung: "Schicksal, Mysterium, Intuition", affirmation: "Ich vertraue dem Geheimnis meines Lebens." },
  { name: "Algiz", symbol: "ᛉ", bedeutung: "Schutz, höheres Selbst, Verbindung", affirmation: "Ich bin geschützt und geführt." },
  { name: "Sowilo", symbol: "ᛋ", bedeutung: "Sonne, Lebenskraft, Erfolg", affirmation: "Ich strahle von innen heraus." },
  { name: "Tiwaz", symbol: "ᛏ", bedeutung: "Mut, Gerechtigkeit, Wahrheit", affirmation: "Ich stehe für meine Wahrheit ein." },
  { name: "Berkana", symbol: "ᛒ", bedeutung: "Wachstum, Geburt, Fürsorge", affirmation: "Ich nähre das Neue in meinem Leben." },
  { name: "Ehwaz", symbol: "ᛖ", bedeutung: "Partnerschaft, Vertrauen, Fortschritt", affirmation: "Gemeinsam sind wir stärker." },
  { name: "Mannaz", symbol: "ᛗ", bedeutung: "Menschlichkeit, Selbsterkenntnis, Gemeinschaft", affirmation: "Ich erkenne mich selbst in meiner vollen Schönheit." },
  { name: "Laguz", symbol: "ᛚ", bedeutung: "Wasser, Intuition, Fluss", affirmation: "Ich fließe mit dem Leben." },
  { name: "Ingwaz", symbol: "ᛜ", bedeutung: "Fruchtbarkeit, Potenzial, Vollendung", affirmation: "In mir liegt unendliches Potenzial." },
  { name: "Dagaz", symbol: "ᛞ", bedeutung: "Durchbruch, Erwachen, neuer Tag", affirmation: "Jeder neue Tag ist ein Geschenk." },
  { name: "Othala", symbol: "ᛟ", bedeutung: "Heimat, Erbe, Zugehörigkeit", affirmation: "Ich bin zu Hause in mir selbst." },
  // 4 Extra für Tage 25-28 (Wiederholung der wichtigsten)
  { name: "Fehu", symbol: "ᚠ", bedeutung: "Fülle, Reichtum, neue Anfänge", affirmation: "Das neue Jahr bringt mir Fülle." },
  { name: "Wunjo", symbol: "ᚹ", bedeutung: "Freude, Harmonie, Erfüllung", affirmation: "Ich trage Freude in das neue Jahr." },
  { name: "Sowilo", symbol: "ᛋ", bedeutung: "Sonne, Lebenskraft, Erfolg", affirmation: "Mein Licht erstrahlt im neuen Jahr." },
  { name: "Dagaz", symbol: "ᛞ", bedeutung: "Durchbruch, Erwachen, neuer Tag", affirmation: "Ein neues Kapitel beginnt – voller Möglichkeiten." },
];

// Themen für die 28 Tage
const THEMEN = [
  { theme: "Ankunft & Einkehr", emoji: "🕯️" },
  { theme: "Stille & Innenschau", emoji: "🤫" },
  { theme: "Loslassen", emoji: "🍂" },
  { theme: "Dankbarkeit", emoji: "🙏" },
  { theme: "Ahnen & Wurzeln", emoji: "🌳" },
  { theme: "Träume & Visionen", emoji: "✨" },
  { theme: "Reinigung", emoji: "💨" },
  { theme: "Selbstliebe", emoji: "💗" },
  { theme: "Intuition", emoji: "🔮" },
  { theme: "Vergebung", emoji: "🕊️" },
  { theme: "Inneres Kind", emoji: "🧸" },
  { theme: "Transformation", emoji: "🦋" },
  { theme: "Wintersonnenwende", emoji: "☀️" },
  { theme: "Wiedergeburt des Lichts", emoji: "🌟" },
  { theme: "Heilung", emoji: "💚" },
  { theme: "Fülle & Manifestation", emoji: "🌙" },
  { theme: "Verbindung", emoji: "🤝" },
  { theme: "Weibliche Kraft", emoji: "🌺" },
  { theme: "Mut & Stärke", emoji: "🔥" },
  { theme: "Kreativität", emoji: "🎨" },
  { theme: "Freiheit", emoji: "🦅" },
  { theme: "Vertrauen", emoji: "🌊" },
  { theme: "Klarheit", emoji: "💎" },
  { theme: "Schutz", emoji: "🛡️" },
  { theme: "Neuanfang", emoji: "🌱" },
  { theme: "Lebensfreude", emoji: "🌈" },
  { theme: "Seelenplan", emoji: "📜" },
  { theme: "Integration & Abschluss", emoji: "🌀" },
];

/** Generiert die Content-Daten für ein Jahr */
export function generateRaunaechteContent(year: number): RaunaechteTag[] {
  const days: RaunaechteTag[] = [];

  for (let i = 0; i < 28; i++) {
    const dayNum = i + 1;
    const date = new Date(year, 11, 10 + i); // Start: 10. Dezember
    const dateStr = date.toISOString().split("T")[0];
    const portaltag = isPortaltag(dateStr);
    const thema = THEMEN[i];
    const rune = RUNEN[i];

    days.push({
      day: dayNum,
      date: dateStr,
      theme: thema.theme,
      themeEmoji: thema.emoji,
      isPortaltag: portaltag,
      impuls: {
        title: `Tag ${dayNum}: ${thema.theme}`,
        text: `Heute widmen wir uns dem Thema "${thema.theme}". Nimm dir einen Moment der Stille und spüre in dich hinein. Was bedeutet ${thema.theme.toLowerCase()} für dich in diesem Moment deines Lebens? Lass die Antwort aus deinem Herzen kommen, nicht aus deinem Kopf.`,
      },
      meditation: {
        title: `Meditation: ${thema.theme}`,
        audioUrl: "", // Wird über Admin befüllt
        duration: 15,
      },
      ritual: {
        title: `Ritual: ${thema.theme}`,
        steps: [
          "Zünde eine Kerze an und schaffe dir einen ruhigen Raum.",
          `Räuchere mit Salbei oder Palo Santo, um den Raum zu reinigen.`,
          `Setze deine Intention für heute: "${thema.theme}".`,
          `Halte den Edelstein des Tages in deiner Hand und atme tief.`,
          "Schließe das Ritual mit drei tiefen Atemzügen ab.",
        ],
        materials: ["Kerze", "Räucherwerk", "Edelstein des Tages", "Ruhiger Raum"],
      },
      journal: {
        question: getJournalQuestion(dayNum, thema.theme),
      },
      klang: {
        title: `Klangwelt: ${thema.theme}`,
        audioUrl: "", // Wird über Admin befüllt
        duration: 10,
      },
      rune: {
        name: rune.name,
        symbol: rune.symbol,
        bedeutung: rune.bedeutung,
        affirmation: rune.affirmation,
      },
      affirmation: {
        text: rune.affirmation,
      },
      ...(portaltag ? {
        portaltag: {
          title: `Portaltag-Energie: ${thema.theme}`,
          text: `Heute ist ein Portaltag – die Schleier zwischen den Welten sind besonders dünn. Die Energie von "${thema.theme}" ist heute verstärkt spürbar. Nutze diese besondere Kraft für deine innere Arbeit.`,
          energie: "Die kosmische Energie ist heute besonders hoch. Trinke viel Wasser, gönne dir Ruhe und sei achtsam mit deiner Energie.",
        },
      } : {}),
    });
  }

  return days;
}

function getJournalQuestion(day: number, theme: string): string {
  const questions: Record<number, string> = {
    1: "Was möchtest du in dieser besonderen Zeit loslassen? Schreibe alles auf, was du nicht mit ins neue Jahr nehmen willst.",
    2: "Wann hast du zuletzt echte Stille erlebt? Was hast du dabei gefühlt?",
    3: "Was hältst du fest, obwohl es dir nicht mehr dient? Warum fällt das Loslassen so schwer?",
    4: "Wofür bist du in diesem Jahr zutiefst dankbar? Nenne mindestens 10 Dinge.",
    5: "Welche Werte und Stärken hast du von deinen Ahnen geerbt? Was möchtest du weitergeben?",
    6: "Wenn alles möglich wäre – wie sähe dein Leben in einem Jahr aus? Träume groß.",
    7: "Was in deinem Leben braucht gerade eine energetische Reinigung? Beziehungen, Räume, Gedanken?",
    8: "Wie sprichst du mit dir selbst? Schreibe dir einen liebevollen Brief.",
    9: "Wann hast du zuletzt deiner Intuition vertraut? Was ist passiert?",
    10: "Wem oder was möchtest du vergeben? Auch dir selbst?",
    11: "Was hätte dein inneres Kind gerade am meisten gebraucht? Kannst du es dir heute geben?",
    12: "Welche Transformation durchlebst du gerade? Was stirbt, damit Neues entstehen kann?",
    13: "Was bedeutet die Rückkehr des Lichts für dich persönlich?",
    14: "Welches Licht möchtest du im neuen Jahr in die Welt bringen?",
    15: "Wo in deinem Körper oder deiner Seele brauchst du gerade Heilung?",
    16: "Was möchtest du im neuen Jahr manifestieren? Sei so konkret wie möglich.",
    17: "Zu wem fühlst du eine tiefe Seelenverbindung? Warum?",
    18: "Was bedeutet weibliche Kraft für dich? Wie lebst du sie?",
    19: "Wovor hast du Angst? Und was würdest du tun, wenn du keine Angst hättest?",
    20: "Wie möchtest du deine Kreativität im neuen Jahr ausdrücken?",
    21: "Was bedeutet Freiheit für dich? Wo fühlst du dich unfrei?",
    22: "Worauf vertraust du blind? Wo fällt dir Vertrauen schwer?",
    23: "Was ist dir in diesem Moment glasklar? Welche Entscheidung wartet auf dich?",
    24: "Wovor möchtest du dich im neuen Jahr schützen? Was sind deine Grenzen?",
    25: "Was beginnt gerade neu in deinem Leben? Welchen Samen pflanzt du?",
    26: "Was bringt dir pure Lebensfreude? Wie kannst du mehr davon in dein Leben bringen?",
    27: "Was ist dein Seelenplan für das kommende Jahr? Was ruft dich?",
    28: "Blicke auf die letzten 28 Tage zurück. Was hast du über dich gelernt? Was nimmst du mit?",
  };
  return questions[day] || `Was bedeutet "${theme}" für dich in diesem Moment?`;
}

/** Gibt den Content für einen bestimmten Tag zurück */
export function getRaunaechteDay(year: number, day: number): RaunaechteTag | null {
  const content = generateRaunaechteContent(year);
  return content.find(d => d.day === day) || null;
}

/** Gibt alle Tage zurück */
export function getAllRaunaechteContent(year: number): RaunaechteTag[] {
  return generateRaunaechteContent(year);
}
