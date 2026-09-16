# Verification - 2026-09-16

## Copy patch v1.0.2

Completed 2026-09-16: 18 core tests, 15 offline UI checks and the static
deployment check passed. The approved Norwegian and English headings and
subheadings are checked exactly. Both headings fit two lines at all 12
header-test widths from 320 to 1920 px, and language switching preserves
the current secret. Header markup is unchanged apart from the logo cache
version. Generator code is byte-identical to v1.0.1 after normalizing
release identifiers. Desktop and mobile previews were visually inspected.

The new typography changes are confined to hero headings. No authentication,
networking, storage, generation or clipboard logic was changed. The existing
offline-fixture limitations below still apply; no GitHub changes were made.

## Header patch v1.0.1

Reference: the public homepage header source in `cloud247-hub/Expiryguard`,
`main`, v5.4.0, retrieved 2026-09-16. `styles.css` blob:
`646fcc4be90f630cba30adc87422161b94175211`. Original logo blob:
`e50ba242fafb6c0916d03d7cd2d4b71c2537d96e` (verified byte-for-byte).
The live homepage could not be fetched; no live visual-equivalence claim is made.

Header regression checks cover original image loading in the fixture, navy/yellow
colors, logo dimensions, centered/left alignment, shell width, hidden app label,
control order, language switching and no overflow at 12 widths, including both
sides of the 620 px and 760 px breakpoints. Desktop and mobile previews were
inspected. The generator and i18n behavior are unchanged; only release labels
changed in the generator JavaScript.

## Completed

**Core: 18 automated tests passed, 0 failed** using Node.js 22.16.0 and the built-in test runner.

Coverage includes defaults; all 15 non-empty character-category combinations at both password-length limits with ambiguity exclusion on and off; invalid inputs; random-number rejection boundaries; retry guard failure; missing crypto; pool wiping; exhaustive small-alphabet checks of the exact counting formula; BigInt logarithms; 512-word list validation; passphrase options and entropy; repeated words; PIN lengths and leading zeros; language-key parity; and static checks against network/storage/logging APIs in the generation logic.

**UI: 15 offline DOM checks passed** using Chromium and Playwright. They cover default generation with native Web Crypto; Norwegian/English switching without replacing the current secret; hide/show and copy payloads; length/category validation; presets; passphrase settings; 50-value batches; PIN mode; keyboard tabs; clear; simulated visibility/page-transition events; seven widths from 320 to 1920 px without horizontal overflow; and the insecure-context branch. No JavaScript exceptions occurred in this fixture.

The desktop and mobile previews were rendered from these application files in the offline fixture. Preview values are disposable test output, not passwords to reuse.

## Important limits

The managed browser environment blocked navigation both to a localhost server and to local file URLs. Those attempted end-to-end checks did NOT complete, and no navigation policy was changed.

The UI fixture inserts the app content directly into a blank browser page. Only in the fixture, local files are supplied inline, the meta CSP is omitted, the original logo is supplied as a data-URI image, and secure-context/clipboard behavior is represented by test doubles. The delivered source files retain their CSP and real browser API checks. This allows layout and DOM behavior to be checked, but it does NOT verify HTTP delivery, asset loading on a live origin, CSP enforcement, actual OS clipboard writes, file-URL compatibility, hosting logs or browser network restrictions.

`Publish-GitHub.ps1` was written against the GitHub CLI/Pages documentation and reviewed, but neither PowerShell execution nor authenticated repository creation was available in this environment. No repository or Pages site was created. The package provides the script, not a claim that publication succeeded.

## Reproduce local tests

```sh
npm test
node tests/deployment-check.cjs
```

The latter checks relative local asset paths, file existence, version parameters, static CSP content and the absence of an active custom-domain file. It is not a runtime CSP test.

For the optional offline UI fixture, install Python Playwright and Chromium separately, then run `python tests/ui-offline.py`. The script expects Chromium at `/usr/bin/chromium`; set `CHROMIUM_PATH` for a different installation. Output goes into the ignored `test-results` folder. Review the fixture's explicit test doubles before interpreting results.

## Before making the site public

1. Serve the unchanged files over HTTPS on the selected host. Confirm that all local assets load without CSP violations and that generation creates no requests.
2. Check copy, hide/show, clear, keyboard operation and mobile layouts in current Edge/Chrome, Safari and Firefox as relevant. Confirm the insecure-HTTP failure path.
3. Inspect browser storage and hosting configuration. Only the optional language preference should be application-persisted. Do not add analytics or DOM-capturing error tools.
4. Verify the remote commit, Pages build, HTTPS enforcement and custom-domain ownership. Keep the repository and deployment credentials protected.

These checks are not a substitute for an independent security review when the deployment's risk warrants one.
