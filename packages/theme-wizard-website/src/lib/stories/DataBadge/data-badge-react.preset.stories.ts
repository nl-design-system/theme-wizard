import type { DataBadgeProps } from '@nl-design-system-candidate/data-badge-react';
import type { StoryObj } from '@storybook/react-vite';

type Story = StoryObj<DataBadgeProps>;

const tokenValue = (value: string) => ({ $value: value });

const createDataBadgeTokens = (tokenEntries: Record<string, string>) => ({
  nl: {
    'data-badge': Object.fromEntries(Object.entries(tokenEntries).map(([key, value]) => [key, tokenValue(value)])),
  },
});

const createPresetStory = ({
  name,
  args,
  description,
  options,
  order,
  question,
}: {
  args: DataBadgeProps;
  description?: string;
  name: string;
  options: Array<{ description: string; name: string; tokens: Record<string, unknown> | null }>;
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

export const DataBadgeKleur: Story = createPresetStory({
  name: 'Kleur',
  args: {
    children: '42',
  },
  description: 'De achtergrondkleur en tekstkleur bepalen hoe de badge opvalt in de interface.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Lichter',
      description: 'Gebruikt een lichtere achtergrondkleur.',
      tokens: createDataBadgeTokens({
        'background-color': '{basis.color.default.bg-subtle}',
        color: '{basis.color.default.color-default}',
      }),
    },
  ],
  order: 1,
  question: 'Kies de kleur voor de Data Badge',
});

export const DataBadgeVorm: Story = createPresetStory({
  name: 'Vorm',
  args: {
    children: 'Nieuwe melding',
  },
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Pill',
      description: 'Volledig afgerond, klassieke badge-vorm.',
      tokens: createDataBadgeTokens({
        'border-radius': '{basis.border-radius.round}',
      }),
    },
    {
      name: 'Afgerond',
      description: 'Subtiel afgeronde hoeken.',
      tokens: createDataBadgeTokens({
        'border-radius': '{basis.border-radius.md}',
      }),
    },
    {
      name: 'Rechthoekig',
      description: 'Geen afgeronde hoeken.',
      tokens: createDataBadgeTokens({
        'border-radius': '0',
      }),
    },
  ],
  order: 2,
  question: 'Kies de vorm van de Data Badge',
});

export const DataBadgeGrootte: Story = createPresetStory({
  name: 'Grootte',
  args: {
    children: '42',
  },
  description: 'Bepaal hoe compact of ruim de badge is.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Compact',
      description: 'Kleinere badge met minder padding.',
      tokens: createDataBadgeTokens({
        'min-block-size': '{basis.size.2xs}',
        'min-inline-size': '{basis.size.xs}',
        'padding-block': '{basis.space.block.xs}',
        'padding-inline': '{basis.space.inline.sm}',
      }),
    },
    {
      name: 'Ruim',
      description: 'Ruime badge.',
      tokens: createDataBadgeTokens({
        'min-block-size': '{basis.size.sm}',
        'min-inline-size': '{basis.size.sm}',
        'padding-block': '{basis.space.block.sm}',
        'padding-inline': '{basis.space.inline.md}',
      }),
    },
    {
      name: 'Ruimer',
      description: 'Grotere badge met meer padding.',
      tokens: createDataBadgeTokens({
        'min-block-size': '{basis.size.sm}',
        'min-inline-size': '{basis.size.md}',
        'padding-block': '{basis.space.block.md}',
        'padding-inline': '{basis.space.inline.md}',
      }),
    },
  ],
  order: 3,
  question: 'Kies de grootte van de Data Badge',
});

export const DataBadgeTypografie: Story = createPresetStory({
  name: 'Typografie',
  args: {
    children: '42',
  },
  description: 'Het lettertype en de tekstgrootte van de badge.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Klein',
      description: 'Kleiner lettertype voor subtielere badges.',
      tokens: createDataBadgeTokens({
        'font-size': '{basis.text.font-size.sm}',
      }),
    },
    {
      name: 'Monospace',
      description: 'Gebruik een monospace lettertype, handig voor numerieke waarden.',
      tokens: createDataBadgeTokens({
        'font-family': '{basis.text.font-family.monospace}',
      }),
    },
  ],
  order: 4,
  question: 'Kies de typografie van de Data Badge',
});

export const DataBadgeRand: Story = createPresetStory({
  name: 'Rand',
  args: {
    children: '42',
  },
  description: 'De rand rondom de badge.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Zichtbare rand',
      description: 'Een zichtbare rand rondom de badge.',
      tokens: createDataBadgeTokens({
        'border-color': '{basis.color.default.border-default}',
        'border-width': '{basis.border-width.sm}',
      }),
    },
  ],
  order: 5,
  question: 'Kies de rand van de Data Badge',
});
