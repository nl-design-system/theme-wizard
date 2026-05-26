import maTokens from '@nl-design-system-community/ma-design-tokens/dist/tokens';
import maSourceTokens from '@nl-design-system-community/ma-design-tokens/src/tokens.json';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens';
import startSourceTokens from '@nl-design-system-unstable/start-design-tokens/figma/start.tokens.json';
import voorbeeldTokens from '@nl-design-system-unstable/voorbeeld-design-tokens/dist/tokens';
import voorbeeldSourceTokens from '@nl-design-system-unstable/voorbeeld-design-tokens/figma/voorbeeld.tokens.json';
import dlv from 'dlv';
import { dset } from 'dset';
import { it, describe, expect } from 'vitest';
import { BrandSchema, COLOR_KEYS } from './basis-tokens';
import { EXTENSION_RESOLVED_AS, EXTENSION_RESOLVED_FROM } from './resolve-refs';
import {
  type Theme,
  ThemeSchema,
  StrictThemeSchema,
  addBasisContrastExtensions,
  EXTENSION_CONTRAST_WITH,
  EXTENSION_COLOR_SCALE_POSITION,
  type ContrastExtension,
  excludeParentKeys,
} from './theme';
import { parseColor, type ColorToken } from './tokens/color-token';
import { EXTENSION_TOKEN_SUBTYPE } from './upgrade-legacy-tokens';
import { ERROR_CODES, type ThemeValidationIssue } from './validation-issue';
import { MINIMUM_LINE_HEIGHT } from './validations';

const getBasis = () => {
  const basis = structuredClone((startTokens as Record<string, unknown>)['basis']) as Record<string, unknown>;
  // start-design-tokens v6.0.1 vs basis-design-tokens v3.1.0 mismatches:
  // - border-radius.none and space.none added in start v6 but not in basis schema
  delete (basis['border-radius'] as Record<string, unknown>)['none'];
  delete (basis['space'] as Record<string, unknown>)['none'];
  // - focus.outline-offset has $type:"other" in start v6, but basis schema expects dimension
  dset(basis, 'focus.outline-offset', { $type: 'dimension', $value: { unit: 'px', value: 0 } });
  // - tokens missing from start v6 that are required by basis schema
  dset(basis, 'border-radius.square', { $type: 'dimension', $value: { unit: 'px', value: 0 } });
  dset(basis, 'form-control.focus.accent-color', {
    $type: 'color',
    $value: { alpha: 1, colorSpace: 'srgb', components: [0, 0, 0] },
  });
  dset(basis, 'form-control.invalid.accent-color', {
    $type: 'color',
    $value: { alpha: 1, colorSpace: 'srgb', components: [0, 0, 0] },
  });
  dset(basis, 'form-control.read-only.accent-color', {
    $type: 'color',
    $value: { alpha: 1, colorSpace: 'srgb', components: [0, 0, 0] },
  });
  return basis;
};

const createToken = (type: string, value: unknown, extensions?: Record<PropertyKey, unknown>) => {
  return {
    $extensions: extensions,
    $type: type,
    $value: value,
  };
};

const createDimension = (value: number, unit: 'rem' | 'px') => {
  return createToken('dimension', { unit, value });
};

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

describe('upgrades legacy colors', () => {
  it('converts legacy color strings in basis tokens', () => {
    const config = { basis: getBasis() };
    dset(config, 'basis.color.accent-1.bg-default', { $type: 'color', $value: '#ffffff' });
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toBe(true);
    const color = dlv(result.data, 'basis.color.accent-1.bg-default.$value');
    expect(color).toEqual({
      alpha: 1,
      colorSpace: 'srgb',
      components: [1, 1, 1],
    });
  });

  it('converts legacy color strings in brand tokens', () => {
    const config = {
      ma: {
        color: {
          white: {
            $type: 'color',
            $value: '#FFFFFF',
          },
        },
      },
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toBe(true);
    const color = dlv(result.data, 'ma.color.white.$value');
    expect(color).toEqual({
      alpha: 1,
      colorSpace: 'srgb',
      components: [1, 1, 1],
    });
  });

  it('converts nested legacy color strings in brand tokens', () => {
    const config = {
      ma: {
        color: {
          indigo: {
            '1': {
              $type: 'color',
              $value: '#FFFFFF',
            },
          },
        },
      },
    };
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toBe(true);
    const color = dlv(result.data, 'ma.color.indigo.1.$value');
    expect(color).toEqual({
      alpha: 1,
      colorSpace: 'srgb',
      components: [1, 1, 1],
    });
  });
});

describe('adding contrast-with extensions', () => {
  it('adds contrast-with extensions for tokens that we know', () => {
    const config = { basis: getBasis(), brand: brandConfig };
    dset(config, 'basis.color.default.bg-subtle', { $type: 'color', $value: '{ma.color.indigo.1}' });
    dset(config, 'basis.color.default.color-document', { $type: 'color', $value: '{ma.color.indigo.5}' });
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);
    expect(dlv(result.data, 'basis.color.default.color-document.$extensions')).toMatchObject({
      [EXTENSION_CONTRAST_WITH]: [
        {
          color: {
            $extensions: {
              [EXTENSION_RESOLVED_AS]: brandConfig.ma.color.indigo['1'].$value,
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
    const config = { basis: getBasis(), brand: brandConfig };
    dset(config, 'basis.color.default.bg-subtle', { $type: 'color', $value: '{ma.color.indigo.1}' });
    dset(config, 'basis.color.default.color-document', {
      $extensions: {
        [EXTENSION_CONTRAST_WITH]: [{ color: { $type: 'color', $value: '{ma.color.indigo.5}' }, ratio: 1 }],
      },
      $type: 'color',
      $value: '{ma.color.indigo.5}',
    });
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);
    expect(dlv(result.data, 'basis.color.default.color-document.$extensions')?.[EXTENSION_CONTRAST_WITH]).toHaveLength(
      2,
    );
  });

  it('does not add extension when corresponding token does not exist', () => {
    // color-subtle has no entry in the CONTRAST map, so no contrast-with extension is added
    const config = { basis: getBasis(), brand: brandConfig };
    dset(config, 'basis.color.default.color-subtle', { $type: 'color', $value: '{ma.color.indigo.5}' });
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);
    expect(dlv(result.data, 'basis.color.default.color-subtle.$extensions')?.[EXTENSION_CONTRAST_WITH]).toEqual(
      undefined,
    );
  });

  it('skips extension when background token is absent from config', () => {
    // color-document IS in the CONTRAST map (needs bg-subtle), but bg-subtle is not set
    const config: Record<string, unknown> = {};
    dset(config, 'basis.color.default.color-document', { $type: 'color', $value: parseColor('#000') });
    addBasisContrastExtensions(config);
    expect(dlv(config, 'basis.color.default.color-document.$extensions')?.[EXTENSION_CONTRAST_WITH]).toBeUndefined();
  });
});

describe('resolving Design Token refs', () => {
  describe('resolve color ref', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = { basis: getBasis(), brand: brandConfig };
    dset(config, 'basis.color.default.bg-document', { $type: 'color', $value: '{ma.color.indigo.5}' });

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
        .soft(dlv(result.data, 'basis.color.default.bg-document'))
        .toMatchObject(config.basis.color.default['bg-document']);

      expect
        .soft(dlv(result.data, 'basis.color.default.bg-document.$extensions')?.[EXTENSION_RESOLVED_AS])
        .toEqual(expectedColor.$value);
    });
  });

  it('marks as invalid if resolving to an nonexistent object', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = { basis: getBasis(), brand: brandConfig };
    // Use tokens not involved in contrast pairs to avoid crashing the contrast checker with invalid refs
    dset(config, 'basis.color.default.bg-document', { $type: 'color', $value: '{non.existent.token}' });
    dset(config, 'basis.color.default.color-subtle', { $type: 'color', $value: '{incomplete.ref' });

    expect.soft(() => StrictThemeSchema.safeParse(config)).not.toThrowError();
    const result = StrictThemeSchema.safeParse(config);
    expect.soft(result.success).toBeFalsy();
  });

  it('marks as invalid if resolving to an existing object without a $value property', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = { basis: getBasis(), brand: brandConfig };
    dset(config, 'basis.color.default.bg-document', { $type: 'color', $value: '{ma.color.indigo}' });

    expect(() => StrictThemeSchema.safeParse(config)).not.toThrowError();
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toBeFalsy();
    expect.soft(result.error!.issues).toMatchObject([
      {
        code: 'custom',
        ERROR_CODE: 'invalid_ref',
        message:
          'Invalid token reference: expected "{ma.color.indigo}" to have a "$value" and "$type" property (referenced from "basis.color.default.bg-document")',
        path: ['basis', 'color', 'default', 'bg-document'],
      },
    ]);
  });

  it('marks as invalid when a font-family token reference points to an existing non-font-family token', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = { basis: getBasis(), brand: brandConfig };
    dset(config, 'basis.heading.font-family', {
      $type: 'fontFamily',
      // this points to a color token instead of a fontFamily
      $value: '{ma.color.indigo.5}',
    });

    const result = StrictThemeSchema.safeParse(config);
    expect.soft(result.success).toEqual(false);
    expect.soft(result.error!.issues).toMatchObject([
      {
        code: 'custom',
        ERROR_CODE: 'invalid_ref',
        message:
          'Invalid token reference: $type "fontFamily" of "{"$type":"fontFamily","$value":"{ma.color.indigo.5}"}" at "basis.heading.font-family" does not match the $type on reference {ma.color.indigo.5}. Types "fontFamily" and "color" do not match.',
        path: ['basis', 'heading', 'font-family'],
      },
    ]);
  });
});

describe('Style Dictionary specifics', () => {
  const modernWhite = {
    alpha: 1,
    colorSpace: 'srgb',
    components: [1, 1, 1],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any = { basis: getBasis(), ma: { color: { white: { $type: 'color', $value: modernWhite } } } };
  dset(config, 'basis.color.accent-1.bg-default', {
    $type: 'color',
    $value: modernWhite,
    original: { $type: 'color', $value: '{ma.color.white}' },
  });

  it('replaces token.$value with token.original.$value', () => {
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toBe(true);
    expect(dlv(result.data, 'basis.color.accent-1.bg-default.$value')).toBe('{ma.color.white}');
  });

  it('ignores incomplete `original` objects', () => {
    const incompleteConfig = structuredClone(config);
    delete incompleteConfig.basis.color['accent-1']['bg-default'].original.$value;
    const result = StrictThemeSchema.safeParse(incompleteConfig);
    expect(result.success).toBe(true);
    expect(dlv(result.data, 'basis.color.accent-1.bg-default.$value')).toEqual({
      alpha: 1,
      colorSpace: 'srgb',
      components: [1, 1, 1],
    });
  });

  it('adds resolved-as extension in StrictTheme', () => {
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toBe(true);
    expect(dlv(result.data, 'basis.color.accent-1.bg-default.$value')).toBe('{ma.color.white}');
    expect(dlv(result.data, 'basis.color.accent-1.bg-default.$extensions')?.[EXTENSION_RESOLVED_AS]).toEqual({
      alpha: 1,
      colorSpace: 'srgb',
      components: [1, 1, 1],
    });
  });
});

describe('ThemeSchema (non-strict preprocessing)', () => {
  const modernWhite = { alpha: 1, colorSpace: 'srgb', components: [1, 1, 1] };

  it('replaces token.$value with token.original.$value', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = {};
    dset(config, 'ma.color.white', {
      $type: 'color',
      $value: modernWhite,
      original: { $type: 'color', $value: '{ma.color.indigo.1}' },
    });
    const result = ThemeSchema.safeParse(config);
    expect(result.success).toBe(true);
    expect(dlv(result.data, 'ma.color.white.$value')).toBe('{ma.color.indigo.1}');
  });

  it('does not mutate the input', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = {};
    dset(config, 'ma.color.white', {
      $type: 'color',
      $value: modernWhite,
      original: { $type: 'color', $value: '{ma.color.indigo.1}' },
    });
    const originalValue = structuredClone(config.ma.color.white.$value);
    ThemeSchema.safeParse(config);
    expect(config.ma.color.white.$value).toEqual(originalValue);
  });
});

describe('validating color contrast', () => {
  // parseColor() because it's shorter than writing color tokens and the IDE shows a small color preview
  const black = { $type: 'color', $value: parseColor('#000') } satisfies ColorToken;
  const white = { $type: 'color', $value: parseColor('#fff') } satisfies ColorToken;
  const lightGray = { $type: 'color', $value: parseColor('#ccc') } satisfies ColorToken;

  describe('basis tokens', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = {
      basis: getBasis(),
      brand: {
        ma: {
          name: { $type: 'text', $value: 'Mooi & Anders' },
          color: { black, gray: { 2: lightGray }, white },
        },
      },
    };

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

  describe('component tokens', () => {
    it('passes when contrast is sufficient', () => {
      const config = {};
      dset(config, 'clippy.button.color', black);
      dset(config, 'clippy.button.background-color', white);
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    const expectedIssues = [
      {
        actual: 1.6059285649300712,
        code: 'too_small',
        ERROR_CODE: 'insufficient_contrast',
        message: 'Insufficient contrast',
        minimum: 4.5,
        origin: 'number',
        path: 'clippy.button.color.$value'.split('.'),
        tokens: ['clippy.button.color', 'clippy.button.background-color'],
      },
      {
        actual: 1.6059285649300712,
        code: 'too_small',
        ERROR_CODE: 'insufficient_contrast',
        message: 'Insufficient contrast',
        minimum: 4.5,
        origin: 'number',
        path: 'clippy.button.background-color.$value'.split('.'),
        tokens: ['clippy.button.background-color', 'clippy.button.color'],
      },
    ];

    it('fails when contrast is insufficient (absolute values)', () => {
      const config = {};
      dset(config, 'clippy.button.color', lightGray);
      dset(config, 'clippy.button.background-color', white);
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error!.issues).toEqual(expectedIssues);
    });

    it('fails when contrast is insufficient (ref values)', () => {
      const config = { basis: getBasis() };
      dset(config, 'basis.color.default.color-subtle', lightGray);
      dset(config, 'basis.color.default.bg-default', white);
      dset(config, 'clippy.button.color', { $type: 'color', $value: '{basis.color.default.color-subtle}' });
      dset(config, 'clippy.button.background-color', { $type: 'color', $value: '{basis.color.default.bg-default}' });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error!.issues).toEqual(expectedIssues);
    });

    it('has custom contrast settinf for disabled states', () => {
      const config = {};
      dset(config, 'clippy.button.disabled.color', lightGray);
      dset(config, 'clippy.button.disabled.background-color', white);
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error!.issues).toEqual([
        {
          actual: 1.6059285649300712,
          code: 'too_small',
          ERROR_CODE: 'insufficient_contrast',
          message: 'Insufficient contrast',
          minimum: 3,
          origin: 'number',
          path: 'clippy.button.disabled.color.$value'.split('.'),
          tokens: ['clippy.button.disabled.color', 'clippy.button.disabled.background-color'],
        },
        {
          actual: 1.6059285649300712,
          code: 'too_small',
          ERROR_CODE: 'insufficient_contrast',
          message: 'Insufficient contrast',
          minimum: 3,
          origin: 'number',
          path: 'clippy.button.disabled.background-color.$value'.split('.'),
          tokens: ['clippy.button.disabled.background-color', 'clippy.button.disabled.color'],
        },
      ]);
    });

    it('leaves existing contrast extensions alone', () => {
      const config = {};
      dset(config, 'clippy.button.color', lightGray);
      dset(config, 'clippy.button.background-color', white);
      dset(config, `clippy.button.color.$extensions.${EXTENSION_CONTRAST_WITH}`, [
        {
          color: {
            $extensions: {
              [EXTENSION_RESOLVED_FROM]: "{clippy.button.hover.background-color'}",
            },
            $type: 'color',
            $value: white.$value,
          },
          expectedRatio: 1,
        },
      ]);
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error!.issues).toEqual(expectedIssues);
    });
  });
});

it('finds both ref and contrast issues at once', () => {
  // This test case exists because previous versions would bail out after the validation found an invalid ref and skipped checking contrast
  const white = parseColor('#ffffff');
  const lightGray = parseColor('#cccccc');

  const testBrand = {
    test: {
      name: { $type: 'text', $value: 'Test' },
      color: {
        gray: { $type: 'color', $value: lightGray },
        white: { $type: 'color', $value: white },
      },
    },
  };
  const themeWithBothErrors = { basis: getBasis(), brand: testBrand };
  // Invalid ref - this token doesn't exist
  dset(themeWithBothErrors, 'basis.color.default.bg-document', { $type: 'color', $value: '{test.color.nonexistent}' });
  // Insufficient contrast - gray on white is too low
  dset(themeWithBothErrors, 'basis.color.default.bg-subtle', { $type: 'color', $value: '{test.color.white}' });
  dset(themeWithBothErrors, 'basis.color.default.color-document', { $type: 'color', $value: '{test.color.gray}' });

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
    const theme = { basis: getBasis() };
    dset(theme, 'basis.color.default.bg-document', {
      $type: 'color',
      $value: { colorSpace: 'srgb', components: [0, 0, 0] },
      // object
      attributes: { category: 'basis', item: 'default', type: 'color' },
      // string
      filePath: 'tokens.json',
      // boolean
      isSource: true,
      // object with tokens inside
      original: { $type: 'color', $value: { colorSpace: 'srgb', components: [0, 0, 0] } },
    });
    const result = StrictThemeSchema.safeParse(theme);
    expect(result.success).toBeTruthy();
    const actual = dlv(result.data, 'basis.color.default.bg-document');
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
    const theme = { basis: getBasis() };
    dset(theme, 'basis.color.default.bg-document', {
      $extensions: {
        [EXTENSION_CONTRAST_WITH]: [{ color: { $type: 'color', $value: parseColor('#fff') }, expectedRatio: 4.5 }],
      },
      $type: 'color',
      $value: { colorSpace: 'srgb', components: [0, 0, 0] },
    });
    const result = StrictThemeSchema.safeParse(theme);
    expect(result.success).toBeTruthy();
    const extensions = dlv(result.data, 'basis.color.default.bg-document.$extensions');
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
    expect(result.data).toMatchObject(theme);
  });
});

describe('color scale position extension', () => {
  it('adds color-scale-position extensions for tokens with known color names', () => {
    const config = { basis: getBasis(), brand: brandConfig };
    dset(config, 'basis.color.default.bg-document', { $type: 'color', $value: parseColor('#ffffff') });
    // Use black for border-default to maintain sufficient contrast vs bg-default (#f1f1f1 from startTokens)
    dset(config, 'basis.color.default.border-default', { $type: 'color', $value: parseColor('#000000') });
    dset(config, 'basis.color.default.color-hover', { $type: 'color', $value: parseColor('#000000') });
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);

    const bgDocToken = dlv(result.data, 'basis.color.default.bg-document');
    const colorHoverToken = dlv(result.data, 'basis.color.default.color-hover');
    const borderDefaultToken = dlv(result.data, 'basis.color.default.border-default');

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
    const config = { basis: getBasis(), brand: brandConfig };
    dset(config, 'basis.color.default.bg-active', { $type: 'color', $value: parseColor('#ffffff') });
    dset(config, 'basis.color.default.color-hover', { $type: 'color', $value: parseColor('#000000') });
    const result = StrictThemeSchema.safeParse(config);
    expect(result.success).toEqual(true);

    const bgActiveToken = dlv(result.data, 'basis.color.default.bg-active');
    const colorHoverToken = dlv(result.data, 'basis.color.default.color-hover');

    // Both tokens should have the extension since they're both in COLOR_KEYS
    expect(bgActiveToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeDefined();
    expect(colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeDefined();

    // Verify the extensions contain valid indices
    expect(typeof bgActiveToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBe('number');
    expect(typeof colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBe('number');

    // Both indices should be within the COLOR_KEYS range
    const positionCount = COLOR_KEYS.length;
    expect(bgActiveToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeGreaterThanOrEqual(0);
    expect(bgActiveToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeLessThan(positionCount);
    expect(colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeGreaterThanOrEqual(0);
    expect(colorHoverToken?.$extensions?.[EXTENSION_COLOR_SCALE_POSITION]).toBeLessThan(positionCount);
  });
});

describe('validate minimum font-size', () => {
  it('passes refs', () => {
    const config = { basis: getBasis(), brand: brandConfig };
    dset(config, 'basis.text.font-size.md', { $type: 'dimension', $value: { unit: 'px', value: 18 } });
    dset(config, 'nl.button.font-size', { $type: 'dimension', $value: '{basis.text.font-size.md}' });
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
        code: 'custom',
        ERROR_CODE: ERROR_CODES.FONT_SIZE_TOO_SMALL,
        message: 'Font-size should be 14px or 0.875rem minimum (got: "0.8rem")',
        minimum: '14px / 0.875rem',
        origin: 'number',
        path: ['basis', 'text', 'font-size', 'sm', '$value'],
      },
      {
        actual: '10px',
        code: 'custom',
        ERROR_CODE: ERROR_CODES.FONT_SIZE_TOO_SMALL,
        message: 'Font-size should be 14px or 0.875rem minimum (got: "10px")',
        minimum: '14px / 0.875rem',
        origin: 'number',
        path: ['basis', 'text', 'font-size', 'md', '$value'],
      },
    ];

    it('flags modern syntax', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.font-size.sm', { $type: 'dimension', $value: { unit: 'rem', value: 0.8 } });
      dset(config, 'basis.text.font-size.md', { $type: 'dimension', $value: { unit: 'px', value: 10 } });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual(expectedErrors);
    });

    it('flags legacy syntax ($type=dimension, $value=string)', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.font-size.sm', { $type: 'dimension', $value: '0.8rem' });
      dset(config, 'basis.text.font-size.md', { $type: 'dimension', $value: '10px' });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual(expectedErrors);
    });

    it('flags legacy syntax ($type=fontSize, $value=string)', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.font-size.sm', { $type: 'fontSize', $value: '0.8rem' });
      dset(config, 'basis.text.font-size.md', { $type: 'fontSize', $value: '10px' });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual(expectedErrors);
    });

    it('allows legacy syntax ($type=fontSize, $value=string)', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.font-size.sm', { $type: 'fontSize', $value: '1rem' });
      dset(config, 'basis.text.font-size.md', { $type: 'fontSize', $value: '16px' });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
    });
  });
});

describe('line-height validations', () => {
  describe('validate unitless line-height preference', () => {
    it('Does not report line-heights that use a unitless number', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.line-height.md', { $type: 'lineHeight', $value: 1.5 });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
    });

    it('Does not report line-heights that are a ref', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.line-height.md', { $type: 'lineHeight', $value: 1.5 });
      dset(config, 'basis.text.line-height.sm', { $type: 'lineHeight', $value: '{basis.text.line-height.md}' });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
    });

    it('flags line-heights that use units', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.line-height.md', { $type: 'lineHeight', $value: '20px' });
      dset(config, 'basis.form-control.line-height', { $type: 'number', $value: 1.5 });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual(
        expect.arrayContaining([
          {
            code: 'invalid_type',
            ERROR_CODE: ERROR_CODES.UNEXPECTED_UNIT,
            expected: 'number',
            message: 'Line-height should be a unitless number (got: {"unit":"px","value":20})',
            path: ['basis', 'text', 'line-height', 'md', '$value'],
          },
        ]),
      );
    });

    it('flags line-heights that use dimensions', () => {
      const config = { basis: getBasis() };
      dset(config, 'basis.text.line-height.md', { $type: 'dimension', $value: { unit: 'px', value: 20 } });
      dset(config, 'basis.form-control.line-height', { $type: 'number', $value: 1.5 });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual(
        expect.arrayContaining([
          {
            code: 'invalid_type',
            ERROR_CODE: ERROR_CODES.UNEXPECTED_UNIT,
            expected: 'number',
            message: 'Line-height should be a unitless number (got: {"unit":"px","value":20})',
            path: ['basis', 'text', 'line-height', 'md', '$value'],
          },
        ]),
      );
    });

    it('flags invalid line-heights outside of basis tokens', () => {
      const config = {
        ma: {
          someComponent: {
            'line-height': {
              md: {
                $type: 'dimension',
                $value: {
                  unit: 'px',
                  value: 20,
                },
              },
            },
          },
        },
      };
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual([
        {
          code: 'invalid_type',
          ERROR_CODE: ERROR_CODES.UNEXPECTED_UNIT,
          expected: 'number',
          message: 'Line-height should be a unitless number (got: {"unit":"px","value":20})',
          path: ['ma', 'someComponent', 'line-height', 'md', '$value'],
        },
      ]);
    });
  });

  describe('validate minimum line-height preference', () => {
    it('Does not report line-heights that comply', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.line-height.md', { $type: 'lineHeight', $value: 1.5 });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
    });

    it('Does not report line-heights that are a ref', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.line-height.md', { $type: 'lineHeight', $value: 1.5 });
      dset(config, 'basis.text.line-height.sm', { $type: 'lineHeight', $value: '{basis.text.line-height.md}' });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
    });

    it('flags line-heights that are too small', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.line-height.md', { $type: 'lineHeight', $value: 1 });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual([
        {
          actual: 1,
          code: 'too_small',
          ERROR_CODE: ERROR_CODES.LINE_HEIGHT_TOO_SMALL,
          expected: 'number',
          message: 'Line height should be 1.1 at minimum, received 1',
          minimum: MINIMUM_LINE_HEIGHT,
          origin: 'number',
          path: ['basis', 'text', 'line-height', 'md', '$value'],
        },
      ]);
    });

    it('flags invalid line-heights outside of basis tokens', () => {
      const config = {
        ma: {
          someComponent: {
            'line-height': {
              md: {
                $type: 'lineHeight',
                $value: 1.05,
              },
            },
          },
        },
      };
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual([
        {
          actual: 1.05,
          code: 'too_small',
          ERROR_CODE: ERROR_CODES.LINE_HEIGHT_TOO_SMALL,
          expected: 'number',
          message: 'Line height should be 1.1 at minimum, received 1.05',
          minimum: MINIMUM_LINE_HEIGHT,
          origin: 'number',
          path: ['ma', 'someComponent', 'line-height', 'md', '$value'],
        },
      ]);
    });
  });

  describe('upgrades legacy line-heights', () => {
    it('leaves lineHeights that are already numbers intact', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.line-height.md', { $type: 'lineHeight', $value: 1.5 });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
      const token = dlv(result.data, 'basis.text.line-height.md');
      expect(token.$type).toEqual('number');
      expect(token.$value).toEqual(1.5);
      expect(token.$extensions?.[EXTENSION_TOKEN_SUBTYPE]).toEqual('line-height');
    });

    it('converts stringified numbers to numbers', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.line-height.md', { $type: 'lineHeight', $value: '1.5' });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
      const token = dlv(result.data, 'basis.text.line-height.md');
      expect(token.$type).toEqual('number');
      expect(token.$value).toEqual(1.5);
      expect(token.$extensions?.[EXTENSION_TOKEN_SUBTYPE]).toEqual('line-height');
    });

    it('coverts percentages to numbers', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.line-height.md', { $type: 'lineHeight', $value: '150%' });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
      const token = dlv(result.data, 'basis.text.line-height.md');
      expect(token.$type).toEqual('number');
      expect(token.$value).toEqual(1.5);
      expect(token.$extensions?.[EXTENSION_TOKEN_SUBTYPE]).toEqual('line-height');
    });

    it('converts dimension strings to dimension', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.line-height.md', { $type: 'lineHeight', $value: '20px' });
      dset(config, 'basis.form-control.line-height', { $type: 'number', $value: 1.5 });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(false);
      expect(result.error?.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            // The message is proof the conversion worked, otherwise it would have shown 20px instead of the dimension object
            message: 'Line-height should be a unitless number (got: {"unit":"px","value":20})',
            path: ['basis', 'text', 'line-height', 'md', '$value'],
          }),
        ]),
      );
    });

    it('sets the correct type based on what token a reference points to', () => {
      const config = { basis: getBasis(), brand: brandConfig };
      dset(config, 'basis.text.line-height.md', { $type: 'lineHeight', $value: 2 });
      dset(config, 'basis.text.line-height.sm', { $type: 'lineHeight', $value: '{basis.text.line-height.md}' });
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toEqual(true);
      const token = dlv(result.data, 'basis.text.line-height.sm');
      expect(token.$type).toEqual('number');
      expect(token.$extensions?.[EXTENSION_TOKEN_SUBTYPE]).toEqual('line-height');
    });
  });

  describe('validate non-numeric relative line-height', () => {
    // basis.text.font-size.sm: 16px
    // basis.text.font-size.line-height: 16px
    // calculated line-height: 16px/16px = 1
    const unexpectedUnitError = {
      ERROR_CODE: ERROR_CODES.UNEXPECTED_UNIT,
    };

    it('invalid line-height: $type=dimension; px/px', () => {
      const config = { basis: getBasis() };
      dset(config, 'basis.text.font-size.sm', createDimension(16, 'px'));
      dset(config, 'basis.text.line-height.sm', createDimension(16, 'px'));

      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining(unexpectedUnitError),
          expect.objectContaining({
            actual: 1,
            ERROR_CODE: ERROR_CODES.LINE_HEIGHT_TOO_SMALL,
            path: ['basis', 'text', 'line-height', 'sm', '$value'],
          }),
        ]),
      );
    });

    it('invalid line-height: $type=dimension; px/rem', () => {
      const config = { basis: getBasis() };
      dset(config, 'basis.text.font-size.sm', createDimension(16, 'px'));
      dset(config, 'basis.text.line-height.sm', createDimension(1, 'rem'));

      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining(unexpectedUnitError),
          expect.objectContaining({
            actual: 1,
            ERROR_CODE: ERROR_CODES.LINE_HEIGHT_TOO_SMALL,
            path: ['basis', 'text', 'line-height', 'sm', '$value'],
          }),
        ]),
      );
    });

    it('invalid line-height: $type=dimension; rem/px', () => {
      const config = { basis: getBasis() };
      dset(config, 'basis.text.font-size.sm', createDimension(1, 'rem'));
      dset(config, 'basis.text.line-height.sm', createDimension(16, 'px'));

      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining(unexpectedUnitError),
          expect.objectContaining({
            actual: 1,
            ERROR_CODE: ERROR_CODES.LINE_HEIGHT_TOO_SMALL,
            path: ['basis', 'text', 'line-height', 'sm', '$value'],
          }),
        ]),
      );
    });

    it('valid line-height: $type=dimension; rem/px', () => {
      const config = { basis: getBasis() };
      dset(config, 'basis.text.font-size.sm', createDimension(1, 'rem'));
      dset(config, 'basis.text.line-height.sm', createDimension(24, 'px'));

      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toEqual(expect.arrayContaining([expect.objectContaining(unexpectedUnitError)]));
    });

    it('valid line-height: $type=dimension; rem/px; with font-size ref', () => {
      const config = { basis: getBasis() };
      dset(config, 'basis.text.font-size.sm', createDimension(1, 'rem'));
      dset(config, 'basis.text.font-size.md', {
        $type: 'dimension',
        $value: '{basis.text.font-size.sm}',
      });
      dset(config, 'basis.text.line-height.md', createDimension(24, 'px'));
      dset(config, 'basis.form-control.line-height', { $type: 'number', $value: 1.5 });

      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toEqual(expect.arrayContaining([expect.objectContaining(unexpectedUnitError)]));
    });

    it('valid line-height: $type=dimension; rem/px; with line-height ref', () => {
      const config = { basis: getBasis() };
      dset(config, 'basis.text.font-size.md', createDimension(1, 'rem'));
      dset(config, 'basis.text.line-height.sm', createDimension(24, 'px'));
      dset(config, 'basis.text.line-height.md', {
        $type: 'dimension',
        $value: '{basis.text.line-height.sm}',
      });
      dset(config, 'basis.form-control.line-height', { $type: 'number', $value: 1.5 });

      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toEqual(expect.arrayContaining([expect.objectContaining(unexpectedUnitError)]));
    });
  });

  describe('component line-heights', () => {
    const unexpectedUnitError = {
      ERROR_CODE: ERROR_CODES.UNEXPECTED_UNIT,
    };
    const lineHeightTooSmallError = {
      ERROR_CODE: ERROR_CODES.LINE_HEIGHT_TOO_SMALL,
    };

    it('valid; font-size: px; line-height: px;', () => {
      const config = {};
      dset(config, 'nl.button.default.font-size', createDimension(16, 'px'));
      dset(config, 'nl.button.default.line-height', createDimension(24, 'px'));
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toHaveLength(1);
      expect(result.error?.issues[0]).toMatchObject(unexpectedUnitError);
    });

    it('invalid; font-size: px; line-height: px;', () => {
      const config = {};
      dset(config, 'nl.paragraph.lead.font-size', createDimension(16, 'px'));
      dset(config, 'nl.paragraph.lead.line-height', createDimension(16, 'px'));
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toHaveLength(2);
      expect(result.error?.issues[0]).toMatchObject(unexpectedUnitError);
      expect(result.error?.issues[1]).toMatchObject(lineHeightTooSmallError);
    });

    it('valid; font-size: px; line-height: number;', () => {
      const config = {};
      dset(config, 'nl.paragraph.font-size', createDimension(16, 'px'));
      dset(config, 'nl.paragraph.line-height', createToken('number', 1.5));
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it('invalid; font-size: px; line-height: number;', () => {
      const config = {};
      dset(config, 'nl.data-badge.font-size', createDimension(16, 'px'));
      dset(config, 'nl.data-badge.line-height', createToken('number', 1));
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toHaveLength(1);
      expect(result.error?.issues[0]).toMatchObject(lineHeightTooSmallError);
    });

    it('valid; font-size: px; line-height: not set;', () => {
      const config = {};
      dset(config, 'nl.button.default.font-size', createDimension(16, 'px'));
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it('valid; font-size: not set; line-height: px;', () => {
      const config = {};
      dset(config, 'nl.button.default.line-height', createDimension(16, 'px'));
      const result = StrictThemeSchema.safeParse(config);
      expect(result.success).toBe(false);
      expect(result.error?.issues).toHaveLength(1);
      expect(result.error?.issues[0]).toMatchObject(unexpectedUnitError);
    });
  });
});

// TODO: these themes are missing required basis tokens (border-radius.none,
// form-control.{focus,invalid,read-only}.accent-color) as of start/MA/Voorbeeld v6/v5/v10.
// Update expectations to toBe(true) once the packages include those tokens.
describe('strictly validate known basis themes', () => {
  describe('source files', () => {
    it('validates Start theme', () => {
      const result = StrictThemeSchema.safeParse(excludeParentKeys(startSourceTokens));
      expect(result.success).toBe(false);
    });

    it('validates Mooi & Anders theme', () => {
      const result = StrictThemeSchema.safeParse(excludeParentKeys(maSourceTokens));
      expect(result.success).toBe(false);
    });

    it('validates Voorbeeld theme', () => {
      const result = StrictThemeSchema.safeParse(excludeParentKeys(voorbeeldSourceTokens));
      expect(result.success).toBe(false);
    });
  });

  describe('dist files', () => {
    it('Mooi & Anders theme', () => {
      const result = StrictThemeSchema.safeParse(maTokens);
      expect(result.success).toEqual(false);
    });

    it('Voorbeeld theme', () => {
      const result = StrictThemeSchema.safeParse(voorbeeldTokens);
      expect(result.success).toEqual(false);
    });

    it('Start theme', () => {
      const result = StrictThemeSchema.safeParse(startTokens);
      expect(result.success).toEqual(false);
    });
  });
});
