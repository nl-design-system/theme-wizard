import { COLOR_SPACES } from '@nl-design-system-community/design-tokens-schema';
import { describe, expect, it } from 'vitest';
import ColorToken from '../ColorToken';
import ColorScale from './index';

const greenSRGB = new ColorToken({
  $value: {
    alpha: 1,
    colorSpace: COLOR_SPACES.SRGB,
    components: [0, 0.5058823529411764, 0.12156862745098039],
  },
});

const orangeSRGB = new ColorToken({
  $value: {
    alpha: 1,
    colorSpace: COLOR_SPACES.SRGB,
    components: [0.9372549019607843, 0.49019607843137253, 0],
  },
});

const greenOKLCH = new ColorToken({
  $value: {
    ...greenSRGB.$value,
    colorSpace: COLOR_SPACES.OKLCH,
    components: [0.524186, 0.165667, 144.826],
  },
});

const orangeOKLCH = new ColorToken({
  $value: {
    ...orangeSRGB.$value,
    colorSpace: COLOR_SPACES.OKLCH,
    components: [0.7053, 0.173678, 55.4692],
  },
});

describe('ColorScale', () => {
  it('can be initialized with a token', () => {
    const colorScale = new ColorScale(greenOKLCH);
    expect(colorScale.from.toObject()).toMatchObject(greenOKLCH.toObject());
  });

  it('converts srgb to oklch on initialization', () => {
    const colorScale = new ColorScale(greenSRGB);
    expect(colorScale.fromOKLCH.toObject()).toMatchObject(greenOKLCH.toObject());
  });

  it('can be updated after initialization', () => {
    const colorScale = new ColorScale(greenSRGB);
    colorScale.from = orangeOKLCH;
    expect(colorScale.from.toObject()).toMatchObject(orangeOKLCH.toObject());
  });

  it('converts after update', () => {
    const colorScale = new ColorScale(greenSRGB);
    colorScale.from = orangeSRGB;
    expect(colorScale.fromOKLCH.toObject()).toMatchObject(orangeOKLCH.toObject());
  });

  it('returns a list of derived colors', () => {
    const colorScale = new ColorScale(greenSRGB);
    expect(colorScale.list().length).toBe(colorScale.size);
  });

  it('get token in color scale by position', () => {
    const colorScale = new ColorScale(greenSRGB);
    for (let index = 0; index++; index < colorScale.size) {
      expect(colorScale.get(index)).toBeDefined();
    }
  });

  it('list of derived colors contains base color exactly once, when lightness is in the mask', () => {
    const lightnessMatchedGreenOKLCH = new ColorToken({
      $value: {
        ...greenOKLCH.$value,
        components: [0.52, greenOKLCH.$value.components[1], greenOKLCH.$value.components[2]],
      },
    });
    const colorScale = new ColorScale(lightnessMatchedGreenOKLCH);
    const matches = colorScale
      .list()
      .filter(
        (color) => color.$value.components.toString() === lightnessMatchedGreenOKLCH.$value.components.toString(),
      );
    expect(matches.length).toBe(1);
  });

  it('list of derived colors contains base color exactly once, even if lightness is not in the mask', () => {
    const colorScale = new ColorScale(greenSRGB);
    const matches = colorScale
      .list()
      .filter((color) => color.$value.components.toString() === greenSRGB.$value.components.toString());
    expect(matches.length).toBe(1);
  });

  it('exports scale to an object defining design tokens', () => {
    const colorScale = new ColorScale(greenSRGB);
    expect(colorScale.toObject()).toMatchSnapshot();
  });
});
