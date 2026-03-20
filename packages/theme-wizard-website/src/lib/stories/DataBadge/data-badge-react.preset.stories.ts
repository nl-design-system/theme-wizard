import type { DataBadgeProps } from '@nl-design-system-candidate/data-badge-react';
import type { StoryObj } from '@storybook/react-vite';

type Story = StoryObj<DataBadgeProps>;

export const DataBadgeKleur: Story = {
  name: 'Kleur',
  args: {
    children: '42',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de kleur voor de Data Badge',
        description: 'De achtergrondkleur en tekstkleur bepalen hoe de badge opvalt in de interface.',
        options: [
          {
            name: 'Actiekleur',
            description: 'Gebruikt de primaire actiekleur, geschikt voor notificaties.',
            tokens: {
              nl: {
                'data-badge': {
                  'background-color': { $value: '{basis.color.action-1-inverse.bg-default}' },
                  color: { $value: '{basis.color.action-1-inverse.color-default}' },
                },
              },
            },
          },
          {
            name: 'Neutrale kleur',
            description: 'Gebruikt een neutrale achtergrond, minder opvallend.',
            tokens: {
              nl: {
                'data-badge': {
                  'background-color': { $value: '{basis.color.default.bg-subtle}' },
                  color: { $value: '{basis.color.default.color-default}' },
                },
              },
            },
          },
        ],
      },
    ],
  },
};

export const DataBadgeVorm: Story = {
  name: 'Vorm',
  args: {
    children: 'Nieuwe melding',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de vorm van de Data Badge',
        options: [
          {
            name: 'Pill',
            description: 'Volledig afgerond, klassieke badge-vorm.',
            tokens: {
              nl: {
                'data-badge': {
                  'border-radius': { $value: '{basis.border-radius.round}' },
                },
              },
            },
          },
          {
            name: 'Afgerond',
            description: 'Subtiel afgeronde hoeken.',
            tokens: {
              nl: {
                'data-badge': {
                  'border-radius': { $value: '{basis.border-radius.md}' },
                },
              },
            },
          },
          {
            name: 'Rechthoekig',
            description: 'Geen afgeronde hoeken.',
            tokens: {
              nl: {
                'data-badge': {
                  'border-radius': { $value: '0' },
                },
              },
            },
          },
        ],
      },
    ],
  },
};
