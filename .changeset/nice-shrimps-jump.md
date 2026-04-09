---
'@nl-design-system-community/clippy-components': patch
---

fix: restore styling of `clippy-modal`

Upgrading start tokens in [#667](https://github.com/nl-design-system/theme-wizard/pull/667) broke the custom property mapping of clippy-modal because the `todo.modal-dialog.*` tokens were [removed in v3.0.0](https://github.com/nl-design-system/themes/blob/main/packages/start-design-tokens/CHANGELOG.md#300). Removing the noew obsolete mapping solves the issue.
