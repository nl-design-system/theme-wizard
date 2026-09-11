import { css } from 'lit';

export default css`
  :host(:not([hidden])) {
    display: contents;
  }

  :host {
    --denhaag-side-navigation-mobile-display: block;
  }

  /* ============================================
   Den Haag overrides
   Same as the new NLDS website: https://github.com/nl-design-system/documentatie/blob/5f1e57f4d601fd3926ada8f968d137366e263825/packages/website/src/styles/missing-tokens.css#L160
   ============================================ */
  .denhaag-side-navigation__link {
    /* denhaag.side-navigation.link.padding-inline-end */
    padding-inline-end: var(--basis-space-inline-xl);

    /* denhaag.side-navigation.link.padding-inline-start */
    padding-inline-start: var(--basis-space-inline-xl);

    @media (forced-colors: none) {
      border-color: transparent;
      border-inline-start-style: solid;
      border-inline-start-width: var(--basis-border-width-lg);
      translate: calc(var(--basis-border-width-lg) * -1);
    }
  }

  .denhaag-side-navigation__link--current {
    /* denhaag.side-navigation.link.current.background-color */
    background-color: var(--basis-color-accent-1-bg-default);

    /* denhaag.side-navigation.link.current.border-color */
    border-color: var(--basis-color-accent-1-border-default);

    @media (forced-colors: active) {
      border-inline-start-style: solid;
      border-inline-start-width: var(--basis-border-width-lg);
    }
  }

  .denhaag-side-navigation__link:hover {
    text-decoration: underline;
  }

  .denhaag-side-navigation__link:focus-visible {
    /* denhaag.side-navigation.link.focus.background-color */
    background-color: var(--basis-focus-background-color);

    /* denhaag.side-navigation.link.focus.color */
    color: var(--basis-focus-color);
  }

  /* The proper fix would be to change the Den Haag component to not render a <a> element when there is no href in the data */
  .denhaag-side-navigation__link:not([href]) {
    color: unset !important;
    cursor: default !important;
    text-decoration: none !important;
  }

  .denhaag-side-navigation__expand-button:hover {
    /* denhaag.side-navigation.expand-button.hover.color */
    --denhaag-icon-button-hover-color: var(--basis-color-action-1-color-hover);

    /* denhaag.side-navigation.expand-button.hover.color */
    background-color: var(--basis-color-action-1-bg-hover);
  }

  .denhaag-side-navigation__expand-button:active {
    /* denhaag.side-navigation.expand-button.active.color */
    --denhaag-icon-button-hover-color: var(--basis-color-action-1-color-active);

    /* denhaag.side-navigation.expand-button.active.background-color */
    background-color: var(--basis-color-action-1-bg-active);
  }
  .denhaag-side-navigation__expand-button:focus-visible {
    /* denhaag.side-navigation.expand-button.focus.background-color */
    background-color: var(--basis-focus-background-color);

    /* denhaag.side-navigation.expand-button.focus.border */
    border: var(--denhaag-focus-border);

    /* denhaag.side-navigation.expand-button.focus.color */
    color: var(--basis-focus-color);
  }

  .denhaag-side-navigation__expand-button {
    svg {
      block-size: var(--basis-size-icon-md);
      inline-size: var(--basis-size-icon-md);
      transition: transform 250ms ease-in-out;
    }
  }

  .denhaag-side-navigation__expand-button--expanded {
    transform: none !important;

    svg {
      transform: rotate(-180deg);
    }
  }
`;
