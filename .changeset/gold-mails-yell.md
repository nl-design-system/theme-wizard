---
"@nl-design-system-community/clippy-components": patch
"@nl-design-system-community/theme-wizard-app": minor
---

## Clippy Components

- `clippy-layout` now prevents inner children to stretch/overflow the grid cells.
- `clippy-page-layout` correctly propagates the `--clippy-page-layout-content-max-inline-size` to inner elements.
- `clippy-page-layout` now exposes its types

## Theme Wizard App

- Custom property overrides are now moved from `wizard-layout` to `wizard-app`

## Theme Wizard Website

- `MainLayout` is now the layout which handles everything regarding page navigation and responsiveness.
- Every page template extends `MainLayout`
