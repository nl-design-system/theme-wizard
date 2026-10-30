import { safeCustomElement } from '@nl-design-system-community/clippy-components/src/lib/decorators/index.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-form-colorscale';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardFormColorscale;
  }
}

@safeCustomElement(tag)
export class WizardFormColorscale extends LitElement {
  static override readonly styles = [styles];

  @property({ type: String })
  path: string = '';

  override render() {
    return html`
      <form method="POST">
        <mark>Wizard form colorscale: ${this.path}</mark>
      </form>
    `;
  }
}
