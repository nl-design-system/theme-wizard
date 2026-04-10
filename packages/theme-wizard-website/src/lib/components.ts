export type ComponentCategory = 'navigatie' | 'acties' | 'status' | 'visueel';

export const components = {
  button: { stories: () => import('./stories/Button/button-react.stories'), title: 'Button', category: 'acties' as ComponentCategory },
  code: { stories: () => import('./stories/Code/code-react.stories'), title: 'Code', category: 'visueel' as ComponentCategory },
  'code-block': { stories: () => import('./stories/CodeBlock/code-block-react.stories'), title: 'Code Block', category: 'visueel' as ComponentCategory },
  'color-sample': { stories: () => import('./stories/color-sample-react.stories'), title: 'Color Sample', category: 'visueel' as ComponentCategory },
  'data-badge': { stories: () => import('./stories/DataBadge/data-badge-react.stories'), title: 'Data Badge', category: 'status' as ComponentCategory },
  heading: { stories: () => import('./stories/Heading/heading-react.stories'), title: 'Heading', category: 'visueel' as ComponentCategory },
  link: { stories: () => import('./stories/Link/link-react.stories'), title: 'Link', category: 'navigatie' as ComponentCategory },
  mark: { stories: () => import('./stories/Mark/mark-react.stories'), title: 'Mark', category: 'visueel' as ComponentCategory },
  'number-badge': { stories: () => import('./stories/NumberBadge/number-badge-react.stories'), title: 'Number Badge', category: 'status' as ComponentCategory },
  paragraph: { stories: () => import('./stories/Paragraph/paragraph-react.stories'), title: 'Paragraph', category: 'visueel' as ComponentCategory },
  'skip-link': { stories: () => import('./stories/SkipLink/skip-link-react.stories'), title: 'Skip Link', category: 'navigatie' as ComponentCategory },
};
