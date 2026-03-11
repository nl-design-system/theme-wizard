import { css } from 'lit';

export default css`
  /**
   * Scroll detection taken from
   * https://www.bram.us/2023/09/16/solved-by-css-scroll-driven-animations-detect-if-an-element-can-scroll-or-not/
   *
   * Note: the scroll shadows only work in browsers supporting scroll-timeline
   * so the scroll shadows are progressive enhancement only (no Firefox).
   */
  .wizard-scroll-container {
    --_wizard-scroll-container-scrollbar-color: var(--basis-color-accent-1-color-default) transparent;
    --_wizard-scroll-container-scrollbar-width: thin;
    --_wizard-scroll-container-max-size: 70vh;
    --_wizard-scroll-container-shadow-size: var(--wizard-scroll-container-shadow-size, var(--basis-size-2xs));
    --_wizard-scroll-container-shadow-color: var(
      --wizard-scroll-container-shadow-color,
      rgb(from var(--basis-color-default-color-default) r g b / 25%)
    );

    animation: --wizard-scroll-container-detect-scroll;
    animation-fill-mode: none;
    animation-timeline: --_wizard-scroller-scroll-timeline;
    display: block;
    max-block-size: var(--wizard-scroll-container-max-size, var(--_wizard-scroll-container-max-size));
    overflow-y: auto;
    scroll-timeline: --_wizard-scroller-scroll-timeline y;
    scrollbar-color: var(--wizard-scroll-container-scrollbar-color, var(--_wizard-scroll-container-scrollbar-color));
    scrollbar-width: var(--wizard-scroll-container-scrollbar-width, var(--_wizard-scroll-container-scrollbar-width));
  }

  .wizard-scroll-container::before,
  .wizard-scroll-container::after {
    --_wizard-scroller-visibility-if-can-scroll: var(--_wizard-scroller-can-scroll) visible;
    --_wizard-scroller-visibility-if-cannot-scroll: hidden;

    animation-fill-mode: both;
    animation-name: --wizard-scroll-container-reveal;
    animation-timeline: --_wizard-scroller-scroll-timeline;
    block-size: var(--_wizard-scroll-container-shadow-size);
    content: '';
    display: block;
    inset-inline: 0;
    position: sticky;
    visibility: var(--_wizard-scroller-visibility-if-can-scroll, var(--_wizard-scroller-visibility-if-cannot-scroll));
    z-index: 1;
  }

  .wizard-scroll-container::before {
    animation-range: 1em 2em;
    background: radial-gradient(
      farthest-side at 50% 0,
      var(--_wizard-scroll-container-shadow-color),
      var(--basis-color-transparent)
    );
    inset-block-start: 0;
    margin-block-end: calc(-1 * var(--_wizard-scroll-container-shadow-size));
  }

  .wizard-scroll-container::after {
    animation-direction: reverse;
    animation-range: calc(100% - 2em) calc(100% - 1em);
    background: radial-gradient(
      farthest-side at 50% 100%,
      var(--_wizard-scroll-container-shadow-color),
      var(--basis-color-transparent)
    );
    inset-block-end: 0;
    margin-block-start: calc(-1 * var(--_wizard-scroll-container-shadow-size));
  }

  @keyframes --wizard-scroll-container-reveal {
    0% {
      opacity: 0%;
    }
    100% {
      opacity: 100%;
    }
  }

  @keyframes --wizard-scroll-container-detect-scroll {
    from,
    to {
      --_wizard-scroller-can-scroll: ;
    }
  }
`;
