# Security model - v1.0.1

This is a browser-only generator, not a password manager, a credential vault, a compliance certification or an independent security audit.

## Randomness and distribution

The source of randomness is the browser's native `crypto.getRandomValues()`. There is no insecure fallback. A missing provider or insecure execution context stops generation and clears stale displayed values.

A per-batch `Uint32Array` pool holds 256 random integers. For a choice among N entries, integers at or above `floor(2^32 / N) * N` are rejected. Reducing accepted values modulo N then gives an unbiased choice. Consumed pool cells and the remaining pool are zeroed. Finite retry guards fail closed rather than using a weaker algorithm.

Password characters are drawn independently from the union of enabled, disjoint categories. Whole candidates missing an enabled category are rejected. This is uniform over the set of strings that satisfy the selected category requirement. It does not use the potentially biased pattern of force-inserting one character per category and then shuffling. The valid sample-space size is counted exactly with BigInt inclusion-exclusion before computing its logarithm.

Passphrases draw independently, with replacement, from 512 bundled, unique English words. Each choice contributes 9 bits; the default of 10 words contributes 90 bits. Repeated words remain valid and are not filtered. Fixed separators and capitalization add no entropy. An optional independent two-digit suffix adds log2(100) bits. Only non-letter separators are allowed, preserving unique parsing. This is a small project-specific list, NOT an EFF or Diceware list, and is clearly labelled as such in the UI.

PINs draw independent decimal digits and preserve leading zeros. A PIN has length * log2(10) bits. PIN mode always warns that it is not an account-password replacement and assumes an appropriate retry-limited use case.

Entropy labels describe this generation model, assuming an uncompromised uniform random source. They are not cracking-time promises, estimates for user-selected passwords, or guarantees about any account's security.

## Data handling

Generated values exist in page memory and, when visible, in the DOM. They are never sent through URLs, forms, requests, analytics, logging, cookies, localStorage, sessionStorage or IndexedDB by this application. The only optional persisted setting is `cloud247-password-language`.

Copying writes to the OS clipboard after a user action. The app never reads the clipboard. Clipboard managers, cloud clipboard sync, keyboard software and screenshots are outside its control. Clipboard content is not automatically cleared. A legacy copy fallback uses a temporary textarea and removes it immediately; failure is surfaced in the UI.

Hiding replaces displayed values with a fixed-length mask, including batch rows; it does not remove secrets from JavaScript memory. The tab-hidden handler masks values, while page transitions and the clear action discard application references and replace displayed values. JavaScript strings and browser internals cannot be guaranteed to be securely overwritten. Back-forward-cache handling is best effort, not a memory-erasure guarantee.

No results are put into live regions for automatic screen-reader announcements. The generated value remains keyboard-focusable and explicitly readable by assistive technology on user request. Toasts contain generic messages only.

## Delivery and hosting

The delivered HTML has a restrictive meta Content Security Policy: same-origin scripts/styles/images, no network connections, no objects, no form submission, no workers and no base-URL changes. There are no runtime dependencies, external fonts, remote wordlists, CDNs or service workers.

The optional `_headers` file adds response headers on hosts that support it. GitHub Pages ignores that file; in particular, meta CSP does not support `frame-ancestors`, so the package does not claim header-based frame protection on GitHub Pages. Configure any required response headers at a compatible hosting layer.

A compromised same-origin site or deployment, repository account, browser extension, browser or device can modify this app or read secrets. Host access logs may record ordinary page visits and IP addresses; that is different from the app transmitting generated values. Protect deployment credentials, use HTTPS and review code changes. Avoid adding analytics, third-party code or error reporting that could capture DOM content.

## Verification and reporting

Read TESTING.md for actual results and limitations. Tests are useful engineering checks, not a proof or independent audit. The live deployment, real clipboard permissions, CSP enforcement and publishing script still need validation on the chosen host.

Do not include genuine passwords, tokens or user data in bug reports. Report reproducible issues with disposable test values and the app version through a private channel to the repository owner. Do not publicly disclose a live vulnerability before coordinating with the owner.
