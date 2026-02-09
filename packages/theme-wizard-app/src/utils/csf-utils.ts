import type { Meta } from '@storybook/react-vite';

const isRegex = (val: unknown): val is RegExp => val instanceof RegExp;

type PatternLike = string | RegExp;

type StoryMetaConfig = {
  includeStories?: PatternLike | PatternLike[];
  excludeStories?: PatternLike | PatternLike[];
  [key: string]: unknown;
};

const matches = (name: string, pattern?: PatternLike): boolean => {
  return isRegex(pattern) ? pattern.test(name) : name === pattern;
};

const isIncluded = (name: string, patterns: unknown): boolean => {
  if (!patterns) return true;
  if (Array.isArray(patterns)) {
    return patterns.some((pattern) => matches(name, pattern));
  }
  return matches(name, patterns as PatternLike);
};

const isExcluded = (name: string, patterns: unknown): boolean => {
  if (!patterns) return false;
  if (Array.isArray(patterns)) {
    return patterns.some((pattern) => matches(name, pattern));
  }
  return matches(name, patterns as PatternLike);
};

/**
 * Extract Story objects from a CSF module, respecting includeStories/excludeStories config.
 * See: https://storybook.js.org/docs/api/csf#non-story-exports
 */
export const getStories = <T,>(
  stories: Record<PropertyKey, T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: StoryMetaConfig | Meta<any>,
): Array<[string, T]> => {
  const includeStories = meta.includeStories;
  const excludeStories = meta.excludeStories;

  return Object.entries(stories).filter(([storyName]) => {
    if (storyName === 'default') return false;
    if (!isIncluded(storyName, includeStories)) return false;
    if (isExcluded(storyName, excludeStories)) return false;
    return true;
  });
};
