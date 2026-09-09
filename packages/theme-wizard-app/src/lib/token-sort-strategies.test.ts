import { oklchToHex, parseToOklch } from '@nl-design-system-community/color-scale-generator';
import { type BaseDesignToken, parseColor } from '@nl-design-system-community/design-tokens-schema';
import { describe, expect, it } from 'vitest';
import Theme from './Theme';
import { sortTokensForPath } from './token-sort-strategies';

const black: BaseDesignToken = { $type: 'color', $value: parseColor('#000000') };
const white: BaseDesignToken = { $type: 'color', $value: parseColor('#ffffff') };
const midGray: BaseDesignToken = { $type: 'color', $value: parseColor('#808080') };

describe('sortTokensForPath', () => {
  it('returns tokens unchanged for a path with no configured strategy', () => {
    const tokens = [white, black];
    const theme = new Theme();
    expect(sortTokensForPath(tokens, 'basis.color.default.bg-subtle', theme)).toEqual(tokens);
  });

  it('does not mutate the input array', () => {
    const tokens = [white, midGray, black];
    const theme = new Theme();
    const original = [...tokens];
    sortTokensForPath(tokens, 'basis.color.default.color-document', theme);
    expect(tokens).toEqual(original);
    expect(tokens).not.toBe(original);
  });

  it('sorts by contrast against the configured anchor token, highest first', () => {
    const theme = new Theme();
    // basis.color.default.bg-default is a light background by default, so black contrasts most.
    const sorted = sortTokensForPath([white, midGray, black], 'basis.color.default.color-document', theme);
    expect(sorted[0]).toBe(black);
    expect(sorted.at(-1)).toBe(white);
  });

  it.each([
    ['basis.color.negative-inverse.bg-default', 'red'],
    ['basis.color.warning-inverse.bg-default', 'orange'],
    ['basis.color.positive-inverse.bg-default', 'green'],
    ['basis.color.info-inverse.bg-default', 'blue'],
  ] as const)('sorts %s by hue proximity to %s, closest first', (path, target) => {
    const colorAtHue = (hue: number): BaseDesignToken => ({
      $type: 'color',
      $value: parseColor(oklchToHex({ C: 0.15, H: hue, L: 0.6 })),
    });

    const theme = new Theme();
    const targetHue = parseToOklch(target).H;
    const close = colorAtHue(targetHue);
    const far = colorAtHue((targetHue + 180) % 360);

    const sorted = sortTokensForPath([far, close], path, theme);

    expect(sorted[0]).toBe(close);
    expect(sorted.at(-1)).toBe(far);
  });
});
