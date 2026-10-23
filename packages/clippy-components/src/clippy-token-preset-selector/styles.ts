import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  :host {
    --nl-button-border-radius: var(--utrecht-select-border-radius, var(--basis-border-radius-none));
    --nl-button-secondary-border-color: var(--utrecht-select-border-color, var(--basis-form-control-border-color));
    --utrecht-select-max-inline-size: none;

    container-name: clippy-token-preset-selector;
    container-type: inline-size;
  }

  .clippy-token-preset-selector__preview {
    background-color: var(--basis-color-default-bg-document);
    border-block-end-width: var(--basis-border-width-none);
    border-block-start-width: var(--utrecht-select-border-width);
    border-color: var(--utrecht-select-border-color);
    border-inline-width: var(--utrecht-select-border-width);
    border-style: solid;
    display: grid;
    padding-block: var(--basis-space-block-5xl);
    padding-inline: var(--basis-space-block-3xl);
    place-items: center;
  }

  .clippy-token-preset-selector__wrap-controls {
    display: flex;
  }

  .clippy-token-preset-selector__select {
    border-inline: var(--basis-border-width-none);
    text-align: center;
  }
`;
