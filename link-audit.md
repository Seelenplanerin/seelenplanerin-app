# Link-Audit: Alle URLs in der App

## Tentary-Links (Produkte)
| Code | Produkt | Verwendet in |
|------|---------|-------------|
| OX0aPw | Ritual-Set 1 | shop.tsx, shop/index.tsx, rituale-kalender.ts |
| QtLnrA | Ritual-Set 2 | shop.tsx, shop/index.tsx, rituale-kalender.ts |
| QjvV1I | Ritual-Set 3 | shop.tsx, shop/index.tsx, rituale-kalender.ts |
| sGn2aD | Ritual-Set 4 | shop.tsx, shop/index.tsx, rituale-kalender.ts |
| BQ7sqg | Ritual-Set 5 | shop.tsx, shop/index.tsx, rituale-kalender.ts |
| tfehqK | Ritual-Set 6 | shop.tsx, shop/index.tsx, rituale-kalender.ts |
| QFEH0i | Ritual-Set 7 | shop.tsx, shop/index.tsx, rituale-kalender.ts |
| VN9WOT | Ritual-Set 8 | shop.tsx, shop/index.tsx, rituale-kalender.ts |
| gFloc9 | Ritual-Set 9 | shop.tsx, shop/index.tsx, rituale-kalender.ts |
| f9A55Q | Ritual-Set 10 | shop.tsx, shop/index.tsx, rituale-kalender.ts |
| qnl3vN | Themen-Armband / Runen-Charms | shop.tsx, shop/index.tsx, runen.tsx, runen-quiz.tsx, runen-sets.ts (40x!) |
| gGmtFy | Mariposa Schutzarmband | shop.tsx, shop/index.tsx, rituale.tsx |
| YQLsh3 | Meditationskerze | shop.tsx, shop/index.tsx, kerzen-quiz.tsx |
| E6FP1U | Seelenimpuls-Abo | shop.tsx, shop/index.tsx, lara.tsx, ich.tsx, community.tsx, seelenimpuls.tsx, rituale.tsx |
| TuOzYS | Aura Reading | shop.tsx, shop/index.tsx, aura.tsx, community.tsx, buchen/index.tsx |
| Ciz1am | Deep Talk / Coaching | shop.tsx, shop/index.tsx, community.tsx, buchen/index.tsx |

## Calendly-Links
| URL | Verwendet in |
|-----|-------------|
| calendly.com/hallo-seelenplanerin/30min | community.tsx, ich.tsx, buchen/index.tsx |

## Instagram
| URL | Verwendet in |
|-----|-------------|
| instagram.com/die.seelenplanerin/ | index.tsx, lara.tsx, ich.tsx, community.tsx, shop.tsx, shop/index.tsx, buchen/index.tsx |

## Spotify
| URL | Verwendet in |
|-----|-------------|
| open.spotify.com/artist/3iJelwHVMnw2cNtIY3CrFo | musik.tsx |

## Apple Music / YouTube (generisch)
| URL | Verwendet in |
|-----|-------------|
| music.apple.com/ | musik.tsx (generisch, kein spezifischer Link) |
| youtube.com/ | musik.tsx (generisch, kein spezifischer Link) |

## Affiliate
| URL | Verwendet in |
|-----|-------------|
| seelenplanerin-app.onrender.com | affiliate.tsx (Referral-Link-Basis) |

## PROBLEME GEFUNDEN:
1. Alle 40 Runen-Sets haben DENSELBEN Tentary-Link (qnl3vN) – das ist der Themen-Armband-Link, NICHT individuelle Set-Links
2. Die Ritual-Kalender shopUrls verweisen auf die 10 Ritual-Sets – das scheint korrekt
3. Apple Music und YouTube Links in musik.tsx sind generisch (keine spezifischen Künstler-Links)
4. Affiliate baseUrl zeigt auf onrender.com – muss geprüft werden ob das korrekt ist
