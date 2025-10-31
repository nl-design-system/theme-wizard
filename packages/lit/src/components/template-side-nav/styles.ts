import { css } from 'lit';

// Note: the side-navigation library uses --denhaag-side-navigation-* vars,
// while our base theme (theme.css) provides --denhaag-sidenav-* tokens.
// This file maps library vars to base tokens so the component picks up theme values.
export default css`
  :host {
    /* Container */
    --denhaag-side-navigation-display: block;
    --denhaag-side-navigation-flex-direction: column;
    --denhaag-side-navigation-row-gap: var(--denhaag-sidenav-row-gap);
    --denhaag-side-navigation-min-width: var(--denhaag-sidenav-min-width);

    /* Items */
    --denhaag-side-navigation-item-font-family: var(--denhaag-sidenav-item-font-family);
    --denhaag-side-navigation-item-font-size: var(--denhaag-sidenav-item-font-size);
    --denhaag-side-navigation-item-font-weight: var(--denhaag-sidenav-item-font-weight);

    /* Links */
    --denhaag-side-navigation-link-color: var(--denhaag-sidenav-link-color);
    --denhaag-side-navigation-link-padding-block-start: var(--denhaag-sidenav-link-padding-block-start);
    --denhaag-side-navigation-link-padding-block-end: var(--denhaag-sidenav-link-padding-block-end);

    /* Link states */
    --denhaag-side-navigation-link-active-color: var(--denhaag-sidenav-link-active-color);
    --denhaag-side-navigation-link-active-font-weight: var(--denhaag-sidenav-link-active-font-weight);
  }

  @media (width <= 1023px) {
    :host {
      --denhaag-side-navigation-mobile-display: block;
    }
  }
`;
