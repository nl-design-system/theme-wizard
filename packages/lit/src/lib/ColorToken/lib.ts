export function createHelperElement() {
  const canRunInBrowser = CSS?.supports('color', 'oklch(from red l c h');
  if (!canRunInBrowser) return null;

  const element = document.createElement('div');
  element.style.display = 'none';
  document.body.appendChild(element);
  return element;
}

const numberPattern = '(-?[\\d.]+(?:e[+-]?\\d+)?)';
const colorComponentRegex = new RegExp(`${numberPattern}\\s+${numberPattern}\\s+${numberPattern}\\)$`);

export function getCSSColorComponents(value: string) {
  const [, a, b, c] = colorComponentRegex.exec(value)?.map(Number) || [NaN, NaN, NaN, NaN];
  const components: [number, number, number] = [a, b, c];
  return components;
}

type Degree = number;
/**
 * Get hue component for a specific RGB value.
 *
 * @SEE https://en.wikipedia.org/wiki/Hue
 *
 * @param RGB as numbers between 0 and 1, inclusive
 * @returns number between 0 - 360, latter exclusive
 */
export function getHue([r, g, b]: [r: number, g: number, b: number]): Degree {
  const radians = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b);
  return ((radians * 180) / Math.PI + 360) % 360; // wrap around when negative
}

type Percentage = number;
/**
 * Convert RGB components to HSL components.
 *
 * @SEE https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * @param RGB as numbers between 0 and 1, inclusive
 * @returns Hue in degrees, saturation and lightness in percentages
 */
export function toHSL([r, g, b]: [r: number, g: number, b: number]): [Degree, Percentage, Percentage] {
  const hue = getHue([r, g, b]);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const saturation =
    lightness % 1 !== 0 // no divide by zero
      ? (max - lightness) / Math.min(lightness, 1 - lightness)
      : 0;
  return [hue, saturation * 100, lightness * 100];
}

/**
 * Convert RGB components to HWB components.
 *
 * @SEE https://en.wikipedia.org/wiki/HWB_color_model
 *
 * @param RGB as numbers between 0 and 1, inclusive
 * @returns Hue in degrees, whiteness and blackness in percentages
 */
export function toHWB([r, g, b]: [r: number, g: number, b: number]): [Degree, Percentage, Percentage] {
  const hue = getHue([r, g, b]);
  const whiteness = Math.min(r, g, b);
  const blackness = 1 - Math.max(r, g, b);
  return [hue, whiteness * 100, blackness * 100];
}
