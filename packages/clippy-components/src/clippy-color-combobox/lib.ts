export type ColorLookup = {
  name: string;
  hue: (hue: number) => boolean;
  rgb: ([r, g, b]: [number, number, number]) => boolean;
};

export const namedColors: ColorLookup[] = [
  {
    name: 'red',
    hue: (hue) => hue < 30 || hue > 315,
    rgb: ([r, g, b]) => r >= g + b,
  },
  {
    name: 'orange',
    hue: (hue) => hue >= 30 && hue <= 60,
    rgb: ([r, g, b]) => r > g && g > b && r > b,
  },
  {
    name: 'yellow',
    hue: (hue) => hue > 45 && hue <= 75,
    rgb: ([r, g, b]) => r >= g && g >= b && Math.abs(r - g) < 100,
  },
  {
    name: 'green',
    hue: (hue) => hue > 75 && hue <= 180,
    rgb: ([r, g, b]) => g > r && g > b,
  },
  {
    name: 'blue',
    hue: (hue) => hue > 180 && hue <= 270,
    rgb: ([r, g, b]) => b > r && b > g,
  },
  {
    name: 'purple',
    hue: (hue) => hue > 270 && hue <= 315,
    rgb: ([r, g, b]) => r > g && b > g,
  },
];
