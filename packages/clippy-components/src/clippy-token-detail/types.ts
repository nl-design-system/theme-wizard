import type { DesignToken } from 'style-dictionary/types';

export type DisplayToken = {
  tokenId: string;
  usage: string[];
  tokenType: DesignToken['$type'];
  displayValue: string;
  metadata?: Record<string, string>;
};
