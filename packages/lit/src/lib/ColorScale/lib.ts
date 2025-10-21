import type { ColorToken, ColorSpace } from '@nl-design-system-community/css-scraper';
export type { ColorToken, ColorSpace };

export type ColorTokenOkLCh = ColorToken & {
  $value: ColorToken['$value'] & {
    colorSpace: 'oklch';
  };
};

export type ColorComponents = ColorToken['$value']['components'];

export function createHelperElement() {
  const canRunInBrowser = CSS?.supports('color', 'oklch(from red l c h');
  if (!canRunInBrowser) return null;

  const element = document.createElement('div');
  element.style.display = 'none';
  document.body.appendChild(element);
  return element;
}

export function getCSSColorFunction({
  colorSpace,
  components,
}: {
  colorSpace: ColorSpace;
  components: ColorComponents;
}): string {
  /**
   * @SEE https://www.designtokens.org/tr/third-editors-draft/color/#supported-color-spaces
   */
  const percentage = (c: 'none' | number) => (c === 'none' ? c : `${c}%`);

  const [first, ...rest] = components;

  switch (colorSpace) {
    // These color spaces are polar:
    case 'hsl':
      return `hsl(${first} ${rest.map(percentage).join(' ')})`;
    case 'hwb':
      return `hwb(${first} ${rest.map(percentage).join(' ')})`;
    case 'lch':
      return `lch(${percentage(first)} ${rest.join(' ')})`;
    case 'oklch':
      return `oklch(${percentage(first)} ${rest.join(' ')})`;
    // These color spaces are cartesian:
    case 'lab':
      return `lab(${percentage(first)} ${rest.join(' ')})`;
    case 'oklab':
      return `oklab(${percentage(first)} ${rest.join(' ')})`;
    // These color spaces are cartesian and have components encoded as [ 0.0 - 1.0, 0.0 - 1.0 , 0.0 - 1.0 ]
    case 'srgb':
    case 'display-p3':
    case 'a98-rgb':
    case 'prophoto-rgb':
    case 'rec2020':
    case 'xyz-d50':
    case 'xyz-d65':
    default:
      // Assume a missing color space is also cartesian
      return `color(${colorSpace} ${components.join(' ')})`;
  }
}

export function isColorTokenOkLCh(token: ColorToken): token is ColorTokenOkLCh {
  return token.$value.colorSpace === 'oklch';
}
