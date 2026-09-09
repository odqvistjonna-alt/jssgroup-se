# jssgroup.se

Företagshemsida för JSS Group AB. En sida, statisk, byggd i ren HTML och CSS.
Ingen backend, ingen databas, inget ramverk och ingen spårning.

Sidan finns till för att visa vad bolaget gör och för att verifiera bolaget hos
Apple Developer Program, som kontrollerar att domänen hör till företaget.

## Filer

| Fil | Innehåll |
| --- | --- |
| `public/index.html` | All text och struktur |
| `public/styles.css` | All design |
| `wrangler.jsonc` | Konfiguration för Cloudflare, pekar ut `public` som den mapp som publiceras |
| `DEPLOY.md` | Hur sidan publiceras på jssgroup.se |

Allt som ska ligga öppet på webben ligger i `public`. Dokumentationen ligger utanför
den mappen, så README och DEPLOY publiceras inte tillsammans med sidan.

## Utveckling

Det finns inget byggsteg. Öppna `public/index.html` direkt i webbläsaren, redigera
och ladda om. Vill du hellre köra sidan över http gör du det med Pythons inbyggda
server:

```
python3 -m http.server 4321 --directory public
```

Sidan ligger sedan på http://localhost:4321.

## Design

Bakgrunden är ljusblå `#DCE7F5` och texten mörkblå `#0E2440`. Rubriker sätts i
Anton, en tung kondenserad grotesk. Brödtexten sätts i Instrument Serif kursiv. Båda
typsnitten hämtas från Google Fonts. Meny, knappar och etiketter står i versaler med glest
teckenavstånd. Adresser och länkar är undantagna från versalregeln så att en
mejladress alltid visas med små bokstäver.

Layouten bygger på en tunn ram runt hela sidan och gott om luft. Brytpunkterna
ligger på 860 px och 640 px.

## Bolagsuppgifter

Sidfoten anger bolagets fullständiga juridiska namn, JSS Group AB, tillsammans
med organisationsnumret 559501-6162. Uppgifterna ska stämma med Bolagsverkets
register, eftersom Apple matchar mot det vid organisationsverifieringen.
