import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class FormElement<V = unknown> extends LitElement {
  @property() name = '';
  @property({ attribute: 'hidden-label' }) hiddenLabel = '';
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  internals_ = this.attachInternals();
  #value: V | null = null;

  static readonly formAssociated = true;

  get form() {
    return this.internals_.form;
  }

  @property()
  set value(value: V | null) {
    if (this.#value !== value) {
      this.#value = value;
      this.internals_.setFormValue(this.valueToFormValue(value));
    }
  }

  get value(): V | null {
    return this.#value;
  }

  /**
   * Override this function to customize how the value is converted to a form value;
   */
  valueToFormValue(value: V | null): string | File | null {
    switch (true) {
      /* eslint-disable eqeqeq -- loose equality will also return null for undefined */
      case value == null:
        return null;
      case typeof value === 'string' || value instanceof File:
        return value as string | File;
      case typeof value === 'object':
        try {
          return JSON.stringify(value);
        } catch {
          return null;
        }
      default:
        return String(value);
    }
  }
}
