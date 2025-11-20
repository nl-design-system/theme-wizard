import { css } from 'lit';

export default css`
  .theme-token-link {
    background: none;
    border: none;
    border-radius: 2px;
    color: var(--utrecht-link-color);
    text-decoration: underline;
  }

  .theme-token-link:focus:not(:focus-visible) {
    outline: none;
  }
`;
