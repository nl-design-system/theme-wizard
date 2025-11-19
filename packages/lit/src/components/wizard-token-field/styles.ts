import { css } from 'lit';

export default css`
  :host {
    display: block;
    padding: 4px;
    margin: -4px;
    border-radius: 4px;
  }

  :host(.validation-highlight) {
    animation: validation-glow 2s ease-out forwards;
  }

  @keyframes validation-glow {
    0% {
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 1);
    }
    15% {
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.6);
    }
    65% {
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.6);
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
