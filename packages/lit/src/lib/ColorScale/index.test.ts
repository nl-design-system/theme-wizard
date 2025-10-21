import { ColorToken } from '@nl-design-system-community/css-scraper';
import { describe, expect, test } from 'vitest';
import ColorScale from './index';

const greenSRGB: ColorToken = {
  $extensions: {
    'nl.nldesignsystem.theme-wizard.css-authored-as': '#00811f',
    'nl.nldesignsystem.theme-wizard.css-properties': ['color', 'background-color'],
    'nl.nldesignsystem.theme-wizard.token-id': 'green-d70ab7a9',
    'nl.nldesignsystem.theme-wizard.usage-count': 5,
  },
  $type: 'color',
  $value: {
    alpha: 1,
    colorSpace: 'srgb',
    components: [0, 0.5058823529411764, 0.12156862745098039],
  },
};

const orangeSRGB: ColorToken = {
  $extensions: {
    'nl.nldesignsystem.theme-wizard.css-authored-as': '#ef7d00',
    'nl.nldesignsystem.theme-wizard.css-properties': ['color'],
    'nl.nldesignsystem.theme-wizard.token-id': 'orange-3126e0e6',
    'nl.nldesignsystem.theme-wizard.usage-count': 1,
  },
  $type: 'color',
  $value: {
    alpha: 1,
    colorSpace: 'srgb',
    components: [0.9372549019607843, 0.49019607843137253, 0],
  },
};

const greenOKLCH: ColorToken = {
  ...greenSRGB,
  $value: {
    ...greenSRGB.$value,
    colorSpace: 'oklch',
    components: [0.524144, 0.165652, 144.827],
  },
};

const orangeOKLCH: ColorToken = {
  ...orangeSRGB,
  $value: {
    ...orangeSRGB.$value,
    colorSpace: 'oklch',
    components: [0.705249, 0.17366, 55.4715],
  },
};

describe('ColorScale', () => {
  test('can be initialized with a token', () => {
    const colorScale = new ColorScale(greenOKLCH);
    expect(colorScale.from).toMatchObject(greenOKLCH);
  });

  test('converts srgb to oklch on initialization', () => {
    const colorScale = new ColorScale(greenSRGB);
    expect(colorScale.fromOkLCh).toMatchObject(greenOKLCH);
  });

  test('can be updated after initialization', () => {
    const colorScale = new ColorScale(greenSRGB);
    colorScale.from = orangeOKLCH;
    expect(colorScale.from).toMatchObject(orangeOKLCH);
  });

  test('converts after update', () => {
    const colorScale = new ColorScale(greenSRGB);
    colorScale.from = orangeSRGB;
    expect(colorScale.fromOkLCh).toMatchObject(orangeOKLCH);
  });

  test('returns a list of derived colors', () => {
    const colorScale = new ColorScale(greenSRGB);
    expect(colorScale.list().length).toBe(colorScale.size);
  });

  test('Get of token in color scale by position', () => {
    const colorScale = new ColorScale(greenSRGB);
    for (let index = 0; index++; index < colorScale.size) {
      expect(colorScale.get(index)).toBeDefined();
    }
  });

  test('List of derived colors adheres to contrast ratios', () => {
    // @TODO: add relevant contrast validatore;
    const hasValidContrast = (a: unknown, b: unknown) => !!a && !!b;
    const colorScale = new ColorScale(greenSRGB);
    for (let index = 0; index++; index < colorScale.size) {
      const tokenA = colorScale.get(index);
      const tokenB = colorScale.get(index + 1);
      if (tokenB) {
        expect(hasValidContrast(tokenA, tokenB)).toBeTruthy();
      }
    }
  });
});
