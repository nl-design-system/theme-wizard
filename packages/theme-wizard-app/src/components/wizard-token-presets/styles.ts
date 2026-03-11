import { css } from 'lit';

export const wizardTokenCSS = css`
  :host {
    display: contents;
  }

  button {
    align-items: flex-start;
    border-width: var(--basis-border-width-sm);
    border-color: var(--basis-color-accent-1-border-subtle);
    border-style: solid;
    background-color: var(--basis-color-accent-1-bg-subtle);
    border-radius: var(--basis-border-radius-md);
    box-sizing: border-box;
    color: var(--basis-color-accent-1-color-default);
    cursor: pointer;
    display: block;
    min-block-size: 100%;
    width: 100%;
    margin-block-end: var(--basis-space-block-xl);
    outline: 0;
    padding-block: var(--basis-space-block-2xl);
    padding-inline: var(--basis-space-inline-2xl);
    position: relative;
    text-align: start;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      box-shadow 0.2s ease,
      color 0.2s ease;
  }

  .selected-icon {
    align-items: center;
    background-color: var(--basis-color-accent-1-bg-document);
    border-radius: 999px;
    color: var(--basis-color-accent-1-color-default);
    display: inline-flex;
    inset-block-start: var(--basis-space-block-md);
    inset-inline-end: var(--basis-space-inline-md);
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transform: scale(0.8);
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .selected-icon svg {
    block-size: 1.25rem;
    inline-size: 1.25rem;
  }

  button:where([aria-pressed='true']) {
    border-color: var(--basis-color-selected-border-default);
    border-style: solid;
    background-color: var(--basis-color-selected-bg-default);
    color: var(--basis-color-selected-color-default);
  }

  button:hover {
    border-color: var(--basis-color-accent-1-border-hover);
    border-style: solid;
    background-color: var(--basis-color-accent-1-bg-hover);
    color: var(--basis-color-accent-1-color-hover);
  }

  button:active {
    border-color: var(--basis-color-accent-1-border-active);
    border-style: solid;
    background-color: var(--basis-color-accent-1-bg-active);
    color: var(--basis-color-accent-1-color-active);
  }

  button:focus-visible {
    box-shadow: 0 0 0 var(--basis-border-width-md) var(--basis-color-accent-1-border-default);
  }

  button[aria-pressed='true'] {
    border-color: var(--basis-color-accent-1-border-default);
    background-color: var(--basis-color-accent-1-bg-default);
    box-shadow:
      inset 0 0 0 var(--basis-border-width-sm) var(--basis-color-accent-1-border-default),
      0 0 0 var(--basis-border-width-xs) color-mix(in srgb, var(--basis-color-accent-1-border-default) 24%, transparent);
    color: var(--basis-color-accent-1-color-default);
  }

  button[aria-pressed='true'] .selected-icon {
    opacity: 1;
    transform: scale(1);
  }
`;
