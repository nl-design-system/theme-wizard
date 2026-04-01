import type { SkipLinkProps } from '@nl-design-system-candidate/skip-link-react';
import type { StoryObj } from '@storybook/react-vite';
import { createPresetTokens } from '../story-helpers';

type Story = StoryObj<SkipLinkProps>;

type PresetOption = {
  derivedTokenReference?: {
    offset: number;
    scalePath: string;
    sourcePath: string;
    targetPath: string;
  };
  description: string;
  name: string;
  tokens: Record<string, unknown> | null;
};

const createSkipLinkTokens = (entries: Record<string, string>) => createPresetTokens('nl.skip-link', entries);

const createPresetStory = ({
  name,
  args,
  description,
  options,
  order,
  question,
}: {
  args: SkipLinkProps;
  description?: string;
  name: string;
  options: PresetOption[];
  order: number;
  question: string;
}): Story => ({
  name,
  args,
  parameters: {
    presets: [
      {
        ...(description ? { description } : {}),
        name: question,
        options,
      },
    ],
    wizard: {
      order,
      previewStoryIds: ['WizardPreview'],
      type: 'preset',
    },
  },
});

const defaultArgs = {
  children: 'Naar de inhoud',
  className: 'nl-skip-link--visible',
  href: '#inhoud',
  style: {
    position: 'static' as const,
  },
};

export const SkipLinkAfmeting: Story = createPresetStory({
  name: 'Afmeting',
  args: defaultArgs,
  description: 'De minimale hoogte en breedte bepalen hoe gemakkelijk de skip link te raken is.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Ruim',
      description: 'Maak de skip link groter en makkelijker te raken.',
      tokens: createSkipLinkTokens({
        'min-block-size': '{basis.size.lg}',
        'min-inline-size': '{basis.size.lg}',
      }),
    },
  ],
  order: 1,
  question: 'Kies de minimale afmeting van de Skip Link',
});

export const SkipLinkPadding: Story = createPresetStory({
  name: 'Padding',
  args: defaultArgs,
  description: 'De binnenruimte bepaalt hoeveel lucht rondom de tekst zit.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Compact',
      description: 'Minder witruimte binnen de skip link.',
      tokens: createSkipLinkTokens({
        'padding-block': '{basis.space.block.md}',
        'padding-inline': '{basis.space.inline.lg}',
      }),
    },
    {
      name: 'Ruim',
      description: 'Meer witruimte binnen de skip link.',
      tokens: createSkipLinkTokens({
        'padding-block': '{basis.space.block.xl}',
        'padding-inline': '{basis.space.inline.2xl}',
      }),
    },
  ],
  order: 2,
  question: 'Kies de padding van de Skip Link',
});

export const SkipLinkTekstgrootte: Story = createPresetStory({
  name: 'Tekstgrootte',
  args: defaultArgs,
  description: 'De tekstgrootte van de skip link blijft in verhouding tot de ingestelde paragraph-grootte.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Kleiner dan bodytekst',
      derivedTokenReference: {
        offset: -1,
        scalePath: 'basis.text.font-size',
        sourcePath: 'nl.paragraph.font-size',
        targetPath: 'nl.skip-link.font-size',
      },
      description: 'Maak de skip link een stap kleiner dan de gewone paragraph.',
      tokens: {},
    },
    {
      name: 'Groter dan bodytekst',
      derivedTokenReference: {
        offset: 1,
        scalePath: 'basis.text.font-size',
        sourcePath: 'nl.paragraph.font-size',
        targetPath: 'nl.skip-link.font-size',
      },
      description: 'Maak de skip link een stap groter dan de gewone paragraph.',
      tokens: {},
    },
  ],
  order: 3,
  question: 'Kies de tekstgrootte van de Skip Link',
});

export const SkipLinkAchtergrondkleur: Story = createPresetStory({
  name: 'Achtergrondkleur',
  args: defaultArgs,
  description: 'De achtergrondkleur en tekstkleur bepalen hoe zichtbaar de skip link is wanneer hij in beeld komt.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Actiekleur',
      description: 'Gebruik een duidelijke actiekleur voor de skip link.',
      tokens: createSkipLinkTokens({
        'background-color': '{basis.color.action-1.bg-default}',
        color: '{basis.color.action-1.color-default}',
      }),
    },
    {
      name: 'Accent',
      description: 'Gebruik een duidelijke accentkleur voor focus.',
      tokens: createSkipLinkTokens({
        'background-color': '{basis.color.accent-1.bg-default}',
        color: '{basis.color.accent-1.color-default}',
      }),
    },
    {
      name: 'Omgekeerd',
      description: 'Gebruik een donkere focusachtergrond met lichte tekst.',
      tokens: createSkipLinkTokens({
        'background-color': '{basis.color.default.inverse-bg-default}',
        color: '{basis.color.default.inverse-color-default}',
      }),
    },
  ],
  order: 4,
  question: 'Kies de achtergrondkleur van de Skip Link',
});
