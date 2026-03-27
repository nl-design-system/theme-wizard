import { css } from 'lit';

export default css`
  :host {
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

  .wizard-token-field {
    border-inline-start: 3px solid transparent;
    padding-inline-start: var(--basis-space-inline-md);
  }

  .wizard-token-field__default {
    align-items: center;
    color: var(--basis-color-default-color-subtle);
    display: flex;
    flex-wrap: wrap;
    gap: var(--basis-space-inline-xs);
    margin-block-end: 0;
    margin-block-start: var(--basis-space-block-2xs);
  }

  .wizard-token-field__default-label {
    font-size: 0.875rem;
    font-weight: 700;
  }

  .wizard-token-field__default--missing {
    font-style: italic;
  }

  .wizard-token-field__default-missing {
    font-size: 0.875rem;
  }

  .wizard-token-field__default-reference,
  .wizard-token-field__default-value {
    font-size: 0.875rem;
  }

  .wizard-token-field--invalid {
    border-inline-start-color: var(--basis-color-negative-color-default);
  }

  .theme-error {
    text-decoration: wavy underline;
    text-decoration-color: var(--basis-color-negative-color-default);
  }

  /* Acts as the label */
  p {
    margin-block: 0;
  }

  ul {
    margin-block: 0;
    margin-inline-start: 0;
    padding-inline-start: var(--basis-space-inline-md);
  }

  li {
    list-style-type: none;

    &:not(:last-child) {
      margin-block-end: var(--basis-space-block-sm);
    }
  }
`;
