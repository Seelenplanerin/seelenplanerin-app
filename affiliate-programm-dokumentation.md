# Affiliate-Programm „Geben & Nehmen" – Vollständige Dokumentation

**App:** Die Seelenplanerin  
**Stand:** 02. März 2026  
**Provisionssatz:** 20 % auf den Netto-Produktpreis (ohne Versandkosten)

---

## 1. Überblick – Was ist das Affiliate-Programm?

Das Affiliate-Programm „Geben & Nehmen" ermöglicht es jeder Nutzerin der Seelenplanerin-App, einen **persönlichen Empfehlungslink** zu erhalten und diesen zu teilen. Kauft jemand über diesen Link ein Produkt oder eine Dienstleistung auf Tentary, erhält die Empfehlerin **20 % Provision** auf den Netto-Produktpreis. Die Provision wird **nicht** auf Versandkosten (4,90 €) berechnet.

Das Programm ist vollständig in die App integriert – von der Anmeldung über das Dashboard bis zur Auszahlung. Es gibt **keinen Mindestbetrag** für Auszahlungen.

---

## 2. Technische Architektur

Das Affiliate-System besteht aus folgenden Komponenten:

| Komponente | Datei | Funktion |
|---|---|---|
| **Nutzer-Screen** | `app/affiliate.tsx` | Anmeldung + Dashboard für Affiliates |
| **Admin-Screen** | `app/admin.tsx` (Tab „Affiliate") | Verkäufe eintragen, Auszahlungen verwalten |
| **Server-Routen** | `server/routers.ts` (Abschnitt `affiliate`) | 10 API-Endpunkte für alle Affiliate-Operationen |
| **Datenbank-Funktionen** | `server/db.ts` | 15 Funktionen für CRUD-Operationen |
| **Datenbank-Schema** | `drizzle/schema.ts` | 4 Tabellen: `affiliateCodes`, `affiliateClicks`, `affiliateSales`, `affiliatePayouts` |
| **E-Mail-Templates** | `server/email.ts` | Willkommens-E-Mail + Verkaufsbenachrichtigung |
| **Referral-Landingpage** | `server/_core/index.ts` (Route `/ref/:code`) | Klick-Tracking + Weiterleitung |
| **Navigation** | `app/_layout.tsx` | Stack.Screen-Registrierung |
| **Einstiegspunkte** | `app/(tabs)/ich.tsx` + `app/(tabs)/index.tsx` | Links zum Affiliate-Bereich |

---

## 3. Der komplette Nutzer-Flow (Schritt für Schritt)

### Schritt 1: Affiliate-Bereich öffnen

Die Nutzerin erreicht den Affiliate-Bereich über zwei Wege:

- **Startseite** → Karte „Geben & Nehmen" → Tippen → navigiert zu `/affiliate`
- **Ich-Tab** → Menüpunkt „Geben & Nehmen" → Tippen → navigiert zu `/affiliate`

### Schritt 2: Anmeldung (Formular-Screen)

Beim ersten Besuch sieht die Nutzerin den **Formular-Screen** mit:

- Einer Erklärung des Programms (20 % Provision, kein Mindestbetrag)
- Einer „So funktioniert's"-Anleitung in 4 Schritten
- Zwei Eingabefelder: **Name** und **E-Mail**
- Button „Meinen Link erstellen"
- Aufklappbare Richtlinien & Bedingungen (8 Punkte)

**Was passiert beim Tippen auf „Meinen Link erstellen":**

1. Validierung: Name und E-Mail müssen ausgefüllt sein, E-Mail muss `@` und `.` enthalten
2. API-Aufruf an `affiliate.getOrCreate` (POST)
3. Der Server prüft, ob für diese E-Mail bereits ein Affiliate-Code existiert
4. Falls ja: bestehende Daten werden zurückgegeben
5. Falls nein: neuer Code wird generiert (Format: `SP-XXXXX`, z.B. `SP-K7N3R`)
6. Der Code wird in der Datenbank gespeichert
7. Eine **Willkommens-E-Mail** wird automatisch versendet (asynchron, nicht blockierend)
8. Die App wechselt zum **Dashboard-Screen**

### Schritt 3: Dashboard (nach Anmeldung)

Das Dashboard zeigt:

**a) Persönlicher Empfehlungslink**
- Vollständiger Link: `https://seelenplanerin-app.onrender.com/ref/SP-XXXXX`
- Button „Link kopieren" (Web: Clipboard API, Mobil: Share-API)
- Button „Teilen" (öffnet System-Share-Sheet)
- Anzeige des Affiliate-Codes

**b) Statistiken**
- **Klicks:** Wie oft wurde der Link angeklickt
- **Verkäufe:** Wie viele Käufe über den Link
- **Verdient:** Gesamte verdiente Provision (in Euro)
- **Ausgezahlt:** Bereits ausgezahlter Betrag
- **Offen:** Noch nicht ausgezahlter Betrag (Verdient minus Ausgezahlt)

**c) Verkaufsliste**
- Jeder Verkauf mit: Produktname, Datum, Provisionsbetrag, Status
- Status kann sein: „Ausstehend", „Bestätigt" oder „Ausgezahlt"

**d) Zahlungsdaten**
- Eingabefeld für PayPal-E-Mail
- Button „Zahlungsdaten speichern"
- Speichert über API-Aufruf `affiliate.updatePaymentInfo`

**e) Fertige Social-Media-Vorlagen**
- **Instagram Story/Post** – mit Hashtags und Link
- **WhatsApp-Nachricht** – persönlicher Ton
- **Facebook-Post** – Community-orientiert
- **Kurze Empfehlung** – universell einsetzbar
- Jede Vorlage hat einen „Kopieren"-Button mit dem persönlichen Link eingebettet

### Schritt 4: Link teilen

Die Nutzerin teilt ihren Link über beliebige Kanäle. Der Link hat das Format:

```
https://seelenplanerin-app.onrender.com/ref/SP-XXXXX
```

### Schritt 5: Jemand klickt den Link

Wenn jemand den Empfehlungslink anklickt, passiert Folgendes:

1. Der Server empfängt die Anfrage an `/ref/:code`
2. Der Affiliate-Code wird aus der URL extrahiert und in Großbuchstaben konvertiert
3. Die IP-Adresse wird gehasht (SHA-256, nur erste 16 Zeichen) für Datenschutz
4. Der User-Agent wird erfasst
5. Ein **Klick** wird in der Tabelle `affiliateClicks` gespeichert
6. Der Zähler `totalClicks` im Affiliate-Datensatz wird um 1 erhöht
7. Der Besucher wird weitergeleitet auf `/?ref=SP-XXXXX`

### Schritt 6: Verkauf wird getätigt (manueller Schritt)

Da die Verkäufe über Tentary laufen und es keine automatische Webhook-Integration gibt, muss die Seelenplanerin (Admin) **jeden Verkauf manuell eintragen**. Dies geschieht im Admin-Bereich.

### Schritt 7: Provision wird berechnet

Die Provisionsberechnung erfolgt automatisch auf dem Server:

```
Provision = Verkaufsbetrag (netto, in Cent) × 0,20
```

**Beispielrechnungen:**

| Produkt | Verkaufspreis | Abzug Versand | Netto-Basis | Provision (20 %) |
|---|---|---|---|---|
| Ritual-Set | 29,90 € | 4,90 € Versand | 25,00 € | 5,00 € |
| Schutzarmband Mariposa | 28,90 € | 4,90 € Versand | 24,00 € | 4,80 € |
| Aura Reading | 77,00 € | kein Versand | 77,00 € | 15,40 € |
| Deep Talk | 111,00 € | kein Versand | 111,00 € | 22,20 € |
| Seelenimpuls | 17,00 € | kein Versand | 17,00 € | 3,40 € |
| Meditationskerze | variabel | variabel | variabel | 20 % |

**Wichtig:** Der Admin gibt beim Eintragen den **Netto-Produktpreis** (ohne Versand) ein. Die 20 % werden automatisch berechnet.

### Schritt 8: Auszahlung

Die Auszahlung erfolgt manuell durch die Seelenplanerin:

1. Admin öffnet den Affiliate-Tab im Admin-Bereich
2. Gibt den Affiliate-Code, den Betrag und die Methode (PayPal) ein
3. Optional: Referenz-Nummer und Notizen
4. Tippt auf „Auszahlung eintragen"
5. Der Betrag wird in der Datenbank als `totalPaid` aktualisiert
6. Die Affiliate-Nutzerin sieht den aktualisierten Stand in ihrem Dashboard

---

## 4. Admin-Funktionen (Detailliert)

Der Admin-Bereich (erreichbar über `app/admin.tsx`, Tab „Affiliate") bietet drei Hauptfunktionen:

### 4.1 Affiliate-Übersicht

- Zeigt alle registrierten Affiliates mit: Name, E-Mail, Code, Klicks, Verkäufe, Verdient, Ausgezahlt, PayPal-E-Mail
- Gesamt-Statistik: Anzahl Affiliates, Gesamt-Klicks, Gesamt-Verkäufe, Gesamt-Provision, Offener Betrag
- Button „Affiliates laden" ruft `affiliate.list` und `affiliate.listAllSales` auf

### 4.2 Verkauf eintragen

Felder:
- **Affiliate auswählen** – horizontale Scroll-Liste aller Affiliates (Tippen wählt aus)
- **Produktname** – Freitext (z.B. „Schutz-Ritual-Set")
- **Betrag in Euro** – Netto-Produktpreis ohne Versand
- **Kundenname** – optional

Ablauf:
1. Admin wählt Affiliate und füllt Felder aus
2. Tippt auf „Verkauf eintragen"
3. API-Aufruf `affiliate.createSale` mit Betrag in Cent
4. Server berechnet automatisch 20 % Provision
5. Aktualisiert `totalSales` und `totalEarnings` im Affiliate-Datensatz
6. Sendet automatisch eine **Verkaufsbenachrichtigungs-E-Mail** an die Affiliate-Nutzerin

### 4.3 Auszahlung eintragen

Felder:
- **Affiliate-Code** – z.B. `SP-K7N3R`
- **Betrag in Euro** – auszuzahlender Betrag
- **Methode** – PayPal (Standard)
- **Referenz** – optional (z.B. PayPal-Transaktions-ID)

Ablauf:
1. Admin füllt Felder aus
2. Tippt auf „Auszahlung eintragen"
3. API-Aufruf `affiliate.createPayout`
4. `totalPaid` wird im Affiliate-Datensatz aktualisiert

### 4.4 Alle Verkäufe einsehen

- Chronologische Liste aller Affiliate-Verkäufe
- Zeigt: Produktname, Verkaufsbetrag, Provision, Affiliate-Name, Affiliate-Code, Kundenname, Datum, Status

---

## 5. E-Mail-System

Das Affiliate-Programm versendet zwei automatische E-Mails:

### 5.1 Willkommens-E-Mail

**Auslöser:** Neue Affiliate-Anmeldung (erstmaliges `getOrCreate`)

**Inhalt:**
- Begrüßung mit Name
- Persönlicher Empfehlungslink
- Affiliate-Code
- 3-Schritte-Anleitung
- Beispiel-Provisionen (Seelenimpuls 3,40 €, Schutzarmband 4,80 €, Aura Reading 15,40 €, Runen-Armband 18,80 €, Deep Talk ab 22,20 €)
- Hinweis auf PayPal-Hinterlegung

### 5.2 Verkaufsbenachrichtigung

**Auslöser:** Admin trägt einen Verkauf ein

**Inhalt:**
- Produktname
- Verkaufsbetrag
- Käufername
- Provisionsbetrag (20 %)
- Affiliate-Code
- Hinweis auf Auszahlung nach Zahlungseingang

---

## 6. Datenbank-Struktur

### 6.1 Tabelle `affiliateCodes`

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | serial | Auto-Increment ID |
| `code` | varchar(20) | Einzigartiger Code (z.B. SP-K7N3R) |
| `email` | varchar(255) | E-Mail der Affiliate-Nutzerin |
| `name` | varchar(255) | Name der Affiliate-Nutzerin |
| `isActive` | integer | 1 = aktiv, 0 = deaktiviert |
| `totalClicks` | integer | Gesamtzahl Klicks (Default: 0) |
| `totalSales` | integer | Gesamtzahl Verkäufe (Default: 0) |
| `totalEarnings` | integer | Gesamte Provision in Cent (Default: 0) |
| `totalPaid` | integer | Bereits ausgezahlt in Cent (Default: 0) |
| `commissionRate` | integer | Provisionssatz (Default: 20) |
| `paypalEmail` | varchar(255) | PayPal-E-Mail für Auszahlung |
| `iban` | varchar(50) | IBAN (optional, für Zukunft) |
| `createdAt` | timestamp | Erstellungsdatum |

### 6.2 Tabelle `affiliateClicks`

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | serial | Auto-Increment ID |
| `affiliateCode` | varchar(20) | Zugehöriger Affiliate-Code |
| `ipHash` | varchar(64) | Gehashte IP-Adresse (Datenschutz) |
| `userAgent` | text | Browser/Gerät-Info |
| `createdAt` | timestamp | Zeitpunkt des Klicks |

### 6.3 Tabelle `affiliateSales`

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | serial | Auto-Increment ID |
| `affiliateCode` | varchar(20) | Zugehöriger Affiliate-Code |
| `productName` | varchar(255) | Name des verkauften Produkts |
| `saleAmount` | integer | Verkaufsbetrag in Cent |
| `commissionRate` | integer | Provisionssatz (20) |
| `commissionAmount` | integer | Provisionsbetrag in Cent |
| `customerEmail` | varchar(255) | E-Mail des Käufers (optional) |
| `customerName` | varchar(255) | Name des Käufers (optional) |
| `notes` | text | Notizen (optional) |
| `status` | varchar(50) | Status: pending / confirmed / paid |
| `createdAt` | timestamp | Zeitpunkt des Verkaufs |

### 6.4 Tabelle `affiliatePayouts`

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | serial | Auto-Increment ID |
| `affiliateCode` | varchar(20) | Zugehöriger Affiliate-Code |
| `amount` | integer | Auszahlungsbetrag in Cent |
| `method` | varchar(50) | Zahlungsmethode (paypal) |
| `reference` | varchar(255) | Referenz/Transaktions-ID |
| `notes` | text | Notizen |
| `createdAt` | timestamp | Zeitpunkt der Auszahlung |

---

## 7. API-Endpunkte

| Endpunkt | Methode | Beschreibung |
|---|---|---|
| `affiliate.getOrCreate` | POST | Affiliate erstellen oder abrufen (per E-Mail) |
| `affiliate.getByCode` | GET | Affiliate-Daten per Code abrufen |
| `affiliate.getByEmail` | GET | Affiliate-Daten per E-Mail abrufen |
| `affiliate.list` | GET | Alle Affiliates laden (Admin) |
| `affiliate.trackClick` | POST | Klick tracken (Code + IP-Hash + User-Agent) |
| `affiliate.getSales` | GET | Verkäufe eines Affiliates abrufen |
| `affiliate.listAllSales` | GET | Alle Verkäufe laden (Admin) |
| `affiliate.createSale` | POST | Verkauf eintragen (Admin) – berechnet automatisch 20 % |
| `affiliate.updateSaleStatus` | POST | Verkaufsstatus ändern (pending/confirmed/paid) |
| `affiliate.createPayout` | POST | Auszahlung eintragen (Admin) |
| `affiliate.getPayouts` | GET | Auszahlungen eines Affiliates |
| `affiliate.listAllPayouts` | GET | Alle Auszahlungen (Admin) |
| `affiliate.updatePaymentInfo` | POST | PayPal-E-Mail/IBAN aktualisieren |

---

## 8. Affiliate-Code-Generierung

Der Code wird wie folgt generiert:

- Präfix: `SP-` (steht für „Seelenplanerin")
- Gefolgt von 5 zufälligen Zeichen aus: `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`
- Verwechslungsanfällige Zeichen (0, O, 1, I) sind **ausgeschlossen**
- Beispiel: `SP-K7N3R`, `SP-WX4TH`, `SP-8BMPV`
- Bei Kollision wird bis zu 10 Mal ein neuer Code generiert

---

## 9. Richtlinien & Bedingungen (in der App sichtbar)

Die folgenden 8 Punkte werden den Affiliates in der App angezeigt:

1. **Provisionshöhe** – 20 % auf Netto-Produktpreis (ohne Versandkosten)
2. **Fälligkeit** – Provision erst nach vollständigem Zahlungseingang; entfällt bei Rückerstattung/Stornierung
3. **Auszahlung** – Kein Mindestbetrag, per PayPal, regelmäßig durch die Seelenplanerin
4. **Zuordnung** – Über den Tracking-Code im persönlichen Link
5. **Faire Nutzung** – Keine Eigenkäufe, kein Spam, keine irreführende Werbung
6. **Transparenz** – Jederzeit einsehbar: Klicks, Verkäufe, Provision, Auszahlungen
7. **Änderungen** – Bedingungen können angepasst werden, Info per E-Mail
8. **Steuerliche Hinweise** – Eigenverantwortung für Versteuerung

---

## 10. Referral-Landingpage

Wenn jemand den Empfehlungslink anklickt, wird er auf die Hauptseite der App weitergeleitet. Der Server-Endpunkt `/ref/:code`:

1. Extrahiert den Code aus der URL
2. Konvertiert ihn in Großbuchstaben
3. Hasht die IP-Adresse (SHA-256, erste 16 Zeichen)
4. Speichert den Klick in der Datenbank
5. Leitet weiter auf `/?ref=SP-XXXXX`

Es gibt auch eine statische HTML-Landingpage unter `dist/affiliate.html`, die als Fallback dient.

---

## 11. Sicherheitsaspekte

| Aspekt | Umsetzung |
|---|---|
| IP-Tracking | IP wird gehasht (SHA-256), nicht im Klartext gespeichert |
| E-Mail-Validierung | Client-seitig (@ und .) + Server-seitig (Zod `z.string().email()`) |
| Code-Einzigartigkeit | Bis zu 10 Generierungsversuche bei Kollision |
| Admin-Zugang | PIN-geschützt (Standard: 1234, änderbar) |
| Beträge | Intern in Cent gespeichert (Integer), keine Fließkomma-Fehler |

---

## 12. Was noch fehlt / Verbesserungspotenzial

| Punkt | Status | Beschreibung |
|---|---|---|
| Automatische Tentary-Webhooks | Nicht vorhanden | Verkäufe müssen manuell eingetragen werden |
| Cookie-basiertes Tracking | Teilweise | `/?ref=CODE` wird übergeben, aber kein persistentes Cookie im Frontend |
| Deaktivierung von Affiliates | DB-Feld vorhanden | `isActive`-Feld existiert, aber kein UI-Button zum Deaktivieren im Admin |
| Verkaufsstatus ändern | API vorhanden | `updateSaleStatus` existiert, aber kein UI-Button im Admin |
| IBAN-Auszahlung | DB-Feld vorhanden | `iban`-Feld existiert, aber nur PayPal wird im UI angeboten |
| Affiliate-E-Mail bei Auszahlung | Nicht vorhanden | Keine automatische E-Mail wenn Auszahlung erfolgt |

---

## 13. Zusammenfassung des Datenflusses

```
Nutzerin öffnet "Geben & Nehmen"
    │
    ▼
Gibt Name + E-Mail ein
    │
    ▼
Server: affiliate.getOrCreate
    ├── Neuer Code generiert (SP-XXXXX)
    ├── In DB gespeichert
    └── Willkommens-E-Mail gesendet
    │
    ▼
Nutzerin erhält Dashboard mit Link
    │
    ▼
Nutzerin teilt Link (WhatsApp, Instagram, etc.)
    │
    ▼
Jemand klickt Link: /ref/SP-XXXXX
    ├── Klick in DB gespeichert (IP gehasht)
    ├── totalClicks +1
    └── Weiterleitung auf /?ref=SP-XXXXX
    │
    ▼
Jemand kauft auf Tentary
    │
    ▼
Admin trägt Verkauf ein (Admin-Tab)
    ├── affiliate.createSale
    ├── Provision = Betrag × 20%
    ├── totalSales +1, totalEarnings + Provision
    └── Verkaufs-E-Mail an Affiliate gesendet
    │
    ▼
Admin zahlt Provision aus (PayPal)
    ├── affiliate.createPayout
    └── totalPaid + Betrag
    │
    ▼
Nutzerin sieht aktualisiertes Dashboard
```

---

*Dokumentation erstellt am 02. März 2026*
