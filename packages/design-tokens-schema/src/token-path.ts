import { setExtension } from './extensions';
import { ThemeLike } from './theme';
import { walkTokens } from './walker';

export const EXTENSION_TOKEN_PATH = 'nl.nldesignsystem.path';

declare module './extensions' {
  interface ExtensionTypeMap {
    [EXTENSION_TOKEN_PATH]: string;
  }
}

/**
 * Warning: mutates input!
 * Adds an $extension with the path.to.token
 */
export const addTokenPathExtensions = (theme: ThemeLike): ThemeLike => {
  walkTokens(theme, (token, path) => {
    setExtension(token, EXTENSION_TOKEN_PATH, path.join('.'));
  });
  return theme;
};
