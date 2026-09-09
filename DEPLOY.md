# Publicera jssgroup.se

Sidan är statisk. Två filer räcker, `public/index.html` och `public/styles.css`. Inget
byggsteg, ingen server och ingen databas. Det som krävs är att filerna ligger någonstans
som svarar på jssgroup.se över HTTPS.

## Läget just nu

Domänen är uppslagen 2026-09-09:

- Namnservrar: `ns1.simply.com`, `ns2.simply.com`, `ns3.simply.com`
- A-post för både jssgroup.se och www: `93.191.156.186`, en server hos Simply.com
- MX-post: `mx.simply.com`, alltså ligger mailen för jonna@jssgroup.se hos Simply
- HTTPS: servern svarar med ett certifikat utfärdat för `simply.com`, inte för jssgroup.se

Domänen ligger alltså hos Simply.com och pekar redan mot deras webbhotell, men inget eget
innehåll är publicerat och certifikatet för domänen är inte utfärdat. Det sista är viktigt,
eftersom Apple behöver nå https://jssgroup.se utan certifikatvarning.

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

1. I Pages-projektet, välj Custom domains och lägg till `jssgroup.se` och `www.jssgroup.se`.
2. Cloudflare visar exakt vilka DNS-poster som ska sättas. Kopiera värdena därifrån, gissa
   inte, eftersom de ändras över tid.
3. Logga in på https://www.simply.com, öppna DNS-inställningarna för jssgroup.se och ersätt
   den nuvarande A-posten `93.191.156.186` för `@` och för `www` med det Cloudflare angav.
4. Lämna MX-posten `mx.simply.com` orörd. Lämna även TXT-poster för SPF och DKIM orörda.
   Ändras de slutar mailen till jonna@jssgroup.se att fungera.
5. Vänta tills ändringen slår igenom, oftast inom en timme. Certifikatet utfärdas
   automatiskt av Cloudflare.

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
