import linkStyles from '@nl-design-system-candidate/link-css/link.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-anchor-nav';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardAnchorNav;
  }
}

export type AnchorNavItem = {
  id: string;
  title: string;
};

@customElement(tag)
export class WizardAnchorNav extends LitElement {
  @property({ type: Array }) items: AnchorNavItem[] = [];

  static override readonly styles = [unsafeCSS(linkStyles), styles];

  override render() {
    return html`
      <ol class="wizard-anchor-nav">
        ${this.items.map(
          (item) => html`
            <li class="wizard-anchor-nav__item">
              <a class="nl-link wizard-anchor-nav__link" href="#${item.id}">${item.title}</a>
            </li>
          `,
        )}
      </ol>
    `;
  }
}
