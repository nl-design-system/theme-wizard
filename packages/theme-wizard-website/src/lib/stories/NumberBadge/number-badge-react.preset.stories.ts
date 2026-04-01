import type { NumberBadgeProps } from '@nl-design-system-candidate/number-badge-react';
import type { StoryObj } from '@storybook/react-vite';
import { createPresetTokens } from '../story-helpers';

type Story = StoryObj<NumberBadgeProps>;

const createNumberBadgeTokens = (entries: Record<string, string>) => createPresetTokens('nl.number-badge', entries);

const createPresetStory = ({
  name,
  args,
  description,
  options,
  order,
  question,
}: {
  args: NumberBadgeProps;
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

const defaultArgs = {
  children: '42',
  label: '42 ongelezen berichten',
};

export const NumberBadgeAfmeting: Story = createPresetStory({
  name: 'Afmeting',
  args: defaultArgs,
  description: 'De minimale hoogte en breedte bepalen hoe compact of nadrukkelijk de Number Badge oogt.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Ruim',
      description: 'Maak de badge iets groter en nadrukkelijker.',
      tokens: createNumberBadgeTokens({
        'min-block-size': '{basis.size.sm}',
        'min-inline-size': '{basis.size.sm}',
      }),
    },
  ],
  order: 1,
  question: 'Kies de minimale afmeting van de Number Badge',
});

export const NumberBadgePadding: Story = createPresetStory({
  name: 'Padding',
  args: defaultArgs,
  description: 'De binnenruimte bepaalt hoe veel lucht rondom het cijfer zit.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Ruim',
      description: 'Meer witruimte binnen de badge.',
      tokens: createNumberBadgeTokens({
        'padding-block': '{basis.space.block.md}',
        'padding-inline': '{basis.space.inline.md}',
      }),
    },
  ],
  order: 2,
  question: 'Kies de padding van de Number Badge',
});

export const NumberBadgeLettertype: Story = createPresetStory({
  name: 'Lettertype',
  args: defaultArgs,
  description: 'Kies of de Number Badge het documentlettertype volgt of juist een monospace-lettertype gebruikt.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Monospace',
      description: 'Gebruik een monospace-lettertype voor een technischer uiterlijk.',
      tokens: createNumberBadgeTokens({
        'font-family': '{basis.text.font-family.monospace}',
      }),
    },
  ],
  order: 3,
  question: 'Kies het lettertype van de Number Badge',
});

export const NumberBadgeTekstgrootte: Story = createPresetStory({
  name: 'Tekstgrootte',
  args: defaultArgs,
  description: 'De tekstgrootte bepaalt hoe nadrukkelijk het getal in de badge is.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Ruim',
      description: 'Gebruik een grotere tekstgrootte.',
      tokens: createNumberBadgeTokens({
        'font-size': '{basis.text.font-size.lg}',
      }),
    },
  ],
  order: 4,
  question: 'Kies de tekstgrootte van de Number Badge',
});

export const NumberBadgeKleur: Story = createPresetStory({
  name: 'Kleur',
  args: defaultArgs,
  description: 'De achtergrondkleur en tekstkleur bepalen hoe sterk de Number Badge opvalt.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Neutraal',
      description: 'Gebruik een subtiele, neutrale badgekleur.',
      tokens: createNumberBadgeTokens({
        'background-color': '{basis.color.default.bg-subtle}',
        color: '{basis.color.default.color-default}',
      }),
    },
    {
      name: 'Accent',
      description: 'Gebruik een opvallendere accentkleur.',
      tokens: createNumberBadgeTokens({
        'background-color': '{basis.color.accent-1.bg-default}',
        color: '{basis.color.accent-1.color-default}',
      }),
    },
  ],
  order: 5,
  question: 'Kies de kleur van de Number Badge',
});

export const NumberBadgeVorm: Story = createPresetStory({
  name: 'Vorm',
  args: defaultArgs,
  description: 'De afronding bepaalt of de Number Badge hoekig, afgerond of rond oogt.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Hoekig',
      description: 'Gebruik subtiel afgeronde hoeken.',
      tokens: createNumberBadgeTokens({
        'border-radius': '0',
      }),
    },
    {
      name: 'Licht hoekig',
      description: 'Kleine afronding, bijna recht.',
      tokens: createNumberBadgeTokens({
        'border-radius': '{basis.border-radius.sm}',
      }),
    },
    {
      name: 'Licht afgerond',
      description: 'Subtiel afgeronde hoeken.',
      tokens: createNumberBadgeTokens({
        'border-radius': '{basis.border-radius.md}',
      }),
    },
    {
      name: 'Sterk afgerond',
      description: 'Grote afronding.',
      tokens: createNumberBadgeTokens({
        'border-radius': '{basis.border-radius.lg}',
      }),
    },
    {
      name: 'Rond',
      description: 'Volledig rond.',
      tokens: createNumberBadgeTokens({
        'border-radius': '{basis.border-radius.round}',
      }),
    },
  ],
  order: 6,
  question: 'Kies de vorm van de Number Badge',
});

export const NumberBadgeRand: Story = createPresetStory({
  name: 'Rand',
  args: defaultArgs,
  description: 'De rand kan onzichtbaar blijven of juist meer nadruk geven aan de Number Badge.',
  options: [
    {
      name: 'Aanbevolen',
      description: 'Gebruik de standaard uit het startthema.',
      tokens: null,
    },
    {
      name: 'Geen rand',
      description: 'Laat de rand onzichtbaar.',
      tokens: createNumberBadgeTokens({
        'border-color': '{basis.color.transparent}',
        'border-width': '0',
      }),
    },
    {
      name: 'Subtiel',
      description: 'Gebruik een rustige, dunne rand.',
      tokens: createNumberBadgeTokens({
        'border-color': '{basis.color.default.border-subtle}',
        'border-width': '{basis.border-width.sm}',
      }),
    },
    {
      name: 'Standaard',
      description: 'Gebruik een normale zichtbare rand.',
      tokens: createNumberBadgeTokens({
        'border-color': '{basis.color.default.border-default}',
        'border-width': '{basis.border-width.sm}',
      }),
    },
    {
      name: 'Sterk',
      description: 'Gebruik een dikkere rand voor extra nadruk.',
      tokens: createNumberBadgeTokens({
        'border-color': '{basis.color.default.border-default}',
        'border-width': '{basis.border-width.md}',
      }),
    },
    {
      name: 'Accent 1',
      description: 'Gebruik een rand in accentkleur.',
      tokens: createNumberBadgeTokens({
        'border-color': '{basis.color.accent-1.border-default}',
        'border-width': '{basis.border-width.sm}',
      }),
    },
    {
      name: 'Sterk accent 1',
      description: 'Gebruik een dikkere rand in accentkleur.',
      tokens: createNumberBadgeTokens({
        'border-color': '{basis.color.accent-1.border-default}',
        'border-width': '{basis.border-width.md}',
      }),
    },
  ],
  order: 7,
  question: 'Kies de rand van de Number Badge',
});
