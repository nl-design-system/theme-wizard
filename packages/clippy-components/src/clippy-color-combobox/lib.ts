/* eslint-disable perfectionist/sort-objects */
export const COLOR_NAMES = {
  red: 'red',
  orange: 'orange',
  yellow: 'yellow',
  green: 'green',
  blue: 'blue',
  purple: 'purple',
  pink: 'pink',
  brown: 'brown',
  black: 'black',
  white: 'white',
  gray: 'gray',
  cyan: 'cyan',
  magenta: 'magenta',
  indigo: 'indigo',
} as const;

export type ColorName = keyof typeof COLOR_NAMES;

export type ColorNameTranslations = { [K in ColorName]: string };
