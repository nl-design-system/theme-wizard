import { describe, test, expect } from 'vitest';
import {
  TokenRefSchema,
  BrandsSchema,
  BrandSchema,
  CommonSchema,
  BasisTokensSchema,
  BasisColorSchema,
  ThemeSchema,
  resolveConfigRefs,
} from './basis-tokens';

describe('design token ref', () => {
  test('allows valid ref with a single path', () => {
    const result = TokenRefSchema.safeParse('{ma}');
    expect.soft(result.success).toBeTruthy();
    expect.soft(result.data).toEqual('{ma}');
  });

  test('allows valid ref with nested paths', () => {
    const result = TokenRefSchema.safeParse('{ma.color.white}');
    expect.soft(result.success).toBeTruthy();
    expect.soft(result.data).toEqual('{ma.color.white}');
  });

  test('disallows non-ref-like items', () => {
    expect.soft(TokenRefSchema.safeParse('{}').success).toBeFalsy();
    expect.soft(TokenRefSchema.safeParse('{.}').success).toBeFalsy();
    expect.soft(TokenRefSchema.safeParse('ma.color').success).toBeFalsy();
  });
});

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

      test('allows JSON refs', () => {
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

  describe('resolving Design Token refs', () => {
    test('resolve color ref', () => {
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
      const originalConfig = structuredClone(config);
      const result = ThemeSchema.transform(resolveConfigRefs).safeParse(config);

      // Full schema validation
      expect.soft(BrandSchema.safeParse(config.brand.ma).success).toBeTruthy();
      expect.soft(result.success).toBeTruthy();

      // Check parse output
      const expectedCommonColor = brandConfig.ma.color.indigo[5];
      expect.soft(result.data?.common?.basis?.color?.default?.['bg-document']).toEqual(expectedCommonColor);

      // Make sure we don't mutate the original input
      const originalBg = originalConfig.common.basis.color.default['bg-document'].$value;
      const bgAfterValidation = config.common.basis.color.default['bg-document'].$value;
      expect.soft(originalBg).toEqual(bgAfterValidation);
    });

    test('does not throw when a ref can not be resolved', () => {
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
  });
});
