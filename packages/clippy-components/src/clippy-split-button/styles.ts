import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: inline-flex;
  }

  :host {
    --clippy-split-button-border-radius: var(--nl-button-border-radius);
    --clippy-split-button-divider-color: var(--basis-color-action-1-border-subtle);
    --clippy-split-button-divider-width: 1px;
    --clippy-split-button-menu-background-color: var(--basis-color-default-bg-document);
    --clippy-split-button-menu-border-color: var(--basis-color-default-border-default);
    --clippy-split-button-menu-border-radius: var(--basis-border-radius-md);
    --clippy-split-button-menu-border-width: var(--basis-border-width-sm);
    --clippy-split-button-menu-box-shadow: var(--basis-box-shadow-md);
    --clippy-split-button-menu-item-border-radius: 0;

    anchor-name: --clippy-split-button;
  }

  /* border-radius takes its corners in physical order: top-left, top-right, bottom-right, bottom-left. */
  ::slotted([slot='start']) {
    --nl-button-border-radius: var(--clippy-split-button-border-radius) 0 0 var(--clippy-split-button-border-radius);
  }

  /* Raised above the end button, so the divider covers its border where they overlap. */
  ::slotted([slot='start'][purpose='primary']) {
    border-inline-end: var(--clippy-split-button-divider-width) solid var(--clippy-split-button-divider-color);
    display: inline-flex;
    position: relative;
    z-index: 2;
  }

  /* Overlap the adjacent borders so they form a single divider. */
  ::slotted([slot='end']) {
    --_clippy-split-button-end-border-width: var(--nl-button-primary-border-width, 1px);
    --nl-button-border-radius: 0 var(--clippy-split-button-border-radius) var(--clippy-split-button-border-radius) 0;

    margin-inline-start: calc(-1 * var(--_clippy-split-button-end-border-width));
  }

  ::slotted([slot='end'][purpose='secondary']) {
    --_clippy-split-button-end-border-width: var(--nl-button-secondary-border-width, 1px);
  }

  ::slotted(:is([slot='start'], [slot='end']):is(:hover, :focus-within)) {
    position: relative;
    z-index: 1;
  }

  :host(:dir(rtl)) ::slotted([slot='start']) {
    --nl-button-border-radius: 0 var(--clippy-split-button-border-radius) var(--clippy-split-button-border-radius) 0;
  }

  :host(:dir(rtl)) ::slotted([slot='end']) {
    --nl-button-border-radius: var(--clippy-split-button-border-radius) 0 0 var(--clippy-split-button-border-radius);
  }

  ::slotted([slot='menu']) {
    background-color: var(--clippy-split-button-menu-background-color);
    border-color: var(--clippy-split-button-menu-border-color);
    border-radius: var(--clippy-split-button-menu-border-radius);
    border-style: solid;
    border-width: var(--clippy-split-button-menu-border-width);
    box-shadow: var(--clippy-split-button-menu-box-shadow);
    box-sizing: border-box;
    inset-block: auto;
    inset-inline: auto;
    list-style-type: none;
    margin-block: 0;
    margin-inline: 0;
    min-inline-size: anchor-size(inline);
    overflow: hidden;
    padding-block: 0;
    padding-inline: 0;
    position: absolute;
    position-anchor: --clippy-split-button;
    position-area: block-end span-inline-end;
    position-try-fallbacks:
      flip-block,
      flip-inline,
      flip-block flip-inline;
    z-index: 1;
  }
`;
