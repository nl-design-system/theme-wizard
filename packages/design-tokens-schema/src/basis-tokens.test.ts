import { describe, it, expect } from 'vitest';
import { BrandsSchema, BrandSchema, BasisTokensSchema, BasisColorSchema } from './basis-tokens';

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
