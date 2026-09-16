# Assets and attribution

## Cloud247 branding

The header uses the original outlined `assets/cloud247-logo.svg` from the
user's `cloud247-hub/Expiryguard` repository, unchanged. Git blob SHA-1:
`e50ba242fafb6c0916d03d7cd2d4b71c2537d96e`.
The earlier cropped cloud symbol remains in `assets/cloud247-mark.svg` for
backward compatibility but is no longer used in the header. No font files
or third-party network resources are required.

Reference: https://github.com/cloud247-hub/CAA-Record-Generator/blob/main/assets/cloud247-logo.svg

The color palette and overall header, hero, rounded-panel, language-switch and footer layout follow the user's existing Cloud247 tools. Cloud247 names and brand assets remain subject to their owner's rights; this file does not grant third-party trademark rights.

## Word list

`assets/words.js` contains 512 project-specific English words assembled for this app. It is not copied from the EFF or Diceware lists, and it must not be marketed as either. Its count, per-word entropy and default phrase length are disclosed in the UI and documentation.

## Runtime dependencies

None. The application uses browser APIs, local source files and system fonts. No font binaries, npm packages, tracking scripts or external images are distributed for runtime use.

The optional Python/Playwright test harness requires separately installed development tools; they are not bundled in this project.
