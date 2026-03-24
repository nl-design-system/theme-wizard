import type { ButtonProps } from '@nl-design-system-candidate/button-react';
import type { StoryObj } from '@storybook/react-vite';
import { ButtonPrimary, ButtonVariantsWithStates } from './button-react.story-components';

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

export const ButtonInteractionStyle: Story = {
  name: 'Interactiestijl',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de kleur voor interactie met de Buttons',
        description: 'De middelste button in elke rij toont de hover-staat, de rechter toont de actieve staat.',
        options: [
          {
            name: 'Donkerdere tinten',
            description: 'De button wordt iets donkerder bij aanwijzen.',
            tokens: {
              nl: {
                button: {
                  default: {
                    active: {
                      'background-color': { $value: '{basis.color.default.bg-active}' },
                      'border-color': { $value: '{basis.color.default.border-active}' },
                      color: { $value: '{basis.color.default.color-active}' },
                    },
                    hover: {
                      'background-color': { $value: '{basis.color.default.bg-hover}' },
                      'border-color': { $value: '{basis.color.default.border-hover}' },
                      color: { $value: '{basis.color.default.color-hover}' },
                    },
                  },
                  primary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-1-inverse.bg-active}' },
                      'border-color': { $value: '{basis.color.action-1-inverse.border-active}' },
                      color: { $value: '{basis.color.action-1-inverse.color-active}' },
                    },
                    hover: {
                      'background-color': { $value: '{basis.color.action-1-inverse.bg-hover}' },
                      'border-color': { $value: '{basis.color.action-1-inverse.border-hover}' },
                      color: { $value: '{basis.color.action-1-inverse.color-hover}' },
                    },
                  },
                  secondary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-1.bg-active}' },
                      'border-color': { $value: '{basis.color.action-1.border-active}' },
                      color: { $value: '{basis.color.action-1.color-active}' },
                    },
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
            name: 'Omgedraaide kleuren',
            description: 'De button wisselt van kleur bij aanwijzen.',
            tokens: {
              nl: {
                button: {
                  default: {
                    active: {
                      'background-color': { $value: '{basis.color.default-inverse.bg-active}' },
                      'border-color': { $value: '{basis.color.default-inverse.border-active}' },
                      color: { $value: '{basis.color.default-inverse.color-active}' },
                    },
                    hover: {
                      'background-color': { $value: '{basis.color.default-inverse.bg-default}' },
                      'border-color': { $value: '{basis.color.default-inverse.border-default}' },
                      color: { $value: '{basis.color.default-inverse.color-default}' },
                    },
                  },
                  primary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-1.bg-active}' },
                      'border-color': { $value: '{basis.color.action-1.border-active}' },
                      color: { $value: '{basis.color.action-1.color-active}' },
                    },
                    hover: {
                      'background-color': { $value: '{basis.color.action-1.bg-default}' },
                      'border-color': { $value: '{basis.color.action-1.border-default}' },
                      color: { $value: '{basis.color.action-1.color-default}' },
                    },
                  },
                  secondary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-1-inverse.bg-active}' },
                      'border-color': { $value: '{basis.color.action-1-inverse.border-active}' },
                      color: { $value: '{basis.color.action-1-inverse.color-active}' },
                    },
                    hover: {
                      'background-color': { $value: '{basis.color.action-1-inverse.bg-default}' },
                      'border-color': { $value: '{basis.color.action-1-inverse.border-default}' },
                      color: { $value: '{basis.color.action-1-inverse.color-default}' },
                    },
                  },
                },
              },
            },
          },
          {
            name: 'Alternatieve kleur',
            description: 'De button gebruikt een tweede accentkleur bij aanwijzen.',
            tokens: {
              nl: {
                button: {
                  default: {
                    active: {
                      'background-color': { $value: '{basis.color.action-2.bg-active}' },
                      'border-color': { $value: '{basis.color.action-2.border-active}' },
                      color: { $value: '{basis.color.action-2.color-active}' },
                    },
                    hover: {
                      'background-color': { $value: '{basis.color.action-2.bg-default}' },
                      'border-color': { $value: '{basis.color.action-2.border-default}' },
                      color: { $value: '{basis.color.action-2.color-default}' },
                    },
                  },
                  primary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-2-inverse.bg-active}' },
                      'border-color': { $value: '{basis.color.action-2-inverse.border-active}' },
                      color: { $value: '{basis.color.action-2-inverse.color-active}' },
                    },
                    hover: {
                      'background-color': { $value: '{basis.color.action-2-inverse.bg-default}' },
                      'border-color': { $value: '{basis.color.action-2-inverse.border-default}' },
                      color: { $value: '{basis.color.action-2-inverse.color-default}' },
                    },
                  },
                  secondary: {
                    active: {
                      'background-color': { $value: '{basis.color.action-2-inverse.bg-active}' },
                      'border-color': { $value: '{basis.color.action-2-inverse.border-active}' },
                      color: { $value: '{basis.color.action-2-inverse.color-active}' },
                    },
                    hover: {
                      'background-color': { $value: '{basis.color.action-2-inverse.bg-default}' },
                      'border-color': { $value: '{basis.color.action-2-inverse.border-default}' },
                      color: { $value: '{basis.color.action-2-inverse.color-default}' },
                    },
                  },
                },
              },
            },
          },
        ],
        question: 'Hoe wil je dat buttons reageren op muisbeweging?',
        thumbnail: false,
      },
    ],
  },
  render: ButtonVariantsWithStates,
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
  },
  render: ButtonPrimary,
};

export const ButtonColorStyle: Story = {
  name: 'Kleurstijl',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  parameters: {
    presets: [
      {
        name: 'Kies de kleurstijl van de Buttons',
        description: 'De kleur van de button-varianten in de standaard staat.',
        options: [
          {
            name: 'Standaard',
            description: 'Neutrale kleur voor de default button, accentkleur voor primary.',
            tokens: {
              nl: {
                button: {
                  default: {
                    'background-color': { $value: '{basis.color.default.bg-default}' },
                    'border-color': { $value: '{basis.color.default.border-default}' },
                    color: { $value: '{basis.color.default.color-default}' },
                  },
                  primary: {
                    'background-color': { $value: '{basis.color.action-1-inverse.bg-default}' },
                    'border-color': { $value: '{basis.color.action-1-inverse.border-default}' },
                    color: { $value: '{basis.color.action-1-inverse.color-default}' },
                  },
                  secondary: {
                    'background-color': { $value: '{basis.color.action-1.bg-default}' },
                    'border-color': { $value: '{basis.color.action-1.border-default}' },
                    color: { $value: '{basis.color.action-1.color-default}' },
                  },
                },
              },
            },
          },
          {
            name: 'Omgedraaid',
            description: 'Default en primary wisselen van kleur.',
            tokens: {
              nl: {
                button: {
                  default: {
                    'background-color': { $value: '{basis.color.action-1-inverse.bg-default}' },
                    'border-color': { $value: '{basis.color.action-1-inverse.border-default}' },
                    color: { $value: '{basis.color.action-1-inverse.color-default}' },
                  },
                  primary: {
                    'background-color': { $value: '{basis.color.default.bg-default}' },
                    'border-color': { $value: '{basis.color.default.border-default}' },
                    color: { $value: '{basis.color.default.color-default}' },
                  },
                  secondary: {
                    'background-color': { $value: '{basis.color.action-1-inverse.bg-default}' },
                    'border-color': { $value: '{basis.color.action-1-inverse.border-default}' },
                    color: { $value: '{basis.color.action-1-inverse.color-default}' },
                  },
                },
              },
            },
          },
          {
            name: 'Tweede accentkleur',
            description: 'Gebruikt de tweede accentkleur van uw huisstijl.',
            tokens: {
              nl: {
                button: {
                  default: {
                    'background-color': { $value: '{basis.color.action-2.bg-default}' },
                    'border-color': { $value: '{basis.color.action-2.border-default}' },
                    color: { $value: '{basis.color.action-2.color-default}' },
                  },
                  primary: {
                    'background-color': { $value: '{basis.color.action-2-inverse.bg-default}' },
                    'border-color': { $value: '{basis.color.action-2-inverse.border-default}' },
                    color: { $value: '{basis.color.action-2-inverse.color-default}' },
                  },
                  secondary: {
                    'background-color': { $value: '{basis.color.action-2.bg-default}' },
                    'border-color': { $value: '{basis.color.action-2.border-default}' },
                    color: { $value: '{basis.color.action-2.color-default}' },
                  },
                },
              },
            },
          },
        ],
        question: 'Welke kleurstijl past bij uw huisstijl?',
      },
    ],
  },
  render: ButtonPrimary,
};
