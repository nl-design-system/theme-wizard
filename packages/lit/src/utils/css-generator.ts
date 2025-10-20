import type { SidebarConfig } from './types';
import { PREVIEW_THEME } from '../components/preview/preview';
import { getThemeStyleString } from './style-utils';

/**
 * Generates complete CSS stylesheet from theme configuration
 *
 * @param config - Current theme configuration
 * @returns CSS string ready to be applied via adoptedStyleSheets
 */
export function generateThemeCSS(config: SidebarConfig): string {
  const themeStyleProperties = getThemeStyleString(config);

  const css = `
  ${PREVIEW_THEME} {
      ${themeStyleProperties}
    }
  `.trim();

  return css;
}
