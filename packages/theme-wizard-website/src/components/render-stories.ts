// @ts-expect-error We need to change how theme-wizard-app is bundled so we can get this type
import type { WizardStoryReact } from '@nl-design-system-community/theme-wizard-app';
import { components } from '@/lib/components';

const componentModuleCache = new Map<keyof typeof components, Promise<Awaited<ReturnType<(typeof components)[keyof typeof components]['stories']>>>>();
const mountedStoryContainers = new WeakSet<Element>();

const getComponentModule = (componentId: keyof typeof components) => {
  const cachedModule = componentModuleCache.get(componentId);
  if (cachedModule) {
    return cachedModule;
  }

  const componentModulePromise = components[componentId].stories();
  componentModuleCache.set(componentId, componentModulePromise);
  return componentModulePromise;
};

export async function initStories(
  componentId: keyof typeof components,
  storyIds: string[],
  scope: ParentNode = document,
) {
  const componentModule = await getComponentModule(componentId);
  const meta = componentModule.default;

  storyIds.forEach((name) => {
    const containers = [...scope.querySelectorAll(`[data-story-container="${name}"]`)];

    containers.forEach((container) => {
      if (mountedStoryContainers.has(container)) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Story = (componentModule as any)[name];
      if (!Story) {
        return;
      }

      const storyRenderer = document.createElement('wizard-story-react') as WizardStoryReact;
      storyRenderer.story = Story;
      storyRenderer.componentMeta = meta;
      storyRenderer.args = Story.args ?? {};
      container.appendChild(storyRenderer);
      mountedStoryContainers.add(container);
    });
  });
}
