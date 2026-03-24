import type { ButtonProps } from '@nl-design-system-candidate/button-react';
import type { StoryObj } from '@storybook/react-vite';
import { ButtonPrimary, RenderButtonPurposePreview } from './button-react.story-components';

type Story = StoryObj<ButtonProps>;

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
  },
  render: ButtonPrimary,
};

export const ButtonDefaultVariantStyle: Story = {
  name: 'Stijl standaard button',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de stijl van de standaard button',
        description: 'De middelste button in elke rij toont de hover-staat, de rechter toont de actieve staat.',
        options: [
          {
            name: 'Gevuld',
            description: 'De standaard button heeft een ingevulde neutrale achtergrond.',
            tokens: {
              nl: {
                button: {
                  default: {
                    active: {
                      'background-color': { $value: '{basis.color.default.bg-active}' },
                      'border-color': { $value: '{basis.color.default.border-active}' },
                      color: { $value: '{basis.color.default.color-active}' },
                    },
                    'background-color': { $value: '{basis.color.default.bg-default}' },
                    'border-color': { $value: '{basis.color.default.border-default}' },
                    color: { $value: '{basis.color.default.color-default}' },
                    hover: {
                      'background-color': { $value: '{basis.color.default.bg-hover}' },
                      'border-color': { $value: '{basis.color.default.border-hover}' },
                      color: { $value: '{basis.color.default.color-hover}' },
                    },
                  },
                },
              },
            },
          },
          {
            name: 'Outlined',
            description: 'De standaard button heeft alleen een lijn en geen vulling.',
            tokens: {
              nl: {
                button: {
                  default: {
                    active: {
                      'background-color': { $value: '{basis.color.default.bg-active}' },
                      'border-color': { $value: '{basis.color.default.border-active}' },
                      color: { $value: '{basis.color.default.color-active}' },
                    },
                    'background-color': { $value: '{basis.color.transparent}' },
                    'border-color': { $value: '{basis.color.default.border-default}' },
                    color: { $value: '{basis.color.default.color-default}' },
                    hover: {
                      'background-color': { $value: '{basis.color.default.bg-hover}' },
                      'border-color': { $value: '{basis.color.default.border-hover}' },
                      color: { $value: '{basis.color.default.color-hover}' },
                    },
                  },
                },
              },
            },
          },
          {
            name: 'Subtle',
            description: 'De standaard button toont vooral tekst, met alleen een zachte hover- en active-staat.',
            tokens: {
              nl: {
                button: {
                  default: {
                    active: {
                      'background-color': { $value: '{basis.color.default.bg-active}' },
                      'border-color': { $value: '{basis.color.transparent}' },
                      color: { $value: '{basis.color.default.color-active}' },
                    },
                    'background-color': { $value: '{basis.color.transparent}' },
                    'border-color': { $value: '{basis.color.transparent}' },
                    color: { $value: '{basis.color.default.color-default}' },
                    hover: {
                      'background-color': { $value: '{basis.color.default.bg-hover}' },
                      'border-color': { $value: '{basis.color.transparent}' },
                      color: { $value: '{basis.color.default.color-hover}' },
                    },
                  },
                },
              },
            },
          },
        ],
        question: 'Welke stijl wil je voor de standaard button?',
        thumbnail: false,
      },
    ],
    wizard: {
      previewStoryIds: ['DefaultButtonPurposePreview'],
    },
  },
  render: RenderButtonPurposePreview,
};

export const ButtonPrimaryVariantStyle: Story = {
  name: 'Stijl primary button',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
    purpose: 'primary',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de stijl van de primary button',
        description: 'De middelste button in elke rij toont de hover-staat, de rechter toont de actieve staat.',
        options: [
          {
            name: 'Gevuld',
            description: 'De primary button krijgt een duidelijke ingevulde accentkleur.',
            tokens: {
              nl: {
                button: {
                  primary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-1-inverse.bg-active}' },
                      'border-color': { $value: '{basis.color.transparent}' },
                      color: { $value: '{basis.color.action-1-inverse.color-active}' },
                    },
                    'background-color': { $value: '{basis.color.action-1-inverse.bg-default}' },
                    'border-color': { $value: '{basis.color.transparent}' },
                    color: { $value: '{basis.color.action-1-inverse.color-default}' },
                    hover: {
                      'background-color': { $value: '{basis.color.action-1-inverse.bg-hover}' },
                      'border-color': { $value: '{basis.color.transparent}' },
                      color: { $value: '{basis.color.action-1-inverse.color-hover}' },
                    },
                  },
                },
              },
            },
          },
          {
            name: 'Outlined',
            description: 'De primary button krijgt een accentkleurige lijn en transparante achtergrond.',
            tokens: {
              nl: {
                button: {
                  primary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-1.bg-active}' },
                      'border-color': { $value: '{basis.color.action-1.border-active}' },
                      color: { $value: '{basis.color.action-1.color-active}' },
                    },
                    'background-color': { $value: '{basis.color.transparent}' },
                    'border-color': { $value: '{basis.color.action-1.border-default}' },
                    color: { $value: '{basis.color.action-1.color-default}' },
                    hover: {
                      'background-color': { $value: '{basis.color.action-1.bg-hover}' },
                      'border-color': { $value: '{basis.color.action-1.border-hover}' },
                      color: { $value: '{basis.color.action-1.color-hover}' },
                    },
                  },
                },
              },
            },
          },
          {
            name: 'Subtle',
            description: 'De primary button toont vooral tekstkleur met een zachte achtergrond bij interactie.',
            tokens: {
              nl: {
                button: {
                  primary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-1.bg-active}' },
                      'border-color': { $value: '{basis.color.transparent}' },
                      color: { $value: '{basis.color.action-1.color-active}' },
                    },
                    'background-color': { $value: '{basis.color.transparent}' },
                    'border-color': { $value: '{basis.color.transparent}' },
                    color: { $value: '{basis.color.action-1.color-default}' },
                    hover: {
                      'background-color': { $value: '{basis.color.action-1.bg-hover}' },
                      'border-color': { $value: '{basis.color.transparent}' },
                      color: { $value: '{basis.color.action-1.color-hover}' },
                    },
                  },
                },
              },
            },
          },
        ],
        question: 'Welke stijl wil je voor de primary button?',
        thumbnail: false,
      },
    ],
    wizard: {
      previewStoryIds: ['PrimaryButtonPurposePreview'],
    },
  },
  render: RenderButtonPurposePreview,
};

export const ButtonSecondaryVariantStyle: Story = {
  name: 'Stijl secondary button',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
    purpose: 'secondary',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de stijl van de secondary button',
        description: 'De middelste button in elke rij toont de hover-staat, de rechter toont de actieve staat.',
        options: [
          {
            name: 'Gevuld',
            description: 'De secondary button krijgt een lichte ingevulde stijl.',
            tokens: {
              nl: {
                button: {
                  secondary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-1.bg-active}' },
                      'border-color': { $value: '{basis.color.transparent}' },
                      color: { $value: '{basis.color.action-1.color-active}' },
                    },
                    'background-color': { $value: '{basis.color.action-1.bg-default}' },
                    'border-color': { $value: '{basis.color.transparent}' },
                    color: { $value: '{basis.color.action-1.color-default}' },
                    hover: {
                      'background-color': { $value: '{basis.color.action-1.bg-hover}' },
                      'border-color': { $value: '{basis.color.transparent}' },
                      color: { $value: '{basis.color.action-1.color-hover}' },
                    },
                  },
                },
              },
            },
          },
          {
            name: 'Outlined',
            description: 'De secondary button krijgt een duidelijke lijn en transparante achtergrond.',
            tokens: {
              nl: {
                button: {
                  secondary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-1.bg-active}' },
                      'border-color': { $value: '{basis.color.action-1.border-active}' },
                      color: { $value: '{basis.color.action-1.color-active}' },
                    },
                    'background-color': { $value: '{basis.color.transparent}' },
                    'border-color': { $value: '{basis.color.action-1.border-default}' },
                    color: { $value: '{basis.color.action-1.color-default}' },
                    hover: {
                      'background-color': { $value: '{basis.color.action-1.bg-hover}' },
                      'border-color': { $value: '{basis.color.action-1.border-hover}' },
                      color: { $value: '{basis.color.action-1.color-hover}' },
                    },
                  },
                },
              },
            },
          },
          {
            name: 'Subtle',
            description: 'De secondary button toont vooral tekstkleur met een zachte hover-achtergrond.',
            tokens: {
              nl: {
                button: {
                  secondary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-1.bg-active}' },
                      'border-color': { $value: '{basis.color.transparent}' },
                      color: { $value: '{basis.color.action-1.color-active}' },
                    },
                    'background-color': { $value: '{basis.color.transparent}' },
                    'border-color': { $value: '{basis.color.transparent}' },
                    color: { $value: '{basis.color.action-1.color-default}' },
                    hover: {
                      'background-color': { $value: '{basis.color.action-1.bg-hover}' },
                      'border-color': { $value: '{basis.color.transparent}' },
                      color: { $value: '{basis.color.action-1.color-hover}' },
                    },
                  },
                },
              },
            },
          },
        ],
        question: 'Welke stijl wil je voor de secondary button?',
        thumbnail: false,
      },
    ],
    wizard: {
      previewStoryIds: ['SecondaryButtonPurposePreview'],
    },
  },
  render: RenderButtonPurposePreview,
};

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
      previewStoryIds: ['AllButtonPurposesPreview'],
    },
  },
  render: ButtonPrimary,
};
