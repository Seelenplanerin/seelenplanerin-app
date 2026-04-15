# Deployment Fix Notes

## Problem
- Root URL https://seelenapp-m3pwe7f6.manus.space/ zeigt "Not Found" (404 von Cloudflare)
- Die veröffentlichte Domain proxied NUR /api/* Anfragen zum Express-Server
- Die App funktioniert bereits unter /api/app/ 

## Lösung
- Der Server muss die Web-App unter /api/app/ ausliefern (bereits implementiert)
- Für die Root-URL muss eine Lösung her: entweder Redirect oder die App direkt unter /api/ servieren
