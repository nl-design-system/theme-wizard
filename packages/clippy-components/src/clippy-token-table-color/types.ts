import { BaseDesignToken } from '@nl-design-system-community/design-tokens-schema';

export type BaseToken = {
  tokenId: string;
  usage: string[];
  usageCount: number;
};

export type ColorEntry = BaseToken & {
  colorKey: string;
  displayValue: string;
};

export type ColorGroup = {
  colorEntries: ColorEntry[];
  key: string;
};

export type TokenCollection = {
  name: string;
  tokens: BaseDesignToken[];
}[];
