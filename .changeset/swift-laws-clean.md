---
"@nl-design-system-community/clippy-components": minor
"@nl-design-system-community/theme-wizard-app": minor
"@nl-design-system-community/design-tokens-schema": patch
---

## clippy-components

- add `clippy-token-tree-table`

## theme-wizard-app
- add wizard-token-tree-table as a light wrapper around `clippy-token-tree-table`

## design-tokens-schema
- fix stringification of tokens with reference value
- fix missing support for `clippy-token-sample` when `line-height` token has a unit
- make color-tokens less chatty: do not `console.warn` when trying to parse a reference value
