import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: flex;
  }

  /*
   * [1] This border is the very minimum we need to make this look like a card and remains visible in high contrast mode.
   */
  :host {
    background-color: var(--clippy-card-background-color);
    border-color: var(--clippy-card-border-color);
    border-radius: var(--clippy-card-border-radius);
    border-style: solid;
    border-width: var(--clippy-card-border-width, 1px); /* [1] */
    color: var(--_clippy-card-state-color, var(--clippy-card-color));
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

  .clippy-card__pre-header[hidden],
  .clippy-card__header[hidden],
  .clippy-card__body[hidden],
  .clippy-card__footer[hidden] {
    display: none;
  }

  /*
   * [1] Header renders before pre-header in the DOM (see index.ts, for AT reading order).
   */
  .clippy-card__pre-header {
    color: var(--clippy-card-pre-header-color);
    column-gap: var(--clippy-card-pre-header-column-gap);
    font-family: var(--clippy-card-pre-header-font-family);
    font-size: var(--clippy-card-pre-header-font-size);
    font-weight: var(--clippy-card-pre-header-font-weight);
    line-height: var(--clippy-card-pre-header-line-height);
    order: -1; /* [1] */
    padding-block-end: var(--clippy-card-pre-header-padding-block-end);
    padding-block-start: var(--clippy-card-pre-header-padding-block-start);
    padding-inline-end: var(--clippy-card-pre-header-padding-inline-end);
    padding-inline-start: var(--clippy-card-pre-header-padding-inline-start);
    row-gap: var(--clippy-card-pre-header-row-gap);
    text-decoration: var(--clippy-card-pre-header-text-decoration);
  }

  .clippy-card__header {
    color: var(--clippy-card-header-color);
    column-gap: var(--clippy-card-header-column-gap);
    font-family: var(--clippy-card-header-font-family);
    font-size: var(--clippy-card-header-font-size);
    font-weight: var(--clippy-card-header-font-weight);
    line-height: var(--clippy-card-header-line-height);
    padding-block-end: var(--clippy-card-header-padding-block-end);
    padding-block-start: var(--clippy-card-header-padding-block-start);
    padding-inline-end: var(--clippy-card-header-padding-inline-end);
    padding-inline-start: var(--clippy-card-header-padding-inline-start);
    row-gap: var(--clippy-card-header-row-gap);
    text-decoration: var(--clippy-card-header-text-decoration);
  }

  .clippy-card__body {
    column-gap: var(--clippy-card-body-column-gap);
    font-size: var(--clippy-card-description-font-size);
    line-height: var(--clippy-card-description-line-height);
    padding-block-end: var(--clippy-card-body-padding-block-end);
    padding-block-start: var(--clippy-card-body-padding-block-start);
    padding-inline-end: var(--clippy-card-body-padding-inline-end);
    padding-inline-start: var(--clippy-card-body-padding-inline-start);
    row-gap: var(--clippy-card-body-row-gap);
  }

  .clippy-card__footer {
    column-gap: var(--clippy-card-footer-column-gap);
    padding-block-end: var(--clippy-card-footer-padding-block-end);
    padding-block-start: var(--clippy-card-footer-padding-block-start);
    padding-inline-end: var(--clippy-card-footer-padding-inline-end);
    padding-inline-start: var(--clippy-card-footer-padding-inline-start);
    row-gap: var(--clippy-card-footer-row-gap);
  }
`;
