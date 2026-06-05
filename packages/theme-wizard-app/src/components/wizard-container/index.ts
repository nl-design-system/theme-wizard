import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-container';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardContainer;
  }
}

type ContainerWidth = 'default' | 'page' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

@customElement(tag)
export class WizardContainer extends LitElement {
  static override readonly styles = [styles];

  @property({ reflect: true, type: String }) size: ContainerWidth = 'default';

  override render() {
    return html`<slot></slot>`;
  }
}
