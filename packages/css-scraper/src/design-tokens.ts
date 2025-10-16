import {
  css_to_tokens as cssToTokens,
  type ColorToken as PWColortoken,
  type FontFamilyToken as PWFontFamilyToken,
  type DimensionToken as PWDimensionToken,
  EXTENSION_AUTHORED_AS as PW_EXTENSION_AUTHORED_AS,
  EXTENSION_CSS_PROPERTIES as PW_EXTENSION_CSS_PROPERTIES,
  EXTENSION_USAGE_COUNT as PW_EXTENSION_USAGE_COUNT,
} from '@projectwallace/css-design-tokens';

export const EXTENSION_TOKEN_ID = 'nl.nldesignsystem.theme-wizard.token-id';
export const EXTENSION_USAGE_COUNT = 'nl.nldesignsystem.theme-wizard.usage-count';
export const EXTENSION_AUTHORED_AS = 'nl.nldesignsystem.theme-wizard.css-authored-as';
export const EXTENSION_CSS_PROPERTIES = 'nl.nldesignsystem.theme-wizard.css-properties';

type TokenExtensions = {
  [EXTENSION_TOKEN_ID]: string;
  [EXTENSION_USAGE_COUNT]: number;
  [EXTENSION_AUTHORED_AS]: string;
  [EXTENSION_CSS_PROPERTIES]: string[];
};

type BaseToken = {
  $extensions: TokenExtensions;
};

// Define all token types
export type ColorToken = BaseToken & Pick<PWColortoken, '$type' | '$value'>;
export type FontFamilyToken = BaseToken & Pick<PWFontFamilyToken, '$type' | '$value'>;
export type FontSizeToken = BaseToken & Pick<PWDimensionToken, '$type' | '$value'>;

export type DesignToken = ColorToken | FontFamilyToken | FontSizeToken;

export const getDesignTokens = (css: string): DesignToken[] => {
  const tokens = cssToTokens(css);
  const flatTokens: DesignToken[] = [];

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
