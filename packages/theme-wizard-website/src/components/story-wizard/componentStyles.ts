import type { components } from '@/lib/components';

import '@nl-design-system-candidate/button-css/button.css';
import '@nl-design-system-candidate/heading-css/heading.css';
import '@nl-design-system-candidate/paragraph-css/paragraph.css';

type ComponentId = keyof typeof components;
type StyleLoader = () => Promise<unknown>;

const componentStyleLoaders: Partial<Record<ComponentId, StyleLoader[]>> = {
  'data-badge': [() => import('@nl-design-system-candidate/data-badge-css/data-badge.css')],
};

export async function loadStoryWizardComponentStyles(componentId: ComponentId) {
  const loaders = componentStyleLoaders[componentId] ?? [];
  await Promise.all(loaders.map((loadStyles) => loadStyles()));
}
