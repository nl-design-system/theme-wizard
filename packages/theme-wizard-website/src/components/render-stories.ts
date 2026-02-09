// @ts-expect-error We need to change how theme-wizard-app is bundled so we can get this type
import type { WizardStoryRenderer } from '@nl-design-system-community/theme-wizard-app';
import { components } from '@/lib/components';

export async function initStories(componentId: keyof typeof components, storyIds: string[]) {
  const componentModulePromiseFn = components[componentId];
  const componentModule = await componentModulePromiseFn();
  const meta = componentModule.default;

  storyIds.forEach((name) => {
    const container = document.querySelector(`[data-story-container="${name}"]`);
    if (!container) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Story = (componentModule as any)[name];
    const storyRenderer = document.createElement('wizard-story-react') as WizardStoryRenderer;
    container.appendChild(storyRenderer);

    // Render the actual component
    storyRenderer.renderStory(Story, meta, Story.args || {});
  });
}
