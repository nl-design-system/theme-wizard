import type { StoryObj } from '@storybook/react-vite';
import { Button as ButtonComponent, type ButtonProps } from '@nl-design-system-candidate/button-react';
import {
  ButtonVariants,
  Icon,
  RenderButtonDisabled,
  RenderButtonFocusVisible,
  RenderButtonPressed,
  RenderButtonStates,
} from './button-react.story-components';
import {
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
  createAdvancedStory,
  createDisabledStory,
  createPressedStory,
  createStateStory,
  createVariantStory,
  renderVariantShowcase,
  tokenValue,
} from './button-react.story-helpers';

type Story = StoryObj<ButtonProps>;

export const AdvancedButtonBorders: Story = createAdvancedStory({
  name: 'Advanced: Button Borders',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  description: `Er is 1 instelling voor de border-radius van alle soorten buttons.`,
  editableTokens: {
    nl: {
      button: {
        'border-radius': tokenValue(),
        default: {
          'border-width': tokenValue(),
        },
        primary: {
          'border-width': tokenValue(),
        },
        secondary: {
          'border-width': tokenValue(),
        },
        subtle: {
          'border-width': tokenValue(),
        },
      },
    },
  },
  render: ButtonVariants,
  wizard: buttonWizardStepBasic,
});

export const AdvancedButtonTypography: Story = createAdvancedStory({
  name: 'Advanced: Button Typography',
  args: {
    iconStart: '❤️',
    label: 'Klik mij!',
  },
  description: `Buttons op 'n rijtje.`,
  editableTokens: {
    nl: {
      button: {
        default: {
          'font-size': tokenValue(),
          'font-weight': tokenValue(),
          'line-height': tokenValue(),
        },
        'font-family': tokenValue(),
        primary: {
          'font-size': tokenValue(),
          'font-weight': tokenValue(),
          'line-height': tokenValue(),
        },
        secondary: {
          'font-size': tokenValue(),
          'font-weight': tokenValue(),
          'line-height': tokenValue(),
        },
        subtle: {
          'font-size': tokenValue(),
          'font-weight': tokenValue(),
          'line-height': tokenValue(),
        },
      },
    },
  },
  render: ButtonVariants,
  wizard: buttonWizardStepBasic,
});

export const AdvancedButtonStates = createStateStory({
  name: 'Advanced: Button States',
  args: {
    label: 'Klik mij!',
  },
  description: `Een standaard Button, met hover en active states.`,
  render: RenderButtonStates,
  wizard: buttonWizardStepStates,
});

export const AdvancedPrimaryButtonStates = createStateStory({
  name: 'Advanced: Button States',
  args: {
    label: 'Klik mij!',
    purpose: 'primary',
  },
  description: `Een Primary Button, met hover en active states.`,
  purpose: 'primary',
  render: RenderButtonStates,
  wizard: buttonWizardStepStates,
});

export const AdvancedSecondaryButtonStates = createStateStory({
  name: 'Advanced: Secondary Button States',
  args: {
    label: 'Klik mij!',
    purpose: 'secondary',
  },
  description: `Een Secondary Button, met hover en active states.`,
  purpose: 'secondary',
  render: RenderButtonStates,
  wizard: buttonWizardStepStates,
});

export const AdvancedSubtleButtonStates = createStateStory({
  name: 'Advanced: Subtle Button States',
  args: {
    label: 'Klik mij!',
    purpose: 'subtle',
  },
  description: `Een Subtle Button, met hover en active states.`,
  purpose: 'subtle',
  render: RenderButtonStates,
  wizard: buttonWizardStepStates,
});

export const AdvancedPrimaryPositiveButtonStates = createStateStory({
  name: 'Advanced: Primary Positive Button States',
  args: {
    hint: 'positive',
    label: 'Klik mij!',
    purpose: 'primary',
  },
  description: `Een Primary Positive Button, met hover en active states.`,
  hint: 'positive',
  purpose: 'primary',
  render: RenderButtonStates,
  wizard: buttonWizardStepPositiveStates,
});

export const AdvancedSecondaryPositiveButtonStates = createStateStory({
  name: 'Advanced: Secondary Positive Button States',
  args: {
    hint: 'positive',
    label: 'Klik mij!',
    purpose: 'secondary',
  },
  description: `Een Secondary Positive Button, met hover en active states.`,
  hint: 'positive',
  purpose: 'secondary',
  render: RenderButtonStates,
  wizard: buttonWizardStepPositiveStates,
});

export const AdvancedSubtlePositiveButtonStates = createStateStory({
  name: 'Advanced: Subtle Positive Button States',
  args: {
    hint: 'positive',
    label: 'Klik mij!',
    purpose: 'subtle',
  },
  description: `Een Subtle Positive Button, met hover en active states.`,
  hint: 'positive',
  purpose: 'subtle',
  render: RenderButtonStates,
  wizard: buttonWizardStepPositiveStates,
});

export const AdvancedPrimaryNegativeButtonStates = createStateStory({
  name: 'Advanced: Primary Negative Button States',
  args: {
    hint: 'negative',
    label: 'Klik mij!',
    purpose: 'primary',
  },
  description: `Een Primary Negative Button, met hover en active states.`,
  hint: 'negative',
  purpose: 'primary',
  render: RenderButtonStates,
  wizard: buttonWizardStepNegativeStates,
});

export const AdvancedSecondaryNegativeButtonStates = createStateStory({
  name: 'Advanced: Secondary Negative Button States',
  args: {
    hint: 'negative',
    label: 'Klik mij!',
    purpose: 'secondary',
  },
  description: `Een Secondary Negative Button, met hover en active states.`,
  hint: 'negative',
  purpose: 'secondary',
  render: RenderButtonStates,
  wizard: buttonWizardStepNegativeStates,
});

export const AdvancedSubtleNegativeButtonStates = createStateStory({
  name: 'Advanced: Subtle Negative Button States',
  args: {
    hint: 'negative',
    label: 'Klik mij!',
    purpose: 'subtle',
  },
  description: `Een Subtle Negative Button, met hover en active states.`,
  hint: 'negative',
  purpose: 'subtle',
  render: RenderButtonStates,
  wizard: buttonWizardStepNegativeStates,
});

export const AdvancedPrimaryButton = createVariantStory({
  name: 'Advanced: Primary Button',
  args: {
    label: 'Primary Button',
    purpose: 'primary',
  },
  description: `... `,
  purpose: 'primary',
  render: renderVariantShowcase,
  wizard: buttonWizardStepVariants,
});

export const AdvancedSecondaryButton = createVariantStory({
  name: 'Advanced: Secondary Button',
  args: {
    label: 'Secondary Button',
    purpose: 'secondary',
  },
  description: `Button die een secondare actie aanduid. De secondaire actie wordt gebruikt als alternatief voor de primaire actie.
Optioneel kan er een hint mee gegeven worden.

- \`hint="positive"\` geeft een positief of successvol resultaat aan. Bijvoorbeeld een creatie actie.
- \`hint="negative"\` geeft een negatief of destructief resultaat aan. Bijvoorbeeld een verwijder actie.
        `,
  purpose: 'secondary',
  render: renderVariantShowcase,
  wizard: buttonWizardStepVariants,
});

export const AdvancedSubtleButton = createVariantStory({
  name: 'Advanced: Subtle Button',
  args: {
    label: 'Subtle Button',
    purpose: 'subtle',
  },
  description: `Een subtle button is een button die niet meteen de aandacht trekt.
Optioneel kan er een hint mee gegeven worden.

- \`hint="positive"\` geeft een positief of successvol resultaat aan. Bijvoorbeeld een creatie actie.
- \`hint="negative"\` geeft een negatief of destructief resultaat aan. Bijvoorbeeld een verwijder actie.
        `,
  purpose: 'subtle',
  render: renderVariantShowcase,
  wizard: buttonWizardStepVariants,
});

export const AdvancedFocusButton: Story = createAdvancedStory({
  name: 'Advanced: Focus Visible Button',
  args: {
    label: 'Klik mij!',
  },
  description: `...`,
  editableTokens: {
    nl: {
      button: {
        focus: {
          'background-color': tokenValue(),
          'border-color': tokenValue(),
          color: tokenValue(),
        },
        'outline-offset': tokenValue(),
      },
    },
  },
  render: RenderButtonFocusVisible,
  wizard: buttonWizardStepBasic,
});

export const AdvancedDisabledButton = createDisabledStory({
  name: 'Advanced: Disabled Button',
  args: {
    disabled: true,
    label: 'Klik mij!',
  },
  description: `...`,
  purpose: 'default',
  render: RenderButtonDisabled,
  wizard: buttonWizardStepDisabled,
});

export const AdvancedPrimaryDisabledButton = createDisabledStory({
  name: 'Advanced: Primary Disabled Button',
  args: {
    disabled: true,
    label: 'Ingedrukt',
    purpose: 'primary',
  },
  description: `Een ingedrukte Primary Button.`,
  purpose: 'primary',
  render: RenderButtonDisabled,
  wizard: buttonWizardStepDisabled,
});

export const AdvancedSecondaryDisabledButton = createDisabledStory({
  name: 'Advanced: Secondary Disabled Button',
  args: {
    disabled: true,
    label: 'Ingedrukt',
    purpose: 'secondary',
  },
  description: `Een ingedrukte Secondary Button`,
  purpose: 'secondary',
  render: RenderButtonDisabled,
  wizard: buttonWizardStepDisabled,
});

export const AdvancedSubtleDisabledButton = createDisabledStory({
  name: 'Advanced: Subtle Disabled Button',
  args: {
    disabled: true,
    label: 'Ingedrukt',
    purpose: 'subtle',
  },
  description: `Een ingedrukte Subtle Button.`,
  purpose: 'subtle',
  render: RenderButtonDisabled,
  wizard: buttonWizardStepDisabled,
});

export const AdvancedAlleenEenIcon: Story = createAdvancedStory({
  name: 'Advanced: Alleen een icon',
  args: {
    iconOnly: true,
    iconStart: <Icon />,
    label: 'Klik mij!',
  },
  description: `Een button met alleen een icon. Als de icon niet in het midden staat, dan moet je mogelijk een kleinere padding kiezen.`,
  editableTokens: {
    nl: {
      button: {
        icon: {
          size: tokenValue(),
        },
        'icon-only': {
          'padding-block-end': tokenValue(),
          'padding-block-start': tokenValue(),
          'padding-inline-end': tokenValue(),
          'padding-inline-start': tokenValue(),
        },
      },
    },
  },
  render: () => (
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
  wizard: buttonWizardStepBasic,
});

export const AdvancedPressedButton = createPressedStory({
  name: 'Advanced: Geselecteerde Button',
  args: {
    label: 'Ingedrukt',
    pressed: true,
  },
  description: `Een ingedrukte Button.`,
  purpose: 'default',
  render: RenderButtonPressed,
  wizard: buttonWizardStepPressed,
});

export const AdvancedPrimaryPressedButton = createPressedStory({
  name: 'Advanced: Primary Geselecteerde Button',
  args: {
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'primary',
  },
  description: `Een ingedrukte Primary Button.`,
  purpose: 'primary',
  render: RenderButtonPressed,
  wizard: buttonWizardStepPressed,
});

export const AdvancedSecondaryPressedButton = createPressedStory({
  name: 'Advanced: Secondary Geselecteerde Button',
  args: {
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'secondary',
  },
  description: `Een ingedrukte Secondary Button`,
  purpose: 'secondary',
  render: RenderButtonPressed,
  wizard: buttonWizardStepPressed,
});

export const AdvancedSubtlePressedButton = createPressedStory({
  name: 'Advanced: Subtle Geselecteerde Button',
  args: {
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'subtle',
  },
  description: `Een ingedrukte Subtle Button.`,
  purpose: 'subtle',
  render: RenderButtonPressed,
  wizard: buttonWizardStepPressed,
});

export const AdvancedPrimaryPositiveButton = createStateStory({
  name: 'Advanced: Primary Positive Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    purpose: 'primary',
  },
  description: `Een ingedrukte positieve Primary Button.`,
  hint: 'positive',
  purpose: 'primary',
  render: RenderButtonStates,
  wizard: buttonWizardStepPositiveVariants,
});

export const AdvancedPrimaryNegativeButton = createStateStory({
  name: 'Advanced: Primary Negative Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    purpose: 'primary',
  },
  description: `Een ingedrukte negative Primary Button.`,
  hint: 'negative',
  purpose: 'primary',
  render: RenderButtonStates,
  wizard: buttonWizardStepNegativeVariants,
});

export const AdvancedSecondaryPositiveButton = createStateStory({
  name: 'Advanced: Secondary Positive Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    purpose: 'secondary',
  },
  description: `Een ingedrukte positieve Secondary Button.`,
  hint: 'positive',
  purpose: 'secondary',
  render: RenderButtonStates,
  wizard: buttonWizardStepPositiveVariants,
});

export const AdvancedSecondaryNegativeButton = createStateStory({
  name: 'Advanced: Secondary Negative Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    purpose: 'secondary',
  },
  description: `Een ingedrukte negative Secondary Button.`,
  hint: 'negative',
  purpose: 'secondary',
  render: RenderButtonStates,
  wizard: buttonWizardStepNegativeVariants,
});

export const AdvancedSubtlePositiveButton = createStateStory({
  name: 'Advanced: Subtle Positive Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    purpose: 'subtle',
  },
  description: `Een ingedrukte positieve Subtle Button.`,
  hint: 'positive',
  purpose: 'subtle',
  render: RenderButtonStates,
  wizard: buttonWizardStepPositiveVariants,
});

export const AdvancedSubtleNegativeButton = createStateStory({
  name: 'Advanced: Subtle Negative Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    purpose: 'subtle',
  },
  description: `Een ingedrukte negative Subtle Button.`,
  hint: 'negative',
  purpose: 'subtle',
  render: RenderButtonStates,
  wizard: buttonWizardStepNegativeVariants,
});

export const AdvancedPrimaryPositivePressedButton = createPressedStory({
  name: 'Advanced: Primary Positive Geselecteerde Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'primary',
  },
  description: `Een ingedrukte positieve Primary Button.`,
  hint: 'positive',
  purpose: 'primary',
  render: RenderButtonPressed,
  wizard: buttonWizardStepPositivePressed,
});

export const AdvancedPrimaryNegativePressedButton = createPressedStory({
  name: 'Advanced: Primary Negative Geselecteerde Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'primary',
  },
  description: `Een ingedrukte negative Primary Button.`,
  hint: 'negative',
  purpose: 'primary',
  render: RenderButtonPressed,
  wizard: buttonWizardStepNegativePressed,
});

export const AdvancedSecondaryPositivePressedButton = createPressedStory({
  name: 'Advanced: Secondary Positive Geselecteerde Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'secondary',
  },
  description: `Een ingedrukte positieve Secondary Button.`,
  hint: 'positive',
  purpose: 'secondary',
  render: RenderButtonPressed,
  wizard: buttonWizardStepPositivePressed,
});

export const AdvancedSecondaryNegativePressedButton = createPressedStory({
  name: 'Advanced: Secondary Negative Geselecteerde Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'secondary',
  },
  description: `Een ingedrukte negative Secondary Button.`,
  hint: 'negative',
  purpose: 'secondary',
  render: RenderButtonPressed,
  wizard: buttonWizardStepNegativePressed,
});

export const AdvancedSubtlePositivePressedButton = createPressedStory({
  name: 'Advanced: Subtle Positive Geselecteerde Button',
  args: {
    hint: 'positive',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'subtle',
  },
  description: `Een ingedrukte positieve Subtle Button.`,
  hint: 'positive',
  purpose: 'subtle',
  render: RenderButtonPressed,
  wizard: buttonWizardStepPositivePressed,
});

export const AdvancedSubtleNegativePressedButton = createPressedStory({
  name: 'Advanced: Subtle Negative Geselecteerde Button',
  args: {
    hint: 'negative',
    label: 'Ingedrukt',
    pressed: true,
    purpose: 'subtle',
  },
  description: `Een ingedrukte negative Subtle Button.`,
  hint: 'negative',
  purpose: 'subtle',
  render: RenderButtonPressed,
  wizard: buttonWizardStepNegativePressed,
});

export const AdvancedButtonSize: Story = {
  name: 'Advanced: Button Size',
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
