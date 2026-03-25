import type { StoryObj } from '@storybook/react-vite';
import { Button as ButtonComponent, type ButtonProps } from '@nl-design-system-candidate/button-react';
import type { WizardStep } from '../story-helpers';

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

export const createDesignStory = ({
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
      ...(wizard ? { wizard } : {}),
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
  createDesignStory({
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
  createDesignStory({
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
  createDesignStory({
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
  createDesignStory({
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
  ({
    name,
    args,
    parameters: {
      presets: [
        {
          name: question,
          options: options.map((option) => createButtonVariantOption(args.purpose ?? 'default', option)),
          question,
          thumbnail: false,
        },
      ],
      wizard: {
        order,
        previewStoryIds: [previewStoryId],
      },
    },
    render,
  }) as ButtonStory;
