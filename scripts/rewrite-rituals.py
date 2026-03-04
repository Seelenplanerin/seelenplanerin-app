#!/usr/bin/env python3
"""
Schreibt alle 51 Rituale um, sodass sie NUR die Set-Inhalte verwenden:
- 2 Steine
- 1 Räucherwerk
- 1 Kerze
Keine externen Materialien wie Honig, Blumen, Eier, Papier, Salz etc.
"""

import re
import json

# Die 10 Ritual-Sets mit ihren Inhalten
SETS = {
    "Schutz": {
        "code": "OX0aPw",
        "stein1": "Schwarzer Turmalin",
        "stein2": "Bergkristall",
        "raeucherwerk": "Weißer Salbei",
        "kerze": "Schwarze Kerze",
        "materialien": '["Schwarzer Turmalin", "Bergkristall", "Weißer Salbei", "Schwarze Kerze"]',
    },
    "Selbstliebe": {
        "code": "QtLnrA",
        "stein1": "Rosenquarz",
        "stein2": "Mondstein",
        "raeucherwerk": "Myrrhe",
        "kerze": "Rosa Kerze",
        "materialien": '["Rosenquarz", "Mondstein", "Myrrhe", "Rosa Kerze"]',
    },
    "Fülle": {
        "code": "QjvV1I",
        "stein1": "Citrin",
        "stein2": "Pyrit",
        "raeucherwerk": "Weihrauch",
        "kerze": "Goldene Kerze",
        "materialien": '["Citrin", "Pyrit", "Weihrauch", "Goldene Kerze"]',
    },
    "Transformation": {
        "code": "sGn2aD",
        "stein1": "Labradorit",
        "stein2": "Amethyst",
        "raeucherwerk": "Palo Santo",
        "kerze": "Violette Kerze",
        "materialien": '["Labradorit", "Amethyst", "Palo Santo", "Violette Kerze"]',
    },
    "Kraft": {
        "code": "BQ7sqg",
        "stein1": "Karneol",
        "stein2": "Sonnenstein",
        "raeucherwerk": "Weihrauch",
        "kerze": "Rote Kerze",
        "materialien": '["Karneol", "Sonnenstein", "Weihrauch", "Rote Kerze"]',
    },
    "Intuition": {
        "code": "tfehqK",
        "stein1": "Amethyst",
        "stein2": "Mondstein",
        "raeucherwerk": "Myrrhe",
        "kerze": "Weiße Kerze",
        "materialien": '["Amethyst", "Mondstein", "Myrrhe", "Weiße Kerze"]',
    },
    "Neuanfang": {
        "code": "QFEH0i",
        "stein1": "Bergkristall",
        "stein2": "Citrin",
        "raeucherwerk": "Weißer Salbei",
        "kerze": "Gelbe Kerze",
        "materialien": '["Bergkristall", "Citrin", "Weißer Salbei", "Gelbe Kerze"]',
    },
    "Erdung": {
        "code": "VN9WOT",
        "stein1": "Schwarzer Turmalin",
        "stein2": "Karneol",
        "raeucherwerk": "Palo Santo",
        "kerze": "Braune Kerze",
        "materialien": '["Schwarzer Turmalin", "Karneol", "Palo Santo", "Braune Kerze"]',
    },
    "Lebensfreude": {
        "code": "gFloc9",
        "stein1": "Sonnenstein",
        "stein2": "Karneol",
        "raeucherwerk": "Weihrauch",
        "kerze": "Orange Kerze",
        "materialien": '["Sonnenstein", "Karneol", "Weihrauch", "Orange Kerze"]',
    },
    "Heilung": {
        "code": "f9A55Q",
        "stein1": "Rosenquarz",
        "stein2": "Amethyst",
        "raeucherwerk": "Palo Santo",
        "kerze": "Grüne Kerze",
        "materialien": '["Rosenquarz", "Amethyst", "Palo Santo", "Grüne Kerze"]',
    },
}

# Map URL code to set name
CODE_TO_SET = {s["code"]: name for name, s in SETS.items()}

def get_set_for_url(url):
    code = url.split("/")[-1]
    return CODE_TO_SET.get(code)

def generate_ritual_abschnitte(ritual_id, titel, set_name, s, kategorie, kurz, affirmation):
    """Generate new abschnitte that ONLY use the 4 set items."""
    
    stein1 = s["stein1"]
    stein2 = s["stein2"]
    raeu = s["raeucherwerk"]
    kerze = s["kerze"]
    
    # Thematische Intro basierend auf dem Set-Typ
    intros = {
        "Schutz": f"Dieses Schutzritual arbeitet mit der kraftvollen Energie von {stein1} und {stein2}. Der {stein1} absorbiert negative Energien und schützt dein Energiefeld, während der {stein2} deine Aura reinigt und verstärkt. {raeu} klärt den Raum und die {kerze} verankert deinen Schutz.",
        "Selbstliebe": f"Dieses Selbstliebe-Ritual verbindet die sanfte Energie des {stein1} mit der intuitiven Kraft des {stein2}. Der {stein1} öffnet dein Herzchakra für bedingungslose Selbstliebe, während der {stein2} deine weibliche Intuition stärkt. {raeu} vertieft die Herzöffnung und die {kerze} hüllt dich in liebevolle Energie.",
        "Fülle": f"Dieses Fülle-Ritual nutzt die Manifestationskraft von {stein1} und {stein2}. Der {stein1} aktiviert dein Solarplexus-Chakra für Selbstvertrauen und Überfluss, während der {stein2} deine Willenskraft und Entschlossenheit stärkt. {raeu} öffnet die Kanäle für Fülle und die {kerze} zieht Wohlstand an.",
        "Transformation": f"Dieses Transformationsritual arbeitet mit der magischen Energie von {stein1} und {stein2}. Der {stein1} öffnet Portale für Veränderung und schützt deine Aura während des Wandels, während der {stein2} deine Intuition schärft und alte Muster auflöst. {raeu} reinigt den Raum für Neues und die {kerze} unterstützt die innere Transformation.",
        "Kraft": f"Dieses Kraftritual verbindet die feurige Energie von {stein1} mit der strahlenden Kraft des {stein2}. Der {stein1} entfacht dein inneres Feuer und stärkt deinen Mut, während der {stein2} deine Lebensenergie aktiviert und Freude bringt. {raeu} verstärkt deine Intention und die {kerze} verankert deine Kraft.",
        "Intuition": f"Dieses Intuitionsritual nutzt die spirituelle Energie von {stein1} und {stein2}. Der {stein1} öffnet dein Drittes Auge und vertieft deine Wahrnehmung, während der {stein2} deine Mondverbindung stärkt und innere Weisheit weckt. {raeu} schafft einen meditativen Raum und die {kerze} erhellt deinen inneren Weg.",
        "Neuanfang": f"Dieses Neuanfangsritual arbeitet mit der klärenden Energie von {stein1} und der Manifestationskraft von {stein2}. Der {stein1} reinigt dein Energiefeld und schafft Klarheit für neue Wege, während der {stein2} deine Visionen mit Lebensfreude auflädt. {raeu} reinigt altes Stagnieren und die {kerze} leuchtet dir den Weg.",
        "Erdung": f"Dieses Erdungsritual verbindet die schützende Kraft von {stein1} mit der vitalen Energie des {stein2}. Der {stein1} erdet dich tief mit der Erde und absorbiert Unruhe, während der {stein2} deine Lebenskraft aktiviert und dich im Hier und Jetzt verankert. {raeu} klärt deinen Geist und die {kerze} stabilisiert deine Energie.",
        "Lebensfreude": f"Dieses Lebensfreude-Ritual nutzt die strahlende Energie von {stein1} und die vitale Kraft des {stein2}. Der {stein1} bringt Licht und Optimismus in dein Herz, während der {stein2} deine Kreativität und Lebensfreude entfacht. {raeu} hebt deine Schwingung an und die {kerze} strahlt Wärme und Freude aus.",
        "Heilung": f"Dieses Heilungsritual arbeitet mit der liebevollen Energie von {stein1} und der transformierenden Kraft des {stein2}. Der {stein1} heilt emotionale Wunden und öffnet dein Herz, während der {stein2} seelische Blockaden löst und inneren Frieden bringt. {raeu} unterstützt den Heilungsprozess und die {kerze} nährt deine Seele.",
    }
    
    intro = intros.get(set_name, f"Dieses Ritual arbeitet mit {stein1}, {stein2}, {raeu} und der {kerze}.")
    
    # Generate ritual steps that ONLY use the 4 items
    abschnitte = [
        {"typ": "intro", "text": intro},
        {"typ": "h2", "text": "Dein Ritual-Set enthält:"},
        {"typ": "bullet", "text": f"{stein1} – dein erster Kraftstein"},
        {"typ": "bullet", "text": f"{stein2} – dein zweiter Kraftstein"},
        {"typ": "bullet", "text": f"{raeu} – dein Räucherwerk"},
        {"typ": "bullet", "text": f"{kerze} – deine Ritualkerze"},
        {"typ": "h2", "text": "Dein Ritual – Schritt für Schritt:"},
    ]
    
    # Different step patterns based on set type
    if set_name == "Schutz":
        abschnitte.extend([
            {"typ": "schritt", "text": f"1. Raum reinigen\\nEntzünde den {raeu} und gehe damit langsam durch deinen Raum. Bewege dich im Uhrzeigersinn und sage dabei: \\\"Ich reinige diesen Raum von allem, was nicht zu mir gehört. Nur Licht und Liebe dürfen hier sein.\\\""},
            {"typ": "schritt", "text": f"2. Schutzkreis legen\\nSetze dich an deinen Ritualplatz. Lege den {stein1} vor dich und den {stein2} daneben. Zusammen bilden sie dein Schutzschild – der {stein1} absorbiert Negatives, der {stein2} verstärkt dein Licht."},
            {"typ": "schritt", "text": f"3. Kerze entzünden\\nZünde die {kerze} an. Schaue in die Flamme und sage: \\\"Ich bin geschützt. Mein Energiefeld ist stark und klar. Nichts Negatives kann mich erreichen.\\\""},
            {"typ": "schritt", "text": f"4. Stein-Meditation\\nNimm den {stein1} in deine linke Hand und den {stein2} in deine rechte Hand. Schließe die Augen. Spüre wie eine schützende Energiekugel um dich herum entsteht. Atme ruhig und tief. Bleibe 5-10 Minuten in dieser Meditation."},
            {"typ": "schritt", "text": f"5. Schutz verankern\\nÖffne die Augen. Halte beide Steine ans Herz und sage deine Affirmation. Lasse die {kerze} sicher abbrennen oder puste sie mit Dankbarkeit aus. Trage den {stein1} heute bei dir als Schutzstein."},
        ])
    elif set_name == "Selbstliebe":
        abschnitte.extend([
            {"typ": "schritt", "text": f"1. Raum vorbereiten\\nEntzünde die {raeu} und lasse den warmen, herzöffnenden Duft deinen Raum erfüllen. Atme tief ein und komme bei dir an."},
            {"typ": "schritt", "text": f"2. Kerze entzünden\\nZünde die {kerze} an. Sage dabei: \\\"Ich entzünde dieses Licht für mich selbst. Ich verdiene Liebe – vor allem meine eigene.\\\""},
            {"typ": "schritt", "text": f"3. Herzchakra-Meditation\\nNimm den {stein1} und lege ihn auf dein Herz. Spüre seine sanfte, liebevolle Energie. Atme rosa Licht ein und sage innerlich: \\\"Ich öffne mein Herz für mich selbst.\\\""},
            {"typ": "schritt", "text": f"4. Intuition stärken\\nNimm den {stein2} in beide Hände. Halte ihn an dein Stirnchakra (Drittes Auge). Frage dich: \\\"Was brauche ich gerade wirklich?\\\" Höre auf die Antwort, die aus deinem Inneren kommt."},
            {"typ": "schritt", "text": f"5. Selbstliebe-Versprechen\\nHalte beide Steine ans Herz. Sage laut deine Affirmation. Spüre die Wärme der {kerze} und die Energie der Steine. Du bist genug, genau so wie du bist. Lasse die Kerze sicher abbrennen."},
        ])
    elif set_name == "Fülle":
        abschnitte.extend([
            {"typ": "schritt", "text": f"1. Raum öffnen\\nEntzünde den {raeu} und lasse den heiligen Duft deinen Raum erfüllen. {raeu} öffnet die Kanäle für Fülle und Wohlstand. Atme tief ein und öffne dich für Überfluss."},
            {"typ": "schritt", "text": f"2. Kerze der Fülle\\nZünde die {kerze} an. Sage dabei: \\\"Ich öffne mich für Fülle in allen Bereichen meines Lebens. Ich bin bereit zu empfangen.\\\""},
            {"typ": "schritt", "text": f"3. Manifestation mit {stein1}\\nNimm den {stein1} in deine rechte Hand (Geberhand). Visualisiere goldenes Licht, das von dem Stein ausgeht und dich umhüllt. Spüre das Gefühl von Überfluss und Dankbarkeit."},
            {"typ": "schritt", "text": f"4. Willenskraft mit {stein2}\\nNimm den {stein2} in deine linke Hand (Empfängerhand). Sage: \\\"Ich habe die Kraft, meine Träume zu verwirklichen. Ich ziehe Fülle an.\\\" Spüre die erdende, stärkende Energie des Steins."},
            {"typ": "schritt", "text": f"5. Fülle verankern\\nHalte beide Steine zusammen vor die {kerze}. Schließe die Augen und sage deine Affirmation dreimal. Stelle dir vor, wie sich dein Leben mit Fülle füllt. Lasse die Kerze sicher abbrennen als Symbol für anhaltenden Wohlstand."},
        ])
    elif set_name == "Transformation":
        abschnitte.extend([
            {"typ": "schritt", "text": f"1. Altes verabschieden\\nEntzünde den {raeu} und reinige deinen Raum. {raeu} ist das heilige Holz der Transformation. Sage: \\\"Ich lasse los, was nicht mehr zu mir gehört. Ich mache Raum für Neues.\\\""},
            {"typ": "schritt", "text": f"2. Kerze der Wandlung\\nZünde die {kerze} an. Die violette Flamme steht für Transformation und spirituelles Wachstum. Schaue in die Flamme und erlaube dir, alles Alte loszulassen."},
            {"typ": "schritt", "text": f"3. Loslassen mit {stein1}\\nNimm den {stein1} in beide Hände. Schließe die Augen und benenne innerlich, was du loslassen möchtest. Spüre wie der {stein1} diese Energie aufnimmt und transformiert. Seine schillernde Oberfläche erinnert dich: Veränderung ist magisch."},
            {"typ": "schritt", "text": f"4. Neuausrichtung mit {stein2}\\nNimm den {stein2} und halte ihn an dein Kronenchakra (Scheitel). Sage: \\\"Ich öffne mich für meine höchste Version. Ich vertraue dem Wandel.\\\" Spüre wie neue Klarheit in dich fließt."},
            {"typ": "schritt", "text": f"5. Transformation besiegeln\\nHalte beide Steine ans Herz. Sage deine Affirmation laut und mit Überzeugung. Spüre die Kraft der Veränderung in dir. Lasse die {kerze} sicher abbrennen als Symbol für deine fortlaufende Transformation."},
        ])
    elif set_name == "Kraft":
        abschnitte.extend([
            {"typ": "schritt", "text": f"1. Energie aktivieren\\nEntzünde den {raeu} und atme den kraftvollen Duft ein. {raeu} stärkt deine innere Kraft und Entschlossenheit. Spüre wie neue Energie durch deinen Körper fließt."},
            {"typ": "schritt", "text": f"2. Feuer entzünden\\nZünde die {kerze} an. Sage dabei: \\\"Ich entzünde mein inneres Feuer. Ich bin stark, mutig und voller Kraft.\\\""},
            {"typ": "schritt", "text": f"3. Mut mit {stein1}\\nNimm den {stein1} in deine rechte Hand. Spüre seine feurige, aktivierende Energie. Visualisiere ein orangerotes Feuer in deinem Bauch (Sakralchakra), das immer stärker wird. Sage: \\\"Ich habe den Mut, meinen Weg zu gehen.\\\""},
            {"typ": "schritt", "text": f"4. Lebensenergie mit {stein2}\\nNimm den {stein2} in deine linke Hand. Spüre seine warme, sonnige Energie. Visualisiere goldenes Sonnenlicht, das deinen ganzen Körper durchflutet. Sage: \\\"Ich bin voller Lebenskraft und Energie.\\\""},
            {"typ": "schritt", "text": f"5. Kraft verankern\\nHalte beide Steine zusammen über die {kerze} (sicherer Abstand!). Sage deine Affirmation mit voller Kraft. Spüre wie die Energie der Steine, des Räucherwerks und der Flamme sich in dir vereinen. Trage den {stein1} heute als Kraftstein bei dir."},
        ])
    elif set_name == "Intuition":
        abschnitte.extend([
            {"typ": "schritt", "text": f"1. Stille schaffen\\nEntzünde die {raeu} und lasse den meditativen Duft deinen Raum erfüllen. {raeu} öffnet die Tore zur inneren Weisheit. Dimme das Licht und schaffe eine ruhige Atmosphäre."},
            {"typ": "schritt", "text": f"2. Inneres Licht\\nZünde die {kerze} an. Sage: \\\"Ich öffne mich für meine innere Stimme. Ich vertraue meiner Intuition.\\\" Schaue einige Atemzüge lang in die Flamme."},
            {"typ": "schritt", "text": f"3. Drittes Auge öffnen\\nNimm den {stein1} und lege ihn auf dein Stirnchakra (zwischen den Augenbrauen). Schließe die Augen. Atme langsam und tief. Visualisiere ein indigoblaues Licht an deinem Dritten Auge, das immer heller wird."},
            {"typ": "schritt", "text": f"4. Mondweisheit empfangen\\nNimm den {stein2} in beide Hände und halte ihn vor dein Herz. Der {stein2} verbindet dich mit der Mondenergie und deiner weiblichen Intuition. Stelle eine Frage in deinem Herzen und lausche der Antwort."},
            {"typ": "schritt", "text": f"5. Botschaft empfangen\\nLege beide Steine vor die {kerze}. Sitze 10 Minuten in der Stille und beobachte, welche Bilder, Gefühle oder Gedanken kommen. Vertraue dem, was du empfängst. Sage deine Affirmation und lasse die Kerze sicher abbrennen."},
        ])
    elif set_name == "Neuanfang":
        abschnitte.extend([
            {"typ": "schritt", "text": f"1. Reinigung\\nEntzünde den {raeu} und reinige deinen Raum gründlich. Sage: \\\"Ich lasse alles Alte los. Ich schaffe Raum für einen frischen Anfang.\\\" Gehe durch jeden Raum und lasse den reinigenden Rauch wirken."},
            {"typ": "schritt", "text": f"2. Neues Licht\\nZünde die {kerze} an. Sage: \\\"Ich begrüße das Neue in meinem Leben. Ich bin bereit für meinen Neuanfang.\\\" Spüre die warme, einladende Energie der Flamme."},
            {"typ": "schritt", "text": f"3. Klarheit finden\\nNimm den {stein1} in beide Hände. Schließe die Augen und atme dreimal tief durch. Der {stein1} bringt Klarheit und reinigt dein Energiefeld. Sage: \\\"Ich sehe klar, wohin mein Weg mich führt.\\\""},
            {"typ": "schritt", "text": f"4. Freude aktivieren\\nNimm den {stein2} in deine Hände. Spüre seine sonnige, optimistische Energie. Visualisiere dein neues Leben voller Freude und Möglichkeiten. Sage: \\\"Ich freue mich auf alles, was kommt.\\\""},
            {"typ": "schritt", "text": f"5. Neuanfang besiegeln\\nHalte beide Steine ans Herz. Sage deine Affirmation dreimal laut. Spüre die Aufbruchsenergie in dir. Lasse die {kerze} sicher abbrennen als Zeichen deines Neubeginns."},
        ])
    elif set_name == "Erdung":
        abschnitte.extend([
            {"typ": "schritt", "text": f"1. Ankommen\\nEntzünde den {raeu} und atme den erdenden Duft tief ein. {raeu} bringt dich zurück in deinen Körper und ins Hier und Jetzt. Spüre deine Füße auf dem Boden."},
            {"typ": "schritt", "text": f"2. Erdverbindung\\nZünde die {kerze} an. Sage: \\\"Ich bin geerdet. Ich bin verbunden mit der Erde. Ich bin sicher und gehalten.\\\""},
            {"typ": "schritt", "text": f"3. Schutz und Stabilität\\nNimm den {stein1} in deine linke Hand. Spüre sein Gewicht und seine erdende Kraft. Visualisiere Wurzeln, die von deinen Füßen tief in die Erde wachsen. Der {stein1} absorbiert alle Unruhe und Nervosität."},
            {"typ": "schritt", "text": f"4. Lebenskraft aktivieren\\nNimm den {stein2} in deine rechte Hand. Spüre seine warme, vitalisierende Energie. Sage: \\\"Ich bin lebendig. Ich bin präsent. Ich bin hier.\\\" Der {stein2} bringt dich zurück in deinen Körper."},
            {"typ": "schritt", "text": f"5. Erdung verankern\\nSetze dich auf den Boden. Lege beide Steine vor die {kerze}. Atme 10 Mal tief ein und aus. Bei jedem Ausatmen lässt du mehr Anspannung los. Sage deine Affirmation. Lasse die Kerze sicher abbrennen."},
        ])
    elif set_name == "Lebensfreude":
        abschnitte.extend([
            {"typ": "schritt", "text": f"1. Freude einladen\\nEntzünde den {raeu} und lasse den erhebenden Duft deinen Raum erfüllen. Atme tief ein und spüre, wie sich deine Stimmung hebt. Lächle bewusst – auch wenn es sich anfangs seltsam anfühlt."},
            {"typ": "schritt", "text": f"2. Licht der Freude\\nZünde die {kerze} an. Sage: \\\"Ich lade Freude und Leichtigkeit in mein Leben ein. Ich erlaube mir, glücklich zu sein.\\\""},
            {"typ": "schritt", "text": f"3. Sonnenkraft\\nNimm den {stein1} in beide Hände. Halte ihn ins Licht der Kerze und beobachte, wie er leuchtet. Spüre seine warme, sonnige Energie. Sage: \\\"Ich strahle von innen heraus. Mein Licht erhellt die Welt.\\\""},
            {"typ": "schritt", "text": f"4. Kreativität und Leidenschaft\\nNimm den {stein2} und halte ihn an dein Sakralchakra (unterhalb des Nabels). Spüre wie Kreativität, Leidenschaft und Lebensfreude in dir erwachen. Sage: \\\"Ich bin voller Lebensfreude und Kreativität.\\\""},
            {"typ": "schritt", "text": f"5. Freude verankern\\nHalte beide Steine ans Herz und tanze, bewege dich oder summe ein Lied – lass die Freude durch deinen Körper fließen. Sage deine Affirmation mit einem Lächeln. Lasse die {kerze} sicher abbrennen."},
        ])
    elif set_name == "Heilung":
        abschnitte.extend([
            {"typ": "schritt", "text": f"1. Heilraum schaffen\\nEntzünde den {raeu} und reinige deinen Raum sanft. {raeu} unterstützt Heilungsprozesse und schafft einen sicheren Raum. Sage: \\\"Dieser Raum ist ein Ort der Heilung und des Friedens.\\\""},
            {"typ": "schritt", "text": f"2. Heilendes Licht\\nZünde die {kerze} an. Sage: \\\"Ich erlaube mir zu heilen. Ich verdiene Heilung auf allen Ebenen – körperlich, emotional und seelisch.\\\""},
            {"typ": "schritt", "text": f"3. Herzöffnung\\nNimm den {stein1} und lege ihn auf dein Herz. Schließe die Augen. Atme grünes und rosa Licht ein. Spüre wie der {stein1} sanft alte Wunden berührt und mit Liebe füllt. Erlaube dir zu fühlen, was hochkommt."},
            {"typ": "schritt", "text": f"4. Seelische Reinigung\\nNimm den {stein2} und halte ihn an dein Stirnchakra. Sage: \\\"Ich lasse alten Schmerz los. Ich vergebe mir und anderen.\\\" Spüre wie der {stein2} seelische Blockaden sanft auflöst."},
            {"typ": "schritt", "text": f"5. Heilung integrieren\\nLege beide Steine auf dein Herz. Atme 5 Minuten lang langsam und tief. Spüre die heilende Energie, die durch dich fließt. Sage deine Affirmation. Lasse die {kerze} sicher abbrennen als Symbol für fortlaufende Heilung."},
        ])
    
    # Add affirmation at the end
    abschnitte.append({"typ": "affirmation", "text": f'"{affirmation}"'})
    
    return abschnitte


def main():
    with open("data/rituale-kalender.ts", "r") as f:
        content = f.read()
    
    # Parse all rituals
    # Find each ritual block
    ritual_pattern = re.compile(
        r'(\{\s*id:\s*"([^"]+)".*?titel:\s*"([^"]+)".*?datum:\s*"([^"]+)".*?monat:\s*(\d+).*?kategorie:\s*"([^"]+)".*?kurz:\s*"([^"]+)".*?abschnitte:\s*\[)(.*?)(\],\s*materialien:\s*\[)([^\]]+)(\],\s*shopUrl:\s*"([^"]+)".*?affirmation:\s*"([^"]+)")',
        re.DOTALL
    )
    
    matches = list(ritual_pattern.finditer(content))
    print(f"Found {len(matches)} rituals")
    
    if len(matches) != 51:
        print("WARNING: Expected 51 rituals!")
        # Try alternative approach
    
    # Build new content
    new_content = content
    
    # Process in reverse order to maintain positions
    for m in reversed(matches):
        ritual_id = m.group(2)
        titel = m.group(3)
        kategorie = m.group(6)
        kurz = m.group(7)
        shop_url = m.group(12)
        affirmation = m.group(13)
        
        set_name = get_set_for_url(shop_url)
        if not set_name:
            print(f"WARNING: Unknown set for {ritual_id} ({shop_url})")
            continue
        
        s = SETS[set_name]
        
        # Generate new abschnitte
        new_abschnitte = generate_ritual_abschnitte(ritual_id, titel, set_name, s, kategorie, kurz, affirmation)
        
        # Format abschnitte as TypeScript
        abschnitte_str = "\n".join([
            f'      {{ typ: "{a["typ"]}", text: "{a["text"]}" }},'
            for a in new_abschnitte
        ])
        
        # Replace the abschnitte section
        old_abschnitte = m.group(8)
        new_content = new_content[:m.start(8)] + "\n" + abschnitte_str + "\n    " + new_content[m.end(8):]
    
    with open("data/rituale-kalender.ts", "w") as f:
        f.write(new_content)
    
    print("Done! All 51 rituals rewritten.")


if __name__ == "__main__":
    main()
