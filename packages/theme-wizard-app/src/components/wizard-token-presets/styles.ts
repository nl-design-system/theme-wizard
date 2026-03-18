import { css } from 'lit';

export const wizardTokenCSS = css`
  :host {
    display: flex;
  }

  button {
    flex: 1 1 0%;
  }

  .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-color, var(--basis-color-action-1-color-default, currentColor));
    display: block;
    font-family: var(--basis-text-font-family-default, inherit);
    font-size: var(--basis-text-font-size-md, 1rem);
    font-weight: var(--basis-text-font-weight-bold, 700);
    line-height: var(--basis-text-line-height-md, 1.5);
    margin: 0;
  }

  .wizard-token-preset__option-description {
    color: var(--basis-color-default-color-subtle, currentColor);
    display: block;
    font-family: var(--basis-text-font-family-default, inherit);
    font-size: var(--basis-text-font-size-sm, 0.875rem);
    font-weight: var(--basis-text-font-weight-default, 400);
    line-height: var(--basis-text-line-height-sm, 1.25);
    margin: 0;
  }

  button:hover .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-hover-color, currentColor);
  }

  button:hover .wizard-token-preset__option-description {
    color: var(--nl-button-secondary-hover-color, currentColor);
  }

  button:active .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-active-color, currentColor);
  }

  button:active .wizard-token-preset__option-description {
    color: var(--nl-button-secondary-active-color, currentColor);
  }

  button.nl-button--pressed .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-pressed-color, currentColor);
  }

  button.nl-button--pressed .wizard-token-preset__option-description {
    color: var(--nl-button-secondary-pressed-color, currentColor);
  }

  button.nl-button--pressed:hover .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-pressed-hover-color, currentColor);
  }

  button.nl-button--pressed:hover .wizard-token-preset__option-description {
    color: var(--nl-button-secondary-pressed-hover-color, currentColor);
  }

  button.nl-button--pressed:active .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-pressed-active-color, currentColor);
  }

  button.nl-button--pressed:active .wizard-token-preset__option-description {
    color: var(--nl-button-secondary-pressed-active-color, currentColor);
  }
`;
