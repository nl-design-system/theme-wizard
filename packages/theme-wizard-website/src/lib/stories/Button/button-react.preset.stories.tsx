import type { ButtonProps } from '@nl-design-system-candidate/button-react';
import type { StoryObj } from '@storybook/react-vite';
import { ButtonPrimary, RenderButtonPurposePreview } from './button-react.story-components';
import { createButtonVariantStory, type ButtonPresetOptionConfig } from './button-react.story-helpers';

type Story = StoryObj<ButtonProps>;

const defaultButtonVariantOptions: ButtonPresetOptionConfig[] = [
  {
    name: 'Gevuld',
    description: 'De standaard button heeft een ingevulde neutrale achtergrond.',
    family: 'basis.color.default',
    mode: 'filled',
  },
  {
    name: 'Outlined',
    description: 'De standaard button heeft alleen een lijn en geen vulling.',
    family: 'basis.color.default',
    mode: 'outlined',
  },
  {
    name: 'Subtle',
    description: 'De standaard button toont vooral tekst, met alleen een zachte hover- en active-staat.',
    family: 'basis.color.default',
    mode: 'subtle',
  },
];

const primaryButtonVariantOptions: ButtonPresetOptionConfig[] = [
  {
    name: 'Gevuld',
    description: 'De primary button krijgt een duidelijke ingevulde accentkleur.',
    family: 'basis.color.action-1-inverse',
    filledBorderTransparent: true,
    mode: 'filled',
  },
  {
    name: 'Outlined',
    description: 'De primary button krijgt een accentkleurige lijn en transparante achtergrond.',
    family: 'basis.color.action-1',
    mode: 'outlined',
  },
  {
    name: 'Subtle',
    description: 'De primary button toont vooral tekstkleur met een zachte achtergrond bij interactie.',
    family: 'basis.color.action-1',
    mode: 'subtle',
  },
];

const secondaryButtonVariantOptions: ButtonPresetOptionConfig[] = [
  {
    name: 'Gevuld',
    description: 'De secondary button krijgt een lichte ingevulde stijl.',
    family: 'basis.color.action-1',
    filledBorderTransparent: true,
    mode: 'filled',
  },
  {
    name: 'Outlined',
    description: 'De secondary button krijgt een duidelijke lijn en transparante achtergrond.',
    family: 'basis.color.action-1',
    mode: 'outlined',
  },
  {
    name: 'Subtle',
    description: 'De secondary button toont vooral tekstkleur met een zachte hover-achtergrond.',
    family: 'basis.color.action-1',
    mode: 'subtle',
  },
];

export const ButtonMinimumSize: Story = {
  name: 'Minimale afmeting',
  args: {
    label: 'Klik mij!',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de minimale afmeting',
        description:
          'Voor WCAG 2.1 is 24px de minimale afmeting voor Button, maar voor gebruiksvriendelijkheid wordt ook wel 44px of 48px aangehouden',
        options: [
          {
            name: 'Aanbevolen',
            tokens: {
              nl: {
                button: {
                  'min-block-size': {
                    $value: '{basis.pointer-target.min-block-size}',
                  },
                  'min-inline-size': {
                    $value: '{basis.pointer-target.min-inline-size}',
                  },
                },
              },
            },
          },
          {
            name: 'Minimaal',
            tokens: {
              nl: {
                button: {
                  'min-block-size': {
                    $value: '1.5rem',
                  },
                  'min-inline-size': {
                    $value: '1.5rem',
                  },
                },
              },
            },
          },
        ],
      },
    ],
    wizard: {
      order: 1,
    },
  },
  render: ButtonPrimary,
};

export const ButtonDefaultVariantStyle = createButtonVariantStory({
  name: 'Stijl standaard button',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  options: defaultButtonVariantOptions,
  order: 2,
  previewStoryId: 'DefaultButtonPurposePreview',
  question: 'Welke stijl wil je voor de standaard button?',
  render: RenderButtonPurposePreview,
});

export const ButtonPrimaryVariantStyle = createButtonVariantStory({
  name: 'Stijl primary button',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
    purpose: 'primary',
  },
  options: primaryButtonVariantOptions,
  order: 3,
  previewStoryId: 'PrimaryButtonPurposePreview',
  question: 'Welke stijl wil je voor de primary button?',
  render: RenderButtonPurposePreview,
});

export const ButtonSecondaryVariantStyle = createButtonVariantStory({
  name: 'Stijl secondary button',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
    purpose: 'secondary',
  },
  options: secondaryButtonVariantOptions,
  order: 4,
  previewStoryId: 'SecondaryButtonPurposePreview',
  question: 'Welke stijl wil je voor de secondary button?',
  render: RenderButtonPurposePreview,
});

export const ButtonShape: Story = {
  name: 'Vorm',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de vorm van de Buttons',
        description: 'De afronding van de hoeken van alle button-varianten.',
        options: [
          {
            name: 'Hoekig',
            description: 'Geen afgeronde hoeken.',
            tokens: {
              nl: {
                button: {
                  'border-radius': { $value: '0' },
                },
              },
            },
          },
          {
            name: 'Licht hoekig',
            description: 'Kleine afronding, bijna recht.',
            tokens: {
              nl: {
                button: {
                  'border-radius': { $value: '{basis.border-radius.sm}' },
                },
              },
            },
          },
          {
            name: 'Licht afgerond',
            description: 'Subtiel afgeronde hoeken.',
            tokens: {
              nl: {
                button: {
                  'border-radius': { $value: '{basis.border-radius.md}' },
                },
              },
            },
          },
          {
            name: 'Sterk afgerond',
            description: 'Grote afronding.',
            tokens: {
              nl: {
                button: {
                  'border-radius': { $value: '{basis.border-radius.lg}' },
                },
              },
            },
          },
          {
            name: 'Rond',
            description: 'Volledig rond.',
            tokens: {
              nl: {
                button: {
                  'border-radius': { $value: '{basis.border-radius.round}' },
                },
              },
            },
          },
        ],
        question: 'Hoe afgerond mogen de hoeken van buttons zijn?',
      },
    ],
    wizard: {
      order: 5,
      previewStoryIds: ['AllButtonPurposesPreview'],
    },
  },
  render: ButtonPrimary,
};
