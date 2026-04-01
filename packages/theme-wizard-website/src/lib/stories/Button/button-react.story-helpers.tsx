import type { StoryObj } from '@storybook/react-vite';
import { Button as ButtonComponent, type ButtonProps } from '@nl-design-system-candidate/button-react';
import { type WizardStep } from '../story-helpers';

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

type ButtonPresetOption = {
  description?: string;
  name: string;
  tokens: unknown;
};

type ButtonPresetGroup = {
  description?: string;
  name: string;
  options: ButtonPresetOption[];
  question?: string;
  thumbnail?: boolean;
};

export const buttonWizardStepBasic: WizardStep = { order: 6, stepTitle: 'Button basis' };
export const buttonWizardStepStates: WizardStep = { order: 7, stepTitle: 'Button states' };
export const buttonWizardStepPositiveStates: WizardStep = { order: 8, stepTitle: 'Positieve button states' };
export const buttonWizardStepNegativeStates: WizardStep = { order: 9, stepTitle: 'Negatieve button states' };
export const buttonWizardStepVariants: WizardStep = { order: 10, stepTitle: 'Button varianten' };
export const buttonWizardStepPositiveVariants: WizardStep = { order: 11, stepTitle: 'Positieve button varianten' };
export const buttonWizardStepNegativeVariants: WizardStep = { order: 12, stepTitle: 'Negatieve button varianten' };
export const buttonWizardStepDisabled: WizardStep = { order: 13, stepTitle: 'Button disabled' };
export const buttonWizardStepPressed: WizardStep = { order: 14, stepTitle: 'Button pressed' };
export const buttonWizardStepPositivePressed: WizardStep = { order: 15, stepTitle: 'Positieve button pressed' };
export const buttonWizardStepNegativePressed: WizardStep = { order: 16, stepTitle: 'Negatieve button pressed' };

export const defaultButtonVariantOptions: ButtonPresetOptionConfig[] = [
  {
    name: 'Gevuld',
    description: 'De standaard button heeft een ingevulde neutrale achtergrond.',
    family: 'basis.color.default',
    mode: 'filled',
  },
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
    name: 'Gevuld',
    description: 'De primary button krijgt een duidelijke ingevulde accentkleur.',
    family: 'basis.color.action-1-inverse',
    filledBorderTransparent: true,
    mode: 'filled',
  },
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
    name: 'Gevuld',
    description: 'De secondary button krijgt een lichte ingevulde stijl.',
    family: 'basis.color.action-1',
    filledBorderTransparent: true,
    mode: 'filled',
  },
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

const createButtonPurposeTokens = (
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
  order,
  presets,
  previewStoryIds,
  render,
}: {
  args: ButtonStoryArgs;
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
        order,
        previewStoryIds,
        type: 'preset',
      },
    },
    render,
  }) as ButtonStory;

export const createButtonVariantStory = ({
  name,
  args,
  options,
  order,
  previewStoryId,
  question,
  render,
}: {
  args: ButtonVariantStoryArgs;
  name: string;
  options: ButtonPresetOptionConfig[];
  order: number;
  previewStoryId: string;
  question: string;
  render: ButtonStory['render'];
}): ButtonStory =>
  createButtonPresetStory({
    name,
    args,
    order,
    presets: [
      {
        name: question,
        options: [
          { name: 'Aanbevolen', description: 'Gebruik de standaard uit het startthema.', tokens: null },
          ...options.map((option) => createButtonVariantOption(args.purpose ?? 'default', option)),
        ],
        question,
        thumbnail: false,
      },
    ],
    previewStoryIds: [previewStoryId],
    render,
  });
