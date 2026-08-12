import type { DesignToken } from 'style-dictionary/types';
import { Concepts } from '@src/clippy-token-sample-spacing/types';

export type DisplayToken = {
  tokenId: string;
  usage: string[];
  usageCount?: number;
  tokenType: DesignToken['$type'];
  displayValue: string;
  metadata?: Record<string, string>;
};

export type ColorDisplayToken = DisplayToken & {};

export type SpacingDisplayToken = DisplayToken & {
  metadata: {
    concept: Concepts;
    [key: string]: string;
  };
};

export type TextDisplayToken = DisplayToken & {};
