import type { Meta, StoryObj, StoryContext } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/button-css/button.css?inline';
import { Button as ButtonComponent, type ButtonProps } from '@nl-design-system-candidate/button-react';
import tokens from '@nl-design-system-candidate/button-tokens';
import { type ComponentType } from 'react';
import {
  ButtonPrimary,
  ButtonVariants,
  ButtonVariantsWithStates,
  Icon,
  RenderButtonDisabled,
  RenderButtonFocusVisible,
  RenderButtonPressed,
  RenderButtonStates,
  WizardPreviewSection,
  buttonWizardStepBasic,
  buttonWizardStepDisabled,
  buttonWizardStepNegativePressed,
  buttonWizardStepNegativeStates,
  buttonWizardStepNegativeVariants,
  buttonWizardStepPositivePressed,
  buttonWizardStepPositiveStates,
  buttonWizardStepPositiveVariants,
  buttonWizardStepPressed,
  buttonWizardStepStates,
  buttonWizardStepVariants,
} from './button-react.story-components';

const meta = {
  id: 'button',
  component: ButtonComponent,
  parameters: {
    css: [css],
    docs: {
      description: {
        component: 'Als de `purpose` prop is gezet, kan er optioneel een `hint` mee gegeven worden',
      },
    },
    tokens,
  },
  title: 'Button',
} satisfies Meta<typeof ButtonComponent>;

export default meta;

type Story = StoryObj<ButtonProps>;

export const Button: Story = {
  name: 'Button',
  args: {
    label: 'Klik mij!',
  },
  parameters: {
    docs: {
      description: {
        story: `Een standaard Button`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          default: {
            'border-width': {
              $value: '',
            },
            'font-size': {
              $value: '',
            },
            'font-weight': {
              $value: '',
            },
            'line-height': {
              $value: '',
            },
          },
        },
      },
    },
    presets: [
      {
        name: 'Kies de minimale afmeting',
        description:
          'Voor WCAG 2.1 is 24px de minimale afmeting voor Button, maar voor gebruiksvriendelijkheid wordt ook wel 44px of 48px aangehouden',
        options: [
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
        ],
      },
    ],
  },
};


export const WizardPreview: Story = {
  name: 'Wizard Preview',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ columnGap: '1.5rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', rowGap: '1.5rem' }}>
        <WizardPreviewSection label="Normaal">
          <ButtonComponent label="Klik mij!" />
        </WizardPreviewSection>

        <WizardPreviewSection label="Met emoji">
          <ButtonComponent iconStart="❤️" label="Klik mij!" />
        </WizardPreviewSection>

        <WizardPreviewSection label="Icon only">
          <ButtonComponent iconOnly iconStart={<Icon />} label="Klik mij!" />
        </WizardPreviewSection>

        <WizardPreviewSection label="Disabled">
          <ButtonComponent disabled label="Klik mij!" />
        </WizardPreviewSection>

        <WizardPreviewSection label="Toggle gesloten en open">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <ButtonComponent label="Meer tonen" pressed={false} />
            <ButtonComponent label="Meer tonen" pressed />
          </div>
        </WizardPreviewSection>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <WizardPreviewSection label="Hover en active">
          <ButtonVariantsWithStates iconStart="❤️" label="Klik mij!" />
        </WizardPreviewSection>
      </div>
    </div>
  ),
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

export const DesignButtonBorders: Story = {
  name: 'Design: Button Borders',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Er is 1 instelling voor de border-radius van alle soorten buttons.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          'border-radius': {
            $value: '',
          },
          default: {
            'border-width': {
              $value: '',
            },
          },
          primary: {
            'border-width': {
              $value: '',
            },
          },
          secondary: {
            'border-width': {
              $value: '',
            },
          },
          subtle: {
            'border-width': {
              $value: '',
            },
          },
        },
      },
    },
    wizard: buttonWizardStepBasic,
  },
  render: ButtonVariants,
};

export const DesignButtonTypography: Story = {
  name: 'Design: Button Typography',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Buttons op 'n rijtje.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          default: {
            'font-size': {
              $value: '',
            },
            'font-weight': {
              $value: '',
            },
            'line-height': {
              $value: '',
            },
          },
          'font-family': {
            $value: '',
          },
          primary: {
            'font-size': {
              $value: '',
            },
            'font-weight': {
              $value: '',
            },
            'line-height': {
              $value: '',
            },
          },
          secondary: {
            'font-size': {
              $value: '',
            },
            'font-weight': {
              $value: '',
            },
            'line-height': {
              $value: '',
            },
          },
          subtle: {
            'font-size': {
              $value: '',
            },
            'font-weight': {
              $value: '',
            },
            'line-height': {
              $value: '',
            },
          },
        },
      },
    },
    wizard: buttonWizardStepBasic,
  },
  render: ButtonVariants,
};

export const DesignButtonStates: Story = {
  name: 'Design: Button States',
  args: {
    label: 'Klik mij!',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een standaard Button, met hover en active states.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          default: {
            active: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
            'background-color': {
              $value: '',
            },
            'border-color': {
              $value: '',
            },
            color: {
              $value: '',
            },
            hover: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepStates,
  },
  render: RenderButtonStates,
};

export const DesignPrimaryButtonStates: Story = {
  name: 'Design: Button States',
  args: {
    label: 'Klik mij!',
    purpose: 'primary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een Primary Button, met hover en active states.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          primary: {
            active: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
            'background-color': {
              $value: '',
            },
            'border-color': {
              $value: '',
            },
            color: {
              $value: '',
            },
            hover: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepStates,
  },
  render: RenderButtonStates,
};

export const DesignSecondaryButtonStates: Story = {
  name: 'Design: Secondary Button States',
  args: {
    label: 'Klik mij!',
    purpose: 'secondary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een Secondary Button, met hover en active states.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          secondary: {
            active: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
            'background-color': {
              $value: '',
            },
            'border-color': {
              $value: '',
            },
            color: {
              $value: '',
            },
            hover: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepStates,
  },
  render: RenderButtonStates,
};

export const DesignSubtleButtonStates: Story = {
  name: 'Design: Subtle Button States',
  args: {
    label: 'Klik mij!',
    purpose: 'subtle',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een Subtle Button, met hover en active states.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          subtle: {
            active: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
            'background-color': {
              $value: '',
            },
            'border-color': {
              $value: '',
            },
            color: {
              $value: '',
            },
            hover: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepStates,
  },
  render: RenderButtonStates,
};

export const DesignPrimaryPositiveButtonStates: Story = {
  name: 'Design: Primary Positive Button States',
  args: {
    hint: 'positive',
    label: 'Klik mij!',
    purpose: 'primary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een Primary Positive Button, met hover en active states.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          primary: {
            positive: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepPositiveStates,
  },
  render: RenderButtonStates,
};
export const DesignSecondaryPositiveButtonStates: Story = {
  name: 'Design: Secondary Positive Button States',
  args: {
    hint: 'positive',
    label: 'Klik mij!',
    purpose: 'secondary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een Secondary Positive Button, met hover en active states.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          secondary: {
            positive: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepPositiveStates,
  },
  render: RenderButtonStates,
};
export const DesignSubtlePositiveButtonStates: Story = {
  name: 'Design: Subtle Positive Button States',
  args: {
    hint: 'positive',
    label: 'Klik mij!',
    purpose: 'subtle',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een Subtle Positive Button, met hover en active states.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          subtle: {
            positive: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepPositiveStates,
  },
  render: RenderButtonStates,
};

export const DesignPrimaryNegativeButtonStates: Story = {
  name: 'Design: Primary Negative Button States',
  args: {
    hint: 'negative',
    label: 'Klik mij!',
    purpose: 'primary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een Primary Negative Button, met hover en active states.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          primary: {
            negative: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepNegativeStates,
  },
  render: RenderButtonStates,
};
export const DesignSecondaryNegativeButtonStates: Story = {
  name: 'Design: Secondary Negative Button States',
  args: {
    hint: 'negative',
    label: 'Klik mij!',
    purpose: 'secondary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een Secondary Negative Button, met hover en active states.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          secondary: {
            negative: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepNegativeStates,
  },
  render: RenderButtonStates,
};
export const DesignSubtleNegativeButtonStates: Story = {
  name: 'Design: Subtle Negative Button States',
  args: {
    hint: 'negative',
    label: 'Klik mij!',
    purpose: 'subtle',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een Subtle Negative Button, met hover en active states.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          subtle: {
            negative: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepNegativeStates,
  },
  render: RenderButtonStates,
};

export const PrimaryButton: Story = {
  name: 'Primary Button',
  args: {
    label: 'Primary Button',
    purpose: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: `Button die een primaire actie aanduid. Een primaire actie is de meest logische keuze in een flow.
Wees spaarzaam met een primary button. Te veel primary buttons in beeld kan verwarrend zijn voor de gebruiker.
Optioneel kan er een hint mee gegeven worden.

- \`hint="positive"\` geeft een positief of successvol resultaat aan. Bijvoorbeeld een creatie actie.
- \`hint="negative"\` geeft een negatief of destructief resultaat aan. Bijvoorbeeld een verwijder actie.
        `,
      },
    },
  },
};

export const DesignPrimaryButton: Story = {
  name: 'Design: Primary Button',
  args: {
    label: 'Primary Button',
    purpose: 'primary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `... `,
      },
    },
    editableTokens: {
      nl: {
        button: {
          primary: {
            'border-width': {
              $value: '',
            },
            'font-size': {
              $value: '',
            },
            'font-weight': {
              $value: '',
            },
            'line-height': {
              $value: '',
            },
          },
        },
      },
    },
    wizard: buttonWizardStepVariants,
  },
  render(args: ButtonProps, context: StoryContext<ButtonProps>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { disabled, htmlDisabled, iconEnd, iconOnly, iconStart, label, pressed, toggle, ...rest } = args as any;
    const Button = context.component as ComponentType<ButtonProps>;

    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button
          label={label}
          purpose="primary"
          disabled={disabled}
          htmlDisabled={htmlDisabled}
          iconStart={iconStart}
          iconEnd={iconEnd}
          iconOnly={iconOnly}
          pressed={pressed}
          toggle={toggle}
          {...rest}
        />
        <Button
          label={`${label} (positive)`}
          purpose="primary"
          hint="positive"
          disabled={disabled}
          htmlDisabled={htmlDisabled}
          iconStart={iconStart}
          iconEnd={iconEnd}
          iconOnly={iconOnly}
          pressed={pressed}
          toggle={toggle}
          {...rest}
        />
        <Button
          label={`${label} (negative)`}
          purpose="primary"
          hint="negative"
          disabled={disabled}
          htmlDisabled={htmlDisabled}
          iconStart={iconStart}
          iconEnd={iconEnd}
          iconOnly={iconOnly}
          pressed={pressed}
          toggle={toggle}
          {...rest}
        />
      </div>
    );
  },
};

export const SecondaryButton: Story = {
  name: 'Secondary Button',
  args: {
    label: 'Secondary Button',
    purpose: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: `Button die een secondare actie aanduid. De secondaire actie wordt gebruikt als alternatief voor de primaire actie.
Optioneel kan er een hint mee gegeven worden.

- \`hint="positive"\` geeft een positief of successvol resultaat aan. Bijvoorbeeld een creatie actie.
- \`hint="negative"\` geeft een negatief of destructief resultaat aan. Bijvoorbeeld een verwijder actie.
        `,
      },
    },
  },
};

export const DesignSecondaryButton: Story = {
  name: 'Design: Secondary Button',
  args: {
    label: 'Secondary Button',
    purpose: 'secondary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Button die een secondare actie aanduid. De secondaire actie wordt gebruikt als alternatief voor de primaire actie.
Optioneel kan er een hint mee gegeven worden.

- \`hint="positive"\` geeft een positief of successvol resultaat aan. Bijvoorbeeld een creatie actie.
- \`hint="negative"\` geeft een negatief of destructief resultaat aan. Bijvoorbeeld een verwijder actie.
        `,
      },
    },
    editableTokens: {
      nl: {
        button: {
          secondary: {
            'border-width': {
              $value: '',
            },
            'font-size': {
              $value: '',
            },
            'font-weight': {
              $value: '',
            },
            'line-height': {
              $value: '',
            },
          },
        },
      },
    },
    wizard: buttonWizardStepVariants,
  },
  render: (args: ButtonProps, context: StoryContext<ButtonProps>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { disabled, htmlDisabled, iconEnd, iconOnly, iconStart, label, pressed, toggle, ...rest } = args as any;
    const Button = context.component as ComponentType<ButtonProps>;

    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button
          label={label}
          purpose="secondary"
          disabled={disabled}
          htmlDisabled={htmlDisabled}
          iconStart={iconStart}
          iconEnd={iconEnd}
          iconOnly={iconOnly}
          pressed={pressed}
          toggle={toggle}
          {...rest}
        />
        <Button
          label={`${label} (positive)`}
          purpose="secondary"
          hint="positive"
          disabled={disabled}
          htmlDisabled={htmlDisabled}
          iconStart={iconStart}
          iconEnd={iconEnd}
          iconOnly={iconOnly}
          pressed={pressed}
          toggle={toggle}
          {...rest}
        />
        <Button
          label={`${label} (negative)`}
          purpose="secondary"
          hint="negative"
          disabled={disabled}
          htmlDisabled={htmlDisabled}
          iconStart={iconStart}
          iconEnd={iconEnd}
          iconOnly={iconOnly}
          pressed={pressed}
          toggle={toggle}
          {...rest}
        />
      </div>
    );
  },
};

export const SubtleButton: Story = {
  name: 'Subtle Button',
  args: {
    label: 'Subtle Button',
    purpose: 'subtle',
  },
  parameters: {
    docs: {
      description: {
        story: `Een subtle button is een button die niet meteen de aandacht trekt.
Optioneel kan er een hint mee gegeven worden.

- \`hint="positive"\` geeft een positief of successvol resultaat aan. Bijvoorbeeld een creatie actie.
- \`hint="negative"\` geeft een negatief of destructief resultaat aan. Bijvoorbeeld een verwijder actie.
        `,
      },
    },
  },
};

export const DesignSubtleButton: Story = {
  name: 'Design: Subtle Button',
  args: {
    label: 'Subtle Button',
    purpose: 'subtle',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een subtle button is een button die niet meteen de aandacht trekt.
Optioneel kan er een hint mee gegeven worden.

- \`hint="positive"\` geeft een positief of successvol resultaat aan. Bijvoorbeeld een creatie actie.
- \`hint="negative"\` geeft een negatief of destructief resultaat aan. Bijvoorbeeld een verwijder actie.
        `,
      },
    },
    editableTokens: {
      nl: {
        button: {
          subtle: {
            'border-width': {
              $value: '',
            },
            'font-size': {
              $value: '',
            },
            'font-weight': {
              $value: '',
            },
            'line-height': {
              $value: '',
            },
          },
        },
      },
    },
    wizard: buttonWizardStepVariants,
  },
  render: (args: ButtonProps, context: StoryContext<ButtonProps>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { disabled, htmlDisabled, iconEnd, iconOnly, iconStart, label, pressed, toggle, ...rest } = args as any;
    const Button = context.component as ComponentType<ButtonProps>;

    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button
          label={label}
          purpose="subtle"
          disabled={disabled}
          htmlDisabled={htmlDisabled}
          iconStart={iconStart}
          iconEnd={iconEnd}
          iconOnly={iconOnly}
          pressed={pressed}
          toggle={toggle}
          {...rest}
        />
        <Button
          label={`${label} (positive)`}
          purpose="subtle"
          hint="positive"
          disabled={disabled}
          htmlDisabled={htmlDisabled}
          iconStart={iconStart}
          iconEnd={iconEnd}
          iconOnly={iconOnly}
          pressed={pressed}
          toggle={toggle}
          {...rest}
        />
        <Button
          label={`${label} (negative)`}
          purpose="subtle"
          hint="negative"
          disabled={disabled}
          htmlDisabled={htmlDisabled}
          iconStart={iconStart}
          iconEnd={iconEnd}
          iconOnly={iconOnly}
          pressed={pressed}
          toggle={toggle}
          {...rest}
        />
      </div>
    );
  },
};

export const DesignFocusButton: Story = {
  name: 'Design: Focus Visible Button',
  args: {
    label: 'Klik mij!',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `...`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          focus: {
            'background-color': {
              $value: '',
            },
            'border-color': {
              $value: '',
            },
            color: {
              $value: '',
            },
          },
          'outline-offset': {
            $value: '',
          },
        },
      },
    },
    wizard: buttonWizardStepBasic,
  },
  render: RenderButtonFocusVisible,
};

export const DisabledButton: Story = {
  name: 'Disabled Button',
  args: {
    disabled: true,
    label: 'Klik mij!',
  },
  parameters: {
    docs: {
      description: {
        story: `Een button die (tijdelijk) niet bruikbaar is. Hoewel dit patroon vaak gebruikt wordt, kan het verwarrend zijn voor gebruikers.

Om de button focusbaar te houden voor screenreaders, wordt er \`aria-disabled="true"\` op de button geplaatst om aan te geven dat deze disabled is.
Dat betekend dat de \`onClick\` handlers blijven werken, en dat de developer verantwoordelijk is om een melding te geven waarom de button disabled is.
De styling komt van de \`.nl-button--disabled\` class.
`,
      },
    },
  },
};

export const DesignDisabledButton: Story = {
  name: 'Design: Disabled Button',
  args: {
    disabled: true,
    label: 'Klik mij!',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `...`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          default: {
            disabled: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepDisabled,
  },
  render: RenderButtonDisabled,
};

export const DesignPrimaryDisabledButton: Story = {
  name: 'Design: Primary Disabled Button',
  args: {
    disabled: true,
    label: 'Ingedrukt',
    purpose: 'primary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte Primary Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          primary: {
            disabled: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },

    wizard: buttonWizardStepDisabled,
  },
  render: RenderButtonDisabled,
};

export const DesignSecondaryDisabledButton: Story = {
  name: 'Design: Secondary Disabled Button',
  args: {
    disabled: true,
    label: 'Ingedrukt',
    purpose: 'secondary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte Secondary Button`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          secondary: {
            disabled: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },

    wizard: buttonWizardStepDisabled,
  },
  render: RenderButtonDisabled,
};

export const DesignSubtleDisabledButton: Story = {
  name: 'Design: Subtle Disabled Button',
  args: {
    disabled: true,
    label: 'Ingedrukt',
    purpose: 'subtle',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte Subtle Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          subtle: {
            disabled: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },

    wizard: buttonWizardStepDisabled,
  },
  render: RenderButtonDisabled,
};

export const AlleenEenIcon: Story = {
  name: 'Alleen een icon',
  args: {
    iconOnly: true,
    iconStart: <Icon />,
    label: 'Klik mij!',
  },
  parameters: {
    docs: {
      description: {
        story: `Een button met alleen een icon. Het label is niet zichtbaar, maar wel aanwezig voor toegankelijkheid.`,
      },
    },
  },
};

export const DesignAlleenEenIcon: Story = {
  name: 'Design: Alleen een icon',
  args: {
    iconOnly: true,
    iconStart: <Icon />,
    label: 'Klik mij!',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een button met alleen een icon. Als de icon niet in het midden staat, dan moet je mogelijk een kleinere padding kiezen.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          icon: {
            size: {
              $value: '',
            },
          },
          'icon-only': {
            'padding-block-end': {
              $value: '',
            },
            'padding-block-start': {
              $value: '',
            },
            'padding-inline-end': {
              $value: '',
            },
            'padding-inline-start': {
              $value: '',
            },
          },
        },
      },
    },
    wizard: buttonWizardStepBasic,
  },
  render: () => (
    // TODO: Use Action Group
    <div style={{ columnGap: '1ch', display: 'flex', flexDirection: 'row' }}>
      <ButtonComponent iconOnly iconStart={<Icon />} />
      <ButtonComponent iconOnly iconStart={<Icon />} purpose="primary" />
      <ButtonComponent iconOnly iconStart={<Icon />} purpose="secondary" />
      <ButtonComponent iconOnly iconStart={<Icon />} purpose="subtle" />
      <ButtonComponent iconOnly iconStart={<span className="nl-icon">❤️</span>} />
      <ButtonComponent iconOnly iconStart={<span className="nl-icon">❤️</span>} purpose="primary" />
      <ButtonComponent iconOnly iconStart={<span className="nl-icon">❤️</span>} purpose="secondary" />
      <ButtonComponent iconOnly iconStart={<span className="nl-icon">❤️</span>} purpose="subtle" />
    </div>
  ),
};

export const IconVoorHetLabel: Story = {
  name: 'Icon voor het label',
  args: {
    iconStart: <Icon />,
    label: 'Klik mij!',
  },
  parameters: {
    docs: {
      description: {
        story: `Een button met een icon voor het label`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          'column-gap': {
            $value: '',
          },
          icon: {
            size: {
              $value: '',
            },
          },
        },
      },
    },
  },
};

export const IconAchterHetLabel: Story = {
  name: 'Icon achter het label',
  args: {
    iconEnd: <Icon />,
    label: 'Klik mij!',
  },
  parameters: {
    docs: {
      description: {
        story: `Een button met een icon achter het label`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          'column-gap': {
            $value: '',
          },
          icon: {
            size: {
              $value: '',
            },
          },
        },
      },
    },
  },
};

export const GeformatteerdLabel: Story = {
  name: 'Geformatteerd label',
  args: {
    label: (
      <>
        Dit is een <em>button</em> met een <u>geformatteerd</u> label
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Het label van de button bevat HTML elementen',
      },
    },
  },
};

export const GeformatteerdLabelEnEenIcon: Story = {
  name: 'Geformatteerd label en een Icon',
  args: {
    iconStart: <Icon />,
    label: (
      <>
        Met icon en <u>geformatteerd</u> label
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Het label van de button bevat HTML elementen én een icon. De inhoud van de button wordt geplaatst in een element om gaten tussen de HTML elementen te voorkomen',
      },
    },
  },
};

export const PressedButton: Story = {
  name: 'Geselecteerde Button',
  args: {
    label: 'Ingedrukt',
    pressed: true,
  },
  parameters: {
    docs: {
      description: {
        story: `Een ingedrukte Button.`,
      },
    },
  },
};

export const DesignPressedButton: Story = {
  name: 'Design: Geselecteerde Button',
  args: {
    label: 'Ingedrukt',
    pressed: true,
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          default: {
            pressed: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepPressed,
  },
  render: RenderButtonPressed,
};

export const DesignPrimaryPressedButton: Story = {
  name: 'Design: Primary Geselecteerde Button',
  args: {
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'primary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte Primary Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          primary: {
            pressed: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },

    wizard: buttonWizardStepPressed,
  },
  render: RenderButtonPressed,
};

export const DesignSecondaryPressedButton: Story = {
  name: 'Design: Secondary Geselecteerde Button',
  args: {
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'secondary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte Secondary Button`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          secondary: {
            pressed: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },

    wizard: buttonWizardStepPressed,
  },
  render: RenderButtonPressed,
};

export const DesignSubtlePressedButton: Story = {
  name: 'Design: Subtle Geselecteerde Button',
  args: {
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'subtle',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte Subtle Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          subtle: {
            pressed: {
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
            },
          },
        },
      },
    },

    wizard: buttonWizardStepPressed,
  },
  render: RenderButtonPressed,
};

export const DesignPrimaryPositiveButton: Story = {
  name: 'Design: Primary Positive Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    purpose: 'primary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte positieve Primary Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          primary: {
            positive: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepPositiveVariants,
  },
};

export const DesignPrimaryNegativeButton: Story = {
  name: 'Design: Primary Negative Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    purpose: 'primary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte negative Primary Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          primary: {
            negative: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepNegativeVariants,
  },
};

export const DesignSecondaryPositiveButton: Story = {
  name: 'Design: Secondary Positive Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    purpose: 'secondary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte positieve Secondary Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          secondary: {
            positive: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepPositiveVariants,
  },
};

export const DesignSecondaryNegativeButton: Story = {
  name: 'Design: Secondary Negative Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    purpose: 'secondary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte negative Secondary Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          secondary: {
            negative: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepNegativeVariants,
  },
};

export const DesignSubtlePositiveButton: Story = {
  name: 'Design: Subtle Positive Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    purpose: 'subtle',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte positieve Subtle Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          subtle: {
            positive: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepPositiveVariants,
  },
};

export const DesignSubtleNegativeButton: Story = {
  name: 'Design: Subtle Negative Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    purpose: 'subtle',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte negative Subtle Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          subtle: {
            negative: {
              active: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
              'background-color': {
                $value: '',
              },
              'border-color': {
                $value: '',
              },
              color: {
                $value: '',
              },
              hover: {
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepNegativeVariants,
  },
};

export const DesignPrimaryPositivePressedButton: Story = {
  name: 'Design: Primary Positive Geselecteerde Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'primary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte positieve Primary Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          primary: {
            positive: {
              pressed: {
                active: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
                hover: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepPositivePressed,
  },
  render: RenderButtonPressed,
};

export const DesignPrimaryNegativePressedButton: Story = {
  name: 'Design: Primary Negative Geselecteerde Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'primary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte negative Primary Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          primary: {
            negative: {
              pressed: {
                active: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
                hover: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepNegativePressed,
  },
  render: RenderButtonPressed,
};

export const DesignSecondaryPositivePressedButton: Story = {
  name: 'Design: Secondary Positive Geselecteerde Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'secondary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte positieve Secondary Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          secondary: {
            positive: {
              pressed: {
                active: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
                hover: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepPositivePressed,
  },
  render: RenderButtonPressed,
};

export const DesignSecondaryNegativePressedButton: Story = {
  name: 'Design: Secondary Negative Geselecteerde Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'secondary',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte negative Secondary Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          secondary: {
            negative: {
              pressed: {
                active: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
                hover: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepNegativePressed,
  },
  render: RenderButtonPressed,
};

export const DesignSubtlePositivePressedButton: Story = {
  name: 'Design: Subtle Positive Geselecteerde Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'subtle',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte positieve Subtle Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          subtle: {
            positive: {
              pressed: {
                active: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
                hover: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepPositivePressed,
  },
  render: RenderButtonPressed,
};

export const DesignSubtleNegativePressedButton: Story = {
  name: 'Design: Subtle Negative Geselecteerde Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'subtle',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een ingedrukte negative Subtle Button.`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          subtle: {
            negative: {
              pressed: {
                active: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
                'background-color': {
                  $value: '',
                },
                'border-color': {
                  $value: '',
                },
                color: {
                  $value: '',
                },
                hover: {
                  'background-color': {
                    $value: '',
                  },
                  'border-color': {
                    $value: '',
                  },
                  color: {
                    $value: '',
                  },
                },
              },
            },
          },
        },
      },
    },
    wizard: buttonWizardStepNegativePressed,
  },
  render: RenderButtonPressed,
};

export const VolleBreedte: Story = {
  name: 'Volle breedte',
  args: {
    iconStart: <Icon />,
    label: 'Ik ben een button met een hele lange tekst',
  },
  parameters: {
    docs: {
      description: {
        story: `De parent van een button kan de breedte van de button bepalen. De button schaalt mee met de beschikbare ruimte.`,
      },
    },

    parameters: {
      docs: {
        description: {
          story: 'Het label van de button bevat HTML elementen',
        },
      },
    },
  },
  render: (args: ButtonProps, context: StoryContext<ButtonProps>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { disabled, htmlDisabled, iconEnd, iconOnly, iconStart, label, pressed, toggle, ...rest } = args as any;
    const Button = context.component as ComponentType<ButtonProps>;

    return (
      <>
        <div style={{ display: 'flex', overflow: 'auto', resize: 'both' }}>
          <Button
            style={{ flex: 1 }}
            label={label}
            disabled={disabled}
            htmlDisabled={htmlDisabled}
            iconStart={iconStart}
            iconEnd={iconEnd}
            iconOnly={iconOnly}
            pressed={pressed}
            toggle={toggle}
            {...rest}
          />
        </div>
        <br />
        <div style={{ display: 'flex', overflow: 'auto', resize: 'both', width: '300px' }}>
          <Button
            style={{ flex: 1 }}
            label={label}
            disabled={disabled}
            htmlDisabled={htmlDisabled}
            iconStart={iconStart}
            iconEnd={iconEnd}
            iconOnly={iconOnly}
            pressed={pressed}
            toggle={toggle}
            {...rest}
          />
        </div>
      </>
    );
  },
};

export const DesignButtonSize: Story = {
  name: 'Design: Button Size',
  args: {
    label: 'Voorbeeld',
  },
  parameters: {
    docs: {
      description: {
        story: `..`,
      },
    },
    editableTokens: {
      nl: {
        button: {
          'default.line-height': { $value: '' },
          'min-block-size': { $value: '' },
          'min-inline-size': { $value: '' },
          'padding-block-end': { $value: '' },
          'padding-block-start': { $value: '' },
          'padding-inline-end': { $value: '' },
          'padding-inline-start': { $value: '' },
        },
      },
    },
  },
};

export const HTMLButton: Story = {
  name: 'HTML Button',
  args: {
    label: 'Klik mij!',
  },
  parameters: {
    docs: {
      description: {
        story: 'Een `<button>` element gestyled als een Button',
      },
    },
  },
  render: (args: ButtonProps) => {
    const { children, label, ...rest } = args;
    return <button {...rest}>{children || label}</button>;
  },
};

/*
export const HTMLInputButton: Story = {
  name: 'HTML Input Button',
  args: {
    label: 'Klik mij!',
    children: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Een `<input>` element gestyled als een Button',
      },
    },
  },
  render: (args: ButtonProps) => {
    const { label, ...rest } = args;
    return <input type="button" {...rest} value={label} />;
  },
};
*/
