import { css } from 'lit';

export default css`
  .theme-color-swatch {
    aspect-ratio: 2 / 1;
    border-block-end: 1px solid #000;
    border-block-start: 1px solid #000;
    inline-size: 100%;
    position: relative;
    print-color-adjust: exact;
  }

  .theme-color-swatch::after,
  .theme-color-swatch::before {
    background: #000;
    content: '';
    inline-size: 1px;
    inset-block: 0;
    position: absolute;
  }

  :host(:first-of-type) .theme-color-swatch::before {
    inset-inline-start: 0;
  }

  :host(:last-of-type) .theme-color-swatch::after {
    inset-inline-end: 0;
  }

  .theme-reference {
    font-size: 1rem;
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-end: 1rem;
  }
`;
