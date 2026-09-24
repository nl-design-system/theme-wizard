import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: flex;
  }

  :host {
    background-color: var(--clippy-card-background-color, var(--basis-color-default-bg-document));
    border-color: var(--clippy-card-border-color, var(--basis-color-default-border-subtle));
    border-radius: var(--clippy-card-border-radius);
    border-style: solid;
    border-width: var(--clippy-card-border-width, var(--basis-border-width-sm));
    color: var(--clippy-card-color, var(--basis-color-default-color-document));
    flex-direction: column;
    max-inline-size: var(--clippy-card-max-inline-size);
    min-block-size: var(--clippy-card-min-block-size, var(--basis-pointer-target-min-block-size));
  }

  /* SLOTS */

  .clippy-card__pre-header,
  .clippy-card__header,
  .clippy-card__body,
  .clippy-card__footer {
    display: flex;
    flex-wrap: wrap;
  }

  /*
   * Header renders before pre-header in the DOM (see index.ts, for AT reading order).
   * Pull pre-header back to the top visually.
   */
  .clippy-card__pre-header,
  slot[name='pre-header'] {
    order: -1;
  }

  .clippy-card__pre-header {
    color: var(--clippy-card-label-color);
    column-gap: var(--clippy-card-pre-header-column-gap, var(--basis-space-column-md));
    font-family: var(--clippy-card-label-font-family);
    font-size: var(--clippy-card-label-font-size);
    font-weight: var(--clippy-card-label-font-weight);
    line-height: var(--clippy-card-label-line-height);
    padding-block-end: var(--clippy-card-pre-header-padding-block-end, var(--basis-space-block-lg));
    padding-block-start: var(--clippy-card-pre-header-padding-block-start, var(--basis-space-block-lg));
    padding-inline-end: var(--clippy-card-pre-header-padding-inline-end, var(--basis-space-inline-xl));
    padding-inline-start: var(--clippy-card-pre-header-padding-inline-start, var(--basis-space-inline-xl));
    row-gap: var(--clippy-card-pre-header-row-gap, var(--basis-space-row-md));
    text-decoration: var(--clippy-card-label-text-decoration);
  }

  .clippy-card__header {
    color: var(--clippy-card-heading-color);
    column-gap: var(--clippy-card-header-column-gap, var(--basis-space-column-md));
    font-family: var(--clippy-card-heading-font-family);
    font-size: var(--clippy-card-heading-font-size);
    font-weight: var(--clippy-card-heading-font-weight);
    line-height: var(--clippy-card-heading-line-height);
    padding-block-end: var(--clippy-card-header-padding-block-end, var(--basis-space-block-lg));
    padding-block-start: var(--clippy-card-header-padding-block-start, var(--basis-space-block-lg));
    padding-inline-end: var(--clippy-card-header-padding-inline-end, var(--basis-space-inline-xl));
    padding-inline-start: var(--clippy-card-header-padding-inline-start, var(--basis-space-inline-xl));
    row-gap: var(--clippy-card-header-row-gap, var(--basis-space-row-md));
    text-decoration: var(--clippy-card-heading-text-decoration, underline);
  }

  .clippy-card__body {
    column-gap: var(--clippy-card-body-column-gap, var(--basis-space-column-md));
    font-size: var(--clippy-card-description-font-size);
    line-height: var(--clippy-card-description-line-height);
    padding-block-end: var(--clippy-card-body-padding-block-end, var(--basis-space-block-lg));
    padding-block-start: var(--clippy-card-body-padding-block-start, var(--basis-space-block-lg));
    padding-inline-end: var(--clippy-card-body-padding-inline-end, var(--basis-space-inline-xl));
    padding-inline-start: var(--clippy-card-body-padding-inline-start, var(--basis-space-inline-xl));
    row-gap: var(--clippy-card-body-row-gap, var(--basis-space-row-md));
  }

  .clippy-card__footer {
    column-gap: var(--clippy-card-footer-column-gap, var(--basis-space-column-md));
    padding-block-end: var(--clippy-card-footer-padding-block-end, var(--basis-space-block-lg));
    padding-block-start: var(--clippy-card-footer-padding-block-start, var(--basis-space-block-lg));
    padding-inline-end: var(--clippy-card-footer-padding-inline-end, var(--basis-space-inline-xl));
    padding-inline-start: var(--clippy-card-footer-padding-inline-start, var(--basis-space-inline-xl));
    row-gap: var(--clippy-card-footer-row-gap, var(--basis-space-row-md));
  }
`;
