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
