import type { SidebarConfig } from './types';
import { THEME_TOKEN_MAPPING, type CSSCustomProperty } from './theme-tokens';

/**
 * Generates complete CSS stylesheet from theme configuration
 *
 * @param config - Current theme configuration
 * @returns CSS string ready to be applied via adoptedStyleSheets
 */
export function generateThemeCSS(config: SidebarConfig): string {
  const variables = generateCSSVariables(config);

  console.log('[CSS Generator] Generated variables:', variables);
  console.log('[CSS Generator] Config:', config);

  const css = `
    :host,
    :host *,
    :host *::before,
    :host *::after,
    .theme-wizard-preview {
      ${variables}
    }
  `.trim();

  console.log('[CSS Generator] Full CSS:', css);

  return css;
}

/**
 * Generates CSS variables from theme config (changes based on user input)
 */
function generateCSSVariables(config: SidebarConfig): string {
  const variables: string[] = [];
  const configKeys = Object.keys(THEME_TOKEN_MAPPING) as Array<keyof typeof THEME_TOKEN_MAPPING>;

  for (const configKey of configKeys) {
    const propertyDefinition = THEME_TOKEN_MAPPING[configKey];
    const configValue = config[configKey];

    if (!hasValue(configValue) || !propertyDefinition) {
      continue;
    }

    const declarations = createVariableDeclarations(configValue, propertyDefinition);
    variables.push(...declarations);
  }

  return variables.join('\n');
}

/**
 * Creates CSS variable declarations for a config value
 */
function createVariableDeclarations(
  configValue: string | number | boolean,
  propertyDefinition: CSSCustomProperty | CSSCustomProperty[],
): string[] {
  const properties = Array.isArray(propertyDefinition) ? propertyDefinition : [propertyDefinition];

  return properties.map((property) => {
    const cssValue = getCSSValue(configValue, property);
    return createCSSVariableDeclaration(property.variable, cssValue);
  });
}

function createCSSVariableDeclaration(variable: string, value: string | number): string {
  return `--${variable}: ${value} !important;`;
}

function hasValue(value: unknown): value is string | number | boolean {
  return value !== undefined && value !== null && value !== '';
}

function getCSSValue(value: string | number | boolean, property: CSSCustomProperty): string {
  if (!hasValue(value)) {
    return String(property.defaultValue);
  }

  return String(value);
}
