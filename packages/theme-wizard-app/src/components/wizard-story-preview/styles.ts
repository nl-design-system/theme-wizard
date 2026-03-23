import { css } from 'lit';

export default css`
  :host:not([hidden]) {
    display: block;
  }

  .wizard-story-preview {
    background-color: var(--basis-color-default-bg-document);
    border-color: var(--basis-color-default-bg-hover);
    border-radius: var(--basis-border-radius-sm);
    border-style: solid;
    border-width: var(--basis-border-width-sm);
    box-shadow: var(--basis-color-default-bg-default) 0 1px 3px 0;
    box-sizing: border-box;
    display: block;
    inline-size: 100%;
    padding-block: var(--basis-space-block-4xl);
    padding-inline: var(--basis-space-inline-2xl);
    position: relative;
  }

  .wizard-story-preview--lg {
    border-radius: var(--basis-border-radius-lg);
    box-shadow:
      0 8px 16px 0 #0000000f,
      0 2px 4px 0 #00000014;
    padding-block: var(--basis-space-block-5xl);
    padding-inline: var(--basis-space-inline-4xl);
  }
`;
