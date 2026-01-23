/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Extract Story objects from a CSF module, respecting includeStories/excludeStories config.
 * See: https://storybook.js.org/docs/api/csf#non-story-exports
 */
export const getStories = (
  stories: Record<string, unknown>,
  meta: Meta<any>,
): StoryObj<any>[] => {
  const storyConfig = meta as any;
  const includeStories = storyConfig.includeStories;
  const excludeStories = storyConfig.excludeStories;

  const isRegex = (val: unknown): val is RegExp => val instanceof RegExp;
  const matches = (name: string, pattern: string | RegExp | undefined): boolean => {
    if (!pattern) return true;
    return isRegex(pattern) ? pattern.test(name) : name === pattern;
  };

  return Object.entries(stories)
    .filter(
      ([storyName]) =>
        storyName !== 'default' &&
        // Apply includeStories filter if defined
        (Array.isArray(includeStories)
          ? includeStories.some((pattern: string | RegExp) => matches(storyName, pattern))
          : !includeStories || matches(storyName, includeStories)) &&
        // Apply excludeStories filter if defined
        !(Array.isArray(excludeStories)
          ? excludeStories.some((pattern: string | RegExp) => matches(storyName, pattern))
          : excludeStories && matches(storyName, excludeStories)),
    )
    .map(([, story]) => story as StoryObj<any>);
};
