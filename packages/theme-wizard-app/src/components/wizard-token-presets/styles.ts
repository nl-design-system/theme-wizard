import { css } from 'lit';

export const wizardTokenCSS = css`
  :host {
    display: contents;
  }

  button {
    background-color: var(--basis-color-accent-1-bg-subtle);
    border-color: var(--basis-color-accent-1-border-subtle);
    border-style: solid;
    border-width: var(--basis-border-width-sm);
    color: var(--basis-color-accent-1-color-default);
    display: block;
    inline-size: 100%;
    margin-block-end: var(--basis-space-block-xl);
    padding-block: var(--basis-space-block-2xl);
    padding-inline: var(--basis-space-inline-2xl);
    text-align: start;
  }

  button:where([aria-pressed='true']) {
    background-color: var(--basis-color-selected-bg-default);
    border-color: var(--basis-color-selected-border-default);
    border-style: solid;
    color: var(--basis-color-selected-color-default);
  }

  button:hover {
    background-color: var(--basis-color-accent-1-bg-hover);
    border-color: var(--basis-color-accent-1-border-hover);
    border-style: solid;
    color: var(--basis-color-accent-1-color-hover);
  }

  button:active {
    background-color: var(--basis-color-accent-1-bg-active);
    border-color: var(--basis-color-accent-1-border-active);
    border-style: solid;
    color: var(--basis-color-accent-1-color-active);
  }
`;
