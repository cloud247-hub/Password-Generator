# Cloud247 Password Generator

**Versjon 1.0.2** · Statisk frontend · Norsk / English

Passordgenerator med Cloud247-profilen: marineblå header og hero, gule detaljer, Cloud247-skysymbolet, avrundede kort, NO/EN-bryter og lenke til de andre verktøyene. Headeren bruker den originale Cloud247-logoen og samme oppsett som ExpiryGuards offentlige forside. Resten av appen bygger på CAA Record Generator og DomainGuard.

## Oppdatering v1.0.2

Ny hovedoverskrift og beskrivelse på norsk og engelsk:

- **NO:** Sterke passord. Helt enkelt.
  Lag passord, passfraser og PIN-koder på sekunder. Velg lengde og innhold – generer, kopier og bruk.
- **EN:** Strong passwords. Made simple.
  Create passwords, passphrases and PINs in seconds. Choose your settings — generate, copy and go.

Appnavnet **Password Generator** i headeren er beholdt. Header, logo,
generatorfunksjoner og personverninnstillinger er uendret. Overskriften
har to linjer og tilpasset skriftstørrelse på mobil.

Oppdatering fra v1.0.1: erstatt `index.html`, `i18n.js`, `styles.css`,
`app.js` og `crypto-core.js` i roten av nettstedet. Behold alle andre
frontend-filer og eventuell egen `CNAME`. Versjonsnummer og ressurslenker
bruker nå v1.0.2. Ingen ny installasjon, backend- eller DNS-endring kreves.

## Oppdatering v1.0.1

Headeren er tilpasset ExpiryGuards offentlige forside: original SVG-logo,
samme logostørrelse og luft, NO/EN før appnavnet til høyre og sentrert
logo på mobil. Kilde: `cloud247-hub/Expiryguard`, `main`, v5.4.0.
Direktevisningen av expiry.cloud247.no var utilgjengelig i arbeidsmiljøet;
tilpasningen er kontrollert mot GitHub-kilden, ikke et live-skjermbilde.
Passordgenerering og personvernfunksjoner er uendret.

For å oppdatere v1.0.0: erstatt frontend-filene med filene i denne pakken,
og behold eventuell egen `CNAME`. Ingen backend, DNS-endring eller
ny installasjon er nødvendig. Versjonerte ressurslenker er oppdatert til v1.0.1.
Ikke kjør opprettelsesskriptet på nytt for et repo som allerede finnes.

## Status

Appen og denne publiseringspakken er ferdig laget. **Repoet er ikke opprettet, filene er ikke lastet opp, og nettstedet er ikke publisert av assistenten.** GitHub-tilkoblingen i arbeidsmiljøet hadde filtilgang, men ingen funksjon for å opprette repoer. Det medfølgende skriptet utfører dette når du kjører det med din egen GitHub-innlogging.

Planlagt repo: `cloud247-hub/Password-Generator`. Ingen eksisterende Cloud247-repoer er endret.

## Funksjoner

| Funksjon | Innhold |
| --- | --- |
| Passord | 8–128 tegn, standard 20. Store/små bokstaver, tall og symboler kan velges. |
| Tegnkrav | Minst ett tegn fra hver valgt kategori. Tegn som ligner kan utelates. |
| Hurtigvalg | Standard, lett å lese og ekstra langt (32 tegn). |
| Passfraser | 6–12 engelske ord, standard 10. Lokal liste med 512 ord, 9 bit per ord. |
| Passfrasevalg | Bindestrek, punktum eller mellomrom, stor forbokstav og valgfritt tilfeldig tall fra 00 til 99. |
| PIN | 4–12 sifre, standard 6. Innledende nuller og gjentatte sifre beholdes. |
| Massegenerering | 1, 5, 10, 25 eller 50 verdier. Kopier enkeltvis eller alle. |
| Visning | Skjul/vis, automatisk skjuling når fanen skjules, og tømming av resultater. |
| Styrke | Beregnet entropi basert på generatorens faktiske utfallsrom, ikke et anslag på tid til knekking. |
| Språk | Norsk bokmål og engelsk. Språkbytte endrer ikke passordet. |

## Personvern og sikkerhet

Alle verdier genereres med nettleserens `crypto.getRandomValues()`. Ingen passord sendes til en server eller lagres av appen. Den har ingen analyseverktøy, eksterne skript, API-kall, cookies, passordhistorikk eller backend. Bare språkvalget kan lagres i localStorage.

Kopiering legger verdien på operativsystemets utklippstavle. Appen leser ikke utklippstavlen og sletter ikke innholdet derfra automatisk. En kompromittert nettside, nettleser, utvidelse eller enhet kan fortsatt lese verdiene. Se **SECURITY.md** for algoritme, forutsetninger og begrensninger.

## Publiser til et nytt GitHub-repo

Installer Git og GitHub CLI på din egen PC. Pakk ut hele ZIP-filen i en ny mappe som ikke ligger inne i et eksisterende Git-repo. Åpne PowerShell i mappen og kjør:

```powershell
gh auth login --hostname github.com
.\Publish-GitHub.ps1 -EnablePages
```

Velg kontoen `cloud247-hub` ved innlogging. Skriptet kontrollerer at riktig konto er aktiv, oppretter `main`, legger til bare de eksplisitt angitte pakkefilene, oppretter **et offentlig repo**, laster opp filene og sammenligner lokal og ekstern commit. Med `-EnablePages` forsøker det også å aktivere GitHub Pages fra `main` / rotmappen.

Skriptet endrer ikke et eksisterende repo. Ved feil etter at GitHub har opprettet repoet, må status sjekkes før nytt forsøk. Det nekter å gjenbruke en lokal `.git`-mappe. Et privat repo kan velges eksplisitt:

```powershell
.\Publish-GitHub.ps1 -Visibility private
```

GitHub Pages på et privat repo avhenger av GitHub-abonnementet, og selve Pages-nettstedet kan være offentlig. Skriptet er gjennomlest og sjekket mot dokumentasjonen, men er **ikke kjørt mot GitHub** i dette arbeidsmiljøet.

### Alternativ: publiser via GitHub-nettsiden

Opprett et tomt repo med navnet `Password-Generator`. Last opp innholdet i denne mappen slik at `index.html` ligger i roten og `assets` beholder mappestrukturen. Velg deretter **Settings > Pages > Deploy from a branch > main > / (root)**. Kontroller at `.nojekyll` og alle ressursfiler blir med; skriptet tar hånd om skjulte filer automatisk.

Bruk **Enforce HTTPS** når nettstedet er tilgjengelig. Koden avviser generering på usikker HTTP.

### Eget domene

`CNAME.example` inneholder et forslag: `password.cloud247.no`. Filen er med hensikt ikke en aktiv `CNAME`. Velg domene, konfigurer det i GitHub Pages og sett opp DNS før du eventuelt omdøper filen. Ingen DNS-endringer er gjort i denne leveransen.

## Lokal bruk og utvikling

Ingen npm-installering, byggesteg, Worker, database eller API-nøkkel trengs. En moderne nettleser med Web Crypto og BigInt kreves. For lokal utvikling:

```sh
python -m http.server 8000
```

Åpne `http://localhost:8000`. Direkte åpning av `index.html` kan også fungere, men nettleserens regler for lokale filer, CSP og utklippstavle varierer. HTTPS eller localhost er det anbefalte testoppsettet.

## Filer

- `index.html`, `styles.css`: layout, tilgjengelighetsmerking og visuell profil.
- `crypto-core.js`: tilfeldig trekning, validering og beregning av entropi.
- `app.js`, `i18n.js`: grensesnitt, kopiering og språk.
- `assets/`: lokal ordliste, Cloud247-skysymbol og favicon.
- `.nojekyll`: statisk publisering uten Jekyll-behandling.
- `_headers`: ekstra HTTP-headere for verter som støtter formatet. **GitHub Pages bruker ikke denne filen.**
- `Publish-GitHub.ps1`: opprettelse og publisering fra din PC.
- `tests/`, `TESTING.md`: tester og presis oversikt over hva som er kontrollert.

Alle frontend-ressurser har relative stier og versjonsparameter `?v=1.0.2`. Dette gjør pakken egnet både for prosjektstier og eget domene. Ved ny versjon må versjonen oppdateres i ressurslenkene, `crypto-core.js`, `package.json` og sidefoten. Ingen service worker brukes.

## Tester

Node.js 20 eller nyere kreves bare for utviklertestene:

```sh
npm test
node tests/deployment-check.cjs
```

`tests/ui-offline.py` er en valgfri, lokal DOM-test med Python, Playwright og Chromium. Den bruker native Web Crypto, men testdobler for sikker kontekst og utklippstavle. Den gjør ingen navigasjon og tester ikke hosting, nettverkspolicy eller den leverte CSP-en. Se `TESTING.md` før resultater tolkes.

## Dokumentasjon brukt ved implementering

- Web Crypto: https://www.w3.org/TR/webcrypto/
- GitHub CLI, repo creation: https://cli.github.com/manual/gh_repo_create
- GitHub Pages API: https://docs.github.com/en/rest/pages/pages

Ingen lisens for tredjepartsbruk av Cloud247-varemerket er gitt. Se `THIRD_PARTY_NOTICES.md`.
