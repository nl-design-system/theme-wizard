import { css } from 'lit';

export const wizardTokenCSS = css`
  :host {
    display: contents;
  }

  button {
    border-width: var(--basis-border-width-sm);
    border-color: var(--basis-color-accent-1-border-subtle);
    border-style: solid;
    background-color: var(--basis-color-accent-1-bg-subtle);
    color: var(--basis-color-accent-1-color-default);
    padding-inline: var(--basis-space-inline-2xl);
    padding-block: var(--basis-space-block-2xl);
    display: block;
    width: 100%;
    margin-block-end: var(--basis-space-block-xl);
    text-align: start;
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
`;
