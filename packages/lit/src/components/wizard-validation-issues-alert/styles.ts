import { css } from 'lit';

export default css`
  .token-link {
    background: none;
    border: none;
    color: var(--utrecht-link-color);
    text-decoration: underline;
    padding: 0;
    border-radius: 2px;
  }

  .token-link:focus:not(:focus-visible) {
    outline: none;
  }
`;
