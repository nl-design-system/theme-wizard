---
'@nl-design-system-community/clippy-components': major
---

# Clippy Combobox

## `<clippy-combobox>` (base)

- feat: show color and font-family previews in option list (#584)
- feat: accept values immediately on blur without requiring Enter (#643)
- feat: improved option filtering — searches label and description (#538)
- fix: prevent infinite loop in value/query synchronization; add debounce to external data fetching (#549)
- fix: option tap-target size and inline paddings

## `<clippy-color-combobox>`

- feat: filter options by visual color proximity using ΔE 2000, in addition to label text (#569)
- feat: localized color name search (e.g. searching "oranje" in Dutch finds orange colors)

## `<clippy-font-combobox>`

- feat: renders each option in its own font-family with lazy stylesheet loading via `IntersectionObserver`
- feat: exports `Option` type for consumers who extend or compose this component

## `<clippy-lang-combobox>`

- fix: inherits all base combobox stability and UX improvements listed above

## `<clippy-token-combobox>`

- feat: new component added to `clippy-components`; supports token types `color`, `dimension`, `fontFamily`, and `number` with type-appropriate filtering and in-list previews

## `<clippy-story-preview>`

- feat: new component moved from `theme-wizard-app` (`<wizard-story-preview>`) into `clippy-components`

## `<clippy-color-sample>`

- feat: new component moved from `theme-wizard-app` (`<wizard-color-sample>`) into `clippy-components`

## `<clippy-toggletip>`

- feat: new component added to `clippy-components`

## `<clippy-reset-theme>`

- feat: new component moved from `theme-wizard-app` (`<wizard-reset-theme>`) into `clippy-components`

## `<clippy-react-element>`

- feat: new component moved from `theme-wizard-app` (`<wizard-react-element>`) into `clippy-components`

## `<clippy-modal>`

- fix: restore styling broken by upstream `@amsterdam` scope package upgrade
