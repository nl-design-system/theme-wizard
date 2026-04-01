import type { HeadingLevel, HeadingProps } from '@nl-design-system-candidate/heading-react';
import type { StoryObj } from '@storybook/react-vite';
import type { PresetOption } from '../story-helpers';
import {
  createHeadingToken,
  headingFontSizes,
  headingLevels,
  headingSampleText,
  type AccentNumber,
  type PreviewHeadingLevel,
} from './heading-react.story-helpers';

type Story = StoryObj<HeadingProps>;

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
  options: PresetOption<Record<string, unknown> | null>[];
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
      type: 'preset',
    },
  },
});

const createFontSizeOptions = (level: HeadingLevel): PresetOption<Record<string, unknown> | null>[] => {
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

const createColorOptions = (level: HeadingLevel): PresetOption<Record<string, unknown> | null>[] => [
  {
    name: 'Standaard',
    description: 'Gebruik het documentkleur uit het startthema.',
    tokens: null,
  },
  ...([1, 2, 3] as const).map((accentNumber: AccentNumber) => ({
    name: `Accentkleur ${accentNumber}`,
    description: `Geef headings accentkleur ${accentNumber}.`,
    tokens: createHeadingToken(level, 'color', `{basis.color.accent-${accentNumber}.color-document}`),
  })),
];

const createColorStory = (level: HeadingLevel): Story =>
  createHeadingPresetStory({
    name: `Heading ${level} kleur`,
    args: {
      children: headingSampleText,
      level,
    },
    description: `Geef de H${level} een accentkleur of laat hem het standaard documentkleur volgen.`,
    options: createColorOptions(level),
    order: level + 6,
    previewStoryId: `Heading${level}Preview`,
    question: `Kies de kleur van de H${level}`,
  });

const headingFontSizeStories = Object.fromEntries(
  headingLevels.map((level) => [`Heading${level}FontSize`, createFontSizeStory(level)]),
) as Record<`Heading${PreviewHeadingLevel}FontSize`, Story>;

const headingColorStories = Object.fromEntries(
  headingLevels.map((level) => [`Heading${level}Color`, createColorStory(level)]),
) as Record<`Heading${PreviewHeadingLevel}Color`, Story>;

export const {
  Heading1FontSize,
  Heading2FontSize,
  Heading3FontSize,
  Heading4FontSize,
  Heading5FontSize,
  Heading6FontSize,
} = headingFontSizeStories;

export const {
  Heading1Color,
  Heading2Color,
  Heading3Color,
  Heading4Color,
  Heading5Color,
  Heading6Color,
} = headingColorStories;
