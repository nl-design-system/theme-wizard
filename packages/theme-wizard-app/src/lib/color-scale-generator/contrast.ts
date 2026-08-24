import { contrastWCAG21, getLuminance } from 'colorjs.io/fn';
import 'colorjs.io/spaces'; // registers every space, so string colors can be parsed

/** WCAG relative luminance (0..1) from a hex string. */
export const relativeLuminance = (hex: string): number => getLuminance(hex);

/** WCAG contrast ratio between two hex colors (1..21). Order-independent. */
export const contrastRatio = (a: string, b: string): number => contrastWCAG21(a, b);
