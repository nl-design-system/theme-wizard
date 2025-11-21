import { css } from 'lit';

export const tokenLinkStyles = css`
  .theme-token-link {
    background: none;
    border: none;
    padding-inline: 0;
    color: var(--utrecht-link-color);
    cursor: pointer;
    text-decoration: underline;
  }

  .theme-token-link:hover {
    color: var(--utrecht-link-hover-color);
  }
`;
