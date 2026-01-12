export const unquote = (input: string = ''): string => {
  return input.replaceAll(/(^['"])|(['"]$)/g, '');
};
