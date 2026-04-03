# @nl-design-system-community/css-scraper

## 1.2.0

### Minor Changes

- bfc4235: css-scraper
  - feat: add token sub-type for dimension tokens (#595)
  - fix: handle edge case bug on malformed `@import` (#401)
  - chore: update `@projectwallace/css-parser` to 0.13.11 (#673)

  clippy-components
  - feat(clippy-combobox): improve filtering for color combobox (#569)
  - feat(clippy-combobox): show previews for font-family and color (#584)
  - feat: add `<clippy-toggletip>` component (#608)
  - fix(clippy-combobox): several enhancements (#538)
  - fix(clippy-combobox): prevent infinite loop, add debounce (#549)
  - fix(clippy-combobox): accept combobox values immediately on blur instead of after pressing Enter (#643)
  - fix: correct export of `srOnly` styles (#595)

  theme-wizard-app
  - feat: allow manual input for line-height/font-weight (#646)
  - feat: show staged font-family tokens in combobox (#642)
  - feat: component presets (#606)
  - feat: show loading state while scraping CSS (#634)
  - feat: store seed-color extension to show to user in color-scale input (#631)
  - feat: add button to download tokens CSS (#629)
  - feat: add `<wizard-scroll-container>` component (#610)
  - fix: loads of layout fixes (#649, #632)
  - fix: re-compute constrast/resolved-as extensions after change (#645)
  - chore(perf): render CSS to string without using Style Dictionary (#594)

### Patch Changes

- 9798082: - update Vite
  - update Typescript
  - update Hono.
  - Add Publint for checking build output.
  - Replace vite-plugin-dts with unplugin-dts.
- Updated dependencies [329d763]
  - @nl-design-system-community/design-tokens-schema@2.1.1

## 1.1.2

### Patch Changes

- Updated dependencies [b570fd2]
  - @nl-design-system-community/design-tokens-schema@2.1.0

## 1.1.1

### Patch Changes

- Updated dependencies [11114ce]
  - @nl-design-system-community/design-tokens-schema@2.0.0

## 1.1.0

### Minor Changes

- 168d321: Feat: support custom User Agent string and timeout

### Patch Changes

- Updated dependencies [6fcf52a]
- Updated dependencies [2f34c71]
  - @nl-design-system-community/design-tokens-schema@1.1.0

## 1.0.2

### Patch Changes

- 05adfae: Publish CSS scraper on npm.

## 1.0.1

### Patch Changes

- 54a51ee: Add `expertteam-digitale-toegankelijkheid` keyword to npm packages.
- Updated dependencies [54a51ee]
  - @nl-design-system-community/design-tokens-schema@1.0.1

## 1.0.0

### Patch Changes

- Updated dependencies [396ca51]
  - @nl-design-system-community/design-tokens-schema@1.0.0
