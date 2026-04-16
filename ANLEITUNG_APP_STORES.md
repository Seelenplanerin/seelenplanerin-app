# Die Seelenplanerin – Anleitung zur Veröffentlichung in den App Stores

**Stand:** 16. April 2026

Diese Anleitung führt dich Schritt für Schritt durch die Veröffentlichung deiner App „Die Seelenplanerin" im **Google Play Store** und im **Apple App Store**. Die App wurde bereits erfolgreich gebaut – du musst sie nur noch in den Stores hochladen und einreichen.

---

## Übersicht: Was ist bereits erledigt?

| Schritt | Status |
|---------|--------|
| App entwickelt und getestet | ✅ Fertig |
| Web-Version live auf Render | ✅ https://seelenplanerin-app.onrender.com |
| Android APK gebaut (EAS Build) | ✅ Fertig – Download verfügbar |
| iOS IPA gebaut (EAS Build) | ⏳ In der Warteschlange |
| Apple Developer Account (99 €/Jahr) | ✅ Aktiv (Registration ID: ATJZS7FR05) |
| Apple Zertifikate & Provisioning Profile | ✅ Erstellt |
| Apple Push Notifications Key | ✅ Erstellt und zugewiesen |
| Google Play Developer Account (25 $ einmalig) | ❌ Noch nicht erstellt |

---

## Teil 1: Google Play Store (Android)

### Schritt 1: Google Play Developer Account erstellen

1. Öffne https://play.google.com/console in deinem Browser
2. Melde dich mit deinem Google-Konto an (oder erstelle eines)
3. Bezahle die **einmalige Registrierungsgebühr von 25 USD** (ca. 23 €)
4. Fülle deine Entwickler-Informationen aus (Name, Adresse, E-Mail)
5. Warte auf die Bestätigung (dauert meist nur wenige Minuten)

### Schritt 2: Neue App anlegen

1. Klicke in der Google Play Console auf **„App erstellen"**
2. Fülle folgende Felder aus:

| Feld | Wert |
|------|------|
| App-Name | Die Seelenplanerin |
| Standardsprache | Deutsch |
| App oder Spiel | App |
| Kostenlos oder kostenpflichtig | Kostenlos |

3. Akzeptiere die Nutzungsbedingungen und klicke auf **„App erstellen"**

### Schritt 3: Store-Eintrag ausfüllen

Unter **„Store-Eintrag" → „Haupt-Store-Eintrag"** musst du folgende Informationen eintragen:

**Kurzbeschreibung** (max. 80 Zeichen):
> Deine spirituelle Begleiterin – Rituale, Meditationen & Impulse für die Seele.

**Vollständige Beschreibung** (max. 4000 Zeichen):
> Die Seelenplanerin ist deine kostenfreie spirituelle Plattform für Frauen. Entdecke liebevoll gestaltete Rituale, geführte Meditationen, inspirierende Gedichte und tägliche Seelenimpulse. Begleitet von Mondphasen-Informationen und Aura-Energien findest du hier alles, was deine Seele nährt.
>
> Was dich erwartet:
> - Tägliche Seelenimpulse und spirituelle Texte
> - Geführte Meditationen für innere Ruhe
> - Kraftvolle Rituale für Vollmond, Neumond und besondere Anlässe
> - Inspirierende Gedichte und Affirmationen
> - Aktuelle Mondphasen und Aura-Energien
> - Persönliches Seelenjournal
> - Push-Benachrichtigungen für neue Inhalte
>
> Entwickelt mit Liebe von Lara, der Seelenplanerin.

**App-Symbol:** Das App-Icon ist bereits in der App enthalten.

**Screenshots:** Du brauchst mindestens 2 Screenshots. Am einfachsten machst du Screenshots von der App auf deinem Handy.

### Schritt 4: APK hochladen

1. Gehe zu **„Veröffentlichung" → „Produktion"**
2. Klicke auf **„Neuen Release erstellen"**
3. Lade die APK-Datei hoch. Du kannst sie hier herunterladen:
   - **Direkter Download-Link:** https://expo.dev/artifacts/eas/7HPejzjVCFuidRp1rYPWn8.apk
   - Oder auf der EAS-Build-Seite: https://expo.dev/accounts/laramareenwille/projects/seelenplanerin-app/builds/366d6ece-b7d2-4ac5-83e5-196ee8041e59
4. Füge Release-Notizen hinzu: „Erste Version der Seelenplanerin App"
5. Klicke auf **„Release überprüfen"** und dann **„Rollout starten"**

### Schritt 5: Inhaltsbewertung und Datenschutz

Google verlangt noch einige Angaben, bevor die App veröffentlicht wird:

- **Inhaltsbewertung:** Fülle den Fragebogen aus (die App enthält keine anstößigen Inhalte, wähle überall die harmloseste Option)
- **Datenschutzerklärung:** Du brauchst eine URL zu deiner Datenschutzerklärung. Falls du noch keine hast, kannst du eine einfache Seite auf deiner Website erstellen
- **Zielgruppe:** Wähle „18+" oder „Allgemein" – die App richtet sich an Erwachsene

Die Überprüfung durch Google dauert in der Regel **1-3 Werktage**.

---

## Teil 2: Apple App Store (iOS)

### Schritt 1: iOS Build abwarten

Der iOS-Build läuft gerade auf dem EAS-Server. Du kannst den Status hier verfolgen:
- https://expo.dev/accounts/laramareenwille/projects/seelenplanerin-app/builds/ffe78a38-e404-4a7f-868c-078436a88f49

Sobald der Build fertig ist, wird dort eine IPA-Datei zum Download bereitstehen.

### Schritt 2: App Store Connect öffnen

1. Öffne https://appstoreconnect.apple.com
2. Melde dich mit deiner Apple ID an: **laramwille@gmail.com**
3. Klicke auf **„Meine Apps"** → **„+"** → **„Neue App"**

### Schritt 3: Neue App anlegen

| Feld | Wert |
|------|------|
| Plattform | iOS |
| Name | Die Seelenplanerin |
| Primäre Sprache | Deutsch |
| Bundle-ID | space.manus.seelenplanerin.app.t20250225150448 |
| SKU | seelenplanerin-app-2026 |

### Schritt 4: App-Informationen ausfüllen

Unter **„App-Informationen"** trägst du ein:

- **Kategorie:** Lifestyle oder Gesundheit & Fitness
- **Unterkategorie:** (optional)
- **Altersfreigabe:** 4+ (keine anstößigen Inhalte)
- **Datenschutzrichtlinie-URL:** URL zu deiner Datenschutzerklärung

Unter **„Preise und Verfügbarkeit":**
- Preis: **Kostenlos**
- Verfügbarkeit: **Alle Länder**

### Schritt 5: IPA hochladen mit EAS Submit

Sobald der iOS-Build fertig ist, kannst du die App direkt über EAS an den App Store senden. Öffne dafür ein Terminal und führe aus:

```
npx eas-cli submit --platform ios --latest
```

Alternativ kannst du die IPA-Datei auch manuell über **Transporter** (Mac App) hochladen.

### Schritt 6: Screenshots und Beschreibung

In App Store Connect unter **„App Store" → „Version 1.0"**:

- **Screenshots:** Du brauchst Screenshots für iPhone 6.7" (z.B. iPhone 15 Pro Max) und optional für iPad. Mache Screenshots von der App auf deinem iPhone.
- **Beschreibung:** Verwende die gleiche Beschreibung wie für Google Play (siehe oben)
- **Keywords:** Spiritualität, Meditation, Rituale, Mondphasen, Seele, Impulse, Gedichte, Affirmationen
- **Support-URL:** Deine Website oder eine Kontaktseite
- **Marketing-URL:** (optional) Deine Website

### Schritt 7: App zur Überprüfung einreichen

1. Stelle sicher, dass alle Pflichtfelder ausgefüllt sind (App Store Connect zeigt dir fehlende Felder an)
2. Klicke auf **„Zur Überprüfung einreichen"**
3. Apple prüft die App – das dauert in der Regel **1-3 Werktage**
4. Bei Fragen oder Ablehnungen erhältst du eine E-Mail von Apple

---

## Teil 3: Push-Benachrichtigungen testen

Push-Benachrichtigungen funktionieren nur auf echten Geräten (nicht im Browser). So testest du sie:

1. Installiere die App auf deinem Handy (Android: APK installieren, iOS: über TestFlight oder nach App Store Veröffentlichung)
2. Beim ersten Öffnen der App wird um Erlaubnis für Benachrichtigungen gefragt – tippe auf **„Erlauben"**
3. Öffne den Admin-Bereich in der App (oder auf https://seelenplanerin-app.onrender.com)
4. Gehe zum **„Push"**-Tab
5. Wähle eine Vorlage oder schreibe eine eigene Nachricht
6. Tippe auf **„Senden"** – die Benachrichtigung sollte auf allen registrierten Geräten ankommen

---

## Wichtige Links

| Was | Link |
|-----|------|
| EAS Builds (alle Builds) | https://expo.dev/accounts/laramareenwille/projects/seelenplanerin-app/builds |
| Android APK Download | https://expo.dev/artifacts/eas/7HPejzjVCFuidRp1rYPWn8.apk |
| iOS Build (in Arbeit) | https://expo.dev/accounts/laramareenwille/projects/seelenplanerin-app/builds/ffe78a38-e404-4a7f-868c-078436a88f49 |
| Web-App (Render) | https://seelenplanerin-app.onrender.com |
| Google Play Console | https://play.google.com/console |
| App Store Connect | https://appstoreconnect.apple.com |
| Apple Developer Account | https://developer.apple.com/account |

---

## Zusammenfassung der Kosten

| Posten | Kosten | Status |
|--------|--------|--------|
| Apple Developer Program | 99 €/Jahr | ✅ Bezahlt |
| Google Play Developer | 25 $ einmalig | ❌ Noch zu bezahlen |
| EAS Build (Free Plan) | 0 € | ✅ Genutzt |
| Render Hosting | 0 € (Free Tier) | ✅ Aktiv |
| **Gesamt** | **ca. 122 €** | |

---

## Häufige Fragen

**Wie lange dauert die Überprüfung?**
Google Play: 1-3 Werktage. Apple App Store: 1-3 Werktage (manchmal auch schneller).

**Was passiert, wenn Apple die App ablehnt?**
Du bekommst eine E-Mail mit dem Grund. Häufige Gründe sind fehlende Datenschutzerklärung oder fehlende Screenshots. Das lässt sich leicht beheben.

**Kann ich die App später aktualisieren?**
Ja! Für Updates wird einfach ein neuer Build über EAS erstellt und hochgeladen. Die Versionsnummer in der app.config.ts wird dann erhöht.

**Brauche ich einen Mac für den iOS-Upload?**
Nein! Mit `eas submit` kann die IPA direkt vom Terminal aus an Apple gesendet werden. Alternativ gibt es die „Transporter" App auf dem Mac.
