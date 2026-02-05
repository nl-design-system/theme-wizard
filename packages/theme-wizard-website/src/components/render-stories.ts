import '../components/story-renderer';
import type { StoryRenderer } from '../components/story-renderer';
import * as storiesModule from '../lib/mark-react.stories';

export function initStories(_containerSelector: string, storyNames: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = (storiesModule as any).default;

  storyNames.forEach((name) => {
    const container = document.querySelector(`[data-story-container="${name}"]`);
    if (!container) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Story = (storiesModule as any)[name];
    const storyRenderer = document.createElement('story-renderer') as StoryRenderer;
    container.appendChild(storyRenderer);

    // Render the story with the component from meta
    storyRenderer.renderStory(Story, meta.component, Story.args || {});
  });
}
