import linkListCss from '@utrecht/link-list-css/dist/index.css?inline';
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('theme-wizard-link-list')
export class ThemeWizardLinkList extends LitElement {
  @property({
    attribute: 'link-items',
    // Allow passing a JSON array string via attribute
    converter: {
      fromAttribute: (value: string | null) => {
        if (!value) return [];
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      },
    },
    type: Array,
  })
  linkItems: { href: string; text: string; icon?: string }[] = [];

  static override readonly styles = [unsafeCSS(linkListCss)];

  override render() {
    return html`<ul class="utrecht-link-list">
      ${this.linkItems.map((linkItem) => {
        return html` <li class="utrecht-link-list__item">
          <a class="utrecht-link-list__link" href=${linkItem.href}>
            <span
              style="--utrecht-icon-color: --var(utrecht-icon-color, --ma-color-indigo-10); --utrecht-icon-size: 14px"
            >
              <utrecht-icon-chevron-right></utrecht-icon-chevron-right>
            </span>

            <span>${linkItem.text}</span>
          </a>
        </li>`;
      })}
    </ul>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-wizard-link-list': ThemeWizardLinkList;
  }
}
