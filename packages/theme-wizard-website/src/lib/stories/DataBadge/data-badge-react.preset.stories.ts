import type { DataBadgeProps } from '@nl-design-system-candidate/data-badge-react';
import type { StoryObj } from '@storybook/react-vite';

type Story = StoryObj<DataBadgeProps>;

const tokenValue = (value: string) => ({ $value: value });

const createDataBadgeTokens = (tokenEntries: Record<string, string>) => ({
  nl: {
    'data-badge': Object.fromEntries(
      Object.entries(tokenEntries).map(([key, value]) => [key, tokenValue(value)]),
    ),
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
  options: Array<{ description: string; name: string; tokens: unknown }>;
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
      name: 'Actiekleur',
      description: 'Gebruikt de primaire actiekleur, geschikt voor notificaties.',
      tokens: createDataBadgeTokens({
        'background-color': '{basis.color.action-1-inverse.bg-default}',
        color: '{basis.color.action-1-inverse.color-default}',
      }),
    },
    {
      name: 'Neutrale kleur',
      description: 'Gebruikt een neutrale achtergrond, minder opvallend.',
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
