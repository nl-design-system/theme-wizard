---
'@nl-design-system-community/theme-wizard-app': patch
---

chore: align theme-wizard-app with conventions

- removed 2 unused components
  - `color-select` was never used, we use `wizard-token-input` instead
  - `wizard-color-input` was not used, we use `wizard-token-input` instead

- renamed some folders to match our naming conventions
  - renamed `app` folder to `wizard-app` and updated imports
  - renamed `sidebar` folder to `wizard-sidebar` and updated imports

None of this is user-facing. Component names were already correct.
