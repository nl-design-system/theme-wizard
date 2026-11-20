import { type ClippyDrawer } from '@nl-design-system-community/clippy-components/clippy-drawer';
import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import AccessibleIcon from '@tabler/icons/outline/accessible.svg?raw';
import { html, LitElement } from 'lit';
import { query, state } from 'lit/decorators.js';
import '@nl-design-system-community/clippy-components/clippy-button';
import '@nl-design-system-community/clippy-components/clippy-drawer';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import styles from './styles';

const tag = 'wizard-validation-drawer';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardValidationDrawer;
  }
}

/**
 * @element wizard-validation-drawer
 */
@safeCustomElement(tag)
export class WizardValidationDrawer extends LitElement {
  static override readonly styles = [styles];

  @query('clippy-drawer')
  readonly drawerElement!: ClippyDrawer;

  @state() private isDrawerOpen: boolean = false;

  #openDrawer = () => {
    this.drawerElement?.open();
    this.isDrawerOpen = true;
  };

  #onDrawerClose = () => {
    this.isDrawerOpen = false;
  };

  override firstUpdated() {
    this.drawerElement.addEventListener('close', this.#onDrawerClose);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.drawerElement.removeEventListener('close', this.#onDrawerClose);
  }

  override render() {
    return html`
      <clippy-button
        icon-only
        purpose="subtle-inverse"
        .expanded=${this.isDrawerOpen}
        slot="end"
        controls="clippy-mobile-menu-drawer"
        @click=${() => {
          this.#openDrawer();
        }}
      >
        <clippy-icon slot="iconStart">${unsafeSVG(AccessibleIcon)}</clippy-icon>
        Toon toegankelijkheidsmeldingen
      </clippy-button>

      <clippy-drawer actions="none" side="inline-end" id="wizard-validation-drawer">
        <span slot="title">Fouten, waarschuwingen of tips</span>
        <mark>Fouten!</mark>
      </clippy-drawer>
    `;
  }
}
