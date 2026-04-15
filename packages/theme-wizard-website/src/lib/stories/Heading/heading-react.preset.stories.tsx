import type { HeadingLevel, HeadingProps } from '@nl-design-system-candidate/heading-react';
import type { StoryObj } from '@storybook/react-vite';
import type { PresetOption } from '../story-helpers';
import { headingFontSizes, headingSampleText } from './heading-react.story-helpers';

type Story = StoryObj<HeadingProps>;

const createHeadingPresetStory = ({
  name,
  args,
  cardPreviewStoryId,
  description,
  order,
  presets,
  previewStoryId,
}: {
  args: HeadingProps;
  cardPreviewStoryId?: string;
  description: string;
  name: string;
  order: number;
  presets: {
    description: string;
    options: PresetOption<Record<string, unknown> | null>[];
    question: string;
  }[];
  previewStoryId: string;
}): Story => ({
  name,
  args,
  parameters: {
    presets: presets.map((preset) => ({
      name: preset.question,
      description: preset.description,
      options: preset.options,
    })),
    wizard: {
      ...(cardPreviewStoryId ? { cardPreviewStoryIds: [cardPreviewStoryId] } : {}),
      description,
      order,
      previewStoryIds: [previewStoryId],
      type: 'preset',
    },
  },
});

// --- Font size scale ---

type FontSizeStep = (typeof headingFontSizes)[number]['step'];
type HeadingScale = [HeadingLevel, FontSizeStep][];

const makeSizeDerivedRef = (level: HeadingLevel, targetKey: FontSizeStep) => {
  const targetPath = `nl.heading.level-${level}.font-size`;
  return {
    offset: 0,
    scalePath: 'basis.text.font-size',
    sourcePath: targetPath,
    targetKey,
    targetPath,
  };
};

const makeScale = (pairs: HeadingScale) => pairs.map(([level, step]) => makeSizeDerivedRef(level, step));

const headingSizeOptions: PresetOption<Record<string, unknown> | null>[] = [
  {
    name: 'Uitgespreid',
    derivedTokenReferences: makeScale([
      [1, '4xl'],
      [2, '3xl'],
      [3, '2xl'],
      [4, 'xl'],
      [5, 'lg'],
      [6, 'md'],
    ]),
    description: 'H1 is heel groot en elke heading wordt een stap kleiner. Grote visuele hiërarchie.',
    tokens: {},
  },
  {
    name: 'Gebalanceerd',
    derivedTokenReferences: makeScale([
      [1, '3xl'],
      [2, '2xl'],
      [3, 'xl'],
      [4, 'lg'],
      [5, 'md'],
      [6, 'sm'],
    ]),
    description: 'Rustige schaal waarbij headings duidelijk van elkaar onderscheiden zijn.',
    tokens: {},
  },
  {
    name: 'Compact',
    derivedTokenReferences: makeScale([
      [1, '2xl'],
      [2, 'xl'],
      [3, 'lg'],
      [4, 'md'],
      [5, 'sm'],
      [6, 'sm'],
    ]),
    description: "Subtiele verschillen tussen headings. Geschikt voor zakelijke of informatiedichte pagina's.",
    tokens: {},
  },
];

export const HeadingSizes: Story = createHeadingPresetStory({
  name: 'Heading sizes',
  args: {
    children: headingSampleText,
    level: 1,
  },
  cardPreviewStoryId: 'AllHeadingsPreview',
  description: 'Kies een schaal voor H1 t/m H6. Elke heading wordt één stap kleiner dan de vorige.',
  order: 1,
  presets: [
    {
      description: 'Kies hoe groot H1 wordt — de overige headings volgen automatisch stapsgewijs.',
      options: headingSizeOptions,
      question: 'Kies de schaal voor alle headings',
    },
  ],
  previewStoryId: 'AllHeadingsPreview',
});

// --- Color ---

const allHeadingsColor = (accent: 1 | 2 | 3) => ({
  nl: {
    heading: Object.fromEntries(
      ([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map((level) => [
        `level-${level}`,
        { color: { $value: `{basis.color.accent-${accent}.color-document}` } },
      ]),
    ),
  },
});

const headingColorOptions: PresetOption<Record<string, unknown> | null>[] = [
  { name: 'Documentkleur', description: 'Alle headings volgen het documentkleur uit het startthema.', tokens: null },
  { name: 'Accentkleur 1', description: 'Alle headings krijgen accentkleur 1.', tokens: allHeadingsColor(1) },
  { name: 'Accentkleur 2', description: 'Alle headings krijgen accentkleur 2.', tokens: allHeadingsColor(2) },
  { name: 'Accentkleur 3', description: 'Alle headings krijgen accentkleur 3.', tokens: allHeadingsColor(3) },
];

export const HeadingColors: Story = createHeadingPresetStory({
  name: 'Heading colors',
  args: {
    children: headingSampleText,
    level: 1,
  },
  cardPreviewStoryId: 'AllHeadingsPreview',
  description: 'Geef alle headings dezelfde kleur of laat ze het documentkleur volgen.',
  order: 2,
  presets: [
    {
      description: 'Alle headings krijgen dezelfde kleur. Kies een variant of houd het documentkleur aan.',
      options: headingColorOptions,
      question: 'Kies de kleur voor alle headings',
    },
  ],
  previewStoryId: 'AllHeadingsPreview',
});
