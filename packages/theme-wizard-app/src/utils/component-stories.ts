import type { Meta, StoryObj } from '@storybook/react-vite';
import { getStories } from './csf-utils';

// Caller-supplied registry of which components exist and how to load their stories module —
// callers own the actual story files, the app only knows how to load and match against them.
export type ComponentStoriesRegistry = Record<
  string,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stories: () => Promise<{ default: Meta<any>; [key: string]: any }>;
  }
>;

export type LoadedComponent = {
  componentId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: Meta<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stories: [id: string, story: StoryObj<any>][];
};

const loadedRegistries = new WeakMap<ComponentStoriesRegistry, Promise<LoadedComponent[]>>();

// Loads every story module in the registry once; later calls with the same registry reuse the result
export const loadComponentStories = (components: ComponentStoriesRegistry): Promise<LoadedComponent[]> => {
  let loaded = loadedRegistries.get(components);
  if (!loaded) {
    loaded = Promise.all(
      Object.entries(components).map(async ([componentId, { stories }]) => {
        const { default: meta, ...storyExports } = await stories();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { componentId, meta, stories: getStories(storyExports as Record<PropertyKey, StoryObj<any>>, meta) };
      }),
    );
    loadedRegistries.set(components, loaded);
  }
  return loaded;
};
