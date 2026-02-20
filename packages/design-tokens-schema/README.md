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
} from '@nl-design-system-community/design-tokens-schema';

const myConfig = {
  brand: {
    ma: {
      color: {
        black: {
          $type: 'color',
          $value: '#000'
        }
        // + dozens of tokens
      }
    }
  },
  basis: {
    color: {
      default: {
        'bg-document': {
          $type: 'color',
          $value: '{ma.color.black}'
        }
      }
    }
  }
};

// Token references like `{ma.color.black}` are only validated to follow the proper format, they are not resolved.
const config = ThemeSchema.parse(myConfig) satisfies Theme;

// All refs like `{ma.color.black}` are first validated in the schema and the `.transform(resolveConfigRefs)` replaces the refs with the actual values
const resolvedConfig = ThemeSchema.transform(resolveConfigRefs).parse(myConfig) satisfies Theme;

// The whole theme is validated for:
// - syntax correctness
// - all known color combinations to have proper contrast
// - all {ref.pointers} to exist and be of the correct type
const strictConfig = StrictThemeSchema.safeParse(myConfig) satisfies Theme;
```

## Extensions

This schema adds custom extensions to design tokens to support additional metadata and validation. These extensions are added automatically when using `StrictThemeSchema`.

### Color Scale Position

**Key:** `nl.nldesignsystem.color-scale-position`

Stores the position/index of a color within a color scale (1-9). Used for organizing color tokens and understanding their relationship within a color palette.

```json
{
  "basis": {
    "color": {
      "neutral": {
        "1": {
          "$type": "color",
          "$value": "#ffffff",
          "$extensions": {
            "nl.nldesignsystem.color-scale-position": 1
          }
        },
        "5": {
          "$type": "color",
          "$value": "#808080",
          "$extensions": {
            "nl.nldesignsystem.color-scale-position": 5
          }
        }
      }
    }
  }
}
```

### Contrast With

**Key:** `nl.nldesignsystem.contrast-with`

Stores expected contrast ratio pairs for accessibility validation. Each entry contains a reference background color (with extension `nl.nldesignsystem.value-resolved-from`) and the minimum contrast ratio required against it (WCAG compliance).

```json
{
  "basis": {
    "color": {
      "foreground": {
        "default": {
          "$type": "color",
          "$value": "#000000",
          "$extensions": {
            "nl.nldesignsystem.contrast-with": [
              {
                "expectedRatio": 4.5,
                "color": {
                  "$type": "color",
                  "$value": "#ffffff",
                  "$extensions": {
                    "nl.nldesignsystem.value-resolved-from": "{basis.color.background.default}"
                  }
                }
              }
            ]
          }
        }
      }
    }
  }
}
```

### Value Resolved As

**Key:** `nl.nldesignsystem.value-resolved-as`

Stores the actual value when a token references another token.

```json
{
  "basis": {
    "color": {
      "text": {
        "primary": {
          "$type": "color",
          "$value": "{brand.ma.color.blue.7}",
          "$extensions": {
            "nl.nldesignsystem.value-resolved-as": "#0056b3"
          }
        }
      }
    }
  }
}
```

### Value Resolved From

**Key:** `nl.nldesignsystem.value-resolved-from`

Stores the original reference path when a token's value has been resolved. Used to track which token a value came from for debugging and contrast issue reporting.

```json
{
  "basis": {
    "color": {
      "background": {
        "default": {
          "$type": "color",
          "$value": "#ffffff",
          "$extensions": {
            "nl.nldesignsystem.value-resolved-from": "{brand.ma.color.white}"
          }
        }
      }
    }
  }
}
```
