import { css } from 'lit';

export default css`
  .wizard-scraper-loader {
    --wizard-scraper-loader-animation-duration: 2000ms;
    --wizard-scraper-loader-animation-timing-function: ease-in-out;
    --wizard-scraper-loader-emoji-size: calc(var(--basis-text-font-size-4xl) * 2);

    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    text-align: center;
  }

  .wizard-scraper-loader__text {
    font-size: var(--basis-text-font-size-lg);
  }

  .wizard-scraper-loader__emoji {
    display: flex;
    font-size: var(--wizard-scraper-loader-emoji-size);
    justify-content: center;
    position: relative;
  }

  @keyframes --wizard-fade-in-out {
    0%,
    100% {
      opacity: 0%;
    }
    50% {
      opacity: 100%;
    }
  }

  .wizard-scraper-loader__emoji::after {
    animation-duration: var(--wizard-scraper-loader-animation-duration);
    animation-iteration-count: infinite;
    animation-name: --wizard-shadow;
    animation-timing-function: var(--wizard-scraper-loader-animation-timing-function);
    background: rgb(0 0 0 / 30%);
    block-size: var(--basis-size-sm);
    border-radius: 50%;
    content: '';
    filter: blur(4px);
    inline-size: var(--wizard-scraper-loader-emoji-size);
    inset-block-end: 0;
    inset-inline-start: 50%;
    position: absolute;
    transform: translateX(-50%);

    @media (prefers-reduced-motion: reduce) {
      animation-name: --wizard-fade-in-out;
    }
  }

  @keyframes --wizard-shadow {
    0%,
    100% {
      opacity: 60%;
      transform: translateX(-50%) scaleX(1);
    }
    50% {
      opacity: 20%;
      transform: translateX(-50%) scaleX(0.6);
    }
  }

  .wizard-scraper-loader__emoji-icon {
    animation-duration: var(--wizard-scraper-loader-animation-duration);
    animation-iteration-count: infinite;
    animation-name: --wizard-float;
    animation-timing-function: var(--wizard-scraper-loader-animation-timing-function);
    display: block;

    @media (prefers-reduced-motion: reduce) {
      animation-name: --wizard-fade-in-out;
    }
  }

  @keyframes --wizard-float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.25em);
    }
  }

  .wizard-scraper-loader__ellipsis {
    animation-duration: var(--wizard-scraper-loader-animation-duration);
    animation-iteration-count: infinite;
    animation-name: --wizard-ellipsis-jump;
    animation-timing-function: var(--wizard-scraper-loader-animation-timing-function);
    display: inline-block;
    letter-spacing: -0.1em;

    &:nth-child(2) {
      animation-delay: 100ms;
    }

    &:nth-child(3) {
      animation-delay: 200ms;
    }

    @media (prefers-reduced-motion: reduce) {
      animation-name: --wizard-fade-in-out;
    }
  }

  @keyframes --wizard-ellipsis-jump {
    0%,
    33%,
    100% {
      transform: translateY(0);
    }
    16% {
      transform: translateY(-0.35em);
    }
  }
`;
