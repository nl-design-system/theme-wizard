/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react-vite';

const isRegex = (val: unknown): val is RegExp => val instanceof RegExp;

type PatternLike = string | RegExp;

const matches = (name: string, pattern?: PatternLike): boolean => {
  return isRegex(pattern) ? pattern.test(name) : name === pattern;
};

const isIncluded = (name: string, patterns: unknown): boolean => {
  if (!patterns) return true;
  if (Array.isArray(patterns)) {
    return patterns.some((pattern: PatternLike) => matches(name, pattern));
  }
  return matches(name, patterns as PatternLike);
};

const isExcluded = (name: string, patterns: unknown): boolean => {
  if (!patterns) return false;
  if (Array.isArray(patterns)) {
    return patterns.some((pattern: PatternLike) => matches(name, pattern));
  }
  return matches(name, patterns as PatternLike);
};

/**
 * Extract Story objects from a CSF module, respecting includeStories/excludeStories config.
 * See: https://storybook.js.org/docs/api/csf#non-story-exports
 */
export const getStories = (stories: Record<string, unknown>, meta: Meta<any>): [string, StoryObj<any>][] => {
  const storyConfig = meta as any;
  const includeStories = storyConfig.includeStories;
  const excludeStories = storyConfig.excludeStories;

  return Object.entries(stories).filter(([storyName]) => {
    if (storyName === 'default') return false;
    if (!isIncluded(storyName, includeStories)) return false;
    if (isExcluded(storyName, excludeStories)) return false;
    return true;
  });
  // .map(([id, story]) => story as StoryObj<any>);
};
