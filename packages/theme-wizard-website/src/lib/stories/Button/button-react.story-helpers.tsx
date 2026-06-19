import type { StoryObj } from '@storybook/react-vite';
import { Button as ButtonComponent, type ButtonProps } from '@nl-design-system-candidate/button-react';
import { type PresetOption, type WizardStep } from '../story-helpers';

export type ButtonStory = StoryObj<ButtonProps>;
export type ButtonPurpose = 'default' | 'primary' | 'secondary' | 'subtle';
export type ButtonHint = 'negative' | 'positive';
export type ButtonStateGroup = 'disabled' | 'pressed';
export type ButtonVariantMode = 'filled' | 'outlined' | 'subtle';
export type VariantPurpose = Exclude<ButtonPurpose, 'default'>;
export type ButtonPresetPurpose = 'default' | 'primary' | 'secondary';
export type ButtonStoryArgs = ButtonStory['args'];
export type ButtonVariantStoryArgs = ButtonStoryArgs & {
  purpose?: ButtonPresetPurpose;
};
export type VariantStoryArgs = ButtonStoryArgs & { label: string; purpose: VariantPurpose };

export type ButtonPresetOptionConfig = {
  description: string;
  family: string;
  filledBorderTransparent?: boolean;
  mode: ButtonVariantMode;
  name: 'Gevuld' | 'Outlined' | 'Subtle';
};

export type ButtonStyleSuggestionConfig = {
  default: Omit<ButtonPresetOptionConfig, 'description' | 'name'>;
  primary: Omit<ButtonPresetOptionConfig, 'description' | 'name'>;
  secondary: Omit<ButtonPresetOptionConfig, 'description' | 'name'>;
};

type ButtonPresetOption = PresetOption<unknown> & {
  description?: string;
};

type ButtonPresetGroup = {
  description?: string;
  name: string;
  options: ButtonPresetOption[];
  question?: string;
  thumbnail?: boolean;
};

export const buttonWizardStepBasic: WizardStep = { order: 6 };
export const buttonWizardStepStates: WizardStep = { order: 7 };
export const buttonWizardStepPositiveStates: WizardStep = { order: 8 };
export const buttonWizardStepNegativeStates: WizardStep = { order: 9 };
export const buttonWizardStepVariants: WizardStep = { order: 10 };
export const buttonWizardStepPositiveVariants: WizardStep = { order: 11 };
export const buttonWizardStepNegativeVariants: WizardStep = { order: 12 };
export const buttonWizardStepDisabled: WizardStep = { order: 13 };
export const buttonWizardStepPressed: WizardStep = { order: 14 };
export const buttonWizardStepPositivePressed: WizardStep = { order: 15 };
export const buttonWizardStepNegativePressed: WizardStep = { order: 16 };

export const defaultButtonVariantOptions: ButtonPresetOptionConfig[] = [
  {
    name: 'Outlined',
    description: 'De standaard button heeft alleen een lijn en geen vulling.',
    family: 'basis.color.default',
    mode: 'outlined',
  },
  {
    name: 'Subtle',
    description: 'De standaard button toont vooral tekst, met alleen een zachte hover- en active-staat.',
    family: 'basis.color.default',
    mode: 'subtle',
  },
];

export const primaryButtonVariantOptions: ButtonPresetOptionConfig[] = [
  {
    name: 'Outlined',
    description: 'De primary button krijgt een accentkleurige lijn en transparante achtergrond.',
    family: 'basis.color.action-1',
    mode: 'outlined',
  },
  {
    name: 'Subtle',
    description: 'De primary button toont vooral tekstkleur met een zachte achtergrond bij interactie.',
    family: 'basis.color.action-1',
    mode: 'subtle',
  },
];

export const secondaryButtonVariantOptions: ButtonPresetOptionConfig[] = [
  {
    name: 'Outlined',
    description: 'De secondary button krijgt een duidelijke lijn en transparante achtergrond.',
    family: 'basis.color.action-1',
    mode: 'outlined',
  },
  {
    name: 'Subtle',
    description: 'De secondary button toont vooral tekstkleur met een zachte hover-achtergrond.',
    family: 'basis.color.action-1',
    mode: 'subtle',
  },
];

const transparentToken = '{basis.color.transparent}';

export const tokenValue = (value = '') => ({ $value: value });

const tokenRef = (path: string) => `{${path}}`;

const createHintedVariantProps = (baseProps: ButtonProps, hint: ButtonHint, label: string): ButtonProps =>
  ({
    ...baseProps,
    hint,
    label,
  }) as ButtonProps;

export const createStateTokenFields = () => ({
  active: {
    'background-color': tokenValue(),
    'border-color': tokenValue(),
    color: tokenValue(),
  },
  'background-color': tokenValue(),
  'border-color': tokenValue(),
  color: tokenValue(),
  hover: {
    'background-color': tokenValue(),
    'border-color': tokenValue(),
    color: tokenValue(),
  },
});

export const createDisabledTokenFields = () => ({
  'background-color': tokenValue(),
  'border-color': tokenValue(),
  color: tokenValue(),
});

export const createButtonTokenTree = (
  purpose: ButtonPurpose,
  tokenFields: ReturnType<typeof createDisabledTokenFields> | ReturnType<typeof createStateTokenFields>,
  hint?: ButtonHint,
  stateGroup?: ButtonStateGroup,
) => {
  if (hint && stateGroup) {
    return {
      nl: {
        button: {
          [purpose]: {
            [hint]: {
              [stateGroup]: tokenFields,
            },
          },
        },
      },
    };
  }

  if (stateGroup) {
    return {
      nl: {
        button: {
          [purpose]: {
            [stateGroup]: tokenFields,
          },
        },
      },
    };
  }

  if (hint) {
    return {
      nl: {
        button: {
          [purpose]: {
            [hint]: tokenFields,
          },
        },
      },
    };
  }

  return {
    nl: {
      button: {
        [purpose]: tokenFields,
      },
    },
  };
};

export const createAdvancedStory = ({
  name,
  args,
  description,
  editableTokens,
  render,
  wizard,
}: {
  args: ButtonStoryArgs;
  description: string;
  editableTokens: unknown;
  name: string;
  render?: ButtonStory['render'];
  wizard?: WizardStep;
}): ButtonStory =>
  ({
    name,
    args,
    parameters: {
      designStory: true,
      docs: {
        description: {
          story: description,
        },
      },
      editableTokens,
      ...(wizard ? { wizard: { ...wizard, type: 'advanced' as const } } : {}),
    },
    ...(render ? { render } : {}),
  }) as ButtonStory;

export const createStateStory = ({
  name,
  args,
  description,
  hint,
  purpose = 'default',
  render,
  wizard,
}: {
  args: ButtonStoryArgs;
  description: string;
  hint?: ButtonHint;
  name: string;
  purpose?: ButtonPurpose;
  render: ButtonStory['render'];
  wizard: WizardStep;
}) =>
  createAdvancedStory({
    name,
    args,
    description,
    editableTokens: createButtonTokenTree(purpose, createStateTokenFields(), hint),
    render,
    wizard,
  });

export const createDisabledStory = ({
  name,
  args,
  description,
  purpose,
  render,
  wizard,
}: {
  args: ButtonStoryArgs;
  description: string;
  name: string;
  purpose: ButtonPurpose;
  render: ButtonStory['render'];
  wizard: WizardStep;
}) =>
  createAdvancedStory({
    name,
    args,
    description,
    editableTokens: createButtonTokenTree(purpose, createDisabledTokenFields(), undefined, 'disabled'),
    render,
    wizard,
  });

export const createPressedStory = ({
  name,
  args,
  description,
  hint,
  purpose,
  render,
  wizard,
}: {
  args: ButtonStoryArgs;
  description: string;
  hint?: ButtonHint;
  name: string;
  purpose: ButtonPurpose;
  render: ButtonStory['render'];
  wizard: WizardStep;
}) =>
  createAdvancedStory({
    name,
    args,
    description,
    editableTokens: createButtonTokenTree(purpose, createStateTokenFields(), hint, 'pressed'),
    render,
    wizard,
  });

export const createVariantEditableTokens = (purpose: VariantPurpose) => ({
  nl: {
    button: {
      [purpose]: {
        'border-width': tokenValue(),
        'font-size': tokenValue(),
        'font-weight': tokenValue(),
        'line-height': tokenValue(),
      },
    },
  },
});

export const renderVariantShowcase = (args: VariantStoryArgs) => {
  const { disabled, htmlDisabled, iconEnd, iconOnly, iconStart, label, pressed, purpose, toggle, ...rest } = args;
  const variantLabel = label ?? 'Button';
  const variantPurpose = purpose ?? 'primary';
  const baseProps = {
    ...rest,
    disabled,
    htmlDisabled,
    iconEnd,
    iconOnly,
    iconStart,
    label: variantLabel,
    pressed,
    purpose: variantPurpose,
    toggle,
  } as ButtonProps;
  const positiveProps = createHintedVariantProps(baseProps, 'positive', `${variantLabel} (positive)`);
  const negativeProps = createHintedVariantProps(baseProps, 'negative', `${variantLabel} (negative)`);

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <ButtonComponent {...baseProps} />
      <ButtonComponent {...positiveProps} />
      <ButtonComponent {...negativeProps} />
    </div>
  );
};

export const createVariantStory = ({
  name,
  args,
  description,
  purpose,
  render,
  wizard,
}: {
  args: VariantStoryArgs;
  description: string;
  name: string;
  purpose: VariantPurpose;
  render: (args: VariantStoryArgs) => JSX.Element;
  wizard: WizardStep;
}) =>
  createAdvancedStory({
    name,
    args,
    description,
    editableTokens: createVariantEditableTokens(purpose),
    render: render as ButtonStory['render'],
    wizard,
  });

const createVariantStateTokens = ({
  family,
  filledBorderTransparent = false,
  mode,
}: Omit<ButtonPresetOptionConfig, 'description' | 'name'>) => {
  const useTransparentBorder = mode === 'subtle' || (mode === 'filled' && filledBorderTransparent);
  const defaultBorderColor = useTransparentBorder ? transparentToken : tokenRef(`${family}.border-default`);
  const hoverBorderColor = mode === 'subtle' ? transparentToken : tokenRef(`${family}.border-hover`);
  const activeBorderColor = useTransparentBorder ? transparentToken : tokenRef(`${family}.border-active`);

  return {
    active: {
      'background-color': tokenValue(tokenRef(`${family}.bg-active`)),
      'border-color': tokenValue(activeBorderColor),
      color: tokenValue(tokenRef(`${family}.color-active`)),
    },
    'background-color': tokenValue(mode === 'filled' ? tokenRef(`${family}.bg-default`) : transparentToken),
    'border-color': tokenValue(defaultBorderColor),
    color: tokenValue(tokenRef(`${family}.color-default`)),
    hover: {
      'background-color': tokenValue(tokenRef(`${family}.bg-hover`)),
      'border-color': tokenValue(hoverBorderColor),
      color: tokenValue(tokenRef(`${family}.color-hover`)),
    },
  };
};

export const createButtonPurposeTokens = (
  purpose: ButtonPresetPurpose,
  config: Omit<ButtonPresetOptionConfig, 'description' | 'name'>,
) => ({
  nl: {
    button: {
      [purpose]: createVariantStateTokens(config),
    },
  },
});

export const createButtonVariantOption = (purpose: ButtonPresetPurpose, config: ButtonPresetOptionConfig) => ({
  name: config.name,
  description: config.description,
  tokens: createButtonPurposeTokens(purpose, config),
});

export const createButtonPresetStory = ({
  name,
  args,
  cardPreviewStoryIds,
  flowGroup,
  flowTitle,
  order,
  presets,
  previewStoryIds,
  render,
}: {
  args: ButtonStoryArgs;
  cardPreviewStoryIds?: string[];
  flowGroup?: string;
  flowTitle?: string;
  name: string;
  order: number;
  previewStoryIds: string[];
  presets: ButtonPresetGroup[];
  render: ButtonStory['render'];
}): ButtonStory =>
  ({
    name,
    args,
    parameters: {
      presets,
      wizard: {
        ...(cardPreviewStoryIds ? { cardPreviewStoryIds } : {}),
        ...(flowGroup ? { flowGroup } : {}),
        ...(flowTitle ? { flowTitle } : {}),
        order,
        previewStoryIds,
        type: 'preset',
      },
    },
    render,
  }) as ButtonStory;

export const createButtonStyleSuggestionOption = ({
  config,
  description,
  name,
}: {
  config: ButtonStyleSuggestionConfig;
  description: string;
  name: string;
}) => ({
  name,
  description,
  tokens: {
    nl: {
      button: {
        ...createButtonPurposeTokens('default', config.default).nl.button,
        ...createButtonPurposeTokens('primary', config.primary).nl.button,
        ...createButtonPurposeTokens('secondary', config.secondary).nl.button,
      },
    },
  },
});
