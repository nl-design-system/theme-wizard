import { isValueObject } from './tokens/token-reference';
import { walkObject } from './walker';

export type RemoveExtensionsOptions = {
  /** Remove all extensions except these (opt-out list) */
  exclude?: string[];
  /** Only remove these extensions (opt-in list) */
  include?: string[];
};

type WithExtensions = { $extensions: Record<string, unknown> };

const hasExtensions = (data: unknown): data is WithExtensions => {
  return isValueObject(data) && Object.hasOwn(data, '$extensions') && isValueObject(data['$extensions']);
};

const pruneExtensions = (node: WithExtensions, options?: RemoveExtensionsOptions): void => {
  if (options?.exclude) {
    const { exclude: keep } = options;
    for (const key of Object.keys(node.$extensions)) {
      if (!keep.includes(key)) {
        delete node.$extensions[key];
      }
    }
  } else if (options?.include) {
    for (const key of options.include) {
      delete node.$extensions[key];
    }
  } else {
    delete (node as Partial<WithExtensions>).$extensions;
    return;
  }

  if (Object.keys(node.$extensions).length === 0) {
    delete (node as Partial<WithExtensions>).$extensions;
  }
};

/**
 * @description
 * Warning: mutates input!
 * Recursively loop over `tokens` and remove `$extensions` from every token
 * and token group (or any object carrying an `$extensions` key).
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
  walkObject(tokens, hasExtensions, (node) => pruneExtensions(node, options));

  return tokens;
};
