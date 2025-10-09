/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

export interface FontOption {
  value: string;
  label: string;
  category?: 'serif' | 'sans-serif' | 'monospace' | 'display';
}

export interface ThemePreviewElement extends HTMLElement {
  url?: string;
  headingFontFamily?: string;
  bodyFontFamily?: string;
  themeClass?: string;
  customCss?: string;
  refresh?: () => Promise<void>;
}

export interface ThemeData {
  colors: {
    primary: string;
    secondary?: string;
    background?: string;
  };
  sourceUrl: string;
  typography: {
    bodyFontFamily: string;
    headingFontFamily: string;
  };
}

export interface WindowWithThemeData extends Window {
  __THEME_DATA__?: ThemeData;
  __SSR__?: boolean;
}

export interface FontCategory {
  name: string;
  fonts: FontOption[];
}

export interface UrlValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  error?: string;
}
