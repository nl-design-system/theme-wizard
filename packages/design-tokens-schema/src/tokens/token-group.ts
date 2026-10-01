import type { BaseDesignToken, Extensions } from './base-token';
import { isTokenLike, isValueObject } from './token-reference';

export type TokenGroup = {
  [key: string]: BaseDesignToken | string | Extensions | undefined;
  $type?: string;
  $extensions?: Extensions;
};

export const isTokenGroup = (obj: unknown): obj is TokenGroup => {
  if (!isValueObject(obj)) return false;
  if (Object.hasOwn(obj, '$value')) return false;
  if (Object.hasOwn(obj, '$type') && typeof obj['$type'] !== 'string') return false;
  if (Object.hasOwn(obj, '$extensions') && !isValueObject(obj['$extensions'])) return false;
  return Object.entries(obj)
    .filter(([key]) => !key.startsWith('$'))
    .every(([, token]) => isTokenLike(token));
};
