import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../wizard-dropdown';
import type { DropdownOption } from '../wizard-dropdown';
import styles from './styles';

export type Page<TValue extends string = string> = {
  name: string;
  value: TValue;
};

export type TemplateGroup<TValue extends string = string> = {
  name: string;
  pages: Array<Page<TValue>>;
};

export interface DropdownChangeEvent {
  name: string;
  value: string;
  parent?: string;
}

export const PREVIEW_PICKER_NAME = 'templatePath';

const tag = 'wizard-preview-picker';

declare global {
  interface HTMLElementTagNameMap {
    [tag]: WizardPreviewPicker;
  }
}

@customElement(tag)
export class WizardPreviewPicker extends LitElement {
  @property({
    attribute: 'templates',
    converter: (value) => (value ? JSON.parse(value) : []),
  })
  templates?: TemplateGroup[];
  @property() value?: string;

  #enhanced: boolean = false;

  static override readonly styles = [styles];

  get dropdownOptions(): DropdownOption[] {
    return (
      this.templates?.map((group: TemplateGroup) => ({
        name: group.name,
        detail: group.pages,
        value: group.name,
      })) ?? []
    );
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Hide the submit button when enhanced, the behavior will be handled by a change event.
    // This roundabout way is meant to make the progressive enhancement explicit.
    // When moving to a server-rendered interface this will make more sense.
    this.#enhanced = true;
  }

  readonly #handleChange = (event: Event) => {
    const target = event.currentTarget;
    if (target instanceof HTMLFormElement) {
      target.requestSubmit();
    }
  };

  override render() {
    return html`<form method="GET" id="preview-form" @change=${this.#handleChange}>
      <wizard-dropdown
        label="Weergave"
        name=${PREVIEW_PICKER_NAME}
        .options=${this.dropdownOptions}
        .isOptgroup=${true}
        .value=${this.value}
      ></wizard-dropdown>

      <utrecht-button appearance="primary-action-button" type="submit" ?hidden=${this.#enhanced}>
        Voorvertonen
      </utrecht-button>
    </form>`;
  }
}
