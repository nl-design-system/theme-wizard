import { walkTokens } from './walker';

/**
 * @description
 * Warning: mutates input!
 * Recursively loop over `tokens` and remove `$extensions` from every token.
 * When `extensions` is given, only those specific extension keys are removed
 * (the `$extensions` object is dropped entirely once it becomes empty).
 */
export const removeExtensions = (tokens: Record<string, unknown>, extensions?: string[]) => {
  const keysToRemove = Array.isArray(extensions) ? extensions : undefined;

  walkTokens(tokens, (token) => {
    if (!token.$extensions) return;

    if (keysToRemove) {
      for (const key of keysToRemove) {
        delete token.$extensions[key];
      }
      if (Object.keys(token.$extensions).length === 0) {
        delete token.$extensions;
      }
    } else {
      delete token.$extensions;
    }
  });

  return tokens;
};
