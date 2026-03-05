# Status Notes (05.03.2026)

- App läuft lokal, Screenshot zeigt Home-Screen korrekt
- 70 TS-Fehler (wahrscheinlich wegen fehlender node_modules in einem Pfad)
- Metro bundelt erfolgreich trotz TS-Fehler
- affiliate.tsx hat JSX-Syntax-Fehler (fehlender ScrollView closing tag) - muss Login-Step hinzufügen
- Login-Step fehlt in affiliate.tsx (state "login" existiert, aber kein Rendering dafür)
- SMTP-Daten sind gesetzt: smtp.ionos.de / hallo@seelenplanerin.de
- Offene Aufgaben: Login-Passwortschutz für Affiliate-Dashboard, Bestätigungsmail
