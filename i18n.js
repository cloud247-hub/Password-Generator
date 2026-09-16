/* Cloud247 UI translations. Only the language preference may be persisted. */
(function (root) {
  'use strict';
  const messages = {
    no: {
      skip: 'G\u00e5 til generatoren', security: 'SIKKERHET',
      heroTitle: 'Sterke passord.', heroTagline: 'Helt enkelt.',
      heroDescription: 'Lag passord, passfraser og PIN-koder p\u00e5 sekunder. Velg lengde og innhold \u2013 generer, kopier og bruk.',
      local: 'Genereres lokalt', noAccount: 'Ingen konto', noLogging: 'Ingen passordlogging',
      customize: 'TILPASS', settingsTitle: 'Dine innstillinger', modeLabel: 'Type hemmelighet',
      password: 'Passord', phrase: 'Passfrase', pin: 'PIN-kode', presets: 'Hurtigvalg',
      presetStandard: 'Standard', presetReadable: 'Lett \u00e5 lese', presetLong: 'Ekstra langt',
      length: 'Passordlengde', characters: 'tegn', characterTypes: 'Inkluder tegn',
      uppercase: 'Store bokstaver', lowercase: 'Sm\u00e5 bokstaver', numbers: 'Tall', symbols: 'Symboler',
      excludeAmbiguous: 'Unng\u00e5 tegn som ligner', ambiguousHelp: 'Utelater I, l, 1, O, 0, o og |.',
      requiredGroups: 'Minst ett tegn fra hver valgt kategori er alltid med.',
      phraseDescription: 'Tilfeldige engelske ord, lettere \u00e5 skrive. Ordlisten ligger i appen, og ordene trekkes uavhengig.',
      wordCount: 'Antall ord', words: 'ord', separator: 'Skilletegn', hyphen: 'Bindestrek (-)', period: 'Punktum (.)', space: 'Mellomrom',
      capitalize: 'Stor forbokstav', capitalizeHelp: 'Endrer lesbarheten, ikke entropien.',
      addNumber: 'Legg til to tilfeldige sifre', addNumberHelp: 'Avslutter frasen med et tall fra 00 til 99.',
      wordlistNote: '{count} engelske ord \u00b7 {bits} bit per ord \u00b7 10 ord som standard. Ikke EFF-/Diceware-ordlisten.',
      pinDescription: 'En tilfeldig tallkode. Innledende nuller beholdes, og sifre kan gjentas.',
      pinDigits: 'Antall sifre', digitUnit: 'sifre', pinWarningTitle: 'En PIN-kode er ikke et sterkt passord',
      pinWarning: 'Bruk bare PIN der tjenesten begrenser antall fors\u00f8k. Velg passord eller passfrase til kontoer.',
      quantity: 'Antall \u00e5 generere', settingsAuto: 'Nye verdier genereres n\u00e5r du endrer innstillingene.',
      result: 'RESULTAT', resultTitle: 'Klart til bruk', localBadge: 'LOKALT',
      yourPassword: 'DITT NYE PASSORD', yourPhrase: 'DIN NYE PASSFRASE', yourPin: 'DIN NYE PIN-KODE',
      hide: 'Skjul', show: 'Vis', empty: 'Ingen verdi generert.', generatedValue: 'Generert verdi',
      webCrypto: 'Tilfeldighet fra Web Crypto', strength: 'Beregnet styrke',
      entropyHelp: 'Beregnet fra de tilfeldige valgene, ikke et l\u00f8fte om tid til knekking.',
      generate: 'Generer nytt', generateMany: 'Generer {count} nye', copy: 'Kopier', copyAll: 'Kopier alle',
      clipboardNote: 'Kopiering legger verdien p\u00e5 utklippstavlen. Appen sletter den ikke automatisk derfra.',
      notSaved: 'Passordene lagres ikke av appen.', clear: 'T\u00f8m resultat', batch: 'FLERE VERDIER',
      batchTitle: 'Alle genererte verdier', batchHelp: 'Listen inkluderer verdien over. Den lagres ikke og erstattes ved ny generering.',
      privacyTitle: 'Hemmelighetene dine blir hos deg.',
      privacyText: 'Ingen passord sendes til Cloud247 eller andre tjenester. Ingen analyseverkt\u00f8y, eksterne skript eller passordhistorikk.',
      goodHabits: 'GODE VANER', infoTitle: 'Et godt passord er bare starten.',
      uniqueTitle: 'Ett passord per konto', uniqueText: 'Lag en ny, unik verdi for hver tjeneste. Ikke gjenbruk passord mellom jobb og privat.',
      managerTitle: 'La en passordbehandler huske', managerText: 'Oppbevar passordene i en passordbehandler, ikke i et regneark eller en e-post.',
      mfaTitle: 'Bruk et ekstra sikkerhetslag', mfaText: 'Aktiver MFA, eller bruk passkeys der tjenesten st\u00f8tter det. Et passord beskytter ikke mot alt.',
      technicalTitle: 'Hvordan fungerer generatoren?',
      technicalText: 'Appen bruker crypto.getRandomValues() og forkaster tall som ville gitt skjev fordeling. Valgte tegnkategorier er garantert representert. Entropien for passord tar hensyn til dette kravet. Passfraser bruker den faktiske st\u00f8rrelsen p\u00e5 den innebygde ordlisten.',
      limitsText: 'Dette er ikke en passordbehandler eller en uavhengig sikkerhetsrevisjon. En kompromittert nettleser, utvidelse, enhet eller nettside kan lese resultatet. Vertstjenesten kan logge vanlige sidebes\u00f8k, men appen sender ikke de genererte verdiene.',
      storageText: 'Bare spr\u00e5kvalget kan lagres lokalt. T\u00f8m-knappen fjerner resultatene fra appen, ikke fra utklippstavlehistorikk eller skjermbilder, og garanterer ikke sikker overskriving av nettleserminne.',
      moreTitle: 'Flere verkt\u00f8y. Mindre friksjon.', moreText: 'Verkt\u00f8y for Microsoft 365, Intune, e-post og domenesikkerhet.', moreButton: 'Se alle verkt\u00f8y',
      limited: 'Begrenset styrke', moderate: 'Moderat styrke', strong: 'Sterkt', veryStrong: 'Sv\u00e6rt sterkt', pinOnly: 'Kun PIN \u2013 ikke kontopassord',
      bits: '{value} bit entropi', lengthValue: '{value} tegn', copied: 'Kopiert til utklippstavlen.',
      copiedAll: '{count} verdier kopiert til utklippstavlen.', generated: 'Ny verdi er klar.', generatedMany: '{count} nye verdier er klare.',
      cleared: 'Resultatene er fjernet fra appen. Utklippstavlen er ikke endret.',
      copyFailed: 'Kunne ikke kopiere. Vis verdien, marker den og kopier manuelt.',
      copyItem: 'Kopier verdi {index}',
      cryptoUnavailable: 'Nettleseren mangler en kryptografisk tilfeldig generator. Bruk en oppdatert nettleser.',
      insecureContext: '\u00c5pne appen over HTTPS, p\u00e5 localhost eller som en lokal fil. Generering er blokkert p\u00e5 usikker HTTP.',
      noCharacters: 'Velg minst \u00e9n tegnkategori for \u00e5 generere et passord.',
      passwordLength: 'Velg et heltall fra 8 til 128 tegn.', phraseLength: 'Velg et heltall fra 6 til 12 ord.', pinLength: 'Velg et heltall fra 4 til 12 sifre.',
      batchCount: 'Velg mellom 1 og 50 verdier.', invalidSeparator: 'Velg bindestrek, punktum eller mellomrom som skilletegn.',
      wordlistUnavailable: 'Ordlisten mangler eller er ugyldig. Last inn appen p\u00e5 nytt.',
      randomFailure: 'Tilfeldighetskilden feilet. Ingen nye verdier er laget.',
      invalidMode: 'Ugyldig modus. Last inn appen p\u00e5 nytt.', invalidRange: 'Ugyldig tallomr\u00e5de.',
      unexpected: 'Genereringen feilet. Ingen verdier er tilgjengelige. Last inn appen p\u00e5 nytt.'
    },
    en: {
      skip: 'Skip to generator', security: 'SECURITY',
      heroTitle: 'Strong passwords.', heroTagline: 'Made simple.',
      heroDescription: 'Create passwords, passphrases and PINs in seconds. Choose your settings \u2014 generate, copy and go.',
      local: 'Generated locally', noAccount: 'No account', noLogging: 'No password logging',
      customize: 'CUSTOMIZE', settingsTitle: 'Your preferences', modeLabel: 'Secret type',
      password: 'Password', phrase: 'Passphrase', pin: 'PIN code', presets: 'Quick presets',
      presetStandard: 'Standard', presetReadable: 'Easy to read', presetLong: 'Extra long',
      length: 'Password length', characters: 'chars', characterTypes: 'Include characters',
      uppercase: 'Uppercase letters', lowercase: 'Lowercase letters', numbers: 'Numbers', symbols: 'Symbols',
      excludeAmbiguous: 'Avoid similar characters', ambiguousHelp: 'Excludes I, l, 1, O, 0, o and |.',
      requiredGroups: 'At least one character from every selected category is always included.',
      phraseDescription: 'Random English words that are easier to type. The word list is bundled with the app, and each word is drawn independently.',
      wordCount: 'Number of words', words: 'words', separator: 'Separator', hyphen: 'Hyphen (-)', period: 'Period (.)', space: 'Space',
      capitalize: 'Capitalize each word', capitalizeHelp: 'Changes readability, not entropy.',
      addNumber: 'Add two random digits', addNumberHelp: 'Appends a number from 00 to 99.',
      wordlistNote: '{count} English words \u00b7 {bits} bits per word \u00b7 10 words by default. Not the EFF/Diceware word list.',
      pinDescription: 'A random numeric code. Leading zeros are preserved, and digits may repeat.',
      pinDigits: 'Number of digits', digitUnit: 'digits', pinWarningTitle: 'A PIN is not a strong password',
      pinWarning: 'Only use a PIN where the service limits guessing attempts. Choose a password or passphrase for accounts.',
      quantity: 'Number to generate', settingsAuto: 'New values are generated when you change settings.',
      result: 'RESULT', resultTitle: 'Ready to use', localBadge: 'LOCAL',
      yourPassword: 'YOUR NEW PASSWORD', yourPhrase: 'YOUR NEW PASSPHRASE', yourPin: 'YOUR NEW PIN',
      hide: 'Hide', show: 'Show', empty: 'No value generated.', generatedValue: 'Generated value',
      webCrypto: 'Randomness from Web Crypto', strength: 'Calculated strength',
      entropyHelp: 'Calculated from the random choices, not a promise about cracking time.',
      generate: 'Generate new', generateMany: 'Generate {count} new', copy: 'Copy', copyAll: 'Copy all',
      clipboardNote: 'Copying puts the value on your clipboard. The app does not automatically remove it from there.',
      notSaved: 'The app does not store your passwords.', clear: 'Clear results', batch: 'MULTIPLE VALUES',
      batchTitle: 'All generated values', batchHelp: 'Includes the value above. This list is not saved and is replaced on regeneration.',
      privacyTitle: 'Your secrets stay with you.',
      privacyText: 'No passwords are sent to Cloud247 or other services. No analytics, external scripts or password history.',
      goodHabits: 'GOOD HABITS', infoTitle: 'A good password is just the start.',
      uniqueTitle: 'One password per account', uniqueText: 'Generate a new, unique value for every service. Never reuse passwords between work and personal accounts.',
      managerTitle: 'Let a password manager remember', managerText: 'Keep your passwords in a password manager, not a spreadsheet or an email.',
      mfaTitle: 'Add another layer of security', mfaText: 'Enable MFA, or use passkeys where supported. A password cannot protect against everything.',
      technicalTitle: 'How does the generator work?',
      technicalText: 'The app uses crypto.getRandomValues() and rejects numbers that would create a biased distribution. All selected character categories are guaranteed to appear. Password entropy accounts for this constraint. Passphrases use the actual size of the bundled word list.',
      limitsText: 'This is not a password manager or an independent security audit. A compromised browser, extension, device or website can read the output. The hosting provider may log normal page visits, but the app never transmits generated values.',
      storageText: 'Only the language preference may be stored locally. Clear removes results from the app, not from clipboard history or screenshots, and cannot guarantee secure erasure of browser memory.',
      moreTitle: 'More tools. Less friction.', moreText: 'Tools for Microsoft 365, Intune, email and domain security.', moreButton: 'Explore all tools',
      limited: 'Limited strength', moderate: 'Moderate strength', strong: 'Strong', veryStrong: 'Very strong', pinOnly: 'PIN only \u2014 not an account password',
      bits: '{value} bits of entropy', lengthValue: '{value} characters', copied: 'Copied to the clipboard.',
      copiedAll: '{count} values copied to the clipboard.', generated: 'A new value is ready.', generatedMany: '{count} new values are ready.',
      cleared: 'Results removed from the app. Your clipboard has not been changed.',
      copyFailed: 'Unable to copy. Reveal the value, select it and copy it manually.',
      copyItem: 'Copy value {index}',
      cryptoUnavailable: 'This browser has no cryptographic random generator. Use an up-to-date browser.',
      insecureContext: 'Open the app over HTTPS, on localhost or as a local file. Generation is blocked on insecure HTTP.',
      noCharacters: 'Select at least one character category to generate a password.',
      passwordLength: 'Choose a whole number from 8 to 128 characters.', phraseLength: 'Choose a whole number from 6 to 12 words.', pinLength: 'Choose a whole number from 4 to 12 digits.',
      batchCount: 'Choose between 1 and 50 values.', invalidSeparator: 'Choose a hyphen, period or space as the separator.',
      wordlistUnavailable: 'The word list is missing or invalid. Reload the app.',
      randomFailure: 'The random source failed. No new values have been generated.',
      invalidMode: 'Invalid mode. Reload the app.', invalidRange: 'Invalid numeric range.',
      unexpected: 'Generation failed. No values are available. Reload the app.'
    }
  };
  const STORAGE_KEY = 'cloud247-password-language';
  let language = 'no';
  try { const saved = root.localStorage.getItem(STORAGE_KEY); if (saved === 'no' || saved === 'en') language = saved; } catch (_) { /* Storage is optional. */ }
  function t(key, values = {}) {
    const message = messages[language][key] || messages.en[key] || key;
    return message.replace(/\{(\w+)\}/g, (_, name) => values[name] === undefined ? '{' + name + '}' : String(values[name]));
  }
  function apply() {
    document.documentElement.lang = language === 'no' ? 'nb' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', t(node.dataset.i18nAria)); });
    document.querySelectorAll('[data-language]').forEach(button => {
      const selected = button.dataset.language === language;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }
  function setLanguage(next) {
    if (next !== 'no' && next !== 'en') return;
    language = next;
    try { root.localStorage.setItem(STORAGE_KEY, language); } catch (_) { /* Do not require storage. */ }
    apply();
  }
  root.Cloud247I18n = Object.freeze({ t, apply, setLanguage, getLanguage: () => language });
})(window);
