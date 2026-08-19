import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
import { BorderDisplayToken } from './types';

export const colorFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.color.accent-1.border-default',
    'nl.nldesignsystem.reference-count': 5,
    'nl.nldesignsystem.referenced-at': [
      'basis.color.accent-2.border-default',
      'basis.color.accent-3.border-default',
      'basis.color.action-1.border-default',
      'basis.color.action-2.border-default',
      'basis.color.selected.border-default',
    ],
    'nl.nldesignsystem.token-subtype': 'border-color',
  },
  $type: 'color',
  $value: {
    alpha: 1,
    colorSpace: 'srgb',
    components: [0.3607843137254902, 0.5372549019607843, 0.7450980392156863],
  },
};

export const spacingFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.space.inline.6xl',
    'nl.nldesignsystem.token-subtype': 'space-inline',
  },
  $type: 'dimension',
  $value: {
    unit: 'px',
    value: 64,
  },
};

export const textFontSizeFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.text.font-size.3xl',
    'nl.nldesignsystem.reference-count': 0,
    'nl.nldesignsystem.referenced-at': [],
    'nl.nldesignsystem.token-subtype': 'font-size',
  },
  $type: 'dimension',
  $value: {
    unit: 'rem',
    value: 2,
  },
};

export const textFontFamilyFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.text.font-family.monospace',
    'nl.nldesignsystem.reference-count': 4,
    'nl.nldesignsystem.referenced-at': [
      'utrecht.code.font-family',
      'utrecht.code-block.font-family',
      'nl.code.font-family',
      'nl.code-block.font-family',
    ],
  },
  $type: 'fontFamily',
  $value: ['IBM Plex Mono', 'monospace'],
};

export const textFontWeightFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.text.font-weight.bold',
    'nl.nldesignsystem.reference-count': 2,
    'nl.nldesignsystem.referenced-at': ['basis.heading.font-weight', 'utrecht.button.font-weight'],
    'nl.nldesignsystem.token-subtype': 'font-weight',
    'studio.tokens': {
      originalType: 'fontWeights',
    },
  },
  $type: 'number',
  $value: 700,
};

export const textLineHeightFixture: BaseDesignToken = {
  $extensions: {
    'nl.nldesignsystem.path': 'basis.text.line-height.md',
    'nl.nldesignsystem.reference-count': 1,
    'nl.nldesignsystem.referenced-at': ['basis.form-control.line-height'],
    'nl.nldesignsystem.token-subtype': 'line-height',
  },
  $type: 'number',
  $value: 1.5,
};

export const borderWidthFixture: BorderDisplayToken = {
  displayValue: '0.125rem',
  tokenId: 'basis.border.width.md',
  tokenType: 'borderWidth',
  usage: [],
  usageCount: 0,
};

export const borderRadiusFixture: BorderDisplayToken = {
  displayValue: '0.5rem',
  tokenId: 'basis.border.radius.md',
  tokenType: 'borderRadius',
  usage: [],
  usageCount: 0,
};
