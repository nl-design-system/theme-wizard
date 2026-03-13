import type { components } from '@/lib/components';

type ComponentId = keyof typeof components;
type StyleLoader = () => Promise<unknown>;

const sharedStyleLoaders: StyleLoader[] = [
  () => import('@nl-design-system-candidate/button-css/button.css'),
  () => import('@nl-design-system-candidate/heading-css/heading.css'),
  () => import('@nl-design-system-candidate/paragraph-css/paragraph.css'),
];
const componentStyleLoaders: Partial<Record<ComponentId, StyleLoader[]>> = {};

export async function loadStoryWizardComponentStyles(componentId: ComponentId) {
  const loaders = [...sharedStyleLoaders, ...(componentStyleLoaders[componentId] ?? [])];
  await Promise.all(loaders.map((loadStyles) => loadStyles()));
}
