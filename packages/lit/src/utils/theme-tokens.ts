import type { SidebarConfig } from './types';

export interface CSSCustomProperty {
  variable: string;
  defaultValue: string | number;
}

export type ThemeTokenMapping = {
  [K in keyof SidebarConfig]?: CSSCustomProperty | CSSCustomProperty[];
};

export interface CSSRule {
  selector: string | string[];
  properties: Record<string, string>;
  prefix?: string;
}

export const THEME_TOKEN_MAPPING: ThemeTokenMapping = {
  bodyFont: {
    defaultValue: '"Comic Sans"',
    variable: 'basis-text-font-family-default',
  },
  headingFont: {
    defaultValue: '"Comic Sans"',
    variable: 'basis-heading-font-family',
  },
};

export const THEME_CSS_RULES: CSSRule[] = [
  {
    properties: {
      'font-family': 'var(--basis-heading-font-family)',
    },
    selector: ['h1', 'h2', 'h3'],
  },
  {
    properties: {
      'font-family': 'var(--basis-text-font-family-default)',
    },
    selector: ['p', 'li', 'span'],
  },
];
