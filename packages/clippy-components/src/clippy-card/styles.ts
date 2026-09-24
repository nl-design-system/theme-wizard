import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: flex;
  }

  /*
   * [1] This border is the very minimum we need to make this look like a card.
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

    @media (forced-colors: active) {
      color: var(--_clippy-card-state-color, LinkText);
    }
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
    column-gap: var(--clippy-card-pre-header-column-gap);
    font-family: var(--clippy-card-label-font-family);
    font-size: var(--clippy-card-label-font-size);
    font-weight: var(--clippy-card-label-font-weight);
    line-height: var(--clippy-card-label-line-height);
    padding-block-end: var(--clippy-card-pre-header-padding-block-end);
    padding-block-start: var(--clippy-card-pre-header-padding-block-start);
    padding-inline-end: var(--clippy-card-pre-header-padding-inline-end);
    padding-inline-start: var(--clippy-card-pre-header-padding-inline-start);
    row-gap: var(--clippy-card-pre-header-row-gap);
    text-decoration: var(--clippy-card-label-text-decoration);
  }

  /*
   * [1] The underline is a visual affordance to indicate that this card is a link
   */
  .clippy-card__header {
    color: var(--clippy-card-heading-color);
    column-gap: var(--clippy-card-header-column-gap);
    font-family: var(--clippy-card-heading-font-family);
    font-size: var(--clippy-card-heading-font-size);
    font-weight: var(--clippy-card-heading-font-weight);
    line-height: var(--clippy-card-heading-line-height);
    padding-block-end: var(--clippy-card-header-padding-block-end);
    padding-block-start: var(--clippy-card-header-padding-block-start);
    padding-inline-end: var(--clippy-card-header-padding-inline-end);
    padding-inline-start: var(--clippy-card-header-padding-inline-start);
    row-gap: var(--clippy-card-header-row-gap);
    text-decoration: var(--clippy-card-header-text-decoration, underline); /* [1] */
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
