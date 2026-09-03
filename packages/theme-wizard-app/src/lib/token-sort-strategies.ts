import {
  BaseDesignToken,
  ColorValue,
  compareContrast,
  stringifyColor,
} from '@nl-design-system-community/design-tokens-schema';
import type Theme from './Theme';
import { parseToOklch } from './color-scale-generator/oklch';

type SortStrategy =
  /** Highest contrast (WCAG 2.1) against the token at `against` sorts first. */
  | { type: 'contrast'; against: string }
  /** Closest OKLCH hue to `target` (any CSS color name) sorts first. */
  | { type: 'hueProximity'; target: string };

/** Sort strategy per token path. Paths not listed here are left in their original order. */
const SORT_STRATEGIES: Record<string, SortStrategy> = {
  'basis.color.default.color-document': { against: 'basis.color.default.bg-default', type: 'contrast' },
  'basis.color.info-inverse.bg-default': { target: 'blue', type: 'hueProximity' },
  'basis.color.negative-inverse.bg-default': { target: 'red', type: 'hueProximity' },
  'basis.color.positive-inverse.bg-default': { target: 'green', type: 'hueProximity' },
  'basis.color.warning-inverse.bg-default': { target: 'orange', type: 'hueProximity' },
  'basis.heading.color': { against: 'basis.color.default.bg-default', type: 'contrast' },
};

/** Circular distance between two hue angles (degrees), wrapped at 360. */
const hueDistance = (hueA: number, hueB: number): number => {
  const diff = Math.abs(hueA - hueB) % 360;
  return diff > 180 ? 360 - diff : diff;
};

/** Sorts color `tokens` in place per the strategy configured for `path`, if any. */
export const sortTokensForPath = (tokens: BaseDesignToken[], path: string, theme: Theme): BaseDesignToken[] => {
  const strategy = SORT_STRATEGIES[path];
  if (!strategy) {
    return tokens;
  }

  if (strategy.type === 'contrast') {
    const against = theme.at(strategy.against).$value as ColorValue;
    return tokens.toSorted(
      (a, b) => compareContrast(b.$value as ColorValue, against) - compareContrast(a.$value as ColorValue, against),
    );
  }

  if (strategy.type === 'hueProximity') {
    const targetHue = parseToOklch(strategy.target).H;
    return tokens.toSorted((a, b) => {
      const hueA = parseToOklch(stringifyColor(a.$value as ColorValue)).H;
      const hueB = parseToOklch(stringifyColor(b.$value as ColorValue)).H;
      return hueDistance(hueA, targetHue) - hueDistance(hueB, targetHue);
    });
  }

  return tokens;
};
