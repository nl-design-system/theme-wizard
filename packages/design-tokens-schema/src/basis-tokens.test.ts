import { describe, test, expect } from 'vitest';
import {
  JsonRefSchema,
  BrandsSchema,
  BrandSchema,
  CommonSchema,
  BasisTokensSchema,
  BasisColorSchema,
} from './basis-tokens';

describe('json ref', () => {
  test('allows valid ref with a single path', () => {
    const result = JsonRefSchema.safeParse('{ma}');
    expect.soft(result.success).toBeTruthy();
    expect.soft(result.data).toEqual('{ma}');
  });

  test('allows valid ref with nested paths', () => {
    const result = JsonRefSchema.safeParse('{ma.color.white}');
    expect.soft(result.success).toBeTruthy();
    expect.soft(result.data).toEqual('{ma.color.white}');
  });

  test('disallows non-ref-like items', () => {
    expect.soft(JsonRefSchema.safeParse('{}').success).toBeFalsy();
    expect.soft(JsonRefSchema.safeParse('{.}').success).toBeFalsy();
    expect.soft(JsonRefSchema.safeParse('ma.color').success).toBeFalsy();
  });
});

describe('brand', () => {
  describe('valid cases', () => {
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
  });

  describe('invalid cases', () => {
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
  });

  describe('single brand', () => {
    describe('valid cases', () => {
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
    });

    describe('invalid cases', () => {
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
  });

  describe('brand colors', () => {
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
      expect.soft(result.data).toEqual({
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {
          // Color is upgraded to modern format
          white: {
            $type: 'color',
            $value: {
              alpha: 1,
              colorSpace: 'srgb',
              components: [1, 1, 1],
            },
          },
        },
      });
    });

    test('top-level colors with modern color', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {
          white: {
            $type: 'color',
            $value: {
              alpha: 1,
              colorSpace: 'srgb',
              components: [1, 1, 1],
            },
          },
        },
      };
      const result = BrandSchema.safeParse(config);
      expect.soft(result.success).toBeTruthy();
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
      expect.soft(result.data).toEqual({
        name: {
          $type: 'text',
          $value: 'my-brand',
        },
        color: {
          // Color is upgraded to modern format
          indigo: {
            '1': {
              $type: 'color',
              $value: {
                alpha: 1,
                colorSpace: 'srgb',
                components: [1, 1, 1],
              },
            },
          },
        },
      });
    });

    test('nested colors with modern color format', () => {
      const config = {
        name: {
          $type: 'text',
          $value: 'my-brand',
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

describe.todo('full Theme', () => {});
