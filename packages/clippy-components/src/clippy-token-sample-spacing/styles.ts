import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: grid;
    inline-size: fit-content;
  }

  :host {
    --_clippy-token-sample-spacing-size: var(
      --clippy-token-sample-spacing-size,
      var(--_clippy-internal-token-sample-spacing-size, 1rem)
    );
    --_clippy-token-sample-spacing-border-color: var(--basis-color-default-border-default);
    /* Background colors */
    --_clippy-token-sample-spacing-bg-color-inline: var(--clippy-token-sample-spacing-bg-color-inline, #f2c9dc);
    --_clippy-token-sample-spacing-bg-color-block: var(--clippy-token-sample-spacing-bg-color-block, #e289b1);
    --_clippy-token-sample-spacing-bg-color-text: var(--clippy-token-sample-spacing-bg-color-text, #4ad571);
    --_clippy-token-sample-spacing-bg-color-row: var(--clippy-token-sample-spacing-bg-color-row, #40adef);
    --_clippy-token-sample-spacing-bg-color-column: var(--clippy-token-sample-spacing-bg-color-column, #abdbf8);
    --_clippy-token-sample-spacing-bg-color: var(
      --clippy-token-sample-spacing-bg-color,
      var(--_clippy-token-sample-spacing-bg-color-inline)
    );

    border-color: var(--_clippy-token-sample-spacing-border-color);
    border-style: solid;
    border-width: 1px;

    &::before,
    &::after {
      background-color: var(--_clippy-token-sample-spacing-bg-color);
      content: '';
      inline-size: var(--_clippy-token-sample-spacing-size);
    }

    &::before {
      grid-area: start;
    }

    &::after {
      grid-area: end;
    }
  }

  .clippy-token-sample-spacing__dummy {
    background-color: var(--basis-color-default-bg-document);
    border-color: var(--_clippy-token-sample-spacing-border-color);
    border-style: solid;
    border-width: 0;
    font-family: var(--basis-text-font-family-default);
    font-size: var(--basis-text-font-size-md);
    line-height: var(--basis-text-line-height-md);

    &:not(:has(svg)) {
      padding-inline: var(--basis-space-inline-xs);
    }

    :where(clippy-icon) {
      --clippy-icon-size: var(--basis-text-line-height-md);
    }

    :where(clippy-icon, svg) {
      display: block;
    }
  }

  :host([concept='inline']),
  :host([concept='text']),
  :host([concept='column']) {
    grid-template-areas: 'start center end';
    grid-template-columns: repeat(3, auto);
  }

  :host([concept='block']),
  :host([concept='row']) {
    grid-template-areas:
      'start'
      'center'
      'end';
    grid-template-rows: repeat(3, auto);

    &::before,
    &::after {
      block-size: var(--_clippy-token-sample-spacing-size);
      inline-size: auto;
    }
  }

  /**
   * Display the spacing between two components/text nodes
   */
  :host([concept='column']),
  :host([concept='row']),
  :host([concept='text']) {
    &::before {
      grid-area: center;
    }

    &::after {
      display: none;
    }
  }

  /**
   * Move border to the label to illustrate spacing between two components
   */
  :host([concept='column']),
  :host([concept='row']) {
    border-width: 0;

    :where(.clippy-token-sample-spacing__dummy) {
      border-width: 1px;
    }
  }

  :host([concept='block']) {
    --clippy-token-sample-spacing-bg-color: var(--_clippy-token-sample-spacing-bg-color-block);
  }

  :host([concept='text']) {
    --clippy-token-sample-spacing-bg-color: var(--_clippy-token-sample-spacing-bg-color-text);
  }

  :host([concept='column']) {
    --clippy-token-sample-spacing-bg-color: var(--_clippy-token-sample-spacing-bg-color-column);
  }

  :host([concept='row']) {
    --clippy-token-sample-spacing-bg-color: var(--_clippy-token-sample-spacing-bg-color-row);
  }

  /**
   * Use the system's accent color for the background when the user has enabled forced colors
   */
  @media (forced-colors: active) {
    :host {
      --_clippy-token-sample-spacing-bg-color: AccentColor;

      &::before,
      &::after {
        forced-color-adjust: none;
      }
    }
  }
`;
