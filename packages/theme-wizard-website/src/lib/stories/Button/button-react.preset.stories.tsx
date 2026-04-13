import type { ButtonProps } from '@nl-design-system-candidate/button-react';
import type { StoryObj } from '@storybook/react-vite';
import { createRelativeFontSizePresetOptions } from '../story-helpers';
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
  cardPreviewStoryIds: ['DefaultButtonCardPreview'],
  order: 1,
  presets: [
    {
      name: 'Kies de minimale afmeting',
      description:
        'Voor WCAG 2.1 is 24px de minimale afmeting voor Button, maar voor gebruiksvriendelijkheid wordt ook wel 44px of 48px aangehouden',
      options: [
        {
          name: 'Aanbevolen',
          description: 'Gebruik de standaard uit het startthema.',
          tokens: null,
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
  previewStoryId: 'DefaultButtonCardPreview',
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
  previewStoryId: 'PrimaryButtonCardPreview',
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
  previewStoryId: 'SecondaryButtonCardPreview',
  question: 'Welke stijl wil je voor de secondary button?',
  render: RenderButtonPurposePreview,
});

export const ButtonShape: Story = createButtonPresetStory({
  name: 'Vorm',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  cardPreviewStoryIds: ['DefaultButtonCardPreview'],
  order: 5,
  presets: [
    {
      name: 'Kies de vorm van de Buttons',
      description: 'De afronding van de hoeken van alle button-varianten.',
      options: [
        {
          name: 'Aanbevolen',
          description: 'Gebruik de standaard uit het startthema. Licht afgerond.',
          tokens: null,
        },
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

export const ButtonTextSize: Story = createButtonPresetStory({
  name: 'Tekstgrootte',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  cardPreviewStoryIds: ['DefaultButtonCardPreview'],
  order: 6,
  presets: [
    {
      name: 'Kies de tekstgrootte van alle buttons',
      options: createRelativeFontSizePresetOptions(
        [
          'nl.button.default.font-size',
          'nl.button.primary.font-size',
          'nl.button.secondary.font-size',
          'nl.button.subtle.font-size',
        ],
        'alle buttonvarianten',
      ),
      question: 'Kies de tekstgrootte van alle buttons',
    },
  ],
  previewStoryIds: ['AllButtonPurposesPreview'],
  render: ButtonPrimary,
});
