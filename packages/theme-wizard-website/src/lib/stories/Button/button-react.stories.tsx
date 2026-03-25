import type { Meta, StoryObj, StoryContext } from '@storybook/react-vite';
import css from '@nl-design-system-candidate/button-css/button.css?inline';
import { Button as ButtonComponent, type ButtonProps } from '@nl-design-system-candidate/button-react';
import tokens from '@nl-design-system-candidate/button-tokens';
import { type ComponentType } from 'react';
import { WizardPreviewSection } from '../story-helpers';
import {
  ButtonVariantsWithStates,
  Icon,
  RenderAllButtonPurposesPreview,
  RenderButtonPurposePreview,
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

export * from './button-react.preset.stories';
export * from './button-react.advanced-stories';

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
  },
};

export const WizardPreview: Story = {
  name: 'Wizard Preview',
  parameters: {
    wizard: {
      preview: true,
    },
  },
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

export const DefaultButtonPurposePreview: Story = {
  name: 'Default Button Purpose Preview',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
    purpose: undefined,
  },
  render: RenderButtonPurposePreview,
};

export const PrimaryButtonPurposePreview: Story = {
  name: 'Primary Button Purpose Preview',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
    purpose: 'primary',
  },
  render: RenderButtonPurposePreview,
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

export const SecondaryButtonPurposePreview: Story = {
  name: 'Secondary Button Purpose Preview',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
    purpose: 'secondary',
  },
  render: RenderButtonPurposePreview,
};

export const AllButtonPurposesPreview: Story = {
  name: 'All Button Purposes Preview',
  render: RenderAllButtonPurposesPreview,
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
