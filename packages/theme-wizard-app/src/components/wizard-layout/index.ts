import maTheme from '@nl-design-system-community/ma-design-tokens/dist/theme.css?inline';
import linkCss from '@utrecht/link-css/dist/index.css?inline';
import { html, LitElement, unsafeCSS, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { t } from '../../i18n';
import '../sidebar/sidebar';
import '../wizard-logo';
import styles from './styles';

const tag = 'wizard-layout';

// Declare the custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardLayout;
  }
}

@customElement(tag)
export class WizardLayout extends LitElement {
  static override readonly styles = [unsafeCSS(maTheme), unsafeCSS(linkCss), styles];

  @state() private hasSidebar = false;

  private onSidebarSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.hasSidebar = slot.assignedElements().length > 0;
  }

  private isCurrentPage(href: string): boolean {
    try {
      const URLPatternConstructor = (globalThis as Record<string, unknown>)['URLPattern'] as
        | (new (init: { pathname: string }) => {
            test(url: URL | string): boolean;
          })
        | undefined;

      if (!URLPatternConstructor) return false;

      const pattern = new URLPatternConstructor({ pathname: href });
      const url = new URL(globalThis.location.href);
      return pattern.test(url);
    } catch {
      return false;
    }
  }

  override render() {
    return html`
      <div class="ma-theme wizard-layout ${classMap({ 'has-sidebar': this.hasSidebar })}">
        <div class="wizard-layout__logo">
          <a href="/">
            <wizard-logo></wizard-logo>
          </a>
        </div>

        <div class="wizard-layout__nav">
          <nav>
            <a
              href="/"
              class="utrecht-link utrecht-link--html-a wizard-layout__nav-item"
              aria-current=${this.isCurrentPage('/') ? 'page' : nothing}
            >
              ${t('nav.configure')}
            </a>
            <a
              href="/components"
              class="utrecht-link utrecht-link--html-a wizard-layout__nav-item"
              aria-current=${this.isCurrentPage('/components') ? 'page' : nothing}
            >
              Components
            </a>
            <a
              href="/style-guide"
              class="utrecht-link utrecht-link--html-a wizard-layout__nav-item"
              aria-current=${this.isCurrentPage('/style-guide') ? 'page' : nothing}
            >
              ${t('nav.styleGuide')}
            </a>
          </nav>

          <div class="wizard-layout__nav-slot">
            <slot name="nav"></slot>
          </div>
        </div>

        <wizard-sidebar class="wizard-layout__sidebar" ?hidden=${!this.hasSidebar}>
          <slot name="sidebar" @slotchange=${this.onSidebarSlotChange}></slot>
        </wizard-sidebar>

        <section class="wizard-layout__main">
          <slot name="main"></slot>
        </section>
      </div>
    `;
  }
}
