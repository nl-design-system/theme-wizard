import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './styles';

const tag = 'wizard-file-input';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardFileInput;
  }
}

@customElement(tag)
export class WizardFileInput extends LitElement {
  static readonly formAssociated = true;
  static override readonly styles = [styles];

  readonly internals_ = this.attachInternals();

  @property() accept = '';
  @property() name = '';
  @property({ type: Boolean }) required = false;

  get files(): FileList | null {
    return this.shadowRoot?.querySelector('input')?.files ?? null;
  }

  override firstUpdated() {
    const input = this.shadowRoot?.querySelector('input');
    if (input) {
      this.internals_.setValidity(input.validity, input.validationMessage, input);
    }
  }

  readonly #handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.internals_.setFormValue(file);
    this.internals_.setValidity(input.validity, input.validationMessage, input);
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  override click() {
    this.shadowRoot?.querySelector('input')?.click();
  }

  override render() {
    return html` <input type="file" accept=${this.accept} ?required=${this.required} @change=${this.#handleChange} /> `;
  }
}
