import type { NavigationItems } from '@nl-design-system-community/clippy-components/clippy-navigation-bar';

const COMPONENTS_BASE_PATH = '/components';

const candidateComponents = {
  button: { stories: () => import('./stories/candidate/Button/button-react.stories'), title: 'Button' },
  code: { stories: () => import('./stories/candidate/code-react.stories'), title: 'Code' },
  'code-block': { stories: () => import('./stories/candidate/code-block-react.stories'), title: 'Code Block' },
  'color-sample': { stories: () => import('./stories/candidate/color-sample-react.stories'), title: 'Color Sample' },
  'data-badge': { stories: () => import('./stories/candidate/data-badge-react.stories'), title: 'Data Badge' },
  heading: { stories: () => import('./stories/candidate/heading-react.stories'), title: 'Heading' },
  link: { stories: () => import('./stories/candidate/link-react.stories'), title: 'Link' },
  mark: { stories: () => import('./stories/candidate/mark-react.stories'), title: 'Mark' },
  'number-badge': { stories: () => import('./stories/candidate/number-badge-react.stories'), title: 'Number Badge' },
  paragraph: { stories: () => import('./stories/candidate/paragraph-react.stories'), title: 'Paragraph' },
  'skip-link': { stories: () => import('./stories/candidate/skip-link-react.stories'), title: 'Skip Link' },
};

const communityComponents = {
  'ams-page-header': {
    stories: () => import('./stories/community/ams.page-header.stories'),
    title: 'Page Header (Amsterdam)',
  },
};

const COMPONENT_GROUPS = [
  { id: 'candidate', components: candidateComponents, label: 'Candidate' },
  { id: 'community', components: communityComponents, label: 'Community' },
] as const;

type ComponentGroupId = (typeof COMPONENT_GROUPS)[number]['id'];

type ComponentDefinition =
  | (typeof candidateComponents)[keyof typeof candidateComponents]
  | (typeof communityComponents)[keyof typeof communityComponents];

// Keyed by `<group>/<slug>`, which is also the URL path below /components
export const components: Record<string, ComponentDefinition & { group: ComponentGroupId; slug: string }> =
  Object.fromEntries(
    COMPONENT_GROUPS.flatMap(({ id, components: groupComponents }) =>
      Object.entries(groupComponents).map(([slug, component]) => [`${id}/${slug}`, { ...component, group: id, slug }]),
    ),
  );

export const componentGroups = COMPONENT_GROUPS.map(({ id, label }) => ({ id, label }));

export const componentsNavigationItems: NavigationItems = COMPONENT_GROUPS.map(
  ({ id, components: groupComponents, label }) => ({
    href: `${COMPONENTS_BASE_PATH}/${id}`,
    items: Object.entries(groupComponents).map(([slug, { title }]) => ({
      href: `${COMPONENTS_BASE_PATH}/${id}/${slug}`,
      label: title,
    })),
    label,
  }),
);
