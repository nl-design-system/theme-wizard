import type { DesignToken } from 'style-dictionary/types';

export type DisplayToken = {
  tokenId: string;
  usage: string[];
  tokenType: DesignToken['$type'];
  displayValue: string;
  metadata?: Record<string, string>;
};

export type TokenTableRow = Pick<DisplayToken, 'tokenId' | 'displayValue' | 'usage'>;

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

export type FontFamilyToken = BaseToken & {
  name: string;
  displayValue: string;
  googleFontsSpecimen: string | null;
};

export type FontSizeToken = BaseToken & {
  name: string;
  displayValue: string;
};

export type SpaceToken = BaseToken & {
  name: string;
  value: string;
};
