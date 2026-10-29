import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: flex;
  }

  :host {
    --_clippy-content-select-preview-space-block: var(
      --clippy-content-select-preview-space-block,
      var(--basis-space-block-2xl)
    );
    --_clippy-content-select-preview-space-inline: var(
      --clippy-content-select-preview-space-inline,
      var(--basis-space-inline-xl)
    );
    --_clippy-content-select-lg-preview-space-block: var(
      --clippy-content-select-lg-preview-space-block,
      var(--basis-space-block-5xl)
    );
    --_clippy-content-select-lg-preview-space-inline: var(
      --clippy-content-select-lg-preview-space-inline,
      var(--basis-space-inline-3xl)
    );
    --nl-button-border-radius: var(--utrecht-select-border-radius, var(--basis-border-radius-none));
    --nl-button-secondary-border-color: var(--utrecht-select-border-color, var(--basis-form-control-border-color));
    --utrecht-select-max-inline-size: none;

    flex-direction: column;
    row-gap: var(--basis-space-row-lg);
    container-name: clippy-content-select;
    container-type: inline-size;
  }

  .clippy-content-select__label {
    font-family: var(--basis-text-font-family-default);
  }

  .clippy-content-select__body {
    display: flex;
    flex-direction: column;
  }

  .clippy-content-select__preview {
    background-color: var(--basis-color-default-bg-document);
    border-block-end-width: var(--basis-border-width-none);
    border-block-start-width: var(--utrecht-select-border-width);
    border-color: var(--utrecht-select-border-color);
    border-inline-width: var(--utrecht-select-border-width);
    border-style: solid;
    display: grid;
    padding-block: var(--_clippy-content-select-preview-space-block);
    padding-inline: var(--_clippy-content-select-preview-space-inline);

    @container clippy-content-select (inline-size >= 48rem) {
      padding-block: var(--_clippy-content-select-lg-preview-space-block);
      padding-inline: var(--_clippy-content-select-lg-preview-space-inline);
    }
  }

  .clippy-content-select__wrap-controls {
    display: flex;
    order: 2;
  }

  .clippy-content-select__select {
    border-inline: var(--basis-border-width-none);
    text-align: center;
  }

  .clippy-content-select__control-button-previous {
    order: -1;
  }
`;
