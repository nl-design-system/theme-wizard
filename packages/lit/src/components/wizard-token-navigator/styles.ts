import { css } from 'lit';

export const tokenLinkStyles = css`
  .theme-token-link {
    background: none;
    border: none;
    color: var(--utrecht-link-color);
    cursor: pointer;
    padding-inline: 0;
    text-align: start;
    text-decoration: underline;
  }

  .theme-token-link:hover {
    color: var(--utrecht-link-hover-color);
  }

  .theme-error {
    background: #ffe5e5;
    color: #850000;
  }

  .utrecht-form-field-error-message {
    position: relative;
  }

  .utrecht-form-field-error-message::before {
    background-color: red;
    block-size: 100%;
    content: '';
    inline-size: 2px;
    inset-inline-start: -0.5rem;
    position: absolute;
  }
`;
