import Color from 'colorjs.io';
import { BorderDisplayToken, ColorDisplayToken, SpacingDisplayToken, TextDisplayToken } from './types';

const color = new Color('#c9aaf3');

export const colorFixture: ColorDisplayToken = {
  displayValue: color.toString({ format: 'hex' }),
  metadata: {
    OKLCH: color.toString({ format: 'oklch' }),
    'P3 Color': color.toString({ format: 'color' }),
    RGB: color.toString({ format: 'rgb' }),
  },
  tokenId: 'basis.color.default.border-subtle',
  tokenType: 'color',
  usage: [
    'basis.color.disabled.border-subtle',
    'utrecht.accordion.section.border-color',
    'utrecht.accordion.section.hover.border-color',
    'utrecht.drawer.border-color',
    'utrecht.table.header.border-block-end-color',
    'utrecht.table.row.border-block-end-color',
    'todo.drawer.border-color',
    'todo.drawer.header.border-color',
    'todo.drawer.footer.border-color',
    'todo.form-summary.item.border-color',
    'todo.table.footer.border-block-start-color',
    'ams.dialog.border-color',
    'denhaag.description-list.border-color',
    'denhaag.file.border-color',
    'denhaag.tabs.border-color',
    'denhaag.action.border-color',
    'rhc.navigation-list.item.border-color',
  ],
  usageCount: 17,
};

export const spacingFixture: SpacingDisplayToken = {
  displayValue: '1.5rem',
  metadata: {
    concept: 'inline',
  },
  tokenId: 'basis.space.inline.6xl',
  tokenType: 'dimension',
  usage: [],
  usageCount: 0,
};

export const textFontSizeFixture: TextDisplayToken = {
  displayValue: '2.5rem',
  tokenId: 'basis.text.font-size.4xl',
  tokenType: 'fontSize',
  usage: ['utrecht.heading-4.font-size', 'utrecht.paragraph.lead.font-size'],
  usageCount: 2,
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
