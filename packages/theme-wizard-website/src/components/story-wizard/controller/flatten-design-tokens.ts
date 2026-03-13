import type { DesignTokenLeaf } from './types';

export function flattenDesignTokens(tokens: unknown, path: string[] = []): DesignTokenLeaf[] {
  if (!tokens || typeof tokens !== 'object') return [];

  if ('$value' in (tokens as Record<string, unknown>)) {
    return [
      {
        path: path.join('.'),
        value: JSON.stringify((tokens as { $value: unknown }).$value),
      },
    ];
  }

  return Object.entries(tokens as Record<string, unknown>).flatMap(([key, value]) =>
    flattenDesignTokens(value, [...path, key]),
  );
}
