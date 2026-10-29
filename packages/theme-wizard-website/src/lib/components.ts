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

export const components = {
  ...candidateComponents,
};

export const isCandidateComponent = (slug: string) => Object.hasOwn(candidateComponents, slug);

export const componentsNavigationItems: NavigationItems = Object.entries(components).map(([slug, { title }]) => ({
  href: `${COMPONENTS_BASE_PATH}/${slug}`,
  label: title,
}));
