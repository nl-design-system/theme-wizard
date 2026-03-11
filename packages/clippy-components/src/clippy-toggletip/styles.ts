import { css } from 'lit';

export default css`
  :host {
    --clippy-toggletip-arrow-size: 0.71428571em;
    --clippy-toggletip-background-color: var(--basis-color-default-inverse-bg-document);
    --clippy-toggletip-border-radius: var(--basis-border-radius-sm, 0.28571429rem);
    --clippy-toggletip-color: var(--basis-color-default-inverse-color-default, #fff);
    --clippy-toggletip-font-size: var(--basis-text-font-size-sm, 0.875rem);
    --clippy-toggletip-line-height: var(--basis-text-line-height-sm, 1.3);
    --clippy-toggletip-max-inline-size: 18rem;
    --clippy-toggletip-offset: var(--basis-space-block-xs, 0.6rem);
    --clippy-toggletip-padding-block: var(--basis-space-block-sm, 0.833em);
    --clippy-toggletip-padding-inline: var(--basis-space-inline-md, 1em);
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
    line-height: var(--clippy-toggletip-line-height);
    max-inline-size: var(--clippy-toggletip-max-inline-size);
    opacity: 0;
    padding-block: var(--clippy-toggletip-padding-block);
    padding-inline: var(--clippy-toggletip-padding-inline);
    pointer-events: none;
    position: absolute;
    transition: opacity 0.12s ease, transform 0.12s ease, visibility 0.12s ease;
    visibility: hidden;
    z-index: var(--clippy-toggletip-z-index);
  }

  .clippy-toggletip__popup::before {
    background-color: inherit;
    border-block-end: none;
    border-block-start: inherit;
    border-inline-end: inherit;
    border-inline-start: none;
    block-size: var(--clippy-toggletip-arrow-size);
    content: '';
    inline-size: var(--clippy-toggletip-arrow-size);
    position: absolute;
    transform: rotate(45deg);
  }

  :host(:hover) .clippy-toggletip__popup {
    opacity: 1;
    visibility: visible;
  }

  .clippy-toggletip--top .clippy-toggletip__popup {
    inset-block-end: calc(100% + var(--clippy-toggletip-offset));
    inset-inline-start: 50%;
    transform: translate(-50%, 0.25rem);
  }

  .clippy-toggletip--top .clippy-toggletip__popup::before {
    inset-block-start: calc(100% - 0.35em);
    inset-inline-start: calc(50% - 0.35em);
  }

  .clippy-toggletip--right .clippy-toggletip__popup {
    inset-block-start: 50%;
    inset-inline-start: calc(100% + var(--clippy-toggletip-offset));
    transform: translate(-0.25rem, -50%);
  }

  .clippy-toggletip--right .clippy-toggletip__popup::before {
    inset-block-start: calc(50% - 0.35em);
    inset-inline-start: calc(-0.35em);
    transform: rotate(-135deg);
  }

  .clippy-toggletip--bottom .clippy-toggletip__popup {
    inset-block-start: calc(100% + var(--clippy-toggletip-offset));
    inset-inline-start: 50%;
    transform: translate(-50%, -0.25rem);
  }

  .clippy-toggletip--bottom .clippy-toggletip__popup::before {
    inset-block-start: calc(-0.35em);
    inset-inline-start: calc(50% - 0.35em);
    transform: rotate(225deg);
  }

  .clippy-toggletip--left .clippy-toggletip__popup {
    inset-block-start: 50%;
    inset-inline-end: calc(100% + var(--clippy-toggletip-offset));
    transform: translate(0.25rem, -50%);
  }

  .clippy-toggletip--left .clippy-toggletip__popup::before {
    inset-block-start: calc(50% - 0.35em);
    inset-inline-end: calc(-0.35em);
    transform: rotate(45deg);
  }

  :host(:hover) .clippy-toggletip--top .clippy-toggletip__popup,
  :host(:focus-within) .clippy-toggletip--top .clippy-toggletip__popup {
    transform: translate(-50%, 0);
  }

  :host(:hover) .clippy-toggletip--right .clippy-toggletip__popup,
  :host(:focus-within) .clippy-toggletip--right .clippy-toggletip__popup {
    transform: translate(0, -50%);
  }

  :host(:hover) .clippy-toggletip--bottom .clippy-toggletip__popup,
  :host(:focus-within) .clippy-toggletip--bottom .clippy-toggletip__popup {
    transform: translate(-50%, 0);
  }

  :host(:hover) .clippy-toggletip--left .clippy-toggletip__popup,
  :host(:focus-within) .clippy-toggletip--left .clippy-toggletip__popup {
    transform: translate(0, -50%);
  }
`;
