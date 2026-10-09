# Link-Sicherheitsprüfung der App „Die Seelenplanerin“

**Prüfdatum:** 29. September 2026  
**Anlass:** Eine Kundin meldete, sie habe nach Nutzung der App bei „Seelenschmuck“ bestellt. Der vorgelegte Beleg nennt Bestellung **#80165 vom 14. September 2026** und als Verkäufer `shop-seelenschmuck.at`.

## Ergebnis

In der App wurde **kein Link, Redirect, Werbenetzwerk oder eingebetteter Shop zu Seelenschmuck** gefunden. Das gilt für:

- den am 14. September 2026 auf iOS und Android aktiven OTA-Stand,
- den aktuellen App-Quellcode,
- alle im Repository erreichbaren früheren Stände,
- die beiden live ausgelieferten Web-App-Domains,
- die gespeicherte Push-Nachrichtenhistorie,
- alle aktuell hinterlegten Kauf- und Buchungsziele.

Die vorgelegte Rechnung stammt eindeutig von einem anderen Unternehmen:

- **Baumgartner GmbH**
- vertreten durch **Nicole Baumgartner**
- Graschuh 198, 8510 Stainz, Österreich
- Domain `shop-seelenschmuck.at`

Damit gibt es nach dem technisch prüfbaren Stand **keinen Beleg dafür, dass die App diese Bestellung zu Seelenschmuck weitergeleitet oder ausgelöst hat**. Möglich ist beispielsweise, dass nach Verlassen der App in einem Browser weitergesucht oder ein anderer Link geöffnet wurde. Ohne Browserchronik oder den konkreten Klickweg der Kundin lässt sich der externe Ursprung nicht abschließend rekonstruieren.

## Geprüfte Belege

### 1. Stand am Bestelldatum

Am **14. September 2026** war in beiden nativen Apps der Produktionsstand vom **28. August 2026** aktiv:

- iOS Update: 28. August 2026, 10:35 UTC
- Android Update: 28. August 2026, 10:38 UTC
- Git-Stand: `3c92aa3492e003d9f5107fa30d76e43faa6eafaf`

Dieser Stand enthielt keine Zeichenfolge `Seelenschmuck`, `seelenschmuck.at` oder `shop-seelenschmuck.at`. Die damaligen Verkaufslinks führten entweder zu `dieseelenplanerin.de` oder zur eigenen früheren Tentary-Unterseite `dieseelenplanerin.tentary.com`. Keiner der damaligen Tentary-Links leitete bei der Live-Prüfung auf Seelenschmuck um.

### 2. Vollständige Git-Historie

Alle **461 erreichbaren Git-Commits** wurden durchsucht. Ergebnis:

- `shop-seelenschmuck.at`: 0 Treffer
- `seelenschmuck.at`: 0 Treffer
- `Seelenschmuck`: 0 Treffer

### 3. Aktuelle App und Live-Web-App

Die Quelltexte, der aktuelle Webexport und die ausgelieferten Assets von

- `https://www.app.dieseelenplanerin.de`
- `https://seelenapp-6tnxx849.manus.space`

enthalten keinen Seelenschmuck-Link und keine Seelenschmuck-Bezeichnung.

### 4. Kauf- und Buchungslinks

Im aktuellen App-Quellcode wurden **92 kauf- oder buchungsbezogene URL-Felder** automatisch geprüft. Ergebnis:

- eigene Domain oder Unterdomain: 92
- fremde Shopdomain: 0

Alle geprüften aktuellen Produkt- und Kategorieseiten von `dieseelenplanerin.de` antworteten mit HTTP 200 und blieben auf der eigenen Domain. Die bewusst verwendeten Bild-CDNs liefern nur Produktbilder; sie sind keine klickbaren Kaufziele.

### 5. Push-Nachrichten

Die vollständige gespeicherte Push-Historie wurde über beide Produktionsendpunkte geprüft. Sie enthält keinen Link und keinen Text zu Seelenschmuck. Als klickbare URLs wurden ausschließlich diese eigenen Ziele gefunden:

- `https://dieseelenplanerin.de/retreat`
- `https://dieseelenplanerin.de/seelenarbeit/seelenlegung`

### 6. Werbung und eingebettete Fremdshops

Die App enthält:

- kein Werbe-SDK,
- kein Affiliate-Redirect,
- keine Shopify- oder WooCommerce-Anbindung,
- keine WebView mit einem Shop,
- keinen Code, der Nutzerinnen automatisch auf einen fremden Händler umleitet.

Externe Links zu Spotify, Apple Music, YouTube und dem offiziellen Instagram-Profil bleiben als bewusste Medien-/Social-Funktionen bestehen. Sie sind keine Kauf- oder Checkoutziele.

## Sofort umgesetzter Schutz

Zusätzlich zur Prüfung wurde eine technische Domain-Sperre eingebaut:

1. **Shop-, Produkt-, Angebots- und Buchungslinks** werden nur geöffnet, wenn sie per HTTPS auf `dieseelenplanerin.de` oder eine echte Unterdomain zeigen.
2. Täuschende Domains wie `dieseelenplanerin.de.evil.example` werden blockiert.
3. Direkte Calendly-Buchungslinks in den Verkaufsbereichen wurden durch die eigene Kontaktseite `https://dieseelenplanerin.de/kontakt` ersetzt.
4. Links in Push-Nachrichten werden nur noch automatisch geöffnet und anklickbar dargestellt, wenn sie zur eigenen Domain gehören.
5. Ein blockierter Link zeigt einen verständlichen Sicherheitshinweis statt eine fremde Seite zu öffnen.

## Technische Validierung

- TypeScript: bestanden
- Gezielte Sicherheits-, Preis- und Ritualtests: **28 bestanden**
- Vollständige Testsuite mit lokalem API-Server: **201 bestanden, 1 bewusst übersprungen**
- Aktueller Webexport: erfolgreich
- Fremdshop-/Tentary-Prüfung im neuen Webexport: 0 Treffer

## Veröffentlichungsstand

Der Schutz wurde am 29. September 2026 als Produktions-OTA für beide nativen Plattformen veröffentlicht:

- iOS Update-Gruppe: `6061fe41-da6d-4371-9f8d-024193cd1ecd`
- Android Update-Gruppe: `95999a7e-70ae-4ac6-9a83-b709ca991266`
- Runtime-Version: `1.0.20`
- Commit: `4490d871c2020c4148dba880b31c2ad874994649`

Die GitHub-/Render-Synchronisierung des neuen Webexports ist noch offen, weil die bestehende GitHub-Integration Schreibversuche mit HTTP 403 ablehnt. Ein SHA-256-verifiziertes Snapshot-Archiv und ein einmaliger Sync-Workflow wurden dafür vorbereitet. Die technische Ursache der gemeldeten Seelenschmuck-Bestellung wurde unabhängig davon geprüft: Sie ist in keinem untersuchten App-Stand oder Linkpfad vorhanden.
