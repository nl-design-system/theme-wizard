import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';
import { BorderDisplayToken, TextDisplayToken } from './types';

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

export const textFontFamilyFixture: TextDisplayToken = {
  displayValue: 'IBM Plex Mono, monospace',
  tokenId: 'basis.text.font-family.default',
  tokenType: 'fontFamily',
  usage: ['basis.form-control.font-family'],
  usageCount: 1,
};

export const textFontWeightFixture: TextDisplayToken = {
  displayValue: '700',
  tokenId: 'basis.text.font-weight.bold',
  tokenType: 'fontWeight',
  usage: ['basis.form-control.font-weight'],
  usageCount: 1,
};

export const textLineHeightFixture: TextDisplayToken = {
  displayValue: '1.5',
  tokenId: 'basis.text.line-height.default',
  tokenType: 'lineHeight',
  usage: ['basis.form-control.line-height'],
  usageCount: 1,
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
