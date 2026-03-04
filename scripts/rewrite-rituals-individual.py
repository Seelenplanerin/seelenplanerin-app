#!/usr/bin/env python3
"""
Schreibt alle 51 Rituale individuell um.
Jedes Ritual bekommt einzigartige Texte passend zum Thema.
NUR Set-Inhalte: 2 Steine, 1 Räucherwerk, 1 Kerze.
"""

import re, json

# ═══════════════════════════════════════════════════════════════
# INDIVIDUELLE RITUAL-TEXTE FÜR ALLE 51 RITUALE
# ═══════════════════════════════════════════════════════════════

RITUALE = {

# ─── FEBRUAR ──────────────────────────────────────────────────

"feb-1": {  # Imbolc – Lichtfest der Erneuerung | Neuanfang-Set
    "intro": "Imbolc markiert das keltische Lichtfest am 1. Februar – der Moment, in dem das Licht nach der dunkelsten Zeit zurückkehrt. Brigid, die Göttin des Feuers und der Erneuerung, segnet diesen Tag. Mit deinem Bergkristall und Citrin begrüßt du das neue Licht, während der Weiße Salbei altes Stagnieren auflöst und die Gelbe Kerze den Weg in dein neues Jahr erhellt.",
    "bullets": [
        "Bergkristall – bringt die Klarheit des zurückkehrenden Lichts in dein Energiefeld",
        "Citrin – entzündet die Vorfreude auf alles, was in diesem Jahr erblühen darf",
        "Weißer Salbei – reinigt die letzten Winterschatten aus deinem Raum",
        "Gelbe Kerze – symbolisiert das erste warme Licht nach der Dunkelheit",
    ],
    "schritte": [
        "1. Brigids Reinigung\\nEntzünde den Weißen Salbei und gehe langsam durch deinen Raum. Imbolc ist ein Fest der Reinigung – lass den Rauch alles Schwere des Winters mitnehmen. Sage dabei: Ich reinige meinen Raum für das neue Licht. Der Winter darf gehen.",
        "2. Das Licht begrüßen\\nZünde die Gelbe Kerze an und stelle sie ans Fenster oder vor dich. Sage: Ich begrüße das Licht. Ich begrüße Brigid. Ich begrüße die Erneuerung in meinem Leben. Spüre die Wärme der Flamme als Symbol des zurückkehrenden Frühlings.",
        "3. Klarheit für das neue Jahr\\nNimm den Bergkristall in beide Hände und halte ihn ins Licht der Kerze. Schließe die Augen und frage dich: Was möchte in diesem Jahr durch mich entstehen? Der Bergkristall verstärkt deine innere Klarheit. Lausche der Antwort.",
        "4. Freude säen\\nNimm den Citrin in deine Hände und halte ihn an dein Solarplexus-Chakra (Bauch). Spüre seine warme, sonnige Energie. Visualisiere drei Dinge, die du in diesem Jahr manifestieren möchtest. Der Citrin lädt sie mit Lebensfreude auf.",
        "5. Brigids Segen\\nHalte beide Steine ans Herz und sage deine Affirmation dreimal. Spüre wie das Licht von Imbolc dich von innen heraus erwärmt. Lasse die Gelbe Kerze sicher abbrennen als Zeichen, dass das Licht nun bleibt.",
    ],
},

"feb-2": {  # Emotion Neumond-Ritual | Transformation-Set
    "intro": "Der Neumond am 17. Februar 2026 bringt eine Sonnenfinsternis – ein kosmisches Portal für tiefe emotionale Transformation. Finsternisse verstärken die Neumond-Energie um ein Vielfaches. Dein Labradorit und Amethyst begleiten dich durch diese intensive Nacht, während Palo Santo den Raum für Wandlung öffnet und die Violette Kerze deine Transformation unterstützt.",
    "bullets": [
        "Labradorit – öffnet das Portal für tiefe emotionale Wandlung",
        "Amethyst – schärft deine Wahrnehmung in dieser kraftvollen Nacht",
        "Palo Santo – das heilige Holz reinigt und bereitet den Raum für Neues",
        "Violette Kerze – die Farbe der Transformation begleitet deinen Wandel",
    ],
    "schritte": [
        "1. Portal öffnen\\nEntzünde den Palo Santo und lasse seinen heiligen Rauch deinen Raum erfüllen. Sage: Ich öffne mich für die Kraft dieser Finsternis. Ich bin bereit, alte Muster zu erkennen und loszulassen. Gehe langsam durch den Raum und spüre, wie sich die Energie verändert.",
        "2. Flamme der Wandlung\\nZünde die Violette Kerze an. Schalte alle anderen Lichter aus – nur die Flamme soll leuchten. Sage: In der Dunkelheit dieser Finsternis finde ich mein inneres Licht. Ich transformiere, was nicht mehr zu mir gehört.",
        "3. Emotionen erkennen\\nNimm den Labradorit in beide Hände. Schließe die Augen und atme tief. Welche Emotionen tauchen auf? Wut, Trauer, Angst? Der Labradorit hilft dir, sie klar zu sehen ohne dich darin zu verlieren. Benenne innerlich jedes Gefühl: Ich sehe dich. Ich ehre dich.",
        "4. Transformation\\nNimm den Amethyst und halte ihn an dein Kronenchakra (Scheitel). Sage: Ich verwandle Schmerz in Weisheit. Ich verwandle Angst in Vertrauen. Spüre wie der Amethyst die schweren Energien aufnimmt und in höhere Schwingung transformiert.",
        "5. Neues Kapitel\\nHalte beide Steine ans Herz. Atme dreimal tief ein und aus. Sage deine Affirmation mit Überzeugung. Die Finsternis ist vorbei – du trittst verwandelt hervor. Lasse die Violette Kerze sicher abbrennen als Zeichen deiner Transformation.",
    ],
},

"feb-3": {  # Selbstliebe-Ritual zum Valentinstag | Selbstliebe-Set
    "intro": "Der Valentinstag gehört nicht nur Paaren – er gehört vor allem dir selbst. Am 14. Februar feierst du die wichtigste Beziehung deines Lebens: die zu dir selbst. Dein Rosenquarz öffnet dein Herz für bedingungslose Selbstliebe, der Mondstein verbindet dich mit deiner weiblichen Intuition, die Myrrhe vertieft die Herzöffnung und die Rosa Kerze hüllt dich in sanfte, liebevolle Energie.",
    "bullets": [
        "Rosenquarz – der Stein der bedingungslosen Liebe öffnet dein Herz für dich selbst",
        "Mondstein – verbindet dich mit deiner inneren Göttin und weiblichen Weisheit",
        "Myrrhe – ihr warmer Duft öffnet das Herzchakra und vertieft die Selbstliebe",
        "Rosa Kerze – hüllt dich in die zarte Energie bedingungsloser Liebe",
    ],
    "schritte": [
        "1. Liebesraum schaffen\\nEntzünde die Myrrhe und lasse ihren warmen, herzöffnenden Duft deinen Raum erfüllen. Atme tief ein und sage: Heute gehört mir. Ich schenke mir selbst die Liebe, die ich verdiene. Lasse den Duft dich sanft umhüllen.",
        "2. Flamme der Selbstliebe\\nZünde die Rosa Kerze an. Sage: Ich entzünde dieses Licht für mich. Für mein Herz. Für alles, was ich bin und was ich werde. Schaue einen Moment in die Flamme und spüre die Wärme, die nur für dich brennt.",
        "3. Herzöffnung\\nNimm den Rosenquarz und lege ihn auf dein Herz. Schließe die Augen. Atme rosa Licht ein und goldenes Licht aus. Sage innerlich: Ich öffne mein Herz für mich selbst. Ich bin würdig. Ich bin genug. Spüre wie der Rosenquarz alte Herzwunden sanft berührt und mit Liebe füllt.",
        "4. Innere Göttin\\nNimm den Mondstein in beide Hände und halte ihn an dein Stirnchakra. Frage dich: Was brauche ich gerade wirklich? Der Mondstein verbindet dich mit deiner weiblichen Intuition. Höre auf die Antwort, die aus deinem tiefsten Inneren kommt. Vertraue ihr.",
        "5. Liebesversprechen\\nHalte beide Steine ans Herz. Sage laut: Ich liebe mich. Ich bin stolz auf mich. Ich verdiene alles Gute in meinem Leben. Sage deine Affirmation. Lasse die Rosa Kerze sicher abbrennen als Zeichen deiner Selbstliebe.",
    ],
},

"feb-4": {  # Vollmond-Ritual der Reinigung | Kraft-Set
    "intro": "Der Vollmond im Februar leuchtet über der noch winterlichen Landschaft und bringt eine kraftvolle Reinigungsenergie mit sich. Es ist Zeit, die letzten schweren Energien des Winters abzuschütteln und deine innere Kraft zu entfachen. Dein Karneol und Sonnenstein wecken dein Feuer, der Weihrauch stärkt deine Entschlossenheit und die Rote Kerze verankert deine erneuerte Kraft.",
    "bullets": [
        "Karneol – entfacht dein inneres Feuer und vertreibt die Wintermüdigkeit",
        "Sonnenstein – bringt Wärme und Vitalität zurück in deinen Körper",
        "Weihrauch – sein heiliger Duft stärkt deine innere Kraft und Entschlossenheit",
        "Rote Kerze – die Farbe des Feuers verankert deine erneuerte Lebenskraft",
    ],
    "schritte": [
        "1. Wintermüdigkeit vertreiben\\nEntzünde den Weihrauch und atme seinen kraftvollen Duft tief ein. Sage: Ich schüttle die Schwere des Winters ab. Neue Kraft fließt durch mich. Spüre wie der Weihrauch deine Energie anhebt und Trägheit vertreibt.",
        "2. Feuer entzünden\\nZünde die Rote Kerze an. Sage: Ich entzünde mein inneres Feuer. Der Vollmond reinigt mich und gibt mir neue Kraft. Schaue in die rote Flamme und spüre, wie sie dein Sakralchakra aktiviert.",
        "3. Mut erwecken\\nNimm den Karneol in deine rechte Hand. Halte ihn an deinen Bauch (Sakralchakra). Visualisiere ein orangerotes Feuer, das in deinem Bauch brennt und immer stärker wird. Sage: Ich bin mutig. Ich bin stark. Ich gehe meinen Weg mit Entschlossenheit.",
        "4. Vitalität aktivieren\\nNimm den Sonnenstein in deine linke Hand. Halte ihn ins Licht des Vollmonds oder der Kerze. Spüre seine warme, sonnige Energie. Sage: Die Sonne kehrt zurück – in mir und um mich herum. Ich bin voller Lebenskraft.",
        "5. Kraft verankern\\nHalte beide Steine zusammen an dein Herz. Atme dreimal tief und kraftvoll ein und aus. Sage deine Affirmation mit voller Überzeugung. Lasse die Rote Kerze sicher abbrennen. Trage den Karneol morgen als Kraftstein bei dir.",
    ],
},

"feb-5": {  # Schutzritual für den Winter | Schutz-Set
    "intro": "Die kalten, dunklen Februarabende können energetisch belastend sein. Dieses Schutzritual stärkt dein Energiefeld und schafft einen sicheren, warmen Raum in der Winterdunkelheit. Der Schwarze Turmalin und Bergkristall bilden zusammen ein kraftvolles Schutzschild, der Weiße Salbei vertreibt schwere Winterenergien und die Schwarze Kerze absorbiert alles Negative.",
    "bullets": [
        "Schwarzer Turmalin – dein Schutzschild gegen die schweren Energien der Dunkelheit",
        "Bergkristall – verstärkt dein Lichtfeld und hält deine Aura klar",
        "Weißer Salbei – vertreibt die energetische Schwere der Winternächte",
        "Schwarze Kerze – absorbiert negative Energien und wandelt sie in Schutz um",
    ],
    "schritte": [
        "1. Winterschatten vertreiben\\nEntzünde den Weißen Salbei und gehe durch jeden Raum deiner Wohnung. Die dunkle Jahreszeit sammelt schwere Energien an – lass den Salbei sie auflösen. Sage: Ich reinige meinen Raum von der Schwere des Winters. Nur Licht und Wärme dürfen hier sein.",
        "2. Schutzflamme\\nZünde die Schwarze Kerze an. Sage: Diese Flamme absorbiert alles Negative. Mein Zuhause ist ein sicherer Ort. Ich bin geschützt in der Dunkelheit. Schaue in die Flamme und spüre, wie sie alles Schwere aufsaugt.",
        "3. Schutzschild aufbauen\\nNimm den Schwarzen Turmalin in deine linke Hand. Schließe die Augen und visualisiere eine schwarze, glänzende Schutzkugel um dich herum. Sage: Kein negativer Einfluss kann mich erreichen. Der Schwarze Turmalin absorbiert alles, was mir nicht dient.",
        "4. Lichtfeld stärken\\nNimm den Bergkristall in deine rechte Hand. Visualisiere weißes, strahlendes Licht, das von dem Stein ausgeht und deine Schutzkugel von innen erhellt. Sage: Mein Licht ist stärker als jede Dunkelheit. Ich strahle von innen heraus.",
        "5. Winterschutz verankern\\nHalte beide Steine zusammen vor die Schwarze Kerze. Sage deine Affirmation. Lege den Schwarzen Turmalin neben dein Bett und den Bergkristall ans Fenster – so schützen sie dich die ganze Nacht. Lasse die Kerze sicher abbrennen.",
    ],
},

# ─── MÄRZ ─────────────────────────────────────────────────────

"mar-1": {  # Release & Grow Vollmond-Ritual | Transformation-Set
    "intro": "Der Vollmond am 3. März 2026 bringt eine totale Mondfinsternis – ein kosmisches Ereignis von enormer Kraft. Der Mond taucht in den Erdschatten ein und wird zum Blutmond. Dein Labradorit und Amethyst begleiten dich durch diese magische Nacht der Transformation, während Palo Santo den Raum für tiefgreifenden Wandel öffnet und die Violette Kerze deine Metamorphose unterstützt.",
    "bullets": [
        "Labradorit – sein schillerndes Licht führt dich sicher durch die Finsternis",
        "Amethyst – löst tief verwurzelte Muster auf und bringt spirituelle Klarheit",
        "Palo Santo – das heilige Holz öffnet den Raum für tiefgreifende Veränderung",
        "Violette Kerze – die Farbe der Alchemie begleitet deine Metamorphose",
    ],
    "schritte": [
        "1. Raum für den Blutmond\\nEntzünde den Palo Santo und reinige deinen Raum. Sage: Ich bereite diesen Raum für die Kraft der Mondfinsternis. Alles Alte darf jetzt gehen. Spüre die besondere Energie dieser Nacht – sie ist anders als jede andere.",
        "2. Flamme der Alchemie\\nZünde die Violette Kerze an. Schalte alle Lichter aus. Sage: In der Dunkelheit der Finsternis finde ich die Kraft zur Veränderung. Ich lasse los. Ich transformiere. Ich wachse. Beobachte die Flamme und spüre die kosmische Energie.",
        "3. Loslassen mit Labradorit\\nNimm den Labradorit in beide Hände. Sein schillerndes Licht erinnert dich: Veränderung ist magisch, nicht beängstigend. Schließe die Augen und benenne innerlich alles, was du loslassen möchtest. Sage zu jedem: Ich lasse dich gehen. Du hast mir gedient, aber jetzt ist es Zeit.",
        "4. Wachstum mit Amethyst\\nNimm den Amethyst und halte ihn an dein Kronenchakra. Sage: Ich öffne mich für meine höchste Version. Aus der Asche des Alten wächst Neues. Visualisiere wie violettes Licht von oben in dich hineinfließt und dich mit neuer Weisheit füllt.",
        "5. Transformation besiegeln\\nHalte beide Steine ans Herz. Sage deine Affirmation dreimal – einmal flüsternd, einmal normal, einmal laut. Spüre wie die Blutmond-Energie deine Transformation besiegelt. Lasse die Violette Kerze sicher abbrennen.",
    ],
},

"mar-2": {  # Fresh Start Neumond-Ritual | Neuanfang-Set
    "intro": "Der Neumond im März steht kurz vor dem Frühlingsanfang – eine perfekte Kombination für einen echten Neustart. Die Natur erwacht aus dem Winterschlaf und mit ihr deine Schöpferkraft. Dein Bergkristall bringt kristallklare Klarheit für neue Wege, der Citrin lädt deine Visionen mit Optimismus auf, der Weiße Salbei reinigt letzte Winterreste und die Gelbe Kerze leuchtet dir den Weg.",
    "bullets": [
        "Bergkristall – bringt kristallklare Klarheit für deinen Neuanfang",
        "Citrin – lädt deine Frühlingspläne mit Optimismus und Freude auf",
        "Weißer Salbei – reinigt die letzten Winterreste aus deinem Energiefeld",
        "Gelbe Kerze – leuchtet wie die erste Frühlingssonne auf deinem neuen Weg",
    ],
    "schritte": [
        "1. Winterreste auflösen\\nEntzünde den Weißen Salbei und reinige deinen Raum gründlich. Der Frühling steht vor der Tür – lass den Salbei die letzten Winterschatten auflösen. Sage: Ich lasse den Winter los. Ich mache Raum für meinen Frühling.",
        "2. Frühlingslicht entzünden\\nZünde die Gelbe Kerze an. Sage: Wie die Sonne im Frühling stärker wird, so wächst auch mein Licht. Ich bin bereit für meinen Neuanfang. Spüre die warme, einladende Energie der Flamme.",
        "3. Klarheit finden\\nNimm den Bergkristall in beide Hände. Schließe die Augen und atme dreimal tief durch. Frage dich: Wohin führt mich mein Weg in diesem Frühling? Der Bergkristall bringt Klarheit. Vertraue den Bildern und Gefühlen, die kommen.",
        "4. Visionen aufladen\\nNimm den Citrin und halte ihn an dein Solarplexus-Chakra. Visualisiere dein Leben in drei Monaten – voller Freude, Wachstum und neuer Möglichkeiten. Der Citrin lädt diese Vision mit sonniger Energie auf. Sage: Ich freue mich auf alles, was kommt.",
        "5. Neuanfang besiegeln\\nHalte beide Steine ans Herz. Sage deine Affirmation dreimal laut. Spüre die Aufbruchsenergie des Frühlings in dir. Lasse die Gelbe Kerze sicher abbrennen als Zeichen deines Neubeginns.",
    ],
},

"mar-3": {  # Ostara – Frühlingsäquinoktium | Neuanfang-Set
    "intro": "Ostara am 20. März markiert die Frühlingstagundnachtgleiche – Tag und Nacht sind exakt gleich lang. Es ist ein kosmischer Moment der perfekten Balance und des Neubeginns. Die Natur explodiert vor Lebenskraft. Dein Bergkristall spiegelt die Klarheit dieses Gleichgewichts, der Citrin bringt die Freude des Frühlings, der Weiße Salbei reinigt für den Neubeginn und die Gelbe Kerze feiert das wachsende Licht.",
    "bullets": [
        "Bergkristall – spiegelt die perfekte Balance der Tagundnachtgleiche",
        "Citrin – trägt die pure Freude des erwachenden Frühlings in sich",
        "Weißer Salbei – reinigt den Raum für das neue Halbjahr des Lichts",
        "Gelbe Kerze – feiert den Sieg des Lichts über die Dunkelheit",
    ],
    "schritte": [
        "1. Ostara-Reinigung\\nEntzünde den Weißen Salbei. Heute beginnt das Halbjahr des Lichts – reinige deinen Raum von allem, was zum dunklen Halbjahr gehörte. Sage: Ich begrüße Ostara. Ich begrüße die Balance. Ich begrüße das Licht, das nun stärker wird als die Dunkelheit.",
        "2. Licht des Gleichgewichts\\nZünde die Gelbe Kerze an. Sage: Wie Tag und Nacht heute in Balance sind, so finde auch ich mein Gleichgewicht. Ich ehre das Licht und die Dunkelheit in mir – beide gehören zu mir.",
        "3. Balance finden\\nNimm den Bergkristall in deine linke Hand. Er repräsentiert Klarheit und Stille. Atme ein: Ich nehme Licht auf. Atme aus: Ich lasse Schwere los. Wiederhole dies siebenmal. Spüre wie sich innere Balance einstellt.",
        "4. Frühlingsfreude\\nNimm den Citrin in deine rechte Hand. Er repräsentiert Freude und Wachstum. Sage: Ich bin bereit zu erblühen. Wie die Natur im Frühling erwacht, so erwache auch ich zu neuer Lebensfreude. Spüre seine sonnige Wärme in deiner Hand.",
        "5. Ostara-Segen\\nHalte beide Steine zusammen vor dein Herz. Sage deine Affirmation. Spüre die perfekte Balance zwischen Klarheit (Bergkristall) und Freude (Citrin) in dir. Lasse die Gelbe Kerze sicher abbrennen als Ostara-Licht.",
    ],
},

"mar-4": {  # Morgenritual für Klarheit | Intuition-Set
    "intro": "Der März bringt die ersten warmen Sonnenstrahlen und mit ihnen die Sehnsucht nach Klarheit. Dieses Morgenritual hilft dir, den Tag mit wacher Intuition und innerem Frieden zu beginnen. Dein Amethyst öffnet dein Drittes Auge, der Mondstein verbindet dich mit deiner inneren Weisheit, die Myrrhe schafft einen meditativen Raum und die Weiße Kerze erhellt deinen Geist.",
    "bullets": [
        "Amethyst – öffnet dein Drittes Auge für klare Wahrnehmung am Morgen",
        "Mondstein – verbindet dich mit deiner inneren Weisheit für den Tag",
        "Myrrhe – ihr meditativer Duft bringt Stille in den Morgen",
        "Weiße Kerze – erhellt deinen Geist wie das erste Morgenlicht",
    ],
    "schritte": [
        "1. Morgenstille\\nEntzünde die Myrrhe direkt nach dem Aufwachen, noch bevor du dein Handy anschaust. Lasse den meditativen Duft deinen Raum erfüllen. Atme dreimal tief ein und sage: Ich beginne diesen Tag in Stille und Klarheit.",
        "2. Morgenlicht\\nZünde die Weiße Kerze an. Sage: Ich entzünde mein inneres Licht. Heute gehe ich meinen Weg mit klarer Intuition und offenem Herzen. Schaue einen Moment in die Flamme und lass deinen Geist zur Ruhe kommen.",
        "3. Drittes Auge öffnen\\nNimm den Amethyst und lege ihn auf dein Stirnchakra (zwischen den Augenbrauen). Schließe die Augen für 5 Minuten. Visualisiere ein indigoblaues Licht, das immer heller wird. Frage: Was ist heute wichtig? Lausche der Antwort.",
        "4. Tagesweisheit empfangen\\nNimm den Mondstein in beide Hände und halte ihn vor dein Herz. Sage: Ich vertraue meiner Intuition. Sie führt mich sicher durch diesen Tag. Spüre, welche Botschaft der Mondstein für dich hat. Vielleicht ein Gefühl, ein Bild, ein Wort.",
        "5. Tag beginnen\\nHalte beide Steine kurz ans Herz. Sage deine Affirmation. Lasse die Weiße Kerze sicher abbrennen oder puste sie mit Dankbarkeit aus. Trage den Amethyst heute bei dir als Erinnerung an deine innere Klarheit.",
    ],
},

# ─── APRIL ────────────────────────────────────────────────────

"apr-1": {  # Open Heart Vollmond-Ritual | Selbstliebe-Set
    "intro": "Der Vollmond im April steht am Himmel wie ein leuchtendes Herz und lädt dich ein, dein eigenes Herz weit zu öffnen. Die Natur ist in voller Blüte – und auch du darfst jetzt erblühen. Dein Rosenquarz und Mondstein arbeiten zusammen, um dein Herzchakra zu öffnen, die Myrrhe vertieft die emotionale Heilung und die Rosa Kerze badet dich in bedingungsloser Liebe.",
    "bullets": [
        "Rosenquarz – öffnet dein Herzchakra im Licht des Vollmonds",
        "Mondstein – verstärkt die Vollmond-Energie für emotionale Heilung",
        "Myrrhe – vertieft die Herzöffnung und löst emotionale Blockaden",
        "Rosa Kerze – badet dich in der Energie bedingungsloser Liebe",
    ],
    "schritte": [
        "1. Herz-Raum schaffen\\nEntzünde die Myrrhe und lasse ihren warmen Duft deinen Raum erfüllen. Sage: Ich schaffe einen sicheren Raum für mein Herz. Hier darf ich fühlen, hier darf ich heilen, hier darf ich lieben. Atme den Duft tief ein.",
        "2. Vollmond-Liebe\\nZünde die Rosa Kerze an. Wenn möglich, setze dich ans Fenster mit Blick auf den Vollmond. Sage: Der Vollmond erhellt mein Herz. Ich öffne mich für Liebe – für mich selbst und für die Welt.",
        "3. Herzöffnung\\nNimm den Rosenquarz und lege ihn auf dein Herz. Schließe die Augen. Atme rosa Licht ein und grauen Nebel aus. Spüre wie der Rosenquarz sanft an alte Wunden rührt und sie mit Liebe füllt. Erlaube dir zu fühlen, was hochkommt – ohne zu bewerten.",
        "4. Vollmond-Intuition\\nNimm den Mondstein und halte ihn ins Licht des Vollmonds oder der Kerze. Sage: Ich empfange die Weisheit des Vollmonds. Mein Herz weiß, was es braucht. Spüre die sanfte, silbrige Mondenergie durch deine Hände fließen.",
        "5. Liebe verankern\\nHalte beide Steine ans Herz. Sage deine Affirmation dreimal – leise, sanft und liebevoll. Spüre die Kombination aus Herzliebe (Rosenquarz) und Mondweisheit (Mondstein). Lasse die Rosa Kerze sicher abbrennen.",
    ],
},

"apr-2": {  # Neumond-Intentions-Ritual | Intuition-Set
    "intro": "Der Neumond im April ist wie ein leeres Blatt – voller Möglichkeiten. Der Frühling ist in voller Kraft und die Energie des Wachstums unterstützt jede Intention, die du jetzt setzt. Dein Amethyst und Mondstein öffnen deine intuitiven Kanäle, die Myrrhe vertieft deine Meditation und die Weiße Kerze erhellt den Weg deiner Intentionen.",
    "bullets": [
        "Amethyst – schärft deine Intuition für die richtigen Intentionen",
        "Mondstein – verbindet dich mit der Neumond-Energie des Neubeginns",
        "Myrrhe – vertieft deine Meditation und öffnet innere Kanäle",
        "Weiße Kerze – erhellt den Weg deiner Intentionen wie ein Leuchtturm",
    ],
    "schritte": [
        "1. Stille des Neumonds\\nEntzünde die Myrrhe und dimme das Licht. Der Neumond ist die stillste Nacht des Monats – nutze diese Stille. Sage: In der Dunkelheit des Neumonds finde ich Klarheit. Ich höre meine innere Stimme. Atme den meditativen Duft ein.",
        "2. Licht der Intention\\nZünde die Weiße Kerze an – sie ist das einzige Licht in der Neumond-Dunkelheit. Sage: Dieses Licht repräsentiert meine Intention. Klein, aber kraftvoll. Es wird wachsen, wie der Mond wachsen wird.",
        "3. Intuition befragen\\nNimm den Amethyst und lege ihn auf dein Stirnchakra. Schließe die Augen für 5-10 Minuten. Frage: Was will durch mich in die Welt kommen? Welche Intention soll ich setzen? Vertraue den Bildern und Gefühlen, die kommen.",
        "4. Neumond-Verbindung\\nNimm den Mondstein in beide Hände. Er ist der Stein des Neumonds – des Neubeginns. Formuliere deine Intention klar und positiv. Halte den Mondstein ans Herz und sage deine Intention dreimal laut.",
        "5. Intention verankern\\nHalte beide Steine vor die Weiße Kerze. Sage deine Affirmation. Visualisiere wie deine Intention mit dem wachsenden Mond stärker wird. Lasse die Kerze sicher abbrennen. Lege den Mondstein auf dein Nachttischchen bis zum Vollmond.",
    ],
},

"apr-3": {  # Die Nacht der Hexen – Walpurgisnacht | Transformation-Set
    "intro": "Die Walpurgisnacht am 30. April ist eine der magischsten Nächte des Jahres – der Schleier zwischen den Welten ist dünn, die Magie greifbar. Es ist die Nacht der Transformation, in der das Alte verbrannt und das Neue begrüßt wird. Dein Labradorit und Amethyst sind die perfekten Begleiter für diese mystische Nacht, Palo Santo öffnet die Tore und die Violette Kerze entfacht die Magie der Wandlung.",
    "bullets": [
        "Labradorit – der Stein der Magie entfaltet seine volle Kraft in dieser Nacht",
        "Amethyst – schützt dich und öffnet dein spirituelles Bewusstsein",
        "Palo Santo – öffnet die Tore zwischen den Welten in der Hexennacht",
        "Violette Kerze – entfacht die uralte Magie der Walpurgisnacht",
    ],
    "schritte": [
        "1. Tore öffnen\\nEntzünde den Palo Santo um Mitternacht oder bei Einbruch der Dunkelheit. Sage: Ich öffne die Tore zur Walpurgisnacht. Die Magie ist real. Ich bin bereit für Transformation. Gehe mit dem Rauch durch deinen Raum und spüre, wie die Energie sich verändert.",
        "2. Hexenfeuer\\nZünde die Violette Kerze an. In alten Zeiten wurden in dieser Nacht große Feuer entzündet. Deine Kerze ist dein persönliches Walpurgisfeuer. Sage: Ich verbrenne das Alte. Ich begrüße das Neue. Die Magie dieser Nacht trägt mich.",
        "3. Magie des Labradorits\\nNimm den Labradorit in beide Hände und halte ihn ins Kerzenlicht. Beobachte sein schillerndes Farbenspiel – das ist die Magie, die in dir lebt. Sage: Ich bin magisch. Ich habe die Kraft, mein Leben zu verwandeln. Spüre die Magie durch deine Hände fließen.",
        "4. Spiritueller Schutz\\nNimm den Amethyst und halte ihn an dein Drittes Auge. In der Walpurgisnacht ist der Schleier dünn – der Amethyst schützt dich dabei. Sage: Ich bin geschützt in meiner Transformation. Nur das Höchste und Beste darf zu mir kommen.",
        "5. Walpurgis-Segen\\nHalte beide Steine ans Herz. Sage deine Affirmation dreimal in die Nacht hinein. Spüre die uralte Magie der Walpurgisnacht in dir. Lasse die Violette Kerze sicher abbrennen. Die Transformation ist besiegelt.",
    ],
},

"apr-4": {  # Vollmond-Ritual der Befreiung | Selbstliebe-Set
    "intro": "Der zweite Vollmond im April schenkt dir die Kraft der Befreiung. Es ist Zeit, dich von allem zu lösen, was dein Herz beschwert – alte Verletzungen, Selbstzweifel, Erwartungen anderer. Dein Rosenquarz und Mondstein helfen dir, dich selbst zu befreien und in Liebe zu halten, die Myrrhe löst emotionale Fesseln und die Rosa Kerze umhüllt dich mit heilender Wärme.",
    "bullets": [
        "Rosenquarz – heilt die Wunden, die dich gefangen halten",
        "Mondstein – gibt dir die Kraft, dich im Vollmondlicht zu befreien",
        "Myrrhe – löst emotionale Fesseln und befreit dein Herz",
        "Rosa Kerze – umhüllt dich mit heilender Wärme während der Befreiung",
    ],
    "schritte": [
        "1. Fesseln lösen\\nEntzünde die Myrrhe und atme tief ein. Sage: Ich löse alle Fesseln, die mich halten. Alte Verletzungen, Selbstzweifel, Erwartungen anderer – ich lasse euch gehen. Spüre wie der Myrrhe-Duft schwere Energien sanft auflöst.",
        "2. Befreiungslicht\\nZünde die Rosa Kerze an. Sage: Im Licht dieses Vollmonds befreie ich mich. Ich verdiene es, frei und leicht zu sein. Ich verdiene es, glücklich zu sein. Schaue in die sanfte Flamme.",
        "3. Herz heilen\\nNimm den Rosenquarz und lege ihn auf dein Herz. Denke an eine Verletzung, die dich noch belastet. Sage: Ich vergebe. Nicht für die andere Person, sondern für mich. Ich befreie mein Herz. Spüre wie der Rosenquarz die Wunde mit Liebe füllt.",
        "4. Vollmond-Befreiung\\nNimm den Mondstein und halte ihn hoch – zum Vollmond oder zur Decke. Sage: Der Vollmond nimmt mit, was ich loslasse. Ich bin frei. Ich bin leicht. Ich bin bei mir. Spüre wie die Mondenergie alles Schwere von dir nimmt.",
        "5. In Liebe frei\\nHalte beide Steine ans Herz. Sage deine Affirmation. Atme dreimal tief ein – Liebe ein, Schwere aus. Du bist befreit. Lasse die Rosa Kerze sicher abbrennen als Zeichen deiner neuen Freiheit.",
    ],
},

"apr-5": {  # Frühlings-Erwachensmeditation | Heilung-Set
    "intro": "Im April erwacht die Natur in voller Pracht – und auch in dir darf jetzt Heilung geschehen. Diese Meditation verbindet dich mit der heilenden Kraft des Frühlings. Dein Rosenquarz und Amethyst arbeiten zusammen an deiner emotionalen und seelischen Heilung, Palo Santo reinigt alte Wunden und die Grüne Kerze nährt dein Wachstum.",
    "bullets": [
        "Rosenquarz – heilt emotionale Wunden mit der sanften Kraft des Frühlings",
        "Amethyst – löst seelische Blockaden und bringt inneren Frieden",
        "Palo Santo – reinigt alte Wunden und bereitet den Boden für Heilung",
        "Grüne Kerze – die Farbe des Frühlings nährt dein Wachstum und deine Heilung",
    ],
    "schritte": [
        "1. Heilraum des Frühlings\\nEntzünde den Palo Santo und sage: Wie die Natur im Frühling heilt und erneuert, so heile auch ich. Dieser Raum ist ein Ort der Heilung. Lasse den Rauch alte Wunden sanft berühren und reinigen.",
        "2. Wachstumslicht\\nZünde die Grüne Kerze an. Sage: Ich wachse. Ich heile. Wie jede Blume im Frühling ihren Weg ans Licht findet, so finde auch ich meinen Weg zur Heilung. Die grüne Flamme nährt deine Seele.",
        "3. Emotionale Heilung\\nNimm den Rosenquarz und lege ihn auf dein Herz. Schließe die Augen. Visualisiere eine rosa-grüne Lichtkugel um dein Herz. Sie wächst mit jedem Atemzug. Sage: Ich erlaube mir zu heilen. Mein Herz darf sich öffnen wie eine Frühlingsblume.",
        "4. Seelische Erneuerung\\nNimm den Amethyst und halte ihn an dein Stirnchakra. Sage: Ich lasse alten Schmerz los. Ich vergebe mir und anderen. Meine Seele erneuert sich wie die Natur im Frühling. Spüre wie violettes Licht alte Blockaden sanft auflöst.",
        "5. Heilung integrieren\\nLege beide Steine auf dein Herz. Atme 5 Minuten lang langsam und tief. Spüre die heilende Frühlingskraft in dir. Sage deine Affirmation. Lasse die Grüne Kerze sicher abbrennen als Symbol für fortlaufende Heilung.",
    ],
},

# ─── MAI ──────────────────────────────────────────────────────

"mai-1": {  # Beltane – Feuer der Lebensfreude | Lebensfreude-Set
    "intro": "Beltane am 1. Mai ist das keltische Fest des Feuers, der Fruchtbarkeit und der puren Lebensfreude. Die Natur steht in voller Blüte, die Energie ist auf ihrem Höhepunkt. Dein Sonnenstein und Karneol entfachen das Beltane-Feuer in dir, der Weihrauch hebt deine Schwingung und die Orange Kerze strahlt die Wärme und Freude dieses Festes aus.",
    "bullets": [
        "Sonnenstein – trägt das Beltane-Feuer und die pure Lebensfreude in sich",
        "Karneol – entfacht Leidenschaft, Kreativität und Lebenslust",
        "Weihrauch – hebt deine Schwingung auf die Frequenz der Freude",
        "Orange Kerze – strahlt die Wärme und Energie des Beltane-Feuers aus",
    ],
    "schritte": [
        "1. Beltane-Feuer entzünden\\nEntzünde den Weihrauch und sage: Ich entzünde das Beltane-Feuer in meinem Herzen. Ich feiere das Leben, die Liebe und die Freude. Spüre wie der Weihrauch deine Energie anhebt und Schwere vertreibt.",
        "2. Flamme der Freude\\nZünde die Orange Kerze an. Sage: Dies ist mein Beltane-Feuer. Es brennt für die Freude am Leben, für Leidenschaft und für alles, was mich zum Strahlen bringt. Spüre die warme, fröhliche Energie der Flamme.",
        "3. Sonnenkraft erwecken\\nNimm den Sonnenstein in beide Hände und halte ihn ins Kerzenlicht. Beobachte sein goldenes Funkeln. Sage: Ich bin Sonnenlicht. Ich strahle Freude aus. Mein Licht erhellt die Welt um mich herum. Spüre die Wärme in deinen Händen.",
        "4. Lebenslust entfachen\\nNimm den Karneol und halte ihn an dein Sakralchakra. Sage: Ich bin lebendig. Ich bin leidenschaftlich. Ich feiere jeden Moment. Bewege dich, tanze, wiege dich – lass die Beltane-Energie durch deinen Körper fließen.",
        "5. Beltane-Segen\\nHalte beide Steine ans Herz. Sage deine Affirmation mit einem breiten Lächeln. Spüre die pure Lebensfreude in dir. Lasse die Orange Kerze sicher abbrennen als dein persönliches Beltane-Feuer.",
    ],
},

"mai-2": {  # Vollmond-Reinigungsritual | Schutz-Set
    "intro": "Der Vollmond im Mai – auch Blumenmond genannt – ist ideal für eine tiefe energetische Reinigung. Die Natur blüht und auch dein Energiefeld verdient es, frisch und klar zu sein. Dein Schwarzer Turmalin und Bergkristall reinigen und schützen deine Aura, der Weiße Salbei klärt deinen Raum und die Schwarze Kerze absorbiert alles, was dir nicht mehr dient.",
    "bullets": [
        "Schwarzer Turmalin – absorbiert angesammelte negative Energien aus deiner Aura",
        "Bergkristall – reinigt und verstärkt dein Energiefeld im Vollmondlicht",
        "Weißer Salbei – klärt deinen Raum für den frischen Blumenmond",
        "Schwarze Kerze – absorbiert alles Schwere und wandelt es in Schutz um",
    ],
    "schritte": [
        "1. Blumenmond-Reinigung\\nEntzünde den Weißen Salbei und reinige deinen Raum gründlich. Sage: Im Licht des Blumenmonds reinige ich meinen Raum und mein Energiefeld. Alles Schwere darf jetzt gehen. Gehe im Uhrzeigersinn durch jeden Raum.",
        "2. Absorbierende Flamme\\nZünde die Schwarze Kerze an. Sage: Diese Flamme absorbiert alles, was mir nicht mehr dient. Negative Gedanken, fremde Energien, alte Lasten – das Feuer nimmt sie auf und verwandelt sie.",
        "3. Aura reinigen\\nNimm den Schwarzen Turmalin und führe ihn langsam um deinen Körper herum – von Kopf bis Fuß, etwa 10 cm Abstand. Sage: Der Schwarze Turmalin reinigt meine Aura. Er absorbiert alles Negative. Mein Energiefeld wird klar und stark.",
        "4. Energiefeld stärken\\nNimm den Bergkristall und halte ihn über deinen Kopf. Visualisiere weißes Licht, das von oben durch den Kristall in dich hineinfließt und dein gesamtes Energiefeld auffüllt. Sage: Mein Energiefeld ist rein, stark und leuchtend.",
        "5. Schutz verankern\\nHalte beide Steine ans Herz. Sage deine Affirmation. Spüre wie frisch und klar sich dein Energiefeld anfühlt. Lasse die Schwarze Kerze sicher abbrennen. Lege die Steine über Nacht ins Vollmondlicht zum Aufladen.",
    ],
},

"mai-3": {  # Innere Balance – Neumond-Meditation | Intuition-Set
    "intro": "Der Neumond im Mai lädt dich ein, in der Stille deine innere Balance zu finden. Zwischen dem Trubel des Frühlings ist es wichtig, innezuhalten und nach innen zu lauschen. Dein Amethyst und Mondstein führen dich in tiefe Meditation, die Myrrhe schafft einen heiligen Raum der Stille und die Weiße Kerze ist dein Anker im Hier und Jetzt.",
    "bullets": [
        "Amethyst – führt dich in tiefe Meditation und innere Stille",
        "Mondstein – bringt emotionale Balance in der Neumond-Dunkelheit",
        "Myrrhe – schafft einen heiligen Raum der Stille und Einkehr",
        "Weiße Kerze – dein Anker im Hier und Jetzt während der Meditation",
    ],
    "schritte": [
        "1. Stille schaffen\\nEntzünde die Myrrhe und schalte alle Geräte aus. Sage: Ich trete ein in die Stille. Der Neumond hält den Raum für meine innere Einkehr. Lasse den meditativen Duft dich umhüllen und zur Ruhe bringen.",
        "2. Anker setzen\\nZünde die Weiße Kerze an. Sie ist dein einziges Licht. Sage: In der Dunkelheit des Neumonds finde ich meinen inneren Frieden. Diese Flamme ist mein Anker. Schaue 10 Atemzüge lang in die Flamme.",
        "3. Geist beruhigen\\nNimm den Amethyst und lege ihn auf dein Stirnchakra. Schließe die Augen. Lass alle Gedanken vorbeiziehen wie Wolken am Himmel. Bewerte nichts. Halte nichts fest. Der Amethyst hilft dir, in die Stille jenseits der Gedanken zu sinken.",
        "4. Emotionale Balance\\nNimm den Mondstein und lege ihn auf dein Herz. Spüre deinen Herzschlag. Sage innerlich: Ich bin in Balance. Mein Herz ist ruhig. Mein Geist ist klar. Bleibe 5 Minuten in dieser Position und spüre die sanfte Mondstein-Energie.",
        "5. Balance integrieren\\nHalte beide Steine ans Herz. Sage deine Affirmation leise und sanft. Spüre die tiefe innere Ruhe. Lasse die Weiße Kerze sicher abbrennen. Nimm diese Balance mit in deinen Alltag.",
    ],
},

"mai-4": {  # Neumond-Manifestationsritual | Fülle-Set
    "intro": "Der zweite Neumond im Mai ist ein kraftvolles Fenster für Manifestation. Die Natur zeigt dir, wie Fülle aussieht – alles blüht, wächst und gedeiht. Nutze diese Energie mit deinem Citrin und Pyrit, um deine Wünsche in die Realität zu bringen. Der Weihrauch öffnet die Manifestationskanäle und die Goldene Kerze zieht Wohlstand an.",
    "bullets": [
        "Citrin – der Manifestationsstein aktiviert deine Schöpferkraft",
        "Pyrit – zieht Wohlstand und Erfolg magnetisch an",
        "Weihrauch – öffnet die Kanäle zwischen Wunsch und Wirklichkeit",
        "Goldene Kerze – strahlt die Frequenz von Fülle und Überfluss aus",
    ],
    "schritte": [
        "1. Fülle-Kanal öffnen\\nEntzünde den Weihrauch und sage: Ich öffne mich für Fülle in allen Bereichen meines Lebens. Wie die Natur im Mai in Überfluss erblüht, so erblüht auch mein Wohlstand. Atme den heiligen Duft tief ein.",
        "2. Goldenes Licht\\nZünde die Goldene Kerze an. Sage: Ich ziehe Fülle an. Ich bin ein Magnet für Wohlstand, Erfolg und Überfluss. Dieses goldene Licht strahlt meine Intention in das Universum.",
        "3. Manifestation aktivieren\\nNimm den Citrin in deine rechte Hand und halte ihn an dein Solarplexus-Chakra. Visualisiere goldenes Licht, das von dem Stein ausgeht. Formuliere deinen Wunsch klar und spezifisch. Sage ihn dreimal laut, als wäre er bereits Realität.",
        "4. Wohlstand anziehen\\nNimm den Pyrit in deine linke Hand. Spüre sein Gewicht – solide wie der Wohlstand, den du anziehst. Sage: Ich habe die Willenskraft, meine Träume zu verwirklichen. Geld, Erfolg und Fülle fließen zu mir.",
        "5. Manifestation besiegeln\\nHalte beide Steine zusammen vor die Goldene Kerze. Sage deine Affirmation mit absoluter Überzeugung. Visualisiere dein Leben in Fülle. Lasse die Goldene Kerze sicher abbrennen als Manifestations-Anker.",
    ],
},

"mai-5": {  # Erdungs-Ritual im Wald | Erdung-Set
    "intro": "Im Mai ist die Natur in voller Kraft – der perfekte Zeitpunkt, um dich tief mit der Erde zu verbinden. Dieses Erdungsritual bringt dich zurück in deinen Körper und ins Hier und Jetzt. Dein Schwarzer Turmalin und Karneol erden und vitalisieren dich, der Palo Santo klärt deinen Geist und die Braune Kerze verbindet dich mit der Kraft der Erde.",
    "bullets": [
        "Schwarzer Turmalin – erdet dich tief und absorbiert Unruhe und Stress",
        "Karneol – bringt dich zurück in deinen Körper und aktiviert deine Lebenskraft",
        "Palo Santo – klärt deinen Geist und bringt dich ins Hier und Jetzt",
        "Braune Kerze – verbindet dich mit der stabilen, nährenden Kraft der Erde",
    ],
    "schritte": [
        "1. Geist klären\\nEntzünde den Palo Santo und atme tief ein. Sage: Ich komme an. Ich bin hier. Ich bin jetzt. Mein Geist wird klar und ruhig. Lasse den Rauch alle kreisenden Gedanken und Sorgen mitnehmen.",
        "2. Erdverbindung\\nZünde die Braune Kerze an. Setze dich auf den Boden – direkt auf die Erde, wenn möglich. Sage: Ich verbinde mich mit der Erde. Sie trägt mich. Sie nährt mich. Sie hält mich. Spüre den Boden unter dir.",
        "3. Wurzeln schlagen\\nNimm den Schwarzen Turmalin in deine linke Hand und lege sie auf den Boden. Schließe die Augen. Visualisiere schwarze Wurzeln, die von deinem Steißbein tief in die Erde wachsen. Sage: Ich bin geerdet. Ich bin stabil. Nichts kann mich umwerfen.",
        "4. Lebenskraft aktivieren\\nNimm den Karneol in deine rechte Hand und halte ihn an deinen Bauch. Spüre seine warme, vitalisierende Energie. Sage: Ich bin lebendig. Ich bin präsent. Mein Körper ist mein Zuhause. Spüre wie Wärme durch deinen Körper fließt.",
        "5. Geerdet sein\\nHalte beide Steine zusammen auf deinen Schoß. Atme 10 Mal tief ein und aus. Bei jedem Ausatmen lässt du mehr Anspannung los. Sage deine Affirmation. Lasse die Braune Kerze sicher abbrennen. Du bist geerdet.",
    ],
},

# ─── JUNI ─────────────────────────────────────────────────────

"jun-1": {  # Inner Voice Zwillinge-Ritual | Intuition-Set
    "intro": "Die Zwillinge-Energie im Juni bringt Kommunikation, Neugier und mentale Beweglichkeit. Doch in all dem äußeren Austausch ist es wichtig, deine innere Stimme nicht zu verlieren. Dieses Ritual stärkt deine Intuition inmitten des Zwillinge-Trubels. Dein Amethyst und Mondstein öffnen deine inneren Kanäle, die Myrrhe bringt Stille und die Weiße Kerze erhellt deine innere Wahrheit.",
    "bullets": [
        "Amethyst – filtert den Zwillinge-Lärm und stärkt deine innere Stimme",
        "Mondstein – verbindet dich mit deiner Intuition jenseits des Verstandes",
        "Myrrhe – bringt Stille in die geschäftige Zwillinge-Energie",
        "Weiße Kerze – erhellt deine innere Wahrheit inmitten vieler Stimmen",
    ],
    "schritte": [
        "1. Stille finden\\nEntzünde die Myrrhe und sage: Inmitten aller Stimmen finde ich meine eigene. Ich werde still. Ich höre nach innen. Die Zwillinge-Energie bringt viele Ideen – die Myrrhe hilft dir, die richtige zu erkennen.",
        "2. Inneres Licht\\nZünde die Weiße Kerze an. Sage: Meine innere Stimme ist klar und wahr. Ich vertraue ihr mehr als dem Lärm der Welt. Schaue in die Flamme und lass deinen Verstand zur Ruhe kommen.",
        "3. Drittes Auge aktivieren\\nNimm den Amethyst und lege ihn auf dein Stirnchakra. Schließe die Augen. Die Zwillinge-Energie aktiviert den Verstand – der Amethyst öffnet die Intuition. Sage: Ich höre nicht nur mit dem Kopf, sondern mit dem Herzen.",
        "4. Mondweisheit\\nNimm den Mondstein in beide Hände und halte ihn vor dein Herz. Stelle eine Frage, die dich beschäftigt. Warte. Lausche. Die Antwort kommt nicht als Gedanke, sondern als Gefühl, als Wissen, als innere Gewissheit.",
        "5. Innere Stimme verankern\\nHalte beide Steine ans Herz. Sage deine Affirmation. Nimm dir vor, heute mindestens einmal innezuhalten und nach innen zu lauschen, bevor du eine Entscheidung triffst. Lasse die Weiße Kerze sicher abbrennen.",
    ],
},

"jun-2": {  # Litha – Sommersonnenwende | Kraft-Set
    "intro": "Litha am 21. Juni ist die Sommersonnenwende – der längste Tag des Jahres, der Höhepunkt des Lichts. Die Sonne steht in ihrer vollen Kraft und auch du darfst jetzt in deiner vollen Kraft stehen. Dein Karneol und Sonnenstein tragen das Feuer der Sonne in sich, der Weihrauch verstärkt deine Sonnenkraft und die Rote Kerze verankert die Energie des längsten Tages.",
    "bullets": [
        "Karneol – trägt das Feuer der Sommersonne in deinem Sakralchakra",
        "Sonnenstein – strahlt die volle Kraft des längsten Tages aus",
        "Weihrauch – verstärkt deine Sonnenkraft und hebt deine Energie",
        "Rote Kerze – verankert die Kraft der Sommersonnenwende in dir",
    ],
    "schritte": [
        "1. Sonnenkraft einladen\\nEntzünde den Weihrauch – am besten bei Sonnenaufgang oder Sonnenuntergang. Sage: Ich ehre die Sonne an ihrem kraftvollsten Tag. Ihre Energie fließt durch mich. Ich stehe in meiner vollen Kraft. Atme die Sonnenenergie ein.",
        "2. Litha-Feuer\\nZünde die Rote Kerze an. Sage: Wie die Sonne heute am längsten scheint, so scheint auch mein inneres Licht in voller Kraft. Ich bin Feuer. Ich bin Licht. Ich bin Kraft. Spüre die Hitze der Flamme.",
        "3. Inneres Feuer\\nNimm den Karneol und halte ihn an dein Sakralchakra. Visualisiere eine Sonne in deinem Bauch, die immer größer und heißer wird. Sage: Mein inneres Feuer brennt hell. Ich habe den Mut, alles zu erreichen, was ich mir vornehme.",
        "4. Sonnenstrahlen\\nNimm den Sonnenstein und halte ihn hoch über deinen Kopf – zur Sonne oder zum Himmel. Sage: Ich empfange die volle Kraft der Sommersonne. Sie füllt mich auf für die kommenden Monate. Spüre goldenes Licht durch den Stein in dich hineinfließen.",
        "5. Litha-Segen\\nHalte beide Steine ans Herz. Sage deine Affirmation mit voller Kraft und Überzeugung. Spüre die Sommersonnenwende-Energie in jeder Zelle deines Körpers. Lasse die Rote Kerze sicher abbrennen als dein Litha-Feuer.",
    ],
},

"jun-3": {  # Room Cleanse Reiseritual | Schutz-Set
    "intro": "Ob Hotelzimmer, Ferienwohnung oder ein neuer Raum – fremde Orte tragen fremde Energien. Dieses kompakte Schutzritual reinigt und schützt jeden Raum, in dem du dich aufhältst. Dein Schwarzer Turmalin und Bergkristall schaffen ein mobiles Schutzschild, der Weiße Salbei reinigt die fremden Energien und die Schwarze Kerze verankert deinen persönlichen Schutzraum.",
    "bullets": [
        "Schwarzer Turmalin – dein mobiles Schutzschild für unterwegs",
        "Bergkristall – reinigt fremde Energien und füllt den Raum mit deinem Licht",
        "Weißer Salbei – reinigt fremde Räume schnell und gründlich",
        "Schwarze Kerze – verankert deinen persönlichen Schutzraum überall",
    ],
    "schritte": [
        "1. Raum reinigen\\nEntzünde den Weißen Salbei sobald du den neuen Raum betrittst. Gehe in alle Ecken und sage: Ich reinige diesen Raum von allen fremden Energien. Nur meine Energie und Licht dürfen hier sein. Öffne wenn möglich ein Fenster.",
        "2. Schutz aktivieren\\nZünde die Schwarze Kerze an und stelle sie in die Mitte des Raums. Sage: Dieser Raum gehört jetzt mir. Er ist sicher, rein und geschützt. Keine negative Energie kann hier eindringen.",
        "3. Ecken schützen\\nNimm den Schwarzen Turmalin und gehe damit in jede Ecke des Raums. Halte ihn kurz in jede Ecke und sage: Geschützt. Ecken sammeln besonders viel stagnierende Energie – der Schwarze Turmalin neutralisiert sie.",
        "4. Raum mit Licht füllen\\nStelle dich in die Mitte des Raums mit dem Bergkristall in beiden Händen. Halte ihn hoch und visualisiere weißes Licht, das von dem Kristall ausgeht und den gesamten Raum erfüllt. Sage: Dieser Raum ist jetzt voller Licht und positiver Energie.",
        "5. Schutzanker setzen\\nLege den Schwarzen Turmalin neben dein Bett und den Bergkristall ans Fenster. Sage deine Affirmation. Lasse die Schwarze Kerze sicher abbrennen. Dein Raum ist jetzt gereinigt und geschützt.",
    ],
},

"jun-4": {  # Summer of Love Vollmond-Ritual | Selbstliebe-Set
    "intro": "Der Vollmond im Juni – auch Erdbeermond genannt – steht für Süße, Sinnlichkeit und die Liebe in all ihren Formen. Die warmen Sommernächte laden ein, das Herz weit zu öffnen. Dein Rosenquarz und Mondstein baden im silbrigen Vollmondlicht, die Myrrhe öffnet dein Herz und die Rosa Kerze feiert die Liebe zu dir selbst.",
    "bullets": [
        "Rosenquarz – badet im Erdbeermond-Licht und verstärkt die Selbstliebe",
        "Mondstein – empfängt die volle Kraft des Sommervollmonds",
        "Myrrhe – öffnet dein Herz für die Süße des Sommers",
        "Rosa Kerze – feiert die Liebe in der warmen Sommernacht",
    ],
    "schritte": [
        "1. Sommernacht-Atmosphäre\\nEntzünde die Myrrhe und öffne das Fenster, wenn es warm genug ist. Lasse den Duft sich mit der Sommerluft vermischen. Sage: Ich öffne mein Herz für die Süße dieser Sommernacht. Ich verdiene Liebe und Freude.",
        "2. Erdbeermond-Licht\\nZünde die Rosa Kerze an. Wenn möglich, setze dich ans offene Fenster oder auf den Balkon. Sage: Der Erdbeermond schenkt mir Süße und Liebe. Ich nehme sie an – mit offenem Herzen.",
        "3. Sommerliebe\\nNimm den Rosenquarz und halte ihn ins Mondlicht. Sage: Ich liebe mich – in dieser warmen Sommernacht und an jedem anderen Tag. Lege den Stein auf dein Herz und spüre die Kombination aus Mondlicht und Rosenquarz-Energie.",
        "4. Vollmond-Segen\\nNimm den Mondstein und halte ihn hoch zum Mond. Sage: Ich empfange den Segen des Erdbeermondes. Liebe, Freude und Süße fließen in mein Leben. Spüre die silbrige Mondenergie durch deine Hände in dein Herz fließen.",
        "5. Liebe feiern\\nHalte beide Steine ans Herz. Sage deine Affirmation mit einem Lächeln. Genieße die warme Sommernacht und die Liebe, die du dir selbst schenkst. Lasse die Rosa Kerze sicher abbrennen.",
    ],
},

# ─── JULI ─────────────────────────────────────────────────────

"jul-1": {  # Chakra Balance Meditation | Heilung-Set
    "intro": "Im Hochsommer ist die Energie intensiv – der perfekte Zeitpunkt, um deine Chakren in Balance zu bringen. Diese Meditation arbeitet mit der heilenden Kraft von Rosenquarz und Amethyst, um emotionale und spirituelle Blockaden zu lösen. Palo Santo reinigt dein Energiesystem und die Grüne Kerze nährt deine Heilung von innen heraus.",
    "bullets": [
        "Rosenquarz – heilt und balanciert dein Herzchakra",
        "Amethyst – öffnet und klärt dein Kronen- und Stirnchakra",
        "Palo Santo – reinigt dein gesamtes Chakra-System",
        "Grüne Kerze – nährt die Heilung und Balance aller Energiezentren",
    ],
    "schritte": [
        "1. Energiesystem reinigen\\nEntzünde den Palo Santo und führe den Rauch langsam von deinen Füßen bis über deinen Kopf. Sage: Ich reinige mein gesamtes Energiesystem. Alle Chakren dürfen sich öffnen und in Balance kommen.",
        "2. Heilungslicht\\nZünde die Grüne Kerze an. Sage: Grünes Licht der Heilung durchflutet mein gesamtes Sein. Jedes Chakra findet seine Balance. Ich bin ganz und heil. Setze dich bequem hin oder lege dich hin.",
        "3. Herzchakra heilen\\nLege den Rosenquarz auf dein Herz (Mitte der Brust). Schließe die Augen. Atme grünes und rosa Licht in dein Herzchakra. Sage: Mein Herz ist offen, geheilt und in Balance. Ich gebe und empfange Liebe frei. Bleibe 3 Minuten hier.",
        "4. Obere Chakren öffnen\\nLege den Amethyst auf dein Stirnchakra (Drittes Auge). Visualisiere indigoblaues Licht. Sage: Mein Geist ist klar. Meine Intuition ist stark. Ich bin verbunden mit meiner höchsten Weisheit. Bleibe 3 Minuten hier.",
        "5. Integration\\nHalte beide Steine zusammen auf dein Herz. Atme 5 Minuten lang langsam und tief. Spüre wie alle Chakren in Harmonie schwingen. Sage deine Affirmation. Lasse die Grüne Kerze sicher abbrennen.",
    ],
},

"jul-2": {  # Vollmond-Dankbarkeitsritual | Fülle-Set
    "intro": "Der Vollmond im Juli steht hoch am Sommerhimmel und erinnert dich an die Fülle, die bereits in deinem Leben ist. Dankbarkeit ist der Schlüssel zu noch mehr Fülle. Dein Citrin und Pyrit verstärken die Dankbarkeitsenergie, der Weihrauch öffnet dein Herz für Überfluss und die Goldene Kerze strahlt die Frequenz der Dankbarkeit aus.",
    "bullets": [
        "Citrin – verstärkt das Gefühl von Dankbarkeit und Überfluss",
        "Pyrit – erdet deine Dankbarkeit und macht sie greifbar",
        "Weihrauch – öffnet dein Herz für die Fülle, die bereits da ist",
        "Goldene Kerze – strahlt die Frequenz von Dankbarkeit und Wohlstand aus",
    ],
    "schritte": [
        "1. Dankbarkeit öffnen\\nEntzünde den Weihrauch und sage: Ich öffne mein Herz für Dankbarkeit. Ich erkenne die Fülle, die bereits in meinem Leben ist. Atme den heiligen Duft ein und spüre, wie sich dein Herz weitet.",
        "2. Goldenes Vollmondlicht\\nZünde die Goldene Kerze an. Sage: Im Licht des Vollmonds danke ich für alles, was ich habe und alles, was noch kommt. Dankbarkeit ist mein Schlüssel zu noch mehr Fülle.",
        "3. Fülle erkennen\\nNimm den Citrin in beide Hände. Schließe die Augen und zähle innerlich 10 Dinge auf, für die du dankbar bist. Bei jedem Ding sage: Danke. Spüre wie der Citrin mit jedem Danke wärmer und heller wird.",
        "4. Dankbarkeit erden\\nNimm den Pyrit in beide Hände. Spüre sein Gewicht. Sage: Meine Dankbarkeit ist real und greifbar. Wie dieser Stein solide und beständig ist, so ist auch die Fülle in meinem Leben beständig. Danke für alles, was ist.",
        "5. Dankbarkeit verankern\\nHalte beide Steine vor die Goldene Kerze. Sage deine Affirmation. Lasse die Dankbarkeit in jede Zelle deines Körpers sinken. Lasse die Goldene Kerze sicher abbrennen als Dankbarkeits-Leuchtturm.",
    ],
},

"jul-3": {  # Neumond-Wunschritual | Intuition-Set
    "intro": "Der Neumond im Juli ist eingebettet in die Wärme des Hochsommers – eine Zeit, in der Wünsche besonders kraftvoll sind. Die laue Sommernacht und die Neumond-Dunkelheit schaffen den perfekten Raum, um deine tiefsten Wünsche zu formulieren. Dein Amethyst und Mondstein öffnen deine intuitiven Kanäle, die Myrrhe vertieft deine Verbindung und die Weiße Kerze trägt deine Wünsche ins Universum.",
    "bullets": [
        "Amethyst – hilft dir, deine wahren Wünsche von oberflächlichen zu unterscheiden",
        "Mondstein – verstärkt deine Wünsche in der kraftvollen Neumond-Nacht",
        "Myrrhe – vertieft deine Verbindung zu deinem innersten Wissen",
        "Weiße Kerze – trägt deine Wünsche wie ein Leuchtturm ins Universum",
    ],
    "schritte": [
        "1. Wunschraum schaffen\\nEntzünde die Myrrhe in der warmen Sommernacht. Öffne das Fenster und lasse die laue Luft herein. Sage: Ich schaffe Raum für meine tiefsten Wünsche. In der Stille des Neumonds höre ich, was mein Herz wirklich will.",
        "2. Wunschlicht\\nZünde die Weiße Kerze an. Sage: Dieses Licht trägt meine Wünsche ins Universum. Was ich heute ausspreche, beginnt zu wachsen – wie der Mond in den kommenden Wochen.",
        "3. Wahre Wünsche erkennen\\nNimm den Amethyst und halte ihn an dein Stirnchakra. Schließe die Augen. Frage: Was wünsche ich mir wirklich? Nicht was andere von mir erwarten, nicht was ich denke wollen zu müssen – was will mein Herz? Lausche geduldig.",
        "4. Wünsche verstärken\\nNimm den Mondstein in beide Hände. Formuliere deinen Wunsch klar und positiv – als wäre er bereits Realität. Sage ihn dreimal laut in die Neumond-Nacht. Der Mondstein verstärkt jeden Wunsch, den du bei Neumond aussprichst.",
        "5. Wünsche loslassen\\nHalte beide Steine ans Herz. Sage deine Affirmation. Vertraue darauf, dass das Universum deinen Wunsch gehört hat. Lasse die Weiße Kerze sicher abbrennen. Lege den Mondstein unter dein Kopfkissen für Traumführung.",
    ],
},

"jul-4": {  # Sonnenkraft-Ritual | Kraft-Set
    "intro": "Im Juli steht die Sonne in ihrer vollen Kraft – und dieses Ritual hilft dir, diese Sonnenenergie in dir zu verankern. Es ist die Zeit des Jahres, in der du am meisten Energie zur Verfügung hast. Dein Karneol und Sonnenstein sind die perfekten Sonnensteine, der Weihrauch verstärkt deine Kraft und die Rote Kerze verankert das Sonnenfeuer in dir.",
    "bullets": [
        "Karneol – speichert die Sommersonne in deinem Sakralchakra",
        "Sonnenstein – strahlt wie die Julisonne und füllt dich mit Vitalität",
        "Weihrauch – verstärkt deine Sonnenkraft und Entschlossenheit",
        "Rote Kerze – verankert das Feuer der Hochsommersonne in dir",
    ],
    "schritte": [
        "1. Sonnenkraft einatmen\\nEntzünde den Weihrauch – am besten tagsüber, wenn die Sonne scheint. Sage: Ich atme die Kraft der Hochsommersonne ein. Sie füllt mich mit Energie, Mut und Lebenskraft. Spüre die Wärme des Sommers.",
        "2. Sonnenfeuer\\nZünde die Rote Kerze an. Sage: Mein inneres Feuer brennt so hell wie die Julisonne. Ich bin voller Kraft und Energie. Nichts kann mich aufhalten. Spüre die Hitze der Flamme als Echo der Sonne.",
        "3. Sakralchakra aufladen\\nNimm den Karneol und halte ihn in die Sonne (oder ins Kerzenlicht). Dann lege ihn an dein Sakralchakra. Sage: Die Sonne lädt meinen Karneol auf. Sein Feuer wird zu meinem Feuer. Mut, Leidenschaft und Kraft fließen durch mich.",
        "4. Sonnenstrahlen empfangen\\nNimm den Sonnenstein in beide Hände und halte ihn hoch. Sage: Ich bin ein Kind der Sonne. Ihre Strahlen nähren mich, stärken mich und geben mir Lebensfreude. Spüre goldenes Licht durch den Stein in deinen ganzen Körper fließen.",
        "5. Sonnenkraft speichern\\nHalte beide Steine ans Herz. Sage deine Affirmation mit voller Kraft. Visualisiere wie die Sonnenenergie in jeder Zelle gespeichert wird – für die dunkleren Monate. Lasse die Rote Kerze sicher abbrennen.",
    ],
},

"jul-5": {  # Wasserritual am See | Heilung-Set
    "intro": "Wasser ist das Element der Heilung und der Emotionen. Im Hochsommer, wenn die Hitze alles austrocknet, erinnert dich dieses Ritual an die heilende Kraft des Wassers in dir. Dein Rosenquarz und Amethyst arbeiten zusammen an deiner emotionalen Heilung, Palo Santo reinigt wie fließendes Wasser und die Grüne Kerze nährt deine Seele.",
    "bullets": [
        "Rosenquarz – heilt emotionale Wunden wie kühles, klares Wasser",
        "Amethyst – reinigt deine Seele und bringt inneren Frieden",
        "Palo Santo – reinigt wie ein frischer Sommerregen dein Energiefeld",
        "Grüne Kerze – nährt deine Seele wie Wasser die Erde nährt",
    ],
    "schritte": [
        "1. Reinigender Regen\\nEntzünde den Palo Santo und sage: Wie ein Sommerregen die Erde erfrischt, so reinigt dieser Rauch mein Energiefeld. Alles Schwere wird weggespült. Ich bin frisch und klar. Lasse den Rauch um dich herum fließen.",
        "2. Quelle der Heilung\\nZünde die Grüne Kerze an. Sage: Ich öffne die Quelle der Heilung in mir. Wie Wasser immer seinen Weg findet, so findet auch die Heilung ihren Weg zu meinen Wunden.",
        "3. Emotionen fließen lassen\\nNimm den Rosenquarz und lege ihn auf dein Herz. Schließe die Augen. Stelle dir vor, du sitzt an einem stillen See. Das Wasser ist ruhig und klar. Sage: Ich erlaube meinen Emotionen zu fließen. Wie Wasser fließt, so fließen auch meine Gefühle – und heilen dabei.",
        "4. Seelische Klarheit\\nNimm den Amethyst und halte ihn an dein Stirnchakra. Visualisiere klares, violettes Wasser, das durch deinen Geist fließt und alles Trübe mitnimmt. Sage: Mein Geist ist klar wie ein Bergsee. Ich sehe die Wahrheit. Ich finde Frieden.",
        "5. Heilung fließen lassen\\nHalte beide Steine ans Herz. Sage deine Affirmation. Spüre wie Heilung durch dich fließt – sanft, stetig und unaufhaltsam wie Wasser. Lasse die Grüne Kerze sicher abbrennen.",
    ],
},

# ─── AUGUST ───────────────────────────────────────────────────

"aug-1": {  # Lughnasadh – Erntedankfest | Fülle-Set
    "intro": "Lughnasadh am 1. August ist das keltische Erntedankfest – die erste Ernte des Jahres. Es ist Zeit, die Früchte deiner Arbeit zu feiern und dem Universum zu danken. Dein Citrin und Pyrit verstärken die Ernteenergie, der Weihrauch ehrt die Fülle und die Goldene Kerze feiert deinen Wohlstand.",
    "bullets": [
        "Citrin – feiert die goldene Ernte deiner Manifestationen",
        "Pyrit – erdet den Wohlstand, den du in diesem Jahr geschaffen hast",
        "Weihrauch – ehrt die Fülle und öffnet dich für noch mehr Segen",
        "Goldene Kerze – strahlt wie die goldenen Kornfelder der ersten Ernte",
    ],
    "schritte": [
        "1. Ernte ehren\\nEntzünde den Weihrauch und sage: Ich ehre die erste Ernte. Ich danke für alles, was in diesem Jahr gewachsen ist – in meinem Leben und in mir selbst. Lughnasadh erinnert mich: Ich habe gesät und nun darf ich ernten.",
        "2. Erntefeuer\\nZünde die Goldene Kerze an. Sage: Wie die Felder golden leuchten, so leuchtet auch die Fülle in meinem Leben. Ich feiere meine Ernte. Ich bin dankbar für jeden Segen.",
        "3. Ernte zählen\\nNimm den Citrin in beide Hände. Schließe die Augen und zähle deine Ernte: Was hast du seit Januar erreicht? Welche Wünsche haben sich erfüllt? Bei jedem Erfolg sage: Danke. Ich habe das geschaffen. Spüre den Stolz.",
        "4. Wohlstand verankern\\nNimm den Pyrit und halte ihn fest. Sage: Mein Wohlstand ist real und beständig. Wie dieser Stein solide ist, so ist auch die Fülle in meinem Leben solide. Ich verdiene diese Ernte.",
        "5. Lughnasadh-Segen\\nHalte beide Steine ans Herz. Sage deine Affirmation. Danke dem Universum für die Ernte. Lasse die Goldene Kerze sicher abbrennen als Lughnasadh-Feuer.",
    ],
},

"aug-2": {  # Light Your Vision Neumond-Ritual | Intuition-Set
    "intro": "Der Neumond im August fällt in die heißeste Zeit des Jahres – eine Zeit, in der Visionen besonders lebendig sind. Nutze die Intensität des Hochsommers, um deine Vision für den Rest des Jahres zu klären. Dein Amethyst und Mondstein öffnen dein inneres Auge, die Myrrhe vertieft deine Visionsarbeit und die Weiße Kerze erhellt den Weg deiner Zukunft.",
    "bullets": [
        "Amethyst – öffnet dein inneres Auge für klare Visionen",
        "Mondstein – verbindet dich mit der visionären Kraft des Neumonds",
        "Myrrhe – vertieft deine Visionsarbeit und innere Schau",
        "Weiße Kerze – erhellt den Weg deiner Zukunftsvision",
    ],
    "schritte": [
        "1. Visionsraum\\nEntzünde die Myrrhe und dimme das Licht. Sage: Ich öffne meinen inneren Raum für Visionen. Der Neumond im Hochsommer bringt lebendige Bilder meiner Zukunft. Ich bin bereit zu sehen.",
        "2. Visionslicht\\nZünde die Weiße Kerze an. Sage: Dieses Licht erhellt meinen inneren Weg. Ich sehe klar, wohin meine Reise geht. Schaue 10 Atemzüge lang in die Flamme und lass deinen Geist frei.",
        "3. Inneres Auge öffnen\\nNimm den Amethyst und lege ihn auf dein Stirnchakra. Schließe die Augen. Sage: Zeig mir meine Vision. Wie sieht mein Leben am Ende dieses Jahres aus? Lass Bilder kommen – ohne sie zu bewerten oder zu steuern.",
        "4. Vision verstärken\\nNimm den Mondstein in beide Hände. Halte die Vision fest, die du gesehen hast. Sage: Diese Vision ist meine Wahrheit. Der Mondstein verstärkt sie mit jeder Neumond-Nacht. Sie wird Realität.",
        "5. Vision verankern\\nHalte beide Steine ans Herz. Sage deine Affirmation. Spüre die Gewissheit, dass deine Vision sich erfüllen wird. Lasse die Weiße Kerze sicher abbrennen als Leuchtturm deiner Vision.",
    ],
},

"aug-3": {  # Kräuterweihe zu Mariä Himmelfahrt | Heilung-Set
    "intro": "Am 15. August, Mariä Himmelfahrt, beginnt traditionell der Frauendreißiger – eine Zeit besonderer Heilkraft. Dieses Ritual ehrt die uralte Tradition der Heilung und verbindet dich mit der nährenden Energie der Mutter Erde. Dein Rosenquarz und Amethyst unterstützen die Heilung auf allen Ebenen, Palo Santo reinigt und segnet und die Grüne Kerze nährt deine Gesundheit.",
    "bullets": [
        "Rosenquarz – verbindet dich mit der heilenden Kraft der göttlichen Mutter",
        "Amethyst – öffnet dich für die besondere Heilenergie des Frauendreißigers",
        "Palo Santo – segnet und reinigt in der Tradition der Kräuterweihe",
        "Grüne Kerze – nährt deine Gesundheit und dein Wohlbefinden",
    ],
    "schritte": [
        "1. Heiliger Rauch\\nEntzünde den Palo Santo und sage: Ich ehre die uralte Tradition der Heilung. Der Frauendreißiger beginnt – eine Zeit besonderer Kraft. Ich öffne mich für Heilung auf allen Ebenen. Lasse den heiligen Rauch deinen Raum segnen.",
        "2. Heilungslicht\\nZünde die Grüne Kerze an. Sage: Grünes Licht der Heilung und Gesundheit durchflutet mein Leben. Ich ehre meinen Körper, meine Seele und meinen Geist. Ich verdiene Gesundheit und Wohlbefinden.",
        "3. Körperliche Heilung\\nNimm den Rosenquarz und führe ihn langsam über deinen Körper – von Kopf bis Fuß, etwa 5 cm Abstand. Sage: Ich sende Liebe und Heilung in jede Zelle meines Körpers. Mein Körper ist weise. Er weiß, wie er heilen kann.",
        "4. Seelische Heilung\\nNimm den Amethyst und halte ihn an dein Herz. Sage: Ich heile auf der tiefsten Ebene meines Seins. Alte Wunden schließen sich. Neue Kraft wächst. Spüre die violette Heilenergie des Amethysts.",
        "5. Segen empfangen\\nHalte beide Steine ans Herz. Sage deine Affirmation. Spüre den Segen des Frauendreißigers. Lasse die Grüne Kerze sicher abbrennen als Symbol für anhaltende Gesundheit und Heilung.",
    ],
},

"aug-4": {  # Vollmond-Ritual zur Mondfinsternis | Transformation-Set
    "intro": "Der Vollmond im August bringt eine partielle Mondfinsternis – ein weiteres kosmisches Transformationsportal in diesem Jahr. Die Finsternis-Energie ist intensiv und tiefgreifend. Dein Labradorit und Amethyst sind deine Begleiter durch diese kraftvolle Nacht, Palo Santo öffnet das Portal und die Violette Kerze hält den Raum für deine Verwandlung.",
    "bullets": [
        "Labradorit – navigiert dich sicher durch das Finsternis-Portal",
        "Amethyst – transformiert schwere Energien in höhere Weisheit",
        "Palo Santo – öffnet das kosmische Portal der Mondfinsternis",
        "Violette Kerze – hält den heiligen Raum für deine Verwandlung",
    ],
    "schritte": [
        "1. Portal der Finsternis\\nEntzünde den Palo Santo und sage: Ich öffne mich für die Kraft der Mondfinsternis. Dieses kosmische Portal bringt tiefe Transformation. Ich bin bereit. Spüre die besondere, intensive Energie dieser Nacht.",
        "2. Flamme im Schatten\\nZünde die Violette Kerze an und schalte alle Lichter aus. Sage: Auch im Schatten der Finsternis brennt mein inneres Licht. Ich fürchte die Dunkelheit nicht – sie ist der Geburtsort meiner Transformation.",
        "3. Durch das Portal gehen\\nNimm den Labradorit in beide Hände. Schließe die Augen. Visualisiere ein schimmerndes Portal vor dir. Sage: Ich gehe durch das Portal der Veränderung. Auf der anderen Seite wartet meine neue Version. Schreite innerlich hindurch.",
        "4. Neue Weisheit empfangen\\nNimm den Amethyst und halte ihn an dein Kronenchakra. Sage: Ich empfange die Weisheit, die diese Finsternis mir bringt. Was musste ich loslassen? Was habe ich gelernt? Lausche der Antwort in der Stille.",
        "5. Verwandlung besiegeln\\nHalte beide Steine ans Herz. Sage deine Affirmation dreimal. Du bist durch das Portal gegangen. Du bist nicht mehr dieselbe. Lasse die Violette Kerze sicher abbrennen.",
    ],
},

# ─── SEPTEMBER ────────────────────────────────────────────────

"sep-1": {  # Mabon – Herbstäquinoktium | Fülle-Set
    "intro": "Mabon am 22. September markiert die Herbsttagundnachtgleiche – zum zweiten Mal im Jahr sind Tag und Nacht gleich lang. Es ist das Erntedankfest der zweiten Ernte und eine Zeit der Dankbarkeit und Balance. Dein Citrin und Pyrit feiern die Ernte, der Weihrauch ehrt den Überfluss und die Goldene Kerze strahlt wie die goldenen Herbstblätter.",
    "bullets": [
        "Citrin – feiert die goldene Herbsternte und den Überfluss des Jahres",
        "Pyrit – verankert den Wohlstand, den du in diesem Jahr geerntet hast",
        "Weihrauch – ehrt die zweite Ernte und öffnet dich für Dankbarkeit",
        "Goldene Kerze – strahlt wie die goldenen Blätter des Herbstes",
    ],
    "schritte": [
        "1. Mabon-Dank\\nEntzünde den Weihrauch und sage: Ich ehre Mabon und die zweite Ernte. Tag und Nacht sind in Balance – und auch ich finde mein Gleichgewicht zwischen Geben und Empfangen. Danke für die Fülle dieses Jahres.",
        "2. Herbstgold\\nZünde die Goldene Kerze an. Sage: Wie die Blätter sich golden färben, so leuchtet auch die Fülle in meinem Leben. Ich feiere meine Ernte. Ich bin dankbar für jeden Segen, den dieses Jahr gebracht hat.",
        "3. Jahresernte\\nNimm den Citrin in beide Hände. Schließe die Augen und gehe das Jahr durch – von Januar bis jetzt. Was hast du erreicht? Was ist gewachsen? Sage bei jedem Erfolg: Danke. Das habe ich geschaffen. Der Citrin verstärkt deine Dankbarkeit.",
        "4. Balance finden\\nNimm den Pyrit in beide Hände. Mabon ist ein Fest der Balance. Sage: Ich finde Balance zwischen Aktivität und Ruhe, zwischen Geben und Empfangen, zwischen Licht und Dunkelheit. Der Pyrit erdet mich in dieser Balance.",
        "5. Mabon-Segen\\nHalte beide Steine ans Herz. Sage deine Affirmation. Danke der Erde für ihre Gaben. Lasse die Goldene Kerze sicher abbrennen als Mabon-Licht.",
    ],
},

"sep-2": {  # Neumond-Erneuerungsritual | Transformation-Set
    "intro": "Der Neumond im September fällt in die Zeit des Übergangs vom Sommer zum Herbst. Die Natur beginnt sich zurückzuziehen und auch du darfst jetzt nach innen gehen und dich erneuern. Dein Labradorit und Amethyst begleiten dich durch diese innere Wandlung, Palo Santo reinigt für den Neubeginn und die Violette Kerze unterstützt deine Erneuerung.",
    "bullets": [
        "Labradorit – begleitet dich durch den Übergang vom Sommer zum Herbst",
        "Amethyst – unterstützt die innere Erneuerung und spirituelles Wachstum",
        "Palo Santo – reinigt alte Sommerenergien für den Herbst-Neubeginn",
        "Violette Kerze – unterstützt deine innere Erneuerung und Wandlung",
    ],
    "schritte": [
        "1. Sommer verabschieden\\nEntzünde den Palo Santo und sage: Ich verabschiede den Sommer mit Dankbarkeit. Ich öffne mich für die Weisheit des Herbstes. Wie die Natur sich wandelt, so wandle auch ich mich. Lasse den Rauch die Sommerenergien sanft auflösen.",
        "2. Erneuerungslicht\\nZünde die Violette Kerze an. Sage: In der Dunkelheit des Neumonds erneuere ich mich. Ich lasse los, was dem Sommer gehörte. Ich begrüße, was der Herbst bringt.",
        "3. Innere Wandlung\\nNimm den Labradorit in beide Hände. Schließe die Augen. Sage: Ich wandle mich wie die Natur. Was muss ich loslassen, damit Neues wachsen kann? Welche Blätter dürfen fallen? Spüre die Antwort in deinem Herzen.",
        "4. Spirituelle Erneuerung\\nNimm den Amethyst und halte ihn an dein Kronenchakra. Sage: Ich erneuere mich auf der tiefsten Ebene. Mein Geist wird klar. Meine Seele wird frisch. Ich bin bereit für das nächste Kapitel. Spüre violettes Licht durch dich fließen.",
        "5. Erneuerung besiegeln\\nHalte beide Steine ans Herz. Sage deine Affirmation. Spüre die Frische der Erneuerung in dir. Lasse die Violette Kerze sicher abbrennen.",
    ],
},

"sep-3": {  # Aura-Reinigung mit Räucherwerk | Schutz-Set
    "intro": "Der September bringt den Wechsel der Jahreszeiten – und damit auch energetische Veränderungen. Deine Aura hat den ganzen Sommer über Eindrücke gesammelt und verdient jetzt eine gründliche Reinigung. Dein Schwarzer Turmalin und Bergkristall reinigen und stärken dein Energiefeld, der Weiße Salbei klärt deine Aura und die Schwarze Kerze absorbiert alle Unreinheiten.",
    "bullets": [
        "Schwarzer Turmalin – absorbiert alle Unreinheiten aus deiner Aura",
        "Bergkristall – füllt dein gereinigtes Energiefeld mit strahlendem Licht",
        "Weißer Salbei – reinigt deine Aura gründlich zum Jahreszeitenwechsel",
        "Schwarze Kerze – absorbiert energetische Rückstände des Sommers",
    ],
    "schritte": [
        "1. Aura-Reinigung\\nEntzünde den Weißen Salbei und führe den Rauch langsam um deinen gesamten Körper – von den Füßen bis über den Kopf. Sage: Ich reinige meine Aura von allen Eindrücken des Sommers. Fremde Energien, Stress und Schwere – ich lasse euch gehen.",
        "2. Absorbierende Flamme\\nZünde die Schwarze Kerze an. Sage: Diese Flamme absorbiert alle energetischen Rückstände. Meine Aura wird rein und klar wie ein Herbstmorgen. Spüre wie die Flamme Schwere aus deinem Feld zieht.",
        "3. Tiefenreinigung\\nNimm den Schwarzen Turmalin und führe ihn in kreisenden Bewegungen um deinen Körper – besonders um Kopf, Schultern und Solarplexus. Sage: Der Schwarze Turmalin reinigt jede Schicht meiner Aura. Alles Fremde wird absorbiert.",
        "4. Lichtfeld aufbauen\\nNimm den Bergkristall und halte ihn über deinen Kopf. Visualisiere eine Lichtsäule, die von oben durch den Kristall in dich hineinfließt und dein gesamtes Energiefeld mit strahlendem Licht füllt. Sage: Meine Aura strahlt. Mein Licht ist stark.",
        "5. Schutz verankern\\nHalte beide Steine ans Herz. Sage deine Affirmation. Deine Aura ist jetzt gereinigt und gestärkt für den Herbst. Lasse die Schwarze Kerze sicher abbrennen.",
    ],
},

"sep-4": {  # Vollmond-Ernteritual | Lebensfreude-Set
    "intro": "Der Vollmond im September – der Erntemond – ist der hellste und größte Vollmond des Jahres. Er steht für die Feier der Ernte und die pure Freude am Leben. Dein Sonnenstein und Karneol feiern mit dir, der Weihrauch hebt deine Stimmung und die Orange Kerze strahlt die Wärme und Freude der Erntezeit aus.",
    "bullets": [
        "Sonnenstein – strahlt die goldene Freude der Erntezeit aus",
        "Karneol – feiert die Lebenskraft und alles, was du geschaffen hast",
        "Weihrauch – hebt deine Stimmung auf die Frequenz der Erntefreude",
        "Orange Kerze – strahlt die Wärme und Dankbarkeit der Erntezeit aus",
    ],
    "schritte": [
        "1. Erntefreude\\nEntzünde den Weihrauch und sage: Ich feiere meine Ernte im Licht des Erntemonds. Alles, was ich in diesem Jahr gesät habe, trägt jetzt Früchte. Ich bin stolz auf mich. Spüre die Freude in deinem Herzen.",
        "2. Erntemond-Licht\\nZünde die Orange Kerze an. Sage: Der Erntemond leuchtet für mich. Er feiert meine Erfolge, meine Stärke und meine Lebensfreude. Ich strahle wie der hellste Vollmond des Jahres.",
        "3. Freude feiern\\nNimm den Sonnenstein in beide Hände und halte ihn ins Mondlicht oder Kerzenlicht. Sage: Ich feiere das Leben. Ich feiere mich. Mein Licht strahlt hell und warm. Tanze, wiege dich oder bewege dich – lass die Freude durch deinen Körper fließen.",
        "4. Lebenskraft ehren\\nNimm den Karneol und halte ihn an dein Herz. Sage: Ich ehre meine Lebenskraft. Sie hat mich durch dieses Jahr getragen. Ich bin stark, lebendig und voller Energie. Danke, Körper. Danke, Seele.",
        "5. Ernte feiern\\nHalte beide Steine ans Herz. Sage deine Affirmation mit einem breiten Lächeln. Du hast so viel geschafft. Feiere dich. Lasse die Orange Kerze sicher abbrennen als dein Erntemond-Feuer.",
    ],
},

"sep-5": {  # Abendmeditation zur Tagundnachtgleiche | Transformation-Set
    "intro": "Am Abend der Herbsttagundnachtgleiche steht die Welt in perfekter Balance – und auch du darfst diesen Moment der Stille nutzen. Die Nacht wird nun länger als der Tag, die dunkle Jahreshälfte beginnt. Dein Labradorit und Amethyst begleiten dich in die Stille dieses Übergangs, Palo Santo markiert die Schwelle und die Violette Kerze erhellt den Weg nach innen.",
    "bullets": [
        "Labradorit – begleitet dich über die Schwelle in die dunkle Jahreshälfte",
        "Amethyst – bringt Frieden und Akzeptanz für den Wandel der Jahreszeiten",
        "Palo Santo – markiert die heilige Schwelle zwischen Licht und Dunkelheit",
        "Violette Kerze – erhellt deinen inneren Weg in der beginnenden Dunkelheit",
    ],
    "schritte": [
        "1. Schwelle markieren\\nEntzünde den Palo Santo bei Sonnenuntergang. Sage: Ich stehe an der Schwelle. Das Licht und die Dunkelheit sind heute gleich. Ab morgen regiert die Nacht. Ich begrüße die dunkle Jahreshälfte mit offenem Herzen.",
        "2. Inneres Licht\\nZünde die Violette Kerze an. Sage: Auch wenn die Nächte länger werden, brennt mein inneres Licht. Die Dunkelheit ist nicht mein Feind – sie ist der Raum, in dem ich nach innen wachse.",
        "3. Übergang annehmen\\nNimm den Labradorit in beide Hände. Sein schillerndes Licht erinnert dich: Auch in der Dunkelheit gibt es Schönheit. Sage: Ich nehme den Wandel an. Ich vertraue dem Rhythmus der Natur. Wie sie sich wandelt, so wandle auch ich mich.",
        "4. Inneren Frieden finden\\nNimm den Amethyst und halte ihn an dein Herz. Atme langsam und tief. Sage: Ich finde Frieden in der Stille. Die dunkle Jahreshälfte bringt mir Tiefe, Weisheit und inneres Wachstum. Ich bin bereit.",
        "5. Übergang besiegeln\\nHalte beide Steine ans Herz. Sage deine Affirmation. Spüre die perfekte Balance dieses Moments. Lasse die Violette Kerze sicher abbrennen als Licht für die kommende dunkle Zeit.",
    ],
},

# ─── OKTOBER ──────────────────────────────────────────────────

"okt-1": {  # Vollmond-Loslassritual | Transformation-Set
    "intro": "Der Vollmond im Oktober leuchtet über den fallenden Blättern und erinnert dich: Loslassen ist keine Schwäche, sondern Stärke. Wie die Bäume ihre Blätter freigeben, darfst auch du jetzt freigeben, was dich belastet. Dein Labradorit und Amethyst unterstützen das Loslassen, Palo Santo reinigt und die Violette Kerze transformiert das Losgelassene.",
    "bullets": [
        "Labradorit – hilft dir, mutig loszulassen wie die Bäume ihre Blätter",
        "Amethyst – transformiert das Losgelassene in Weisheit und Frieden",
        "Palo Santo – reinigt den Raum, den das Loslassen schafft",
        "Violette Kerze – verwandelt Schwere in Leichtigkeit und Freiheit",
    ],
    "schritte": [
        "1. Raum für Loslassen\\nEntzünde den Palo Santo und sage: Wie die Bäume im Oktober ihre Blätter loslassen, so lasse auch ich los. Ich schaffe Raum für Neues, indem ich Altes freigebe. Lasse den Rauch alles Schwere mitnehmen.",
        "2. Transformationsflamme\\nZünde die Violette Kerze an. Sage: Diese Flamme verwandelt alles, was ich loslasse, in Licht. Nichts geht verloren – es wird nur transformiert. Schaue in die Flamme und atme tief.",
        "3. Blätter fallen lassen\\nNimm den Labradorit in beide Hände. Schließe die Augen. Benenne innerlich alles, was du loslassen möchtest – wie Blätter, die vom Baum fallen. Sage zu jedem: Ich lasse dich gehen. Danke für die Lektion. Du darfst jetzt fallen.",
        "4. Frieden finden\\nNimm den Amethyst und halte ihn an dein Herz. Sage: Ich finde Frieden im Loslassen. Jedes gefallene Blatt macht den Baum leichter. Jedes Loslassen macht mich freier. Spüre die Leichtigkeit, die entsteht.",
        "5. Freiheit spüren\\nHalte beide Steine ans Herz. Sage deine Affirmation. Spüre wie leicht du dich fühlst. Lasse die Violette Kerze sicher abbrennen als Symbol für deine Transformation.",
    ],
},

"okt-2": {  # Samhain – Die heilige Nacht | Schutz-Set
    "intro": "Samhain am 31. Oktober ist die heiligste Nacht im keltischen Jahreskreis – das keltische Neujahr. Der Schleier zwischen den Welten ist am dünnsten, die Ahnen sind nah. Dein Schwarzer Turmalin und Bergkristall schützen dich in dieser kraftvollen Nacht, der Weiße Salbei reinigt den Raum und die Schwarze Kerze ehrt die Dunkelheit und die Ahnen.",
    "bullets": [
        "Schwarzer Turmalin – schützt dich in der Nacht der dünnen Schleier",
        "Bergkristall – hält dein Licht stark, während die Welten sich berühren",
        "Weißer Salbei – reinigt und segnet den Raum für die heilige Samhain-Nacht",
        "Schwarze Kerze – ehrt die Dunkelheit und die Ahnen, die uns besuchen",
    ],
    "schritte": [
        "1. Samhain-Reinigung\\nEntzünde den Weißen Salbei und reinige deinen Raum besonders gründlich. Sage: Ich reinige diesen Raum für die heilige Samhain-Nacht. Nur liebevolle Energien und wohlwollende Ahnen sind willkommen. Der Schleier ist dünn – ich bin geschützt.",
        "2. Ahnen-Flamme\\nZünde die Schwarze Kerze an. Sage: Ich entzünde dieses Licht für meine Ahnen. Ich ehre die, die vor mir waren. Ihre Weisheit lebt in mir. In der dunkelsten Nacht finde ich das tiefste Licht.",
        "3. Schutzschild\\nNimm den Schwarzen Turmalin in deine linke Hand. Sage: In der Nacht der dünnen Schleier bin ich geschützt. Der Schwarze Turmalin absorbiert alles, was mir nicht dient. Nur Liebe und Weisheit dürfen zu mir kommen. Visualisiere eine schwarze Schutzkugel um dich.",
        "4. Licht in der Dunkelheit\\nNimm den Bergkristall in deine rechte Hand. Sage: Mein Licht scheint auch in der dunkelsten Nacht. Ich bin ein Leuchtturm für meine Ahnen und für mich selbst. Visualisiere weißes Licht, das von dem Kristall ausgeht.",
        "5. Samhain-Segen\\nHalte beide Steine ans Herz. Sage deine Affirmation. Danke deinen Ahnen für ihre Führung. Lasse die Schwarze Kerze sicher abbrennen als Samhain-Licht. Das keltische Neujahr hat begonnen.",
    ],
},

"okt-3": {  # Neumond-Schutzritual | Transformation-Set
    "intro": "Der Neumond im Oktober fällt in die dunkelste Zeit des Herbstes. Die Nächte werden länger, die Energien intensiver. Dieses Ritual nutzt die Neumond-Dunkelheit für eine tiefe innere Erneuerung und Transformation. Dein Labradorit und Amethyst führen dich sicher durch die Dunkelheit, Palo Santo reinigt und die Violette Kerze ist dein Licht im Dunkeln.",
    "bullets": [
        "Labradorit – führt dich sicher durch die Oktober-Dunkelheit",
        "Amethyst – verwandelt die Dunkelheit in spirituelle Tiefe",
        "Palo Santo – reinigt und schützt in der dunkelsten Neumond-Nacht",
        "Violette Kerze – dein Licht in der tiefsten Herbstdunkelheit",
    ],
    "schritte": [
        "1. Dunkelheit begrüßen\\nEntzünde den Palo Santo und sage: Ich begrüße die Dunkelheit des Oktober-Neumonds. Sie ist nicht mein Feind – sie ist der Schoß, aus dem Neues geboren wird. Ich bin sicher in der Dunkelheit.",
        "2. Licht im Dunkeln\\nZünde die Violette Kerze an – dein einziges Licht. Sage: Auch in der tiefsten Dunkelheit trage ich Licht in mir. Dieses Licht kann niemand löschen. Es brennt für meine Transformation.",
        "3. Innere Reise\\nNimm den Labradorit in beide Hände. Schließe die Augen. Lass dich in die Dunkelheit sinken – nicht mit Angst, sondern mit Neugier. Was findest du dort? Welche Wahrheiten warten in der Tiefe? Der Labradorit schützt dich auf dieser Reise.",
        "4. Transformation in der Tiefe\\nNimm den Amethyst und halte ihn an dein Drittes Auge. Sage: In der Tiefe der Dunkelheit finde ich meine größte Kraft. Ich transformiere Angst in Vertrauen, Zweifel in Gewissheit. Spüre die transformierende Kraft des Amethysts.",
        "5. Erneuert auftauchen\\nHalte beide Steine ans Herz. Sage deine Affirmation. Öffne die Augen und schaue in die Kerzenflamme. Du bist durch die Dunkelheit gegangen und erneuert herausgekommen. Lasse die Violette Kerze sicher abbrennen.",
    ],
},

"okt-4": {  # Ahnen-Ehrungsritual | Intuition-Set
    "intro": "Im Oktober, wenn der Schleier zwischen den Welten dünn ist, ist die perfekte Zeit, um deine Ahnen zu ehren und ihre Weisheit zu empfangen. Dein Amethyst und Mondstein öffnen die Kanäle zur Ahnenwelt, die Myrrhe schafft einen heiligen Raum der Verbindung und die Weiße Kerze leuchtet deinen Ahnen den Weg zu dir.",
    "bullets": [
        "Amethyst – öffnet die Kanäle zur Weisheit deiner Ahnen",
        "Mondstein – verstärkt deine Verbindung zur Ahnenwelt in der dünnen Schleierzeit",
        "Myrrhe – schafft einen heiligen Raum der Ahnenverbindung",
        "Weiße Kerze – leuchtet deinen Ahnen den Weg zu dir",
    ],
    "schritte": [
        "1. Ahnenraum schaffen\\nEntzünde die Myrrhe und sage: Ich öffne diesen Raum für meine Ahnen. Großmütter, Großväter und alle, die vor mir waren – ihr seid willkommen. Ich ehre euch und bitte um eure Weisheit. Lasse den Duft den Raum erfüllen.",
        "2. Ahnenlicht\\nZünde die Weiße Kerze an. Sage: Dieses Licht leuchtet für meine Ahnen. Es zeigt ihnen den Weg zu mir. Ich bin bereit, ihre Botschaften zu empfangen. Stelle die Kerze so, dass sie den Raum sanft erhellt.",
        "3. Kanal öffnen\\nNimm den Amethyst und halte ihn an dein Stirnchakra. Schließe die Augen. Sage: Ich öffne mein Drittes Auge für die Weisheit meiner Ahnen. Zeigt mir, was ich wissen muss. Lausche in der Stille. Vielleicht kommen Bilder, Gefühle oder ein inneres Wissen.",
        "4. Ahnenverbindung\\nNimm den Mondstein in beide Hände und halte ihn ans Herz. Sage: Ich spüre die Verbindung zu meinen Ahnen. Ihr Blut fließt in meinen Adern. Ihre Stärke lebt in mir. Danke für alles, was ihr mir mitgegeben habt.",
        "5. Ahnen-Segen\\nHalte beide Steine ans Herz. Sage deine Affirmation. Danke deinen Ahnen für ihre Anwesenheit. Lasse die Weiße Kerze sicher abbrennen als Licht für die Ahnen.",
    ],
},

"okt-5": {  # Schutzzauber für die dunkle Jahreszeit | Schutz-Set
    "intro": "Die dunkle Jahreszeit beginnt – die Nächte werden lang, die Energien schwerer. Dieses Schutzritual stärkt dein Energiefeld für die kommenden Monate. Dein Schwarzer Turmalin und Bergkristall bilden ein kraftvolles Winterschutzschild, der Weiße Salbei reinigt und die Schwarze Kerze absorbiert die Schwere der dunklen Monate.",
    "bullets": [
        "Schwarzer Turmalin – dein Schutzschild für die gesamte dunkle Jahreszeit",
        "Bergkristall – hält dein Licht stark durch die langen Winternächte",
        "Weißer Salbei – reinigt und stärkt dein Energiefeld für den Winter",
        "Schwarze Kerze – absorbiert die energetische Schwere der Dunkelheit",
    ],
    "schritte": [
        "1. Winterschutz vorbereiten\\nEntzünde den Weißen Salbei und reinige dein gesamtes Zuhause gründlich. Sage: Ich bereite meinen Raum für die dunkle Jahreszeit vor. Alles Schwere darf gehen. Mein Zuhause wird ein Ort des Lichts und der Wärme.",
        "2. Schutzflamme\\nZünde die Schwarze Kerze an. Sage: Diese Flamme absorbiert alle Schwere der kommenden dunklen Monate. Mein Zuhause ist geschützt. Mein Energiefeld ist stark. Keine negative Energie kann mich erreichen.",
        "3. Langzeit-Schutzschild\\nNimm den Schwarzen Turmalin in beide Hände. Sage: Ich programmiere diesen Stein als meinen Winterschutz. Von jetzt bis zur Wintersonnenwende schützt er mich vor schweren Energien. Visualisiere eine schwarze Schutzkugel, die dich und dein Zuhause umgibt.",
        "4. Winterlicht\\nNimm den Bergkristall und halte ihn hoch. Sage: Auch in der dunkelsten Nacht trage ich Licht in mir. Der Bergkristall verstärkt mein inneres Licht. Ich strahle durch den Winter hindurch. Visualisiere strahlendes weißes Licht.",
        "5. Schutz verankern\\nHalte beide Steine ans Herz. Sage deine Affirmation dreimal. Lege den Schwarzen Turmalin an deinen Hauseingang und den Bergkristall ans Fenster. Lasse die Schwarze Kerze sicher abbrennen. Dein Winterschutz steht.",
    ],
},

# ─── NOVEMBER ─────────────────────────────────────────────────

"nov-1": {  # Vollmond-Transformationsritual | Transformation-Set
    "intro": "Der Vollmond im November leuchtet über der kahlen Landschaft – alles ist auf das Wesentliche reduziert. Diese Klarheit ist ein Geschenk für tiefe Transformation. Dein Labradorit und Amethyst nutzen die kraftvolle November-Vollmond-Energie, Palo Santo reinigt und die Violette Kerze unterstützt deine Wandlung in der stillen Novembernacht.",
    "bullets": [
        "Labradorit – nutzt die klare November-Energie für tiefe Wandlung",
        "Amethyst – transformiert in der Stille der kahlen Novembernacht",
        "Palo Santo – reinigt und öffnet den Raum für Transformation",
        "Violette Kerze – leuchtet durch die Novembernacht der Wandlung",
    ],
    "schritte": [
        "1. November-Stille\\nEntzünde den Palo Santo und sage: Die Natur hat sich auf das Wesentliche reduziert. Auch ich lasse jetzt alles Überflüssige los. In der Stille des Novembers finde ich meine tiefste Wahrheit.",
        "2. Vollmond der Klarheit\\nZünde die Violette Kerze an. Sage: Der November-Vollmond zeigt mir klar, was bleiben darf und was gehen muss. Ich habe den Mut zur Veränderung. Schaue in die Flamme und spüre die Klarheit.",
        "3. Wesentliches erkennen\\nNimm den Labradorit in beide Hände. Schließe die Augen. Frage: Was ist wirklich wesentlich in meinem Leben? Was ist nur Ballast? Der Labradorit hilft dir, durch die Illusion zu sehen und das Wesentliche zu erkennen.",
        "4. Transformation vollziehen\\nNimm den Amethyst und halte ihn an dein Kronenchakra. Sage: Ich transformiere mich. Alles Überflüssige fällt ab wie die letzten Blätter. Was bleibt, ist mein wahres Ich. Spüre die transformierende Kraft.",
        "5. Wandlung besiegeln\\nHalte beide Steine ans Herz. Sage deine Affirmation. Spüre die Klarheit und Leichtigkeit nach dem Loslassen. Lasse die Violette Kerze sicher abbrennen.",
    ],
},

"nov-2": {  # Dankbarkeits-Ritual | Fülle-Set
    "intro": "Der November ist traditionell der Monat der Dankbarkeit. Bevor der Winter kommt, ist es Zeit, innezuhalten und für die Fülle des vergangenen Jahres zu danken. Dein Citrin und Pyrit verstärken die Dankbarkeitsenergie, der Weihrauch öffnet dein Herz und die Goldene Kerze strahlt die Wärme der Dankbarkeit in die kalte Novembernacht.",
    "bullets": [
        "Citrin – verstärkt deine Dankbarkeit und zieht noch mehr Segen an",
        "Pyrit – erdet deine Dankbarkeit und macht den Wohlstand greifbar",
        "Weihrauch – öffnet dein Herz für tiefe, aufrichtige Dankbarkeit",
        "Goldene Kerze – strahlt Wärme und Dankbarkeit in die Novembernacht",
    ],
    "schritte": [
        "1. Dankbarkeit öffnen\\nEntzünde den Weihrauch und sage: Ich öffne mein Herz für Dankbarkeit. Bevor der Winter kommt, halte ich inne und danke für alles, was dieses Jahr mir geschenkt hat. Atme den heiligen Duft tief ein.",
        "2. Goldene Wärme\\nZünde die Goldene Kerze an. Sage: In der Kälte des Novembers wärmt mich die Dankbarkeit. Sie ist mein goldenes Licht. Je mehr ich danke, desto mehr habe ich, wofür ich danken kann.",
        "3. Jahres-Dankbarkeit\\nNimm den Citrin in beide Hände. Schließe die Augen und gehe Monat für Monat durch das Jahr. Finde in jedem Monat mindestens einen Segen. Sage bei jedem: Danke. Spüre wie der Citrin mit jedem Danke wärmer wird.",
        "4. Wohlstand ehren\\nNimm den Pyrit in beide Hände. Sage: Ich danke für den Wohlstand in meinem Leben – materiell und immateriell. Ich habe ein Dach über dem Kopf, Menschen die mich lieben, Gesundheit und Kraft. Das ist wahrer Reichtum.",
        "5. Dankbarkeit verankern\\nHalte beide Steine ans Herz. Sage deine Affirmation. Spüre die tiefe Wärme der Dankbarkeit in dir. Lasse die Goldene Kerze sicher abbrennen als Dankbarkeitslicht für den November.",
    ],
},

"nov-3": {  # Abend-Ritual für inneren Frieden | Intuition-Set
    "intro": "Die langen Novemberabende laden ein, zur Ruhe zu kommen und inneren Frieden zu finden. Dieses Abendritual hilft dir, den Tag loszulassen und in Frieden einzuschlafen. Dein Amethyst und Mondstein beruhigen Geist und Seele, die Myrrhe schafft eine friedliche Atmosphäre und die Weiße Kerze ist dein Nachtlicht der Geborgenheit.",
    "bullets": [
        "Amethyst – beruhigt den Geist und löst die Anspannung des Tages",
        "Mondstein – bringt emotionalen Frieden für eine erholsame Nacht",
        "Myrrhe – schafft eine friedliche, geborgene Atmosphäre am Abend",
        "Weiße Kerze – dein Nachtlicht der Geborgenheit und des Friedens",
    ],
    "schritte": [
        "1. Abendstille\\nEntzünde die Myrrhe eine Stunde vor dem Schlafengehen. Schalte alle Bildschirme aus. Sage: Ich lasse den Tag los. Alles, was heute war, darf jetzt ruhen. Ich komme zur Ruhe. Lasse den friedlichen Duft dich umhüllen.",
        "2. Nachtlicht\\nZünde die Weiße Kerze an. Sage: Dieses sanfte Licht begleitet mich in den Frieden. Ich bin geborgen. Ich bin sicher. Die Nacht ist meine Freundin. Dimme alle anderen Lichter.",
        "3. Geist beruhigen\\nNimm den Amethyst und lege ihn auf dein Stirnchakra. Schließe die Augen. Lass alle Gedanken des Tages vorbeiziehen – wie Wolken am Abendhimmel. Sage: Mein Geist wird still. Meine Gedanken kommen zur Ruhe. Frieden breitet sich aus.",
        "4. Emotionaler Frieden\\nNimm den Mondstein und lege ihn auf dein Herz. Sage: Mein Herz ist ruhig. Alle Emotionen des Tages dürfen sich legen wie Wellen auf einem See. Ich bin in Frieden mit mir und der Welt. Atme langsam und tief.",
        "5. In Frieden schlafen\\nHalte beide Steine kurz ans Herz. Sage deine Affirmation leise und sanft. Lösche die Weiße Kerze mit Dankbarkeit. Lege den Amethyst unter dein Kopfkissen und den Mondstein auf dein Nachttischchen. Schlafe in Frieden.",
    ],
},

"nov-4": {  # Neumond-Ritual der Stille | Intuition-Set
    "intro": "Der Neumond im November bringt die tiefste Stille des Jahres. Die Natur schweigt, die Nächte sind lang und dunkel. Nutze diese Stille für eine tiefe Meditation und Verbindung mit deiner Intuition. Dein Amethyst und Mondstein führen dich in die Stille, die Myrrhe vertieft die Meditation und die Weiße Kerze ist dein einziges Licht in der November-Dunkelheit.",
    "bullets": [
        "Amethyst – führt dich in die tiefste Stille und Meditation",
        "Mondstein – verbindet dich mit der stillen Kraft des November-Neumonds",
        "Myrrhe – vertieft deine Meditation in der dunkelsten Nacht",
        "Weiße Kerze – dein einziges Licht in der tiefen November-Stille",
    ],
    "schritte": [
        "1. Stille betreten\\nEntzünde die Myrrhe und schalte ALLES aus – Handy, Lichter, Geräte. Sage: Ich betrete die Stille. Der November-Neumond bringt die tiefste Dunkelheit und die tiefste Stille. Ich bin bereit, in ihr zu versinken.",
        "2. Einziges Licht\\nZünde die Weiße Kerze an. Sie ist dein einziges Licht. Sage: In der tiefsten Stille finde ich meine lauteste Wahrheit. Dieses Licht hält den Raum für mich. Schaue in die Flamme und werde still.",
        "3. Tiefe Meditation\\nNimm den Amethyst und lege ihn auf dein Stirnchakra. Schließe die Augen. Versuche 10 Minuten lang an NICHTS zu denken. Wenn Gedanken kommen, lass sie vorbeiziehen. Der Amethyst hilft dir, in die Stille jenseits der Gedanken zu sinken.",
        "4. Stille Weisheit\\nNimm den Mondstein in beide Hände und halte ihn ans Herz. In der Stille spricht deine tiefste Weisheit. Lausche. Was sagt sie dir? Vielleicht nur ein Wort, ein Gefühl, eine Gewissheit. Vertraue dem, was kommt.",
        "5. Aus der Stille zurückkehren\\nHalte beide Steine ans Herz. Sage deine Affirmation flüsternd. Öffne langsam die Augen. Die Stille bleibt in dir – auch wenn du in den Alltag zurückkehrst. Lösche die Weiße Kerze mit Dankbarkeit.",
    ],
},

"nov-5": {  # Wärme-Ritual für kalte Tage | Selbstliebe-Set
    "intro": "Die kalten Novembertage können an der Seele nagen. Dieses Wärme-Ritual schenkt dir innere Geborgenheit und erinnert dich daran, dass du es wert bist, dich selbst zu wärmen und zu umsorgen. Dein Rosenquarz und Mondstein hüllen dich in Liebe, die Myrrhe wärmt dein Herz und die Rosa Kerze schenkt dir die Geborgenheit, die du brauchst.",
    "bullets": [
        "Rosenquarz – wärmt dein Herz mit bedingungsloser Selbstliebe",
        "Mondstein – schenkt dir emotionale Geborgenheit in der kalten Zeit",
        "Myrrhe – ihr warmer Duft umhüllt dich wie eine liebevolle Umarmung",
        "Rosa Kerze – schenkt dir die Wärme und Geborgenheit der Selbstliebe",
    ],
    "schritte": [
        "1. Wärme schaffen\\nEntzünde die Myrrhe und mache es dir gemütlich. Sage: Ich schenke mir Wärme. Auch wenn es draußen kalt und dunkel ist – in mir brennt ein warmes Licht. Ich umsorge mich selbst. Atme den warmen Myrrhe-Duft ein.",
        "2. Geborgenheitslicht\\nZünde die Rosa Kerze an. Sage: Diese Flamme wärmt mein Herz. Ich bin geborgen in meiner eigenen Liebe. Ich brauche niemanden, der mich wärmt – ich kann das selbst. Spüre die sanfte Wärme der Flamme.",
        "3. Herz wärmen\\nNimm den Rosenquarz und halte ihn zwischen deinen Händen, bis er warm wird. Dann lege ihn auf dein Herz. Sage: Ich wärme mein Herz mit Liebe. Ich bin genug. Ich bin wertvoll. Ich verdiene Wärme und Geborgenheit. Spüre die Wärme des Steins.",
        "4. Emotionale Geborgenheit\\nNimm den Mondstein und halte ihn an deine Wange – wie eine zärtliche Berührung. Sage: Ich bin für mich da. In guten und in schweren Zeiten. Ich halte mich selbst. Spüre die sanfte, tröstende Energie des Mondsteins.",
        "5. Gewärmt und geliebt\\nHalte beide Steine ans Herz. Sage deine Affirmation mit Wärme und Zärtlichkeit. Du bist gewärmt, geliebt und geborgen – von dir selbst. Lasse die Rosa Kerze sicher abbrennen als dein Wärmelicht.",
    ],
},

# ─── DEZEMBER ─────────────────────────────────────────────────

"dez-1": {  # Yule – Wintersonnenwende | Neuanfang-Set
    "intro": "Yule am 21. Dezember ist die Wintersonnenwende – die längste Nacht des Jahres und zugleich die Wiedergeburt des Lichts. Ab morgen werden die Tage wieder länger. Dein Bergkristall und Citrin begrüßen das wiedergeborene Licht, der Weiße Salbei reinigt für den kosmischen Neubeginn und die Gelbe Kerze symbolisiert die Rückkehr der Sonne.",
    "bullets": [
        "Bergkristall – spiegelt das wiedergeborene Licht der Wintersonnenwende",
        "Citrin – trägt die Verheißung der zurückkehrenden Sonne in sich",
        "Weißer Salbei – reinigt für den kosmischen Neubeginn an Yule",
        "Gelbe Kerze – symbolisiert die Wiedergeburt des Lichts in der dunkelsten Nacht",
    ],
    "schritte": [
        "1. Yule-Reinigung\\nEntzünde den Weißen Salbei in der längsten Nacht. Sage: Ich reinige meinen Raum für die Wiedergeburt des Lichts. Die dunkelste Nacht ist vorbei. Ab morgen kehrt das Licht zurück. Ich begrüße Yule mit offenem Herzen.",
        "2. Wiedergeburt des Lichts\\nZünde die Gelbe Kerze an – am besten um Mitternacht. Sage: In der dunkelsten Nacht entzünde ich das neue Licht. Die Sonne wird wiedergeboren. Das Licht kehrt zurück. Ich kehre zurück zu mir selbst.",
        "3. Klarheit für das neue Licht\\nNimm den Bergkristall und halte ihn ins Kerzenlicht. Sage: Wie der Bergkristall das Licht bricht und verstärkt, so verstärke auch ich das neue Licht in mir. Klarheit, Reinheit und Neubeginn fließen durch mich.",
        "4. Sonnenverheißung\\nNimm den Citrin und halte ihn an dein Solarplexus-Chakra. Sage: Die Sonne kehrt zurück – in der Welt und in mir. Ich trage die Verheißung von Wärme, Freude und neuem Wachstum in mir. Spüre die sonnige Citrin-Energie.",
        "5. Yule-Segen\\nHalte beide Steine ans Herz. Sage deine Affirmation dreimal in die Yule-Nacht. Das Licht ist wiedergeboren. Du bist wiedergeboren. Lasse die Gelbe Kerze sicher abbrennen als Yule-Licht.",
    ],
},

"dez-2": {  # Super-Vollmond Jahresabschluss | Transformation-Set
    "intro": "Der letzte Vollmond des Jahres ist ein Super-Vollmond – größer und heller als gewöhnlich. Er leuchtet über dem vergangenen Jahr und lädt dich ein, es mit Dankbarkeit und Transformation abzuschließen. Dein Labradorit und Amethyst begleiten dich durch diesen kraftvollen Jahresabschluss, Palo Santo reinigt das alte Jahr und die Violette Kerze transformiert alles, was war.",
    "bullets": [
        "Labradorit – hilft dir, das vergangene Jahr mit magischen Augen zu sehen",
        "Amethyst – transformiert die Erfahrungen des Jahres in Weisheit",
        "Palo Santo – reinigt und verabschiedet das alte Jahr",
        "Violette Kerze – transformiert alles, was war, in Dankbarkeit und Weisheit",
    ],
    "schritte": [
        "1. Altes Jahr verabschieden\\nEntzünde den Palo Santo und sage: Ich verabschiede dieses Jahr mit Dankbarkeit. Alles, was war – das Schöne und das Schwere – hat mich zu dem gemacht, was ich heute bin. Danke. Lasse den Rauch das alte Jahr sanft auflösen.",
        "2. Super-Vollmond-Licht\\nZünde die Violette Kerze an. Sage: Der letzte Super-Vollmond des Jahres leuchtet über meiner Transformation. Ich bin nicht mehr dieselbe wie am Anfang dieses Jahres. Ich bin gewachsen, gereift und stärker geworden.",
        "3. Jahresrückblick\\nNimm den Labradorit in beide Hände. Schließe die Augen und lass das Jahr Revue passieren – Monat für Monat. Sage zu jedem Monat: Danke für die Lektion. Der Labradorit hilft dir, auch in schweren Momenten die Magie zu erkennen.",
        "4. Weisheit ernten\\nNimm den Amethyst und halte ihn an dein Kronenchakra. Sage: Ich ernte die Weisheit dieses Jahres. Was habe ich gelernt? Wie bin ich gewachsen? Der Amethyst verwandelt jede Erfahrung in kostbare Weisheit.",
        "5. Jahresabschluss\\nHalte beide Steine ans Herz. Sage deine Affirmation. Danke dem Jahr. Danke dir selbst. Lasse die Violette Kerze sicher abbrennen als letztes Licht des alten Jahres.",
    ],
},

"dez-3": {  # Neumond-Neujahrsvorbereitung | Neuanfang-Set
    "intro": "Der letzte Neumond des Jahres fällt kurz vor Silvester – das perfekte Timing, um dich auf das neue Jahr vorzubereiten. In der Dunkelheit des Neumonds setzt du die Samen für das kommende Jahr. Dein Bergkristall und Citrin laden deine Neujahrsvorsätze mit Klarheit und Freude auf, der Weiße Salbei reinigt und die Gelbe Kerze erhellt den Weg ins neue Jahr.",
    "bullets": [
        "Bergkristall – bringt kristallklare Klarheit für deine Neujahrsvorsätze",
        "Citrin – lädt deine Vorsätze mit Optimismus und Vorfreude auf",
        "Weißer Salbei – reinigt alles Alte, damit du frisch ins neue Jahr startest",
        "Gelbe Kerze – erhellt den Weg ins neue Jahr wie ein Leuchtturm",
    ],
    "schritte": [
        "1. Altes loslassen\\nEntzünde den Weißen Salbei und reinige deinen Raum besonders gründlich. Sage: Ich lasse das alte Jahr los. Alles, was nicht mit ins neue Jahr kommen soll, darf jetzt gehen. Ich mache Raum für Neues.",
        "2. Neujahrslicht\\nZünde die Gelbe Kerze an. Sage: Dieses Licht leuchtet mir den Weg ins neue Jahr. Es ist voller Möglichkeiten, voller Freude und voller Wunder. Ich bin bereit.",
        "3. Vorsätze klären\\nNimm den Bergkristall in beide Hände. Schließe die Augen. Frage: Was ist mein wichtigstes Ziel für das neue Jahr? Nicht zehn Ziele – eines. Das wichtigste. Der Bergkristall bringt Klarheit. Formuliere es klar und positiv.",
        "4. Vorfreude aktivieren\\nNimm den Citrin und halte ihn an dein Solarplexus-Chakra. Sage dein Ziel dreimal laut – mit Freude und Überzeugung. Der Citrin lädt es mit sonniger Energie auf. Spüre die Vorfreude auf das neue Jahr.",
        "5. Neujahr vorbereiten\\nHalte beide Steine ans Herz. Sage deine Affirmation. Du bist vorbereitet. Das neue Jahr kann kommen. Lasse die Gelbe Kerze sicher abbrennen als Leuchtturm für das kommende Jahr.",
    ],
},

"dez-4": {  # Salzbad zur Jahresreinigung | Schutz-Set
    "intro": "Zum Jahresende ist eine tiefe energetische Reinigung besonders wichtig. Dieses Schutzritual reinigt dein gesamtes Energiefeld von den Eindrücken des vergangenen Jahres. Dein Schwarzer Turmalin und Bergkristall arbeiten zusammen, um dich komplett zu reinigen und zu schützen, der Weiße Salbei klärt den Raum und die Schwarze Kerze absorbiert die letzte Schwere des alten Jahres.",
    "bullets": [
        "Schwarzer Turmalin – absorbiert alle schweren Energien des vergangenen Jahres",
        "Bergkristall – füllt dein gereinigtes Energiefeld mit strahlendem Neujahrslicht",
        "Weißer Salbei – die große Jahresreinigung für deinen Raum und deine Aura",
        "Schwarze Kerze – absorbiert die letzte Schwere des alten Jahres",
    ],
    "schritte": [
        "1. Große Jahresreinigung\\nEntzünde den Weißen Salbei und reinige jeden Raum deiner Wohnung – besonders gründlich. Sage: Ich reinige mein Zuhause von allen Energien des vergangenen Jahres. Alles Schwere, alle Sorgen, aller Stress – der Salbei nimmt euch mit.",
        "2. Letzte Flamme des Jahres\\nZünde die Schwarze Kerze an. Sage: Dies ist die letzte Schutzflamme des alten Jahres. Sie absorbiert alles, was ich nicht mit ins neue Jahr nehmen möchte. Alles Negative wird jetzt verbrannt.",
        "3. Aura-Tiefenreinigung\\nNimm den Schwarzen Turmalin und führe ihn langsam und gründlich um deinen gesamten Körper – von Kopf bis Fuß, vorne und hinten. Sage: Ein ganzes Jahr an Eindrücken, Emotionen und fremden Energien – ich reinige alles. Meine Aura wird kristallklar.",
        "4. Neujahrslicht empfangen\\nNimm den Bergkristall und halte ihn über deinen Kopf. Visualisiere strahlendes weißes Licht, das von oben durch den Kristall in dich hineinfließt und jede Zelle mit frischer Energie füllt. Sage: Ich bin gereinigt. Ich bin bereit für das neue Jahr. Mein Licht strahlt heller als je zuvor.",
        "5. Jahresabschluss-Schutz\\nHalte beide Steine ans Herz. Sage deine Affirmation dreimal. Lege den Schwarzen Turmalin an deinen Hauseingang und den Bergkristall ans Fenster. Lasse die Schwarze Kerze sicher abbrennen. Du gehst gereinigt und geschützt ins neue Jahr.",
    ],
},

}

# ═══════════════════════════════════════════════════════════════
# SKRIPT: Rituale in der Datei ersetzen
# ═══════════════════════════════════════════════════════════════

with open('data/rituale-kalender.ts', 'r') as f:
    content = f.read()

import re

replaced = 0
for ritual_id, data in RITUALE.items():
    # Build the replacement abschnitte array
    bullets = data["bullets"]
    schritte = data["schritte"]
    intro = data["intro"]
    
    # Build new abschnitte string
    new_abschnitte = f'''abschnitte: [
      {{
        typ: "intro",
        text: "{intro}",
      }},
      {{
        typ: "bullets",
        text: "Was du brauchst:",
        items: [
          "{bullets[0]}",
          "{bullets[1]}",
          "{bullets[2]}",
          "{bullets[3]}",
        ],
      }},
      {{
        typ: "schritte",
        text: "So geht das Ritual:",
        items: [
          "{schritte[0]}",
          "{schritte[1]}",
          "{schritte[2]}",
          "{schritte[3]}",
          "{schritte[4]}",
        ],
      }},
    ]'''
    
    # Find and replace the abschnitte for this ritual
    # Pattern: find the ritual by id, then replace its abschnitte
    pattern = rf'(id: "{ritual_id}".*?)abschnitte: \[.*?\](\s*,?\s*\}})'
    
    def replacer(match):
        return match.group(1) + new_abschnitte + match.group(2)
    
    new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)
    if new_content != content:
        replaced += 1
        content = new_content
    else:
        print(f"WARNING: Could not replace ritual {ritual_id}")

with open('data/rituale-kalender.ts', 'w') as f:
    f.write(content)

print(f"Replaced {replaced} of {len(RITUALE)} rituals")
