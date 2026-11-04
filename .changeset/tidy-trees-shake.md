---
"@nl-design-system-community/clippy-components": patch
"@nl-design-system-community/css-scraper": patch
"@nl-design-system-community/design-tokens-schema": patch
---

Stop bundling JavaScript dependencies, so they can be shared with other packages. css-scraper and design-tokens-schema are now also marked as side-effect free and publish one file per module, so unused code can be tree-shaken
