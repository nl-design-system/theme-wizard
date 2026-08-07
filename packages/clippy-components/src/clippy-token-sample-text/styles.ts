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
  }

  :host([truncate]) :where(.clippy-token-sample-text__dummy) {
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    overflow: clip;
  }
`;
