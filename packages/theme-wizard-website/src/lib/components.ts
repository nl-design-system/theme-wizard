export type ComponentCategory = 'navigatie' | 'acties' | 'status' | 'visueel';

export const components = {
  button: {
    category: 'acties' as ComponentCategory,
    description: 'Voor acties zoals verzenden, opslaan of openen.',
    stories: () => import('./stories/Button/button-react.stories'),
    title: 'Button',
  },
  code: {
    category: 'visueel' as ComponentCategory,
    description: 'Voor korte stukjes code in een lopende tekst.',
    stories: () => import('./stories/Code/code-react.stories'),
    title: 'Code',
  },
  'code-block': {
    category: 'visueel' as ComponentCategory,
    description: 'Voor langere codevoorbeelden in een apart blok.',
    stories: () => import('./stories/CodeBlock/code-block-react.stories'),
    title: 'Code Block',
  },
  'color-sample': {
    category: 'visueel' as ComponentCategory,
    description: 'Voor het tonen en vergelijken van kleuren.',
    stories: () => import('./stories/color-sample-react.stories'),
    title: 'Color Sample',
  },
  'data-badge': {
    category: 'status' as ComponentCategory,
    description: 'Voor labels met tekst, zoals een status of categorie.',
    stories: () => import('./stories/DataBadge/data-badge-react.stories'),
    title: 'Data Badge',
  },
  heading: {
    category: 'visueel' as ComponentCategory,
    description: 'Voor koppen die structuur geven aan een pagina.',
    stories: () => import('./stories/Heading/heading-react.stories'),
    title: 'Heading',
  },
  link: {
    category: 'navigatie' as ComponentCategory,
    description: 'Voor verwijzingen naar een andere pagina of website.',
    stories: () => import('./stories/Link/link-react.stories'),
    title: 'Link',
  },
  mark: {
    category: 'visueel' as ComponentCategory,
    description: 'Voor tekst die extra nadruk krijgt met een markering.',
    stories: () => import('./stories/Mark/mark-react.stories'),
    title: 'Mark',
  },
  'number-badge': {
    category: 'status' as ComponentCategory,
    description: 'Voor kleine tellers, zoals meldingen of aantallen.',
    stories: () => import('./stories/NumberBadge/number-badge-react.stories'),
    title: 'Number Badge',
  },
  paragraph: {
    category: 'visueel' as ComponentCategory,
    description: 'Voor gewone lopende tekst op een pagina.',
    stories: () => import('./stories/Paragraph/paragraph-react.stories'),
    title: 'Paragraph',
  },
  'skip-link': {
    category: 'navigatie' as ComponentCategory,
    description: 'Voor een snelle sprong naar de inhoud van de pagina.',
    stories: () => import('./stories/SkipLink/skip-link-react.stories'),
    title: 'Skip Link',
  },
};

export const componentCategories: { key: ComponentCategory; label: string; description: string }[] = [
  {
    description: 'Onderdelen waarmee bezoekers door de website bewegen.',
    key: 'navigatie',
    label: 'Navigatie',
  },
  {
    description: 'Knoppen en andere onderdelen waarmee bezoekers iets doen, zoals een formulier versturen.',
    key: 'acties',
    label: 'Acties',
  },
  {
    description: 'Kleine labels die een waarde of staat aangeven, zoals een telling of een categorie.',
    key: 'status',
    label: 'Status en labels',
  },
  {
    description: "Onderdelen voor tekst en opmaak, zoals koppen, alinea's en codeblokken.",
    key: 'visueel',
    label: 'Visueel en lezen',
  },
];
