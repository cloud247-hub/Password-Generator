# Cloud247 Password Generator

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



Ingen lisens for tredjepartsbruk av Cloud247-varemerket er gitt. Se `THIRD_PARTY_NOTICES.md`.
