import type { Meta, StoryObj } from '@storybook/react-vite';
import { getStories } from './csf-utils';

// Caller-supplied registry of which components exist and how to load their stories module —
// callers own the actual story files, the app only knows how to load and match against them.
export type ComponentStoriesRegistry = Record<
  string,
  {
    stories: () => Promise<{ default: Meta; [key: string]: unknown }>;
  }
>;

export type LoadedComponent = {
  componentId: string;
  meta: Meta;
  stories: [id: string, story: StoryObj][];
};

const loadedRegistries = new WeakMap<ComponentStoriesRegistry, Promise<LoadedComponent[]>>();

// Loads every story module in the registry once; later calls with the same registry reuse the result
export const loadComponentStories = (components: ComponentStoriesRegistry): Promise<LoadedComponent[]> => {
  let loaded = loadedRegistries.get(components);
  if (!loaded) {
    loaded = Promise.all(
      Object.entries(components).map(async ([componentId, { stories }]) => {
        const { default: meta, ...storyExports } = await stories();
        return { componentId, meta, stories: getStories(storyExports as Record<PropertyKey, StoryObj>, meta) };
      }),
    );
    loadedRegistries.set(components, loaded);
  }
  return loaded;
};
