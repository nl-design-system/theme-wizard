import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --_clippy-token-sample-border-size: var(--basis-size-lg);
    --_clippy-token-sample-border-dummy-size: var(--_clippy-token-sample-border-size);
    --_clippy-token-sample-border-radius: var(
      --clippy-token-sample-border-radius,
      var(--_clippy-internal-token-sample-border-radius, 0)
    );
    --_clippy-token-sample-border-width: var(
      --clippy-token-sample-border-width,
      var(--_clippy-internal-token-sample-border-width, 0)
    );

    box-sizing: border-box;
    inline-size: var(--_clippy-token-sample-border-size);
    block-size: var(--_clippy-token-sample-border-size);
    border-width: var(--basis-border-width-sm);
    border-style: solid;
    border-color: var(--basis-color-default-border-subtle);
    position: relative;
    overflow: hidden;
    background-color: var(--basis-color-default-bg-document);
    color: var(--basis-color-default-color-document);
  }

  .clippy-token-sample-border__dummy {
    inline-size: var(--_clippy-token-sample-border-dummy-size);
    block-size: var(--_clippy-token-sample-border-dummy-size);
    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    translate: calc(var(--_clippy-token-sample-border-width) / 2 * -1) -50%;
    background-color: transparent;
    border-width: var(--_clippy-token-sample-border-width);
    border-style: solid;
    border-color: currentColor;
    border-start-start-radius: var(--_clippy-token-sample-border-radius);
  }

  :host([border-radius]:not([border-radius^='0'], [border-radius=''])) {
    :where(.clippy-token-sample-border__dummy) {
      inset-inline-start: calc(var(--_clippy-token-sample-border-size) / 4);
      inset-block-start: calc(var(--_clippy-token-sample-border-size) / 4);
      translate: 0 0;
    }
  }
`;
