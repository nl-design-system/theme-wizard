import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --nl-paragraph-font-size: var(
      --clippy-token-sample-text-font-size,
      var(--_clippy-internal-token-sample-text-font-size, var(--basis-text-font-size-md))
    );
    --nl-paragraph-font-family: var(
      --clippy-token-sample-text-font-family,
      var(--_clippy-internal-token-sample-text-font-family, var(--basis-text-font-family-default))
    );
    --nl-paragraph-font-weight: var(
      --clippy-token-sample-text-font-weight,
      var(--_clippy-internal-token-sample-text-font-weight, var(--basis-text-font-weight-default))
    );
    --nl-paragraph-line-height: var(
      --clippy-token-sample-text-line-height,
      var(--_clippy-internal-token-sample-text-line-height, var(--basis-text-line-height-md))
    );
    --nl-paragraph-color: var(
      --clippy-token-sample-text-color,
      var(--_clippy-internal-token-sample-text-color, var(--basis-color-default-color-document))
    );
    --_clippy-token-sample-text-border-highlight: var(--clippy-token-sample-text-border-highlight, #f2c9dc);
    --_clippy-token-sample-text-border-subtle: var(
      --clippy-token-sample-text-border-subtle,
      var(--basis-color-default-border-subtle)
    );
  }

  /**
   * When line-height is set, use pseudo elements to simulate the line height
   */
  :host(:where([line-height]:not([line-height='']))) :where(.clippy-token-sample-text__dummy) {
    isolation: isolate;
    position: relative;

    &::before,
    &::after {
      border-block-width: 1px;
      border-inline-width: 0;
      border-style: solid;
      content: '';
      display: block;
      inset-inline-end: 0;
      inset-inline-start: 0;
      position: absolute;
      z-index: -1;
    }

    &::before {
      border-color: var(--_clippy-token-sample-text-border-highlight);
      inset-block-end: 0;
      inset-block-start: 0;
    }

    &::after {
      block-size: 1ex;
      border-color: var(--_clippy-token-sample-text-border-subtle);
      inset-block-start: calc(1lh / 2 - 1ex / 2);
    }
  }

  /**
   * When truncate or line-height is set, truncate to a single line
   */
  :host(:where([truncate], [line-height]:not([line-height='']))) :where(.clippy-token-sample-text__dummy) {
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    overflow: clip;
  }
`;
