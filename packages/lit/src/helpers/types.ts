/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

/**
 * Interface for theme style properties
 *
 * This interface defines all available theme properties that can be used
 * in components.
 * Add new properties here to automatically include them in all components.
 */
export interface ThemeStyleProperties {
  /** Font family for body text */
  bodyFontFamily?: string;
  /** Font family for headings */
  headingFontFamily?: string;
}

/**
 * Interface for URL parameters configuration
 */
export interface UrlParamsConfig {
  /** Website URL to analyze */
  sourceUrl?: string;
  /** Font family for headings */
  headingFont?: string;
  /** Font family for body text */
  bodyFont?: string;
  /** CSS theme class name */
  themeClass?: string;
  /** Custom CSS rules */
  customCss?: string;
}
