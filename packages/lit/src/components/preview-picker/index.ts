import { LitElement, html } from 'lit';
import '../dropdown/index.js';
import { customElement } from 'lit/decorators.js';

type Category = 'template' | 'collage';

type TemplateOption = {
  name: string;
  value: string;
  detail?: {
    name: string;
    value: string;
  };
};

type TemplateGroup = {
  name: string;
  value: string;
  type: Category;
  detail: readonly TemplateOption[];
};

export interface DropdownChangeEvent {
  type: Category;
  name: string;
  value: string;
  parent?: string;
}

export const PREVIEW_PICKER_NAME = 'templatePath';

// TODO: get from outside source
// Placeholder for now
const TEMPLATES: TemplateGroup[] = [
  {
    name: 'Mijn Omgeving',
    detail: [
      { name: 'Overzichtspagina', value: 'overview' },
      { name: 'Berichten', value: 'messages' },
      { name: 'Taken', value: 'tasks' },
      {
        name: 'Mijn Zaken',
        detail: { name: 'Detailpagina', value: 'my-cases-detail' },
        value: 'my-cases',
      },
    ],
    type: 'template',
    value: 'my-environment',
  },
  {
    name: 'Meerstappenformulier',
    detail: [
      { name: '1 - Intro', value: 'step-1' },
      { name: '2 - Uw Vraag', value: 'step-2' },
      { name: '3 - Login', value: 'step-3' },
      { name: '4 - Stap 2', value: 'step-4' },
      { name: '5 - Stap 3', value: 'step-5' },
      { name: '6 - Succes', value: 'step-6' },
    ],
    type: 'template',
    value: 'multi-step-form',
  },
  {
    name: 'Voorvertoning losse componenten',
    detail: [
      { name: 'Collage 1', value: 'collage-1' },
      { name: 'Collage 2', value: 'collage-2' },
    ],
    type: 'collage',
    value: 'preview-components',
  },
];

@customElement('preview-picker')
export class PreviewPicker extends LitElement {
  override render() {
    const dropdownOptions = TEMPLATES.map((group) => ({
      name: group.name,
      detail: group.detail.map((opt) => ({
        name: opt.detail?.name ?? opt.name,
        value: `/${group.value}/${opt.detail?.value ?? opt.value}`,
      })),
      value: group.value,
    }));

    // Determine current selection from URL (?templates=...), fallback to first option
    let current = new URL(globalThis.location.href).searchParams.get(PREVIEW_PICKER_NAME) || '';

    if (!current) {
      const firstGroup = dropdownOptions[0];
      const firstDetail = firstGroup.detail[0];
      current = firstDetail.value;
    }

    return html`<form method="GET" id="preview-form">
      <wiz-dropdown
        name=${PREVIEW_PICKER_NAME}
        label="Voorvertoning"
        .options=${dropdownOptions}
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
