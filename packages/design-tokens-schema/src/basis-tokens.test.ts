import maTokens from '@nl-design-system-community/ma-design-tokens/dist/tokens';
import { describe, test, expect } from 'vitest';
import * as z from 'zod';
import {
  BrandsSchema,
  BrandSchema,
  CommonSchema,
  BasisTokensSchema,
  BasisColorSchema,
  ThemeSchema,
  resolveConfigRefs,
  BasisTextSchema,
  addContrastExtensions,
  EXTENSION_CONTRAST_WITH,
  EXTENSION_RESOLVED_FROM,
  Theme,
} from './basis-tokens';
import { ColorToken, parseColor } from './color-token';

describe('brand', () => {
  test('no brands present', () => {
    expect(BrandsSchema.safeParse({}).success).toBeTruthy();
  });

  test('valid brand name', () => {
    const config = {
      ma: {
        name: {
          $type: 'text',
          $value: 'Mooi & anders',
        },
      },
    };
    expect(BrandsSchema.safeParse(config).success).toBeTruthy();
  });

  test('brand name should be a valid Design Token', () => {
    const config = {
      // invalid identifier
      '$my-brand': {
        name: {
          $type: 'text',
          $value: 'My brand',
        },
      },
    };
    expect(BrandsSchema.safeParse(config).success).toBeFalsy();
  });

  describe('single brand', () => {
    test('empty color config', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {},
      };
      expect(BrandSchema.safeParse(config).success).toBeTruthy();
    });

    test('missing color config', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        // missing color
      };
      expect(BrandSchema.safeParse(config).success).toBeTruthy();
    });

    test('missing name', () => {
      const config = {
        color: {},
      };
      expect(BrandSchema.safeParse(config).success).toBeFalsy();
    });

    test('incorrect name type', () => {
      const config = {
        name: {
          $type: 'string', // instead of 'text'
          $value: 'invalid-brand',
        },
      };
      expect(BrandSchema.safeParse(config).success).toBeFalsy();
    });
  });

  describe('brand colors', () => {
    const modernWhite = {
      $type: 'color',
      $value: {
        alpha: 1,
        colorSpace: 'srgb',
        components: [1, 1, 1],
      },
    };

    test('top-level colors with legacy color', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {
          white: {
            $type: 'color',
            $value: '#FFFFFF',
          },
        },
      };
      const result = BrandSchema.safeParse(config);
      expect.soft(result.success).toBeTruthy();
      expect.soft(result.data?.color?.['white']).toEqual(modernWhite);
    });

    test('top-level colors with modern color', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {
          white: modernWhite,
        },
      };
      const result = BrandSchema.safeParse(config);
      expect.soft(result.success).toBeTruthy();
      // Nothing had to change
      expect.soft(result.data).toEqual(config);
    });

    test('nested colors with legacy color format', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {
          indigo: {
            '1': {
              $type: 'color',
              $value: '#FFFFFF',
            },
          },
        },
      };
      const result = BrandSchema.safeParse(config);
      expect.soft(result.success).toBeTruthy();
      expect.soft(result.data?.color?.['indigo']).toEqual({ 1: modernWhite });
    });

    test('nested colors with modern color format', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {
          indigo: {
            '1': modernWhite,
          },
        },
      };
      const result = BrandSchema.safeParse(config);
      expect.soft(result.success).toBeTruthy();
      expect.soft(result.data).toEqual(config);
    });

    test('fails on invalid top-level colors', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {
          white: {
            $type: 'color',
            $value: 'non-existent-color',
          },
        },
      };
      const result = BrandSchema.safeParse(config);
      expect.soft(result.success).toBeFalsy();
    });

    test('fails on invalid nested colors', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {
          indigo: {
            '1': {
              $type: 'color',
              $value: 'non-existent-color',
            },
          },
        },
      };
      const result = BrandSchema.safeParse(config);
      expect.soft(result.success).toBeFalsy();
    });

    test('fails on invalid color name', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {
          // No . or {} allowed in color names
          'indigo.10': {
            $type: 'color',
            $value: 'indigo',
          },
        },
      };
      const result = BrandSchema.safeParse(config);
      expect.soft(result.success).toBeFalsy();
    });
  });
});

describe('common', () => {
  test('config is optional`', () => {
    expect(CommonSchema.safeParse({}).success).toBeTruthy();
  });

  test('allows unknown properties', () => {
    expect(CommonSchema.safeParse({ unknownField: {} }).success).toBeTruthy();
  });

  describe('basis', () => {
    test('basis config allows unknown properties', () => {
      expect(BasisTokensSchema.safeParse({ unknownField: {} }).success).toBeTruthy();
    });

    describe('color', () => {
      test('allows known color names', () => {
        expect(BasisColorSchema.safeParse({ 'accent-1': {} }).success).toBeTruthy();
      });

      test('does not allow unknown properties', () => {
        expect(BasisColorSchema.safeParse({ unknownField: {} }).success).toBeFalsy();
      });

      test('allows references to other tokens in the schema', () => {
        const config = {
          default: {
            'bg-document': {
              $type: 'color',
              $value: '{ma.color.indigo.1}',
            },
          },
        };
        const result = BasisColorSchema.safeParse(config);
        expect.soft(result.success).toBeTruthy();
      });
    });
  });
});

describe('theme', () => {
  const brandConfig = {
    ma: {
      name: {
        $type: 'text',
        $value: 'Mooi & Anders',
      },
      color: {
        indigo: {
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
    test('adds contrast-with extensions for tokens that we know', () => {
      const config = {
        brand: brandConfig,
        common: {
          basis: {
            color: {
              default: {
                'color-document': {
                  $type: 'color',
                  $value: `{ma.color.indigo.5}`,
                  // the transformation will add an $extension here
                },
              },
            },
          },
        },
      };
      const result = ThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
      expect(result.data!.common.basis?.color?.default?.['color-document']?.$extensions).toMatchObject({
        [EXTENSION_CONTRAST_WITH]: [
          {
            color: {
              $type: 'color',
              $value: '{common.basis.color.default.bg-subtle}',
            },
            ratio: 4.5,
          },
        ],
      });
    });

    test('contrast-with extensions do not mess with existing extensions', () => {
      const config = {
        brand: brandConfig,
        common: {
          basis: {
            color: {
              default: {
                'color-document': {
                  $extensions: {
                    // the transformation will add an extra contrast color here
                    [EXTENSION_CONTRAST_WITH]: [
                      {
                        color: {
                          $type: 'color',
                          $value: '{common.basis.color.basis.default.bg-subtle}',
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
        },
      };
      const result = ThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
      expect(
        result.data!.common.basis.color?.default?.['color-document']?.$extensions?.[EXTENSION_CONTRAST_WITH],
      ).toHaveLength(2);
    });
  });

  describe('resolving Design Token refs', () => {
    describe('resolve color ref', () => {
      const config = {
        brand: brandConfig,
        common: {
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
        },
      };

      test('does not mutate the input config', () => {
        const originalConfig = structuredClone(config);
        ThemeSchema.safeParse(config);
        const originalBg = originalConfig.common.basis.color.default['bg-document'].$value;
        const bgAfterValidation = config.common.basis.color.default['bg-document'].$value;
        expect.soft(originalBg).toEqual(bgAfterValidation);
      });

      test('validates the input', () => {
        const result = ThemeSchema.safeParse(config);
        expect.soft(BrandSchema.safeParse(config.brand.ma).success).toBeTruthy();
        expect.soft(result.success).toBeTruthy();
      });

      test('returns the schema with refs replaced by actual values', () => {
        const result = ThemeSchema.safeParse(config);
        const expectedCommonColor = brandConfig.ma.color.indigo[5];
        expect.soft(result.data?.common?.basis?.color?.default?.['bg-document']).toEqual({
          ...expectedCommonColor,
          $extensions: {
            [EXTENSION_RESOLVED_FROM]: 'ma.color.indigo.5',
          },
        });
      });
    });

    test('marks as invalid if resolving to an nonexistent object', () => {
      const config = {
        brand: brandConfig,
        common: {
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
        },
      };

      expect.soft(() => ThemeSchema.safeParse(config)).not.toThrowError();
      const result = ThemeSchema.safeParse(config);
      expect.soft(result.success).toBeFalsy();
    });

    test('marks as invalid if resolving to an existing object without a $value property', () => {
      const config = {
        brand: brandConfig,
        common: {
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
        },
      };

      expect.soft(() => ThemeSchema.safeParse(config)).not.toThrowError();
      const result = ThemeSchema.safeParse(config);
      expect.soft(result.success).toBeFalsy();
      expect.soft(z.flattenError(result.error!)).toMatchObject({
        formErrors: ['Invalid token reference: expected "ma.color.indigo" to have a "$value" property'],
      });
    });

    test('marks as invalid when a font-family token reference points to an existing non-font-family token', () => {
      const config = {
        brand: brandConfig,
        common: {
          basis: {
            heading: {
              'font-family': {
                $type: 'fontFamily',
                // this points to a color token instead of a fontFamily
                $value: '{ma.color.indigo.5}',
              },
            },
          },
        },
      };

      const result = ThemeSchema.safeParse(config);
      expect.soft(result.success).toEqual(false);
      expect.soft(z.flattenError(result.error!)).toMatchObject({
        formErrors: [
          `Invalid token reference: $type "fontFamily" of "{"$type":"fontFamily","$value":"{ma.color.indigo.5}"}" does not match the $type on reference {ma.color.indigo.5} => {"$type":"color","$value":{"alpha":1,"colorSpace":"srgb","components":[0,0,0]}}`,
        ],
      });
    });
  });

  describe('validating color contrast', () => {
    // Hex notation + parseColor() because it's shorter than writing color tokens and the IDE shows a small color preview
    const black = { $type: 'color', $value: parseColor('#000') } satisfies ColorToken;
    const white = { $type: 'color', $value: parseColor('#fff') } satisfies ColorToken;
    const lightGray = { $type: 'color', $value: parseColor('#ccc') } satisfies ColorToken;
    const config = {
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
      common: {
        basis: {
          color: {
            // This is where each test case will write their own needs
            default: Object.create(null),
          },
        },
      },
    } satisfies Theme;

    test.only('passes when contrast is sufficient', () => {
      const testConfig = structuredClone(config);
      testConfig.common.basis.color.default['border-default'] = {
        $type: 'color',
        $value: '{brand.ma.color.black}',
      };
      testConfig.common.basis.color.default['bg-default'] = {
        $type: 'color',
        $value: '{brand.ma.color.white}',
      };
      const result = ThemeSchema.safeParse(testConfig);
      expect(result.success).toEqual(true);
    });

    test.only('fails when color-document vs bg-subtle do not have enough contrast', () => {
      const testConfig = structuredClone(config);
      testConfig.common.basis.color.default['bg-subtle'] = {
        $type: 'color',
        $value: '{brand.ma.color.white}',
      };
      testConfig.common.basis.color.default['color-document'] = {
        $type: 'color',
        $value: '{brand.ma.color.gray.2}',
      };
      const result = ThemeSchema.safeParse(testConfig);
      expect.soft(result.success).toBeFalsy();
      expect.soft(result.error!.issues).toEqual([
        {
          code: 'too_small',
          ERROR_CODE: 'insufficient_contrast',
          message:
            'Not enough contrast between `{common.basis.color.default.color-document}` (#cccccc) and `{common.basis.color.default.bg-subtle}` (#ffffff). Calculated contrast: 1.6059285649300712, need 4.5',
          minimum: 4.5,
          origin: 'number',
          path: 'common.basis.color.default.color-document.$value'.split('.'),
        },
      ]);
    });

    test.only('passes when legacy tokens are used with proper contrast', () => {
      const testConfig = structuredClone(config);
      testConfig.common.basis.color.default['bg-subtle'] = {
        $type: 'color',
        $value: '#fff',
      };
      testConfig.common.basis.color.default['color-document'] = {
        $type: 'color',
        $value: '#000',
      };
      const result = ThemeSchema.safeParse(testConfig);
      expect.soft(result.success).toEqual(true);
    });

    test.only('fails when legacy tokens are used with improper contrast', () => {
      const testConfig = structuredClone(config);
      testConfig.common.basis.color.default['bg-subtle'] = {
        $type: 'color',
        $value: '#fff',
      };
      testConfig.common.basis.color.default['color-document'] = {
        $type: 'color',
        $value: '#ccc',
      };
      const result = ThemeSchema.safeParse(testConfig);
      expect.soft(result.success).toEqual(false);
      expect.soft(result.error!.issues).toEqual([
        {
          code: 'too_small',
          ERROR_CODE: 'insufficient_contrast',
          message:
            'Not enough contrast between `{common.basis.color.default.color-document}` (#cccccc) and `{common.basis.color.default.bg-subtle}` (#ffffff). Calculated contrast: 1.6059285649300712, need 4.5',
          minimum: 4.5,
          origin: 'number',
          path: 'common.basis.color.default.color-document.$value'.split('.'),
        },
      ]);
    });
  });
});

describe('end-to-end tests of known basis themes', () => {
  describe('ma-theme', () => {
    test('basis.color is valid', () => {
      const result = BasisColorSchema.safeParse(maTokens.basis.color);
      expect.soft(result.success).toEqual(true);
    });

    test('basis.text is valid', () => {
      const result = BasisTextSchema.safeParse(maTokens.basis.text);
      expect.soft(result.success).toEqual(true);
    });

    test('basis is valid', async () => {
      const result = BasisTokensSchema.safeParse(maTokens.basis);
      expect.soft(result.success).toEqual(true);
      await expect.soft(result.data).toMatchFileSnapshot('../test/snapshots/ma-theme.basis.tokens.jsonc');
    });
  });
});
