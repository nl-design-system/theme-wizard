import type { StoryContext, StoryObj } from '@storybook/react-vite';
import { Button as ButtonComponent, type ButtonProps } from '@nl-design-system-candidate/button-react';
import { type ComponentType } from 'react';
import {
  ButtonVariants,
  Icon,
  RenderButtonDisabled,
  RenderButtonFocusVisible,
  RenderButtonPressed,
  RenderButtonStates,
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

type Story = StoryObj<ButtonProps>;

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
