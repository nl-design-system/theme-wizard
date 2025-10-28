import linkCss from '@nl-design-system-candidate/link-css/link.css?inline';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('theme-wizard-link')
export class ThemeWizardLink extends LitElement {
  @property() href: string = '';

  static override readonly styles = [
    unsafeCSS(linkCss),
    css`
      .nl-link {
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
      .nl-link__label {
        text-decoration: underline;
      }
      .nl-link__icon {
        text-decoration: none;
        display: inline-flex;
      }
    `,
  ];

  override render() {
    return html`
      <a class="nl-link" href=${this.href}>
        <slot></slot>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-link': ThemeWizardLink;
  }
}
