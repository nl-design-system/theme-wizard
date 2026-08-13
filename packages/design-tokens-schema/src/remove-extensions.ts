import { walkTokens } from './walker';

export type RemoveExtensionsOptions = { keep: string[]; only?: never } | { keep?: never; only: string[] };

/**
 * @description
 * Warning: mutates input!
 * Recursively loop over `tokens` and remove `$extensions` from every token.
 * `options.keep` removes every extension key except the ones listed.
 * `options.only` removes only the extension keys listed.
 * If both are given (bypassing the type), `keep` wins and `only` is ignored.
 * Without `options`, `$extensions` is removed entirely.
 * The `$extensions` object is dropped entirely once it becomes empty.
 */
export const removeExtensions = (
  tokens: Record<string, unknown>,
  options?: RemoveExtensionsOptions,
): Record<string, unknown> => {
  walkTokens(tokens, (token) => {
    if (!token.$extensions) return;

    if (options?.keep) {
      const { keep } = options;
      for (const key of Object.keys(token.$extensions)) {
        if (!keep.includes(key)) {
          delete token.$extensions[key];
        }
      }
    } else if (options?.only) {
      for (const key of options.only) {
        delete token.$extensions[key];
      }
    } else {
      delete token.$extensions;
      return;
    }

    if (Object.keys(token.$extensions).length === 0) {
      delete token.$extensions;
    }
  });

  return tokens;
};
