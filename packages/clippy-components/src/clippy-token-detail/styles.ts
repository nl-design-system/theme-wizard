import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --_clippy-token-detail-color: var(--clippy-token-detail-color, var(--basis-color-default-color-document));
    --_clippy-token-detail-font-family: var(--clippy-token-detail-font-family, var(--basis-text-font-family-default));
    --_clippy-token-detail-font-size: var(--clippy-token-detail-font-size, var(--basis-text-font-size-md));
    --_clippy-token-detail-line-height: var(--clippy-token-detail-line-height, var(--basis-text-line-height-md));
    --_clippy-token-detail-key-color: var(--clippy-token-detail-key-color, var(--_clippy-token-detail-color));
    --_clippy-token-detail-key-font-weight: var(
      --clippy-token-detail-key-font-weight,
      var(--basis-text-font-weight-bold)
    );
    --utrecht-data-list-item-key-color: var(--_clippy-token-detail-key-color);
    --utrecht-data-list-item-key-font-weight: var(--_clippy-token-detail-key-font-weight);
    --utrecht-data-list-rows-gap: var(--basis-space-row-md);
    --utrecht-data-list-rows-item-margin-block-start: var(--basis-space-row-lg);

    color: var(--_clippy-token-detail-color);
    font-family: var(--_clippy-token-detail-font-family);
    font-size: var(--_clippy-token-detail-font-size);
    line-height: var(--_clippy-token-detail-line-height);
  }

  .clippy-token-detail__definition {
    align-items: start;
    display: flex;
    gap: var(--basis-space-row-xs);
  }

  /**
   * Shift the toggletip up by it's own padding to align visually with the definition text without disturbing spacing flow
   */
  clippy-toggletip {
    display: inline-block;
    margin-block-start: calc(var(--nl-button-icon-only-padding-block-start) * -1);
  }
`;
