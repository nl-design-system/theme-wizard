/**
 * @license EUPL-1.2
 * Copyright (c) 2021 Community for NL Design System
 */

import type { ThemeStyleProperties } from './types';

/**
 * Central mapping of theme properties to CSS custom properties
 * Add new properties here to automatically include them in all components
 */
const THEME_PROPERTY_MAPPING = {
  bodyFontFamily: '--basis-text-font-family-default',
  headingColor: '--basis-heading-color',
  headingFontFamily: '--basis-heading-font-family',
  headingFontSize: '--basis-heading-font-size',
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
 * // Returns: { '--basis-text-font-family-default': 'Arial, sans-serif', '--basis-heading-font-family': 'Times New Roman, serif' }
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
 * // Returns: "--basis-text-font-family-default: Arial, sans-serif; --basis-heading-font-family: Times New Roman, serif;"
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
 * Automatically extracts theme properties from a component-like object.
 * Reads only keys present in the component; missing keys are ignored.
 * @param component - Partial theme props (e.g. `this` of a component)
 * @returns Theme properties object with only defined values
 * @example
 * const themeProps = extractThemeProperties({ bodyFontFamily: 'Arial' });
 * const styles = getThemeStyleString(themeProps);
 */
export function extractThemeProperties(component: Partial<ThemeStyleProperties>): ThemeStyleProperties {
  const themeProperties: ThemeStyleProperties = {};
  for (const key of Object.keys(THEME_PROPERTY_MAPPING) as Array<keyof ThemeStyleProperties>) {
    const value = component[key];
    if (typeof value === 'string' && value.trim() !== '') {
      themeProperties[key] = value;
    }
  }
  return themeProperties;
}
