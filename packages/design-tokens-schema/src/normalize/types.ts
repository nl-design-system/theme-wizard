// ---------------------------------------------------------------------------
// DTCG token types
// @see https://tr.designtokens.org/format/
// ---------------------------------------------------------------------------

export type DTCGType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'fontStyle'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'percentage'
  | 'string'
  | 'boolean'
  | 'shadow'
  | 'gradient'
  | 'typography'
  | 'border'
  | 'transition'
  | 'strokeStyle'
  | (string & {}); // allow unknown types without losing inference on known ones

export interface DimensionValue {
  value: number;
  unit: string;
}

/** A DTCG-compliant token leaf node */
export interface Token {
  $type: DTCGType;
  $value: unknown;
  $description?: string;
  $extensions?: Record<string, unknown>;
  $deprecated?: string | boolean;
}

/** A group node — anything that isn't a token leaf */
export type Group = {
  $type?: DTCGType;
  $description?: string;
  $extensions?: Record<string, unknown>;
  [key: string]: Token | Group | string | undefined | Record<string, unknown>;
};

/** The top-level structure of a token file */
export type TokenFile = Record<string, Token | Group>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function isToken(node: unknown): node is Token {
  return node !== null && typeof node === 'object' && !Array.isArray(node) && '$value' in node;
}

export function isGroup(node: unknown): node is Group {
  return node !== null && typeof node === 'object' && !Array.isArray(node) && !('$value' in node);
}

export function walkTokens(
  node: TokenFile | Group,
  fn: (path: string[], token: Token) => void,
  _path: string[] = [],
): void {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (child === null || typeof child !== 'object' || Array.isArray(child)) continue;
    const childPath = [..._path, key];
    if (isToken(child)) {
      fn(childPath, child);
    } else {
      walkTokens(child as Group, fn, childPath);
    }
  }
}
