import maTokens from '@nl-design-system-community/ma-design-tokens/dist/tokens';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens';
import voorbeeldTokens from '@nl-design-system-unstable/voorbeeld-design-tokens/dist/tokens';
import { describe, it, expect } from 'vitest';
import * as z from 'zod';
import {
  BrandsSchema,
  BrandSchema,
  BasisTokensSchema,
  BasisColorSchema,
  EXTENSION_CONTRAST_WITH,
  EXTENSION_RESOLVED_AS,
  Theme,
  StrictThemeSchema,
  ERROR_CODES,
  ThemeValidationIssue,
} from './basis-tokens';
import { ColorToken, parseColor } from './color-token';

describe('brand', () => {
  it('no brands present', () => {
    expect(BrandsSchema.safeParse({}).success).toBeTruthy();
  });

  it('valid brand name', () => {
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

  it('brand name should be a valid Design Token', () => {
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
    it('empty color config', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {},
      };
      expect(BrandSchema.safeParse(config).success).toBeTruthy();
    });

    it('missing color config', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        // missing color
      };
      expect(BrandSchema.safeParse(config).success).toBeTruthy();
    });

    it('missing name', () => {
      const config = {
        color: {},
      };
      expect(BrandSchema.safeParse(config).success).toBeFalsy();
    });

    it('incorrect name type', () => {
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

    it('top-level colors with legacy color', () => {
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

    it('top-level colors with modern color', () => {
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

    it('nested colors with legacy color format', () => {
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

    it('nested colors with modern color format', () => {
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

    it('fails on invalid top-level colors', () => {
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

    it('fails on invalid nested colors', () => {
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

    it('fails on invalid color name', () => {
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

describe('basis', () => {
  it('basis config allows unknown properties', () => {
    expect(BasisTokensSchema.safeParse({ unknownField: {} }).success).toBeTruthy();
  });

  describe('color', () => {
    it('allows known color names', () => {
      expect(BasisColorSchema.safeParse({ 'accent-1': {} }).success).toBeTruthy();
    });

    it('does not allow unknown properties', () => {
      expect(BasisColorSchema.safeParse({ unknownField: {} }).success).toBeFalsy();
    });

    it('allows references to other tokens in the schema', () => {
      const config = {
        default: {
          'bg-document': {
            $type: 'color',
            $value: '{brand.ma.color.indigo.1}',
          },
        },
      };
      const result = BasisColorSchema.safeParse(config);
      expect.soft(result.success).toEqual(true);
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
      expect(result.data?.basis?.color?.default?.['color-document']?.$extensions).toMatchObject({
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
        result.data?.basis?.color?.default?.['color-document']?.$extensions?.[EXTENSION_CONTRAST_WITH],
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
      expect(result.data?.basis?.color?.default?.['color-document']?.$extensions?.[EXTENSION_CONTRAST_WITH]).toEqual(
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
        expect.soft(result.data?.basis?.color?.default?.['bg-document']).toEqual({
          ...config.basis.color.default['bg-document'],
          $extensions: {
            [EXTENSION_RESOLVED_AS]: expectedColor.$value,
          },
        });
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
          `Invalid token reference: $type "fontFamily" of "{"$type":"fontFamily","$value":"{ma.color.indigo.5}"}" does not match the $type on reference {ma.color.indigo.5}. Types "fontFamily" and "color" do not match.`,
        ],
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
          code: 'too_small',
          ERROR_CODE: 'insufficient_contrast',
          message: `Not enough contrast between "{basis.color.default.color-document}" (#cccccc) and "{basis.color.default.bg-subtle}" -> "{ma.color.white}" (#ffffff). Calculated contrast: 1.61, need 4.5`,
          minimum: 4.5,
          origin: 'number',
          path: 'basis.color.default.color-document.$value'.split('.'),
        },
        {
          code: 'too_small',
          ERROR_CODE: 'insufficient_contrast',
          message: `Not enough contrast between "{basis.color.default.bg-subtle}" (#ffffff) and "{basis.color.default.color-document}" (#cccccc). Calculated contrast: 1.61, need 4.5`,
          minimum: 4.5,
          origin: 'number',
          path: 'basis.color.default.bg-subtle.$value'.split('.'),
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
          code: 'too_small',
          ERROR_CODE: 'insufficient_contrast',
          message: `Not enough contrast between "{basis.color.default.color-document}" (#cccccc) and "{basis.color.default.bg-subtle}" (#ffffff). Calculated contrast: 1.61, need 4.5`,
          minimum: 4.5,
          origin: 'number',
          path: 'basis.color.default.color-document.$value'.split('.'),
        },
        {
          code: 'too_small',
          ERROR_CODE: 'insufficient_contrast',
          message: `Not enough contrast between "{basis.color.default.bg-subtle}" (#ffffff) and "{basis.color.default.color-document}" (#cccccc). Calculated contrast: 1.61, need 4.5`,
          minimum: 4.5,
          origin: 'number',
          path: 'basis.color.default.bg-subtle.$value'.split('.'),
        },
      ]);
    });
  });

  it('finding both ref and contrast issues at once', () => {
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
});

describe('strictly validate known basis themes', () => {
  it('Mooi & Anders theme', () => {
    const result = StrictThemeSchema.safeParse(maTokens);
    if (result.success === false) {
      console.error(z.prettifyError(result.error));
    }
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
