import { resolveRefs, type TokenGroup } from '@nl-design-system-community/design-tokens-schema';

const color = (red: number, green: number, blue: number, subtype: string) => ({
  $extensions: { 'nl.nldesignsystem.token-subtype': subtype },
  $type: 'color',
  $value: { alpha: 1, colorSpace: 'srgb', components: [red / 255, green / 255, blue / 255] },
});

const dimension = (value: number, unit: 'px' | 'rem', subtype: string) => ({
  $extensions: { 'nl.nldesignsystem.token-subtype': subtype },
  $type: 'dimension',
  $value: { unit, value },
});

const ref = (path: string, type: 'color' | 'dimension', subtype: string) => ({
  $extensions: { 'nl.nldesignsystem.token-subtype': subtype },
  $type: type,
  $value: `{${path}}`,
});

/* eslint-disable perfectionist/sort-objects */
const tokens = {
  basis: {
    color: {
      'accent-1': {
        'bg-default': ref('brand.color.blue.100', 'color', 'background-color'),
        'bg-subtle': ref('brand.color.blue.50', 'color', 'background-color'),
        'border-default': ref('brand.color.blue.500', 'color', 'border-color'),
        'color-default': ref('brand.color.blue.900', 'color', 'color'),
      },
    },
    space: {
      block: {
        sm: ref('brand.space.8', 'dimension', 'space-block'),
        md: ref('brand.space.16', 'dimension', 'space-block'),
        lg: ref('brand.space.24', 'dimension', 'space-block'),
      },
      inline: {
        sm: ref('brand.space.8', 'dimension', 'space-inline'),
        md: ref('brand.space.16', 'dimension', 'space-inline'),
        lg: ref('brand.space.24', 'dimension', 'space-inline'),
      },
    },
    text: {
      'font-size': {
        sm: dimension(0.875, 'rem', 'font-size'),
        md: dimension(1, 'rem', 'font-size'),
        lg: dimension(1.25, 'rem', 'font-size'),
        xl: dimension(1.5, 'rem', 'font-size'),
      },
    },
  },
  brand: {
    color: {
      blue: {
        '50': color(239, 246, 255, 'background-color'),
        '100': color(219, 234, 254, 'background-color'),
        '500': color(59, 130, 246, 'border-color'),
        '900': color(30, 58, 138, 'color'),
      },
      red: {
        '100': color(254, 226, 226, 'background-color'),
        '500': color(239, 68, 68, 'border-color'),
        '900': color(127, 29, 29, 'color'),
      },
    },
    space: {
      '8': dimension(8, 'px', 'space-inline'),
      '16': dimension(16, 'px', 'space-inline'),
      '24': dimension(24, 'px', 'space-inline'),
    },
  },
};
/* eslint-enable perfectionist/sort-objects */

resolveRefs(tokens, tokens);

/** Theme with hard values (`brand`, `basis.text`) and ref values (`basis.color`, `basis.space`) */
export const themeFixture = tokens as unknown as TokenGroup;
