import type { TemplateGroup, Category } from '@nl-design-system-community/templates';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../dropdown/index.js';
import type { DropdownOption } from '../dropdown';

export interface DropdownChangeEvent {
  type: Category;
  name: string;
  value: string;
  parent?: string;
}

export const PREVIEW_PICKER_NAME = 'templatePath';

@customElement('preview-picker')
export class PreviewPicker extends LitElement {
  @property({ attribute: 'templates' }) templates?: TemplateGroup[];

  get dropdownOptions(): DropdownOption[] {
    return (
      this.templates?.map((group: TemplateGroup) => ({
        name: group.name,
        detail: group.pages,
        value: group.type,
      })) ?? []
    );
  }

  override render() {
    // Determine current selection from URL (?templatePath=...), fallback to first option
    let current = new URL(globalThis.location.href).searchParams.get(PREVIEW_PICKER_NAME) || '';

    if (!current) {
      const firstGroup = this.dropdownOptions?.[0];
      const firstOption = firstGroup?.detail?.[0];
      current = firstOption?.value ?? '';
    }

    return html`<form method="GET" id="preview-form">
      <wiz-dropdown
        name=${PREVIEW_PICKER_NAME}
        label="Voorvertoning"
        .options=${this.dropdownOptions}
        .isOptgroup=${true}
        .value=${current}
      ></wiz-dropdown>

      <utrecht-button appearance="primary-action-button" type="submit">Voorvertonen</utrecht-button>
    </form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'preview-picker': PreviewPicker;
  }
}
