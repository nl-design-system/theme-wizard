import type { TemplateGroup, Category } from '@nl-design-system-community/theme-wizard-templates';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../wizard-dropdown';
import type { DropdownOption } from '../wizard-dropdown';
import styles from './styles';

export interface DropdownChangeEvent {
  type: Category;
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
  @property({ attribute: 'templates' }) templates?: TemplateGroup[];
  #enhanced: boolean = false;

  static override readonly styles = [styles];

  get dropdownOptions(): DropdownOption[] {
    return (
      this.templates?.map((group: TemplateGroup) => ({
        name: group.name,
        detail: group.pages,
        value: group.type,
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
    // Determine current selection from URL (?templatePath=...), fallback to first option
    let current = new URL(globalThis.location.href).searchParams.get(PREVIEW_PICKER_NAME) || '';

    if (!current) {
      const firstGroup = this.dropdownOptions?.[0];
      const firstOption = firstGroup?.detail?.[0];
      current = firstOption?.value ?? '';
    }

    return html`<form method="GET" id="preview-form" @change=${this.#handleChange}>
      <wizard-dropdown
        label="Weergave"
        name=${PREVIEW_PICKER_NAME}
        .options=${this.dropdownOptions}
        .isOptgroup=${true}
        .value=${current}
      ></wizard-dropdown>

      <utrecht-button appearance="primary-action-button" type="submit" ?hidden=${this.#enhanced}>
        Voorvertonen
      </utrecht-button>
    </form>`;
  }
}
