# Tentary Preise vs. App-Preise

## Tentary (aktuell):
- Armband: 24 €
- 3 Charms: 33 € (= 11 € pro Charm)
- Gesamt: 57 €
- Versand: 4,90 €

## App (aktuell falsch):
- runen-quiz.tsx Zeile 222: "49,90 € inkl. Versand" → FALSCH
- runen.tsx Zeile 304: "49,90 € inkl. Versand" → FALSCH
- shop/index.tsx: Runen-Armband preis: 0, preisDisplay: "" → MUSS AKTUALISIERT
- shop/index.tsx: Charm einzeln preis: 0, preisDisplay: "" → MUSS 11 € sein
- admin.tsx Zeile 1477-1478: Runen-Armband 94.00, Runen-Charm 24.00 → FALSCH

## Korrekte Preise:
- Armband (Kette allein): 24 €
- Einzelner Charm: 11 €
- 3 Charms: 33 €
- Gesamt (Armband + 3 Charms): 57 €
- Versand: 4,90 €
- Gesamt inkl. Versand: 61,90 €
