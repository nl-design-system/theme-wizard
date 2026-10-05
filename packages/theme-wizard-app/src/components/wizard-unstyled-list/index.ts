import { safeCustomElement } from '@nl-design-system-community/clippy-components/lib/decorators';
import { html, LitElement } from 'lit';
import styles from './styles';

const tag = 'wizard-unstyled-list';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardUnstyledList;
  }
}

/**
 * @slot - The list items (`<li>` elements)
 * @element wizard-unstyled-list
 */
@safeCustomElement(tag)
export class WizardUnstyledList extends LitElement {
  static override readonly styles = [styles];

  override render() {
    return html`
      <ul role="list" class="wizard-unstyled-list">
        <slot></slot>
      </ul>
    `;
  }
}
