import { css } from 'lit';

export const groupStyles = css`
  :host(:not([hidden])) {
    display: flex;
  }

  :host {
    flex-direction: column;
    row-gap: var(--basis-space-row-md);
  }
`;

export const radioStyles = css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    background-color: var(--basis-form-control-background-color);
    border-radius: var(--basis-border-radius-md); /* var(--basis-form-control-border-radius) */
    min-inline-size: var(--basis-pointer-target-min-inline-size);
    padding-block: var(--basis-space-block-md);
    padding-inline: var(--basis-space-inline-lg);
    position: relative;
  }

  .clippy-card-radio__header {
    align-items: start;
    display: grid;
    grid-template-rows: auto auto;
    justify-content: start;
    min-block-size: var(--basis-pointer-target-min-block-size);
  }

  .clippy-card-radio__header-with-start {
    align-items: center;
    grid-template-columns: min-content minmax(0, 1fr);
    column-gap: var(--basis-space-column-lg);

    .clippy-card-radio__start {
      grid-column: 1;
      grid-row: 1 / -1;
    }

    .clippy-card-radio__label {
      grid-column: 2;
      grid-row: 1;
    }

    .clippy-card-radio__description {
      grid-column: 2;
      grid-row: 2;
    }
  }

  .clippy-card-radio__start {
    align-self: center;
  }

  .clippy-card-radio__label {
    font-weight: var(--basis-text-font-weight-bold);
    line-height: var(--basis-text-line-height-md);

    &::after {
      border-color: var(
        --basis-color-default-border-subtle
      ); /* should be --basis-form-control-border-color but it's too dark */
      border-radius: var(--basis-border-radius-md); /* var(--basis-form-control-border-radius) */
      border-style: solid;
      border-width: var(--basis-form-control-border-width);
      content: '';
      cursor: pointer;
      inset: 0;
      position: absolute;
    }
  }

  .clippy-card-radio__description {
    color: var(--basis-color-default-color-subtle);
    line-height: var(--basis-text-line-height-md);
  }

  .clippy-radio-card__body {
    margin-block-start: var(--basis-space-block-md);
  }

  .clippy-radio-card__footer {
    margin-block-start: var(--basis-space-block-md);
  }

  /* STATES */

  :host([checked]),
  :host(:hover),
  :host(:active) {
    & .clippy-card-radio__label::after {
      border-color: var(--basis-form-control-active-border-color);
      border-width: var(--basis-form-control-active-border-width);
    }
  }

  :host(:hover),
  :host(:active) {
    background-color: var(--basis-color-default-bg-hover);
  }

  :host([focus-visible]) {
    background-color: var(--basis-form-control-focus-background-color);
    border-color: var(--basis-form-control-focus-border-color);
    color: var(--basis-form-control-focus-color);
    outline-color: var(--basis-focus-outline-color);
    outline-offset: var(--basis-focus-outline-offset);
    outline-style: var(--basis-focus-outline-style);
    outline-width: var(--basis-focus-outline-width);
  }
`;
