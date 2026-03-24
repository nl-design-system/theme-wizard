import {
  isValueObject,
  stringifyColor,
  stringifyDimension,
  stringifyFontFamily,
  type ColorValue,
  type ModernDimensionValue,
} from '@nl-design-system-community/design-tokens-schema';
import startTokens from '@nl-design-system-unstable/start-design-tokens/dist/tokens.json';
import type Theme from './Theme';

function getTokenAtPath(source: unknown, path: string) {
  return path
    .split('.')
    .reduce<unknown>(
      (current, segment) =>
        current && typeof current === 'object' && !Array.isArray(current)
          ? (current as Record<string, unknown>)[segment]
          : undefined,
      source,
    );
}

function isColorValue(value: unknown): value is ColorValue {
  return isValueObject(value) && 'colorSpace' in value && 'components' in value;
}

function isDimensionValue(value: unknown): value is ModernDimensionValue {
  return isValueObject(value) && 'unit' in value && 'value' in value;
}

export function stringifyTokenValue(token: unknown): string {
  if (typeof token === 'string') return token;

  if (!isValueObject(token)) {
    return JSON.stringify(token);
  }

  const value = token['$value'];

  if (value === undefined || value === null) {
    return '';
  }

  if (Array.isArray(value)) {
    return stringifyFontFamily(value);
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (isColorValue(value)) {
    return stringifyColor(value);
  }

  if (isDimensionValue(value)) {
    return stringifyDimension(value);
  }

  if (isValueObject(value)) {
    return JSON.stringify(value);
  }

  return value.toString();
}

export function resolveTokenReferenceValue(value: string, theme: Theme, seen = new Set<string>()): string | null {
  const normalized = value.startsWith('{') && value.endsWith('}') ? value.slice(1, -1) : '';

  if (!normalized) {
    return value;
  }

  if (seen.has(normalized)) {
    return value;
  }

  seen.add(normalized);

  const token =
    theme.at(normalized) ?? getTokenAtPath(theme.defaults, normalized) ?? getTokenAtPath(startTokens, normalized);
  const tokenValue = token?.['$value'];

  if (typeof tokenValue === 'string' && tokenValue.startsWith('{') && tokenValue.endsWith('}')) {
    return resolveTokenReferenceValue(tokenValue, theme, seen);
  }

  if (tokenValue === undefined) {
    return null;
  }

  return stringifyTokenValue({ $value: tokenValue });
}
