import { css } from 'lit';

export default css`
  .wizard-scraper__input {
    align-items: center;
    display: grid;
    gap: var(--basis-space-inline-md, 0.5rem);
    grid-template-columns: 1fr max-content;
  }

  .wizard-scraper__loaders {
    display: grid;
  }

  wizard-scraper-loader {
    grid-area: 1 / 1;
    opacity: 0%;
    transition: opacity 500ms ease-in-out;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }

    &.wizard-scraper__loader--active {
      opacity: 100%;
    }
  }
`;
