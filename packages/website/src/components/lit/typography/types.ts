/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

/**
 * Typography configuration interface
 * @interface TypographyConfig
 */
export interface TypographyConfig {
  /** Font family for body text */
  bodyFont?: string;
  /** Font family for headings */
  headingFont?: string;
}

/**
 * Font option interface for dropdown selections
 * @interface FontOption
 */
export interface FontOption {
  /** Display label for the font option */
  label: string;
  /** CSS font-family value */
  value: string;
}
