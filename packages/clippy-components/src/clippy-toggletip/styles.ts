import { css } from 'lit';

export default css`
  :host {
    --clippy-toggletip-arrow-size: 0.5rem;
    --clippy-toggletip-background-color: var(--basis-color-default-inverse-bg-document);
    --clippy-toggletip-border-radius: var(--basis-border-radius-sm);
    --clippy-toggletip-color: var(--basis-color-default-inverse-color-default);
    --clippy-toggletip-font-size: var(--basis-text-font-size-sm);
    --clippy-toggletip-line-height: var(--basis-text-line-height-sm);
    --clippy-toggletip-max-inline-size: 18rem;
    --clippy-toggletip-offset: var(--clippy-toggletip-arrow-size);
    --clippy-toggletip-padding-block: var(--basis-space-block-sm);
    --clippy-toggletip-padding-inline: var(--basis-space-inline-md);
    --clippy-toggletip-z-index: 10;

    display: inline-block;
    position: relative;
  }

  .clippy-toggletip {
    display: inline-flex;
    position: relative;
  }

  .clippy-toggletip__trigger {
    display: inline-flex;
  }

  .clippy-toggletip__popup {
    background-color: var(--clippy-toggletip-background-color);
    border-end-end-radius: var(--clippy-toggletip-border-radius);
    border-end-start-radius: var(--clippy-toggletip-border-radius);
    border-start-end-radius: var(--clippy-toggletip-border-radius);
    border-start-start-radius: var(--clippy-toggletip-border-radius);
    color: var(--clippy-toggletip-color);
    font-size: var(--clippy-toggletip-font-size);
    inline-size: max-content;
    isolation: isolate;
    line-height: var(--clippy-toggletip-line-height);
    max-inline-size: var(--clippy-toggletip-max-inline-size);
    opacity: 0%;
    padding-block: var(--clippy-toggletip-padding-block);
    padding-inline: var(--clippy-toggletip-padding-inline);
    pointer-events: none;
    position: absolute;
    transition:
      opacity 120ms ease,
      visibility 120ms ease;
    visibility: hidden;
    z-index: var(--clippy-toggletip-z-index);
  }

  .clippy-toggletip__popup::before {
    background-color: inherit;
    block-size: var(--clippy-toggletip-arrow-size);
    border-block-end: none;
    border-block-start: inherit;
    border-inline-end: inherit;
    border-inline-start: none;
    content: '';
    inline-size: var(--clippy-toggletip-arrow-size);
    position: absolute;
    transform: rotate(45deg);
    z-index: -1;
  }

  .clippy-toggletip--block-start .clippy-toggletip__popup {
    inset-block-end: calc(100% + var(--clippy-toggletip-offset));
    inset-inline-start: 50%;
    transform: translate(-50%, 0.25rem);
  }

  .clippy-toggletip--block-start .clippy-toggletip__popup::before {
    inset-block-start: calc(100% - var(--clippy-toggletip-arrow-size) / 2);
    inset-inline-start: calc(50% - var(--clippy-toggletip-arrow-size) / 2);
  }

  .clippy-toggletip--inline-end .clippy-toggletip__popup {
    inset-block-start: 50%;
    inset-inline-start: calc(100% + var(--clippy-toggletip-offset));
    transform: translate(-0.25rem, -50%);
  }

  .clippy-toggletip--inline-end .clippy-toggletip__popup::before {
    inset-block-start: calc(50% - var(--clippy-toggletip-arrow-size) / 2);
    inset-inline-start: calc(var(--clippy-toggletip-arrow-size) / -2);
    transform: rotate(-135deg);
  }

  .clippy-toggletip--block-end .clippy-toggletip__popup {
    inset-block-start: calc(100% + var(--clippy-toggletip-offset));
    inset-inline-start: 50%;
    transform: translate(-50%, -0.25rem);
  }

  .clippy-toggletip--block-end .clippy-toggletip__popup::before {
    inset-block-start: calc(var(--clippy-toggletip-arrow-size) / -2);
    inset-inline-start: calc(50% - var(--clippy-toggletip-arrow-size) / 2);
    transform: rotate(225deg);
  }

  .clippy-toggletip--inline-start .clippy-toggletip__popup {
    inset-block-start: 50%;
    inset-inline-end: calc(100% + var(--clippy-toggletip-offset));
    transform: translate(0.25rem, -50%);
  }

  .clippy-toggletip--inline-start .clippy-toggletip__popup::before {
    inset-block-start: calc(50% - var(--clippy-toggletip-arrow-size) / 2);
    inset-inline-end: calc(var(--clippy-toggletip-arrow-size) / -2);
    transform: rotate(45deg);
  }

  :host(:hover) .clippy-toggletip__popup,
  :host(:focus-within) .clippy-toggletip__popup {
    opacity: 100%;
    visibility: visible;
  }
`;
