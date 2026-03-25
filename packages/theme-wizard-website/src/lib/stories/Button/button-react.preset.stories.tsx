import type { ButtonProps } from '@nl-design-system-candidate/button-react';
import type { StoryObj } from '@storybook/react-vite';
import { ButtonPrimary, RenderButtonPurposePreview } from './button-react.story-components';
import {
  createButtonPresetStory,
  createButtonVariantStory,
  defaultButtonVariantOptions,
  primaryButtonVariantOptions,
  secondaryButtonVariantOptions,
} from './button-react.story-helpers';

type Story = StoryObj<ButtonProps>;
export const ButtonMinimumSize: Story = createButtonPresetStory({
  name: 'Minimale afmeting',
  args: {
    label: 'Klik mij!',
  },
  order: 1,
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
  previewStoryIds: ['WizardPreview'],
  render: ButtonPrimary,
});

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

export const ButtonShape: Story = createButtonPresetStory({
  name: 'Vorm',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  order: 5,
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
  previewStoryIds: ['AllButtonPurposesPreview'],
  render: ButtonPrimary,
});
