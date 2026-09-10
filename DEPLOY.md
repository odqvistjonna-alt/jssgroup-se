# Publicera jssgroup.se

Sidan är statisk. Två filer räcker, `public/index.html` och `public/styles.css`. Inget
byggsteg, ingen server och ingen databas. Det som krävs är att filerna ligger någonstans
som svarar på jssgroup.se över HTTPS.

## Så här ser uppsättningen ut, klar 2026-09-10

- Domänen är registrerad hos **Simply.com** och ligger kvar där
- DNS sköts av **Cloudflare**, namnservrarna är `casey.ns.cloudflare.com` och `val.ns.cloudflare.com`
- Mailen går fortfarande till Simply, styrd av MX, SPF, DKIM och DMARC i Cloudflares zon
- Sidan körs som en **Cloudflare Worker** som serverar mappen `public`
- `jssgroup.se` och `www.jssgroup.se` är kopplade som Custom domains till Workern
- Certifikatet är utfärdat av Let's Encrypt och förnyas automatiskt
- Varje `git push` till grenen `main` bygger om och publicerar sidan

Att uppdatera sidan görs alltså med `git push`, inget annat.

### Två saker kvar att göra när du vill

**Tvinga https.** I Cloudflare, under SSL/TLS och Edge Certificates, slå på Always Use HTTPS.
Utan den svarar `http://jssgroup.se` utan att skicka besökaren vidare till den säkra adressen.

**Slå på DNSSEC igen.** Det stängdes av inför flytten. Nu görs det i rätt ordning, vilket
betyder att det inte uppstår något glapp:

1. I Cloudflare, DNS och Settings, välj Enable DNSSEC. Cloudflare börjar signera zonen och
   visar en DS-post.
2. Logga in hos Simply, öppna DNSSEC-sidan för jssgroup.se och lägg in den DS-posten i
   fälten för Nyckel 1.
3. Klart. Signeringen finns på plats innan registret får veta att den ska finnas, vilket är
   motsatsen till ordningen som orsakade avbrottet vid avstängningen.

## Historik, flytten steg för steg

## Val av leverantör

Vercels gratisnivå Hobby är avsedd för icke-kommersiell användning. En hemsida för ett
aktiebolag räknas inte dit. Därför är Vercel inte med nedan. Två gratisalternativ återstår.

**Cloudflare Pages** är gratis även för företag och kopplas till ett GitHub-repo, så varje
push publicerar automatiskt. Det är vägen som beskrivs först.

**Simply.com** är enklast av allt eftersom domänen och mailen redan ligger där. Ingen DNS
behöver ändras. Den vägen står sist.

## Alternativ 1, GitHub och Cloudflare Pages

Ett git-repo finns redan i den här mappen med en första commit. Det som återstår är att
lägga upp det på GitHub och koppla Cloudflare.

### Lägg upp repot på GitHub

1. Gå till https://github.com/new och skapa ett tomt repo som heter `jssgroup-se`. Sätt det
   till privat om du vill. Kryssa inte i README, licens eller gitignore, eftersom filerna
   redan finns lokalt.
2. Kör kommandona nedan i den här mappen. Byt ut `ANVANDARNAMN` mot ditt GitHub-namn.

```
git remote add origin https://github.com/ANVANDARNAMN/jssgroup-se.git
git push -u origin main
```

GitHub frågar efter inloggning. Det enklaste är att installera GitHubs eget verktyg med
`brew install gh` och köra `gh auth login` en gång, då sköts inloggningen automatiskt.

### Koppla Cloudflare

1. Skapa ett konto på https://dash.cloudflare.com om du inte har ett. Inloggning med
   GitHub-kontot fungerar.
2. På startsidan, välj Create app under Ship something new, sedan importera från Git.
3. Godkänn åtkomst till GitHub-kontot och välj repot `jssgroup-se`.
4. Projektnamnet ska vara `jssgroup-se`, samma namn som står i `wrangler.jsonc`.
   Byggkommandot lämnas tomt. Deploy-kommandot är `npx wrangler deploy`.
5. Klicka Deploy. Efter ungefär en minut ligger sidan på en adress som slutar på
   `workers.dev`. Öppna den och kontrollera att allt ser rätt ut.

Konfigurationen ligger i `wrangler.jsonc` och säger att mappen `public` ska publiceras
som statiska filer. Ingen serverkod körs. Filer utanför `public`, som den här texten,
publiceras inte.

### Peka domänen till Cloudflare

En sida som körs som en Worker kan bara få ett eget domännamn om domänen ligger i samma
Cloudflare-konto. Namnservrarna måste alltså flyttas från Simply till Cloudflare. Domänen
är fortfarande registrerad hos Simply och det är bara DNS som byter hem. Mailen fortsätter
att gå till Simply så länge posterna nedan följer med.

Ordningen spelar roll. Lägg in posterna i Cloudflare först, byt namnservrar sist.

1. Öppna DNS-inställningarna hos Simply och skriv av alla poster, eller ta en skärmbild.
   Listan nedan är hämtad utifrån 2026-09-09, men poster som DKIM-nycklar går inte att läsa
   utifrån, så panelen hos Simply är facit.
2. I Cloudflare, välj Add a domain och skriv `jssgroup.se`. Välj gratisplanen, Free.
3. Cloudflare läser av befintliga poster automatiskt. Jämför resultatet mot listan nedan och
   lägg till det som saknas för hand, särskilt allt som rör mail.
4. Först när posterna stämmer, byt namnservrar hos Simply till de två som Cloudflare anger.
   Genomslaget tar oftast under en timme, ibland upp till ett dygn.
5. Öppna Worker-projektet, välj Settings och Domains & Routes, lägg till `jssgroup.se` och
   `www.jssgroup.se` som Custom domain. Certifikatet utfärdas automatiskt.
6. Skicka ett testmail till jonna@jssgroup.se utifrån. Skicka sedan ett från adressen, så
   att du vet att mailen fungerar i båda riktningarna efter flytten.

#### DNS-zonen hos Simply, avläst 2026-09-09

Tio av posterna ska följa med oförändrade. Bara de två markerade med Ändras rör webben.

| Typ | Namn | Värde | Åtgärd |
| --- | --- | --- | --- |
| A | jssgroup.se | `93.191.156.186` | Ändras, pekas om till sidan |
| A | www | `93.191.156.186` | Ändras, pekas om till sidan |
| A | `*` | `93.191.156.186` | Behålls. Wildcard som fångar mail, webmail, smtp, imap, pop, ftp och cpanel |
| MX | jssgroup.se | `10 mx.simply.com` | Behålls. All inkommande mail |
| TXT | jssgroup.se | `v=spf1 include:spf.simply.com -all` | Behålls. SPF |
| CNAME | _dmarc | `dmarc.simply.com` | Behålls. DMARC står på `p=reject` |
| CNAME | simplycom1._domainkey | `dkim1.simply.com` | Behålls. DKIM-nyckel 1 |
| CNAME | simplycom2._domainkey | `dkim2.simply.com` | Behålls. DKIM-nyckel 2 |
| CNAME | autoconfig | `maildiscover.simply.com` | Behålls. Kontoinställning i mailprogram |
| SRV | _autodiscover._tcp | prioritet 10, vikt 10, port 443, mål `maildiscover.simply.com` | Behålls |
| SRV | _caldavs._tcp | prioritet 10, vikt 20, port 443, mål `dav.simply.com` | Behålls. Kalender |
| SRV | _carddavs._tcp | prioritet 10, vikt 20, port 443, mål `dav.simply.com` | Behålls. Kontakter |

Tre saker att vara noggrann med vid flytten:

1. **SRV-posterna.** Cloudflares avläsning tar inte med dem. Lägg in de tre för hand med
   värdena i tabellen ovan. Frågar formuläret efter Service och Protocol var för sig är
   det `_autodiscover` respektive `_tcp` för den första. För de andra två gäller `_caldavs`
   eller `_carddavs` tillsammans med `_tcp`.
2. **Wildcard-posten.** Den ska ligga som DNS only, alltså grått moln, inte orange. Proxade
   wildcards ingår inte i gratisplanen. Mailtrafiken ska ändå inte gå genom Cloudflare.
3. **Allt som rör mail ska vara grått moln.** Cloudflare sätter orange moln som förval på
   det den hittar, även på `_dmarc` och `autoconfig`. Orange moln på wildcard-posten slår ut
   mailklienterna, eftersom proxyn bara hanterar webbtrafik och inte portarna för imap och
   smtp. Orange moln på `_dmarc` gör att DMARC-uppslaget inte hittar någon post.

Cloudflares avläsning hittade sju av tolv poster. Fem fick läggas till för hand, alltså de
två DKIM-nycklarna och de tre SRV-posterna.

Efter det publiceras varje ändring genom att du kör `git push`. Cloudflare bygger om sidan
av sig själv.

## Alternativ 2, Simply.com

Ingen DNS ändras och mailen påverkas inte.

1. Logga in på https://www.simply.com och välj jssgroup.se.
2. Kontrollera att webbhotellet är aktiverat för domänen.
3. Öppna filhanteraren, eller anslut med SFTP med uppgifterna i kontrollpanelen.
4. Ladda upp innehållet i mappen `public`, alltså `index.html` och `styles.css`, till
   webbrotens mapp, oftast `public_html`. Filerna ska ligga direkt i den mappen, inte i
   en undermapp.
5. Aktivera gratis SSL, Let's Encrypt, under SSL i kontrollpanelen.
6. Slå på omdirigering från http till https. Välj sedan en variant, med www eller utan.
7. Öppna https://jssgroup.se och kontrollera att hänglåset visas.

Uppdateringar görs genom att ladda upp filerna på nytt.

## Checklista inför Apples verifiering

- [x] Organisationsnumret ifyllt i sidfoten, 559501-6162.
- [ ] Sidan nåbar på https://jssgroup.se utan certifikatvarning och utan inloggning.
- [ ] Namnet i sidfoten identiskt med det juridiska namnet hos Bolagsverket, JSS Group AB.
- [ ] Mailadressen i ansökan på egen domän, jonna@jssgroup.se.
- [ ] Överväg att lägga till postadress och telefonnummer i sidfoten. Apple frågar ibland
      efter det och det stärker kopplingen mellan bolaget och domänen.

## Typsnitt

Rubrikerna använder Anton och brödtexten Instrument Serif, båda från Google Fonts. Inga
kakor sätts, därför behövs ingen kakbanner. Vill du slippa den externa hämtningen går det
att ladda ner typsnitten, lägga dem i en mapp `fonts` och byta ut `<link>`-taggarna mot en
`@font-face`-deklaration i `styles.css`. Båda har öppen licens, SIL Open Font License.
