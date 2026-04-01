import type { ParagraphProps } from '@nl-design-system-candidate/paragraph-react';
import type { StoryObj } from '@storybook/react-vite';
import { createPresetTokens, storySampleText } from '../story-helpers';

type Story = StoryObj<ParagraphProps>;

type PresetOption = {
  derivedTokenReference?: {
    offset: number;
    scalePath: string;
    sourcePath: string;
    targetPath: string;
  };
  description: string;
  name: string;
  tokens: unknown | null;
};

const paragraphSampleText = storySampleText;

const createParagraphToken = (property: string, value: string) =>
  createPresetTokens('nl.paragraph', { [property]: value });

const createParagraphPresetStory = ({
  name,
  args,
  description,
  options,
  order,
  previewStoryId,
  question,
}: {
  args: ParagraphProps;
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
      type: 'preset',
    },
  },
});

const createAccentColorOption = (name: string, accentNumber: 1 | 2 | 3): PresetOption => ({
  name,
  description: 'Overschrijf de lead paragraph met een accentkleur.',
  tokens: createParagraphToken('color', `{basis.color.accent-${accentNumber}.color-document}`),
});

export const ParagraphFontSize: Story = createParagraphPresetStory({
  name: 'Paragraph font-size',
  args: {
    children: paragraphSampleText,
  },
  description: 'Bepaal of de gewone paragraph compacter of juist ruimtelijker leest.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Ruim',
      description: 'Maak de paragraph iets groter dan de standaard.',
      tokens: createParagraphToken('font-size', '{basis.text.font-size.lg}'),
    },
    {
      name: 'Extra ruim',
      description: 'Gebruik een extra grote paragraph uit het startthema.',
      tokens: createParagraphToken('font-size', '{basis.text.font-size.xl}'),
    },
  ],
  order: 1,
  previewStoryId: 'ParagraphStory',
  question: 'Kies de grootte van de paragraph',
});

export const LeadParagraphFontSize: Story = createParagraphPresetStory({
  name: 'Lead font-size',
  args: {
    children: paragraphSampleText,
    purpose: 'lead',
  },
  description: 'Bepaal of de lead paragraph de startthema-grootte houdt of extra nadruk krijgt.',
  options: [
    {
      name: 'Aanbevolen',
      derivedTokenReference: {
        offset: 0,
        scalePath: 'basis.text.font-size',
        sourcePath: 'nl.paragraph.font-size',
        targetPath: 'nl.paragraph.lead.font-size',
      },
      description: 'Gebruik de standaard uit het startthema.',
      tokens: {},
    },
    {
      name: 'Ruim',
      derivedTokenReference: {
        offset: 1,
        scalePath: 'basis.text.font-size',
        sourcePath: 'nl.paragraph.font-size',
        targetPath: 'nl.paragraph.lead.font-size',
      },
      description: 'Maak de lead paragraph groter voor meer nadruk.',
      tokens: {},
    },
    {
      name: 'Extra ruim',
      derivedTokenReference: {
        offset: 2,
        scalePath: 'basis.text.font-size',
        sourcePath: 'nl.paragraph.font-size',
        targetPath: 'nl.paragraph.lead.font-size',
      },
      description: 'Maak de lead paragraph extra groot voor extra nadruk.',
      tokens: {},
    },
  ],
  order: 2,
  previewStoryId: 'LeadParagraphStory',
  question: 'Kies de grootte van de lead paragraph',
});

export const LeadParagraphColor: Story = createParagraphPresetStory({
  name: 'Lead color',
  args: {
    children: paragraphSampleText,
    purpose: 'lead',
  },
  description: 'Laat de lead paragraph het startthema volgen of geef hem een accentkleur.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    createAccentColorOption('Accentkleur 1', 1),
    createAccentColorOption('Accentkleur 2', 2),
    createAccentColorOption('Accentkleur 3', 3),
  ],
  order: 3,
  previewStoryId: 'LeadParagraphStory',
  question: 'Kies de kleur van de lead paragraph',
});
