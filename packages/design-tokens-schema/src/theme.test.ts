import maTokens from '@nl-design-system-community/ma-design-tokens/dist/tokens';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens';
import voorbeeldTokens from '@nl-design-system-unstable/voorbeeld-design-tokens/dist/tokens';
import { it, describe, expect } from 'vitest';
import * as z from 'zod';
import { BrandSchema, COLOR_KEYS } from './basis-tokens';
import {
  ThemeSchema,
  type Theme,
  StrictThemeSchema,
  EXTENSION_CONTRAST_WITH,
  EXTENSION_RESOLVED_AS,
  EXTENSION_COLOR_SCALE_POSITION,
  type ContrastExtension,
} from './theme';
import { parseColor, type ColorToken } from './tokens/color-token';
import { ERROR_CODES, type ThemeValidationIssue } from './validation-issue';

const brandConfig = {
  ma: {
    name: {
      $type: 'text',
      $value: 'Mooi & Anders',
    },
    color: {
      indigo: {
        '1': {
          $type: 'color',
          $value: {
            alpha: 1,
            colorSpace: 'srgb',
            components: [1, 1, 1],
          },
        },
        '5': {
          $type: 'color',
          $value: {
            alpha: 1,
            colorSpace: 'srgb',
            components: [0, 0, 0],
          },
        },
      },
    },
  },
};

describe('adding contrast-with extensions', () => {
  it('adds contrast-with extensions for tokens that we know', () => {
    const config = {
      basis: {
        color: {
          default: {
            'bg-subtle': {
              $type: 'color',
              $value: '{ma.color.indigo.1}',
            },
            'color-document': {
              $type: 'color',
              $value: `{ma.color.indigo.5}`,
              // the transformation will add an $extension here
            },
          },
        },
      },
      brand: brandConfig,
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);
    expect(result.data?.basis?.color?.['default']?.['color-document']?.$extensions).toMatchObject({
      [EXTENSION_CONTRAST_WITH]: [
        {
          color: {
            $extensions: {
              [EXTENSION_RESOLVED_AS]: config.brand.ma.color.indigo['1'].$value,
            },
            $type: 'color',
            $value: '{ma.color.indigo.1}',
          },
          expectedRatio: 4.5,
        },
      ],
    });
  });

  it('contrast-with extensions do not mess with existing extensions', () => {
    const config = {
      basis: {
        color: {
          default: {
            'bg-subtle': {
              $type: 'color',
              $value: '{ma.color.indigo.1}',
            },
            'color-document': {
              $extensions: {
                // the transformation will add an extra contrast color here
                [EXTENSION_CONTRAST_WITH]: [
                  {
                    color: {
                      $type: 'color',
                      $value: '{ma.color.indigo.5}',
                    },
                    ratio: 1,
                  },
                ],
              },
              $type: 'color',
              $value: `{ma.color.indigo.5}`,
            },
          },
        },
      },
      brand: brandConfig,
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);
    expect(
      result.data?.basis?.color?.['default']?.['color-document']?.$extensions?.[EXTENSION_CONTRAST_WITH],
    ).toHaveLength(2);
  });

  it('does not add extension when corresponding token does not exist', () => {
    const config = {
      basis: {
        color: {
          default: {
            'color-document': {
              $type: 'color',
              $value: `{ma.color.indigo.5}`,
              // contrast-with extension would be added here but this object has no bg-subtle
            },
          },
        },
      },
      brand: brandConfig,
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);
    expect(result.data?.basis?.color?.['default']?.['color-document']?.$extensions?.[EXTENSION_CONTRAST_WITH]).toEqual(
      undefined,
    );
  });
});

describe('resolving Design Token refs', () => {
  describe('resolve color ref', () => {
    const config = {
      basis: {
        color: {
          default: {
            'bg-document': {
              $type: 'color',
              $value: `{ma.color.indigo.5}`,
            },
          },
        },
      },
      brand: brandConfig,
    };

    it('does not mutate the input config', () => {
      const originalConfig = structuredClone(config);
      StrictThemeSchema.safeParse(config);
      const originalBg = originalConfig.basis.color.default['bg-document'].$value;
      const bgAfterValidation = config.basis.color.default['bg-document'].$value;
      expect.soft(originalBg).toEqual(bgAfterValidation);
    });

    it('validates the input', () => {
      const result = StrictThemeSchema.safeParse(config);
      expect.soft(BrandSchema.safeParse(config.brand.ma).success).toBeTruthy();
      expect.soft(result.success).toBeTruthy();
    });

    it('returns the schema with the ref value added to an extension and the $value left intact', () => {
      const result = StrictThemeSchema.safeParse(config);
      const expectedColor = brandConfig.ma.color.indigo[5];
      expect
        .soft(result.data?.basis?.color?.['default']?.['bg-document'])
        .toMatchObject(config.basis.color.default['bg-document']);

      expect
        .soft(result.data?.basis?.color?.['default']?.['bg-document']?.$extensions?.[EXTENSION_RESOLVED_AS])
        .toEqual(expectedColor.$value);
    });
  });

  it('marks as invalid if resolving to an nonexistent object', () => {
    const config = {
      basis: {
        color: {
          default: {
            'bg-document': {
              $type: 'color',
              $value: `{non.existent.token}`,
            },
            'bg-subtle': {
              $type: 'color',
              $value: `{incomplete.ref`,
            },
          },
        },
      },
      brand: brandConfig,
    };

    expect.soft(() => StrictThemeSchema.safeParse(config)).not.toThrowError();
    const result = StrictThemeSchema.safeParse(config);
    expect.soft(result.success).toBeFalsy();
  });

  it('marks as invalid if resolving to an existing object without a $value property', () => {
    const config = {
      basis: {
        color: {
          default: {
            'bg-document': {
              $type: 'color',
              $value: `{ma.color.indigo}`,
            },
          },
        },
      },
      brand: brandConfig,
    };

    expect(() => StrictThemeSchema.safeParse(config)).not.toThrowError();
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toBeFalsy();
    expect.soft(z.flattenError(result.error!)).toMatchObject({
      formErrors: [
        'Invalid token reference: expected "{ma.color.indigo}" to have a "$value" and "$type" property (referenced from "basis.color.default.bg-document")',
      ],
    });
  });

  it('marks as invalid when a font-family token reference points to an existing non-font-family token', () => {
    const config = {
      basis: {
        heading: {
          'font-family': {
            $type: 'fontFamily',
            // this points to a color token instead of a fontFamily
            $value: '{ma.color.indigo.5}',
          },
        },
      },
      brand: brandConfig,
    };

    const result = StrictThemeSchema.safeParse(config);
    expect.soft(result.success).toEqual(false);
    expect.soft(z.flattenError(result.error!)).toMatchObject({
      formErrors: [
        `Invalid token reference: $type "fontFamily" of "{"$type":"fontFamily","$value":"{ma.color.indigo.5}"}" at "basis.heading.font-family" does not match the $type on reference {ma.color.indigo.5}. Types "fontFamily" and "color" do not match.`,
      ],
    });
  });
});

describe('Style Dictionary specifics', () => {
  const config = {
    basis: {
      color: {
        'accent-1': {
          'bg-default': {
            $type: 'color',
            $value: '#ffffff',
            original: {
              $type: 'color',
              $value: '{ma.color.white}',
            },
          },
        },
      },
    },
    ma: {
      color: {
        white: {
          $type: 'color',
          $value: '#ffffff',
        },
      },
    },
  };

  it('replaces token.$value with token.original.$value', () => {
    const result = ThemeSchema.safeParse(config);
    expect(result.success).toBe(true);
    expect((result.data as Theme)?.basis?.color?.['accent-1']?.['bg-default']?.$value).toBe('{ma.color.white}');
  });

  it('ignores incomplete `original` objects', () => {
    const incompleteConfig = structuredClone(config);
    // @ts-expect-error what we're doing here is unexpeced, type-wise
    delete incompleteConfig.basis.color['accent-1']['bg-default'].original.$value;
    const result = ThemeSchema.safeParse(incompleteConfig);
    expect(result.success).toBe(true);
    expect((result.data as Theme)?.basis?.color?.['accent-1']?.['bg-default']?.$value).toEqual({
      alpha: 1,
      colorSpace: 'srgb',
      components: [1, 1, 1],
    });
  });

  it('adds resolved-as extension in StrictTheme', () => {
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toBe(true);
    expect(result.data?.basis?.color?.['accent-1']?.['bg-default']?.$value).toBe('{ma.color.white}');
    expect(result.data?.basis?.color?.['accent-1']?.['bg-default']?.$extensions?.[EXTENSION_RESOLVED_AS]).toEqual({
      alpha: 1,
      colorSpace: 'srgb',
      components: [1, 1, 1],
    });
  });
});

describe('validating color contrast', () => {
  // parseColor() because it's shorter than writing color tokens and the IDE shows a small color preview
  const black = { $type: 'color', $value: parseColor('#000') } satisfies ColorToken;
  const white = { $type: 'color', $value: parseColor('#fff') } satisfies ColorToken;
  const lightGray = { $type: 'color', $value: parseColor('#ccc') } satisfies ColorToken;
  const config = {
    basis: {
      color: {
        // This is where each test case will write their own needs
        default: Object.create(null),
      },
    },
    brand: {
      ma: {
        name: {
          $type: 'text',
          $value: 'Mooi & Anders',
        },
        color: {
          black,
          gray: {
            2: lightGray,
          },
          white,
        },
      },
    },
  } satisfies Theme;

  it('passes when contrast is sufficient', () => {
    const testConfig = structuredClone(config);
    testConfig.basis.color.default['border-default'] = {
      $type: 'color',
      $value: '{ma.color.black}',
    };
    testConfig.basis.color.default['bg-default'] = {
      $type: 'color',
      $value: '{ma.color.white}',
    };
    const result = StrictThemeSchema.safeParse(testConfig);
    expect(result.success).toEqual(true);
  });

  it('fails when color-document vs bg-subtle do not have enough contrast', () => {
    const testConfig = structuredClone(config);
    testConfig.basis.color.default['bg-subtle'] = {
      $type: 'color',
      $value: '{ma.color.white}',
    };
    testConfig.basis.color.default['color-document'] = {
      $type: 'color',
      $value: '{ma.color.gray.2}',
    };
    const result = StrictThemeSchema.safeParse(testConfig);
    expect(result.success).toBeFalsy();
    expect.soft(result.error!.issues).toEqual([
      {
        actual: 1.6059285649300712,
        code: 'too_small',
        ERROR_CODE: 'insufficient_contrast',
        message: 'Insufficient contrast',
        minimum: 4.5,
        origin: 'number',
        path: 'basis.color.default.color-document.$value'.split('.'),
        tokens: ['basis.color.default.color-document', 'basis.color.default.bg-subtle'],
      },
      {
        actual: 1.6059285649300712,
        code: 'too_small',
        ERROR_CODE: 'insufficient_contrast',
        message: 'Insufficient contrast',
        minimum: 4.5,
        origin: 'number',
        path: 'basis.color.default.bg-subtle.$value'.split('.'),
        tokens: ['basis.color.default.bg-subtle', 'basis.color.default.color-document'],
      },
    ]);
  });

  it('passes when legacy tokens are used with proper contrast', () => {
    const testConfig = structuredClone(config);
    testConfig.basis.color.default['bg-subtle'] = {
      $type: 'color',
      $value: '#fff',
    };
    testConfig.basis.color.default['color-document'] = {
      $type: 'color',
      $value: '#000',
    };
    const result = StrictThemeSchema.safeParse(testConfig);
    expect(result.success).toEqual(true);
  });

  it('fails when legacy tokens are used with improper contrast', () => {
    const testConfig = structuredClone(config);
    testConfig.basis.color.default['bg-subtle'] = {
      $type: 'color',
      $value: '#fff',
    };
    testConfig.basis.color.default['color-document'] = {
      $type: 'color',
      $value: '#ccc',
    };
    const result = StrictThemeSchema.safeParse(testConfig);
    expect(result.success).toEqual(false);
    expect(result.error!.issues).toEqual([
      {
        actual: 1.6059285649300712,
        code: 'too_small',
        ERROR_CODE: 'insufficient_contrast',
        message: 'Insufficient contrast',
        minimum: 4.5,
        origin: 'number',
        path: 'basis.color.default.color-document.$value'.split('.'),
        tokens: ['basis.color.default.color-document', 'basis.color.default.bg-subtle'],
      },
      {
        actual: 1.6059285649300712,
        code: 'too_small',
        ERROR_CODE: 'insufficient_contrast',
        message: 'Insufficient contrast',
        minimum: 4.5,
        origin: 'number',
        path: 'basis.color.default.bg-subtle.$value'.split('.'),
        tokens: ['basis.color.default.bg-subtle', 'basis.color.default.color-document'],
      },
    ]);
  });

  it('handles contrast error when background color has no EXTENSION_RESOLVED_FROM', () => {
    const testConfig = structuredClone(config);
    testConfig.basis.color.default['color-document'] = {
      $extensions: {
        [EXTENSION_CONTRAST_WITH]: [
          {
            // Background color without EXTENSION_RESOLVED_FROM
            color: {
              $type: 'color',
              $value: parseColor('#fff'),
              // No EXTENSION_RESOLVED_FROM extension
            },
            expectedRatio: 4.5,
          },
        ],
      },
      $type: 'color',
      $value: '#ccc',
    };
    const result = StrictThemeSchema.safeParse(testConfig);
    expect(result.success).toBeFalsy();
    const contrastErrors = (result.error!.issues as ThemeValidationIssue[]).filter(
      (issue) => issue.ERROR_CODE === ERROR_CODES.INSUFFICIENT_CONTRAST,
    );
    expect(contrastErrors.length).toBeGreaterThan(0);

    const errorWithUndefinedPath = contrastErrors.find(
      (error) => error.path?.length === 1 && error.path[0] === '$value',
    );
    expect(errorWithUndefinedPath).toBeDefined();
  });
});

it('finds both ref and contrast issues at once', () => {
  // This test case exists because previous versions would bail out after the validation found an invalid ref and skipped checking contrast
  const white = parseColor('#ffffff');
  const lightGray = parseColor('#cccccc');

  const themeWithBothErrors: Theme = {
    basis: {
      color: {
        default: {
          // Invalid ref - this token doesn't exist
          'bg-document': {
            $type: 'color',
            $value: '{test.color.nonexistent}',
          },
          // Insufficient contrast - gray on white is too low
          'bg-subtle': {
            $type: 'color',
            $value: '{test.color.white}',
          },
          'color-document': {
            $type: 'color',
            $value: '{test.color.gray}',
          },
        },
      },
    },
    brand: {
      test: {
        name: { $type: 'text', $value: 'Test' },
        color: {
          gray: { $type: 'color', $value: lightGray },
          white: { $type: 'color', $value: white },
        },
      },
    },
  };

  const result = StrictThemeSchema.safeParse(themeWithBothErrors);
  expect(result.success).toBe(false);

  // Should find both types of errors
  const refErrors = (result.error!.issues as ThemeValidationIssue[]).filter(
    (issue) => issue.ERROR_CODE === ERROR_CODES.INVALID_REF,
  );
  const contrastErrors = (result.error!.issues as ThemeValidationIssue[]).filter(
    (issue) => issue.ERROR_CODE === ERROR_CODES.INSUFFICIENT_CONTRAST,
  );

  expect(refErrors.length).toBeGreaterThan(0);
  expect(contrastErrors.length).toBeGreaterThan(0);
});

describe('remove non-token properties', () => {
  it('removes Style Dictionary metadata', () => {
    const theme = {
      basis: {
        color: {
          default: {
            'bg-document': {
              $type: 'color',
              $value: {
                colorSpace: 'srgb',
                components: [0, 0, 0],
              },
              // object
              attributes: {
                category: 'basis',
                item: 'default',
                type: 'color',
              },
              // string
              filePath: 'tokens.json',
              // boolean
              isSource: true,
              // object with tokens inside
              original: {
                $type: 'color',
                $value: {
                  colorSpace: 'srgb',
                  components: [0, 0, 0],
                },
              },
            },
          },
        },
      },
    } satisfies Theme;
    const result = StrictThemeSchema.safeParse(theme);
    expect(result.success).toBeTruthy();
    const actual = result.data?.basis?.color?.['default']?.['bg-document'];
    expect(actual?.$type).toBe('color');
    expect(actual?.$value).toEqual({
      colorSpace: 'srgb',
      components: [0, 0, 0],
    });
    const actualAsRecord = actual as Record<string, unknown>;
    expect(actualAsRecord?.['attributes']).toBeUndefined();
    expect(actualAsRecord?.['filePath']).toBeUndefined();
    expect(actualAsRecord?.['isSource']).toBeUndefined();
    expect(actualAsRecord?.['original']).toBeUndefined();
  });

  it('does not remove information from $extensions (which could hold any sort of data)', () => {
    const theme = {
      basis: {
        color: {
          default: {
            'bg-document': {
              $extensions: {
                [EXTENSION_CONTRAST_WITH]: [
                  {
                    color: {
                      $type: 'color',
                      $value: parseColor('#fff'),
                    },
                    expectedRatio: 4.5,
                  },
                ],
              },
              $type: 'color',
              $value: {
                colorSpace: 'srgb',
                components: [0, 0, 0],
              },
            },
          },
        },
      },
    } satisfies Theme;
    const result = StrictThemeSchema.safeParse(theme);
    expect(result.success).toBeTruthy();
    const extensions = result.data?.basis?.color?.['default']?.['bg-document']?.$extensions;
    expect(Array.isArray(extensions?.[EXTENSION_CONTRAST_WITH])).toBeTruthy();
    expect(extensions?.[EXTENSION_CONTRAST_WITH]).toHaveLength(1);
    const extension = (extensions?.[EXTENSION_CONTRAST_WITH] as ContrastExtension[])[0];
    expect(extension).toBeDefined();
    expect(extension.color.$type).toBe('color');
    expect(extension.expectedRatio).toBe(4.5);
  });

  it('Should not remove top-level non-tokens (like brands)', () => {
    const theme = {
      ams: {
        heading: {
          color: {
            $type: 'color',
            $value: {
              colorSpace: 'srgb',
              components: [0, 0, 0],
            },
          },
        },
      },
    } satisfies Theme;
    const result = StrictThemeSchema.safeParse(theme);
    expect(result.success).toBeTruthy();
    expect(result.data).toEqual(theme);
  });
});

describe('color scale position extension', () => {
  it('adds color-scale-position extensions for tokens with known color names', () => {
    const config = {
      basis: {
        color: {
          default: {
            'bg-document': {
              $type: 'color',
              $value: parseColor('#ffffff'),
            },
            'border-default': {
              $type: 'color',
              $value: parseColor('#cccccc'),
            },
            'color-hover': {
              $type: 'color',
              $value: parseColor('#000000'),
            },
          },
        },
      },
      brand: brandConfig,
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);

    const bgDocToken = result.data?.basis?.color?.['default']?.['bg-document'];
    const colorHoverToken = result.data?.basis?.color?.['default']?.['color-hover'];
    const borderDefaultToken = result.data?.basis?.color?.['default']?.['border-default'];

    // Verify extensions are added for all known color names
    expect(bgDocToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeDefined();
    expect(colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeDefined();
    expect(borderDefaultToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeDefined();

    // Verify the indices are valid numbers
    expect(typeof bgDocToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBe('number');
    expect(typeof colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBe('number');
    expect(typeof borderDefaultToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBe('number');

    // Verify the indices are within the valid range
    const positionCount = COLOR_KEYS.length;
    expect(bgDocToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeGreaterThanOrEqual(0);
    expect(bgDocToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeLessThan(positionCount);
    expect(colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeGreaterThanOrEqual(0);
    expect(colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeLessThan(positionCount);
  });

  it('only adds extensions to tokens with names in COLOR_KEYS', () => {
    const config = {
      basis: {
        color: {
          default: {
            'bg-active': {
              $type: 'color',
              $value: parseColor('#ffffff'),
            },
            'color-hover': {
              $type: 'color',
              $value: parseColor('#000000'),
            },
          },
        },
      },
      brand: brandConfig,
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);

    const bgActiveToken = result.data?.basis?.color?.['default']?.['bg-active'];
    const colorHoverToken = result.data?.basis?.color?.['default']?.['color-hover'];

    // Both tokens should have the extension since they're both in COLOR_KEYS
    expect(bgActiveToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeDefined();
    expect(colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeDefined();

    // Verify the extensions contain valid indices
    expect(typeof bgActiveToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBe('number');
    expect(typeof colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBe('number');

    // Both indices should be within the COLOR_KEYS range
    const positionCount = COLOR_KEYS.length;
    expect(bgActiveToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION] as number).toBeGreaterThanOrEqual(0);
    expect(bgActiveToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION] as number).toBeLessThan(positionCount);
    expect(colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION] as number).toBeGreaterThanOrEqual(0);
    expect(colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION] as number).toBeLessThan(positionCount);
  });
});

describe('validate unitless line-height preference', () => {
  it('Does not report line-heights that use a unitless number', () => {
    const config = {
      basis: {
        text: {
          'line-height': {
            md: {
              $type: 'lineHeight',
              $value: 1.5,
            },
          },
        },
      },
      brand: brandConfig,
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);
  });

  it('flags line-heights that use units', () => {
    const config = {
      basis: {
        text: {
          'line-height': {
            md: {
              $type: 'lineHeight',
              $value: '20px',
            },
          },
        },
      },
      brand: brandConfig,
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(false);
    expect(result.error?.issues).toEqual([
      {
        code: 'invalid_type',
        ERROR_CODE: ERROR_CODES.UNEXPECTED_UNIT,
        expected: 'number',
        message: 'Line-height should be a unitless number (got: "20px")',
        path: ['basis', 'text', 'line-height', 'md', '$value'],
      },
    ]);
  });
});

describe('validate minimum font-size', () => {
  it('passes refs', () => {
    const config = {
      basis: {
        text: {
          'font-size': {
            md: {
              $type: 'dimension',
              $value: {
                unit: 'px',
                value: 18,
              },
            },
          },
        },
      },
      brand: brandConfig,
      nl: {
        button: {
          'font-size': {
            $type: 'dimension',
            $value: '{basis.text.font-size.md}',
          },
        },
      },
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);
  });

  it('Does not report font-sizes that are ok (modern syntax)', () => {
    const config = {
      brand: brandConfig,
      nl: {
        button: {
          'font-size': {
            lg: {
              $type: 'dimension',
              $value: {
                unit: 'rem',
                value: 2,
              },
            },
            md: {
              $type: 'dimension',
              $value: {
                unit: 'px',
                value: 18,
              },
            },
          },
        },
      },
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);
  });

  it('Does not report font-sizes that are ok (legacy syntax)', () => {
    const config = {
      brand: brandConfig,
      nl: {
        button: {
          'font-size': {
            lg: {
              $type: 'dimension',
              $value: '2rem',
            },
            md: {
              $type: 'dimension',
              $value: '18px',
            },
          },
        },
      },
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);
  });

  describe('flags font-sizes that are too small', () => {
    const expectedErrors = [
      {
        actual: '0.8rem',
        code: 'too_small',
        ERROR_CODE: ERROR_CODES.FONT_SIZE_TOO_SMALL,
        message: 'Font-size should be 16px or 1rem minimum (got: "0.8rem")',
        minimum: 16,
        origin: 'number',
        path: ['basis', 'text', 'font-size', 'sm', '$value'],
      },
      {
        actual: '10px',
        code: 'too_small',
        ERROR_CODE: ERROR_CODES.FONT_SIZE_TOO_SMALL,
        message: 'Font-size should be 16px or 1rem minimum (got: "10px")',
        minimum: 16,
        origin: 'number',
        path: ['basis', 'text', 'font-size', 'xs', '$value'],
      },
    ];

    it('flags modern syntax', () => {
      const config = {
        basis: {
          text: {
            'font-size': {
              sm: {
                $type: 'dimension',
                $value: {
                  unit: 'rem',
                  value: 0.8,
                },
              },
              xs: {
                $type: 'dimension',
                $value: {
                  unit: 'px',
                  value: 10,
                },
              },
            },
          },
        },
        brand: brandConfig,
      };
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual(expectedErrors);
    });

    it('flags legacy syntax ($type=dimension, $value=string)', () => {
      const config = {
        basis: {
          text: {
            'font-size': {
              sm: {
                $type: 'dimension',
                $value: '0.8rem',
              },
              xs: {
                $type: 'dimension',
                $value: '10px',
              },
            },
          },
        },
        brand: brandConfig,
      };
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual(expectedErrors);
    });

    it('flags legacy syntax ($type=fontSize, $value=string)', () => {
      const config = {
        basis: {
          text: {
            'font-size': {
              sm: {
                $type: 'fontSize',
                $value: '0.8rem',
              },
              xs: {
                $type: 'fontSize',
                $value: '10px',
              },
            },
          },
        },
        brand: brandConfig,
      };
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual(expectedErrors);
    });

    it('allows legacy syntax ($type=fontSize, $value=string)', () => {
      const config = {
        basis: {
          text: {
            'font-size': {
              sm: {
                $type: 'fontSize',
                $value: '1rem',
              },
              xs: {
                $type: 'fontSize',
                $value: '16px',
              },
            },
          },
        },
        brand: brandConfig,
      };
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
    });
  });
});

describe('strictly validate known basis themes', () => {
  it('Mooi & Anders theme', () => {
    const result = StrictThemeSchema.safeParse(maTokens);
    expect(result.success).toEqual(true);
    expect(result.data).toMatchSnapshot();
  });

  it('Voorbeeld theme', () => {
    const result = StrictThemeSchema.safeParse(voorbeeldTokens);
    expect(result.success).toEqual(true);
    expect(result.data).toMatchSnapshot();
  });

  it('Start theme', () => {
    const result = StrictThemeSchema.safeParse(startTokens);
    expect(result.success).toEqual(true);
    expect(result.data).toMatchSnapshot();
  });
});
