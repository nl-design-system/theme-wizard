import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --_clippy-token-sample-border-size: var(--clippy-token-sample-border-size, var(--basis-size-lg));
    --_clippy-token-sample-border-radius: var(
      --clippy-token-sample-border-radius,
      var(--_clippy-internal-token-sample-border-radius, 0)
    );
    --_clippy-token-sample-border-width: var(
      --clippy-token-sample-border-width,
      var(--_clippy-internal-token-sample-border-width, 1px)
    );

    background-color: var(--basis-color-default-bg-document);
    block-size: var(--_clippy-token-sample-border-size);
    border-color: var(--basis-color-default-border-subtle);
    border-style: solid;
    border-width: var(--basis-border-width-sm);
    color: var(--basis-color-default-color-document);
    inline-size: var(--_clippy-token-sample-border-size);
    overflow: hidden;
    position: relative;
  }

  .clippy-token-sample-border__dummy {
    block-size: var(--_clippy-token-sample-border-size);
    border-color: currentColor;
    border-start-start-radius: var(--_clippy-token-sample-border-radius);
    border-style: solid;
    border-width: var(--_clippy-token-sample-border-width);
    inline-size: var(--_clippy-token-sample-border-size);
    inset-block-start: 50%;
    inset-inline-start: 50%;
    position: absolute;
    translate: calc(var(--_clippy-token-sample-border-width) / 2 * -1) -50%;
  }

  :host([border-radius]:not([border-radius=''])) {
    :where(.clippy-token-sample-border__dummy) {
      inset-block-start: calc(var(--_clippy-token-sample-border-size) / 4);
      inset-inline-start: calc(var(--_clippy-token-sample-border-size) / 4);
      translate: 0 0;
    }
  }
`;
