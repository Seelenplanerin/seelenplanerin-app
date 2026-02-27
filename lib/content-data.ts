export type ContentCategory = "ritual" | "meditation" | "gedicht" | "impuls";

export interface ContentItem {
  id: string;
  category: ContentCategory;
  title: string;
  subtitle?: string;
  content: string;
  duration?: string; // für Meditationen
  tags: string[];
  emoji: string;
  color: string; // Gradient-Farbe
}

export const CATEGORY_CONFIG: Record<ContentCategory, { label: string; emoji: string; color: string; description: string }> = {
  ritual: {
    label: "Rituale",
    emoji: "🕯️",
    color: "#7B4FA6",
    description: "Kraftvolle Rituale für deine Seele",
  },
  meditation: {
    label: "Meditationen",
    emoji: "🌙",
    color: "#4A3580",
    description: "Geführte Reisen in dein Inneres",
  },
  gedicht: {
    label: "Gedichte",
    emoji: "🌸",
    color: "#8B4A6B",
    description: "Worte, die die Seele berühren",
  },
  impuls: {
    label: "Impulse",
    emoji: "✨",
    color: "#C9A84C",
    description: "Tägliche Impulse für dein Wachstum",
  },
};

export const CONTENT_DATA: ContentItem[] = [
  // RITUALE
  {
    id: "r1",
    category: "ritual",
    title: "Neumond-Ritual",
    subtitle: "Neue Energie empfangen",
    emoji: "🌑",
    color: "#2D1B69",
    tags: ["Mond", "Neubeginn", "Intention"],
    content: `Der Neumond ist die Zeit der Stille, der Einkehr und des Neubeginns. Nutze diese kraftvolle Energie, um deine Intentionen zu setzen.

**Was du brauchst:**
Eine Kerze (weiß oder lila), ein Notizbuch, ein Stift, etwas Räucherwerk (optional)

**Das Ritual:**

1. **Schaffe deinen Raum** – Zünde deine Kerze an und räuchere deinen Raum aus. Atme tief durch und komme bei dir an.

2. **Stille und Reflexion** – Schließe die Augen und frage dich: Was möchte ich in diesem neuen Zyklus erschaffen? Was darf loslassen?

3. **Schreibe deine Intentionen** – Notiere 3–5 Wünsche oder Intentionen für den kommenden Mondzyklus. Schreibe sie in der Gegenwartsform: "Ich bin...", "Ich habe...", "Ich erlebe..."

4. **Visualisierung** – Halte das Notizbuch ans Herz und stelle dir vor, wie sich dein Leben anfühlt, wenn diese Intentionen erfüllt sind.

5. **Dankbarkeit** – Schließe mit drei Dingen ab, für die du dankbar bist.

Lass die Kerze sicher ausbrennen oder lösche sie bewusst mit dem Gedanken: "Es ist so."`,
  },
  {
    id: "r2",
    category: "ritual",
    title: "Morgenritual für Klarheit",
    subtitle: "Den Tag bewusst beginnen",
    emoji: "🌅",
    color: "#C9A84C",
    tags: ["Morgen", "Klarheit", "Energie"],
    content: `Beginne deinen Tag mit Intention und Klarheit. Dieses Ritual dauert nur 10–15 Minuten und setzt den Ton für den gesamten Tag.

**Das Ritual:**

1. **Aufwachen ohne Handy** – Greife nicht sofort zum Smartphone. Gönne dir 5 Minuten in Stille.

2. **Drei tiefe Atemzüge** – Atme tief in den Bauch ein, halte kurz an und atme langsam aus. Wiederhole dies dreimal.

3. **Dankbarkeit** – Denke an drei Dinge, für die du heute dankbar bist. Lass das Gefühl der Dankbarkeit in deinem Herzen entstehen.

4. **Intention setzen** – Frage dich: "Wie möchte ich mich heute fühlen?" Wähle ein Wort oder einen Satz als Intention für den Tag.

5. **Bewegung** – Strecke dich, mache ein paar Yoga-Posen oder gehe kurz an die frische Luft.

Trage deine Intention in dein Journal und trage sie den ganzen Tag in deinem Herzen.`,
  },
  {
    id: "r3",
    category: "ritual",
    title: "Vollmond-Loslassen",
    subtitle: "Was dich nicht mehr dient, freigeben",
    emoji: "🌕",
    color: "#8B7A9B",
    tags: ["Vollmond", "Loslassen", "Transformation"],
    content: `Der Vollmond ist die Zeit der Fülle und des Loslassens. Was hat seinen Dienst getan? Was darf nun gehen?

**Was du brauchst:**
Eine feuerfeste Schale, Streichhölzer, Papier und Stift, Wasser

**Das Ritual:**

1. **Vorbereitung** – Setze dich in Ruhe hin und atme tief durch. Spüre in dich hinein.

2. **Schreibe auf, was du loslassen möchtest** – Ängste, Glaubenssätze, Beziehungen, Gewohnheiten – alles, was dich nicht mehr dient.

3. **Lies es laut vor** – Sprich die Worte aus. Erkenne sie an, ohne zu urteilen.

4. **Verbrenne das Papier** – Zünde es sicher in der Schale an und sage: "Ich lasse los, was mich nicht mehr dient. Ich mache Platz für Neues."

5. **Reinigung** – Wasche deine Hände mit Wasser und stelle dir vor, wie alles Alte abgewaschen wird.

Atme tief und spüre die Leichtigkeit, die entsteht.`,
  },
  {
    id: "r4",
    category: "ritual",
    title: "Rauhnächte-Ritual",
    subtitle: "Die magischen 12 Nächte",
    emoji: "❄️",
    color: "#4A3580",
    tags: ["Rauhnächte", "Jahreswechsel", "Prophezeiung"],
    content: `Die Rauhnächte – die 12 Nächte zwischen dem 25. Dezember und dem 6. Januar – gelten als magische Zeit, in der der Schleier zwischen den Welten besonders dünn ist.

**Das Ritual für jede Rauhnacht:**

1. **Räuchern** – Räuchere dein Zuhause mit Weihrauch, Salbei oder Palo Santo aus. Gehe dabei durch jeden Raum und bitte um Schutz und Reinigung.

2. **Rückschau** – Jede Rauhnacht steht für einen Monat des kommenden Jahres. Reflektiere: Was zeigt sich in dieser Nacht?

3. **Traumjournal** – Schreibe deine Träume auf. In den Rauhnächten sind sie besonders bedeutsam.

4. **Orakel** – Ziehe eine Rune oder eine Tarot-Karte als Botschaft für den entsprechenden Monat.

5. **Stille** – Verbringe Zeit in bewusster Stille. Lausche auf die Botschaften deiner Seele.

Die Rauhnächte sind eine Einladung, innezuhalten und auf das neue Jahr mit Klarheit und Intention zuzugehen.`,
  },
  {
    id: "r5",
    category: "ritual",
    title: "Aura-Reinigung",
    subtitle: "Dein Energiefeld klären",
    emoji: "🌈",
    color: "#7B4FA6",
    tags: ["Aura", "Energie", "Reinigung"],
    content: `Unsere Aura – das Energiefeld um unseren Körper – nimmt täglich Eindrücke, Energien und Emotionen auf. Dieses Ritual hilft dir, dein Energiefeld zu reinigen und zu stärken.

**Das Ritual:**

1. **Dusche oder Bad** – Stelle dir vor, wie das Wasser nicht nur deinen Körper, sondern auch dein Energiefeld reinigt. Visualisiere, wie alles Fremde abfließt.

2. **Klopfen** – Klopfe sanft deinen ganzen Körper ab, von den Füßen bis zum Kopf. Dies aktiviert dein Energiefeld.

3. **Weißes Licht** – Stelle dir vor, wie ein strahlendes weißes Licht von oben durch deinen Scheitel in deinen Körper fließt und jeden Bereich erhellt.

4. **Schutzschild** – Visualisiere eine goldene Kugel um deinen Körper, die dich schützt und nur Liebesenergie durchlässt.

5. **Grounding** – Stelle dir vor, wie Wurzeln aus deinen Füßen in die Erde wachsen und dich erden.

Wiederhole dieses Ritual täglich oder immer dann, wenn du dich energetisch erschöpft fühlst.`,
  },

  // MEDITATIONEN
  {
    id: "m1",
    category: "meditation",
    title: "Mondlicht-Meditation",
    subtitle: "Im Licht des Mondes ruhen",
    emoji: "🌙",
    color: "#2D1B69",
    duration: "10 Min",
    tags: ["Mond", "Ruhe", "Verbindung"],
    content: `Setze oder lege dich bequem hin. Schließe die Augen und atme tief durch.

**Einleitung (2 Minuten)**

Atme dreimal tief ein und aus. Mit jedem Ausatmen lässt du Spannung los. Dein Körper wird schwerer und entspannter.

**Die Reise (6 Minuten)**

Stelle dir vor, du liegst auf einer weichen Wiese in einer warmen Sommernacht. Der Himmel über dir ist tief dunkelblau, übersät mit funkelnden Sternen.

Der Mond steht voll und strahlend am Himmel. Sein silbernes Licht fällt sanft auf dich herab. Du spürst, wie dieses Licht deine Haut berührt – kühl und gleichzeitig wärmend.

Atme das Mondlicht ein. Stelle dir vor, wie es durch deinen Scheitel in deinen Körper fließt und jeden Bereich mit silbernem Licht erfüllt. Dein Kopf... deine Schultern... dein Herz... dein Bauch... deine Beine... bis in die Zehenspitzen.

Du bist vollständig erfüllt von Mondlicht. Du bist ruhig. Du bist sicher. Du bist verbunden.

Spüre, wie der Mond dir eine Botschaft schickt. Was hörst du? Was fühlst du? Was zeigt sich?

**Rückkehr (2 Minuten)**

Atme tief durch. Beginne, deine Finger und Zehen zu bewegen. Strecke dich sanft. Öffne langsam die Augen.

Nimm dir einen Moment, um das Erlebte in deinem Journal festzuhalten.`,
  },
  {
    id: "m2",
    category: "meditation",
    title: "Herzöffnungs-Meditation",
    subtitle: "Liebe fließen lassen",
    emoji: "💜",
    color: "#8B4A6B",
    duration: "15 Min",
    tags: ["Herz", "Liebe", "Öffnung"],
    content: `Setze dich aufrecht hin, die Hände auf dem Herzen. Schließe die Augen.

**Ankommen (3 Minuten)**

Atme tief in dein Herz hinein. Stelle dir vor, wie dein Herz mit jedem Atemzug weicher und offener wird.

**Selbstliebe (5 Minuten)**

Lege beide Hände auf dein Herz. Spüre die Wärme deiner Hände. Sage innerlich zu dir selbst:

"Ich liebe mich so, wie ich bin."
"Ich bin genug."
"Ich verdiene Liebe."
"Ich bin Liebe."

Lass diese Worte in dein Herz sinken. Wenn Widerstand auftaucht, atme ihn sanft weg.

**Ausdehnung (5 Minuten)**

Stelle dir vor, wie die Liebe in deinem Herzen immer größer wird. Sie strahlt über deinen Körper hinaus, erfüllt den Raum um dich, breitet sich weiter aus...

Sende diese Liebe an alle Menschen, die du liebst. Dann an alle Menschen, die Liebe brauchen. Dann an die ganze Welt.

**Rückkehr (2 Minuten)**

Atme tief durch. Lächle sanft. Öffne die Augen.`,
  },
  {
    id: "m3",
    category: "meditation",
    title: "Erdungs-Meditation",
    subtitle: "Verwurzelt und geerdet sein",
    emoji: "🌿",
    color: "#3D6B4A",
    duration: "8 Min",
    tags: ["Erdung", "Stabilität", "Natur"],
    content: `Stelle dich barfuß auf den Boden oder setze dich mit den Füßen fest auf dem Boden. Schließe die Augen.

**Erdung (4 Minuten)**

Spüre den Boden unter deinen Füßen. Drücke sie sanft in den Boden. Stelle dir vor, wie Wurzeln aus deinen Fußsohlen wachsen – tief in die Erde hinein.

Diese Wurzeln wachsen immer tiefer, durch den Boden, durch Gestein, bis in den Erdkern. Du bist fest verwurzelt.

Spüre die Stabilität der Erde unter dir. Die Erde trägt dich. Du bist sicher.

**Energie empfangen (3 Minuten)**

Stelle dir vor, wie heilende Erdenergie durch deine Wurzeln in deinen Körper fließt. Grüne, nährende Energie steigt durch deine Beine auf, füllt deinen Bauch, dein Herz, deinen ganzen Körper.

Du bist geerdet. Du bist stabil. Du bist präsent.

**Abschluss (1 Minute)**

Atme tief durch. Öffne die Augen. Stampfe sanft mit den Füßen auf den Boden.`,
  },
  {
    id: "m4",
    category: "meditation",
    title: "Atemmeditation für Anfänger",
    subtitle: "Der Atem als Anker",
    emoji: "🌬️",
    color: "#4A6B8B",
    duration: "5 Min",
    tags: ["Atem", "Anfänger", "Stille"],
    content: `Diese einfache Meditation ist perfekt für Einsteiger und für stressige Momente.

**Die Meditation:**

Setze dich bequem hin. Schließe die Augen oder senke den Blick.

Richte deine Aufmerksamkeit auf deinen Atem. Du musst nichts verändern – beobachte einfach, wie du atmest.

Spüre, wie die Luft durch deine Nase einströmt. Wie sich dein Bauch und deine Brust heben. Wie die Luft wieder ausströmt.

Wenn Gedanken kommen – und sie werden kommen – nimm sie wahr, ohne sie zu bewerten, und kehre sanft zum Atem zurück. Immer wieder.

Der Atem ist dein Anker im gegenwärtigen Moment. Hier. Jetzt. Alles ist gut.

Atme ein... und aus...
Atme ein... und aus...

Bleibe so lange, wie es sich gut anfühlt. Auch 5 Minuten können transformativ sein.`,
  },

  // GEDICHTE
  {
    id: "g1",
    category: "gedicht",
    title: "Die Stille in dir",
    subtitle: "Von Lara, die Seelenplanerin",
    emoji: "🌸",
    color: "#8B4A6B",
    tags: ["Stille", "Innenwelt", "Seele"],
    content: `In der Stille zwischen den Gedanken
wohnt das, was du wirklich bist –
nicht die Rolle, die du spielst,
nicht die Maske, die du trägst.

Dort, wo kein Lärm dich erreicht,
wo die Welt kurz innehält,
bist du einfach du –
vollständig, heil und ganz.

Kehre heim zu dieser Stille.
Sie wartet immer auf dich.
Sie ist nicht weit entfernt –
sie ist das Herz von dir.

*– Die Seelenplanerin*`,
  },
  {
    id: "g2",
    category: "gedicht",
    title: "Mondkind",
    subtitle: "Für alle, die im Mondlicht aufblühen",
    emoji: "🌙",
    color: "#2D1B69",
    tags: ["Mond", "Weiblichkeit", "Magie"],
    content: `Du bist ein Kind des Mondes,
geboren aus Licht und Schatten,
aus Ebbe und Flut,
aus dem ewigen Tanz des Werdens.

Deine Seele kennt die Zyklen –
sie weiß, wann es Zeit ist zu wachsen,
und wann es Zeit ist, sich zurückzuziehen
in die heilige Dunkelheit.

Vertraue deinen Wellen.
Vertraue deinem Rhythmus.
Der Mond liebt dich,
genau so, wie du bist.

*– Die Seelenplanerin*`,
  },
  {
    id: "g3",
    category: "gedicht",
    title: "Wurzeln und Flügel",
    subtitle: "Geerdet und frei zugleich",
    emoji: "🦋",
    color: "#3D6B4A",
    tags: ["Freiheit", "Erdung", "Wachstum"],
    content: `Ich bin der Baum,
der tief in der Erde wurzelt
und dennoch seine Äste
weit in den Himmel streckt.

Geerdet und frei.
Verwurzelt und fliegend.
Beides zugleich –
das ist das Geheimnis.

Lass deine Wurzeln tief gehen,
damit deine Flügel weit tragen können.
Die Erde gibt dir Kraft,
der Himmel gibt dir Richtung.

*– Die Seelenplanerin*`,
  },
  {
    id: "g4",
    category: "gedicht",
    title: "An dich",
    subtitle: "Ein Brief an deine Seele",
    emoji: "💌",
    color: "#C9A84C",
    tags: ["Selbstliebe", "Brief", "Heilung"],
    content: `Du bist nicht zu viel.
Du bist nicht zu wenig.
Du bist genau richtig –
für das Leben, das auf dich wartet.

Deine Wunden sind keine Schwäche,
sie sind die Risse, durch die das Licht fällt.
Deine Geschichte hat dich geformt,
aber sie definiert dich nicht.

Du darfst neu beginnen.
Heute. Jetzt. In diesem Moment.
Du trägst alles in dir,
was du brauchst.

Ich glaube an dich.
Glaube auch du an dich.

*– Die Seelenplanerin*`,
  },
  {
    id: "g5",
    category: "gedicht",
    title: "Rauhnächte",
    subtitle: "Die magische Zeit zwischen den Jahren",
    emoji: "❄️",
    color: "#4A3580",
    tags: ["Rauhnächte", "Winter", "Magie"],
    content: `Zwischen den Jahren liegt eine Zeit,
die keiner Uhr gehört –
die Rauhnächte, wild und weit,
wo Altes sich verkehrt.

Der Schleier wird so dünn wie Hauch,
die Ahnen flüstern leis.
Was war und was noch kommen mag,
zeigt sich auf seine Weis'.

Räuchere dein Haus und dein Herz,
schreib auf, was du loslässt.
Der Neumond wartet auf dein Wort,
das du dir selbst versetzt.

*– Die Seelenplanerin*`,
  },

  // IMPULSE
  {
    id: "i1",
    category: "impuls",
    title: "Du bist genug",
    subtitle: "Tagesimpuls",
    emoji: "✨",
    color: "#C9A84C",
    tags: ["Selbstliebe", "Affirmation", "Stärke"],
    content: `**Heute dein Impuls:**

Du bist genug. Nicht wenn du mehr geleistet hast. Nicht wenn du dünner, erfolgreicher oder ruhiger bist. Jetzt. So wie du bist.

Diese Wahrheit braucht keine Beweise. Sie ist einfach so.

**Deine Aufgabe für heute:**

Schau dich heute dreimal im Spiegel an und sage dir selbst: "Ich bin genug." Auch wenn es sich seltsam anfühlt. Besonders dann.

**Frage für dein Journal:**

Wo in meinem Leben verhalte ich mich so, als wäre ich nicht genug? Was würde sich verändern, wenn ich wirklich glaubte, dass ich es bin?`,
  },
  {
    id: "i2",
    category: "impuls",
    title: "Loslassen ist Liebe",
    subtitle: "Tagesimpuls",
    emoji: "🍂",
    color: "#8B5A3C",
    tags: ["Loslassen", "Transformation", "Mut"],
    content: `**Heute dein Impuls:**

Manchmal ist das Loslassen die liebevollste Handlung – für andere, aber vor allem für dich selbst.

Loslassen bedeutet nicht, dass es dir egal ist. Es bedeutet, dass du erkannt hast, dass manche Dinge, Menschen oder Situationen nicht mehr zu deinem Wachstum beitragen.

**Deine Aufgabe für heute:**

Identifiziere eine Sache, die du schon lange loslassen möchtest, aber noch nicht konntest. Schreibe sie auf ein Papier und lege es für heute beiseite.

**Frage für dein Journal:**

Was hält mich davon ab, loszulassen? Was befürchte ich, zu verlieren? Was könnte ich gewinnen?`,
  },
  {
    id: "i3",
    category: "impuls",
    title: "Dein Körper ist heilig",
    subtitle: "Tagesimpuls",
    emoji: "🌺",
    color: "#8B4A6B",
    tags: ["Körper", "Heiligkeit", "Selbstfürsorge"],
    content: `**Heute dein Impuls:**

Dein Körper ist kein Problem, das gelöst werden muss. Er ist das Zuhause deiner Seele – heilig, weise und wunderbar.

Er trägt dich durch das Leben. Er spricht zu dir durch Empfindungen, Intuition und Schmerz. Er verdient deine Liebe und Fürsorge.

**Deine Aufgabe für heute:**

Tue heute eine Sache, die deinem Körper guttut – nicht weil du musst, sondern weil du ihn liebst. Ein langer Spaziergang, ein warmes Bad, eine Massage, gutes Essen.

**Frage für dein Journal:**

Wie behandle ich meinen Körper? Spreche ich liebevoll oder kritisch über ihn? Was möchte ich ändern?`,
  },
  {
    id: "i4",
    category: "impuls",
    title: "Vertraue dem Prozess",
    subtitle: "Tagesimpuls",
    emoji: "🌱",
    color: "#3D6B4A",
    tags: ["Vertrauen", "Prozess", "Geduld"],
    content: `**Heute dein Impuls:**

Du musst nicht alles kontrollieren. Du musst nicht jeden Schritt sehen, um voranzugehen. Manchmal reicht es, dem nächsten Schritt zu vertrauen.

Das Leben hat einen eigenen Rhythmus. Und oft weiß die Seele mehr als der Verstand.

**Deine Aufgabe für heute:**

Identifiziere einen Bereich in deinem Leben, in dem du zu viel kontrollierst. Atme tief durch und sage: "Ich vertraue dem Prozess."

**Frage für dein Journal:**

Wo fällt mir Vertrauen besonders schwer? Was hat mich gelehrt, misstrauisch zu sein? Was würde mir helfen, mehr zu vertrauen?`,
  },
  {
    id: "i5",
    category: "impuls",
    title: "Deine Intuition spricht",
    subtitle: "Tagesimpuls",
    emoji: "🔮",
    color: "#7B4FA6",
    tags: ["Intuition", "Innere Stimme", "Weisheit"],
    content: `**Heute dein Impuls:**

Du hast eine innere Stimme, die immer weiß, was richtig ist. Sie ist leise – leiser als die Gedanken, leiser als die Angst. Aber sie ist da.

Deine Intuition ist keine Einbildung. Sie ist die Weisheit deiner Seele.

**Deine Aufgabe für heute:**

Nimm dir heute 5 Minuten in Stille. Stelle dir eine Frage, auf die du eine Antwort suchst. Dann warte. Höre auf die erste Antwort, die kommt – bevor der Verstand anfängt zu analysieren.

**Frage für dein Journal:**

Wann habe ich zuletzt auf meine Intuition gehört? Was ist passiert? Wann habe ich sie ignoriert? Was ist dann passiert?`,
  },
  {
    id: "i6",
    category: "impuls",
    title: "Grenzen sind Liebe",
    subtitle: "Tagesimpuls",
    emoji: "🛡️",
    color: "#4A3580",
    tags: ["Grenzen", "Selbstschutz", "Nein sagen"],
    content: `**Heute dein Impuls:**

Grenzen zu setzen ist kein Akt der Ablehnung. Es ist ein Akt der Selbstliebe – und der Liebe zu anderen.

Wenn du deine Grenzen kennst und kommunizierst, ermöglichst du echte, authentische Beziehungen. Du schützt deine Energie und zeigst anderen, wie sie dich behandeln sollen.

**Deine Aufgabe für heute:**

Überlege, wo du gerade eine Grenze setzen möchtest oder müsstest. Formuliere einen Satz, mit dem du diese Grenze kommunizieren könntest.

**Frage für dein Journal:**

Wo fällt mir das Nein-Sagen schwer? Was befürchte ich, wenn ich Grenzen setze? Was passiert, wenn ich es nicht tue?`,
  },
];

export const DAILY_IMPULSE_IDS = ["i1", "i2", "i3", "i4", "i5", "i6"];

export function getDailyImpulse(): ContentItem {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % DAILY_IMPULSE_IDS.length;
  const id = DAILY_IMPULSE_IDS[index];
  return CONTENT_DATA.find((item) => item.id === id) ?? CONTENT_DATA[0];
}

export function getContentByCategory(category: ContentCategory): ContentItem[] {
  return CONTENT_DATA.filter((item) => item.category === category);
}

export function getContentById(id: string): ContentItem | undefined {
  return CONTENT_DATA.find((item) => item.id === id);
}
