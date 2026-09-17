import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: block;
  }

  :host {
    --_clippy-page-header-background-color: var(
      --clippy-page-header-background-color,
      var(--basis-color-default-bg-document)
    );
    --_clippy-page-header-foreground-color: var(
      --clippy-page-header-foreground-color,
      var(--basis-color-default-color-document)
    );
    --_clippy-page-header-border-block-end-width: var(
      --clippy-page-header-border-block-end-width,
      var(--basis-border-width-lg)
    );
    background-color: var(--_clippy-page-header-background-color);
    color: var(--_clippy-page-header-foreground-color);
    border-block-end-width: var(--_clippy-page-header-border-block-end-width);
    border-block-end-style: solid;
    border-block-end-color: var(--basis-color-accent-1-border-default);
  }

  :host([inverse]) {
    --clippy-page-header-background-color: var(--basis-color-accent-1-inverse-bg-default);
    --clippy-page-header-border-block-end-width: 0px;
    --clippy-page-header-foreground-color: var(--basis-color-accent-1-inverse-color-default);
  }
`;
