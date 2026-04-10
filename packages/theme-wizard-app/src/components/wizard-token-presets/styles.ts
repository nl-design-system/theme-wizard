import { css } from 'lit';

export const wizardTokenCSS = css`
  :host {
    display: block;
  }

  .wizard-token-preset__group {
    border: none;
    display: flex;
    flex-direction: column;
    gap: var(--basis-space-block-sm);
    margin-block: 0;
    margin-inline: 0;
    padding-block: 0;
    padding-inline: 0;
  }

  .wizard-token-preset__legend {
    block-size: 1px;
    clip-path: inset(50%);
    inline-size: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
  }

  .wizard-token-preset__label {
    cursor: pointer;
    display: block;
    position: relative;
  }

  .wizard-token-preset__control {
    inset: 0;
    opacity: 0%;
    position: absolute;
  }

  .wizard-token-preset__button {
    box-sizing: border-box;
    display: block;
    inline-size: 100%;
    text-align: start;
  }

  .wizard-token-preset__control:focus-visible + .wizard-token-preset__button {
    outline: max(0.125rem, 0.1em) solid var(--nl-button-focus-background-color, var(--basis-focus-background-color));
    outline-offset: 0.125rem;
  }

  .wizard-token-preset__option-title-row {
    align-items: baseline;
    display: flex;
    flex-wrap: wrap;
    gap: var(--basis-space-inline-sm);
    justify-content: space-between;
  }

  .wizard-token-preset__option-default-pill {
    border: var(--basis-border-width-sm) solid var(--nl-button-secondary-border-color);
    border-radius: var(--basis-border-radius-round);
    color: currentColor;
    font-size: var(--basis-text-font-size-sm);
    font-weight: var(--basis-text-font-weight-default);
    padding-block: var(--basis-space-block-xs);
    padding-inline: var(--basis-space-inline-md);
  }

  .wizard-token-preset__control:checked + .wizard-token-preset__button .wizard-token-preset__option-default-pill {
    border-color: var(--nl-button-secondary-pressed-color);
  }

  .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-color, var(--basis-color-action-1-color-default, currentColor));
    font-family: var(--basis-text-font-family-default);
    font-size: var(--basis-text-font-size-md);
    font-weight: var(--basis-text-font-weight-bold);
    line-height: var(--basis-text-line-height-md);
    margin-block: 0;
    margin-inline: 0;
  }

  .wizard-token-preset__option-description {
    color: var(--basis-color-default-color-subtle, currentColor);
    display: block;
    font-family: var(--basis-text-font-family-default);
    font-size: var(--basis-text-font-size-sm);
    font-weight: var(--basis-text-font-weight-default);
    line-height: var(--basis-text-line-height-sm);
    margin-block: 0;
    margin-inline: 0;
  }

  .wizard-token-preset__label:hover .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-hover-color, currentColor);
  }

  .wizard-token-preset__label:hover .wizard-token-preset__option-description {
    color: var(--nl-button-secondary-hover-color, currentColor);
  }

  .wizard-token-preset__label:active .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-active-color, currentColor);
  }

  .wizard-token-preset__label:active .wizard-token-preset__option-description {
    color: var(--nl-button-secondary-active-color, currentColor);
  }

  .wizard-token-preset__button.nl-button--pressed .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-pressed-color, currentColor);
  }

  .wizard-token-preset__button.nl-button--pressed .wizard-token-preset__option-description {
    color: var(--nl-button-secondary-pressed-color, currentColor);
  }

  .wizard-token-preset__label:hover .wizard-token-preset__button.nl-button--pressed .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-pressed-hover-color, currentColor);
  }

  .wizard-token-preset__label:hover
    .wizard-token-preset__button.nl-button--pressed
    .wizard-token-preset__option-description {
    color: var(--nl-button-secondary-pressed-hover-color, currentColor);
  }

  .wizard-token-preset__label:active
    .wizard-token-preset__button.nl-button--pressed
    .wizard-token-preset__option-title {
    color: var(--nl-button-secondary-pressed-active-color, currentColor);
  }

  .wizard-token-preset__label:active
    .wizard-token-preset__button.nl-button--pressed
    .wizard-token-preset__option-description {
    color: var(--nl-button-secondary-pressed-active-color, currentColor);
  }

  .wizard-token-preset__option-values {
    display: block;
    margin-block-start: var(--basis-space-block-sm);
    padding-inline-start: var(--basis-space-inline-lg);
  }

  .wizard-token-preset__option-values-summary {
    color: var(--basis-color-default-color-subtle);
    cursor: pointer;
    font-size: var(--basis-text-font-size-sm);
    font-weight: var(--basis-text-font-weight-bold);
  }

  .wizard-token-preset__option-values--summary[open] .wizard-token-preset__option-values-list {
    margin-block-start: var(--basis-space-block-xs);
  }

  .wizard-token-preset__option-value {
    align-items: flex-start;
    border-block-start: var(--basis-border-width-sm) solid
      color-mix(in sRGB, var(--basis-color-default-border-subtle) 45%, transparent);
    display: flex;
    flex-direction: column;
    gap: var(--basis-space-block-xs);
    margin-block: 0;
    margin-inline: 0;
    padding-block-start: var(--basis-space-block-2xs);
  }

  .wizard-token-preset__option-value-heading {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: var(--basis-space-block-xs);
  }

  .wizard-token-preset__option-value-label {
    color: var(--basis-color-default-color-default);
    font-size: 0.8125rem;
    font-weight: var(--basis-text-font-weight-bold);
    line-height: 1.3;
  }

  .wizard-token-preset__option-value-path {
    color: var(--basis-color-default-color-subtle);
    font-family: var(--basis-text-font-family-monospace);
    font-size: var(--basis-text-font-size-sm);
  }

  .wizard-token-preset__option-value-mapping {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: var(--basis-space-block-xs);
  }

  .wizard-token-preset__option-value-mapping-label {
    color: var(--basis-color-default-color-subtle);
    font-size: var(--basis-text-font-size-sm);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .wizard-token-preset__option-value + .wizard-token-preset__option-value {
    margin-block-start: var(--basis-space-block-xs);
  }

  .wizard-token-preset__option-value-token {
    font-family: var(--basis-text-font-family-monospace);
    font-size: var(--basis-text-font-size-sm);
  }

  .wizard-token-preset__option-value-token-strong {
    font-weight: var(--basis-text-font-weight-bold);
  }

  .wizard-token-preset__option-value-resolved {
    color: var(--basis-color-default-color-document);
    font-family: var(--basis-text-font-family-monospace);
    font-size: var(--basis-text-font-size-sm);
    font-weight: var(--basis-text-font-weight-bold);
  }
`;
