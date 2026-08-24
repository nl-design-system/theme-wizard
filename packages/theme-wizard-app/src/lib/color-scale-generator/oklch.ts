// OKLCH <-> sRGB conversions via colorjs.io's ColorSpace objects, used directly
// instead of the `Color` class in oklchToHex/clampChroma: `space.to(otherSpace,
// coords)` skips the per-call object construction and format-sniffing that
// `new Color(x)` does, and clampChroma's gamut bisection calls this dozens of
// times per token. `parseToOklch` is the one exception — it only runs once per
// seed, so it uses colorjs.io's full CSS color parser to accept any valid CSS
// color (hex, rgb(), hsl(), oklch(), named colors, ...), not just hex.
import { OKLCH as OKLCHSpace, ColorSpace, parse, sRGB, sRGB_Linear } from 'colorjs.io/fn';
import 'colorjs.io/spaces'; // registers every space, so `parse` recognizes all CSS color syntaxes

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
  const parsed = parse(color);
  const space = ColorSpace.get(parsed.spaceId);
  const [L, C, H] = space.to(OKLCHSpace, parsed.coords);
  return { C: C ?? 0, H: H ?? 0, L: L ?? 0 };
};

const toHexByte = (value: number): string => {
  const byte = Math.round(Math.min(255, Math.max(0, value)));
  return byte.toString(16).padStart(2, '0');
};

export const oklchToHex = ({ C, H, L }: OKLCH): string => {
  const [r, g, b] = OKLCHSpace.to(sRGB, [L, C, H]); // gamma-encoded sRGB 0..1 (may exceed on OOG)
  return `#${toHexByte((r ?? 0) * 255)}${toHexByte((g ?? 0) * 255)}${toHexByte((b ?? 0) * 255)}`.toUpperCase();
};

const EPS = 1e-4;
const inGamut = (L: number, C: number, H: number): boolean => {
  const [r, g, b] = OKLCHSpace.to(sRGB_Linear, [L, C, H]); // in [0,1] linear == in sRGB gamut
  return (
    (r ?? 0) >= -EPS &&
    (r ?? 0) <= 1 + EPS &&
    (g ?? 0) >= -EPS &&
    (g ?? 0) <= 1 + EPS &&
    (b ?? 0) >= -EPS &&
    (b ?? 0) <= 1 + EPS
  );
};

/**
 * Reduce chroma until (L, C, H) fits in sRGB, holding L and H fixed.
 * colorjs.io's toGamut() shifts L and C together (perceptual gamut mapping), which
 * we don't want — the masks and the contrast bump rely on L and H staying put — so
 * we bisect chroma against the raw OKLCH → linear-sRGB conversion instead.
 */
export const clampChroma = (L: number, C: number, H: number): number => {
  if (inGamut(L, C, H)) return C;
  let lo = 0;
  let hi = C;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(L, mid, H)) lo = mid;
    else hi = mid;
  }
  return lo;
};
