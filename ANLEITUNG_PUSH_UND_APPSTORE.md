# Anleitung: Push-Nachrichten und App Store Veröffentlichung

## Inhaltsverzeichnis

1. [Push-Nachrichten verschicken](#1-push-nachrichten-verschicken)
2. [App im Apple App Store veröffentlichen](#2-app-im-apple-app-store-veröffentlichen)
3. [App im Google Play Store veröffentlichen](#3-app-im-google-play-store-veröffentlichen)

---

## 1. Push-Nachrichten verschicken

Push-Nachrichten sind Benachrichtigungen, die direkt auf dem Handy-Sperrbildschirm deiner Nutzerinnen erscheinen – auch wenn die App geschlossen ist. Die Seelenplanerin-App nutzt **Expo Push Notifications**, die über den Expo Push Service verschickt werden.

### Wie funktioniert es?

Der Ablauf ist folgender:

1. Die Nutzerin öffnet die App und erlaubt Push-Nachrichten
2. Die App erhält einen **Expo Push Token** (eine eindeutige Adresse für das Gerät)
3. Du schickst eine Nachricht an diesen Token über den Expo Push Service
4. Die Nachricht erscheint auf dem Handy der Nutzerin

### Voraussetzungen

Damit Push-Nachrichten funktionieren, brauchst du:

| Voraussetzung | Beschreibung |
|---|---|
| **EAS-Projekt** | Die App muss bei Expo (EAS) registriert sein. Das passiert beim ersten Build automatisch. |
| **Physisches Gerät** | Push-Nachrichten funktionieren **nicht** im Simulator/Emulator – nur auf echten iPhones/Android-Geräten. |
| **Nutzer-Erlaubnis** | Die Nutzerin muss beim ersten App-Start die Push-Benachrichtigungen erlauben. |
| **Build (APK/IPA)** | Push-Nachrichten funktionieren nur in einem echten Build, nicht in der Web-Version oder Expo Go (Android ab SDK 53). |

### Push-Nachrichten verschicken (einfachste Methode)

Die einfachste Methode ist das **Expo Push Notifications Tool** im Browser:

1. Gehe zu **https://expo.dev/notifications**
2. Gib den **Expo Push Token** der Nutzerin ein (z.B. `ExponentPushToken[xxxxxx]`)
3. Schreibe **Titel** und **Nachricht**
4. Klicke auf **Send**

> Die Push Tokens der Nutzerinnen werden in der App gespeichert, sobald sie Push-Nachrichten erlauben. Du kannst einen Admin-Bereich einrichten, der alle Tokens sammelt und anzeigt.

### Push-Nachrichten über die API verschicken (für Fortgeschrittene)

Du kannst auch Push-Nachrichten programmatisch über die Expo Push API verschicken:

```
POST https://exp.host/--/api/v2/push/send
Content-Type: application/json

{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title": "Dein Tagesimpuls ✨",
  "body": "Heute ist ein wundervoller Tag für ein Neumond-Ritual!",
  "sound": "default"
}
```

### Nächste Schritte für Push-Nachrichten

Um Push-Nachrichten in der App vollständig zu aktivieren, sind folgende Schritte nötig:

1. **App bauen** (APK für Android oder IPA für iOS) – siehe Abschnitt 2 und 3
2. **Push-Token sammeln** – Die App registriert sich automatisch beim Expo Push Service
3. **Admin-Bereich erweitern** – Ich kann einen "Push senden"-Bereich im Admin einbauen, wo du Titel + Text eingibst und die Nachricht an alle Nutzerinnen geht

---

## 2. App im Apple App Store veröffentlichen

### Schritt 1: Apple Developer Account erstellen

Du brauchst einen **Apple Developer Account**. Dieser kostet **99 USD pro Jahr** (ca. 92 EUR).

1. Gehe zu **https://developer.apple.com/programs/**
2. Klicke auf **Enroll**
3. Melde dich mit deiner Apple-ID an (oder erstelle eine neue)
4. Wähle **Individual** (als Einzelperson) oder **Organization** (als Unternehmen)
5. Bezahle die Jahresgebühr (99 USD)
6. Warte auf die Freischaltung (kann 24-48 Stunden dauern)

### Schritt 2: EAS (Expo Application Services) einrichten

EAS baut die App für dich in der Cloud – du brauchst keinen Mac dafür.

1. Erstelle einen Account auf **https://expo.dev**
2. Installiere die EAS CLI auf deinem Computer:
   ```
   npm install -g eas-cli
   ```
3. Logge dich ein:
   ```
   eas login
   ```
4. Verknüpfe das Projekt:
   ```
   cd seelenplanerin-app
   eas init
   ```

### Schritt 3: iOS-Build erstellen

```
eas build --platform ios
```

EAS fragt dich nach deinen Apple Developer Credentials. Gib deine Apple-ID und dein Passwort ein. EAS erstellt automatisch alle nötigen Zertifikate und Provisioning Profiles.

Der Build dauert ca. **15-30 Minuten**. Du bekommst eine `.ipa`-Datei.

### Schritt 4: App bei Apple einreichen

1. Gehe zu **https://appstoreconnect.apple.com**
2. Klicke auf **Meine Apps** → **+** → **Neue App**
3. Fülle die Pflichtfelder aus:

| Feld | Was du eingibst |
|---|---|
| **App-Name** | Die Seelenplanerin |
| **Primäre Sprache** | Deutsch |
| **Bundle-ID** | Wird automatisch aus dem Build übernommen |
| **SKU** | z.B. `seelenplanerin-2026` (frei wählbar) |
| **Kategorie** | Lifestyle oder Gesundheit & Fitness |

4. Lade **Screenshots** hoch (mindestens für iPhone 6.7" und 6.1"):
   - Du brauchst mindestens **3 Screenshots** pro Gerätegröße
   - Format: 1290 x 2796 px (iPhone 15 Pro Max) und 1179 x 2556 px (iPhone 15 Pro)

5. Schreibe eine **App-Beschreibung** (max. 4000 Zeichen)
6. Lade das **App-Icon** hoch (1024 x 1024 px, ohne Transparenz)
7. Fülle die **Datenschutzrichtlinie-URL** aus (Pflicht!)
8. Wähle die **Altersfreigabe** (wahrscheinlich 4+)

### Schritt 5: Build hochladen und einreichen

```
eas submit --platform ios
```

EAS lädt den Build automatisch zu Apple hoch. Danach:

1. Gehe zurück zu **App Store Connect**
2. Wähle den hochgeladenen Build aus
3. Klicke auf **Zur Überprüfung einreichen**

### Schritt 6: Apple Review abwarten

Apple prüft jede App manuell. Das dauert in der Regel **24 Stunden bis 7 Tage**. Häufige Ablehnungsgründe:

| Grund | Lösung |
|---|---|
| Fehlende Datenschutzrichtlinie | URL zu deiner Datenschutzseite angeben |
| App stürzt ab | Vor dem Einreichen gründlich testen |
| Irreführende Beschreibung | Beschreibung muss zur App passen |
| Fehlende Login-Daten | Wenn die App einen Login hat, Demo-Zugangsdaten mitgeben |

---

## 3. App im Google Play Store veröffentlichen

### Schritt 1: Google Play Developer Account erstellen

Du brauchst einen **Google Play Developer Account**. Dieser kostet **einmalig 25 USD**.

1. Gehe zu **https://play.google.com/console**
2. Melde dich mit deinem Google-Konto an
3. Bezahle die einmalige Registrierungsgebühr (25 USD)
4. Fülle dein Entwicklerprofil aus

### Schritt 2: Android-Build erstellen

```
eas build --platform android
```

Der Build dauert ca. **10-20 Minuten**. Du bekommst eine `.aab`-Datei (Android App Bundle).

### Schritt 3: App bei Google einreichen

1. Gehe zu **https://play.google.com/console**
2. Klicke auf **App erstellen**
3. Fülle die Pflichtfelder aus:

| Feld | Was du eingibst |
|---|---|
| **App-Name** | Die Seelenplanerin |
| **Standardsprache** | Deutsch |
| **App-Typ** | App (nicht Spiel) |
| **Kostenlos/Kostenpflichtig** | Kostenlos |
| **Kategorie** | Lifestyle |

4. Lade **Screenshots** hoch (mindestens 2, empfohlen 8):
   - Handy: 1080 x 1920 px oder ähnlich
   - Du brauchst auch ein **Feature-Grafik** (1024 x 500 px)

5. Schreibe eine **Kurzbeschreibung** (max. 80 Zeichen) und **Vollständige Beschreibung** (max. 4000 Zeichen)
6. Fülle die **Datenschutzrichtlinie-URL** aus
7. Fülle den **Fragebogen zur Inhaltsfreigabe** aus
8. Lade die `.aab`-Datei unter **Produktion** → **Neues Release** hoch

### Schritt 4: Google Review abwarten

Google prüft die App in der Regel innerhalb von **1-3 Tagen**. Bei der ersten App kann es bis zu **7 Tage** dauern.

---

## Zusammenfassung: Was du brauchst

| Was | Kosten | Einmalig/Jährlich |
|---|---|---|
| Apple Developer Account | 99 USD/Jahr | Jährlich |
| Google Play Developer Account | 25 USD | Einmalig |
| EAS Build (Expo) | Kostenlos (1 Build/Tag) oder ab 15 USD/Monat | Monatlich (optional) |
| Datenschutzrichtlinie | Kostenlos (eigene Webseite) | - |
| Screenshots | Kostenlos (selbst erstellen) | - |

### Empfohlene Reihenfolge

1. Apple Developer Account erstellen (dauert 1-2 Tage)
2. Google Play Developer Account erstellen (sofort aktiv)
3. EAS einrichten und Builds erstellen
4. Screenshots und Beschreibungen vorbereiten
5. Bei beiden Stores einreichen
6. Review abwarten und ggf. nachbessern

---

> **Tipp:** Wenn du möchtest, kann ich die Screenshots für den App Store automatisch generieren und die App-Beschreibungen für dich schreiben. Sag einfach Bescheid!
