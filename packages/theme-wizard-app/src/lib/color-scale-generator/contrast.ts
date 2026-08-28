import { contrastAPCA, contrastWCAG21, getLuminance } from 'colorjs.io/fn';
import type { OKLCH } from './oklch.js';
import 'colorjs.io/spaces'; // registers every space, so string colors can be parsed

/** WCAG relative luminance (0..1) from a hex string. */
export const relativeLuminance = (hex: string): number => getLuminance(hex);

/** WCAG relative luminance (0..1) of an OKLCH color, with no hex round-trip. */
export const relativeLuminanceOfOklch = ({ C, H, L }: OKLCH): number => {
  return getLuminance({ coords: [L, C, H], space: 'oklch' });
};

/**
 * WCAG contrast ratio (1..21) between two relative luminances. Order-independent.
 * Split out from `contrastRatio` so a luminance that doesn't change between calls
 * (e.g. a fixed background) can be computed once and reused, instead of reparsing
 * its hex on every comparison.
 */
export const contrastFromLuminance = (a: number, b: number): number => {
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
};

/** WCAG contrast ratio between two hex colors (1..21). Order-independent. */
export const contrastRatio = (a: string, b: string): number => contrastWCAG21(a, b);

/** APCA Lc (signed, ~-108..106) of an OKLCH foreground on an OKLCH background. Order matters, unlike WCAG. */
export const apcaContrastOfOklch = (background: OKLCH, foreground: OKLCH): number => {
  return contrastAPCA(
    { coords: [background.L, background.C, background.H], space: 'oklch' },
    { coords: [foreground.L, foreground.C, foreground.H], space: 'oklch' },
  );
};

/** APCA Lc (signed, ~-108..106) between two hex colors. Order matters: (background, foreground). */
export const apcaContrast = (background: string, foreground: string): number => contrastAPCA(background, foreground);
