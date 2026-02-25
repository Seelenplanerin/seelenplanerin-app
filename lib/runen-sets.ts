import { RunenCategory } from "./quiz-data";

export interface RunenSet {
  id: number;
  name: string;
  kategorie: RunenCategory;
  runen: string[]; // [Schutzrune-Platzhalter, Rune2, Rune3]
  runenSymbole: string[];
  wirkung: string;
  beschreibung: string;
  preis: number;
  tentaryUrl: string;
}

// Runen-Symbol Mapping
const RUNEN_SYMBOLE: Record<string, string> = {
  Fehu: "ᚠ", Uruz: "ᚢ", Thurisaz: "ᚦ", Ansuz: "ᚨ", Raidho: "ᚱ",
  Kenaz: "ᚲ", Gebo: "ᚷ", Wunjo: "ᚹ", Hagalaz: "ᚺ", Nauthiz: "ᚾ",
  Isa: "ᛁ", Jera: "ᛃ", Eihwaz: "ᛇ", Perthro: "ᛈ", Algiz: "ᛉ",
  Sowilo: "ᛊ", Tiwaz: "ᛏ", Berkana: "ᛒ", Ehwaz: "ᛖ", Mannaz: "ᛗ",
  Laguz: "ᛚ", Ingwaz: "ᛜ", Dagaz: "ᛞ", Othala: "ᛟ",
};

function sym(rune: string): string {
  return RUNEN_SYMBOLE[rune] ?? "ᚱ";
}

export const RUNEN_SETS: RunenSet[] = [
  // LIEBE & BEZIEHUNGEN
  {
    id: 1, name: "Selbstliebe stärken", kategorie: "liebe",
    runen: ["Schutzrune", "Wunjo", "Sowilo"],
    runenSymbole: ["✦", sym("Wunjo"), sym("Sowilo")],
    wirkung: "Innere Freude, Selbstwert, Strahlkraft",
    beschreibung: "Dieses Set stärkt deine Selbstliebe von innen heraus. Wunjo bringt Freude und Erfüllung, Sowilo aktiviert deine innere Strahlkraft. Gemeinsam mit deiner persönlichen Schutzrune entsteht ein kraftvolles Trio für mehr Selbstwert.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 2, name: "Partnerschaft vertiefen", kategorie: "liebe",
    runen: ["Schutzrune", "Gebo", "Ehwaz"],
    runenSymbole: ["✦", sym("Gebo"), sym("Ehwaz")],
    wirkung: "Geben & Nehmen, gemeinsamer Weg",
    beschreibung: "Gebo steht für das heilige Geben und Nehmen in Beziehungen. Ehwaz symbolisiert den gemeinsamen Weg und die Harmonie zwischen zwei Seelen. Für tiefere Verbindung und Vertrauen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 3, name: "Neue Liebe anziehen", kategorie: "liebe",
    runen: ["Schutzrune", "Raidho", "Jera"],
    runenSymbole: ["✦", sym("Raidho"), sym("Jera")],
    wirkung: "Richtiger Weg, göttliches Timing",
    beschreibung: "Raidho führt dich auf den richtigen Weg zur Liebe. Jera erinnert dich ans göttliche Timing – die richtige Liebe kommt, wenn die Zeit reif ist.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 4, name: "Schutz vor toxischen Beziehungen", kategorie: "liebe",
    runen: ["Schutzrune", "Algiz", "Thurisaz"],
    runenSymbole: ["✦", sym("Algiz"), sym("Thurisaz")],
    wirkung: "Grenzen setzen, Abwehr",
    beschreibung: "Algiz bildet einen energetischen Schutzschild. Thurisaz gibt dir die Kraft, klare Grenzen zu setzen und dich von toxischen Energien zu befreien.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 5, name: "Herzöffnung & Vertrauen", kategorie: "liebe",
    runen: ["Schutzrune", "Berkana", "Laguz"],
    runenSymbole: ["✦", sym("Berkana"), sym("Laguz")],
    wirkung: "Sanfte Öffnung, emotionaler Fluss",
    beschreibung: "Berkana öffnet dein Herz sanft und fürsorglich. Laguz bringt den emotionalen Fluss und die Bereitschaft, Liebe zu empfangen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  // FÜLLE & FINANZEN
  {
    id: 6, name: "Ganzheitliche Fülle", kategorie: "fuelle",
    runen: ["Schutzrune", "Fehu", "Sowilo"],
    runenSymbole: ["✦", sym("Fehu"), sym("Sowilo")],
    wirkung: "Gesundheit, Geld, Erfolg",
    beschreibung: "Fehu ist die Rune des Wohlstands und der materiellen Fülle. Sowilo bringt Erfolg und Lebensenergie. Zusammen ziehen sie Fülle auf allen Ebenen an.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 7, name: "Geldblockaden lösen", kategorie: "fuelle",
    runen: ["Schutzrune", "Perthro", "Dagaz"],
    runenSymbole: ["✦", sym("Perthro"), sym("Dagaz")],
    wirkung: "Verborgenes aufdecken, Durchbruch",
    beschreibung: "Perthro deckt verborgene Blockaden auf. Dagaz bringt den Durchbruch ins Licht. Dieses Set hilft dir, alte Glaubenssätze rund um Geld aufzulösen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 8, name: "Nachhaltige Fülle", kategorie: "fuelle",
    runen: ["Schutzrune", "Fehu", "Jera"],
    runenSymbole: ["✦", sym("Fehu"), sym("Jera")],
    wirkung: "Langfristiger Aufbau, Ernte",
    beschreibung: "Fehu zieht Wohlstand an, Jera erinnert ans göttliche Timing und die Ernte deiner Bemühungen. Für nachhaltigen finanziellen Aufbau.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 9, name: "Business & Karriere", kategorie: "fuelle",
    runen: ["Schutzrune", "Tiwaz", "Raidho"],
    runenSymbole: ["✦", sym("Tiwaz"), sym("Raidho")],
    wirkung: "Durchsetzung, Fortschritt",
    beschreibung: "Tiwaz gibt dir Mut und Durchsetzungsvermögen im Business. Raidho zeigt dir den richtigen Weg nach vorne. Für Karriere und unternehmerischen Erfolg.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 10, name: "Fülle empfangen", kategorie: "fuelle",
    runen: ["Schutzrune", "Laguz", "Fehu"],
    runenSymbole: ["✦", sym("Laguz"), sym("Fehu")],
    wirkung: "Leichtigkeit, im Flow",
    beschreibung: "Laguz öffnet dich für den Fluss des Lebens. Fehu zieht materielle Fülle an. Für alle, die lernen möchten, Fülle mit Leichtigkeit zu empfangen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  // GESUNDHEIT & VITALITÄT
  {
    id: 11, name: "Körperliche Kraft", kategorie: "gesundheit",
    runen: ["Schutzrune", "Sowilo", "Berkana"],
    runenSymbole: ["✦", sym("Sowilo"), sym("Berkana")],
    wirkung: "Vitalität, Regeneration, Heilung",
    beschreibung: "Sowilo tankt deine Lebensenergie auf. Berkana unterstützt Heilung und Regeneration. Für körperliche Kraft und Vitalität.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 12, name: "Emotionale Balance", kategorie: "gesundheit",
    runen: ["Schutzrune", "Laguz", "Isa"],
    runenSymbole: ["✦", sym("Laguz"), sym("Isa")],
    wirkung: "Seelische Reinigung, innere Ruhe",
    beschreibung: "Laguz reinigt die emotionale Ebene. Isa bringt Stille und innere Ruhe. Für emotionale Balance und seelisches Gleichgewicht.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 13, name: "Immunsystem stärken", kategorie: "gesundheit",
    runen: ["Schutzrune", "Algiz", "Eihwaz"],
    runenSymbole: ["✦", sym("Algiz"), sym("Eihwaz")],
    wirkung: "Schutzschild, Widerstandskraft",
    beschreibung: "Algiz bildet einen energetischen Schutzschild. Eihwaz stärkt Beständigkeit und Widerstandskraft. Für ein starkes Immunsystem auf allen Ebenen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 14, name: "Burnout-Prävention", kategorie: "gesundheit",
    runen: ["Schutzrune", "Isa", "Jera"],
    runenSymbole: ["✦", sym("Isa"), sym("Jera")],
    wirkung: "Innehalten, Geduld, Rhythmus",
    beschreibung: "Isa lehrt das heilsame Innehalten. Jera erinnert an natürliche Rhythmen und Geduld. Für alle, die lernen möchten, sich selbst zu schützen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 15, name: "Ganzheitliche Heilung", kategorie: "gesundheit",
    runen: ["Schutzrune", "Berkana", "Ingwaz"],
    runenSymbole: ["✦", sym("Berkana"), sym("Ingwaz")],
    wirkung: "Erneuerung, Potenzial entfalten",
    beschreibung: "Berkana trägt die Kraft der Heilung und Erneuerung. Ingwaz hilft dir, dein volles Heilungspotenzial zu entfalten.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  // TRANSFORMATION & NEUANFANG
  {
    id: 16, name: "Neustart nach Krise", kategorie: "transformation",
    runen: ["Schutzrune", "Dagaz", "Fehu"],
    runenSymbole: ["✦", sym("Dagaz"), sym("Fehu")],
    wirkung: "Licht, neuer Reichtum",
    beschreibung: "Dagaz bringt das Licht nach einer dunklen Phase. Fehu zieht neuen Wohlstand und Energie an. Für den Neustart nach schwierigen Zeiten.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 17, name: "Altes loslassen", kategorie: "transformation",
    runen: ["Schutzrune", "Hagalaz", "Kenaz"],
    runenSymbole: ["✦", sym("Hagalaz"), sym("Kenaz")],
    wirkung: "Aufbrechen, neue Klarheit",
    beschreibung: "Hagalaz bricht alte Strukturen auf. Kenaz bringt neue Klarheit und Erleuchtung. Für das Loslassen von allem, was nicht mehr dient.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 18, name: "Lebensumbruch meistern", kategorie: "transformation",
    runen: ["Schutzrune", "Eihwaz", "Dagaz"],
    runenSymbole: ["✦", sym("Eihwaz"), sym("Dagaz")],
    wirkung: "Stabilität in der Veränderung",
    beschreibung: "Eihwaz gibt dir Stabilität und Verwurzelung im Wandel. Dagaz zeigt dir das Licht am Ende des Tunnels. Für alle in großen Lebensumbrüchen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 19, name: "Schattenseiten integrieren", kategorie: "transformation",
    runen: ["Schutzrune", "Perthro", "Sowilo"],
    runenSymbole: ["✦", sym("Perthro"), sym("Sowilo")],
    wirkung: "Verborgenes ans Licht bringen",
    beschreibung: "Perthro deckt verborgene Anteile auf. Sowilo bringt sie ins Licht der Heilung. Für tiefe Schattenarbeit und Integration.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 20, name: "Wiedergeburt", kategorie: "transformation",
    runen: ["Schutzrune", "Berkana", "Dagaz"],
    runenSymbole: ["✦", sym("Berkana"), sym("Dagaz")],
    wirkung: "Neues Kapitel, Erblühen",
    beschreibung: "Berkana trägt die Energie der Wiedergeburt und des Erblühens. Dagaz markiert den Beginn eines neuen Kapitels. Für echte Neuanfänge.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  // SELBSTVERTRAUEN & INNERE STÄRKE
  {
    id: 21, name: "Mut & Durchsetzung", kategorie: "selbstvertrauen",
    runen: ["Schutzrune", "Tiwaz", "Sowilo"],
    runenSymbole: ["✦", sym("Tiwaz"), sym("Sowilo")],
    wirkung: "Siegeskraft, Selbstvertrauen",
    beschreibung: "Tiwaz ist die Rune des Kriegers und der Gerechtigkeit. Sowilo verleiht Siegeskraft und Strahlkraft. Für Mut und unerschütterliches Selbstvertrauen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 22, name: "Innere Kriegerin", kategorie: "selbstvertrauen",
    runen: ["Schutzrune", "Thurisaz", "Tiwaz"],
    runenSymbole: ["✦", sym("Thurisaz"), sym("Tiwaz")],
    wirkung: "Verteidigung, Kampfgeist",
    beschreibung: "Thurisaz gibt dir die Kraft der Abwehr. Tiwaz weckt deine innere Kriegerin. Für alle, die lernen möchten, für sich selbst einzustehen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 23, name: "Authentisch sein", kategorie: "selbstvertrauen",
    runen: ["Schutzrune", "Ansuz", "Mannaz"],
    runenSymbole: ["✦", sym("Ansuz"), sym("Mannaz")],
    wirkung: "Wahrheit sprechen, Selbstausdruck",
    beschreibung: "Ansuz öffnet deine Stimme für die Wahrheit. Mannaz stärkt dein Bewusstsein für dein wahres Selbst. Für authentischen Selbstausdruck.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 24, name: "Ängste überwinden", kategorie: "selbstvertrauen",
    runen: ["Schutzrune", "Algiz", "Dagaz"],
    runenSymbole: ["✦", sym("Algiz"), sym("Dagaz")],
    wirkung: "Schutz, Durchbruch ins Licht",
    beschreibung: "Algiz schützt dich auf deinem Weg durch die Angst. Dagaz bringt den Durchbruch ins Licht. Für alle, die ihre Ängste überwinden möchten.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 25, name: "Selbstermächtigung", kategorie: "selbstvertrauen",
    runen: ["Schutzrune", "Kenaz", "Sowilo"],
    runenSymbole: ["✦", sym("Kenaz"), sym("Sowilo")],
    wirkung: "Inneres Feuer, Klarheit, Erfolg",
    beschreibung: "Kenaz entzündet dein inneres Feuer. Sowilo bringt Klarheit und Erfolg. Das kraftvollste Set für Selbstermächtigung und persönliche Power.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  // SPIRITUELLE ENTWICKLUNG
  {
    id: 26, name: "Intuition stärken", kategorie: "spirituell",
    runen: ["Schutzrune", "Laguz", "Perthro"],
    runenSymbole: ["✦", sym("Laguz"), sym("Perthro")],
    wirkung: "Innere Stimme, Mysterien",
    beschreibung: "Laguz öffnet den Kanal zur inneren Stimme. Perthro enthüllt verborgene Mysterien und stärkt die Intuition. Für tiefes spirituelles Wissen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 27, name: "Ahnenverbindung", kategorie: "spirituell",
    runen: ["Schutzrune", "Othala", "Ansuz"],
    runenSymbole: ["✦", sym("Othala"), sym("Ansuz")],
    wirkung: "Wurzeln, Botschaften empfangen",
    beschreibung: "Othala verbindet dich mit deinen Ahnen und Wurzeln. Ansuz öffnet den Kanal für Botschaften aus der Ahnenlinie. Für tiefe Ahnenarbeit.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 28, name: "Höheres Selbst", kategorie: "spirituell",
    runen: ["Schutzrune", "Ansuz", "Sowilo"],
    runenSymbole: ["✦", sym("Ansuz"), sym("Sowilo")],
    wirkung: "Göttliche Führung, Erleuchtung",
    beschreibung: "Ansuz öffnet den Kanal zur göttlichen Führung. Sowilo bringt Erleuchtung und Klarheit von oben. Für die Verbindung mit dem höheren Selbst.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 29, name: "Manifestation", kategorie: "spirituell",
    runen: ["Schutzrune", "Ingwaz", "Jera"],
    runenSymbole: ["✦", sym("Ingwaz"), sym("Jera")],
    wirkung: "Samen säen, Ernte",
    beschreibung: "Ingwaz trägt das Potenzial des Samens. Jera bringt die Ernte zur rechten Zeit. Das kraftvollste Manifestations-Set.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 30, name: "Schutz bei spiritueller Arbeit", kategorie: "spirituell",
    runen: ["Schutzrune", "Algiz", "Eihwaz"],
    runenSymbole: ["✦", sym("Algiz"), sym("Eihwaz")],
    wirkung: "Energetischer Schutzschild",
    beschreibung: "Algiz bildet einen mächtigen Schutzschild. Eihwaz gibt Stabilität und Verwurzelung. Für alle, die spirituell aktiv sind und Schutz benötigen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  // FAMILIE & ZUHAUSE
  {
    id: 31, name: "Familienzusammenhalt", kategorie: "familie",
    runen: ["Schutzrune", "Othala", "Berkana"],
    runenSymbole: ["✦", sym("Othala"), sym("Berkana")],
    wirkung: "Wurzeln, Fürsorge, Geborgenheit",
    beschreibung: "Othala stärkt die Familienbande und Wurzeln. Berkana bringt Fürsorge und Geborgenheit. Für mehr Zusammenhalt in der Familie.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 32, name: "Kinderwunsch", kategorie: "familie",
    runen: ["Schutzrune", "Ingwaz", "Berkana"],
    runenSymbole: ["✦", sym("Ingwaz"), sym("Berkana")],
    wirkung: "Fruchtbarkeit, Schöpferkraft",
    beschreibung: "Ingwaz ist die Rune der Fruchtbarkeit und des neuen Lebens. Berkana trägt die mütterliche Energie. Das kraftvollste Set für den Kinderwunsch.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 33, name: "Harmonie im Heim", kategorie: "familie",
    runen: ["Schutzrune", "Wunjo", "Gebo"],
    runenSymbole: ["✦", sym("Wunjo"), sym("Gebo")],
    wirkung: "Freude, Ausgleich",
    beschreibung: "Wunjo bringt Freude und Harmonie ins Zuhause. Gebo sorgt für ausgewogenes Geben und Nehmen. Für ein friedvolles Zuhause.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 34, name: "Generationsheilung", kategorie: "familie",
    runen: ["Schutzrune", "Othala", "Hagalaz"],
    runenSymbole: ["✦", sym("Othala"), sym("Hagalaz")],
    wirkung: "Ahnenmuster aufbrechen",
    beschreibung: "Othala verbindet mit der Ahnenlinie. Hagalaz bricht alte Muster auf. Für die Heilung von Generationstrauma und Ahnenmustern.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 35, name: "Mutterschaft", kategorie: "familie",
    runen: ["Schutzrune", "Berkana", "Laguz"],
    runenSymbole: ["✦", sym("Berkana"), sym("Laguz")],
    wirkung: "Weibliche Kraft, Intuition",
    beschreibung: "Berkana trägt die volle Kraft der Mutterschaft. Laguz stärkt die mütterliche Intuition. Für alle Mütter und werdenden Mütter.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  // KOMMUNIKATION & KLARHEIT
  {
    id: 36, name: "Klare Kommunikation", kategorie: "kommunikation",
    runen: ["Schutzrune", "Ansuz", "Raidho"],
    runenSymbole: ["✦", sym("Ansuz"), sym("Raidho")],
    wirkung: "Wahrheit, richtiger Weg",
    beschreibung: "Ansuz öffnet deine Stimme für klare Wahrheit. Raidho zeigt dir den richtigen Weg in Gesprächen. Für kraftvolle und klare Kommunikation.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 37, name: "Konflikte lösen", kategorie: "kommunikation",
    runen: ["Schutzrune", "Ansuz", "Gebo"],
    runenSymbole: ["✦", sym("Ansuz"), sym("Gebo")],
    wirkung: "Aussprechen, Ausgleich",
    beschreibung: "Ansuz hilft dir, Dinge auszusprechen. Gebo bringt Ausgleich und Harmonie. Für die friedliche Lösung von Konflikten.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 38, name: "Entscheidungen treffen", kategorie: "kommunikation",
    runen: ["Schutzrune", "Kenaz", "Raidho"],
    runenSymbole: ["✦", sym("Kenaz"), sym("Raidho")],
    wirkung: "Klarheit, Richtung",
    beschreibung: "Kenaz bringt Klarheit und inneres Wissen. Raidho zeigt die Richtung. Für alle, die vor wichtigen Entscheidungen stehen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 39, name: "Grenzen kommunizieren", kategorie: "kommunikation",
    runen: ["Schutzrune", "Ansuz", "Algiz"],
    runenSymbole: ["✦", sym("Ansuz"), sym("Algiz")],
    wirkung: "Wahrheit + Schutz",
    beschreibung: "Ansuz gibt dir die Worte für deine Wahrheit. Algiz schützt dich beim Setzen von Grenzen. Für alle, die lernen möchten, klar Nein zu sagen.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: 40, name: "Kreative Inspiration", kategorie: "kommunikation",
    runen: ["Schutzrune", "Kenaz", "Wunjo"],
    runenSymbole: ["✦", sym("Kenaz"), sym("Wunjo")],
    wirkung: "Inneres Feuer, Freude",
    beschreibung: "Kenaz entzündet dein kreatives Feuer. Wunjo bringt Freude und Leichtigkeit in den kreativen Prozess. Für Künstlerinnen, Schreiberinnen und Kreative.",
    preis: 49.90, tentaryUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
];

export function getSetsByKategorie(kategorie: RunenCategory): RunenSet[] {
  return RUNEN_SETS.filter((s) => s.kategorie === kategorie);
}

export function getSetById(id: number): RunenSet | undefined {
  return RUNEN_SETS.find((s) => s.id === id);
}
