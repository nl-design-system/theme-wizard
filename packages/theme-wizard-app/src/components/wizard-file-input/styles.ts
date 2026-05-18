import { css } from 'lit';

export default css`
  .wizard-file-input {
    border: var(--basis-border-width-md) dashed var(--basis-color-default-border-subtle);
    box-sizing: border-box;
    inline-size: 100%;
    margin-block-start: var(--basis-space-block-md);
    padding-block: var(--basis-space-block-2xl);
    padding-inline: var(--basis-space-inline-2xl);
  }

  /* Inline copy of nl-button-css because we can't extend the CSS in another way */
  .wizard-file-input::file-selector-button {
    background-color: var(--nl-button-secondary-background-color);
    border-color: var(--nl-button-secondary-border-color);
    border-radius: var(--nl-button-border-radius);
    border-style: solid;
    border-width: var(--nl-button-secondary-border-width);
    box-sizing: border-box;
    color: var(--nl-button-secondary-color);
    cursor: pointer;
    font-family: var(--nl-button-font-family);
    font-size: var(--nl-button-secondary-font-size);
    font-weight: var(--nl-button-secondary-font-weight);
    line-height: var(--nl-button-secondary-line-height);
    margin-inline-end: var(--basis-space-inline-lg);
    min-block-size: var(--nl-button-min-block-size, max(44px, fit-content));
    padding-block-end: var(--nl-button-padding-block-end);
    padding-block-start: var(--nl-button-padding-block-start);
    padding-inline-end: var(--nl-button-padding-inline-end);
    padding-inline-start: var(--nl-button-padding-inline-start);
  }

  .wizard-file-input::file-selector-button:hover {
    background-color: var(--nl-button-secondary-hover-background-color);
    border-color: var(--nl-button-secondary-hover-border-color);
    color: var(--nl-button-secondary-hover-color);
  }

  .wizard-file-input::file-selector-button:active {
    background-color: var(--nl-button-secondary-active-background-color);
    border-color: var(--nl-button-secondary-active-border-color);
    color: var(--nl-button-secondary-active-color);
  }
`;
