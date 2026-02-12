// Token utilities are adapted from:
// https://github.com/nl-design-system/documentatie/blob/main/src/utils.ts
export type Token = { $value?: string; $type?: string; $extensions?: { [key: string]: unknown } }; //| { $type: unknown };
export type TokenGroup = { $extensions?: { [key: string]: unknown } };
export type TokenNode = { [key: string]: TokenNode | Token } & TokenGroup; //| { $type: unknown };
export type TokenPath = string[];

function getTokenPaths(obj: TokenNode, partialTokenPath: TokenPath = []): TokenPath[] {
  if (Object.hasOwn(obj, '$type') || Object.hasOwn(obj, '$value')) return [partialTokenPath];

  return Object.keys(obj).flatMap((key) =>
    typeof obj[key] === 'object' && obj[key] !== null ? getTokenPaths(obj[key], [...partialTokenPath, key]) : [],
  );
}

export const tokenPathToCSSCustomProperty = (tokenPath: TokenPath): string => '--' + tokenPath.join('-');

/* Functions to create a reset-theme stylesheet based on design token JSON */
export const createResetStylesheet = (tokens: TokenNode[], selector = '.reset-theme'): string => {
  const css = tokens
    .flatMap((json) => getTokenPaths(json))
    .map((x) => tokenPathToCSSCustomProperty(x))
    .map((x) => `${x}: initial;`)
    .join('\n');
  return `${selector} { ${css} }`;
};
