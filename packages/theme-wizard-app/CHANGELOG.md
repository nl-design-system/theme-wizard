# @nl-design-system-community/theme-wizard-app

## 2.0.0

### Major Changes

- 9b430c2: feat: add `<clippy-story-preview>` element
  breaking(theme-wizard-app): removed `<wizard-story-preview>`; use `<clippy-story-preview>` instead from `@nl-design-system-community/clippy-components`.
- 3403564: feat: add `<clippy-color-sample>`
  breaking(theme-wizard-app): removed `<wizard-color-sample>` and moved into clippy-components as `<clippy-color-sample>`
- f3aa948: feat: add `clippy-reset-theme` element

  breaking(theme-wizard-app): `wizard-reset-theme` has moved to clippy-components, use `clippy-reset-theme` instead.

### Minor Changes

- 9834230: feat: show useful error message when scraping a website fails
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

- 6978936: Major version bumps for TypeScript, EsLint, Stylelint, npm-check-updates, npm-package-json-lint
- f186377: chore(deps): upgrade all `@utrecht` scoped dependencies
- 6712e2b: chore: align theme-wizard-app with conventions
  - removed 2 unused components
    - `color-select` was never used, we use `wizard-token-input` instead
    - `wizard-color-input` was not used, we use `wizard-token-input` instead
  - renamed some folders to match our naming conventions
    - renamed `app` folder to `wizard-app` and updated imports
    - renamed `sidebar` folder to `wizard-sidebar` and updated imports

  None of this is user-facing. Component names were already correct.

- 329d763: Minor and patch updates except for vitest in design-tokens-schema
- 8f09e97: feat: add `<clippy-react-element>`

  breaking(theme-wizard-app): remove `<wizard-react-element>`; Use `@nl-design-system-community/clippy-components`'s `<clippy-react-element>` instead.

- Updated dependencies [9b430c2]
- Updated dependencies [3403564]
- Updated dependencies [bfc4235]
- Updated dependencies [6978936]
- Updated dependencies [f3aa948]
- Updated dependencies [f186377]
- Updated dependencies [f9048c5]
- Updated dependencies [329d763]
- Updated dependencies [8f09e97]
- Updated dependencies [9798082]
  - @nl-design-system-community/clippy-components@2.1.0
  - @nl-design-system-community/css-scraper@1.2.0
  - @nl-design-system-community/design-tokens-schema@2.1.1

## 1.0.2

### Patch Changes

- Updated dependencies [b570fd2]
  - @nl-design-system-community/design-tokens-schema@2.1.0
  - @nl-design-system-community/clippy-components@2.0.0
  - @nl-design-system-community/css-scraper@1.1.2

## 1.0.1

### Patch Changes

- Updated dependencies [0e5176a]
  - @nl-design-system-community/clippy-components@2.0.0

## 1.0.0

### Major Changes

- 564c52e: Publish experimental components for the NL Design System Theme Wizard app.

### Patch Changes

- Updated dependencies [11114ce]
  - @nl-design-system-community/design-tokens-schema@2.0.0
  - @nl-design-system-community/clippy-components@1.2.0
  - @nl-design-system-community/css-scraper@1.1.1

## 0.0.6

### Patch Changes

- Updated dependencies [249d690]
- Updated dependencies [06acdf8]
  - @nl-design-system-community/clippy-components@1.2.0

## 0.0.5

### Patch Changes

- Updated dependencies [e491549]
  - @nl-design-system-community/clippy-components@1.1.0

## 0.0.4

### Patch Changes

- Updated dependencies [168d321]
- Updated dependencies [6fcf52a]
- Updated dependencies [2f34c71]
  - @nl-design-system-community/css-scraper@1.1.0
  - @nl-design-system-community/design-tokens-schema@1.1.0

## 0.0.3

### Patch Changes

- Updated dependencies [9d9bc9b]
- Updated dependencies [05adfae]
  - @nl-design-system-community/clippy-components@1.0.0
  - @nl-design-system-community/css-scraper@1.0.2

## 0.0.2

### Patch Changes

- 54a51ee: Add `expertteam-digitale-toegankelijkheid` keyword to npm packages.
- Updated dependencies [54a51ee]
  - @nl-design-system-community/design-tokens-schema@1.0.1
  - @nl-design-system-community/css-scraper@1.0.1

## 0.0.1

### Patch Changes

- Updated dependencies [396ca51]
  - @nl-design-system-community/design-tokens-schema@1.0.0
  - @nl-design-system-community/css-scraper@1.0.0
