// @ts-expect-error We need to change how theme-wizard-app is bundled so we can get this type
import type { WizardStoryReact } from '@nl-design-system-community/theme-wizard-app';
import { components } from '@/lib/components';

export function mountStory(
  container: Element,
  { story, componentMeta, args }: { story: unknown; componentMeta: unknown; args: unknown },
) {
  const storyRenderer = document.createElement('wizard-story-react') as WizardStoryReact;
  storyRenderer.story = story as WizardStoryReact['story'];
  storyRenderer.componentMeta = componentMeta as WizardStoryReact['componentMeta'];
  storyRenderer.args = args as WizardStoryReact['args'];
  container.appendChild(storyRenderer);
  return storyRenderer;
}

export async function initStories(componentId: keyof typeof components, storyIds: string[]) {
  const componentModulePromiseFn = components[componentId].stories;
  const componentModule = await componentModulePromiseFn();
  const meta = componentModule.default;

  storyIds.forEach((name) => {
    const containers = [...document.querySelectorAll(`[data-story-container="${name}"]`)];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Story = (componentModule as any)[name];

    containers.forEach((container) => {
      mountStory(container, { args: Story.args ?? {}, componentMeta: meta, story: Story });
    });
  });
}
