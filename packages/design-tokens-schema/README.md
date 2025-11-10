# Design Tokens Schema

This repository contains Zod schemas and Typescript types to validate Design Token configurations.

## Features

- 🛂 Inspect design token configuration to be valid
- 🎨 Accept legacy tokens as well as modern, spec-compliant tokens
- 🛠️ Upgrade legacy-format tokens to modern, spec-compliant tokens
- 🫵 Optionally resolve design token references
- 🤏 Fine-grained schemas and types for maximum composability

## Installation

```sh
npm install @nl-design-system-community/design-tokens-schema
```

## Usage

### Validating an entire theme configuration

```ts
import {
  type Theme,
  ThemeSchema,
  resolveConfigRefs,
  StrictThemeSchema,
} from '@nl-design-system-community/design-token-schema';

const myConfig = {
  brand: {
    ma: {
      color: {
        black: { $value: '#000' } }
        // + dozens of tokens
      }
    }
  },
  common: {
    basis: {
      color: {
        default:
          'bg-document': {
            $type: 'color',
            $value: '{ma.color.black}'
          }
        }
      }
    }
  }
};

// Only refs like `{ma.color.black}` refs are validated to follow the proper format.
const config = ThemeSchema.parse(myConfig) satisfies Theme;

// All refs like `{ma.color.black}` are first validated in the schema and the `.transform(resolveConfigRefs)` replaces the refs with the actual values
const resolvedConfig = ThemeSchema.transform(resolveConfigRefs).parse(myConfig) satisfies Theme;

// The whole theme is validated for:
// - syntax correctness
// - all known color combinations to have proper contrast
// - all {ref.pointers} to exist and be of the correct type
const strictConfig = StrictThemeSchema.safeParse(myConfig) satisfies Theme;
```
