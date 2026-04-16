# @nl-design-system-community/clippy-components

## 2.1.0

### Minor Changes

- 9b430c2: feat: add `<clippy-story-preview>` element
  breaking(theme-wizard-app): removed `<wizard-story-preview>`; use `<clippy-story-preview>` instead from `@nl-design-system-community/clippy-components`.
- 3403564: feat: add `<clippy-color-sample>`
  breaking(theme-wizard-app): removed `<wizard-color-sample>` and moved into clippy-components as `<clippy-color-sample>`
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

- f3aa948: feat: add `clippy-reset-theme` element

  breaking(theme-wizard-app): `wizard-reset-theme` has moved to clippy-components, use `clippy-reset-theme` instead.

- 8f09e97: feat: add `<clippy-react-element>`

  breaking(theme-wizard-app): remove `<wizard-react-element>`; Use `@nl-design-system-community/clippy-components`'s `<clippy-react-element>` instead.

### Patch Changes

- 6978936: Major version bumps for TypeScript, EsLint, Stylelint, npm-check-updates, npm-package-json-lint
- f186377: chore(deps): upgrade all `@utrecht` scoped dependencies
- f9048c5: chore: upgrade all `@amsterdam` scope packages
  fix: restore styling of `clippy-modal`

  Upgrading start tokens in [#667](https://github.com/nl-design-system/theme-wizard/pull/667) broke the custom property mapping of clippy-modal because the `todo.modal-dialog.*` tokens were [removed in v3.0.0](https://github.com/nl-design-system/themes/blob/main/packages/start-design-tokens/CHANGELOG.md#300). Removing the now obsolete mapping solves the issue.

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
