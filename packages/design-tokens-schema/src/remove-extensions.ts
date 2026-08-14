import { walkTokens } from './walker';

export type RemoveExtensionsOptions = {
  /** Remove all extensions except these (opt-out list) */
  exclude?: string[];
  /** Only remove these extensions (opt-in list) */
  include?: string[];
};

/**
 * @description
 * Warning: mutates input!
 * Recursively loop over `tokens` and remove `$extensions` from every token.
 * `options.exclude` removes every extension key except the ones listed.
 * `options.include` removes only the extension keys listed.
 * If both are given (bypassing the type), `exclude` wins and `include` is ignored.
 * Without `options`, `$extensions` is removed entirely.
 * The `$extensions` object is dropped entirely once it becomes empty.
 */
export const removeExtensions = (
  tokens: Record<string, unknown>,
  options?: RemoveExtensionsOptions,
): Record<string, unknown> => {
  walkTokens(tokens, (token) => {
    if (!token.$extensions) return;

    if (options?.exclude) {
      const { exclude: keep } = options;
      for (const key of Object.keys(token.$extensions)) {
        if (!keep.includes(key)) {
          delete token.$extensions[key];
        }
      }
    } else if (options?.include) {
      for (const key of options.include) {
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
