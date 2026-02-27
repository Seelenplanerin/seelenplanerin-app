# Diagnose Runde 10

## Mondphasen-Logik
Die moon-phase.ts Logik ist korrekt verifiziert:
- 25.2.2026 -> Erstes Viertel (korrekt, Zunehmender Mond)
- 3.3.2026 -> Vollmond (KORREKT!)
- 17.2.2026 -> Neumond (korrekt)
- 1.2.2026 -> Vollmond (korrekt)

Home-Screen verwendet getCurrentMoonPhase() aus moon-phase.ts - sollte korrekt sein.
Mond-Tab verwendet ebenfalls getCurrentMoonPhase() aus moon-phase.ts.

Problem könnte sein: useMemo cacht den Wert und aktualisiert nicht.
Oder: Die Nutzerin sieht noch die alte gecachte Version im Browser.

## Kerzen-Quiz
kerzen-quiz.tsx existiert und exportiert KerzenQuizScreen.
Route: /kerzen-quiz
Erreichbar über: Ich-Tab -> Meditationskerzen -> "Welche Kerze passt zu mir?"

Problem: Nutzerin findet es nicht. Muss prominenter platziert werden.
