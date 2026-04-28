# @nl-design-system-community/clippy-storybook

## 1.2.0

### Minor Changes

- 9b430c2: feat: add `<clippy-story-preview>` element
  breaking(theme-wizard-app): removed `<wizard-story-preview>`; use `<clippy-story-preview>` instead from `@nl-design-system-community/clippy-components`.
- 3403564: feat: add `<clippy-color-sample>`
  breaking(theme-wizard-app): removed `<wizard-color-sample>` and moved into clippy-components as `<clippy-color-sample>`
- f3aa948: feat: add `clippy-reset-theme` element

  breaking(theme-wizard-app): `wizard-reset-theme` has moved to clippy-components, use `clippy-reset-theme` instead.

- 8f09e97: feat: add `<clippy-react-element>`

  breaking(theme-wizard-app): remove `<wizard-react-element>`; Use `@nl-design-system-community/clippy-components`'s `<clippy-react-element>` instead.

### Patch Changes

- f186377: chore(deps): upgrade all `@utrecht` scoped dependencies
- 329d763: Minor and patch updates except for vitest in design-tokens-schema

## 1.1.0

### Minor Changes

- 0e5176a: Fix heading bug in clippy-modal and change attribute naming for action labels (`confirm-label` and `cancel-label`). Add storybook docs and tests.
