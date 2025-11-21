import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../wizard-dropdown';
import { Token } from '../wizard-token-input';

const tag = 'wizard-ref-select';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardRefSelect;
  }
}

@customElement(tag)
export class WizardRefSelect extends LitElement {
  @property() label = '';
  @property() name = '';
  @property() value: string = '';
  @property() options: Token[] = [];
  internals_ = this.attachInternals();

  static formAssociated = true;

  readonly #handleChange = () => {};

  override render() {
    return html`<label for=${this.id}>${this.label}</label>
      <wizard-dropdown
        id=${this.id}
        name=${this.name}
        .value=${this.value}
        .options=${this.options?.map((token) => ({ name: token, value: token }))}
        @change=${this.#handleChange}
      ></wizard-dropdown>`;
  }
}
