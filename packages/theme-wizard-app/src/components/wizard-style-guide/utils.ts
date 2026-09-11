import type { TokenCollection } from '@nl-design-system-community/clippy-components/src/clippy-token-table-color/types.js';
import '@nl-design-system-community/clippy-components/clippy-color-sample';
import '@nl-design-system-community/clippy-components/clippy-modal';
import '@nl-design-system-community/clippy-components/clippy-heading';
import '@nl-design-system-community/clippy-components/clippy-token-sample-text';
import { ThemeLike, BaseDesignToken, TokenPath, isTokenLike } from '@nl-design-system-community/design-tokens-schema';
import dlv from 'dlv';

export const getTokensByPath = ({
  basePath,
  tokens,
}: {
  tokens: ThemeLike;
  basePath: TokenPath;
}): BaseDesignToken[] => {
  const result: BaseDesignToken[] = [];

  const tokensAtPath = dlv(tokens, basePath);
  Object.entries(tokensAtPath).forEach(([, token]) => {
    if (isTokenLike(token)) {
      result.push(token);
    }
  });

  return result;
};

export const getTokenCollectionByTokenPaths = (tokens: ThemeLike, paths: TokenPath[]): TokenCollection => {
  const result: TokenCollection = [];
  paths.forEach((path) => {
    const tokensByPath = getTokensByPath({ basePath: path, tokens });
    if (tokensByPath.length > 0) {
      result.push({ name: path.join('.'), tokens: tokensByPath });
    }
  });
  return result;
};
