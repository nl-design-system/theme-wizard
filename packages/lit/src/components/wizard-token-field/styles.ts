import { css } from 'lit';

export default css`
  :host {
    border-radius: 4px;
    display: block;
  }

  :host(.theme-validation-highlight) {
    animation: theme-validation-glow 2000ms ease-out forwards;
  }

  @keyframes theme-validation-glow {
    0% {
      box-shadow: 0 0 0 2px rgb(0 0 0 / 100%);
    }
    15%,
    65% {
      box-shadow: 0 0 0 2px rgb(0 0 0 / 60%);
    }
    100% {
      box-shadow: none;
    }
  }

  .theme-error {
    background: #ffe5e5;
    color: #850000;
  }
`;
