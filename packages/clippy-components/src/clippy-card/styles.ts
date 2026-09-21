import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: flex;
    flex-direction: column;
  }

  :host {
    --_clippy-card-background-color: var(--clippy-card-background-color, var(--basis-color-default-bg-document));
    --_clippy-card-border-color: var(--clippy-card-border-color, var(--basis-color-default-border-subtle));
    --_clippy-card-border-radius: var(--clippy-card-border-radius, var(--basis-border-radius-md));
    --_clippy-card-border-width: var(--clippy-card-border-width, var(--basis-border-width-sm));
    --_clippy-card-color: var(--clippy-card-color, var(--basis-color-default-color-document));
    --_clippy-card-max-inline-size: var(--clippy-card-max-inline-size, 48rem);
    --_clippy-card-min-block-size: var(--clippy-card-min-block-size, var(--basis-pointer-target-min-block-size));
    --_clippy-card-body-column-gap: var(--clippy-card-body-column-gap, var(--basis-space-column-md));
    --_clippy-card-body-padding-block-end: var(--clippy-card-body-padding-block-end, var(--basis-space-block-lg));
    --_clippy-card-body-padding-block-start: var(--clippy-card-body-padding-block-start, var(--basis-space-block-lg));
    --_clippy-card-body-padding-inline-end: var(--clippy-card-body-padding-inline-end, var(--basis-space-inline-xl));
    --_clippy-card-body-padding-inline-start: var(
      --clippy-card-body-padding-inline-start,
      var(--basis-space-inline-xl)
    );
    --_clippy-card-body-row-gap: var(--clippy-card-body-row-gap, var(--basis-space-row-md));
    --_clippy-card-description-font-size: var(--clippy-card-description-font-size, var(--basis-text-font-size-md));
    --_clippy-card-description-line-height: var(
      --clippy-card-description-line-height,
      var(--basis-text-line-height-md)
    );
    --_clippy-card-footer-column-gap: var(--clippy-card-footer-column-gap, var(--basis-space-column-md));
    --_clippy-card-footer-padding-block-end: var(--clippy-card-footer-padding-block-end, var(--basis-space-block-lg));
    --_clippy-card-footer-padding-block-start: var(
      --clippy-card-footer-padding-block-start,
      var(--basis-space-block-lg)
    );
    --_clippy-card-footer-padding-inline-end: var(
      --clippy-card-footer-padding-inline-end,
      var(--basis-space-inline-xl)
    );
    --_clippy-card-footer-padding-inline-start: var(
      --clippy-card-footer-padding-inline-start,
      var(--basis-space-inline-xl)
    );
    --_clippy-card-footer-row-gap: var(--clippy-card-footer-row-gap, var(--basis-space-row-md));
    --_clippy-card-header-column-gap: var(--clippy-card-header-column-gap, var(--basis-space-column-md));
    --_clippy-card-header-padding-block-end: var(--clippy-card-header-padding-block-end, var(--basis-space-block-lg));
    --_clippy-card-header-padding-block-start: var(
      --clippy-card-header-padding-block-start,
      var(--basis-space-block-lg)
    );
    --_clippy-card-header-padding-inline-end: var(
      --clippy-card-header-padding-inline-end,
      var(--basis-space-inline-xl)
    );
    --_clippy-card-header-padding-inline-start: var(
      --clippy-card-header-padding-inline-start,
      var(--basis-space-inline-xl)
    );
    --_clippy-card-header-row-gap: var(--clippy-card-header-row-gap, var(--basis-space-row-md));
    --_clippy-card-heading-color: var(--clippy-card-heading-color, var(--basis-heading-color));
    --_clippy-card-heading-font-family: var(--clippy-card-heading-font-family, var(--basis-heading-font-family));
    --_clippy-card-heading-font-size: var(--clippy-card-heading-font-size, var(--basis-text-font-size-xl));
    --_clippy-card-heading-font-weight: var(--clippy-card-heading-font-weight, var(--basis-heading-font-weight));
    --_clippy-card-heading-line-height: var(--clippy-card-heading-line-height, var(--basis-text-line-height-xl));
    --_clippy-card-heading-text-decoration: var(--clippy-card-heading-text-decoration, none);
    --_clippy-card-icon-color: var(--clippy-card-icon-color, var(--_clippy-card-color));
    --_clippy-card-icon-size: var(--clippy-card-icon-size, var(--basis-size-icon-md));
    --_clippy-card-label-color: var(--clippy-card-label-color, var(--_clippy-card-color));
    --_clippy-card-label-font-family: var(--clippy-card-label-font-family, var(--basis-text-font-family-default));
    --_clippy-card-label-font-size: var(--clippy-card-label-font-size, var(--basis-text-font-size-md));
    --_clippy-card-label-font-weight: var(--clippy-card-label-font-weight, var(--basis-text-font-weight-bold));
    --_clippy-card-label-line-height: var(--clippy-card-label-line-height, var(--basis-text-line-height-md));
    --_clippy-card-label-text-decoration: var(--clippy-card-label-text-decoration, none);
    --_clippy-card-link-icon-color: var(--clippy-card-link-icon-color, var(--basis-color-action-2-color-default));
    --_clippy-card-link-icon-size: var(--clippy-card-link-icon-size, var(--basis-size-icon-md));
    --_clippy-card-pre-header-column-gap: var(--clippy-card-pre-header-column-gap, var(--basis-space-column-md));
    --_clippy-card-pre-header-padding-block-end: var(
      --clippy-card-pre-header-padding-block-end,
      var(--basis-space-block-lg)
    );
    --_clippy-card-pre-header-padding-block-start: var(
      --clippy-card-pre-header-padding-block-start,
      var(--basis-space-block-lg)
    );
    --_clippy-card-pre-header-padding-inline-end: var(
      --clippy-card-pre-header-padding-inline-end,
      var(--basis-space-inline-xl)
    );
    --_clippy-card-pre-header-padding-inline-start: var(
      --clippy-card-pre-header-padding-inline-start,
      var(--basis-space-inline-xl)
    );
    --_clippy-card-pre-header-row-gap: var(--clippy-card-pre-header-row-gap, var(--basis-space-row-md));

    background-color: var(--_clippy-card-background-color);
    border-color: var(--_clippy-card-border-color);
    border-radius: var(--_clippy-card-border-radius);
    border-style: solid;
    border-width: var(--_clippy-card-border-width);
    color: var(--_clippy-card-color);
    max-inline-size: var(--_clippy-card-max-inline-size);
    min-block-size: var(--_clippy-card-min-block-size);
  }

  /* SLOTS */

  .clippy-card__pre-header,
  .clippy-card__header,
  .clippy-card__body,
  .clippy-card__footer {
    display: flex;
    flex-wrap: wrap;
  }

  /* Header renders before pre-header in the DOM (see index.ts, for AT reading order) — pull
     pre-header back to the top visually. Targets both the wrapped and bare-slot cases. */
  .clippy-card__pre-header,
  slot[name='pre-header'] {
    order: -1;
  }

  .clippy-card__pre-header {
    column-gap: var(--_clippy-card-pre-header-column-gap);
    padding-block-end: var(--_clippy-card-pre-header-padding-block-end);
    padding-block-start: var(--_clippy-card-pre-header-padding-block-start);
    padding-inline-end: var(--_clippy-card-pre-header-padding-inline-end);
    padding-inline-start: var(--_clippy-card-pre-header-padding-inline-start);
    row-gap: var(--_clippy-card-pre-header-row-gap);
  }

  .clippy-card__header {
    column-gap: var(--_clippy-card-header-column-gap);
    padding-block-end: var(--_clippy-card-header-padding-block-end);
    padding-block-start: var(--_clippy-card-header-padding-block-start);
    padding-inline-end: var(--_clippy-card-header-padding-inline-end);
    padding-inline-start: var(--_clippy-card-header-padding-inline-start);
    row-gap: var(--_clippy-card-header-row-gap);
  }

  .clippy-card__body {
    column-gap: var(--_clippy-card-body-column-gap);
    padding-block-end: var(--_clippy-card-body-padding-block-end);
    padding-block-start: var(--_clippy-card-body-padding-block-start);
    padding-inline-end: var(--_clippy-card-body-padding-inline-end);
    padding-inline-start: var(--_clippy-card-body-padding-inline-start);
    row-gap: var(--_clippy-card-body-row-gap);
  }

  .clippy-card__footer {
    column-gap: var(--_clippy-card-footer-column-gap);
    padding-block-end: var(--_clippy-card-footer-padding-block-end);
    padding-block-start: var(--_clippy-card-footer-padding-block-start);
    padding-inline-end: var(--_clippy-card-footer-padding-inline-end);
    padding-inline-start: var(--_clippy-card-footer-padding-inline-start);
    row-gap: var(--_clippy-card-footer-row-gap);
  }
`;
