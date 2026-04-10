import css from '@nl-design-system-candidate/button-css/button.css?inline';
import { Button as ButtonComponent, type ButtonProps } from '@nl-design-system-candidate/button-react';
import { type ReactNode } from 'react';
import { buildForcedPseudoStateStyles, WizardPreviewSection } from '../story-helpers';

export const Icon = () => (
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

export const ButtonPrimary = ({ ...props }: ButtonProps) => <ButtonComponent {...props} purpose="primary" />;

const getButtonStateStyle = (purpose: ButtonProps['purpose'], hint: ButtonProps['hint'], state: 'active' | 'hover') => {
  const variant = purpose ?? 'default';
  const hintSegment = hint ? `-${hint}` : '';
  const cssVarBase = `--nl-button-${variant}${hintSegment}-${state}`;

  return {
    backgroundColor: `var(${cssVarBase}-background-color)`,
    borderColor: `var(${cssVarBase}-border-color)`,
    color: `var(${cssVarBase}-color)`,
  };
};

const isBaseButtonStateSelector = (selector: string) =>
  !selector.includes('--pressed') && !selector.includes('--positive') && !selector.includes('--negative');

const isDefaultButtonHoverSelector = (selector: string) =>
  !selector.includes('--primary') &&
  !selector.includes('--secondary') &&
  !selector.includes('--subtle') &&
  !selector.includes('--pressed');

const isPrimaryButtonHoverSelector = (selector: string) =>
  selector.includes('--primary') && isBaseButtonStateSelector(selector);

const isSecondaryButtonHoverSelector = (selector: string) =>
  selector.includes('--secondary') && isBaseButtonStateSelector(selector);

const buttonHoverStyles = buildForcedPseudoStateStyles(css, {
  'button-default-hover': {
    pseudos: ['hover'],
    selectorFilter: isDefaultButtonHoverSelector,
  },
  'button-primary-hover': {
    pseudos: ['hover'],
    selectorFilter: isPrimaryButtonHoverSelector,
  },
  'button-secondary-hover': {
    pseudos: ['hover'],
    selectorFilter: isSecondaryButtonHoverSelector,
  },
});

export const ButtonVariantsWithStates = ({ ...props }: ButtonProps) => (
  <>
    <style>{buttonHoverStyles}</style>
    <div
      style={{
        alignItems: 'center',
        columnGap: '1rem',
        display: 'grid',
        gridTemplateColumns: 'max-content repeat(3, max-content)',
        rowGap: '0.75rem',
      }}
    >
      <span />
      <strong>Normaal</strong>
      <strong>Hover</strong>
      <strong>Active</strong>

      <strong>Default</strong>
      <ButtonComponent {...props} />
      <ButtonComponent {...props} id="button-default-hover" />
      <ButtonComponent {...props} style={getButtonStateStyle(undefined, undefined, 'active')} />

      <strong>Primary</strong>
      <ButtonComponent {...props} purpose="primary" />
      <ButtonComponent {...props} id="button-primary-hover" purpose="primary" />
      <ButtonComponent {...props} purpose="primary" style={getButtonStateStyle('primary', undefined, 'active')} />

      <strong>Secondary</strong>
      <ButtonComponent {...props} purpose="secondary" />
      <ButtonComponent {...props} id="button-secondary-hover" purpose="secondary" />
      <ButtonComponent {...props} purpose="secondary" style={getButtonStateStyle('secondary', undefined, 'active')} />
    </div>
  </>
);

export const RenderButtonFocusVisible = ({ ...props }: ButtonProps) => (
  <ButtonComponent
    {...props}
    style={{
      backgroundColor: 'var(--nl-button-focus-background-color)',
      borderColor: 'var(--nl-button-focus-border-color)',
      color: 'var(--nl-button-focus-color)',
    }}
  />
);

export const ButtonVariants = ({ ...props }: ButtonProps) => (
  <div style={{ columnGap: '1ch', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', rowGap: '0.5rem' }}>
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

const statePreviewStyle = {
  columnGap: '1rem',
  display: 'flex',
  flexWrap: 'wrap' as const,
  rowGap: '1rem',
};

const statePreviewItemStyle = {
  alignItems: 'flex-start',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
};

const statePreviewLabelStyle = {
  color: 'var(--basis-color-default-color-subtle)',
  fontSize: '0.875rem',
  fontWeight: 700,
};

const statePreviewGridStyle = {
  alignItems: 'center',
  columnGap: '1rem',
  display: 'grid',
  gridTemplateColumns: 'max-content repeat(5, max-content)',
  rowGap: '0.75rem',
};

const StatePreviewItem = ({ children, label }: { children: ReactNode; label: string }) => (
  <div style={statePreviewItemStyle}>
    <span style={statePreviewLabelStyle}>{label}</span>
    {children}
  </div>
);

export const RenderButtonStates = ({ ...props }: ButtonProps) => (
  <div style={statePreviewStyle}>
    <StatePreviewItem label="Normaal">
      <ButtonComponent {...props} />
    </StatePreviewItem>

    <StatePreviewItem label="Hover">
      <ButtonComponent {...props} style={getButtonStateStyle(props.purpose, props.hint, 'hover')} />
    </StatePreviewItem>

    <StatePreviewItem label="Active">
      <ButtonComponent {...props} style={getButtonStateStyle(props.purpose, props.hint, 'active')} />
    </StatePreviewItem>
  </div>
);

const ButtonPurposeMatrix = ({ purpose }: { purpose: ButtonProps['purpose'] }) => {
  const baseProps: ButtonProps = {
    iconStart: undefined,
    label: 'Klik mij!',
    purpose,
  };

  const emojiProps: ButtonProps = {
    ...baseProps,
    iconStart: '❤️',
  };

  const iconOnlyProps: ButtonProps = {
    ...baseProps,
    iconOnly: true,
    iconStart: '❤️',
    label: 'Favoriet',
  };

  const disabledProps: ButtonProps = {
    ...baseProps,
    disabled: true,
    htmlDisabled: undefined,
  };

  const closedProps: ButtonProps = {
    ...baseProps,
    label: 'Meer tonen',
    pressed: false,
  };

  const openProps: ButtonProps = {
    ...baseProps,
    label: 'Meer tonen',
    pressed: true,
  };

  return (
    <div style={statePreviewGridStyle}>
      <span />
      <strong>Default</strong>
      <strong>Hover</strong>
      <strong>Active</strong>
      <strong>Open</strong>
      <strong>Gesloten</strong>

      <strong>Normaal</strong>
      <ButtonComponent {...baseProps} />
      <ButtonComponent {...baseProps} style={getButtonStateStyle(baseProps.purpose, baseProps.hint, 'hover')} />
      <ButtonComponent {...baseProps} style={getButtonStateStyle(baseProps.purpose, baseProps.hint, 'active')} />
      <ButtonComponent {...openProps} />
      <ButtonComponent {...closedProps} />

      <strong>Met emoji</strong>
      <ButtonComponent {...emojiProps} />
      <ButtonComponent {...emojiProps} style={getButtonStateStyle(emojiProps.purpose, emojiProps.hint, 'hover')} />
      <ButtonComponent {...emojiProps} style={getButtonStateStyle(emojiProps.purpose, emojiProps.hint, 'active')} />
      <ButtonComponent {...openProps} iconStart="❤️" />
      <ButtonComponent {...closedProps} iconStart="❤️" />

      <strong>Icon only</strong>
      <ButtonComponent {...iconOnlyProps} />
      <ButtonComponent
        {...iconOnlyProps}
        style={getButtonStateStyle(iconOnlyProps.purpose, iconOnlyProps.hint, 'hover')}
      />
      <ButtonComponent
        {...iconOnlyProps}
        style={getButtonStateStyle(iconOnlyProps.purpose, iconOnlyProps.hint, 'active')}
      />
      <ButtonComponent {...iconOnlyProps} pressed />
      <ButtonComponent {...iconOnlyProps} pressed={false} />

      <strong>Disabled</strong>
      <ButtonComponent {...disabledProps} />
      <ButtonComponent {...disabledProps} />
      <ButtonComponent {...disabledProps} />
      <ButtonComponent {...disabledProps} pressed />
      <ButtonComponent {...disabledProps} pressed={false} />
    </div>
  );
};

const getPurposeLabel = (purpose: ButtonProps['purpose']) => {
  if (purpose === 'primary') return 'Primary';
  if (purpose === 'secondary') return 'Secondary';
  return 'Default';
};

export const RenderButtonPurposePreview = ({ purpose }: ButtonProps) => <ButtonPurposeMatrix purpose={purpose} />;

export const RenderSingleButtonPreview = ({ ...props }: ButtonProps) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <ButtonComponent {...props} />
  </div>
);

export const RenderAllButtonPurposesPreview = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    {([undefined, 'primary', 'secondary'] as const).map((purpose) => (
      <WizardPreviewSection key={purpose ?? 'default'} label={getPurposeLabel(purpose)}>
        <ButtonPurposeMatrix purpose={purpose} />
      </WizardPreviewSection>
    ))}
  </div>
);

export const RenderButtonDisabled = ({ ...props }: ButtonProps) => (
  <div style={statePreviewStyle}>
    <StatePreviewItem label="Actief">
      <ButtonComponent {...props} disabled={false} htmlDisabled={undefined} />
    </StatePreviewItem>

    <StatePreviewItem label="Disabled">
      <ButtonComponent {...props} disabled htmlDisabled={undefined} />
    </StatePreviewItem>
  </div>
);

export const RenderButtonPressed = ({ ...props }: ButtonProps) => (
  <div style={statePreviewStyle}>
    <StatePreviewItem label="Normaal">
      <ButtonComponent {...props} pressed={false} />
    </StatePreviewItem>

    <StatePreviewItem label="Geselecteerd">
      <ButtonComponent {...props} pressed />
    </StatePreviewItem>
  </div>
);
