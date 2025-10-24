import {
  css_to_tokens as cssToTokens,
  EXTENSION_AUTHORED_AS as PW_EXTENSION_AUTHORED_AS,
  EXTENSION_CSS_PROPERTIES as PW_EXTENSION_CSS_PROPERTIES,
  EXTENSION_USAGE_COUNT as PW_EXTENSION_USAGE_COUNT,
} from '@projectwallace/css-design-tokens';
import {
  EXTENSION_AUTHORED_AS,
  EXTENSION_CSS_PROPERTIES,
  EXTENSION_TOKEN_ID,
  EXTENSION_USAGE_COUNT,
  type ScrapedDesignToken,
} from './design-tokens.types';

export * from './design-tokens.types';

export const getDesignTokens = (css: string): ScrapedDesignToken[] => {
  const tokens = cssToTokens(css);
  const flatTokens: ScrapedDesignToken[] = [];

  for (const tokenId in tokens.color) {
    const token = tokens.color[tokenId];

    if (token.$type === 'color') {
      flatTokens.push({
        $extensions: {
          [EXTENSION_AUTHORED_AS]: token.$extensions[PW_EXTENSION_AUTHORED_AS],
          [EXTENSION_CSS_PROPERTIES]: token.$extensions[PW_EXTENSION_CSS_PROPERTIES],
          [EXTENSION_TOKEN_ID]: tokenId,
          [EXTENSION_USAGE_COUNT]: token.$extensions[PW_EXTENSION_USAGE_COUNT],
        },
        $type: 'color',
        $value: token.$value,
      });
    }
  }

  for (const tokenId in tokens.font_family) {
    const token = tokens.font_family[tokenId];

    if (token.$type === 'fontFamily') {
      flatTokens.push({
        $extensions: {
          [EXTENSION_AUTHORED_AS]: token.$extensions[PW_EXTENSION_AUTHORED_AS],
          [EXTENSION_CSS_PROPERTIES]: ['font-family'],
          [EXTENSION_TOKEN_ID]: tokenId,
          [EXTENSION_USAGE_COUNT]: token.$extensions[PW_EXTENSION_USAGE_COUNT],
        },
        $type: token.$type,
        $value: token.$value,
      });
    }
  }

  for (const tokenId in tokens.font_size) {
    const token = tokens.font_size[tokenId];

    if (token.$type === 'dimension') {
      flatTokens.push({
        $extensions: {
          [EXTENSION_AUTHORED_AS]: token.$extensions[PW_EXTENSION_AUTHORED_AS],
          [EXTENSION_CSS_PROPERTIES]: ['font-size'],
          [EXTENSION_TOKEN_ID]: tokenId,
          [EXTENSION_USAGE_COUNT]: token.$extensions[PW_EXTENSION_USAGE_COUNT],
        },
        $type: token.$type,
        $value: token.$value,
      });
    }
  }

  return flatTokens;
};
