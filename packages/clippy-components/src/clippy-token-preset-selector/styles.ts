import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --_clippy-token-preset-selector-preview-space-block: var(
      --clippy-token-preset-selector-preview-space-block,
      var(--basis-space-block-2xl)
    );
    --_clippy-token-preset-selector-preview-space-inline: var(
      --clippy-token-preset-selector-preview-space-inline,
      var(--basis-space-inline-xl)
    );
    --_clippy-token-preset-selector-lg-preview-space-block: var(
      --clippy-token-preset-selector-lg-preview-space-block,
      var(--basis-space-block-5xl)
    );
    --_clippy-token-preset-selector-lg-preview-space-inline: var(
      --clippy-token-preset-selector-lg-preview-space-inline,
      var(--basis-space-inline-3xl)
    );
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
    padding-block: var(--_clippy-token-preset-selector-preview-space-block);
    padding-inline: var(--_clippy-token-preset-selector-preview-space-inline);
    /*place-items: center;*/

    @container clippy-token-preset-selector (inline-size >= 48rem) {
      padding-block: var(--_clippy-token-preset-selector-lg-preview-space-block);
      padding-inline: var(--_clippy-token-preset-selector-lg-preview-space-inline);
    }
  }

  .clippy-token-preset-selector__wrap-controls {
    display: flex;
  }

  .clippy-token-preset-selector__select {
    border-inline: var(--basis-border-width-none);
    text-align: center;
  }
`;
