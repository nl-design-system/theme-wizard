# @nl-design-system-community/clippy-components

## 2.1.0

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

- 329d763: Minor and patch updates except for vitest in design-tokens-schema

## 2.0.0

### Major Changes

- 0e5176a: Fix heading bug in clippy-modal and change attribute naming for action labels (`confirm-label` and `cancel-label`). Add storybook docs and tests.

## 1.2.0

### Minor Changes

- 249d690: Clippy modal with candidate nl-button and tabler icon

### Patch Changes

- 06acdf8: ClippyButton naming

## 1.1.0

### Minor Changes

- e491549: clippy-button based on @nl-design-system-candidate/button-css

## 1.0.0

### Major Changes

- 9d9bc9b: Initial release of this package. Releases are currently meant for internal usage. Use at your own risk!
