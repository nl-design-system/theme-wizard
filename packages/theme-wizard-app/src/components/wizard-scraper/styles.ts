import { css } from 'lit';

export default css`
  .wizard-scraper__input {
    align-items: center;
    display: grid;
    gap: var(--basis-space-inline-md, 0.5rem);
    grid-template-columns: 1fr max-content;
  }

  img {
    vertical-align: -0.2em;
  }
`;
