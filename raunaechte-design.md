# Raunächte-Bereich – Design & Architektur

## Übersicht

Der Raunächte-Bereich ist ein Premium-Feature innerhalb der Seelenplanerin-App. Er bietet eine 28-tägige spirituelle Begleitung (10. Dezember – 6. Januar) mit täglichem Content, der im Adventskalender-Prinzip freigeschaltet wird. Zugang nur mit individuellem Zugangscode.

## Screens

### 1. Raunächte-Tab (Lock-Screen)
- Wenn KEIN gültiger Code: Mystisches Hintergrundbild mit Code-Eingabefeld
- Kurzer Beschreibungstext: "Deine persönliche Raunächte-Begleitung"
- Eingabefeld für Zugangscode
- "Code einlösen" Button
- Hinweis: "Noch keinen Code? → Link zu Tentary/Website"

### 2. Raunächte-Übersicht (nach Freischaltung)
- Header: "Deine Raunächte 2026" mit Fortschrittsanzeige
- Grid/Kalender mit 28 Tagen (4 Reihen à 7 Tage)
- Jeder Tag zeigt: Nummer, Datum, Status (gesperrt/offen/abgeschlossen)
- Portaltage mit goldenem Rand markiert
- Aktueller Tag hervorgehoben
- Gesperrte Tage (Zukunft) mit Schloss-Icon, leicht transparent

### 3. Tages-Content-Screen
- ScrollView mit allen Sektionen des Tages
- Header: Tag-Nummer + Datum + Thema
- Sektionen (vertikal scrollbar):
  1. **Tagesimpuls** – Spiritueller Text/Botschaft
  2. **Meditation** – Audio-Player (wie bestehende Meditationen)
  3. **Ritual** – Schritt-für-Schritt Anleitung
  4. **Journal** – Reflexionsfrage + Textfeld zum Schreiben
  5. **Klangwelt** – Audio/Musik-Player
  6. **Rune des Tages** – Rune mit Bedeutung
  7. **Affirmation** – Schöner Text, teilbar
- "Tag abschließen" Button am Ende
- An Portaltagen: Extra-Sektion "Portaltag-Energie" mit Bonus-Content

## Farbschema (Winterlich-Mystisch)

Das Raunächte-Design nutzt ein dunkleres, mystischeres Farbschema als die Haupt-App:

| Token | Farbe | Verwendung |
|-------|-------|-----------|
| rn-bg | #1A1425 | Dunkler Hintergrund (Nacht-Atmosphäre) |
| rn-surface | #2A2035 | Karten/Sektionen |
| rn-primary | #C9A96E | Gold-Akzent (Sterne, aktive Elemente) |
| rn-text | #F5EDE8 | Heller Text |
| rn-muted | #9B8A9E | Sekundärtext |
| rn-border | #3D2F4A | Rahmen |
| rn-accent | #7B5EA7 | Violett-Akzent (Portaltage) |
| rn-locked | #4A3D5A | Gesperrte Tage |

## Datenmodell

### Zugangscodes (Server/DB)
```
raunaechte_codes:
  - id: auto
  - code: VARCHAR(16) UNIQUE (z.B. "SEELE-7X4K-9M2P")
  - deviceId: VARCHAR(255) (Geräte-Bindung, nach erster Nutzung)
  - year: INT (2026, 2027, ...)
  - isActive: BOOLEAN
  - activatedAt: TIMESTAMP
  - createdAt: TIMESTAMP
```

### Fortschritt (Lokal/AsyncStorage)
```
raunaechte_progress_{year}:
  - completedDays: number[] (z.B. [1, 2, 3])
  - journalEntries: { [day: number]: string }
  - lastAccessedDay: number
```

### Content-Struktur (Server oder lokal)
```
raunaechte_content_{year}:
  - days: Array<{
      day: number (1-28)
      date: string (ISO)
      theme: string
      isPortaltag: boolean
      impuls: { title: string, text: string }
      meditation: { title: string, audioUrl: string, duration: number }
      ritual: { title: string, steps: string[], materials: string[] }
      journal: { question: string }
      klang: { title: string, audioUrl: string }
      rune: { name: string, symbol: string, bedeutung: string, affirmation: string }
      affirmation: { text: string }
      portaltag?: { title: string, text: string, energie: string }
    }>
```

## Zugangscode-Flow

1. Nutzerin kauft über Tentary/Website
2. Admin generiert Code im Admin-Panel (oder automatisch via Webhook)
3. Nutzerin gibt Code in der App ein
4. Server prüft: Code gültig? Noch nicht verwendet ODER gleiches Gerät?
5. Bei Erfolg: Code wird an Geräte-ID gebunden, Zugang freigeschaltet
6. AsyncStorage speichert: `raunaechte_access_{year}: { code, verified: true }`

## Adventskalender-Logik

- Start: 10. Dezember (Tag 1)
- Ende: 6. Januar (Tag 28)
- Freischaltung: Basierend auf aktuellem Datum (nicht manuell)
- Vor dem 10. Dez: Countdown-Anzeige
- Nach dem 6. Jan: Alle Tage offen (Nachhol-Modus)
- Tage können nur in Reihenfolge abgeschlossen werden (Tag 3 erst nach Tag 2)

## Admin-Funktionen

Im bestehenden Admin-Panel:
- Zugangscodes generieren (einzeln oder Batch: 10, 50, 100)
- Code-Liste anzeigen (aktiv/verwendet/deaktiviert)
- Content pro Tag bearbeiten (Texte, Audio-URLs)
- Jahr wechseln (2026, 2027, ...)

## Push-Nachrichten

- Täglich um 19:00 Uhr während der Raunächte (10. Dez – 6. Jan)
- Nur an Nutzerinnen mit gültigem Raunächte-Zugang
- Beispiel: "🌙 Deine Raunacht-Begleitung für heute wartet auf dich"
- An Portaltagen: Extra-Push um 7:05 mit Portaltag-Hinweis

## Technische Umsetzung

- Tab: Neuer `raunaechte.tsx` in `app/(tabs)/`
- Sub-Screens: `app/raunaechte-tag.tsx` (Tages-Detail)
- Daten: `lib/raunaechte-data.ts` (Content-Struktur für 2026)
- Store: `lib/raunaechte-store.ts` (AsyncStorage für Fortschritt + Zugang)
- Server: Neue tRPC-Routes für Code-Validierung + Code-Generierung
- DB: Neue Tabelle `raunaechte_codes`
