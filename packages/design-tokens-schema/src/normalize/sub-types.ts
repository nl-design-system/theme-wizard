import { klona as deepClone } from 'klona';
import type { TokenFile } from './types.ts';
import { walkTokens } from './types.ts';

export const EXTENSION_TOKEN_SUBTYPE = 'nl.nldesignsystem.token-subtype';

export type SubType =
  | 'font-size'
  | 'line-height'
  | 'space-block'
  | 'space-inline'
  | 'border-radius'
  | 'border-width'
  | 'size'
  | 'background-color'
  | 'border-color'
  | 'color'
  | 'font-weight';

function dimensionSubType(last: string, tail: string): SubType | null {
  if (last.includes('font-size')) return 'font-size';
  if (last.includes('line-height')) return 'line-height';
  if (last.includes('margin-block') || last.includes('padding-block') || last.includes('row-gap') || tail.includes('space.block'))
    return 'space-block';
  if (last.includes('margin-inline') || last.includes('padding-inline') || last.includes('column-gap') || tail.includes('space.inline'))
    return 'space-inline';
  if (last.includes('border-radius') || tail.includes('border-radius')) return 'border-radius';
  if (last.includes('border-') && last.includes('-width')) return 'border-width';
  if (last.includes('size')) return 'size';
  return null;
}

function colorSubType(last: string): SubType | null {
  if (last.startsWith('bg-') || last === 'background-color') return 'background-color';
  if (last.startsWith('border-')) return 'border-color';
  if (last.startsWith('color-') || last === 'color') return 'color';
  return null;
}

function numberSubType(last: string): SubType | null {
  if (last.includes('line-height')) return 'line-height';
  if (last.includes('font-weight')) return 'font-weight';
  return null;
}

const SUB_TYPE_FNS: Record<string, (last: string, tail: string) => SubType | null> = {
  color: (last) => colorSubType(last),
  dimension: dimensionSubType,
  number: (last) => numberSubType(last),
};

/**
 * Derive a semantic subtype from the last segment(s) of a token path and its DTCG type.
 * Returns null when no subtype can be determined.
 */
export function getTokenSubType(path: string[], type: string): SubType | null {
  const last = path.at(-1) ?? '';
  const tail = path.slice(-3).join('.');
  return SUB_TYPE_FNS[type]?.(last, tail) ?? null;
}

/**
 * Walk all tokens and annotate each with a token-subtype extension where applicable.
 */
export function assignSubTypes(tokens: TokenFile): TokenFile {
  const cloned = deepClone(tokens);
  walkTokens(cloned, (path, token) => {
    const subType = getTokenSubType(path, token.$type);
    if (subType !== null) {
      token.$extensions ??= {};
      token.$extensions[EXTENSION_TOKEN_SUBTYPE] = subType;
    }
  });
  return cloned;
}
