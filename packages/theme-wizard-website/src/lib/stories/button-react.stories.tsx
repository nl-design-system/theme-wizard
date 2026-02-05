import type { Meta, StoryObj, StoryContext } from '@storybook/react-vite';
import buttonCss from '@nl-design-system-candidate/button-css/button.css?inline';
import { Button as ButtonComponent, type ButtonProps } from '@nl-design-system-candidate/button-react';
import tokens from '@nl-design-system-candidate/button-tokens';
import { type ComponentType } from 'react';

const meta = {
  id: 'button',
  component: ButtonComponent,
  parameters: {
    css: buttonCss,
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

const Icon = () => (
  <span className="nl-icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M10 16.5l2 -3l2 3m-2 -3v-2l3 -1m-6 0l3 1" />
      <circle cx="12" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  </span>
);

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
  },
};

export const DesignButton: Story = {
  name: 'Design: Button',
  args: {
    label: 'Klik mij!',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een standaard Button`,
      },
    },
    tokens: {
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
  },
};

const ButtonVariants = ({ ...props }: ButtonProps) => (
  // TODO: Replace with Action Group
  <div style={{ columnGap: '1ch', display: 'flex', flexDirection: 'row' }}>
    <ButtonComponent {...props} iconOnly />
    <ButtonComponent {...props} />
    <ButtonComponent {...props} purpose="primary" iconOnly />
    <ButtonComponent {...props} purpose="primary" />
    <ButtonComponent {...props} purpose="secondary" iconOnly />
    <ButtonComponent {...props} purpose="secondary" />
    <ButtonComponent {...props} purpose="subtle" iconOnly />
    <ButtonComponent {...props} purpose="subtle" />
  </div>
);

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
    tokens: {
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
    tokens: {
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
  },
  render: ButtonVariants,
};

const RenderButtonStates = ({ ...props }: ButtonProps) => (
  <>
    <ButtonComponent {...props} />
    {' → hover → '}
    <ButtonComponent {...props} className="nl-button--hover" />
    {' → active → '}
    <ButtonComponent {...props} className="nl-button--active" />
  </>
);

const RenderButtonDisabled = ({ ...props }: ButtonProps) => (
  <>
    <ButtonComponent {...props} disabled={false} htmlDisabled={undefined} />
    {' → disabled → '}
    <ButtonComponent {...props} disabled htmlDisabled={undefined} />
  </>
);

const RenderButtonPressed = ({ ...props }: ButtonProps) => (
  <>
    <ButtonComponent {...props} pressed={false} />
    {' → pressed → '}
    <ButtonComponent {...props} pressed />
  </>
);

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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
  name: 'Design: Focus Button',
  args: {
    className: 'nl-button--focus-visible',
    label: 'Klik mij!',
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `...`,
      },
    },
    tokens: {
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
  },
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
    tokens: {
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

    tokens: {
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

    tokens: {
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

    tokens: {
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
  argTypes: {
    iconStart: {
      table: {
        disable: false,
      },
    },
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
  argTypes: {
    iconStart: {
      table: {
        disable: false,
      },
    },
  },
  parameters: {
    designStory: true,
    docs: {
      description: {
        story: `Een button met alleen een icon. Als de icon niet in het midden staat, dan moet je mogelijk een kleinere padding kiezen.`,
      },
    },
    tokens: {
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
  argTypes: {
    iconStart: {
      table: {
        disable: false,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: `Een button met een icon voor het label`,
      },
    },
    tokens: {
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
  argTypes: {
    iconEnd: {
      table: {
        disable: false,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: `Een button met een icon achter het label`,
      },
    },
    tokens: {
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
  argTypes: {
    label: {
      table: {
        disable: true,
      },
    },
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
  argTypes: {
    label: {
      table: {
        disable: true,
      },
    },
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
  name: 'Pressed Button',
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
  name: 'Design: Pressed Button',
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
    tokens: {
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
  },
  render: RenderButtonPressed,
};

export const DesignPrimaryPressedButton: Story = {
  name: 'Design: Primary Pressed Button',
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

    tokens: {
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
  },
  render: RenderButtonPressed,
};

export const DesignSecondaryPressedButton: Story = {
  name: 'Design: Secondary Pressed Button',
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

    tokens: {
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
  },
  render: RenderButtonPressed,
};

export const DesignSubtlePressedButton: Story = {
  name: 'Design: Subtle Pressed Button',
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

    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
    tokens: {
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
  },
};

export const DesignPrimaryPositivePressedButton: Story = {
  name: 'Design: Primary Positive Pressed Button',
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
    tokens: {
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
  },
  render: RenderButtonPressed,
};

export const DesignPrimaryNegativePressedButton: Story = {
  name: 'Design: Primary Negative Pressed Button',
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
    tokens: {
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
  },
  render: RenderButtonPressed,
};

export const DesignSecondaryPositivePressedButton: Story = {
  name: 'Design: Secondary Positive Pressed Button',
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
    tokens: {
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
  },
  render: RenderButtonPressed,
};

export const DesignSecondaryNegativePressedButton: Story = {
  name: 'Design: Secondary Negative Pressed Button',
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
    tokens: {
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
  },
  render: RenderButtonPressed,
};

export const DesignSubtlePositivePressedButton: Story = {
  name: 'Design: Subtle Positive Pressed Button',
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
    tokens: {
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
  },
  render: RenderButtonPressed,
};

export const DesignSubtleNegativePressedButton: Story = {
  name: 'Design: Subtle Negative Pressed Button',
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
    tokens: {
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
    tokens: {
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
