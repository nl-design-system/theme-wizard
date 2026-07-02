import { css } from 'lit';

export const radioStyles = css`
  :host(:not([hidden])) {
    display: block;
  }

  /* ELEMENTS */

  :host {
    --_clippy-card-radio-option-border-radius: var(--basis-border-radius-md);

    background-color: var(--basis-color-default-bg-document);
    border-color: var(--basis-color-default-border-subtle);
    border-radius: var(--_clippy-card-radio-option-border-radius);
    border-style: solid;
    border-width: var(--basis-border-width-sm);
    min-inline-size: var(--basis-pointer-target-min-inline-size);
    position: relative;
  }

  /**
   * 1. Pseudo element that overlays the entire radio card to make it entirely mouse-interactive;
   *    This element also takes care of the additional border-width on interaction and [checked] state.
   */
  .clippy-card-radio-option__label {
    /* [1] */
    color: var(--basis-color-default-color-document);
    font-family: var(--basis-text-font-family-default);
    font-size: var(--basis-text-font-size-md);
    font-weight: var(--basis-text-font-weight-bold);
    line-height: var(--basis-text-line-height-md);

    /* [1] */
    &::after {
      border-color: var(--basis-form-control-border-color);
      border-radius: var(--_clippy-card-radio-option-border-radius);
      border-style: solid;
      border-width: var(--basis-border-width-none);
      content: '';
      cursor: pointer;
      inset: 0;
      position: absolute;
    }
  }

  .clippy-card-radio-option__description {
    color: var(--basis-color-default-color-subtle);
    font-family: var(--basis-text-font-family-default);
    font-size: var(--basis-text-font-size-md);
    font-weight: var(--basis-text-font-weight-default);
    line-height: var(--basis-text-line-height-md);
  }

  .clippy-card-radio-option__header {
    align-items: center;
    column-gap: var(--basis-space-inline-lg);
    display: flex;
    justify-content: start;
    min-block-size: var(--basis-pointer-target-min-block-size);
    padding-block-end: var(--basis-space-inline-lg);
    padding-block-start: var(--basis-space-inline-lg);
    padding-inline-end: var(--basis-space-inline-xl);
    padding-inline-start: var(--basis-space-inline-xl);
  }

  .clippy-card-radio-option__start {
    align-self: center;
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .clippy-card-radio-option__header-body {
    align-self: start;
    flex: 1;
    min-inline-size: 0;
  }

  .clippy-radio-card__body {
    padding-block-end: var(--basis-space-inline-xl);
    padding-block-start: var(--basis-space-none);
    padding-inline-end: var(--basis-space-inline-xl);
    padding-inline-start: var(--basis-space-inline-xl);
  }

  .clippy-radio-card__footer {
    padding-block-end: var(--basis-space-inline-xl);
    padding-block-start: var(--basis-space-none);
    padding-inline-end: var(--basis-space-inline-xl);
    padding-inline-start: var(--basis-space-inline-xl);
  }

  /* HOST STATES */

  /* :host(:focus-visible-within) would be ideal but is not yet spec'd (w3c/csswg-drafts#3080).
     :host(:has(:focus-visible)) also fails — browsers don't re-invalidate shadow styles
     when dynamic pseudo-classes change on shadow children inside :has() (w3c/csswg-drafts#5893). */
  :host(:focus-within) {
    background-color: var(--basis-form-control-focus-background-color);
    color: var(--basis-form-control-focus-color);
    outline-color: var(--basis-focus-outline-color);
    outline-offset: var(--basis-focus-outline-offset);
    outline-style: var(--basis-focus-outline-style);
    outline-width: var(--basis-focus-outline-width);

    & .clippy-card-radio-option__label::after {
      border-color: var(--basis-form-control-focus-border-color);
      border-width: var(--basis-form-control-focus-border-width);
    }
  }

  :host(:hover) {
    background-color: var(--basis-form-control-hover-background-color);

    & .clippy-card-radio-option__label::after {
      border-color: var(--basis-form-control-hover-border-color);
      border-width: var(--basis-border-width-md);
    }
  }

  :host(:active) {
    background-color: var(--basis-form-control-active-background-color);

    & .clippy-card-radio-option__label::after {
      border-color: var(--basis-form-control-active-border-color);
      border-width: var(--basis-border-width-md);
      border-left-width: 0.5em;
    }
  }

  :host([checked]) {
    background-color: var(--basis-color-default-bg-document);

    & .clippy-card-radio-option__label::after {
      border-color: var(--basis-form-control-active-border-color);
      border-width: var(--basis-border-width-md);
    }
  }

  :host([checked]:hover) {
    background-color: var(--basis-form-control-hover-background-color);

    & .clippy-card-radio-option__label::after {
      border-color: var(--basis-form-control-hover-border-color);
      border-width: var(--basis-border-width-md);
    }
  }

  :host([checked]:active) {
    background-color: var(--basis-form-control-active-background-color);

    & .clippy-card-radio-option__label::after {
      border-color: var(--basis-form-control-active-border-color);
      border-width: var(--basis-border-width-md);
    }
  }
`;
