import { Button as ButtonComponent, type ButtonProps } from '@nl-design-system-candidate/button-react';
import { type ReactNode } from 'react';
import { WizardPreviewSection, createWizardStep } from '../story-helpers';

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

export const ButtonVariantsWithStates = ({ ...props }: ButtonProps) => (
  <div
    style={{
      alignItems: 'center',
      columnGap: '1rem',
      display: 'grid',
      gridTemplateColumns: 'auto repeat(3, max-content)',
      rowGap: '0.75rem',
    }}
  >
    <span />
    <strong>Normaal</strong>
    <strong>Hover</strong>
    <strong>Active</strong>

    <strong>Default</strong>
    <ButtonComponent {...props} />
    <ButtonComponent
      {...props}
      style={{
        backgroundColor: 'var(--nl-button-default-hover-background-color)',
        borderColor: 'var(--nl-button-default-hover-border-color)',
        color: 'var(--nl-button-default-hover-color)',
      }}
    />
    <ButtonComponent
      {...props}
      style={{
        backgroundColor: 'var(--nl-button-default-active-background-color)',
        borderColor: 'var(--nl-button-default-active-border-color)',
        color: 'var(--nl-button-default-active-color)',
      }}
    />

    <strong>Primary</strong>
    <ButtonComponent {...props} purpose="primary" />
    <ButtonComponent
      {...props}
      purpose="primary"
      style={{
        backgroundColor: 'var(--nl-button-primary-hover-background-color)',
        borderColor: 'var(--nl-button-primary-hover-border-color)',
        color: 'var(--nl-button-primary-hover-color)',
      }}
    />
    <ButtonComponent
      {...props}
      purpose="primary"
      style={{
        backgroundColor: 'var(--nl-button-primary-active-background-color)',
        borderColor: 'var(--nl-button-primary-active-border-color)',
        color: 'var(--nl-button-primary-active-color)',
      }}
    />

    <strong>Secondary</strong>
    <ButtonComponent {...props} purpose="secondary" />
    <ButtonComponent
      {...props}
      purpose="secondary"
      style={{
        backgroundColor: 'var(--nl-button-secondary-hover-background-color)',
        borderColor: 'var(--nl-button-secondary-hover-border-color)',
        color: 'var(--nl-button-secondary-hover-color)',
      }}
    />
    <ButtonComponent
      {...props}
      purpose="secondary"
      style={{
        backgroundColor: 'var(--nl-button-secondary-active-background-color)',
        borderColor: 'var(--nl-button-secondary-active-border-color)',
        color: 'var(--nl-button-secondary-active-color)',
      }}
    />
  </div>
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

export { WizardPreviewSection };

export const buttonWizardStepBasic = createWizardStep('button-basic', 'Button basis');

export const buttonWizardStepStates = createWizardStep('button-states', 'Button states');

export const buttonWizardStepPositiveStates = createWizardStep('button-positive-states', 'Positieve button states');

export const buttonWizardStepNegativeStates = createWizardStep('button-negative-states', 'Negatieve button states');

export const buttonWizardStepVariants = createWizardStep('button-variants', 'Button varianten');

export const buttonWizardStepPositiveVariants = createWizardStep(
  'button-positive-variants',
  'Positieve button varianten',
);

export const buttonWizardStepNegativeVariants = createWizardStep(
  'button-negative-variants',
  'Negatieve button varianten',
);

export const buttonWizardStepDisabled = createWizardStep('button-disabled', 'Button disabled');

export const buttonWizardStepPressed = createWizardStep('button-selected', 'Button geselecteerd');

export const buttonWizardStepPositivePressed = createWizardStep(
  'button-positive-selected',
  'Positieve geselecteerde buttons',
);

export const buttonWizardStepNegativePressed = createWizardStep(
  'button-negative-selected',
  'Negatieve geselecteerde buttons',
);

const StatePreviewItem = ({ children, label }: { children: ReactNode; label: string }) => (
  <div style={statePreviewItemStyle}>
    <span style={statePreviewLabelStyle}>{label}</span>
    {children}
  </div>
);

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
