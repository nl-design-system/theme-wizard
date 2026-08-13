import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --utrecht-data-list-item-key-color: var(--basis-color-default-color-document);
    --utrecht-data-list-item-key-font-weight: var(--basis-text-font-weight-bold);
    --utrecht-data-list-rows-gap: var(--basis-space-row-md);
    --utrecht-data-list-rows-item-margin-block-start: var(--basis-space-row-lg);

    color: var(--basis-color-default-color-document);
    font-family: var(--basis-text-font-family-default);
    font-size: var(--basis-text-font-size-md);
    line-height: var(--basis-text-line-height-md);
  }
`;
