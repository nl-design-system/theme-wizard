import { css } from 'lit';

export const tokenLinkStyles = css`
  .theme-token-link {
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--basis-text-font-family-default);
    padding-inline: 0;
    text-align: start;
    text-decoration: underline;
  }

  .theme-error {
    text-decoration: wavy underline;
    text-decoration-color: var(--basis-color-negative-color-default);
  }
`;
