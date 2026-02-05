import type { WizardStoryRenderer } from '@nl-design-system-community/theme-wizard-app';
import { components } from '@/lib/components';

export async function initStories(_containerSelector: string, componentId: string, storyIds: string[]) {
  const componentModulePromiseFn = components[componentId];
  const componentModule = await componentModulePromiseFn();
  const meta = componentModule.default;

  storyIds.forEach((name) => {
    const container = document.querySelector(`[data-story-container="${name}"]`);
    if (!container) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Story = (componentModule as any)[name];
    const storyRenderer = document.createElement('story-renderer') as WizardStoryRenderer;
    container.appendChild(storyRenderer);

    // Render the story with the component from meta
    storyRenderer.renderStory(Story, meta.component, Story.args || {});
  });
}
