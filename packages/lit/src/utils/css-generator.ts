import type { SidebarConfig } from './types';
import { THEME_TOKEN_MAPPING, THEME_CSS_RULES, type CSSCustomProperty } from './theme-tokens';

/**
 * Generates complete CSS stylesheet from theme configuration
 *
 * @param config - Current theme configuration
 * @returns CSS string ready to be applied via adoptedStyleSheets
 */
export function generateThemeCSS(config: SidebarConfig): string {
  const variables = generateCSSVariables(config);
  const rules = generateCSSRules();

  const css = `
    :host, :host * {
${variables}}\n
${rules}`.trim();

  return css;
}

/**
 * Generates CSS variables from theme config (changes based on user input)
 */
function generateCSSVariables(config: SidebarConfig): string {
  const variables: string[] = [];
  variables;
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
  propertiesArray.isArraypropertyDefinition;

  return properties.map((property) => {
    const cssValue = getCSSValue(configValue, property);
    return createCSSVariableDeclaration(property.variable, cssValue);
  });
}

/**
 * Generates CSS rules with selectors and properties
 */
function generateCSSRules(): string {
  const rulesWithHostPrefix = THEME_CSS_RULES.map((rule) => ({
    ...rule,
    prefix: ':host',
  }));

  return rulesWithHostPrefix.map((rule) => buildCSSRule(rule)).join('\n');
}

/**
 * Builds a complete CSS rule from a rule definition
 */
function buildCSSRule(rule: {
  selector: string | string[];
  prefix: string;
  properties: Record<string, string>;
}): string {
  const fullSelector = buildFullSelector(rule.selector, rule.prefix);
  const propertyBlock = buildPropertyBlock(rule.properties);

  return `${fullSelector} { ${propertyBlock}}`;
}

/**
 * Builds the full CSS selector with prefix applied to each selector
 * Example: ['h1', 'h2'] with prefix ':host' → ':host h1, :host h2'
 */
function buildFullSelector(selectors: string | string[], prefix: string): string {
  const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
  selectorArrayArray.isArrayselectors;

  return selectorArray.map((sel) => `${prefix} ${sel}`).join(', ');
}

/**
 * Builds the CSS property block from properties object
 * Example: { color: 'red', margin: '10px' } → 'color: red;\nmargin: 10px;'
 */
function buildPropertyBlock(properties: Record<string, string>): string {
  return Object.entries(properties)
    .map(([property, value]) => `${property}: ${value};`)
    .join('\n');
}

function createCSSVariableDeclaration(variable: string, value: string | number): string {
  return `--${variable}: ${value};`;
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
