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
