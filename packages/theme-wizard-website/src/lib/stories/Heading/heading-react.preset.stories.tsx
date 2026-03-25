import type { HeadingLevel, HeadingProps } from '@nl-design-system-candidate/heading-react';
import type { StoryObj } from '@storybook/react-vite';

type Story = StoryObj<HeadingProps>;

type PresetOption = {
  derivedTokenReference?: {
    offset: number;
    scalePath: string;
    sourcePath: string;
    targetIndex?: number;
    targetKey?: string;
    targetPath: string;
  };
  description: string;
  name: string;
  tokens: unknown;
};

const headingSampleText = 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.';

const headingFontSizes = [
  { label: 'Enorm', step: '3xl' },
  { label: 'Heel groot', step: '2xl' },
  { label: 'Extra groot', step: 'xl' },
  { label: 'Groot', step: 'lg' },
  { label: 'Normaal', step: 'md' },
  { label: 'Klein', step: 'sm' },
] as const;

const createHeadingToken = (level: HeadingLevel, property: string, value: string) => ({
  nl: {
    heading: {
      [`level-${level}`]: {
        [property]: { $value: value },
      },
    },
  },
});

const createHeadingPresetStory = ({
  name,
  args,
  description,
  options,
  order,
  previewStoryId,
  question,
}: {
  args: HeadingProps;
  description: string;
  name: string;
  options: PresetOption[];
  order: number;
  previewStoryId: string;
  question: string;
}): Story => ({
  name,
  args,
  parameters: {
    presets: [
      {
        name: question,
        description,
        options,
      },
    ],
    wizard: {
      order,
      previewStoryIds: [previewStoryId],
    },
  },
});

const createFontSizeOptions = (level: HeadingLevel): PresetOption[] => {
  const targetPath = `nl.heading.level-${level}.font-size`;

  return headingFontSizes.map(({ label, step }) => ({
    name: label,
    derivedTokenReference: {
      offset: 0,
      scalePath: 'basis.text.font-size',
      sourcePath: targetPath,
      targetKey: step,
      targetPath,
    },
    description: `Gebruik de maat ${label.toLowerCase()} voor deze heading.`,
    tokens: {},
  }));
};

const createFontSizeStory = (level: HeadingLevel): Story =>
  createHeadingPresetStory({
    name: `Heading ${level} font-size`,
    args: {
      children: headingSampleText,
      level,
    },
    description: `Bepaal hoe groot de H${level} is ten opzichte van de rest van de pagina.`,
    options: createFontSizeOptions(level),
    order: level,
    previewStoryId: `Heading${level}Preview`,
    question: `Kies de grootte van de H${level}`,
  });

export const Heading1FontSize: Story = createFontSizeStory(1);
export const Heading2FontSize: Story = createFontSizeStory(2);
export const Heading3FontSize: Story = createFontSizeStory(3);
export const Heading4FontSize: Story = createFontSizeStory(4);
export const Heading5FontSize: Story = createFontSizeStory(5);
export const Heading6FontSize: Story = createFontSizeStory(6);

export const HeadingColor: Story = createHeadingPresetStory({
  name: 'Heading kleur',
  args: {
    children: headingSampleText,
    level: 1,
  },
  description: 'Geef headings een accentkleur of laat ze het standaard documentkleur volgen.',
  options: [
    {
      name: 'Standaard',
      description: 'Gebruik het documentkleur uit het startthema.',
      tokens: createHeadingToken(1, 'color', '{basis.color.default.color-document}'),
    },
    {
      name: 'Accentkleur 1',
      description: 'Geef headings accentkleur 1.',
      tokens: createHeadingToken(1, 'color', '{basis.color.accent-1.color-document}'),
    },
    {
      name: 'Accentkleur 2',
      description: 'Geef headings accentkleur 2.',
      tokens: createHeadingToken(1, 'color', '{basis.color.accent-2.color-document}'),
    },
    {
      name: 'Accentkleur 3',
      description: 'Geef headings accentkleur 3.',
      tokens: createHeadingToken(1, 'color', '{basis.color.accent-3.color-document}'),
    },
  ],
  order: 7,
  previewStoryId: 'AllHeadingsPreview',
  question: 'Kies de kleur van headings',
});
