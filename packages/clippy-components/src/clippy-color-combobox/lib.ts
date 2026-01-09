/* eslint-disable perfectionist/sort-objects */
export const COLOR_NAMES = {
  RED: 'red',
  ORANGE: 'orange',
  YELLOW: 'yellow',
  GREEN: 'green',
  BLUE: 'blue',
  PURPLE: 'purple',
} as const;

export type ColorName = keyof typeof COLOR_NAMES;

export type ColorNameTranslations = { [K in ColorName]: string };

export type ColorLookup = {
  name: keyof typeof COLOR_NAMES;
  hue: (hue: number) => boolean;
  rgb: ([r, g, b]: [number, number, number]) => boolean;
};

export const namedColors: ColorLookup[] = [
  {
    name: 'RED',
    hue: (hue) => hue < 30 || hue > 315,
    rgb: ([r, g, b]) => r >= g + b,
  },
  {
    name: 'ORANGE',
    hue: (hue) => hue >= 30 && hue <= 60,
    rgb: ([r, g, b]) => r > g && g > b && r > b,
  },
  {
    name: 'YELLOW',
    hue: (hue) => hue > 45 && hue <= 75,
    rgb: ([r, g, b]) => r >= g && g >= b && Math.abs(r - g) < 100,
  },
  {
    name: 'GREEN',
    hue: (hue) => hue > 75 && hue <= 180,
    rgb: ([r, g, b]) => g > r && g > b,
  },
  {
    name: 'BLUE',
    hue: (hue) => hue > 180 && hue <= 270,
    rgb: ([r, g, b]) => b > r && b > g,
  },
  {
    name: 'PURPLE',
    hue: (hue) => hue > 270 && hue <= 315,
    rgb: ([r, g, b]) => r > g && b > g,
  },
];
