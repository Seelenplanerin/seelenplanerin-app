import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Linking,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";

const C = {
  bg: "#FDF8F4", card: "#FFFFFF", rose: "#C4826A", roseLight: "#F9EDE8",
  gold: "#C9A96E", goldLight: "#FAF3E7", brown: "#5C3317", brownMid: "#8B5E3C",
  muted: "#A08070", border: "#EDD9D0", surface: "#F5EEE8",
};

const RITUALE = [
  {
    id: "1",
    titel: "Vollmond-Reinigungsritual",
    kategorie: "Vollmond",
    dauer: "30 Min",
    emoji: "🌕",
    kurz: "Reinige deine Energie und lass los was dich nicht mehr dient.",
    abschnitte: [
      { typ: "intro", text: "Der Vollmond ist die kraftvollste Zeit des Mondzyklus – ein Moment der Fülle, der Klarheit und des Loslassens. In dieser Nacht ist der Schleier zwischen deiner bewussten und unbewussten Welt am dünnsten." },
      { typ: "h2", text: "Warum dieses Ritual?" },
      { typ: "text", text: "Wenn der Mond in seiner vollen Pracht leuchtet, zieht er nicht nur das Wasser der Meere an – er zieht auch alles an die Oberfläche, was in dir schlummert. Emotionen, Muster, Blockaden. Das Vollmond-Reinigungsritual hilft dir, diese Energie bewusst zu nutzen und loszulassen, was dich nicht mehr dient." },
      { typ: "h2", text: "Was du brauchst:" },
      { typ: "bullet", text: "Bergkristall – reinigt und verstärkt die Mondenergie" },
      { typ: "bullet", text: "Weißer Salbei oder Palo Santo zum Räuchern" },
      { typ: "bullet", text: "Weißes Papier und Stift" },
      { typ: "bullet", text: "Eine feuerfeste Schale" },
      { typ: "bullet", text: "Eine weiße Kerze" },
      { typ: "h2", text: "Dein Ritual – Schritt für Schritt:" },
      { typ: "schritt", text: "1. Bereite deinen Sacred Space vor\nRäume deinen Ritualplatz auf und reinige ihn. Öffne ein Fenster, damit alte Energie entweichen kann. Zünde deine Kerze an und räuchere den Raum mit Salbei oder Palo Santo – beginne an der Tür und bewege dich im Uhrzeigersinn durch den Raum." },
      { typ: "schritt", text: "2. Verbinde dich mit dem Mondlicht\nStelle dich ans Fenster oder gehe nach draußen. Schau zum Mond hinauf und atme dreimal tief ein und aus. Spüre seine Energie in deinem Körper. Halte deinen Bergkristall in beide Hände und bitte ihn, dich bei der Reinigung zu unterstützen." },
      { typ: "schritt", text: "3. Schreibe was du loslassen möchtest\nNimm Papier und Stift und schreibe alles auf, was du loslassen möchtest. Alte Glaubenssätze, Beziehungen die dich erschöpfen, Ängste, Schmerzen. Sei ehrlich mit dir. Schreibe so lange, bis du das Gefühl hast, alles ist heraus." },
      { typ: "schritt", text: "4. Das Loslassen\nFalte das Papier zusammen. Halte es kurz ans Herz und sage innerlich: \"Ich danke dir für die Lektionen. Ich lasse dich jetzt gehen.\" Verbrenne das Papier in der feuerfesten Schale. Schau dem Feuer zu und visualisiere wie die Energie sich auflöst und transformiert." },
      { typ: "schritt", text: "5. Kristalle ins Mondlicht\nLege deinen Bergkristall und alle anderen Kristalle, die du besitzt, ans Fensterbrett oder nach draußen ins direkte Mondlicht. Über Nacht werden sie gereinigt und wieder aufgeladen." },
      { typ: "affirmation", text: "\"Ich lasse los was mich nicht mehr dient. Ich bin rein, ich bin frei, ich bin ganz.\"" },
    ],
    materialien: ["Bergkristall", "Weißer Salbei", "Palo Santo", "Weiße Kerze", "Feuerfeste Schale"],
    tags: ["Vollmond", "Loslassen", "Reinigung"],
    shopUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: "2",
    titel: "Neumond-Intentions-Ritual",
    kategorie: "Neumond",
    dauer: "25 Min",
    emoji: "🌑",
    kurz: "Setze kraftvolle Intentionen für den neuen Mondzyklus.",
    abschnitte: [
      { typ: "intro", text: "Der Neumond ist ein Neubeginn – ein leeres Blatt, das darauf wartet, mit deinen Träumen und Wünschen gefüllt zu werden. In dieser Zeit ist die Energie des Mondes nach innen gerichtet, was ihn zur perfekten Zeit für Reflexion und Intention macht." },
      { typ: "h2", text: "Warum dieses Ritual?" },
      { typ: "text", text: "Beim Neumond beginnt ein neuer Zyklus. Was du jetzt säst, wird mit dem zunehmenden Mond wachsen und sich beim Vollmond manifestieren. Dieses Ritual hilft dir, deine Wünsche klar zu formulieren und sie mit der Mondenergie zu verbinden." },
      { typ: "h2", text: "Was du brauchst:" },
      { typ: "bullet", text: "Schwarze oder dunkelviolette Kerze" },
      { typ: "bullet", text: "Mondstein oder Labradorit" },
      { typ: "bullet", text: "Papier und Stift" },
      { typ: "bullet", text: "Räucherwerk – Weihrauch oder Sandelholz" },
      { typ: "h2", text: "Dein Ritual – Schritt für Schritt:" },
      { typ: "schritt", text: "1. Stille und Zentrierung\nSetze dich bequem hin, schließe die Augen und atme fünfmal tief durch. Lass den Alltag los. Komm ganz in diesem Moment an." },
      { typ: "schritt", text: "2. Deine Wünsche formulieren\nÖffne die Augen und schreibe drei bis fünf Wünsche auf. Formuliere sie im Präsens, als wären sie bereits wahr: \"Ich bin...\" \"Ich habe...\" \"Ich erlebe...\" Sei so konkret wie möglich." },
      { typ: "schritt", text: "3. Verbindung mit dem Mondstein\nHalte deinen Mondstein in beide Hände. Spüre seine kühle, sanfte Energie. Lies deine Wünsche laut vor und visualisiere jeden einzelnen so lebhaft wie möglich." },
      { typ: "schritt", text: "4. Intention setzen\nFalte das Papier und lege es unter deine Kerze. Zünde die Kerze an und sage: \"Mit diesem Licht entzünde ich meine Intention. Möge der neue Mondzyklus meine Wünsche nähren.\"" },
      { typ: "schritt", text: "5. Meditation\nSitze fünf bis zehn Minuten in der Stille der Kerze. Atme, visualisiere, spüre." },
      { typ: "affirmation", text: "\"Ich bin offen für neue Anfänge. Meine Wünsche wachsen mit dem Mond.\"" },
    ],
    materialien: ["Mondstein", "Labradorit", "Schwarze Kerze", "Weihrauch", "Sandelholz"],
    tags: ["Neumond", "Intention", "Manifestation"],
    shopUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: "3",
    titel: "Morgenritual für Klarheit",
    kategorie: "Morgen",
    dauer: "15 Min",
    emoji: "☀️",
    kurz: "Starte deinen Tag mit Intention und innerer Klarheit.",
    abschnitte: [
      { typ: "intro", text: "Wie du den Morgen beginnst, bestimmt die Energie deines gesamten Tages. Dieses Morgenritual hilft dir, bewusst in den Tag zu starten, anstatt sofort in den Autopiloten zu fallen." },
      { typ: "h2", text: "Was du brauchst:" },
      { typ: "bullet", text: "Citrin – Stein der Freude und Klarheit" },
      { typ: "bullet", text: "Eine Kerze" },
      { typ: "bullet", text: "Ein Glas warmes Wasser mit Zitrone" },
      { typ: "h2", text: "Dein Ritual – Schritt für Schritt:" },
      { typ: "schritt", text: "1. Aufwachen mit Dankbarkeit\nNoch bevor du dein Handy anschaust: Atme dreimal tief durch. Denke an drei Dinge, für die du heute dankbar bist." },
      { typ: "schritt", text: "2. Wasser trinken\nTrinke dein warmes Zitronenwasser bewusst und langsam. Spüre wie es deinen Körper weckt und reinigt." },
      { typ: "schritt", text: "3. Intention setzen\nZünde deine Kerze an. Halte deinen Citrin in die linke Hand. Frage dich: \"Was möchte ich heute erschaffen? Wie möchte ich mich heute fühlen?\" Formuliere eine klare Intention für den Tag." },
      { typ: "schritt", text: "4. Drei Atemzüge\nAtme dreimal tief ein und aus. Bei jedem Ausatmen lässt du Anspannung los. Bei jedem Einatmen nimmst du Klarheit und Energie auf." },
      { typ: "affirmation", text: "\"Ich beginne diesen Tag mit Klarheit, Freude und Intention.\"" },
    ],
    materialien: ["Citrin", "Kerze", "Zitrone"],
    tags: ["Morgen", "Klarheit", "Intention"],
    shopUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: "4",
    titel: "Aura-Reinigung mit Räucherwerk",
    kategorie: "Schutz",
    dauer: "15 Min",
    emoji: "🌿",
    kurz: "Reinige dein Energiefeld und schütze deine Aura.",
    abschnitte: [
      { typ: "intro", text: "Unsere Aura – unser Energiefeld – nimmt täglich Eindrücke, Energien und Schwingungen anderer Menschen auf. Regelmäßige Reinigung ist so wichtig wie das tägliche Duschen." },
      { typ: "h2", text: "Was du brauchst:" },
      { typ: "bullet", text: "Palo Santo oder weißer Salbei" },
      { typ: "bullet", text: "Schwarzer Turmalin – Schutzstein" },
      { typ: "bullet", text: "Feder oder Hand zum Verteilen des Rauchs" },
      { typ: "h2", text: "Dein Ritual – Schritt für Schritt:" },
      { typ: "schritt", text: "1. Öffne ein Fenster\nDamit die alten Energien einen Weg nach draußen haben." },
      { typ: "schritt", text: "2. Entzünde das Räucherwerk\nZünde deinen Palo Santo oder Salbei an, bis er zu glimmen beginnt. Puste die Flamme aus." },
      { typ: "schritt", text: "3. Räuchere deinen Körper\nBeginne an deinen Füßen und bewege den Rauch langsam aufwärts. Führe ihn um deine Beine, deinen Rumpf, deine Arme, deinen Kopf. Visualisiere dabei wie goldenes Licht alle dunklen Flecken in deiner Aura auflöst." },
      { typ: "schritt", text: "4. Schutzstein aktivieren\nHalte deinen schwarzen Turmalin in beide Hände und bitte ihn: \"Beschütze mein Energiefeld. Halte alles fern, was mir nicht dient.\"" },
      { typ: "affirmation", text: "\"Meine Aura ist rein, mein Energiefeld ist geschützt. Nur Liebe und Licht dürfen eintreten.\"" },
    ],
    materialien: ["Palo Santo", "Weißer Salbei", "Schwarzer Turmalin"],
    tags: ["Schutz", "Reinigung", "Aura"],
    shopUrl: "https://dieseelenplanerin.tentary.com/p/gGmtFy",
  },
  {
    id: "5",
    titel: "Heilstein-Meditation",
    kategorie: "Meditation",
    dauer: "20 Min",
    emoji: "💎",
    kurz: "Verbinde dich mit der Energie deiner Heilsteine und öffne deine Chakren.",
    abschnitte: [
      { typ: "intro", text: "Heilsteine sind Hüter der Erdenergie. Jeder Stein trägt eine einzigartige Schwingung, die mit bestimmten Chakren und Energiezentren in deinem Körper resoniert. Diese Meditation verbindet dich tief mit ihrer Kraft." },
      { typ: "h2", text: "Was du brauchst:" },
      { typ: "bullet", text: "Roter Jaspis – Wurzelchakra" },
      { typ: "bullet", text: "Citrin – Solarplexuschakra" },
      { typ: "bullet", text: "Rosenquarz – Herzchakra" },
      { typ: "bullet", text: "Lapislazuli – Halschakra" },
      { typ: "bullet", text: "Amethyst – Stirnchakra" },
      { typ: "bullet", text: "Bergkristall – Kronenchakra" },
      { typ: "h2", text: "Deine Meditation – Schritt für Schritt:" },
      { typ: "schritt", text: "1. Vorbereitung\nLege dich bequem auf den Rücken. Sorge dafür, dass du nicht gestört wirst. Spiele leise meditative Musik." },
      { typ: "schritt", text: "2. Steine platzieren\nLege die Steine auf die entsprechenden Chakren: Jaspis auf das Steißbein, Citrin auf den Bauch, Rosenquarz auf die Brust, Lapislazuli auf die Kehle, Amethyst auf die Stirn, Bergkristall über den Kopf." },
      { typ: "schritt", text: "3. Chakren aktivieren\nBeginne beim Wurzelchakra. Visualisiere ein rotes Licht das sich langsam ausbreitet. Bewege dich Chakra für Chakra nach oben, bis du beim Kronenchakra ein weißes Licht siehst." },
      { typ: "affirmation", text: "\"Ich bin geerdet, ich bin offen, ich bin verbunden mit der Weisheit meiner Seele.\"" },
    ],
    materialien: ["Amethyst", "Rosenquarz", "Bergkristall", "Citrin", "Lapislazuli"],
    tags: ["Meditation", "Heilsteine", "Chakren"],
    shopUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: "6",
    titel: "Dankbarkeits-Ritual am Abend",
    kategorie: "Abend",
    dauer: "10 Min",
    emoji: "🕯️",
    kurz: "Schließe deinen Tag mit Dankbarkeit und Frieden ab.",
    abschnitte: [
      { typ: "intro", text: "Dankbarkeit ist eine der kraftvollsten spirituellen Praktiken. Sie verschiebt unsere Wahrnehmung von Mangel zu Fülle, von Angst zu Vertrauen, von Dunkelheit zu Licht." },
      { typ: "h2", text: "Was du brauchst:" },
      { typ: "bullet", text: "Eine Kerze" },
      { typ: "bullet", text: "Dein Journal oder Notizbuch" },
      { typ: "bullet", text: "Amethyst – fördert Ruhe und spirituelle Verbindung" },
      { typ: "h2", text: "Dein Ritual – Schritt für Schritt:" },
      { typ: "schritt", text: "1. Stille schaffen\nLege dein Handy weg. Zünde deine Kerze an. Setze dich bequem hin." },
      { typ: "schritt", text: "2. Dankbarkeit schreiben\nSchreibe fünf Dinge auf, für die du heute dankbar bist. Sei konkret: nicht \"Ich bin dankbar für meine Familie\" sondern \"Ich bin dankbar für das Lachen meiner Tochter heute Morgen.\"" },
      { typ: "schritt", text: "3. Den Tag würdigen\nSchreibe eine Sache auf, die du heute gut gemacht hast. Auch wenn der Tag schwer war – du hast ihn überstanden. Das zählt." },
      { typ: "affirmation", text: "\"Ich bin dankbar für diesen Tag. Ich ruhe in Frieden und erwache in Freude.\"" },
    ],
    materialien: ["Kerze", "Amethyst", "Journal"],
    tags: ["Abend", "Dankbarkeit", "Reflexion"],
    shopUrl: "https://dieseelenplanerin.tentary.com/p/qnl3vN",
  },
  {
    id: "7",
    titel: "Salzbad zur Energiereinigung",
    kategorie: "Reinigung",
    dauer: "30 Min",
    emoji: "🛁",
    kurz: "Löse negative Energien auf und lade dich mit Leichtigkeit auf.",
    abschnitte: [
      { typ: "intro", text: "Wasser ist das Element der Reinigung, der Intuition und der Transformation. Ein heiliges Salzbad ist eines der kraftvollsten Rituale zur energetischen Reinigung – einfach, tief und wunderschön." },
      { typ: "h2", text: "Was du brauchst:" },
      { typ: "bullet", text: "Meersalz oder Himalayasalz – 2 bis 3 Handvoll" },
      { typ: "bullet", text: "Lavendelöl – 5 bis 7 Tropfen" },
      { typ: "bullet", text: "Rosenblüten – frisch oder getrocknet" },
      { typ: "bullet", text: "Rosenquarz" },
      { typ: "bullet", text: "Kerzen" },
      { typ: "h2", text: "Dein Ritual – Schritt für Schritt:" },
      { typ: "schritt", text: "1. Bereite dein heiliges Bad vor\nFülle die Wanne mit angenehm warmem Wasser. Gib das Salz hinzu und rühre es mit der Hand ein. Träufle das Lavendelöl ins Wasser. Streue die Rosenblüten auf die Wasseroberfläche. Zünde Kerzen an." },
      { typ: "schritt", text: "2. Intention setzen\nBevor du ins Wasser steigst, halte inne. Sage laut oder innerlich: \"Dieses Bad reinigt mich von allen Energien, die nicht meine eigenen sind. Ich tauche rein und steige gereinigt heraus.\"" },
      { typ: "schritt", text: "3. Im Wasser ankommen\nSteige langsam ins Wasser. Schließe die Augen. Atme tief durch. Spüre das warme Wasser um deinen Körper." },
      { typ: "schritt", text: "4. Loslassen\nVisualisiere wie alle dunklen, schweren Energien sich im Wasser auflösen. Das Salz zieht sie heraus. Das Wasser trägt sie fort." },
      { typ: "affirmation", text: "\"Ich bin rein. Ich bin leicht. Ich bin neu.\"" },
    ],
    materialien: ["Meersalz", "Lavendelöl", "Rosenblüten", "Rosenquarz"],
    tags: ["Reinigung", "Entspannung", "Energie"],
    shopUrl: "https://dieseelenplanerin.tentary.com/p/gGmtFy",
  },
  {
    id: "8",
    titel: "Schutzritual für dein Zuhause",
    kategorie: "Schutz",
    dauer: "20 Min",
    emoji: "🏠",
    kurz: "Reinige und schütze deinen Wohnraum energetisch.",
    abschnitte: [
      { typ: "intro", text: "Dein Zuhause ist dein Tempel – ein Raum, der deine Energie widerspiegelt und beeinflusst. Regelmäßige energetische Reinigung hält deinen Raum leicht, klar und einladend." },
      { typ: "h2", text: "Was du brauchst:" },
      { typ: "bullet", text: "Weißer Salbei oder Palo Santo" },
      { typ: "bullet", text: "Schwarzer Turmalin – mindestens 4 Stücke für die Ecken" },
      { typ: "bullet", text: "Eine Glocke oder Klangschale" },
      { typ: "bullet", text: "Meersalz" },
      { typ: "h2", text: "Dein Ritual – Schritt für Schritt:" },
      { typ: "schritt", text: "1. Öffne alle Fenster\nLass frische Luft und Licht herein. Frische Energie braucht Raum." },
      { typ: "schritt", text: "2. Räuchere jeden Raum\nBeginne an der Eingangstür. Gehe im Uhrzeigersinn durch jeden Raum. Achte besonders auf Ecken, Schränke und dunkle Bereiche – dort sammelt sich Energie an." },
      { typ: "schritt", text: "3. Klang zur Reinigung\nLäute die Glocke oder spiele die Klangschale in jedem Raum. Klang bricht stagnierte Energie auf." },
      { typ: "schritt", text: "4. Turmalin platzieren\nLege je einen schwarzen Turmalin in die vier Ecken deiner Wohnung. Bitte ihn um Schutz." },
      { typ: "affirmation", text: "\"Mein Zuhause ist ein Ort des Friedens, der Liebe und des Schutzes.\"" },
    ],
    materialien: ["Weißer Salbei", "Palo Santo", "Schwarzer Turmalin", "Meersalz"],
    tags: ["Schutz", "Zuhause", "Reinigung"],
    shopUrl: "https://dieseelenplanerin.tentary.com/p/gGmtFy",
  },
];

const FILTER = ["Alle", "Morgen", "Abend", "Vollmond", "Neumond", "Schutz", "Meditation", "Reinigung"];

export default function RitualeScreen() {
  const [aktiveFilter, setAktiveFilter] = useState("Alle");
  const [selectedRitual, setSelectedRitual] = useState<typeof RITUALE[0] | null>(null);

  const gefiltert = aktiveFilter === "Alle" ? RITUALE : RITUALE.filter(r => r.tags.includes(aktiveFilter));

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Rituale</Text>
          <Text style={s.headerSub}>Heilige Handlungen für deine Seele</Text>
        </View>

        {/* Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
          {FILTER.map(f => (
            <TouchableOpacity
              key={f}
              style={[s.filterBtn, aktiveFilter === f && s.filterBtnActive]}
              onPress={() => setAktiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[s.filterText, aktiveFilter === f && s.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Ritual-Karten */}
        <View style={s.cardList}>
          {gefiltert.map(ritual => (
            <TouchableOpacity
              key={ritual.id}
              style={s.card}
              onPress={() => setSelectedRitual(ritual)}
              activeOpacity={0.85}
            >
              <View style={s.cardHeader}>
                <Text style={s.cardEmoji}>{ritual.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitel}>{ritual.titel}</Text>
                  <View style={s.cardMeta}>
                    <Text style={s.cardKat}>{ritual.kategorie}</Text>
                    <Text style={s.cardDot}>·</Text>
                    <Text style={s.cardDauer}>⏱ {ritual.dauer}</Text>
                  </View>
                </View>
                <Text style={s.cardArrow}>›</Text>
              </View>
              <Text style={s.cardKurz}>{ritual.kurz}</Text>
              <View style={s.materialRow}>
                {ritual.materialien.slice(0, 3).map((m, i) => (
                  <View key={i} style={s.materialTag}>
                    <Text style={s.materialText}>{m}</Text>
                  </View>
                ))}
                {ritual.materialien.length > 3 && (
                  <Text style={s.materialMore}>+{ritual.materialien.length - 3}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Shop-Banner */}
        <View style={s.shopBanner}>
          <Text style={s.shopBannerTitle}>✨ Ritualzubehör von Lara</Text>
          <Text style={s.shopBannerText}>Handgravierte Runen-Armbänder, Schutzarmbänder und mehr – mit Laras Energie und Liebe gefertigt.</Text>
          <TouchableOpacity
            style={s.shopBtn}
            onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/qnl3vN")}
            activeOpacity={0.85}
          >
            <Text style={s.shopBtnText}>Zum Shop →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Detail-Modal */}
      <Modal
        visible={selectedRitual !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedRitual(null)}
      >
        {selectedRitual && (
          <View style={{ flex: 1, backgroundColor: C.bg }}>
            <View style={s.modalTopBar}>
              <TouchableOpacity onPress={() => setSelectedRitual(null)} style={s.backBtn} activeOpacity={0.8}>
                <Text style={s.backBtnText}>← Zurück</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <View style={s.modalHero}>
                <Text style={s.modalEmoji}>{selectedRitual.emoji}</Text>
                <Text style={s.modalTitel}>{selectedRitual.titel}</Text>
                <View style={s.modalMetaRow}>
                  <Text style={s.modalKat}>{selectedRitual.kategorie}</Text>
                  <Text style={s.cardDot}>·</Text>
                  <Text style={s.modalDauer}>⏱ {selectedRitual.dauer}</Text>
                </View>
              </View>

              <View style={s.textCard}>
                {selectedRitual.abschnitte.map((a, i) => {
                  if (a.typ === "intro") return <Text key={i} style={s.textIntro}>{a.text}</Text>;
                  if (a.typ === "h2") return <Text key={i} style={s.textH2}>{a.text}</Text>;
                  if (a.typ === "bullet") return <Text key={i} style={s.textBullet}>• {a.text}</Text>;
                  if (a.typ === "schritt") return (
                    <View key={i} style={s.schrittCard}>
                      <Text style={s.schrittText}>{a.text}</Text>
                    </View>
                  );
                  if (a.typ === "affirmation") return (
                    <View key={i} style={s.affirmCard}>
                      <Text style={s.affirmText}>{a.text}</Text>
                    </View>
                  );
                  return <Text key={i} style={s.textPara}>{a.text}</Text>;
                })}
              </View>

              {/* Produkt-CTA */}
              <View style={s.ctaCard}>
                <Text style={s.ctaTitle}>✨ Passende Produkte von Lara</Text>
                <Text style={s.ctaText}>Alle Materialien für dieses Ritual findest du in Laras Shop – handgraviert und mit Liebe gefertigt.</Text>
                <TouchableOpacity
                  style={s.ctaBtn}
                  onPress={() => Linking.openURL(selectedRitual.shopUrl)}
                  activeOpacity={0.85}
                >
                  <Text style={s.ctaBtnText}>Jetzt im Shop bestellen →</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.ctaBtn, { backgroundColor: C.roseLight, marginTop: 10 }]}
                  onPress={() => Linking.openURL("https://dieseelenplanerin.tentary.com/p/gGmtFy")}
                  activeOpacity={0.85}
                >
                  <Text style={[s.ctaBtnText, { color: C.brown }]}>Schutzarmband ansehen →</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 60 }} />
            </ScrollView>
          </View>
        )}
      </Modal>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: C.roseLight, padding: 20, paddingTop: 24 },
  headerTitle: { fontSize: 28, fontWeight: "700", color: C.brown },
  headerSub: { fontSize: 14, color: C.muted, marginTop: 4 },
  filterRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  filterBtnActive: { backgroundColor: C.rose, borderColor: C.rose },
  filterText: { fontSize: 13, color: C.muted, fontWeight: "500" },
  filterTextActive: { color: "#FFF" },
  cardList: { paddingHorizontal: 16, gap: 12, marginTop: 4 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  cardEmoji: { fontSize: 32 },
  cardTitel: { fontSize: 16, fontWeight: "700", color: C.brown },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  cardKat: { fontSize: 11, color: C.rose, fontWeight: "600", backgroundColor: C.roseLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  cardDot: { color: C.muted, fontSize: 12 },
  cardDauer: { fontSize: 11, color: C.muted },
  cardArrow: { fontSize: 24, color: C.muted },
  cardKurz: { fontSize: 13, color: C.muted, lineHeight: 19, marginBottom: 10 },
  materialRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  materialTag: { backgroundColor: C.goldLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1, borderColor: "#E8D5B0" },
  materialText: { fontSize: 10, color: C.brownMid, fontWeight: "500" },
  materialMore: { fontSize: 10, color: C.muted, alignSelf: "center" },
  shopBanner: { margin: 16, backgroundColor: C.goldLight, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#E8D5B0" },
  shopBannerTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 6 },
  shopBannerText: { fontSize: 13, color: C.muted, lineHeight: 19, marginBottom: 14 },
  shopBtn: { backgroundColor: C.gold, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  shopBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  modalTopBar: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, backgroundColor: C.bg, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn: { paddingVertical: 8, paddingHorizontal: 4 },
  backBtnText: { fontSize: 16, color: C.rose, fontWeight: "600" },
  modalHero: { backgroundColor: C.roseLight, padding: 24, alignItems: "center" },
  modalEmoji: { fontSize: 52, marginBottom: 12 },
  modalTitel: { fontSize: 22, fontWeight: "700", color: C.brown, textAlign: "center", marginBottom: 8 },
  modalMetaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  modalKat: { fontSize: 12, color: C.rose, fontWeight: "600", backgroundColor: "#FFF", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  modalDauer: { fontSize: 12, color: C.muted },
  textCard: { marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
  textIntro: { fontSize: 15, color: C.brownMid, lineHeight: 24, marginBottom: 16, fontStyle: "italic" },
  textH2: { fontSize: 16, fontWeight: "700", color: C.brown, marginTop: 16, marginBottom: 8 },
  textBullet: { fontSize: 13, color: C.brownMid, lineHeight: 22, marginLeft: 4, marginBottom: 4 },
  textPara: { fontSize: 14, color: C.brownMid, lineHeight: 22, marginBottom: 8 },
  schrittCard: { backgroundColor: C.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: C.rose },
  schrittText: { fontSize: 13, color: C.brownMid, lineHeight: 21 },
  affirmCard: { backgroundColor: C.roseLight, borderRadius: 14, padding: 16, marginTop: 12, marginBottom: 8, alignItems: "center" },
  affirmText: { fontSize: 15, color: C.brown, fontStyle: "italic", textAlign: "center", lineHeight: 23 },
  ctaCard: { margin: 16, backgroundColor: C.goldLight, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#E8D5B0" },
  ctaTitle: { fontSize: 16, fontWeight: "700", color: C.brown, marginBottom: 8 },
  ctaText: { fontSize: 13, color: C.muted, lineHeight: 19, marginBottom: 14 },
  ctaBtn: { backgroundColor: C.rose, borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  ctaBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
});
