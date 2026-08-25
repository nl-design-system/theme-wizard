// OKLCH <-> sRGB conversions via colorjs.io.
import Color from 'colorjs.io';
import { inGamut as colorIsInGamut } from 'colorjs.io/fn';

export interface OKLCH {
  /** Lightness, 0..1 */
  L: number;
  /** Chroma, 0..~0.4 */
  C: number;
  /** Hue, degrees 0..360 */
  H: number;
}

/** Parse any valid CSS color (hex, `rgb()`, `hsl()`, `oklch()`, named colors, ...) to OKLCH. */
export const parseToOklch = (color: string): OKLCH => {
  const [L, C, H] = new Color(color).to('oklch').coords;
  return { C: C ?? 0, H: H ?? 0, L: L ?? 0 };
};

export const oklchToHex = ({ C, H, L }: OKLCH): string => {
  return new Color('oklch', [L, C, H])
    .to('srgb')
    .toString({ collapse: false, format: 'hex', inGamut: true }) // clamps to gamut if out of range
    .toUpperCase();
};

/**
 * Reduce chroma until (L, C, H) fits in sRGB, while not changing L and H.
 * colorjs.io's own `toGamut()` changes the H and L which is against the masks that we made.
 */
export const clampChroma = (L: number, C: number, H: number): number => {
  const inGamut = (chroma: number): boolean => colorIsInGamut({ coords: [L, chroma, H], space: 'oklch' }, 'srgb');

  if (inGamut(C)) {
    return C;
  }

  let lowChroma = 0;
  let highChroma = C;
  const BISECTION_ITERATIONS = 28;
  for (let iteration = 0; iteration < BISECTION_ITERATIONS; iteration++) {
    const midChroma = (lowChroma + highChroma) / 2;
    if (inGamut(midChroma)) {
      lowChroma = midChroma;
    } else {
      highChroma = midChroma;
    }
  }
  return lowChroma;
};
