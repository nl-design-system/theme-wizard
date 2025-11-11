import { css } from 'lit';

export default css`
  .template-color-swatch__container {
    display: flex;
    flex-direction: column;
  }

  .template-color-swatch {
    position: relative;
    inline-size: 100%;
    aspect-ratio: 2 / 1;
    border-block-start: 1px solid #000;
    border-block-end: 1px solid #000;
  }

  .template-color-swatch::after,
  .template-color-swatch::before {
    content: '';
    position: absolute;
    inset-block: 0;
    inline-size: 1px;
    background: #000;
  }

  :host(:first-of-type) .template-color-swatch::before {
    inset-inline-start: 0;
  }

  :host(:last-of-type) .template-color-swatch::after {
    inset-inline-end: 0;
  }

  .reference {
    font-size: 0.5rem;
    word-break: break-word;
    padding-inline-end: 1rem;
  }
`;
