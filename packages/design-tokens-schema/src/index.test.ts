import { describe, test, expect } from 'vitest';
import * as api from './';

describe('public surface API', () => {
  test('exports all public functions and schemas', () => {
    const functions = Object.keys(api);
    expect(functions).toEqual([
      'BaseDesignTokenIdentifierSchema',
      'BaseDesignTokenValueSchema',
      'BaseDesignTokenSchema',
      'COLOR_SPACES',
      'ColorSpaceSchema',
      'NoneKeywordSchema',
      'ColorComponentSchema',
      'ColorComponentsSchema',
      'ColorAlphaSchema',
      'ColorHexFallbackSchema',
      'ColorValueSchema',
      'LegacyColorTokenSchema',
      'ColorTokenSchema',
      'parseColor',
      'stringifyColor',
      'legacyToModernColor',
      'ColorTokenValidationSchema',
      'colorValueToColorJS',
      'compareContrast',
      'DimensionTypeSchema',
      'DimensionUnitSchema',
      'ModernDimensionValueSchema',
      'ModernDimensionTokenSchema',
      'DimensionWithRefSchema',
      'DimensionTokenSchema',
      'LegacyFontFamilyValueSchema',
      'LegacyFontFamilyTokenSchema',
      'MixedFontFamilyTokenSchema',
      'ModernFontFamilyNameSchema',
      'ModernFontFamilyValueSchema',
      'ModernFontFamilyTokenSchema',
      'FontFamilyWithRefSchema',
      'FontFamilyTokenSchema',
      'ColorOrColorScaleSchema',
      'BrandSchema',
      'BrandsSchema',
      'ColorNameSchema',
      'BasisColorSchema',
      'BasisTextSchema',
      'FormControlStateSchema',
      'BasisTokensSchema',
      'CommonSchema',
      'resolveConfigRefs',
      'ThemeSchema',
    ]);
  });

  test('contains no duplicates', () => {
    const functions = Object.keys(api);
    const unique = new Set(functions);
    expect(functions.length, 'Expected API to contain no duplicate method/schema names').toEqual(unique.size);
  });
});
