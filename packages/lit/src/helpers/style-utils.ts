/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { ThemeStyleProperties } from './types';

/**
 * Central mapping of theme properties to CSS custom properties
 * Add new properties here to automatically include them in all components
 */
const THEME_PROPERTY_MAPPING: Record<keyof ThemeStyleProperties, string> = {
  bodyFontFamily: '--theme-body-font-family',
  headingFontFamily: '--theme-heading-font-family',
};

/**
 * Converts theme properties to CSS custom properties object
 * @param properties - Theme properties to convert
 * @returns Object with CSS custom properties
 * @example
 * ```typescript
 * const properties = {
 *   bodyFontFamily: 'Arial, sans-serif',
 *   headingFontFamily: 'Times New Roman, serif',
 * };
 * const cssProps = getThemeStyleProperties(properties);
 * // Returns: { '--theme-body-font-family': 'Arial, sans-serif', '--theme-heading-font-family': 'Times New Roman, serif' }
 * ```
 */
export function getThemeStyleProperties(properties: ThemeStyleProperties): Record<string, string> {
  const cssProperties: Record<string, string> = {};

  Object.entries(properties).forEach(([key, value]) => {
    const cssProperty = THEME_PROPERTY_MAPPING[key as keyof ThemeStyleProperties];
    if (cssProperty && value && value.trim() !== '') {
      cssProperties[cssProperty] = value;
    }
  });

  return cssProperties;
}

/**
 * Converts theme properties to CSS custom properties string
 * @param properties - Theme properties to convert
 * @returns CSS custom properties string
 * @example
 * ```typescript
 * const properties = {
 *   bodyFontFamily: 'Arial, sans-serif',
 *   headingFontFamily: 'Times New Roman, serif'
 * };
 * const cssString = getThemeStyleString(properties);
 * // Returns: "--theme-body-font-family: Arial, sans-serif; --theme-heading-font-family: Times New Roman, serif;"
 * ```
 */
export function getThemeStyleString(properties: ThemeStyleProperties): string {
  const cssProperties = getThemeStyleProperties(properties);
  const cssPairs = Object.entries(cssProperties)
    .filter(([, value]) => value && value.trim() !== '')
    .map(([key, value]) => `${key}: ${value}`);

  return cssPairs.join('; ') + (cssPairs.length > 0 ? ';' : '');
}

/**
 * Converts theme properties to inline style object for React/JSX
 * @param properties - Theme properties to convert
 * @returns Inline style object
 * @example
 * ```typescript
 * const properties = {
 *   bodyFontFamily: 'Arial, sans-serif',
 *   headingFontFamily: 'Times New Roman, serif'
 * };
 * const styleObject = getThemeStyleObject(properties);
 * // Returns: { '--theme-body-font-family': 'Arial, sans-serif', '--theme-heading-font-family': 'Times New Roman, serif' }
 * ```
 */
export function getThemeStyleObject(properties: ThemeStyleProperties): Record<string, string> {
  return getThemeStyleProperties(properties);
}

/**
 * Automatically extracts theme properties from a component object
 * This function looks for properties that match the ThemeStyleProperties interface
 * @param component - Component object to extract properties from
 * @returns Theme properties object
 * @example
 * ```typescript
 * // In a component:
 * const themeProps = extractThemeProperties(this);
 * const styles = getThemeStyleString(themeProps);
 * ```
 */
export function extractThemeProperties(component: Record<string, any>): ThemeStyleProperties {
  const themeProperties: ThemeStyleProperties = {};

  // Automatically extract all theme properties from the component
  Object.keys(THEME_PROPERTY_MAPPING).forEach((key) => {
    if (component[key] !== undefined && component[key] !== null) {
      (themeProperties as any)[key] = component[key];
    }
  });

  return themeProperties;
}
