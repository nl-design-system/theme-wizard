import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host(.theme-validation-highlight) {
    animation: theme-validation-glow 2000ms ease-out forwards;
  }

  @keyframes theme-validation-glow {
    0% {
      box-shadow: 0 0 0 2px rgb(0 0 0 / 100%);
    }
    15%,
    65% {
      box-shadow: 0 0 0 2px rgb(0 0 0 / 60%);
    }
    100% {
      box-shadow: none;
    }
  }

  .wizard-token-field--invalid {
    border-inline-start-color: var(--basis-color-negative-color-default);
    border-inline-start-style: solid;
    border-inline-start-width: var(--basis-border-width-lg);
    padding-inline-start: var(--basis-space-inline-md);
  }

  .wizard-token-field__label {
    display: block;
    margin-block-end: var(--basis-space-row-md);
  }

  .wizard-token-field__error {
    margin-block-end: var(--basis-space-row-md);
  }
`;
