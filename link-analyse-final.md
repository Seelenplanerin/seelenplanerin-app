# Link-Analyse: Wo wird was verlinkt?

## rituale.tsx (Ritual-Detail-Screen)
- Zeile 259: `ritual.shopUrl` → Kommt aus rituale-kalender.ts → **KORREKT** (10 verschiedene Ritual-Set-Links)
- Zeile 266: Hardcoded `gGmtFy` → **Schutzarmband Mariposa** → Das ist der zweite Button "Schutzarmband ansehen"
- Zeile 282: Hardcoded `E6FP1U` → **Seelenimpuls-Abo** → Korrekt

## PROBLEM: Der "Schutzarmband ansehen"-Button (gGmtFy) zeigt bei JEDEM Ritual das Schutzarmband Mariposa.
## Das ist NICHT das Runen-Armband (qnl3vN).
## Aber die Nutzerin sagt "überall Runen-Armband hinterlegt" - vielleicht meint sie etwas anderes?

## Wo ist qnl3vN (Themen-Armband)?
- runen-quiz.tsx: Zeile 225 → Fallback für Runen-Armband bestellen → KORREKT (ist ein Runen-Screen)
- runen.tsx: Zeile 122 → Fallback für Runen-Armband bestellen → KORREKT (ist ein Runen-Screen)
- shop.tsx: Zeile 163, 187 → Produkt-Listing → KORREKT (ist der Shop)
- shop/index.tsx: Zeile 158, 182 → Produkt-Listing → KORREKT (ist der Shop)

## Wo ist gGmtFy (Schutzarmband Mariposa)?
- rituale.tsx: Zeile 266 → Bei JEDEM Ritual als zweiter Button → FRAGWÜRDIG
- shop.tsx: Zeile 176 → Produkt-Listing → KORREKT
- shop/index.tsx: Zeile 171 → Produkt-Listing → KORREKT

## FAZIT:
Das Problem ist wahrscheinlich der hardcoded "Schutzarmband ansehen"-Button in rituale.tsx Zeile 266.
Dieser zeigt bei JEDEM Ritual das Schutzarmband Mariposa - das ergibt keinen Sinn bei z.B. einem Fülle-Ritual.
Stattdessen sollte dort das passende Themen-Armband oder gar kein zweiter Button sein.
