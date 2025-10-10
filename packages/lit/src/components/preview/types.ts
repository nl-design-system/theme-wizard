/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

export interface PreviewState {
  htmlContent: string;
  externalStyles: string;
  inlineStyles: string;
  isLoading: boolean;
  error: string;
}

export interface PreviewConfig {
  url: string;
  headingFontFamily: string;
  bodyFontFamily: string;
}
