import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: grid;
    inline-size: fit-content;
  }

  :host {
    --_clippy-token-sample-spacing-color-inline: var(--basis-color-negative-bg-active);
    --_clippy-token-sample-spacing-color-block: var(--basis-color-negative-border-subtle);
    --_clippy-token-sample-spacing-color-text: var(--basis-color-positive-border-subtle);
    --_clippy-token-sample-spacing-color-row: var(--basis-color-info-border-subtle);
    --_clippy-token-sample-spacing-color-column: var(--basis-color-info-bg-active);
    --_clippy-token-sample-spacing-border-color: var(--basis-color-default-border-default);
    --_clippy-token-sample-spacing-background-color: var(
      --clippy-token-sample-spacing-background-color,
      var(--_clippy-token-sample-spacing-color-inline)
    );
    --_clippy-token-sample-spacing-size: var(--clippy-token-sample-spacing-size, 1rem);

    border-color: var(--_clippy-token-sample-spacing-border-color);
    border-style: solid;
    border-width: 1px;

    &::before,
    &::after {
      background-color: var(--_clippy-token-sample-spacing-background-color);
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
    padding-inline: var(--basis-space-inline-xs);
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
    --clippy-token-sample-spacing-background-color: var(--_clippy-token-sample-spacing-color-block);
  }

  :host([concept='text']) {
    --clippy-token-sample-spacing-background-color: var(--_clippy-token-sample-spacing-color-text);
  }

  :host([concept='column']) {
    --clippy-token-sample-spacing-background-color: var(--_clippy-token-sample-spacing-color-column);
  }

  :host([concept='row']) {
    --clippy-token-sample-spacing-background-color: var(--_clippy-token-sample-spacing-color-row);
  }
`;
