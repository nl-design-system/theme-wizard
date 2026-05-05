import { parse_dimension } from '@projectwallace/css-parser';
import Color from 'colorjs.io';
import { klona as deepClone } from 'klona';
import type { TokenFile, Token, Group, DimensionValue } from './types.ts';

// ---------------------------------------------------------------------------
// $type mapping: SD / Tokens Studio → DTCG spec
// ---------------------------------------------------------------------------

/* eslint-disable perfectionist/sort-objects */
const TYPE_MAP: Record<string, string> = {
  fontSize: 'dimension',
  fontSizes: 'dimension',
  size: 'dimension',
  sizing: 'dimension',
  spacing: 'dimension',
  borderRadius: 'dimension',
  borderWidth: 'dimension',
  letterSpacing: 'dimension',
  paragraphSpacing: 'dimension',
  paragraphIndent: 'dimension',
  fontFamily: 'fontFamily',
  fontFamilies: 'fontFamily',
  fontWeight: 'fontWeight',
  fontWeights: 'fontWeight',
  fontStyle: 'fontStyle',
  duration: 'duration',
  time: 'duration',
  easing: 'cubicBezier',
  color: 'color',
  opacity: 'number',
  number: 'number',
  boolean: 'boolean',
  string: 'string',
  shadow: 'shadow',
  boxShadow: 'shadow',
  gradient: 'gradient',
  typography: 'typography',
  border: 'border',
  transition: 'transition',
  strokeStyle: 'strokeStyle',
  cubicBezier: 'cubicBezier',
  // Identity mappings — already correct
  dimension: 'dimension',
  // Legacy kebab-case → spec camelCase
  'font-family': 'fontFamily',
  'font-weight': 'fontWeight',
  'font-style': 'fontStyle',
  'cubic-bezier': 'cubicBezier',
  'stroke-style': 'strokeStyle',
  percentage: 'percentage',
};

// ---------------------------------------------------------------------------
// Keys to strip (SD metadata + legacy non-$ token keys)
// ---------------------------------------------------------------------------

const STRIP_KEYS = new Set([
  'filePath',
  'isSource',
  'original',
  'name',
  'attributes',
  'path',
  'value',
  'type',
  'comment',
  'description',
]);

const DTCG_TOKEN_KEYS = new Set(['$type', '$value', '$description', '$extensions', '$deprecated']);

// ---------------------------------------------------------------------------
// $value transformers
// ---------------------------------------------------------------------------

/**
 * Real CSS units, plus empty string (unitless zero like `0`).
 * Used to detect when parse_dimension() fell back to using the raw string
 * as the unit for values it couldn't parse (calc(), inherit, var(--x), …).
 */
const REAL_UNIT_RE =
  /^(px|rem|em|ex|ch|vw|vh|vmin|vmax|svw|svh|dvw|dvh|cqw|cqh|fr|pt|pc|cm|mm|in|Q|lh|rlh|cap|ic|vi|vb|%|)$/i;

/**
 * Parse a CSS dimension string into a `{ value, unit }` object using
 * `@projectwallace/css-parser`'s `parse_dimension()`.
 *
 * Returns `null` for values that aren't real CSS dimensions (e.g. `calc()`,
 * `inherit`, `var(--x)`). Callers should keep those as-is strings.
 *
 * @example
 * parseDimension("1.5rem")         // => { value: 1.5, unit: "rem" }
 * parseDimension("8px")            // => { value: 8,   unit: "px"  }
 * parseDimension("0")              // => { value: 0,   unit: ""    }
 * parseDimension("calc(100% - 8px)") // => null
 * parseDimension("inherit")          // => null
 */
export function parseDimension(raw: string): DimensionValue | null {
  const result = parse_dimension(raw.trim());
  if (!REAL_UNIT_RE.test(result.unit)) return null;
  return { value: result.value, unit: result.unit };
}

/**
 * Parse a CSS font-family string into an array of family names.
 * Strips surrounding quotes from quoted names.
 *
 * @example
 * parseFontFamily("Inter, sans-serif")        // => ["Inter", "sans-serif"]
 * parseFontFamily('"Helvetica Neue", Arial')  // => ["Helvetica Neue", "Arial"]
 */
export function parseFontFamily(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);
}

const FONT_WEIGHT_MAP: Record<string, number> = {
  /* eslint-disable perfectionist/sort-objects */
  thin: 100,
  hairline: 100,
  extralight: 200,
  ultralight: 200,
  light: 300,
  normal: 400,
  regular: 400,
  medium: 500,
  semibold: 600,
  demibold: 600,
  bold: 700,
  extrabold: 800,
  ultrabold: 800,
  black: 900,
  heavy: 900,
};

export function parseFontWeight(raw: string): number | null {
  const normalized = raw.toLowerCase().trim();
  if (Object.hasOwn(FONT_WEIGHT_MAP, normalized)) return FONT_WEIGHT_MAP[normalized];
  const asNumber = Number(normalized);
  return Number.isFinite(asNumber) ? asNumber : null;
}

const isRef = (value: unknown): boolean => typeof value === 'string' && value.startsWith('{') && value.endsWith('}');

/**
 * Resolve the DTCG type and transformed value for a lineHeight/lineHeights token.
 *
 * - Bare number or number-string (e.g. 1.5, "1.5")   → type: number
 * - Percentage string (e.g. "150%")                  → type: number, value: 1.5
 * - CSS dimension with unit (e.g. "24px")            → type: dimension, value: { value: 24, unit: "px" }
 */
function upgradeLineHeight(raw: unknown): { type: 'number' | 'dimension'; value: unknown } {
  if (typeof raw === 'number') return { type: 'number', value: raw };

  if (typeof raw === 'string') {
    // percentage → unitless ratio
    if (raw.endsWith('%')) {
      const pct = Number.parseFloat(raw);
      if (Number.isFinite(pct)) return { type: 'number', value: pct / 100 };
    }

    // bare number string
    const asNumber = Number.parseFloat(raw);
    if (asNumber.toString() === raw) return { type: 'number', value: asNumber };

    // CSS dimension with unit
    const dim = parseDimension(raw);
    if (dim !== null && Number.isFinite(dim.value)) {
      if (dim.unit) return { type: 'dimension', value: dim };
      return { type: 'number', value: dim.value };
    }
  }

  // Fallback: keep as number type, value unchanged (schema validation will catch bad values)
  return { type: 'number', value: raw };
}

/**
 * Map from DTCG $type to the transformer for its $value.
 * Only types that need transformation are listed; all others pass through.
 */
const VALUE_TRANSFORMERS: Record<string, (raw: unknown) => unknown> = {
  dimension(raw) {
    if (typeof raw !== 'string') return raw; // already an object — pass through
    return parseDimension(raw) ?? raw; // fall back to string for calc(), etc.
  },
  fontFamily(raw) {
    if (Array.isArray(raw)) return raw; // already upgraded
    if (typeof raw !== 'string') return raw;
    return parseFontFamily(raw);
  },
  fontWeight(raw) {
    if (typeof raw !== 'string') return raw; // already a number — pass through
    return parseFontWeight(raw) ?? raw;
  },
  color(raw) {
    if (typeof raw !== 'string' || isRef(raw)) return raw;
    try {
      const c = new Color(raw);
      const hex = c.to('srgb').toString({ collapse: false, format: 'hex', inGamut: true });
      return { alpha: c.alpha, colorSpace: c.spaceId, components: c.coords, hex };
    } catch {
      return raw; // leave unparseable values as-is; schema validation will report
    }
  },
};

// ---------------------------------------------------------------------------
// Single token upgrade
// ---------------------------------------------------------------------------

const LINE_HEIGHT_TYPES = new Set(['lineHeight', 'lineHeights']);

function upgradeToken(raw: Record<string, unknown>): Token {
  const rawValue = Object.hasOwn(raw, '$value') ? raw['$value'] : raw['value'];
  const rawType = String(Object.hasOwn(raw, '$type') ? raw['$type'] : (raw['type'] ?? ''));

  const description = raw['$description'] ?? raw['$comment'] ?? raw['description'] ?? raw['comment'];

  let dtcgType: string;
  let dtcgValue: unknown;

  if (LINE_HEIGHT_TYPES.has(rawType)) {
    // Line-height type is value-dependent — can't use a static TYPE_MAP entry
    const upgraded = upgradeLineHeight(rawValue);
    dtcgType = upgraded.type;
    dtcgValue = upgraded.value;
  } else {
    dtcgType = TYPE_MAP[rawType] ?? rawType;
    const transformer = VALUE_TRANSFORMERS[dtcgType];
    dtcgValue = transformer ? transformer(rawValue) : rawValue;
  }

  const token: Token = { $type: dtcgType, $value: dtcgValue };

  if (description !== undefined && description !== null && description !== '') {
    token.$description = String(description);
  }

  const existingExtensions = raw['$extensions'] as Record<string, unknown> | undefined;
  const valueWasTransformed = rawValue !== dtcgValue;
  if (existingExtensions !== undefined || valueWasTransformed) {
    token.$extensions = { ...existingExtensions };
    if (valueWasTransformed) {
      token.$extensions['nl.nldesignsystem.authored-as'] = rawValue;
    }
  }

  // Preserve remaining DTCG keys not already handled above
  for (const [key, val] of Object.entries(raw)) {
    if (!DTCG_TOKEN_KEYS.has(key) || Object.hasOwn(token, key)) continue;
    (token as unknown as Record<string, unknown>)[key] = val;
  }

  return token;
}

// ---------------------------------------------------------------------------
// Recursive node upgrade
// ---------------------------------------------------------------------------

function isAnyToken(node: Record<string, unknown>): boolean {
  return Object.hasOwn(node, 'value') || Object.hasOwn(node, '$value');
}

function upgradeNode(node: Record<string, unknown>): Token | Group {
  if (isAnyToken(node)) return upgradeToken(node);

  const group: Group = {};

  const nodeDescription = node['$comment'] ?? node['$description'];
  if (typeof nodeDescription === 'string' && nodeDescription !== '') {
    group.$description = nodeDescription;
  }
  if (node['$extensions'] !== undefined) {
    group.$extensions = node['$extensions'] as Record<string, unknown>;
  }

  for (const [key, child] of Object.entries(node)) {
    if (key === '$description' || key === '$comment' || key === '$extensions') continue;
    if (STRIP_KEYS.has(key)) continue;
    if (child === null || typeof child !== 'object' || Array.isArray(child)) {
      (group as Record<string, unknown>)[key] = child;
      continue;
    }
    group[key] = upgradeNode(child as Record<string, unknown>) as Token | Group;
  }

  return group;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface UpgradeOptions {
  /** Extra type mappings to override or extend the built-in ones */
  typeMappings?: Record<string, string>;
}

/**
 * Convert legacy design tokens to modern, spec-compliant DTCG tokens.
 *
 * Type upgrades:
 * - `value` → `$value`
 * - `type` → `$type` (with alias remapping, e.g. `spacing` → `dimension`)
 * - `comment` / `description` → `$description`
 *
 * Value upgrades:
 * - `dimension`: `"1.5rem"` → `{ value: 1.5, unit: "rem" }` via `parse_dimension()`
 * - `fontFamily`: `"Inter, sans-serif"` → `["Inter", "sans-serif"]`
 * - `fontWeight`: `"bold"` → `700`
 * - `lineHeight`/`lineHeights`: smart conversion — bare numbers stay as `number`, CSS units become `dimension`, percentages become unitless ratios
 * - `color`: CSS color strings (hex, rgba, …) → `{ colorSpace, components, alpha }` objects
 *
 * Also strips Style Dictionary metadata (`filePath`, `isSource`, `name`, …)
 * and preserves `$extensions`.
 */
export function upgradeTokens(tokens: TokenFile, options: UpgradeOptions = {}): TokenFile {
  if (options.typeMappings) {
    Object.assign(TYPE_MAP, options.typeMappings);
  }

  const cloned = deepClone(tokens);
  const result: TokenFile = {};

  for (const [key, value] of Object.entries(cloned)) {
    if (STRIP_KEYS.has(key)) continue;
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = value;
      continue;
    }
    result[key] = upgradeNode(value as Record<string, unknown>) as Token | Group;
  }

  return result;
}
