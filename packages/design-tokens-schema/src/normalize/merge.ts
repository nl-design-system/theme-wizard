import { klona as deepClone } from 'klona';
import type { TokenFile } from './types.ts';
import { isToken } from './types.ts';

/**
 * Deep-merge two or more TokenFile objects into one.
 *
 * - Groups are merged recursively
 * - When the same token path exists in multiple files, the last file wins
 *
 * @example
 * const tokens = mergeTokens(buttonTokens, linkTokens, headingTokens);
 */
export function mergeTokens(...files: TokenFile[]): TokenFile {
  const result: TokenFile = {};
  for (const file of files) {
    mergeInto(result, deepClone(file));
  }
  return result;
}

function mergeInto(target: Record<string, unknown>, source: Record<string, unknown>): void {
  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = target[key];

    // Both are groups → recurse
    if (
      !isToken(sourceValue) &&
      !isToken(targetValue) &&
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      mergeInto(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>);
      continue;
    }

    // Token or anything else — last wins
    target[key] = sourceValue;
  }
}
