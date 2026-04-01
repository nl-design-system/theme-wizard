export const components = {
  button: { stories: () => import('./stories/Button/button-react.stories'), title: 'Button' },
  code: { stories: () => import('./stories/code-react.stories'), title: 'Code' },
  'code-block': { stories: () => import('./stories/CodeBlock/code-block-react.stories'), title: 'Code Block' },
  'color-sample': { stories: () => import('./stories/color-sample-react.stories'), title: 'Color Sample' },
  'data-badge': { stories: () => import('./stories/DataBadge/data-badge-react.stories'), title: 'Data Badge' },
  heading: { stories: () => import('./stories/Heading/heading-react.stories'), title: 'Heading' },
  link: { stories: () => import('./stories/link-react.stories'), title: 'Link' },
  mark: { stories: () => import('./stories/mark-react.stories'), title: 'Mark' },
  'number-badge': { stories: () => import('./stories/number-badge-react.stories'), title: 'Number Badge' },
  paragraph: { stories: () => import('./stories/Paragraph/paragraph-react.stories'), title: 'Paragraph' },
  'skip-link': { stories: () => import('./stories/skip-link-react.stories'), title: 'Skip Link' },
};
