import { css } from 'lit';

export default css`
  fieldset {
    border: none;
    padding: var(--basis-space-none);
  }

  legend {
    font-family: var(--basis-heading-font-family);
    font-size: var(--basis-text-font-size-2xl);
    font-weight: var(--basis-text-font-weight-bold);
  }

  .wizard-card-as-input:not([hidden]) {
    display: grid;
  }

  .wizard-card-as-input {
    background-color: var(--wizard-card-as-input-bg-color, var(--basis-color-default-bg-document));
    border-color: var(--wizard-card-as-input-border-color, var(--basis-color-default-border-subtle));
    border-radius: var(--wizard-card-as-input-border-radius, var(--basis-border-radius-md));
    border-style: var(--wizard-card-as-input-border-style, solid);
    border-width: var(--wizard-card-as-input-border-width, var(--basis-border-width-sm));
    column-gap: var(--wizard-card-as-input-column-gap, var(--basis-space-column-lg));
    cursor: var(--wizard-card-as-input-cursor, var(--basis-action-activate-cursor));
    grid-template-columns: min-content minmax(0, 1fr);
    padding-block: var(--wizard-card-as-input-padding-block, var(--basis-space-block-lg));
    padding-inline: var(--wizard-card-as-input-padding-inline, var(--basis-space-inline-xl));
    position: relative;
    row-gap: var(--wizard-card-as-input-row-gap, var(--basis-space-row-lg));

    @media (hover: hover) {
      &:hover {
        border-color: var(--wizard-card-as-input-border-color-hover, var(--basis-color-default-border-hover));
      }
    }

    &:has(input:checked) {
      background-color: var(--wizard-card-as-input-focus-bg-color, var(--basis-color-action-1-bg-subtle));
      border-color: var(--wizard-card-as-input-checked-border-color, var(--basis-color-action-1-border-active));

      @media (forced-colors: active) {
        color: SelectedItem;
      }
    }

    &:has(:focus-visible) {
      outline-width: var(--basis-border-width-md);
      outline-style: solid;
      outline-color: var(--basis-color-action-1-color-default);
      outline-offset: var(--basis-border-width-md);
    }

    & input {
      accent-color: var(--wizard-card-as-input-accent-color, var(--basis-color-action-1-color-default));
      grid-column: 1;
      grid-row: 1;
      margin: 0;
      zoom: 1.3;
    }

    & > :not(input) {
      grid-column: 2;
    }

    & label::after {
      content: '';
      inset: 0;
      position: absolute;
    }

    wizard-font-sample {
      background-color: var(--basis-color-default-bg-subtle);
      border-color: var(--basis-color-default-border-subtle);
      border-style: solid;
      border-width: var(--basis-border-width-none);
      padding-block: var(--basis-space-block-xl);
      padding-inline: var(--basis-space-inline-2xl);

      @media (forced-colors: active) {
        border-width: var(--basis-border-width-sm);
      }
    }
  }
`;
