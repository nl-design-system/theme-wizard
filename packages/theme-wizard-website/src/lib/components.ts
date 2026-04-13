export type ComponentCategory = 'navigatie' | 'acties' | 'status' | 'visueel';

export const components = {
  button: { category: 'acties' as ComponentCategory, stories: () => import('./stories/Button/button-react.stories'), title: 'Button' },
  code: { category: 'visueel' as ComponentCategory, stories: () => import('./stories/Code/code-react.stories'), title: 'Code' },
  'code-block': { category: 'visueel' as ComponentCategory, stories: () => import('./stories/CodeBlock/code-block-react.stories'), title: 'Code Block' },
  'color-sample': { category: 'visueel' as ComponentCategory, stories: () => import('./stories/color-sample-react.stories'), title: 'Color Sample' },
  'data-badge': { category: 'status' as ComponentCategory, stories: () => import('./stories/DataBadge/data-badge-react.stories'), title: 'Data Badge' },
  heading: { category: 'visueel' as ComponentCategory, stories: () => import('./stories/Heading/heading-react.stories'), title: 'Heading' },
  link: { category: 'navigatie' as ComponentCategory, stories: () => import('./stories/Link/link-react.stories'), title: 'Link' },
  mark: { category: 'visueel' as ComponentCategory, stories: () => import('./stories/Mark/mark-react.stories'), title: 'Mark' },
  'number-badge': { category: 'status' as ComponentCategory, stories: () => import('./stories/NumberBadge/number-badge-react.stories'), title: 'Number Badge' },
  paragraph: { category: 'visueel' as ComponentCategory, stories: () => import('./stories/Paragraph/paragraph-react.stories'), title: 'Paragraph' },
  'skip-link': { category: 'navigatie' as ComponentCategory, stories: () => import('./stories/SkipLink/skip-link-react.stories'), title: 'Skip Link' },
};
