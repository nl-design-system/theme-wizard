import { css } from 'lit';

export const tokenLinkStyles = css`
  .theme-token-link {
    background: none;
    border: none;
    color: var(--utrecht-link-color);
    cursor: pointer;
    padding-inline: 0;
    text-decoration: underline;
  }

  .theme-token-link:hover {
    color: var(--utrecht-link-hover-color);
  }
`;
