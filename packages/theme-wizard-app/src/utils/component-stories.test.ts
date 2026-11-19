import { describe, expect, it, vi } from 'vitest';
import { loadComponentStories, type ComponentStoriesRegistry } from './component-stories';

const createRegistry = () => {
  const stories = vi.fn(async () => ({
    default: { title: 'Link' },
    LinkStory: { name: 'Link story' },
  }));
  const registry: ComponentStoriesRegistry = { 'candidate/link': { stories } };
  return { registry, stories };
};

describe('loadComponentStories', () => {
  it('returns each component with its meta and stories', async () => {
    const { registry } = createRegistry();
    const [component] = await loadComponentStories(registry);
    expect(component.componentId).toBe('candidate/link');
    expect(component.meta).toEqual({ title: 'Link' });
    expect(component.stories).toEqual([['LinkStory', { name: 'Link story' }]]);
  });

  it('loads story modules once per registry', async () => {
    const { registry, stories } = createRegistry();
    await loadComponentStories(registry);
    await loadComponentStories(registry);
    expect(stories).toHaveBeenCalledTimes(1);
  });

  it('loads again for a different registry', async () => {
    const first = createRegistry();
    const second = createRegistry();
    await loadComponentStories(first.registry);
    await loadComponentStories(second.registry);
    expect(second.stories).toHaveBeenCalledTimes(1);
  });
});
