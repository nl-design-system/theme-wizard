import { css } from 'lit';

export default css`
  .template-color-swatch-grid,
  .template-color-swatch-grid__row {
    display: flex;
    flex-direction: column;
  }

  .template-color-swatch-grid__label {
    margin: 0;
    text-transform: capitalize;
  }

  .template-color-swatch-grid__swatches {
    display: flex;
  }

  .template-color-swatch-grid__swatches > template-color-swatch {
    flex: 0 0 calc(100% / var(--swatch-count, 1));
  }
`;
