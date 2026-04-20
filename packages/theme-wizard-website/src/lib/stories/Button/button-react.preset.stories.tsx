import type { ButtonProps } from '@nl-design-system-candidate/button-react';
import type { StoryObj } from '@storybook/react-vite';
import { createRelativeFontSizePresetOptions } from '../story-helpers';
import { ButtonPrimary, RenderButtonPurposePreview } from './button-react.story-components';
import {
  createButtonPresetStory,
  createButtonStyleSuggestionOption,
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
                  $type: 'dimension',
                  $value: '1.5rem',
                },
                'min-inline-size': {
                  $type: 'dimension',
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

export const ButtonVariantStyles = createButtonPresetStory({
  name: 'Stijl van buttons',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  order: 2,
  cardPreviewStoryIds: ['AllButtonPurposesPreview'],
  presets: [
    {
      name: 'Kies de stijlrichting voor alle buttons',
      description: 'Kies een samenhangende set voor standaard, primary en secondary buttons.',
      options: [
        {
          name: 'Aanbevolen',
          description: 'Gebruik de standaard uit het startthema.',
          tokens: null,
        },
        createButtonStyleSuggestionOption({
          name: 'Klassieke hiërarchie',
          description: 'Drie duidelijke niveaus: primary is gevuld, secondary heeft een lijn, standaard blijft rustig.',
          config: {
            default: { family: 'basis.color.default', mode: 'subtle' },
            primary: { family: 'basis.color.action-1', mode: 'filled' },
            secondary: { family: 'basis.color.action-1', mode: 'outlined' },
          },
        }),
        createButtonStyleSuggestionOption({
          name: 'Eén sterke actie',
          description: 'Alleen de primary button springt eruit. Secundaire acties stappen terug.',
          config: {
            default: { family: 'basis.color.default', mode: 'subtle' },
            primary: { family: 'basis.color.action-1', mode: 'filled' },
            secondary: { family: 'basis.color.action-1', mode: 'subtle' },
          },
        }),
        createButtonStyleSuggestionOption({
          name: 'Twee sterke acties',
          description: 'Primary en secondary zijn beide prominent. Standaard acties stappen terug.',
          config: {
            default: { family: 'basis.color.default', mode: 'subtle' },
            primary: { family: 'basis.color.action-1', mode: 'filled' },
            secondary: { family: 'basis.color.action-1', mode: 'filled' },
          },
        }),
        createButtonStyleSuggestionOption({
          name: 'Lijn als stijl',
          description: 'Geen gevulde buttons — de primary onderscheidt zich via lijn en kleur, de rest is rustig.',
          config: {
            default: { family: 'basis.color.default', mode: 'subtle' },
            primary: { family: 'basis.color.action-1', mode: 'outlined' },
            secondary: { family: 'basis.color.action-1', mode: 'subtle' },
          },
        }),
        createButtonStyleSuggestionOption({
          name: 'Strak',
          description: 'Primary is gevuld, standaard en secondary hebben een lijn. Zakelijk en gestructureerd.',
          config: {
            default: { family: 'basis.color.default', mode: 'outlined' },
            primary: { family: 'basis.color.action-1', mode: 'filled' },
            secondary: { family: 'basis.color.action-1', mode: 'outlined' },
          },
        }),
        createButtonStyleSuggestionOption({
          name: 'Gelijkwaardig',
          description: 'Alle buttons zijn subtiel. Hiërarchie ontstaat door plaatsing en context, niet door kleurvlak.',
          config: {
            default: { family: 'basis.color.default', mode: 'subtle' },
            primary: { family: 'basis.color.action-1', mode: 'subtle' },
            secondary: { family: 'basis.color.action-1', mode: 'subtle' },
          },
        }),
      ],
      question: 'Kies de stijlrichting voor alle buttons',
    },
  ],
  previewStoryIds: ['AllButtonPurposesPreview'],
  render: RenderButtonPurposePreview,
});

export const ButtonShape: Story = createButtonPresetStory({
  name: 'Vorm',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  cardPreviewStoryIds: ['DefaultButtonCardPreview'],
  order: 3,
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
  order: 4,
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
